
import { Integer } from '../java/lang/Integer';
import { ZoomControl } from './ZoomControl';
import { ViewCanvas } from './ViewCanvas';
import { ScoreRenderer } from './ScoreRenderer';
import { VoiceGfxInfo } from './ScoreRenderer';
import { ScorePageRenderer } from './ScorePageRenderer';
import { RenderedStaffSystem } from './RenderedStaffSystem';
import { RenderedScorePage } from './RenderedScorePage';
import { RenderedLigature } from './RenderedLigature';
import { RenderedEvent } from './RenderedEvent';
import { RenderedClefSet } from './RenderedClefSet';
import { OptionSet } from './OptionSet';
import { NoteShapeStyleListener } from './MusicWin';
import { BarlineStyleListener } from './MusicWin';
import { ViewSizeListener } from './MusicWin';
import { PDFFileFilter } from './MusicWin';
import { HTMLFileFilter } from './MusicWin';
import { XMLFileFilter } from './MusicWin';
import { MIDIFileFilter } from './MusicWin';
import { CMMEFileFilter } from './MusicWin';
import { MusicWin } from './MusicWin';
import { MusicFont } from './MusicFont';
import { MeasureInfo } from './MeasureInfo';
import { JPanel } from '../javax/swing/JPanel';
import { BoxLayout } from '../javax/swing/BoxLayout';
import { JSpinner } from '../javax/swing/JSpinner';
import { JFrame } from '../javax/swing/JFrame';
import { JComponent } from '../javax/swing/JComponent';
import { JScrollPane } from '../javax/swing/JScrollPane';
import { JLabel } from '../javax/swing/JLabel';
import { JToolBar } from '../javax/swing/JToolBar';
import { SpinnerNumberModel } from '../javax/swing/SpinnerNumberModel';
import { ChangeListener } from '../javax/swing/event/ChangeListener';
//import java.awt.*;
//import java.awt.event.*;
import { ChangeEvent } from '../javax/swing/event/ChangeEvent';
import { ActionListener } from '../java/awt/event/ActionListener';
import { WindowAdapter } from '../java/awt/event/WindowAdapter';
import { WindowListener } from '../java/awt/event/WindowListener';
import { WindowEvent } from '../java/awt/event/WindowEvent';
import { Color } from '../java/awt/Color';
import { Container } from '../java/awt/Container';
import { Dimension } from '../java/awt/Dimension';
import { Font } from '../java/awt/Font';
import { Graphics } from '../java/awt/Graphics';
import { Graphics2D } from '../java/awt/Graphics2D';
import { GridBagConstraints } from '../java/awt/GridBagConstraints';
import { GridBagLayout } from '../java/awt/GridBagLayout';
import { Toolkit } from '../java/awt/Toolkit';
import { ActionEvent } from '../java/awt/event/ActionEvent';
import { BufferedImage } from '../java/awt/image/BufferedImage';
import { Component } from '../java/awt/Component';
import { Clef } from '../DataStruct/Clef';
import { Event } from '../DataStruct/Event';
import { ModernKeySignature } from '../DataStruct/ModernKeySignature';
import { MusicSection } from '../DataStruct/MusicSection';
import { PieceData } from '../DataStruct/PieceData';

export class ScorePageCanvas extends JComponent
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	/* standard page size parameters */
	public static A4SIZEX:number = 210;
	public static A4SIZEY:number = 297;
	public static A4SCALEX:number = ScorePageCanvas.A4SIZEX / ScorePageCanvas.A4SIZEY;
	public static STAVESPERPAGE:number = 14;
	/* including space between systems */
	public static STAFFSCALE:number = 10;
	public static STAFFPOSSCALE:number =(( ScorePageCanvas.STAFFSCALE / 2) | 0);
	public static CANVASYSCALE:number =(( ScorePageCanvas.STAFFSCALE * 10) | 0);
	/* amount of vertical space per staff */
	public static XMARGIN:number = 134;
	public static YMARGIN:number = 100;
	/* margins of drawing space */
	public static YSTAFFSTART:number =(( ScorePageCanvas.YMARGIN +(( ScorePageCanvas.STAFFSCALE * 7) | 0)) | 0);
	/* top margin for staff drawing */
	public static DRAWINGSPACEY:number =(( ScorePageCanvas.CANVASYSCALE * ScorePageCanvas.STAVESPERPAGE) | 0);
	public static CANVASYSIZE:number =(((( ScorePageCanvas.YSTAFFSTART + ScorePageCanvas.YMARGIN) | 0) + ScorePageCanvas.DRAWINGSPACEY) | 0);
	public static CANVASXSIZE:number =<number>( ScorePageCanvas.CANVASYSIZE * ScorePageCanvas.A4SCALEX);
	public static STAFFXSIZE:number =(( ScorePageCanvas.CANVASXSIZE -(( ScorePageCanvas.XMARGIN * 2) | 0)) | 0);
	public static MAXDISPLAYPORTION:number = 0.8;
	static normalFont:Font = new Font(null,Font.PLAIN,12);
	static snameFont:Font = new Font(null,Font.PLAIN,15);
	static titleFont:Font = new Font("Serif",Font.PLAIN,24);
	static subTitleFont:Font = new Font("Serif",Font.PLAIN,20);
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	/* music rendering data */
	musicData:PieceData;
	renderedPages:ScorePageRenderer;
	musicOptions:OptionSet;
	numVoices:number;
	curPageNum:number;
	VIEWSCALE:number;
	useModernAccSystem:boolean;
	/* graphics data */
	canvas:BufferedImage;
	scaledCanvas:BufferedImage;
	/* normal canvas, and scaled display
                                        canvas - drawing directly onto scaled
                                        Graphics2D yields poor results */
	canvasg2d:Graphics2D;
	scaledCanvasg2d:Graphics2D;
	canvasSize:Dimension;
	musicGfx:MusicFont;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: ScorePageCanvas(PieceData musicData,ScorePageRenderer rp,MusicFont mf,MusicWin mw)
