
import { Integer } from '../java/lang/Integer';
import { NumberFormatException } from '../java/lang/NumberFormatException';
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
import { EventListener } from '../java/util/EventListener';
import { ArrayList } from '../java/util/ArrayList';
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
import { VariantVersionData } from '../DataStruct/VariantVersionData';
import { Voice } from '../DataStruct/Voice';
import { MusicWin } from '../Gfx/MusicWin';

export class VariantVersionInfoFrame extends JDialog implements ActionListener,ItemListener
{
	mytype_ItemListener:boolean = true;
	mytype_ActionListener:boolean = true;
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static DEFAULT_PANESIZE:Dimension = new Dimension(700,600);
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	owner:EditorWin;
	numVersions:number = 0;
	numVoices:number;
	newVersionsList:ArrayList<VariantVersionData>;
	originalVersionNums:ArrayList<Integer>;
	/* for matching newVersionsList
                                                        to original list */
	versionsPanel:JPanel = null;
	versionsScrollPane:JScrollPane = null;
	versionPanels:VersionPanel[];
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: VariantVersionInfoFrame(EditorWin owner)
Purpose:     Initialize and lay out frame
Parameters:
  Input:  EditorWin owner - parent frame
  Output: -
------------------------------------------------------------------------*/
	public constructor(owner:EditorWin)
	{
		super(owner,"Variant Version Information",true);
		this.owner = owner;
		let cp:Container = this.getContentPane();
		this.numVoices = owner.getMusicData_2().getVoiceData().length;
		let versions:ArrayList<VariantVersionData> = owner.getMusicData_2().getVariantVersions();
		this.originalVersionNums = new ArrayList<Integer>();
		for(
		let vi:number = 0;vi < versions.size();vi ++)
		this.originalVersionNums.add(new Integer(vi));
		this.initVersionsPanel(versions);
		let buttonPane:Box = this.createButtonPane_2();
		let versionsScrollPane:JScrollPane = new JScrollPane(this.versionsPanel,ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS,ScrollPaneConstants.HORIZONTAL_SCROLLBAR_AS_NEEDED);
		versionsScrollPane.setPreferredSize(MusicWin.fitInScreen_2(VariantVersionInfoFrame.DEFAULT_PANESIZE,0.8));
		versionsScrollPane.setMinimumSize(new Dimension(20,20));
		cp.add(versionsScrollPane,BorderLayout.NORTH);
		cp.add(buttonPane,BorderLayout.SOUTH);
		this.addListeners_3();
		this.pack();
		this.setLocationRelativeTo(owner);
	}

	/*------------------------------------------------------------------------
Method:  void close()
Purpose: Close dialog
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public close():void
	{
		this.setVisible(false);
		this.removeListeners_4();
		this.dispose();
	}

	/*------------------------------------------------------------------------
Method:  void saveAndClose()
Purpose: Save information and close dialog
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	saveAndClose():void
	{
		this.updateNewVersionsList();
		this.owner.getMusicData_2().updateVariantVersions(this.newVersionsList,this.originalVersionNums);
		this.owner.initVariantVersionsBox();
		this.owner.pack();
		this.close();
	}

	/*------------------------------------------------------------------------
Method:  void updateNewVersionsList()
Purpose: Load newVersionsList with user-input values from GUI
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	updateNewVersionsList():void
	{
		for(
		let vi:number = 0;vi < this.numVersions;vi ++)
		{
			let v:VariantVersionData = this.newVersionsList.get(vi);
			v.setID(this.versionPanels[vi].IDField.getText());
			let sourceID:number = - 1;
			try
			{
				sourceID = Integer.parseInt(this.versionPanels[vi].sourceIDField.getText(),10);
			}
			catch( e)
			{
				if( e instanceof NumberFormatException)
					{
					}

				else
					throw e;

			}
			let sourceName:string = this.versionPanels[vi].sourceNameField.getText();
			let versionEditor:string = this.versionPanels[vi].editorField.getText();
			let versionDescr:string = this.versionPanels[vi].descriptionArea.getText();
			if(( sourceName == ""))
				sourceName = null;

			if(( versionEditor == ""))
				versionEditor = null;

			if(( versionDescr == ""))
				versionDescr = null;

			v.setSourceInfo(sourceName,sourceID);
			v.setEditor(versionEditor);
			v.setDescription(versionDescr);
			for(
			let i:number = 0;i < this.numVoices;i ++)
			v.setMissingVoice(this.owner.getMusicData_2().getVoiceData()[i],this.versionPanels[vi].missingVoiceBoxes[i].isSelected());
		}
	}

	/*------------------------------------------------------------------------
Method:  JPanel createVersionsPanel(ArrayList<VariantVersionData> versions)
Purpose: Create content for versions list panel
Parameters:
  Input:  ArrayList<VariantVersionData> versions - versions lsit for display
  Output: -
  Return: new JPanel containing versions info
------------------------------------------------------------------------*/
	initVersionsPanel(versions:ArrayList<VariantVersionData>):void
	{
		if( this.versionsPanel == null)
			this.versionsPanel = new JPanel();
		else
			{
				this.versionsPanel.removeAll();
				this.removeVersionsPanelListeners();
			}

		this.numVersions = versions.size();
		this.newVersionsList = new ArrayList<VariantVersionData>();
		for(let vvd of versions)
		this.newVersionsList.add(VariantVersionData.new2(vvd));
		this.versionsPanel.setLayout(new BoxLayout(this.versionsPanel,BoxLayout.Y_AXIS));
		this.versionsPanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Versions"),BorderFactory.createEmptyBorder(5,5,5,5)));
		if( this.numVersions == 0)
			{
				let noVariantLabel:JLabel = new JLabel("No variant versions");
				noVariantLabel.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
				this.versionsPanel.add(noVariantLabel);
				return;
			}

		this.versionPanels = Array(this.numVersions);
		for(
		let vi:number = 0;vi < this.numVersions;vi ++)
		{
			this.versionPanels[vi]= new VersionPanel(this.newVersionsList,vi,this.numVoices);
			this.versionPanels[vi].addListeners_1(this);
			this.versionsPanel.add(this.versionPanels[vi]);
		}
	}

