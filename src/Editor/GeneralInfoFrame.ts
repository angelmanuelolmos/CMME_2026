
import { TextDeleteDialog } from './TextDeleteDialog';
import { OriginalTextDeleteDialog } from './OriginalTextDeleteDialog';
import { NoteInfoPanel } from './NoteInfoPanel';
import { ModernTextDeleteDialog } from './ModernTextDeleteDialog';
import { ModernKeySigPanel } from './ModernKeySigPanel';
import { MensurationChooser } from './MensurationChooser';
import { EditorWin } from './EditorWin';
import { EditingOptionsFrame } from './EditingOptionsFrame';
import { ColorationChooser } from './ColorationChooser';
/*----------------------------------------------------------------------*/
/*

        Module          : GeneralInfoFrame.java

        Package         : Editor

        Classes Included: GeneralInfoFrame

        Purpose         : GUI window for general file options/metadata

        Programmer      : Ted Dumitrescu

        Date Started    : 9/8/09 (moved from EditorWin.java, created class)

        Updates         :
9/9/09: added scroll pane around voice list to avoid growing beyond
        screen limits

                                                                        */
/*----------------------------------------------------------------------*/
import { Component } from '../java/awt/Component';
import { Container } from '../java/awt/Container';
import { Dimension } from '../java/awt/Dimension';
import { GridBagConstraints } from '../java/awt/GridBagConstraints';
import { GridBagLayout } from '../java/awt/GridBagLayout';
import { ActionEvent } from '../java/awt/event/ActionEvent';
/*----------------------------------------------------------------------*/
/* Imported packages */
//import java.awt.*;
//import java.awt.event.*;
import { ActionListener } from '../java/awt/event/ActionListener';
import { JPanel } from '../javax/swing/JPanel';
import { Box } from '../javax/swing/Box';
import { JDialog } from '../javax/swing/JDialog';
import { BorderFactory } from '../javax/swing/BorderFactory';
import { BoxLayout } from '../javax/swing/BoxLayout';
import { JButton } from '../javax/swing/JButton';
import { JTextArea } from '../javax/swing/JTextArea';
import { JCheckBox } from '../javax/swing/JCheckBox';
import { JScrollPane } from '../javax/swing/JScrollPane';
import { JTextField } from '../javax/swing/JTextField';
import { ScrollPaneConstants } from '../javax/swing/ScrollPaneConstants';
import { JLabel } from '../javax/swing/JLabel';
import { Coloration } from '../DataStruct/Coloration';
import { Event } from '../DataStruct/Event';
import { MusicMensuralSection } from '../DataStruct/MusicMensuralSection';
import { MusicSection } from '../DataStruct/MusicSection';
import { PieceData } from '../DataStruct/PieceData';
import { Voice } from '../DataStruct/Voice';
import { VoiceMensuralData } from '../DataStruct/VoiceMensuralData';
import { MusicWin } from '../Gfx/MusicWin';

