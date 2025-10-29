
import { System } from '../java/lang/System';
import { Pitch } from './Pitch';
import { Coloration } from './Coloration';

/*----------------------------------------------------------------------*/
/*

        Module          : Clef.java

        Package         : DataStruct

        Classes Included: Clef

        Purpose         : Handle low-level clef information

        Programmer      : Ted Dumitrescu

        Date Started    : 1/99

        Updates         : 4/26/99: modernization option added
                          2/25/05: imported clef type enum from ClefEvent,
                                   nominal support for new types

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   Clef
Extends: -
Purpose: Clef information structure
------------------------------------------------------------------------*/
//CHANGE signature -> _signature ismodernclef -> _ismodernclef drawInSig->_drawInSig to disambiguate signature()
export class Clef
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static CLEF_C:number = 0;
	public static CLEF_F:number = 1;
	public static CLEF_G:number = 2;
	public static CLEF_MODERNG:number = 3;
	public static CLEF_MODERNG8:number = 4;
	public static CLEF_MODERNF:number = 5;
	public static CLEF_MODERNC:number = 6;
	public static CLEF_Bmol:number = 7;
	public static CLEF_Bqua:number = 8;
	public static CLEF_Diesis:number = 9;
	public static CLEF_BmolDouble:number = 10;
	public static CLEF_Fis:number = 11;
	public static CLEF_Frnd:number = 12;
	public static CLEF_Fsqr:number = 13;
	public static CLEF_Gamma:number = 14;
	public static CLEF_MODERNFlat:number = 15;
	public static CLEF_MODERNNatural:number = 16;
	public static CLEF_MODERNSharp:number = 17;
	public static CLEF_MODERNDoubleSharp:number = 18;
	public static CLEF_MODERNFlatSMALL:number = 19;
	public static CLEF_MODERNNaturalSMALL:number = 20;
	public static CLEF_MODERNSharpSMALL:number = 21;
	public static CLEF_MODERNDoubleSharpSMALL:number = 22;
	public static CLEF_CFull:number = 23;
	public static CLEF_FFull:number = 24;
	public static CLEF_NONE:number = 25;
	public static ClefNames:string[]=["C","F","G","MODERNG","MODERNG8","MODERNF","MODERNC","Bmol","Bqua","Diesis","BmolDouble","Fis","Frnd","Fsqr","Gamma","Flat","Natural","Sharp","DoubleSharp","Flat(Small)","Natural(Small)","Sharp(Small)","DoubleSharp(Small)","C","F","NONE"];
	public static ClefLetters:string[]=["C","F","G","G","G","F","C","B","B","B","B","B","F","F","G","B","B","B","B","B","B2","B","B","C","F","X"];
	public static DefaultClefPitches:Pitch[]=[Pitch.new1("C",3),Pitch.new1("F",2),Pitch.new1("G",3),Pitch.new1("G",3),Pitch.new1("G",2),Pitch.new1("F",2),Pitch.new1("C",3),Pitch.new1("B",3),Pitch.new1("B",3),Pitch.new1("B",3),Pitch.new1("B",3),Pitch.new1("B",3),Pitch.new1("F",2),Pitch.new1("F",2),Pitch.new1("G",1),Pitch.new1("B",3),Pitch.new1("B",3),Pitch.new1("B",3),Pitch.new1("B",3),Pitch.new1("B",3),Pitch.new1("B",3),Pitch.new1("B",3),Pitch.new1("B",3),Pitch.new1("C",3),Pitch.new1("F",2),null];
	public static DefaultModernClefs:Clef[]=[null,null,null,Clef.new0(Clef.CLEF_MODERNG,3,Clef.DefaultClefPitches[Clef.CLEF_MODERNG],true,true,null),Clef.new0(Clef.CLEF_MODERNG8,3,Clef.DefaultClefPitches[Clef.CLEF_MODERNG8],true,true,null),Clef.new0(Clef.CLEF_MODERNF,7,Clef.DefaultClefPitches[Clef.CLEF_MODERNF],true,true,null)];
	/* non-modern clefs at start of list */
	public static OFFSET_SMALL_ACC:number = 4;
	/* add to regular modern accidental
                                                 to get number of small version */
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public cleftype:number;
	public linespacenum:number;
	public line1placenum:number;
	public pitch:Pitch;
	public modernclef:Clef;
	public origModClef:Clef;
	public _ismodernclef:boolean = false;
	_signature:boolean;
	_drawInSig:boolean;

	/* whether to draw when constructing signature display */
	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  boolean isFlatType(int ct)