	/* copy list into newVersions */
	/*    GridBagConstraints vic=new GridBagConstraints();
    vic.anchor=GridBagConstraints.LINE_START;*/
	/*------------------------------------------------------------------------
Method:  void [add|remove]VersionsPanelListeners()
Purpose: Register/unregister GUI listeners for versions panel
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	removeVersionsPanelListeners():void
	{
		for(let vp of this.versionPanels)
		vp.removeListeners_1(this);
	}
	/*------------------------------------------------------------------------
Method:  Box createButtonPane()
Purpose: Create and lay out main button controls
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	addButton:JButton;
	OKButton:JButton;
	cancelButton:JButton;

	createButtonPane_2():Box
	{
		this.addButton = new JButton("Add Version");
		this.OKButton = new JButton("Apply");
		this.cancelButton = new JButton("Cancel");
		let buttonPane:Box = Box.createHorizontalBox();
		buttonPane.add(this.addButton);
		buttonPane.add(Box.createHorizontalStrut(10));
		buttonPane.add(Box.createHorizontalGlue());
		buttonPane.add(this.OKButton);
		buttonPane.add(Box.createHorizontalStrut(10));
		buttonPane.add(this.cancelButton);
		buttonPane.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
		return buttonPane;
	}

	/*------------------------------------------------------------------------
Method:  void [move|insert|delete]Version([int vnum,int offset])
Purpose: Perform operations on one version in versions panel (move up or
         down one place, insert before, delete)
Parameters:
  Input:  int vnum   - version number to modify
          int offset - amount to displace (1 or -1)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	moveVersion(vnum:number,offset:number):void
	{
		this.updateNewVersionsList();
		let v:VariantVersionData = this.newVersionsList.get(vnum);
		this.newVersionsList.remove(vnum);
		this.newVersionsList.add((( vnum + offset) | 0),v);
		let origNum:Integer = this.originalVersionNums.get(vnum);
		this.originalVersionNums.remove(origNum);
		this.originalVersionNums.add((( vnum + offset) | 0),origNum);
		this.initVersionsPanel(this.newVersionsList);
		this.pack();
	}

	insertVersion_1():void
	{
		this.insertVersion_2(this.newVersionsList.size());
	}

	insertVersion_2(vnum:number):void
	{
		this.updateNewVersionsList();
		this.newVersionsList.add(vnum,VariantVersionData.new1("[New version " +((( this.numVersions + 1) | 0)) + "]"));
		this.originalVersionNums.add(vnum,new Integer(- 1));
		this.initVersionsPanel(this.newVersionsList);
		this.pack();
	}

	deleteVersion(vnum:number):void
	{
		this.updateNewVersionsList();
		this.newVersionsList.remove(vnum);
		this.originalVersionNums.remove(vnum);
		this.initVersionsPanel(this.newVersionsList);
		this.pack();
	}

	/*------------------------------------------------------------------------
Method:  void addListeners()
Purpose: Register GUI listeners
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	addListeners_3():void
	{
		this.addButton.addActionListener(this);
		this.OKButton.addActionListener(this);
		this.cancelButton.addActionListener(this);
		this.addWindowListener(
		{

			windowClosing:(event:WindowEvent):void =>
			{
				this.removeListeners_4();
			}
		}
		);
	}

	/*------------------------------------------------------------------------
Method:  void removeListeners()
Purpose: Unregister GUI listeners (should match addListeners)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	/*private WindowFocusListener[] getListeners(Object o) //CHANGE
	{
		throw new RuntimeException();
	}*/
	public removeListeners_4():void
	{
		this.addButton.removeActionListener(this);
		this.OKButton.removeActionListener(this);
		this.cancelButton.removeActionListener(this);
		for(let wl of this.getListeners("WindowListener"))
		this.removeWindowListener(wl);
		this.removeVersionsPanelListeners();
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
		if( item == this.addButton)
			this.insertVersion_1();
		else
			if( item == this.cancelButton)
				this.close();
			else
				if( item == this.OKButton)
					this.saveAndClose();

		for(
		let vi:number = 0;vi < this.numVersions;vi ++)
		if( item == this.versionPanels[vi].insertBeforeButton)
			{
				this.insertVersion_2(vi);
				return;
			}

		else
			if( item == this.versionPanels[vi].insertAfterButton)
				{
					this.insertVersion_2((( vi + 1) | 0));
					return;
				}

			else
				if( item == this.versionPanels[vi].moveUpButton)
					{
						this.moveVersion(vi,- 1);
						return;
					}

				else
					if( item == this.versionPanels[vi].moveDownButton)
						{
							this.moveVersion(vi,1);
							return;
						}

					else
						if( item == this.versionPanels[vi].deleteButton)
							{
								this.deleteVersion(vi);
								return;
							}

	}

