
import { System } from '../java/lang/System';
import { VariantVersionData } from './VariantVersionData';
import { VariantReading } from './VariantReading';
import { Signum } from './Signum';
import { Proportion } from './Proportion';
import { Pitch } from './Pitch';
import { ModernKeySignature } from './ModernKeySignature';
import { Mensuration } from './Mensuration';
import { Coloration } from './Coloration';
import { ClefSet } from './ClefSet';
import { ClefEvent } from './ClefEvent';
import { Clef } from './Clef';
import { List } from '../java/util/List';
import { LinkedList } from '../java/util/LinkedList';

export class Event
{
	public static NT_Semibrevis:number = 4;
	public static NT_Brevis:number = 5;
	public static NT_Longa:number = 6;
	public static NT_Maxima:number = 7;
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static EVENT_BASE:number = 0;
	public static EVENT_CLEF:number = 1;
	public static EVENT_MENS:number = 2;
	public static EVENT_NOTE:number = 3;
	public static EVENT_REST:number = 4;
	public static EVENT_DOT:number = 5;
	public static EVENT_ORIGINALTEXT:number = 6;
	public static EVENT_CUSTOS:number = 7;
	public static EVENT_LINEEND:number = 8;
	public static EVENT_SECTIONEND:number = 9;
	public static EVENT_PROPORTION:number = 10;
	public static EVENT_COLORCHANGE:number = 11;
	public static EVENT_BARLINE:number = 12;
	public static EVENT_ANNOTATIONTEXT:number = 13;
	public static EVENT_LACUNA:number = 14;
	public static EVENT_LACUNA_END:number = 15;
	public static EVENT_MODERNKEYSIGNATURE:number = 16;
	public static EVENT_MULTIEVENT:number = 17;
	public static EVENT_ELLIPSIS:number = 18;
	/* marker for skipped body in incipit scores */
	public static EVENT_VARIANTDATA_START:number = 19;
	public static EVENT_VARIANTDATA_END:number = 20;
	public static EVENT_BLANK:number = 21;
	public static EventNames:string[]=["Event","Clef","Mensuration","Note","Rest","Dot","OriginalText","Custos","Line End","Section End","Proportion","ColorChange","Barline","Annotation","Lacuna","LacunaEnd","ModernKeySignature","MultiEvent","Ellipsis","VariantDataStart","VariantDataEnd","Blank"];
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	eventtype:number;
	eventList:LinkedList<Event>;
	/* to integrate MultiEvents */
	musictime:Proportion = Proportion.new0(0,1);
	verticallyAligned:boolean = false;
	/* for multiple events at the same x-loc */
	colored:boolean = false;
	editorial:boolean = false;
	error:boolean = false;
	displayEditorial:boolean = false;
	corona:Signum = null;
	signum:Signum = null;
	edCommentary:string = null;
	protected colorscheme:Coloration = Coloration.DEFAULT_COLORATION;
	protected modernKeySig:ModernKeySignature = ModernKeySignature.DEFAULT_SIG;
	protected rhythmicProportion:Proportion = Proportion.EQUALITY;
	clefinfoevent:Event;
	mensinfoevent:Event;
	/* current clef and mensuration */
	private listplace:number;
	/* place in voice's event list */
	private defaultListPlace:number;
	/* place in event list without variants */
	private variantReading:VariantReading = null;

	public static new0():Event
	{
		let _new0:Event = new Event;
		Event.set0(_new0);
		return _new0;
	}

	public static set0(new0:Event):void
	{
		new0.eventtype = Event.EVENT_BASE;
		new0.eventList = new LinkedList<Event>();
		new0.eventList.add(new0);
	}

	public static new1(etype:number):Event
	{
		let _new1:Event = new Event;
		Event.set1(_new1,etype);
		return _new1;
	}

	public static set1(new1:Event,etype:number):void
	{
		Event.set0(new1);
		new1.eventtype = etype;
		if( new1.eventtype == Event.EVENT_ELLIPSIS)
			new1.musictime.i1 = 1;

	}

