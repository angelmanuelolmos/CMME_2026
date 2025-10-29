
import { System } from '../java/lang/System';
import { VariantVersionData } from './VariantVersionData';
import { Event } from './Event';

/*----------------------------------------------------------------------*/
/*

        Module          : OriginalTextEvent.java

        Package         : DataStruct

        Classes Included: OriginalTextEvent

        Purpose         : Event type for old-style text phrases

        Programmer      : Ted Dumitrescu

        Date Started    : 9/8/06

        Updates         :
11/28/08: added variant version info (for multi-text display)

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   OriginalTextEvent
Extends: Event
Purpose: Data/routines for original text events
------------------------------------------------------------------------*/
export class OriginalTextEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	text:string;
	variantVersion:VariantVersionData;

	public static new27(t:string,variantVersion:VariantVersionData):OriginalTextEvent
	{
		let _new27:OriginalTextEvent = new OriginalTextEvent;
		OriginalTextEvent.set27(_new27,t,variantVersion);
		return _new27;
	}

	public static set27(new27:OriginalTextEvent,t:string,variantVersion:VariantVersionData):void
	{
		new27.eventtype = OriginalTextEvent.EVENT_ORIGINALTEXT;
		new27.text = t;
		new27.variantVersion = variantVersion;
	}

	public static new28(t:string):OriginalTextEvent
	{
		let _new28:OriginalTextEvent = new OriginalTextEvent;
		OriginalTextEvent.set28(_new28,t);
		return _new28;
	}

	public static set28(new28:OriginalTextEvent,t:string):void
	{
		OriginalTextEvent.set27(new28,t,null);
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
		let e:Event = OriginalTextEvent.new28(this.text);
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

		let otherOTE:OriginalTextEvent =<OriginalTextEvent> other;
		return( this.text == otherOTE.text);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getText():string
	{
		return this.text;
	}

	public getVariantVersion():VariantVersionData
	{
		return this.variantVersion;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setText(t:string):void
	{
		this.text = t;
	}

	public setVariantVersion(variantVersion:VariantVersionData):void
	{
		this.variantVersion = variantVersion;
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
		System.out.println("    Original text: " + this.text);
	}
}
