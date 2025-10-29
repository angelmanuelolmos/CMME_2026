
import { System } from '../java/lang/System';
/*----------------------------------------------------------------------*/
/*

        Module          : Coloration.java

        Package         : DataStruct

        Classes Included: Coloration

        Purpose         : Low-level coloration scheme handling

        Programmer      : Ted Dumitrescu

        Date Started    : 9/14/05

Updates	:

                                                                        */
/*----------------------------------------------------------------------*/
/*----------------------------------------------------------------------*/
/* Imported packages */
/*------------------------------------------------------------------------
Class:   Coloration
Extends: -
Purpose: Low-level coloration scheme handling
------------------------------------------------------------------------*/
import { Color } from '../java/awt/Color';

export class Coloration
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static BLACK:number = 0;
	public static RED:number = 1;
	public static BLUE:number = 2;
	public static GREEN:number = 3;
	public static YELLOW:number = 4;
	public static CYAN:number = 5;
	public static WHITE:number = 6;
	public static GRAY:number = 7;
	public static NONE:number = - 1;
	public static VOID:number = 0;
	public static FULL:number = 1;
	public static HALF_FULLVOID:number = 2;
	public static HALF_VOIDFULL:number = 3;
	/* coloration effects */
	public static IMPERFECTIO:number = 0;
	public static SESQUIALTERA:number = 1;
	public static MINOR_COLOR:number = 2;
	public static ColorNames:string[]=["Black","Red","Blue","Green","Yellow"];
	public static ColorFillNames:string[]=["Void","Full"];
	public static AWTColors:Color[]=[Color.black,Color.red,Color.blue,Color.green,Color.yellow,Color.cyan,Color.white,Color.gray];
	public static DEFAULT_COLORATION:Coloration = Coloration.new0(Coloration.BLACK,Coloration.VOID,Coloration.BLACK,Coloration.FULL);
	public static DEFAULT_CHANT_COLORATION:Coloration = Coloration.new0(Coloration.BLACK,Coloration.FULL,Coloration.BLACK,Coloration.VOID);

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  int strtoColor(String c)
Purpose: Convert string to color number
Parameters:
  Input:  String c - string to convert
  Output: -
  Return: color number
------------------------------------------------------------------------*/
	public static strtoColor(c:string):number
	{
		if( c == null)
			return Coloration.NONE;

		for(
		let i:number = 0;i < Coloration.ColorNames.length;i ++)
		if(( c == Coloration.ColorNames[i]))
			return i;

		return Coloration.NONE;
	}

	/*------------------------------------------------------------------------
Method:  int strtoColorFill(String cf)
Purpose: Convert string to color fill type number
Parameters:
  Input:  String cf - string to convert
  Output: -
  Return: color fill type number
------------------------------------------------------------------------*/
	public static strtoColorFill(cf:string):number
	{
		if( cf == null)
			return Coloration.NONE;

		for(
		let i:number = 0;i < Coloration.ColorFillNames.length;i ++)
		if(( cf == Coloration.ColorFillNames[i]))
			return i;

		return Coloration.NONE;
	}

	/*------------------------------------------------------------------------
Method:  int complementaryFill(int f)
Purpose: Calculate complementary fill type (VOID vs FULL)
Parameters:
  Input:  int f - fill type to complement
  Output: -
  Return: complementary color fill type number
------------------------------------------------------------------------*/
	public static complementaryFill(f:number):number
	{
		if( f == Coloration.NONE)
			return Coloration.NONE;

		return f == Coloration.VOID ? Coloration.FULL:Coloration.VOID;
	}
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public primaryColor:number;
	public primaryFill:number;
	public secondaryColor:number;
	public secondaryFill:number;

	public static new0(pc:number,pf:number,sc:number,sf:number):Coloration
	{
		let _new0:Coloration = new Coloration;
		Coloration.set0(_new0,pc,pf,sc,sf);
		return _new0;
	}

	public static set0(new0:Coloration,pc:number,pf:number,sc:number,sf:number):void
	{
		new0.primaryColor = pc;
		new0.primaryFill = pf;
		new0.secondaryColor = sc;
		new0.secondaryFill = sf;
	}

	public static new1(oldc:Coloration,newc:Coloration):Coloration
	{
		let _new1:Coloration = new Coloration;
		Coloration.set1(_new1,oldc,newc);
		return _new1;
	}

	public static set1(new1:Coloration,oldc:Coloration,newc:Coloration):void
	{
		new1.primaryColor = newc.primaryColor == Coloration.NONE ? oldc.primaryColor:newc.primaryColor;
		new1.primaryFill = newc.primaryFill == Coloration.NONE ? oldc.primaryFill:newc.primaryFill;
		new1.secondaryColor = newc.secondaryColor == Coloration.NONE ? oldc.secondaryColor:newc.secondaryColor;
		new1.secondaryFill = newc.secondaryFill == Coloration.NONE ? oldc.secondaryFill:newc.secondaryFill;
	}

	public static new2(c:Coloration):Coloration
	{
		let _new2:Coloration = new Coloration;
		Coloration.set2(_new2,c);
		return _new2;
	}

	public static set2(new2:Coloration,c:Coloration):void
	{
		new2.primaryColor = c.primaryColor;
		new2.primaryFill = c.primaryFill;
		new2.secondaryColor = c.secondaryColor;
		new2.secondaryFill = c.secondaryFill;
	}

	/*------------------------------------------------------------------------
Method:  boolean equals(Coloration c)
Purpose: Compare for equality against another color scheme
Parameters:
  Input:  Coloration c - color scheme to compare
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public equals(c:Coloration):boolean
	{
		return c != null && this.primaryColor == c.primaryColor && this.primaryFill == c.primaryFill && this.secondaryColor == c.secondaryColor && this.secondaryFill == c.secondaryFill;
	}

	/*------------------------------------------------------------------------
Method:  Coloration differencebetween(Coloration other)
Purpose: Creates a color scheme representing the difference between this
         and another
Parameters:
  Input:  Coloration other - other color scheme
  Output: -
  Return: new Coloration representing difference
------------------------------------------------------------------------*/
	public differencebetween(other:Coloration):Coloration
	{
		let pc:number = Coloration.NONE;
		let pf:number = Coloration.NONE;
		let sc:number = Coloration.NONE;
		let sf:number = Coloration.NONE;
		if( this.primaryColor != other.primaryColor)
			pc = this.primaryColor;

		if( this.primaryFill != other.primaryFill)
			pf = this.primaryFill;

		if( this.secondaryColor != other.secondaryColor)
			sc = this.secondaryColor;

		if( this.secondaryFill != other.secondaryFill)
			sf = this.secondaryFill;

		return Coloration.new0(pc,pf,sc,sf);
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
		System.out.print("[");
		if( this.primaryColor != Coloration.NONE)
			System.out.print(Coloration.ColorNames[this.primaryColor]);

		if( this.primaryFill != Coloration.NONE)
			System.out.print(Coloration.ColorFillNames[this.primaryFill]);

		System.out.print(" / ");
		if( this.secondaryColor != Coloration.NONE)
			System.out.print(Coloration.ColorNames[this.secondaryColor]);

		if( this.secondaryFill != Coloration.NONE)
			System.out.print(Coloration.ColorFillNames[this.secondaryFill]);

		System.out.println("]");
	}
}
