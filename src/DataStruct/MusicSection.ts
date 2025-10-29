
import { System } from '../java/lang/System';
import { VoiceEventListData } from './VoiceEventListData';
import { Voice } from './Voice';
import { VariantVersionData } from './VariantVersionData';
import { TacetInfo } from './TacetInfo';
import { Coloration } from './Coloration';
import { ArrayList } from '../java/util/ArrayList';

export abstract class MusicSection
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	/* section types */
	public static MENSURAL_MUSIC:number = 0;
	public static PLAINCHANT:number = 1;
	public static TEXT:number = 2;
	public static sectionTypeNames:string[]=["Mensural music","Plainchant","Text"];
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	editorial:boolean;
	principalSource:string = null;
	principalSourceNum:number = 0;
	sectionType:number;
	baseColoration:Coloration;
	curVersion:VariantVersionData = null;
	tacetInfo:ArrayList<TacetInfo>;

	/*----------------------------------------------------------------------*/
	/* Instance methods */
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
		return null;
	}

	/* to be overridden */
	public copyBaseInfo(copySection:MusicSection):void
	{
		copySection.principalSource = this.principalSource;
		copySection.principalSourceNum = this.principalSourceNum;
		copySection.curVersion = this.curVersion;
		copySection.tacetInfo = new ArrayList<TacetInfo>(this.tacetInfo);
	}

	/*------------------------------------------------------------------------
Method:  void initParams()
Purpose: Basic initialization to be called from all constructors
Parameters:
  Input:  common MusicSection attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public initParams(editorial:boolean,sectionType:number):void
	{
		this.editorial = editorial;
		this.sectionType = sectionType;
		this.tacetInfo = new ArrayList<TacetInfo>();
	}

	/*------------------------------------------------------------------------
Method:  void recalcAllEventParams([VoiceEventListData[] lastv])
Purpose: Recalculate event attributes based on parameters (clef, mensuration
         info) for all voices
Parameters:
  Input:  VoiceEventListData[] last v - voices in last section (providing starting
                                        parameters for this section)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public recalcAllEventParams_1(lastv:VoiceEventListData[]):void
	{
		for(
		let vi:number = 0;vi < this.getNumVoices_1();vi ++)
		{
			let v:VoiceEventListData = this.getVoice_1(vi);
			if( v != null)
				v.recalcEventParams_2(lastv == null ? null:lastv[vi]);

		}
	}

	public recalcAllEventParams_2():void
	{
		this.recalcAllEventParams_1(null);
	}

	/*------------------------------------------------------------------------
Method:  void addVoice(Voice newv)
Purpose: Add new voice to end of voice list (if applicable)
Parameters:
  Input:  Voice newv - new voice metadata
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addVoice_1(newv:Voice):void
	{
		System.err.println("Error: called addVoice in no-voice section");
	}

	/*------------------------------------------------------------------------
Method:  void initializeNewVoice(int vnum,Voice newv)
Purpose: Create new voice within voice list (if applicable)
Parameters:
  Input:  int vnum   - new voice number
          Voice newv - new voice metadata
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public initializeNewVoice_1(vnum:number,newv:Voice):void
	{
		System.err.println("Error: called initializeNewVoice in no-voice section");
	}

	/*------------------------------------------------------------------------
Method:  void removeVoice(int vnum)
Purpose: Remove voice from section (if applicable)
Parameters:
  Input:  int vnum - number of voice to remove
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public removeVoice_1(vnum:number):void
	{
		System.err.println("Error: called removeVoice in no-voice section");
	}

	/*------------------------------------------------------------------------
Methods: void updateVoiceList(Voice[] oldVL,Voice[] newVL,Voice[] newVoiceOrder)
Purpose: Update voice list to match changes in master voice list (if
         applicable)
Parameters:
  Input:  Voice[] oldVL,newVL   - old and new master voice lists
          Voice[] newVoiceOrder - old voice list rearranged to match new order
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public updateVoiceList_1(oldVL:Voice[],newVL:Voice[],newVoiceOrder:Voice[]):void
	{
	}

	/* default: no action */
	/*------------------------------------------------------------------------
Methods: int getValidVoicenum(int vnum)
Purpose: Calculate valid voice number closest to a given number
Parameters:
  Input:  int vnum - voice number to attempt to get
  Output: -
  Return: valid voice number (closest to given number)
------------------------------------------------------------------------*/
	public getValidVoicenum(vnum:number):number
	{
		if( this.getVoice_1(vnum) != null)
			return vnum;

		let beforeVnum:number =(( vnum - 1) | 0);
		let afterVnum:number =(( vnum + 1) | 0);
		let done:boolean = beforeVnum < 0 && afterVnum >= this.getNumVoices_1();
		while( ! done)
		if( beforeVnum >= 0 && this.getVoice_1(beforeVnum) != null)
			return beforeVnum;
		else
			if( afterVnum < this.getNumVoices_1() && this.getVoice_1(afterVnum) != null)
				return afterVnum;
			else
				{
					beforeVnum --;
					afterVnum ++;
					done = beforeVnum < 0 && afterVnum >= this.getNumVoices_1();
				}

		return - 1;
	}

	/* look for closest valid voice to vnum */
	/* no voices in section! */
	/*------------------------------------------------------------------------
Methods: void initializeNewVoice(Voice v)
Purpose: Create new voice within 
Parameters:
  Input:  int vnum - voice number to attempt to get
  Output: -
  Return: valid voice number (closest to given number)
------------------------------------------------------------------------*/
	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getBaseColoration():Coloration
	{
		return this.baseColoration;
	}

	public getMissingVersions(vnum:number):ArrayList<VariantVersionData>
	{
		return this.getVoice_1(vnum).getMissingVersions();
	}

	public getNumVoices_1():number
	{
		return 0;
	}

	public getNumVoicesUsed():number
	{
		let numVoices:number = this.getNumVoices_1();
		let numVoicesUsed:number = 0;
		for(
		let i:number = 0;i < numVoices;i ++)
		if( this.getVoice_1(i) != null)
			numVoicesUsed ++;

		return numVoicesUsed;
	}

	public getPrincipalSource():string
	{
		return this.principalSource;
	}

	public getPrincipalSourceNum():number
	{
		return this.principalSourceNum;
	}

	public getSectionType():number
	{
		return this.sectionType;
	}

	public getTacetInfo():ArrayList<TacetInfo>
	{
		return this.tacetInfo;
	}

	public getTacetText(vnum:number):string
	{
		for(let ti of this.tacetInfo)
		if( ti.voiceNum == vnum)
			return ti.tacetText;

		return null;
	}

	public getVersion():VariantVersionData
	{
		return this.curVersion;
	}

	public getVoice_1(vnum:number):VoiceEventListData
	{
		return null;
	}

	public getVoiceMetaData_1(vnum:number):Voice
	{
		return null;
	}

	public isDefaultVersion():boolean
	{
		return this.curVersion == null;
	}

	public isEditorial():boolean
	{
		return this.editorial;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addMissingVersion(vnum:number,vvd:VariantVersionData):void
	{
		this.getVoice_1(vnum).addMissingVersion(vvd);
	}

	public removeMissingVersion(vnum:number,vvd:VariantVersionData):void
	{
		this.getVoice_1(vnum).removeMissingVersion(vvd);
	}

	public setBaseColoration(baseColoration:Coloration):void
	{
		this.baseColoration = baseColoration;
	}

	public setVersion(version:VariantVersionData):void
	{
		this.curVersion = version;
	}

	public setEditorial(editorial:boolean):void
	{
		this.editorial = editorial;
	}

	public setMissingVersions(vnum:number,missingVersions:ArrayList<VariantVersionData>):void
	{
		this.getVoice_1(vnum).setMissingVersions(missingVersions);
	}

	public setPrincipalSource(principalSource:string):void
	{
		this.principalSource = principalSource;
	}

	public setPrincipalSourceNum(principalSourceNum:number):void
	{
		this.principalSourceNum = principalSourceNum;
	}

	public setTacetText(vnum:number,text:string):void
	{
		let vi:number;
		for(
		vi = 0;vi < this.tacetInfo.size() && this.tacetInfo.get(vi).voiceNum < vnum;vi ++)
		;
		if( vi < this.tacetInfo.size())
			{
				let ti:TacetInfo = this.tacetInfo.get(vi);
				if( ti.voiceNum == vnum)
					if( !( text == ""))
						ti.tacetText = text;
					else
						this.tacetInfo.remove(vi);


				else
					if( !( text == ""))
						this.tacetInfo.add(vi,new TacetInfo(vnum,text));

			}

		else
			if( !( text == ""))
				this.tacetInfo.add(new TacetInfo(vnum,text));

	}

	/* replace existing text */
	/* remove blank text */
	/* insert new entry */
	/* append new entry */
	public setVoice_1(vnum:number,v:VoiceEventListData):void
	{
	}
}
