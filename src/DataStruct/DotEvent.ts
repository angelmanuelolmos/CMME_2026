
import { System } from '../java/lang/System';
import { Pitch } from './Pitch';
import { NoteEvent } from './NoteEvent';
import { Event } from './Event';
import { Clef } from './Clef';

/*----------------------------------------------------------------------*/
/*

        Module          : DotEvent.java

        Package         : DataStruct

        Classes Included: DotEvent

        Purpose         : Dot event type

        Programmer      : Ted Dumitrescu

        Date Started    : 1/99

        Updates:
4/99:    cleaned up, consolidated with Gfx code
4/24/99: added spacenum parameter
5/6/05:  began adding type information
2/9/08:  added note parameter
7/7/08:  changed staff location to Pitch basis

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   DotEvent
Extends: Event
Purpose: Data/routines for dot events
------------------------------------------------------------------------*/
export class DotEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	/* dot type flags */
	public static DT_Addition:number = 1;
	/* 001 */
	public static DT_Division:number = 2;
	/* 010 */
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	dottype:number;
	staffLoc:Pitch;
	note:NoteEvent;

	public static new10(dt:number,p:Pitch,ne:NoteEvent):DotEvent
	{
		let _new10:DotEvent = new DotEvent;
		DotEvent.set10(_new10,dt,p,ne);
		return _new10;
	}

	public static set10(new10:DotEvent,dt:number,p:Pitch,ne:NoteEvent):void
	{
		Event.set0(new10);
		new10.eventtype = DotEvent.EVENT_DOT;
		new10.staffLoc = p;
		new10.dottype = dt;
		new10.note = ne;
	}

	public static new11(p:Pitch,ne:NoteEvent):DotEvent
	{
		let _new11:DotEvent = new DotEvent;
		DotEvent.set11(_new11,p,ne);
		return _new11;
	}

	public static set11(new11:DotEvent,p:Pitch,ne:NoteEvent):void
	{
		DotEvent.set10(new11,DotEvent.DT_Addition,p,ne);
	}

	public static new12(p:Pitch):DotEvent
	{
		let _new12:DotEvent = new DotEvent;
		DotEvent.set12(_new12,p);
		return _new12;
	}

	public static set12(new12:DotEvent,p:Pitch):void
	{
		DotEvent.set10(new12,DotEvent.DT_Addition,p,null);
	}

	/*  public DotEvent(int dt,int i)
  {
    this(dt,i,null);
  }

  public DotEvent(int dt,int i,NoteEvent ne)
  {
    this.eventtype=EVENT_DOT;
    this.spacenum=i;
    this.dottype=dt;
    this.note=ne;
  }

  public DotEvent(int i,NoteEvent ne)
  {
    this(DT_Addition,i,ne);
  }

  public DotEvent(int i)
  {
    this(i,null);
  }*/
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
		let e:Event = DotEvent.new10(this.dottype,Pitch.new3(this.staffLoc),null);
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

		let otherDE:DotEvent =<DotEvent> other;
		return this.dottype == otherDE.dottype && this.staffLoc.equals(otherDE.staffLoc);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getdottype():number
	{
		return this.dottype;
	}

	public getNote():NoteEvent
	{
		return this.note;
	}

	public getPitch_1():Pitch
	{
		return this.staffLoc;
	}

	public calcYPos(c:Clef):number
	{
		return this.staffLoc.calcypos(c);
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setNote(n:NoteEvent):void
	{
		this.note = n;
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
		System.out.println("    Dot: " + this.staffLoc);
	}
}
