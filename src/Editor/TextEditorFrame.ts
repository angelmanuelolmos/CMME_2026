
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
import { Event } from '../java/awt/Event';
import { KeyEvent } from '../java/awt/event/KeyEvent';
import { ActionEvent } from '../java/awt/event/ActionEvent';
import { ActionListener } from '../java/awt/event/ActionListener';
import { JPanel } from '../javax/swing/JPanel';
import { Box } from '../javax/swing/Box';
import { JDialog } from '../javax/swing/JDialog';
import { BorderFactory } from '../javax/swing/BorderFactory';
import { BoxLayout } from '../javax/swing/BoxLayout';
import { JButton } from '../javax/swing/JButton';
import { KeyStroke } from '../javax/swing/KeyStroke';
import { JTabbedPane } from '../javax/swing/JTabbedPane';
import { AbstractAction } from '../javax/swing/AbstractAction';
import { JComboBox } from '../javax/swing/JComboBox';
import { JTextPane } from '../javax/swing/JTextPane';
import { JScrollPane } from '../javax/swing/JScrollPane';
import { JLabel } from '../javax/swing/JLabel';
import { DefaultEditorKit } from '../javax/swing/text/DefaultEditorKit';

export class TextEditorFrame extends JDialog implements ActionListener
{
	mytype_ActionListener:boolean = true;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	owner:EditorWin;
	origScrapTextArea:JTextPane;
	modScrapTextArea:JTextPane;
	setSyllButton:JButton;
	removeSyllButton:JButton;
	noteLeftButton:JButton;
	noteRightButton:JButton;
	insertPhraseButton:JButton;
	loadOrigTextComboBox:JComboBox<string>;
	loadModTextComboBox:JComboBox<string>;
	loadOrigTextButton:JButton;
	loadModTextButton:JButton;

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  int get[Syllable|Phrase][Begin|End](String text,int curPos)
Purpose: Get index of current syllable/phrase beginning or end in a string
         (delimited in original texting by @, in modern texting by space or -)
Parameters:
  Input:  String text - text to check
          int curPos  - index within string to check
  Output: -
  Return: index of beginning or end
------------------------------------------------------------------------*/
	static isOriginalTextChar(c:string):boolean
	{
		if( c == "@" || c == "\n")
			return false;

		return true;
	}

	static getPhraseBegin(text:string,curPos:number):number
	{
		for(
		;curPos > 0 && TextEditorFrame.isOriginalTextChar(text.charAt((( curPos - 1) | 0)));curPos --)
		;
		return curPos;
	}

	static getPhraseEnd(text:string,curPos:number):number
	{
		for(
		;curPos < text.length && TextEditorFrame.isOriginalTextChar(text.charAt(curPos));curPos ++)
		;
		return curPos;
	}

	static isModernTextChar(c:string):boolean
	{
		if( c == " " || c == "-" || c == "\n")
			return false;

		return true;
	}

	static getSyllableBegin(text:string,curPos:number):number
	{
		for(
		;curPos > 0 && TextEditorFrame.isModernTextChar(text.charAt((( curPos - 1) | 0)));curPos --)
		;
		return curPos;
	}

