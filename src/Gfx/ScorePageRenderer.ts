
import { Math } from '../java/lang/Math';
import { ScoreRenderer } from './ScoreRenderer';
import { VoiceGfxInfo } from './ScoreRenderer';
import { RenderedStaffSystem } from './RenderedStaffSystem';
import { RenderedSectionParams } from './RenderedSectionParams';
import { RenderedScorePage } from './RenderedScorePage';
import { RenderedEvent } from './RenderedEvent';
import { RenderedClefSet } from './RenderedClefSet';
import { OptionSet } from './OptionSet';
import { MeasureInfo } from './MeasureInfo';
import { EventStringImg } from './EventStringImg';
import { ArrayList } from '../java/util/ArrayList';
import { Dimension } from '../java/awt/Dimension';
import { Font } from '../java/awt/Font';
import { FontMetrics } from '../java/awt/FontMetrics';
import { PieceData } from '../DataStruct/PieceData';
import { Voice } from '../DataStruct/Voice';

export class ScorePageRenderer
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	static STAFFSCALE:number;
	static CANVASYSCALE:number;
	/* amount of vertical space per staff */
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	options:OptionSet;
	canvasSize:Dimension;
	numVoices:number;
	public musicData:PieceData;
	public scoreData:ScoreRenderer[];
	public systemsPerPage:number;
	public systems:ArrayList<RenderedStaffSystem>;
	public pages:ArrayList<RenderedScorePage>;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: ScorePageRenderer(PieceData p,OptionSet o,Dimension d,
                               int STAFFSCALE,int CANVASYSCALE)
