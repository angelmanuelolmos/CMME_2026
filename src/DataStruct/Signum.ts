
import { System } from '../java/lang/System';

/*----------------------------------------------------------------------*/
/*

        Module          : Signum.java

        Package         : DataStruct

        Classes Included: Signum

        Purpose         : Handle signum congruentiae or corona attached to
                          score element

        Programmer      : Ted Dumitrescu

        Date Started    : 11/9/06

        Updates         :

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   Signum
Extends: -
Purpose: One signum congruentiae or corona
------------------------------------------------------------------------*/
export class Signum
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static UP:number = 0;
	public static DOWN:number = 1;
	public static LEFT:number = 0;
	public static MIDDLE:number = 1;
	public static RIGHT:number = 2;
	public static DEFAULT_YOFFSET:number = 4;
	public static orientationNames:string[]=["Up","Down"];
	public static sideNames:string[]=["Left","Middle","Right"];
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public offset:number;
	public orientation:number;
	public side:number;

	public static new0(of:number,or:number,s:number):Signum
	{
		let _new0:Signum = new Signum;
		Signum.set0(_new0,of,or,s);
		return _new0;
	}

	public static set0(new0:Signum,of:number,or:number,s:number):void
	{
		new0.offset = of;
		new0.orientation = or;
		new0.side = s;
	}

	public static new1(or:number,s:number):Signum
	{
		let _new1:Signum = new Signum;
		Signum.set1(_new1,or,s);
		return _new1;
	}

	public static set1(new1:Signum,or:number,s:number):void
	{
		Signum.set0(new1,Signum.DEFAULT_YOFFSET,or,s);
	}

	public static new2(other:Signum):Signum
	{
		let _new2:Signum = new Signum;
		Signum.set2(_new2,other);
		return _new2;
	}

	public static set2(new2:Signum,other:Signum):void
	{
		new2.offset = other.offset;
		new2.orientation = other.orientation;
		new2.side = other.side;
	}

	public equals(other:Signum):boolean
	{
		return other != null && this.offset == other.offset && this.orientation == other.orientation && this.side == other.side;
	}

	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Prints information about this element
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public prettyprint():void
	{
		System.out.println("    Signum");
	}
}
