
import { System } from '../java/lang/System';
import { RenderedEvent } from './RenderedEvent';
import { RenderedClefSet } from './RenderedClefSet';
import { Proportion } from '../DataStruct/Proportion';

export class MeasureInfo
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public startMusicTime:Proportion;
	public startMusicTimeDbl:number;
	public xlength:number;
	public leftx:number;
	public numMinims:number;
	public reventindex:number[];
	public scaleSet:boolean;
	public defaultTempoProportion:Proportion;
	public tempoProportion:Proportion[];
	public startClefEvents:RenderedClefSet[];
	public startMensEvent:RenderedEvent[];
	public lastBeginClefIndex:number[];
	measurenum:number;
	numvoices:number;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: MeasureInfo(int mnum,int nv,Proportion mt,int nm,double xl,double left_x)
Purpose:     Initialize structure
Parameters:
  Input:  int mnum      - this measure's number
          int nv        - the number of music voices
          Proportion mt - music time at start of measure
          int nm        - number of minims in measure
          Proportion tempoProportion - proportion applied to measure
          double xl     - starting x length of measure
          double left_x - left x coord of measure
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(mnum:number,nv:number,mt:Proportion,nm:number,vTempoProportion:Proportion,xl:number,left_x:number)
	{
		this.measurenum = mnum;
		this.numvoices = nv;
		this.startMusicTime = Proportion.new1(mt);
		this.startMusicTimeDbl = this.startMusicTime.toDouble();
		this.numMinims = nm;
		this.xlength = xl;
		this.leftx = left_x;
		this.scaleSet = false;
		this.defaultTempoProportion = vTempoProportion;
		this.reventindex = Array(this.numvoices);
		this.startClefEvents = Array(this.numvoices);
		this.startMensEvent = Array(this.numvoices);
		this.tempoProportion = Array(this.numvoices);
		this.lastBeginClefIndex = Array(this.numvoices);
		for(
		let vi:number = 0;vi < this.numvoices;vi ++)
		{
			this.reventindex[vi]= - 1;
			this.tempoProportion[vi]= vTempoProportion;
			this.lastBeginClefIndex[vi]= - 1;
		}
	}

	public beginsWithClef(vnum:number):boolean
	{
		return this.lastBeginClefIndex[vnum]>= 0;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getEndMusicTime_1():Proportion
	{
		return Proportion.sum(this.startMusicTime,Proportion.quotient(Proportion.new0(this.numMinims,1),this.defaultTempoProportion));
	}

	public getEndMusicTime_2(vnum:number):Proportion
	{
		return Proportion.sum(this.startMusicTime,Proportion.quotient(Proportion.new0(this.numMinims,1),this.tempoProportion[vnum]));
	}

	public getMeasureNum():number
	{
		return this.measurenum;
	}

	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Print out information for all measures in list
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public prettyprint():void
	{
		System.out.println("*------- MEASURE " + this.measurenum + " -------*");
		System.out.println("Start time=" + this.startMusicTime + " Number of minims=" + this.numMinims);
		System.out.println("xlength=" + this.xlength);
		for(
		let i:number = 0;i < this.numvoices;i ++)
		System.out.print("REvIndex" + i + ": " + this.reventindex[i]+ ",");
		System.out.println();
	}
}