Purpose:     Initialize renderer
Parameters:
  Input:  PieceData p                 - music data
          OptionSet o                 - display options
          Dimension d                 - size of drawing block
          int STAFFSCALE,CANVASYSCALE - drawing space parameters
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(p:PieceData,o:OptionSet,d:Dimension,STAFFSCALE:number,CANVASYSCALE:number)
	{
		ScorePageRenderer.STAFFSCALE = STAFFSCALE;
		ScorePageRenderer.CANVASYSCALE = CANVASYSCALE;
		this.musicData = p;
		this.options = o;
		this.canvasSize = d;
		this.numVoices = this.musicData.getVoiceData().length;
		let sectionParams:RenderedSectionParams[]= Array(this.numVoices);
		for(
		let i:number = 0;i < this.numVoices;i ++)
		sectionParams[i]= RenderedSectionParams.new0();
		let numSections:number = this.musicData.getNumSections();
		let numMeasures:number = 0;
		let startX:number = 0;
		this.scoreData = Array(numSections);
		for(
		let i:number = 0;i < numSections;i ++)
		{
			this.scoreData[i]= new ScoreRenderer(i,this.musicData.getSection(i),this.musicData,sectionParams,this.options,numMeasures,startX);
			sectionParams = this.scoreData[i].getEndingParams();
			numMeasures += this.scoreData[i].getNumMeasures();
			startX += this.scoreData[i].getXsize();
		}
		this.renderPages(this.scoreData);
	}
	/* initialize voice parameters */
	/* render, first into continuous score, then into page structure */
	/*------------------------------------------------------------------------
Method:  void renderPages(ScoreRenderer[] scoreData)
Purpose: Render scored music into page-layout structure
Parameters:
  Input:  ScoreRenderer[] scoreData - rendered event/measure info
  Output: -
  Return: -
------------------------------------------------------------------------*/
	curPage:RenderedScorePage;

	renderPages(scoreData:ScoreRenderer[]):void
	{
		this.systems = new ArrayList<RenderedStaffSystem>();
		this.pages = new ArrayList<RenderedScorePage>();
		let numSystems:number = 0;
		this.curPage = new RenderedScorePage(numSystems,0);
		for(let rs of scoreData)
		{
			numSystems += this.renderSection(rs,numSystems);
		}
		this.pages.add(this.curPage);
	}

	/* initialize parameters */
	//    int spacePerSystem=(int)(((double)numVoices+.5)*CANVASYSCALE);
	//    systemsPerPage=canvasSize.height/spacePerSystem;
	calcSystemSpace(numv:number):number
	{
		return<number>((((<number> numv + 0.5) * ScorePageRenderer.CANVASYSCALE) | 0));
	}

	/* new page? */
	checkAndAddPage(spacePerSystem:number,curSystemNum:number):void
	{
		if((( this.curPage.ySpace + spacePerSystem) | 0) > this.canvasSize.height)
			{
				this.pages.add(this.curPage);
				this.curPage = new RenderedScorePage(curSystemNum,0);
			}

	}

	renderSection(curSection:ScoreRenderer,startSystemNum:number):number
	{
		let displayVoiceNames:boolean = startSystemNum == 0 || curSection.newVoiceArrangement();
		let curMeasure:MeasureInfo;
		let leftInfoSize:number = this.calcLeftInfoSize(curSection.getFirstMeasureNum());
		let systemStartx:number = leftInfoSize +( displayVoiceNames ? this.calcVoiceNamesIndent():0);
		let curx:number = systemStartx;
		let leftx:number = 0;
		let curSystemNum:number = startSystemNum;
		let numSectionVoices:number = curSection.getSectionData().getNumVoicesUsed();
		let spacePerSystem:number = this.calcSystemSpace(numSectionVoices);
		let curSystem:RenderedStaffSystem = new RenderedStaffSystem(curSection.getFirstMeasureNum(),displayVoiceNames ?<number>( systemStartx - leftInfoSize):0,(( this.canvasSize.width - 1) | 0),0,numSectionVoices,displayVoiceNames);
		this.checkAndAddPage(spacePerSystem,curSystemNum);
		for(
		let m:number = 0;m < curSection.measures.size();m ++)
		{
			curMeasure = curSection.measures.get(m);
			if( m > 0 && curx + curMeasure.xlength > this.canvasSize.width)
				{
					curSystem.endMeasure =(((( m - 1) | 0) + curSection.getFirstMeasureNum()) | 0);
					curSystem.spacingCoefficient =((((( curSystem.rightX - systemStartx - 4) | 0)) /( curx - systemStartx)) | 0);
					this.systems.add(curSystem);
					this.curPage.ySpace += spacePerSystem;
					this.curPage.numStaves += numSectionVoices;
					this.curPage.numSystems ++;
					curSystemNum ++;
					curSystem = new RenderedStaffSystem((( m + curSection.getFirstMeasureNum()) | 0),0,(( this.canvasSize.width - 1) | 0),this.curPage.ySpace,numSectionVoices,false);
					curx =( systemStartx = this.calcLeftInfoSize((( m + curSection.getFirstMeasureNum()) | 0)));
					leftx = curMeasure.leftx;
					this.checkAndAddPage(spacePerSystem,curSystemNum);
				}

			curx += curMeasure.xlength;
			curSection.adjustMeasureEventPositions(m,0 - leftx);
		}
		curSystem.endMeasure =(((( curSection.measures.size() - 1) | 0) + curSection.getFirstMeasureNum()) | 0);
		curSystem.rightX =<number> curx;
		this.systems.add(curSystem);
		this.curPage.ySpace += spacePerSystem;
		this.curPage.numStaves += numSectionVoices;
		this.curPage.numSystems ++;
		return(((( curSystemNum - startSystemNum) | 0) + 1) | 0);
	}

	/* add measures to page layout one at a time, adding systems and pages
       when necessary */
	//curSection.getNumVoices(),
	/* finish current system */
	//System.out.println("system "+curSystemNum+" co="+curSystem.spacingCoefficient);
	//System.out.println(" startx="+systemStartx+" rightx="+curSystem.rightX+" curx="+curx);
	/* new system */
	/*------------------------------------------------------------------------
Method:  int calcVoiceNamesIndent()
Purpose: Calculate amount of space taken by voice names before first system
Parameters:
  Input:  -
  Output: -
  Return: x-space required by voice names+space before first system
------------------------------------------------------------------------*/
	calcVoiceNamesIndent():number
	{
		let tmpFont:Font = new Font(null,Font.PLAIN,15);
		EventStringImg.genericG.setFont(tmpFont);
		let metrics:FontMetrics = EventStringImg.genericG.getFontMetrics();
		let maxSize:number = 0;
		let curSize:number;
		for(let v of this.musicData.getVoiceData())
		{
			curSize = metrics.stringWidth(v.getStaffTitle());
			if( curSize > maxSize)
				maxSize = curSize;

		}
		return(( maxSize + 10) | 0);
	}

	/*------------------------------------------------------------------------
Method:  int calcLeftInfoSize(int mnum)
Purpose: Calculate amount of space taken by clef info (+possibly mensuration
         info) if the current measure is at a system start
Parameters:
  Input:  int mnum                - measure number
  Output: -
  Return: x-space required by clef/signature for all voices
------------------------------------------------------------------------*/
	public calcLeftInfoSize(mnum:number):number
	{
		if( mnum == 0)
			return 0;

		let renderedSection:ScoreRenderer = this.scoreData[ScoreRenderer.calcRendererNum(this.scoreData,mnum)];
		let leftMeasure:MeasureInfo = renderedSection.measures.getMeasure((( mnum - renderedSection.getFirstMeasureNum()) | 0));
		let xloc:number;
		let maxx:number = 0;
		for(
		let i:number = 0;i < this.numVoices;i ++)
		if( renderedSection.eventinfo[i]!= null)
			{
				xloc = 0;
				if( ! leftMeasure.beginsWithClef(i))
					{
						let leftCS:RenderedClefSet = renderedSection.eventinfo[i].getClefEvents(leftMeasure.reventindex[i]);
						if( leftCS != null)
							xloc += leftCS.getXSize();

					}

				else
					{
						let re:RenderedEvent = renderedSection.eventinfo[i].getEvent(leftMeasure.lastBeginClefIndex[i]);
						xloc = re.getxend() - leftMeasure.leftx;
					}

				if( xloc > maxx)
					maxx = xloc;

			}

		return Math.round(<number> maxx + 5);
	}

	getLastEventInMeasure(sysNum:number,rendererNum:number,vnum:number,mnum:number):number
	{
		let renderer:ScoreRenderer = this.scoreData[rendererNum];
		if( mnum < renderer.getLastMeasureNum())
			return(( renderer.getMeasure((( mnum + 1) | 0)).reventindex[vnum]- 1) | 0);
		else
			return(( renderer.eventinfo[vnum].size() - 1) | 0);

	}
}
