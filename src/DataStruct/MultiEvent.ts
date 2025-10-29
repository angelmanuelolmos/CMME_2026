
import { System } from '../java/lang/System';
import { Proportion } from './Proportion';
import { Pitch } from './Pitch';
import { NoteEvent } from './NoteEvent';
import { Mensuration } from './Mensuration';
import { Event } from './Event';
import { Coloration } from './Coloration';
import { ClefSet } from './ClefSet';
import { Iterator } from '../java/util/Iterator';
import { LinkedList } from '../java/util/LinkedList';

export class MultiEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	mensInfo:Mensuration = null;
	clefset:ClefSet = null;
	/* clef group */
	modernclefset:ClefSet = null;

	public static new23():MultiEvent
	{
		let _new23:MultiEvent = new MultiEvent;
		MultiEvent.set23(_new23);
		return _new23;
	}

	public static set23(new23:MultiEvent):void
	{
		Event.set0(new23);
		new23.eventtype = MultiEvent.EVENT_MULTIEVENT;
		new23.eventList = new LinkedList<Event>();
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
		let me:MultiEvent = MultiEvent.new23();
		for(let e of this.eventList)
		me.addEvent(e.createCopy_1());
		me.copyEventAttributes_1(this);
		me.constructClefSets_1(null,null);
		return me;
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

		let otherME:MultiEvent =<MultiEvent> other;
		if( this.getNumEvents() != otherME.getNumEvents())
			return false;

		for(
		let i:number = 0;i < this.getNumEvents();i ++)
		if( ! this.getEvent(i).equals_1(otherME.getEvent(i)))
			return false;

		return true;
	}

	/*------------------------------------------------------------------------
Method:    LinkedList<Event> makeModernNoteShapes()
Overrides: Event.makeModernNoteShapes
Purpose:   Make event (copy) in modern notation
Parameters:
  Input:  -
  Output: -
  Return: copy of this with modern note shape, expanded into multiple
          events if necessary
------------------------------------------------------------------------*/
	public makeModernNoteShapes_1(timePos:Proportion,measurePos:Proportion,measureMinims:number,measureProp:Proportion,timeProp:Proportion,useTies:boolean):LinkedList<Event>
	{
		let modLists:LinkedList<LinkedList<Event>> = new LinkedList<LinkedList<Event>>();
		let finalLength:number = 0;
		for(let e of this.eventList)
		{
			let el:LinkedList<Event> = e.makeModernNoteShapes_1(timePos,measurePos,measureMinims,measureProp,timeProp,useTies);
			modLists.add(el);
			if( el.size() > finalLength)
				finalLength = el.size();

		}
		let finalList:LinkedList<Event> = new LinkedList<Event>();
		while( modLists.size() > 1)
		{
			let me:MultiEvent = MultiEvent.new23();
			me.clefset = this.clefset;
			me.modernclefset = this.modernclefset;
			let removalList:LinkedList<LinkedList<Event>> = new LinkedList<LinkedList<Event>>();
			for(let el of modLists)
			{
				me.addEvent(el.remove(0));
				if( el.isEmpty())
					removalList.add(el);

			}
			for(let el of removalList)
			modLists.remove(el);
			finalList.add(me);
		}
		if( modLists.size() == 1)
			{
				let el:LinkedList<Event> = modLists.get(0);
				while( ! el.isEmpty())
				finalList.add(el.remove(0));
			}

		return finalList;
	}

	/* OK, a weird and temporary solution to get through the cases I currently
       need to deal with: simply combine the event lists 1:1 */
	/*------------------------------------------------------------------------
Method:  boolean notePitchMatches(Event other)
Purpose: Calculate whether this event's pitch(es) match(es) those of another;
         only for note events
Parameters:
  Input:  Event other - event for comparison
  Output: -
  Return: Whether pitches are equal
------------------------------------------------------------------------*/
	public notePitchMatches_1(other:Event):boolean
	{
		if( other.geteventtype() == Event.EVENT_MULTIEVENT)
			{
				for(let e of this.eventList)
				if( e.geteventtype() == Event.EVENT_NOTE)
					if( ! other.hasNotePitch_1(e.getPitch_1()))
						return false;

				for(let e of(<MultiEvent> other).eventList)
				if( e.geteventtype() == Event.EVENT_NOTE)
					if( ! this.hasNotePitch_1(e.getPitch_1()))
						return false;

				return true;
			}

		else
			{
				if( other.geteventtype() != Event.EVENT_NOTE)
					return false;

				let foundMatch:boolean = false;
				for(let e of this.eventList)
				if( e.geteventtype() == Event.EVENT_NOTE)
					if( e.notePitchMatches_1(other))
						foundMatch = true;
					else
						return false;

				return foundMatch;
			}

	}

	/* multi-event vs. multi-event */
	/* every note pitch in this must appear in other, and vice versa */
	/* multi-event vs. single event */
	public hasNotePitch_1(p:Pitch):boolean
	{
		for(let e of this.eventList)
		if( e.geteventtype() == Event.EVENT_NOTE)
			if( e.getPitch_1().equals(p))
				return true;

		return false;
	}

	/*------------------------------------------------------------------------
Methods: void calcMusicTime()
Purpose: Calculate amount of musical time taken by this (length of longest
         timed event)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	calcMusicTime():void
	{
		for(
		let i:Iterator<Event> = this.iterator_2();i.hasNext();)
		{
			let imt:Proportion =(<Event> i.next()).getmusictime();
			if( imt.greaterThan(this.musictime))
				this.musictime.setVal_1(imt);

		}
	}

	/*------------------------------------------------------------------------
Methods: void addEvent(Event e)
Purpose: Add one event to list
Parameters:
  Input:  Event e - event to add
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addEvent(e:Event):void
	{
		this.eventList.add(e);
		if( e.getmusictime().greaterThan(this.musictime))
			this.musictime.setVal_1(e.getmusictime());

		let m:Mensuration = e.getMensInfo_1();
		if( m != null)
			this.mensInfo = m;

	}

	/*------------------------------------------------------------------------
Methods: Event deleteEvent(Event e)
Purpose: Delete one event from list
Parameters:
  Input:  Event e - event to add
  Output: -
  Return: this event after deletion
------------------------------------------------------------------------*/
	public deleteEvent(e:Event):Event
	{
		this.eventList.remove(this.eventList.indexOf(e));
		if( this.eventList.size() >= 2)
			{
				if( e.getmusictime().equals(this.musictime))
					this.calcMusicTime();

				if( e.getMensInfo_1() != null)
					{
						this.mensInfo = null;
						for(
						let i:Iterator<Event> = this.iterator_2();i.hasNext();)
						{
							let m:Mensuration =(<Event> i.next()).getMensInfo_1();
							if( m != null)
								this.mensInfo = m;

						}
					}

				return this;
			}

		else
			return<Event>( this.eventList.getFirst());

	}

	/* recalculate parameters for this multi-event */
	/* no more multi-event (only one event left) */
	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public iterator_2():Iterator<Event>
	{
		return this.eventList.iterator();
	}

	public getNumEvents():number
	{
		return this.eventList.size();
	}

	public getEvent(i:number):Event
	{
		return this.eventList.get(i);
	}

	public getMensInfo_1():Mensuration
	{
		return this.mensInfo;
	}

	public hasEventType_1(etype:number):boolean
	{
		for(let e of this.eventList)
		if( e.hasEventType_1(etype))
			return true;

		return false;
	}

	public getFirstEventOfType_1(etype:number):Event
	{
		for(let e of this.eventList)
		if( e.hasEventType_1(etype))
			return e;

		return null;
	}

	public getLowestNote():NoteEvent
	{
		let lowestNote:NoteEvent = null;
		for(let e of this.eventList)
		if( e.geteventtype() == Event.EVENT_NOTE)
			{
				let ne:NoteEvent =<NoteEvent> e;
				if( lowestNote == null || lowestNote.getPitch_1().isHigherThan(ne.getPitch_1()))
					lowestNote = ne;

			}

		return lowestNote;
	}

	public hasAccidentalClef_1():boolean
	{
		for(let e of this.eventList)
		if( e.hasAccidentalClef_1())
			return true;

		return false;
	}

	public hasPrincipalClef_1():boolean
	{
		for(let e of this.eventList)
		if( e.hasPrincipalClef_1())
			return true;

		return false;
	}

	public hasSignatureClef_1():boolean
	{
		for(let e of this.eventList)
		if( e.hasSignatureClef_1())
			return true;

		return false;
	}

	public rhythmicEventType_1():number
	{
		let lastType:number = this.geteventtype();
		for(let e of this.eventList)
		if( e.geteventtype() == Event.EVENT_NOTE)
			return Event.EVENT_NOTE;
		else
			if( e.getmusictime().i1 != 0)
				lastType = e.geteventtype();

		return lastType;
	}

	/*------------------------------------------------------------------------
Method:  ClefSet getClefSet(boolean usemodernclefs)
Purpose: Returns clef set from this event
Parameters:
  Input:  boolean usemodernclefs - whether to return modern clefs
  Output: -
  Return: clef set data
------------------------------------------------------------------------*/
	public getClefSet_1():ClefSet
	{
		return this.clefset;
	}

	public getClefSet_2(usemodernclefs:boolean):ClefSet
	{
		return usemodernclefs ? this.modernclefset:this.clefset;
	}

	/*------------------------------------------------------------------------
Method:  void constructClefSets(Event le,Event cie)
Purpose: Create or modify this event's clef sets
Parameters:
  Input:  Event le  - previous event
          Event cie - clef info event
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructClefSets_1(le:Event,cie:Event):void
	{
		for(
		let i:Iterator<Event> = this.iterator_2();i.hasNext();)
		{
			let e:Event =<Event> i.next();
			if( e.geteventtype() == MultiEvent.EVENT_CLEF)
				{
					e.constructClefSets_1(le,cie);
					le = e;
				}

		}
		this.clefset = le == null ? null:le.getClefSet_2(false);
		this.modernclefset = le == null ? null:le.getClefSet_2(true);
		for(
		let i:Iterator<Event> = this.iterator_2();i.hasNext();)
		{
			let e:Event =<Event> i.next();
			if( e.geteventtype() == MultiEvent.EVENT_CLEF)
				{
					e.setClefSet_1(this.clefset,false);
					e.setClefSet_1(this.modernclefset,true);
				}

		}
		if( cie != null && ! this.clefset.getprincipalclef().isprincipalclef())
			this.addToSigClefs(cie);

	}

	/*    for (Iterator i=iterator(); i.hasNext();)
      {
        Event e=(Event)i.next();
        if (e.geteventtype()==EVENT_CLEF)
          {
            clefset=e.getClefSet(false);
            modernclefset=e.getClefSet(true);
          }
      }*/
	/* set individual events to have the same clef sets */
	//            clefset.addclef(((ClefEvent)e).getClef(false,false));
	/* mod clefset */
	/* add to clef set */
	//    if (!getClefSet().getprincipalclef().isprincipalclef())
	//    if (cie!=null)
	/*------------------------------------------------------------------------
Method:  Event noClefEvent()
Purpose: Create copy of this event with no clefs
Parameters:
  Input:  -
  Output: -
  Return: new clefless event
------------------------------------------------------------------------*/
	public noClefEvent():Event
	{
		let newEvent:MultiEvent = MultiEvent.new23();
		for(
		let i:Iterator<Event> = this.iterator_2();i.hasNext();)
		{
			let e:Event =<Event> i.next();
			if( e.geteventtype() != MultiEvent.EVENT_CLEF)
				newEvent.addEvent(e);

		}
		if( newEvent.getNumEvents() == 0)
			return null;

		if( newEvent.getNumEvents() == 1)
			return newEvent.getEvent(0);

		return newEvent;
	}

	/*------------------------------------------------------------------------
Method:  Event noSigClefEvent()
Purpose: Create copy of this event with no signature less-principal clefs
Parameters:
  Input:  -
  Output: -
  Return: new event
------------------------------------------------------------------------*/
	public noSigClefEvent():Event
	{
		let newEvent:MultiEvent = MultiEvent.new23();
		let le:Event = null;
		for(
		let i:Iterator<Event> = this.iterator_2();i.hasNext();)
		{
			let e:Event =<Event> i.next();
			if( e.geteventtype() != MultiEvent.EVENT_CLEF || e.hasPrincipalClef_1())
				{
					newEvent.addEvent(e);
					if( e.hasPrincipalClef_1())
						le = e;

				}

		}
		if( newEvent.getNumEvents() == 0)
			return null;

		if( newEvent.getNumEvents() == 1)
			return newEvent.getEvent(0);

		newEvent.clefset = le == null ? null:le.getClefSet_2(false);
		newEvent.modernclefset = le == null ? null:le.getClefSet_2(true);
		return newEvent;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setClefSet_1(cs:ClefSet,usemodernclefs:boolean):void
	{
		if( ! usemodernclefs)
			this.clefset = cs;
		else
			this.modernclefset = cs;

	}

	/*------------------------------------------------------------------------
Method:  void set*params
Purpose: Sets music parameters current at this event (clef, mensuration)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setmensparams_1(me:Event):void
	{
		for(
		let i:Iterator<Event> = this.iterator_2();i.hasNext();)
		(<Event> i.next()).setmensparams_1(me);
	}

	public setcolorparams_1(c:Coloration):void
	{
		for(
		let i:Iterator<Event> = this.iterator_2();i.hasNext();)
		(<Event> i.next()).setcolorparams_1(c);
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
		System.out.println("   Multi-Event begin");
		for(
		let i:Iterator<Event> = this.iterator_2();i.hasNext();)
		(<Event> i.next()).prettyprint_1();
		System.out.println("   Multi-Event end");
	}
}
