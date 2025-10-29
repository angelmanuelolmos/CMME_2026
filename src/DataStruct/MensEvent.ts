
import { System } from '../java/lang/System';
import { Proportion } from './Proportion';
import { Mensuration } from './Mensuration';
import { MensSignElement } from './MensSignElement';
import { Event } from './Event';
import { Iterator } from '../java/util/Iterator';
import { LinkedList } from '../java/util/LinkedList';

export class MensEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	mensInfo:Mensuration;
	signs:LinkedList<MensSignElement>;
	ssnum:number;
	/* place on staff */
	_small:boolean;
	_vertical:boolean;
	/* visual arrangement of multiple signs */
	_noScoreSig:boolean;

	public static new17(sl:LinkedList<MensSignElement>,ssn:number,sm:boolean,v:boolean,mi:Mensuration,noScoreSig:boolean):MensEvent
	{
		let _new17:MensEvent = new MensEvent;
		MensEvent.set17(_new17,sl,ssn,sm,v,mi,noScoreSig);
		return _new17;
	}

	public static set17(new17:MensEvent,sl:LinkedList<MensSignElement>,ssn:number,sm:boolean,v:boolean,mi:Mensuration,noScoreSig:boolean):void
	{
		Event.set0(new17);
		new17.eventtype = MensEvent.EVENT_MENS;
		new17.signs = sl;
		new17.ssnum = ssn;
		new17._small = sm;
		new17._vertical = v;
		new17._noScoreSig = noScoreSig;
		if( mi != null)
			new17.mensInfo = mi;
		else
			new17.initMensInfo();

	}

	public static new18(sl:LinkedList<MensSignElement>,ssn:number,sm:boolean,v:boolean,mi:Mensuration):MensEvent
	{
		let _new18:MensEvent = new MensEvent;
		MensEvent.set18(_new18,sl,ssn,sm,v,mi);
		return _new18;
	}

	public static set18(new18:MensEvent,sl:LinkedList<MensSignElement>,ssn:number,sm:boolean,v:boolean,mi:Mensuration):void
	{
		MensEvent.set17(new18,sl,ssn,sm,v,mi,false);
	}

	public static new19(sl:LinkedList<MensSignElement>,ssn:number,sm:boolean,v:boolean):MensEvent
	{
		let _new19:MensEvent = new MensEvent;
		MensEvent.set19(_new19,sl,ssn,sm,v);
		return _new19;
	}

	public static set19(new19:MensEvent,sl:LinkedList<MensSignElement>,ssn:number,sm:boolean,v:boolean):void
	{
		MensEvent.set18(new19,sl,ssn,sm,v,null);
	}

	public static new20(sl:LinkedList<MensSignElement>,ssn:number):MensEvent
	{
		let _new20:MensEvent = new MensEvent;
		MensEvent.set20(_new20,sl,ssn);
		return _new20;
	}

	public static set20(new20:MensEvent,sl:LinkedList<MensSignElement>,ssn:number):void
	{
		MensEvent.set19(new20,sl,ssn,false,false);
	}

	initMensInfo():void
	{
		let mainEl:MensSignElement = this.getMainSign();
		this.mensInfo = Mensuration.new0(mainEl.dotted ? Mensuration.MENS_TERNARY:Mensuration.MENS_BINARY,mainEl.signType == MensSignElement.MENS_SIGN_O ? Mensuration.MENS_TERNARY:Mensuration.MENS_BINARY,Mensuration.MENS_BINARY,Mensuration.MENS_BINARY);
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
		let copySigns:LinkedList<MensSignElement> = new LinkedList<MensSignElement>();
		for(let s of this.signs)
		copySigns.add(MensSignElement.new2(s));
		let e:Event = MensEvent.new17(copySigns,this.ssnum,this._small,this._vertical,Mensuration.new2(this.mensInfo),this._noScoreSig);
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

		let otherME:MensEvent =<MensEvent> other;
		if( this.signs.size() != otherME.signs.size())
			return false;

		for(
		let i:number = 0;i < this.signs.size();i ++)
		if( ! this.signs.get(i).equals(otherME.signs.get(i)))
			return false;

		return this.mensInfo.equals(otherME.mensInfo) && this.ssnum == otherME.ssnum && this._small == otherME._small && this._noScoreSig == otherME._noScoreSig && this._vertical == otherME._vertical;
	}

	public signEquals(otherME:MensEvent):boolean
	{
		if( this.signs.size() != otherME.signs.size())
			return false;

		for(
		let i:number = 0;i < this.signs.size();i ++)
		if( ! this.signs.get(i).equals(otherME.signs.get(i)))
			return false;

		return true;
	}

	/*------------------------------------------------------------------------
Methods: boolean nonStandard()
Purpose: Determine whether the mensural interpretation of this sign is standard
         (e.g., O = perfect tempus, minor prolatio)
Parameters:
  Input:  -
  Output: -
  Return: true if non-standard mensural interpretation of sign
------------------------------------------------------------------------*/
	public nonStandard():boolean
	{
		if( this.signs.size() > 1)
			return true;

		if( ! this.mensInfo.tempoChange.equals(Mensuration.DEFAULT_TEMPO_CHANGE))
			return true;

		let mainEl:MensSignElement = this.getMainSign();
		if( mainEl.dotted && this.mensInfo.prolatio != Mensuration.MENS_TERNARY)
			return true;

		switch( mainEl.signType)
		{
			case MensSignElement.MENS_SIGN_O:
			{
				if( this.mensInfo.tempus != Mensuration.MENS_TERNARY)
					return true;

				break;
			}
			case MensSignElement.MENS_SIGN_C:
			{
				if( this.mensInfo.tempus == Mensuration.MENS_TERNARY)
					return true;

				break;
			}
			default:
			{
				return true;
			}
		}
		if( this.mensInfo.modus_minor == Mensuration.MENS_TERNARY || this.mensInfo.modus_maior == Mensuration.MENS_TERNARY)
			return true;

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
	public getMensInfo_1():Mensuration
	{
		return this.mensInfo;
	}

	public getSigns():LinkedList<MensSignElement>
	{
		return this.signs;
	}

	public getMainSign():MensSignElement
	{
		return<MensSignElement> this.signs.getFirst();
	}

	public getStaffLoc():number
	{
		return this.ssnum;
	}

	public iterator_1():Iterator<MensSignElement>
	{
		return this.signs.iterator();
	}

	public getTempoChange():Proportion
	{
		return this.mensInfo.tempoChange;
	}

	public noScoreSig():boolean
	{
		return this._noScoreSig;
	}

	public small():boolean
	{
		return this._small;
	}

	public vertical():boolean
	{
		return this._vertical;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set parameters and options
Parameters:
  Input:  new values for parameters and options
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addSignElement(mse:MensSignElement):void
	{
		this.signs.add(mse);
	}

	public deleteSignElement(elNum:number):void
	{
		this.signs.remove(elNum);
	}

	public setMensInfo(m:Mensuration):void
	{
		this.mensInfo = m;
	}

	public setNoScoreSig(noScoreSig:boolean):void
	{
		this._noScoreSig = noScoreSig;
	}

	public setStaffLoc(ssn:number):void
	{
		this.ssnum = ssn;
	}

	public setTempoChange(tempoChange:Proportion):void
	{
		this.mensInfo.tempoChange = Proportion.new1(tempoChange);
	}

	public toggleNoScoreSig():void
	{
		this._noScoreSig = ! this._noScoreSig;
	}

	public toggleSize():void
	{
		this._small = ! this._small;
	}

	public toggleVertical():void
	{
		this._vertical = ! this._vertical;
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
		System.out.println("    Mensuration: ");
		for(
		let i:Iterator<MensSignElement> = this.iterator_1();i.hasNext();)
		(<MensSignElement> i.next()).prettyprint();
		if( this.nonStandard())
			{
				System.out.println("    ");
				this.mensInfo.prettyprint();
			}

	}
}
