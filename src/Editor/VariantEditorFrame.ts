
import { TextDeleteDialog } from './TextDeleteDialog';
import { EditorCursor } from './ScoreEditorCanvas';
import { ScoreEditorCanvas } from './ScoreEditorCanvas';
import { OriginalTextDeleteDialog } from './OriginalTextDeleteDialog';
import { NoteInfoPanel } from './NoteInfoPanel';
import { ModernTextDeleteDialog } from './ModernTextDeleteDialog';
import { ModernKeySigPanel } from './ModernKeySigPanel';
import { MensurationChooser } from './MensurationChooser';
import { GeneralInfoFrame } from './GeneralInfoFrame';
import { EditingOptionsFrame } from './EditingOptionsFrame';
import { ColorationChooser } from './ColorationChooser';
/*----------------------------------------------------------------------*/
/*

        Module          : VariantEditorFrame.java

        Package         : Editor

        Classes Included: VariantEditorFrame

        Purpose         : Editing variant reading meta-data at one location

        Programmer      : Ted Dumitrescu

        Date Started    : 1/22/2008

        Updates         :
7/7/2011: added "Set as default" buttons

                                                                        */
/*----------------------------------------------------------------------*/
/*----------------------------------------------------------------------*/
/* Imported packages */
import { Container } from '../java/awt/Container';
import { GridBagConstraints } from '../java/awt/GridBagConstraints';
import { GridBagLayout } from '../java/awt/GridBagLayout';
import { ActionEvent } from '../java/awt/event/ActionEvent';
import { ActionListener } from '../java/awt/event/ActionListener';
import { JPanel } from '../javax/swing/JPanel';
import { JButton } from '../javax/swing/JButton';
import { JComboBox } from '../javax/swing/JComboBox';
import { JLabel } from '../javax/swing/JLabel';
import { List } from '../java/util/List';
import { LinkedList } from '../java/util/LinkedList';
import { VariantVersionData } from '../DataStruct/VariantVersionData';
import { VoiceEventListData } from '../DataStruct/VoiceEventListData';
import { MusicFont } from '../Gfx/MusicFont';
import { RenderedEventGroup } from '../Gfx/RenderedEventGroup';
import { ScoreRenderer } from '../Gfx/ScoreRenderer';
import { VariantDisplayFrame } from '../Gfx/VariantDisplayFrame';
import { ViewCanvas } from '../Gfx/ViewCanvas';

export class VariantEditorFrame extends VariantDisplayFrame implements ActionListener
{
	mytype_ActionListener:boolean = true;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	editorCanvas:ScoreEditorCanvas;
	consolidateButton:JButton;
	delButtons:LinkedList<JButton[]>;
	versionSets:LinkedList<VariantVersionData[]>;
	addVersionBoxes:LinkedList<JComboBox<string>>;
	setDefaultButtons:LinkedList<JButton>;
	unusedVersionNames:LinkedList<string>;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: VariantEditorFrame(RenderedEventGroup renderedVar,
                                VoiceEventListData v,ScoreRenderer rs,int vnum,
                                int fx,int fy,ViewCanvas canvas,MusicFont MusicGfx,
                                float STAFFSCALE,float VIEWSCALE)
Parameters:
  Input:  
  Output: -
------------------------------------------------------------------------*/
	public constructor(renderedVar:RenderedEventGroup,v:VoiceEventListData,rs:ScoreRenderer,vnum:number,fx:number,fy:number,canvas:ViewCanvas,MusicGfx:MusicFont,STAFFSCALE:number,VIEWSCALE:number)
	{
		super(renderedVar,v,rs,vnum,fx,fy,canvas,MusicGfx,STAFFSCALE,VIEWSCALE);
		this.editorCanvas =<ScoreEditorCanvas>( this.canvas);
	}

