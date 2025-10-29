
import { Integer } from '../java/lang/Integer';
import { TextDeleteDialog } from './TextDeleteDialog';
import { OriginalTextDeleteDialog } from './OriginalTextDeleteDialog';
import { NoteInfoPanel } from './NoteInfoPanel';
import { ModernTextDeleteDialog } from './ModernTextDeleteDialog';
import { ModernKeySigPanel } from './ModernKeySigPanel';
import { MensurationChooser } from './MensurationChooser';
import { GeneralInfoFrame } from './GeneralInfoFrame';
import { EditorWin } from './EditorWin';
import { EditingOptionsFrame } from './EditingOptionsFrame';
import { ColorationChooser } from './ColorationChooser';
import { Dimension } from '../java/awt/Dimension';
import { Container } from '../java/awt/Container';
import { Toolkit } from '../java/awt/Toolkit';
import { GridBagConstraints } from '../java/awt/GridBagConstraints';
import { GridBagLayout } from '../java/awt/GridBagLayout';
import { BorderLayout } from '../java/awt/BorderLayout';
import { WindowAdapter } from '../java/awt/event/WindowAdapter';
import { WindowListener } from '../java/awt/event/WindowListener';
import { WindowEvent } from '../java/awt/event/WindowEvent';
import { ItemListener } from '../java/awt/event/ItemListener';
import { ActionEvent } from '../java/awt/event/ActionEvent';
import { ActionListener } from '../java/awt/event/ActionListener';
import { ItemEvent } from '../java/awt/event/ItemEvent';
import { JPanel } from '../javax/swing/JPanel';
import { Box } from '../javax/swing/Box';
import { JDialog } from '../javax/swing/JDialog';
import { BorderFactory } from '../javax/swing/BorderFactory';
import { JButton } from '../javax/swing/JButton';
import { JCheckBox } from '../javax/swing/JCheckBox';
import { JScrollPane } from '../javax/swing/JScrollPane';
import { JTextField } from '../javax/swing/JTextField';
import { JOptionPane } from '../javax/swing/JOptionPane';
import { JLabel } from '../javax/swing/JLabel';
import { ArrayList } from '../java/util/ArrayList';
import { Coloration } from '../DataStruct/Coloration';
import { MusicSection } from '../DataStruct/MusicSection';
import { TacetInfo } from '../DataStruct/TacetInfo';
import { VariantVersionData } from '../DataStruct/VariantVersionData';
import { Voice } from '../DataStruct/Voice';
import { VoiceEventListData } from '../DataStruct/VoiceEventListData';
import { SelectionPanel } from '../Gfx/SelectionPanel';

export class SectionAttribsFrame extends JDialog implements ActionListener,ItemListener
{
	mytype_ItemListener:boolean = true;
	mytype_ActionListener:boolean = true;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	owner:EditorWin;
	curSectionNum:number = - 1;
	numVoices:number = 0;
	curSection:MusicSection = null;
	sectionInfoLock:number = 0;
	/* >0 while updating GUI (check to avoid marking
                            file as modified when a new section is loaded) */
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: SectionAttribsFrame(EditorWin owner)
Purpose:     Initialize and lay out frame
Parameters:
  Input:  EditorWin owner - parent frame
  Output: -
------------------------------------------------------------------------*/
	public constructor(owner:EditorWin)
	{
		super(owner,"Section attributes",false);
		this.owner = owner;
		let cp:Container = this.getContentPane();
		let sectionInfoPanel:JPanel = this.createSectionInfoPanel();
		let voiceInfoPanel:JPanel = this.createVoiceInfoPanel(owner.getMusicData_2().getVoiceData(),owner.getMusicData_2().getVariantVersionNames());
		let controlPanel:JPanel = this.createControlPanel();
		let voiceInfoScrollPane:JScrollPane = new JScrollPane(voiceInfoPanel);
		let topPanels:Box = Box.createVerticalBox();
		topPanels.add(sectionInfoPanel);
		cp.add(topPanels,BorderLayout.NORTH);
		cp.add(voiceInfoScrollPane,BorderLayout.CENTER);
		cp.add(controlPanel,BorderLayout.SOUTH);
		this.pack();
		this.registerListeners_3();
	}
	/*------------------------------------------------------------------------
Method:  JPanel create*Panel()
Purpose: Initialize individual panes within frame
Parameters:
  Input:  -
  Output: -
  Return: one frame section as JPanel
------------------------------------------------------------------------*/
	/* section info panel */
	sectionNumLabel:JLabel;
	sectionEditorialCheckBox:JCheckBox;
	sectionSourceField:JTextField;
	sectionSourceNumField:JTextField;
	sectionColorationChooser:ColorationChooser;

