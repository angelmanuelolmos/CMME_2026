
import { System } from '../java/lang/System';
import { Pitch } from './Pitch';
import { ModernKeySignature } from './ModernKeySignature';
import { Clef } from './Clef';
import { ArrayList } from '../java/util/ArrayList';
import { Iterator } from '../java/util/Iterator';

export class ClefSet extends ArrayList<Clef>
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	keySig:ModernKeySignature;

	public static new0_1(c:Clef):ClefSet
	{
		let _new0:ClefSet = new ClefSet;
		ClefSet.set0_1(_new0,c);
		return _new0;
	}

	public static set0_1(new0:ClefSet,c:Clef):void
	{
		new0.keySig = ModernKeySignature.new0();
		new0.add(c);
		new0.keySig.addClef(c);
	}

	public static new1_1(cs:ClefSet):ClefSet
	{
		let _new1:ClefSet = new ClefSet;
		ClefSet.set1_1(_new1,cs);
		return _new1;
	}

	public static set1_1(new1:ClefSet,cs:ClefSet):void
	{
		for(let c of cs)
		new1.add(c);
		new1.keySig = ModernKeySignature.new1(cs.keySig);
	}

	/*------------------------------------------------------------------------
Method:  ClefSet addclef(Clef c)
Purpose: Add clef to group
Parameters:
  Input:  Clef c - clef to add
  Output: -
  Return: this object after modification
------------------------------------------------------------------------*/
	public addclef(c:Clef):ClefSet
	{
		if( c._ismodernclef)
			{
				this.choosemodernclef(c);
				if( this.containsClef(c) && this.indexOf(c) == - 1)
					c.cleftype = Clef.CLEF_NONE;

			}

		if( c.cleftype != Clef.CLEF_NONE && ! this.containsClef(c))
			{
				if( c.isprincipalclef())
					this.add(0,c);
				else
					this.add(c);

				this.keySig.addClef(c);
			}

		return this;
	}

	/* avoid duplicated accidentals in modern clef sets */
	/* set clef type to NONE if it
                                                       duplicates another one in the set,
                                                       but not if this actual clef object
                                                       is already in the set */
	/*------------------------------------------------------------------------
Method:  void removeclef(Clef c)
Purpose: Remove clef from group
Parameters:
  Input:  Clef c - clef to remove
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public removeclef(c:Clef):void
	{
		let i:number = 0;
		let done:boolean = i >= this.size();
		while( ! done)
		{
			let ic:Clef =<Clef> this.get(i);
			if( ic.equals(c))
				{
					this.remove(i);
					this.keySig.removeClef(c);
					done = true;
				}

			else
				done = i >= this.size();

			i ++;
		}
	}

	/*------------------------------------------------------------------------
Method:  void choosemodernclef(Clef c)
Purpose: Set modern clef parameters for a new clef within this set
Parameters:
  Input:  -
  Output: Clef c - clef to modify
  Return: -
------------------------------------------------------------------------*/
	choosemodernclef(c:Clef):void
	{
		if( c.getclefletter() != "B" || ! c._signature)
			return;

		let pp:Pitch = this.getprincipalclef().pitch;
		let newpitch:Pitch = c.pitch;
		switch( pp.noteletter)
		{
			case "G":
			{
				newpitch = Pitch.new1(c.pitch.noteletter,(( pp.octave + 1) | 0));
				break;
			}
			case "F":
			{
			}
			case "C":
			{
				newpitch = Pitch.new1(c.pitch.noteletter,pp.octave);
				break;
			}
		}
		c.pitch = newpitch;
	}

	/*------------------------------------------------------------------------
Method:  void recalcModKeySig()
Purpose: Recalculate modern key signature data (after clef set has changed)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public recalcModKeySig():void
	{
		this.keySig = ModernKeySignature.new0();
		for(let c of this)
		this.keySig.addClef(c);
	}

	/*------------------------------------------------------------------------
Method:  Clef getprincipalclef()
Purpose: Return the principal clef in this set
Parameters:
  Input:  -
  Output: -
  Return: principal clef
------------------------------------------------------------------------*/
	public getprincipalclef():Clef
	{
		return<Clef>( this.get(0));
	}

	public hasPrincipalClef():boolean
	{
		for(let c of this)
		if( c.isprincipalclef())
			return true;

		return false;
	}

	/*------------------------------------------------------------------------
Method:  int numflats()
Purpose: Return number of flat clefs (round bs) in set
Parameters:
  Input:  -
  Output: -
  Return: number of flats
------------------------------------------------------------------------*/
	public numflats():number
	{
		let nf:number = 0;
		for(let c of this)
		if( c.isflat())
			nf ++;

		return nf;
	}

	/*------------------------------------------------------------------------
Method:  boolean contradicts(ClefSet other,boolean umc,Clef smc)
Purpose: Calculate whether this clef set contradicts another one
Parameters:
  Input:  ClefSet other - clef set for comparison
          boolean umc   - use modern clefs?
          Clef smc      - editorially suggested modern clef for this voice
  Output: -
  Return: Whether clefs conflict
------------------------------------------------------------------------*/
	public contradicts_1(other:ClefSet):boolean
	{
		return this.contradicts_2(other,false,null);
	}

	public contradicts_2(other:ClefSet,umc:boolean,smc:Clef):boolean
	{
		if( other == null)
			return true;

		if( umc)
			return ! this.getKeySig().equals(other.getKeySig());

		let ci1:Iterator<Clef> = this.iterator();
		let ci2:Iterator<Clef> = other.iterator();
		while( ci1.hasNext())
		if( ! ci2.hasNext())
			return true;
		else
			{
				let c1c:Clef =<Clef>( ci1.next());
				let c2c:Clef =<Clef>( ci2.next());
				if( umc && c1c.isprincipalclef() && c2c.isprincipalclef())
					if( smc != null)
						c1c =( c2c = smc);
					else
						{
							c1c = c1c.modernclef;
							c2c = c2c.modernclef;
						}

				if( ! c1c.equals(c2c))
					return true;

			}

		return ci2.hasNext();
	}

	public sigContradicts(other:ClefSet):boolean
	{
		if( other == null)
			return true;

		let ci1:Iterator<Clef> = this.iterator();
		let ci2:Iterator<Clef> = other.iterator();
		let c1c:Clef = null;
		let c2c:Clef = null;
		while( ci1.hasNext())
		{
			c1c =<Clef>( ci1.next());
			if( ! c1c.isprincipalclef())
				break;

		}
		while( ci2.hasNext())
		{
			c2c =<Clef>( ci2.next());
			if( ! c2c.isprincipalclef())
				break;

		}
		while( c1c != null)
		if( c2c == null)
			return true;
		else
			{
				if( ! c1c.equals(c2c))
					return true;

				c1c = ci1.hasNext() ?<Clef>( ci1.next()):null;
				c2c = ci2.hasNext() ?<Clef>( ci2.next()):null;
			}

		return c2c != null;
	}

	/* iterate past principal clefs */
	/*------------------------------------------------------------------------
Method:  boolean containsClef(Clef c)
Purpose: Calculate whether this clef set contains a clef
Parameters:
  Input:  Clef c - clef to check for inclusion
  Output: -
  Return: Whether c is contained in this
------------------------------------------------------------------------*/
	public containsClef(c:Clef):boolean
	{
		for(let curc of this)
		if( curc.equals(c))
			return true;

		return false;
	}

	/*------------------------------------------------------------------------
Method:  Iterator acciterator()
Purpose: Creates iterator over less principal clefs (accidentals) in set
Parameters:
  Input:  -
  Output: -
  Return: iterator
------------------------------------------------------------------------*/
	public acciterator():Iterator<Clef>
	{
		return this.listIterator(1);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getKeySig():ModernKeySignature
	{
		return this.keySig;
	}

	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Prints information about this clef set
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public prettyprint_1():void
	{
		System.out.println("   Clefset:");
		for(let c of this)
		c.prettyprint();
		System.out.println("   End ClefSet");
	}
}
