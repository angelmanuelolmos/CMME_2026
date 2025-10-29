
import { ViewCanvas } from './ViewCanvas';
import { VariantReadingPanel } from './VariantReadingPanel';
import { StaffEventData } from './StaffEventData';
import { ScoreRenderer } from './ScoreRenderer';
import { VoiceGfxInfo } from './ScoreRenderer';
import { RenderList } from './RenderList';
import { RenderedEventGroup } from './RenderedEventGroup';
import { MusicFont } from './MusicFont';
import { CriticalNotesWindow } from './CriticalNotesWindow';
/*----------------------------------------------------------------------*/
/*

        Module          : VariantDisplayFrame.java

        Package         : Gfx

        Classes Included: VariantDisplayFrame

        Purpose         : Frame displaying all variant readings (and default
                          reading) at one location

        Programmer      : Ted Dumitrescu

        Date Started    : 1/21/2008 (moved out of functions in ViewCanvas)

        Updates         :
7/19/08: moved individual reading display to public class VariantReadingPanel

                                                                        */
/*----------------------------------------------------------------------*/
/*----------------------------------------------------------------------*/
/* Imported packages */
import { Color } from '../java/awt/Color';
import { Container } from '../java/awt/Container';
import { Dimension } from '../java/awt/Dimension';
import { GridBagConstraints } from '../java/awt/GridBagConstraints';
import { GridBagLayout } from '../java/awt/GridBagLayout';
import { WindowAdapter } from '../java/awt/event/WindowAdapter';
import { WindowListener } from '../java/awt/event/WindowListener';
import { WindowEvent } from '../java/awt/event/WindowEvent';
import { JPanel } from '../javax/swing/JPanel';
import { JDialog } from '../javax/swing/JDialog';
import { BorderFactory } from '../javax/swing/BorderFactory';
import { BoxLayout } from '../javax/swing/BoxLayout';
import { JLabel } from '../javax/swing/JLabel';
import { Toolkit } from '../java/awt/Toolkit';
import { List } from '../java/util/List';
import { LinkedList } from '../java/util/LinkedList';
import { PieceData } from '../DataStruct/PieceData';
import { VariantMarkerEvent } from '../DataStruct/VariantMarkerEvent';
import { VariantReading } from '../DataStruct/VariantReading';
import { VariantVersionData } from '../DataStruct/VariantVersionData';
import { VoiceEventListData } from '../DataStruct/VoiceEventListData';

export class VariantDisplayFrame extends JDialog
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	protected vStartEvent:VariantMarkerEvent;
	protected canvas:ViewCanvas;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: VariantDisplayFrame(RenderedEventGroup renderedVar,
                                 VoiceEventListData v,ScoreRenderer rs,int vnum,
                                 int fx,int fy,ViewCanvas canvas,MusicFont MusicGfx,
                                 float STAFFSCALE,float VIEWSCALE)
Parameters:
  Input:  
  Output: -
