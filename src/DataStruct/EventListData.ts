
import { System } from '../java/lang/System';
import { ProportionEvent } from './ProportionEvent';
import { Proportion } from './Proportion';
import { OriginalTextEvent } from './OriginalTextEvent';
import { NoteEvent } from './NoteEvent';
import { MultiEvent } from './MultiEvent';
import { ModernKeySignatureEvent } from './ModernKeySignatureEvent';
import { ModernKeySignature } from './ModernKeySignature';
import { Event } from './Event';
import { ColorChangeEvent } from './ColorChangeEvent';
import { Coloration } from './Coloration';
import { ArrayList } from '../java/util/ArrayList';
import { Iterator } from '../java/util/Iterator';

export class EventListData
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	/* music events */
	events:ArrayList<Event>;

	public static new0():EventListData
	{
		let _new0:EventListData = new EventListData;
		EventListData.set0(_new0);
		return _new0;
	}

	public static set0(new0:EventListData):void
	{
		new0.initParams_1();
	}

	/*------------------------------------------------------------------------
Method:  EventListData createCopy()
Purpose: Copy list with new copies of events
Parameters:
  Input:  -
  Output: -
  Return: list duplicating this one with copied events
------------------------------------------------------------------------*/
	public createCopy():EventListData
	{
		let newELD:EventListData = EventListData.new0();
		for(let e of this.events)
		newELD.addEvent_1(e.createCopy_1());
		return newELD;
	}

	/*------------------------------------------------------------------------
Method:  void initParams()
Purpose: Initialize basic parameters
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	initParams_1():void
	{
		this.events = new ArrayList<Event>();
	}

	/*------------------------------------------------------------------------
Method:  void setVoiceParams(Event e)
Purpose: Update voice parameter variables after adding a new event
Parameters:
  Input:  Event e - event just added
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setVoiceParams_1(e:Event):void
	{
	}

	/*------------------------------------------------------------------------
Method:  void addEvent(Event e)
Purpose: Add event to this voice's list (at end)
Parameters:
  Input:  Event e - event to add
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addEvent_1(e:Event):void
	{
		this.events.add(e);
	}

	/*------------------------------------------------------------------------
Method:  void addEvent(int i,Event e)
Purpose: Add event to this voice's list (at specified location)
Parameters:
  Input:  int i   - index of location for addition
          Event e - event to add
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addEvent_2(i:number,e:Event):void
	{
		this.events.add(i,e);
	}

	/*------------------------------------------------------------------------
Method:  Event deleteEvent(int i)
Purpose: Remove event from this voice's list
Parameters:
  Input:  int i - index of event to delete
  Output: -
  Return: deleted Event
------------------------------------------------------------------------*/
	public deleteEvent_1(i:number):Event
	{
		let deletedEvent:Event = this.events.get(i);
		this.events.remove(i);
		return deletedEvent;
	}

	public deleteEvent_2(e:Event):Event
	{
		this.events.remove(e);
		return e;
	}

	/*------------------------------------------------------------------------
Method:  void truncateEvents(int deletionPoint)
Purpose: Truncate event list at a given point
Parameters:
  Input:  int deletionPoint - index of first event to delete
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public truncateEvents_1(deletionPoint:number):void
	{
		for(
		let i:number =(( this.events.size() - 1) | 0);i >= deletionPoint;i --)
		this.events.remove(i);
	}

	/*------------------------------------------------------------------------
Method:  int calcIndexWithinReading(int i)
Purpose: Calculate "sub-index" for event within a variant reading
Parameters:
  Input:  int i - index of event
  Output: -
  Return: index within variant reading's event list
------------------------------------------------------------------------*/
	public calcIndexWithinReading(i:number):number
	{
		let ri:number = 0;
		let ve:Event = null;
		do
		{
			ri ++;
			ve = this.getEvent(-- i);
		}
		while( ve != null && ve.geteventtype() != Event.EVENT_VARIANTDATA_START);
		return(( ri - 1) | 0);
	}

	/* index for event within reading */
	/*------------------------------------------------------------------------
Method:  void recalcEventParams([EventListData lastv,Event paramEvent])
Purpose: Recalculate event attributes based on parameters (clef, mensuration
         info, etc)
Parameters:
  Input:  EventListData lastv - previous section of this voice
          Event paramEvent    - event containing starting parameters
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public recalcEventParams_1():void
	{
		this.recalcEventParams_2(<EventListData> null);
	}

	public recalcEventParams_2(lastv:EventListData):void
	{
		if( this.events.size() == 0)
			return;

		let paramEvent:Event = lastv == null ? this.getEvent(0):lastv.getEvent((( lastv.getNumEvents() - 1) | 0));
		this.recalcEventParams_3(paramEvent,paramEvent.getcoloration());
	}

	public recalcEventParams_3(paramEvent:Event,curcolor:Coloration):void
	{
		if( this.events.size() == 0)
			return;

		let lastevent:Event = null;
		let clefinfoevent:Event = paramEvent.getClefInfoEvent();
		let mensinfoevent:Event = paramEvent.getMensInfoEvent();
		let curProportion:Proportion = paramEvent.getProportion();
		let curModKeySig:ModernKeySignature = paramEvent.getModernKeySig();
		let displayEditorial:boolean = false;
		let listPlace:number = 0;
		for(let curevent of this.events)
		{
			if( curevent.hasSignatureClef_1())
				{
					if( curevent.hasPrincipalClef_1())
						lastevent = null;

					curevent.constructClefSets_1(lastevent,clefinfoevent);
					clefinfoevent = curevent;
					curModKeySig = curevent.getClefSet_1().getKeySig();
				}

			if( curevent.getMensInfo_1() != null)
				mensinfoevent = curevent;

			if( curevent.geteventtype() == Event.EVENT_COLORCHANGE)
				curcolor = Coloration.new1(curcolor,(<ColorChangeEvent> curevent).getcolorscheme());
			else
				if( curevent.geteventtype() == Event.EVENT_MODERNKEYSIGNATURE)
					curModKeySig =(<ModernKeySignatureEvent> curevent).getSigInfo();
				else
					if( curevent.geteventtype() == Event.EVENT_PROPORTION)
						curProportion =(<ProportionEvent> curevent).getProportion();
					else
						if( curevent.geteventtype() == Event.EVENT_LACUNA)
							displayEditorial = true;
						else
							if( curevent.geteventtype() == Event.EVENT_LACUNA_END)
								displayEditorial = false;

			curevent.setclefparams(clefinfoevent);
			curevent.setmensparams_1(mensinfoevent);
			curevent.setcolorparams_1(curcolor);
			curevent.setModernKeySigParams(curModKeySig);
			curevent.setProportion(curProportion);
			curevent.setDisplayEditorial(displayEditorial);
			lastevent = curevent;
		}
	}

	/*------------------------------------------------------------------------
Method:  Event getEvent(int i)
Purpose: Return event from list
Parameters:
  Input:  int i - index of event to return
  Output: -
  Return: event
------------------------------------------------------------------------*/
	public getEvent(i:number):Event
	{
		if( i >= 0 && i < this.events.size())
			return this.events.get(i);
		else
			return null;

	}

	public getEvents():ArrayList<Event>
	{
		return this.events;
	}

	/*------------------------------------------------------------------------
Method:  int getNextEventOfType(int evType,int i,int dir)
Purpose: Return index of next event from list of a given type
Parameters:
  Input:  int evType - event type to find
          int i      - index of event to begin search
          int dir    - direction to search (1=forward,-1=backwards)
  Output: -
  Return: event index (-1 if not found)
------------------------------------------------------------------------*/
	public getNextEventOfType(evType:number,i:number,dir:number):number
	{
		for(
		;i >= 0 && i < this.events.size();i += dir)
		if( this.getEvent(i).geteventtype() == evType)
			return i;

		return - 1;
	}

	/* is there a text-only variant at the indicated location? return it if so */
	public getOrigTextOnlyVariant(ei:number):Event
	{
		if( ei >=(( this.events.size() - 2) | 0) || this.getEvent(ei).geteventtype() != Event.EVENT_VARIANTDATA_START || this.getEvent((( ei + 2) | 0)).geteventtype() != Event.EVENT_VARIANTDATA_END)
			return null;

		let te:Event = this.getEvent((( ei + 1) | 0));
		return( te.geteventtype() == Event.EVENT_ORIGINALTEXT) ? te:null;
	}

	/*------------------------------------------------------------------------
Method:  String [orig|mod]TextToStr()
Purpose: Create string containing all texting (original or modern) in list
Parameters:
  Input:  -
  Output: -
  Return: string with all original text, phrases delimited by markers
          according to style (@ for original phrases, - and space for
          modern syllables)
------------------------------------------------------------------------*/
	public origTextToStr():string
	{
		let text:string = "";
		for(
		let ei:number = this.getNextEventOfType(Event.EVENT_ORIGINALTEXT,0,1);ei != - 1;ei = this.getNextEventOfType(Event.EVENT_ORIGINALTEXT,(( ei + 1) | 0),1))
		text +=(<OriginalTextEvent> this.getEvent(ei)).getText() + "@";
		if( text.length > 0)
			text = text.substring(0,(( text.length - 1) | 0));

		return text;
	}

	public modTextToStr():string
	{
		let text:string = "";
		for(
		let ei:number = 0;ei < this.getNumEvents();ei ++)
		{
			let e:Event = this.getEvent(ei);
			switch( e.geteventtype())
			{
				case Event.EVENT_NOTE:
				{
					text = this.addNoteTextToStr(<NoteEvent> e,text);
					break;
				}
				case Event.EVENT_MULTIEVENT:
				{
					for(
					let i:Iterator<Event> =(<MultiEvent> e).iterator_2();i.hasNext();)
					{
						let e1:Event =<Event> i.next();
						if( e1.geteventtype() == Event.EVENT_NOTE)
							text = this.addNoteTextToStr(<NoteEvent> e1,text);

					}
					break;
				}
			}
		}
		if( text.length > 0)
			text = text.substring(0,(( text.length - 1) | 0));

		return text;
	}

	addNoteTextToStr(ne:NoteEvent,s:string):string
	{
		let noteText:string = ne.getModernText();
		if( noteText == null)
			return s;

		s += noteText +( ne.isWordEnd() ? " ":"-");
		return s;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getNumEvents():number
	{
		return this.events.size();
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Prints information about this voice
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public prettyprint_1():void
	{
		System.out.println("  Events:");
		for(let e of this.events)
		e.prettyprint_1();
	}
}
