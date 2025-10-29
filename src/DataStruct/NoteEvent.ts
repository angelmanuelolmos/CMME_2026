
import { System } from '../java/lang/System';
import { Proportion } from './Proportion';
import { Pitch } from './Pitch';
import { ModernAccidental } from './ModernAccidental';
import { Mensuration } from './Mensuration';
import { Event } from './Event';
import { Coloration } from './Coloration';
import { LinkedList } from '../java/util/LinkedList';

export class NoteEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static NT_Semifusa:number = 0;
	public static NT_Fusa:number = 1;
	public static NT_Semiminima:number = 2;
	public static NT_Minima:number = 3;
	//NT_Semibrevis=4,//Event.NT_Semibrevis,
	//  NT_Brevis=    5,//Event.NT_Brevis,
	//  NT_Longa=     6,//Event.NT_Longa,
	//  NT_Maxima=    7,//Event.NT_Maxima,
	public static NT_Flagged:number = 8;
	public static NT_Quarter:number = 9;
	public static NT_Half:number = 10;
	public static NT_Whole:number = 11;
	public static NT_DoubleWhole:number = 12;
	public static NT_ModernChant:number = 13;
	public static NoteTypeNames:string[]=["Semifusa","Fusa","Semiminima","Minima","Semibrevis","Brevis","Longa","Maxima","Modern Flagged Note","Quarter note","Half note","Whole note","Double whole note","UNKNOWN"];
	public static DefaultLengths:Proportion[]=[Proportion.new0(1,8),Proportion.new0(1,4),Proportion.new0(1,2),Proportion.new0(1,1),Proportion.new0(2,1),Proportion.new0(4,1),Proportion.new0(8,1),Proportion.new0(16,1)];
	public static LIG_NONE:number = 0;
	public static LIG_RECTA:number = 1;
	public static LIG_OBLIQUA:number = 2;
	public static LigTypeNames:string[]=["XXX","Recta","Obliqua"];
	public static TIE_NONE:number = 0;
	public static TIE_OVER:number = 1;
	public static TIE_UNDER:number = 2;
	public static TieTypeNames:string[]=["XXX","Over","Under"];
	public static STEM_NONE:number = - 1;
	public static STEM_UP:number = 0;
	public static STEM_DOWN:number = 1;
	public static STEM_LEFT:number = 2;
	public static STEM_RIGHT:number = 3;
	public static STEM_BARLINE:number = 4;
	public static StemDirs:string[]=["Up","Down","Left","Right","Barline"];
	public static NOTEHEADSTYLE_BREVE:number = 0;
	public static NOTEHEADSTYLE_SEMIBREVE:number = 1;
	public static NOTEHEADSTYLE_FULLBREVE:number = 2;
	public static NOTEHEADSTYLE_FULLSEMIBREVE:number = 3;
	public static NOTEHEADSTYLE_MAXIMA:number = 4;
	public static NOTEHEADSTYLE_FULLMAXIMA:number = 5;
	public static NOTEHEADSTYLE_FULLVOID_BREVE:number = 6;
	public static NOTEHEADSTYLE_VOIDFULL_BREVE:number = 7;
	public static NOTEHEADSTYLE_FULLVOID_MAXIMA:number = 8;
	public static NOTEHEADSTYLE_VOIDFULL_MAXIMA:number = 9;
	public static NOTEHEADSTYLE_MODERN_BREVE:number = 30;
	public static NOTEHEADSTYLE_MODERN_SEMIBREVE:number = 31;
	public static NOTEHEADSTYLE_MODERN_MINIM_UP:number = 32;
	public static NOTEHEADSTYLE_MODERN_CROTCHET_UP:number = 33;
	public static NOTEHEADSTYLE_MODERN_MINIM_DOWN:number = 34;
	public static NOTEHEADSTYLE_MODERN_CROTCHET_DOWN:number = 35;
	public static NOTEHEADSTYLE_MODERN_STEMLESS_CHANT:number = 36;
	public static HALFCOLORATION_NONE:number = 0;
	public static HALFCOLORATION_PRIMARYSECONDARY:number = 1;
	public static HALFCOLORATION_SECONDARYPRIMARY:number = 2;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	notetype:number;
	length:Proportion;
	pitch:Pitch;
	pitchOffset:ModernAccidental;
	noteheadstyle:number;
	halfColoration:number;
	stemdir:number;
	stemside:number;
	ligstatus:number;
	tieType:number;
	numFlags:number;
	wordEnd:boolean;
	modernDot:boolean;
	_displayAccidental:boolean;
	modernText:string;
	modernTextEditorial:boolean;

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  int strtoNT(String nt)
Purpose: Convert string to note type number
Parameters:
  Input:  String nt - string to convert
  Output: -
  Return: note type number
