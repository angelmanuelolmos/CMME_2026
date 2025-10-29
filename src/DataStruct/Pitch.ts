
import { Integer } from '../java/lang/Integer';
import { Math } from '../java/lang/Math';
import { Character } from '../java/lang/Character';
import { Clef } from './Clef';

/*----------------------------------------------------------------------*/
/*

        Module          : Pitch.java

        Package         : DataStruct

        Classes Included: Pitch

        Purpose         : Handle low-level pitch information

        Programmer      : Ted Dumitrescu

        Date Started    : 99

        Updates         : 3/21/05: added comparison function
                          3/29/05: converted Integer data (only needed for
                                   parser interface) to int
                          6/6/05:  added staffspacenum parameter (to allow
                                   clefless display)

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   Pitch
Extends: -
Purpose: Pitch information structure
------------------------------------------------------------------------*/
export class Pitch
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static HIGHEST_PITCH:Pitch = Pitch.new1("A",10000);
	public static LOWEST_PITCH:Pitch = Pitch.new1("A",- 10000);
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public noteletter:string;
	public octave:number;
	public placenum:number;
	/* Gamut place number */
	public staffspacenum:number;
	clef:Clef;

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  int calcplacenum(char nl,int o)
Purpose: Calculates Gamut place number from pitch letter and octave number
Parameters:
  Input:  char nl - pitch letter
          int o   - octave number
  Output: -
  Return: place number
