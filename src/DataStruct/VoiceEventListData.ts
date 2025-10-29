
import { System } from '../java/lang/System';
import { Voice } from './Voice';
import { VariantVersionData } from './VariantVersionData';
import { MusicSection } from './MusicSection';
import { EventListData } from './EventListData';
import { Event } from './Event';
import { ArrayList } from '../java/util/ArrayList';
import { Iterator } from '../java/util/Iterator';

export abstract class VoiceEventListData extends EventListData
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	metaData:Voice;
	section:MusicSection;
	missingVersions:ArrayList<VariantVersionData>;

	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Method:  void initParams(Voice v,MusicSection section)
Purpose: Initialize basic parameters
Parameters:
  Input:  Voice v              - voice metadata
          MusicSection section - section data
  Output: -
  Return: -
------------------------------------------------------------------------*/
	initParams_2(v:Voice,section:MusicSection):void
	{
		this.metaData = v;
		this.section = section;
		this.missingVersions = new ArrayList<VariantVersionData>();
		super.initParams_1();
	}

	initParams_1():void
	{
		this.metaData = null;
		this.section = null;
		this.missingVersions = new ArrayList<VariantVersionData>();
		super.initParams_1();
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
		let listPlace:number = this.events.size();
		if( this.isDefaultVersion())
			e.setDefaultListPlace(listPlace);
		else
			e.setListPlace(listPlace);

		super.addEvent_1(e);
		this.setVoiceParams_1(e);
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
		let addedEvent:Event = e;
		let listPlace:number = i;
		if( this.isDefaultVersion())
			e.setDefaultListPlace(listPlace);
		else
			e.setListPlace(listPlace);

		super.addEvent_2(i,e);
		this.setVoiceParams_1(e);
		if( this.section.isDefaultVersion())
			{
				e.setDefaultListPlace(listPlace);
				for(
				let li:Iterator<Event> = this.events.listIterator((( listPlace + 1) | 0));li.hasNext();)
				{
					e =<Event> li.next();
					e.setDefaultListPlace((( e.getDefaultListPlace() + 1) | 0));
				}
			}

		else
			for(
			let li:Iterator<Event> = this.events.listIterator((( i + 1) | 0));li.hasNext();)
			{
				e =<Event> li.next();
				e.setListPlace(++ i);
			}

		e.setcolorparams_1(this.section.getBaseColoration());
		if( addedEvent.hasSignatureClef_1() || addedEvent.getMensInfo_1() != null || addedEvent.geteventtype() == Event.EVENT_COLORCHANGE || addedEvent.geteventtype() == Event.EVENT_LACUNA || addedEvent.geteventtype() == Event.EVENT_LACUNA_END || addedEvent.geteventtype() == Event.EVENT_MODERNKEYSIGNATURE || addedEvent.geteventtype() == Event.EVENT_VARIANTDATA_START || addedEvent.geteventtype() == Event.EVENT_VARIANTDATA_END)
			this.recalcEventParams_1();

	}

	/*------------------------------------------------------------------------
Method:  Event deleteEvent(int i[,VoiceEventListData lastv])
Purpose: Remove event from this voice's list
Parameters:
  Input:  int i                    - index of event to delete
          VoiceEventListData lastv - previous section of this voice
  Output: -
  Return: deleted Event
------------------------------------------------------------------------*/
	public deleteEvent_1(i:number):Event
	{
		return this.deleteEvent_3(i,null);
	}

	public deleteEvent_3(i:number,lastv:VoiceEventListData):Event
	{
		let e:Event;
		let deletedEvent:Event = super.deleteEvent_1(i);
		if( this.isDefaultVersion())
			for(
			let li:Iterator<Event> = this.events.listIterator(i);li.hasNext();)
			{
				e =<Event> li.next();
				e.setDefaultListPlace((( e.getDefaultListPlace() - 1) | 0));
			}

		else
			for(
			let li:Iterator<Event> = this.events.listIterator(i);li.hasNext();)
			{
				e =<Event> li.next();
				e.setListPlace((( e.getListPlace(false) - 1) | 0));
			}

		if( deletedEvent.hasSignatureClef_1() || deletedEvent.getMensInfo_1() != null || deletedEvent.geteventtype() == Event.EVENT_COLORCHANGE || deletedEvent.geteventtype() == Event.EVENT_LACUNA || deletedEvent.geteventtype() == Event.EVENT_LACUNA_END || deletedEvent.geteventtype() == Event.EVENT_MODERNKEYSIGNATURE || deletedEvent.geteventtype() == Event.EVENT_VARIANTDATA_START || deletedEvent.geteventtype() == Event.EVENT_VARIANTDATA_END)
			this.recalcEventParams_2(lastv);

		return deletedEvent;
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
		super.truncateEvents_1(deletionPoint);
		this.addEvent_1(Event.new1(Event.EVENT_SECTIONEND));
		this.recalcEventParams_1();
	}

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
	public recalcEventParams_2(lastv:EventListData):void
	{
		if( this.events.size() == 0)
			return;

		let paramEvent:Event = lastv == null ? this.getEvent(0):lastv.getEvent((( lastv.getNumEvents() - 1) | 0));
		this.recalcEventParams_4(paramEvent);
	}

	public recalcEventParams_4(paramEvent:Event):void
	{
		if( this.events.size() == 0)
			return;

		super.recalcEventParams_3(paramEvent,this.section.getBaseColoration());
		let listPlace:number = 0;
		for(let curevent of this.events)
		if( this.isDefaultVersion())
			curevent.setDefaultListPlace(listPlace ++);
		else
			curevent.setListPlace(listPlace ++);

	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getMetaData():Voice
	{
		return this.metaData;
	}

	public getMissingVersions():ArrayList<VariantVersionData>
	{
		return this.missingVersions;
	}

	public getSection():MusicSection
	{
		return this.section;
	}

	public getVoiceNum():number
	{
		return this.metaData.getNum();
	}

	public isDefaultVersion():boolean
	{
		return this.section == null ? false:this.section.isDefaultVersion();
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setMetaData(md:Voice):void
	{
		this.metaData = md;
	}

	public addMissingVersion(vvd:VariantVersionData):void
	{
		this.missingVersions.add(vvd);
	}

	public removeMissingVersion(vvd:VariantVersionData):void
	{
		this.missingVersions.remove(vvd);
	}

	public setMissingVersions(missingVersions:ArrayList<VariantVersionData>):void
	{
		this.missingVersions = missingVersions;
	}

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
		System.out.println("Voice " + this.metaData.getNum() + ":");
		super.prettyprint_1();
	}
}