Purpose:     Initialize canvas and render music
Parameters:
  Input:  PieceData musicData  - event data for all voices
          ScorePageRenderer rp - rendered event data
          MusicFont mf         - music symbols for drawing
          MusicWin mw          - parent window
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(musicData:PieceData,rp:ScorePageRenderer,mf:MusicFont,mw:MusicWin)
	{
		super();
		this.musicData = musicData;
		this.musicOptions = mw.optSet;
		this.renderedPages = rp;
		this.curPageNum = 0;
		this.numVoices = musicData.getVoiceData().length;
		this.useModernAccSystem = this.musicOptions.getUseModernAccidentalSystem();
		this.canvasSize = new Dimension(ScorePageCanvas.CANVASXSIZE,ScorePageCanvas.CANVASYSIZE);
		this.canvas = new BufferedImage(this.canvasSize.width,this.canvasSize.height,BufferedImage.TYPE_INT_ARGB);
		this.canvasg2d = this.canvas.createGraphics();
		this.musicGfx = mf;
		this.VIEWSCALE = this.musicOptions.getVIEWSCALE();
		this.scaledCanvas = new BufferedImage(<number>( this.canvasSize.width * this.VIEWSCALE),<number>( this.canvasSize.height * this.VIEWSCALE),BufferedImage.TYPE_INT_ARGB);
		this.scaledCanvasg2d = this.scaledCanvas.createGraphics();
		this.scaledCanvasg2d.scale(this.VIEWSCALE,this.VIEWSCALE);
		this.drawPage();
		this.setPreferredSize(new Dimension(<number>( this.canvasSize.width * this.VIEWSCALE),<number>( this.canvasSize.height * this.VIEWSCALE)));
	}

	/* render data into page/system structure */
	/* create drawing canvas */
	/* created scaled display canvas */
	//  if (VIEWSCALE!=1) //CHANGE
	//  scaledCanvasg2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION,RenderingHints.VALUE_INTERPOLATION_BICUBIC);
	/*------------------------------------------------------------------------
Method:  void setPage(int newPageNum)
Purpose: Change currently displayed page
Parameters:
  Input:  int newPageNum - number of new page to display
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setPage(newPageNum:number):void
	{
		if( newPageNum == this.curPageNum)
			return;

		this.curPageNum = newPageNum;
		this.drawPage();
		this.repaint();
	}

	/*------------------------------------------------------------------------
Method:  void setScale(int newScale)
Purpose: Change currently display scale
Parameters:
  Input:  int newScale - new scale * 100
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setScale(newScale:number):void
	{
		let newVS:number =(<number> newScale) / 100;
		if( this.canvasSize.width * newVS > this.scaledCanvas.getWidth() || this.canvasSize.height * newVS > this.scaledCanvas.getHeight())
			{
				this.scaledCanvas = new BufferedImage(((<number>( this.canvasSize.width * newVS) + 1) | 0),((<number>( this.canvasSize.height * newVS) + 1) | 0),BufferedImage.TYPE_INT_ARGB);
				this.scaledCanvasg2d = this.scaledCanvas.createGraphics();
			}

		else
			this.scaledCanvasg2d.scale(1 / this.VIEWSCALE,1 / this.VIEWSCALE);

		this.VIEWSCALE = newVS;
		this.scaledCanvasg2d.scale(this.VIEWSCALE,this.VIEWSCALE);
		this.setPreferredSize(new Dimension(<number>( this.canvasSize.width * this.VIEWSCALE),<number>( this.canvasSize.height * this.VIEWSCALE)));
		this.revalidate();
		this.drawPage();
		this.repaint();
	}

	/* if scaledCanvas isn't big enough, resize */
	/* cancel current scaling */
	// if (VIEWSCALE!=1) //CHANGE
	// scaledCanvasg2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION,RenderingHints.VALUE_INTERPOLATION_BICUBIC);
	/*------------------------------------------------------------------------
Method:  void drawPage()
Purpose: Draw music onto canvases
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawPage():void
	{
		this.canvasg2d.setColor(Color.white);
		this.canvasg2d.fillRect(0,0,(( this.canvasSize.width + 1) | 0),(( this.canvasSize.height + 1) | 0));
		this.canvasg2d.setColor(Color.black);
		if( this.curPageNum == 0)
			{
				this.canvasg2d.setFont(ScorePageCanvas.titleFont);
				this.drawCenteredString(this.canvasg2d,this.musicData.getComposer() + ": " + this.musicData.getTitle(),this.canvasSize.width,ScorePageCanvas.YMARGIN);
				if( this.musicData.getSectionTitle() != null)
					{
						let yadd:number = this.canvasg2d.getFontMetrics().getHeight();
						this.canvasg2d.setFont(ScorePageCanvas.subTitleFont);
						this.drawCenteredString(this.canvasg2d,this.musicData.getSectionTitle(),this.canvasSize.width,(( ScorePageCanvas.YMARGIN + yadd) | 0));
					}

				this.canvasg2d.setFont(ScorePageCanvas.normalFont);
			}

		else
			{
				this.canvasg2d.setFont(ScorePageCanvas.normalFont);
				let smallTitle:string = this.musicData.getComposer() + ": " + this.musicData.getTitle();
				if( this.musicData.getSectionTitle() != null)
					smallTitle += " (" + this.musicData.getSectionTitle() + ")";

				this.canvasg2d.drawString(smallTitle,ScorePageCanvas.XMARGIN,ScorePageCanvas.YMARGIN);
			}

		if( this.curPageNum > 0)
			this.drawRightString(this.canvasg2d,`${this.curPageNum + 1}`,(( this.canvasSize.width - ScorePageCanvas.XMARGIN) | 0),ScorePageCanvas.YMARGIN);

		let curPage:RenderedScorePage = this.renderedPages.pages.get(this.curPageNum);
		let startSys:number = curPage.startSystem;
		let endSys:number =(((( startSys + curPage.numSystems) | 0) - 1) | 0);
		if( endSys >= this.renderedPages.systems.size())
			endSys =(( this.renderedPages.systems.size() - 1) | 0);

		let spaceBetweenSystems:number = curPage.numSystems <= 1 ? 0:((((( ScorePageCanvas.DRAWINGSPACEY -(( curPage.numStaves * ScorePageCanvas.CANVASYSCALE) | 0)) | 0)) /((( curPage.numSystems -( this.curPageNum == 0 ? 0:1)) | 0))) | 0);
		if( curPage.numSystems < 3)
			spaceBetweenSystems =<number>((( spaceBetweenSystems / 2) | 0));

		let curY:number =(( ScorePageCanvas.YSTAFFSTART +( this.curPageNum == 0 ? spaceBetweenSystems:0)) | 0);
		for(
		let curSys:number = startSys;curSys <= endSys;curSys ++)
		{
			this.drawSystem(curSys,curY);
			curY +=(((( this.renderedPages.systems.get(curSys).numVoices * ScorePageCanvas.CANVASYSCALE) | 0) + spaceBetweenSystems) | 0);
		}
		this.scaledCanvasg2d.setColor(Color.white);
		this.scaledCanvasg2d.fillRect(0,0,((<number>( this.canvasSize.width / this.VIEWSCALE) + 1) | 0),((<number>( this.canvasSize.height / this.VIEWSCALE) + 1) | 0));
		this.scaledCanvasg2d.drawImage(this.canvas,0,0,this);
	}

	/* draw onto main canvas */
	/* header */
	/* music */
	/* now scale with acceptable interpolation results by copying onto
       scaled canvas */
	/*------------------------------------------------------------------------
Method:  void drawSystem(int sysNum,int starty)
Purpose: Draw music of one system
Parameters:
  Input:  int sysNum - index of system to draw
          int starty - starting y position
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawSystem(sysNum:number,starty:number):void
	{
		let curSystem:RenderedStaffSystem = this.renderedPages.systems.get(sysNum);
		let clefInfoSize:number = this.renderedPages.calcLeftInfoSize(curSystem.startMeasure);
		let rendererNum:number = ScoreRenderer.calcRendererNum(this.renderedPages.scoreData,curSystem.startMeasure);
		let curRenderer:ScoreRenderer = this.renderedPages.scoreData[rendererNum];
		let leftMeasure:MeasureInfo = curRenderer.getMeasure(curSystem.startMeasure);
		this.canvasg2d.setColor(Color.black);
		this.canvasg2d.drawLine((( ScorePageCanvas.XMARGIN + curSystem.leftX) | 0),starty,(( ScorePageCanvas.XMARGIN + curSystem.leftX) | 0),(((( starty +((((( curSystem.numVoices - 1) | 0)) * ScorePageCanvas.CANVASYSCALE) | 0)) | 0) +(( 4 * ScorePageCanvas.STAFFSCALE) | 0)) | 0));
		this.drawSystemBarlines(this.canvasg2d,(((( ScorePageCanvas.XMARGIN + curSystem.leftX) | 0) + clefInfoSize) | 0),starty,curSystem);
		let cury:number = starty;
		for(
		let v:number = 0;v < this.numVoices;v ++)
		if( curRenderer.eventinfo[v]!= null)
			{
				if( curSystem.displayVoiceNames)
					{
						this.canvasg2d.setFont(ScorePageCanvas.snameFont);
						this.drawRightString(this.canvasg2d,this.musicData.getVoiceData()[v].getStaffTitle(),(((( ScorePageCanvas.XMARGIN + curSystem.leftX) | 0) - 10) | 0),(( cury +(( ScorePageCanvas.STAFFPOSSCALE * 5) | 0)) | 0));
					}

				this.drawStaff_3(this.canvasg2d,cury,5,curSystem.leftX,curSystem.rightX);
				let VclefInfoSize:number = clefInfoSize;
				if( ! leftMeasure.beginsWithClef(v) &&( curRenderer.getStartingParams()[v].clefSet != null || curSystem.startMeasure > curRenderer.getFirstMeasureNum()))
					this.drawClefInfo(this.canvasg2d,curRenderer,leftMeasure,v,(( ScorePageCanvas.XMARGIN + curSystem.leftX) | 0),cury);
				else
					VclefInfoSize = 0;

				let leftei:number = curRenderer.getMeasure(curSystem.startMeasure).reventindex[v];
				let rightei:number;
				if( sysNum <(( this.renderedPages.systems.size() - 1) | 0) && curSystem.endMeasure < curRenderer.getLastMeasureNum())
					rightei =(( curRenderer.getMeasure((( curSystem.endMeasure + 1) | 0)).reventindex[v]- 1) | 0);
				else
					rightei =(( curRenderer.eventinfo[v].size() - 1) | 0);

				let re:RenderedEvent = null;
				let ligInfo:RenderedLigature = null;
				let tieInfo:RenderedLigature = null;
				for(
				let ei:number = leftei;ei <= rightei;ei ++)
				{
					re = curRenderer.eventinfo[v].getEvent(ei);
					let xloc:number = this.calcXLoc(curSystem,VclefInfoSize,re);
					if( ei == 0 && sysNum == 0)
						xloc =<number>((( ScorePageCanvas.XMARGIN + curSystem.leftX) | 0));

					if( re.isdisplayed())
						re.draw_1(this.canvasg2d,this.musicGfx,this,xloc,cury);

					ligInfo = re.getLigInfo();
					if( re.isligend() && this.musicData.getSection(rendererNum).getSectionType() == MusicSection.MENSURAL_MUSIC)
						{
							let ligLeftX:number = ligInfo.firstEventNum < leftei ?(( ScorePageCanvas.XMARGIN - 1) | 0):<number>((((((((( ScorePageCanvas.XMARGIN + curSystem.leftX) | 0) + clefInfoSize) | 0) + 4) | 0) + curRenderer.eventinfo[v].getEvent(ligInfo.firstEventNum).getxloc() * curSystem.spacingCoefficient) | 0));
							this.drawLigature_2(this.canvasg2d,ligLeftX,xloc,(( cury + this.calcLigY(v,re)) | 0),(( ScorePageCanvas.XMARGIN + clefInfoSize) | 0),(( ScorePageCanvas.XMARGIN + ScorePageCanvas.STAFFXSIZE) | 0));
						}

					tieInfo = re.getTieInfo();
					if( tieInfo.firstEventNum != - 1)
						{
							let tre1:RenderedEvent = curRenderer.eventinfo[v].getEvent(tieInfo.firstEventNum);
							let tieLeftX:number = tieInfo.firstEventNum < leftei ?(( ScorePageCanvas.XMARGIN - 1) | 0):<number>((((((((( ScorePageCanvas.XMARGIN + curSystem.leftX) | 0) + VclefInfoSize) | 0) + 4) | 0) + curRenderer.eventinfo[v].getEvent(tieInfo.firstEventNum).getxloc() * curSystem.spacingCoefficient) | 0));
							this.drawTie_2(this.canvasg2d,tre1.getTieType(),tieLeftX,xloc,(( cury + this.calcTieY_3(v,re)) | 0),(( ScorePageCanvas.XMARGIN + VclefInfoSize) | 0),(( ScorePageCanvas.XMARGIN + ScorePageCanvas.STAFFXSIZE) | 0));
						}

					if( ei == leftMeasure.lastBeginClefIndex[v]&& ei < rightei)
						{
							let nextX:number =(((( this.calcXLoc(curSystem,VclefInfoSize,curRenderer.eventinfo[v].getEvent((( ei + 1) | 0))) - ScorePageCanvas.XMARGIN) | 0) - curSystem.leftX) | 0);
							if( clefInfoSize > nextX)
								VclefInfoSize = clefInfoSize;

						}

				}
				ligInfo = re == null ? null:re.getLigInfo();
				if( ligInfo != null && ! re.isligend() && ligInfo.firstEventNum != - 1)
					{
						let ligLeftX:number = ligInfo.firstEventNum < leftei ?(( ScorePageCanvas.XMARGIN - 1) | 0):<number>((((((((( ScorePageCanvas.XMARGIN + curSystem.leftX) | 0) + VclefInfoSize) | 0) + 4) | 0) + curRenderer.eventinfo[v].getEvent(ligInfo.firstEventNum).getxloc() * curSystem.spacingCoefficient) | 0));
						this.drawLigature_2(this.canvasg2d,ligLeftX,(( ScorePageCanvas.XMARGIN + ScorePageCanvas.STAFFXSIZE) | 0),(( cury + this.calcLigY(v,re)) | 0),(( ScorePageCanvas.XMARGIN + clefInfoSize) | 0),(( ScorePageCanvas.XMARGIN + ScorePageCanvas.STAFFXSIZE) | 0));
					}

				tieInfo = re == null ? null:re.getTieInfo();
				if( tieInfo != null && tieInfo.firstEventNum != - 1 &&( tieInfo.lastEventNum != rightei || re.doubleTied()))
					{
						let tre1:RenderedEvent = re.doubleTied() ? re:curRenderer.eventinfo[v].getEvent(tieInfo.firstEventNum);
						let firstEventNum:number = re.doubleTied() ? rightei:tieInfo.firstEventNum;
						let tieLeftX:number = firstEventNum < leftei ?(( ScorePageCanvas.XMARGIN - 1) | 0):<number>((((((((( ScorePageCanvas.XMARGIN + curSystem.leftX) | 0) + VclefInfoSize) | 0) + 4) | 0) + tre1.getxloc() * curSystem.spacingCoefficient) | 0));
						this.drawTie_2(this.canvasg2d,tre1.getTieType(),tieLeftX,(( ScorePageCanvas.XMARGIN + ScorePageCanvas.STAFFXSIZE) | 0),(( cury + this.calcTieY_3(v,re)) | 0),(( ScorePageCanvas.XMARGIN + clefInfoSize) | 0),(( ScorePageCanvas.XMARGIN + ScorePageCanvas.STAFFXSIZE) | 0));
					}

				cury += ScorePageCanvas.CANVASYSCALE;
			}

	}

	/* calculate which events go on each staff */
	/* true if NOT the final system in a section */
	/* now draw events */
	/* tmp clef BS for very first system */
	/* draw ligatures */
	/* tie notes */
	// && tieInfo.lastEventNum==ei)
	//            if (tieInfo.firstEventNum!=-1 && tieInfo.lastEventNum==ei)
	/* some more clef spacing adjustment, for staves beginning with new clefs */
	//-nextX;
	/* finish any unclosed ligature */
	/* finish any unclosed tie */
	calcXLoc(curSystem:RenderedStaffSystem,VclefInfoSize:number,re:RenderedEvent):number
	{
		return<number>((((((( ScorePageCanvas.XMARGIN + curSystem.leftX) | 0) + VclefInfoSize) | 0) + re.getxloc() * curSystem.spacingCoefficient) | 0));
	}

	/*------------------------------------------------------------------------
Method:  void drawClefInfo(Graphics2D g,int vnum,int mnum,int xloc,int yloc)
Purpose: Draw clefs at left side of staff
Parameters:
  Input:  Graphics2D g  - graphical context
          int vnum      - voice number
          int mnum      - measure number
          int xloc,yloc - starting coordinates for drawing
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawClefInfo(g:Graphics2D,renderer:ScoreRenderer,leftMeasure:MeasureInfo,vnum:number,xloc:number,yloc:number):void
	{
		let leftEventIndex:number = leftMeasure.reventindex[vnum];
		let leftCS:RenderedClefSet = renderer.eventinfo[vnum].getClefEvents(leftEventIndex);
		if( leftCS != null)
			xloc +=<number> leftCS.draw_1(this.useModernAccSystem,g,this.musicGfx,<number> xloc,<number> yloc,1);

		let mk:ModernKeySignature = renderer.eventinfo[vnum].getModernKeySig(leftEventIndex);
		if( mk.numEls() > 0 && leftCS != null && this.useModernAccSystem)
			xloc +=<number> ViewCanvas.drawModKeySig_1(g,this.musicGfx,mk,leftCS.getPrincipalClefEvent(),<number> xloc,<number> yloc,1,false,ScorePageCanvas.STAFFSCALE,ScorePageCanvas.STAFFPOSSCALE);

	}
	/* draw clefs */
	/* modern key signature */
	/*------------------------------------------------------------------------
Method:  int calcLigY(int vnum,RenderedEvent e)
Purpose: Calculate y position of a ligature at a given event (relative to
         staff)
Parameters:
  Input:  int vnum        - voice number
          RenderedEvent e - event
  Output: -
  Return: y position of ligature
------------------------------------------------------------------------*/
	static DEFAULT_LIGYVAL:number = - 7;

	calcLigY(vnum:number,e:RenderedEvent):number
	{
		let ligInfo:RenderedLigature = e.getLigInfo();
		let lige:RenderedEvent = ligInfo.reventList.getEvent(ligInfo.yMaxEventNum);
		let ligevclef:Clef = lige.getClef();
		let lignoteev:Event = ligInfo.yMaxEvent;
		let ligyval:number =(((((( ScorePageCanvas.STAFFSCALE * 4) | 0) - 12) | 0) -(( ScorePageCanvas.STAFFPOSSCALE * lignoteev.getPitch_1().calcypos(ligevclef)) | 0)) | 0);
		if( ligyval > ScorePageCanvas.DEFAULT_LIGYVAL)
			ligyval = ScorePageCanvas.DEFAULT_LIGYVAL;

		return ligyval;
	}

	calcTieY_3(vnum:number,e:RenderedEvent):number
	{
		let tieInfo:RenderedLigature = e.getTieInfo();
		let tieRE:RenderedEvent = tieInfo.reventList.getEvent(tieInfo.yMaxEventNum);
		let tieREclef:Clef = tieRE.getClef();
		let tieNoteEv:Event = tieInfo.yMaxEvent;
		return(((((( ScorePageCanvas.STAFFSCALE * 4) | 0) - 12) | 0) -(( ScorePageCanvas.STAFFPOSSCALE * tieNoteEv.getPitch_1().calcypos(tieREclef)) | 0)) | 0);
	}

	/*------------------------------------------------------------------------
Method:  void drawLigature(Graphics2D g,int x1,int x2,int y,int leftx,int rightx)
Purpose: Draw ligature bracket for one voice
Parameters:
  Input:  Graphics2D g     - graphical context
          int x1,x2        - left and right coordinates of bracket
          int y            - y level of bracket
          int leftx,rightx - horizontal bounds of drawing space
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawLigature_2(g:Graphics2D,x1:number,x2:number,y:number,leftx:number,rightx:number):void
	{
		if( this.musicOptions.get_displayligbrackets())
			ViewCanvas.drawLigOnCanvas_2(g,x1,x2,y,leftx,rightx);

	}

	drawTie_2(g:Graphics2D,tieType:number,x1:number,x2:number,y:number,leftx:number,rightx:number):void
	{
		ViewCanvas.drawTieOnCanvas_2(g,tieType,x1,x2,y,leftx,rightx);
	}

	/*------------------------------------------------------------------------
Method:  void drawStaff(Graphics2D g,int yloc,int numlines,int leftX,int rightX)
Purpose: Draw staff at specified location
Parameters:
  Input:  Graphics2D g     - graphical context
          int yloc         - y location for top of staff
          int numlines     - number of lines for staff
          int leftX,rightX - horizontal bounds of staff
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawStaff_3(g:Graphics2D,yloc:number,numlines:number,leftX:number,rightX:number):void
	{
		g.setColor(Color.black);
		for(
		let i:number = 0;i < numlines;i ++)
		g.drawLine((( ScorePageCanvas.XMARGIN + leftX) | 0),(( yloc +(( i * ScorePageCanvas.STAFFSCALE) | 0)) | 0),(( ScorePageCanvas.XMARGIN + rightX) | 0),(( yloc +(( i * ScorePageCanvas.STAFFSCALE) | 0)) | 0));
	}

	/*------------------------------------------------------------------------
Method:  void drawSystemBarlines(Graphics2D g,int xloc,int yloc,
                                 RenderedStaffSystem curSystem)
Purpose: Draw barlines across one system
Parameters:
  Input:  Graphics2D g                  - graphical context
          int xloc,yloc                 - location for top left of first staff
          RenderedStaffSystem curSystem - staff system information
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawSystemBarlines(g:Graphics2D,xloc:number,yloc:number,curSystem:RenderedStaffSystem):void
	{
		let curx:number = 0;
		let rendererNum:number = ScoreRenderer.calcRendererNum(this.renderedPages.scoreData,curSystem.startMeasure);
		g.setColor(Color.black);
		if( curSystem.startMeasure > 0)
			{
				g.setFont(ScorePageCanvas.normalFont);
				g.drawString(`${curSystem.startMeasure + 1}`,(( xloc - 10) | 0),(( yloc -(( ScorePageCanvas.STAFFSCALE * 3) | 0)) | 0));
			}

		for(
		let i:number = curSystem.startMeasure;i < curSystem.endMeasure;i ++)
		{
			curx += this.renderedPages.scoreData[rendererNum].getMeasure(i).xlength;
			this.drawBarlines_2(g,<number>((((( xloc + curx * curSystem.spacingCoefficient) | 0) + 4) | 0)),yloc,curSystem.numVoices);
		}
		if( curSystem.endMeasure < this.renderedPages.scoreData[rendererNum].getLastMeasureNum())
			this.drawBarlines_2(g,(( ScorePageCanvas.XMARGIN + curSystem.rightX) | 0),yloc,curSystem.numVoices);
		else
			g.drawLine((( ScorePageCanvas.XMARGIN + curSystem.rightX) | 0),yloc,(( ScorePageCanvas.XMARGIN + curSystem.rightX) | 0),(((( yloc +((((( curSystem.numVoices - 1) | 0)) * ScorePageCanvas.CANVASYSCALE) | 0)) | 0) +(( 4 * ScorePageCanvas.STAFFSCALE) | 0)) | 0));

	}

	/* measure number */
	//STAFFXSIZE-1,yloc);
	/* final barline */
	/*------------------------------------------------------------------------
Method:  void drawBarlines(Graphics2D g,int xloc,int yloc,int numVoices)
Purpose: Draw barlines at specified x location
Parameters:
  Input:  Graphics2D g  - graphical context
          int xloc,yloc - location for barlines
          int numVoices - number of voices in system
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawBarlines_2(g:Graphics2D,xloc:number,yloc:number,numVoices:number):void
	{
		switch( this.musicOptions.get_barline_type())
		{
			case OptionSet.OPT_BARLINE_NONE:
			{
				break;
			}
			case OptionSet.OPT_BARLINE_MENSS:
			{
				for(
				let i:number = 0;i <(( numVoices - 1) | 0);i ++)
				g.drawLine(xloc,(((( yloc +(( ScorePageCanvas.STAFFSCALE * 4) | 0)) | 0) +(( i * ScorePageCanvas.CANVASYSCALE) | 0)) | 0),xloc,(( yloc +((((( i + 1) | 0)) * ScorePageCanvas.CANVASYSCALE) | 0)) | 0));
				break;
			}
			case OptionSet.OPT_BARLINE_TICK:
			{
				for(
				let i:number = 0;i < numVoices;i ++)
				{
					g.drawLine(xloc,(((( yloc - 5) | 0) +(( i * ScorePageCanvas.CANVASYSCALE) | 0)) | 0),xloc,(( yloc +(( i * ScorePageCanvas.CANVASYSCALE) | 0)) | 0));
					g.drawLine(xloc,(((((( yloc + 5) | 0) +(( ScorePageCanvas.STAFFSCALE * 4) | 0)) | 0) +(( i * ScorePageCanvas.CANVASYSCALE) | 0)) | 0),xloc,(((( yloc +(( ScorePageCanvas.STAFFSCALE * 4) | 0)) | 0) +(( i * ScorePageCanvas.CANVASYSCALE) | 0)) | 0));
				}
				break;
			}
			case OptionSet.OPT_BARLINE_MODERN:
			{
				for(
				let i:number = 0;i < numVoices;i ++)
				g.drawLine(xloc,(( yloc +(( i * ScorePageCanvas.CANVASYSCALE) | 0)) | 0),xloc,(((( yloc +(( ScorePageCanvas.STAFFSCALE * 4) | 0)) | 0) +(( i * ScorePageCanvas.CANVASYSCALE) | 0)) | 0));
				break;
			}
		}
	}

	/*------------------------------------------------------------------------
Method:  void draw[Centered|Right]String(Graphics2D g,String s,[int xsize|xloc],int yloc)
Purpose: Draw centered/right-justified string at specified y-location
Parameters:
  Input:  Graphics2D g  - graphical context
          String s      - string to draw
          int xsize     - total horizontal space available
          int xloc,yloc - string location
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawCenteredString(g:Graphics2D,s:string,xsize:number,yloc:number):void
	{
		let strSize:number = g.getFontMetrics().stringWidth(s);
		g.drawString(s,((((( xsize - strSize) | 0)) / 2) | 0),yloc);
	}

	drawRightString(g:Graphics2D,s:string,xloc:number,yloc:number):void
	{
		let strSize:number = g.getFontMetrics().stringWidth(s);
		g.drawString(s,(( xloc - strSize) | 0),yloc);
	}

	/*------------------------------------------------------------------------
Method:    void paintComponent(Graphics g)
Overrides: javax.swing.JComponent.paintComponent
Purpose:   Repaint area
Parameters:
  Input:  Graphics g - graphical context
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public paintComponent(g:Graphics):void
	{
		g.drawImage(this.scaledCanvas,0,0,this);
	}
}

/* copy current offscreen buffer to screen */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   ScorePagePreviewWin
Extends: JFrame
Purpose: Window for displaying scored music in page layout
------------------------------------------------------------------------*/
export class ScorePagePreviewWin extends JFrame implements ChangeListener,ActionListener
{
	mytype_ActionListener:boolean = true;
	mytype_ChangeListener:boolean = true;
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static STAFFXSIZE:number = ScorePageCanvas.STAFFXSIZE;
	public static DRAWINGSPACEY:number = ScorePageCanvas.DRAWINGSPACEY;
	public static STAFFSCALE:number = ScorePageCanvas.STAFFSCALE;
	public static CANVASYSCALE:number = ScorePageCanvas.CANVASYSCALE;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	parentMusicWin:MusicWin;
	/* data */
	musicData:PieceData;
	renderedPages:ScorePageRenderer;
	/* GUI */
	musicScr:ScorePageCanvas;
	pageSpinner:JSpinner;
	viewSizeControl:ZoomControl;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: ScorePagePreviewWin(PieceData p,MusicWin mw)
Purpose:     Initialize and lay out window
Parameters:
  Input:  PieceData p  - music data
          MusicWin mw  - parent window
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(p:PieceData,mw:MusicWin)
	{
		super();
		this.parentMusicWin = mw;
		this.musicData = p;
		this.renderedPages = new ScorePageRenderer(this.musicData,mw.optSet,new Dimension(ScorePagePreviewWin.STAFFXSIZE,ScorePagePreviewWin.DRAWINGSPACEY),ScorePagePreviewWin.STAFFSCALE,ScorePagePreviewWin.CANVASYSCALE);
		this.setTitle(this.parentMusicWin.getTitle() + " (print preview: score)");
		this.setIconImage(this.parentMusicWin.windowIcon);
		let contentPane:Container = this.getContentPane();
		contentPane.setLayout(new BoxLayout(contentPane,BoxLayout.Y_AXIS));
		let pageControls:JToolBar = new JToolBar();
		pageControls.setFloatable(false);
		pageControls.setLayout(new GridBagLayout());
		pageControls.setAlignmentY(Component.LEFT_ALIGNMENT);
		pageControls.setAlignmentX(Component.LEFT_ALIGNMENT);
		let tbc:GridBagConstraints = new GridBagConstraints();
		tbc.anchor = GridBagConstraints.WEST;
		tbc.weightx = 0;
		let pageControlsPanel:JPanel = new JPanel();
		pageControlsPanel.add(new JLabel("Page "));
		this.pageSpinner = new JSpinner(new SpinnerNumberModel(1,1,this.renderedPages.pages.size(),1));
		pageControlsPanel.add(this.pageSpinner);
		pageControlsPanel.add(new JLabel(" of " + this.renderedPages.pages.size()));
		tbc.gridx = 0;
		tbc.gridy = 0;
		tbc.weightx = 1;
		pageControls.add(pageControlsPanel,tbc);
		tbc.gridx ++;
		pageControls.addSeparator();
		this.viewSizeControl = ZoomControl.new0_5(<number>( mw.optSet.getVIEWSCALE() * 100),this);
		pageControls.add(this.viewSizeControl);
		tbc.gridx ++;
		tbc.gridy = 0;
		tbc.weightx = 0;
		pageControls.add(this.viewSizeControl,tbc);
		contentPane.add(pageControls);
		this.pageSpinner.addChangeListener(this);
		this.musicScr = new ScorePageCanvas(this.musicData,this.renderedPages,MusicFont.new1(0.9),mw);
		let musicPane:JScrollPane = new JScrollPane(this.musicScr);
		let actualDisplaySize:Dimension = Toolkit.getDefaultToolkit().getScreenSize();
		let canvasSize:Dimension = new Dimension(this.musicScr.getPreferredSize());
		if( canvasSize.width ><number> actualDisplaySize.width * ScorePageCanvas.MAXDISPLAYPORTION)
			canvasSize.width =<number>(<number> actualDisplaySize.width * ScorePageCanvas.MAXDISPLAYPORTION);

		if( canvasSize.height ><number> actualDisplaySize.height * ScorePageCanvas.MAXDISPLAYPORTION)
			canvasSize.height =<number>(<number> actualDisplaySize.height * ScorePageCanvas.MAXDISPLAYPORTION);

		musicPane.setPreferredSize(canvasSize);
		musicPane.getViewport().setBackground(Color.WHITE);
		contentPane.add(musicPane);
		this.pack();
		this.setLocationRelativeTo(mw);
		this.musicScr.requestFocusInWindow();
		this.addWindowListener(
		{

			/* initialize window */
			/* add components */
			/* tool bar */
			//    pageControls.setFocusable(false);
			//    pageControls.setLayout(new BoxLayout(pageControls,BoxLayout.X_AXIS));
			//    pageControlsPanel.setAlignmentX(java.awt.Component.CENTER_ALIGNMENT);
			/* canvas (in scroll pane) */
			/* handle other window events */
			windowClosing:(event:WindowEvent):void =>
			{
				this.closewin_4();
			}
		}
		);
	}