	public createVersionsPanel_2(versions:List<VariantVersionData>,defaultVersion:boolean):JPanel
	{
		let versionsPanel:JPanel = new JPanel();
		versionsPanel.setLayout(new GridBagLayout());
		let vpc:GridBagConstraints = new GridBagConstraints();
		vpc.anchor = GridBagConstraints.LINE_START;
		vpc.gridwidth = 1;
		let curDelButtons:JButton[]= Array(versions.size());
		for(
		let i:number = 0;i < curDelButtons.length;i ++)
		{
			curDelButtons[i]= new JButton("Del");
			vpc.gridx = 0;
			vpc.gridy = i;
			versionsPanel.add(new JLabel(" " + versions.get(i).getID() + " "),vpc);
			if( ! defaultVersion)
				{
					vpc.gridx = 1;
					vpc.gridy = i;
					versionsPanel.add(curDelButtons[i],vpc);
				}

		}
		if( this.delButtons == null)
			{
				this.delButtons = new LinkedList<JButton[]>();
				this.versionSets = new LinkedList<VariantVersionData[]>();
				this.addVersionBoxes = new LinkedList<JComboBox<string>>();
				this.setDefaultButtons = new LinkedList<JButton>();
				this.unusedVersionNames = new LinkedList<string>();
				for(let vvd of this.canvas.getMusicData_1().getVariantVersions())
				if( ! vvd.isDefault() && this.vStartEvent.getVariantReading_1(vvd) == null)
					this.unusedVersionNames.add(vvd.getID());

			}

		this.delButtons.add(curDelButtons);
		this.versionSets.add(<VariantVersionData[]> versions.toArray());
		if( this.unusedVersionNames.size() > 0 && ! defaultVersion)
			{
				let curAddVersionBox:JComboBox<string> = new JComboBox<string>();
				curAddVersionBox.addItem("Add version...");
				for(let s of this.unusedVersionNames)
				curAddVersionBox.addItem(s);
				this.addVersionBoxes.add(curAddVersionBox);
				vpc.gridx = 0;
				vpc.gridy ++;
				vpc.gridwidth = 2;
				versionsPanel.add(curAddVersionBox,vpc);
			}

		if( ! defaultVersion)
			{
				let curSetDefaultButton:JButton = new JButton("Set as default reading");
				this.setDefaultButtons.add(curSetDefaultButton);
				vpc.gridx = 0;
				vpc.gridy ++;
				vpc.gridwidth = 2;
				versionsPanel.add(curSetDefaultButton,vpc);
			}

		return versionsPanel;
	}

	/* first time creating a version panel, initialize master lists of GUI items
           and versions */
	/*new VariantVersionData[1]*/
	//CHANGE should be no prob
	public createAdditionalControls_1(vrcp:Container,vrc:GridBagConstraints):void
	{
		let addControlsPanel:JPanel = new JPanel();
		this.consolidateButton = new JButton(" Consolidate duplicate readings ");
		addControlsPanel.add(this.consolidateButton);
		vrc.gridx = 0;
		vrc.gridwidth = 2;
		vrcp.add(addControlsPanel,vrc);
		vrc.gridy ++;
	}

	/*------------------------------------------------------------------------
Method:     void actionPerformed(ActionEvent event)
Implements: ActionListener.actionPerformed
Purpose:    Check for action types in menu/tools and take appropriate action
Parameters:
  Input:  ActionEvent event - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public actionPerformed(event:ActionEvent):void
	{
		let item:any = event.getSource();
		if( item == this.consolidateButton)
			(<ScoreEditorCanvas> this.canvas).consolidateReadings(this.vStartEvent,this);

		for(
		let bsi:number = 0;bsi < this.delButtons.size();bsi ++)
		{
			let bset:JButton[]= this.delButtons.get(bsi);
			for(
			let bi:number = 0;bi < bset.length;bi ++)
			if( item == bset[bi])
				(<ScoreEditorCanvas> this.canvas).deleteVariantReading_2(this.vStartEvent,this.versionSets.get(bsi)[bi],this);

		}
		for(
		let cbi:number = 0;cbi < this.addVersionBoxes.size();cbi ++)
		{
			let cb:JComboBox<string> = this.addVersionBoxes.get(cbi);
			if( item == cb)
				{
					let newVersion:VariantVersionData = this.getVersionFromAddVersionBox(cb);
					if( newVersion != null)
						this.editorCanvas.addVersionToReading(this.vStartEvent,cbi,newVersion,this);

				}

		}
		for(
		let sdbi:number = 0;sdbi < this.setDefaultButtons.size();sdbi ++)
		{
			let sdb:JButton = this.setDefaultButtons.get(sdbi);
			if( item == sdb && this.canvas.parentwin.confirmAction("Are you sure?","Confirm variant reading swap"))
				this.editorCanvas.setReadingAsDefault(this.vStartEvent,sdbi,this);

		}
	}

	getVersionFromAddVersionBox(cb:JComboBox<string>):VariantVersionData
	{
		let vi:number = cb.getSelectedIndex();
		if( vi < 1)
			return null;

		let vName:string =<string> cb.getItemAt(vi);
		for(let vvd of this.canvas.getMusicData_1().getVariantVersions())
		if(( vvd.getID() == vName))
			return vvd;

		return null;
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
		super.registerListeners_5();
		this.consolidateButton.addActionListener(this);
		for(let bset of this.delButtons)
		for(let b of bset)
		b.addActionListener(this);
		for(let cb of this.addVersionBoxes)
		cb.addActionListener(this);
		for(let sdb of this.setDefaultButtons)
		sdb.addActionListener(this);
	}

	public unregisterListeners_8():void
	{
		super.unregisterListeners_8();
		this.consolidateButton.removeActionListener(this);
		for(let bset of this.delButtons)
		for(let b of bset)
		b.removeActionListener(this);
		for(let cb of this.addVersionBoxes)
		cb.removeActionListener(this);
		for(let sdb of this.setDefaultButtons)
		sdb.removeActionListener(this);
	}
}
