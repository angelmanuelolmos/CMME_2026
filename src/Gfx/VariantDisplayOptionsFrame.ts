
import { Exception } from '../java/lang/Exception';
import { SelectionPanel } from './SelectionPanel';
import { NoteShapeStyleListener } from './MusicWin';
import { BarlineStyleListener } from './MusicWin';
import { ViewSizeListener } from './MusicWin';
import { PDFFileFilter } from './MusicWin';
import { HTMLFileFilter } from './MusicWin';
import { XMLFileFilter } from './MusicWin';
import { MIDIFileFilter } from './MusicWin';
import { CMMEFileFilter } from './MusicWin';
import { MusicWin } from './MusicWin';
import { Container } from '../java/awt/Container';
import { WindowAdapter } from '../java/awt/event/WindowAdapter';
import { WindowListener } from '../java/awt/event/WindowListener';
import { WindowEvent } from '../java/awt/event/WindowEvent';
import { ItemListener } from '../java/awt/event/ItemListener';
import { ItemEvent } from '../java/awt/event/ItemEvent';
import { JPanel } from '../javax/swing/JPanel';
import { Box } from '../javax/swing/Box';
import { JDialog } from '../javax/swing/JDialog';
import { BorderFactory } from '../javax/swing/BorderFactory';
import { BoxLayout } from '../javax/swing/BoxLayout';
import { JRadioButton } from '../javax/swing/JRadioButton';
import { ButtonGroup } from '../javax/swing/ButtonGroup';
import { JCheckBox } from '../javax/swing/JCheckBox';
import { ArrayList } from '../java/util/ArrayList';
import { VariantReading } from '../DataStruct/VariantReading';

export class VariantDisplayOptionsFrame extends JDialog implements ItemListener
{
	mytype_ItemListener:boolean = true;
	public static OptionSet_OPT_VAR_ALL:number = 0;
	//CHANGE circular
	public static OptionSet_OPT_VAR_NONE:number = 2;
	public static OptionSet_OPT_VAR_CUSTOM:number = 3;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	ownerWin:MusicWin;
	versionsPanel:SelectionPanel;
	variantTypesPanel:SelectionPanel;
	buttonAllVariants:JRadioButton;
	buttonNoVariants:JRadioButton;
	buttonSelectedVariants:JRadioButton;

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  long calcVarFlags(JCheckBox[] variantTypeCheckBoxes)
Purpose: Calculate flag set for filtering variant types based on user selection
Parameters:
  Input:  JCheckBox[] variantTypeCheckBoxes - array of check boxes for all
                                              variant types
  Output: -
  Return: flag set representing user-selected variant types
------------------------------------------------------------------------*/
	public static calcVarFlags(variantTypeCheckBoxes:JCheckBox[]):number
	{
		let newFlags:number = VariantReading.VAR_NONE;
		let curFlagVal:number = VariantReading.VAR_NONSUBSTANTIVE;
		for(
		let i:number = 0;i < variantTypeCheckBoxes.length;i ++)
		{
			if( variantTypeCheckBoxes[i].isSelected())
				newFlags |= curFlagVal;

			curFlagVal <<= 1;
		}
		return newFlags;
	}
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: VariantDisplayOptionsFrame(MusicWin ownerWin)
Purpose:     Lay out frame
Parameters:
  Input:  MusicWin ownerWin - music window to which this frame is connected
  Output: -
------------------------------------------------------------------------*/
	public constructor(ownerWin:MusicWin)
	{
		super(ownerWin,"Variant display options",false);
		this.ownerWin = ownerWin;
		this.versionsPanel = this.createVersionsPanel_3(ownerWin.getMusicData_2().getVariantVersionNames());
		let variantsPanel:JPanel = this.createVariantsPanel();
		let cp:Container = this.getContentPane();
		cp.setLayout(new BoxLayout(cp,BoxLayout.Y_AXIS));
		cp.add(this.versionsPanel);
		cp.add(variantsPanel);
		this.pack();
		this.registerListeners_6();
	}

	/*------------------------------------------------------------------------
Method:  JPanel create*Panel()
Purpose: Initialize individual panes within frame
Parameters:
  Input:  -
  Output: -
  Return: one frame section as JPanel
------------------------------------------------------------------------*/
	/* versions panel */
	createVersionsPanel_3(versionNames:ArrayList<string>):SelectionPanel
	{
		let versionsPanel:SelectionPanel = SelectionPanel.new1_3("Display version",versionNames,SelectionPanel.RADIOBUTTON,4);
		return versionsPanel;
	}