------------------------------------------------------------------------*/
	public constructor(renderedVar:RenderedEventGroup,v:VoiceEventListData,rs:ScoreRenderer,vnum:number,fx:number,fy:number,canvas:ViewCanvas,MusicGfx:MusicFont,STAFFSCALE:number,VIEWSCALE:number)
	{
		super(canvas.parentwin,false);
		this.canvas = canvas;
		let mnum:number = rs.eventinfo[vnum].getEvent(renderedVar.firstEventNum).getmeasurenum();
		let rv:RenderList = rs.eventinfo[vnum];
		this.setTitle("V" +((( vnum + 1) | 0)) + ", m. " + CriticalNotesWindow.createMeasureString(rv,rs.getMeasure(rv.getEvent(renderedVar.firstEventNum).getmeasurenum()),renderedVar.firstEventNum));
		this.setBackground(Color.white);
		this.vStartEvent =<VariantMarkerEvent> rv.getEvent(renderedVar.firstEventNum).getEvent_1();
		this.vStartEvent.calcVariantTypes(v);
		let vEndEvent:VariantMarkerEvent =<VariantMarkerEvent> rv.getEvent(renderedVar.lastEventNum).getEvent_1();
		vEndEvent.setVarTypeFlags(this.vStartEvent.getVarTypeFlags());
		let numReadings:number = this.vStartEvent.getNumReadings();
		let variantStaves:LinkedList<StaffEventData> = new LinkedList<StaffEventData>();
		let vrcp:Container = this.getContentPane();
		vrcp.setLayout(new GridBagLayout());
		let vrc:GridBagConstraints = new GridBagConstraints();
		vrc.gridy = 0;
		let infoPanel:JPanel = this.createInfoPanel();
		vrc.gridx = 0;
		vrc.gridwidth = GridBagConstraints.REMAINDER;
		vrcp.add(infoPanel,vrc);
		vrc.gridwidth = 1;
		vrc.gridy ++;
		let musicData:PieceData = canvas.getMusicData_1();
		let defaultVersions:List<VariantVersionData> = this.vStartEvent.getDefaultVersions(musicData.getVariantVersions(),musicData.getVoice(vnum),v);
		let defaultVersionsPanel:JPanel = this.createVersionsPanel_2(defaultVersions,true);
		let defaultVariantPanel:JPanel = VariantReadingPanel.new0_4(v,this.vStartEvent.getDefaultListPlace(),rs.eventinfo[vnum].getClefEvents(renderedVar.firstEventNum),false,MusicGfx,STAFFSCALE,VIEWSCALE);
		vrc.gridx = 0;
		vrcp.add(defaultVersionsPanel,vrc);
		vrc.gridx = 1;
		vrcp.add(defaultVariantPanel,vrc);
		vrc.gridy ++;
		for(let vr of this.vStartEvent.getReadings())
		{
			let versionsPanel:JPanel = this.createVersionsPanel_2(vr.getVersions(),false);
			let variantPanel:JPanel = VariantReadingPanel.new1_4(vr,rs.eventinfo[vnum].getClefEvents(renderedVar.firstEventNum),vr.isError(),MusicGfx,STAFFSCALE,VIEWSCALE);
			vrc.gridx = 0;
			vrcp.add(versionsPanel,vrc);
			vrc.gridx = 1;
			vrcp.add(variantPanel,vrc);
			vrc.gridy ++;
		}
		this.createAdditionalControls_1(vrcp,vrc);
		this.registerListeners_5();
		this.pack();
		let screenSize:Dimension = Toolkit.getDefaultToolkit().getScreenSize();
		if((( fx + this.getSize().width) | 0) > screenSize.width)
			fx =(( screenSize.width - this.getSize().width) | 0);

		if((( fy + this.getSize().height) | 0) > screenSize.height)
			fy =(( screenSize.height - this.getSize().height) | 0);

		this.setLocation(fx,fy);
	}

	/* get list of "unused" versions to be listed with default reading */
	/* ensure that the frame is on-screen */
	public createInfoPanel():JPanel
	{
		let infoLabel:JLabel = new JLabel("Variant type: " + VariantReading.varTypesToStr(this.vStartEvent.getVarTypeFlags()));
		let infoPanel:JPanel = new JPanel();
		infoPanel.add(infoLabel);
		return infoPanel;
	}

	public createVersionsPanel_2(versions:List<VariantVersionData>,defaultVersion:boolean):JPanel
	{
		let versionsPanel:JPanel = new JPanel();
		versionsPanel.setLayout(new BoxLayout(versionsPanel,BoxLayout.Y_AXIS));
		for(
		let i:number = 0;i < versions.size();i ++)
		versionsPanel.add(new JLabel(versions.get(i).getID()));
		versionsPanel.setBorder(BorderFactory.createEmptyBorder(5,5,5,5));
		return versionsPanel;
	}

	//    JTable versionsTable=new JTable(versions.size(),1);
	//      versionsTable.setValueAt(" "+versions.get(i).getID(),i,0);
	/* deprecated
  protected JPanel createVersionsPanel(VariantVersionData version)
  {
    JPanel versionsPanel=new JPanel();
    JTable versionsTable=new JTable(1,1);
    versionsTable.setValueAt(version.getID(),0,0);
    versionsPanel.add(versionsTable);
    return versionsPanel;
  }*/
	public createAdditionalControls_1(vrcp:Container,vrc:GridBagConstraints):void
	{
	}

	/*------------------------------------------------------------------------
Method:  void closeFrame()
Purpose: Close frame and clean up
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public closeFrame_1():void
	{
		this.setVisible(false);
		this.unregisterListeners_8();
		this.dispose();
	}

	/*------------------------------------------------------------------------
Method:  void [un]registerListeners()
Purpose: Add and remove event listeners
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public registerListeners_5():void
	{
		this.addWindowListener(
		{

			windowClosing:(event:WindowEvent):void =>
			{
				this.closeFrame_1();
			}
		}
		);
	}

	public unregisterListeners_8():void
	{
		for(let w of this.getListeners("WindowListener"))
		this.removeWindowListener(w);
	}
}
