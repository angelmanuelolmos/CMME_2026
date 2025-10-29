
import { VoiceEventListData } from './VoiceEventListData';
import { Voice } from './Voice';
import { MusicSection } from './MusicSection';

export class VoiceChantData extends VoiceEventListData
{

	public static new1(v:Voice,section:MusicSection):VoiceChantData
	{
		let _new1:VoiceChantData = new VoiceChantData;
		VoiceChantData.set1(_new1,v,section);
		return _new1;
	}

	public static set1(new1:VoiceChantData,v:Voice,section:MusicSection):void
	{
		new1.initParams_2(v,section);
	}

	public static new2():VoiceChantData
	{
		let _new2:VoiceChantData = new VoiceChantData;
		VoiceChantData.set2(_new2);
		return _new2;
	}

	public static set2(new2:VoiceChantData):void
	{
		new2.initParams_1();
	}
}
