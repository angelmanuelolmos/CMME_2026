
import { System } from '../java/lang/System';
import { Pitch } from './Pitch';
import { Event } from './Event';

/*----------------------------------------------------------------------*/
/*

        Module          : CustosEvent.java

        Package         : DataStruct

        Classes Included: CustosEvent

        Purpose         : Custos event type

        Programmer      : Ted Dumitrescu

        Date Started    : 4/25/99

        Updates         : 

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   CustosEvent
Extends: Event
Purpose: Data/routines for custos events
------------------------------------------------------------------------*/
export class CustosEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	pitch:Pitch;

	public static new9(p:Pitch):CustosEvent
	{
		let _new9:CustosEvent = new CustosEvent;
		CustosEvent.set9(_new9,p);
		return _new9;
	}

	public static set9(new9:CustosEvent,p:Pitch):void
	{
		Event.set0(new9);
		new9.eventtype = CustosEvent.EVENT_CUSTOS;
		new9.pitch = p;
	}

	/*------------------------------------------------------------------------
Method:    Event createCopy()
Overrides: Event.createCopy
Purpose:   create copy of current event
Parameters:
  Input:  -
  Output: -
  Return: copy of this
------------------------------------------------------------------------*/
	public createCopy_1():Event
	{
		let e:Event = CustosEvent.new9(Pitch.new3(this.pitch));
		e.copyEventAttributes_1(this);
		return e;
	}

	/*------------------------------------------------------------------------
Methods: boolean equals(Event other)
Purpose: Check whether the data of this event is exactly equal to another
Parameters:
  Input:  Event other - event to check against
  Output: -
  Return: true if events are equal
------------------------------------------------------------------------*/
	public equals_1(other:Event):boolean
	{
		if( ! super.equals_1(other))
			return false;

		let otherCE:CustosEvent =<CustosEvent> other;
		return this.pitch.equals(otherCE.pitch);
	}

	/*------------------------------------------------------------------------
Method:  Pitch getPitch()
Purpose: Returns pitch of custos
Parameters:
  Input:  -
  Output: -
  Return: pitch structure
------------------------------------------------------------------------*/
	public getPitch_1():Pitch
	{
		return this.pitch;
	}

	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Prints information about this event
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public prettyprint_1():void
	{
		System.out.println("    Custos: " + this.pitch.toString());
	}
}
