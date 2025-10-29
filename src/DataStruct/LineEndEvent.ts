
import { System } from '../java/lang/System';
import { Event } from './Event';

/*----------------------------------------------------------------------*/
/*

        Module          : LineEndEvent.java

        Package         : DataStruct

        Classes Included: LineEndEvent

        Purpose         : Event type for line-ends

        Programmer      : Ted Dumitrescu

        Date Started    : 7/24/06

        Updates         :
7/24/06: originally this was a "dataless" event type without its own class;
         now it contains an optional page-end marker.

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   LineEndEvent
Extends: Event
Purpose: Data/routines for line-end events
------------------------------------------------------------------------*/
export class LineEndEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	pageEnd:boolean;

	public static new15():LineEndEvent
	{
		let _new15:LineEndEvent = new LineEndEvent;
		LineEndEvent.set15(_new15);
		return _new15;
	}

	public static set15(new15:LineEndEvent):void
	{
		LineEndEvent.set16(new15,false);
	}

	public static new16(pe:boolean):LineEndEvent
	{
		let _new16:LineEndEvent = new LineEndEvent;
		LineEndEvent.set16(_new16,pe);
		return _new16;
	}

	public static set16(new16:LineEndEvent,pe:boolean):void
	{
		Event.set0(new16);
		new16.eventtype = LineEndEvent.EVENT_LINEEND;
		new16.pageEnd = pe;
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
		let e:Event = LineEndEvent.new16(this.pageEnd);
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

		let otherLEE:LineEndEvent =<LineEndEvent> other;
		return this.pageEnd == otherLEE.pageEnd;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public isPageEnd():boolean
	{
		return this.pageEnd;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setPageEnd(pe:boolean):void
	{
		this.pageEnd = pe;
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
		System.out.print("    LineEnd");
		if( this.pageEnd)
			System.out.println(" (page-end)");
		else
			System.out.println();

	}
}
