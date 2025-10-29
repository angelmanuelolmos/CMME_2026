
import { OriginalTextDeleteDialog } from './OriginalTextDeleteDialog';
import { NoteInfoPanel } from './NoteInfoPanel';
import { ModernTextDeleteDialog } from './ModernTextDeleteDialog';
import { ModernKeySigPanel } from './ModernKeySigPanel';
import { MensurationChooser } from './MensurationChooser';
import { GeneralInfoFrame } from './GeneralInfoFrame';
import { EditorWin } from './EditorWin';
import { EditingOptionsFrame } from './EditingOptionsFrame';
import { ColorationChooser } from './ColorationChooser';
import { LinkedList } from '../java/util/LinkedList';
import { Component } from '../java/awt/Component';
import { Container } from '../java/awt/Container';
import { ActionEvent } from '../java/awt/event/ActionEvent';
import { ActionListener } from '../java/awt/event/ActionListener';
import { JPanel } from '../javax/swing/JPanel';
import { Box } from '../javax/swing/Box';
import { JDialog } from '../javax/swing/JDialog';
import { BorderFactory } from '../javax/swing/BorderFactory';
import { BoxLayout } from '../javax/swing/BoxLayout';
import { JButton } from '../javax/swing/JButton';
import { JCheckBox } from '../javax/swing/JCheckBox';
import { PieceData } from '../DataStruct/PieceData';

export abstract class TextDeleteDialog extends JDialog implements ActionListener
{
	mytype_ActionListener:boolean = true;
	/*----------------------------------------------------------------------*/
	/* Class variables */
	static VOICE_BOXES_PER_ROW:number = 12;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	owner:EditorWin;
	musicData:PieceData;
	allPanels:LinkedList<Component>;
	voiceCheckBoxes:JCheckBox[];
	OKButton:JButton;
	cancelButton:JButton;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: TextDeleteDialog(EditorWin owner)
Purpose:     Initialize and lay out frame
Parameters:
  Input:  EditorWin owner - parent frame
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(owner:EditorWin)
	{
		super(owner,"Delete text",true);
		this.owner = owner;
		this.musicData = owner.getMusicData_2();
		this.initLayout();
	}

	initLayout():void
	{
		let cp:Container = this.getContentPane();
		cp.setLayout(new BoxLayout(cp,BoxLayout.Y_AXIS));
		this.createPanels_1();
		this.addPanelsToLayout_1(cp);
		this.registerListeners_2();
		this.pack();
		this.setLocationRelativeTo(this.owner);
		this.setVisible(true);
	}

	createPanels_1():void
	{
		this.allPanels = new LinkedList<Component>();
		this.allPanels.add(this.createVoicesPanel());
		this.allPanels.add(this.createButtonPane_1());
	}

	addPanelsToLayout_1(cp:Container):void
	{
		for(let p of this.allPanels)
		cp.add(p);
	}

	createVoicesPanel():JPanel
	{
		let numVoices:number = this.musicData.getVoiceData().length;
		let voicesPanel:JPanel = new JPanel();
		voicesPanel.setLayout(new BoxLayout(voicesPanel,BoxLayout.Y_AXIS));
		this.voiceCheckBoxes = Array(numVoices);
		let numVoiceLevels:number =(( this.voiceCheckBoxes.length / TextDeleteDialog.VOICE_BOXES_PER_ROW) | 0);
		if( this.voiceCheckBoxes.length % TextDeleteDialog.VOICE_BOXES_PER_ROW != 0)
			numVoiceLevels ++;

		let voiceBoxesPanes:Box[]= Array(numVoiceLevels);
		let curBox:number = - 1;
		for(
		let i:number = 0;i < this.voiceCheckBoxes.length;i ++)
		{
			if( i % TextDeleteDialog.VOICE_BOXES_PER_ROW == 0)
				voiceBoxesPanes[( ++ curBox)]= Box.createHorizontalBox();

			this.voiceCheckBoxes[i]= new JCheckBox(`${i + 1}`);
			this.voiceCheckBoxes[i].setSelected(true);
			voiceBoxesPanes[curBox].add(this.voiceCheckBoxes[i]);
			voiceBoxesPanes[curBox].add(Box.createHorizontalStrut(5));
		}
		for(let b of voiceBoxesPanes)
		{
			b.add(Box.createHorizontalGlue());
			b.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
			voicesPanel.add(b);
		}
		voicesPanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Voices"),BorderFactory.createEmptyBorder(5,5,5,5)));
		return voicesPanel;
	}

	createButtonPane_1():Box
	{
		this.OKButton = new JButton("Delete");
		this.cancelButton = new JButton("Cancel");
		let buttonPane:Box = Box.createHorizontalBox();
		buttonPane.add(Box.createHorizontalGlue());
		buttonPane.add(this.OKButton);
		buttonPane.add(Box.createHorizontalStrut(10));
		buttonPane.add(this.cancelButton);
		buttonPane.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
		return buttonPane;
	}

	/* action buttons */
	/*------------------------------------------------------------------------
Method:  void deleteText()
Purpose: Delete text according to selected GUI parameters
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	/*abstract*/
	deleteText_1():void
	{
	}

	//CHANGE
	/*------------------------------------------------------------------------
Method:     void actionPerformed(ActionEvent event)
Implements: ActionListener.actionPerformed
Purpose:    Check for action types in GUI and take appropriate action
Parameters:
  Input:  ActionEvent event - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public actionPerformed(event:ActionEvent):void
	{
		let item:any = event.getSource();
		if( item == this.OKButton)
			{
				this.deleteText_1();
				this.closeDialog();
			}

		else
			if( item == this.cancelButton)
				this.closeDialog();

	}

	/*------------------------------------------------------------------------
Method:  void closeDialog()
Purpose: Clean up and disappear
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	closeDialog():void
	{
		this.setVisible(false);
		this.unregisterListeners_5();
		this.dispose();
	}

	/*------------------------------------------------------------------------
Method:  void (un)registerListeners()
Purpose: Register/unregister GUI listeners (register and unregister should match)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public registerListeners_2():void
	{
		this.OKButton.addActionListener(this);
		this.cancelButton.addActionListener(this);
	}

	public unregisterListeners_5():void
	{
		this.OKButton.removeActionListener(this);
		this.cancelButton.removeActionListener(this);
	}
}