------------------------------------------------------------------------*/
	public static calcplacenum(nl:string,o:number):number
	{
		return(((((( o * 7) | 0) + Character.codePointAt(nl,0)) | 0) - Character.codePointAt("A",0)) | 0);
	}

	public static new0(nl:string,o:number,c:Clef):Pitch
	{
		let _new0:Pitch = new Pitch;
		Pitch.set0(_new0,nl,o,c);
		return _new0;
	}

	public static set0(new0:Pitch,nl:string,o:number,c:Clef):void
	{
		new0.noteletter = nl;
		new0.octave = o;
		new0.placenum = Pitch.calcplacenum(nl,o);
		new0.clef = c;
		new0.staffspacenum = c != null ? c.calcypos(new0):0;
	}

	public static new1(nl:string,o:number):Pitch
	{
		let _new1:Pitch = new Pitch;
		Pitch.set1(_new1,nl,o);
		return _new1;
	}

	public static set1(new1:Pitch,nl:string,o:number):void
	{
		new1.noteletter = nl;
		new1.octave = o;
		new1.placenum =(((((( new1.octave * 7) | 0) + Character.codePointAt(new1.noteletter,0)) | 0) - Character.codePointAt("A",0)) | 0);
		new1.clef = null;
		new1.staffspacenum = 0;
	}

	public static new2(ssn:number):Pitch
	{
		let _new2:Pitch = new Pitch;
		Pitch.set2(_new2,ssn);
		return _new2;
	}

	public static set2(new2:Pitch,ssn:number):void
	{
		new2.noteletter = "X";
		new2.octave = 0;
		new2.placenum = 0;
		new2.clef = null;
		new2.staffspacenum = ssn;
	}

	public static new3(p:Pitch):Pitch
	{
		let _new3:Pitch = new Pitch;
		Pitch.set3(_new3,p);
		return _new3;
	}

	public static set3(new3:Pitch,p:Pitch):void
	{
		new3.noteletter = p.noteletter;
		new3.octave = p.octave;
		new3.placenum = p.placenum;
		new3.clef = p.clef;
		new3.staffspacenum = p.staffspacenum;
	}

	public static new4(p:Pitch,c:Clef):Pitch
	{
		let _new4:Pitch = new Pitch;
		Pitch.set4(_new4,p,c);
		return _new4;
	}

	public static set4(new4:Pitch,p:Pitch,c:Clef):void
	{
		new4.noteletter = p.noteletter;
		new4.octave = p.octave;
		new4.placenum = p.placenum;
		new4.clef = c;
		new4.staffspacenum = c != null ? c.calcypos(new4):0;
	}

	/*------------------------------------------------------------------------
Method:  void setclef(Clef c)
Purpose: Set clef information and assign Gamut place if it doesn't have one
Parameters:
  Input:  Clef c - new clef information
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setclef(c:Clef):void
	{
		if( this.noteletter == "X")
			{
				this.placenum =(( c.line1placenum + this.staffspacenum) | 0);
				this.octave =(( this.placenum / 7) | 0);
				this.noteletter = Character.toString(((( this.placenum % 7 + Character.codePointAt("A",0)) | 0)));
			}

		this.clef = c;
		this.staffspacenum = c != null ? c.calcypos(this):0;
	}

	public setOctave(o:number):void
	{
		this.octave = o;
		this.placenum = Pitch.calcplacenum(this.noteletter,this.octave);
	}

	/*------------------------------------------------------------------------
Method:  Pitch add(int offset)
Purpose: Change pitch
Parameters:
  Input:  int offset - amount to shift pitch
  Output: -
  Return: this
------------------------------------------------------------------------*/
	public add(offset:number):Pitch
	{
		if( this.noteletter == "X")
			this.staffspacenum += offset;
		else
			{
				this.placenum += offset;
				this.octave =(( this.placenum / 7) | 0);
				this.noteletter = Character.toString((( this.placenum % 7 + Character.codePointAt("A",0)) | 0));
				this.staffspacenum += offset;
			}

		return this;
	}

	/*------------------------------------------------------------------------
Method:  Pitch closestpitch(char nl)
Purpose: Calculates closest pitch with a given letter
Parameters:
  Input:  char nl - letter of pitch to calculate
  Output: -
  Return: closest pitch with letter nl
------------------------------------------------------------------------*/
	public closestpitch(nl:string):Pitch
	{
		let newoctave:number =(( this.octave - 1) | 0);
		let diff:number = Math.abs((( Pitch.calcplacenum(nl,newoctave) - this.placenum) | 0));
		while( Math.abs((( Pitch.calcplacenum(nl,(( newoctave + 1) | 0)) - this.placenum) | 0)) < diff)
		{
			newoctave ++;
			diff = Math.abs((( Pitch.calcplacenum(nl,newoctave) - this.placenum) | 0));
		}
		return Pitch.new0(nl,newoctave,this.clef);
	}

	/*------------------------------------------------------------------------
Method:  int calcypos(Clef c)
Purpose: Calculates staff position on which to display a pitch
Parameters:
  Input:  Clef c - clef for calculating position
  Output: -
  Return: y line/space position for displaying pitch
------------------------------------------------------------------------*/
	public calcypos(c:Clef):number
	{
		if( c != null)
			this.staffspacenum = c.calcypos(this);

		return this.staffspacenum;
	}

	/*------------------------------------------------------------------------
Method:  boolean equals(Pitch other)
Purpose: Calculate whether this pitch equals another one
Parameters:
  Input:  Pitch other - pitch against which to compare
  Output: -
  Return: Whether pitches are equal
------------------------------------------------------------------------*/
	public equals(other:Pitch):boolean
	{
		return this.placenum == other.placenum;
	}

	/*------------------------------------------------------------------------
Method:  boolean is[Higher|Lower]Than(Pitch other)
Purpose: Compare against another pitch
Parameters:
  Input:  Pitch p - pitch against which to compare
  Output: -
  Return: true if this is higher/lower than other
------------------------------------------------------------------------*/
	public isHigherThan(other:Pitch):boolean
	{
		return this.placenum > other.placenum;
	}

	public isLowerThan(other:Pitch):boolean
	{
		return this.placenum < other.placenum;
	}

	/*------------------------------------------------------------------------
Method:  int toMIDIPitch()
Purpose: Convert to MIDI pitch number (12-tone, middle C=60); no accidentals
Parameters:
  Input:  -
  Output: -
  Return: MIDI pitch integer
------------------------------------------------------------------------*/
	/* convert one letter to a 12-tone pitch number relative to A */
	static letterToMIDIPitch(nl:string):number
	{
		let p:number =((((( Character.codePointAt(nl,0) - Character.codePointAt("A",0)) | 0)) * 2) | 0);
		if( Character.codePointAt(nl,0) > Character.codePointAt("B",0))
			p --;

		if( Character.codePointAt(nl,0) > Character.codePointAt("E",0))
			p --;

		return p;
	}

	public toMIDIPitch():number
	{
		return((((((( this.octave * 12) | 0)) + 21) | 0) + Pitch.letterToMIDIPitch(this.noteletter)) | 0);
	}

	/*------------------------------------------------------------------------
Method:  String toString()
Purpose: Convert pitch to string
Parameters:
  Input:  -
  Output: -
  Return: string representation of pitch
------------------------------------------------------------------------*/
	public toString():string
	{
		return this.noteletter + Integer.toString(this.octave);
	}
}
