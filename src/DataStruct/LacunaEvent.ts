
import { System } from '../java/lang/System';
import { Proportion } from './Proportion';
import { Event } from './Event';

/*----------------------------------------------------------------------*/
/*

        Module          : LacunaEvent.java

        Package         : DataStruct

        Classes Included: LacunaEvent

        Purpose         : Event type for lacunae

        Programmer      : Ted Dumitrescu

        Date Started    : 8/1/06

        Updates         :
8/18/08: added proportionless begin/end markers for LacunaEvents within
         variant versions

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   LacunaEvent
Extends: Event
Purpose: Data/routines for lacuna events
------------------------------------------------------------------------*/
export class LacunaEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	length:Proportion;

	public static new13(l:Proportion):LacunaEvent
	{
		let _new13:LacunaEvent = new LacunaEvent;
		LacunaEvent.set13(_new13,l);
		return _new13;
	}

	public static set13(new13:LacunaEvent,l:Proportion):void
	{
		Event.set0(new13);
		new13.eventtype = LacunaEvent.EVENT_LACUNA;
		new13.length =( new13.musictime = Proportion.new1(l));
	}

	public static new14(eventType:number):LacunaEvent
	{
		let _new14:LacunaEvent = new LacunaEvent;
		LacunaEvent.set14(_new14,eventType);
		return _new14;
	}

	public static set14(new14:LacunaEvent,eventType:number):void
	{
		Event.set0(new14);
		new14.eventtype = eventType;
		new14.length =( new14.musictime = Proportion.new0(0,1));
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
		let e:Event = this.length.i1 > 0 ? LacunaEvent.new13(this.length):LacunaEvent.new14(this.geteventtype());
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

		let otherLE:LacunaEvent =<LacunaEvent> other;
		return this.length.equals(otherLE.length);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getLength_1():Proportion
	{
		return this.length;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setLength_1(l:Proportion):void
	{
		this.length =( this.musictime = l);
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
		System.out.println("    Lacuna: " + this.length.i1 + "/" + this.length.i2);
	}
}
