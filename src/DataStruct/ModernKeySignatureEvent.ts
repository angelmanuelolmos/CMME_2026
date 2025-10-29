
import { ModernKeySignature } from './ModernKeySignature';
import { Event } from './Event';

/*----------------------------------------------------------------------*/
/*

        Module          : ModernKeySignatureEvent.java

        Package         : DataStruct

        Classes Included: ModernKeySignatureEvent

        Purpose         : Event type for modern key signatures/signature changes

        Programmer      : Ted Dumitrescu

        Date Started    : 7/25/06

        Updates         :

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   ModernKeySignatureEvent
Extends: Event
Purpose: Data/routines for modern key signature events
------------------------------------------------------------------------*/
export class ModernKeySignatureEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	sig:ModernKeySignature;

	public static new21():ModernKeySignatureEvent
	{
		let _new21:ModernKeySignatureEvent = new ModernKeySignatureEvent;
		ModernKeySignatureEvent.set21(_new21);
		return _new21;
	}

	public static set21(new21:ModernKeySignatureEvent):void
	{
		ModernKeySignatureEvent.set22(new21,ModernKeySignature.DEFAULT_SIG);
	}

	public static new22(s:ModernKeySignature):ModernKeySignatureEvent
	{
		let _new22:ModernKeySignatureEvent = new ModernKeySignatureEvent;
		ModernKeySignatureEvent.set22(_new22,s);
		return _new22;
	}

	public static set22(new22:ModernKeySignatureEvent,s:ModernKeySignature):void
	{
		Event.set0(new22);
		new22.eventtype = ModernKeySignatureEvent.EVENT_MODERNKEYSIGNATURE;
		new22.sig = ModernKeySignature.new1(s);
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
		let e:Event = ModernKeySignatureEvent.new22(this.sig);
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

		let otherMKE:ModernKeySignatureEvent =<ModernKeySignatureEvent> other;
		return this.sig.equals(otherMKE.sig);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getSigInfo():ModernKeySignature
	{
		return this.sig;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addFlat():void
	{
		this.sig.addFlat();
	}

	public addSharp():void
	{
		this.sig.addSharp();
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
		this.sig.prettyprint();
	}
}