	static getSyllableEnd(text:string,curPos:number):number
	{
		for(
		;curPos < text.length && TextEditorFrame.isModernTextChar(text.charAt(curPos));curPos ++)
		;
		return curPos;
	}
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: TextEditorFrame(EditorWin owner)
Purpose:     Init GUI
Parameters:
  Input:  EditorWin owner - parent frame
  Output: -
------------------------------------------------------------------------*/
	public constructor(owner:EditorWin)
	{
		super(owner,"Text",false);
		this.owner = owner;
		let tecp:Container = this.getContentPane();
		tecp.setLayout(new BoxLayout(tecp,BoxLayout.Y_AXIS));
		let textingChoiceTabs:JTabbedPane = new JTabbedPane();
		let originalTextingPanel:JPanel;
		let modernTextingPanel:JPanel;
		originalTextingPanel = new JPanel();
		originalTextingPanel.setLayout(new BoxLayout(originalTextingPanel,BoxLayout.Y_AXIS));
		let scrapTextPanel:JPanel = new JPanel();
		scrapTextPanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Scrap text area"),BorderFactory.createEmptyBorder(5,5,5,5)));
		this.origScrapTextArea = new JTextPane();
		this.origScrapTextArea.getDocument().putProperty(DefaultEditorKit.EndOfLineStringProperty,"\n");
		let origScrapTextScrollPane:JScrollPane = new JScrollPane(this.origScrapTextArea);
		origScrapTextScrollPane.setPreferredSize(new Dimension(400,250));
		origScrapTextScrollPane.setMinimumSize(new Dimension(10,10));
		scrapTextPanel.add(origScrapTextScrollPane);
		this.loadOrigTextButton = new JButton("Load scrap text from voice:");
		this.loadOrigTextComboBox = new JComboBox<string>();
		owner.loadVoiceNamesInComboBox(this.loadOrigTextComboBox);
		let topButtonPane:Box = Box.createHorizontalBox();
		topButtonPane.add(this.loadOrigTextButton);
		topButtonPane.add(Box.createHorizontalStrut(10));
		topButtonPane.add(this.loadOrigTextComboBox);
		topButtonPane.add(Box.createHorizontalGlue());
		topButtonPane.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
		this.insertPhraseButton = new JButton("Insert phrase");
		let bottomButtonPane:Box = Box.createHorizontalBox();
		bottomButtonPane.add(Box.createHorizontalGlue());
		bottomButtonPane.add(this.insertPhraseButton);
		bottomButtonPane.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
		originalTextingPanel.add(topButtonPane);
		originalTextingPanel.add(scrapTextPanel);
		originalTextingPanel.add(bottomButtonPane);
		modernTextingPanel = new JPanel();
		modernTextingPanel.setLayout(new BoxLayout(modernTextingPanel,BoxLayout.Y_AXIS));
		this.loadModTextButton = new JButton("Load scrap text from voice:");
		this.loadModTextComboBox = new JComboBox<string>();
		owner.loadVoiceNamesInComboBox(this.loadModTextComboBox);
		topButtonPane = Box.createHorizontalBox();
		topButtonPane.add(this.loadModTextButton);
		topButtonPane.add(Box.createHorizontalStrut(10));
		topButtonPane.add(this.loadModTextComboBox);
		topButtonPane.add(Box.createHorizontalGlue());
		topButtonPane.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
		scrapTextPanel = new JPanel();
		scrapTextPanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Scrap text area"),BorderFactory.createEmptyBorder(5,5,5,5)));
		this.modScrapTextArea = new JTextPane();
		this.modScrapTextArea.getDocument().putProperty(DefaultEditorKit.EndOfLineStringProperty,"\n");
		let scrapTextScrollPane:JScrollPane = new JScrollPane(this.modScrapTextArea);
		scrapTextScrollPane.setPreferredSize(new Dimension(400,250));
		scrapTextScrollPane.setMinimumSize(new Dimension(10,10));
		scrapTextPanel.add(scrapTextScrollPane);
		this.removeSyllButton = new JButton("Remove Syllable");
		this.setSyllButton = new JButton("Set Syllable");
		this.noteLeftButton = new JButton("<");
		this.noteRightButton = new JButton(">");
		bottomButtonPane = Box.createHorizontalBox();
		bottomButtonPane.add(this.noteLeftButton);
		bottomButtonPane.add(Box.createHorizontalStrut(10));
		bottomButtonPane.add(new JLabel("Note"));
		bottomButtonPane.add(Box.createHorizontalStrut(10));
		bottomButtonPane.add(this.noteRightButton);
		bottomButtonPane.add(Box.createHorizontalGlue());
		bottomButtonPane.add(this.removeSyllButton);
		bottomButtonPane.add(Box.createHorizontalStrut(10));
		bottomButtonPane.add(this.setSyllButton);
		bottomButtonPane.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
		this.modScrapTextArea.getInputMap().put(KeyStroke.getKeyStroke(KeyEvent.VK_ENTER,Event.CTRL_MASK),"SetSyllable");
		this.modScrapTextArea.getInputMap().put(KeyStroke.getKeyStroke(KeyEvent.VK_RIGHT,Event.CTRL_MASK),"NoteRight");
		this.modScrapTextArea.getInputMap().put(KeyStroke.getKeyStroke(KeyEvent.VK_KP_RIGHT,Event.CTRL_MASK),"NoteRight");
		this.modScrapTextArea.getInputMap().put(KeyStroke.getKeyStroke(KeyEvent.VK_LEFT,Event.CTRL_MASK),"NoteLeft");
		this.modScrapTextArea.getInputMap().put(KeyStroke.getKeyStroke(KeyEvent.VK_KP_LEFT,Event.CTRL_MASK),"NoteLeft");
		this.modScrapTextArea.getActionMap().put("SetSyllable",
		{

			/* original/modern texting choice */
			/* original texting panel */
			/* modern texting panel */
			/* action buttons */
			actionPerformed:(e:ActionEvent):void =>
			{
				this.setSyllButton.doClick();
			}
		}
		);
		this.modScrapTextArea.getActionMap().put("NoteRight",
		{

			actionPerformed:(e:ActionEvent):void =>
			{
				this.noteRightButton.doClick();
			}
		}
		);
		this.modScrapTextArea.getActionMap().put("NoteLeft",
		{

			actionPerformed:(e:ActionEvent):void =>
			{
				this.noteLeftButton.doClick();
			}
		}
		);
		modernTextingPanel.add(topButtonPane);
		modernTextingPanel.add(scrapTextPanel);
		modernTextingPanel.add(bottomButtonPane);
		textingChoiceTabs.addTab("Original texting",originalTextingPanel);
		textingChoiceTabs.addTab("Modern texting",modernTextingPanel);
		tecp.add(textingChoiceTabs);
		this.disableSetSyllable();
		this.disableRemoveSyllable();
		this.registerListeners_4();
		this.pack();
	}