	/* variants panel */
	createVariantsPanel():JPanel
	{
		this.buttonAllVariants = new JRadioButton("All variants");
		this.buttonNoVariants = new JRadioButton("No variants");
		this.buttonSelectedVariants = new JRadioButton("Selected variant types:");
		this.buttonNoVariants.setSelected(true);
		let categoryButtonGroup:ButtonGroup = new ButtonGroup();
		categoryButtonGroup.add(this.buttonAllVariants);
		categoryButtonGroup.add(this.buttonNoVariants);
		categoryButtonGroup.add(this.buttonSelectedVariants);
		let buttonPane:Box = Box.createHorizontalBox();
		buttonPane.add(this.buttonAllVariants);
		buttonPane.add(Box.createHorizontalStrut(10));
		buttonPane.add(this.buttonNoVariants);
		buttonPane.add(Box.createHorizontalStrut(10));
		buttonPane.add(this.buttonSelectedVariants);
		buttonPane.add(Box.createHorizontalGlue());
		buttonPane.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
		this.variantTypesPanel = SelectionPanel.new0_3(null,VariantReading.typeNames,SelectionPanel.CHECKBOX,5);
		for(let cb of this.variantTypesPanel.checkBoxes)
		{
			cb.setSelected(false);
			if( ! this.buttonSelectedVariants.isSelected())
				cb.setEnabled(false);

		}
		this.variantTypesPanel.checkBoxes[VariantReading.varIndex(VariantReading.VAR_RHYTHM)].setSelected(true);
		this.variantTypesPanel.checkBoxes[VariantReading.varIndex(VariantReading.VAR_PITCH)].setSelected(true);
		this.variantTypesPanel.checkBoxes[VariantReading.varIndex(VariantReading.VAR_ACCIDENTAL)].setSelected(true);
		this.variantTypesPanel.checkBoxes[VariantReading.varIndex(VariantReading.VAR_COLORATION)].setSelected(true);
		this.variantTypesPanel.checkBoxes[VariantReading.varIndex(VariantReading.VAR_LIGATURE)].setSelected(true);
		this.variantTypesPanel.checkBoxes[VariantReading.varIndex(VariantReading.VAR_MENSSIGN)].setSelected(true);
		let variantsPanel:JPanel = new JPanel();
		variantsPanel.setLayout(new BoxLayout(variantsPanel,BoxLayout.Y_AXIS));
		variantsPanel.add(buttonPane);
		variantsPanel.add(this.variantTypesPanel);
		variantsPanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Mark on score"),BorderFactory.createEmptyBorder(5,5,5,5)));
		return variantsPanel;
	}

	/* variant category controls */
	/* variant types */
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
		try
		{
			let item:any = event.getItemSelectable();
			for(
			let i:number = 0;i < this.versionsPanel.radioButtons.length;i ++)
			if( item == this.versionsPanel.radioButtons[i])
				this.ownerWin.setCurrentVariantVersion_2(i);

			if( item == this.buttonAllVariants)
				{
					this.ownerWin.setVariantMarkingOption_2(VariantDisplayOptionsFrame.OptionSet_OPT_VAR_ALL);
					this.ownerWin.rerender_3();
				}

			else
				if( item == this.buttonNoVariants)
					{
						this.ownerWin.setVariantMarkingOption_2(VariantDisplayOptionsFrame.OptionSet_OPT_VAR_NONE);
						this.ownerWin.rerender_3();
					}

				else
					if( item == this.buttonSelectedVariants)
						if( this.buttonSelectedVariants.isSelected())
							{
								for(let cb of this.variantTypesPanel.checkBoxes)
								cb.setEnabled(true);
								this.ownerWin.setVariantMarkingOption_1(VariantDisplayOptionsFrame.OptionSet_OPT_VAR_CUSTOM,VariantDisplayOptionsFrame.calcVarFlags(this.variantTypesPanel.checkBoxes));
								this.ownerWin.rerender_3();
							}

						else
							{
								for(let cb of this.variantTypesPanel.checkBoxes)
								cb.setEnabled(false);
							}

			for(let cb of this.variantTypesPanel.checkBoxes)
			if( item == cb)
				{
					this.ownerWin.setVariantMarkingOption_1(VariantDisplayOptionsFrame.OptionSet_OPT_VAR_CUSTOM,VariantDisplayOptionsFrame.calcVarFlags(this.variantTypesPanel.checkBoxes));
					this.ownerWin.rerender_3();
				}

		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					this.ownerWin.handleRuntimeError(e);
				}

			else
				throw e;

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
	ownerSetVersionsMenuDisplayVariantOptions(newval:boolean):void
	{
		this.ownerWin.setVersionsMenuDisplayVariantOptions(newval);
	}

	public registerListeners_6():void
	{
		this.versionsPanel.registerListeners_1(this);
		this.variantTypesPanel.registerListeners_1(this);
		this.buttonAllVariants.addItemListener(this);
		this.buttonNoVariants.addItemListener(this);
		this.buttonSelectedVariants.addItemListener(this);
		this.addWindowListener(
		{

			windowClosing:(event:WindowEvent):void =>
			{
				this.ownerSetVersionsMenuDisplayVariantOptions(false);
			}
		}
		);
	}

	public unregisterListeners_9():void
	{
		this.versionsPanel.unregisterListeners_2(this);
		this.variantTypesPanel.unregisterListeners_2(this);
		this.buttonAllVariants.removeItemListener(this);
		this.buttonNoVariants.removeItemListener(this);
		this.buttonSelectedVariants.removeItemListener(this);
		for(let w of this.getListeners("WindowListener"))
		this.removeWindowListener(w);
	}
}
