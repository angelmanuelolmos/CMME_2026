
import { VoiceEventListData } from './VoiceEventListData';
import { VoiceChantData } from './VoiceChantData';
import { Voice } from './Voice';
import { MusicSection } from './MusicSection';
import { Event } from './Event';
import { Coloration } from './Coloration';

export class MusicChantSection extends MusicSection
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	voices:VoiceChantData[];

	public static new0(numVoices:number,editorial:boolean,baseColoration:Coloration):MusicChantSection
	{
		let _new0:MusicChantSection = new MusicChantSection;
		MusicChantSection.set0(_new0,numVoices,editorial,baseColoration);
		return _new0;
	}

	public static set0(new0:MusicChantSection,numVoices:number,editorial:boolean,baseColoration:Coloration):void
	{
		new0.initParams(editorial,MusicSection.PLAINCHANT);
		new0.baseColoration = baseColoration;
		new0.voices = Array(numVoices);
		for(
		let vi:number = 0;vi < new0.voices.length;vi ++)
		new0.voices[vi]= null;
	}

	public static new1(numVoices:number):MusicChantSection
	{
		let _new1:MusicChantSection = new MusicChantSection;
		MusicChantSection.set1(_new1,numVoices);
		return _new1;
	}

	public static set1(new1:MusicChantSection,numVoices:number):void
	{
		MusicChantSection.set0(new1,numVoices,false,Coloration.DEFAULT_CHANT_COLORATION);
	}

	/*------------------------------------------------------------------------
Method:  MusicSection shallowCopy()
Purpose: Create a shallow copy of this object
Parameters:
  Input:  -
  Output: -
  Return: new shallow copy of this
------------------------------------------------------------------------*/
	public shallowCopy_1():MusicSection
	{
		let copySection:MusicChantSection = MusicChantSection.new0(this.voices.length,this.editorial,this.baseColoration);
		this.copyBaseInfo(copySection);
		copySection.voices = Array(this.voices.length);
		for(
		let vi:number = 0;vi < this.voices.length;vi ++)
		copySection.voices[vi]= this.voices[vi];
		return copySection;
	}

	/*------------------------------------------------------------------------
Method:    void addVoice(Voice newv)
Overrides: MusicSection.addVoice
Purpose:   Add new voice to end of voice list (if applicable)
Parameters:
  Input:  Voice newv - new voice metadata
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addVoice_1(newv:Voice):void
	{
		let newVoices:VoiceChantData[]= Array(((( this.voices.length + 1) | 0)));
		for(
		let i:number = 0;i < this.voices.length;i ++)
		newVoices[i]= this.voices[i];
		this.voices = newVoices;
		this.voices[((( this.voices.length - 1) | 0))]= null;
	}

	/* copy voice list */
	/* change array pointer; set new voice as null */
	/*------------------------------------------------------------------------
Method:    void initializeNewVoice(int vnum,Voice newv)
Overrides: MusicSection.initializeNewVoice
Purpose:   Create new voice within voice list (if applicable)
Parameters:
  Input:  int vnum   - new voice number
          Voice newv - new voice metadata
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public initializeNewVoice_1(vnum:number,newv:Voice):void
	{
		this.voices[vnum]= VoiceChantData.new1(newv,this);
		this.voices[vnum].addEvent_1(Event.new1(Event.EVENT_SECTIONEND));
	}

	/*------------------------------------------------------------------------
Method:    void removeVoice(int vnum)
Overrides: MusicSection.removeVoice
Purpose:   Remove voice from section (if applicable)
Parameters:
  Input:  int vnum - number of voice to remove
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public removeVoice_1(vnum:number):void
	{
		this.voices[vnum]= null;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getNumVoices_1():number
	{
		return this.voices.length;
	}

	public getVoice_1(vnum:number):VoiceEventListData
	{
		if( vnum >= this.voices.length)
			return null;

		return this.voices[vnum];
	}

	public getVoiceMetaData_1(vnum:number):Voice
	{
		return this.getVoice_1(vnum).getMetaData();
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setVoice_1(vnum:number,v:VoiceEventListData):void
	{
		this.voices[vnum]=<VoiceChantData> v;
	}
}
