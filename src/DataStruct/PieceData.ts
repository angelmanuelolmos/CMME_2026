
import { System } from '../java/lang/System';
import { Integer } from '../java/lang/Integer';
import { VoiceEventListData } from './VoiceEventListData';
import { Voice } from './Voice';
import { VariantVersionData } from './VariantVersionData';
import { VariantReading } from './VariantReading';
import { VariantMarkerEvent } from './VariantMarkerEvent';
import { Proportion } from './Proportion';
import { NoteEvent } from './NoteEvent';
import { MusicSection } from './MusicSection';
import { Mensuration } from './Mensuration';
import { EventLocation } from './EventLocation';
import { Event } from './Event';
import { Coloration } from './Coloration';
import { ArrayList } from '../java/util/ArrayList';
import { List } from '../java/util/List';
import { LinkedList } from '../java/util/LinkedList';

export class PieceData
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	title:string;
	section:string;
	composer:string;
	editor:string;
	publicNotes:string;
	notes:string;
	fullTitle:string;
	isIncipit:boolean = false;
	baseColoration:Coloration = Coloration.DEFAULT_COLORATION;
	baseMensuration:Mensuration = Mensuration.DEFAULT_MENSURATION;
	voiceData:Voice[];
	musicSections:ArrayList<MusicSection>;
	variantVersions:ArrayList<VariantVersionData>;
	variantReadings:ArrayList<VariantReading>;
	curVersion:VariantVersionData;
	defaultMusicData:PieceData;

	public static new0():PieceData
	{
		let _new0:PieceData = new PieceData;
		PieceData.set0(_new0);
		return _new0;
	}

	public static set0(new0:PieceData):void
	{
		new0.defaultMusicData = new0;
		new0.musicSections = new ArrayList<MusicSection>();
		new0.variantVersions = new ArrayList<VariantVersionData>();
		new0.variantReadings = new ArrayList<VariantReading>();
		new0.curVersion = null;
	}

	public static new1(other:PieceData):PieceData
	{
		let _new1:PieceData = new PieceData;
		PieceData.set1(_new1,other);
		return _new1;
	}

	public static set1(new1:PieceData,other:PieceData):void
	{
		new1.defaultMusicData = other;
		new1.setGeneralData(other.title,other.section,other.composer,other.editor,other.publicNotes,other.notes);
		new1.baseColoration = other.baseColoration;
		new1.baseMensuration = other.baseMensuration;
		new1.voiceData = other.voiceData;
		new1.musicSections = other.musicSections;
		new1.variantVersions = other.variantVersions;
		new1.variantReadings = other.variantReadings;
		new1.curVersion = null;
	}

	/*------------------------------------------------------------------------
Method:  void setGeneralData(String t,String st,String c,String e,String publicNotes,String notes)
Purpose: Set values for general data
Parameters:
  Input:  String t           - title
          String st          - section title
          String c           - composer
          String e           - editor
          String publicNotes - public notes
          String notes       - private notes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setGeneralData(t:string,st:string,c:string,e:string,publicNotes:string,notes:string):void
	{
		this.title = t;
		this.composer = c;
		this.editor = e;
		if( st != null && !( st == ""))
			this.section = st;
		else
			this.section = null;

		this.publicNotes = publicNotes;
		this.notes = notes;
		this.createFullTitle();
	}

	/*------------------------------------------------------------------------
Method:  void createFullTitle()
Purpose: Recalculate full display title for score
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	createFullTitle():void
	{
		this.fullTitle = this.title;
		if( this.section != null)
			this.fullTitle += ": " + this.section;

		if( this.isIncipit)
			this.fullTitle += " (incipit)";

	}

	/*------------------------------------------------------------------------
Method:  void recalcAllEventParams()
Purpose: Recalculate event attributes based on parameters (clef, mensuration
         info) for all voices in all sections
Parameters:
  Input:  -
  Output: -
  Return: this
------------------------------------------------------------------------*/
	public recalcAllEventParams():PieceData
	{
		let v:VoiceEventListData[]= Array(this.voiceData.length);
		for(
		let vi:number = 0;vi < v.length;vi ++)
		v[vi]= null;
		for(let s of this.musicSections)
		{
			s.recalcAllEventParams_1(v);
			for(
			let vi:number = 0;vi < this.voiceData.length;vi ++)
			{
				let tmpv:VoiceEventListData = s.getVoice_1(vi);
				if( tmpv != null)
					v[vi]= tmpv;

			}
		}
		return this;
	}

	/*------------------------------------------------------------------------
Method:  void addVariantVersion(VariantVersionData newVersion)
Purpose: Add variant version declaration to list
Parameters:
  Input:  VariantVersionData newVersion - version to add
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addVariantVersion(newVersion:VariantVersionData):void
	{
		if( this.variantVersions.size() == 0)
			newVersion.setDefault(true);

		this.variantVersions.add(newVersion);
	}

	/*------------------------------------------------------------------------
Method:  void addSection([int si,]MusicSection newSection)
Purpose: Add section to list
Parameters:
  Input:  int si                  - index of location to insert new section
          MusicSection newSection - section to add
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addSection_1(si:number,newSection:MusicSection):void
	{
		this.musicSections.add(si,newSection);
	}

	public addSection_2(newSection:MusicSection):void
	{
		this.addSection_1(this.getNumSections(),newSection);
	}

	/*------------------------------------------------------------------------
Method:  void deleteSection(int si)
Purpose: Remove section from list
Parameters:
  Input:  int si - index of section to delete
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public deleteSection(si:number):void
	{
		this.musicSections.remove(si);
		this.recalcAllEventParams();
	}

	/*------------------------------------------------------------------------
Method:  void addEvent(int snum,int vnum,int i,Event e)
Purpose: Insert event in one section and update parameters throughout score
Parameters:
  Input:  int snum,vnum - section and voice number
          int i         - index in voice's event list for new event
          Event e       - new event
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addEvent(snum:number,vnum:number,i:number,e:Event):void
	{
		let v:VoiceEventListData = this.getSection(snum).getVoice_1(vnum);
		let lastv:VoiceEventListData = v;
		v.addEvent_2(i,e);
		for(
		snum ++;snum < this.getNumSections();snum ++)
		{
			v = this.getSection(snum).getVoice_1(vnum);
			if( v != null)
				{
					v.recalcEventParams_2(lastv);
					lastv = v;
				}

		}
	}

	/*------------------------------------------------------------------------
Method:  int addVariantEvent(VariantVersionData vvd,int snum,int vnum,int vi,int di,Event e)
Purpose: Insert event in one variant version
Parameters:
  Input:  VariantVersionData vvd - variant version for insertion
          PieceData vmd          - variant music data
          int snum,vnum          - section and voice number
          int vi                 - index in variant voice event list
          int di                 - index in default voice event list
          Event e                - new event
  Output: -
  Return: positioning of new event within reading (beginning, end, middle)
------------------------------------------------------------------------*/
	public addVariantEvent(vvd:VariantVersionData,vmd:PieceData,snum:number,vnum:number,vi:number,di:number,e:Event):number
	{
		let v:VoiceEventListData = vmd.getSection(snum).getVoice_1(vnum);
		let prevEvent:Event = v.getEvent((( vi - 1) | 0));
		let nextEvent:Event = v.getEvent(vi);
		let prevEventReading:VariantReading = prevEvent != null ? prevEvent.getVariantReading_1(vvd):null;
		let nextEventReading:VariantReading = nextEvent.getVariantReading_1(vvd);
		let vm1:VariantMarkerEvent;
		let vm2:VariantMarkerEvent;
		if( prevEventReading != null && prevEventReading == nextEventReading)
			{
				if( prevEventReading.getVersions().size() > 1)
					return this.addEventInVersion(vvd,vmd,snum,vnum,vi,di,e);

				prevEventReading.addEvent_2(v.calcIndexWithinReading(vi),e);
				return VariantReading.MIDDLE;
			}

		let newReading:VariantReading = VariantReading.new0();
		newReading.addVersion(vvd);
		this.variantReadings.add(newReading);
		let vmi1:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,(( vi - 1) | 0),- 1);
		let vmi2:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,(( vi - 1) | 0),- 1);
		if( vmi1 > vmi2)
			{
				vmi2 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi,1);
				vm1 =<VariantMarkerEvent> v.getEvent(vmi1);
				vm2 =<VariantMarkerEvent> v.getEvent(vmi2);
				for(
				let i:number =(( vmi1 + 1) | 0);i < vmi2;i ++)
				{
					let newEventCopy:Event = v.getEvent(i).createCopy_1();
					vmd.replaceEvent(snum,vnum,i,newEventCopy);
					if( i == vi)
						newReading.addEvent_1(e);

					newReading.addEvent_1(newEventCopy);
				}
				if( vi == vmi2)
					newReading.addEvent_1(e);

				vm1.addReading(newReading);
				return VariantReading.MIDDLE;
			}

		newReading.addEvent_1(e);
		vm1 = VariantMarkerEvent.new33(Event.EVENT_VARIANTDATA_START);
		vm2 = VariantMarkerEvent.new33(Event.EVENT_VARIANTDATA_END);
		vm1.addReading(newReading);
		vm2.setReadingsList(vm1.getReadings());
		vm2.setDefaultLength(vm1.getDefaultLength());
		this.addEvent(snum,vnum,di,vm1);
		this.addEvent(snum,vnum,(( di + 1) | 0),vm2);
		vmd.addEvent(snum,vnum,vi,vm1);
		vmd.addEvent(snum,vnum,(( vi + 1) | 0),vm2);
		return VariantReading.NEWVARIANT;
	}

	/* adding within reading? */
	/* eventToDelete is within a variant reading */
	// create separate reading and add
	/* not already in a variant reading */
	/* create new variant */
	/* currently in-between two variant markers
           this means that a variant reading exists here in one of the other
           versions, so we need to attach this new reading to the same markers */
	/* copy default reading into new reading */
	/* link default lengths in markers */
	/*------------------------------------------------------------------------
Method:  void deleteEvent(int snum,int vnum,int i)
Purpose: Delete event in one section and update parameters throughout score
Parameters:
  Input:  int snum,vnum - section and voice number
          int i         - index in voice's event list for event to delete
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public deleteEvent(snum:number,vnum:number,i:number):void
	{
		let v:VoiceEventListData = this.getSection(snum).getVoice_1(vnum);
		let lastv:VoiceEventListData = null;
		for(
		snum --;lastv == null && snum >= 0;snum --)
		lastv = this.getSection(snum).getVoice_1(vnum);
		v.deleteEvent_3(i,lastv);
	}

	/*------------------------------------------------------------------------
Method:  int [add|delete]VariantEvent(VariantVersionData vvd,PieceData vmd,
                                int snum,int vnum,int vi)
Purpose: Add/delete event in one variant version
Parameters:
  Input:  VariantVersionData vvd - variant version for addition/deletion
          PieceData vmd          - variant music data
          int snum,vnum          - section and voice number
          int vi                 - index in variant voice event list
  Output: -
  Return: positioning of new event within reading (beginning, end, middle)
------------------------------------------------------------------------*/
	public addEventInVersion(vvd:VariantVersionData,vmd:PieceData,snum:number,vnum:number,vi:number,di:number,e:Event):number
	{
		let v:VoiceEventListData = vmd.getSection(snum).getVoice_1(vnum);
		let prevEvent:Event = v.getEvent((( vi - 1) | 0));
		let nextEvent:Event = v.getEvent(vi);
		let prevEventReading:VariantReading = prevEvent != null ? prevEvent.getVariantReading_1(vvd):null;
		let nextEventReading:VariantReading = nextEvent.getVariantReading_1(vvd);
		if( prevEventReading != null && prevEventReading == nextEventReading && prevEventReading.getVersions().size() > 1)
			this.createSeparateReadingForVersion(vvd,vmd,snum,vnum,vi);

		return this.addVariantEvent(vvd,vmd,snum,vnum,vi,di,e);
	}

	/* if necessary, remove this one version from the reading */
	public deleteEventInVersion(vvd:VariantVersionData,vmd:PieceData,snum:number,vnum:number,vi:number):number
	{
		let v:VoiceEventListData = vmd.getSection(snum).getVoice_1(vnum);
		let eventToDelete:Event = v.getEvent(vi);
		let curEventReading:VariantReading = eventToDelete.getVariantReading_1(vvd);
		if( curEventReading != null && curEventReading.getVersions().size() > 1)
			this.createSeparateReadingForVersion(vvd,vmd,snum,vnum,vi);

		return this.deleteVariantEvent(vvd,vmd,snum,vnum,vi);
	}

	/* if necessary, remove this one version from the reading */
	public duplicateEventInVersion(vvd:VariantVersionData,vmd:PieceData,snum:number,vnum:number,vi:number):Event
	{
		let v:VoiceEventListData = vmd.getSection(snum).getVoice_1(vnum);
		let eventToDuplicate:Event = v.getEvent(vi);
		let curEventReading:VariantReading = eventToDuplicate.getVariantReading_1(vvd);
		if( curEventReading != null && curEventReading.getVersions().size() > 1)
			this.createSeparateReadingForVersion(vvd,vmd,snum,vnum,vi);

		return this.duplicateEventInVariant(vvd,vmd,snum,vnum,vi);
	}

	/* if necessary, remove this one version from the reading */
	public duplicateEventsInVersion(vvd:VariantVersionData,vmd:PieceData,snum:number,vnum:number,vi1:number,vi2:number):Event
	{
		let v:VoiceEventListData = vmd.getSection(snum).getVoice_1(vnum);
		let eventToDuplicate:Event = v.getEvent(vi1);
		let curEventReading:VariantReading = eventToDuplicate.getVariantReading_1(vvd);
		if( curEventReading != null && curEventReading.getVersions().size() > 1)
			this.createSeparateReadingForVersion(vvd,vmd,snum,vnum,vi1);

		return this.duplicateEventsInVariant(vvd,vmd,snum,vnum,vi1,vi2);
	}

	/* if necessary, remove this one version from the reading */
	createSeparateReadingForVersion(vvd:VariantVersionData,vmd:PieceData,snum:number,vnum:number,vi:number):VariantReading
	{
		let v:VoiceEventListData = vmd.getSection(snum).getVoice_1(vnum);
		let vmi1:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,vi,- 1);
		let vmi2:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi,1);
		let vm1:VariantMarkerEvent =<VariantMarkerEvent> v.getEvent(vmi1);
		let newReading:VariantReading = vm1.getVariantReading_1(vvd);
		if( newReading != null)
			{
				newReading = newReading.separateVersion(vvd);
				for(
				let i:number =(( vmi1 + 1) | 0);i < vmi2;i ++)
				vmd.replaceEvent(snum,vnum,i,newReading.getEvent((((( i - vmi1) | 0) - 1) | 0)));
			}

		else
			{
				newReading = VariantReading.new1(snum,vnum,vmi1);
				for(
				let i:number =(( vmi1 + 1) | 0);i < vmi2;i ++)
				newReading.addEvent_1(v.getEvent(i));
				newReading.addVersion(vvd);
			}

		vm1.addReading(newReading);
		return newReading;
	}

	/* copy reading into separate one for this version only */
	/* update vmd to reflect new reading */
	/* this is one of the default versions; copy events directly from vmd */
	public deleteVariantEvent(vvd:VariantVersionData,vmd:PieceData,snum:number,vnum:number,vi:number):number
	{
		let v:VoiceEventListData = vmd.getSection(snum).getVoice_1(vnum);
		let defaultV:VoiceEventListData = this.getSection(snum).getVoice_1(vnum);
		let eventToDelete:Event = v.getEvent(vi);
		let prevEvent:Event = v.getEvent((( vi - 1) | 0));
		let nextEvent:Event = v.getEvent((( vi + 1) | 0));
		let curEventReading:VariantReading = eventToDelete.getVariantReading_1(vvd);
		let prevEventReading:VariantReading = prevEvent != null ? prevEvent.getVariantReading_1(vvd):null;
		let nextEventReading:VariantReading = nextEvent.getVariantReading_1(vvd);
		let vm1:VariantMarkerEvent;
		let vm2:VariantMarkerEvent;
		if( eventToDelete.geteventtype() == Event.EVENT_VARIANTDATA_START || eventToDelete.geteventtype() == Event.EVENT_VARIANTDATA_END)
			{
				System.err.println("ERROR: Attempting to delete VariantMarkerEvent: event no. " + vi);
				return VariantReading.NOACTION;
			}

		if( curEventReading != null)
			{
				if( curEventReading.getVersions().size() > 1)
					return this.deleteEventInVersion(vvd,vmd,snum,vnum,vi);

				curEventReading.deleteEvent_2(eventToDelete);
				if( curEventReading.getNumEvents() == 0)
					{
					}

				return VariantReading.MIDDLE;
			}

		let newReading:VariantReading = VariantReading.new0();
		newReading.addVersion(vvd);
		this.variantReadings.add(newReading);
		let vmi1:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,vi,- 1);
		let vmi2:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi,- 1);
		if( vmi1 > vmi2)
			{
				vmi2 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi,1);
				vm1 =<VariantMarkerEvent> v.getEvent(vmi1);
				vm2 =<VariantMarkerEvent> v.getEvent(vmi2);
				for(
				let i:number =(( vmi1 + 1) | 0);i < vmi2;i ++)
				{
					let newEventCopy:Event = v.getEvent(i).createCopy_1();
					vmd.replaceEvent(snum,vnum,i,newEventCopy);
					if( i != vi)
						newReading.addEvent_1(newEventCopy);

				}
				vm1.addReading(newReading);
				return VariantReading.NEWREADING;
			}

		let di:number = eventToDelete.getDefaultListPlace();
		vm1 = VariantMarkerEvent.new33(Event.EVENT_VARIANTDATA_START);
		vm2 = VariantMarkerEvent.new33(Event.EVENT_VARIANTDATA_END);
		vm1.addReading(newReading);
		vm2.setReadingsList(vm1.getReadings());
		vm1.getDefaultLength().add(eventToDelete.getmusictime());
		vm2.setDefaultLength(vm1.getDefaultLength());
		this.addEvent(snum,vnum,di,vm1);
		this.addEvent(snum,vnum,(( di + 2) | 0),vm2);
		vmd.addEvent(snum,vnum,vi,vm1);
		vmd.addEvent(snum,vnum,(( vi + 2) | 0),vm2);
		return VariantReading.NEWVARIANT;
	}

	/* check to see whether to delete from an existing variant reading, or create a new one */
	/* eventToDelete is within a variant reading */
	// create separate reading and delete
	/* REMOVED: automatic deletion of empty variant
               all readings must be manually removed or automatically consolidated 
               upon save (otherwise editing actions which temporarily delete events
               won't work, e.g., making a multi-event) */
	/* deleted last event in reading 
            VariantMarkerEvent vme=(VariantMarkerEvent)prevEvent;
            int di=vme.getDefaultListPlace(),
                numEventsInDefault=defaultV.getEvent(defaultV.getNextEventOfType(Event.EVENT_VARIANTDATA_END,di,1)).getDefaultListPlace()-di-1;

            if (numEventsInDefault==0)
              {
                vme.removeReading(curEventReading);
                if (vme.getNumReadings()==0)
                  {
                     deleted last variant reading at this position;
                       now delete marker events 
                    deleteEvent(snum,vnum,
                                defaultV.getNextEventOfType(Event.EVENT_VARIANTDATA_END,di,1));
                    deleteEvent(snum,vnum,
                                defaultV.getNextEventOfType(Event.EVENT_VARIANTDATA_START,di,-1));

                    vmd.deleteEvent(snum,vnum,vi+1);
                    vmd.deleteEvent(snum,vnum,vi-1);

                    return VariantReading.DELETED;
                  }
              }*/
	/* eventToDelete is not already in a variant reading */
	/* create new variant */
	/* currently in-between two variant markers
           this means that a variant reading exists here in one of the other
           versions, so we need to attach this new reading to the same markers */
	/* copy default reading into new reading */
	/* link default lengths in markers */
	/*------------------------------------------------------------------------
Method:  void deleteAllVariantReadingsAtLoc(VariantVersionData vvd,PieceData vmd,
                                            int snum,int vnum,int vi)
Purpose: Delete all readings at one location
Parameters:
  Input:  VariantVersionData vvd - variant version
          PieceData vmd          - variant music data
          int snum,vnum          - section and voice number
          int vi                 - index in variant voice event list
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public deleteAllVariantReadingsAtLoc(vvd:VariantVersionData,vmd:PieceData,snum:number,vnum:number,vi:number):void
	{
		let v:VoiceEventListData = vmd.getSection(snum).getVoice_1(vnum);
		let defaultV:VoiceEventListData = this.getSection(snum).getVoice_1(vnum);
		let vmi1:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,vi,- 1);
		let vmi2:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,(( vi - 1) | 0),- 1);
		if( !( vmi1 > vmi2))
			return;

		let vme:VariantMarkerEvent =<VariantMarkerEvent> v.getEvent(vmi1);
		for(let vr of vme.getReadings())
		this.variantReadings.remove(vr);
		vmi2 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi,1);
		let di1:number = vme.getDefaultListPlace();
		let di2:number = defaultV.getNextEventOfType(Event.EVENT_VARIANTDATA_END,di1,1);
		this.deleteEvent(snum,vnum,di2);
		this.deleteEvent(snum,vnum,di1);
		if( vvd.isDefault())
			return;

		vmd.deleteEvent(snum,vnum,vmi2);
		vmd.deleteEvent(snum,vnum,vmi1);
	}

	/* not in-between markers */
	/* delete marker events, end of story */
	/*------------------------------------------------------------------------
Method:  void deleteVariantReading(VariantVersionData vvd,PieceData vmd,
                                   int snum,int vnum,int vi)
Purpose: Delete reading in one variant version
Parameters:
  Input:  VariantVersionData vvd - variant version
          PieceData vmd          - variant music data
          int snum,vnum          - section and voice number
          int vi                 - index in variant voice event list
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public deleteVariantReading_1(vvd:VariantVersionData,vmd:PieceData,snum:number,vnum:number,vi:number):void
	{
		let v:VoiceEventListData = vmd.getSection(snum).getVoice_1(vnum);
		let defaultV:VoiceEventListData = this.getSection(snum).getVoice_1(vnum);
		let vmi1:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,vi,- 1);
		let vmi2:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi,1);
		for(
		let i:number =(( vmi2 - 1) | 0);i > vmi1;i --)
		vmd.deleteEvent(snum,vnum,i);
		let vme:VariantMarkerEvent =<VariantMarkerEvent> v.getEvent(vmi1);
		let di1:number = vme.getDefaultListPlace();
		let di2:number = defaultV.getNextEventOfType(Event.EVENT_VARIANTDATA_END,di1,1);
		vmi2 =(( vmi1 + 1) | 0);
		for(
		let i:number =(( di1 + 1) | 0);i < di2;i ++)
		vmd.addEvent(snum,vnum,vmi2 ++,defaultV.getEvent(i));
		let readingToDelete:VariantReading = vme.getVariantReading_1(vvd);
		readingToDelete.deleteVersion(vvd);
		if( readingToDelete.getVersions().size() == 0)
			{
				vme.removeReading(readingToDelete);
				this.variantReadings.remove(readingToDelete);
				if( vme.getNumReadings() == 0)
					{
						this.deleteEvent(snum,vnum,di2);
						this.deleteEvent(snum,vnum,di1);
						vmd.deleteEvent(snum,vnum,vmi2);
						vmd.deleteEvent(snum,vnum,vmi1);
					}

			}

	}

	/* check to see whether to delete from an existing variant reading, or create a new one */
	/* delete events from variant PieceData */
	/* replace with events from default reading */
	/* remove links to reading */
	/* deleted last variant reading at this position;
               now delete marker events */
	/* delete version but only update default PieceData */
	public deleteVariantReading_2(vvd:VariantVersionData,snum:number,vnum:number,vi:number):void
	{
		let defaultV:VoiceEventListData = this.getSection(snum).getVoice_1(vnum);
		let vmi1:number = defaultV.getNextEventOfType(Event.EVENT_VARIANTDATA_START,vi,- 1);
		let vmi2:number = defaultV.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi,1);
		let vme:VariantMarkerEvent =<VariantMarkerEvent> defaultV.getEvent(vmi1);
		let readingToDelete:VariantReading = vme.getVariantReading_1(vvd);
		readingToDelete.deleteVersion(vvd);
		if( readingToDelete.getVersions().size() == 0)
			{
				vme.removeReading(readingToDelete);
				this.variantReadings.remove(readingToDelete);
				if( vme.getNumReadings() == 0)
					{
						this.deleteEvent(snum,vnum,vmi2);
						this.deleteEvent(snum,vnum,vmi1);
					}

			}

	}

	/* remove links to reading */
	/* deleted last variant reading at this position;
               now delete marker events */
	/*------------------------------------------------------------------------
Method:  Event duplicateEventInVariant(VariantVersionData vvd,PieceData vmd,
                                       int snum,int vnum,int vi)
Purpose: Create new variant containing copy of one event from default list
Parameters:
  Input:  VariantVersionData vvd - variant version for new reading
          PieceData vmd          - variant music data
          int snum,vnum          - section and voice number
          int vi                 - index in variant voice event list
  Output: -
  Return: new copy of Event
------------------------------------------------------------------------*/
	public duplicateEventInVariant(vvd:VariantVersionData,vmd:PieceData,snum:number,vnum:number,vi:number):Event
	{
		let v:VoiceEventListData = vmd.getSection(snum).getVoice_1(vnum);
		let eventToCopy:Event = vmd.getSection(snum).getVoice_1(vnum).getEvent(vi);
		let newEventCopy:Event;
		let curEventReading:VariantReading = eventToCopy.getVariantReading_1(vvd);
		let di:number = eventToCopy.getDefaultListPlace();
		let vm1:VariantMarkerEvent;
		let vm2:VariantMarkerEvent;
		if( curEventReading != null)
			if( curEventReading.getVersions().size() > 1)
				return this.duplicateEventInVersion(vvd,vmd,snum,vnum,vi);
			else
				return eventToCopy;

		let newReading:VariantReading = VariantReading.new0();
		newReading.addVersion(vvd);
		this.variantReadings.add(newReading);
		let vmi1:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,vi,- 1);
		let vmi2:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi,- 1);
		if( vmi1 > vmi2)
			{
				vmi2 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi,1);
				vm1 =<VariantMarkerEvent> v.getEvent(vmi1);
				vm2 =<VariantMarkerEvent> v.getEvent(vmi2);
				let selectedEvent:Event = null;
				for(
				let i:number =(( vmi1 + 1) | 0);i < vmi2;i ++)
				{
					newEventCopy = v.getEvent(i).createCopy_1();
					if( i == vi)
						selectedEvent = newEventCopy;

					vmd.replaceEvent(snum,vnum,i,newEventCopy);
					newReading.addEvent_1(newEventCopy);
				}
				vm1.addReading(newReading);
				return selectedEvent;
			}

		newEventCopy = eventToCopy.createCopy_1();
		vmd.replaceEvent(snum,vnum,vi,newEventCopy);
		newReading.addEvent_1(newEventCopy);
		vm1 = VariantMarkerEvent.new33(Event.EVENT_VARIANTDATA_START);
		vm2 = VariantMarkerEvent.new33(Event.EVENT_VARIANTDATA_END);
		vm1.addReading(newReading);
		let defaultLength:Proportion = Proportion.copyProportion(newEventCopy.getmusictime());
		vm1.setDefaultLength(defaultLength == null ? Proportion.new0(0,1):defaultLength);
		vm2.setReadingsList(vm1.getReadings());
		vm2.setDefaultLength(vm1.getDefaultLength());
		this.addEvent(snum,vnum,di,vm1);
		this.addEvent(snum,vnum,(( di + 2) | 0),vm2);
		vmd.addEvent(snum,vnum,vi,vm1);
		vmd.addEvent(snum,vnum,(( vi + 2) | 0),vm2);
		return newEventCopy;
	}

	/* already in reading, don't create another */
	/* create new variant */
	/* currently in-between two variant markers
           this means that a variant reading exists here in one of the other
           versions, so we need to attach this new reading to the same markers */
	/* copy default reading into new reading */
	/* link default lengths in markers */
	/*------------------------------------------------------------------------
Method:  Event duplicateEventsInVariant(VariantVersionData vvd,PieceData vmd,
                                        int snum,int vnum,int vi)
Purpose: Create new variant containing copy of two events from default list
Parameters:
  Input:  VariantVersionData vvd - variant version for new reading
          PieceData vmd          - variant music data
          int snum,vnum          - section and voice number
          int vi1,vi2            - index in variant voice event list of
                                   each event
  Output: -
  Return: new copy of first Event
------------------------------------------------------------------------*/
	variantsBetweenEvents(v:VoiceEventListData,vi1:number,vi2:number):boolean
	{
		let vmi1:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,(( vi1 + 1) | 0),1);
		let vmi2:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vmi1,1);
		return vmi1 > vi1 && vmi1 < vi2 && vmi2 > vmi1 && vmi2 < vi2;
	}

	public duplicateEventsInVariant(vvd:VariantVersionData,vmd:PieceData,snum:number,vnum:number,vi1:number,vi2:number):Event
	{
		let v:VoiceEventListData = vmd.getSection(snum).getVoice_1(vnum);
		let eventToCopy1:Event = v.getEvent(vi1);
		let eventToCopy2:Event = v.getEvent(vi2);
		let curEventReading1:VariantReading = eventToCopy1.getVariantReading_1(vvd);
		let curEventReading2:VariantReading = eventToCopy2.getVariantReading_1(vvd);
		let di1:number = eventToCopy1.getDefaultListPlace();
		let di2:number = eventToCopy2.getDefaultListPlace();
		let vmi1:number;
		let vmi2:number;
		let vm1:VariantMarkerEvent;
		let vm2:VariantMarkerEvent;
		if( this.variantsBetweenEvents(v,vi1,vi2))
			return null;

		if( curEventReading1 != null)
			if( curEventReading1 == curEventReading2)
				if( curEventReading1.getVersions().size() > 1)
					return this.duplicateEventsInVersion(vvd,vmd,snum,vnum,vi1,vi2);
				else
					return eventToCopy1;


			else
				if( curEventReading2 == null)
					{
						vmi1 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,vi1,- 1);
						vmi2 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi1,1);
						vm1 =<VariantMarkerEvent> v.getEvent(vmi1);
						vm2 =<VariantMarkerEvent> v.getEvent(vmi2);
						this.deleteEvent(snum,vnum,vm2.getDefaultListPlace());
						vmd.deleteEvent(snum,vnum,vmi2);
						this.addEvent(snum,vnum,di2,vm2);
						vmd.addEvent(snum,vnum,vi2,vm2);
						for(
						let i:number = vmi2;i < vm2.getListPlace(false);i ++)
						for(let vr of vm1.getReadings())
						{
							let newEventCopy:Event = v.getEvent(i).createCopy_1();
							if( vr == curEventReading1)
								vmd.replaceEvent(snum,vnum,i,newEventCopy);

							vr.addEvent_1(newEventCopy);
						}
						return v.getEvent(vi1);
					}

				else
					{
						System.out.println("duplicateEventsInVariant: case not implemented (combine readings)");
						return null;
					}


		else
			if( curEventReading2 != null)
				{
					vmi1 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,vi1,1);
					vm1 =<VariantMarkerEvent> v.getEvent(vmi1);
					this.deleteEvent(snum,vnum,vm1.getDefaultListPlace());
					vmd.deleteEvent(snum,vnum,vmi1);
					this.addEvent(snum,vnum,di1,vm1);
					vmd.addEvent(snum,vnum,vi1,vm1);
					for(
					let i:number = vmi1;i > vm1.getListPlace(false);i --)
					for(let vr of vm1.getReadings())
					{
						let newEventCopy:Event = v.getEvent(i).createCopy_1();
						if( vr == curEventReading2)
							vmd.replaceEvent(snum,vnum,i,newEventCopy);

						vr.addEvent_2(0,newEventCopy);
					}
					return v.getEvent((( vm1.getListPlace(false) + 1) | 0));
				}

		let newReading:VariantReading = VariantReading.new0();
		newReading.addVersion(vvd);
		this.variantReadings.add(newReading);
		vmi1 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,vi1,- 1);
		vmi2 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi1,- 1);
		if( vmi1 > vmi2)
			{
				vmi2 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi1,1);
				if( vmi2 > vi2)
					{
						vm1 =<VariantMarkerEvent> v.getEvent(vmi1);
						vm2 =<VariantMarkerEvent> v.getEvent(vmi2);
						let selectedEvent:Event = null;
						for(
						let i:number =(( vmi1 + 1) | 0);i < vmi2;i ++)
						{
							let newEventCopy:Event = v.getEvent(i).createCopy_1();
							if( i == vi1)
								selectedEvent = newEventCopy;

							vmd.replaceEvent(snum,vnum,i,newEventCopy);
							newReading.addEvent_1(newEventCopy);
						}
						vm1.addReading(newReading);
						return selectedEvent;
					}

				vmi1 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,vi2,- 1);
				if( vmi1 > vi1)
					{
						System.out.println("duplicateEventsInVariant: case not implemented (combine readings)");
						return null;
					}

				vmi1 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,vi1,- 1);
				vm1 =<VariantMarkerEvent> v.getEvent(vmi1);
				vm2 =<VariantMarkerEvent> v.getEvent(vmi2);
				this.deleteEvent(snum,vnum,vm2.getDefaultListPlace());
				vmd.deleteEvent(snum,vnum,vmi2);
				this.addEvent(snum,vnum,di2,vm2);
				vmd.addEvent(snum,vnum,vi2,vm2);
				for(
				let i:number = vmi2;i < vm2.getListPlace(false);i ++)
				for(let vr of vm1.getReadings())
				vr.addEvent_1(v.getEvent(i).createCopy_1());
				for(
				let i:number =(( vm1.getListPlace(false) + 1) | 0);i < vm2.getListPlace(false);i ++)
				{
					let newEventCopy:Event = vmd.getSection(snum).getVoice_1(vnum).getEvent(i).createCopy_1();
					vmd.replaceEvent(snum,vnum,i,newEventCopy);
					newReading.addEvent_1(newEventCopy);
				}
				vm1.addReading(newReading);
				return v.getEvent((( vm1.getListPlace(false) + 1) | 0));
			}

		else
			{
				vmi1 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,vi2,- 1);
				vmi2 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi2,- 1);
				if( vmi1 > vmi2)
					{
						vmi1 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,vi1,1);
						vmi2 = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi2,1);
						vm1 =<VariantMarkerEvent> v.getEvent(vmi1);
						this.deleteEvent(snum,vnum,vm1.getDefaultListPlace());
						vmd.deleteEvent(snum,vnum,vmi1);
						this.addEvent(snum,vnum,di1,vm1);
						vmd.addEvent(snum,vnum,vi1,vm1);
						for(
						let i:number = vmi1;i > vm1.getListPlace(false);i --)
						for(let vr of vm1.getReadings())
						vr.addEvent_2(0,v.getEvent(i).createCopy_1());
						for(
						let i:number =(( vm1.getListPlace(false) + 1) | 0);i < vmi2;i ++)
						{
							let newEventCopy:Event = vmd.getSection(snum).getVoice_1(vnum).getEvent(i).createCopy_1();
							vmd.replaceEvent(snum,vnum,i,newEventCopy);
							newReading.addEvent_1(newEventCopy);
						}
						vm1.addReading(newReading);
						return vmd.getSection(snum).getVoice_1(vnum).getEvent((( vm1.getListPlace(false) + 1) | 0));
					}

			}

		for(
		let i:number = vi1;i <= vi2;i ++)
		{
			let newEventCopy:Event = vmd.getSection(snum).getVoice_1(vnum).getEvent(i).createCopy_1();
			vmd.replaceEvent(snum,vnum,i,newEventCopy);
			newReading.addEvent_1(newEventCopy);
		}
		vm1 = VariantMarkerEvent.new33(Event.EVENT_VARIANTDATA_START);
		vm2 = VariantMarkerEvent.new33(Event.EVENT_VARIANTDATA_END);
		vm1.addReading(newReading);
		vm1.setDefaultLength(Proportion.new1(newReading.getLength()));
		vm2.setReadingsList(vm1.getReadings());
		vm2.setDefaultLength(vm1.getDefaultLength());
		this.addEvent(snum,vnum,di1,vm1);
		this.addEvent(snum,vnum,(( di2 + 2) | 0),vm2);
		vmd.addEvent(snum,vnum,vi1,vm1);
		vmd.addEvent(snum,vnum,(( vi2 + 2) | 0),vm2);
		return newReading.getEvent(0);
	}

	/* check that no other variants are in between events */
	/* already in the same reading, don't create another */
	/* extend first reading to encompass second event */
	/* remove end marker and reinsert after second event */
	/* duplicate last events in all readings */
	/* combine readings */
	/* curEventReading1==null */
	/* extend second reading to encompass first event */
	/* remove start marker and reinsert before first event */
	/* duplicate first events in all readings */
	/* neither event is already in a reading; create a new one */
	/* event 1 is currently in-between two variant markers
           this means that a variant reading exists here in one of the other
           versions, so we need to attach this new reading to the same markers */
	/* both events are within the same markers */
	/* copy default reading into new reading */
	/* combine readings */
	/* event 1 is currently in-between two variant markers;
           event 2 is not */
	/* remove end marker and reinsert after second event */
	/* duplicate last events in all readings */
	/* create new reading */
	/* event 2 is currently in-between two variant markers;
               event 1 is not */
	/* remove start marker and reinsert before first event */
	/* duplicate first events in all readings */
	/* create new reading */
	/* create new reading with new markers */
	/* link default lengths in markers */
	/*------------------------------------------------------------------------
Method:  void moveEvent(int snum,int vnum,int i,int offset)
Purpose: Move event in one section and update parameters throughout score
Parameters:
  Input:  int snum,vnum - section and voice number
          int i         - index in voice's event list for event to move
          int offset    - amount to move event in voice list
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public moveEvent(snum:number,vnum:number,i:number,offset:number):void
	{
		let e:Event = this.getSection(snum).getVoice_1(vnum).getEvent(i);
		this.deleteEvent(snum,vnum,i);
		this.addEvent(snum,vnum,(( i + offset) | 0),e);
	}

	/*------------------------------------------------------------------------
Method:  void replaceEvent(int snum,int vnum,int i,Event newEvent)
Purpose: Replace event in one section and update parameters throughout score
Parameters:
  Input:  int snum,vnum  - section and voice number
          int i          - index in voice's event list for event to replace
          Event newEvent - replacement event
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public replaceEvent(snum:number,vnum:number,i:number,newEvent:Event):void
	{
		this.deleteEvent(snum,vnum,i);
		this.addEvent(snum,vnum,i,newEvent);
	}

	/*------------------------------------------------------------------------
Method:  void combineReadingWithNext(PieceData vmd,int snum,int vnum,int VM1starti,int VM2starti)
Purpose: Combine one set of variant readings with following set in score
Parameters:
  Input:  PieceData vmd - variant music data
          int snum,vnum - section and voice number
          int VM1starti,
              VM2starti - index in event list of start marker of
                          each variant set
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public combineReadingWithNext(vmd:PieceData,snum:number,vnum:number,VM1starti:number,VM2starti:number):void
	{
		let defaultV:VoiceEventListData = this.getSection(snum).getVoice_1(vnum);
		let v:VoiceEventListData = vmd.getSection(snum).getVoice_1(vnum);
		let VM1endi:number =(( VM2starti - 1) | 0);
		let VM2endi:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,(( VM2starti + 1) | 0),1);
		let vmStart1:VariantMarkerEvent =<VariantMarkerEvent> v.getEvent(VM1starti);
		let vmStart2:VariantMarkerEvent =<VariantMarkerEvent> v.getEvent(VM2starti);
		let vmEnd1:VariantMarkerEvent =<VariantMarkerEvent> v.getEvent(VM1endi);
		let vmEnd2:VariantMarkerEvent =<VariantMarkerEvent> v.getEvent(VM2endi);
		let defaultVM1starti:number = vmStart1.getDefaultListPlace();
		let defaultVM2starti:number = vmStart2.getDefaultListPlace();
		let defaultVM1endi:number = vmEnd1.getDefaultListPlace();
		let defaultVM2endi:number = vmEnd2.getDefaultListPlace();
		let defaultReading1:VariantReading = VariantReading.new0();
		let defaultReading2:VariantReading = VariantReading.new0();
		for(
		let i:number =(( defaultVM1starti + 1) | 0);i < defaultVM1endi;i ++)
		defaultReading1.addEvent_1(defaultV.getEvent(i));
		for(
		let i:number =(( defaultVM2starti + 1) | 0);i < defaultVM2endi;i ++)
		defaultReading2.addEvent_1(defaultV.getEvent(i));
		let newReadingList:ArrayList<VariantReading> = new ArrayList<VariantReading>();
		for(let varReading1 of vmStart1.getReadings())
		for(let vvd of varReading1.getVersions())
		{
			let varReading2:VariantReading = vmStart2.getVariantReading_1(vvd);
			let newReading:VariantReading = VariantReading.new0();
			newReading.addVersion(vvd);
			newReading.addEventList_2(varReading1);
			newReading.addEventList_2(varReading2 != null ? varReading2:defaultReading2);
			newReadingList.add(newReading);
		}
		for(let varReading2 of vmStart2.getReadings())
		for(let vvd of varReading2.getVersions())
		if( vmStart1.getVariantReading_1(vvd) == null)
			{
				let newReading:VariantReading = VariantReading.new0();
				newReading.addVersion(vvd);
				newReading.addEventList_2(defaultReading1);
				newReading.addEventList_2(varReading2);
				newReadingList.add(newReading);
			}

		let ri:number = 0;
		while( ri < newReadingList.size())
		{
			let vr1:VariantReading = newReadingList.get(ri);
			let ri2:number =(( ri + 1) | 0);
			while( ri2 < newReadingList.size())
			{
				let vr2:VariantReading = newReadingList.get(ri2);
				if( vr1.eventsEqual(vr2))
					{
						vr1.addVersion(vr2.getVersion(0));
						newReadingList.remove(ri2);
					}

				else
					ri2 ++;

			}
			ri ++;
		}
		vmStart1.setReadingsList(newReadingList);
		vmEnd2.setReadingsList(newReadingList);
		this.deleteEvent(snum,vnum,defaultVM2starti);
		this.deleteEvent(snum,vnum,defaultVM1endi);
		if( vmd != this)
			{
				vmd.deleteEvent(snum,vnum,VM2starti);
				vmd.deleteEvent(snum,vnum,VM1endi);
				let newReading:VariantReading = vmStart1.getVariantReading_1(vmd.curVersion);
				if( newReading != null)
					for(
					let ei:number = 0;ei < newReading.getNumEvents();ei ++)
					vmd.replaceEvent(snum,vnum,(((( VM1starti + 1) | 0) + ei) | 0),newReading.getEvent(ei));

			}

		vmStart1.setDefaultLength(Proportion.sum(defaultReading1.getLength(),defaultReading2.getLength()));
		vmEnd2.setDefaultLength(vmStart1.getLength_1());
	}

	/* construct default event lists */
	/* construct combined variant readings */
	/* combine duplicates in new reading list
       pre-condition: each reading in newReadingList is attached to only one version */
	/* delete markers in middle of new combined default reading */
	/* replace voice list events with those in new reading */
	/*------------------------------------------------------------------------
Method:  boolean addVersionToReading(EventLocation loc,int ri,VariantVersionData newv)
Purpose: Associate one variant version with one reading
Parameters:
  Input:  EventLocation loc       - location of start marker
          int ri                  - index of reading within marker's list
          VariantVersionData newv - version to add to reading
  Output: -
  Return: true if anything has been changed
------------------------------------------------------------------------*/
	public addVersionToReading(loc:EventLocation,ri:number,newv:VariantVersionData):boolean
	{
		let vme1:VariantMarkerEvent =<VariantMarkerEvent> this.getEvent_1(loc);
		let defaultV:VoiceEventListData = this.getSection(loc.sectionNum).getVoice_1(loc.voiceNum);
		if( vme1.getVariantReading_1(newv) != null)
			return false;

		vme1.getReading(ri).addVersion(newv);
		return true;
	}

	/* this version is already attached to a reading here */
	/*------------------------------------------------------------------------
Method:  boolean setReadingAsDefault(EventLocation loc,int ri)
Purpose: Set one reading as default, swapping out current default (or
         deleting if the current default is only in the default version)
Parameters:
  Input:  EventLocation loc - location of start marker
          int ri            - index of reading within marker's list
  Output: -
  Return: true if anything has been changed
------------------------------------------------------------------------*/
	public setReadingAsDefault(loc:EventLocation,ri:number):boolean
	{
		let vme1:VariantMarkerEvent =<VariantMarkerEvent> this.getEvent_1(loc);
		let defaultV:VoiceEventListData = this.getSection(loc.sectionNum).getVoice_1(loc.voiceNum);
		let vr:VariantReading = vme1.getReading(ri);
		let vmi2:number = defaultV.getNextEventOfType(Event.EVENT_VARIANTDATA_END,(( loc.eventNum + 1) | 0),1);
		let defaultVersions:List<VariantVersionData> = vme1.getDefaultVersions(this.variantVersions,this.getVoice(loc.voiceNum),defaultV);
		defaultVersions.remove(0);
		if( defaultVersions.size() > 0)
			{
				let newReading:VariantReading = this.createSeparateReadingForVersion(defaultVersions.get(0),this,loc.sectionNum,loc.voiceNum,loc.eventNum);
				for(
				let vi:number = 1;vi < defaultVersions.size();vi ++)
				newReading.addVersion(defaultVersions.get(vi));
			}

		for(
		let i:number =(( vmi2 - 1) | 0);i > loc.eventNum;i --)
		this.deleteEvent(loc.sectionNum,loc.voiceNum,i);
		let ei:number =(( loc.eventNum + 1) | 0);
		for(let e of vr.getEvents().getEvents())
		this.addEvent(loc.sectionNum,loc.voiceNum,ei ++,e);
		this.consolidateReadings(loc);
		return true;
	}

	/* Make new reading for newly non-default versions */
	/* Copy default events into new reading */
	/* Add all default versions */
	/* Delete current default */
	/* Insert events from new default */
	/*------------------------------------------------------------------------
Method:  boolean consolidateReadings(EventLocation loc)
Purpose: Find identical variant readings at one location and combine
Parameters:
  Input:  EventLocation loc - location of start marker
  Output: -
  Return: true if anything has been changed
------------------------------------------------------------------------*/
	public consolidateAllReadings():void
	{
		let loc:EventLocation = new EventLocation(0,0,0);
		let totalConsolidated:number = 0;
		for(
		loc.sectionNum = 0;loc.sectionNum < this.getNumSections();loc.sectionNum ++)
		{
			let ms:MusicSection = this.getSection(loc.sectionNum);
			for(
			loc.voiceNum = 0;loc.voiceNum < ms.getNumVoices_1();loc.voiceNum ++)
			if( ms.getVoice_1(loc.voiceNum) != null)
				{
					let curv:VoiceEventListData = ms.getVoice_1(loc.voiceNum);
					for(
					loc.eventNum = 0;loc.eventNum < curv.getNumEvents();loc.eventNum ++)
					if( curv.getEvent(loc.eventNum).geteventtype() == Event.EVENT_VARIANTDATA_START)
						totalConsolidated += this.consolidateReadings(loc) ? 1:0;

				}

		}
	}

	public consolidateReadings(loc:EventLocation):boolean
	{
		let changed:boolean = false;
		let vme1:VariantMarkerEvent =<VariantMarkerEvent> this.getEvent_1(loc);
		let defaultV:VoiceEventListData = this.getSection(loc.sectionNum).getVoice_1(loc.voiceNum);
		let vmi1:number = vme1.getDefaultListPlace();
		let vmi2:number = defaultV.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vmi1,1);
		let vme2:VariantMarkerEvent =<VariantMarkerEvent>( this.getSection(loc.sectionNum).getVoice_1(loc.voiceNum).getEvent(vmi2));
		let delList:LinkedList<VariantReading> = new LinkedList<VariantReading>();
		for(let vr of vme1.getReadings())
		if( vr.equals(defaultV,(( vmi1 + 1) | 0),(( vmi2 - 1) | 0)))
			delList.add(vr);

		for(let vr of delList)
		{
			vme1.getReadings().remove(vr);
			this.variantReadings.remove(vr);
		}
		if( delList.size() > 0)
			changed = true;

		delList = new LinkedList<VariantReading>();
		for(
		let i1:number = 0;i1 < vme1.getNumReadings();i1 ++)
		{
			let vr1:VariantReading = vme1.getReading(i1);
			for(
			let i2:number =(( i1 + 1) | 0);i2 < vme1.getNumReadings();i2 ++)
			{
				let vr2:VariantReading = vme1.getReading(i2);
				if( ! delList.contains(vr2) && vr1.equals(vr2.getEvents(),0,(( vr2.getNumEvents() - 1) | 0)) && vr1.isError() == vr2.isError())
					{
						vr1.getVersions().addAll(vr2.getVersions());
						delList.add(vr2);
					}

			}
		}
		for(let vr of delList)
		{
			vme1.getReadings().remove(vr);
			this.variantReadings.remove(vr);
		}
		if( delList.size() > 0)
			changed = true;

		if( vme1.getNumReadings() == 0)
			{
				this.deleteEvent(loc.sectionNum,loc.voiceNum,vmi2);
				this.deleteEvent(loc.sectionNum,loc.voiceNum,vmi1);
			}

		else
			vme2.setVarTypeFlags(vme1.calcVariantTypes(defaultV));

		return changed;
	}

	/* check readings against default */
	/* check readings against each other */
	/* all readings have been eliminated; remove variant */
	/*------------------------------------------------------------------------
Method:  EventLocation findEvent(Event e)
Purpose: Find event
Parameters:
  Input:  Event e - event to seek
  Output: -
  Return: location information (section num, voice num, event index)
------------------------------------------------------------------------*/
	public findEvent(e:Event):EventLocation
	{
		for(
		let si:number = 0;si < this.getNumSections();si ++)
		{
			let s:MusicSection = this.getSection(si);
			for(
			let vi:number = 0;vi < s.getNumVoices_1();vi ++)
			{
				let v:VoiceEventListData = s.getVoice_1(vi);
				if( v != null)
					for(
					let ei:number = 0;ei < v.getNumEvents();ei ++)
					if( v.getEvent(ei) == e)
						return new EventLocation(si,vi,ei);

			}
		}
		return null;
	}

	/*------------------------------------------------------------------------
Method:  void updateVariantVersions(ArrayList<VariantVersionData> newVariantVersions,
                                    ArrayList<Integer> originalVersionNums)
Purpose: Update versions list to match a new set
Parameters:
  Input:  ArrayList<VariantVersionData> newVariantVersions - new versions list
          ArrayList<Integer> originalVersionNums -           indices in current list of items in new list (-1 for new items)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public updateVariantVersions(newVariantVersions:ArrayList<VariantVersionData>,originalVersionNums:ArrayList<Integer>):void
	{
		let finalVersions:ArrayList<VariantVersionData> = new ArrayList<VariantVersionData>(newVariantVersions.size());
		for(
		let vi:number = 0;vi < newVariantVersions.size();vi ++)
		{
			let origi:number = originalVersionNums.get(vi).intValue();
			if( origi == - 1)
				finalVersions.add(newVariantVersions.get(vi));
			else
				{
					let vvd:VariantVersionData = this.variantVersions.get(origi);
					vvd.copyData(newVariantVersions.get(vi));
					finalVersions.add(vvd);
				}

		}
		this.variantVersions = finalVersions;
	}

	/* new item */
	/* update existing version, rather than replacing */
	/*------------------------------------------------------------------------
Method:  boolean deleteOriginalText(VariantVersionData vvd,boolean delVoices[])
Purpose: Delete all original text in some voices in one version (creating
         variants against default version)
Parameters:
  Input:  VariantVersionData vvd - variant version
          boolean delVoices[]    - voices to delete (true = delete)
  Output: -
  Return: whether anything has been deleted
------------------------------------------------------------------------*/
	public deleteOriginalText(vvd:VariantVersionData,delVoices:boolean[]):boolean
	{
		let modified:boolean = false;
		let vmd:PieceData = vvd.constructMusicData_1(this);
		for(
		let vnum:number = 0;vnum < delVoices.length;vnum ++)
		if( delVoices[vnum]&& ! vvd.getMissingVoices().contains(this.getVoice(vnum)))
			for(
			let snum:number = 0;snum < this.getNumSections();snum ++)
			{
				let v:VoiceEventListData = vmd.getSection(snum).getVoice_1(vnum);
				if( v != null && ! v.getMissingVersions().contains(vvd))
					{
						let ei:number = 0;
						while( ei < v.getNumEvents())
						{
							let e:Event = v.getEvent(ei);
							if( e.geteventtype() == Event.EVENT_ORIGINALTEXT)
								{
									if( this.deleteEventInVersion(vvd,vmd,snum,vnum,ei) == VariantReading.NEWVARIANT)
										ei ++;

									modified = true;
								}

							ei ++;
						}
					}

			}

		return modified;
	}

	/*------------------------------------------------------------------------
Method:  boolean deleteOriginalText(VariantVersionData vvd,boolean delVoices[])
Purpose: Delete all modern text in given voices
Parameters:
  Input:  boolean delVoices[] - voices to delete (true = delete)
  Output: -
  Return: whether anything has been deleted
------------------------------------------------------------------------*/
	public deleteModernText(delVoices:boolean[]):boolean
	{
		let modified:boolean = false;
		for(
		let vnum:number = 0;vnum < delVoices.length;vnum ++)
		if( delVoices[vnum])
			for(
			let snum:number = 0;snum < this.getNumSections();snum ++)
			{
				let v:VoiceEventListData = this.getSection(snum).getVoice_1(vnum);
				if( v != null)
					for(let maine of v.getEvents())
					for(let e of maine.getSubEvents())
					if( e.geteventtype() == Event.EVENT_NOTE)
						{
							let ne:NoteEvent =<NoteEvent> e;
							if( ne.getModernText() != null)
								{
									ne.setModernText(null);
									modified = true;
								}

						}

			}

		return modified;
	}

	/*------------------------------------------------------------------------
Method:  boolean setVersionTextAsDefault(VariantVersionData textVersion)
Purpose: Set original text of one version as the default (moving current
         default text to other matching variant versions)
Parameters:
  Input:  VariantVersionData textVersion - variant version for default text
  Output: -
  Return: whether anything has been modified
------------------------------------------------------------------------*/
	public setVersionTextAsDefault(textVersion:VariantVersionData):boolean
	{
		let modified:boolean = false;
		for(
		let si:number = 0;si < this.getNumSections();si ++)
		{
			let s:MusicSection = this.getSection(si);
			for(
			let vi:number = 0;vi < s.getNumVoices_1();vi ++)
			{
				let v:VoiceEventListData = s.getVoice_1(vi);
				if( v != null)
					{
						let ei:number = 0;
						while( ei < v.getNumEvents())
						{
							let e:Event = v.getOrigTextOnlyVariant(ei);
							if( e != null)
								{
									let vme:VariantMarkerEvent =<VariantMarkerEvent>( v.getEvent(ei));
									for(let vvd of vme.getDefaultVersions(this.getVariantVersions(),this.getVoice(vi),v))
									if( ! vvd.isDefault())
										this.duplicateEventInVariant(vvd,this,si,vi,(( ei + 1) | 0));

									this.deleteEvent(si,vi,(( ei + 1) | 0));
								}

							ei ++;
						}
					}

			}
		}
		let vmd:PieceData = textVersion.constructMusicData_1(this);
		for(
		let si:number = 0;si < this.getNumSections();si ++)
		{
			let s:MusicSection = vmd.getSection(si);
			for(
			let vi:number = 0;vi < s.getNumVoices_1();vi ++)
			{
				let v:VoiceEventListData = s.getVoice_1(vi);
				if( v != null)
					{
						let ei:number = 0;
						while( ei < v.getNumEvents())
						{
							let e:Event = v.getOrigTextOnlyVariant(ei);
							if( e != null)
								{
									let vme:VariantMarkerEvent =<VariantMarkerEvent>( v.getEvent(ei));
									this.separateDefaultReading(si,vi,vme);
									this.addEvent(si,vi,(( vme.getDefaultListPlace() + 1) | 0),e);
								}

							ei ++;
						}
					}

			}
		}
		return true;
	}

	/* step 1: disconnect all original text from default version */
	/* step 2: place current version's text in default */
	//modified;
	/*------------------------------------------------------------------------
Method:  boolean setVersionAsDefault(VariantVersionData newDefaultVersion)
Purpose: Set one version's readings as default
Parameters:
  Input:  VariantVersionData newDefaultVersion - variant version for default
  Output: -
  Return: whether anything has been modified
------------------------------------------------------------------------*/
	public setVersionAsDefault(newDefaultVersion:VariantVersionData):boolean
	{
		let modified:boolean = false;
		for(
		let si:number = 0;si < this.getNumSections();si ++)
		{
			let s:MusicSection = this.getSection(si);
			for(
			let vi:number = 0;vi < s.getNumVoices_1();vi ++)
			{
				let v:VoiceEventListData = s.getVoice_1(vi);
				if( v != null)
					{
						let ei:number = 0;
						while( ei < v.getNumEvents() && ei >= 0)
						{
							ei = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,ei,1);
							if( ei != - 1)
								{
									let vme:VariantMarkerEvent =<VariantMarkerEvent>( v.getEvent(ei));
									let vmi2:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,(( ei + 1) | 0),1);
									let defaultVersions:List<VariantVersionData> = vme.getDefaultVersions(this.getVariantVersions(),this.getVoice(vi),v);
									if( defaultVersions.size() == 1 || defaultVersions.contains(newDefaultVersion))
										ei =(( vmi2 + 1) | 0);
									else
										{
											this.separateDefaultReading(si,vi,vme);
											for(
											let dei:number =(( vmi2 - 1) | 0);dei > ei;dei --)
											this.deleteEvent(si,vi,dei);
											let vr:VariantReading = vme.getVariantReading_1(newDefaultVersion);
											let listPlace:number =(( vme.getDefaultListPlace() + 1) | 0);
											for(let e of vr.getEvents().getEvents())
											this.addEvent(si,vi,listPlace ++,e);
										}

									ei = v.getNextEventOfType(Event.EVENT_VARIANTDATA_START,(( ei + 1) | 0),1);
								}

						}
					}

			}
		}
		return true;
	}

	// skip if default is unique
	/* delete default events */
	/* copy new events into default */
	//modified;
	separateDefaultReading(snum:number,vnum:number,vme:VariantMarkerEvent):void
	{
		let v:VoiceEventListData = this.getSection(snum).getVoice_1(vnum);
		let vi:number =(( vme.getDefaultListPlace() + 1) | 0);
		let newReading:VariantReading = VariantReading.new0();
		for(let vvd of vme.getDefaultVersions(this.getVariantVersions(),this.getVoice(vnum),v))
		if( ! vvd.isDefault())
			newReading.addVersion(vvd);

		this.variantReadings.add(newReading);
		let vmi2:number = v.getNextEventOfType(Event.EVENT_VARIANTDATA_END,vi,1);
		let selectedEvent:Event = null;
		for(
		let i:number = vi;i < vmi2;i ++)
		{
			let newEventCopy:Event = v.getEvent(i).createCopy_1();
			if( i == vi)
				selectedEvent = newEventCopy;

			newReading.addEvent_1(newEventCopy);
		}
		if( newReading.getVersions().size() > 0)
			vme.addReading(newReading);

	}

	/* create new variant */
	/* copy default reading into new reading */
	//            vmd.replaceEvent(snum,vnum,i,newEventCopy);
	/*------------------------------------------------------------------------
Method:  String voiceOrigTextToStr(int vnum)
Purpose: Create string containing all original texting in one voice
Parameters:
  Input:  int vnum - number of voice
  Output: -
  Return: String containing all text in voice, phrases/syllables delimited
          by markers according to style (original or modern)
------------------------------------------------------------------------*/
	public voiceOrigTextToStr(vnum:number):string
	{
		return this.voiceTextToStr(vnum,false);
	}

	public voiceModTextToStr(vnum:number):string
	{
		return this.voiceTextToStr(vnum,true);
	}

	public voiceTextToStr(vnum:number,modText:boolean):string
	{
		let text:string = "";
		for(let ms of this.musicSections)
		if( ms.getVoice_1(vnum) != null)
			{
				let sectionText:string = modText ? ms.getVoice_1(vnum).modTextToStr():ms.getVoice_1(vnum).origTextToStr();
				if( sectionText.length > 0)
					text +=( text.length > 0 ? "\n":"") + sectionText;

			}

		return text;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getDefaultMusicData():PieceData
	{
		return this.defaultMusicData;
	}

	public getTitle():string
	{
		return this.title;
	}

	public getFullTitle():string
	{
		return this.fullTitle;
	}

	public getSectionTitle():string
	{
		return this.section;
	}

	public getComposer():string
	{
		return this.composer;
	}

	public getEditor():string
	{
		return this.editor;
	}

	public getNotes():string
	{
		return this.notes;
	}

	public getPublicNotes():string
	{
		return this.publicNotes;
	}

	public getBaseColoration():Coloration
	{
		return this.baseColoration;
	}

	public getBaseMensuration():Mensuration
	{
		return this.baseMensuration;
	}

	public getEvent_1(loc:EventLocation):Event
	{
		return this.getEvent_2(loc.sectionNum,loc.voiceNum,loc.eventNum);
	}

	public getEvent_2(snum:number,vnum:number,evnum:number):Event
	{
		return this.getSection(snum).getVoice_1(vnum).getEvent(evnum);
	}

	public getVoice(vnum:number):Voice
	{
		return this.voiceData[vnum];
	}

	public getVoiceData():Voice[]
	{
		return this.voiceData;
	}

	public getNumSections():number
	{
		return this.musicSections.size();
	}

	public getSection(sectionNum:number):MusicSection
	{
		return this.musicSections.get(sectionNum);
	}

	public getSections():ArrayList<MusicSection>
	{
		return this.musicSections;
	}

	public getVariantReading(snum:number,vnum:number,eventnum:number,version:VariantVersionData):VariantReading
	{
		return this.getSection(snum).getVoice_1(vnum).getEvent(eventnum).getVariantReading_1(version);
	}

	public getDefaultVariantVersion():VariantVersionData
	{
		return this.getVariantVersion_1(0);
	}

	public getVariantVersion_1(versionNum:number):VariantVersionData
	{
		return this.variantVersions.get(versionNum);
	}

	public getVariantVersion_2(versionID:string):VariantVersionData
	{
		for(let vvd of this.variantVersions)
		if(( vvd.getID() == versionID))
			return vvd;

		return null;
	}

	public getVariantVersionNames():ArrayList<string>
	{
		let versionNames:ArrayList<string> = new ArrayList<string>(this.variantVersions.size());
		for(let vvd of this.variantVersions)
		versionNames.add(vvd.getID());
		return versionNames;
	}

	public getVariantVersions():ArrayList<VariantVersionData>
	{
		return this.variantVersions;
	}

	public getVersion():VariantVersionData
	{
		return this.curVersion;
	}

	public isDefaultVersion():boolean
	{
		return this.curVersion == null;
	}

	public isIncipitScore():boolean
	{
		return this.isIncipit;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setBaseColoration(c:Coloration):void
	{
		this.baseColoration = c;
	}

	public setCurVersion(version:VariantVersionData):void
	{
		this.curVersion = version;
	}

	public setIncipitScore(i:boolean):void
	{
		this.isIncipit = i;
		this.createFullTitle();
	}

	public setSections(musicSections:ArrayList<MusicSection>):void
	{
		this.musicSections = musicSections;
	}

	public setVariantVersions(variantVersions:ArrayList<VariantVersionData>):void
	{
		this.variantVersions = variantVersions;
	}

	public setVoiceData(vd:Voice[]):void
	{
		this.voiceData = vd;
	}

	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Prints information about this structure
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public prettyprint():void
	{
		System.out.println("Title:    " + this.title);
		if( this.section != null)
			System.out.println("Section:  " + this.section);

		System.out.println("Composer: " + this.composer);
		System.out.println("Editor:   " + this.editor);
		System.out.println("Number of voices: " + this.voiceData.length);
		for(
		let i:number = 0;i < this.voiceData.length;i ++)
		this.voiceData[i].prettyprint();
	}
}