	/* treat as timed event */
	/*------------------------------------------------------------------------
Method:  Event createCopy()
Purpose: Create copy of current event (to be overridden)
Parameters:
  Input:  -
  Output: -
  Return: copy of this
------------------------------------------------------------------------*/
	public createCopy_1():Event
	{
		return Event.new1(this.eventtype);
	}

	/*------------------------------------------------------------------------
Method:  void copyEventAttributes(Event other)
Purpose: Copy attributes from another event
Parameters:
  Input:  Event other - event with attributes to copy
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public copyEventAttributes_1(other:Event):void
	{
		this.musictime = Proportion.copyProportion(other.musictime);
		this.verticallyAligned = other.verticallyAligned;
		this.colored = other.colored;
		this.editorial = other.editorial;
		this.error = other.error;
		this.corona = other.corona == null ? null:Signum.new2(other.corona);
		this.signum = other.signum == null ? null:Signum.new2(other.signum);
		this.edCommentary = other.edCommentary == null ? null:other.edCommentary;
		this.colorscheme = Coloration.new2(other.colorscheme);
		this.modernKeySig = ModernKeySignature.new1(other.modernKeySig);
		this.clefinfoevent = other.clefinfoevent;
		this.mensinfoevent = other.mensinfoevent;
	}

	/*------------------------------------------------------------------------
Method:  LinkedList<Event> makeModernNoteShapes()
Purpose: Make event (copy) in modern notation (to be overridden)
Parameters:
  Input:  -
  Output: -
  Return: copy of this with modern note shape, expanded into multiple
          events if necessary
------------------------------------------------------------------------*/
	public makeModernNoteShapes_1(timePos:Proportion,measurePos:Proportion,measureMinims:number,measureProp:Proportion,timeProp:Proportion,useTies:boolean):LinkedList<Event>
	{
		let el:LinkedList<Event> = new LinkedList<Event>();
		el.add(this);
		return el;
	}

	public isMinorColor_1():boolean
	{
		return false;
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
		return this.eventtype == other.eventtype && this.musictime.equals(other.musictime) && this.verticallyAligned == other.verticallyAligned && this.colored == other.colored && this.editorial == other.editorial && this.error == other.error && this.coronaEquals(other) && this.signumEquals(other) && this.edCommentaryEquals(other);
	}

	public coronaEquals(other:Event):boolean
	{
		if( this.corona == null)
			return other.corona == null;

		return this.corona.equals(other.corona);
	}

	public signumEquals(other:Event):boolean
	{
		if( this.signum == null)
			return other.signum == null;

		return this.signum.equals(other.signum);
	}

