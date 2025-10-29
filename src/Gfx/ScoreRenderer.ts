
import { System } from '../java/lang/System';
import { RenderParams } from './RenderParams';
import { RenderList } from './RenderList';
import { RenderedSonority } from './RenderedSonority';
import { RenderedSectionParams } from './RenderedSectionParams';
import { RenderedLigature } from './RenderedLigature';
import { RenderedEventGroup } from './RenderedEventGroup';
import { RenderedEvent } from './RenderedEvent';
import { RenderedClefSet } from './RenderedClefSet';
import { OptionSet } from './OptionSet';
import { MusicFont } from './MusicFont';
import { MeasureList } from './MeasureList';
import { MeasureInfo } from './MeasureInfo';
import { EventStringImg } from './EventStringImg';
/*----------------------------------------------------------------------*/
/*

        Module          : ScoreRenderer.java

        Package         : Gfx

        Classes Included: ScoreRenderer,VoiceGfxInfo

        Purpose         : "Prerenders" music events of one mensural music
                          section into scored measure array to facilitate quick
                          random access display

        Programmer      : Ted Dumitrescu

        Date Started    : 4/23/99

Updates:
3/21/05:  added ligature pitch information (for calculating height)
3/23/05:  fixed bug causing ending dot to add an extra measure
4/5/05:   modified rendering cycle to ensure that new untimed events are added to
          the end of the previous measure, rather than the beginning of a new one
4/11/05:  implemented non-displaying rendered events and new insertions into
          render list (for automated key signature conversion routines)
5/18/05:  automatically adds PIECEEND event to the end of every voice's event
          list (to simplify editor functions) - 6/05 moved to parser code
6/16/05:  timed events can now take extra space if their image size is larger
          than the time-based x space allocation (e.g., for semifusae)
          corrected precision for x-coordinates (replaced ints with doubles)
7/21/05:  renamed from MusicRenderer to ScoreRenderer (to differentiate from
          rendering into separate parts)
9/9/05:   implemented arbitrary rhythmic proportional transformation
9/19/05:  converted musictime tally from double to Proportion (to avoid
          imprecision errors)
9/24/05:  added support for simultaneous events at one x-location in one voice
          (XPOS_SIMULTANEOUS event positioning)
2/24/06:  converted from breve- to minim-based timekeeping (for simplification
          of mensuration comparisons, e.g., combining proportions with multiple
          mensurations)
3/15/06:  started modifying renderer to support special layout of incipit-scores:
          incipit - blank space (ellipsis) - explicit
4/5/06:   current ligature information is now held in a separate structure
          (RenderedLigature)
8/06:     fixed various clef-replacement problems (e.g., skipped events still
          being used to set voice parameters; editorial section brackets still
          being displayed when all contents have been skipped)
11/10/06: added position type XPOS_WITHNEXT for rendering events which are
          always in the same measure as the next event (e.g., OriginalText)
2/28/06:  now renders one mensural section instead of entire piece
4/26/07:  added RenderedSectionParams to pass voice parameters (clefs, mens,
          etc.) between sections
1/08:     added respacing functions for rhythmic-error variants
2/13/08:  fixed rendering crash with certain variant-respacing situations
2/16/08:  fixed error where advanceOneMeasure doesn't get called for final
          measure in section (introduced by mods to renderAllMensuralEvents
          for variant-respacing)
8/4/08:   migrated to two-stage modularized rendering process:
          1. create rendered event lists with replacements/insertions/deletions
             as necessary for display (according to selected options)
          2. assign x-positions to all rendered events to align in score
12/27/08: improved dot-spacing so that variant markers/original text/etc
          don't push dots far to the right
1/12/09:  fixed WITHNEXT texting so OriginalText event appears in same
          measure as next visible event even when inside variant
3/20/09:  finished implementing variant text display (showing variant texting
          now yields the same display whether in a default or non-default
          version)
9/24/09:  fixed spacing bug when rhythmic-error variant is within proportional
          section

                                                                        */
/*----------------------------------------------------------------------*/
/*----------------------------------------------------------------------*/
/* Imported packages */
import { FontMetrics } from '../java/awt/FontMetrics';
import { ArrayList } from '../java/util/ArrayList';
import { Iterator } from '../java/util/Iterator';
import { LinkedList } from '../java/util/LinkedList';
import { Clef } from '../DataStruct/Clef';
import { ClefEvent } from '../DataStruct/ClefEvent';
import { ClefSet } from '../DataStruct/ClefSet';
import { Coloration } from '../DataStruct/Coloration';
import { ColorChangeEvent } from '../DataStruct/ColorChangeEvent';
import { DotEvent } from '../DataStruct/DotEvent';
import { Event } from '../DataStruct/Event';
import { LineEndEvent } from '../DataStruct/LineEndEvent';
import { MensEvent } from '../DataStruct/MensEvent';
import { Mensuration } from '../DataStruct/Mensuration';
import { MultiEvent } from '../DataStruct/MultiEvent';
import { MusicChantSection } from '../DataStruct/MusicChantSection';
import { MusicMensuralSection } from '../DataStruct/MusicMensuralSection';
import { MusicSection } from '../DataStruct/MusicSection';
import { MusicTextSection } from '../DataStruct/MusicTextSection';
import { NoteEvent } from '../DataStruct/NoteEvent';
import { OriginalTextEvent } from '../DataStruct/OriginalTextEvent';
import { PieceData } from '../DataStruct/PieceData';
import { Proportion } from '../DataStruct/Proportion';
import { ProportionEvent } from '../DataStruct/ProportionEvent';
import { VariantMarkerEvent } from '../DataStruct/VariantMarkerEvent';
import { VariantReading } from '../DataStruct/VariantReading';
import { VariantVersionData } from '../DataStruct/VariantVersionData';
import { VoiceChantData } from '../DataStruct/VoiceChantData';
import { VoiceEventListData } from '../DataStruct/VoiceEventListData';

export class VoiceGfxInfo
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public renderer:ScoreRenderer;
	public v:VoiceEventListData;
	/* event list info */
	public voicenum:number;
	/* voice number */
	public next:VoiceGfxInfo;
	public last:VoiceGfxInfo;
	/* for voice list;
                                          voices are always sorted in this list by
                                          current musical time (musictime) */
	public clefedata:Event;
	/* event data for current clef */
	public clefEvents:RenderedClefSet;
	/* current clef set */
	public mensEvent:RenderedEvent;
	/* current mensuration sign */
	public curProportion:Proportion;
	/* currently applied rhythmic proportion */
	public tempoProportion:Proportion;
	/* tempo/visual proportion */
	public numMinimsInBreve:number;
	public curColoration:Coloration;
	/* currently applied coloration scheme */
	public inEditorialSection:boolean;
	/* whether current events are editorial */
	public missingInVersion:boolean;
	/* whether current events are missing in version being rendered */
	public lastNoteEvent:RenderedEvent;
	/* previous note event (if relevant) */
	public curSoundingEvent:RenderedEvent;
	/* note currently sounding */
	public replacementEvents:ArrayList<Event>;
	/* extra events to be inserted into render list */
	public withnextEvents:number;
	/* number of XPOS_WITHNEXT events to add with next rendered event */
	public lastTimedEventNum:number;
	/* index of last timed event */
	public immediatePositioning:boolean;
	/* true if temporarily forcing every
                                                   event to be XPOS_IMMEDIATE */
	public musictime:Proportion;
	/* current time position of voice */
	public xloc:number;
	/* current graphical x position */
	public xadd:number;
	/* used in temporary position calculations */
	public lastx:number;
	/* starting x coord of last displayed event */
	public evloc:number;
	/* current voice position in event list */
	public revloc:number;
	/* current voice position in rendered event list */
	public ligInfo:RenderedLigature;
	/* current ligature info */
	public tieInfo:RenderedLigature;
	/* tied note info */
	public colorBeginLoc:number;
	/* indices for coloration brackets */
	public colorEndLoc:number;
	public varReadingInfo:RenderedEventGroup;
	/* current variant reading start/end */
	public varDefaultTimeAdd:Proportion;
	/* default length when variant is shroter than default */
	public respaceAfterVar:boolean;
	/* whether to respace after variant */
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: VoiceGfxInfo(ScoreRenderer renderer,VoiceMensuralData voice)
Purpose:     Initialize structure
Parameters:
  Input:  ScoreRenderer renderer  - renderer to which this voice belongs
          VoiceMensuralData voice - data for this structure's voice
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(renderer:ScoreRenderer,voice:VoiceEventListData)
	{
		this.renderer = renderer;
		this.v = voice;
	}

	/*------------------------------------------------------------------------
Method:  RenderedEvent getlastvisibleEvent(RenderList rl,int el)
Purpose: Find previous displayed event at a given index
Parameters:
  Input:  RenderList rl - rendered event list for this voice
          int el        - index of event to start search
  Output: -
  Return: last displayed event
------------------------------------------------------------------------*/
	getlastvisibleEvent(rl:RenderList,el:number):RenderedEvent
	{
		let i:number;
		for(
		i =(( el - 1) | 0);i >= 0 && rl.getEvent(i).getrenderedxsize() == 0;i --)
		;
		return rl.getEvent(i);
	}

	/*------------------------------------------------------------------------
Method:  double movebackNOSPACEEvents(RenderList rl,int el,double xamount)
Purpose: Try to push back x-locations of NOSPACE events at a given index
         (to make room for a new NOSPACE event)
Parameters:
  Input:  RenderList rl  - rendered event list for this voice
          int el         - index of event to start 
          double xamount - amount to try to push back events
  Output: -
  Return: new x-location after current event
------------------------------------------------------------------------*/
	movebackNOSPACEEvents(rl:RenderList,el:number,xamount:number):number
	{
		if( el < 0)
			return 0;

		let re:RenderedEvent = rl.getEvent(el);
		if( el > 0 && ScoreRenderer.getxspacing(re.getEvent_1()) == ScoreRenderer.XSPACING_NOSPACE)
			{
				let curxl:number = this.movebackNOSPACEEvents(rl,(( el - 1) | 0),xamount);
				if( curxl < re.getxloc() - xamount)
					curxl = re.getxloc() - xamount;

				if( this.renderer.getXPosType_1(re.getEvent_1()) == ScoreRenderer.XPOS_SIMULTANEOUS)
					curxl = rl.getEvent((( el - 1) | 0)).getxloc();

				re.setxloc(curxl);
			}

		return re.getxend();
	}

	/*------------------------------------------------------------------------
Method:  void moveupBEFORENEXTEvents(RenderList rl,double xamount)
Purpose: Try to push up x-locations of BEFORENEXT events at current location
         (if the measure has increased in size after the events were already
         rendered)
Parameters:
  Input:  RenderList rl  - rendered event list for this voice
          double xamount - amount to push up events
  Output: -
  Return: -
------------------------------------------------------------------------*/
	moveupBEFORENEXTevents(rl:RenderList,xamount:number):void
	{
		if( this.musictime.i1 == 0)
			return;

		let done:boolean = false;
		for(
		let el:number =(( this.revloc - 1) | 0);el >= 0 && ! done;el --)
		{
			if( el < 0)
				done = true;
			else
				{
					let re:RenderedEvent = rl.getEvent(el);
					if( ScoreRenderer.getXSpacing(re) == ScoreRenderer.XSPACING_NOSPACE && this.renderer.getXPosType_2(re) == ScoreRenderer.XPOS_BEFORENEXT)
						re.setxloc(re.getxloc() + xamount);
					else
						done = true;

				}

		}
	}

	/* hack: don't apply to initial clefs/mensurations */
	/*------------------------------------------------------------------------
Method:  double calcXLoc(RenderList rl,RenderedEvent e)
Purpose: Calculate x location for a rendered event
Parameters:
  Input:  RenderedEvent e - event
          RenderList rl   - rendered event list for this voice
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public calcXLoc(rl:RenderList,re:RenderedEvent):number
	{
		let retval:number;
		if( this.revloc > 0 && this.renderer.getXPosType_2(re) == ScoreRenderer.XPOS_SIMULTANEOUS)
			retval = this.lastx;
		else
			if( this.revloc > 0 &&( this.renderer.getXPosType_2(re) == ScoreRenderer.XPOS_IMMEDIATE || this.immediatePositioning))
				retval = this.lastx + this.getlastvisibleEvent(rl,this.revloc).getRenderedXSizeWithoutText();
			else
				if( ScoreRenderer.getXSpacing(re) == ScoreRenderer.XSPACING_NOSPACE)
					{
						retval = this.movebackNOSPACEEvents(rl,(( this.revloc - 1) | 0),re.getrenderedxsize());
						if( retval < this.xloc - re.getrenderedxsize())
							retval = this.xloc - re.getrenderedxsize();

					}

				else
					retval = this.xloc;

		return retval < 0 ? 0:retval;
	}
}

/* XPOS_SIMULTANEOUS events (vertically aligned with previous event) */
/* XPOS_IMMEDIATE events (e.g., dots of addition) */
/* XSPACING_NOSPACE events (e.g., clefs) */
/*------------------------------------------------------------------------
Class:   ScoreRenderer
Extends: -
Purpose: Prerenders music
------------------------------------------------------------------------*/
export class ScoreRenderer
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	static BARLINE_XADD:number = 4;
	/* amount of blank space at measure beginning
                                   to accommodate barlines */
	static CHANT_XPADDING_B:number = 13;
	/* space between symbols in chant sections */
	static CHANT_XPADDING_SB:number = 3;
	static CHANT_XPADDING_DOT:number = 3;
	static CHANT_XPADDING_DEFAULT:number = 3;
	public static SECTION_END_SPACING:number = 10;
	/* event x positioning relative to previous events */
	public static XPOS_BEFORENEXT:number = 0;
	/* immediately before next event */
	public static XPOS_IMMEDIATE:number = 1;
	/* immediately after previous event */
	public static XPOS_HALF:number = 2;
	/* halfway between events */
	public static XPOS_SIMULTANEOUS:number = 3;
	/* aligned vertically with previous event */
	public static XPOS_WITHNEXT:number = 4;
	/* aligned vertically with next event */
	public static XPOS_INVISIBLE:number = 5;
	/* not displayed, can be pushed around */
	/* x space taken by an event */
	public static XSPACING_TIMED:number = 0;
	/* x space relative to musical time */
	public static XSPACING_UNTIMED:number = 1;
	/* x space based only on image size */
	public static XSPACING_NOSPACE:number = 2;
	/* try not to take any extra space */
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public measures:MeasureList;
	public eventinfo:RenderList[];
	/* rendered event information */
	public sonorityList:ArrayList<RenderedSonority>;
	/* sonority information for entire score */
	fullPieceData:PieceData;
	sectionNum:number;
	musicData:MusicSection;
	options:OptionSet;
	startingParams:RenderedSectionParams[];
	endingParams:RenderedSectionParams[];
	/* music display parameters */
	/* default amount of horizontal space taken by one breve */
	MINIMSCALE:number;
	BREVESCALE:number;
	numVoices:number;
	voicegfx:VoiceGfxInfo[];
	liststart:VoiceGfxInfo;
	startX:number;
	/* rendering parameters */
	curMeasureNum:number;
	curmeasure:MeasureInfo;
	barxstart:number;
	starttime:Proportion;
	skipevents:number;
	/* number of events to 'skip' displaying */
	errorRespacingTime:Proportion;
	/* for re-spacing so that variant rhythmic
                                          errors don't invalidate the rest of a
                                          voice */
	variantVoice:VoiceGfxInfo;
	/* voice with variant causing respacing */
	curSonority:RenderedSonority;
	finalisList:LinkedList<VoiceGfxInfo>;
	/* for incipit-scores; displaying explicits
                                           after ellipses */
	/* mensuration parameters */
	public baseMensuration:Mensuration;
	public numMinimsInBreve:number;
	measureProportion:Proportion;
	lastMens:Mensuration;
	/* for determining whether multiple voices are
                                  changing mensuration simultaneously */
	lastMensTime:Proportion;
	/* options */
	barline_type:number;
	noteShapeType:number;
	useModernClefs:boolean;
	useModernAccSystem:boolean;
	displayallnewlineclefs:boolean;
	displayVarTexts:boolean;

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  ScoreRenderer[] renderSections(PieceData musicToRender,OptionSet options)
Purpose: Render a complete set of music sections, creating renderers as
         necessary