export class GeneralInfoFrame extends JDialog implements ActionListener
{
	mytype_ActionListener:boolean = true;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	owner:EditorWin;
	musicData:PieceData;
	voiceInfoPanel:JPanel;
	voiceInfoScrollPane:JScrollPane;
	compInfoTFTitle:JTextField;
	compInfoTFSection:JTextField;
	compInfoTFComposer:JTextField;
	compInfoTFEditor:JTextField;
	voiceInfoNames:JTextField[];
	compInfoPubNotesArea:JTextArea;
	compInfoNotesArea:JTextArea;
	compInfoPubNotesPane:JScrollPane;
	compInfoNotesPane:JScrollPane;
	incipitCheckBox:JCheckBox;
	baseColorationChooser:ColorationChooser;
	voiceNumLabels:JLabel[];
	voiceEditorialCheckBoxes:JCheckBox[];
	OKButton:JButton;
	cancelButton:JButton;
	voiceUpButtons:JButton[];
	voiceDownButtons:JButton[];
	voiceInsertUpButtons:JButton[];
	voiceInsertDownButtons:JButton[];
	voiceDeleteButtons:JButton[];
	newVoiceList:Voice[];
	newVoiceOrderList:Voice[];
	/* flags/attribs affecting other components */
	newEditorVoiceNum:number;
	/* voice num being edited on editor canvas (in case
                            voices switch position) */
	_numVoicesChanged:boolean;
	_editorVoiceDeleted:boolean;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: GeneralInfoFrame(EditorWin owner,int curEditorVoiceNum)
Purpose:     Initialize and lay out frame
Parameters:
  Input:  EditorWin owner       - parent frame
          int curEditorVoiceNum - voice where cursor currently stands on
                                  editor canvas
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(owner:EditorWin,curEditorVoiceNum:number)
	{
		super(owner,"General information: " + owner.getWindowFileName(),true);
		this.owner = owner;
		this.musicData = owner.getMusicData_2();
		this.newEditorVoiceNum = curEditorVoiceNum;
		let editFieldsBox:Box = Box.createVerticalBox();
		let compInfoPanel:JPanel = new JPanel();
		compInfoPanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Composition information"),BorderFactory.createEmptyBorder(5,5,5,5)));
		compInfoPanel.setLayout(new GridBagLayout());
		let cic:GridBagConstraints = new GridBagConstraints();
		let compInfoLabelTitle:JLabel = new JLabel("Title");
		compInfoLabelTitle.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		this.compInfoTFTitle = new JTextField(this.musicData.getTitle(),30);
		let compInfoLabelSection:JLabel = new JLabel("Section");
		compInfoLabelSection.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		this.compInfoTFSection = new JTextField(this.musicData.getSectionTitle(),30);
		let compInfoLabelComposer:JLabel = new JLabel("Composer");
		compInfoLabelComposer.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		this.compInfoTFComposer = new JTextField(this.musicData.getComposer(),30);
		let compInfoLabelEditor:JLabel = new JLabel("Editor");
		compInfoLabelEditor.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		this.compInfoTFEditor = new JTextField(this.musicData.getEditor(),30);
		let compInfoLabelPubNotes:JLabel = new JLabel("Public Notes");
		compInfoLabelPubNotes.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		this.compInfoPubNotesArea = new JTextArea(this.musicData.getPublicNotes(),4,30);
		this.compInfoPubNotesPane = new JScrollPane(this.compInfoPubNotesArea);
		let compInfoLabelNotes:JLabel = new JLabel("Private Notes");
		compInfoLabelNotes.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		this.compInfoNotesArea = new JTextArea(this.musicData.getNotes(),4,30);
		this.compInfoNotesPane = new JScrollPane(this.compInfoNotesArea);
		cic.anchor = GridBagConstraints.LINE_START;
		cic.gridx = 0;
		cic.gridy = 0;
		compInfoPanel.add(compInfoLabelTitle,cic);
		cic.gridx = 1;
		compInfoPanel.add(this.compInfoTFTitle,cic);
		cic.gridx = 0;
		cic.gridy ++;
		compInfoPanel.add(compInfoLabelSection,cic);
		cic.gridx = 1;
		compInfoPanel.add(this.compInfoTFSection,cic);
		cic.gridx = 0;
		cic.gridy ++;
		compInfoPanel.add(compInfoLabelComposer,cic);
		cic.gridx = 1;
		compInfoPanel.add(this.compInfoTFComposer,cic);
		cic.gridx = 0;
		cic.gridy ++;
		compInfoPanel.add(compInfoLabelEditor,cic);
		cic.gridx = 1;
		compInfoPanel.add(this.compInfoTFEditor,cic);
		cic.gridx = 3;
		cic.gridy = 0;
		cic.gridheight = 1;
		compInfoPanel.add(compInfoLabelPubNotes,cic);
		cic.gridx = 4;
		cic.gridheight = 2;
		compInfoPanel.add(this.compInfoPubNotesPane,cic);
		cic.gridx = 3;
		cic.gridy += 2;
		cic.gridheight = 1;
		compInfoPanel.add(compInfoLabelNotes,cic);
		cic.gridx = 4;
		cic.gridheight = 2;
		compInfoPanel.add(this.compInfoNotesPane,cic);
		let numvoices:number = this.musicData.getVoiceData().length;
		this.newVoiceOrderList = Array(numvoices);
		for(
		let i:number = 0;i < numvoices;i ++)
		this.newVoiceOrderList[i]= this.musicData.getVoiceData()[i];
		this.voiceInfoPanel = new JPanel();
		this.initVoiceInfoPanel(this.musicData.getVoiceData());
		let voiceInfoScrollPane:JScrollPane = new JScrollPane(this.voiceInfoPanel,ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED,ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
		voiceInfoScrollPane.setMinimumSize(new Dimension(20,20));
		let generalOptionsPanel:JPanel = new JPanel();
		generalOptionsPanel.setLayout(new BoxLayout(generalOptionsPanel,BoxLayout.X_AXIS));
		generalOptionsPanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Options"),BorderFactory.createEmptyBorder(5,5,5,5)));
		this.incipitCheckBox = new JCheckBox("Incipit-score",this.musicData.isIncipitScore());
		this.incipitCheckBox.setBorder(BorderFactory.createEmptyBorder(0,5,25,5));
		this.baseColorationChooser = ColorationChooser.new1_1(this.musicData.getBaseColoration());
		let cBox:Box = Box.createHorizontalBox();
		cBox.setAlignmentX(Component.CENTER_ALIGNMENT);
		cBox.add(Box.createHorizontalGlue());
		cBox.add(new JLabel("Base coloration: "));
		cBox.add(this.baseColorationChooser);
		cBox.add(Box.createHorizontalGlue());
		generalOptionsPanel.add(this.incipitCheckBox);
		generalOptionsPanel.add(cBox);
		editFieldsBox.add(compInfoPanel);
		editFieldsBox.add(voiceInfoScrollPane);
		editFieldsBox.add(generalOptionsPanel);
		editFieldsBox.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
		this.OKButton = new JButton("Apply");
		this.cancelButton = new JButton("Cancel");
		let buttonPane:Box = Box.createHorizontalBox();
		buttonPane.add(Box.createHorizontalGlue());
		buttonPane.add(this.OKButton);
		buttonPane.add(Box.createHorizontalStrut(10));
		buttonPane.add(this.cancelButton);
		buttonPane.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
		let gicp:Container = this.getContentPane();
		gicp.setLayout(new GridBagLayout());
		let cc:GridBagConstraints = new GridBagConstraints();
		cc.gridx = 0;
		cc.gridy = 0;
		gicp.add(editFieldsBox,cc);
		cc.gridx = 0;
		cc.gridy ++;
		cc.anchor = GridBagConstraints.EAST;
		gicp.add(buttonPane,cc);
		this.OKButton.addActionListener(this);
		this.cancelButton.addActionListener(this);
		this.pack();
		this.setLocationRelativeTo(owner);
		let freeYSpace:number =<number>((((((( MusicWin.SCREEN_DIMENSION.height * 0.8 - compInfoPanel.getSize().height) | 0) - generalOptionsPanel.getSize().height) | 0) - buttonPane.getSize().height) | 0));
		let voiceInfoYSize:number = this.voiceInfoPanel.getSize().height;
		voiceInfoYSize = freeYSpace;
		voiceInfoScrollPane.setPreferredSize(new Dimension(this.voiceInfoPanel.getSize().width,voiceInfoYSize));
		this.voiceInfoPanel.revalidate();
		this.pack();
	}

	/* fields for editing */
	/* voice information */
	//    voiceInfoScrollPane.setPreferredSize(MusicWin.fitInScreen(DEFAULT_PANESIZE,0.5f));
	//    voiceInfoScrollPane.setPreferredSize(MusicWin.fitInScreen(MusicWin.SCREEN_DIMENSION,0.9f,0.3f));
	/* other options */
	/* action buttons */
	//  if (freeYSpace<voiceInfoYSize)
	/* check current size of voiceInfoPanel as basis for preferred scroll pane size */
	/*------------------------------------------------------------------------
Method:  void initVoiceInfoPanel(Voice[] voices)
Purpose: Create content for voiceInfoPanel
Parameters:
  Input:  Voice[] voices - voice data for display
  Output: -
  Return: -
------------------------------------------------------------------------*/
	initVoiceInfoPanel(voices:Voice[]):void
	{
		this.voiceInfoPanel.setLayout(new GridBagLayout());
		let vic:GridBagConstraints = new GridBagConstraints();
		vic.anchor = GridBagConstraints.LINE_START;
		this.voiceInfoPanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Voices"),BorderFactory.createEmptyBorder(5,5,5,5)));
		let numvoices:number = voices.length;
		this.newVoiceList = Array(numvoices);
		let headingNum:JLabel = new JLabel("No. ");
		let headingName:JLabel = new JLabel("Name");
		let headingEditorial:JLabel = new JLabel("Editorial");
		vic.gridx = 0;
		vic.gridy = 0;
		this.voiceInfoPanel.add(headingNum,vic);
		vic.gridx = 1;
		vic.gridy = 0;
		this.voiceInfoPanel.add(headingName,vic);
		vic.gridx = 2;
		vic.gridy = 0;
		this.voiceInfoPanel.add(headingEditorial,vic);
		this.voiceInfoNames = Array(numvoices);
		this.voiceNumLabels = Array(numvoices);
		this.voiceEditorialCheckBoxes = Array(numvoices);
		this.voiceUpButtons = Array(numvoices);
		this.voiceDownButtons = Array(numvoices);
		this.voiceInsertUpButtons = Array(numvoices);
		this.voiceInsertDownButtons = Array(numvoices);
		this.voiceDeleteButtons = Array(numvoices);
		for(
		let i:number = 0;i < numvoices;i ++)
		{
			let newv:Voice = Voice.new2(voices[i]);
			this.newVoiceList[i]= newv;
			this.voiceNumLabels[i]= new JLabel(`${i + 1}`);
			this.voiceNumLabels[i].setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
			this.voiceInfoNames[i]= new JTextField(newv.getName(),20);
			this.voiceNumLabels[i].setLabelFor(this.voiceInfoNames[i]);
			this.voiceEditorialCheckBoxes[i]= new JCheckBox("",newv.isEditorial());
			this.voiceUpButtons[i]= new JButton("\u2191" + " Move");
			this.voiceDownButtons[i]= new JButton("Move " + "\u2193");
			this.voiceInsertUpButtons[i]= new JButton("\u2191" + " Insert");
			this.voiceInsertDownButtons[i]= new JButton("Insert " + "\u2193");
			this.voiceDeleteButtons[i]= new JButton("Delete");
			if( i == 0)
				this.voiceUpButtons[i].setEnabled(false);

			if((( i + 1) | 0) >= numvoices)
				this.voiceDownButtons[i].setEnabled(false);

			vic.gridx = 0;
			vic.gridy =(( i + 1) | 0);
			this.voiceInfoPanel.add(this.voiceNumLabels[i],vic);
			vic.gridx ++;
			vic.gridy =(( i + 1) | 0);
			this.voiceInfoPanel.add(this.voiceInfoNames[i],vic);
			vic.gridx ++;
			vic.gridy =(( i + 1) | 0);
			this.voiceInfoPanel.add(this.voiceEditorialCheckBoxes[i],vic);
			vic.gridx ++;
			vic.gridy =(( i + 1) | 0);
			this.voiceInfoPanel.add(this.voiceUpButtons[i],vic);
			vic.gridx ++;
			vic.gridy =(( i + 1) | 0);
			this.voiceInfoPanel.add(this.voiceDownButtons[i],vic);
			vic.gridx ++;
			vic.gridy =(( i + 1) | 0);
			this.voiceInfoPanel.add(this.voiceInsertUpButtons[i],vic);
			vic.gridx ++;
			vic.gridy =(( i + 1) | 0);
			this.voiceInfoPanel.add(this.voiceInsertDownButtons[i],vic);
			vic.gridx ++;
			vic.gridy =(( i + 1) | 0);
			this.voiceInfoPanel.add(this.voiceDeleteButtons[i],vic);
			this.voiceUpButtons[i].addActionListener(this);
			this.voiceDownButtons[i].addActionListener(this);
			this.voiceInsertUpButtons[i].addActionListener(this);
			this.voiceInsertDownButtons[i].addActionListener(this);
			this.voiceDeleteButtons[i].addActionListener(this);
		}
		if( numvoices == 1)
			this.voiceDeleteButtons[0].setEnabled(false);

	}

	/*------------------------------------------------------------------------
Method:  void voiceInfo[Move|Insert|Delete](int vnum,int offset)
Purpose: Perform operations on one voice in voice info panel (move up or
         down one place, insert before, delete)
Parameters:
  Input:  int vnum   - voice number to modify
          int offset - amount to displace voice (1 or -1)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	voiceInfoMove(vnum:number,offset:number):void
	{
		if( vnum == this.newEditorVoiceNum)
			this.newEditorVoiceNum += offset;
		else
			if((( vnum + offset) | 0) == this.newEditorVoiceNum)
				this.newEditorVoiceNum = vnum;

		this.newVoiceList[vnum].setName(this.voiceInfoNames[vnum].getText());
		this.newVoiceList[((( vnum + offset) | 0))].setName(this.voiceInfoNames[((( vnum + offset) | 0))].getText());
		let tmpv:Voice = this.newVoiceList[vnum];
		this.newVoiceList[vnum]= this.newVoiceList[((( vnum + offset) | 0))];
		this.newVoiceList[((( vnum + offset) | 0))]= tmpv;
		tmpv = this.newVoiceOrderList[vnum];
		this.newVoiceOrderList[vnum]= this.newVoiceOrderList[((( vnum + offset) | 0))];
		this.newVoiceOrderList[((( vnum + offset) | 0))]= tmpv;
		this.voiceInfoNames[vnum].setText(this.newVoiceList[vnum].getName());
		this.voiceInfoNames[((( vnum + offset) | 0))].setText(this.newVoiceList[((( vnum + offset) | 0))].getName());
	}

	/* save name changes */
	/* swap vnum and vnum+offset */
	voiceInfoInsert(vnum:number):void
	{
		let oldNumVoices:number = this.newVoiceList.length;
		let tmpVoiceList:Voice[]= Array(((( oldNumVoices + 1) | 0)));
		let tmpVoiceOrderList:Voice[]= Array(((( oldNumVoices + 1) | 0)));
		for(
		let i:number =(( oldNumVoices - 1) | 0);i >= vnum;i --)
		{
			tmpVoiceList[((( i + 1) | 0))]= this.newVoiceList[i];
			tmpVoiceList[((( i + 1) | 0))].setName(this.voiceInfoNames[i].getText());
			tmpVoiceOrderList[((( i + 1) | 0))]= this.newVoiceOrderList[i];
		}
		tmpVoiceList[vnum]= Voice.new1(this.musicData,(( vnum + 1) | 0),"[" +((( oldNumVoices + 1) | 0)) + "]",false);
		tmpVoiceOrderList[vnum]= tmpVoiceList[vnum];
		for(
		let i:number =(( vnum - 1) | 0);i >= 0;i --)
		{
			tmpVoiceList[i]= this.newVoiceList[i];
			tmpVoiceList[i].setName(this.voiceInfoNames[i].getText());
			tmpVoiceOrderList[i]= this.newVoiceOrderList[i];
		}
		if( this.newEditorVoiceNum >= vnum)
			this.newEditorVoiceNum ++;

		this.newVoiceOrderList = tmpVoiceOrderList;
		this.reinitVoiceInfoPanel(tmpVoiceList);
	}

	//    tmpVoiceList[vnum].addevent(new Event(Event.EVENT_SECTIONEND));
	voiceInfoDelete(vnum:number):void
	{
		let oldNumVoices:number = this.newVoiceList.length;
		let tmpVoiceList:Voice[]= Array(((( oldNumVoices - 1) | 0)));
		let tmpVoiceOrderList:Voice[]= Array(((( oldNumVoices - 1) | 0)));
		for(
		let i:number = 0;i < vnum;i ++)
		{
			tmpVoiceList[i]= this.newVoiceList[i];
			tmpVoiceList[i].setName(this.voiceInfoNames[i].getText());
			tmpVoiceOrderList[i]= this.newVoiceOrderList[i];
		}
		for(
		let i:number =(( vnum + 1) | 0);i < oldNumVoices;i ++)
		{
			tmpVoiceList[((( i - 1) | 0))]= this.newVoiceList[i];
			tmpVoiceList[((( i - 1) | 0))].setName(this.voiceInfoNames[i].getText());
			tmpVoiceOrderList[((( i - 1) | 0))]= this.newVoiceOrderList[i];
		}
		if( this.newEditorVoiceNum == vnum)
			this._editorVoiceDeleted = true;
		else
			if( this.newEditorVoiceNum > vnum)
				this.newEditorVoiceNum --;

		this.newVoiceOrderList = tmpVoiceOrderList;
		this.reinitVoiceInfoPanel(tmpVoiceList);
	}

	reinitVoiceInfoPanel(newVoiceList:Voice[]):void
	{
		this.unregisterVoiceInfoListeners();
		this.voiceInfoPanel.removeAll();
		this.initVoiceInfoPanel(newVoiceList);
		this.voiceInfoPanel.revalidate();
		this.pack();
	}

	/*------------------------------------------------------------------------
Method:  void saveData()
Purpose: Apply changes to music data
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public saveData():void
	{
		let oldNumVoices:number = this.musicData.getVoiceData().length;
		this.musicData.setGeneralData(this.compInfoTFTitle.getText(),this.compInfoTFSection.getText(),this.compInfoTFComposer.getText(),this.compInfoTFEditor.getText(),this.compInfoPubNotesArea.getText(),this.compInfoNotesArea.getText());
		let oldIncipitStatus:boolean = this.musicData.isIncipitScore();
		this.musicData.setIncipitScore(this.incipitCheckBox.isSelected());
		for(
		let i:number = 0;i < this.newVoiceList.length;i ++)
		{
			this.newVoiceList[i].setName(this.voiceInfoNames[i].getText());
			this.newVoiceList[i].setNum((( i + 1) | 0));
			this.newVoiceList[i].setEditorial(this.voiceEditorialCheckBoxes[i].isSelected());
		}
		for(
		let si:number = 0;si < this.musicData.getNumSections();si ++)
		this.musicData.getSection(si).updateVoiceList_1(this.musicData.getVoiceData(),this.newVoiceList,this.newVoiceOrderList);
		this.musicData.setVoiceData(this.newVoiceList);
		let newBaseColoration:Coloration = this.baseColorationChooser.createColoration();
		for(let ms of this.musicData.getSections())
		if( ms.getBaseColoration().equals(this.musicData.getBaseColoration()))
			ms.setBaseColoration(newBaseColoration);

		this.musicData.setBaseColoration(newBaseColoration);
		if( this.musicData.isIncipitScore() && oldIncipitStatus == false)
			{
				let finalisSection:MusicMensuralSection = MusicMensuralSection.new2(this.musicData.getVoiceData().length,false,this.musicData.getBaseColoration());
				for(
				let vi:number = 0;vi < finalisSection.getNumVoices_1();vi ++)
				{
					let newv:VoiceMensuralData = VoiceMensuralData.new3(this.musicData.getVoiceData()[vi],finalisSection);
					newv.addEvent_1(Event.new1(Event.EVENT_SECTIONEND));
					finalisSection.setVoice_1(vi,newv);
				}
				this.musicData.addSection_1(this.musicData.getNumSections(),finalisSection);
			}

		this._numVoicesChanged = this.newVoiceList.length != oldNumVoices;
	}

	/* update sections */
	/* add section for Finales in incipit-score? */
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
		if( item == this.OKButton)
			this.owner.saveGeneralInfo();
		else
			if( item == this.cancelButton)
				this.owner.closeGeneralInfoFrame();
			else
				{
					for(
					let i:number = 0;i < this.voiceUpButtons.length;i ++)
					if( item == this.voiceUpButtons[i])
						{
							this.voiceInfoMove(i,- 1);
							return;
						}

					for(
					let i:number = 0;i < this.voiceDownButtons.length;i ++)
					if( item == this.voiceDownButtons[i])
						{
							this.voiceInfoMove(i,1);
							return;
						}

					for(
					let i:number = 0;i < this.voiceInsertUpButtons.length;i ++)
					if( item == this.voiceInsertUpButtons[i])
						{
							this.voiceInfoInsert(i);
							return;
						}

					for(
					let i:number = 0;i < this.voiceInsertDownButtons.length;i ++)
					if( item == this.voiceInsertDownButtons[i])
						{
							this.voiceInfoInsert((( i + 1) | 0));
							return;
						}

					for(
					let i:number = 0;i < this.voiceDeleteButtons.length;i ++)
					if( item == this.voiceDeleteButtons[i])
						{
							this.voiceInfoDelete(i);
							return;
						}

				}

	}

