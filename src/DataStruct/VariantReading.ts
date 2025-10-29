
import { Exception } from '../java/lang/Exception';
import { System } from '../java/lang/System';
import { Math } from '../java/lang/Math';
import { VariantVersionData } from './VariantVersionData';
import { Proportion } from './Proportion';
import { OriginalTextEvent } from './OriginalTextEvent';
import { NoteEvent } from './NoteEvent';
import { MensEvent } from './MensEvent';
import { EventListData } from './EventListData';
import { Event } from './Event';
import { ClefSet } from './ClefSet';
import { ArrayList } from '../java/util/ArrayList';

export class VariantReading
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	/* flags for possible types of variation between readings */
	public static VAR_NONE:number = 0;
	/* 0000000000000000 */
	public static VAR_NONSUBSTANTIVE:number = 1;
	/* 0000000000000001 */
	public static VAR_RHYTHM:number = VariantReading.VAR_NONSUBSTANTIVE << 1;
	public static VAR_PITCH:number = VariantReading.VAR_RHYTHM << 1;
	public static VAR_ORIGTEXT:number = VariantReading.VAR_PITCH << 1;
	public static VAR_ACCIDENTAL:number = VariantReading.VAR_ORIGTEXT << 1;
	public static VAR_CLEF:number = VariantReading.VAR_ACCIDENTAL << 1;
	public static VAR_LINEEND:number = VariantReading.VAR_CLEF << 1;
	public static VAR_COLORATION:number = VariantReading.VAR_LINEEND << 1;
	public static VAR_LIGATURE:number = VariantReading.VAR_COLORATION << 1;
	public static VAR_MENSSIGN:number = VariantReading.VAR_LIGATURE << 1;
	public static VAR_ERROR:number = VariantReading.VAR_MENSSIGN << 1;
	public static VAR_ALL:number = 0x7fffffff;
	// Long.MAX_VALUE;CHANGE
	public static typeNames:string[]=["Non-substantive","Rhythm","Pitch","Text","Accidental","Clef","Line-break","Coloration","Ligature","Mensuration","Error"];
	/* positioning of inserted event within reading */
	public static NEWVARIANT:number = 0;
	public static BEGINNING:number = 1;
	public static MIDDLE:number = 2;
	public static END:number = 3;
	public static DELETED:number = 4;
	public static COMBINED:number = 5;
	public static NEWREADING:number = 6;
	public static NOACTION:number = 7;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	versions:ArrayList<VariantVersionData>;
	/* list of versions containing
                                             this reading */
	events:EventListData;
	length:Proportion;
	/* length of music of reading */
	sectionNum:number;
	voiceNum:number;
	eventIndex:number;
	/* index of first event in this reading (in default list) */
	error:boolean;

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Methods: int varIndex(long varType)
Purpose: Calculate array index of one variant flag
Parameters:
  Input:  long varType - flag
  Output: -
  Return: index in arrays of variant types