Parameters:
  Input:  PieceData musicToRender - music data to be rendered
          OptionSet options       - display options
  Output: -
  Return: array of score renderers with rendered music section by section
------------------------------------------------------------------------*/
	public static renderSections(musicToRender:PieceData,options:OptionSet):ScoreRenderer[]
	{
		let startX:number = 0;
		let numVoices:number = musicToRender.getVoiceData().length;
		let sectionParams:RenderedSectionParams[]= Array(numVoices);
		for(
		let i:number = 0;i < numVoices;i ++)
		sectionParams[i]= RenderedSectionParams.new0();
		let numSections:number = musicToRender.getNumSections();
		let renderedSections:ScoreRenderer[]= Array(numSections);
		let nummeasures:number = 0;
		for(
		let i:number = 0;i < numSections;i ++)
		{
			renderedSections[i]= new ScoreRenderer(i,musicToRender.getSection(i),musicToRender,sectionParams,options,nummeasures,startX);
			sectionParams = renderedSections[i].getEndingParams();
			nummeasures += renderedSections[i].getNumMeasures();
			startX += renderedSections[i].getXsize() + ScoreRenderer.SECTION_END_SPACING;
		}
		return renderedSections;
	}

	/* initialize voice parameters */
	/* initialize sections */
	/*------------------------------------------------------------------------
Method:  int calcRendererNum(ScoreRenderer[] renderedSections,int m)
Purpose: Calculate index of (rendered) section within an array containing
         a given measure
Parameters:
  Input:  ScoreRenderer[] renderedSections - section array
          int m                            - measure number
  Output: -
  Return: section number
------------------------------------------------------------------------*/
	public static calcRendererNum(renderedSections:ScoreRenderer[],m:number):number
	{
		for(
		let si:number = 0;si < renderedSections.length;si ++)
		if( m <= renderedSections[si].getLastMeasureNum())
			return si;

		return - 1;
	}

	/* error: m>number of measures in piece */
	/*------------------------------------------------------------------------
Method:  int getxspacing(Event e)
Purpose: Calculate x-spacing type for a given event
Parameters:
  Input:  -
  Output: -
  Return: XSPACING type
------------------------------------------------------------------------*/
	static getxspacing(e:Event):number
	{
		if( e.getmusictime().i1 > 0)
			return ScoreRenderer.XSPACING_TIMED;
		else
			return ScoreRenderer.XSPACING_NOSPACE;

	}

	static getXSpacing(re:RenderedEvent):number
	{
		return ScoreRenderer.getxspacing(re.getEvent_1());
	}
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: ScoreRenderer(int sectionNum,MusicSection ms,PieceData fullPieceData,
                           RenderedSectionParams[] rsp,
                           OptionSet o,int fmn,double sx)