	/* general/voice information dialog */
	/*------------------------------------------------------------------------
Method:  void closewin()
Purpose: Close frame and release resources
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public closewin_2():void
	{
		this.setVisible(false);
		this.unregisterListeners_4();
		this.dispose();
	}

	/*------------------------------------------------------------------------
Method:  void unregisterListeners()
Purpose: Unregister GUI listeners
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public unregisterListeners_4():void
	{
		this.OKButton.removeActionListener(this);
		this.cancelButton.removeActionListener(this);
		this.unregisterVoiceInfoListeners();
	}

	public unregisterVoiceInfoListeners():void
	{
		for(
		let i:number = 0;i < this.voiceDeleteButtons.length;i ++)
		{
			this.voiceUpButtons[i].removeActionListener(this);
			this.voiceDownButtons[i].removeActionListener(this);
			this.voiceInsertUpButtons[i].removeActionListener(this);
			this.voiceInsertDownButtons[i].removeActionListener(this);
			this.voiceDeleteButtons[i].removeActionListener(this);
		}
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public editorVoiceDeleted():boolean
	{
		return this._editorVoiceDeleted;
	}

	public getNewEditorVoiceNum():number
	{
		return this.newEditorVoiceNum;
	}

	public numVoicesChanged():boolean
	{
		return this._numVoicesChanged;
	}
}