	/*------------------------------------------------------------------------
Method:     void stateChanged(ChangeEvent e)
Implements: ChangeListener.stateChanged
Purpose:    Take action when a proportion-spinner value has changed
Parameters:
  Input:  ChangeEvent e - state-changed event
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public stateChanged(e:ChangeEvent):void
	{
		let itemChanged:any = e.getSource();
		if( itemChanged == this.pageSpinner)
			this.musicScr.setPage((((<Integer>( this.pageSpinner.getValue())).intValue() - 1) | 0));

	}

	/*------------------------------------------------------------------------
Method:     void actionPerformed(ActionEvent event)
Implements: ActionListener.actionPerformed
Purpose:    Check for action types in menu/tools and take appropriate action
Parameters:
  Input:  ActionEvent event - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public actionPerformed(event:ActionEvent):void
	{
		let item:any = event.getSource();
		if( item == this.viewSizeControl.zoomInButton)
			this.musicScr.setScale(this.viewSizeControl.zoomIn_1());
		else
			if( item == this.viewSizeControl.zoomOutButton)
				this.musicScr.setScale(this.viewSizeControl.zoomOut_1());
			else
				if( item == this.viewSizeControl.viewSizeField)
					this.musicScr.setScale(this.viewSizeControl.viewSizeFieldAction());

	}

	/*------------------------------------------------------------------------
Method:  void openwin()
Purpose: Make window appear in front
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public openwin_2():void
	{
		this.setVisible(true);
		this.toFront();
	}

	/*------------------------------------------------------------------------
Method:  void closewin()
Purpose: Hide window
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public closewin_4():void
	{
		let wl:WindowListener[]= this.getListeners("WindowListener");
		for(
		let i:number = 0;i < wl.length;i ++)
		this.removeWindowListener(wl[i]);
		this.pageSpinner.removeChangeListener(this);
		this.viewSizeControl.removeListeners_2();
		this.dispose();
		this.musicScr = null;
	}
}
