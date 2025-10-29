
import { System } from '../java/lang/System';
import { Math } from '../java/lang/Math';
import { Pitch } from './Pitch';
import { NoteEvent } from './NoteEvent';
import { ModernKeySignatureElement } from './ModernKeySignatureElement';
import { ModernAccidental } from './ModernAccidental';
import { Clef } from './Clef';
import { Iterator } from '../java/util/Iterator';
import { LinkedList } from '../java/util/LinkedList';

export class ModernKeySignature
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static DEFAULT_SIG:ModernKeySignature = ModernKeySignature.new0();
	public static CircleOfFifthsPitches:Pitch[]=[Pitch.new1("B",- 1),Pitch.new1("E",- 1),Pitch.new1("A",- 1),Pitch.new1("D",- 1),Pitch.new1("G",- 1),Pitch.new1("C",- 1),Pitch.new1("F",- 1)];
	/* octave offsets for positioning elements of a standard key signature */
	public static SigFlatOctaveOffsets:number[]=[0,0,0,0,0,- 1,- 1];
	/* ABCDEFG */
	public static SigSharpOctaveOffsets:number[]=[0,0,0,0,0,0,0];
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	accElements:LinkedList<ModernKeySignatureElement>;
	/* pitch 'distance' from a blank sig; 1==1 sharp, -1==1 flat, 2==2 sharps,
     etc */
	accDistance:number;

	public static new0():ModernKeySignature
	{
		let _new0:ModernKeySignature = new ModernKeySignature;
		ModernKeySignature.set0(_new0);
		return _new0;
	}

	public static set0(new0:ModernKeySignature):void
	{
		new0.accElements = new LinkedList<ModernKeySignatureElement>();
		new0.accDistance = 0;
	}

	public static new1(other:ModernKeySignature):ModernKeySignature
	{
		let _new1:ModernKeySignature = new ModernKeySignature;
		ModernKeySignature.set1(_new1,other);
		return _new1;
	}

	public static set1(new1:ModernKeySignature,other:ModernKeySignature):void
	{
		new1.accElements = new LinkedList<ModernKeySignatureElement>();
		for(
		let i:Iterator<ModernKeySignatureElement> = other.iterator();i.hasNext();)
		new1.accElements.add(ModernKeySignatureElement.new2(<ModernKeySignatureElement> i.next()));
		new1.accDistance = other.accDistance;
	}

	/* make a deep copy of the other list */
	/*------------------------------------------------------------------------
Method:  int calcNotePitchOffset(NoteEvent ne)
Purpose: Calculates a numerical representation of the pitch offset from a
         note's natural state, under this key signature (e.g., a B with no
         accidental marked, under a 1-flat sig, will be -1, i.e., a half
         step below B-natural)
Parameters:
  Input:  NoteEvent ne - note to use for calculation
  Output: -
  Return: numerical pitch offset value
------------------------------------------------------------------------*/
	public calcNotePitchOffset_1(pitch:Pitch,noteAcc:ModernAccidental):number
	{
		let sigAcc:ModernAccidental = this.getAccidentalAtPitch(pitch);
		let notePitchOffset:number = sigAcc == null ? 0:sigAcc.calcPitchOffset();
		if( noteAcc != null)
			notePitchOffset = noteAcc.calcPitchOffset();

		return notePitchOffset;
	}

	public calcNotePitchOffset_2(ne:NoteEvent):number
	{
		return this.calcNotePitchOffset_1(ne.getPitch_1(),ne.getPitchOffset());
	}

	/*------------------------------------------------------------------------
Method:  ModernAccidental chooseNoteAccidental(NoteEvent ne,int notePitchOffset)
Purpose: Creates a modern accidental to attach to a given note so that it has
         the given numerical offset from a 'natural' pitch (0)
Parameters:
  Input:  NoteEvent ne        - note to which to attach modern accidental
          int notePitchOffset - numerical representation of exact pitch offset
                                from natural note state
  Output: -
  Return: new modern accidental
------------------------------------------------------------------------*/
	public chooseNoteAccidental(ne:NoteEvent,notePitchOffset:number):ModernAccidental
	{
		let sigAcc:ModernAccidental = this.getAccidentalAtPitch(ne.getPitch_1());
		let sigPitchOffset:number = sigAcc == null ? 0:sigAcc.calcPitchOffset();
		if( notePitchOffset == sigPitchOffset)
			return null;
		else
			if( notePitchOffset == 0)
				return ModernAccidental.new1(ModernAccidental.ACC_Natural,1);
			else
				return ModernAccidental.pitchOffsetToAcc(notePitchOffset);

	}

	/* is the accidental subsumed into the signature? */
	/* does it become a natural? */
	/*------------------------------------------------------------------------
Method:  ModernAccidental getAccidentalAtPitch(Pitch p)
Purpose: Checks whether a given Locus (generic pitch position) is modified
         by this key signature; if so, returns accidental information
Parameters:
  Input:  Pitch p - pitch to check for accidental
  Output: -
  Return: accidental associated with given pitch; null if none
------------------------------------------------------------------------*/
	public getAccDistance():number
	{
		return this.accDistance;
	}

	public getAccidentalAtPitch(p:Pitch):ModernAccidental
	{
		for(let mske of this.accElements)
		if( mske.matchesPitch(p))
			return mske.accidental;

		return null;
	}

	/*------------------------------------------------------------------------
Methods: boolean equals(ModernKeySignature other)
Purpose: Check whether this modern key signature is equivalent to another
Parameters:
  Input:  ModernKeySignature other - other signature
  Output: -
  Return: true if this and the other signature are the same
------------------------------------------------------------------------*/
	public equals(other:ModernKeySignature):boolean
	{
		return this.accDistance == other.accDistance;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public iterator():Iterator<ModernKeySignatureElement>
	{
		return this.accElements.iterator();
	}

	public numEls():number
	{
		return this.accElements.size();
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addElement(e:ModernKeySignatureElement):void
	{
		let ma:ModernAccidental = this.getAccidentalAtPitch(e.pitch);
		if( ma != null)
			return;

		this.accElements.add(e);
		if( e.accidental.accType == ModernAccidental.ACC_Flat)
			this.accDistance -= e.accidental.numAcc;
		else
			if( e.accidental.accType == ModernAccidental.ACC_Sharp)
				this.accDistance += e.accidental.numAcc;

	}

	/* already in signature */
	public addClef(c:Clef):void
	{
		if( ! c.isflat() && ! c.issharp())
			return;

		this.addElement(ModernKeySignatureElement.new1(c));
	}

	public removeClef(c:Clef):void
	{
	}

	/* TMP */
	public addFlat():void
	{
		if( this.accElements.size() == 0)
			this.accElements.add(ModernKeySignatureElement.new0(ModernKeySignature.CircleOfFifthsPitches[0],ModernAccidental.new2(ModernAccidental.ACC_Flat)));
		else
			{
				let laste:ModernKeySignatureElement = this.accElements.getLast();
				if( this.accElements.size() < 7)
					if( laste.accidental.accType == ModernAccidental.ACC_Sharp)
						this.accElements.removeLast();
					else
						this.accElements.add(ModernKeySignatureElement.new0(ModernKeySignature.CircleOfFifthsPitches[this.accElements.size()],ModernAccidental.new2(ModernAccidental.ACC_Flat)));


				else
					{
						laste = this.accElements.get(((( Math.abs(this.accDistance) - 1) | 0)) % 7);
						if( laste.accidental.accType == ModernAccidental.ACC_Sharp)
							if( this.accDistance == 7)
								this.accElements.removeLast();
							else
								laste.accidental.numAcc --;


						else
							{
								laste = this.accElements.get(Math.abs(this.accDistance) % 7);
								laste.accidental.numAcc ++;
							}

					}

			}

		this.accDistance --;
	}

	/* if sig is currently blank, add first item */
	/* for sigs of less than seven elements, simply add or delete one item */
	/* for 'full' sigs (7 or more), we may need to change the number of
           applications of the farthest accidental */
	/* make laste correspond with the 'furthest' accidental along the
               cycle of fifths */
	/* remove one sharp */
	/* remove one sharp application */
	/* add one flat application */
	public addSharp():void
	{
		if( this.accElements.size() == 0)
			this.accElements.add(ModernKeySignatureElement.new0(ModernKeySignature.CircleOfFifthsPitches[6],ModernAccidental.new2(ModernAccidental.ACC_Sharp)));
		else
			{
				let laste:ModernKeySignatureElement = this.accElements.getLast();
				if( this.accElements.size() < 7)
					if( laste.accidental.accType == ModernAccidental.ACC_Flat)
						this.accElements.removeLast();
					else
						this.accElements.add(ModernKeySignatureElement.new0(ModernKeySignature.CircleOfFifthsPitches[((( 6 - this.accElements.size()) | 0))],ModernAccidental.new2(ModernAccidental.ACC_Sharp)));


				else
					{
						laste = this.accElements.get(((( Math.abs(this.accDistance) - 1) | 0)) % 7);
						if( laste.accidental.accType == ModernAccidental.ACC_Flat)
							if( this.accDistance == - 7)
								this.accElements.removeLast();
							else
								laste.accidental.numAcc --;


						else
							{
								laste = this.accElements.get(Math.abs(this.accDistance) % 7);
								laste.accidental.numAcc ++;
							}

					}

			}

		this.accDistance ++;
	}

	/* if sig is currently blank, add first item */
	/* for sigs of less than seven elements, simply add or delete one item */
	/* for 'full' sigs (7 or more), we may need to change the number of
           applications of the farthest accidental */
	/* make laste correspond with the 'furthest' accidental along the
               cycle of fifths */
	/* remove one flat */
	/* remove one flat application */
	/* add one sharp application */
	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Prints information about this key signature
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public prettyprint():void
	{
		System.out.println("    --Modern key signature");
		for(let mske of this.accElements)
		mske.prettyprint();
		System.out.println("    --End modern key signature");
	}
}