	createSectionInfoPanel():JPanel
	{
		let sectionInfoPanel:JPanel = new JPanel();
		sectionInfoPanel.setLayout(new GridBagLayout());
		let sic:GridBagConstraints = new GridBagConstraints();
		sic.anchor = GridBagConstraints.LINE_START;
		sectionInfoPanel.setBorder(BorderFactory.createEmptyBorder(5,5,5,5));
		let sectionNumHeaderLabel:JLabel = new JLabel("Section number: ");
		sectionNumHeaderLabel.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		this.sectionNumLabel = new JLabel("0");
		this.sectionNumLabel.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		sic.gridy = 0;
		sic.gridx = 0;
		sectionInfoPanel.add(sectionNumHeaderLabel,sic);
		sic.gridx = 1;
		sectionInfoPanel.add(this.sectionNumLabel,sic);
		let sectionEditorialLabel:JLabel = new JLabel("Editorial ");
		sectionEditorialLabel.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		this.sectionEditorialCheckBox = new JCheckBox();
		sic.gridy ++;
		sic.gridx = 0;
		sectionInfoPanel.add(sectionEditorialLabel,sic);
		sic.gridx = 1;
		sectionInfoPanel.add(this.sectionEditorialCheckBox,sic);
		let sectionSourceLabel:JLabel = new JLabel("Principal source: ");
		sectionSourceLabel.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		this.sectionSourceField = new JTextField(20);
		sic.gridy ++;
		sic.gridx = 0;
		sectionInfoPanel.add(sectionSourceLabel,sic);
		sic.gridx = 1;
		sectionInfoPanel.add(this.sectionSourceField,sic);
		let sectionSourceNumLabel:JLabel = new JLabel("Principal source ID no.: ");
		sectionSourceNumLabel.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		this.sectionSourceNumField = new JTextField(5);
		sic.gridy ++;
		sic.gridx = 0;
		sectionInfoPanel.add(sectionSourceNumLabel,sic);
		sic.gridx = 1;
		sectionInfoPanel.add(this.sectionSourceNumField,sic);
		let sectionColorationLabel:JLabel = new JLabel("Coloration ");
		sectionColorationLabel.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		this.sectionColorationChooser = ColorationChooser.new0_1();
		sic.gridy ++;
		sic.gridx = 0;
		sectionInfoPanel.add(sectionColorationLabel,sic);
		sic.gridx = 1;
		sectionInfoPanel.add(this.sectionColorationChooser,sic);
		return sectionInfoPanel;
	}

	/* versions panel */
	createVersionsPanel_1(versionNames:ArrayList<string>):SelectionPanel
	{
		let versionsPanel:SelectionPanel = SelectionPanel.new1_3("Missing in version",versionNames,SelectionPanel.CHECKBOX,4);
		versionsPanel.checkBoxes[0].setSelected(false);
		versionsPanel.checkBoxes[0].setEnabled(false);
		for(
		let i:number = 1;i < versionsPanel.checkBoxes.length;i ++)
		versionsPanel.checkBoxes[i].setSelected(false);
		return versionsPanel;
	}
	/* voice info panel */
	voiceUsedCheckBoxes:JCheckBox[];
	voiceNumLabels:JLabel[];
	voiceNameLabels:JLabel[];
	voiceTacetLabels:JLabel[];
	voiceTacetTexts:JTextField[];
	voiceVersionsPanels:SelectionPanel[];
	static ROWS_PER_VOICE:number = 3;

