
import { VoiceMensuralData } from './VoiceMensuralData';
import { VoiceEventListData } from './VoiceEventListData';
import { VoiceChantData } from './VoiceChantData';
import { Voice } from './Voice';
import { VariantReading } from './VariantReading';
import { VariantMarkerEvent } from './VariantMarkerEvent';
import { ProportionEvent } from './ProportionEvent';
import { Proportion } from './Proportion';
import { PieceData } from './PieceData';
import { MusicSection } from './MusicSection';
import { MusicMensuralSection } from './MusicMensuralSection';
import { MusicChantSection } from './MusicChantSection';
import { Event } from './Event';
import { ArrayList } from '../java/util/ArrayList';

export class VariantVersionData
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	ID:string;
	sourceName:string;
	sourceID:number;
	numInList:number;
	editor:string;
	description:string;
	missingVoices:ArrayList<Voice>;
	defaultVersion:boolean = false;

	public static new0(ID:string,numInList:number):VariantVersionData
	{
		let _new0:VariantVersionData = new VariantVersionData;
		VariantVersionData.set0(_new0,ID,numInList);
		return _new0;
	}

	public static set0(new0:VariantVersionData,ID:string,numInList:number):void
	{
		new0.ID = ID;
		new0.numInList = numInList;
		new0.sourceID = - 1;
		new0.missingVoices = new ArrayList<Voice>(16);
	}

	public static new1(ID:string):VariantVersionData
	{
		let _new1:VariantVersionData = new VariantVersionData;
		VariantVersionData.set1(_new1,ID);
		return _new1;
	}

	public static set1(new1:VariantVersionData,ID:string):void
	{
		VariantVersionData.set0(new1,ID,0);
	}

	public static new2(other:VariantVersionData):VariantVersionData
	{
		let _new2:VariantVersionData = new VariantVersionData;
		VariantVersionData.set2(_new2,other);
		return _new2;
	}

	public static set2(new2:VariantVersionData,other:VariantVersionData):void
	{
		new2.copyData(other);
	}

	public copyData(other:VariantVersionData):void
	{
		this.ID = other.ID;
		this.sourceName = other.sourceName;
		this.sourceID = other.sourceID;
		this.numInList = other.numInList;
		this.editor = other.editor;
		this.description = other.description;
		this.missingVoices = new ArrayList<Voice>(other.missingVoices);
	}

	/*------------------------------------------------------------------------
Method:  PieceData constructMusicData(PieceData defaultMusicData[,PieceData newMusicData])
Purpose: Create music data set incorporating this version's variant
         readings
Parameters:
  Input:  PieceData defaultMusicData - base music version without variants
          PieceData newMusicData     - variant music structure to write into
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructMusicData_1(defaultMusicData:PieceData):PieceData
	{
		return this.constructMusicData_2(defaultMusicData,PieceData.new1(defaultMusicData));
	}

	public constructMusicData_2(defaultMusicData:PieceData,newMusicData:PieceData):PieceData
	{
		newMusicData.setCurVersion(this);
		newMusicData.setSections(new ArrayList<MusicSection>());
		for(let origSection of defaultMusicData.getSections())
		{
			let newSection:MusicSection = origSection.shallowCopy_1();
			newSection.setVersion(this);
			for(
			let vi:number = 0;vi < origSection.getNumVoices_1();vi ++)
			{
				let origV:VoiceEventListData = origSection.getVoice_1(vi);
				let newV:VoiceEventListData = null;
				if( origV != null)
					{
						if( newSection instanceof MusicMensuralSection)
							newV = VoiceMensuralData.new3(origV.getMetaData(),newSection);
						else
							if( newSection instanceof MusicChantSection)
								newV = VoiceChantData.new1(origV.getMetaData(),newSection);

						newV.setMissingVersions(origV.getMissingVersions());
						let ei:number = 0;
						let done:boolean = ei >= origV.getNumEvents();
						while( ! done)
						{
							let e:Event = origV.getEvent(ei);
							newV.addEvent_1(e);
							if( e.geteventtype() == Event.EVENT_VARIANTDATA_START)
								{
									let vr:VariantReading = e.getVariantReading_1(this);
									if( vr != null)
										{
											let variantLength:Proportion = vr.getLength();
											let defaultLength:Proportion =(<VariantMarkerEvent> e).getDefaultLength();
											let curProp:Proportion = Proportion.new0(1,1);
											variantLength.setVal_2(0,1);
											defaultLength.setVal_2(0,1);
											for(
											let i:number = 0;i < vr.getNumEvents();i ++)
											{
												let ve:Event = vr.getEvent(i);
												newV.addEvent_1(ve);
												variantLength.add(Proportion.product(ve.getmusictime(),curProp));
												if( ve.geteventtype() == Event.EVENT_PROPORTION)
													curProp.divide((<ProportionEvent> ve).getproportion());

											}
											curProp = Proportion.new0(1,1);
											while( e.geteventtype() != Event.EVENT_VARIANTDATA_END)
											{
												e = origV.getEvent(++ ei);
												defaultLength.add(Proportion.product(e.getmusictime(),curProp));
												if( e.geteventtype() == Event.EVENT_PROPORTION)
													curProp.divide((<ProportionEvent> e).getproportion());

											}
										}

									else
										ei ++;

								}

							else
								ei ++;

							done = ei >= origV.getNumEvents();
						}
					}

				newSection.setVoice_1(vi,newV);
			}
			newMusicData.addSection_2(newSection);
		}
		newMusicData.recalcAllEventParams();
		return newMusicData;
	}

	/* iterate through events list, copying everything but replacing
                   VARIANTDATA segments when necessary */
	/* add variant events */
	/* skip default reading */
	/*            if (newSection instanceof MusicMensuralSection)
              ((MusicMensuralSection)newSection).setVoice(vi,(VoiceMensuralData)newV);
            else if (newSection instanceof MusicChantSection)
              ((MusicChantSection)newSection).setVoice(vi,(VoiceChantData)newV);*/
	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setDefault(defaultVersion:boolean):void
	{
		this.defaultVersion = defaultVersion;
	}

	public setDescription(description:string):void
	{
		this.description = description;
	}

	public setEditor(editor:string):void
	{
		this.editor = editor;
	}

	public setID(ID:string):void
	{
		this.ID = ID;
	}

	public setMissingVoice(v:Voice,missing:boolean):void
	{
		if( missing)
			{
				if( ! this.missingVoices.contains(v))
					this.missingVoices.add(v);

			}

		else
			this.missingVoices.remove(v);

	}

	public setNumInList(numInList:number):void
	{
		this.numInList = numInList;
	}

	public setSourceInfo(sourceName:string,sourceID:number):void
	{
		this.sourceName = sourceName;
		this.sourceID = sourceID;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getDescription():string
	{
		return this.description;
	}

	public getEditor():string
	{
		return this.editor;
	}

	public getID():string
	{
		return this.ID;
	}

	public getMissingVoices():ArrayList<Voice>
	{
		return this.missingVoices;
	}

	public getNumInList():number
	{
		return this.numInList;
	}

	public getSourceID():number
	{
		return this.sourceID;
	}

	public getSourceIDString():string
	{
		return this.sourceID == - 1 ? null:`${this.sourceID}`;
	}

	public getSourceName():string
	{
		return this.sourceName;
	}

	public isDefault():boolean
	{
		return this.defaultVersion;
	}

	public isVoiceMissing(v:Voice):boolean
	{
		return this.missingVoices.contains(v);
	}

	/*------------------------------------------------------------------------
Method:  String toString()
Purpose: Convert to string
Parameters:
  Input:  -
  Output: -
  Return: string representation of structure
------------------------------------------------------------------------*/
	public toString():string
	{
		let ret:string = "Variant Version " + this.ID;
		if( this.sourceName != null)
			ret += "; source: " + this.sourceName + " (ID " + this.sourceID + ")";

		if( this.editor != null)
			ret += "; editor: " + this.editor;

		if( this.description != null)
			ret += "; " + this.description;

		return ret;
	}
}
