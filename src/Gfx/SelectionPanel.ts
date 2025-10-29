
import { Math } from '../java/lang/Math';
import { ItemListener } from '../java/awt/event/ItemListener';
import { ArrayList } from '../java/util/ArrayList';
import { List } from '../java/util/List';
import { JPanel } from '../javax/swing/JPanel';
import { Box } from '../javax/swing/Box';
import { BorderFactory } from '../javax/swing/BorderFactory';
import { BoxLayout } from '../javax/swing/BoxLayout';
import { JRadioButton } from '../javax/swing/JRadioButton';
import { ButtonGroup } from '../javax/swing/ButtonGroup';
import { JCheckBox } from '../javax/swing/JCheckBox';

export class SelectionPanel extends JPanel
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static CHECKBOX:number = 0;
	public static RADIOBUTTON:number = 1;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public selectionType:number;
	/* check box, radio button, etc */
	public numItems:number;
	public checkBoxes:JCheckBox[];
	public radioButtons:JRadioButton[];

	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: SelectionPanel(String title,List<String> itemNames,
                            int selectionType,int numItemsPerRow)
Purpose:     Init panel
Parameters:
  Input:  String title           - panel title
          List<String> itemNames - names of buttons/boxes to add
          int selectionType      - type of selection element
          int numItemsPerRow     - number of elements in each row of panel
  Output: -
------------------------------------------------------------------------*/
	private static ArraysasList(itemNames:string[]):List<string>
	{
		let out:ArrayList<string> = new ArrayList<string>();
		for(
		let i:number = 0;i < itemNames.length;i ++)
		out.add(itemNames[i]);
		return out;
	}

	public static new0_3(title:string,itemNames:string[],selectionType:number,numItemsPerRow:number):SelectionPanel
	{
		let _new0:SelectionPanel = new SelectionPanel;
		SelectionPanel.set0_3(_new0,title,itemNames,selectionType,numItemsPerRow);
		return _new0;
	}

	public static set0_3(new0:SelectionPanel,title:string,itemNames:string[],selectionType:number,numItemsPerRow:number):void
	{
		SelectionPanel.set1_3(new0,title,SelectionPanel.ArraysasList(itemNames),selectionType,numItemsPerRow);
	}

	public static new1_3(title:string,itemNames:List<string>,selectionType:number,numItemsPerRow:number):SelectionPanel
	{
		let _new1:SelectionPanel = new SelectionPanel;
		SelectionPanel.set1_3(_new1,title,itemNames,selectionType,numItemsPerRow);
		return _new1;
	}

	public static set1_3(new1:SelectionPanel,title:string,itemNames:List<string>,selectionType:number,numItemsPerRow:number):void
	{
		new1.selectionType = selectionType;
		new1.numItems = itemNames.size();
		let numItemLevels:number = Math.floor((( new1.numItems / numItemsPerRow) | 0));
		if( new1.numItems % numItemsPerRow != 0)
			numItemLevels ++;

		let itemGroup:ButtonGroup = new ButtonGroup();
		switch( selectionType)
		{
			case SelectionPanel.CHECKBOX:
			{
				new1.checkBoxes = Array(new1.numItems);
				new1.radioButtons = Array(0);
				break;
			}
			case SelectionPanel.RADIOBUTTON:
			{
				new1.checkBoxes = Array(0);
				new1.radioButtons = Array(new1.numItems);
				break;
			}
		}
		let itemRowPanes:Box[]= Array(numItemLevels);
		let curBox:number = - 1;
		for(
		let i:number = 0;i < new1.numItems;i ++)
		{
			if( i % numItemsPerRow == 0)
				itemRowPanes[( ++ curBox)]= Box.createHorizontalBox();

			switch( selectionType)
			{
				case SelectionPanel.CHECKBOX:
				{
					new1.checkBoxes[i]= new JCheckBox(itemNames.get(i));
					new1.checkBoxes[i].setSelected(true);
					itemRowPanes[curBox].add(new1.checkBoxes[i]);
					break;
				}
				case SelectionPanel.RADIOBUTTON:
				{
					new1.radioButtons[i]= new JRadioButton(itemNames.get(i));
					if( i == 0)
						new1.radioButtons[i].setSelected(true);

					itemGroup.add(new1.radioButtons[i]);
					itemRowPanes[curBox].add(new1.radioButtons[i]);
					break;
				}
			}
			itemRowPanes[curBox].add(Box.createHorizontalStrut(5));
		}
		new1.setLayout(new BoxLayout(new1,BoxLayout.Y_AXIS));
		for(let b of itemRowPanes)
		{
			b.add(Box.createHorizontalGlue());
			b.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
			new1.add(b);
		}
		if( title != null)
			new1.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder(title),BorderFactory.createEmptyBorder(5,5,5,5)));

	}

	/*------------------------------------------------------------------------
Method:  void [un]registerListeners()
Purpose: Add and remove event listeners
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public registerListeners_1(listener:ItemListener):void
	{
		for(let cb of this.checkBoxes)
		cb.addItemListener(listener);
		for(let rb of this.radioButtons)
		rb.addItemListener(listener);
	}

	public unregisterListeners_2(listener:ItemListener):void
	{
		for(let cb of this.checkBoxes)
		cb.removeItemListener(listener);
		for(let rb of this.radioButtons)
		rb.removeItemListener(listener);
	}
}
