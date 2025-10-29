
import { System } from '../java/lang/System';
import { Character } from '../java/lang/Character';
import { Pitch } from './Pitch';
import { ModernKeySignature } from './ModernKeySignature';
import { ModernAccidental } from './ModernAccidental';
import { Clef } from './Clef';

/*----------------------------------------------------------------------*/
/*

        Module          : ModernKeySignatureElement.java

        Package         : DataStruct

        Classes Included: ModernKeySignatureElement

        Purpose         : Handle one element (flat, sharp) in a modern key
                          signature

        Programmer      : Ted Dumitrescu

        Date Started    : 7/25/06

        Updates         :

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   ModernKeySignatureElement
Extends: -
Purpose: One accidental element in a key signature
------------------------------------------------------------------------*/
export class ModernKeySignatureElement
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public pitch:Pitch;
	public accidental:ModernAccidental;

	public static new0(p:Pitch,a:ModernAccidental):ModernKeySignatureElement
	{
		let _new0:ModernKeySignatureElement = new ModernKeySignatureElement;
		ModernKeySignatureElement.set0(_new0,p,a);
		return _new0;
	}

	public static set0(new0:ModernKeySignatureElement,p:Pitch,a:ModernAccidental):void
	{
		new0.pitch = p;
		p.octave = - 1;
		new0.accidental = a;
	}

	public static new1(c:Clef):ModernKeySignatureElement
	{
		let _new1:ModernKeySignatureElement = new ModernKeySignatureElement;
		ModernKeySignatureElement.set1(_new1,c);
		return _new1;
	}

	public static set1(new1:ModernKeySignatureElement,c:Clef):void
	{
		new1.pitch = Pitch.new3(c.pitch);
		new1.pitch.octave = - 1;
		if( c.isflat())
			new1.accidental = ModernAccidental.new2(ModernAccidental.ACC_Flat);
		else
			if( c.issharp())
				new1.accidental = ModernAccidental.new2(ModernAccidental.ACC_Sharp);
			else
				new1.accidental = null;

	}

	public static new2(other:ModernKeySignatureElement):ModernKeySignatureElement
	{
		let _new2:ModernKeySignatureElement = new ModernKeySignatureElement;
		ModernKeySignatureElement.set2(_new2,other);
		return _new2;
	}

	public static set2(new2:ModernKeySignatureElement,other:ModernKeySignatureElement):void
	{
		new2.pitch = Pitch.new3(other.pitch);
		new2.accidental = ModernAccidental.new4(other.accidental);
	}

	/*------------------------------------------------------------------------
Method:  boolean matchesPitch(Pitch p)
Purpose: Pitch equality test, allowing for accidentals with octave duplication
         (octave==-1)
Parameters:
  Input:  Pitch p - pitch to test against this accidental's pitch
  Output: -
  Return: true if pitches are equal
------------------------------------------------------------------------*/
	public matchesPitch(p:Pitch):boolean
	{
		if( this.pitch.octave == - 1)
			return this.pitch.noteletter == p.noteletter;
		else
			return this.pitch.equals(p);

	}

	/*------------------------------------------------------------------------
Method:  int calcAOffset()
Purpose: Calculates staff-height display offset from generic pitch 'A'
Parameters:
  Input:  -
  Output: -
  Return: staff-height offset from A
------------------------------------------------------------------------*/
	public calcAOffset():number
	{
		if( this.accidental.accType == ModernAccidental.ACC_Flat)
			return(((( Character.codePointAt(this.pitch.noteletter,0) - Character.codePointAt("A",0)) | 0) +(( 7 * ModernKeySignature.SigFlatOctaveOffsets[((( Character.codePointAt(this.pitch.noteletter,0) - Character.codePointAt("A",0)) | 0))]) | 0)) | 0);
		else
			return(((( Character.codePointAt(this.pitch.noteletter,0) - Character.codePointAt("A",0)) | 0) +(( 7 * ModernKeySignature.SigSharpOctaveOffsets[((( Character.codePointAt(this.pitch.noteletter,0) - Character.codePointAt("A",0)) | 0))]) | 0)) | 0);

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
		System.out.print("    Pitch: " + this.pitch.noteletter);
		if( this.pitch.octave != - 1)
			System.out.print("(" + this.pitch.octave + ")");

		System.out.println();
		this.accidental.prettyprint();
	}
}