	public edCommentaryEquals(other:Event):boolean
	{
		if( this.edCommentary == null)
			return other.edCommentary == null;

		return( this.edCommentary == other.edCommentary);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public geteventtype():number
	{
		return this.eventtype;
	}

	public getTypeName():string
	{
		return Event.EventNames[this.eventtype];
	}

	public getmusictime():Proportion
	{
		return this.musictime;
	}

	public isColored():boolean
	{
		return this.colored;
	}

	public getEdCommentary():string
	{
		return this.edCommentary;
	}

	public getcolor_1():number
	{
		return this.colorscheme.primaryColor;
	}

	public getcolorfill_1():number
	{
		return this.colorscheme.primaryFill;
	}

	public getcoloration():Coloration
	{
		return this.colorscheme;
	}

	public getCorona():Signum
	{
		return this.corona;
	}

	public getSignum():Signum
	{
		return this.signum;
	}

	public isEditorial():boolean
	{
		return this.editorial;
	}

	public displayAsEditorial():boolean
	{
		return this.displayEditorial;
	}

	public isError():boolean
	{
		return this.error;
	}

	public alignedWithPrevious():boolean
	{
		return this.verticallyAligned;
	}

	/* to be overridden */
	public getPitch_1():Pitch
	{
		return null;
	}

	public getLength_1():Proportion
	{
		return null;
	}

	public getnotetype_1():number
	{
		System.err.println("Error: trying to get notetype of a non-note event");
		return - 1;
	}

	public isflagged_1():boolean
	{
		return false;
	}

	public getClefInfoEvent():Event
	{
		return this.clefinfoevent;
	}

	public getClefSet_1():ClefSet
	{
		return null;
	}

	public getClefSet_2(usemodernclefs:boolean):ClefSet
	{
		return null;
	}

	public getPrincipalClef(usemodernclefs:boolean):Clef
	{
		let cs:ClefSet = this.getClefSet_2(usemodernclefs);
		if( cs == null)
			return null;

		return cs.getprincipalclef();
	}

	public getProportion():Proportion
	{
		return this.rhythmicProportion;
	}

	public calcTotalProportion():Proportion
	{
		if( this.mensinfoevent == null)
			return this.rhythmicProportion;
		else
			return Proportion.product(this.rhythmicProportion,this.mensinfoevent.getMensInfo_1().tempoChange);

	}

	public calcProportionalMusicLength():Proportion
	{
		let ml:Proportion = Proportion.quotient(this.getmusictime(),this.calcTotalProportion());
		return ml != null ? ml:Proportion.new0(0,1);
	}

	public getVariantReading_1(version:VariantVersionData):VariantReading
	{
		if( this.variantReading == null || ! this.variantReading.includesVersion(version))
			return null;

		return this.variantReading;
	}

	public getSubEvents():List<Event>
	{
		return this.eventList;
	}

	public hasEventType_1(etype:number):boolean
	{
		return this.eventtype == etype;
	}

	public getFirstEventOfType_1(etype:number):Event
	{
		if( this.eventtype == etype)
			return this;
		else
			return null;

	}

	public hasAccidentalClef_1():boolean
	{
		return false;
	}

	public hasPrincipalClef_1():boolean
	{
		return false;
	}

	public hasSignatureClef_1():boolean
	{
		return false;
	}

	public hasVariantColoration(other:Event):boolean
	{
		if( this.eventtype != other.eventtype)
			return false;

		return this.colored != other.colored;
	}

	public inVariant_1():boolean
	{
		return this.variantReading != null;
	}

	public getBaseMensInfo():Mensuration
	{
		return( this.mensinfoevent != null) ? this.mensinfoevent.getMensInfo_1():Mensuration.DEFAULT_MENSURATION;
	}

	public getMensInfo_1():Mensuration
	{
		return null;
	}

	public getMensInfoEvent():Event
	{
		return this.mensinfoevent;
	}

	public getModernKeySig():ModernKeySignature
	{
		return this.modernKeySig;
	}

	public rhythmicEventType_1():number
	{
		return this.eventtype;
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
		return false;
	}

	/* not a note */
	public hasNotePitch_1(p:Pitch):boolean
	{
		return false;
	}

	/*------------------------------------------------------------------------
Method:  boolean principalClefEquals(Event other,boolean usemodernclefs)
Purpose: Calculate whether this event's clef set has the same principal clef as
         another one
Parameters:
  Input:  Event other            - event for comparison clef
          boolean usemodernclefs - whether to check modern clefs
  Output: -
  Return: Whether principal clefs are equal
------------------------------------------------------------------------*/
	public principalClefEquals(other:Event,usemodernclefs:boolean):boolean
	{
		let pc1:Clef = this.getPrincipalClef(usemodernclefs);
		let pc2:Clef = other.getPrincipalClef(usemodernclefs);
		if( pc1 == null || pc2 == null)
			return false;

		return pc1.equals(pc2);
	}

	/*------------------------------------------------------------------------
Method:  void addToSigClefs(Event sigEvent)
Purpose: Create a new clef set for this event, adding this event's clefs
         to the current signature set
Parameters:
  Input:  Event sigEvent - event with current clef set
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addToSigClefs(sigEvent:Event):void
	{
		let cs:ClefSet = ClefSet.new1_1(sigEvent.getClefSet_1());
		for(let c of this.getClefSet_1())
		cs.addclef(c);
		this.setClefSet_1(cs,false);
		cs = ClefSet.new1_1(sigEvent.getClefSet_2(true));
		for(let c of this.getClefSet_2(true))
		cs.addclef(c);
		this.setClefSet_1(cs,true);
	}

	/* original clefs */
	/* modern clefs */
	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setColored_1(c:boolean):void
	{
		this.colored = c;
	}

	public setEdCommentary(s:string):void
	{
		this.edCommentary = s;
	}

	public setCorona(c:Signum):void
	{
		this.corona = c;
	}

	public setProportion(p:Proportion):void
	{
		this.rhythmicProportion = p;
	}

	public setSignum(s:Signum):void
	{
		this.signum = s;
	}

	public setDisplayEditorial(newVal:boolean):void
	{
		this.displayEditorial = newVal;
	}

	public setEditorial(e:boolean):void
	{
		this.editorial = e;
	}

	public setError(newVal:boolean):void
	{
		this.error = newVal;
	}

	public setAlignmentWithPrevious(a:boolean):void
	{
		this.verticallyAligned = a;
	}

	public modifyPitch_1(offset:number):void
	{
		this.getPitch_1().add(offset);
	}

	/* to be overridden */
	public setpitch_1(p:Pitch):void
	{
		System.err.println("Error: trying to assign pitch to an unpitched event");
	}

	public setnotetype_1(nt:number,f:number,m:Mensuration):void
	{
		System.err.println("Error: trying to assign notetype to a non-note event");
	}

	public setLength_1(l:Proportion):void
	{
		System.err.println("Error: trying to assign length to an untimed event");
	}

	public setClefSet_1(cs:ClefSet,usemodernclefs:boolean):void
	{
		System.err.println("Error: trying to set clef set on an invalid event");
	}

	public constructClefSets_1(le:Event,cie:Event):void
	{
	}

	/*------------------------------------------------------------------------
Method:  void set*params
Purpose: Sets music parameters current at this event (clef, mensuration)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	/* 
private ClefEvent asClefEvent() //CHANGE
{
  return this instanceof ClefEvent? (ClefEvent) this : null;
}*/
	public setclefparams(ce:Event):void
	{
		
    this . clefinfoevent = ce; 
		if(  ce != null && ce . hasPrincipalClef_1 ( )  ) 
		{ 
		  let p : Pitch = this . getPitch_1 ( );
      if (  p != null  ) 
			{ 
				p . setclef ( ce . getClefSet_1 ( ) . getprincipalclef ( ) ); 

				if (  this . geteventtype ( ) == Event . EVENT_CLEF  ) ( this as any ) . getClef_1 ( false , false ) . linespacenum = p . staffspacenum + 1; 
			} 
		} 
}

	/* assign clef information to pitches */
	public setmensparams_1(me:Event):void
	{
		this.mensinfoevent = me;
	}

	public setcolorparams_1(c:Coloration):void
	{
		this.colorscheme = c;
	}

	public setModernKeySigParams(mks:ModernKeySignature):void
	{
		this.modernKeySig = mks;
	}

	public setVariantReading(variantReading:VariantReading):void
	{
		this.variantReading = variantReading;
	}

	/*------------------------------------------------------------------------
Method:  int getListPlace()
Purpose: Returns the list place of this event
Parameters:
  Input:  -
  Output: -
  Return: list place
------------------------------------------------------------------------*/
	public getListPlace(defaultPlace:boolean):number
	{
		return defaultPlace ? this.defaultListPlace:this.listplace;
	}

	public getDefaultListPlace():number
	{
		return this.defaultListPlace;
	}

	/*------------------------------------------------------------------------
Method:  void setListPlace(int lp)
Purpose: Sets the list place of this event
Parameters:
  Input:  int lp - new list place
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setListPlace(lp:number):void
	{
		this.listplace = lp;
	}

	public setDefaultListPlace(defaultListPlace:number):void
	{
		this.defaultListPlace = defaultListPlace;
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
		System.out.println("    " + Event.EventNames[this.eventtype]);
	}
}