Purpose: Determine whether this type of clef is a type of flat
Parameters:
  Input:  int ct - clef type
  Output: -
  Return: true if this clef type is a flat/round b
------------------------------------------------------------------------*/
	public static isFlatType(ct:number):boolean
	{
		return ct == Clef.CLEF_Bmol || ct == Clef.CLEF_BmolDouble || ct == Clef.CLEF_Fis || ct == Clef.CLEF_MODERNFlat;
	}

	/*------------------------------------------------------------------------
Method:  int defaultClefLoc(int ct)
Purpose: Determine default staff location based on clef type
Parameters:
  Input:  int ct - clef type
  Output: -
  Return: staff location
------------------------------------------------------------------------*/
	public static defaultClefLoc(ct:number):number
	{
		switch( Clef.ClefLetters[ct])
		{
			case "C":
			{
				return 1;
			}
			case "F":
			{
				return 7;
			}
			case "G":
			{
				return 3;
			}
			case "B":
			{
				return 7;
			}
		}
		return 1;
	}

	/*------------------------------------------------------------------------
Method:  int strToCleftype(String s)
Purpose: Translate string to clef type number
Parameters:
  Input:  String s - string to translate
  Output: -
  Return: clef type
------------------------------------------------------------------------*/
	public static strToCleftype(s:string):number
	{
		for(
		let i:number = 0;i < Clef.ClefNames.length;i ++)
		if(( s == Clef.ClefNames[i]))
			return i;

		return Clef.CLEF_NONE;
	}

	/*------------------------------------------------------------------------
Method:  int lineNumToLinespaceNum(int lnum)
Purpose: Translate staff line number (1-5) to line-space number
Parameters:
  Input:  int lnum - staff line number
  Output: -
  Return: line-space number
------------------------------------------------------------------------*/
	public static lineNumToLinespaceNum(lnum:number):number
	{
		return(((( lnum * 2) | 0) - 1) | 0);
	}

	public static linespaceNumToLineNum(lsnum:number):number
	{
		return(((( lsnum / 2) | 0) + 1) | 0);
	}

	public static new0(ct:number,ln:number,p:Pitch,mc:boolean,sc:boolean,dc:Clef):Clef
	{
		let _new0:Clef = new Clef;
		Clef.set0(_new0,ct,ln,p,mc,sc,dc);
		return _new0;
	}

	public static set0(new0:Clef,ct:number,ln:number,p:Pitch,mc:boolean,sc:boolean,dc:Clef):void
	{
		new0.setattributes(ct,ln,p,mc,sc,dc);
	}

	public static new1(c:Clef):Clef
	{
		let _new1:Clef = new Clef;
		Clef.set1(_new1,c);
		return _new1;
	}

	public static set1(new1:Clef,c:Clef):void
	{
		new1.cleftype = c.cleftype;
		new1.linespacenum = c.linespacenum;
		new1.line1placenum = c.line1placenum;
		new1.pitch = Pitch.new3(c.pitch);
		new1.modernclef = c.modernclef;
		new1.origModClef = c.origModClef;
		new1._ismodernclef = c._ismodernclef;
		new1._signature = c._signature;
		new1._drawInSig = true;
	}

	/*------------------------------------------------------------------------
Method : void setattributes(int ct,int ln,Pitch p,boolean mc,boolean sc,Clef dc)
Purpose: Initialize (or re-initialize) clef information
Parameters:
  Input:  int ct     - clef type (e.g., CLEF_Bmol)
          int ln     - staff location of visible clef
          Pitch p    - pitch represented by clef
          boolean mc - is this a modern clef?
          boolean sc - is this a signature clef?
          Clef dc    - principal clef for display information
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setattributes(ct:number,ln:number,p:Pitch,mc:boolean,sc:boolean,dc:Clef):void
	{
		this.cleftype = ct;
		this.linespacenum = ln;
		this.pitch = Pitch.new4(p,dc);
		this._signature = sc;
		this._drawInSig = true;
		let moderndc:Clef = dc == null ? null:dc.modernclef;
		if( this.isflat() || this.issharp())
			this.linespacenum =(( this.pitch.staffspacenum + 1) | 0);

		this.line1placenum =(( this.pitch.placenum -((( this.linespacenum - 1) | 0))) | 0);
		this._ismodernclef = mc;
		this.modernclef =( this.origModClef = this);
		if( ! this._ismodernclef)
			{
				switch( this.cleftype)
				{
					case Clef.CLEF_C:
					{
					}
					case Clef.CLEF_CFull:
					{
						if( this.linespacenum <= 3)
							this.modernclef = Clef.DefaultModernClefs[Clef.CLEF_MODERNG];
						else
							if( this.linespacenum > 7)
								this.modernclef = Clef.DefaultModernClefs[Clef.CLEF_MODERNF];
							else
								this.modernclef = Clef.DefaultModernClefs[Clef.CLEF_MODERNG8];

						break;
					}
					case Clef.CLEF_F:
					{
					}
					case Clef.CLEF_FFull:
					{
					}
					case Clef.CLEF_Frnd:
					{
					}
					case Clef.CLEF_Fsqr:
					{
					}
					case Clef.CLEF_Gamma:
					{
						this.modernclef = Clef.DefaultModernClefs[Clef.CLEF_MODERNF];
						break;
					}
					case Clef.CLEF_G:
					{
						this.modernclef = Clef.DefaultModernClefs[Clef.CLEF_MODERNG];
						break;
					}
					case Clef.CLEF_Bmol:
					{
					}
					case Clef.CLEF_BmolDouble:
					{
						if( this._signature && this.pitch.noteletter == "B")
							{
								if( this.pitch.octave == 4)
									this.modernclef = Clef.new0(Clef.CLEF_MODERNFlat,5,Pitch.new1("B",4),true,this._signature,moderndc);
								else
									if( this.pitch.octave == 3)
										this.modernclef = Clef.new0(Clef.CLEF_MODERNFlat,5,Pitch.new1("B",3),true,this._signature,moderndc);
									else
										if( this.pitch.octave == 2)
											this.modernclef = Clef.new0(Clef.CLEF_MODERNFlat,3,Pitch.new1("B",2),true,this._signature,moderndc);

							}

						else
							this.modernclef = Clef.new0(Clef.CLEF_MODERNFlat,0,this.pitch,true,this._signature,moderndc);

						break;
					}
					case Clef.CLEF_Bqua:
					{
					}
					case Clef.CLEF_Diesis:
					{
					}
					case Clef.CLEF_Fis:
					{
						this.modernclef = Clef.new0(this.pitch.noteletter == "B" || this.pitch.noteletter == "E" ? Clef.CLEF_MODERNNatural:Clef.CLEF_MODERNSharp,ln,p,true,this._signature,moderndc);
						break;
					}
				}
			}

		this.origModClef = Clef.new1(this.modernclef);
	}

	/*------------------------------------------------------------------------
Method:  char getclefletter()
Purpose: Return letter name for this clef type
Parameters:
  Input:  -
  Output: -
  Return: letter of clef type
------------------------------------------------------------------------*/
	public getclefletter():string
	{
		return Clef.ClefLetters[this.cleftype];
	}

	/*------------------------------------------------------------------------
Method:  int calcypos(Pitch p)
Purpose: Calculates staff position on which to display a pitched event,
         using this as display clef
Parameters:
  Input:  Pitch p - pitch of event
  Output: -
  Return: y line/space position for displaying event
------------------------------------------------------------------------*/
	public calcypos(p:Pitch):number
	{
		return(( p.placenum - this.line1placenum) | 0);
	}

	/*------------------------------------------------------------------------
Method:  int getypos(Clef displayclef)
Purpose: Calculates staff position on which to display this clef
Parameters:
  Input:  Clef displayclef - currently valid principal clef
  Output: -
  Return: y line/space position for displaying this clef
------------------------------------------------------------------------*/
	public getypos(displayclef:Clef):number
	{
		if( displayclef == null || Clef.ClefLetters[this.cleftype]!= "B")
			return(( this.linespacenum - 1) | 0);
		else
			return displayclef.calcypos(this.pitch);

	}

	/*------------------------------------------------------------------------
Method:  boolean isprincipalclef()
Purpose: Determine whether this clef is a type of principal clef
Parameters:
  Input:  -
  Output: -
  Return: true if this clef is a principal clef
------------------------------------------------------------------------*/
	public isprincipalclef():boolean
	{
		return ! this.isflat() && ! this.issharp() && this.cleftype != Clef.CLEF_NONE;
	}

	/*------------------------------------------------------------------------
Method:  boolean issignatureclef()
Purpose: Determine whether this clef is a signature clef
Parameters:
  Input:  -
  Output: -
  Return: true if this clef is a signature clef
------------------------------------------------------------------------*/
	public issignatureclef():boolean
	{
		return this._signature;
	}

	/*------------------------------------------------------------------------
Method:  boolean isflat()
Purpose: Determine whether this clef is a type of flat
Parameters:
  Input:  -
  Output: -
  Return: true if this clef is a flat/round b
------------------------------------------------------------------------*/
	public isflat():boolean
	{
		return Clef.isFlatType(this.cleftype);
	}

	/*------------------------------------------------------------------------
Method:  boolean issharp()
Purpose: Determine whether this clef is a type of sharp/natural
Parameters:
  Input:  -
  Output: -
  Return: true if this clef is a sharp/natural
------------------------------------------------------------------------*/
	public issharp():boolean
	{
		return this.cleftype == Clef.CLEF_Bqua || this.cleftype == Clef.CLEF_Diesis || this.cleftype == Clef.CLEF_MODERNNatural || this.cleftype == Clef.CLEF_MODERNSharp;
	}

	/*------------------------------------------------------------------------
Method:  boolean equals(Clef other)
Purpose: Calculate whether this clef equals another one
Parameters:
  Input:  Clef other - clef against which to compare
  Output: -
  Return: Whether clefs are equal
------------------------------------------------------------------------*/
	public equals(other:Clef):boolean
	{
		if( this.issharp())
			return other.issharp() && this.pitch.equals(other.pitch);
		else
			if( this.isflat())
				return other.isflat() && this.pitch.equals(other.pitch);
			else
				if( this.cleftype == other.cleftype && this.linespacenum == other.linespacenum && this.pitch.equals(other.pitch))
					return true;

		return false;
	}

	//ClefLetters[cleftype]==ClefLetters[other.cleftype] &&
	/*------------------------------------------------------------------------
Method:  boolean contradicts(Clef other)
Purpose: Calculate whether this clef contradicts another one
Parameters:
  Input:  Clef other - clef against which to compare
  Output: -
  Return: Whether clefs conflict
------------------------------------------------------------------------*/
	public contradicts(other:Clef):boolean
	{
		return( this.line1placenum != other.line1placenum);
	}

	/*------------------------------------------------------------------------
Method:  int getApos()
Purpose: Determine position of A below middle C on staff with this clef
Parameters:
  Input:  -
  Output: -
  Return: position of 'A' on staff
------------------------------------------------------------------------*/
	public getApos():number
	{
		return(( 21 - this.line1placenum) | 0);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getcleftype():number
	{
		return this.cleftype;
	}

	public getloc():number
	{
		return this.linespacenum;
	}

	public getStaffLocPitch(staffLoc:number):Pitch
	{
		if( this.pitch != null)
			return Pitch.new3(this.pitch).add((( staffLoc - this.linespacenum) | 0));
		else
			return Pitch.new2(staffLoc);

	}

	public ismodernclef():boolean
	{
		return this._ismodernclef;
	}

	public signature():boolean
	{
		return this._signature;
	}

	public drawInSig():boolean
	{
		return this._drawInSig;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public resetModClef():void
	{
		this.modernclef = Clef.new1(this.origModClef);
	}

	public setSignature(s:boolean):void
	{
		this._signature = s;
	}

	public setDrawInSig(d:boolean):void
	{
		this._drawInSig = d;
	}

	public setFill(filltype:number):void
	{
		if( filltype == Coloration.VOID)
			{
				if( this.cleftype == Clef.CLEF_CFull)
					this.cleftype = Clef.CLEF_C;
				else
					if( this.cleftype == Clef.CLEF_FFull)
						this.cleftype = Clef.CLEF_F;

			}

		else
			if( filltype == Coloration.FULL)
				{
					if( this.cleftype == Clef.CLEF_C)
						this.cleftype = Clef.CLEF_CFull;
					else
						if( this.cleftype == Clef.CLEF_F)
							this.cleftype = Clef.CLEF_FFull;

				}

	}

	/* only affects main C and F clefs */
	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Prints information about this clef
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public prettyprint():void
	{
		System.out.println("    " + this);
	}

	public toString():string
	{
		return "Clef: " + Clef.ClefNames[this.cleftype]+ this.linespacenum;
	}
}
