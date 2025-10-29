
import { System } from '../java/lang/System';

/*----------------------------------------------------------------------*/
/*

        Module          : ModernAccidental.java

        Package         : DataStruct

        Classes Included: ModernAccidental

        Purpose         : Handle low-level accidental information for modern
                          notation (sharp/flat/natural rather than square b/
                          diesis/round b)

        Programmer      : Ted Dumitrescu

        Date Started    : 12/22/05

        Updates         :
4/25/06: added "optional" flag (display accidental in parentheses)
7/8/08:  converted note accidental to simple pitch offset integer
         (leaving appearance to be decided by renderer)

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   ModernAccidental
Extends: -
Purpose: Modern accidental information structure
------------------------------------------------------------------------*/
export class ModernAccidental
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static ACC_Flat:number = 0;
	public static ACC_Natural:number = 1;
	public static ACC_Sharp:number = 2;
	public static ACC_NONE:number = 3;
	public static AccidentalNames:string[]=["Flat","Natural","Sharp","NONE"];
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public pitchOffset:number;
	/* -1==1 step flatward from natural, 1==sharp, etc */
	public optional:boolean;
	/* true for accidentals considered optional */
	/* only for signature accidentals */
	public accType:number;
	/* flat/natural/sharp */
	public numAcc:number;

	/* number of applications: 2 for double-flat, etc. */
	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  int strtoMA(String at)
Purpose: Convert string to accidental type number
Parameters:
  Input:  String at - string to convert
  Output: -
  Return: accidental type number
------------------------------------------------------------------------*/
	public static strtoMA(at:string):number
	{
		let i:number;
		for(
		i = 0;i < ModernAccidental.AccidentalNames.length;i ++)
		if(( at == ModernAccidental.AccidentalNames[i]))
			return i;

		if( i == ModernAccidental.AccidentalNames.length)
			i =(( ModernAccidental.AccidentalNames.length - 1) | 0);

		return i;
	}

	/*------------------------------------------------------------------------
Method:  ModernAccidental pitchOffsetToAcc(int po)
Purpose: Convert numerical pitch offset to accidental
Parameters:
  Input:  int po - pitch offset
  Output: -
  Return: new accidental
------------------------------------------------------------------------*/
	public static pitchOffsetToAcc(po:number):ModernAccidental
	{
		if( po < 0)
			return ModernAccidental.new1(ModernAccidental.ACC_Flat,(( 0 - po) | 0));
		else
			if( po > 0)
				return ModernAccidental.new1(ModernAccidental.ACC_Sharp,po);

		return ModernAccidental.new1(ModernAccidental.ACC_Natural,1);
	}

	public static new0(at:number,na:number,o:boolean):ModernAccidental
	{
		let _new0:ModernAccidental = new ModernAccidental;
		ModernAccidental.set0(_new0,at,na,o);
		return _new0;
	}

	public static set0(new0:ModernAccidental,at:number,na:number,o:boolean):void
	{
		new0.accType = at;
		new0.numAcc = na;
		new0.optional = o;
	}

	public static new1(at:number,na:number):ModernAccidental
	{
		let _new1:ModernAccidental = new ModernAccidental;
		ModernAccidental.set1(_new1,at,na);
		return _new1;
	}

	public static set1(new1:ModernAccidental,at:number,na:number):void
	{
		ModernAccidental.set0(new1,at,na,false);
	}

	public static new2(at:number):ModernAccidental
	{
		let _new2:ModernAccidental = new ModernAccidental;
		ModernAccidental.set2(_new2,at);
		return _new2;
	}

	public static set2(new2:ModernAccidental,at:number):void
	{
		ModernAccidental.set0(new2,at,1,false);
	}

	public static new3(pitchOffset:number,optional:boolean):ModernAccidental
	{
		let _new3:ModernAccidental = new ModernAccidental;
		ModernAccidental.set3(_new3,pitchOffset,optional);
		return _new3;
	}

	public static set3(new3:ModernAccidental,pitchOffset:number,optional:boolean):void
	{
		new3.pitchOffset = pitchOffset;
		new3.optional = optional;
		new3.accType = ModernAccidental.ACC_NONE;
	}

	public static new4(other:ModernAccidental):ModernAccidental
	{
		let _new4:ModernAccidental = new ModernAccidental;
		ModernAccidental.set4(_new4,other);
		return _new4;
	}

	public static set4(new4:ModernAccidental,other:ModernAccidental):void
	{
		new4.pitchOffset = other.pitchOffset;
		new4.optional = other.optional;
		new4.accType = other.accType;
		new4.numAcc = other.numAcc;
	}

	/*------------------------------------------------------------------------
Method:  int calcPitchOffset()
Purpose: Calculate a numerical representation of the pitch distance from
         a 'natural' state (-1==1 flat, -2==2 flats, etc.)
Parameters:
  Input:  -
  Output: -
  Return: numerical pitch offset
------------------------------------------------------------------------*/
	public calcPitchOffset():number
	{
		switch( this.accType)
		{
			case ModernAccidental.ACC_Flat:
			{
				return(( 0 - this.numAcc) | 0);
			}
			case ModernAccidental.ACC_Sharp:
			{
				return this.numAcc;
			}
		}
		return 0;
	}

	/*------------------------------------------------------------------------
Method:  boolean equals(ModernAccidental other)
Purpose: Compare two accidentals for equality
Parameters:
  Input:  ModernAccidental other - accidental for comparison to this
  Output: -
  Return: true if accidentals are equal (type and number of applications)
------------------------------------------------------------------------*/
	public equals(other:ModernAccidental):boolean
	{
		if( other == null)
			return false;

		if( this.accType == ModernAccidental.ACC_NONE)
			return this.pitchOffset == other.pitchOffset && this.optional == other.optional;

		return this.accType == other.accType && this.numAcc == other.numAcc;
	}

	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Prints information about this modern accidental
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public prettyprint():void
	{
		System.out.print("    Modern accidental: " + ModernAccidental.AccidentalNames[this.accType]);
		if( this.numAcc > 1)
			System.out.print(" (x" + this.numAcc + ")");

		if( this.optional)
			System.out.print(" (optional)");

		System.out.println();
	}
}