	//    tecp.add(voiceTextAreasPanel);
	//    disableTextEditorInsertPhrase();
	/*------------------------------------------------------------------------
Method:  void [un]registerListeners()
Purpose: Add and remove event listeners
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public registerListeners_4():void
	{
		this.insertPhraseButton.addActionListener(this);
		this.removeSyllButton.addActionListener(this);
		this.setSyllButton.addActionListener(this);
		this.noteLeftButton.addActionListener(this);
		this.noteRightButton.addActionListener(this);
		this.loadOrigTextButton.addActionListener(this);
		this.loadModTextButton.addActionListener(this);
	}

	public unregisterListeners_7():void
	{
		this.insertPhraseButton.removeActionListener(this);
		this.removeSyllButton.removeActionListener(this);
		this.setSyllButton.removeActionListener(this);
		this.noteLeftButton.removeActionListener(this);
		this.noteRightButton.removeActionListener(this);
		this.loadOrigTextButton.removeActionListener(this);
		this.loadModTextButton.removeActionListener(this);
	}

	/*------------------------------------------------------------------------
Method:     void actionPerformed(ActionEvent event)
Implements: ActionListener.actionPerformed
Purpose:    Check for action types in tools and take appropriate action
Parameters:
  Input:  ActionEvent event - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public actionPerformed(event:ActionEvent):void
	{
		let item:any = event.getSource();
		if( item == this.insertPhraseButton)
			this.insertOriginalTextPhrase();
		else
			if( item == this.setSyllButton)
				this.applyTextSyllableToNote();
			else
				if( item == this.removeSyllButton)
					this.removeTextSyllableFromNote();
				else
					if( item == this.noteLeftButton)
						this.owner.highlightPreviousNote();
					else
						if( item == this.noteRightButton)
							this.owner.highlightNextNote();
						else
							if( item == this.loadOrigTextButton)
								this.loadOriginalText(this.owner.voiceOrigTextToStr(this.loadOrigTextComboBox.getSelectedIndex()));
							else
								if( item == this.loadModTextButton)
									this.loadModernText(this.owner.voiceModTextToStr(this.loadModTextComboBox.getSelectedIndex()));

	}

	/*------------------------------------------------------------------------
Method:  void [enable|disable]*()
Purpose: Enable or disable capability to use individual buttons
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public enableInsertPhrase():void
	{
		this.insertPhraseButton.setEnabled(true);
	}

	public disableInsertPhrase():void
	{
		this.insertPhraseButton.setEnabled(false);
	}

	public enableSetSyllable():void
	{
		this.setSyllButton.setEnabled(true);
	}

	public disableSetSyllable():void
	{
		this.setSyllButton.setEnabled(false);
	}

	public enableRemoveSyllable():void
	{
		this.removeSyllButton.setEnabled(true);
	}

	public disableRemoveSyllable():void
	{
		this.removeSyllButton.setEnabled(false);
	}

	/*------------------------------------------------------------------------
Method:  void insertOriginalTextPhrase()
Purpose: Get current phrase from original scrap text area and insert as
         new OriginalText event
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	insertOriginalTextPhrase():void
	{
		let text:string = this.origScrapTextArea.getText();
		let curPos:number = this.origScrapTextArea.getCaretPosition();
		let phraseBegin:number = TextEditorFrame.getPhraseBegin(text,curPos);
		let phraseEnd:number = TextEditorFrame.getPhraseEnd(text,curPos);
		if( phraseEnd <= phraseBegin)
			return;

		this.owner.addOriginalText_3(text.substring(phraseBegin,phraseEnd));
		for(
		curPos =(( phraseEnd + 1) | 0);curPos < text.length && ! TextEditorFrame.isOriginalTextChar(text.charAt(curPos));curPos ++)
		;
		if( curPos >= text.length)
			this.origScrapTextArea.setCaretPosition(text.length);
		else
			{
				this.origScrapTextArea.setSelectionStart(TextEditorFrame.getPhraseBegin(text,curPos));
				this.origScrapTextArea.setSelectionEnd(TextEditorFrame.getPhraseEnd(text,curPos));
			}

		this.origScrapTextArea.requestFocusInWindow();
	}

	/* highlight next phrase */
	/*------------------------------------------------------------------------
Method:  void load[Original|Modern]Text(String insertText)
Purpose: Insert text into scrap text area at current caret position
Parameters:
  Input:  String insertText - text to insert
  Output: -
  Return: -
------------------------------------------------------------------------*/
	loadOriginalText(insertText:string):void
	{
		this.loadTextIntoArea(insertText,this.origScrapTextArea);
	}

