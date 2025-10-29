
import { System } from '../java/lang/System';
import { Event } from './Event';

/*----------------------------------------------------------------------*/
/*

        Module          : BarlineEvent.java

        Package         : DataStruct

        Classes Included: BarlineEvent

        Purpose         : Event type for barlines

        Programmer      : Ted Dumitrescu

        Date Started    : 9/23/05

        Updates         :
11/10/07: added attributes repeatSign, bottomLinePos, and numSpaces

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   BarlineEvent
Extends: Event
Purpose: Data/routines for barline events
------------------------------------------------------------------------*/
export class BarlineEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	numLines:number;
	bottomLinePos:number;
	numSpaces:number;
	repeatSign:boolean;

	public static new4():BarlineEvent
	{
		let _new4:BarlineEvent = new BarlineEvent;
		BarlineEvent.set4(_new4);
		return _new4;
	}

	public static set4(new4:BarlineEvent):void
	{
		BarlineEvent.set5(new4,1,false,0,4);
	}

	public static new5(nl:number,repeatSign:boolean,bottomLinePos:number,numSpaces:number):BarlineEvent
	{
		let _new5:BarlineEvent = new BarlineEvent;
		BarlineEvent.set5(_new5,nl,repeatSign,bottomLinePos,numSpaces);
		return _new5;
	}

	public static set5(new5:BarlineEvent,nl:number,repeatSign:boolean,bottomLinePos:number,numSpaces:number):void
	{
		Event.set0(new5);
		new5.eventtype = BarlineEvent.EVENT_BARLINE;
		new5.numLines = nl;
		new5.repeatSign = repeatSign;
		new5.bottomLinePos = bottomLinePos;
		new5.numSpaces = numSpaces;
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
		let e:Event = BarlineEvent.new5(this.numLines,this.repeatSign,this.bottomLinePos,this.numSpaces);
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

		let otherBE:BarlineEvent =<BarlineEvent> other;
		return this.numLines == otherBE.numLines && this.repeatSign == otherBE.repeatSign && this.bottomLinePos == otherBE.bottomLinePos && this.numSpaces == otherBE.numSpaces;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getBottomLinePos():number
	{
		return this.bottomLinePos;
	}

	public getNumLines():number
	{
		return this.numLines;
	}

	public getNumSpaces():number
	{
		return this.numSpaces;
	}

	public isRepeatSign():boolean
	{
		return this.repeatSign;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setBottomLinePos(bottomLinePos:number):void
	{
		this.bottomLinePos = bottomLinePos;
	}

	public setNumLines(numLines:number):void
	{
		this.numLines = numLines;
	}

	public setNumSpaces(numSpaces:number):void
	{
		this.numSpaces = numSpaces;
	}

	public setRepeatSign(repeatSign:boolean):void
	{
		this.repeatSign = repeatSign;
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
		System.out.println("    Barlines: " + this.numLines);
	}
}
