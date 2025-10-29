
import { System } from '../java/lang/System';
import { Proportion } from './Proportion';
import { Event } from './Event';

/*----------------------------------------------------------------------*/
/*

        Module          : Mensuration.java

        Package         : DataStruct

        Classes Included: Mensuration

        Purpose         : Mensuration description structure

        Programmer      : Ted Dumitrescu

        Date Started    : 11/30/05

        Updates         :
2/24/06:  changed MENS_BINARY and MENS_TERNARY constants to 2 and 3, to allow
          instance variables to be used directly in calculations
12/22/08: added tempo change information

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   Mensuration
Extends: Event
Purpose: Structure to hold information about mensuration
------------------------------------------------------------------------*/
export class Mensuration
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static MENS_BINARY:number = 2;
	public static MENS_TERNARY:number = 3;
	public static DEFAULT_TEMPO_CHANGE:Proportion = Proportion.new0(1,1);
	public static DEFAULT_MENSURATION:Mensuration = Mensuration.new0(Mensuration.MENS_BINARY,Mensuration.MENS_BINARY,Mensuration.MENS_BINARY,Mensuration.MENS_BINARY);
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	/* four levels of mensural division (currently BINARY or TERNARY) */
	public prolatio:number;
	public tempus:number;
	public modus_minor:number;
	public modus_maior:number;
	public tempoChange:Proportion;

	public static new0(p:number,t:number,m1:number,m2:number):Mensuration
	{
		let _new0:Mensuration = new Mensuration;
		Mensuration.set0(_new0,p,t,m1,m2);
		return _new0;
	}

	public static set0(new0:Mensuration,p:number,t:number,m1:number,m2:number):void
	{
		Mensuration.set1(new0,p,t,m1,m2,Mensuration.DEFAULT_TEMPO_CHANGE);
	}

	public static new1(p:number,t:number,m1:number,m2:number,tempoChange:Proportion):Mensuration
	{
		let _new1:Mensuration = new Mensuration;
		Mensuration.set1(_new1,p,t,m1,m2,tempoChange);
		return _new1;
	}

	public static set1(new1:Mensuration,p:number,t:number,m1:number,m2:number,tempoChange:Proportion):void
	{
		new1.prolatio = p;
		new1.tempus = t;
		new1.modus_minor = m1;
		new1.modus_maior = m2;
		new1.tempoChange = Proportion.new1(tempoChange);
	}

	public static new2(other:Mensuration):Mensuration
	{
		let _new2:Mensuration = new Mensuration;
		Mensuration.set2(_new2,other);
		return _new2;
	}

	public static set2(new2:Mensuration,other:Mensuration):void
	{
		if( other == null)
			new2.copyMensuration(Mensuration.DEFAULT_MENSURATION);
		else
			new2.copyMensuration(other);

	}

	public copyMensuration(other:Mensuration):void
	{
		this.prolatio = other.prolatio;
		this.tempus = other.tempus;
		this.modus_minor = other.modus_minor;
		this.modus_maior = other.modus_maior;
		this.tempoChange = Proportion.new1(other.tempoChange);
	}

	/*------------------------------------------------------------------------
Method:  boolean equals(Mensuration m)
Purpose: Compare for equality against another mensuration
Parameters:
  Input:  Mensuration m - mensuration to compare
  Output: -
  Return: true if equal
------------------------------------------------------------------------*/
	public equals(m:Mensuration):boolean
	{
		return m.prolatio == this.prolatio && m.tempus == this.tempus && m.modus_minor == this.modus_minor && m.modus_maior == this.modus_maior && m.tempoChange.equals(this.tempoChange);
	}

	/*------------------------------------------------------------------------
Method:  boolean ternary(int noteType)
Purpose: Check if a note type is ternary under this mensuration
Parameters:
  Input:  int noteType - note type to check
  Output: -
  Return: true if type is ternary
------------------------------------------------------------------------*/
	public ternary(noteType:number):boolean
	{
		switch( noteType)
		{
			case Event.NT_Semibrevis:
			{
				return this.prolatio == Mensuration.MENS_TERNARY;
			}
			case Event.NT_Brevis:
			{
				return this.tempus == Mensuration.MENS_TERNARY;
			}
			case Event.NT_Longa:
			{
				return this.modus_minor == Mensuration.MENS_TERNARY;
			}
			case Event.NT_Maxima:
			{
				return this.modus_maior == Mensuration.MENS_TERNARY;
			}
		}
		return false;
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
		System.out.print(this.prolatio == Mensuration.MENS_TERNARY ? "3":"2");
		System.out.print(this.tempus == Mensuration.MENS_TERNARY ? "3":"2");
		System.out.print(this.modus_minor == Mensuration.MENS_TERNARY ? "3":"2");
		System.out.print(this.modus_maior == Mensuration.MENS_TERNARY ? "3":"2");
		if( ! this.tempoChange.equals(Mensuration.DEFAULT_TEMPO_CHANGE))
			System.out.print(" Tempo: " + this.tempoChange);

		System.out.println();
	}
}
