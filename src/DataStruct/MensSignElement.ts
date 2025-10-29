
import { System } from '../java/lang/System';
import { Proportion } from './Proportion';

/*----------------------------------------------------------------------*/
/*

        Module          : MensSignElement.java

        Package         : DataStruct

        Classes Included: MensSignElement

        Purpose         : One item in a mensuration sign (symbol, number, etc)

        Programmer      : Ted Dumitrescu

        Date Started    : 7/31/06

        Updates         :

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   MensSignElement
Extends: Event
Purpose: One element in a mensuration sign
------------------------------------------------------------------------*/
export class MensSignElement
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static NO_SIGN:number = 0;
	public static NUMBERS:number = 1;
	public static MENS_SIGN_O:number = 2;
	public static MENS_SIGN_C:number = 3;
	public static MENS_SIGN_CREV:number = 4;
	public static signNames:string[]=["NoSign","Numbers","O","C","CRev"];
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public signType:number;
	public dotted:boolean;
	public stroke:boolean;
	public number:Proportion;

	public static new0(st:number,d:boolean,str:boolean):MensSignElement
	{
		let _new0:MensSignElement = new MensSignElement;
		MensSignElement.set0(_new0,st,d,str);
		return _new0;
	}

	public static set0(new0:MensSignElement,st:number,d:boolean,str:boolean):void
	{
		new0.signType = st;
		new0.dotted = d;
		new0.stroke = str;
		new0.number = null;
	}

	public static new1(st:number,n:Proportion):MensSignElement
	{
		let _new1:MensSignElement = new MensSignElement;
		MensSignElement.set1(_new1,st,n);
		return _new1;
	}

	public static set1(new1:MensSignElement,st:number,n:Proportion):void
	{
		new1.signType = st;
		new1.number = Proportion.new1(n);
	}

	public static new2(other:MensSignElement):MensSignElement
	{
		let _new2:MensSignElement = new MensSignElement;
		MensSignElement.set2(_new2,other);
		return _new2;
	}

	public static set2(new2:MensSignElement,other:MensSignElement):void
	{
		new2.signType = other.signType;
		new2.dotted = other.dotted;
		new2.stroke = other.stroke;
		new2.number =( other.number == null) ? null:Proportion.new1(other.number);
	}

	public equals(other:MensSignElement):boolean
	{
		if( this.number == null)
			return other.number == null && this.signType == other.signType && this.dotted == other.dotted && this.stroke == other.stroke;
		else
			return other.number != null && this.number.equals(other.number) && this.signType == other.signType;

	}

	/*------------------------------------------------------------------------
Method:  String toString()
Purpose: Convert to string representation of main element
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public toString():string
	{
		switch( this.signType)
		{
			case MensSignElement.MENS_SIGN_C:
			{
			}
			case MensSignElement.MENS_SIGN_CREV:
			{
				return "C";
			}
			case MensSignElement.MENS_SIGN_O:
			{
				return "O";
			}
			case MensSignElement.NUMBERS:
			{
				if( this.number.i2 == 0)
					return `${this.number.i1}`;
				else
					return this.number.i1 + "/" + this.number.i2;

			}
		}
		return "!!!";
	}

	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Prints information about this structure
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public prettyprint():void
	{
		System.out.print(MensSignElement.signNames[this.signType]);
		if( this.signType == MensSignElement.NO_SIGN)
			{
				System.out.println();
				return;
			}

		if( this.signType == MensSignElement.NUMBERS)
			{
				System.out.print(": " + this.number.i1);
				if( this.number.i2 != 0)
					System.out.print("/" + this.number.i2);

				System.out.println();
			}

		else
			{
				if( this.dotted)
					System.out.print("Dot");

				if( this.stroke)
					System.out.print("Stroke");

				System.out.println();
			}

	}
}
