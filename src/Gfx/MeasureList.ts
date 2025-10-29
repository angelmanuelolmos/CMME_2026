
import { MeasureInfo } from './MeasureInfo';
import { ArrayList } from '../java/util/ArrayList';
import { Iterator } from '../java/util/Iterator';
import { Proportion } from '../DataStruct/Proportion';

export class MeasureList extends ArrayList<MeasureInfo>
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	numvoices:number;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: MeasureList(int nv)
Purpose:     Initialize list
Parameters:
  Input:  int nv - the number of music voices
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(nv:number)
	{
		super();
		this.numvoices = nv;
	}

	/*------------------------------------------------------------------------
Method:  MeasureInfo newMeasure(int mnum,Proportion mt,int nm,double xl,double leftx)
Purpose: Create a new measure and add to list
Parameters:
  Input:  int mnum      - measure number
          Proportion mt - music time at start of measure
          int nm        - number of minims in measure
          Proportion tempoProportion - proportion applied to measure
          double xl    - starting x length of measure
          double leftx - left x coord of measure
  Output: -
  Return: new measure info
------------------------------------------------------------------------*/
	public newMeasure(mnum:number,mt:Proportion,nm:number,tempoProportion:Proportion,xl:number,leftx:number):MeasureInfo
	{
		let newm:MeasureInfo = new MeasureInfo(mnum,this.numvoices,mt,nm,tempoProportion,xl,leftx);
		this.add(newm);
		return newm;
	}

	/*------------------------------------------------------------------------
Method:  MeasureInfo getMeasure(int i)
Purpose: Get measure at specified index from list
Parameters:
  Input:  int i - index of event
  Output: -
  Return: Requested measure
------------------------------------------------------------------------*/
	public getMeasure(i:number):MeasureInfo
	{
		return i < this.size() ?<MeasureInfo> this.get(i):null;
	}

	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Print out information for all measures in list
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public prettyprint_2():void
	{
		for(
		let i:Iterator<MeasureInfo> = this.iterator();i.hasNext();)
		(<MeasureInfo> i.next()).prettyprint();
	}
}
