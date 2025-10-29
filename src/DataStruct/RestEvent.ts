
import { System } from '../java/lang/System';
import { Proportion } from './Proportion';
import { NoteEvent } from './NoteEvent';
import { Mensuration } from './Mensuration';
import { Event } from './Event';
import { Coloration } from './Coloration';
import { LinkedList } from '../java/util/LinkedList';

export class RestEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static defaultBottomLine:number[]=[3,3,3,3,4,3,2,2];
	/* semifusa - minima */
	/* semibrevis - maxima */
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	notetype:number;
	length:Proportion;
	bottomline:number;
	numlines:number;
	/* vertical positioning */
	numSets:number;

	/* for maximas: number of vertical lines */
	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  int calcNumLines(int nt,Mensuration m)
Purpose: Calculate number of staff lines covered by rest of a given note type
Parameters:
  Input:  int nt        - note type
          Mensuration m - mensuration data for calculation
  Output: -
  Return: number of lines
------------------------------------------------------------------------*/
	public static calcNumLines(nt:number,m:Mensuration):number
	{
		switch( nt)
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
				return 0;
			}
			case NoteEvent.NT_Brevis:
			{
				return 1;
			}
			case NoteEvent.NT_Longa:
			{
			}
			case NoteEvent.NT_Maxima:
			{
				return m.modus_minor;
			}
		}
		return 0;
	}

	/* calc largest note type which fits in a given time */
	public static calcLargestRestType(time:number,m:Mensuration):number
	{
		for(
		let nt:number = NoteEvent.NT_Maxima;nt >= NoteEvent.NT_Semifusa;nt --)
		if( NoteEvent.getTypeLength(nt,m).toDouble() <= time)
			return nt;

		return NoteEvent.NT_Semifusa;
	}

	public static new31(nt:number,p:Proportion,bl:number,nl:number,ns:number):RestEvent
	{
		let _new31:RestEvent = new RestEvent;
		RestEvent.set31(_new31,nt,p,bl,nl,ns);
		return _new31;
	}

	public static set31(new31:RestEvent,nt:number,p:Proportion,bl:number,nl:number,ns:number):void
	{
		Event.set0(new31);
		new31.eventtype = RestEvent.EVENT_REST;
		new31.notetype = nt;
		new31.length =( new31.musictime = p == null ? null:Proportion.new1(p));
		new31.bottomline = bl;
		new31.numlines = nl;
		new31.numSets = new31.notetype == NoteEvent.NT_Maxima ? ns:1;
	}

	public static new32(nt:string,p:Proportion,bl:number,nl:number,ns:number):RestEvent
	{
		let _new32:RestEvent = new RestEvent;
		RestEvent.set32(_new32,nt,p,bl,nl,ns);
		return _new32;
	}

	public static set32(new32:RestEvent,nt:string,p:Proportion,bl:number,nl:number,ns:number):void
	{
		RestEvent.set31(new32,NoteEvent.strtoNT(nt),p,bl,nl,ns);
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
		let e:Event = RestEvent.new31(this.notetype,this.length,this.bottomline,this.numlines,this.numSets);
		e.copyEventAttributes_1(this);
		return e;
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
		let re:RestEvent =<RestEvent>( this.createCopy_1());
		re.colored = false;
		re.colorscheme = Coloration.DEFAULT_COLORATION;
		re.bottomline =( re.numlines =( re.numSets = 1));
		timePos = Proportion.new1(timePos);
		let mensInfo:Mensuration = this.getBaseMensInfo();
		let restTime:Proportion = Proportion.quotient(this.length,timeProp);
		let measureLength:Proportion = Proportion.new0((( measureMinims * measureProp.i2) | 0),measureProp.i1);
		let endMeasurePos:Proportion = Proportion.sum(measurePos,measureLength);
		let noPropEndMeasurePos:Proportion = Proportion.new0((( measurePos.i1 + measureMinims) | 0),measurePos.i2);
		if( ! measureProp.equals(mensInfo.tempoChange))
			{
				noPropEndMeasurePos = Proportion.sum(measurePos,Proportion.new0((((( measureMinims * measureProp.i2) | 0) * mensInfo.tempoChange.i1) | 0),(( measureProp.i1 * mensInfo.tempoChange.i2) | 0)));
			}

		while( restTime.i1 > 0)
		{
			let noPropTimeLeftInMeasure:Proportion = Proportion.product(Proportion.difference(endMeasurePos,timePos),mensInfo.tempoChange);
			re.calcModernRestTypeAndLength(restTime,timeProp,noPropTimeLeftInMeasure,Mensuration.DEFAULT_MENSURATION);
			el.add(re);
			restTime.subtract(re.getLength_1());
			timePos.add(Proportion.quotient(re.getLength_1(),mensInfo.tempoChange));
			if( timePos.greaterThanOrEqualTo(endMeasurePos))
				{
					timePos = Proportion.new1(endMeasurePos);
					endMeasurePos.add(measureLength);
				}

			re = this.makeNextRest();
		}
		return el;
	}

	// System.out.println("REST MMNS timePos="+timePos+" restTime="+restTime+
	//                    " endMeasurePos="+endMeasurePos+" timeProp="+timeProp);
	// System.out.println(" NPEMP="+noPropEndMeasurePos);
	// System.out.println("  left in m="+noPropTimeLeftInMeasure);
	// Proportion.product(Proportion.difference(noPropEndMeasurePos,timePos),measureProp).toDouble());
	//         re.notetype=RestEvent.calcLargestRestType(
	//           Math.min(restTime.toDouble(),//Proportion.product(restTime,timeProp).toDouble(),
	//                    noPropTimeLeftInMeasure.toDouble()),
	// /*                   Proportion.product(
	//                      Proportion.difference(noPropEndMeasurePos,timePos),
	//                      measureProp).toDouble()),*///Proportion.product(Proportion.difference(endMeasurePos,timePos),timeProp).toDouble()),
	//           mensInfo);
	// re.setLength(NoteEvent.getTypeLength(re.notetype,mensInfo));
	// if (Proportion.quotient(re.getLength(),timeProp).greaterThan(restTime))
	//   re.setLength(Proportion.product(new Proportion(restTime),timeProp));
	// System.out.println("  rest type="+NoteEvent.NoteTypeNames[re.notetype]);
	// System.out.println("  re.getLength(): " + re.getLength());
	// System.out.println("  1restTime: " + restTime);
	// System.out.println("  re.getLength(): " + re.getLength());
	// System.out.println("  mensInfo.tempoChange: " + mensInfo.tempoChange);
	// System.out.println("  Proportion.quotient(re.getLength(),mensInfo.tempoChange): " + Proportion.quotient(re.getLength(),mensInfo.tempoChange));
	// System.out.println("  2restTime: " + restTime);
	// System.out.println("  rt="+restTime+" tp="+timePos+" emp="+endMeasurePos);
	/*    int newRestType=NT_DoubleWhole;
    switch (re.notetype)
      {
        case NT_Semibrevis:
          newRestType=NT_Whole;
          break;
        case NT_Minima:
          newRestType=NT_Half;
          break;
        case NT_Semiminima:
          newRestType=NT_Quarter;
          break;
        case NT_Fusa:
        case NT_Semifusa:
          newRestType=NT_Flagged;
          break;
      }
    ne.notetype=newRestType;*/
	/* cribbed straight from NoteEvent... */
	calcModernRestTypeAndLength(restTime:Proportion,timeProp:Proportion,timeLeftInMeasure:Proportion,m:Mensuration):void
	{
		let maxTime:Proportion = Proportion.min(restTime,timeLeftInMeasure);
		let nt:number = NoteEvent.NT_Maxima;
		while( nt >= NoteEvent.NT_Fusa && NoteEvent.getTypeLength(nt,m).greaterThan(maxTime))
		nt --;
		this.notetype = nt;
		this.colored = false;
		this.colorscheme = Coloration.DEFAULT_COLORATION;
		this.setLength_1(Proportion.new1(maxTime));
	}

	// Mensuration mensInfo=this.getBaseMensInfo();//Mensuration.DEFAULT_MENSURATION;
	/*    Proportion timeInMeasure=Proportion.quotient(
      Proportion.quotient(Proportion.difference(endMeasurePos,timePos),timeProp),
      mensInfo.tempoChange),*/
	//    Proportion timeLeftInMeasure=Proportion.difference(endMeasurePos,timePos),
	//               maxTime=Proportion.min(Proportion.product(restTime,timeProp),timeLeftInMeasure);
	//System.out.print(" MaxT="+maxTime+" ");
	/*if (!mensInfo.tempoChange.equals(Proportion.EQUALITY))
System.out.print(" TLIM="+timeLeftInMeasure);*/
	// this.selectNoteheadStyle();
	//    this.setLength(NoteEvent.getTypeLength(this.notetype,m));
	//System.out.print("L="+this.getLength());
	makeNextRest():RestEvent
	{
		
let re : RestEvent = RestEvent.new31 ( NoteEvent . NT_Brevis , Proportion . EQUALITY , 1 , 1 , 1 ); re . copyEventAttributes_1 ( this ); 
		re . setSignum ( null ); 
		return re ;  
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

		let otherRE:RestEvent =<RestEvent> other;
		return this.notetype == otherRE.notetype && this.length.equals(otherRE.length) && this.bottomline == otherRE.bottomline && this.numlines == otherRE.numlines && this.numSets == otherRE.numSets;
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

	public getModNoteType():number
	{
		return(( this.notetype + 7) | 0);
	}

	public getLength_1():Proportion
	{
		return this.length;
	}

	public getbottomline_1(useModernClefs:boolean):number
	{
		if( useModernClefs)
			return RestEvent.defaultBottomLine[this.notetype];
		else
			return this.bottomline;

	}

	public getbottomline_2():number
	{
		return this.getbottomline_1(false);
	}

	public getnumlines():number
	{
		return this.numlines;
	}

	public getNumSets():number
	{
		return this.numSets;
	}

	/* overrides Event methods */
	public getcolor_1():number
	{
		return this.colored ? this.colorscheme.secondaryColor:this.colorscheme.primaryColor;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setbottomline(bl:number):void
	{
		this.bottomline = bl;
	}

	public setnotetype_1(nt:number,f:number,m:Mensuration):void
	{
		if( this.notetype == nt)
			return;

		this.notetype = nt;
		this.setnumlines(RestEvent.calcNumLines(nt,m));
		this.numSets = this.notetype == NoteEvent.NT_Maxima ? m.modus_maior:1;
	}

	public setLength_1(l:Proportion):void
	{
		this.length =( this.musictime = l);
	}

	public setnumlines(nl:number):void
	{
		this.numlines = nl;
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
		System.out.println("    Rest: " + NoteEvent.NoteTypeNames[this.notetype]+ "," + this.length.i1 + "/" + this.length.i2 + "," + this.bottomline + "." + this.numlines);
	}
}