	/*------------------------------------------------------------------------
Method:     void itemStateChanged(ItemEvent event)
Implements: ItemListener.itemStateChanged
Purpose:    Check for item state changes in GUI and take appropriate action
Parameters:
  Input:  ItemEvent event - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public itemStateChanged(event:ItemEvent):void
	{
		let item:any = event.getItemSelectable();
	}
}

/*------------------------------------------------------------------------
Class:   VersionPanel
Extends: JPanel
Purpose: Panel for manipulating one variant version
------------------------------------------------------------------------*/
export class VersionPanel extends JPanel
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public IDField:JTextField;
	public sourceNameField:JTextField;
	public sourceIDField:JTextField;
	public editorField:JTextField;
	public descriptionArea:JTextArea;
	public missingVoiceBoxes:JCheckBox[];
	public moveUpButton:JButton;
	public moveDownButton:JButton;
	public insertBeforeButton:JButton;
	public insertAfterButton:JButton;
	public deleteButton:JButton;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: VersionPanel(ArrayList<VariantVersionData> versionsList,int vi)
Purpose:     Initialize and lay out panel
Parameters:
  Input:  
  Output: -
------------------------------------------------------------------------*/
	public constructor(versionsList:ArrayList<VariantVersionData>,vi:number,numVoices:number)
	{
		super();
		this.setLayout(new GridBagLayout());
		let ovic:GridBagConstraints = new GridBagConstraints();
		ovic.anchor = GridBagConstraints.LINE_START;
		this.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder(""),BorderFactory.createEmptyBorder(5,5,5,5)));
		let v:VariantVersionData = versionsList.get(vi);
		let headingID:JLabel = new JLabel("Version name");
		let headingSourceName:JLabel = new JLabel("Source name");
		let headingSourceID:JLabel = new JLabel("Source ID no.");
		let headingEditor:JLabel = new JLabel("Editor");
		let headingDescription:JLabel = new JLabel("Description");
		headingID.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		headingSourceName.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		headingSourceID.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		headingEditor.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		headingDescription.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
		ovic.gridx = 0;
		ovic.gridy = 0;
		this.add(headingID,ovic);
		ovic.gridx = 1;
		ovic.gridy = 0;
		this.add(headingEditor,ovic);
		ovic.gridx = 0;
		ovic.gridy = 2;
		this.add(headingSourceName,ovic);
		ovic.gridx = 1;
		ovic.gridy = 2;
		this.add(headingSourceID,ovic);
		ovic.gridx = 0;
		ovic.gridy = 4;
		this.add(headingDescription,ovic);
		this.IDField = new JTextField(v.getID(),20);
		this.sourceNameField = new JTextField(v.getSourceName(),15);
		this.sourceIDField = new JTextField(v.getSourceIDString(),5);
		this.editorField = new JTextField(v.getEditor(),15);
		this.descriptionArea = new JTextArea(v.getDescription(),2,35);
		let descriptionAreaPane:JScrollPane = new JScrollPane(this.descriptionArea);
		ovic.gridx = 0;
		ovic.gridy = 1;
		this.add(this.IDField,ovic);
		ovic.gridx = 1;
		ovic.gridy = 1;
		this.add(this.editorField,ovic);
		ovic.gridx = 0;
		ovic.gridy = 3;
		this.add(this.sourceNameField,ovic);
		ovic.gridx = 1;
		ovic.gridy = 3;
		this.add(this.sourceIDField,ovic);
		ovic.gridx = 0;
		ovic.gridy = 5;
		ovic.gridwidth = 2;
		this.add(descriptionAreaPane,ovic);
		ovic.gridwidth = 1;
		let missingVoicesBox:Box = Box.createHorizontalBox();
		let headingMissingVoices:JLabel = new JLabel("Missing voices: ");
		this.missingVoiceBoxes = Array(numVoices);
		for(
		let i:number = 0;i < numVoices;i ++)
		{
			this.missingVoiceBoxes[i]= new JCheckBox(`${i + 1}`);
			missingVoicesBox.add(this.missingVoiceBoxes[i]);
		}
		for(let missingv of v.getMissingVoices())
		this.missingVoiceBoxes[((( missingv.getNum() - 1) | 0))].setSelected(true);
		ovic.gridx = 0;
		ovic.gridy = 6;
		this.add(headingMissingVoices,ovic);
		ovic.gridx = 0;
		ovic.gridy = 7;
		ovic.gridwidth = 4;
		this.add(missingVoicesBox,ovic);
		ovic.gridwidth = 1;
		this.moveUpButton = new JButton("Move up");
		this.moveDownButton = new JButton("Move down");
		this.insertBeforeButton = new JButton("Insert before");
		this.insertAfterButton = new JButton("Insert after");
		this.deleteButton = new JButton("Delete");
		if( vi <= 1)
			this.moveUpButton.setEnabled(false);

		if( vi ==(( versionsList.size() - 1) | 0))
			this.moveDownButton.setEnabled(false);

		if( vi > 0)
			{
				ovic.gridx = 2;
				ovic.gridy = 1;
				this.add(Box.createHorizontalStrut(5),ovic);
				ovic.gridx = 4;
				ovic.gridy = 1;
				this.add(Box.createHorizontalStrut(5),ovic);
				ovic.gridx = 3;
				ovic.gridy = 1;
				this.add(this.moveUpButton,ovic);
				ovic.gridx = 3;
				ovic.gridy = 3;
				this.add(this.moveDownButton,ovic);
				ovic.gridx = 5;
				ovic.gridy = 1;
				this.add(this.insertBeforeButton,ovic);
				ovic.gridx = 5;
				ovic.gridy = 3;
				this.add(this.insertAfterButton,ovic);
				ovic.gridx = 3;
				ovic.gridy = 5;
				this.add(this.deleteButton,ovic);
			}

	}

	/* missing voice checkboxes */
	/* controls */
	/*------------------------------------------------------------------------
Method:  void addListeners(EventListener listener)
Purpose: Register GUI listeners
Parameters:
  Input:  -
  Output: EventListener listener - listener to add
  Return: -
------------------------------------------------------------------------*/
	public addListeners_1(listener:EventListener):void
	{
		this.moveUpButton.addActionListener(<ActionListener> listener);
		this.moveDownButton.addActionListener(<ActionListener> listener);
		this.insertBeforeButton.addActionListener(<ActionListener> listener);
		this.insertAfterButton.addActionListener(<ActionListener> listener);
		this.deleteButton.addActionListener(<ActionListener> listener);
		for(let mvb of this.missingVoiceBoxes)
		mvb.addItemListener(<ItemListener> listener);
	}

	/*------------------------------------------------------------------------
Method:  void removeListeners(EventListener listener)
Purpose: Unregister GUI listeners (should match addListeners)
Parameters:
  Input:  -
  Output: EventListener listener - listener to remove
  Return: -
------------------------------------------------------------------------*/
	public removeListeners_1(listener:EventListener):void
	{
		this.moveUpButton.removeActionListener(<ActionListener> listener);
		this.moveDownButton.removeActionListener(<ActionListener> listener);
		this.insertBeforeButton.removeActionListener(<ActionListener> listener);
		this.insertAfterButton.removeActionListener(<ActionListener> listener);
		this.deleteButton.removeActionListener(<ActionListener> listener);
		for(let mvb of this.missingVoiceBoxes)
		mvb.removeItemListener(<ItemListener> listener);
	}
}
