
import { TextDeleteDialog } from './TextDeleteDialog';
import { OriginalTextDeleteDialog } from './OriginalTextDeleteDialog';
import { NoteInfoPanel } from './NoteInfoPanel';
import { ModernTextDeleteDialog } from './ModernTextDeleteDialog';
import { ModernKeySigPanel } from './ModernKeySigPanel';
import { GeneralInfoFrame } from './GeneralInfoFrame';
import { EditingOptionsFrame } from './EditingOptionsFrame';
import { ColorationChooser } from './ColorationChooser';
import { Component } from '../java/awt/Component';
import { GridBagConstraints } from '../java/awt/GridBagConstraints';
import { GridBagLayout } from '../java/awt/GridBagLayout';
import { Vector } from '../java/util/Vector';
import { JPanel } from '../javax/swing/JPanel';
import { Box } from '../javax/swing/Box';
import { ListSelectionModel } from '../javax/swing/ListSelectionModel';
import { BorderFactory } from '../javax/swing/BorderFactory';
import { BoxLayout } from '../javax/swing/BoxLayout';
import { JList } from '../javax/swing/JList';
import { JRadioButton } from '../javax/swing/JRadioButton';
import { ButtonGroup } from '../javax/swing/ButtonGroup';
import { JSpinner } from '../javax/swing/JSpinner';
import { JButton } from '../javax/swing/JButton';
import { JCheckBox } from '../javax/swing/JCheckBox';
import { JScrollPane } from '../javax/swing/JScrollPane';
import { JLabel } from '../javax/swing/JLabel';
import { SpinnerNumberModel } from '../javax/swing/SpinnerNumberModel';
import { MensEvent } from '../DataStruct/MensEvent';
import { MensSignElement } from '../DataStruct/MensSignElement';
import { Mensuration } from '../DataStruct/Mensuration';

