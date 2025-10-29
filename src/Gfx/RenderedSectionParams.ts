
import { RenderedEvent } from './RenderedEvent';
import { RenderedClefSet } from './RenderedClefSet';

export class RenderedSectionParams
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	clefSet:RenderedClefSet;
	mensEvent:RenderedEvent;
	public usedInSection:boolean;

	public static new0():RenderedSectionParams
	{
		let _new0:RenderedSectionParams = new RenderedSectionParams;
		RenderedSectionParams.set0(_new0);
		return _new0;
	}

	public static set0(new0:RenderedSectionParams):void
	{
		new0.clefSet = null;
		new0.mensEvent = null;
		new0.usedInSection = false;
	}

	public static new1(rsp:RenderedSectionParams):RenderedSectionParams
	{
		let _new1:RenderedSectionParams = new RenderedSectionParams;
		RenderedSectionParams.set1(_new1,rsp);
		return _new1;
	}

	public static set1(new1:RenderedSectionParams,rsp:RenderedSectionParams):void
	{
		new1.clefSet = rsp.clefSet;
		new1.mensEvent = rsp.mensEvent;
		new1.usedInSection = rsp.usedInSection;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getClefSet():RenderedClefSet
	{
		return this.clefSet;
	}

	public getMens():RenderedEvent
	{
		return this.mensEvent;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setClefSet(cs:RenderedClefSet):void
	{
		this.clefSet = cs;
	}

	public setMens(me:RenderedEvent):void
	{
		this.mensEvent = me;
	}
}
