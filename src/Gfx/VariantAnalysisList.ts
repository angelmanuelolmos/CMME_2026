
import { RuntimeException } from '../java/lang/RuntimeException';
import { VariantReport } from './VariantReport';
import { ScoreRenderer } from './ScoreRenderer';
import { VoiceGfxInfo } from './ScoreRenderer';
import { RenderList } from './RenderList';
import { NoteShapeStyleListener } from './MusicWin';
import { BarlineStyleListener } from './MusicWin';
import { ViewSizeListener } from './MusicWin';
import { PDFFileFilter } from './MusicWin';
import { HTMLFileFilter } from './MusicWin';
import { XMLFileFilter } from './MusicWin';
import { MIDIFileFilter } from './MusicWin';
import { CMMEFileFilter } from './MusicWin';
import { MusicWin } from './MusicWin';
import { MeasureInfo } from './MeasureInfo';
import { Comparator } from '../java/util/Comparator';
import { ArrayList } from '../java/util/ArrayList';
import { Event } from '../DataStruct/Event';
import { PieceData } from '../DataStruct/PieceData';

export class VariantAnalysisList extends ArrayList<VariantReport>
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	renderedSections:ScoreRenderer[];
	musicData:PieceData;
	parentWin:MusicWin;

	public static new0_3(musicData:PieceData,parentWin:MusicWin):VariantAnalysisList
	{
		let _new0:VariantAnalysisList = new VariantAnalysisList;
		VariantAnalysisList.set0_3(_new0,musicData,parentWin);
		return _new0;
	}

	public static set0_3(new0:VariantAnalysisList,musicData:PieceData,parentWin:MusicWin):void
	{
		VariantAnalysisList.set1_3(new0,musicData,ScoreRenderer.renderSections(musicData,parentWin.optSet));
	}

	public static new1_3(musicData:PieceData,renderedSections:ScoreRenderer[]):VariantAnalysisList
	{
		let _new1:VariantAnalysisList = new VariantAnalysisList;
		VariantAnalysisList.set1_3(_new1,musicData,renderedSections);
		return _new1;
	}

	public static set1_3(new1:VariantAnalysisList,musicData:PieceData,renderedSections:ScoreRenderer[]):void
	{
		new1.renderedSections = renderedSections;
		new1.musicData = musicData;
		new1.parentWin = new1.parentWin;
		new1.createVariantList();
	}

	/*------------------------------------------------------------------------
Method:  void createVariantList()
Purpose: Initialize list (this) with variants in all sections
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	private Collectionssort(arr:ArrayList<VariantReport>,comparator:any):ArrayList<any>
	{
		throw new RuntimeException();
	}

	//CHANGE
	createVariantList():void
	{
		for(let rs of this.renderedSections)
		this.addVariantList(rs,this);
		this.Collectionssort(this,
		{

			//CHANGE
			compare:(v1:VariantReport,v2:VariantReport):number =>
			{
				if( v1.measureNum < v2.measureNum)
					return - 1;
				else
					if( v1.measureNum > v2.measureNum)
						return 1;
					else
						if( v1.betweenMeasures == v2.betweenMeasures)
							return 0;
						else
							if( v1.betweenMeasures && ! v2.betweenMeasures)
								return 1;
							else
								return - 1;

			}
		}
		);
	}

	/*------------------------------------------------------------------------
Method:  void addVariantList(ScoreRenderer rs,ArrayList<VariantReport> varReports)
Purpose: Add variants in one section to list
Parameters:
  Input:  ScoreRenderer rs                    - rendered music for one section
  Output: ArrayList<VariantReport> varReports - list to expand
  Return: -
------------------------------------------------------------------------*/
	addVariantList(rs:ScoreRenderer,varReports:ArrayList<VariantReport>):void
	{
		let numVoices:number = rs.getNumVoices();
		for(
		let mi:number = rs.getFirstMeasureNum();mi <= rs.getLastMeasureNum();mi ++)
		{
			let m:MeasureInfo = rs.getMeasure(mi);
			let rv:RenderList;
			for(
			let vi:number = 0;vi < numVoices;vi ++)
			if(( rv = rs.getRenderedVoice(vi)) != null)
				{
					let starti:number = m.reventindex[vi];
					let endi:number = mi == rs.getLastMeasureNum() ?(( rv.size() - 1) | 0):(( rs.getMeasure((( mi + 1) | 0)).reventindex[vi]- 1) | 0);
					for(
					let ei:number = starti;ei <= endi;ei ++)
					if( rv.getEvent(ei).getEvent_1().geteventtype() == Event.EVENT_VARIANTDATA_START)
						varReports.add(new VariantReport(m,vi,rv,ei));

				}

		}
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getRenderedSections():ScoreRenderer[]
	{
		return this.renderedSections;
	}
}
