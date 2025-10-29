
import { VoiceMensuralData } from './VoiceMensuralData';
import { VoiceEventListData } from './VoiceEventListData';
import { Voice } from './Voice';
import { TacetInfo } from './TacetInfo';
import { MusicSection } from './MusicSection';
import { Event } from './Event';
import { Coloration } from './Coloration';
import { ArrayList } from '../java/util/ArrayList';
import { List } from '../java/util/List';

export class MusicMensuralSection extends MusicSection
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	voices:VoiceMensuralData[];

	public static new2(numVoices:number,editorial:boolean,baseColoration:Coloration):MusicMensuralSection
	{
		let _new2:MusicMensuralSection = new MusicMensuralSection;
		MusicMensuralSection.set2(_new2,numVoices,editorial,baseColoration);
		return _new2;
	}

	public static set2(new2:MusicMensuralSection,numVoices:number,editorial:boolean,baseColoration:Coloration):void
	{
		new2.initParams(editorial,MusicSection.MENSURAL_MUSIC);
		new2.baseColoration = baseColoration;
		new2.voices = Array(numVoices);
		for(
		let vi:number = 0;vi < new2.voices.length;vi ++)
		new2.voices[vi]= null;
	}

	public static new3(numVoices:number):MusicMensuralSection
	{
		let _new3:MusicMensuralSection = new MusicMensuralSection;
		MusicMensuralSection.set3(_new3,numVoices);
		return _new3;
	}

	public static set3(new3:MusicMensuralSection,numVoices:number):void
	{
		MusicMensuralSection.set2(new3,numVoices,false,Coloration.DEFAULT_COLORATION);
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
		let copySection:MusicMensuralSection = MusicMensuralSection.new2(this.voices.length,this.editorial,this.baseColoration);
		this.copyBaseInfo(copySection);
		copySection.voices = Array(this.voices.length);
		for(
		let vi:number = 0;vi < this.voices.length;vi ++)
		copySection.voices[vi]= this.voices[vi];
		copySection.tacetInfo = new ArrayList<TacetInfo>(this.tacetInfo);
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
		let newVoices:VoiceMensuralData[]= Array(((( this.voices.length + 1) | 0)));
		for(
		let i:number = 0;i < this.voices.length;i ++)
		newVoices[i]= this.voices[i];
		this.voices = newVoices;
		this.initializeNewVoice_1((( this.voices.length - 1) | 0),newv);
	}

	/* copy voice list */
	/* change array pointer and add new voice */
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
		this.voices[vnum]= VoiceMensuralData.new3(newv,this);
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
Method:    void updateVoiceList(Voice[] oldVL,Voice[] newVL)
Overrides: MusicSection.updateVoiceList
Purpose:   Update voice list to match changes in master voice list (if
           applicable)
Parameters:
  Input:  Voice[] oldVL,newVL   - old and new master voice lists
          Voice[] newVoiceOrder - old voice list rearranged to match new order
  Output: -
  Return: -
------------------------------------------------------------------------*/
	private ArraysasList(elements:any[]):List<any>
	{
		let list:List<any> = new ArrayList<any>();
		for(let element of elements)
		{
			list.add(element);
		}
		return list;
	}

	public updateVoiceList_1(oldVL:Voice[],newVL:Voice[],newVoiceOrder:Voice[]):void
	{
		let newVoiceList:VoiceMensuralData[]= Array(newVL.length);
		let vmd:VoiceMensuralData;
		for(
		let i:number = 0;i < newVoiceOrder.length;i ++)
		{
			if( this.ArraysasList(oldVL).contains(newVoiceOrder[i]))
				{
					vmd = this.getMensuralDataForVoice(newVoiceOrder[i]);
					if( vmd != null)
						vmd.setMetaData(newVL[i]);

				}

			else
				{
					vmd = VoiceMensuralData.new3(newVL[i],this);
					vmd.addEvent_1(Event.new1(Event.EVENT_SECTIONEND));
				}

			newVoiceList[i]= vmd;
		}
		this.voices = newVoiceList;
	}

	//    LinkedList<VoiceMensuralData> newVoiceList=new LinkedList<VoiceMensuralData>();
	//CHANGE
	/* voice is in both old and new lists */
	/* voice is new */
	//newVoiceList.toArray(new VoiceMensuralData[1]);
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

	/* search for mensural data for a given set of master voice meta-data */
	public getMensuralDataForVoice(v:Voice):VoiceMensuralData
	{
		for(let vmd of this.voices)
		if( vmd != null && vmd.getMetaData() == v)
			return vmd;

		return null;
	}

	// not found
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
		this.voices[vnum]=<VoiceMensuralData> v;
	}
}