	createVoiceInfoPanel(voices:Voice[],versionNames:ArrayList<string>):JPanel
	{
		this.numVoices = voices.length;
		let voiceInfoPanel:JPanel = new JPanel();
		voiceInfoPanel.setLayout(new GridBagLayout());
		let vic:GridBagConstraints = new GridBagConstraints();
		vic.anchor = GridBagConstraints.LINE_START;
		voiceInfoPanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Voices"),BorderFactory.createEmptyBorder(5,5,5,5)));
		let headingUsed:JLabel = new JLabel(" ");
		let headingNum:JLabel = new JLabel("No. ");
		let headingName:JLabel = new JLabel("Name");
		headingUsed.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		headingNum.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		headingName.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		vic.gridx = 0;
		vic.gridy = 0;
		voiceInfoPanel.add(headingUsed,vic);
		vic.gridx = 1;
		vic.gridy = 0;
		voiceInfoPanel.add(headingNum,vic);
		vic.gridx = 2;
		vic.gridy = 0;
		voiceInfoPanel.add(headingName,vic);
		this.voiceUsedCheckBoxes = Array(this.numVoices);
		this.voiceNumLabels = Array(this.numVoices);
		this.voiceNameLabels = Array(this.numVoices);
		this.voiceTacetLabels = Array(this.numVoices);
		this.voiceTacetTexts = Array(this.numVoices);
		this.voiceVersionsPanels = Array(this.numVoices);
		for(
		let i:number = 0;i < this.numVoices;i ++)
		{
			this.voiceUsedCheckBoxes[i]= new JCheckBox();
			this.voiceNumLabels[i]= new JLabel(`${i + 1}`);
			this.voiceNumLabels[i].setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
			this.voiceNameLabels[i]= new JLabel(voices[i].getName());
			this.voiceNameLabels[i].setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
			vic.gridx = 0;
			vic.gridy =((((( i * SectionAttribsFrame.ROWS_PER_VOICE) | 0)) + 1) | 0);
			voiceInfoPanel.add(this.voiceUsedCheckBoxes[i],vic);
			vic.gridx = 1;
			vic.gridy =((((( i * SectionAttribsFrame.ROWS_PER_VOICE) | 0)) + 1) | 0);
			voiceInfoPanel.add(this.voiceNumLabels[i],vic);
			vic.gridx = 2;
			vic.gridy =((((( i * SectionAttribsFrame.ROWS_PER_VOICE) | 0)) + 1) | 0);
			voiceInfoPanel.add(this.voiceNameLabels[i],vic);
			this.voiceTacetLabels[i]= new JLabel("Tacet text: ");
			this.voiceTacetLabels[i].setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
			this.voiceTacetLabels[i].setEnabled(false);
			this.voiceTacetTexts[i]= new JTextField(30);
			this.voiceTacetTexts[i].setEnabled(false);
			vic.gridx = 1;
			vic.gridy =((((( i * SectionAttribsFrame.ROWS_PER_VOICE) | 0)) + 2) | 0);
			voiceInfoPanel.add(this.voiceTacetLabels[i],vic);
			vic.gridx = 2;
			vic.gridy =((((( i * SectionAttribsFrame.ROWS_PER_VOICE) | 0)) + 2) | 0);
			voiceInfoPanel.add(this.voiceTacetTexts[i],vic);
			this.voiceVersionsPanels[i]= SelectionPanel.new1_3("Missing versions",versionNames,SelectionPanel.CHECKBOX,4);
			this.voiceVersionsPanels[i].checkBoxes[0].setSelected(false);
			this.voiceVersionsPanels[i].checkBoxes[0].setEnabled(false);
			for(
			let ci:number = 1;ci < this.voiceVersionsPanels[i].checkBoxes.length;ci ++)
			this.voiceVersionsPanels[i].checkBoxes[ci].setSelected(false);
			vic.gridwidth = 3;
			vic.gridx = 1;
			vic.gridy =((((( i * SectionAttribsFrame.ROWS_PER_VOICE) | 0)) + 3) | 0);
			voiceInfoPanel.add(this.voiceVersionsPanels[i],vic);
			vic.gridwidth = 1;
		}
		return voiceInfoPanel;
	}
	/* line 1 */
	/* line 2 */
	/* line 3: missing versions */
	//          "V"+(i+1)+" missing in versions:",
	/*------------------------------------------------------------------------
Method:  JPanel createControlPanel()
Purpose: Create content for panel containing general controls (delete, combine)
Parameters:
  Input:  -
  Output: -
  Return: new JPanel containing controls
------------------------------------------------------------------------*/
	sectionDeleteButton:JButton;
	sectionCombineButton:JButton;

