
import { System } from '../java/lang/System';
import { StaffEventData } from './StaffEventData';
import { RenderList } from './RenderList';
import { RenderedEventGroup } from './RenderedEventGroup';
import { NoteEvent } from '../DataStruct/NoteEvent';
import { VoiceEventListData } from '../DataStruct/VoiceEventListData';

export class RenderedLigature extends RenderedEventGroup
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static LIG:number = 0;
	public static TIE:number = 1;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public numNotes:number;
	public groupType:number;
	public curVoice:VoiceEventListData;
	public reventList:RenderList;
	/* main render list */
	public rligEvents:StaffEventData;

	public static new2(v:VoiceEventListData,rel:RenderList,groupType:number):RenderedLigature
	{
		let _new2:RenderedLigature = new RenderedLigature;
		RenderedLigature.set2(_new2,v,rel,groupType);
		return _new2;
	}

	public static set2(new2:RenderedLigature,v:VoiceEventListData,rel:RenderList,groupType:number):void
	{
		RenderedEventGroup.set1(new2,- 1,- 1);
		new2.curVoice = v;
		new2.reventList = rel;
		new2.groupType = groupType;
	}

	public static new3(v:VoiceEventListData,rel:RenderList):RenderedLigature
	{
		let _new3:RenderedLigature = new RenderedLigature;
		RenderedLigature.set3(_new3,v,rel);
		return _new3;
	}

	public static set3(new3:RenderedLigature,v:VoiceEventListData,rel:RenderList):void
	{
		RenderedLigature.set2(new3,v,rel,RenderedLigature.LIG);
	}

	/*------------------------------------------------------------------------
Method:  update(int evNum,NoteEvent ne)
Purpose: Update ligature info when rendering a new note (which may or may not
         be part of a ligature)
Parameters:
  Input:  int evNum     - event index within render list
          NoteEvent ne  - note being rendered
  Output: -
  Return: whether or not this is the last note of a ligature
------------------------------------------------------------------------*/
	public updateTie(evNum:number,ne:NoteEvent):boolean
	{
		if( this.firstEventNum != - 1)
			{
				this.numNotes ++;
				this.lastEventNum = evNum;
			}

		else
			if( ne.getTieType() != NoteEvent.TIE_NONE)
				{
					this.firstEventNum =( this.yMaxEventNum =( this.yMinEventNum = evNum));
					this.yMaxEvent =( this.yMinEvent = ne);
					this.numNotes = 1;
				}

		this.findMinMaxY(evNum,ne);
		return this.numNotes > 1;
	}

	public update(evNum:number,ne:NoteEvent):boolean
	{
		let endlig:boolean = false;
		if( this.groupType == RenderedLigature.TIE)
			return this.updateTie(evNum,ne);

		if( this.firstEventNum != - 1)
			{
				this.numNotes ++;
				if( ! ne.isligated())
					{
						endlig = true;
						this.lastEventNum = evNum;
						this.rligEvents = StaffEventData.new3(this.curVoice.getMetaData(),this.reventList.getSection());
						this.rligEvents.getOptions().setLigatureList(true);
						this.rligEvents.addlig_3(this.reventList,this.firstEventNum,this.reventList.getEvent(this.firstEventNum).getRenderParams());
						this.rligEvents.setgroupxlocs(RenderedEventGroup.new1(0,(( this.lastEventNum - this.firstEventNum) | 0)),0);
					}

			}

		else
			if( ne.isligated())
				{
					this.firstEventNum =( this.yMaxEventNum =( this.yMinEventNum = evNum));
					this.yMaxEvent =( this.yMinEvent = ne);
					this.numNotes = 1;
				}

		this.findMinMaxY(evNum,ne);
		return endlig;
	}

	/* this is the last note of the ligature */
	/* all lig notes have been accounted, now render lig in its
               original shape */
	//            rligEvents.addlig(curVoice,reventList.getEvent(firstEventNum).getEvent().getListPlace(curVoice.isDefaultVersion()),
	//                                       reventList.getEvent(firstEventNum).getRenderParams());
	/* start of a new ligature */
	findMinMaxY(evNum:number,ne:NoteEvent):void
	{
		if( this.firstEventNum != - 1)
			if( ne.getPitch_1().isHigherThan(this.yMaxEvent.getPitch_1()))
				{
					this.yMaxEventNum = evNum;
					this.yMaxEvent = ne;
				}

			else
				if( this.yMinEvent.getPitch_1().isHigherThan(ne.getPitch_1()))
					{
						this.yMinEventNum = evNum;
						this.yMinEvent = ne;
					}

	}

	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Prints information about this ligature
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public toString():string
	{
		return "Lig: FEN=" + this.firstEventNum + " LEN=" + this.lastEventNum + " yMXN=" + this.yMaxEventNum + " yMXE=" + this.yMaxEvent + " yMNN=" + this.yMinEventNum + " yMNE=" + this.yMinEvent;
	}

	public prettyprint():void
	{
		System.out.println(this.toString());
	}
}
