
import { System } from '../java/lang/System';
import { Proportion } from './Proportion';
import { Event } from './Event';

/*----------------------------------------------------------------------*/
/*

        Module          : ProportionEvent.java

        Package         : DataStruct

        Classes Included: ProportionEvent

        Purpose         : Event type for rhythmic proportion (not a sign)

        Programmer      : Ted Dumitrescu

        Date Started    : 9/9/05

        Updates         :

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   ProportionEvent
Extends: Event
Purpose: Data/routines for proportion events
------------------------------------------------------------------------*/
export class ProportionEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	proportion:Proportion;

	public static new29(i1:number,i2:number):ProportionEvent
	{
		let _new29:ProportionEvent = new ProportionEvent;
		ProportionEvent.set29(_new29,i1,i2);
		return _new29;
	}

	public static set29(new29:ProportionEvent,i1:number,i2:number):void
	{
		Event.set0(new29);
		new29.eventtype = ProportionEvent.EVENT_PROPORTION;
		new29.proportion = Proportion.new0(i1,i2);
	}

	public static new30(p:Proportion):ProportionEvent
	{
		let _new30:ProportionEvent = new ProportionEvent;
		ProportionEvent.set30(_new30,p);
		return _new30;
	}

	public static set30(new30:ProportionEvent,p:Proportion):void
	{
		Event.set0(new30);
		new30.eventtype = ProportionEvent.EVENT_PROPORTION;
		new30.proportion = p;
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
		let e:Event = ProportionEvent.new30(Proportion.new1(this.proportion));
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

		let otherPE:ProportionEvent =<ProportionEvent> other;
		return this.proportion.equals(otherPE.proportion);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getproportion():Proportion
	{
		return this.proportion;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setproportion_1(i1:number,i2:number):void
	{
		this.proportion = Proportion.new0(i1,i2);
	}

	public setproportion_2(p:Proportion):void
	{
		this.proportion = p;
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
		System.out.println("    Proportion: " + this.proportion.i1 + "/" + this.proportion.i2);
	}
}
