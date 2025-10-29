
import { StaffEventData } from './StaffEventData';
import { RenderParams } from './RenderParams';
import { RenderList } from './RenderList';
import { RenderedClefSet } from './RenderedClefSet';
import { OptionSet } from './OptionSet';
import { ArrayList } from '../java/util/ArrayList';
import { Coloration } from '../DataStruct/Coloration';
import { ColorChangeEvent } from '../DataStruct/ColorChangeEvent';
import { Event } from '../DataStruct/Event';
import { LineEndEvent } from '../DataStruct/LineEndEvent';
import { MusicSection } from '../DataStruct/MusicSection';
import { NoteEvent } from '../DataStruct/NoteEvent';
import { Voice } from '../DataStruct/Voice';
import { VoiceEventListData } from '../DataStruct/VoiceEventListData';

export class PartRenderer
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static MAX_PADDING:number = 13;
	public static MIN_PADDING:number = 7;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	/* graphics data */
	options:OptionSet;
	printPreview:boolean;
	STAFFXSIZE:number;
	/* music data */
	renderedStaves:ArrayList<RenderList>;

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  void incipitJustify(ArrayList<ArrayList<RenderList>> voices)
Purpose: For incipit view: adjust positions of events in voices so that
         all incipits take up the same horizontal space
Parameters:
  Input:  ArrayList<ArrayList<RenderList>> voices - rendered event information
  Output: voices
  Return: -