	createControlPanel():JPanel
	{
		let controlPanel:JPanel = new JPanel();
		controlPanel.setBorder(BorderFactory.createEmptyBorder(5,5,5,5));
		this.sectionDeleteButton = new JButton("Delete section");
		this.sectionCombineButton = new JButton("Combine with next section");
		let buttonBox:Box = Box.createHorizontalBox();
		buttonBox.add(Box.createHorizontalGlue());
		buttonBox.add(this.sectionDeleteButton);
		buttonBox.add(Box.createHorizontalStrut(10));
		buttonBox.add(this.sectionCombineButton);
		controlPanel.add(buttonBox);
		return controlPanel;
	}

	//    buttonBox.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
	/*------------------------------------------------------------------------
Method:  void setLocation(int newx,int newy)
Purpose: Position frame
Parameters:
  Input:  int newx,newy - new location to attempt
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setLocation(newx:number,newy:number):void
	{
		let frameSize:Dimension = this.getSize();
		let screenSize:Dimension = Toolkit.getDefaultToolkit().getScreenSize();
		if((( newx + frameSize.width) | 0) > screenSize.width)
			newx =(( screenSize.width - frameSize.width) | 0);

		if((( newy + frameSize.height) | 0) > screenSize.height)
			newy =(( screenSize.height - frameSize.height) | 0);

		super.setLocation(newx,newy);
	}

	/* position relative to event editor frame 
    int eox=eventEditorFrame.getLocation().x+eventEditorFrame.getSize().width,
        eoy=eventEditorFrame.getLocation().y,*/
	/*------------------------------------------------------------------------
Method:  void setSectionNum(int newSectionNum)
Purpose: Update GUI if necessary to reflect correct section data
Parameters:
  Input:  int newSectionNum - section number for display
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setSectionNum_1(newSectionNum:number):void
	{
		if( newSectionNum == this.curSectionNum)
			return;

		this.updateSectionGUI_1(newSectionNum);
	}

	public updateSectionGUI_1(newSectionNum:number):void
	{
		this.sectionInfoLock ++;
		if( this.curSectionNum >= 0)
			for(
			let vi:number = 0;vi < this.numVoices;vi ++)
			this.curSection.setTacetText(vi,this.voiceTacetTexts[vi].getText());

		this.curSectionNum = newSectionNum;
		this.curSection = this.owner.getMusicData_2().getSection(this.curSectionNum);
		let voices:Voice[]= this.owner.getMusicData_2().getVoiceData();
		this.sectionNumLabel.setText(`${this.curSectionNum + 1}` + " (" + MusicSection.sectionTypeNames[this.curSection.getSectionType()]+ ")");
		this.sectionEditorialCheckBox.setSelected(this.curSection.isEditorial());
		let sourceName:string = this.curSection.getPrincipalSource();
		let sourceNum:number = this.curSection.getPrincipalSourceNum();
		if( sourceName != null)
			{
				this.sectionSourceField.setText(sourceName);
				this.sectionSourceNumField.setText(sourceNum > 0 ? `${sourceNum}`:"");
			}

		else
			{
				this.sectionSourceField.setText("");
				this.sectionSourceNumField.setText("");
			}

		this.sectionColorationChooser.setIndices_1(this.curSection.getBaseColoration());
		for(
		let vi:number = 0;vi < this.numVoices;vi ++)
		{
			let curVoice:VoiceEventListData = this.curSection.getVoice_1(vi);
			this.voiceTacetTexts[vi].setText("");
			if( curVoice == null)
				{
					this.voiceUsedCheckBoxes[vi].setSelected(false);
					this.voiceNumLabels[vi].setEnabled(false);
					this.voiceNameLabels[vi].setEnabled(false);
					this.voiceTacetLabels[vi].setEnabled(true);
					this.voiceTacetTexts[vi].setEnabled(true);
					for(let cb of this.voiceVersionsPanels[vi].checkBoxes)
					{
						cb.setSelected(false);
						cb.setEnabled(false);
					}
				}

			else
				{
					this.voiceUsedCheckBoxes[vi].setSelected(true);
					this.voiceNumLabels[vi].setEnabled(true);
					this.voiceNameLabels[vi].setEnabled(true);
					this.voiceTacetLabels[vi].setEnabled(false);
					this.voiceTacetTexts[vi].setEnabled(false);
					for(let cb of this.voiceVersionsPanels[vi].checkBoxes)
					{
						cb.setSelected(false);
						cb.setEnabled(true);
					}
					for(let vvd of this.curSection.getVoice_1(vi).getMissingVersions())
					this.voiceVersionsPanels[vi].checkBoxes[vvd.getNumInList()].setSelected(true);
				}

		}
		for(let ti of this.curSection.getTacetInfo())
		this.voiceTacetTexts[ti.voiceNum].setText(ti.tacetText);
		this.enableOrDisableVoiceUsedCheckBoxes();
		let numSections:number = this.owner.getMusicData_2().getSections().size();
		this.sectionDeleteButton.setEnabled(numSections > 1);
		this.sectionCombineButton.setEnabled(this.curSectionNum <((( numSections - 1) | 0)) && this.curSection.getSectionType() == this.owner.getMusicData_2().getSection((( this.curSectionNum + 1) | 0)).getSectionType());
		this.sectionInfoLock --;
	}

	/* control panel */
	/*------------------------------------------------------------------------
Method:  boolean confirmVoiceDelete(int vnum)
Purpose: Request user confirmation before deleting voice from section
Parameters:
  Input:  int vnum - number of voice to delete
  Output: -
  Return: -
------------------------------------------------------------------------*/
	confirmVoiceDelete(vnum:number):boolean
	{
		let confirmOption:number = JOptionPane.showConfirmDialog(this,"Remove voice " +((( vnum + 1) | 0)) + " from section? (This will delete all music associated with this voice in this section)","Voice deletion",JOptionPane.YES_NO_OPTION,JOptionPane.WARNING_MESSAGE);
		switch( confirmOption)
		{
			case JOptionPane.YES_OPTION:
			{
				return true;
			}
			case JOptionPane.NO_OPTION:
			{
				return false;
			}
		}
		return false;
	}

