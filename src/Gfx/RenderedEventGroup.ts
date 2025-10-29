
import { RenderList } from './RenderList';
import { Event } from '../DataStruct/Event';
import { Pitch } from '../DataStruct/Pitch';
import { VariantMarkerEvent } from '../DataStruct/VariantMarkerEvent';
import { VariantReading } from '../DataStruct/VariantReading';

export class RenderedEventGroup
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static EVENTGROUP_NONE:number = 0;
	public static EVENTGROUP_LIG:number = 1;
	public static EVENTGROUP_VARIANTREADING:number = 2;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public grouptype:number;
	public firstEventNum:number;
	public lastEventNum:number;
	/* -1 for no events */
	public yMaxEventNum:number;
	public yMinEventNum:number;
	public yMaxEvent:Event;
	public yMinEvent:Event;
	public varReading:VariantReading;
	public varMarker:VariantMarkerEvent;

	public static new0(ei:number):RenderedEventGroup
	{
		let _new0:RenderedEventGroup = new RenderedEventGroup;
		RenderedEventGroup.set0(_new0,ei);
		return _new0;
	}

	public static set0(new0:RenderedEventGroup,ei:number):void
	{
		new0.grouptype = RenderedEventGroup.EVENTGROUP_NONE;
		new0.firstEventNum =( new0.lastEventNum =( new0.yMaxEventNum =( new0.yMinEventNum = ei)));
		new0.yMaxEvent =( new0.yMinEvent = null);
		new0.varReading = null;
		new0.varMarker = null;
	}

	public static new1(fei:number,lei:number):RenderedEventGroup
	{
		let _new1:RenderedEventGroup = new RenderedEventGroup;
		RenderedEventGroup.set1(_new1,fei,lei);
		return _new1;
	}

	public static set1(new1:RenderedEventGroup,fei:number,lei:number):void
	{
		new1.grouptype = RenderedEventGroup.EVENTGROUP_LIG;
		new1.firstEventNum = fei;
		new1.lastEventNum = lei;
		new1.yMaxEventNum =( new1.yMinEventNum = fei);
		new1.yMaxEvent =( new1.yMinEvent = null);
		new1.varReading = null;
		new1.varMarker = null;
	}

	/*------------------------------------------------------------------------
Method:  void calculateYMinMax(RenderList rl)
Purpose: Calculate minimum and maximum y-vals for events within group
Parameters:
  Input:  RenderList rl - rendered event list
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public calculateYMinMax(rl:RenderList):void
	{
		let e:Event;
		for(
		let ei:number = this.firstEventNum;ei <= this.lastEventNum;ei ++)
		{
			e = rl.getEvent(ei).getEvent_1();
			if( e.geteventtype() == Event.EVENT_NOTE)
				{
					let p:Pitch = e.getPitch_1();
					if( this.yMaxEvent == null || p.isHigherThan(this.yMaxEvent.getPitch_1()))
						{
							this.yMaxEventNum = ei;
							this.yMaxEvent = e;
						}

					if( this.yMinEvent == null || this.yMinEvent.getPitch_1().isHigherThan(p))
						{
							this.yMinEventNum = ei;
							this.yMinEvent = e;
						}

				}

		}
	}
}
