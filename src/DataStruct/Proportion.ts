
import { Math } from '../java/lang/Math';

/*----------------------------------------------------------------------*/
/*

        Module          : Proportion.java

        Package         : DataStruct

        Classes Included: Proportion

        Purpose         : Handle low-level proportion information

        Programmer      : Ted Dumitrescu

        Date Started    : 99

Updates:
9/19/05: added some arithmetic operations (addition, reduction, comparison)
7/1/10:  added init from double (estimate)

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   Proportion
Extends: -
Purpose: Information structure for a proportion of two integers
------------------------------------------------------------------------*/
export class Proportion
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static EQUALITY:Proportion = Proportion.new0(1,1);
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public i1:number;
	public i2:number;

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  Proportion copyProportion(Proportion p)
Purpose: Create new proportion with given value, or null
Parameters:
  Input:  Proportion p - item to copy
  Output: -
  Return: new proportion or null
------------------------------------------------------------------------*/
	public static copyProportion(p:Proportion):Proportion
	{
		return p == null ? null:Proportion.new1(p);
	}

	/*------------------------------------------------------------------------
Method:  Proportion difference(Proportion p1,Proportion p2)
Purpose: Calculate difference of two proportions without modifying either
Parameters:
  Input:  Proportion p1,p2 - proportions to subtract (p2 from p1)
  Output: -
  Return: new proportion representing difference
------------------------------------------------------------------------*/
	public static difference(p1:Proportion,p2:Proportion):Proportion
	{
		if( p1 == null || p2 == null)
			return null;

		let diffVal:Proportion = Proportion.new1(p1);
		diffVal.subtract(p2);
		return diffVal;
	}

	/*------------------------------------------------------------------------
Method:  Proportion product(Proportion p1,Proportion p2)
Purpose: Calculate product of two proportions without modifying either
Parameters:
  Input:  Proportion p1,p2 - proportions to multiply
  Output: -
  Return: new proportion representing product
------------------------------------------------------------------------*/
	public static product(p1:Proportion,p2:Proportion):Proportion
	{
		if( p1 == null || p2 == null)
			return null;

		let productVal:Proportion = Proportion.new1(p1);
		productVal.multiply_2(p2);
		return productVal;
	}

	public static quotient(p1:Proportion,p2:Proportion):Proportion
	{
		if( p1 == null || p2 == null)
			return null;

		let quotientVal:Proportion = Proportion.new1(p1);
		quotientVal.divide(p2);
		return quotientVal;
	}

	/*------------------------------------------------------------------------
Method:  Proportion sum(Proportion p1,Proportion p2)
Purpose: Calculate sum of two proportions without modifying either
Parameters:
  Input:  Proportion p1,p2 - proportions to add
  Output: -
  Return: new proportion representing sum
------------------------------------------------------------------------*/
	public static sum(p1:Proportion,p2:Proportion):Proportion
	{
		if( p1 == null && p2 == null)
			return null;

		if( p1 == null)
			return Proportion.new1(p2);

		if( p2 == null)
			return Proportion.new1(p1);

		let sumVal:Proportion = Proportion.new1(p1);
		sumVal.add(p2);
		return sumVal;
	}

	/* max/min */
	public static max(p1:Proportion,p2:Proportion):Proportion
	{
		return p1.greaterThanOrEqualTo(p2) ? p1:p2;
	}

	public static min(p1:Proportion,p2:Proportion):Proportion
	{
		return p1.lessThanOrEqualTo(p2) ? p1:p2;
	}

	public static new0(n1:number,n2:number):Proportion
	{
		let _new0:Proportion = new Proportion;
		Proportion.set0(_new0,n1,n2);
		return _new0;
	}

	public static set0(new0:Proportion,n1:number,n2:number):void
	{
		new0.i1 = n1;
		new0.i2 = n2;
	}

	public static new1(p:Proportion):Proportion
	{
		let _new1:Proportion = new Proportion;
		Proportion.set1(_new1,p);
		return _new1;
	}

	public static set1(new1:Proportion,p:Proportion):void
	{
		new1.i1 = p.i1;
		new1.i2 = p.i2;
	}
	/* estimate from double */
	static FLOAT_ACCURACY:number = 10000;

	public static new2(val:number):Proportion
	{
		let _new2:Proportion = new Proportion;
		Proportion.set2(_new2,val);
		return _new2;
	}

	public static set2(new2:Proportion,val:number):void
	{
		new2.i1 =<number>( Math.round(val * Proportion.FLOAT_ACCURACY));
		new2.i2 =<number> Proportion.FLOAT_ACCURACY;
		new2.reduce();
	}

	/*------------------------------------------------------------------------
Method:  void setVal(Proportion p)
Purpose: Copy another proportion
Parameters:
  Input:  Proportio p - proportion to copy
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setVal_1(p:Proportion):void
	{
		this.i1 = p.i1;
		this.i2 = p.i2;
	}

	public setVal_2(i1:number,i2:number):void
	{
		this.i1 = i1;
		this.i2 = i2;
	}

	/*------------------------------------------------------------------------
Method:  void reduce()
Purpose: Reduce proportion to lowest terms
Parameters:
  Input:  -
  Output: -
  Return: this
------------------------------------------------------------------------*/
	reduce():Proportion
	{
		if( this.i1 == 0)
			return this;

		let gnum:number;
		let lnum:number;
		let remainder:number;
		if( this.i1 > this.i2)
			{
				gnum = this.i1;
				lnum = this.i2;
			}

		else
			{
				gnum = this.i2;
				lnum = this.i1;
			}

		remainder = gnum % lnum;
		while( remainder != 0)
		{
			gnum = lnum;
			lnum = remainder;
			remainder = gnum % lnum;
		}
		this.i1 /= lnum;
		this.i2 /= lnum;
		return this;
	}

	/* find greatest common factor */
	/* lnum==GCF */
	/*------------------------------------------------------------------------
Method:  boolean equals(Proportion p)
Purpose: Compare for equality against another proportion
Parameters:
  Input:  Proportion p - proportion to compare
  Output: -
  Return: true if equal
------------------------------------------------------------------------*/
	public equals(p:Proportion):boolean
	{
		return this.toDouble() == p.toDouble();
	}

	/*------------------------------------------------------------------------
Method:  boolean [greater|less]Than[OrEqualto](Proportion p)
Purpose: Compare against another proportion
Parameters:
  Input:  Proportion p - proportion to compare
  Output: -
  Return: true if this > p
------------------------------------------------------------------------*/
	public greaterThan(p:Proportion):boolean
	{
		return this.toDouble() > p.toDouble();
	}

	public greaterThanOrEqualTo(p:Proportion):boolean
	{
		return this.toDouble() >= p.toDouble();
	}

	public lessThan(p:Proportion):boolean
	{
		return this.toDouble() < p.toDouble();
	}

	public lessThanOrEqualTo(p:Proportion):boolean
	{
		return this.toDouble() <= p.toDouble();
	}

	/*------------------------------------------------------------------------
Method:  void add(Proportion p)
Purpose: Add another proportion to this one
Parameters:
  Input:  Proportion p - proportion to add
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public add(p:Proportion):void
	{
		if( p == null || p.i1 == 0)
			return;

		if( this.i2 != p.i2)
			{
				this.i1 =(((( this.i1 * p.i2) | 0) +(( p.i1 * this.i2) | 0)) | 0);
				this.i2 *= p.i2;
				this.reduce();
			}

		else
			this.i1 += p.i1;

	}

	/*------------------------------------------------------------------------
Method:  void multiply(int o1,int o2|Proportion other)
Purpose: Multiply this proportion by another
Parameters:
  Input:  int o1,int o2|Proportion other - proportion by which to multiply
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public multiply_1(o1:number,o2:number):void
	{
		this.i1 *= o1;
		this.i2 *= o2;
		this.reduce();
	}

	public multiply_2(other:Proportion):void
	{
		this.i1 *= other.i1;
		this.i2 *= other.i2;
		this.reduce();
	}

	public divide(other:Proportion):void
	{
		this.i1 *= other.i2;
		this.i2 *= other.i1;
		this.reduce();
	}

	/*------------------------------------------------------------------------
Method:  void subtract(Proportion other)
Purpose: Subtract another proportion from this one
Parameters:
  Input:  Proportion other - proportion to subtract
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public subtract(other:Proportion):void
	{
		if( other == null || other.i1 == 0)
			return;

		if( this.i2 != other.i2)
			{
				this.i1 =(((( this.i1 * other.i2) | 0) -(( other.i1 * this.i2) | 0)) | 0);
				this.i2 *= other.i2;
				this.reduce();
			}

		else
			this.i1 -= other.i1;

	}

	/*------------------------------------------------------------------------
Method:  int toInt()
Purpose: Convert to int
Parameters:
  Input:  -
  Output: -
  Return: integer representing proportion value rounded down
------------------------------------------------------------------------*/
	public toInt():number
	{
		return(( this.i1 / this.i2) | 0);
	}

	/*------------------------------------------------------------------------
Method:  double toDouble()
Purpose: Convert to double
Parameters:
  Input:  -
  Output: -
  Return: double representing proportion value
------------------------------------------------------------------------*/
	public toDouble():number
	{
		return<number> this.i1 /<number> this.i2;
	}

	public toString():string
	{
		return this.i1 + "/" + this.i2;
	}
}
