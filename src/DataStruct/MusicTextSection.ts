
import { MusicSection } from './MusicSection';

/*----------------------------------------------------------------------*/
/*

        Module          : MusicTextSection.java

        Package         : DataStruct

        Classes Included: MusicTextSection

        Purpose         : Contents of one text section

        Programmer      : Ted Dumitrescu

        Date Started    : 2/14/07

        Updates         :

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   MusicTextSection
Extends: MusicSection
Purpose: Contents of one text section
------------------------------------------------------------------------*/
export class MusicTextSection extends MusicSection
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	sectionText:string;

	public static new4(sectionText:string,editorial:boolean):MusicTextSection
	{
		let _new4:MusicTextSection = new MusicTextSection;
		MusicTextSection.set4(_new4,sectionText,editorial);
		return _new4;
	}

	public static set4(new4:MusicTextSection,sectionText:string,editorial:boolean):void
	{
		new4.initParams(editorial,MusicSection.TEXT);
		new4.sectionText = sectionText;
	}

	public static new5(sectionText:string):MusicTextSection
	{
		let _new5:MusicTextSection = new MusicTextSection;
		MusicTextSection.set5(_new5,sectionText);
		return _new5;
	}

	public static set5(new5:MusicTextSection,sectionText:string):void
	{
		MusicTextSection.set4(new5,sectionText,false);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getSectionText():string
	{
		return this.sectionText;
	}
}