export class MensurationChooser extends JPanel
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public prolatioBinaryButton:JRadioButton;
	public prolatioTernaryButton:JRadioButton;
	public tempusBinaryButton:JRadioButton;
	public tempusTernaryButton:JRadioButton;
	public modus_minorBinaryButton:JRadioButton;
	public modus_minorTernaryButton:JRadioButton;
	public modus_maiorBinaryButton:JRadioButton;
	public modus_maiorTernaryButton:JRadioButton;
	public signsList:JList<any>;
	public mensOButton:JButton;
	public mensCButton:JButton;
	public mens2Button:JButton;
	public mens3Button:JButton;
	public mensDotBox:JCheckBox;
	public mensStrokeBox:JCheckBox;
	public mensReverseBox:JCheckBox;
	public mensNoScoreSigBox:JCheckBox;
	public num1Spinner:JSpinner;
	public num2Spinner:JSpinner;
	public deleteButton:JButton;

	public static new0_2():MensurationChooser
	{
		let _new0:MensurationChooser = new MensurationChooser;
		MensurationChooser.set0_2(_new0);
		return _new0;
	}

	public static set0_2(new0:MensurationChooser):void
	{
		new0.setLayout(new BoxLayout(new0,BoxLayout.Y_AXIS));
		let signPanel:JPanel = new JPanel();
		signPanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Sign"),BorderFactory.createEmptyBorder(5,5,5,5)));
		signPanel.setLayout(new BoxLayout(signPanel,BoxLayout.Y_AXIS));
		let signControlsBox:Box = Box.createHorizontalBox();
		let signAddDeleteBox:Box = Box.createVerticalBox();
		let signAddBox:Box = Box.createHorizontalBox();
		let addLabel:JLabel = new JLabel("Add: ");
		signAddBox.add(addLabel);
		new0.mensOButton = new JButton("O");
		new0.mensCButton = new JButton("C");
		new0.mens2Button = new JButton("2");
		new0.mens3Button = new JButton("3");
		signAddBox.add(new0.mensOButton);
		signAddBox.add(new0.mensCButton);
		signAddBox.add(new0.mens2Button);
		signAddBox.add(new0.mens3Button);
		signAddDeleteBox.add(signAddBox);
		signAddDeleteBox.add(Box.createVerticalStrut(5));
		new0.deleteButton = new JButton("Delete");
		signAddDeleteBox.add(new0.deleteButton);
		signControlsBox.add(signAddDeleteBox);
		signControlsBox.add(Box.createHorizontalStrut(10));
		let signParamsBox:Box = Box.createVerticalBox();
		new0.mensDotBox = new JCheckBox("Dot");
		new0.mensStrokeBox = new JCheckBox("Stroke");
		new0.mensReverseBox = new JCheckBox("Reversed");
		new0.mensNoScoreSigBox = new JCheckBox("No score effect");
		signParamsBox.add(new0.mensDotBox);
		signParamsBox.add(new0.mensStrokeBox);
		signParamsBox.add(new0.mensReverseBox);
		signParamsBox.add(new0.mensNoScoreSigBox);
		let numSpinnerBox:Box = Box.createHorizontalBox();
		numSpinnerBox.setAlignmentX(Component.LEFT_ALIGNMENT);
		new0.num1Spinner = new JSpinner(new SpinnerNumberModel(2,0,999,1));
		numSpinnerBox.add(Box.createHorizontalGlue());
		numSpinnerBox.add(new JLabel("Num: "));
		numSpinnerBox.add(new0.num1Spinner);
		signParamsBox.add(numSpinnerBox);
		signControlsBox.add(signParamsBox);
		signControlsBox.add(Box.createHorizontalGlue());
		let signNames:string[]=["C"];
		new0.signsList = new JList<any>(signNames);
		new0.signsList.setSelectionMode(ListSelectionModel.SINGLE_INTERVAL_SELECTION);
		new0.signsList.setLayoutOrientation(JList.HORIZONTAL_WRAP);
		new0.signsList.setVisibleRowCount(1);
		let signScroller:JScrollPane = new JScrollPane(new0.signsList);
		signPanel.add(signScroller);
		signPanel.add(Box.createVerticalStrut(5));
		signPanel.add(signControlsBox);
		let mensurationsPanel:JPanel = new JPanel();
		mensurationsPanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Mensuration information"),BorderFactory.createEmptyBorder(5,5,5,5)));
		mensurationsPanel.setLayout(new GridBagLayout());
		let mpc:GridBagConstraints = new GridBagConstraints();
		new0.prolatioBinaryButton = new JRadioButton("Minor (Binary)",true);
		new0.prolatioTernaryButton = new JRadioButton("Major (Ternary)");
		new0.tempusBinaryButton = new JRadioButton("Imperfect (Binary)",true);
		new0.tempusTernaryButton = new JRadioButton("Perfect (Ternary)");
		new0.modus_minorBinaryButton = new JRadioButton("Imperfect (Binary)",true);
		new0.modus_minorTernaryButton = new JRadioButton("Perfect (Ternary)");
		new0.modus_maiorBinaryButton = new JRadioButton("Imperfect (Binary)",true);
		new0.modus_maiorTernaryButton = new JRadioButton("Perfect (Ternary)");
		let prolatioLabel:JLabel = new JLabel("Prolatio: ");
		let tempusLabel:JLabel = new JLabel("Tempus: ");
		let modus_minorLabel:JLabel = new JLabel("Modus minor: ");
		let modus_maiorLabel:JLabel = new JLabel("Modus maior: ");
		let prolatioButtons:ButtonGroup = new ButtonGroup();
		let tempusButtons:ButtonGroup = new ButtonGroup();
		let modus_minorButtons:ButtonGroup = new ButtonGroup();
		let modus_maiorButtons:ButtonGroup = new ButtonGroup();
		prolatioButtons.add(new0.prolatioBinaryButton);
		prolatioButtons.add(new0.prolatioTernaryButton);
		tempusButtons.add(new0.tempusBinaryButton);
		tempusButtons.add(new0.tempusTernaryButton);
		modus_minorButtons.add(new0.modus_minorBinaryButton);
		modus_minorButtons.add(new0.modus_minorTernaryButton);
		modus_maiorButtons.add(new0.modus_maiorBinaryButton);
		modus_maiorButtons.add(new0.modus_maiorTernaryButton);
		mpc.anchor = GridBagConstraints.LINE_START;
		mpc.gridx = 0;
		mpc.gridy = 0;
		mensurationsPanel.add(prolatioLabel,mpc);
		mpc.gridx = 1;
		mpc.gridy = 0;
		mensurationsPanel.add(new0.prolatioBinaryButton,mpc);
		mpc.gridx = 2;
		mpc.gridy = 0;
		mensurationsPanel.add(new0.prolatioTernaryButton,mpc);
		mpc.gridx = 0;
		mpc.gridy = 1;
		mensurationsPanel.add(tempusLabel,mpc);
		mpc.gridx = 1;
		mpc.gridy = 1;
		mensurationsPanel.add(new0.tempusBinaryButton,mpc);
		mpc.gridx = 2;
		mpc.gridy = 1;
		mensurationsPanel.add(new0.tempusTernaryButton,mpc);
		mpc.gridx = 0;
		mpc.gridy = 2;
		mensurationsPanel.add(modus_minorLabel,mpc);
		mpc.gridx = 1;
		mpc.gridy = 2;
		mensurationsPanel.add(new0.modus_minorBinaryButton,mpc);
		mpc.gridx = 2;
		mpc.gridy = 2;
		mensurationsPanel.add(new0.modus_minorTernaryButton,mpc);
		mpc.gridx = 0;
		mpc.gridy = 3;
		mensurationsPanel.add(modus_maiorLabel,mpc);
		mpc.gridx = 1;
		mpc.gridy = 3;
		mensurationsPanel.add(new0.modus_maiorBinaryButton,mpc);
		mpc.gridx = 2;
		mpc.gridy = 3;
		mensurationsPanel.add(new0.modus_maiorTernaryButton,mpc);
		new0.add(signPanel);
		new0.add(mensurationsPanel);
	}

	public static new1_2(me:MensEvent):MensurationChooser
	{
		let _new1:MensurationChooser = new MensurationChooser;
		MensurationChooser.set1_2(_new1,me);
		return _new1;
	}

	public static set1_2(new1:MensurationChooser,me:MensEvent):void
	{
		MensurationChooser.set0_2(new1);
		new1.setIndices_2(me);
	}

	/*------------------------------------------------------------------------
Method:  void setIndices(MensEvent me)
Purpose: Set values for GUI
Parameters:
  Input:  MensEvent me - data for GUI
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setIndices_2(me:MensEvent):void
	{
		let signEls:Vector<any> = new Vector<any>();
		for(let mse of me.getSigns())
		signEls.add(mse.toString());
		this.signsList.setListData(signEls);
		this.signsList.setSelectedIndex(0);
		this.setSignElGUI(me);
		let m:Mensuration = me.getMensInfo_1();
		if( m.prolatio == Mensuration.MENS_BINARY)
			this.prolatioBinaryButton.setSelected(true);
		else
			this.prolatioTernaryButton.setSelected(true);

		if( m.tempus == Mensuration.MENS_BINARY)
			this.tempusBinaryButton.setSelected(true);
		else
			this.tempusTernaryButton.setSelected(true);

		if( m.modus_minor == Mensuration.MENS_BINARY)
			this.modus_minorBinaryButton.setSelected(true);
		else
			this.modus_minorTernaryButton.setSelected(true);

		if( m.modus_maior == Mensuration.MENS_BINARY)
			this.modus_maiorBinaryButton.setSelected(true);
		else
			this.modus_maiorTernaryButton.setSelected(true);

	}

	/*------------------------------------------------------------------------
Method:  void setSignElGUI(MensEvent me)
Purpose: Set GUI values for currently selected mensuration sign element
Parameters:
  Input:  MensEvent me - data for GUI
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setSignElGUI(me:MensEvent):void
	{
		let mse:MensSignElement = me.getSigns().get(this.signsList.getSelectedIndex());
		this.mensDotBox.setSelected(mse.dotted);
		this.mensStrokeBox.setSelected(mse.stroke);
		this.mensReverseBox.setSelected(mse.signType == MensSignElement.MENS_SIGN_CREV);
		this.mensNoScoreSigBox.setSelected(me.noScoreSig());
		if( mse.signType == MensSignElement.MENS_SIGN_C || mse.signType == MensSignElement.MENS_SIGN_O || mse.signType == MensSignElement.MENS_SIGN_CREV)
			{
				this.mensDotBox.setEnabled(true);
				this.mensStrokeBox.setEnabled(true);
			}

		else
			{
				this.mensDotBox.setEnabled(false);
				this.mensStrokeBox.setEnabled(false);
			}

		this.mensReverseBox.setEnabled(mse.signType == MensSignElement.MENS_SIGN_C || mse.signType == MensSignElement.MENS_SIGN_CREV);
		this.num1Spinner.setEnabled(mse.signType == MensSignElement.NUMBERS);
	}

	/*------------------------------------------------------------------------
Method:  Mensuration createMensuration()
Purpose: Generate Mensuration structure with values from radio buttons
Parameters:
  Input:  -
  Output: -
  Return: new mensuration structure
------------------------------------------------------------------------*/
	public createMensuration():Mensuration
	{
		return Mensuration.new0(this.prolatioTernaryButton.isSelected() ? Mensuration.MENS_TERNARY:Mensuration.MENS_BINARY,this.tempusTernaryButton.isSelected() ? Mensuration.MENS_TERNARY:Mensuration.MENS_BINARY,this.modus_minorTernaryButton.isSelected() ? Mensuration.MENS_TERNARY:Mensuration.MENS_BINARY,this.modus_maiorTernaryButton.isSelected() ? Mensuration.MENS_TERNARY:Mensuration.MENS_BINARY);
	}

	/*------------------------------------------------------------------------
Method:  int getSelectedElementNum()
Purpose: Returns index of element currently selected in GUI
Parameters:
  Input:  -
  Output: -
  Return: index of currently selected element
------------------------------------------------------------------------*/
	public getSelectedElementNum():number
	{
		return this.signsList.getSelectedIndex();
	}

	/*------------------------------------------------------------------------
Method:  boolean isMensurationButton(Object o)
Purpose: Checks whether an object is one of the buttons in the mensuration
         chooser (for checking action sources)
Parameters:
  Input:  Object o - object to compare
  Output: -
  Return: whether o is one of the buttons in this panel
------------------------------------------------------------------------*/
	public isMensurationButton(o:any):boolean
	{
		return o == this.prolatioBinaryButton || o == this.prolatioTernaryButton || o == this.tempusBinaryButton || o == this.tempusTernaryButton || o == this.modus_minorBinaryButton || o == this.modus_minorTernaryButton || o == this.modus_maiorBinaryButton || o == this.modus_maiorTernaryButton;
	}
}
