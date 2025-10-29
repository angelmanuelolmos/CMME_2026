
import { System } from '../java/lang/System';
import { Pitch } from './Pitch';
import { Event } from './Event';
import { Coloration } from './Coloration';
import { ClefSet } from './ClefSet';
import { Clef } from './Clef';

/*----------------------------------------------------------------------*/
/*

        Module          : ClefEvent.java

        Package         : DataStruct

        Classes Included: ClefEvent

        Purpose         : Clef event type

        Programmer      : Ted Dumitrescu

        Date Started    : 1/99

Updates:
4/99:    cleaned up, consolidated with Gfx code
4/26/99: added b-rotundum and b-quadratum clefs to replace "signatures"
         added automated display modernization
4/27/99: added multiple simultaneous clef support
2/25/05: rearranged clef type system (see Clef)
4/05:    replaced "multi-clef" event list with separate class ClefSet (to
         facilitate more involved clef/signature calculations)
3/23/06: added support for 'full'-colored clefs

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   ClefEvent
Extends: Event
Purpose: Data/routines for clef events
------------------------------------------------------------------------*/
export class ClefEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	clefset:ClefSet;
	/* clef group */
	modernclefset:ClefSet;
	/* modern version of clef group */
	clef:Clef;

	public static new6(n:string,l:number,p:Pitch,le:Event,cie:Event,s:boolean):ClefEvent
	{
		let _new6:ClefEvent = new ClefEvent;
		ClefEvent.set6(_new6,n,l,p,le,cie,s);
		return _new6;
	}

	public static set6(new6:ClefEvent,n:string,l:number,p:Pitch,le:Event,cie:Event,s:boolean):void
	{
		Event.set0(new6);
		let cleftype:number = Clef.CLEF_C;
		let displayClef:Clef = null;
		new6.eventtype = ClefEvent.EVENT_CLEF;
		cleftype = Clef.strToCleftype(n);
		if( cie != null)
			displayClef = cie.getClefSet_1().getprincipalclef();

		new6.clef = Clef.new0(cleftype,l,p,false,s,displayClef);
		new6.constructClefSets_1(le,cie);
	}

	public static new7(c:Clef,le:Event,cie:Event):ClefEvent
	{
		let _new7:ClefEvent = new ClefEvent;
		ClefEvent.set7(_new7,c,le,cie);
		return _new7;
	}

	public static set7(new7:ClefEvent,c:Clef,le:Event,cie:Event):void
	{
		Event.set0(new7);
		new7.eventtype = ClefEvent.EVENT_CLEF;
		new7.clef = c;
		new7.constructClefSets_1(le,cie);
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
		let e:Event = ClefEvent.new7(Clef.new1(this.clef),null,null);
		e.copyEventAttributes_1(this);
		return e;
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

		let otherCE:ClefEvent =<ClefEvent> other;
		return this.clef.equals(otherCE.clef);
	}

	/*------------------------------------------------------------------------
Method:  void constructClefSets(Event le,Event cie)
Purpose: Create or modify this event's clef sets
Parameters:
  Input:  Event le  - previous event
          Event cie - clef info event
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructClefSets_1(le:Event,cie:Event):void
	{
		this.clef.resetModClef();
		if( this.hasSignatureClef_1() && le != null && le.hasSignatureClef_1() && le.getClefSet_1() != null)
			{
				this.clefset = le.getClefSet_1().addclef(this.clef);
				this.modernclefset = le.getClefSet_2(true).addclef(this.clef.modernclef);
			}

		else
			{
				this.clefset = ClefSet.new0_1(this.clef);
				this.modernclefset = ClefSet.new0_1(this.clef.modernclef);
			}

		if( cie != null && ! this.clefset.getprincipalclef().isprincipalclef())
			this.addToSigClefs(cie);

		this.clef.setDrawInSig(this.clefset.contains(this.clef));
		this.clef.modernclef.setDrawInSig(this.modernclefset.contains(this.clef.modernclef));
	}

	/* if clef didn't get added to signature set, let's not display it in signature */
	/*------------------------------------------------------------------------
Method:  void removefromclefsets()
Purpose: Remove this clef from its clef sets (for deleting)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public removefromclefsets():void
	{
		this.clefset.removeclef(this.clef);
		this.modernclefset.removeclef(this.clef.modernclef);
	}

	/*------------------------------------------------------------------------
Method:  void selectClefStyle()
Purpose: Set clef display style based on note type and coloration scheme
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	selectClefStyle():void
	{
		this.clef.setFill(this.colored ? this.colorscheme.secondaryFill:this.colorscheme.primaryFill);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getPitch_1():Pitch
	{
		return this.clef.getclefletter() == "B" ? this.clef.pitch:null;
	}

	/*------------------------------------------------------------------------
Method:  ClefSet getClefSet(boolean usemodernclefs)
Purpose: Returns clef set from this event
Parameters:
  Input:  boolean usemodernclefs - whether to return modern clefs
  Output: -
  Return: clef set data
------------------------------------------------------------------------*/
	public getClefSet_1():ClefSet
	{
		return this.clefset;
	}

	public getClefSet_2(useModernAccSystem:boolean):ClefSet
	{
		return useModernAccSystem ? this.modernclefset:this.clefset;
	}

	public hasAccidentalClef_1():boolean
	{
		return this.clef.issharp() || this.clef.isflat();
	}

	public hasPrincipalClef_1():boolean
	{
		return this.clef.isprincipalclef();
	}

	public hasSignatureClef_1():boolean
	{
		return this.clef.issignatureclef() || this.clef.isprincipalclef();
	}

	public drawInSig(useModernClefs:boolean,useModernAccSystem:boolean):boolean
	{
		return this.getClef_1(useModernClefs,useModernAccSystem).drawInSig();
	}

	/*------------------------------------------------------------------------
Method:  Clef getClef(boolean useModernClefs,boolean useModernAccSystem)
Purpose: Returns clef data from this event
Parameters:
  Input:  boolean useModernClefs     - whether to return modern clefs
          boolean useModernAccSystem - whether to follow modern accidental rules
  Output: -
  Return: clef data
------------------------------------------------------------------------*/
	public getClef_1(useModernClefs:boolean,useModernAccSystem:boolean):Clef
	{
		if( ! this.clef.isprincipalclef())
			return useModernAccSystem ? this.clef.modernclef:this.clef;

		return useModernClefs ? this.clef.modernclef:this.clef;
	}

	public getClef_2():Clef
	{
		return this.getClef_1(false,false);
	}

	/*------------------------------------------------------------------------
Method:  int getnumclefsinset(boolean usemodernclefs)
Purpose: Returns number of clefs in multi-clef set
Parameters:
  Input:  boolean usemodernclefs - whether to use modern clef set
  Output: -
  Return: number of clefs
------------------------------------------------------------------------*/
	public getnumclefsinset(usemodernclefs:boolean):number
	{
		return usemodernclefs ? this.modernclefset.size():this.clefset.size();
	}

	/*------------------------------------------------------------------------
Method:  boolean contradicts(ClefEvent other,boolean usemodernclefs)
Purpose: Calculate whether this clef contradicts another one
Parameters:
  Input:  ClefEvent other        - event for comparison clef
          boolean usemodernclefs - whether to check modern clefs
  Output: -
  Return: Whether clefs conflict
------------------------------------------------------------------------*/
	/*
  public boolean contradicts(ClefEvent other,boolean usemodernclefs)
  {
    return usemodernclefs ? modernclefset.contradicts(other.modernclefset) :
                            clefset.contradicts(other.clefset);
  }*/
	/*------------------------------------------------------------------------
Method:  boolean containsClef(Clef c,boolean usemodernclefs)
Purpose: Calculate whether this multiple clef contains another
Parameters:
  Input:  Clef c                 - clef to check for inclusion
          boolean usemodernclefs - whether to check modern clefs
  Output: -
  Return: Whether c is contained in this
------------------------------------------------------------------------*/
	public containsClef(c:Clef,usemodernclefs:boolean):boolean
	{
		return usemodernclefs ? this.modernclefset.containsClef(c):this.clefset.containsClef(c);
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setClefSet_1(cs:ClefSet,usemodernclefs:boolean):void
	{
		if( ! usemodernclefs)
			this.clefset = cs;
		else
			this.modernclefset = cs;

	}

	public setSignature(s:boolean):void
	{
		this.clef.setSignature(s);
	}

	/* overrides Event methods */
	public setColored_1(c:boolean):void
	{
		super.setColored_1(c);
		this.selectClefStyle();
	}

	public setcolorparams_1(c:Coloration):void
	{
		this.colorscheme = c;
		this.selectClefStyle();
	}

	public modifyPitch_1(offset:number):void
	{
		this.getPitch_1().add(offset);
		this.clef.linespacenum += offset;
		this.clef.setDrawInSig(true);
		this.clef.modernclef.setDrawInSig(true);
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
		System.out.println(this.toString());
	}

	public toString():string
	{
		return this.clef.toString();
	}
}
