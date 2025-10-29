
import { TextDeleteDialog } from './TextDeleteDialog';
import { OriginalTextDeleteDialog } from './OriginalTextDeleteDialog';
import { NoteInfoPanel } from './NoteInfoPanel';
import { ModernTextDeleteDialog } from './ModernTextDeleteDialog';
import { ModernKeySigPanel } from './ModernKeySigPanel';
import { MensurationChooser } from './MensurationChooser';
import { GeneralInfoFrame } from './GeneralInfoFrame';
import { EditorWin } from './EditorWin';
import { ColorationChooser } from './ColorationChooser';
import { Dimension } from '../java/awt/Dimension';
import { Container } from '../java/awt/Container';
import { Toolkit } from '../java/awt/Toolkit';
import { WindowAdapter } from '../java/awt/event/WindowAdapter';
import { WindowListener } from '../java/awt/event/WindowListener';
import { WindowEvent } from '../java/awt/event/WindowEvent';
import { JPanel } from '../javax/swing/JPanel';
import { Box } from '../javax/swing/Box';
import { JDialog } from '../javax/swing/JDialog';
import { BorderFactory } from '../javax/swing/BorderFactory';
import { BoxLayout } from '../javax/swing/BoxLayout';
import { JRadioButton } from '../javax/swing/JRadioButton';
import { ButtonGroup } from '../javax/swing/ButtonGroup';
import { JCheckBox } from '../javax/swing/JCheckBox';

export class EditingOptionsFrame extends JDialog
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	owner:EditorWin;
	colorationOnCheckBox:JCheckBox;
	colorationTypeMinorColor:JRadioButton;
	colorationTypeSesquialtera:JRadioButton;
	colorationTypeImperfectio:JRadioButton;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: EditingOptionsFrame(EditorWin owner)
Purpose:     Initialize and lay out frame
Parameters:
  Input:  EditorWin owner - parent frame
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(owner:EditorWin)
	{
		super(owner,"Input options",false);
		this.owner = owner;
		let eecp:Container = this.getContentPane();
		let editOptionsBox:Box = Box.createVerticalBox();
		let noteInputPanel:JPanel = new JPanel();
		noteInputPanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Note/Rest Input"),BorderFactory.createEmptyBorder(5,5,5,5)));
		noteInputPanel.setLayout(new BoxLayout(noteInputPanel,BoxLayout.Y_AXIS));
		let cBox:Box = Box.createHorizontalBox();
		this.colorationOnCheckBox = new JCheckBox("Coloration",false);
		cBox.add(this.colorationOnCheckBox);
		cBox.add(Box.createHorizontalGlue());
		noteInputPanel.add(cBox);
		let colorationTypePanel:JPanel = new JPanel();
		colorationTypePanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Current Coloration Type"),BorderFactory.createEmptyBorder(5,5,5,5)));
		colorationTypePanel.setLayout(new BoxLayout(colorationTypePanel,BoxLayout.X_AXIS));
		let ctBox:Box = Box.createVerticalBox();
		this.colorationTypeMinorColor = new JRadioButton("'Minor color'",true);
		this.colorationTypeSesquialtera = new JRadioButton("Sesquialtera (3/2)");
		this.colorationTypeImperfectio = new JRadioButton("Imperfectio");
		let ctGroup:ButtonGroup = new ButtonGroup();
		ctGroup.add(this.colorationTypeMinorColor);
		ctGroup.add(this.colorationTypeSesquialtera);
		ctGroup.add(this.colorationTypeImperfectio);
		ctBox.add(this.colorationTypeMinorColor);
		ctBox.add(this.colorationTypeSesquialtera);
		ctBox.add(this.colorationTypeImperfectio);
		colorationTypePanel.add(ctBox);
		colorationTypePanel.add(Box.createHorizontalGlue());
		this.colorationOnCheckBox.addItemListener(owner);
		this.colorationTypeMinorColor.addActionListener(owner);
		this.colorationTypeSesquialtera.addActionListener(owner);
		this.colorationTypeImperfectio.addActionListener(owner);
		editOptionsBox.add(noteInputPanel);
		editOptionsBox.add(colorationTypePanel);
		editOptionsBox.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
		eecp.add(editOptionsBox);
		this.pack();
		this.addWindowListener(
		{

			/* note/rest input panel */
			/* coloration type panel */
			windowClosing:(event:WindowEvent):void =>
			{
				this.ownerSetEditMenuEditingOptions(false);
			}
		}
		);
	}

	ownerSetEditMenuEditingOptions(newval:boolean):void
	{
		this.owner.setEditMenuEditingOptions(newval);
	}

	/*------------------------------------------------------------------------
Method:  void setLocation(int eox,int eoy)
Purpose: Position frame
Parameters:
  Input:  int eox,eoy - new location to attempt
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setLocation(eox:number,eoy:number):void
	{
		let eoWidth:number = this.getSize().width;
		let eoHeight:number = this.getSize().height;
		let screenSize:Dimension = Toolkit.getDefaultToolkit().getScreenSize();
		if((( eox + eoWidth) | 0) > screenSize.width)
			eox =(( screenSize.width - eoWidth) | 0);

		if((( eoy + eoHeight) | 0) > screenSize.height)
			eoy =(( screenSize.height - eoHeight) | 0);

		super.setLocation(eox,eoy);
	}

	/* position relative to event editor frame 
    int eox=eventEditorFrame.getLocation().x+eventEditorFrame.getSize().width,
        eoy=eventEditorFrame.getLocation().y,*/
	/*------------------------------------------------------------------------
Method:  void [set|toggle]*Option()
Purpose: Control options in frame
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public toggleColorationOption():void
	{
		let newState:boolean = ! this.colorationOnCheckBox.isSelected();
		this.colorationOnCheckBox.setSelected(newState);
		this.owner.setInputColorationOn(newState);
	}

	/*------------------------------------------------------------------------
Method:  void removeListeners()
Purpose: Unregister GUI listeners
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	/* 
	private WindowListener[] getListeners(Object o) //CHANGE
	{
		throw new RuntimeException();
	}*/
	public removeListeners_3():void
	{
		this.colorationOnCheckBox.removeItemListener(this.owner);
		this.colorationTypeImperfectio.removeActionListener(this.owner);
		this.colorationTypeSesquialtera.removeActionListener(this.owner);
		this.colorationTypeMinorColor.removeActionListener(this.owner);
		for(let wl of this.getListeners("WindowListener"))
		this.removeWindowListener(wl);
	}
}
