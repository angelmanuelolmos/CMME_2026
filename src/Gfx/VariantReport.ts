
import { RenderList } from './RenderList';
import { RenderedEvent } from './RenderedEvent';
import { MeasureInfo } from './MeasureInfo';
import { CriticalNotesWindow } from './CriticalNotesWindow';
import { ActionListener } from '../java/awt/event/ActionListener';
import { List } from '../java/util/List';
import { JButton } from '../javax/swing/JButton';
import { VariantMarkerEvent } from '../DataStruct/VariantMarkerEvent';
import { VariantVersionData } from '../DataStruct/VariantVersionData';
import { VoiceEventListData } from '../DataStruct/VoiceEventListData';

export class VariantReport
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public voiceNum:number;
	public measureNum:number;
	public betweenMeasures:boolean;
	public revNum:number;
	public varMarker:VariantMarkerEvent;
	public varFlags:number;
	public measureLabel:string;
	public measureButton:JButton;
	public renderedVoice:RenderList;
	public voiceEvents:VoiceEventListData;
	public defaultVersions:List<VariantVersionData>;
	/*------------------------------------------------------------------------
Constructor: VariantReport(MeasureInfo m,RenderList rv,int vmi)
Purpose:     Initialize structure with display info based on variant/event list
Parameters:
  Input:  
  Output: -
------------------------------------------------------------------------*/
	public constructor(m:MeasureInfo,vnum:number,rv:RenderList,vmi:number)
	{
		this.voiceNum =(( vnum + 1) | 0);
		this.revNum = vmi;
		this.renderedVoice = rv;
		this.voiceEvents = rv.getVoiceEventData();
		this.varMarker =<VariantMarkerEvent>( rv.getEvent(this.revNum).getEvent_1());
		this.varFlags = this.varMarker.calcVariantTypes(this.voiceEvents);
		this.measureNum =(( m.getMeasureNum() + 1) | 0);
		this.measureLabel = CriticalNotesWindow.createMeasureString(rv,m,vmi);
		this.measureButton = null;
		this.betweenMeasures = this.measureLabel.indexOf("/") >= 0;
		let nextre:RenderedEvent = rv.getEvent((( this.revNum + 1) | 0));
		if((( nextre.getmeasurenum() + 1) | 0) > this.measureNum)
			this.measureNum ++;

	}

	//.getVarTypeFlags();
	initMeasureButton(listener:ActionListener):void
	{
		this.measureButton = new JButton(this.measureLabel);
		this.measureButton.addActionListener(listener);
	}

	unregisterListeners(listener:ActionListener):void
	{
		if( this.measureButton != null)
			this.measureButton.removeActionListener(listener);

	}
}
