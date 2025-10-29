
import { System } from '../java/lang/System';
import { VoiceEventListData } from './VoiceEventListData';
import { Voice } from './Voice';
import { VariantVersionData } from './VariantVersionData';
import { VariantReading } from './VariantReading';
import { Proportion } from './Proportion';
import { Event } from './Event';
import { ArrayList } from '../java/util/ArrayList';
import { List } from '../java/util/List';
import { LinkedList } from '../java/util/LinkedList';

export class VariantMarkerEvent extends Event
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	readings:ArrayList<VariantReading>;
	/* simultaneous variant readings */
	defaultLength:Proportion;
	/* length of default reading */
	varTypeFlags:number;

	public static new33(eventType:number):VariantMarkerEvent
	{
		let _new33:VariantMarkerEvent = new VariantMarkerEvent;
		VariantMarkerEvent.set33(_new33,eventType);
		return _new33;
	}

	public static set33(new33:VariantMarkerEvent,eventType:number):void
	{
		VariantMarkerEvent.set34(new33,eventType,null);
	}

	public static new34(eventType:number,readings:ArrayList<VariantReading>):VariantMarkerEvent
	{
		let _new34:VariantMarkerEvent = new VariantMarkerEvent;
		VariantMarkerEvent.set34(_new34,eventType,readings);
		return _new34;
	}

	public static set34(new34:VariantMarkerEvent,eventType:number,readings:ArrayList<VariantReading>):void
	{
		Event.set0(new34);
		new34.eventtype = eventType;
		new34.readings = readings != null ? readings:new ArrayList<VariantReading>();
		new34.defaultLength = Proportion.new0(0,1);
	}

	/*------------------------------------------------------------------------
Methods: long calcVariantTypes(VoiceEventListData v)
Purpose: Calculate which types of variant are present within this set of
         readings
Parameters:
  Input:  VoiceEventListData v - default event list of voice containing this
  Output: -
  Return: new flags
------------------------------------------------------------------------*/
	public calcVariantTypes(v:VoiceEventListData):number
	{
		let newFlags:number = VariantReading.VAR_NONE;
		let varStarti:number =(( this.getDefaultListPlace() + 1) | 0);
		for(let r of this.readings)
		{
			r.recalcEventParams(this);
			newFlags |= r.calcVariantTypes(v,varStarti);
		}
		if( newFlags == VariantReading.VAR_NONE)
			newFlags = VariantReading.VAR_NONSUBSTANTIVE;

		this.varTypeFlags = newFlags;
		return this.varTypeFlags;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getDefaultLength():Proportion
	{
		return this.defaultLength;
	}

	public getNumReadings():number
	{
		return this.readings.size();
	}

	public getReading(i:number):VariantReading
	{
		return this.readings.get(i);
	}

	public getReadings():ArrayList<VariantReading>
	{
		return this.readings;
	}

	public getVarTypeFlags():number
	{
		return this.varTypeFlags;
	}

	public includesVarType(varType:number):boolean
	{
		return( this.varTypeFlags & varType) != 0;
	}

	/* get reading associated with a specific version */
	public getVariantReading_1(version:VariantVersionData):VariantReading
	{
		for(let vr of this.readings)
		if( vr.includesVersion(version))
			return vr;

		return null;
	}

	public getDefaultVersions(allVersions:List<VariantVersionData>,v:Voice,veld:VoiceEventListData):LinkedList<VariantVersionData>
	{
		let defaultVersions:LinkedList<VariantVersionData> = new LinkedList<VariantVersionData>();
		for(let vvd of allVersions)
		if( this.getVariantReading_1(vvd) == null)
			defaultVersions.add(vvd);

		for(let vvd of veld.getMissingVersions())
		defaultVersions.remove(vvd);
		let versionsToRemove:LinkedList<VariantVersionData> = new LinkedList<VariantVersionData>();
		for(let vvd of defaultVersions)
		if( vvd.isVoiceMissing(v))
			versionsToRemove.add(vvd);

		for(let vvd of versionsToRemove)
		defaultVersions.remove(vvd);
		return defaultVersions;
	}

	/* remove versions from default list if they are missing the current
       section */
	/* remove versions which are missing the current voice entirely */
	public inVariant_1():boolean
	{
		return true;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addReading(vr:VariantReading):void
	{
		this.readings.add(vr);
	}

	public removeReading(vr:VariantReading):void
	{
		this.readings.remove(vr);
	}

	public setDefaultLength(p:Proportion):void
	{
		this.defaultLength = p;
	}

	public setReadingsList(readings:ArrayList<VariantReading>):void
	{
		this.readings = readings;
	}

	public setVarTypeFlags(newval:number):void
	{
		this.varTypeFlags = newval;
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
		System.out.print("    Variant ");
		if( this.eventtype == Event.EVENT_VARIANTDATA_START)
			System.out.println("begin");
		else
			System.out.println("end");

	}
}
