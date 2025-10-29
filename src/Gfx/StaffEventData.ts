
import { RenderParams } from './RenderParams';
import { RenderList } from './RenderList';
import { RenderedEventGroup } from './RenderedEventGroup';
import { RenderedEvent } from './RenderedEvent';
import { OptionSet } from './OptionSet';
import { MusicFont } from './MusicFont';
import { ArrayList } from '../java/util/ArrayList';
import { Clef } from '../DataStruct/Clef';
import { ClefSet } from '../DataStruct/ClefSet';
import { DotEvent } from '../DataStruct/DotEvent';
import { Event } from '../DataStruct/Event';
import { EventListData } from '../DataStruct/EventListData';
import { MusicSection } from '../DataStruct/MusicSection';
import { NoteEvent } from '../DataStruct/NoteEvent';
import { Voice } from '../DataStruct/Voice';
import { VoiceEventListData } from '../DataStruct/VoiceEventListData';

export class StaffEventData extends RenderList
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public eventgroups:ArrayList<RenderedEventGroup>;
	/* index list of event groups */
	incipitEndGroupIndex:number;

	public static new2(o:OptionSet,v:Voice,section:MusicSection):StaffEventData
	{
		let _new2:StaffEventData = new StaffEventData;
		StaffEventData.set2(_new2,o,v,section);
		return _new2;
	}

	public static set2(new2:StaffEventData,o:OptionSet,v:Voice,section:MusicSection):void
	{
		RenderList.set0_2(new2,o,v,section);
		new2.eventgroups = new ArrayList<RenderedEventGroup>();
		new2.incipitEndGroupIndex = - 1;
	}

	public static new3(v:Voice,section:MusicSection):StaffEventData
	{
		let _new3:StaffEventData = new StaffEventData;
		StaffEventData.set3(_new3,v,section);
		return _new3;
	}

	public static set3(new3:StaffEventData,v:Voice,section:MusicSection):void
	{
		StaffEventData.set2(new3,OptionSet.makeDEFAULT_ORIGINAL(null),v,section);
	}

	public static new4():StaffEventData
	{
		let _new4:StaffEventData = new StaffEventData;
		StaffEventData.set4(_new4);
		return _new4;
	}

	public static set4(new4:StaffEventData):void
	{
		StaffEventData.set3(new4,null,null);
	}

	public getEventgroup(i:number):RenderedEventGroup
	{
		return<RenderedEventGroup>( this.eventgroups.get(i));
	}

	/*------------------------------------------------------------------------
Method:  int calcEventSpace([,int starti,int endi])
Purpose: Calculate x-space taken up by rendered events on staff
Parameters:
  Input:  int starti,endi       - start and end group indices for summation
  Output: -
  Return: total x-space
------------------------------------------------------------------------*/
	public calcEventSpace_1(starti:number,endi:number):number
	{
		let eg:RenderedEventGroup;
		let totaleventspace:number = 0;
		for(
		let i:number = starti;i <= endi;i ++)
		{
			eg = this.getEventgroup(i);
			totaleventspace += this.getgrouprenderedxsize(eg);
		}
		return totaleventspace;
	}

	public calcEventSpace_2():number
	{
		return this.calcEventSpace_1(0,(( this.eventgroups.size() - 1) | 0));
	}

	public getgrouprenderedxsize(eg:RenderedEventGroup):number
	{
		let totalsize:number = 0;
		let lastx:number = 0;
		let cure:RenderedEvent;
		for(
		let i:number = eg.firstEventNum;i <= eg.lastEventNum;i ++)
		{
			cure = this.getEvent(i);
			if( eg.grouptype != RenderedEventGroup.EVENTGROUP_LIG || cure.getEvent_1().geteventtype() == Event.EVENT_NOTE)
				{
					lastx = totalsize;
					totalsize += cure.getrenderedxsize();
				}

		}
		return totalsize;
	}

	/* within a ligature, */
	/* only notes take up space */
	public setgroupxlocs(eg:RenderedEventGroup,x:number):void
	{
		let lastx:number = x;
		for(
		let i:number = eg.firstEventNum;i <= eg.lastEventNum;i ++)
		{
			let re:RenderedEvent = this.getEvent(i);
			if( eg.grouptype != RenderedEventGroup.EVENTGROUP_LIG || re.getEvent_1().hasEventType_1(Event.EVENT_NOTE))
				{
					lastx = x;
					re.setxloc(x);
					x += re.getrenderedxsize();
				}

			else
				re.setxloc(lastx + MusicFont.getDefaultGlyphWidth((( MusicFont.PIC_NOTESTART + NoteEvent.NOTEHEADSTYLE_BREVE) | 0)));

		}
	}

	/* within a ligature, */
	/* only notes take up space */
	/*------------------------------------------------------------------------
Method:  double padEvents(double paddingspace[,int starti,int endi,double curx])
Purpose: Set event group x-locations, given a padding value (space between
         groups)
Parameters:
  Input:  double paddingspace   - x-space to place between groups
          int starti,endi       - start and end group indices for operation
          double curx           - starting x-value
  Output: events
  Return: total x-space
------------------------------------------------------------------------*/
	public padEvents_1(paddingspace:number,starti:number,endi:number,curx:number):number
	{
		let eg:RenderedEventGroup;
		for(
		let i:number = starti;i <= endi;i ++)
		{
			eg = this.getEventgroup(i);
			this.setgroupxlocs(eg,curx);
			curx += this.getgrouprenderedxsize(eg) + paddingspace;
		}
		return curx;
	}

	public padEvents_2(paddingspace:number):number
	{
		return this.padEvents_1(paddingspace,0,(( this.eventgroups.size() - 1) | 0),0);
	}

	/* should this event be grouped with the last one? e.g., dot + note */
	public groupwithprevious(e:Event):boolean
	{
		if( this.eventgroups.size() <= 0)
			return false;

		if( e.alignedWithPrevious())
			return true;

		let laste:Event = this.getEvent((( this.size() - 1) | 0)).getEvent_1();
		switch( e.geteventtype())
		{
			case Event.EVENT_DOT:
			{
				if(((<DotEvent> e).getdottype() & DotEvent.DT_Addition) != 0)
					return true;

				break;
			}
		}
		if( e.hasEventType_1(Event.EVENT_CLEF) && e.getClefSet_1() != null && laste.getClefSet_1() != null && e.getClefSet_1().containsClef(laste.getClefSet_1().getprincipalclef()))
			return true;

		switch( laste.geteventtype())
		{
			case Event.EVENT_ANNOTATIONTEXT:
			{
			}
			case Event.EVENT_COLORCHANGE:
			{
			}
			case Event.EVENT_MODERNKEYSIGNATURE:
			{
			}
			case Event.EVENT_ORIGINALTEXT:
			{
			}
			case Event.EVENT_PROPORTION:
			{
			}
			case Event.EVENT_VARIANTDATA_START:
			{
			}
			case Event.EVENT_VARIANTDATA_END:
			{
				return true;
			}
		}
		return false;
	}

	/*------------------------------------------------------------------------
Method:  boolean isEllipsis(RenderedEventGroup eg)
Purpose: Is this event group an Ellipsis event (end of incipit)?
Parameters:
  Input:  RenderedEventGroup eg - event group to check
  Output: -
  Return: whether this is an Ellipsis event
------------------------------------------------------------------------*/
	public isEllipsis(eg:RenderedEventGroup):boolean
	{
		return this.getEvent(eg.firstEventNum).getEvent_1().geteventtype() == Event.EVENT_ELLIPSIS;
	}

	/* override RenderList functions to incorporate groups */
	public addevent_1(display:boolean,e:Event,rp:RenderParams):RenderedEvent
	{
		if( e.geteventtype() == Event.EVENT_ELLIPSIS)
			this.incipitEndGroupIndex = this.eventgroups.size();

		if( this.groupwithprevious(e))
			this.getEventgroup((( this.eventgroups.size() - 1) | 0)).lastEventNum = this.size();
		else
			this.eventgroups.add(RenderedEventGroup.new0(this.size()));

		return super.addevent_1(display,e,rp);
	}

	/* add to end of last group */
	public addlig_1(v:EventListData,evnum:number,rp:RenderParams):number
	{
		return this.addlig_2(v,evnum,rp,false);
	}

	public addlig_2(v:EventListData,evnum:number,rp:RenderParams,varDisplay:boolean):number
	{
		let gwp:boolean = this.groupwithprevious(v.getEvent(evnum));
		let ligsize:number = super.addlig_2(v,evnum,rp,varDisplay);
		if( gwp)
			{
				let lastGroup:RenderedEventGroup = this.getEventgroup((( this.eventgroups.size() - 1) | 0));
				lastGroup.lastEventNum =(( this.size() - 1) | 0);
				lastGroup.grouptype = RenderedEventGroup.EVENTGROUP_LIG;
			}

		else
			this.eventgroups.add(RenderedEventGroup.new1((( this.size() - ligsize) | 0),(( this.size() - 1) | 0)));

		return ligsize;
	}

	public addlig_3(rl:RenderList,revnum:number,rp:RenderParams):number
	{
		return this.addlig_4(rl,revnum,rp,false);
	}

	createLigList(rl:RenderList,revnum:number):EventListData
	{
		let ligList:EventListData = EventListData.new0();
		let e:Event = rl.getEvent(revnum).getEvent_1();
		let done:boolean = false;
		while( ! done)
		{
			ligList.addEvent_1(e);
			let ne:NoteEvent =<NoteEvent> e.getFirstEventOfType_1(Event.EVENT_NOTE);
			if( ne != null && ! ne.isligated())
				done = true;
			else
				e = rl.getEvent(++ revnum).getEvent_1();

		}
		return ligList;
	}

	public addlig_4(rl:RenderList,revnum:number,rp:RenderParams,varDisplay:boolean):number
	{
		let gwp:boolean = this.groupwithprevious(rl.getEvent(revnum).getEvent_1());
		let ligList:EventListData = this.createLigList(rl,revnum);
		let ligsize:number = super.addlig_2(ligList,0,rp,varDisplay);
		if( gwp)
			{
				let lastGroup:RenderedEventGroup = this.getEventgroup((( this.eventgroups.size() - 1) | 0));
				lastGroup.lastEventNum =(( this.size() - 1) | 0);
				lastGroup.grouptype = RenderedEventGroup.EVENTGROUP_LIG;
			}

		else
			this.eventgroups.add(RenderedEventGroup.new1((( this.size() - ligsize) | 0),(( this.size() - 1) | 0)));

		return ligsize;
	}

	public addclefgroup(v:VoiceEventListData,cenum:number,rp:RenderParams):number
	{
		if( cenum == - 1)
			return 0;

		let i:number = cenum;
		let e:Event = v.getEvent(i);
		let origcs:ClefSet = null;
		let origClef:Clef = null;
		if( e == null || ! e.hasSignatureClef_1())
			return 0;

		origcs = e.getClefSet_2(this.options.get_usemodernclefs());
		origClef = origcs.getprincipalclef();
		let done:boolean = false;
		while( ! done)
		{
			this.addevent_1(true,e,rp);
			e = v.getEvent(++ i);
			if( e == null || ! e.hasSignatureClef_1() || ! e.getClefSet_2(this.options.get_usemodernclefs()).containsClef(origClef))
				done = true;

		}
		return(( i - cenum) | 0);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getIncipitEndGroupIndex():number
	{
		if( this.incipitEndGroupIndex == - 1)
			return this.eventgroups.size();
		else
			return this.incipitEndGroupIndex;

	}

	public getNextEventWithType(eventType:number,i:number,dir:number):number
	{
		for(
		;i >= 0 && i < this.size();i += dir)
		if( this.getEvent(i).getEvent_1().hasEventType_1(eventType))
			return i;

		return - 1;
	}
}