------------------------------------------------------------------------*/
	public static incipitJustify(voices:ArrayList<ArrayList<RenderList>>):void
	{
		let numVoices:number = voices.size();
		let maxX:number = 0;
		let longestVoice:number = 0;
		let curStaff:StaffEventData;
		for(
		let i:number = 0;i < numVoices;i ++)
		{
			curStaff =<StaffEventData> voices.get(i).get(0);
			let incipitXspace:number = curStaff.calcEventSpace_1(0,(( curStaff.getIncipitEndGroupIndex() - 1) | 0));
			if( incipitXspace > maxX)
				{
					maxX = incipitXspace;
					longestVoice = i;
				}

		}
		curStaff =<StaffEventData> voices.get(longestVoice).get(0);
		let totalIncipitSize:number = curStaff.padEvents_1(PartRenderer.MAX_PADDING,0,(( curStaff.getIncipitEndGroupIndex() - 1) | 0),0);
		curStaff.totalxsize =<number> curStaff.padEvents_1(PartRenderer.MAX_PADDING,curStaff.getIncipitEndGroupIndex(),(( curStaff.eventgroups.size() - 1) | 0),totalIncipitSize);
		let paddingspace:number;
		for(
		let vi:number = 0;vi < numVoices;vi ++)
		if( vi != longestVoice)
			{
				curStaff =<StaffEventData> voices.get(vi).get(0);
				let curspace:number = curStaff.calcEventSpace_1(0,(( curStaff.getIncipitEndGroupIndex() - 1) | 0));
				paddingspace =( totalIncipitSize - curspace) /<number>( curStaff.getIncipitEndGroupIndex());
				curStaff.padEvents_1(paddingspace,0,(( curStaff.getIncipitEndGroupIndex() - 1) | 0),0);
				curStaff.totalxsize =<number> curStaff.padEvents_1(PartRenderer.MAX_PADDING,curStaff.getIncipitEndGroupIndex(),(( curStaff.eventgroups.size() - 1) | 0),totalIncipitSize);
			}

	}
	/* find longest incipit */
	/* voice with longest incipit: set x coordinates */
	/* space other voices to match longest length */
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: PartRenderer(Voice voiceinfo,int sxs,boolean pp)
Purpose:     Render music of one voice part
Parameters:
  Input:  Voice voiceinfo - voice/event data
          int sxs         - total available x-size for each staff
          boolean pp      - whether to use 'print preview' mode
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(voiceinfo:Voice,sxs:number,pp:boolean)
	{
		this.STAFFXSIZE = sxs;
		this.printPreview = pp;
		this.options = OptionSet.makeDEFAULT_ORIGINAL(null);
		this.options.set_usemodernclefs(false);
		this.options.set_displayorigligatures(true);
		this.options.setViewEdCommentary(false);
		this.options.set_modacc_type(OptionSet.OPT_MODACC_NONE);
		this.options.set_unscoredDisplay(true);
		this.renderedStaves = this.renderMusicIntoStaves(voiceinfo);
	}

	atLineend(v:VoiceEventListData,evnum:number):boolean
	{
		while( evnum < v.getNumEvents())
		{
			let e:Event = v.getEvent(evnum);
			let etype:number = e.geteventtype();
			if( etype == Event.EVENT_LINEEND)
				return true;
			else
				if( etype != Event.EVENT_CUSTOS && etype != Event.EVENT_COLORCHANGE)
					return false;

			evnum ++;
		}
		return false;
	}

	skipLineendEvents(v:VoiceEventListData,evnum:number,curclef:Event):number
	{
		let i:number = evnum;
		let lineendevnum:number;
		let done:boolean = false;
		while( ! done)
		if( v.getEvent(i ++).geteventtype() == Event.EVENT_LINEEND)
			done = true;

		lineendevnum =(( i - 1) | 0);
		done = i >= v.getNumEvents();
		while( ! done)
		{
			let e:Event = v.getEvent(i);
			if( ! e.hasSignatureClef_1())
				done = true;
			else
				if( e.getClefSet_2(false).contradicts_2(curclef.getClefSet_2(false),false,null))
					done = true;

			if( ! done)
				i ++;

		}
		return(( i - evnum) | 0);
	}
	/* skip to line end */
	/* skip clef information */
	/*------------------------------------------------------------------------
Method:  ArrayList<RenderList> renderMusicIntoStaves(Voice voiceInfo)
Purpose: Divide event list into staves and calculate x-locations for events
Parameters:
  Input:  Voice voiceInfo - original event information for all sections
  Output: -
  Return: list of structures, each containing event placement information
          for one staff
------------------------------------------------------------------------*/
	static DEFAULT_GROUPS_PER_STAFF:number = 35;
	static MIN_GROUPS_FROM_SECTION:number = 8;

	public renderMusicIntoStaves(voiceInfo:Voice):ArrayList<RenderList>
	{
		let addstaff:boolean = true;
		let bracketopen:boolean = false;
		let endSection:boolean = false;
		let cureventnum:number;
		let renderedeventnum:number = 0;
		let clefeventnum:number = - 1;
		let vcen:number = - 1;
		let eventnumadd:number;
		let colorbracketleft:number = - 1;
		let curevent:Event;
		let staves:ArrayList<RenderList> = new ArrayList<RenderList>();
		let curstaff:StaffEventData = null;
		let clefStaffData:StaffEventData = null;
		let clefVoice:VoiceEventListData = null;
		let numSections:number = voiceInfo.getGeneralData().getNumSections();
		for(
		let si:number = 0;si < numSections;si ++)
		{
			let curSection:MusicSection = voiceInfo.getGeneralData().getSection(si);
			let v:VoiceEventListData = curSection.getVoice_1((( voiceInfo.getNum() - 1) | 0));
			let doneSection:boolean = v == null ||( v.getNumEvents() < 2 && ! addstaff) || curSection.isEditorial();
			if( ! doneSection && voiceInfo.getGeneralData().isIncipitScore() && numSections > 1 && si ==(( numSections - 1) | 0))
				{
					curstaff.addevent_1(true,Event.new1(Event.EVENT_ELLIPSIS),RenderParams.new1(this.getClefEvents(clefStaffData,clefeventnum)));
				}

			cureventnum = 0;
			while( ! doneSection)
			{
				eventnumadd = 1;
				if( addstaff)
					{
						if( curstaff != null)
							curstaff.totalxsize = this.calcstaffxlocs(curstaff,this.STAFFXSIZE,endSection);

						curstaff = StaffEventData.new2(this.options,v.getMetaData(),curSection);
						staves.add(curstaff);
						renderedeventnum = 0;
						clefeventnum = - 1;
						addstaff = false;
						endSection = false;
						if( this.printPreview &&( cureventnum > 0 || si > 0))
							{
								clefeventnum = 0;
								renderedeventnum += curstaff.addclefgroup(clefVoice,vcen,RenderParams.new1(this.getClefEvents(clefStaffData,clefeventnum)));
							}

					}

				curevent = v.getEvent(cureventnum);
				let etype:number = curevent.geteventtype();
				if( etype == Event.EVENT_LINEEND && ! this.printPreview)
					addstaff = true;
				else
					if( this.printPreview && this.atLineend(v,cureventnum))
						{
							eventnumadd = this.skipLineendEvents(v,cureventnum,clefVoice.getEvent(vcen));
							if( v.getEvent((((( cureventnum + eventnumadd) | 0) - 1) | 0)).geteventtype() == Event.EVENT_LINEEND)
								{
									curstaff.addevent_1(true,LineEndEvent.new15(),RenderParams.new1(this.getClefEvents(clefStaffData,clefeventnum)));
									renderedeventnum ++;
								}

						}

					else
						if( etype == Event.EVENT_COLORCHANGE && this.printPreview)
							{
								if(( ! bracketopen) &&(<ColorChangeEvent> curevent).getcolorscheme().primaryColor != Coloration.BLACK)
									colorbracketleft = renderedeventnum;
								else
									if( bracketopen &&(<ColorChangeEvent> curevent).getcolorscheme().primaryColor == Coloration.BLACK)
										{
											curstaff.getEvent((( renderedeventnum - 1) | 0)).addcolorbracket(1);
											bracketopen = false;
										}

							}

						else
							if( etype != Event.EVENT_PROPORTION)
								{
									if( curevent.hasPrincipalClef_1())
										{
											clefStaffData = curstaff;
											clefeventnum = renderedeventnum;
											clefVoice = v;
											vcen = cureventnum;
										}

									if( etype == Event.EVENT_NOTE &&(<NoteEvent> curevent).isligated())
										eventnumadd = curstaff.addlig_1(v,cureventnum,RenderParams.new1(this.getClefEvents(clefStaffData,clefeventnum)));
									else
										curstaff.addevent_1(true,curevent,RenderParams.new1(this.getClefEvents(clefStaffData,clefeventnum)));

									renderedeventnum += eventnumadd;
								}

				if( etype != Event.EVENT_LINEEND)
					endSection = false;
				else
					if((<LineEndEvent> curevent).isPageEnd())
						endSection = true;

				if( colorbracketleft != - 1 && renderedeventnum > colorbracketleft)
					{
						curstaff.getEvent(colorbracketleft).addcolorbracket(0);
						colorbracketleft = - 1;
						bracketopen = true;
					}

				cureventnum += eventnumadd;
				doneSection = cureventnum >= v.getNumEvents();
				if(( this.printPreview && ! doneSection && curstaff.eventgroups.size() >= PartRenderer.DEFAULT_GROUPS_PER_STAFF && ! curstaff.groupwithprevious(v.getEvent(cureventnum)) &&(( v.getNumEvents() - cureventnum) | 0) >= PartRenderer.MIN_GROUPS_FROM_SECTION && !( bracketopen && v.getEvent(cureventnum).geteventtype() == Event.EVENT_COLORCHANGE) && etype != Event.EVENT_CLEF) ||( this.printPreview && doneSection && curstaff.eventgroups.size() >(( PartRenderer.DEFAULT_GROUPS_PER_STAFF - PartRenderer.MIN_GROUPS_FROM_SECTION) | 0)))
					addstaff = true;

				if( addstaff)
					curstaff.addevent_1(false,Event.new0(),RenderParams.new1(this.getClefEvents(clefStaffData,clefeventnum)));

			}
		}
		if( curstaff != null)
			if( staves.size() > 1)
				curstaff.totalxsize = this.calcstaffxlocs(curstaff,this.STAFFXSIZE,true);
			else
				if( curstaff.eventgroups.size() >(( PartRenderer.DEFAULT_GROUPS_PER_STAFF - PartRenderer.MIN_GROUPS_FROM_SECTION) | 0))
					curstaff.totalxsize = this.calcstaffxlocs(curstaff,this.STAFFXSIZE,true);
				else
					curstaff.totalxsize =<number>( curstaff.padEvents_2(PartRenderer.MIN_PADDING));

		return staves;
	}

	/* do finishing calculations */
	/* initialize new blank staff */
	/* create new clef set for non-original line breaks */
	/*            if (etype==Event.EVENT_BARLINE)
              endSection=true;
            else*/
	/* don't start a new line with a close bracket */
	getClefEvents(clefStaffData:StaffEventData,clefEventNum:number):RenderedClefSet
	{
		return clefStaffData == null ? null:clefStaffData.getClefEvents(clefEventNum);
	}

	/*------------------------------------------------------------------------
Method:  int calcstaffxlocs(StaffEventData events,int xsize,boolean laststaff)
Purpose: Calculate x-locations for events on one staff (justified spacing)
Parameters:
  Input:  StaffEventData events - events on staff
          int xsize             - total x space to fill
          boolean laststaff     - whether this is the last staff of the section
  Output: -
  Return: total space used
------------------------------------------------------------------------*/
	calcstaffxlocs(events:StaffEventData,xsize:number,laststaff:boolean):number
	{
		let totaleventspace:number = events.calcEventSpace_2();
		let paddingspace:number =((( xsize - totaleventspace) | 0)) /<number>( events.eventgroups.size());
		if( laststaff && paddingspace > PartRenderer.MAX_PADDING)
			paddingspace = PartRenderer.MAX_PADDING;

		return<number>( events.padEvents_2(paddingspace));
	}

	/* calculate justification size */
	/* set x coordinates */
	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getRenderedData():ArrayList<RenderList>
	{
		return this.renderedStaves;
	}
}