	/*------------------------------------------------------------------------
Method:  void enableOrDisableVoiceUsedCheckBoxes()
Purpose: Update GUI to enable or disable check boxes to allow or disallow
         deleting of voices from a section
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	enableOrDisableVoiceUsedCheckBoxes():void
	{
		if( this.curSection.getNumVoicesUsed() == 1)
			this.voiceUsedCheckBoxes[this.curSection.getValidVoicenum(0)].setEnabled(false);
		else
			for(
			let i:number = 0;i < this.numVoices;i ++)
			if( ! this.voiceUsedCheckBoxes[i].isEnabled())
				this.voiceUsedCheckBoxes[i].setEnabled(true);

	}

	/* don't allow last voice to be removed */
	/*------------------------------------------------------------------------
Method:     void actionPerformed(ActionEvent event)
Implements: ActionListener.actionPerformed
Purpose:    Check for action types in menu/tools and take appropriate action
Parameters:
  Input:  ActionEvent event - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	fileModified_1():void
	{
		if( this.sectionInfoLock == 0)
			this.owner.fileModified_2();

	}

	public actionPerformed(event:ActionEvent):void
	{
		let item:any = event.getSource();
		if( item == this.sectionSourceField)
			{
				this.curSection.setPrincipalSource(this.sectionSourceField.getText());
				this.fileModified_1();
			}

		else
			if( item == this.sectionSourceNumField)
				{
					this.curSection.setPrincipalSourceNum(Integer.parseInt(this.sectionSourceNumField.getText()));
					this.fileModified_1();
				}

			else
				if( item == this.sectionDeleteButton)
					{
						let confirmOption:number = JOptionPane.showConfirmDialog(this,"Delete section " +((( this.curSectionNum + 1) | 0)) + "?","Section deletion",JOptionPane.YES_NO_OPTION,JOptionPane.WARNING_MESSAGE);
						if( confirmOption == JOptionPane.YES_OPTION)
							this.owner.deleteSection_2(this.curSectionNum);

					}

				else
					if( item == this.sectionCombineButton)
						{
							let confirmOption:number = JOptionPane.showConfirmDialog(this,"Combine sections " +((( this.curSectionNum + 1) | 0)) + " and " +((( this.curSectionNum + 2) | 0)) + "?","Section combination",JOptionPane.YES_NO_OPTION,JOptionPane.WARNING_MESSAGE);
							if( confirmOption == JOptionPane.YES_OPTION)
								this.owner.combineSectionWithNext_2();

						}

		for(
		let vi:number = 0;vi < this.numVoices;vi ++)
		if( item == this.voiceTacetTexts[vi])
			{
				this.curSection.setTacetText(vi,this.voiceTacetTexts[vi].getText());
				this.owner.rerendermusic = true;
				this.owner.repaint();
				this.fileModified_1();
			}

	}

	/*------------------------------------------------------------------------
Method:     void itemStateChanged(ItemEvent event)
Implements: ItemListener.itemStateChanged
Purpose:    Check for item state changes in menu and take appropriate action
Parameters:
  Input:  ItemEvent event - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public itemStateChanged(event:ItemEvent):void
	{
		if( this.sectionInfoLock > 0)
			return;

		let item:any = event.getItemSelectable();
		if( item == this.sectionEditorialCheckBox)
			if( this.curSection.isEditorial() != this.sectionEditorialCheckBox.isSelected())
				{
					this.curSection.setEditorial(this.sectionEditorialCheckBox.isSelected());
					this.fileModified_1();
				}

		if( this.sectionColorationChooser.itemSelected(item))
			{
				let newColoration:Coloration = this.sectionColorationChooser.createColoration();
				if( ! this.curSection.getBaseColoration().equals(newColoration))
					{
						this.curSection.setBaseColoration(newColoration);
						this.fileModified_1();
						this.owner.getMusicData_2().recalcAllEventParams();
						this.owner.rerendermusic = true;
						this.owner.repaint();
					}

			}

		for(
		let vi:number = 0;vi < this.numVoices;vi ++)
		if( item == this.voiceUsedCheckBoxes[vi])
			{
				let isUsed:boolean = this.voiceUsedCheckBoxes[vi].isSelected();
				if(( this.curSection.getVoice_1(vi) != null) != isUsed)
					{
						if( ! isUsed && ! this.confirmVoiceDelete(vi))
							{
								this.voiceUsedCheckBoxes[vi].setSelected(true);
								return;
							}

						this.owner.setVoiceUsedInSection(this.curSectionNum,vi,isUsed);
						this.fileModified_1();
						this.voiceNumLabels[vi].setEnabled(isUsed);
						this.voiceNameLabels[vi].setEnabled(isUsed);
						this.voiceTacetLabels[vi].setEnabled(! isUsed);
						this.voiceTacetTexts[vi].setEnabled(! isUsed);
						for(
						let i:number = 0;i < this.voiceVersionsPanels[vi].checkBoxes.length;i ++)
						this.voiceVersionsPanels[vi].checkBoxes[i].setEnabled(isUsed);
						this.enableOrDisableVoiceUsedCheckBoxes();
					}

			}

		else
			for(
			let i:number = 0;i < this.voiceVersionsPanels[vi].checkBoxes.length;i ++)
			if( item == this.voiceVersionsPanels[vi].checkBoxes[i]&& this.curSection.getVoice_1(vi) != null)
				{
					let vvd:VariantVersionData = this.owner.getMusicData_2().getVariantVersion_1(i);
					if( this.curSection.getVoice_1(vi).getMissingVersions().contains(vvd) != this.voiceVersionsPanels[vi].checkBoxes[i].isSelected())
						{
							if( this.voiceVersionsPanels[vi].checkBoxes[i].isSelected())
								this.curSection.addMissingVersion(vi,vvd);
							else
								this.curSection.removeMissingVersion(vi,vvd);

							this.fileModified_1();
							this.owner.reconstructCurrentVersion();
							this.owner.repaint();
						}

				}

	}

	/*------------------------------------------------------------------------
Method:  void (un)registerListeners()
Purpose: Register/unregister GUI listeners (register and unregister should match)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	ownerSetSectionsMenuDisplaySectionAttribs(newval:boolean):void
	{
		this.owner.setSectionsMenuDisplaySectionAttribs(newval);
	}

	public registerListeners_3():void
	{
		this.sectionEditorialCheckBox.addItemListener(this);
		this.sectionSourceField.addActionListener(this);
		this.sectionSourceNumField.addActionListener(this);
		this.sectionColorationChooser.addListener(this);
		for(
		let vi:number = 0;vi < this.numVoices;vi ++)
		{
			this.voiceUsedCheckBoxes[vi].addItemListener(this);
			this.voiceTacetTexts[vi].addActionListener(this);
			this.voiceVersionsPanels[vi].registerListeners_1(this);
		}
		this.sectionDeleteButton.addActionListener(this);
		this.sectionCombineButton.addActionListener(this);
		this.addWindowListener(
		{

			windowClosing:(event:WindowEvent):void =>
			{
				this.ownerSetSectionsMenuDisplaySectionAttribs(false);
			}
		}
		);
	}

	/* 
	private WindowFocusListener[] getListeners(Object o) //CHANGE
	{
		throw new RuntimeException();
	}*/
	public unregisterListeners_6():void
	{
		this.sectionEditorialCheckBox.removeItemListener(this);
		this.sectionSourceField.removeActionListener(this);
		this.sectionSourceNumField.removeActionListener(this);
		this.sectionColorationChooser.removeListener(this);
		for(
		let vi:number = 0;vi < this.numVoices;vi ++)
		{
			this.voiceUsedCheckBoxes[vi].removeItemListener(this);
			this.voiceTacetTexts[vi].removeActionListener(this);
			this.voiceVersionsPanels[vi].unregisterListeners_2(this);
		}
		this.sectionDeleteButton.removeActionListener(this);
		this.sectionCombineButton.removeActionListener(this);
		for(let w of this.getListeners("WindowListener"))
		this.removeWindowListener(w);
	}
}
