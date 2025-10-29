
import { TextDeleteDialog } from './TextDeleteDialog';
import { OriginalTextDeleteDialog } from './OriginalTextDeleteDialog';
import { NoteInfoPanel } from './NoteInfoPanel';
import { ModernTextDeleteDialog } from './ModernTextDeleteDialog';
import { ModernKeySigPanel } from './ModernKeySigPanel';
import { MensurationChooser } from './MensurationChooser';
import { GeneralInfoFrame } from './GeneralInfoFrame';
import { EditingOptionsFrame } from './EditingOptionsFrame';
import { GridLayout } from '../java/awt/GridLayout';
import { ItemListener } from '../java/awt/event/ItemListener';
import { JPanel } from '../javax/swing/JPanel';
import { BorderFactory } from '../javax/swing/BorderFactory';
import { JComboBox } from '../javax/swing/JComboBox';
import { JLabel } from '../javax/swing/JLabel';
import { Coloration } from '../DataStruct/Coloration';

export class ColorationChooser extends JPanel
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public PrimaryColorChooser:JComboBox<string>;
	public PrimaryFillChooser:JComboBox<string>;
	public SecondaryColorChooser:JComboBox<string>;
	public SecondaryFillChooser:JComboBox<string>;

	public static new0_1():ColorationChooser
	{
		let _new0:ColorationChooser = new ColorationChooser;
		ColorationChooser.set0_1(_new0);
		return _new0;
	}

	public static set0_1(new0:ColorationChooser):void
	{
		let colorNames:string[]= Array(Coloration.ColorNames.length);
		let colorFillNames:string[]= Array(Coloration.ColorFillNames.length);
		for(
		let ci:number = 0;ci < colorNames.length;ci ++)
		colorNames[ci]= " " + Coloration.ColorNames[ci];
		for(
		let ci:number = 0;ci < colorFillNames.length;ci ++)
		colorFillNames[ci]= " " + Coloration.ColorFillNames[ci];
		new0.PrimaryColorChooser = new JComboBox<string>(colorNames);
		new0.PrimaryFillChooser = new JComboBox<string>(colorFillNames);
		new0.SecondaryColorChooser = new JComboBox<string>(colorNames);
		new0.SecondaryFillChooser = new JComboBox<string>(colorFillNames);
		new0.setLayout(new GridLayout(2,3));
		let primaryLabel:JLabel = new JLabel("Primary:");
		primaryLabel.setBorder(BorderFactory.createEmptyBorder(5,5,5,5));
		new0.add(primaryLabel);
		new0.add(new0.PrimaryColorChooser);
		new0.add(new0.PrimaryFillChooser);
		let secondaryLabel:JLabel = new JLabel("Secondary:");
		secondaryLabel.setBorder(BorderFactory.createEmptyBorder(5,5,5,5));
		new0.add(secondaryLabel);
		new0.add(new0.SecondaryColorChooser);
		new0.add(new0.SecondaryFillChooser);
	}

	public static new1_1(c:Coloration):ColorationChooser
	{
		let _new1:ColorationChooser = new ColorationChooser;
		ColorationChooser.set1_1(_new1,c);
		return _new1;
	}

	public static set1_1(new1:ColorationChooser,c:Coloration):void
	{
		ColorationChooser.set0_1(new1);
		new1.setIndices_1(c);
	}

	/*------------------------------------------------------------------------
Method:  void setIndices(Coloration c)
Purpose: Set values of combo boxes
Parameters:
  Input:  Coloration c - data for combo boxes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setIndices_1(c:Coloration):void
	{
		this.PrimaryColorChooser.setSelectedIndex(c.primaryColor);
		this.PrimaryFillChooser.setSelectedIndex(c.primaryFill);
		this.SecondaryColorChooser.setSelectedIndex(c.secondaryColor);
		this.SecondaryFillChooser.setSelectedIndex(c.secondaryFill);
	}

	/*------------------------------------------------------------------------
Method:  Coloration createColoration()
Purpose: Generate Coloration structure with values from combo boxes
Parameters:
  Input:  -
  Output: -
  Return: new coloration structure
------------------------------------------------------------------------*/
	public createColoration():Coloration
	{
		return Coloration.new0(this.PrimaryColorChooser.getSelectedIndex(),this.PrimaryFillChooser.getSelectedIndex(),this.SecondaryColorChooser.getSelectedIndex(),this.SecondaryFillChooser.getSelectedIndex());
	}

	/*------------------------------------------------------------------------
Method:  void addListener(ItemListener aListener)
Purpose: Register GUI listener
Parameters:
  Input:  ItemListener aListener - listener to add
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addListener(aListener:ItemListener):void
	{
		this.PrimaryColorChooser.addItemListener(aListener);
		this.PrimaryFillChooser.addItemListener(aListener);
		this.SecondaryColorChooser.addItemListener(aListener);
		this.SecondaryFillChooser.addItemListener(aListener);
	}

	/*------------------------------------------------------------------------
Method:  void removeListener(ItemListener aListener)
Purpose: Unregister GUI listener
Parameters:
  Input:  ItemListener aListener - listener to remove
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public removeListener(aListener:ItemListener):void
	{
		this.PrimaryColorChooser.removeItemListener(aListener);
		this.PrimaryFillChooser.removeItemListener(aListener);
		this.SecondaryColorChooser.removeItemListener(aListener);
		this.SecondaryFillChooser.removeItemListener(aListener);
	}

	/*------------------------------------------------------------------------
Method:  boolean itemSelected(Object o)
Purpose: Check whether a given object corresponds to one of this chooser's
         items
Parameters:
  Input:  Object o - selected item
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public itemSelected(o:any):boolean
	{
		return o == this.PrimaryColorChooser || o == this.PrimaryFillChooser || o == this.SecondaryColorChooser || o == this.SecondaryFillChooser;
	}
}
