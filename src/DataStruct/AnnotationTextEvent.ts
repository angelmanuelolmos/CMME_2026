
import { System } from '../java/lang/System';
import { Event } from './Event';

/*----------------------------------------------------------------------*/
/*

        Module          : AnnotationTextEvent.java

        Package         : DataStruct

        Classes Included: AnnotationTextEvent

        Purpose         : Event type for text annotations

        Programmer      : Ted Dumitrescu

        Date Started    : 9/26/05

        Updates         :

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   AnnotationTextEvent
Extends: Event
Purpose: Data/routines for text annotation events
------------------------------------------------------------------------*/
export class AnnotationTextEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static DEFAULT_STAFFLOC:number = - 3;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	text:string;
	staffloc:number;

	public static new2(t:string,sl:number):AnnotationTextEvent
	{
		let _new2:AnnotationTextEvent = new AnnotationTextEvent;
		AnnotationTextEvent.set2(_new2,t,sl);
		return _new2;
	}

	public static set2(new2:AnnotationTextEvent,t:string,sl:number):void
	{
		Event.set0(new2);
		new2.eventtype = AnnotationTextEvent.EVENT_ANNOTATIONTEXT;
		new2.text = t;
		new2.staffloc = sl;
	}

	public static new3(t:string):AnnotationTextEvent
	{
		let _new3:AnnotationTextEvent = new AnnotationTextEvent;
		AnnotationTextEvent.set3(_new3,t);
		return _new3;
	}

	public static set3(new3:AnnotationTextEvent,t:string):void
	{
		Event.set0(new3);
		new3.eventtype = AnnotationTextEvent.EVENT_ANNOTATIONTEXT;
		new3.text = t;
		new3.staffloc = AnnotationTextEvent.DEFAULT_STAFFLOC;
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
		let e:Event = AnnotationTextEvent.new2(this.text,this.staffloc);
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

		let otherATE:AnnotationTextEvent =<AnnotationTextEvent> other;
		return( this.text == otherATE.text) && this.staffloc == otherATE.staffloc;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public gettext():string
	{
		return this.text;
	}

	public getstaffloc():number
	{
		return this.staffloc;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public settext(t:string):void
	{
		this.text = t;
	}

	public setstaffloc(sl:number):void
	{
		this.staffloc = sl;
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
		System.out.println("    Text annotation: " + this.text);
	}
}
