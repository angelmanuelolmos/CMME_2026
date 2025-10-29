
import { System } from '../java/lang/System';
import { VoiceEventListData } from './VoiceEventListData';
import { Voice } from './Voice';
import { MusicSection } from './MusicSection';
import { Event } from './Event';

export class VoiceMensuralData extends VoiceEventListData
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	ellipsisEventNum:number;

	public static new3(v:Voice,section:MusicSection):VoiceMensuralData
	{
		let _new3:VoiceMensuralData = new VoiceMensuralData;
		VoiceMensuralData.set3(_new3,v,section);
		return _new3;
	}

	public static set3(new3:VoiceMensuralData,v:Voice,section:MusicSection):void
	{
		new3.initParams_2(v,section);
		new3.ellipsisEventNum = - 1;
	}

	public static new4():VoiceMensuralData
	{
		let _new4:VoiceMensuralData = new VoiceMensuralData;
		VoiceMensuralData.set4(_new4);
		return _new4;
	}

	public static set4(new4:VoiceMensuralData):void
	{
		new4.initParams_1();
		new4.ellipsisEventNum = - 1;
	}

	/* vestigial limb ! */
	/*------------------------------------------------------------------------
Method:  void setVoiceParams(Event e)
Purpose: Update voice parameter variables after adding a new event
Parameters:
  Input:  Event e - event just added
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setVoiceParams_1(e:Event):void
	{
		if( e.geteventtype() == Event.EVENT_ELLIPSIS)
			{
				if( this.ellipsisEventNum != - 1)
					System.err.println("Error: Multiple ellipses in one voice");

				if( ! this.metaData.getGeneralData().isIncipitScore())
					System.err.println("Error: Adding ellipsis to non-incipit score");

				this.ellipsisEventNum = e.getListPlace(this.isDefaultVersion());
			}

	}

	/*------------------------------------------------------------------------
Method:  Event deleteEvent(int i)
Purpose: Remove event from this voice's list
Parameters:
  Input:  int i - index of event to delete
  Output: -
  Return: deleted Event
------------------------------------------------------------------------*/
	public deleteEvent_1(i:number):Event
	{
		let deletedEvent:Event = super.deleteEvent_1(i);
		if( deletedEvent.geteventtype() == Event.EVENT_ELLIPSIS)
			this.ellipsisEventNum = - 1;

		return deletedEvent;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getEllipsisEventNum():number
	{
		return this.ellipsisEventNum;
	}
}