	loadModernText(insertText:string):void
	{
		this.loadTextIntoArea(insertText,this.modScrapTextArea);
	}

	loadTextIntoArea(insertText:string,textArea:JTextPane):void
	{
		let origText:string = textArea.getText();
		let curPos:number = textArea.getCaretPosition();
		let si1:number = curPos > 0 ?(( curPos - 1) | 0):0;
		let newText:string = origText.substring(0,si1) + insertText + origText.substring(curPos);
		textArea.setText(newText);
		textArea.setCaretPosition(curPos);
		textArea.requestFocusInWindow();
	}

	/*------------------------------------------------------------------------
Method:  void applyTextSyllableToNote()
Purpose: Get current syllable from modern scrap text area and apply to highlighted
         note
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	applyTextSyllableToNote():void
	{
		let text:string = this.modScrapTextArea.getText();
		let curPos:number = this.modScrapTextArea.getCaretPosition();
		let syllBegin:number = TextEditorFrame.getSyllableBegin(text,curPos);
		let syllEnd:number = TextEditorFrame.getSyllableEnd(text,curPos);
		if( syllEnd <= syllBegin)
			return;

		let wordEnd:boolean = syllEnd >= text.length || text.charAt(syllEnd) != "-";
		this.owner.setNoteSyllable_2(text.substring(syllBegin,syllEnd),wordEnd);
		for(
		curPos =(( syllEnd + 1) | 0);curPos < text.length && ! TextEditorFrame.isModernTextChar(text.charAt(curPos));curPos ++)
		;
		if( curPos >= text.length)
			this.modScrapTextArea.setCaretPosition(text.length);
		else
			{
				this.modScrapTextArea.setSelectionStart(TextEditorFrame.getSyllableBegin(text,curPos));
				this.modScrapTextArea.setSelectionEnd(TextEditorFrame.getSyllableEnd(text,curPos));
			}

		this.modScrapTextArea.requestFocusInWindow();
	}

	/* highlight next syllable */
	/*------------------------------------------------------------------------
Method:  void removeTextSyllableFromNote()
Purpose: Delete syllable on highlighted note
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	removeTextSyllableFromNote():void
	{
		this.owner.setNoteSyllable_2(null,false);
		this.modScrapTextArea.requestFocusInWindow();
	}
}
