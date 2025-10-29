
import { System } from '../java/lang/System';
import { Event } from './Event';
import { Coloration } from './Coloration';

/*----------------------------------------------------------------------*/
/*

        Module          : ColorChangeEvent.java

        Package         : DataStruct

        Classes Included: ColorChangeEvent

        Purpose         : Event type for coloration changes

        Programmer      : Ted Dumitrescu

        Date Started    : 9/13/05

        Updates         :

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   ColorChangeEvent
Extends: Event
Purpose: Data/routines for coloration-change events
------------------------------------------------------------------------*/
export class ColorChangeEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	newcolor:Coloration;

	public static new8(nc:Coloration):ColorChangeEvent
	{
		let _new8:ColorChangeEvent = new ColorChangeEvent;
		ColorChangeEvent.set8(_new8,nc);
		return _new8;
	}

	public static set8(new8:ColorChangeEvent,nc:Coloration):void
	{
		Event.set0(new8);
		new8.eventtype = ColorChangeEvent.EVENT_COLORCHANGE;
		new8.newcolor = nc;
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
		let e:Event = ColorChangeEvent.new8(Coloration.new2(this.newcolor));
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

		let otherCCE:ColorChangeEvent =<ColorChangeEvent> other;
		return this.newcolor.equals(otherCCE.newcolor);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getcolorscheme():Coloration
	{
		return this.newcolor;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setcolorscheme(nc:Coloration):void
	{
		this.newcolor = nc;
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
		System.out.print("    Color change: ");
		this.newcolor.prettyprint();
	}
}