Purpose:     Initialize renderer
Parameters:
  Input:  int sectionNum              - section number
          MusicSection ms             - music data
          PieceData fullPieceData     - music data for all sections
          RenderedSectionParams[] rsp - starting parameters for voices
          OptionSet o                 - display options
          int fmn                     - number of first measure in section
          double sx                   - left x-coordinate of section in full score
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(sectionNum:number,ms:MusicSection,fullPieceData:PieceData,rsp:RenderedSectionParams[],o:OptionSet,fmn:number,sx:number)
	{
		this.sectionNum = sectionNum;
		this.musicData = ms;
		this.fullPieceData = fullPieceData;
		this.options = o;
		this.curMeasureNum = fmn;
		this.startX = sx;
		this.startingParams = Array(rsp.length);
		for(
		let i:number = 0;i < rsp.length;i ++)
		this.startingParams[i]= RenderedSectionParams.new1(rsp[i]);
		this.render();
	}

	public render():void
	{
		if( this.musicData instanceof MusicMensuralSection)
			this.renderMensuralData(<MusicMensuralSection> this.musicData);
		else
			if( this.musicData instanceof MusicChantSection)
				this.renderChantData(<MusicChantSection> this.musicData);
			else
				if( this.musicData instanceof MusicTextSection)
					this.renderTextData(<MusicTextSection> this.musicData);
				else
					System.err.println("Error: Trying to render unsupported section type");

		this.createEndingParams();
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getEvent(vnum:number,ei:number):RenderedEvent
	{
		return this.eventinfo[vnum].getEvent(ei);
	}

	public getFirstMeasureNum():number
	{
		return this.measures.getMeasure(0).getMeasureNum();
	}

	public getLastMeasureNum():number
	{
		return(((( this.getFirstMeasureNum() + this.getNumMeasures()) | 0) - 1) | 0);
	}

	public getNumMeasures():number
	{
		return this.measures.size();
	}

	public getMeasure(mnum:number):MeasureInfo
	{
		return this.measures.getMeasure((( mnum - this.getFirstMeasureNum()) | 0));
	}

	public getSectionData():MusicSection
	{
		return this.musicData;
	}

	public getStartX():number
	{
		return this.startX;
	}

	public getXsize():number
	{
		let mi:MeasureInfo = this.measures.getMeasure((( this.measures.size() - 1) | 0));
		return mi.leftx + mi.xlength;
	}

	public getNumVoices():number
	{
		return this.numVoices;
	}

	public getRenderedVoice(i:number):RenderList
	{
		return this.eventinfo[i];
	}

	public getEventXLoc(vnum:number,evnum:number):number
	{
		return this.startX + this.eventinfo[vnum].getEvent(evnum).getxloc();
	}

	public getEndingParams():RenderedSectionParams[]
	{
		return this.endingParams;
	}

	public getStartingParams():RenderedSectionParams[]
	{
		return this.startingParams;
	}

	/*------------------------------------------------------------------------
Method:  int getVoicedataPlace(int vnum,int reventnum)
Purpose: Return place of a rendered event in original voice event list
Parameters:
  Input:  int vnum      - voice number
          int reventnum - position of event in rendered event list
  Output: -
  Return: list place in original voice data
------------------------------------------------------------------------*/
	public getVoicedataPlace(vnum:number,reventnum:number):number
	{
		return this.eventinfo[vnum].getEvent(reventnum).getEvent_1().getListPlace(this.voicegfx[vnum].v.isDefaultVersion());
	}

	public getDefaultVoicedataPlace(vnum:number,reventnum:number):number
	{
		return this.eventinfo[vnum].getEvent(reventnum).getEvent_1().getDefaultListPlace();
	}

	/*------------------------------------------------------------------------
Method:  NoteEvent getNeighboringNoteEvent(int vnum,int eventnum,int dir)
Purpose: Return last note event before or after specified location
Parameters:
  Input:  int vnum      - voice number to check
          int eventnum  - event index to start search
          int dir       - direction to search (1=right, -1=left)
  Output: -
  Return: last NoteEvent
------------------------------------------------------------------------*/
	public getNeighboringNoteEvent(vnum:number,eventnum:number,dir:number):NoteEvent
	{
		let nenum:number = this.getNeighboringEventNumOfType(Event.EVENT_NOTE,vnum,eventnum,dir);
		if( nenum == - 1)
			return null;
		else
			{
				let e:Event = this.eventinfo[vnum].getEvent(nenum).getEvent_1();
				if( e.geteventtype() == Event.EVENT_MULTIEVENT)
					return(<MultiEvent> e).getLowestNote();
				else
					return<NoteEvent> e;

			}

	}

	public getNeighboringEventOfType(eventType:number,vnum:number,eventnum:number,dir:number):RenderedEvent
	{
		for(
		let i:number = eventnum;i >= 0 && i < this.eventinfo[vnum].size();i += dir)
		{
			let e:Event = this.eventinfo[vnum].getEvent(i).getEvent_1();
			if( e.hasEventType_1(eventType))
				return this.eventinfo[vnum].getEvent(i);

		}
		return null;
	}

	public getNeighboringEventNumOfType(eventType:number,vnum:number,eventnum:number,dir:number):number
	{
		for(
		let i:number = eventnum;i >= 0 && i < this.eventinfo[vnum].size();i += dir)
		{
			let e:Event = this.eventinfo[vnum].getEvent(i).getEvent_1();
			if( e.hasEventType_1(eventType))
				return i;

		}
		return - 1;
	}

	/*------------------------------------------------------------------------
Method:  RenderedClefSet getClefEvents(int vnum)
Purpose: Return active clef events at current place in voice
Parameters:
  Input:  int vnum - voice number
  Output: -
  Return: set of rendered clef events
------------------------------------------------------------------------*/
	/*  RenderedClefSet getClefEvents(int vnum)
  {
    return voicegfx[vnum].clefEvents;
    VoiceGfxInfo v=voicegfx[vnum];
    if (v.clefevent!=-1)
      return eventinfo[vnum].getEvent(v.clefevent);
    return startingParams[musicData.getVoice(vnum).getMetaData().getNum()-1].getClefSet();
  }*/
	getPrincipalClefData(v:VoiceGfxInfo):Event
	{
		if( v.clefEvents == null)
			return null;

		return v.clefEvents.getPrincipalClefEvent().getEvent_1();
	}

	/*------------------------------------------------------------------------
Method:  RenderedEvent getMensEvent(int vnum)
Purpose: Return active mensuration event at current place in voice
Parameters:
  Input:  int vnum - voice number
  Output: -
  Return: rendered mensuration event
------------------------------------------------------------------------*/
	/*  RenderedEvent getMensEvent(int vnum)
  {
    return voicegfx[vnum].mensEvent;
    VoiceGfxInfo v=voicegfx[vnum];
    if (v.mensevent!=-1)
      return eventinfo[vnum].getEvent(v.mensevent);
    return startingParams[musicData.getVoice(vnum).getMetaData().getNum()-1].getMens();
  }*/
	/*------------------------------------------------------------------------
Method:  int getXPosType(Event e)
Purpose: Calculate x-positioning type for a given event
Parameters:
  Input:  -
  Output: -
  Return: XPOS type
------------------------------------------------------------------------*/
	getXPosType_1(e:Event):number
	{
		if( e.alignedWithPrevious())
			return ScoreRenderer.XPOS_SIMULTANEOUS;

		switch( e.geteventtype())
		{
			case Event.EVENT_DOT:
			{
				return ScoreRenderer.XPOS_IMMEDIATE;
			}
			case Event.EVENT_VARIANTDATA_END:
			{
				if( this.options.get_displayedittags())
					return ScoreRenderer.XPOS_BEFORENEXT;
				else
					return ScoreRenderer.XPOS_INVISIBLE;

			}
			case Event.EVENT_ORIGINALTEXT:
			{
				if( ! this.options.get_displayedittags())
					return ScoreRenderer.XPOS_WITHNEXT;

			}
			default:
			{
				return ScoreRenderer.XPOS_BEFORENEXT;
			}
		}
	}

	getXPosType_2(re:RenderedEvent):number
	{
		return this.getXPosType_1(re.getEvent_1());
	}

	/*------------------------------------------------------------------------
Method:  void initEvents(MusicSection musicData)
Purpose: Initialize voice list for event drawing
Parameters:
  Input:  MusicSection musicData - music data
  Output: -
  Return: -
------------------------------------------------------------------------*/
	initEvents(musicData:MusicSection):void
	{
		this.initCurDrawingParams();
		let curVersion:VariantVersionData = musicData.getVersion();
		this.numVoices = musicData.getNumVoices_1();
		this.voicegfx = Array(this.numVoices);
		if( this.numVoices > 0)
			{
				for(
				let i:number = 0;i < this.numVoices;i ++)
				{
					this.voicegfx[i]= new VoiceGfxInfo(this,musicData.getVoice_1(i));
					this.voicegfx[i].voicenum = i;
				}
				for(
				let i:number = 0;i <(( this.numVoices - 1) | 0);i ++)
				this.voicegfx[i].next = this.voicegfx[((( i + 1) | 0))];
				for(
				let i:number = 1;i < this.numVoices;i ++)
				this.voicegfx[i].last = this.voicegfx[((( i - 1) | 0))];
				this.eventinfo = Array(this.numVoices);
				for(
				let i:number = 0;i < this.numVoices;i ++)
				if( musicData.getVoice_1(i) != null)
					{
						this.eventinfo[i]= RenderList.new0_2(this.options,musicData.getVoice_1(i).getMetaData(),musicData);
						let globalVnum:number =(( musicData.getVoice_1(i).getMetaData().getNum() - 1) | 0);
						this.voicegfx[i].musictime = Proportion.new0(0,1);
						this.voicegfx[i].xadd = 0;
						this.voicegfx[i].xloc = 0;
						this.voicegfx[i].lastx = 0;
						this.voicegfx[i].evloc =( this.voicegfx[i].revloc = 0);
						this.voicegfx[i].ligInfo = RenderedLigature.new3(musicData.getVoice_1(i),this.eventinfo[i]);
						this.voicegfx[i].tieInfo = RenderedLigature.new2(musicData.getVoice_1(i),this.eventinfo[i],RenderedLigature.TIE);
						this.voicegfx[i].colorBeginLoc = - 1;
						this.voicegfx[i].colorEndLoc = - 1;
						this.voicegfx[i].varReadingInfo = null;
						this.voicegfx[i].clefEvents = this.startingParams[globalVnum].getClefSet();
						this.voicegfx[i].clefedata = this.getPrincipalClefData(this.voicegfx[i]);
						this.voicegfx[i].mensEvent = this.startingParams[globalVnum].getMens();
						this.voicegfx[i].curProportion = Proportion.EQUALITY;
						this.voicegfx[i].tempoProportion = this.measureProportion;
						this.voicegfx[i].numMinimsInBreve = this.numMinimsInBreve;
						this.voicegfx[i].curColoration = musicData.getBaseColoration();
						this.voicegfx[i].inEditorialSection = false;
						this.voicegfx[i].lastNoteEvent = null;
						this.voicegfx[i].curSoundingEvent = null;
						this.voicegfx[i].replacementEvents = new ArrayList<Event>();
						this.voicegfx[i].withnextEvents = 0;
						this.voicegfx[i].lastTimedEventNum = - 1;
						this.voicegfx[i].immediatePositioning = false;
						this.voicegfx[i].varDefaultTimeAdd = null;
						this.voicegfx[i].respaceAfterVar = false;
						this.voicegfx[i].missingInVersion = curVersion == null ? false:curVersion.isVoiceMissing(musicData.getVoice_1(globalVnum).getMetaData()) || musicData.getVoice_1(i).getMissingVersions().contains(curVersion);
					}

				else
					this.eventinfo[i]= null;

				for(
				let i:number = 0;i <(( this.numVoices - 1) | 0);i ++)
				this.voicegfx[i].next = this.voicegfx[((( i + 1) | 0))];
				this.voicegfx[((( this.numVoices - 1) | 0))].next = null;
				this.voicegfx[0].last = null;
				for(
				let i:number = 1;i < this.numVoices;i ++)
				this.voicegfx[i].last = this.voicegfx[((( i - 1) | 0))];
				for(
				let i:number = 0;i < this.numVoices;i ++)
				if( musicData.getVoice_1(i) == null)
					{
						if( this.voicegfx[i].last != null)
							this.voicegfx[i].last.next = this.voicegfx[i].next;

						if( this.voicegfx[i].next != null)
							this.voicegfx[i].next.last = this.voicegfx[i].last;

					}

			}

		this.barline_type = this.options.get_barline_type();
		this.useModernClefs = this.options.get_usemodernclefs();
		this.noteShapeType = this.options.get_noteShapeType();
		this.useModernAccSystem = this.options.getUseModernAccidentalSystem();
		this.displayallnewlineclefs = this.options.get_displayallnewlineclefs();
		this.displayVarTexts = this.options.markVariant(VariantReading.VAR_ORIGTEXT) && ! this.options.get_displayedittags();
		if( this.numVoices > 0)
			this.liststart = this.voicegfx[musicData.getValidVoicenum(0)];

		this.finalisList = new LinkedList<VoiceGfxInfo>();
		this.measures = new MeasureList(this.numVoices);
		this.curmeasure = this.measures.newMeasure(this.curMeasureNum,Proportion.new0(0,1),this.numMinimsInBreve,this.measureProportion,this.BREVESCALE,this.barxstart);
		for(
		let i:number = 0;i < this.numVoices;i ++)
		if( musicData.getVoice_1(i) != null)
			{
				this.curmeasure.reventindex[i]= this.voicegfx[i].revloc;
				this.curmeasure.startClefEvents[i]= this.voicegfx[i].clefEvents;
				this.curmeasure.startMensEvent[i]= this.voicegfx[i].mensEvent;
			}

		this.curSonority = RenderedSonority.new0();
		this.sonorityList = new ArrayList<RenderedSonority>();
		this.sonorityList.add(this.curSonority);
	}

	/* create and initialize voice graphics info array */
	/* initialize voices */
	/* remove unused voices from rendering list */
	/* get drawing options */
	/* set initial drawing parameters */
	/* initialize measure list */
	initCurDrawingParams():void
	{
		this.barxstart = 0;
		this.skipevents = 0;
		this.errorRespacingTime = null;
		this.variantVoice = null;
		this.baseMensuration = null;
		this.numMinimsInBreve = 4;
		this.measureProportion = Proportion.EQUALITY;
		this.MINIMSCALE = 25;
		this.BREVESCALE = this.MINIMSCALE * this.numMinimsInBreve;
		this.lastMens = null;
		this.lastMensTime = null;
	}

	/* default to C */
	/*------------------------------------------------------------------------
Method:  void createEndingParams()
Purpose: Store voice parameters at the end of rendering (end of section)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	createEndingParams():void
	{
		this.endingParams = Array(this.startingParams.length);
		for(
		let i:number = 0;i < this.startingParams.length;i ++)
		this.endingParams[i]= RenderedSectionParams.new1(this.startingParams[i]);
		for(
		let i:number = 0;i < this.numVoices;i ++)
		if( this.musicData.getVoice_1(i) != null)
			{
				let vnum:number =(( this.musicData.getVoiceMetaData_1(i).getNum() - 1) | 0);
				this.endingParams[vnum].setClefSet(this.voicegfx[i].clefEvents);
				this.endingParams[vnum].setMens(this.voicegfx[i].mensEvent);
				this.endingParams[vnum].usedInSection = true;
			}

		else
			this.endingParams[i].usedInSection = false;

	}

	/*------------------------------------------------------------------------
Method:  boolean newVoiceArrangement()
Purpose: Check whether a different set of voices is used in this section
         than in the last
Parameters:
  Input:  -
  Output: -
  Return: true if voice sets are different
------------------------------------------------------------------------*/
	newVoiceArrangement():boolean
	{
		for(
		let i:number = 0;i < this.startingParams.length;i ++)
		if( this.startingParams[i].usedInSection != this.endingParams[i].usedInSection)
			return true;

		return false;
	}

	/*------------------------------------------------------------------------
Method:  void render(MusicSection ms)
Purpose: Render music into measure structure
Parameters:
  Input:  MusicSection ms - music data to render
  Output: -
  Return: -
------------------------------------------------------------------------*/
	renderMensuralData(ms:MusicMensuralSection):void
	{
		this.initEvents(ms);
		this.createRenderLists();
		this.positionMensuralEvents();
	}

	renderChantData(ms:MusicChantSection):void
	{
		this.initEvents(ms);
		this.positionChantEvents(ms);
	}

	renderTextData(ms:MusicTextSection):void
	{
		this.initEvents(ms);
		this.positionTextSection(ms);
	}
	/*------------------------------------------------------------------------
Method:  void createRenderLists()
Purpose: Create lists of rendered events for each voice,
         replacing/deleting/adding events as necessary for display but not
         assigning any x-positioning
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	withnextStart:number;

	createRenderLists():void
	{
		for(let v of this.voicegfx)
		if( v != null && v.v != null)
			{
				let rl:RenderList = this.eventinfo[v.voicenum];
				this.curMeasureNum = this.getFirstMeasureNum();
				this.curmeasure = this.measures.get((( this.curMeasureNum - this.getFirstMeasureNum()) | 0));
				this.skipevents = 0;
				let withnextStart:number = - 1;
				let newEventsInserted:number = 0;
				for(
				v.evloc = 0;v.evloc < v.v.getNumEvents();v.evloc ++)
				{
					let e:Event = v.v.getEvent(v.evloc);
					while( v.musictime.greaterThan(this.curmeasure.getEndMusicTime_1()))
					this.advanceOneMeasure(v);
					if( this.positionInNewMeasure(e,v))
						this.advanceOneMeasure(v);

					if( newEventsInserted > 0)
						{
							this.adjustNewEventMeasureNums(v,newEventsInserted);
							newEventsInserted = 0;
						}

					let re:RenderedEvent = this.addOneEvent(e,rl,v,this.skipevents == 0);
					if( this.skipevents > 0)
						{
							if( -- this.skipevents == 0)
								newEventsInserted = this.insertReplacementEvents_1(v);

						}

					else
						if( v.replacementEvents.size() > 0)
							newEventsInserted = this.insertReplacementEvents_1(v);

				}
				this.initCurDrawingParams();
			}

		for(let v of this.voicegfx)
		if( v != null)
			{
				for(
				let mi:number =(( this.measures.size() - 1) | 0);mi >= 0 && this.measures.get(mi).reventindex[v.voicenum]== - 1;mi --)
				{
					let m:MeasureInfo = this.measures.get(mi);
					m.reventindex[v.voicenum]= v.revloc;
					m.startClefEvents[v.voicenum]= v.clefEvents;
					m.startMensEvent[v.voicenum]= v.mensEvent;
					m.tempoProportion[v.voicenum]= v.tempoProportion;
				}
			}

	}

	/* reset parameters */
	/* fill out info for "empty" measures beyond the end of voice parts */
	addOneEvent(e:Event,rl:RenderList,v:VoiceGfxInfo,display:boolean):RenderedEvent
	{
		e = this.setPrerenderParameters(v,e);
		if( this.skipevents > 0)
			display = false;

		let re:RenderedEvent = this.createRenderedEvent(e,rl,v,display);
		this.finishEvent(v,re);
		return re;
	}

	createRenderedEvent(e:Event,rl:RenderList,v:VoiceGfxInfo,display:boolean):RenderedEvent
	{
		let re:RenderedEvent = rl.addevent_1(display,e,RenderParams.new0(this.curMeasureNum,v.clefEvents,v.lastNoteEvent,v.mensEvent,v.curProportion,v.curColoration,v.inEditorialSection,v.missingInVersion,v.ligInfo,this.endlig,v.tieInfo,v.v.getMetaData().getSuggestedModernClef(),v.varReadingInfo));
		re.setmusictime(v.musictime);
		return re;
	}

	pushEventsIntoCurMeasure(v:VoiceGfxInfo,withnextStart:number,curMeasure:MeasureInfo):void
	{
		if( withnextStart < curMeasure.reventindex[v.voicenum])
			curMeasure.reventindex[v.voicenum]= withnextStart;

		for(
		let ei:number = withnextStart;ei < v.revloc;ei ++)
		this.eventinfo[v.voicenum].getEvent(ei).setMeasureNum(curMeasure.getMeasureNum());
	}

	adjustNewEventMeasureNums(v:VoiceGfxInfo,numNewEvents:number):void
	{
		for(
		let ei:number =(( v.revloc - numNewEvents) | 0);ei < v.revloc;ei ++)
		{
			let re:RenderedEvent = this.eventinfo[v.voicenum].getEvent(ei);
			let mnum:number =(( re.getmeasurenum() + 1) | 0);
			let m:MeasureInfo = this.getMeasure(mnum);
			while( m != null && re.getmusictime().greaterThanOrEqualTo(m.startMusicTime))
			{
				this.pushEventsIntoCurMeasure(v,ei,m);
				m = this.getMeasure(++ mnum);
			}
		}
	}

	/*------------------------------------------------------------------------
Method:  int insertReplacementEvents(VoiceGfxInfo v)
Purpose: Insert newly-created events into render list
Parameters:
  Input:  -
  Output: VoiceGfxInfo v - voice to update
  Return: number of events inserted
------------------------------------------------------------------------*/
	insertReplacementEvents_1(v:VoiceGfxInfo):number
	{
		let re:RenderedEvent;
		let lastevent:RenderedEvent = null;
		let rl:RenderList = this.eventinfo[v.voicenum];
		let numEvents:number = v.replacementEvents.size();
		for(let e of v.replacementEvents)
		{
			re = this.createRenderedEvent(e,rl,v,true);
			if( this.skipevents != 0)
				this.setPostrenderParameters_1(v,re);

			this.finishEvent(v,re);
		}
		v.replacementEvents = new ArrayList<Event>();
		return numEvents;
	}
	/* render event */
	// make sure replacement event sets post params?
	/* set voice event parameters 
        if (e.hasSignatureClef())
          {
            v.clefEvents=new RenderedClefSet(v.clefEvents,re,useModernAccSystem,v.v.getMetaData().getSuggestedModernClef());
            v.clefedata=getPrincipalClefData(v);
          }*/
	/*------------------------------------------------------------------------
Method:  void finishEvent(VoiceGfxInfo v,RenderedEvent re)
Purpose: Advance voice info counters after rendering an event
Parameters:
  Input:  VoiceGfxInfo  v  - voice to update
          RenderedEvent re - event which has just been rendered
  Output: -
  Return: -
------------------------------------------------------------------------*/
	endlig:boolean = false;

	finishEvent(v:VoiceGfxInfo,re:RenderedEvent):void
	{
		if( this.skipevents == 0)
			this.setPostrenderParameters_1(v,re);

		let vl:RenderList = this.eventinfo[v.voicenum];
		let XPosType:number = this.getXPosType_2(re);
		if(( XPosType == ScoreRenderer.XPOS_IMMEDIATE || XPosType == ScoreRenderer.XPOS_SIMULTANEOUS) && v.lastTimedEventNum > - 1)
			{
				let lastTimedEvent:RenderedEvent = vl.getEvent(v.lastTimedEventNum);
				let newMeasureNum:number = lastTimedEvent.getmeasurenum();
				if( newMeasureNum != this.curMeasureNum)
					for(
					let ei:number =(( v.lastTimedEventNum + 1) | 0);ei <= v.revloc;ei ++)
					{
						vl.getEvent(ei).setMeasureNum(newMeasureNum);
						for(
						let mi:number =(((( newMeasureNum - this.getFirstMeasureNum()) | 0) + 1) | 0);mi < this.measures.size() && this.measures.get(mi).reventindex[v.voicenum]!= - 1;mi ++)
						this.measures.get(mi).reventindex[v.voicenum]++;
					}

				lastTimedEvent.setAttachedEventIndex(v.revloc);
			}

		if( this.withnextStart == - 1)
			{
				if( XPosType == ScoreRenderer.XPOS_WITHNEXT)
					this.withnextStart = v.revloc;

			}

		else
			if( XPosType != ScoreRenderer.XPOS_WITHNEXT && XPosType != ScoreRenderer.XPOS_INVISIBLE)
				{
					this.pushEventsIntoCurMeasure(v,this.withnextStart,this.curmeasure);
					this.withnextStart = - 1;
				}

		if( re.getMusicLength().i1 > 0)
			v.lastTimedEventNum = v.revloc;

		v.revloc ++;
		if( re.getEvent_1().geteventtype() == Event.EVENT_VARIANTDATA_END)
			{
				v.varReadingInfo = null;
			}

		if( this.endlig)
			{
				v.ligInfo = RenderedLigature.new3(v.v,vl);
				this.endlig = false;
			}

		if( this.noteShapeType == OptionSet.OPT_NOTESHAPE_ORIG)
			re.setMusicLength(Proportion.quotient(re.getEvent_1().getmusictime(),Proportion.product(v.curProportion,v.tempoProportion)));
		else
			re.setMusicLength(Proportion.quotient(re.getEvent_1().getmusictime(),v.tempoProportion));

		if( v.respaceAfterVar)
			{
				re.getMusicLength().add(v.varDefaultTimeAdd);
				v.varDefaultTimeAdd = null;
				v.respaceAfterVar = false;
			}

		if( this.errorRespacingTime != null && Proportion.sum(v.musictime,re.getMusicLength()).greaterThan(this.errorRespacingTime))
			re.setMusicLength(Proportion.difference(this.errorRespacingTime,v.musictime));

		v.musictime.add(re.getMusicLength());
	}

	/* position events in same measure as last */
	/* check whether to push up previous events into this measure */
	/*        if (skipevents==0)
          v.varReadingInfo.lastEventNum++;*/
	//        v.inEditorialSection=false;
	//    if (v.tieInfo.numNotes>1)
	//      v.tieInfo=new RenderedLigature(v.v,vl,RenderedLigature.TIE);
	/* advance music time after timed event */
	//Proportion.product(re.getMusicLength(),v.tempoProportion));
	/*------------------------------------------------------------------------
Method:  Event setPrerenderParameters(VoiceGfxInfo v,Event e)
Purpose: Set voice parameters if modified by an event about to be rendered
Parameters:
  Input:  VoiceGfxInfo  v - voice to update
          Event         e - event to be rendered
  Output: -
  Return: event to be rendered, replaced if necessary
------------------------------------------------------------------------*/
	setPrerenderParameters(v:VoiceGfxInfo,e:Event):Event
	{
		if( this.skipevents > 0)
			return e;

		if( this.noteShapeType != OptionSet.OPT_NOTESHAPE_ORIG)
			{
				if( e.geteventtype() == Event.EVENT_NOTE)
					if( this.options.displayColorationBracket(e))
						{
							v.colorEndLoc = v.revloc;
							if( v.colorBeginLoc == - 1)
								v.colorBeginLoc = v.revloc;

						}

					else
						v.colorBeginLoc = - 1;


				else
					if( e.geteventtype() == Event.EVENT_SECTIONEND)
						v.colorBeginLoc = - 1;

				e = this.makeModernNoteShapes(e,v);
			}

		if( e.hasSignatureClef_1())
			{
				let skippedClefEvents:number = this.calcNumSkippedClefEvents(v,v.evloc);
				if( skippedClefEvents > 0)
					this.skipevents += skippedClefEvents;

				if( this.useModernClefs && e.geteventtype() == Event.EVENT_MULTIEVENT && e.hasPrincipalClef_1())
					{
						for(
						let ei:Iterator<Event> =(<MultiEvent> e).iterator_2();ei.hasNext();)
						{
							let ee:Event =<Event> ei.next();
							if( ee.geteventtype() == Event.EVENT_CLEF && ! ee.hasPrincipalClef_1())
								v.replacementEvents.add(ee);

						}
						e =(<MultiEvent> e).noSigClefEvent();
					}

			}

		let mensInfo:Mensuration = e.getMensInfo_1();
		if( mensInfo != null)
			{
				let me:MensEvent =<MensEvent>( e.getFirstEventOfType_1(Event.EVENT_MENS));
				this.baseMensuration = mensInfo;
				v.numMinimsInBreve =(( this.baseMensuration.prolatio * this.baseMensuration.tempus) | 0);
				v.tempoProportion = this.baseMensuration.tempoChange;
				if( ! me.noScoreSig())
					{
						this.numMinimsInBreve = v.numMinimsInBreve;
						this.measureProportion = v.tempoProportion;
					}

				let oldBS:number = this.BREVESCALE;
				this.BREVESCALE = this.MINIMSCALE * this.numMinimsInBreve / this.measureProportion.toDouble();
				if( ! me.noScoreSig() && v.musictime.lessThan(this.curmeasure.getEndMusicTime_1()))
					{
						if( this.curmeasure.numMinims != this.numMinimsInBreve || ! this.curmeasure.scaleSet)
							{
								this.curmeasure.numMinims = this.numMinimsInBreve;
								this.curmeasure.xlength += this.BREVESCALE - oldBS;
								this.curmeasure.defaultTempoProportion = this.measureProportion;
								this.curmeasure.scaleSet = true;
							}

						this.curmeasure.tempoProportion[v.voicenum]= v.tempoProportion;
					}

				this.lastMens = mensInfo;
				this.lastMensTime = v.musictime;
			}

		if( e.geteventtype() == Event.EVENT_DOT)
			{
				if(((<DotEvent> e).getdottype() & DotEvent.DT_Addition) != 0)
					v.lastNoteEvent = this.getLastNoteEvent(v,(( v.revloc - 1) | 0));

				if( this.noteShapeType != OptionSet.OPT_NOTESHAPE_ORIG)
					this.skipevents ++;

			}

		if( ! this.displayallnewlineclefs && e.geteventtype() == Event.EVENT_CUSTOS)
			{
				let nexte:Event = v.v.getEvent((( v.evloc + 1) | 0));
				if( nexte != null && nexte.geteventtype() == Event.EVENT_LINEEND)
					this.skipevents ++;

			}

		if( e.geteventtype() == Event.EVENT_LINEEND && ! this.displayallnewlineclefs)
			{
				let nexte:Event = v.v.getEvent((( v.evloc + 1) | 0));
				this.skipevents ++;
				if( nexte != null && nexte.hasSignatureClef_1() && nexte.principalClefEquals(v.clefedata,this.useModernClefs))
					{
						if( this.useModernAccSystem || nexte.getModernKeySig().equals(e.getModernKeySig()))
							this.skipevents += this.calcNumClefEvents(v,(( v.evloc + 1) | 0));

						if( this.useModernAccSystem && ! nexte.getModernKeySig().equals(e.getModernKeySig()))
							v.replacementEvents.addAll(this.constructDisplayClefSet(v.clefEvents,nexte));

					}

			}

		if( e.geteventtype() == Event.EVENT_PROPORTION)
			{
				let newp:Proportion =(<ProportionEvent> e).getproportion();
				v.curProportion = Proportion.new1(v.curProportion);
				v.curProportion.multiply_2(newp);
			}

		if( e.geteventtype() == Event.EVENT_COLORCHANGE)
			v.curColoration = Coloration.new1(v.curColoration,(<ColorChangeEvent> e).getcolorscheme());

		if( e.geteventtype() == Event.EVENT_VARIANTDATA_START)
			{
				let nextEvent:Event = v.v.getEvent((( v.evloc + 1) | 0));
				let skippedClefEvents:number = this.calcNumSkippedClefEvents(v,(( v.evloc + 1) | 0));
				let nextDisplayedEvent:Event = v.v.getEvent((((( v.evloc + skippedClefEvents) | 0) + 1) | 0));
				if( skippedClefEvents > 0 && nextDisplayedEvent.geteventtype() == Event.EVENT_VARIANTDATA_END)
					this.skipevents +=(( skippedClefEvents + 2) | 0);
				else
					{
						v.varReadingInfo = RenderedEventGroup.new0(v.revloc);
						v.varReadingInfo.grouptype = RenderedEventGroup.EVENTGROUP_VARIANTREADING;
						v.varReadingInfo.varReading = e.getVariantReading_1(this.musicData.getVersion());
						v.varReadingInfo.varMarker =<VariantMarkerEvent> e;
						if( v.varReadingInfo.varReading != null && v.varReadingInfo.varReading.isError())
							{
								let defaultReadingLength:Proportion =(<VariantMarkerEvent> e).getDefaultLength();
								let varReadingLength:Proportion = v.varReadingInfo.varReading.getLength();
								if( varReadingLength.greaterThan(defaultReadingLength))
									{
										defaultReadingLength.divide(v.curProportion);
										defaultReadingLength.divide(v.tempoProportion);
										this.errorRespacingTime = Proportion.sum(v.musictime,defaultReadingLength);
										this.variantVoice = v;
									}

								else
									if( defaultReadingLength.greaterThan(varReadingLength))
										{
											v.varDefaultTimeAdd = Proportion.difference(defaultReadingLength,varReadingLength);
											v.varDefaultTimeAdd.divide(v.curProportion);
											v.varDefaultTimeAdd.divide(v.tempoProportion);
										}

							}

						if( this.displayVarTexts && v.varReadingInfo.varMarker.includesVarType(VariantReading.VAR_ORIGTEXT))
							v.replacementEvents.addAll(this.constructVarTextEvents_2(v));

					}

			}

		if( e.geteventtype() == Event.EVENT_VARIANTDATA_END)
			{
				if( v.varDefaultTimeAdd != null)
					v.respaceAfterVar = true;

				if( v.varReadingInfo == null)
					{
						System.err.println("Error! VARIANTDATA_END without START; V" + v.voicenum + ", evloc=" + v.evloc);
						for(
						let ei:number = 0;ei < v.evloc;ei ++)
						v.v.getEvent(ei).prettyprint_1();
					}

				v.varReadingInfo.lastEventNum =(( v.revloc - 1) | 0);
				v.varReadingInfo.calculateYMinMax(this.eventinfo[v.voicenum]);
				if( v.varReadingInfo.firstEventNum == v.varReadingInfo.lastEventNum)
					this.eventinfo[v.voicenum].getEvent(v.varReadingInfo.firstEventNum).setDisplay(true);

				if( this.skipevents == 0)
					v.varReadingInfo.lastEventNum ++;

				this.errorRespacingTime = null;
			}

		if( e.geteventtype() == Event.EVENT_ORIGINALTEXT)
			{
				if( this.displayVarTexts)
					{
						this.skipevents ++;
						v.replacementEvents.addAll(this.constructVarTextEvents_1(v,<OriginalTextEvent> e));
					}

			}

		if( e.geteventtype() == Event.EVENT_LACUNA)
			{
				v.inEditorialSection = true;
			}

		if( e.geteventtype() == Event.EVENT_LACUNA_END)
			{
				v.inEditorialSection = false;
			}

		return e;
	}

	/* separate modern clefs from accidentals */
	//&& !useModernAccSystem)
	/*        else
          if (v.clefevent==-1 ||
              e.getClefSet(useModernAccSystem)!=v.clefedata.getClefSet(useModernAccSystem))
            {
              v.clefevent=v.revloc;
              v.clefedata=e;
            }*/
	/*        if (baseMensuration==null ||
             if at least two voices change to the same mensuration
               simultaneously, use as main mensuration 
            (v.musictime.equals(lastMensTime) && lastMens.equals(mensInfo)))*/
	/* set base mensuration info for score measure structure */
	/* change current bar if mensuration takes effect here */
	/* don't show any original dot events in modern notation
           (notes receive their own new attached dots) */
	/* skip lineend custodes unless displaying newline clefs */
	/* at line end, construct display for next clef set */
	//                !nexte.getClefSet(useModernAccSystem).contradicts(v.clefEvents.getLastClefSet(useModernAccSystem),useModernClefs,v.v.getMetaData().getSuggestedModernClef()))
	//                nexte.getClefSet(useModernAccSystem).contradicts(v.clefEvents.getLastClefSet(useModernAccSystem),useModernClefs,v.v.getMetaData().getSuggestedModernClef()))
	//System.out.println("startvar: V"+v.voicenum+", evloc="+v.evloc);
	/* nothing displayed in editorial section: don't display brackets */
	//System.out.println("startvar: V"+v.voicenum+", evloc="+v.evloc);
	//            v.inEditorialSection=true;
	/* show multiple texts? */
	//else
	//System.out.println("endvar: V"+v.voicenum+", evloc="+v.evloc);
	/*        v.varReadingInfo.lastEventNum++;
        v.varReadingInfo=null;
        v.inEditorialSection=false;*/
	setPostrenderParameters_1(v:VoiceGfxInfo,re:RenderedEvent):void
	{
		this.setPostrenderParameters_2(v,re,true);
	}

	setPostrenderParameters_2(v:VoiceGfxInfo,re:RenderedEvent,doLigs:boolean):void
	{
		let e:Event = re.getEvent_1();
		if( doLigs)
			{
				this.endlig = this.doLigInfo(v,e);
				re.setLigInfo(v.ligInfo);
				re.setLigEnd(this.endlig);
			}

		let endTie:boolean = v.tieInfo.firstEventNum != - 1;
		this.doTieEndInfo(v,e);
		re.setTieInfo(v.tieInfo);
		this.doTieStartInfo(v,e);
		if( ! endTie)
			re.setTieInfo(v.tieInfo);
		else
			re.setDoubleTied(v.tieInfo.firstEventNum != - 1);

		v.lastNoteEvent = null;
		if( e.hasSignatureClef_1())
			{
				v.clefEvents = re.getClefEvents();
				v.clefedata = e;
				if( e.hasPrincipalClef_1() && v.musictime.equals(this.curmeasure.startMusicTime))
					this.curmeasure.lastBeginClefIndex[v.voicenum]= v.revloc;

			}

		if( e.getMensInfo_1() != null)
			v.mensEvent = re;

		if( v.colorBeginLoc == v.revloc)
			re.addcolorbracket(0);
		else
			if( v.colorBeginLoc == - 1 && v.colorEndLoc != - 1)
				{
					this.eventinfo[v.voicenum].getEvent(v.colorEndLoc).addcolorbracket(1);
					v.colorEndLoc = - 1;
				}

	}

	/* this is gonna mess up if e is a multi-event with more than a clef */
	//getPrincipalClefData(v);
	/*------------------------------------------------------------------------
Method:  Event makeModernNoteShape(Event e,ArrayList<Event> el)
Purpose: Replace note/rest with modern notational element(s)
Parameters:
  Input:  Event e - event to check/replace
  Output: ArrayList<Event> el - list of events to be inserted in current voice
  Return: e if no change, otherwise modern notation version of e
------------------------------------------------------------------------*/
	makeModernNoteShapes(e:Event,v:VoiceGfxInfo):Event
	{
		let newEvents:LinkedList<Event> = e.makeModernNoteShapes_1(v.musictime,this.curmeasure.startMusicTime,this.curmeasure.numMinims,this.curmeasure.defaultTempoProportion,v.curProportion,true);
		if( newEvents.size() > 1)
			v.replacementEvents.addAll(newEvents.subList(1,newEvents.size()));

		return newEvents.get(0);
	}

	/* ties */
	/*------------------------------------------------------------------------
Method:  void advanceOneMeasure(VoiceGfxInfo v)
Purpose: Advance measure counter and create one new measure structure if
         necessary
Parameters:
  Input:  VoiceGfxInfo v - voice currently being rendered
  Output: -
  Return: -
------------------------------------------------------------------------*/
	advanceOneMeasure(v:VoiceGfxInfo):void
	{
		this.curMeasureNum ++;
		if((( this.curMeasureNum - this.getFirstMeasureNum()) | 0) >= this.measures.size())
			this.curmeasure = this.measures.newMeasure(this.curMeasureNum,this.curmeasure.getEndMusicTime_1(),this.numMinimsInBreve,this.measureProportion,this.BREVESCALE,0);
		else
			this.curmeasure = this.measures.get((( this.curMeasureNum - this.getFirstMeasureNum()) | 0));

		this.curmeasure.reventindex[v.voicenum]= v.revloc;
		this.curmeasure.startClefEvents[v.voicenum]= v.clefEvents;
		this.curmeasure.startMensEvent[v.voicenum]= v.mensEvent;
		this.curmeasure.tempoProportion[v.voicenum]= Proportion.new1(v.tempoProportion);
	}

	/* deal with end of bar issues */
	positionInNewMeasure(e:Event,v:VoiceGfxInfo):boolean
	{
		if( this.skipevents > 0)
			return false;

		if( e.getmusictime().i1 <= 0)
			return false;

		return v.musictime.greaterThanOrEqualTo(this.curmeasure.getEndMusicTime_1());
	}

	/* POSITIONING CODE */
	/*------------------------------------------------------------------------
Method:  void positionMensuralEvents()
Purpose: After lists have been rendered for individual voices, assign
         x-positions to all events/measures
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	positionMensuralEvents():void
	{
		this.initVoiceCounters();
		do
		{
			this.advanceVoices(this.positionUntimedEvents());
			while( this.liststart != null && this.liststart.musictime.greaterThan(this.curmeasure.getEndMusicTime_1()))
			this.advanceOneMeasureSpacing();
			if( this.liststart != null && this.positionInNewMeasure(this.eventinfo[this.liststart.voicenum].getEvent(this.liststart.revloc).getEvent_1(),this.liststart))
				this.advanceOneMeasureSpacing();

			this.advanceVoices(this.positionTimedAndImmediateEvents());
			while( this.liststart != null && this.liststart.musictime.greaterThan(this.curmeasure.getEndMusicTime_1()))
			this.advanceOneMeasureSpacing();
		}
		while( this.liststart != null);
	}

	/* advance one measure if leftmost voice is past current measure limit */
	initVoiceCounters():void
	{
		this.curMeasureNum = 0;
		this.curmeasure = this.measures.get(this.curMeasureNum);
		for(let v of this.voicegfx)
		if( v != null)
			{
				v.musictime = Proportion.new0(0,1);
				v.revloc = 0;
			}

	}

	/*------------------------------------------------------------------------
Method:  double positionUntimedEvents()
Purpose: Position untimed events for all voices in the leftmost place (i.e. those
         at the front of the voice list)
Parameters:
  Input:  -
  Output: -
  Return: Total amount of horizontal space needed by the events
------------------------------------------------------------------------*/
	positionUntimedEvents():number
	{
		let xadd:number = 0;
		let v:VoiceGfxInfo;
		let nextv:VoiceGfxInfo;
		let re:RenderedEvent;
		if( this.liststart == null)
			return xadd;

		this.starttime = Proportion.new1(this.liststart.musictime);
		nextv = this.liststart.next;
		for(
		v = this.liststart;v != null && v.musictime.equals(this.starttime);v = nextv)
		{
			nextv = v.next;
			for(
			re = this.eventinfo[v.voicenum].getEvent(v.revloc);re != null && re.getMusicLength().i1 == 0;re = this.eventinfo[v.voicenum].getEvent(this.incrementVoicePosition(v)))
			{
				let xpos:number = this.getXPosType_2(re);
				if( xpos == ScoreRenderer.XPOS_WITHNEXT ||( xpos == ScoreRenderer.XPOS_INVISIBLE && v.withnextEvents > 0))
					v.withnextEvents ++;
				else
					xadd = this.positionUntimedEvent(v,re,xadd);

			}
		}
		return xadd;
	}

	/*------------------------------------------------------------------------
Method:  double positionTimedandImmediateEvents()
Purpose: Position one timed event for each voice in last place along with
         XPOS_IMMEDIATE untimed events following it (e.g., dots)
Parameters:
  Input:  -
  Output: -
  Return: Total amount of horizontal space needed by the events
------------------------------------------------------------------------*/
	positionTimedAndImmediateEvents():number
	{
		let v:VoiceGfxInfo;
		let nextv:VoiceGfxInfo;
		let re:RenderedEvent;
		let xadd:number = 0;
		if( this.liststart == null)
			return xadd;

		nextv = this.liststart.next;
		for(
		v = this.liststart;v != null && this.starttime.greaterThanOrEqualTo(v.musictime);v = nextv)
		{
			nextv = v.next;
			re = this.eventinfo[v.voicenum].getEvent(v.revloc);
			if( re == null)
				this.removeVoice(v);
			else
				{
					xadd = this.positionTimedEvent(v,re,xadd);
					this.recalcVoiceList(v);
				}

		}
		return xadd;
	}

	/*------------------------------------------------------------------------
Method:  double positionUntimedEvent(VoiceGfxInfo v,RenderedEvent e,double xadd)
Purpose: Assign position to one untimed event
Parameters:
  Input:  VoiceGfxInfo v    - voice to update
          RenderedEvent e   - event to position
          double       xadd - positioning adjuster for all voices at the
                              end of untimed event rendering
  Output: -
  Return: new value for xadd
------------------------------------------------------------------------*/
	positionUntimedEvent(v:VoiceGfxInfo,re:RenderedEvent,xadd:number):number
	{
		let rl:RenderList = this.eventinfo[v.voicenum];
		let curx:number;
		xadd = this.positionWITHNEXTEvents(v,xadd);
		re.setxloc(curx = v.calcXLoc(rl,re));
		xadd = this.finishPositioningUntimedEvent(v,re,curx,xadd);
		return xadd;
	}

	/*------------------------------------------------------------------------
Method:  double positionTimedEvent(VoiceGfxInfo v,RenderedEvent re,double xadd)
Purpose: Position one timed event along with XPOS_IMMEDIATE untimed events
         following it (e.g., dots)
Parameters:
  Input:  VoiceGfxInfo v   - voice of event
          RenderedEvent re - event to position
          double xadd      - total amount of horizontal space needed
                             for adjusting all voices after this phase
  Output: -
  Return: new value for xadd
------------------------------------------------------------------------*/
	positionTimedEvent(v:VoiceGfxInfo,re:RenderedEvent,xadd:number):number
	{
		let rl:RenderList = this.eventinfo[v.voicenum];
		xadd = this.positionWITHNEXTEvents(v,xadd);
		re.setxloc(v.xloc);
		v.revloc ++;
		this.updateSonority(re,v);
		v.lastx = v.xloc;
		let XLocAdd:number = this.MINIMSCALE * re.getMusicLength().toDouble();
		if( XLocAdd < re.getrenderedxsize())
			{
				v.xadd += re.getrenderedxsize() - XLocAdd;
				if( xadd < v.xadd)
					xadd = v.xadd;

				XLocAdd = re.getrenderedxsize();
			}

		v.xloc += XLocAdd;
		let nextre:RenderedEvent = rl.getEvent(v.revloc);
		let immedEventNum:number = re.getAttachedEventIndex();
		if( immedEventNum > - 1)
			{
				v.withnextEvents = 0;
				v.immediatePositioning = true;
				while( v.revloc <= immedEventNum)
				{
					xadd = this.positionUntimedEvent(v,nextre,xadd);
					nextre = rl.getEvent(this.incrementVoicePosition(v));
				}
				v.immediatePositioning = false;
			}

		v.musictime = nextre.getmusictime();
		return xadd;
	}

	//(rl.getEvent(v.revloc).getmusictime().toDouble()-re.getmusictime().toDouble());
	/* position untimed XPOS_IMMEDIATE events (e.g., dots)
       and XPOS_SIMULTANEOUS events (vertically aligned with current event) */
	/*------------------------------------------------------------------------
Method:  void recalcVoiceList(VoiceGfxInfo v)
Purpose: Adjust pointers within voice list to maintain sorting order after one
         voice has moved forward
Parameters:
  Input:  VoiceGfxInfo v - voice which has just been advanced (i.e. in
                           which timed events have just been positioned)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	recalcVoiceList(v:VoiceGfxInfo):void
	{
		let moveplace:VoiceGfxInfo = v;
		while( !(( moveplace.next == null) ||( moveplace.next.musictime.greaterThan(v.musictime))))
		moveplace = moveplace.next;
		if( moveplace != v)
			{
				this.removeVoice(v);
				if( moveplace.next != null)
					moveplace.next.last = v;

				v.next = moveplace.next;
				v.last = moveplace;
				moveplace.next = v;
			}

	}

	/* re-insert */
	/* update sonority info for analysis */
	updateSonority(re:RenderedEvent,v:VoiceGfxInfo):void
	{
		let e:Event = re.getEvent_1();
		if( e.getFirstEventOfType_1(Event.EVENT_REST) != null)
			{
				if( re.getmusictime().equals(this.curSonority.getMusicTime()))
					this.curSonority.remove(v.curSoundingEvent);
				else
					{
						this.curSonority = this.curSonority.copyWithout(v.curSoundingEvent);
						this.curSonority.setMusicTime(re.getmusictime());
						this.sonorityList.add(this.curSonority);
					}

				v.curSoundingEvent = null;
			}

		if( e.getFirstEventOfType_1(Event.EVENT_NOTE) != null)
			{
				if( re.getmusictime().equals(this.curSonority.getMusicTime()))
					{
						this.curSonority.remove(v.curSoundingEvent);
						this.curSonority.add(re);
					}

				else
					{
						this.curSonority = this.curSonority.copyWithout(v.curSoundingEvent);
						this.curSonority.add(re);
						this.curSonority.setMusicTime(re.getmusictime());
						this.sonorityList.add(this.curSonority);
					}

				v.curSoundingEvent = re;
				re.setSonority(this.curSonority);
			}

	}

	/*------------------------------------------------------------------------
Method:  double finishPositioningUntimedEvent(VoiceGfxInfo v,RenderedEvent re,
                                              double curx,double xadd)
Purpose: Advance voice info counters and x positioning information after
         positioning an untimed event
Parameters:
  Input:  VoiceGfxInfo  v    - voice to update
          RenderedEvent re   - event which has just been positioned
          double        curx - current renderer x position
          double        xadd - positioning adjuster for all voices at the
                               end of untimed event rendering
  Output: -
  Return: new value for xadd
------------------------------------------------------------------------*/
	finishPositioningUntimedEvent(v:VoiceGfxInfo,re:RenderedEvent,curx:number,xadd:number):number
	{
		let eventxlen:number = re.getrenderedxsize();
		if( ScoreRenderer.getxspacing(re.getEvent_1()) == ScoreRenderer.XSPACING_NOSPACE)
			{
				if( curx + eventxlen > v.xloc)
					eventxlen = curx + eventxlen - v.xloc;
				else
					eventxlen = 0;

			}

		if( this.getXPosType_1(re.getEvent_1()) == ScoreRenderer.XPOS_SIMULTANEOUS)
			eventxlen = 0;

		if( re.isdisplayed())
			v.lastx = curx;

		v.xloc += eventxlen;
		v.xadd += eventxlen;
		if( v.xadd > xadd)
			xadd = v.xadd;

		return xadd;
	}
	/* leave lastx alone if this event wasn't */
	/* displayed */
	/*------------------------------------------------------------------------
Method:  double positionWITHNEXTEvents(VoiceGfxInfo v,double xadd)
Purpose: Position events with positioning XPOS_WITHNEXT, i.e., untimed events
         which are always in the same measure/position as the next event
Parameters:
  Input:  VoiceGfxInfo v    - voice to update
          double       xadd - positioning adjuster for all voices at the
                              end of untimed event positioning
  Output: -
  Return: new value for xadd
------------------------------------------------------------------------*/
	positioningWITHNEXTEvents:boolean = false;

	positionWITHNEXTEvents(v:VoiceGfxInfo,xadd:number):number
	{
		if( this.positioningWITHNEXTEvents)
			return xadd;

		this.positioningWITHNEXTEvents = true;
		for(
		;v.withnextEvents > 0;v.withnextEvents --)
		xadd = this.positionUntimedEvent(v,this.eventinfo[v.voicenum].getEvent((( v.revloc - v.withnextEvents) | 0)),xadd);
		this.positioningWITHNEXTEvents = false;
		return xadd;
	}

	/* avoid re-entry */
	/*------------------------------------------------------------------------
Method:  int incrementVoicePosition(VoiceGfxInfo v)
Purpose: Advance event index within one voice list, remove if done
Parameters:
  Input:  VoiceGfxInfo  v - voice to update
  Output: -
  Return: new event index
------------------------------------------------------------------------*/
	incrementVoicePosition(v:VoiceGfxInfo):number
	{
		v.revloc ++;
		this.removeVoiceIfFinished(v);
		return v.revloc;
	}

	/*------------------------------------------------------------------------
Method:  void removeVoice[IfFinished](VoiceGfxInfo v)
Purpose: Remove voice from rendering to-do list [if all its events have
         been rendered]
Parameters:
  Input:  VoiceGfxInfo  v - voice to update
  Output: -
  Return: -
------------------------------------------------------------------------*/
	removeVoiceIfFinished(v:VoiceGfxInfo):void
	{
		if( this.eventinfo[v.voicenum].getEvent(v.revloc) == null)
			this.removeVoice(v);

	}

	removeVoice(v:VoiceGfxInfo):void
	{
		if( v.next != null)
			v.next.last = v.last;

		if( v.last != null)
			v.last.next = v.next;
		else
			this.liststart = v.next;

	}

	/*------------------------------------------------------------------------
Method:  void advanceVoices(double xadd)
Purpose: Move all voices forward (horizontally) after events
Parameters:
  Input:  double xadd - total amount for voices to shift
  Output: -
  Return: -
------------------------------------------------------------------------*/
	advanceVoices(xadd:number):void
	{
		if( xadd > 0)
			{
				this.curmeasure.xlength += xadd;
				for(
				let i:number = 0;i < this.numVoices;i ++)
				if( this.musicData.getVoice_1(i) != null)
					{
						if( this.voicegfx[i].xadd < xadd)
							{
								let vxadd:number = xadd - this.voicegfx[i].xadd;
								this.voicegfx[i].xloc += vxadd;
								if( this.liststart != null && this.voicegfx[i].musictime.greaterThanOrEqualTo(this.liststart.musictime))
									this.voicegfx[i].moveupBEFORENEXTevents(this.eventinfo[i],vxadd);

							}

						this.voicegfx[i].xadd = 0;
					}

			}

	}

	advanceOneMeasureSpacing():void
	{
		this.barxstart += this.curmeasure.xlength;
		this.curMeasureNum ++;
		this.curmeasure = this.measures.get(this.curMeasureNum);
		this.curmeasure.leftx = this.barxstart;
		if( this.options.get_barline_type() != OptionSet.OPT_BARLINE_NONE)
			{
				let bxadd:number = ScoreRenderer.BARLINE_XADD;
				switch( this.options.get_barline_type())
				{
					case OptionSet.OPT_BARLINE_MENSS:
					{
					}
					case OptionSet.OPT_BARLINE_MODERN:
					{
						bxadd *= 2;
						break;
					}
				}
				this.curmeasure.xlength += bxadd;
				for(
				let i:number = 0;i < this.numVoices;i ++)
				this.voicegfx[i].xloc += bxadd;
			}

	}

	/* load new measure */
	/* space for barlines */
	/* OLD RENDERING CODE */
	/*------------------------------------------------------------------------
Method:  void renderAllMensuralEvents()
Purpose: Normal rendering cycle, beginning wherever individual voices in
         the voice list are currently positioned
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	positionMensuralEventsOld():void
	{
		do
		{
			let varRespaced:boolean;
			do
			{
				this.advanceVoices(this.renderUntimedEvents());
				varRespaced = false;
				if( this.addSpaceAfterVar())
					{
						varRespaced = true;
					}

				else
					if( this.errorRespacingTime != null && this.liststart != null && this.liststart.musictime.greaterThanOrEqualTo(this.errorRespacingTime))
						{
							this.renderUnspacedVariantRemainder();
							varRespaced = true;
							while( this.liststart != null && this.liststart.musictime.toDouble() > this.curmeasure.startMusicTime.toDouble() + this.curmeasure.numMinims)
							this.advanceOneMeasureSpacing();
						}

			}
			while( varRespaced && this.untimedEventsWaiting());
			if( this.liststart != null && this.liststart.v.getEvent(this.liststart.evloc) == null)
				{
					System.out.println("event==null v=" + this.liststart.voicenum + " evloc=" + this.liststart.evloc);
					for(
					let ei:number = 0;ei < this.liststart.evloc;ei ++)
					this.liststart.v.getEvent(ei).prettyprint_1();
				}

			if( this.liststart != null && this.liststart.musictime.toDouble() >= this.curmeasure.startMusicTime.toDouble() + this.curmeasure.numMinims && !( ScoreRenderer.getxspacing(this.liststart.v.getEvent(this.liststart.evloc)) == ScoreRenderer.XSPACING_NOSPACE && this.getXPosType_1(this.liststart.v.getEvent(this.liststart.evloc)) == ScoreRenderer.XPOS_BEFORENEXT))
				this.advanceOneMeasureSpacing();

			this.advanceVoices(this.renderTimedAndImmediateEvents());
			while( this.liststart != null && this.liststart.musictime.toDouble() > this.curmeasure.startMusicTime.toDouble() + this.curmeasure.numMinims)
			this.advanceOneMeasureSpacing();
			if( this.errorRespacingTime != null && this.liststart != null && this.liststart.musictime.greaterThanOrEqualTo(this.errorRespacingTime))
				this.renderUnspacedVariantRemainder();

			while( this.liststart != null && this.liststart.musictime.toDouble() > this.curmeasure.startMusicTime.toDouble() + this.curmeasure.numMinims)
			this.advanceOneMeasureSpacing();
		}
		while( this.liststart != null);
	}

	/* render untimed events and advance voice x-positions
           do multiple untimed-event renders if variants requiring respacing
           have been inserted */
	/* advance one measure if all untimed events at the right border of the current
           measure have been rendered */
	/* render timed events and advance voice x-positions */
	/* advance one measure if leftmost voice is past current measure limit */
	/* respace for variant if necessary */
	/* advance one measure if leftmost voice is past current measure limit */
	addSpaceAfterVar():boolean
	{
		let spaceAdded:boolean = false;
		for(let v of this.voicegfx)
		if( v.respaceAfterVar)
			{
				v.lastx = v.xloc;
				let xlocadd:number = this.MINIMSCALE * v.varDefaultTimeAdd.toDouble();
				v.xloc += xlocadd;
				v.musictime.add(v.varDefaultTimeAdd);
				v.varDefaultTimeAdd = null;
				v.respaceAfterVar = false;
				spaceAdded = true;
				this.recalcVoiceList(v);
			}

		return spaceAdded;
	}

	//            xadd+=xlocadd;
	//System.out.println("space added");
	/*------------------------------------------------------------------------
Method:  double renderUntimedEvents()
Purpose: Render untimed events for all voices in the leftmost place (i.e. those
         at the front of the voice list)
Parameters:
  Input:  -
  Output: -
  Return: Total amount of horizontal space needed by the events
------------------------------------------------------------------------*/
	renderUntimedEvents():number
	{
		let xadd:number = 0;
		let curvoice:VoiceGfxInfo;
		let nextvoice:VoiceGfxInfo;
		let e:Event;
		if( this.liststart == null)
			return xadd;

		this.starttime = Proportion.new1(this.liststart.musictime);
		nextvoice = this.liststart.next;
		for(
		curvoice = this.liststart;curvoice != null && curvoice.musictime.equals(this.starttime);curvoice = nextvoice)
		{
			nextvoice = curvoice.next;
			if( curvoice.replacementEvents.size() > 0)
				xadd = this.insertReplacementEvents_2(curvoice,xadd);

			for(
			e = curvoice.v.getEvent(curvoice.evloc);e != null && e.getmusictime().i1 == 0;e = curvoice.v.getEvent(this.incrementVoicePosition(curvoice)))
			if( this.getXPosType_1(e) == ScoreRenderer.XPOS_WITHNEXT)
				curvoice.withnextEvents ++;
			else
				xadd = this.renderUntimedEvent(curvoice,e,xadd);

		}
		return xadd;
	}

	/*------------------------------------------------------------------------
Method:  boolean untimedEventsWaiting()
Purpose: Check whether any untimed events are waiting at the head of the
         rendering queue
Parameters:
  Input:  -
  Output: -
  Return: true if any untimed events are at the heading of the rendering
          queue
------------------------------------------------------------------------*/
	untimedEventsWaiting():boolean
	{
		if( this.liststart == null)
			return false;

		for(
		let curvoice:VoiceGfxInfo = this.liststart;curvoice != null && curvoice.musictime.equals(this.starttime);curvoice = curvoice.next)
		{
			let e:Event = curvoice.v.getEvent(curvoice.evloc);
			if( e != null && e.getmusictime().i1 == 0)
				return true;

		}
		return false;
	}
	//    Proportion starttime=new Proportion(liststart.musictime);
	/*------------------------------------------------------------------------
Method:  double addWithnextEvents(VoiceGfxInfo v,double xadd)
Purpose: Render events with positioning XPOS_WITHNEXT, i.e., untimed events
         which are always in the same measure/position as the next event
Parameters:
  Input:  VoiceGfxInfo v    - voice to update
          double       xadd - positioning adjuster for all voices at the
                              end of untimed event rendering
  Output: -
  Return: new value for xadd
------------------------------------------------------------------------*/
	addingWithnextEvents:boolean = false;

	addWithnextEvents(v:VoiceGfxInfo,xadd:number):number
	{
		if( this.addingWithnextEvents)
			return xadd;

		this.addingWithnextEvents = true;
		for(
		let i:number = 0;i < v.withnextEvents;i ++)
		xadd = this.renderUntimedEvent(v,v.v.getEvent((((( v.evloc - v.withnextEvents) | 0) + i) | 0)),xadd);
		v.withnextEvents = 0;
		this.addingWithnextEvents = false;
		return xadd;
	}

	/* avoid re-entry */
	/*------------------------------------------------------------------------
Method:  double renderUntimedEvent(VoiceGfxInfo v,Event e,double xadd)
Purpose: Render and finish one untimed event
Parameters:
  Input:  VoiceGfxInfo v    - voice to update
          Event        e    - event to render
          double       xadd - positioning adjuster for all voices at the
                              end of untimed event rendering
  Output: -
  Return: new value for xadd
------------------------------------------------------------------------*/
	renderUntimedEvent(v:VoiceGfxInfo,e:Event,xadd:number):number
	{
		let re:RenderedEvent;
		let rl:RenderList = this.eventinfo[v.voicenum];
		let curx:number;
		xadd = this.addWithnextEvents(v,xadd);
		e = this.setVoiceParameters(v,e);
		if( this.skipevents == 0)
			{
				re = rl.addevent_1(true,e,RenderParams.new0(this.curMeasureNum,v.clefEvents,v.lastNoteEvent,v.mensEvent,v.curProportion,v.curColoration,v.inEditorialSection,v.missingInVersion,v.ligInfo,false,v.tieInfo,v.v.getMetaData().getSuggestedModernClef(),v.varReadingInfo));
				re.setxloc(curx = v.calcXLoc(rl,re));
				re.setmusictime(v.musictime);
				this.setVoiceEventParameters(v,re);
			}

		else
			{
				re = rl.addevent_1(false,e,RenderParams.new0(this.curMeasureNum,v.clefEvents,v.lastNoteEvent,v.mensEvent,v.curProportion,v.curColoration,v.inEditorialSection,v.missingInVersion,v.ligInfo,false,v.tieInfo,v.v.getMetaData().getSuggestedModernClef(),v.varReadingInfo));
				re.setxloc(curx = v.xloc);
				re.setmusictime(v.musictime);
			}

		xadd = this.finishUntimedEvent(v,re,curx,xadd);
		if( this.skipevents > 0)
			this.skipevents --;

		if( this.skipevents == 0)
			xadd = this.insertReplacementEvents_2(v,xadd);

		return xadd;
	}

	/* render event and advance this voice */
	setVoiceEventParameters(v:VoiceGfxInfo,re:RenderedEvent):void
	{
		let e:Event = re.getEvent_1();
		if( e.hasSignatureClef_1())
			{
				v.clefEvents = re.getClefEvents();
				v.clefedata = this.getPrincipalClefData(v);
			}

		if( e.getMensInfo_1() != null)
			v.mensEvent = re;

	}

	/*------------------------------------------------------------------------
Method:  Event setVoiceParameters(VoiceGfxInfo v,Event e)
Purpose: Set voice parameters if modified by an event about to be rendered
Parameters:
  Input:  VoiceGfxInfo  v - voice to update
          Event         e - event to be rendered
  Output: -
  Return: event to be rendered, replaced if necessary
------------------------------------------------------------------------*/
	setVoiceParameters(v:VoiceGfxInfo,e:Event):Event
	{
		if( this.skipevents > 0)
			return e;

		v.lastNoteEvent = null;
		if( e.hasSignatureClef_1())
			{
				let skippedClefEvents:number = this.calcNumSkippedClefEvents(v,v.evloc);
				if( skippedClefEvents > 0)
					this.skipevents += skippedClefEvents;

				if( this.useModernClefs && e.geteventtype() == Event.EVENT_MULTIEVENT && e.hasPrincipalClef_1())
					{
						for(
						let ei:Iterator<Event> =(<MultiEvent> e).iterator_2();ei.hasNext();)
						{
							let ee:Event =<Event> ei.next();
							if( ee.geteventtype() == Event.EVENT_CLEF && ! ee.hasPrincipalClef_1())
								v.replacementEvents.add(ee);

						}
						e =(<MultiEvent> e).noSigClefEvent();
					}

			}

		let mensInfo:Mensuration = e.getMensInfo_1();
		if( mensInfo != null)
			{
				if( this.baseMensuration == null ||( v.musictime.equals(this.lastMensTime) && this.lastMens.equals(mensInfo)))
					{
						this.baseMensuration = mensInfo;
						this.numMinimsInBreve =(( this.baseMensuration.prolatio * this.baseMensuration.tempus) | 0);
						let oldBS:number = this.BREVESCALE;
						this.BREVESCALE = this.MINIMSCALE * this.numMinimsInBreve;
						if( v.musictime.lessThan(this.curmeasure.getEndMusicTime_1()))
							{
								this.curmeasure.numMinims = this.numMinimsInBreve;
								this.curmeasure.xlength += this.BREVESCALE - oldBS;
							}

					}

				this.lastMens = mensInfo;
				this.lastMensTime = v.musictime;
			}

		if( e.geteventtype() == Event.EVENT_DOT &&((<DotEvent> e).getdottype() & DotEvent.DT_Addition) != 0)
			v.lastNoteEvent = this.getLastNoteEvent(v,(( v.revloc - 1) | 0));

		if( ! this.displayallnewlineclefs && e.geteventtype() == Event.EVENT_CUSTOS)
			{
				let nexte:Event = v.v.getEvent((( v.evloc + 1) | 0));
				if( nexte != null && nexte.geteventtype() == Event.EVENT_LINEEND)
					this.skipevents ++;

			}

		if( e.geteventtype() == Event.EVENT_LINEEND && ! this.displayallnewlineclefs)
			{
				let nexte:Event = v.v.getEvent((( v.evloc + 1) | 0));
				this.skipevents ++;
				if( nexte != null && nexte.hasSignatureClef_1() && nexte.principalClefEquals(v.clefedata,this.useModernClefs))
					{
						if( this.useModernAccSystem || nexte.getModernKeySig().equals(e.getModernKeySig()))
							this.skipevents += this.calcNumClefEvents(v,(( v.evloc + 1) | 0));

						if( this.useModernAccSystem && ! nexte.getModernKeySig().equals(e.getModernKeySig()))
							v.replacementEvents.addAll(this.constructDisplayClefSet(v.clefEvents,nexte));

					}

			}

		if( e.geteventtype() == Event.EVENT_PROPORTION)
			{
				let newp:Proportion =(<ProportionEvent> e).getproportion();
				v.curProportion = Proportion.new1(v.curProportion);
				v.curProportion.multiply_2(newp);
			}

		if( e.geteventtype() == Event.EVENT_COLORCHANGE)
			v.curColoration = Coloration.new1(v.curColoration,(<ColorChangeEvent> e).getcolorscheme());

		if( e.geteventtype() == Event.EVENT_VARIANTDATA_START)
			{
				let nextEvent:Event = v.v.getEvent((( v.evloc + 1) | 0));
				let skippedClefEvents:number = this.calcNumSkippedClefEvents(v,(( v.evloc + 1) | 0));
				let nextDisplayedEvent:Event = v.v.getEvent((((( v.evloc + skippedClefEvents) | 0) + 1) | 0));
				if( skippedClefEvents > 0 && nextDisplayedEvent.geteventtype() == Event.EVENT_VARIANTDATA_END)
					this.skipevents +=(( skippedClefEvents + 2) | 0);
				else
					{
						v.varReadingInfo = RenderedEventGroup.new0(v.revloc);
						v.varReadingInfo.grouptype = RenderedEventGroup.EVENTGROUP_VARIANTREADING;
						v.varReadingInfo.varReading = e.getVariantReading_1(this.musicData.getVersion());
						v.varReadingInfo.varMarker =<VariantMarkerEvent> e;
						if( v.varReadingInfo.varReading != null && v.varReadingInfo.varReading.isError())
							{
								let defaultReadingLength:Proportion =(<VariantMarkerEvent> e).getDefaultLength();
								let varReadingLength:Proportion = v.varReadingInfo.varReading.getLength();
								if( varReadingLength.greaterThan(defaultReadingLength))
									{
										this.errorRespacingTime = Proportion.sum(v.musictime,defaultReadingLength);
										this.variantVoice = v;
									}

								else
									if( defaultReadingLength.greaterThan(varReadingLength))
										{
											v.varDefaultTimeAdd = Proportion.difference(defaultReadingLength,varReadingLength);
										}

							}

					}

			}

		if( e.geteventtype() == Event.EVENT_VARIANTDATA_END)
			{
				if( v.varDefaultTimeAdd != null)
					v.respaceAfterVar = true;

				if( v.varReadingInfo == null)
					{
						System.err.println("Error! VARIANTDATA_END without START; V" + v.voicenum + ", evloc=" + v.evloc);
						for(
						let ei:number = 0;ei < v.evloc;ei ++)
						v.v.getEvent(ei).prettyprint_1();
					}

				v.varReadingInfo.lastEventNum =(( v.revloc - 1) | 0);
				v.varReadingInfo.calculateYMinMax(this.eventinfo[v.voicenum]);
				if( v.varReadingInfo.firstEventNum == v.varReadingInfo.lastEventNum)
					this.eventinfo[v.voicenum].getEvent(v.varReadingInfo.firstEventNum).setDisplay(true);

			}

		return e;
	}

	/* separate modern clefs from accidentals */
	//&& !useModernAccSystem)
	/*        else
          if (v.clefevent==-1 ||
              e.getClefSet(useModernAccSystem)!=v.clefedata.getClefSet(useModernAccSystem))
            {
              v.clefevent=v.revloc;
              v.clefedata=e;
            }*/
	/* if at least two voices change to the same mensuration
               simultaneously, use as main mensuration */
	/* set base mensuration info for score measure structure */
	/* change current bar if mensuration takes effect here */
	/* skip lineend custodes unless displaying newline clefs */
	/* at line end, construct display for next clef set */
	//                !nexte.getClefSet(useModernAccSystem).contradicts(v.clefEvents.getLastClefSet(useModernAccSystem),useModernClefs,v.v.getMetaData().getSuggestedModernClef()))
	//                nexte.getClefSet(useModernAccSystem).contradicts(v.clefEvents.getLastClefSet(useModernAccSystem),useModernClefs,v.v.getMetaData().getSuggestedModernClef()))
	//System.out.println("startvar: V"+v.voicenum+", evloc="+v.evloc);
	/* nothing displayed in editorial section: don't display brackets */
	//System.out.println("startvar: V"+v.voicenum+", evloc="+v.evloc);
	//            v.inEditorialSection=true;
	//System.out.println("var > default: new respacing time: "+errorRespacingTime);
	//else
	//System.out.println("endvar: V"+v.voicenum+", evloc="+v.evloc);
	/*        v.varReadingInfo.lastEventNum++;
        v.varReadingInfo=null;
        v.inEditorialSection=false;*/
	getLastNoteEvent(v:VoiceGfxInfo,ei:number):RenderedEvent
	{
		for(
		;ei >= 0;ei --)
		{
			let curre:RenderedEvent = this.eventinfo[v.voicenum].getEvent(ei);
			if( curre.getEvent_1().hasEventType_1(Event.EVENT_NOTE))
				return curre;

		}
		return null;
	}

	/*------------------------------------------------------------------------
Method:  double insertReplacementEvents(VoiceGfxInfo v,double xadd)
Purpose: Insert newly-created events into render list
Parameters:
  Input:  VoiceGfxInfo v    - voice to update
          double       xadd - positioning adjuster
  Output: -
  Return: new value for xadd
------------------------------------------------------------------------*/
	insertReplacementEvents_2(v:VoiceGfxInfo,xadd:number):number
	{
		let re:RenderedEvent;
		let lastevent:RenderedEvent = null;
		let rl:RenderList = this.eventinfo[v.voicenum];
		let curx:number;
		for(let e of v.replacementEvents)
		{
			re = rl.addevent_1(true,e,RenderParams.new0(this.curMeasureNum,v.clefEvents,lastevent,v.mensEvent,v.curProportion,v.curColoration,v.inEditorialSection,v.missingInVersion,v.ligInfo,false,v.tieInfo,v.v.getMetaData().getSuggestedModernClef(),v.varReadingInfo));
			re.setxloc(curx = v.calcXLoc(rl,re));
			xadd = this.finishUntimedEvent(v,re,curx,xadd);
			if( e.hasSignatureClef_1())
				{
					v.clefEvents = new RenderedClefSet(v.clefEvents,re,this.useModernAccSystem,v.v.getMetaData().getSuggestedModernClef());
					v.clefedata = this.getPrincipalClefData(v);
				}

		}
		v.replacementEvents = new ArrayList<Event>();
		return xadd;
	}

	/* render event */
	/* set voice event parameters */
	/*------------------------------------------------------------------------
Method:  int calcNumSkippedClefEvents(VoiceGfxInfo v,int ei)
Purpose: Calculate number of clef events which go undisplayed if clef-display
         customization is used (useModernClefs, !displayallnewlineclefs, etc)
Parameters:
  Input:  VoiceGfxInfo v - voice being checked
          int ei         - index of event to check
  Output: -
  Return: number of events to be skipped
------------------------------------------------------------------------*/
	calcNumSkippedClefEvents(v:VoiceGfxInfo,ei:number):number
	{
		let e:Event = v.v.getEvent(ei);
		if( ! e.hasSignatureClef_1())
			return 0;

		if( v.clefEvents != null && e.hasPrincipalClef_1() &&(( this.useModernClefs && e.getClefSet_2(this.useModernAccSystem) != v.clefedata.getClefSet_2(this.useModernAccSystem) && ! e.getClefSet_2(this.useModernAccSystem).contradicts_2(v.clefEvents.getLastClefSet(this.useModernAccSystem),this.useModernClefs,v.v.getMetaData().getSuggestedModernClef())) ||( ! this.displayallnewlineclefs && e.hasPrincipalClef_1() && ! e.getClefSet_2(this.useModernAccSystem).contradicts_2(v.clefEvents.getLastClefSet(this.useModernAccSystem),this.useModernClefs,v.v.getMetaData().getSuggestedModernClef()))))
			return this.calcNumClefEvents(v,ei);

		return 0;
	}

	/* calculate number of events in a clef set at a specified location */
	calcNumClefEvents(v:VoiceGfxInfo,ei:number):number
	{
		let clefe:Event = v.v.getEvent(ei);
		let origcs:ClefSet = clefe != null ? clefe.getClefSet_2(this.useModernAccSystem):null;
		let numEvents:number = 0;
		while( clefe != null)
		{
			let cs:ClefSet = clefe.getClefSet_2(this.useModernAccSystem);
			if( cs == null || cs != origcs)
				return numEvents;
			else
				numEvents ++;

			clefe = v.v.getEvent(++ ei);
		}
		return numEvents;
	}

	/*------------------------------------------------------------------------
Method:  ArrayList<Event> constructDisplayClefSet(Event curc,Event newc)
Purpose: Prepare new clef display for insertion into rendering (display
         depends upon modern/original clefs etc)
         Entry condition: newc contradicts curc, but the principal clefs are
                          equal (i.e., only signature clefs differ)
Parameters:
  Input:  Event curc - current clef information
          Event newc - new clef information
  Output: -
  Return: list of new events for clef set display
------------------------------------------------------------------------*/
	constructDisplayClefSet(curRCS:RenderedClefSet,newc:Event):ArrayList<Event>
	{
		let curcs:ClefSet = curRCS.getLastClefSet(this.useModernAccSystem);
		let newcs:ClefSet = newc.getClefSet_2(this.useModernAccSystem);
		let le:Event = null;
		let curc:Event = curRCS.getPrincipalClefEvent().getEvent_1();
		let elist:ArrayList<Event> = new ArrayList<Event>();
		if( !( this.useModernClefs || this.useModernAccSystem))
			elist.add(LineEndEvent.new15());

		if( newcs.numflats() < curcs.numflats())
			if( ! this.useModernAccSystem)
				{
					elist.add(le = ClefEvent.new7(newcs.getprincipalclef(),null,null));
					curc = le;
					curcs = curc.getClefSet_2(this.useModernAccSystem);
				}

			else
				for(
				let i:Iterator<Clef> = curcs.acciterator();i.hasNext();)
				{
					let c:Clef =<Clef> i.next();
					if( ! newcs.containsClef(c))
						elist.add(le = ClefEvent.new7(Clef.new0(Clef.CLEF_MODERNNatural,c.linespacenum,c.pitch,true,true,newcs.getprincipalclef()),le,null));

				}

		if( newcs.numflats() > curcs.numflats())
			for(
			let i:Iterator<Clef> = newcs.acciterator();i.hasNext();)
			{
				let c:Clef =<Clef> i.next();
				if( ! curcs.containsClef(c))
					elist.add(le = ClefEvent.new7(c,le,curc));

			}

		return elist;
	}

	/* if orig clefs, show line end */
	/* need to remove flats? */
	/* add principal clef */
	/* add naturals */
	/* need to add flats? */
	/*------------------------------------------------------------------------
Method:  ArrayList<Event> constructVarTextEvents(VoiceGfxInfo v,[OriginalTextEvent te])
Purpose: Create text events to display variant texting at current variant location
Parameters:
  Input:  VoiceGfxInfo v       - voice in which to render
          OriginalTextEvent te - text in default version to copy
  Output: -
  Return: list of new events for variant text display
------------------------------------------------------------------------*/
	/* calculate what the "default" versions are at one set of readings */
	getDefaultVersions(v:VoiceGfxInfo):ArrayList<VariantVersionData>
	{
		if( v.varReadingInfo == null)
			return new ArrayList<VariantVersionData>();

		let defaultVersions:ArrayList<VariantVersionData> = new ArrayList<VariantVersionData>(this.fullPieceData.getVariantVersions());
		let varEvent:VariantMarkerEvent = v.varReadingInfo.varMarker;
		for(let vr of varEvent.getReadings())
		for(let vvd of vr.getVersions())
		defaultVersions.remove(vvd);
		for(let vvd of this.fullPieceData.getVariantVersions())
		if( vvd.isVoiceMissing(this.musicData.getVoice_1(v.voicenum).getMetaData()) || this.musicData.getVoice_1(v.voicenum).getMissingVersions().contains(vvd))
			defaultVersions.remove(vvd);

		return defaultVersions;
	}

	/* remove anything with a variant reading */
	/* remove versions which are missing this voice */
	constructVarTextEvents_1(v:VoiceGfxInfo,te:OriginalTextEvent):ArrayList<Event>
	{
		let textEvents:ArrayList<Event> = new ArrayList<Event>();
		if( ! this.musicData.isDefaultVersion())
			return textEvents;

		let displayVersions:ArrayList<VariantVersionData> = new ArrayList<VariantVersionData>(this.fullPieceData.getVariantVersions());
		if( v.varReadingInfo != null)
			if( this.musicData.isDefaultVersion())
				{
					let varEvent:VariantMarkerEvent = v.varReadingInfo.varMarker;
					for(let vr of varEvent.getReadings())
					for(let vvd of vr.getVersions())
					displayVersions.remove(vvd);
				}

			else
				{
					let varEvent:VariantMarkerEvent = v.varReadingInfo.varMarker;
					for(let vr of varEvent.getReadings())
					if( vr != v.varReadingInfo.varReading)
						for(let vvd of vr.getVersions())
						displayVersions.remove(vvd);

					displayVersions.remove(this.fullPieceData.getDefaultVariantVersion());
				}

		for(let vvd of this.fullPieceData.getVariantVersions())
		if( vvd.isVoiceMissing(this.musicData.getVoice_1(v.voicenum).getMetaData()) || this.musicData.getVoice_1(v.voicenum).getMissingVersions().contains(vvd))
			displayVersions.remove(vvd);

		for(let vvd of displayVersions)
		textEvents.add(OriginalTextEvent.new27(te.getText(),vvd));
		return textEvents;
	}

	/* construct list of versions using this reading */
	constructVarTextEvents_2(v:VoiceGfxInfo):ArrayList<Event>
	{
		let textEvents:ArrayList<Event> = new ArrayList<Event>();
		let varEvent:VariantMarkerEvent = v.varReadingInfo.varMarker;
		if( ! this.musicData.isDefaultVersion())
			{
				let ei:number =(( varEvent.getDefaultListPlace() + 1) | 0);
				let eType:number = - 1;
				let defaultVL:VoiceEventListData = this.fullPieceData.getDefaultMusicData().getSection(this.sectionNum).getVoice_1(v.voicenum);
				let defaultVersions:ArrayList<VariantVersionData> = this.getDefaultVersions(v);
				do
				{
					let e:Event = defaultVL.getEvent(ei);
					eType = e.geteventtype();
					if( eType == Event.EVENT_ORIGINALTEXT)
						for(let dv of defaultVersions)
						textEvents.add(OriginalTextEvent.new27((<OriginalTextEvent> e).getText(),dv));

					ei ++;
				}
				while( eType != Event.EVENT_VARIANTDATA_END);
			}

		for(let vr of varEvent.getReadings())
		{
			let numEvents:number = vr.getNumEvents();
			for(
			let ei:number = 0;ei < numEvents;ei ++)
			{
				let e:Event = vr.getEvent(ei);
				if( e.geteventtype() == Event.EVENT_ORIGINALTEXT)
					for(let vvd of vr.getVersions())
					textEvents.add(OriginalTextEvent.new27((<OriginalTextEvent> e).getText(),vvd));

			}
		}
		return textEvents;
	}

	/* if displaying variant version, add text from default reading */
	/* do variant readings */
	/*------------------------------------------------------------------------
Method:  double finishUntimedEvent(VoiceGfxInfo v,RenderedEvent re,
                                   double curx,double xadd)
Purpose: Advance voice info counters and x positioning information after
         rendering an untimed event
Parameters:
  Input:  VoiceGfxInfo  v    - voice to update
          RenderedEvent re   - event which has just been rendered
          double        curx - current renderer x position
          double        xadd - positioning adjuster for all voices at the
                              end of untimed event rendering
  Output: -
  Return: new value for xadd
------------------------------------------------------------------------*/
	finishUntimedEvent(v:VoiceGfxInfo,re:RenderedEvent,curx:number,xadd:number):number
	{
		v.revloc ++;
		let eventxlen:number = re.getrenderedxsize();
		if( ScoreRenderer.getxspacing(re.getEvent_1()) == ScoreRenderer.XSPACING_NOSPACE)
			{
				if( curx + eventxlen > v.xloc)
					eventxlen = curx + eventxlen - v.xloc;
				else
					eventxlen = 0;

			}

		if( this.getXPosType_1(re.getEvent_1()) == ScoreRenderer.XPOS_SIMULTANEOUS)
			eventxlen = 0;

		if( re.isdisplayed())
			v.lastx = curx;

		v.xloc += eventxlen;
		v.xadd += eventxlen;
		if( v.xadd > xadd)
			xadd = v.xadd;

		if( re.getEvent_1().geteventtype() == Event.EVENT_VARIANTDATA_END)
			{
				if( this.skipevents == 0)
					v.varReadingInfo.lastEventNum ++;

				v.varReadingInfo = null;
			}

		return xadd;
	}

	/* leave lastx alone if this event wasn't */
	/* displayed */
	//        v.inEditorialSection=false;
	/*------------------------------------------------------------------------
Method:  void renderUnspacedVariantRemainder()
Purpose: When a variant error is longer than the default reading, finish
         rendering it with non-score spacing, then apply extra spacing to
         the non-variant voices so that the parts re-align properly after
         the error
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	renderUnspacedVariantRemainder():void
	{
		let xadd:number = 0;
		let e:Event;
		for(
		e = this.variantVoice.v.getEvent(this.variantVoice.evloc);e.geteventtype() != Event.EVENT_VARIANTDATA_END;e = this.variantVoice.v.getEvent(this.incrementVoicePosition(this.variantVoice)))
		xadd = this.renderUntimedEvent(this.variantVoice,e,xadd);
		xadd = this.renderUntimedEvent(this.variantVoice,e,xadd);
		this.incrementVoicePosition(this.variantVoice);
		this.advanceVoices(xadd);
		this.errorRespacingTime = null;
		this.variantVoice = null;
	}

	/*------------------------------------------------------------------------
Method:  int incrementVoicePosition(VoiceGfxInfo v)
Purpose: Advance event index within one voice list, remove if done
Parameters:
  Input:  VoiceGfxInfo  v - voice to update
  Output: -
  Return: new event index
------------------------------------------------------------------------*/
	incrementVoicePositionOld(v:VoiceGfxInfo):number
	{
		v.evloc ++;
		this.removeVoiceIfFinished(v);
		return v.evloc;
	}

	/*------------------------------------------------------------------------
Method:  void removeVoice[IfFinished](VoiceGfxInfo v)
Purpose: Remove voice from rendering to-do list [if all its events have
         been rendered]
Parameters:
  Input:  VoiceGfxInfo  v - voice to update
  Output: -
  Return: -
------------------------------------------------------------------------*/
	removeVoiceIfFinishedOld(v:VoiceGfxInfo):void
	{
		if( v.v.getEvent(v.evloc) == null)
			this.removeVoice(v);

	}

	removeVoiceOld(v:VoiceGfxInfo):void
	{
		if( v.next != null)
			v.next.last = v.last;

		if( v.last != null)
			v.last.next = v.next;
		else
			this.liststart = v.next;

	}

	/*------------------------------------------------------------------------
Method:  void advanceVoices(double xadd)
Purpose: Move all voices forward (horizontally) after events
Parameters:
  Input:  double xadd - total amount for voices to shift
  Output: -
  Return: -
------------------------------------------------------------------------*/
	advanceVoicesOld(xadd:number):void
	{
		if( xadd > 0)
			{
				this.curmeasure.xlength += xadd;
				for(
				let i:number = 0;i < this.numVoices;i ++)
				if( this.musicData.getVoice_1(i) != null)
					{
						if( this.voicegfx[i].xadd < xadd)
							{
								let vxadd:number = xadd - this.voicegfx[i].xadd;
								this.voicegfx[i].xloc += vxadd;
								if( this.liststart != null && this.voicegfx[i].musictime.toDouble() >= this.liststart.musictime.toDouble())
									this.voicegfx[i].moveupBEFORENEXTevents(this.eventinfo[i],vxadd);

							}

						this.voicegfx[i].xadd = 0;
					}

			}

	}

	advanceOneMeasureSpacingOld():void
	{
		this.barxstart += this.curmeasure.xlength;
		this.curMeasureNum ++;
		for(
		let i:number = 0;i < this.numVoices;i ++)
		{
			this.curmeasure.reventindex[i]= this.voicegfx[i].revloc;
			this.curmeasure.startClefEvents[i]= this.voicegfx[i].clefEvents;
			this.curmeasure.startMensEvent[i]= this.voicegfx[i].mensEvent;
		}
		if( this.options.get_barline_type() != OptionSet.OPT_BARLINE_NONE)
			{
				let bxadd:number = ScoreRenderer.BARLINE_XADD;
				switch( this.options.get_barline_type())
				{
					case OptionSet.OPT_BARLINE_MENSS:
					{
					}
					case OptionSet.OPT_BARLINE_MODERN:
					{
						bxadd *= 2;
						break;
					}
				}
				this.curmeasure.xlength += bxadd;
				for(
				let i:number = 0;i < this.numVoices;i ++)
				this.voicegfx[i].xloc += bxadd;
			}

	}

	/* deal with end of bar issues */
	//    curmeasure=measures.newMeasure(curMeasureNum,curmeasure.startMusicTime+curmeasure.numMinims,numMinimsInBreve,
	//                                   BREVESCALE,barxstart);
	/* space for barlines */
	/*------------------------------------------------------------------------
Method:  double renderTimedandImmediateEvents()
Purpose: Render one timed event for each voice in last place along with
         XPOS_IMMEDIATE untimed events following it (e.g., dots)
Parameters:
  Input:  -
  Output: -
  Return: Total amount of horizontal space needed by the events
------------------------------------------------------------------------*/
	renderTimedAndImmediateEvents():number
	{
		let curvoice:VoiceGfxInfo;
		let nextvoice:VoiceGfxInfo;
		let moveplace:VoiceGfxInfo;
		let e:Event;
		let xadd:number = 0;
		let curevmusictime:Proportion;
		if( this.liststart == null)
			return xadd;

		nextvoice = this.liststart.next;
		for(
		curvoice = this.liststart;curvoice != null && curvoice.musictime.toDouble() <= this.starttime.toDouble();curvoice = nextvoice)
		{
			nextvoice = curvoice.next;
			e = curvoice.v.getEvent(curvoice.evloc);
			if( e == null)
				this.removeVoice(curvoice);
			else
				if( e.geteventtype() == Event.EVENT_ELLIPSIS)
					{
						this.removeVoice(curvoice);
						this.finalisList.add(curvoice);
					}

				else
					{
						xadd = this.renderTimedEvent(curvoice,e,xadd);
						this.recalcVoiceList(curvoice);
					}

		}
		return xadd;
	}

	/*------------------------------------------------------------------------
Method:  void recalcVoiceList(VoiceGfxInfo curvoice)
Purpose: Adjust pointers within voice list to maintain sorting order after one
         voice has moved forward
Parameters:
  Input:  VoiceGfxInfo curvoice - voice which has just been advanced (i.e. in
                                  which timed events have just been rendered)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	recalcVoiceListOld(curvoice:VoiceGfxInfo):void
	{
		let moveplace:VoiceGfxInfo = curvoice;
		while( !(( moveplace.next == null) ||( moveplace.next.musictime.greaterThan(curvoice.musictime))))
		moveplace = moveplace.next;
		if( moveplace != curvoice)
			{
				this.removeVoice(curvoice);
				if( moveplace.next != null)
					moveplace.next.last = curvoice;

				curvoice.next = moveplace.next;
				curvoice.last = moveplace;
				moveplace.next = curvoice;
			}

	}

	/* re-insert */
	doNoteEventLigInfo(curvoice:VoiceGfxInfo,ne:NoteEvent):boolean
	{
		if( curvoice.ligInfo.firstEventNum == - 1 && ne.isligated())
			curvoice.ligInfo = RenderedLigature.new3(curvoice.v,this.eventinfo[curvoice.voicenum]);

		return curvoice.ligInfo.update(curvoice.revloc,ne);
	}

	/* start new ligature */
	doMultiEventLigInfo(curvoice:VoiceGfxInfo,me:MultiEvent):boolean
	{
		let endlig:boolean = false;
		let ligEv:NoteEvent =<NoteEvent> me.getFirstEventOfType_1(Event.EVENT_NOTE);
		if( ligEv != null)
			endlig = this.doLigInfo(curvoice,ligEv);

		return endlig;
	}

	/* TMP: choose one NoteEvent to be in lig */
	doLigInfo(curvoice:VoiceGfxInfo,e:Event):boolean
	{
		switch( e.geteventtype())
		{
			case Event.EVENT_NOTE:
			{
				return this.doNoteEventLigInfo(curvoice,<NoteEvent> e);
			}
			case Event.EVENT_MULTIEVENT:
			{
				return this.doMultiEventLigInfo(curvoice,<MultiEvent> e);
			}
		}
		return false;
	}

	doNoteEventTieEndInfo(curvoice:VoiceGfxInfo,ne:NoteEvent):void
	{
		if( curvoice.tieInfo.firstEventNum != - 1)
			curvoice.tieInfo.update(curvoice.revloc,ne);

	}

	/* end of a tie? */
	doNoteEventTieStartInfo(curvoice:VoiceGfxInfo,ne:NoteEvent):void
	{
		curvoice.tieInfo = RenderedLigature.new2(curvoice.v,this.eventinfo[curvoice.voicenum],RenderedLigature.TIE);
		if( ne.getTieType() != NoteEvent.TIE_NONE)
			curvoice.tieInfo.update(curvoice.revloc,ne);

	}

	/* start new tie */
	/* start of a new tie? */
	doMultiEventTieEndInfo(curvoice:VoiceGfxInfo,me:MultiEvent):void
	{
		let tieEv:NoteEvent =<NoteEvent> me.getFirstEventOfType_1(Event.EVENT_NOTE);
		if( tieEv != null)
			this.doTieEndInfo(curvoice,tieEv);

	}

	/* TMP: choose one NoteEvent to be in lig */
	doMultiEventTieStartInfo(curvoice:VoiceGfxInfo,me:MultiEvent):void
	{
		let tieEv:NoteEvent =<NoteEvent> me.getFirstEventOfType_1(Event.EVENT_NOTE);
		if( tieEv != null)
			this.doTieStartInfo(curvoice,tieEv);

	}

	/* TMP: choose one NoteEvent to be in lig */
	doTieEndInfo(curvoice:VoiceGfxInfo,e:Event):void
	{
		switch( e.geteventtype())
		{
			case Event.EVENT_NOTE:
			{
				this.doNoteEventTieEndInfo(curvoice,<NoteEvent> e);
				break;
			}
			case Event.EVENT_MULTIEVENT:
			{
				this.doMultiEventTieEndInfo(curvoice,<MultiEvent> e);
				break;
			}
		}
	}

	doTieStartInfo(curvoice:VoiceGfxInfo,e:Event):void
	{
		switch( e.geteventtype())
		{
			case Event.EVENT_NOTE:
			{
				this.doNoteEventTieStartInfo(curvoice,<NoteEvent> e);
				break;
			}
			case Event.EVENT_MULTIEVENT:
			{
				this.doMultiEventTieStartInfo(curvoice,<MultiEvent> e);
				break;
			}
		}
	}

	/*------------------------------------------------------------------------
Method:  double renderTimedEvent(VoiceGfxInfo curvoice,Event e,double xadd)
Purpose: Render one timed event along with XPOS_IMMEDIATE untimed events
         following it (e.g., dots)
Parameters:
  Input:  VoiceGfxInfo curvoice - voice of event
          Event e               - event to render
          double xadd           - total amount of horizontal space needed
                                  for adjusting all voices after this render
                                  phase
  Output: -
  Return: new value for xadd
------------------------------------------------------------------------*/
	renderTimedEvent(curvoice:VoiceGfxInfo,e:Event,xadd:number):number
	{
		let rl:RenderList = this.eventinfo[curvoice.voicenum];
		xadd = this.addWithnextEvents(curvoice,xadd);
		let endlig:boolean = this.doLigInfo(curvoice,e);
		if( e.geteventtype() == Event.EVENT_MULTIEVENT)
			{
				if( this.useModernClefs && e.hasEventType_1(Event.EVENT_CLEF))
					{
						for(
						let i:Iterator<Event> =(<MultiEvent> e).iterator_2();i.hasNext();)
						{
							let ne:Event =<Event> i.next();
							if( ne.geteventtype() == Event.EVENT_CLEF)
								curvoice.replacementEvents.add(ne);

						}
						e =(<MultiEvent> e).noClefEvent();
					}

				this.setVoiceParameters(curvoice,e);
			}

		let re:RenderedEvent = rl.addevent_1(true,e,RenderParams.new0(this.curMeasureNum,curvoice.clefEvents,null,curvoice.mensEvent,curvoice.curProportion,curvoice.curColoration,curvoice.inEditorialSection,curvoice.missingInVersion,curvoice.ligInfo,endlig,curvoice.tieInfo,curvoice.v.getMetaData().getSuggestedModernClef(),curvoice.varReadingInfo));
		re.setxloc(curvoice.xloc);
		re.setmusictime(curvoice.musictime);
		if( e.geteventtype() == Event.EVENT_MULTIEVENT)
			this.setVoiceEventParameters(curvoice,re);

		if( endlig)
			curvoice.ligInfo = RenderedLigature.new3(curvoice.v,rl);

		curvoice.revloc ++;
		let curevmusictime:Proportion = Proportion.new0((( e.getmusictime().i1 * curvoice.curProportion.i2) | 0),(( e.getmusictime().i2 * curvoice.curProportion.i1) | 0));
		if( e.getFirstEventOfType_1(Event.EVENT_REST) != null)
			{
				if( re.getmusictime().equals(this.curSonority.getMusicTime()))
					this.curSonority.remove(curvoice.curSoundingEvent);
				else
					{
						this.curSonority = this.curSonority.copyWithout(curvoice.curSoundingEvent);
						this.curSonority.setMusicTime(re.getmusictime());
						this.sonorityList.add(this.curSonority);
					}

				curvoice.curSoundingEvent = null;
			}

		if( e.getFirstEventOfType_1(Event.EVENT_NOTE) != null)
			{
				if( re.getmusictime().equals(this.curSonority.getMusicTime()))
					{
						this.curSonority.remove(curvoice.curSoundingEvent);
						this.curSonority.add(re);
					}

				else
					{
						this.curSonority = this.curSonority.copyWithout(curvoice.curSoundingEvent);
						this.curSonority.add(re);
						this.curSonority.setMusicTime(re.getmusictime());
						this.sonorityList.add(this.curSonority);
					}

				curvoice.curSoundingEvent = re;
				re.setSonority(this.curSonority);
			}

		curvoice.evloc ++;
		curvoice.lastx = curvoice.xloc;
		if( this.errorRespacingTime != null && curvoice == this.variantVoice && Proportion.sum(curvoice.musictime,curevmusictime).greaterThan(this.errorRespacingTime))
			curevmusictime = Proportion.difference(this.errorRespacingTime,curvoice.musictime);

		let xlocadd:number = this.MINIMSCALE * curevmusictime.toDouble();
		if( xlocadd < re.getrenderedxsize())
			{
				curvoice.xadd += re.getrenderedxsize() - xlocadd;
				if( xadd < curvoice.xadd)
					xadd = curvoice.xadd;

				xlocadd = re.getrenderedxsize();
			}

		curvoice.xloc += xlocadd;
		let ute:Event = curvoice.v.getEvent(curvoice.evloc);
		let xpostype:number = this.getXPosType_1(ute);
		while( ute != null &&( xpostype == ScoreRenderer.XPOS_IMMEDIATE || xpostype == ScoreRenderer.XPOS_SIMULTANEOUS))
		{
			xadd = this.renderUntimedEvent(curvoice,ute,xadd);
			ute = curvoice.v.getEvent(this.incrementVoicePosition(curvoice));
			xpostype = this.getXPosType_1(ute);
		}
		curvoice.musictime.add(curevmusictime);
		return xadd;
	}

	/* handle multi-event special cases */
	/* when switching to modern cleffing, do not allow clefs/accidentals
               to co-exist with timed events (e.g., flat above a rest) */
	/* queue clef events for later rendering */
	/* render event */
	/* if we've just finished a ligature, reset ligInfo */
	/* update sonority info */
	/* render untimed XPOS_IMMEDIATE events (e.g., dots)
       and XPOS_SIMULTANEOUS events (vertically aligned with current event) */
	/*------------------------------------------------------------------------
Method:  void renderEllipses()
Purpose: For incipit-scores: render blank space between incipits and
         explicits
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	renderEllipses():void
	{
		if( this.finalisList.size() <= 0)
			return;

		let newx:number = 0;
		for(
		let i:number = 0;i < this.voicegfx.length;i ++)
		if( this.voicegfx[i].xloc > newx)
			newx = this.voicegfx[i].xloc;

		newx += 20;
		let newmt:Proportion = Proportion.new0(((<number> this.curmeasure.startMusicTime.toDouble() + this.curmeasure.numMinims) | 0),1);
		let lastv:VoiceGfxInfo = null;
		let firstv:VoiceGfxInfo = null;
		let curv:VoiceGfxInfo = null;
		for(
		let i:Iterator<VoiceGfxInfo> = this.finalisList.iterator();i.hasNext();)
		{
			curv =<VoiceGfxInfo> i.next();
			let rl:RenderList = this.eventinfo[curv.voicenum];
			let re:RenderedEvent = rl.addevent_1(true,curv.v.getEvent(curv.evloc),RenderParams.new0(this.curMeasureNum,curv.clefEvents,null,curv.mensEvent,curv.curProportion,curv.curColoration,curv.inEditorialSection,curv.missingInVersion,curv.ligInfo,false,curv.tieInfo,curv.v.getMetaData().getSuggestedModernClef(),curv.varReadingInfo));
			re.setxloc(curv.xloc);
			re.setmusictime(curv.musictime);
			curv.revloc ++;
			curv.evloc ++;
			curv.xloc = newx;
			curv.musictime.setVal_1(newmt);
			if( lastv != null)
				{
					curv.last = lastv;
					lastv.next = curv;
				}

			else
				firstv = curv;

			lastv = curv;
		}
		this.liststart = firstv;
		this.curmeasure.xlength = newx - this.barxstart;
		this.advanceOneMeasureSpacing();
	}
	/* find starting x-coord and musictime for explicits */
	/* render ELLIPSIS event */
	/* re-construct voice list for rendering (finales only) */
	/* new measure for explicit */
	/*--------------------------- CHANT-RENDERING ---------------------------*/
	/*------------------------------------------------------------------------
Method:  void renderAllChantEvents(MusicChantSection musicData)
Purpose: Render plainchant section
Parameters:
  Input:  MusicChantSection musicData - music data for this section
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static CHANT_TIME_UNIT_SHORT:Proportion = Proportion.new0(1,1);
	static CHANT_TIME_UNIT:Proportion = Proportion.new0(1,1);
	static CHANT_TIME_UNIT_LONG:Proportion = Proportion.new0(2,1);
	static CHANT_TIME_UNIT_NONE:Proportion = Proportion.new0(0,1);

	positionChantEvents(musicData:MusicChantSection):void
	{
		for(
		let vi:number = 0;vi < this.numVoices;vi ++)
		if( musicData.getVoice_1(vi) != null)
			{
				let vd:VoiceChantData =<VoiceChantData> musicData.getVoice_1(vi);
				let vg:VoiceGfxInfo = this.voicegfx[vi];
				let numEvents:number = vd.getNumEvents();
				let numRendered:number;
				let lastre:RenderedEvent = null;
				let lastNoteEvent:RenderedEvent = null;
				let xpadding:number = 0;
				let newXloc:number;
				let lastIsOrigText:boolean = false;
				let curEventLength:Proportion;
				let ei:number = 0;
				let done:boolean = ei >= numEvents;
				while( ! done)
				{
					let e:Event = vd.getEvent(ei);
					curEventLength = ScoreRenderer.CHANT_TIME_UNIT_NONE;
					e = this.setPrerenderParameters(vg,e);
					if( ei > 0)
						switch( e.geteventtype())
						{
							case Event.EVENT_NOTE:
							{
								let nt:number =(<NoteEvent> e).getnotetype_1();
								if( nt > NoteEvent.NT_Brevis)
									{
										xpadding = ScoreRenderer.CHANT_XPADDING_B;
										curEventLength = ScoreRenderer.CHANT_TIME_UNIT_LONG;
									}

								else
									if( nt >= NoteEvent.NT_Brevis)
										{
											xpadding = ScoreRenderer.CHANT_XPADDING_B;
											curEventLength = ScoreRenderer.CHANT_TIME_UNIT;
										}

									else
										{
											xpadding = ScoreRenderer.CHANT_XPADDING_SB;
											curEventLength = ScoreRenderer.CHANT_TIME_UNIT_SHORT;
										}

								break;
							}
							case Event.EVENT_DOT:
							{
								xpadding = ScoreRenderer.CHANT_XPADDING_DOT;
								break;
							}
							case Event.EVENT_BARLINE:
							{
								xpadding = ScoreRenderer.CHANT_XPADDING_B;
								break;
							}
							default:
							{
								xpadding = ScoreRenderer.CHANT_XPADDING_DEFAULT;
								break;
							}
						}

					if( e.geteventtype() == Event.EVENT_NOTE &&(<NoteEvent> e).isligated())
						{
							let firstNotePos:number = this.eventinfo[vi].size();
							numRendered = this.eventinfo[vi].addlig_1(vd,ei,RenderParams.new0(this.curMeasureNum,vg.clefEvents,lastre,vg.mensEvent,Proportion.EQUALITY,vg.curColoration,vg.inEditorialSection,vg.missingInVersion,vg.ligInfo,false,vg.tieInfo,vd.getMetaData().getSuggestedModernClef(),vg.varReadingInfo));
							newXloc = vg.xloc + xpadding;
							if( lastIsOrigText)
								lastre.setxloc(newXloc);

							for(
							let ni:number = firstNotePos;ni <(( firstNotePos + numRendered) | 0);ni ++)
							{
								let re:RenderedEvent = this.eventinfo[vi].getEvent(ni);
								re.setxloc(newXloc);
								re.setmusictime(vg.musictime);
								lastre = re;
								newXloc += re.getRenderedXSizeWithoutText();
								re.setLigEnd(ni ==(((( firstNotePos + numRendered) | 0) - 1) | 0));
								re.setMusicLength(curEventLength);
								vg.musictime.add(re.getMusicLength());
								if( re.getEvent_1().geteventtype() == Event.EVENT_NOTE)
									lastNoteEvent = re;

							}
						}

					else
						{
							let re:RenderedEvent = this.eventinfo[vi].addevent_1(true,e,RenderParams.new0(this.curMeasureNum,vg.clefEvents,lastre,vg.mensEvent,Proportion.EQUALITY,vg.curColoration,vg.inEditorialSection,vg.missingInVersion,vg.ligInfo,false,vg.tieInfo,vd.getMetaData().getSuggestedModernClef(),vg.varReadingInfo));
							numRendered = 1;
							re.setxloc(vg.xloc + xpadding);
							re.setmusictime(vg.musictime);
							if( lastIsOrigText)
								lastre.setxloc(re.getxloc());

							lastre = re;
							this.setPostrenderParameters_2(vg,re,false);
							newXloc = re.getxloc() + re.getRenderedXSizeWithoutText();
							re.setMusicLength(curEventLength);
							vg.musictime.add(re.getMusicLength());
							if( re.getEvent_1().geteventtype() == Event.EVENT_NOTE)
								lastNoteEvent = re;

						}

					vg.revloc += numRendered;
					vg.evloc += numRendered;
					if( e.geteventtype() != Event.EVENT_ORIGINALTEXT)
						{
							vg.lastx = vg.xloc;
							vg.xloc = newXloc;
							lastIsOrigText = false;
						}

					else
						lastIsOrigText = true;

					ei += numRendered;
					done = ei >= numEvents;
					if( done && lastNoteEvent != null)
						lastNoteEvent.setMusicLength(ScoreRenderer.CHANT_TIME_UNIT_LONG);

				}
				if( this.curmeasure.xlength < vg.xloc)
					this.curmeasure.xlength = vg.xloc;

				if( this.curmeasure.numMinims < vg.musictime.toDouble())
					this.curmeasure.numMinims =<number>( vg.musictime.toDouble());

			}

	}

	/* render as ligature */
	/* align original texting properly */
	/* align original texting properly */
	/* make final chant note long */
	/*        vg.xloc-=CHANTSYMBOL_XPADDING;  only pad between events */
	positionTextSection(musicData:MusicTextSection):void
	{
		EventStringImg.genericG.setFont(MusicFont.defaultTextFont);
		let m:FontMetrics = EventStringImg.genericG.getFontMetrics();
		this.curmeasure.xlength = ScoreRenderer.SECTION_END_SPACING + m.stringWidth(musicData.getSectionText());
	}

	/*---------------------- POST-RENDERING UTILITIES ----------------------*/
	/*------------------------------------------------------------------------
Method:  void adjustMeasureEventPositions(int mnum,double Xadjust)
Purpose: Change x-position of all rendered events within a measure
Parameters:
  Input:  int mnum       - index of measure to adjust
          double Xadjust - x-value to add to each event
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public adjustMeasureEventPositions(mnum:number,Xadjust:number):void
	{
		let starte:number;
		let ende:number;
		let re:RenderedEvent;
		for(
		let v:number = 0;v < this.numVoices;v ++)
		if( this.eventinfo[v]!= null)
			{
				starte = this.measures.get(mnum).reventindex[v];
				if((( mnum + 1) | 0) >= this.measures.size())
					ende =(( this.eventinfo[v].size() - 1) | 0);
				else
					ende =(( this.measures.get((( mnum + 1) | 0)).reventindex[v]- 1) | 0);

				for(
				let ei:number = starte;ei <= ende;ei ++)
				{
					re = this.eventinfo[v].get(ei);
					re.setxloc(re.getxloc() + Xadjust);
				}
			}

	}
}
