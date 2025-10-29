
import { System } from '../java/lang/System';
import { VoiceEventListData } from './VoiceEventListData';
import { PieceData } from './PieceData';
import { MusicSection } from './MusicSection';
import { Clef } from './Clef';

export class Voice
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	/* basic metadata */
	vnum:number;
	name:string;
	editorial:boolean;
	suggestedModernClef:Clef;
	generalData:PieceData;

	public static new0(gd:PieceData,vn:number,n:string,e:boolean,smc:Clef):Voice
	{
		let _new0:Voice = new Voice;
		Voice.set0(_new0,gd,vn,n,e,smc);
		return _new0;
	}

	public static set0(new0:Voice,gd:PieceData,vn:number,n:string,e:boolean,smc:Clef):void
	{
		new0.vnum = vn;
		new0.name = n;
		new0.editorial = e;
		new0.suggestedModernClef = smc;
		new0.generalData = gd;
	}

	public static new1(gd:PieceData,vn:number,n:string,e:boolean):Voice
	{
		let _new1:Voice = new Voice;
		Voice.set1(_new1,gd,vn,n,e);
		return _new1;
	}

	public static set1(new1:Voice,gd:PieceData,vn:number,n:string,e:boolean):void
	{
		Voice.set0(new1,gd,vn,n,e,null);
	}

	public static new2(v:Voice):Voice
	{
		let _new2:Voice = new Voice;
		Voice.set2(_new2,v);
		return _new2;
	}

	public static set2(new2:Voice,v:Voice):void
	{
		new2.vnum = v.vnum;
		new2.name = v.name;
		new2.editorial = v.editorial;
		new2.suggestedModernClef = v.suggestedModernClef;
		new2.generalData = v.generalData;
	}

	/*------------------------------------------------------------------------
Methods: boolean hasFinalisSection()
Purpose: Checks whether this voice, in an incipit score, has a non-empty
         Finalis section
Parameters:
  Input:  -
  Output: -
  Return: true if a finalis appears in this voice-incipit
------------------------------------------------------------------------*/
	public hasFinalisSection():boolean
	{
		if( ! this.getGeneralData().isIncipitScore())
			{
				System.err.println("Error: called Voice.hasFinalisSection() in a non-incipit score");
				return false;
			}

		if( this.getGeneralData().getNumSections() < 2)
			return false;

		let ms:MusicSection = this.getGeneralData().getSection((( this.getGeneralData().getNumSections() - 1) | 0));
		let v:VoiceEventListData = ms.getVoice_1((( this.getNum() - 1) | 0));
		if( v == null || v.getNumEvents() < 2)
			return false;

		return true;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getName():string
	{
		return this.name;
	}

	public getAbbrevLetter():string
	{
		if( this.name.length == 0)
			return " ";

		if( this.name.length > 1 && this.name.charAt(0) == "[")
			return "" + this.name.charAt(1);

		return "" + this.name.charAt(0);
	}

	public getNum():number
	{
		return this.vnum;
	}

	public getStaffTitle():string
	{
		if( this.editorial)
			return this.name + " (Editorial)";

		return this.name;
	}

	public isEditorial():boolean
	{
		return this.editorial;
	}

	public getSuggestedModernClef():Clef
	{
		return this.suggestedModernClef;
	}

	public getGeneralData():PieceData
	{
		return this.generalData;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setName(n:string):void
	{
		this.name = n;
	}

	public setNum(n:number):void
	{
		this.vnum = n;
	}

	public setEditorial(e:boolean):void
	{
		this.editorial = e;
	}

	public setSuggestedModernClef(c:Clef):void
	{
		this.suggestedModernClef = c;
	}

	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Prints information about this voice
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public prettyprint():void
	{
		System.out.print("Voice " + this.vnum);
		if( this.editorial)
			System.out.print(" (editorial)");

		System.out.println(":");
		System.out.println("  Name: " + this.name);
	}
}