------------------------------------------------------------------------*/
	public static strtoNT(nt:string):number
	{
		let i:number;
		for(
		i = 0;i < NoteEvent.NoteTypeNames.length;i ++)
		if(( nt == NoteEvent.NoteTypeNames[i]))
			return i;

		if( i == NoteEvent.NoteTypeNames.length)
			i =(( NoteEvent.NoteTypeNames.length - 1) | 0);

		return i;
	}

	public static lenToNT(len:Proportion):number
	{
		let nt:number = 0;
		for(let dl of NoteEvent.DefaultLengths)
		if( dl.greaterThan(len))
			return nt > 0 ?(( nt - 1) | 0):0;
		else
			nt ++;

		return(( NoteEvent.DefaultLengths.length - 1) | 0);
	}

	/*------------------------------------------------------------------------
Method:  int strtoStemDir(String s)
Purpose: Convert string to stem direction number
Parameters:
  Input:  String s - string to convert
  Output: -
  Return: stem dir number
------------------------------------------------------------------------*/
	public static strtoStemDir(s:string):number
	{
		for(
		let i:number = 0;i < NoteEvent.StemDirs.length;i ++)
		if(( s == NoteEvent.StemDirs[i]))
			return i;

		return - 1;
	}

	/*------------------------------------------------------------------------
Method:  Proportion getTypeLength(int nt,Mensuration mensinfo)
Purpose: Calculate length of note type (perfect and unaltered when applicable)
Parameters:
  Input:  int nt               - note type
          Mensuration mensinfo - mensuration information
  Output: -
  Return: length as proportion
------------------------------------------------------------------------*/
	public static getTypeLength(nt:number,mensinfo:Mensuration):Proportion
	{
		let i1:number = 0;
		let i2:number = 0;
		switch( nt)
		{
			case NoteEvent.NT_Semifusa:
			{
				i1 = 1;
				i2 = 8;
				break;
			}
			case NoteEvent.NT_Fusa:
			{
				i1 = 1;
				i2 = 4;
				break;
			}
			case NoteEvent.NT_Semiminima:
			{
				i1 = 1;
				i2 = 2;
				break;
			}
			case NoteEvent.NT_Minima:
			{
				i1 = 1;
				i2 = 1;
				break;
			}
			case NoteEvent.NT_Semibrevis:
			{
				i1 = mensinfo.prolatio;
				i2 = 1;
				break;
			}
			case NoteEvent.NT_Brevis:
			{
				i1 =(( mensinfo.tempus * mensinfo.prolatio) | 0);
				i2 = 1;
				break;
			}
			case NoteEvent.NT_Longa:
			{
				i1 =(((( mensinfo.modus_minor * mensinfo.tempus) | 0) * mensinfo.prolatio) | 0);
				i2 = 1;
				break;
			}
			case NoteEvent.NT_Maxima:
			{
				i1 =(((((( mensinfo.modus_maior * mensinfo.modus_minor) | 0) * mensinfo.tempus) | 0) * mensinfo.prolatio) | 0);
				i2 = 1;
				break;
			}
		}
		return Proportion.new0(i1,i2);
	}

	/*------------------------------------------------------------------------
Method:  int oppositefill(int nhs)
Purpose: Calculate notehead with opposite fill type (void/full)
Parameters:
  Input:  int nhs - notehead style
  Output: -
  Return: opposite-fill notehead style
------------------------------------------------------------------------*/
	public static oppositefill(nhs:number):number
	{
		switch( nhs)
		{
			case NoteEvent.NOTEHEADSTYLE_BREVE:
			{
				return NoteEvent.NOTEHEADSTYLE_FULLBREVE;
			}
			case NoteEvent.NOTEHEADSTYLE_SEMIBREVE:
			{
				return NoteEvent.NOTEHEADSTYLE_FULLSEMIBREVE;
			}
			case NoteEvent.NOTEHEADSTYLE_MAXIMA:
			{
				return NoteEvent.NOTEHEADSTYLE_FULLMAXIMA;
			}
			case NoteEvent.NOTEHEADSTYLE_FULLBREVE:
			{
				return NoteEvent.NOTEHEADSTYLE_BREVE;
			}
			case NoteEvent.NOTEHEADSTYLE_FULLSEMIBREVE:
			{
				return NoteEvent.NOTEHEADSTYLE_SEMIBREVE;
			}
			case NoteEvent.NOTEHEADSTYLE_FULLMAXIMA:
			{
				return NoteEvent.NOTEHEADSTYLE_MAXIMA;
			}
			case NoteEvent.NOTEHEADSTYLE_FULLVOID_BREVE:
			{
				return NoteEvent.NOTEHEADSTYLE_VOIDFULL_BREVE;
			}
			case NoteEvent.NOTEHEADSTYLE_VOIDFULL_BREVE:
			{
				return NoteEvent.NOTEHEADSTYLE_FULLVOID_BREVE;
			}
			case NoteEvent.NOTEHEADSTYLE_FULLVOID_MAXIMA:
			{
				return NoteEvent.NOTEHEADSTYLE_VOIDFULL_MAXIMA;
			}
			case NoteEvent.NOTEHEADSTYLE_VOIDFULL_MAXIMA:
			{
				return NoteEvent.NOTEHEADSTYLE_FULLVOID_MAXIMA;
			}
		}
		return - 1;
	}

	public static new24(nt:number,len:Proportion,p:Pitch,po:ModernAccidental,l:number,c:boolean,hc:number,sd:number,ss:number,f:number,mt:string,we:boolean,modernTextEditorial:boolean,tieType:number):NoteEvent
	{
		let _new24:NoteEvent = new NoteEvent;
		NoteEvent.set24(_new24,nt,len,p,po,l,c,hc,sd,ss,f,mt,we,modernTextEditorial,tieType);
		return _new24;
	}

	public static set24(new24:NoteEvent,nt:number,len:Proportion,p:Pitch,po:ModernAccidental,l:number,c:boolean,hc:number,sd:number,ss:number,f:number,mt:string,we:boolean,modernTextEditorial:boolean,tieType:number):void
	{
		Event.set0(new24);
		new24.eventtype = NoteEvent.EVENT_NOTE;
		new24.notetype = nt;
		new24.length =( new24.musictime = len == null ? null:Proportion.new1(len));
		new24.pitch = p;
		new24.pitchOffset = po;
		new24.stemdir = NoteEvent.STEM_UP;
		new24.stemside = NoteEvent.STEM_NONE;
		new24.ligstatus = l;
		new24.colored = c;
		new24.halfColoration = hc;
		new24.numFlags = f;
		if( sd != NoteEvent.STEM_NONE)
			{
				new24.stemdir = sd;
				new24.stemside = ss;
			}

		new24.selectNoteheadStyle();
		new24.modernText = mt;
		new24.wordEnd = we;
		new24.modernTextEditorial = modernTextEditorial;
		new24.tieType = tieType;
		new24.modernDot = false;
		new24._displayAccidental = true;
	}

	public static new25(nt:string,len:Proportion,p:Pitch,po:ModernAccidental,l:number,c:boolean,hc:number,sd:number,ss:number,f:number,mt:string,we:boolean,mte:boolean,tt:number):NoteEvent
	{
		let _new25:NoteEvent = new NoteEvent;
		NoteEvent.set25(_new25,nt,len,p,po,l,c,hc,sd,ss,f,mt,we,mte,tt);
		return _new25;
	}

	public static set25(new25:NoteEvent,nt:string,len:Proportion,p:Pitch,po:ModernAccidental,l:number,c:boolean,hc:number,sd:number,ss:number,f:number,mt:string,we:boolean,mte:boolean,tt:number):void
	{
		NoteEvent.set24(new25,NoteEvent.strtoNT(nt),len,p,po,l,c,hc,sd,ss,f,mt,we,mte,tt);
	}

	public static new26(nt:string,len:Proportion,p:Pitch,po:ModernAccidental,l:number,c:boolean,hc:number,sd:number,ss:number,f:number,mt:string):NoteEvent
	{
		let _new26:NoteEvent = new NoteEvent;
		NoteEvent.set26(_new26,nt,len,p,po,l,c,hc,sd,ss,f,mt);
		return _new26;
	}

	public static set26(new26:NoteEvent,nt:string,len:Proportion,p:Pitch,po:ModernAccidental,l:number,c:boolean,hc:number,sd:number,ss:number,f:number,mt:string):void
	{
		NoteEvent.set25(new26,nt,len,p,po,l,c,hc,sd,ss,f,mt,false,false,NoteEvent.TIE_NONE);
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
		let e:Event = NoteEvent.new24(this.notetype,this.length,Pitch.new3(this.pitch),ModernAccidental.new4(this.pitchOffset),this.ligstatus,this.colored,this.halfColoration,this.stemdir,this.stemside,this.numFlags,this.modernText == null ? null:this.modernText,this.wordEnd,this.modernTextEditorial,this.tieType);
		e.copyEventAttributes_1(this);
		return e;
	}

	public copyEventAttributes_1(other:Event):void
	{
		super.copyEventAttributes_1(other);
		let ne:NoteEvent =<NoteEvent> other;
		this.modernDot = ne.modernDot;
		this._displayAccidental = ne._displayAccidental;
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
		let el:LinkedList<Event> = new LinkedList<Event>();
		let ne:NoteEvent =<NoteEvent>( this.createCopy_1());
		if( this.length == null)
			{
				ne.notetype = NoteEvent.NT_ModernChant;
				ne.selectNoteheadStyle();
				el.add(ne);
				return el;
			}

		if( useTies)
			{
				timePos = Proportion.new1(timePos);
				let noPropTimePos:Proportion = Proportion.new1(timePos);
				measurePos = Proportion.new1(measurePos);
				let mensInfo:Mensuration = this.getBaseMensInfo();
				let noteTime:Proportion = Proportion.quotient(this.length,timeProp);
				let measureLength:Proportion = Proportion.new0((( measureMinims * measureProp.i2) | 0),measureProp.i1);
				let endMeasurePos:Proportion = Proportion.sum(measurePos,measureLength);
				let noPropEndMeasurePos:Proportion = Proportion.new0((( measurePos.i1 + measureMinims) | 0),measurePos.i2);
				if( ! measureProp.equals(mensInfo.tempoChange))
					{
						noPropEndMeasurePos = Proportion.sum(measurePos,Proportion.new0((((( measureMinims * measureProp.i2) | 0) * mensInfo.tempoChange.i1) | 0),(( measureProp.i1 * mensInfo.tempoChange.i2) | 0)));
					}

				while( noteTime.i1 > 0)
				{
					if( ne.getLength_1().i1 == 0)
						break;

					let noPropTimeLeftInMeasure:Proportion = Proportion.product(Proportion.difference(endMeasurePos,timePos),mensInfo.tempoChange);
					ne.calcModernNoteTypeAndLength(noteTime,timeProp,noPropTimeLeftInMeasure,Mensuration.DEFAULT_MENSURATION);
					el.add(ne);
					timePos.add(Proportion.quotient(ne.getLength_1(),mensInfo.tempoChange));
					noPropTimePos.add(ne.getLength_1());
					noteTime.subtract(ne.getLength_1());
					if( timePos.greaterThanOrEqualTo(endMeasurePos))
						{
							measurePos.i1 += measureMinims;
							endMeasurePos.add(measureLength);
						}

					ne = ne.makeNextTiedNote();
				}
			}

		else
			{
				let newNoteType:number = NoteEvent.NT_DoubleWhole;
				switch( ne.notetype)
				{
					case NoteEvent.NT_Semibrevis:
					{
						newNoteType = NoteEvent.NT_Whole;
						break;
					}
					case NoteEvent.NT_Minima:
					{
						newNoteType = NoteEvent.NT_Half;
						break;
					}
					case NoteEvent.NT_Semiminima:
					{
						newNoteType = NoteEvent.NT_Quarter;
						break;
					}
					case NoteEvent.NT_Fusa:
					{
					}
					case NoteEvent.NT_Semifusa:
					{
						newNoteType = NoteEvent.NT_Flagged;
						break;
					}
				}
				ne.notetype = newNoteType;
				ne.colored = false;
				ne.halfColoration = NoteEvent.HALFCOLORATION_NONE;
				ne.colorscheme = Coloration.DEFAULT_COLORATION;
				ne.selectNoteheadStyle();
				el.add(ne);
			}

		return el;
	}

	/* chant */
	//        ne.colored=false; ne.halfColoration=HALFCOLORATION_NONE;
	//        ne.colorscheme=Coloration.DEFAULT_COLORATION;
	//Mensuration.DEFAULT_MENSURATION;
	//if (!mensInfo.tempoChange.equals(Proportion.EQUALITY))
	//System.out.print("TC="+mensInfo.tempoChange+"|TP="+timeProp+"|");
	//System.out.println("------MMNS----- timeprop="+timeProp+
	//                   " measureprop="+measureProp+" mi.tempochange="+mensInfo.tempoChange);
	//System.out.println("XXXXXXXX-NPEMP="+noPropEndMeasurePos+"-XXXXXXXXX");
	//if (!timeProp.equals(Proportion.EQUALITY) || !mensInfo.tempoChange.equals(Proportion.EQUALITY))
	//System.out.println("------time="+timePos+" endmeasure="+endMeasurePos+"||");
	/*if (!timeProp.equals(Proportion.EQUALITY) || !mensInfo.tempoChange.equals(Proportion.EQUALITY))
System.out.print("  |nt="+noteTime+" nptlim="+noPropTimeLeftInMeasure+" ");
if (!timeProp.equals(Proportion.EQUALITY) || !mensInfo.tempoChange.equals(Proportion.EQUALITY))
System.out.print("nl1="+ne.getLength()+" ");*/
	/*System.out.println("  1nt="+noteTime+" tp="+timePos+" emp="+endMeasurePos);
if (!measureProp.equals(mensInfo.tempoChange))
System.out.println("XXXXXXXX-NPTLIM="+noPropTimeLeftInMeasure);*/
	/* calcModernNoteTypeAndLength should get measurePos and endMeasurePos
               as if no proportions are applied... */
	//            if (Proportion.quotient(ne.getLength(),timeProp).greaterThan(noteTime))
	//              ne.setLength(Proportion.product(new Proportion(noteTime),timeProp));
	//            if (ne.getLength().greaterThan(noteTime))
	//              ne.setLength(new Proportion(noteTime));
	//if (!timeProp.equals(Proportion.EQUALITY) || !mensInfo.tempoChange.equals(Proportion.EQUALITY))
	//System.out.print("nl2="+ne.getLength()+" ");
	//            noteTime.subtract(Proportion.quotient(ne.getLength(),totalProp));
	//            timePos.add(Proportion.quotient(ne.getLength(),totalProp));
	//            timePos.add(ne.getLength());
	//if (!timeProp.equals(Proportion.EQUALITY) || !mensInfo.tempoChange.equals(Proportion.EQUALITY))
	//System.out.print(" nptp="+noPropTimePos+" ");
	//            timePos.add(ne.getLength());
	//if (!timeProp.equals(Proportion.EQUALITY) || !mensInfo.tempoChange.equals(Proportion.EQUALITY))
	//System.out.print("TP="+timePos+" EMP="+endMeasurePos+" ");
	/*                noPropTimeLeftInMeasure=Proportion.product(
                  new Proportion(measureMinims,1),
                  mensInfo.tempoChange);*/
	//if (!timeProp.equals(Proportion.EQUALITY) || !mensInfo.tempoChange.equals(Proportion.EQUALITY))
	//System.out.println();
	//System.out.println("  2nt="+noteTime+" tp="+timePos+" emp="+endMeasurePos);
	makeNextTiedNote():NoteEvent
	{
		let ne:NoteEvent =<NoteEvent>( this.createCopy_1());
		ne.setModernText(null);
		ne.setEdCommentary(null);
		ne.setDisplayAccidental(false);
		ne.setSignum(null);
		return ne;
	}

	/* should not take proportions into account!!! */
	calcModernNoteTypeAndLength(noteTime:Proportion,timeProp:Proportion,timeLeftInMeasure:Proportion,m:Mensuration):void
	{
		let mensInfo:Mensuration = this.getBaseMensInfo();
		let maxTime:Proportion = Proportion.min(noteTime,timeLeftInMeasure);
		let nt:number = NoteEvent.NT_Maxima;
		while( nt >= NoteEvent.NT_Fusa && NoteEvent.getTypeLength(nt,m).greaterThan(maxTime))
		nt --;
		let newNoteType:number = NoteEvent.NT_DoubleWhole;
		switch( nt)
		{
			case NoteEvent.NT_Semibrevis:
			{
				newNoteType = NoteEvent.NT_Whole;
				break;
			}
			case NoteEvent.NT_Minima:
			{
				newNoteType = NoteEvent.NT_Half;
				break;
			}
			case NoteEvent.NT_Semiminima:
			{
				newNoteType = NoteEvent.NT_Quarter;
				break;
			}
			case NoteEvent.NT_Fusa:
			{
				this.numFlags = 1;
				newNoteType = NoteEvent.NT_Flagged;
				break;
			}
			case NoteEvent.NT_Semifusa:
			{
				this.numFlags = 2;
				newNoteType = NoteEvent.NT_Flagged;
				break;
			}
		}
		this.notetype = newNoteType;
		this.colored = false;
		this.halfColoration = NoteEvent.HALFCOLORATION_NONE;
		this.colorscheme = Coloration.DEFAULT_COLORATION;
		this.selectNoteheadStyle();
		this.setLength_1(maxTime);
		if( this.getLength_1().lessThan(noteTime))
			this.tieType = NoteEvent.TIE_UNDER;
		else
			this.tieType = NoteEvent.TIE_NONE;

		if( this.getLength_1().toDouble() >= NoteEvent.getTypeLength(nt,m).toDouble() * 1.5)
			this.modernDot = true;

	}

	//Mensuration.DEFAULT_MENSURATION;
	/*    Proportion timeInMeasure=Proportion.quotient(
      Proportion.quotient(Proportion.difference(endMeasurePos,timePos),timeProp),
      mensInfo.tempoChange),*/
	//    Proportion timeLeftInMeasure=Proportion.difference(endMeasurePos,timePos),
	//               maxTime=Proportion.min(Proportion.product(noteTime,timeProp),timeLeftInMeasure);
	//System.out.print(" MaxT="+maxTime+" ");
	/*if (!mensInfo.tempoChange.equals(Proportion.EQUALITY))
System.out.print(" TLIM="+timeLeftInMeasure);*/
	//    this.setLength(NoteEvent.getTypeLength(this.notetype,m));
	//System.out.print("L="+this.getLength());
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

		let otherNE:NoteEvent =<NoteEvent> other;
		return this.notetype == otherNE.notetype && this.length.equals(otherNE.length) && this.pitch.equals(otherNE.pitch) && this.pitchOffset.equals(otherNE.pitchOffset) && this.ligstatus == otherNE.ligstatus && this.colored == otherNE.colored && this.halfColoration == otherNE.halfColoration && this.stemdir == otherNE.stemdir && this.stemside == otherNE.stemside && this.numFlags == otherNE.numFlags && this.modernTextEquals(otherNE) && this.wordEnd == otherNE.wordEnd && this.tieType == otherNE.tieType;
	}

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
			return other.notePitchMatches_1(this);

		if( other.geteventtype() != Event.EVENT_NOTE)
			return false;

		return this.getPitch_1().equals(other.getPitch_1());
	}

	/* note vs. note */
	/*  boolean accidentalInfoEquals(NoteEvent otherNE)
  {
    if (this.accidentalInfo==null)
      return otherNE.accidentalInfo==null;
    return this.accidentalInfo.equals(otherNE.accidentalInfo);
  }*/
	modernTextEquals(otherNE:NoteEvent):boolean
	{
		if( this.modernText == null)
			return otherNE.modernText == null;

		return( this.modernText == otherNE.modernText);
	}

	/*------------------------------------------------------------------------
Method:  void selectNoteheadStyle()
Purpose: Set notehead style based on note type and coloration scheme
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	selectNoteheadStyle():void
	{
		if( this.modernNoteType())
			{
				switch( this.notetype)
				{
					case NoteEvent.NT_ModernChant:
					{
						this.noteheadstyle = NoteEvent.NOTEHEADSTYLE_MODERN_STEMLESS_CHANT;
						break;
					}
					case NoteEvent.NT_Flagged:
					{
					}
					case NoteEvent.NT_Quarter:
					{
						this.noteheadstyle = NoteEvent.NOTEHEADSTYLE_MODERN_CROTCHET_UP;
						break;
					}
					case NoteEvent.NT_Half:
					{
						this.noteheadstyle = NoteEvent.NOTEHEADSTYLE_MODERN_MINIM_UP;
						break;
					}
					case NoteEvent.NT_Whole:
					{
						this.noteheadstyle = NoteEvent.NOTEHEADSTYLE_MODERN_SEMIBREVE;
						break;
					}
					default:
					{
						this.noteheadstyle = NoteEvent.NOTEHEADSTYLE_MODERN_BREVE;
						break;
					}
				}
				return;
			}

		let c:Coloration = this.colorscheme;
		if( this.halfColoration != NoteEvent.HALFCOLORATION_NONE)
			switch( this.notetype)
			{
				case NoteEvent.NT_Brevis:
				{
				}
				case NoteEvent.NT_Longa:
				{
					if( this.halfColoration == NoteEvent.HALFCOLORATION_PRIMARYSECONDARY)
						this.noteheadstyle = c.primaryFill == Coloration.FULL ? NoteEvent.NOTEHEADSTYLE_FULLVOID_BREVE:NoteEvent.NOTEHEADSTYLE_VOIDFULL_BREVE;
					else
						this.noteheadstyle = c.primaryFill == Coloration.FULL ? NoteEvent.NOTEHEADSTYLE_VOIDFULL_BREVE:NoteEvent.NOTEHEADSTYLE_FULLVOID_BREVE;

					break;
				}
				case NoteEvent.NT_Maxima:
				{
					if( this.halfColoration == NoteEvent.HALFCOLORATION_PRIMARYSECONDARY)
						this.noteheadstyle = c.primaryFill == Coloration.FULL ? NoteEvent.NOTEHEADSTYLE_FULLVOID_MAXIMA:NoteEvent.NOTEHEADSTYLE_VOIDFULL_MAXIMA;
					else
						this.noteheadstyle = c.primaryFill == Coloration.FULL ? NoteEvent.NOTEHEADSTYLE_VOIDFULL_MAXIMA:NoteEvent.NOTEHEADSTYLE_FULLVOID_MAXIMA;

					break;
				}
				default:
				{
					System.err.println("Error: attempting to assign half-coloration to an invalid note type");
				}
			}

		else
			if( this.colored)
				switch( this.notetype)
				{
					case NoteEvent.NT_Semifusa:
					{
					}
					case NoteEvent.NT_Fusa:
					{
					}
					case NoteEvent.NT_Semiminima:
					{
					}
					case NoteEvent.NT_Minima:
					{
					}
					case NoteEvent.NT_Semibrevis:
					{
						this.noteheadstyle = c.secondaryFill == Coloration.FULL ? NoteEvent.NOTEHEADSTYLE_FULLSEMIBREVE:NoteEvent.NOTEHEADSTYLE_SEMIBREVE;
						break;
					}
					case NoteEvent.NT_Maxima:
					{
						this.noteheadstyle = c.secondaryFill == Coloration.FULL ? NoteEvent.NOTEHEADSTYLE_FULLMAXIMA:NoteEvent.NOTEHEADSTYLE_MAXIMA;
						break;
					}
					default:
					{
						this.noteheadstyle = c.secondaryFill == Coloration.FULL ? NoteEvent.NOTEHEADSTYLE_FULLBREVE:NoteEvent.NOTEHEADSTYLE_BREVE;
						break;
					}
				}

			else
				switch( this.notetype)
				{
					case NoteEvent.NT_Semifusa:
					{
					}
					case NoteEvent.NT_Fusa:
					{
					}
					case NoteEvent.NT_Semiminima:
					{
						this.noteheadstyle = c.secondaryFill == Coloration.FULL ? NoteEvent.NOTEHEADSTYLE_FULLSEMIBREVE:NoteEvent.NOTEHEADSTYLE_SEMIBREVE;
						break;
					}
					case NoteEvent.NT_Minima:
					{
					}
					case NoteEvent.NT_Semibrevis:
					{
						this.noteheadstyle = c.primaryFill == Coloration.FULL ? NoteEvent.NOTEHEADSTYLE_FULLSEMIBREVE:NoteEvent.NOTEHEADSTYLE_SEMIBREVE;
						break;
					}
					case NoteEvent.NT_Maxima:
					{
						this.noteheadstyle = c.primaryFill == Coloration.FULL ? NoteEvent.NOTEHEADSTYLE_FULLMAXIMA:NoteEvent.NOTEHEADSTYLE_MAXIMA;
						break;
					}
					default:
					{
						this.noteheadstyle = c.primaryFill == Coloration.FULL ? NoteEvent.NOTEHEADSTYLE_FULLBREVE:NoteEvent.NOTEHEADSTYLE_BREVE;
						break;
					}
				}

		if( this.notetype == NoteEvent.NT_Semiminima && this.numFlags > 0 && ! this.colored)
			this.noteheadstyle = NoteEvent.oppositefill(this.noteheadstyle);

	}

	/* half-colored notehead */
	/* colored notes always use Secondary coloration */
	/*------------------------------------------------------------------------
Method:  boolean canBePerfect(Mensuration mensinfo)
Purpose: Check whether note can be perfected/imperfected under a given
         mensuration (only checks pars propinqua)
Parameters:
  Input:  Mensuration mensinfo - mensuration information
  Output: -
  Return: whether note can be perfected/imperfected
------------------------------------------------------------------------*/
	public canBePerfect(mensinfo:Mensuration):boolean
	{
		switch( this.notetype)
		{
			case NoteEvent.NT_Semibrevis:
			{
				return mensinfo.prolatio == Mensuration.MENS_TERNARY;
			}
			case NoteEvent.NT_Brevis:
			{
				return mensinfo.tempus == Mensuration.MENS_TERNARY;
			}
			case NoteEvent.NT_Longa:
			{
				return mensinfo.modus_minor == Mensuration.MENS_TERNARY;
			}
			case NoteEvent.NT_Maxima:
			{
				return mensinfo.modus_maior == Mensuration.MENS_TERNARY;
			}
		}
		return false;
	}

	/*------------------------------------------------------------------------
Method:  boolean canBeAltered(Mensuration mensinfo)
Purpose: Check whether note can be altered under a given mensuration
Parameters:
  Input:  Mensuration mensinfo - mensuration information
  Output: -
  Return: whether note can be altered
------------------------------------------------------------------------*/
	public canBeAltered(mensinfo:Mensuration):boolean
	{
		switch( this.notetype)
		{
			case NoteEvent.NT_Minima:
			{
				return mensinfo.prolatio == Mensuration.MENS_TERNARY;
			}
			case NoteEvent.NT_Semibrevis:
			{
				return mensinfo.tempus == Mensuration.MENS_TERNARY;
			}
			case NoteEvent.NT_Brevis:
			{
				return mensinfo.modus_minor == Mensuration.MENS_TERNARY;
			}
			case NoteEvent.NT_Longa:
			{
				return mensinfo.modus_maior == Mensuration.MENS_TERNARY;
			}
		}
		return false;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getnotetype_1():number
	{
		return this.notetype;
	}

	public getnoteheadstyle():number
	{
		return this.noteheadstyle;
	}

	public getHalfColoration():number
	{
		return this.halfColoration;
	}

	public getLength_1():Proportion
	{
		return this.length;
	}

	public getMIDIPitch():number
	{
		return(( this.pitch.toMIDIPitch() + this.pitchOffset.pitchOffset) | 0);
	}

	public getPitch_1():Pitch
	{
		return this.pitch;
	}

	public getPitchOffset():ModernAccidental
	{
		return this.pitchOffset;
	}

	public isligated():boolean
	{
		return this.ligstatus != NoteEvent.LIG_NONE;
	}

	public getligtype():number
	{
		return this.ligstatus;
	}

	public modernNoteType():boolean
	{
		return this.notetype >= NoteEvent.NT_Flagged && this.notetype <= NoteEvent.NT_DoubleWhole;
	}

	public getNumFlags():number
	{
		return this.numFlags;
	}

	public isMinorColor_1():boolean
	{
		if( ! this.isColored())
			return false;

		let m:Mensuration = this.getBaseMensInfo();
		let dtl:Proportion = NoteEvent.getTypeLength(this.notetype,m);
		let diffDenominator:number = Proportion.difference(dtl,this.length).i2;
		return ! m.ternary(this.notetype) && this.length.lessThan(dtl) &&( diffDenominator < 3 || diffDenominator == 4 || diffDenominator == 8);
	}

	public hasStem():boolean
	{
		return this.notetype == NoteEvent.NT_Semifusa || this.notetype == NoteEvent.NT_Fusa || this.notetype == NoteEvent.NT_Semiminima || this.notetype == NoteEvent.NT_Minima || this.notetype == NoteEvent.NT_Longa || this.notetype == NoteEvent.NT_Maxima || this.notetype == NoteEvent.NT_Flagged || this.notetype == NoteEvent.NT_Quarter || this.notetype == NoteEvent.NT_Half;
	}

	public hasModernDot():boolean
	{
		return this.modernDot;
	}

	public getstemdir():number
	{
		return this.stemdir;
	}

	public getstemside():number
	{
		return this.stemside;
	}

	public getTieType():number
	{
		return this.tieType;
	}

	public isflagged_1():boolean
	{
		return this.numFlags > 0 || this.notetype == NoteEvent.NT_Flagged;
	}

	/*  public boolean hasstem()
  {
    return stemside!=-1 ||
           (notetype!=NT_Brevis && notetype!=NT_Semibrevis);
  }*/
	public getModernText():string
	{
		return this.modernText;
	}

	public isModernTextEditorial():boolean
	{
		return this.modernTextEditorial;
	}

	public isWordEnd():boolean
	{
		return this.wordEnd;
	}

	public displayAccidental():boolean
	{
		return this._displayAccidental;
	}

	/* overrides Event methods */
	public getcolor_1():number
	{
		if(( this.colored &&( this.numFlags == 0 || this.notetype != NoteEvent.NT_Semiminima)) || this.notetype == NoteEvent.NT_Semifusa || this.notetype == NoteEvent.NT_Fusa || this.notetype == NoteEvent.NT_Semiminima)
			return this.colorscheme.secondaryColor;
		else
			return this.colorscheme.primaryColor;

	}

	public getcolorfill_1():number
	{
		if( this.noteheadstyle == NoteEvent.NOTEHEADSTYLE_SEMIBREVE || this.noteheadstyle == NoteEvent.NOTEHEADSTYLE_BREVE || this.noteheadstyle == NoteEvent.NOTEHEADSTYLE_MAXIMA)
			return Coloration.VOID;
		else
			return Coloration.FULL;

	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setpitch_1(p:Pitch):void
	{
		this.pitch = p;
	}

	public modifyPitchOffset(offset:number):void
	{
		this.pitchOffset.pitchOffset += offset;
	}

	public setPitchOffset(pitchOffset:number):void
	{
		this.pitchOffset.pitchOffset = pitchOffset;
	}

	public setnotetype_1(nt:number,f:number,m:Mensuration):void
	{
		this.notetype = nt;
		this.numFlags = f;
		this.selectNoteheadStyle();
	}

	public setLength_1(l:Proportion):void
	{
		this.length =( this.musictime = Proportion.new1(l));
	}

	public setstemdir(sd:number):void
	{
		this.stemdir = sd;
	}

	public setstemside(ss:number):void
	{
		this.stemside = ss;
	}

	public setligtype(lt:number):void
	{
		this.ligstatus = lt;
	}

	public setColored_1(c:boolean):void
	{
		super.setColored_1(c);
		this.selectNoteheadStyle();
	}

	public setHalfColoration(hc:number):void
	{
		this.halfColoration = hc;
		this.selectNoteheadStyle();
	}

	public setModernText(s:string):void
	{
		this.modernText = s;
	}

	public setTieType(newval:number):void
	{
		this.tieType = newval;
	}

	public setWordEnd(we:boolean):void
	{
		this.wordEnd = we;
	}

	public setModernTextEditorial(modernTextEditorial:boolean):void
	{
		this.modernTextEditorial = modernTextEditorial;
	}

	public setDisplayAccidental(displayAccidental:boolean):void
	{
		this._displayAccidental = displayAccidental;
	}

	/* overrides Event methods */
	public setcolorparams_1(c:Coloration):void
	{
		this.colorscheme = c;
		this.selectNoteheadStyle();
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
		System.out.println("    Note: " + NoteEvent.NoteTypeNames[this.notetype]+ "," + this.length.i1 + "/" + this.length.i2 + "," + this.pitch.toString());
	}
}