------------------------------------------------------------------------*/
	public static varIndex(varType:number):number
	{
		let i:number = 0;
		switch(<number> varType)
		{
			case 0:
			{
				i = 1;
				break;
			}
			case 1:
			{
				i = 1;
				break;
			}
			default:
			{
				i = 1 + Math.floor(Math.log(varType) / Math.log(2));
			}
		}
		return(( i - 1) | 0);
	}

	/* call "none" and "non-substantive" the same */
	/* log2(varType)+1 */
	/*------------------------------------------------------------------------
Methods: String varTypesToStr(long varTypeFlags)
Purpose: Create string representation of variant types in a set of flags
Parameters:
  Input:  long varTypeFlags - flags
  Output: -
  Return: string
------------------------------------------------------------------------*/
	public static varTypesToStr(varTypeFlags:number):string
	{
		if( varTypeFlags == VariantReading.VAR_NONE || varTypeFlags == VariantReading.VAR_NONSUBSTANTIVE)
			return "Non-substantive";

		let vs:string = "";
		if(( varTypeFlags & VariantReading.VAR_RHYTHM) > 0)
			vs += "Rhythm / ";

		if(( varTypeFlags & VariantReading.VAR_PITCH) > 0)
			vs += "Pitch / ";

		if(( varTypeFlags & VariantReading.VAR_ORIGTEXT) > 0)
			vs += "Text / ";

		if(( varTypeFlags & VariantReading.VAR_CLEF) > 0)
			vs += "Clef / ";

		if(( varTypeFlags & VariantReading.VAR_MENSSIGN) > 0)
			vs += "Mensuration / ";

		if(( varTypeFlags & VariantReading.VAR_ACCIDENTAL) > 0)
			vs += "Accidental / ";

		if(( varTypeFlags & VariantReading.VAR_COLORATION) > 0)
			vs += "Coloration / ";

		if(( varTypeFlags & VariantReading.VAR_LIGATURE) > 0)
			vs += "Ligature / ";

		if(( varTypeFlags & VariantReading.VAR_LINEEND) > 0)
			vs += "Line break / ";

		try
		{
			vs = vs.substring(0,(( vs.length - 3) | 0));
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					vs = "";
				}

			else
				throw e;

		}
		return vs;
	}

	public static new0():VariantReading
	{
		let _new0:VariantReading = new VariantReading;
		VariantReading.set0(_new0);
		return _new0;
	}

	public static set0(new0:VariantReading):void
	{
		new0.versions = new ArrayList<VariantVersionData>();
		new0.events = EventListData.new0();
		new0.error = false;
		new0.length = Proportion.new0(0,1);
	}

	public static new1(sectionNum:number,voiceNum:number,eventIndex:number):VariantReading
	{
		let _new1:VariantReading = new VariantReading;
		VariantReading.set1(_new1,sectionNum,voiceNum,eventIndex);
		return _new1;
	}

	public static set1(new1:VariantReading,sectionNum:number,voiceNum:number,eventIndex:number):void
	{
		new1.versions = new ArrayList<VariantVersionData>();
		new1.events = EventListData.new0();
		new1.error = false;
		new1.length = Proportion.new0(0,1);
		new1.sectionNum = sectionNum;
		new1.voiceNum = voiceNum;
		new1.eventIndex = eventIndex;
	}

	/*------------------------------------------------------------------------
Method:  boolean equals(EventListData el,int i1,int i2)
Purpose: Check whether this reading is identical to another
Parameters:
  Input:  EventListData el - event list to check against this
          int i1,i2        - first and last indices to check
  Output: -
  Return: true if this is equal to the indicated portion of el
------------------------------------------------------------------------*/
	public equals(el:EventListData,i1:number,i2:number):boolean
	{
		if((((( i2 - i1) | 0) + 1) | 0) != this.getNumEvents())
			return false;

		for(
		let i:number = i1;i <= i2;i ++)
		if( ! el.getEvent(i).equals_1(this.getEvent((( i - i1) | 0))))
			return false;

		return true;
	}

	/*------------------------------------------------------------------------
Method:  boolean eventsEqual(VariantReading other)
Purpose: Check whether two readings contain the same event list
Parameters:
  Input:  VariantReading other - reading to compare against this
  Output: -
  Return: true if other has same list of events
------------------------------------------------------------------------*/
	public eventsEqual(other:VariantReading):boolean
	{
		let numEvents:number = this.getNumEvents();
		let otherNumEvents:number = other.getNumEvents();
		if( numEvents != otherNumEvents)
			return false;

		for(
		let i:number = 0;i < numEvents;i ++)
		if( this.getEvent(i) != other.getEvent(i))
			return false;

		return true;
	}

	/*------------------------------------------------------------------------
Method:  void recalcEventParams(Event paramEvent)
Purpose: Recalculate event parameters
Parameters:
  Input:  Event paramEvent - event for starting parameters
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public recalcEventParams(paramEvent:Event):void
	{
		this.events.recalcEventParams_3(paramEvent,paramEvent.getcoloration());
	}

	/*------------------------------------------------------------------------
Methods: long calcVariantTypes(VoiceEventListData v)
Purpose: Calculate which types of variant are present between this reading
         and one other
Parameters:
  Input:  EventListData v - event list for comparison
          int varStarti   - index in list to start looking
  Output: -
  Return: flags representing variation types
------------------------------------------------------------------------*/
	public calcVariantTypes(v:EventListData,varStarti:number):number
	{
		let varFlags:number = VariantReading.VAR_NONE;
		if( this.hasVariantRhythm(v,varStarti))
			varFlags |= VariantReading.VAR_RHYTHM;

		if( this.hasVariantPitch(v,varStarti))
			varFlags |= VariantReading.VAR_PITCH;

		if( this.hasVariantOrigText(v,varStarti))
			varFlags |= VariantReading.VAR_ORIGTEXT;

		if( this.hasVariantAccidental(v,varStarti))
			varFlags |= VariantReading.VAR_ACCIDENTAL;

		if( this.hasVariantClef(v,varStarti))
			varFlags |= VariantReading.VAR_CLEF;

		if( this.hasVariantLineEnd(v,varStarti))
			varFlags |= VariantReading.VAR_LINEEND;

		if( this.hasVariantColoration(v,varStarti))
			varFlags |= VariantReading.VAR_COLORATION;

		if( this.hasVariantLigature(v,varStarti))
			varFlags |= VariantReading.VAR_LIGATURE;

		if( this.hasVariantMensSign(v,varStarti))
			varFlags |= VariantReading.VAR_MENSSIGN;

		if( this.isError())
			varFlags |= VariantReading.VAR_ERROR;

		return varFlags;
	}

	/*------------------------------------------------------------------------
Methods: boolean hasVariant*(EventListData v,int vi)
Purpose: Calculate whether this reading has different rhythm|pitches|etc
         than the reading in another event list
Parameters:
  Input:  EventListData v - event list for comparison
          int vi          - index in list to start looking
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public hasVariantRhythm(v:EventListData,vi:number):boolean
	{
		let i:number = 0;
		let e1:Event = null;
		let e2:Event = null;
		let mt1:Proportion = Proportion.new0(0,1);
		let mt2:Proportion = Proportion.new0(0,1);
		do
		{
			e1 = this.getVarEvent(this.events,i);
			while( e1 != null && e1.rhythmicEventType_1() != Event.EVENT_NOTE)
			{
				mt1.add(e1.calcProportionalMusicLength());
				e1 = this.getVarEvent(this.events,++ i);
			}
			e2 = this.getVarEvent(v,vi);
			while( e2 != null && e2.rhythmicEventType_1() != Event.EVENT_NOTE)
			{
				mt2.add(e2.calcProportionalMusicLength());
				e2 = this.getVarEvent(v,++ vi);
			}
			if( ! mt1.equals(mt2))
				return true;

			if( e1 != null && e2 != null && ! e1.calcProportionalMusicLength().equals(e2.calcProportionalMusicLength()))
				return true;

			if( e1 != null)
				{
					mt1.add(e1.calcProportionalMusicLength());
					i ++;
				}

			if( e2 != null)
				{
					mt2.add(e2.calcProportionalMusicLength());
					vi ++;
				}

			if( ! mt1.equals(mt2))
				return true;

		}
		while( e1 != null && e2 != null);
		e1 = this.getVarEvent(this.events,i);
		e2 = this.getVarEvent(v,vi);
		if( e1 == null)
			if( e2 == null)
				return false;
			else
				while( e2 != null)
				{
					if( e2.getmusictime().i1 != 0)
						return true;

					e2 = this.getVarEvent(v,++ vi);
				}


		else
			while( e1 != null)
			{
				if( e1.getmusictime().i1 != 0)
					return true;

				e1 = this.getVarEvent(this.events,++ i);
			}

		return false;
	}

	/* find position of next note in each list */
	/* differing rest arrangements (e.g. B vs. SB SB) are NOT rhythmic variants */
	/* differing rest lengths? */
	/* differing note lengths? */
	/* are voices in the same place after adding the previous note(s)? */
	/* at least 1 list is finished; check that the other doesn't have any
       further rhythms */
	public hasVariantPitch(v:EventListData,vi:number):boolean
	{
		let i:number = 0;
		let e1:Event = null;
		let e2:Event = null;
		let pe1:Event = null;
		let pe2:Event = null;
		do
		{
			e1 = this.getVarEvent(this.events,i);
			while( e1 != null && ! e1.hasEventType_1(Event.EVENT_NOTE))
			e1 = this.getVarEvent(this.events,++ i);
			e2 = this.getVarEvent(v,vi);
			while( e2 != null && ! e2.hasEventType_1(Event.EVENT_NOTE))
			e2 = this.getVarEvent(v,++ vi);
			if( e1 != null)
				{
					pe1 = e1;
					e1 = this.getVarEvent(this.events,++ i);
					let done:boolean = e1 == null;
					while( ! done)
					if( e1.hasEventType_1(Event.EVENT_NOTE) && ! e1.notePitchMatches_1(pe1))
						done = true;
					else
						done =( e1 = this.getVarEvent(this.events,++ i)) == null;

					if( e1 != null)
						i --;

				}

			if( e2 != null)
				{
					pe2 = e2;
					e2 = this.getVarEvent(v,++ vi);
					let done:boolean = e2 == null;
					while( ! done)
					if( e2.hasEventType_1(Event.EVENT_NOTE) && ! e2.notePitchMatches_1(pe2))
						done = true;
					else
						done =( e2 = this.getVarEvent(v,++ vi)) == null;

					if( e2 != null)
						vi --;

				}

			if(( pe1 == null) !=( pe2 == null))
				return true;

			if( pe1 == null)
				return false;

			if( ! pe1.notePitchMatches_1(pe2))
				return true;

			if( e1 != null)
				i ++;

			if( e2 != null)
				vi ++;

		}
		while( e1 != null || e2 != null);
		return false;
	}

	/* events with pitch info */
	/* find position of next note in each list */
	/* skip to following notes if pitches are repeated */
	/* found next non-matching pitch? */
	/* found next non-matching pitch? */
	/* extra pitch(es) in one? */
	/* no pitches left in either? */
	/* different pitches? */
	public hasVariantOrigText(v:EventListData,vi:number):boolean
	{
		let i:number = 0;
		let e1:Event = null;
		let e2:Event = null;
		let mt1:Proportion = Proportion.new0(0,1);
		let mt2:Proportion = Proportion.new0(0,1);
		do
		{
			e1 = this.getVarEvent(this.events,i);
			while( e1 != null && ! e1.hasEventType_1(Event.EVENT_ORIGINALTEXT))
			{
				mt1.add(e1.getmusictime());
				e1 = this.getVarEvent(this.events,++ i);
			}
			e2 = this.getVarEvent(v,vi);
			while( e2 != null && ! e2.hasEventType_1(Event.EVENT_ORIGINALTEXT))
			{
				mt2.add(e2.getmusictime());
				e2 = this.getVarEvent(v,++ vi);
			}
			if(( e1 == null) !=( e2 == null))
				return true;

			if( e1 == null)
				return false;

			if( !((<OriginalTextEvent> e1).getText() ==(<OriginalTextEvent> e2).getText()))
				return true;

			if( ! mt1.equals(mt2))
				return true;

			if( e1 != null)
				i ++;

			if( e2 != null)
				vi ++;

		}
		while( e1 != null || e2 != null);
		return false;
	}

	/* find position of next text event in each list */
	/* text in one but not the other? */
	/* no text in either? */
	/* same text? */
	/* different positioning? */
	public hasVariantAccidental(v:EventListData,vi:number):boolean
	{
		let i:number = 0;
		let e1:Event = null;
		let e2:Event = null;
		let mt1:Proportion = Proportion.new0(0,1);
		let mt2:Proportion = Proportion.new0(0,1);
		e2 = this.getVarEvent(v,vi);
		let mainClefEvent:Event = e2 == null ? v.getEvent((( vi - 1) | 0)).getClefInfoEvent():e2.getClefInfoEvent();
		let mainClefSet:ClefSet = mainClefEvent == null ? null:mainClefEvent.getClefSet_1();
		let fullClefs:boolean = this.hasVariantLineEnd(v,vi) || vi == 0 || mainClefSet == null || v.getEvent((( vi - 1) | 0)).getClefInfoEvent() == null ||( e2 != null && e2.hasPrincipalClef_1());
		do
		{
			e1 = this.getVarEvent(this.events,i);
			while( e1 != null && ! e1.hasAccidentalClef_1())
			{
				mt1.add(e1.getmusictime());
				e1 = this.getVarEvent(this.events,++ i);
			}
			e2 = this.getVarEvent(v,vi);
			while( e2 != null && ! e2.hasAccidentalClef_1())
			{
				mt2.add(e2.getmusictime());
				e2 = this.getVarEvent(v,++ vi);
			}
			let e1NewSig:boolean = false;
			let e2NewSig:boolean = false;
			if( mainClefSet != null)
				{
					if( e1 != null)
						e1NewSig = e1.getClefSet_1().sigContradicts(mainClefSet);

					if( e2 != null)
						e2NewSig = e2.getClefSet_1().sigContradicts(mainClefSet);

				}

			if(( e1 == null) !=( e2 == null))
				{
					if( ! fullClefs)
						return true;
					else
						if( e1NewSig || e2NewSig)
							return true;

				}

			else
				if( e1 == null)
					return false;
				else
					{
						if( e1.getClefSet_1().sigContradicts(e2.getClefSet_1()))
							return true;

						if( ! fullClefs)
							{
								if( ! mt1.equals(mt2))
									return true;

							}

					}

			if( e1 != null)
				i ++;

			if( e2 != null)
				vi ++;

		}
		while( e1 != null || e2 != null);
		return false;
	}

	//System.out.println("HVA vi="+vi);
	//System.out.println("    mce="+mainClefEvent);
	//System.out.println("fullClefs="+fullClefs);
	/* find position of next accidental in each list */
	//System.out.println("HVA1");
	/* does either event change the key sig? */
	/*        if (mainClefEvent==null)
          {
            e1NewSig=e1!=null;
            e2NewSig=e2!=null;
          }
        else*/
	/* accidental in one but not the other? */
	/* no accidental in either? */
	/* two clefs; same? */
	/* different positioning? (if both are clef+sig, doesn't matter) */
	public hasVariantClef(v:EventListData,vi:number):boolean
	{
		let i:number = 0;
		let e1:Event = null;
		let e2:Event = null;
		let mt1:Proportion = Proportion.new0(0,1);
		let mt2:Proportion = Proportion.new0(0,1);
		do
		{
			e1 = this.getVarEvent(this.events,i);
			while( e1 != null && ! e1.hasPrincipalClef_1())
			{
				mt1.add(e1.getmusictime());
				e1 = this.getVarEvent(this.events,++ i);
			}
			e2 = this.getVarEvent(v,vi);
			while( e2 != null && ! e2.hasPrincipalClef_1())
			{
				mt2.add(e2.getmusictime());
				e2 = this.getVarEvent(v,++ vi);
			}
			if(( e1 == null) !=( e2 == null))
				return true;

			if( e1 == null)
				return false;

			if( e1.getClefSet_1().contradicts_2(e2.getClefSet_1(),false,null))
				return true;

			if( ! mt1.equals(mt2))
				return true;

			if( e1 != null)
				i ++;

			if( e2 != null)
				vi ++;

		}
		while( e1 != null || e2 != null);
		return false;
	}

	/* find position of next (principal) clef in each list */
	/* clef in one but not the other? */
	/* no clef in either? */
	/* same clefs? */
	/* different positioning? */
	public hasVariantMensSign(v:EventListData,vi:number):boolean
	{
		let i:number = 0;
		let e1:Event = null;
		let e2:Event = null;
		let mt1:Proportion = Proportion.new0(0,1);
		let mt2:Proportion = Proportion.new0(0,1);
		do
		{
			e1 = this.getVarEvent(this.events,i);
			while( e1 != null && ! e1.hasEventType_1(Event.EVENT_MENS))
			{
				mt1.add(e1.getmusictime());
				e1 = this.getVarEvent(this.events,++ i);
			}
			e2 = this.getVarEvent(v,vi);
			while( e2 != null && ! e2.hasEventType_1(Event.EVENT_MENS))
			{
				mt2.add(e2.getmusictime());
				e2 = this.getVarEvent(v,++ vi);
			}
			if(( e1 == null) !=( e2 == null))
				return true;

			if( e1 == null)
				return false;

			let me1:MensEvent =<MensEvent>( e1.getFirstEventOfType_1(Event.EVENT_MENS));
			let me2:MensEvent =<MensEvent>( e2.getFirstEventOfType_1(Event.EVENT_MENS));
			if( ! me1.getMensInfo_1().equals(me2.getMensInfo_1()) || ! me1.signEquals(me2))
				return true;

			if( ! mt1.equals(mt2))
				return true;

			if( e1 != null)
				i ++;

			if( e2 != null)
				vi ++;

		}
		while( e1 != null || e2 != null);
		return false;
	}

	/* find position of next mensuration change in each list */
	/* mensuration in one but not the other? */
	/* no mensuration in either? */
	/* same mensurations and signs? */
	/* different positioning? */
	public hasVariantLigature(v:EventListData,vi:number):boolean
	{
		let i:number = 0;
		let e1:Event = null;
		let e2:Event = null;
		let mt1:Proportion = Proportion.new0(0,1);
		let mt2:Proportion = Proportion.new0(0,1);
		do
		{
			let lne1:NoteEvent = null;
			let lne2:NoteEvent = null;
			e1 = this.getVarEvent(this.events,i);
			while( e1 != null && lne1 == null)
			{
				lne1 =<NoteEvent>( e1.getFirstEventOfType_1(Event.EVENT_NOTE));
				if( lne1 != null && ! lne1.isligated())
					lne1 = null;

				if( lne1 == null)
					{
						mt1.add(e1.getmusictime());
						e1 = this.getVarEvent(this.events,++ i);
					}

			}
			e2 = this.getVarEvent(v,vi);
			while( e2 != null && lne2 == null)
			{
				lne2 =<NoteEvent>( e2.getFirstEventOfType_1(Event.EVENT_NOTE));
				if( lne2 != null && ! lne2.isligated())
					lne2 = null;

				if( lne2 == null)
					{
						mt2.add(e2.getmusictime());
						e2 = this.getVarEvent(v,++ vi);
					}

			}
			if(( e1 == null) !=( e2 == null))
				return true;

			if( e1 == null)
				return false;

			if( ! mt1.equals(mt2))
				return true;

			let doneLigCheck:boolean = false;
			while( ! doneLigCheck)
			{
				if( lne1.getnotetype_1() != lne2.getnotetype_1() || lne1.getligtype() != lne2.getligtype())
					return true;

				if( lne1.getligtype() == NoteEvent.LIG_NONE)
					doneLigCheck = true;
				else
					{
						mt1.add(e1.getmusictime());
						mt2.add(e2.getmusictime());
						e1 = this.getVarEvent(this.events,++ i);
						while( e1 != null && ! e1.hasEventType_1(Event.EVENT_NOTE))
						{
							mt1.add(e1.getmusictime());
							e1 = this.getVarEvent(this.events,++ i);
						}
						e2 = this.getVarEvent(v,++ vi);
						while( e2 != null && ! e2.hasEventType_1(Event.EVENT_NOTE))
						{
							mt2.add(e2.getmusictime());
							e2 = this.getVarEvent(v,++ vi);
						}
						lne1 = e1 == null ? null:<NoteEvent>( e1.getFirstEventOfType_1(Event.EVENT_NOTE));
						lne2 = e2 == null ? null:<NoteEvent>( e2.getFirstEventOfType_1(Event.EVENT_NOTE));
						if(( e1 == null) !=( e2 == null))
							return true;

						if( e1 == null)
							return false;

					}

			}
			if( e1 != null)
				i ++;

			if( e2 != null)
				vi ++;

		}
		while( e1 != null || e2 != null);
		return false;
	}

	/* find position of next ligature in each list */
	/* ligature in one but not the other? */
	/* no ligature in either? */
	/* different positioning? */
	/* now check that entire ligature matches */
	/* same ligature type at each note? */
	/* yes, now get next note of ligature */
	public hasVariantLineEnd(v:EventListData,vi:number):boolean
	{
		let i:number = 0;
		let e1:Event = null;
		let e2:Event = null;
		let mt1:Proportion = Proportion.new0(0,1);
		let mt2:Proportion = Proportion.new0(0,1);
		do
		{
			e1 = this.getVarEvent(this.events,i);
			while( e1 != null && e1.geteventtype() != Event.EVENT_LINEEND)
			{
				mt1.add(e1.getmusictime());
				e1 = this.getVarEvent(this.events,++ i);
			}
			e2 = this.getVarEvent(v,vi);
			while( e2 != null && e2.geteventtype() != Event.EVENT_LINEEND)
			{
				mt2.add(e2.getmusictime());
				e2 = this.getVarEvent(v,++ vi);
			}
			if( e1 != null && e2 != null && ! mt1.equals(mt2))
				return true;

			if(( e1 == null) !=( e2 == null))
				return true;

			if( e1 != null)
				i ++;

			if( e2 != null)
				vi ++;

		}
		while( e1 != null && e2 != null);
		e1 = this.getVarEvent(this.events,i);
		e2 = this.getVarEvent(v,vi);
		if( e1 == null)
			if( e2 == null)
				return false;
			else
				while( e2 != null)
				{
					if( e2.geteventtype() == Event.EVENT_LINEEND)
						return true;

					e2 = this.getVarEvent(v,++ vi);
				}


		else
			while( e1 != null)
			{
				if( e1.geteventtype() == Event.EVENT_LINEEND)
					return true;

				e1 = this.getVarEvent(this.events,++ i);
			}

		return false;
	}

	/* find position of next line end in each list */
	/* differing position of line ends? */
	/* one has line end and the other doesn't? */
	/* at least 1 list is finished; check that the other doesn't have any
       further line ends */
	public hasVariantColoration(v:EventListData,vi:number):boolean
	{
		let i:number = 0;
		let e1:Event = null;
		let e2:Event = null;
		let mt1:Proportion = Proportion.new0(0,1);
		let mt2:Proportion = Proportion.new0(0,1);
		e1 = this.getVarEvent(this.events,i);
		e2 = this.getVarEvent(v,vi);
		if( e1 == null || e2 == null)
			return false;

		do
		{
			let nextE1T:Proportion = Proportion.sum(mt1,e1.getmusictime());
			while( nextE1T.greaterThan(mt2))
			{
				if( mt2.equals(mt1) && e2.hasVariantColoration(e1))
					return true;

				mt2.add(e2.getmusictime());
				e2 = this.getVarEvent(v,++ vi);
				if( e2 == null)
					return false;

			}
			let nextE2T:Proportion = Proportion.sum(mt2,e2.getmusictime());
			while( nextE2T.greaterThan(mt1))
			{
				if( mt2.equals(mt1) && e2.hasVariantColoration(e1))
					return true;

				mt1.add(e1.getmusictime());
				e1 = this.getVarEvent(this.events,++ i);
				if( e1 == null)
					return false;

			}
			if( mt1.equals(mt2) && nextE1T.equals(nextE2T))
				{
					if( e2.hasVariantColoration(e1))
						return true;

					mt1.add(e1.getmusictime());
					e1 = this.getVarEvent(this.events,++ i);
					mt2.add(e2.getmusictime());
					e2 = this.getVarEvent(v,++ vi);
				}

		}
		while( e1 != null && e2 != null);
		return false;
	}

	/* is either list empty? if so, no coloration variant */
	/* at least 1 list is finished; no coloration variant */
	getVarEvent(el:EventListData,i:number):Event
	{
		if( i >= el.getNumEvents())
			return null;

		let e:Event = el.getEvent(i);
		if( e.geteventtype() == Event.EVENT_VARIANTDATA_END)
			return null;

		return e;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getEvent(i:number):Event
	{
		return this.events.getEvent(i);
	}

	public getEvents():EventListData
	{
		return this.events;
	}

	public getEventIndex():number
	{
		return this.eventIndex;
	}

	public getLength():Proportion
	{
		return this.length;
	}

	public getNumEvents():number
	{
		return this.events.getNumEvents();
	}

	public getSectionNum():number
	{
		return this.sectionNum;
	}

	public getVersion(vi:number):VariantVersionData
	{
		return this.versions.get(vi);
	}

	public getVersions():ArrayList<VariantVersionData>
	{
		return this.versions;
	}

	public getVoiceNum():number
	{
		return this.voiceNum;
	}

	public includesVersion(v:VariantVersionData):boolean
	{
		return this.versions.contains(v);
	}

	public isError():boolean
	{
		return this.error;
	}

	/*------------------------------------------------------------------------
Methods: void add*()
Purpose: Routines to add elements (events, event lists, versions)
Parameters:
  Input:  new elements, indices
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addEvent_1(e:Event):void
	{
		this.addEvent_2(this.events.getNumEvents(),e);
	}

	public addEvent_2(i:number,e:Event):void
	{
		e.setVariantReading(this);
		this.events.addEvent_2(i,e);
		this.length.add(e.getmusictime());
	}

	public addEventList_1(el:EventListData):void
	{
		let numEvents:number = el.getNumEvents();
		for(
		let ei:number = 0;ei < numEvents;ei ++)
		this.addEvent_1(el.getEvent(ei).createCopy_1());
	}

	public addEventList_2(other:VariantReading):void
	{
		for(
		let i:number = 0;i < other.getNumEvents();i ++)
		this.addEvent_1(other.getEvent(i).createCopy_1());
	}

	public addVersion(v:VariantVersionData):void
	{
		if( ! this.includesVersion(v))
			this.versions.add(v);

	}

	/*------------------------------------------------------------------------
Methods: void delete*()
Purpose: Routines to delete elements (events, event lists, versions)
Parameters:
  Input:  indices/elements to delete
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public deleteEvent_1(i:number):void
	{
		this.deleteEvent_2(this.events.getEvent(i));
	}

	public deleteEvent_2(e:Event):void
	{
		this.events.deleteEvent_2(e);
		this.length.subtract(e.getmusictime());
	}

	public deleteVersion(v:VariantVersionData):void
	{
		this.versions.remove(v);
	}

	/* remove one version into a new reading */
	public separateVersion(versionToSeparate:VariantVersionData):VariantReading
	{
		let newReading:VariantReading = VariantReading.new1(this.sectionNum,this.voiceNum,this.eventIndex);
		newReading.error = this.error;
		newReading.addVersion(versionToSeparate);
		for(
		let i:number = 0;i < this.getNumEvents();i ++)
		newReading.addEvent_1(this.getEvent(i).createCopy_1());
		this.deleteVersion(versionToSeparate);
		return newReading;
	}

	/* copy events */
	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setError(error:boolean):void
	{
		this.error = error;
	}

	/*------------------------------------------------------------------------
Method:  String toString()
Purpose: Convert to string
Parameters:
  Input:  -
  Output: -
  Return: string representation of structure
------------------------------------------------------------------------*/
	public prettyprint():void
	{
		System.out.println("Variant events:");
		for(
		let i:number = 0;i < this.getNumEvents();i ++)
		this.getEvent(i).prettyprint_1();
		System.out.println("End variant");
	}

	public toString():string
	{
		let ret:string = "VR: ";
		for(let vvd of this.getVersions())
		ret += vvd.getID() + " ";
		return ret;
	}
}
