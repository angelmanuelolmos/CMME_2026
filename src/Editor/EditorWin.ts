
import { Exception } from '../java/lang/Exception';
import { System } from '../java/lang/System';
import { Integer } from '../java/lang/Integer';
import { VersionPanel } from './VariantVersionInfoFrame';
import { VariantVersionInfoFrame } from './VariantVersionInfoFrame';
import { TextEditorFrame } from './TextEditorFrame';
import { TextDeleteDialog } from './TextDeleteDialog';
import { SectionAttribsFrame } from './SectionAttribsFrame';
import { EditorCursor } from './ScoreEditorCanvas';
import { ScoreEditorCanvas } from './ScoreEditorCanvas';
import { OriginalTextDeleteDialog } from './OriginalTextDeleteDialog';
import { NoteInfoPanel } from './NoteInfoPanel';
import { ModernTextDeleteDialog } from './ModernTextDeleteDialog';
import { ModernKeySigPanel } from './ModernKeySigPanel';
import { MensurationChooser } from './MensurationChooser';
import { GeneralInfoFrame } from './GeneralInfoFrame';
import { EditingOptionsFrame } from './EditingOptionsFrame';
import { ColorationChooser } from './ColorationChooser';
/*----------------------------------------------------------------------*/
/*

        Module          : EditorWin.java

        Package         : Editor

        Classes Included: EditorWin

        Purpose         : Lays out main music editor window and functions

        Programmer      : Ted Dumitrescu

        Date Started    : 5/4/05

Updates:
6/13/05:  started adding file functions (Open, Save, New)
12/21/05: improved file functions (prompt to overwrite, save on exit, etc)
1/13/06:  added basic import functionality for MIDI files
2/14/06:  began text editor
3/6/06:   consolidated separate event-editing tools (proportion, coloration,
          text annotations, etc.) into a single event editor window
3/10/06:  started Mensuration chooser GUI
3/20/06:  added Rest buttons to main toolbar
4/3/06:   no longer auto-creates PartsWin when opening window (for memory/speed)
4/5/06:   added NoteInfoPanel
5/4/06:   moved static file-browsing/opening functions to Gfx.MusicWin
7/26/06:  added ModernKeySigPanel
9/11/06:  added original texting functions to text editor; temporarily disabled
          individual voice text areas (until actual functionality is implemented)
11/26/08: allowed event editor to be hidden
          added Text menu
6/29/08:  added taskbar icons for dots+mensuration
9/8/09:   GeneralInfoFrame moved to separate class
5/7/10:   Improved error-handling/idiot-proofing in file save (as) functions

                                                                        */
/*----------------------------------------------------------------------*/
/*----------------------------------------------------------------------*/
/* Imported packages */
//import java.io.*;
import { URL } from '../java/net/URL';
import { ArrayList } from '../java/util/ArrayList';
import { LinkedList } from '../java/util/LinkedList';
import { File } from '../java/io/File';
import { FileOutputStream } from '../java/io/FileOutputStream';
import { ImageIO } from '../javax/imageio/ImageIO';
import { BorderFactory } from '../javax/swing/BorderFactory';
import { Box } from '../javax/swing/Box';
import { BoxLayout } from '../javax/swing/BoxLayout';
import { ButtonGroup } from '../javax/swing/ButtonGroup';
import { ImageIcon } from '../javax/swing/ImageIcon';
import { JButton } from '../javax/swing/JButton';
import { JCheckBox } from '../javax/swing/JCheckBox';
import { JCheckBoxMenuItem } from '../javax/swing/JCheckBoxMenuItem';
import { JComboBox } from '../javax/swing/JComboBox';
import { JDialog } from '../javax/swing/JDialog';
import { JLabel } from '../javax/swing/JLabel';
import { JMenu } from '../javax/swing/JMenu';
import { JMenuItem } from '../javax/swing/JMenuItem';
import { JOptionPane } from '../javax/swing/JOptionPane';
import { JPanel } from '../javax/swing/JPanel';
import { JRadioButton } from '../javax/swing/JRadioButton';
import { JSpinner } from '../javax/swing/JSpinner';
import { JTextField } from '../javax/swing/JTextField';
import { JToolBar } from '../javax/swing/JToolBar';
import { KeyStroke } from '../javax/swing/KeyStroke';
import { SpinnerNumberModel } from '../javax/swing/SpinnerNumberModel';
import { SwingConstants } from '../javax/swing/SwingConstants';
//import javax.swing.*;
import { WindowConstants } from '../javax/swing/WindowConstants';
import { ChangeEvent } from '../javax/swing/event/ChangeEvent';
import { DocumentListener } from '../javax/swing/event/DocumentListener';
import { DocumentEvent } from '../javax/swing/event/DocumentEvent';
import { ChangeListener } from '../javax/swing/event/ChangeListener';
import { Component } from '../java/awt/Component';
import { Container } from '../java/awt/Container';
import { BorderLayout } from '../java/awt/BorderLayout';
import { Graphics2D } from '../java/awt/Graphics2D';
import { GridLayout } from '../java/awt/GridLayout';
import { GridBagLayout } from '../java/awt/GridBagLayout';
import { GridBagConstraints } from '../java/awt/GridBagConstraints';
import { Dimension } from '../java/awt/Dimension';
import { Insets } from '../java/awt/Insets';
import { Toolkit } from '../java/awt/Toolkit';
import { BufferedImage } from '../java/awt/image/BufferedImage';
import { WindowAdapter } from '../java/awt/event/WindowAdapter';
import { WindowListener } from '../java/awt/event/WindowListener';
import { WindowEvent } from '../java/awt/event/WindowEvent';
import { KeyEvent } from '../java/awt/event/KeyEvent';
import { ItemListener } from '../java/awt/event/ItemListener';
import { WindowFocusListener } from '../java/awt/event/WindowFocusListener';
import { ActionEvent } from '../java/awt/event/ActionEvent';
import { ActionListener } from '../java/awt/event/ActionListener';
import { ItemEvent } from '../java/awt/event/ItemEvent';
import { CriticalNotesWindow } from '../Gfx/CriticalNotesWindow';
import { MusicFont } from '../Gfx/MusicFont';
import { MusicWin } from '../Gfx/MusicWin';
import { OptionSet } from '../Gfx/OptionSet';
import { PartsWin } from '../Gfx/PartsWin';
import { PDFCreator } from '../Gfx/PDFCreator';
import { RenderedEvent } from '../Gfx/RenderedEvent';
import { ViewCanvas } from '../Gfx/ViewCanvas';
import { AnnotationTextEvent } from '../DataStruct/AnnotationTextEvent';
import { Clef } from '../DataStruct/Clef';
import { CMMEParser } from '../DataStruct/CMMEParser';
import { Coloration } from '../DataStruct/Coloration';
import { ColorChangeEvent } from '../DataStruct/ColorChangeEvent';
import { DotEvent } from '../DataStruct/DotEvent';
import { Event } from '../DataStruct/Event';
import { MensEvent } from '../DataStruct/MensEvent';
import { MensSignElement } from '../DataStruct/MensSignElement';
import { ModernKeySignature } from '../DataStruct/ModernKeySignature';
import { ModernKeySignatureEvent } from '../DataStruct/ModernKeySignatureEvent';
import { MultiEvent } from '../DataStruct/MultiEvent';
import { MusicMensuralSection } from '../DataStruct/MusicMensuralSection';
import { MusicSection } from '../DataStruct/MusicSection';
import { NoteEvent } from '../DataStruct/NoteEvent';
import { PieceData } from '../DataStruct/PieceData';
import { Proportion } from '../DataStruct/Proportion';
import { ProportionEvent } from '../DataStruct/ProportionEvent';
import { VariantVersionData } from '../DataStruct/VariantVersionData';
import { Voice } from '../DataStruct/Voice';
import { VoiceMensuralData } from '../DataStruct/VoiceMensuralData';

export class EditorWin extends MusicWin implements ActionListener,ChangeListener,DocumentListener,ItemListener,WindowFocusListener
{
	mytype_WindowFocusListener:boolean = true;
	mytype_ItemListener:boolean = true;
	mytype_DocumentListener:boolean = true;
	mytype_ChangeListener:boolean = true;
	mytype_ActionListener:boolean = true;
	/*----------------------------------------------------------------------*/
	/* Class variables */
	/* GUI images */
	/* notes */
	static NVIcons_light:ImageIcon[];
	static NVIcons_dark:ImageIcon[];
	static OtherSM_light:ImageIcon;
	static OtherSM_dark:ImageIcon;
	static NVButtonVals:number[]=[NoteEvent.NT_Maxima,NoteEvent.NT_Longa,NoteEvent.NT_Brevis,NoteEvent.NT_Semibrevis,NoteEvent.NT_Minima,NoteEvent.NT_Semiminima,NoteEvent.NT_Fusa,NoteEvent.NT_Semifusa];
	static NVB_SEMIMINIMA:number = 5;
	/* rests */
	static RVIcons_light:ImageIcon[];
	static RVIcons_dark:ImageIcon[];
	/* clefs */
	static ClefIcons:ImageIcon[];
	static AlternateClefIcons:ImageIcon[];
	static ClefButtonVals:number[]=[Clef.CLEF_C,Clef.CLEF_F,Clef.CLEF_G,Clef.CLEF_Bmol,Clef.CLEF_Bqua,Clef.CLEF_Diesis];
	static AlternateClefButtonVals:number[]=[Clef.CLEF_NONE,Clef.CLEF_Frnd,Clef.CLEF_NONE,Clef.CLEF_BmolDouble,Clef.CLEF_NONE,Clef.CLEF_NONE];
	/* misc buttons */
	static MISC_BUTTON_DOT:number = 0;
	static MISC_BUTTON_DOTDIV:number = 1;
	static MiscIcons:ImageIcon[];
	static MiscButtonVals:string[]=["Dot","DotDiv"];
	static MiscButtonNames:string[]=["Dot of Addition","Dot of Division/Perfection/etc"];
	/* mensuration buttons */
	static MENS_BUTTON_O:number = 0;
	static MENS_BUTTON_C:number = 1;
	static MENS_BUTTON_DOT:number = 2;
	static MENS_BUTTON_STROKE:number = 3;
	static MENS_BUTTON_3:number = 4;
	static MENS_BUTTON_2:number = 5;
	static MensIcons_light:ImageIcon[];
	static MensIcons_dark:ImageIcon[];
	static MensButtonVals:string[]=["O","C","Dot","Stroke","3","2"];
	static MensButtonNames:string[]=["O","C","Toggle dot","Toggle stroke","Add 3","Add 2"];
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	EditScr:ScoreEditorCanvas;
	windowFilePath:string = null;
	modified:boolean = false;
	generalInfoFrame:GeneralInfoFrame;
	textEditorFrame:TextEditorFrame;

	/*----------------------------------------------------------------------*/
	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  void initScoreWindowing(String bdu,String initDir,boolean inApplet)
Purpose: Initialize global objects shared by music windows
Parameters:
  Input:  String bdu       - URL of program data directories
          String initDir   - initial directory for file chooser
          boolean inApplet - running within applet context?
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public static initScoreWindowing_1(bdu:string,initDir:string,inApplet:boolean):void
	{
		MusicWin.initScoreWindowing_1(bdu,initDir,inApplet);
		EditorWin.initEditorIcons();
	}

	/*------------------------------------------------------------------------
Method:  void initEditorIcons()
Purpose: Initialize tool icons for editor GUI
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static initEditorIcons():void
	{
		try
		{
			let i:number;
			let curCanvas:BufferedImage;
			let curFileImg:BufferedImage;
			let curG:Graphics2D;
			let lightBG:BufferedImage = ImageIO.read(new URL(EditorWin.BaseDataURL + "imgs/buttonbg-light.gif"));
			let darkBG:BufferedImage = ImageIO.read(new URL(EditorWin.BaseDataURL + "imgs/buttonbg-dark.gif"));
			let iconWidth:number = lightBG.getWidth();
			let iconHeight:number = lightBG.getHeight();
			EditorWin.NVIcons_light = Array(EditorWin.NVButtonVals.length);
			EditorWin.NVIcons_dark = Array(EditorWin.NVButtonVals.length);
			for(
			i = 0;i < EditorWin.NVButtonVals.length;i ++)
			{
				EditorWin.NVIcons_light[i]= new ImageIcon(new URL(EditorWin.BaseDataURL + "imgs/noteval-button" +((( i + 1) | 0)) + "a.gif"));
				EditorWin.NVIcons_dark[i]= new ImageIcon(new URL(EditorWin.BaseDataURL + "imgs/noteval-button" +((( i + 1) | 0)) + "a-dark.gif"));
			}
			EditorWin.OtherSM_light = new ImageIcon(new URL(EditorWin.BaseDataURL + "imgs/noteval-button" +((( EditorWin.NVB_SEMIMINIMA + 1) | 0)) + "b.gif"));
			EditorWin.OtherSM_dark = new ImageIcon(new URL(EditorWin.BaseDataURL + "imgs/noteval-button" +((( EditorWin.NVB_SEMIMINIMA + 1) | 0)) + "b-dark.gif"));
			EditorWin.RVIcons_light = Array(EditorWin.NVButtonVals.length);
			for(
			i = 0;i < EditorWin.NVButtonVals.length;i ++)
			EditorWin.RVIcons_light[i]= new ImageIcon(new URL(EditorWin.BaseDataURL + "imgs/restval-button" +((( i + 1) | 0)) + "a.gif"));
			EditorWin.ClefIcons = Array(EditorWin.ClefButtonVals.length);
			for(
			i = 0;i < EditorWin.ClefButtonVals.length;i ++)
			{
				curCanvas = new BufferedImage(iconWidth,iconHeight,BufferedImage.TYPE_INT_ARGB);
				curFileImg = ImageIO.read(new URL(EditorWin.BaseDataURL + "imgs/clef-button" + Clef.ClefNames[EditorWin.ClefButtonVals[i]]+ "1a.gif"));
				curG = curCanvas.createGraphics();
				curG.drawImage(lightBG,0,0,null);
				curG.drawImage(curFileImg,0,0,null);
				EditorWin.ClefIcons[i]= new ImageIcon(curCanvas);
			}
			EditorWin.MiscIcons = Array(EditorWin.MiscButtonVals.length);
			for(
			i = 0;i < EditorWin.MiscButtonVals.length;i ++)
			{
				curCanvas = new BufferedImage(iconWidth,iconHeight,BufferedImage.TYPE_INT_ARGB);
				curFileImg = ImageIO.read(new URL(EditorWin.BaseDataURL + "imgs/misc-button" + EditorWin.MiscButtonVals[i]+ ".gif"));
				curG = curCanvas.createGraphics();
				curG.drawImage(lightBG,0,0,null);
				curG.drawImage(curFileImg,0,0,null);
				EditorWin.MiscIcons[i]= new ImageIcon(curCanvas);
			}
			EditorWin.MensIcons_light = Array(EditorWin.MensButtonVals.length);
			EditorWin.MensIcons_dark = Array(EditorWin.MensButtonVals.length);
			for(
			i = 0;i < EditorWin.MensButtonVals.length;i ++)
			{
				curCanvas = new BufferedImage(iconWidth,iconHeight,BufferedImage.TYPE_INT_ARGB);
				curFileImg = ImageIO.read(new URL(EditorWin.BaseDataURL + "imgs/mens-button" + EditorWin.MensButtonVals[i]+ ".gif"));
				curG = curCanvas.createGraphics();
				curG.drawImage(lightBG,0,0,null);
				curG.drawImage(curFileImg,0,0,null);
				EditorWin.MensIcons_light[i]= new ImageIcon(curCanvas);
				curCanvas = new BufferedImage(iconWidth,iconHeight,BufferedImage.TYPE_INT_ARGB);
				curG = curCanvas.createGraphics();
				curG.drawImage(darkBG,0,0,null);
				curG.drawImage(curFileImg,0,0,null);
				EditorWin.MensIcons_dark[i]= new ImageIcon(curCanvas);
			}
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					System.err.println("Error loading icons: " + e);
				}

			else
				throw e;

		}
	}

	/* basic image elements */
	/* notes */
	/* rests */
	/* clefs */
	/* misc buttons */
	/* mensuration buttons */
	/*------------------------------------------------------------------------
Method:  void newfile()
Purpose: Open new music window for new blank score
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static newfile():void
	{
		let musicdat:PieceData = PieceData.new0();
		musicdat.setGeneralData("Title",null,"Composer","Editor",null,null);
		let vl:Voice[]= Array(1);
		vl[0]= Voice.new1(musicdat,1,"[1]",false);
		musicdat.setVoiceData(vl);
		musicdat.addVariantVersion(VariantVersionData.new1("Default"));
		let blankSec:MusicMensuralSection = MusicMensuralSection.new3(1);
		let newv:VoiceMensuralData = VoiceMensuralData.new3(vl[0],blankSec);
		newv.addEvent_1(Event.new1(Event.EVENT_SECTIONEND));
		blankSec.setVoice_1(0,newv);
		musicdat.addSection_2(blankSec);
		try
		{
			let xl:number = 10;
			let yl:number = 10;
			if( EditorWin.curWindow != null)
				{
					xl =(( EditorWin.curWindow.getLocation().x + 20) | 0);
					yl =(( EditorWin.curWindow.getLocation().y + 20) | 0);
				}

			EditorWin.new3("Untitled score",musicdat,null,false,xl,yl);
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					System.err.println("Error creating editor window: " + e);
					e.printStackTrace();
				}

			else
				throw e;

		}
	}

	/* create window in separate thread */
	//final SwingWorker ofthread=new SwingWorker()
	// {
	// public Object construct()
	// {
	/* real code */
	/* construct blank piece data */
	//    blankSec.setVersion(musicdat.getVariantVersions().get(0));
	/* open music window */
	// return null; /* not used */
	// }; /* end SwingWorker */
	//  ofthread.start();
	// }
	/*------------------------------------------------------------------------
Method:  void exitprogram()
Purpose: Attempt to close all windows and exit program
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static exitprogram():void
	{
		EditorWin.exitingProgram = true;
		while( EditorWin.fileWindows.size() > 0)
		{
			let mw:MusicWin = EditorWin.fileWindows.getFirst();
			if( ! mw.closewin_1())
				{
					EditorWin.exitingProgram = false;
					return;
				}

		}
		System.exit(0);
	}

	public static new3(fn:string,p:PieceData,fp:string,convertedData:boolean,xl:number,yl:number):EditorWin
	{
		let _new3:EditorWin = new EditorWin;
		EditorWin.set3(_new3,fn,p,fp,convertedData,xl,yl);
		return _new3;
	}

	public static set3(new3:EditorWin,fn:string,p:PieceData,fp:string,convertedData:boolean,xl:number,yl:number):void
	{
		MusicWin.set0_6(new3,fn,p,xl,yl);
		new3.windowFilePath = fp;
		new3.EditScr =<ScoreEditorCanvas> new3.ViewScr;
		new3.createInsertSectionDialog();
		new3.setSectionNum_2(new3.EditScr.getCurSectionNum());
		if( convertedData)
			new3.fileModified_2();

	}

	public static new4(fn:string,p:PieceData,fp:string):EditorWin
	{
		let _new4:EditorWin = new EditorWin;
		EditorWin.set4(_new4,fn,p,fp);
		return _new4;
	}

	public static set4(new4:EditorWin,fn:string,p:PieceData,fp:string):void
	{
		EditorWin.set3(new4,fn,p,fp,false,10,10);
	}

	public static new5():EditorWin
	{
		let _new5:EditorWin = new EditorWin;
		EditorWin.set5(_new5);
		return _new5;
	}

	public static set5(new5:EditorWin):void
	{
	}

	/*------------------------------------------------------------------------
Method:    MusicWin getWinToReplace()
Overrides: Gfx.MusicWin.getWinToReplace
Purpose:   If a new opening score window is to replace another one, return
           window to be replaced
Parameters:
  Input:  -
  Output: -
  Return: window to be replaced
------------------------------------------------------------------------*/
	public getWinToReplace_1():MusicWin
	{
		let blankWin:EditorWin = null;
		if( EditorWin.fileWindows.size() == 1)
			{
				blankWin =<EditorWin>( EditorWin.fileWindows.getFirst());
				if( blankWin.windowFilePath != null || blankWin.modified)
					blankWin = null;

			}

		return blankWin;
	}

	/* if nothing has been opened/modified, replace blank score */
	/*------------------------------------------------------------------------
Method:    MusicWin openWin()
Overrides: Gfx.MusicWin.openWin
Purpose:   Open new window after loading music data
Parameters:
  Input:  String fn           - filename
          String path         - canonical path to file
          PieceData musicData - music data from file
          int xl,yl           - coordinates for new window
  Output: -
  Return: new window
------------------------------------------------------------------------*/
	public openWin_1(fn:string,path:string,musicData:PieceData,convertedData:boolean,xl:number,yl:number):MusicWin
	{
		return EditorWin.new3(fn,musicData,path,convertedData,xl,yl);
	}

	/*------------------------------------------------------------------------
Method:    MusicWin openInViewer()
Purpose:   Open new MusicWin with the same music data
Parameters:
  Input:  -
  Output: -
  Return: new window
------------------------------------------------------------------------*/
	public openInViewer():MusicWin
	{
		try
		{
			return MusicWin.new1_6(this.windowFileName,this.musicData);
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					this.handleRuntimeError(e);
					return null;
				}

			else
				throw e;

		}
	}

	/*------------------------------------------------------------------------
Method:    void addCMMETitle(String fn)
Overrides: Gfx.MusicWin.addCMMETitle
Purpose:   Add title to window
Parameters:
  Input:  String fn - name of file in window
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addCMMETitle_1(fn:string):void
	{
		this.setTitle(fn + ": CMME Editor");
	}

	/*------------------------------------------------------------------------
Method:    void initializeOptions()
Overrides: Gfx.MusicWin.initializeOptions
Purpose:   Initialize option set before creating view canvas
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public initializeOptions_1():void
	{
		let newVS:number =( EditorWin.curWindow != null) ? EditorWin.curWindow.optSet.getVIEWSCALE():<number> EditorWin.DefaultViewScale / 100;
		this.optSet.set_usemodernclefs(false);
		this.optSet.set_noteShapeType(OptionSet.OPT_NOTESHAPE_ORIG);
		this.optSet.set_barline_type(OptionSet.OPT_BARLINE_TICK);
		this.optSet.setVIEWSCALE(newVS);
		this.optSet.set_displayedittags(true);
		this.optSet.set_displayOrigText(true);
		this.optSet.set_displayModText(true);
		this.optSet.setUseModernAccidentalSystem(false);
		this.optSet.setMarkVariants(OptionSet.OPT_VAR_ALL);
	}

	/*------------------------------------------------------------------------
Method:    void setSubframeLocations()
Overrides: Gfx.MusicWin.setSubframeLocations
Purpose:   Set locations of frames dependent upon main window (after window
           has been packed)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setSubframeLocations_1():void
	{
		this.setEventEditorLocation();
		this.setEditingOptionsLocation();
		this.setSectionAttribsFrameLocation();
	}

	/*------------------------------------------------------------------------
Method:  PartsWin createInitialPartsWin()
Overrides: Gfx.MusicWin.createInitialPartsWin
Purpose: Initialize unscored parts window when opening window
Parameters:
  Input:  -
  Output: -
  Return: null - EditorWin only creates a PartsWin when necessary
------------------------------------------------------------------------*/
	public createInitialPartsWin_1():PartsWin
	{
		return null;
	}
	/*------------------------------------------------------------------------
Method:  JMenu create*Menu()
Overrides: Gfx.MusicWin.create*Menu
Purpose: Create menus for window
Parameters:
  Input:  -
  Output: -
  Return: menu
------------------------------------------------------------------------*/
	/* File Menu */
	protected FileMenuNew:JMenuItem;
	protected FileMenuOpen:JMenuItem;
	protected FileMenuSave:JMenuItem;
	protected FileMenuSaveAs:JMenuItem;
	protected FileMenuExit:JMenuItem;

	public createFileMenu_1():JMenu
	{
		let FM:JMenu = new JMenu("File");
		this.FileMenuNew = new JMenuItem("New");
		this.FileMenuNew.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_N,ActionEvent.CTRL_MASK));
		this.FileMenuNew.setMnemonic(KeyEvent.VK_N);
		this.FileMenuOpen = new JMenuItem("Open...");
		this.FileMenuOpen.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_O,ActionEvent.CTRL_MASK));
		this.FileMenuOpen.setMnemonic(KeyEvent.VK_O);
		this.FileMenuSave = new JMenuItem("Save");
		this.FileMenuSave.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_S,ActionEvent.CTRL_MASK));
		this.FileMenuSave.setMnemonic(KeyEvent.VK_S);
		this.FileMenuSaveAs = new JMenuItem("Save As...");
		this.FileMenuSaveAs.setMnemonic(KeyEvent.VK_A);
		this.FileMenuSaveAs.setVisible(false);
		this.FileMenuExport = new JMenu("Export");
		this.FileMenuExport.setMnemonic(KeyEvent.VK_E);
		this.FMExportMIDI = new JMenuItem("MIDI");
		this.FMExportXML = new JMenuItem("MusicXML");
		this.FileMenuExport.add(this.FMExportMIDI);
		this.FileMenuExport.add(this.FMExportXML);
		this.FileMenuGeneratePDF = new JMenuItem("Generate PDF...");
		this.FileMenuGeneratePDF.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_P,ActionEvent.CTRL_MASK));
		this.FileMenuGeneratePDF.setMnemonic(KeyEvent.VK_P);
		this.FileMenuGeneratePDF.setEnabled(false);
		this.FileMenuGeneratePDF.setVisible(false);
		this.FileMenuClose = new JMenuItem("Close");
		this.FileMenuClose.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_W,ActionEvent.CTRL_MASK));
		this.FileMenuClose.setMnemonic(KeyEvent.VK_C);
		this.FileMenuClose.setVisible(false);
		this.FileMenuExit = new JMenuItem("Exit");
		this.FileMenuExit.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_Q,ActionEvent.CTRL_MASK));
		this.FileMenuExit.setMnemonic(KeyEvent.VK_X);
		this.FileMenuExit.setVisible(false);
		FM.add(this.FileMenuNew);
		FM.add(this.FileMenuOpen);
		FM.add(this.FileMenuSave);
		FM.add(this.FileMenuSaveAs);
		FM.add(this.FileMenuExport);
		FM.add(this.FileMenuGeneratePDF);
		FM.add(this.FileMenuClose);
		FM.add(this.FileMenuExit);
		this.FileMenuNew.addActionListener(this);
		this.FileMenuOpen.addActionListener(this);
		this.FileMenuSave.addActionListener(this);
		this.FileMenuSaveAs.addActionListener(this);
		this.FMExportMIDI.addActionListener(this);
		this.FMExportXML.addActionListener(this);
		this.FileMenuGeneratePDF.addActionListener(this);
		this.FileMenuClose.addActionListener(this);
		this.FileMenuExit.addActionListener(this);
		return FM;
	}
	/* create menu and items */
	/* handle menu actions */
	/* Edit Menu */
	protected EditMenuCopy:JMenuItem;
	protected EditMenuCut:JMenuItem;
	protected EditMenuPaste:JMenuItem;
	protected EditMenuSelectAll:JMenuItem;
	protected EditMenuDelete:JMenuItem;
	protected EditMenuGeneralInformation:JMenuItem;
	protected EditMenuDisplayEventEditor:JCheckBoxMenuItem;
	protected EditMenuEditingOptions:JCheckBoxMenuItem;
	protected editingOptionsFrame:EditingOptionsFrame;

	public createEditMenu_1():JMenu
	{
		this.editingOptionsFrame = new EditingOptionsFrame(this);
		let EM:JMenu = new JMenu("Edit");
		this.EditMenuCopy = new JMenuItem("Copy");
		this.EditMenuCopy.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_C,ActionEvent.CTRL_MASK));
		this.EditMenuCopy.setMnemonic(KeyEvent.VK_C);
		this.EditMenuCut = new JMenuItem("Cut");
		this.EditMenuCut.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_X,ActionEvent.CTRL_MASK));
		this.EditMenuCut.setMnemonic(KeyEvent.VK_U);
		this.EditMenuPaste = new JMenuItem("Paste");
		this.EditMenuPaste.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_V,ActionEvent.CTRL_MASK));
		this.EditMenuPaste.setMnemonic(KeyEvent.VK_P);
		this.EditMenuPaste.setEnabled(false);
		this.EditMenuSelectAll = new JMenuItem("Select all");
		this.EditMenuSelectAll.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_A,ActionEvent.CTRL_MASK));
		this.EditMenuSelectAll.setMnemonic(KeyEvent.VK_A);
		this.EditMenuDelete = new JMenuItem("Delete");
		this.EditMenuDelete.setMnemonic(KeyEvent.VK_DELETE);
		this.EditMenuGeneralInformation = new JMenuItem("General information...");
		this.EditMenuGeneralInformation.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_G,ActionEvent.CTRL_MASK));
		this.EditMenuGeneralInformation.setMnemonic(KeyEvent.VK_G);
		this.EditMenuDisplayEventEditor = new JCheckBoxMenuItem("Display event editor",false);
		this.EditMenuDisplayEventEditor.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_E,ActionEvent.CTRL_MASK));
		this.EditMenuDisplayEventEditor.setMnemonic(KeyEvent.VK_E);
		this.EditMenuEditingOptions = new JCheckBoxMenuItem("Display input options",false);
		EM.add(this.EditMenuCut);
		EM.add(this.EditMenuCopy);
		EM.add(this.EditMenuPaste);
		EM.add(this.EditMenuSelectAll);
		EM.add(this.EditMenuDelete);
		EM.addSeparator();
		EM.add(this.EditMenuGeneralInformation);
		EM.add(this.EditMenuDisplayEventEditor);
		EM.add(this.EditMenuEditingOptions);
		this.EditMenuCopy.addActionListener(this);
		this.EditMenuCut.addActionListener(this);
		this.EditMenuPaste.addActionListener(this);
		this.EditMenuSelectAll.addActionListener(this);
		this.EditMenuDelete.addActionListener(this);
		this.EditMenuGeneralInformation.addActionListener(this);
		this.EditMenuDisplayEventEditor.addItemListener(this);
		this.EditMenuEditingOptions.addItemListener(this);
		return EM;
	}
	/* editing options */
	/* Sections Menu */
	protected SectionsMenuInsertSection:JMenuItem;
	protected SectionsMenuInsertSectionBreak:JMenuItem;
	protected SectionsMenuDisplaySectionAttribs:JCheckBoxMenuItem;
	protected sectionAttribsFrame:SectionAttribsFrame;

	public createSectionsMenu_1():JMenu
	{
		this.initSectionAttribsFrame();
		let SM:JMenu = new JMenu("Sections");
		this.SectionsMenuInsertSection = new JMenuItem("Insert new section...");
		this.SectionsMenuInsertSection.setMnemonic(KeyEvent.VK_S);
		this.SectionsMenuInsertSectionBreak = new JMenuItem("Insert section break");
		this.SectionsMenuInsertSectionBreak.setMnemonic(KeyEvent.VK_B);
		this.SectionsMenuDisplaySectionAttribs = new JCheckBoxMenuItem("Display section attributes",false);
		this.SectionsMenuDisplaySectionAttribs.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_R,ActionEvent.CTRL_MASK));
		this.SectionsMenuDisplaySectionAttribs.setMnemonic(KeyEvent.VK_R);
		SM.add(this.SectionsMenuInsertSection);
		SM.add(this.SectionsMenuInsertSectionBreak);
		SM.add(this.SectionsMenuDisplaySectionAttribs);
		this.SectionsMenuInsertSectionBreak.addActionListener(this);
		this.SectionsMenuInsertSection.addActionListener(this);
		this.SectionsMenuDisplaySectionAttribs.addItemListener(this);
		return SM;
	}

	//    SectionsMenuInsertSection.setEnabled(false);
	public initSectionAttribsFrame():void
	{
		if( this.sectionAttribsFrame != null)
			{
				this.sectionAttribsFrame.setVisible(false);
				this.sectionAttribsFrame.unregisterListeners_6();
			}

		this.sectionAttribsFrame = new SectionAttribsFrame(this);
	}

	/* hide for re-init */
	public setSectionAttribsFrameLocation():void
	{
		this.sectionAttribsFrame.setLocation((( this.getLocation().x + this.getSize().width) | 0),this.getLocation().y);
	}

	public showSectionAttribsFrame(show:boolean):void
	{
		if( this.sectionAttribsFrame.isShowing())
			{
				if( ! show)
					this.sectionAttribsFrame.setVisible(false);

			}

		else
			if( show)
				{
					this.initSectionAttribsFrame();
					this.setSectionNum_2(this.EditScr.getCurSectionNum());
					this.setSectionAttribsFrameLocation();
					this.sectionAttribsFrame.setVisible(true);
				}

	}
	/* re-init Frame to handle changes in music data */
	/* Text Menu */
	protected TextMenuOpenEditor:JMenuItem;
	protected TextMenuSetCurrentAsDefault:JMenuItem;
	protected TextMenuDeleteOriginalText:JMenuItem;
	protected TextMenuDeleteModernText:JMenuItem;

	public createTextMenu_1():JMenu
	{
		let TM:JMenu = new JMenu("Text");
		this.TextMenuOpenEditor = new JMenuItem("Open text editor");
		this.TextMenuOpenEditor.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_T,ActionEvent.CTRL_MASK));
		this.TextMenuOpenEditor.setMnemonic(KeyEvent.VK_T);
		this.TextMenuSetCurrentAsDefault = new JMenuItem("Set current version text as default");
		this.TextMenuDeleteOriginalText = new JMenuItem("Delete original text...");
		this.TextMenuDeleteOriginalText.setMnemonic(KeyEvent.VK_O);
		this.TextMenuDeleteModernText = new JMenuItem("Delete modern text...");
		this.TextMenuDeleteModernText.setMnemonic(KeyEvent.VK_M);
		TM.add(this.TextMenuOpenEditor);
		TM.add(this.TextMenuSetCurrentAsDefault);
		TM.add(this.TextMenuDeleteOriginalText);
		TM.add(this.TextMenuDeleteModernText);
		this.TextMenuOpenEditor.addActionListener(this);
		this.TextMenuSetCurrentAsDefault.addActionListener(this);
		this.TextMenuDeleteOriginalText.addActionListener(this);
		this.TextMenuDeleteModernText.addActionListener(this);
		return TM;
	}
	/* View Menu */
	protected ViewMenuPrintPreview:JMenuItem;
	protected ViewMenuOpenInViewer:JMenuItem;

	public createViewMenu_1():JMenu
	{
		let VM:JMenu = super.createViewMenu_1();
		this.VMTBothText.setSelected(true);
		this.ViewMenuDisplayallnewlineclefs.setState(true);
		this.ViewMenuDisplayligbrackets.setState(true);
		this.VMTOrigText.setEnabled(false);
		this.VMTModText.setEnabled(false);
		this.VMTBothText.setEnabled(false);
		this.VMTNoText.setEnabled(false);
		this.ViewMenuBarlineStyle.setEnabled(false);
		this.ViewMenuNoteShapeStyle.setEnabled(false);
		this.ViewMenuTexting.setEnabled(false);
		this.ViewMenuPitchSystem.setEnabled(false);
		this.ViewMenuUsemodernclefs.setEnabled(false);
		this.ViewMenuDisplayEditorialAccidentals.setEnabled(false);
		this.ViewMenuModernAccidentalSystem.setEnabled(false);
		this.ViewMenuDisplayallnewlineclefs.setEnabled(false);
		this.ViewMenuDisplayligbrackets.setEnabled(false);
		this.ViewMenuEdCommentary.setEnabled(false);
		VM.remove(this.ViewMenuPrintPreviews);
		this.ViewMenuPrintPreview = new JMenuItem("Print Preview");
		this.ViewMenuPrintPreview.setMnemonic(KeyEvent.VK_R);
		VM.add(this.ViewMenuPrintPreview);
		this.ViewMenuPrintPreview.addActionListener(this);
		this.ViewMenuOpenInViewer = new JMenuItem("Open in CMME Viewer");
		VM.add(this.ViewMenuOpenInViewer);
		this.ViewMenuOpenInViewer.addActionListener(this);
		return VM;
	}
	/* force some options in editor window */
	//    ViewMenuUsemodernclefs.setState(false);
	protected VersionsMenuSetVersionAsDefault:JMenuItem;

	public createVersionsMenu_1():JMenu
	{
		let VM:JMenu = new JMenu("Versions");
		this.VersionsMenuGeneralInfo = new JMenuItem("Variant Version Information...");
		this.VersionsMenuGeneralInfo.setMnemonic(KeyEvent.VK_I);
		this.VersionsMenuSetVersionAsDefault = new JMenuItem("Set current version as default");
		this.VersionsMenuNewNotesWindow = new JMenuItem("New critical notes list...");
		this.VersionsMenuNewNotesWindow.setMnemonic(KeyEvent.VK_N);
		this.VersionsMenuSourceAnalysis = new JMenuItem("Source analysis...");
		this.VersionsMenuSourceAnalysis.setMnemonic(KeyEvent.VK_A);
		VM.add(this.VersionsMenuGeneralInfo);
		VM.add(this.VersionsMenuSetVersionAsDefault);
		this.VersionsMenuGeneralInfo.addActionListener(this);
		this.VersionsMenuSetVersionAsDefault.addActionListener(this);
		this.VersionsMenuNewNotesWindow.addActionListener(this);
		this.VersionsMenuSourceAnalysis.addActionListener(this);
		return VM;
	}

	/* create menu and items */
	//  VM.add(VersionsMenuNewNotesWindow);
	//    VM.add(VersionsMenuSourceAnalysis);
	/* handle menu actions */
	public createAnalysisMenu_1():JMenu
	{
		return null;
	}

	/*------------------------------------------------------------------------
Method:    JPanel createStatusPanel()
Overrides: Gfx.MusicWin.createStatusPanel
Purpose:   Create information panel under viewscreen/scrollbar
Parameters:
  Input:  -
  Output: -
  Return: panel
------------------------------------------------------------------------*/
	public createStatusPanel_1():JPanel
	{
		let sp:JPanel = super.createStatusPanel_1();
		this.commentaryTextArea.setContentType("text/plain");
		this.commentaryTextArea.setText("");
		this.commentaryScrollPane.setFocusable(false);
		this.commentaryTextArea.setFocusable(false);
		this.commentaryTextArea.getDocument().addDocumentListener(this);
		return sp;
	}
	/*------------------------------------------------------------------------
Method:  void changeCommentaryTextAreaStatus(boolean enabled)
Purpose: Enable or disable commentary text area editing
Parameters:
  Input:  boolean enabled - whether to enable editing
  Output: -
  Return: -
------------------------------------------------------------------------*/
	commentaryGUIupdating:number = 0;

	changeCommentaryTextAreaStatus(enabled:boolean):void
	{
		if( this.commentaryTextArea == null)
			return;

		if( this.commentaryGUIupdating > 0)
			{
				return;
			}

		this.commentaryGUIupdating ++;
		this.commentaryScrollPane.setFocusable(enabled);
		this.commentaryTextArea.setFocusable(enabled);
		this.commentaryTextArea.setEditable(enabled);
		if( ! enabled)
			this.commentaryTextArea.setText("");

		this.commentaryGUIupdating --;
	}

	//        commentaryGUIupdating--;
	/*------------------------------------------------------------------------
Method:  void loadCommentaryText(Event e)
Purpose: Load text in commentary area from musical Event
Parameters:
  Input:  Event e - event source for commentary text
  Output: -
  Return: -
------------------------------------------------------------------------*/
	loadCommentaryText(e:Event):void
	{
		if( this.commentaryGUIupdating > 0)
			{
				return;
			}

		this.commentaryGUIupdating ++;
		let newText:string = e.getEdCommentary();
		if( newText == null)
			newText = "";

		this.commentaryTextArea.setText(newText);
		this.commentaryGUIupdating --;
	}
	//        commentaryGUIupdating--;
	/*------------------------------------------------------------------------
Method:  JToolBar createMainToolBar()
Purpose: Create main tool bar beneath menu and other GUIs for editor-specific
         functions
Parameters:
  Input:  -
  Output: -
  Return: tool bar
------------------------------------------------------------------------*/
	/* note-value button options */
	flagged_semiminima:boolean;
	selectedNVButton:number;
	NoteValueButtons:JButton[];
	RestValueButtons:JButton[];
	ClefButtons:JButton[];
	MiscButtons:JButton[];
	MensButtons:JButton[];
	variantVersionsBox:JComboBox<string>;

	public createMainToolBar_1():JToolBar
	{
		let mtb:JToolBar = new JToolBar();
		mtb.setFloatable(false);
		mtb.setFocusable(false);
		mtb.setLayout(new GridBagLayout());
		mtb.setAlignmentY(Component.LEFT_ALIGNMENT);
		mtb.setAlignmentX(Component.LEFT_ALIGNMENT);
		let cic:GridBagConstraints = new GridBagConstraints();
		cic.anchor = GridBagConstraints.WEST;
		cic.weightx = 0;
		this.NoteValueButtons = Array(EditorWin.NVButtonVals.length);
		for(
		let i:number = 0;i < EditorWin.NVButtonVals.length;i ++)
		{
			this.NoteValueButtons[i]= new JButton();
			this.NoteValueButtons[i].setMargin(new Insets(1,1,1,1));
			this.NoteValueButtons[i].setIcon(EditorWin.NVIcons_dark[i]);
			this.NoteValueButtons[i].setToolTipText(NoteEvent.NoteTypeNames[EditorWin.NVButtonVals[i]]);
			this.NoteValueButtons[i].setFocusable(false);
			this.NoteValueButtons[i].addActionListener(this);
			cic.gridx = i % 4;
			cic.gridy =((<number> i / 4) | 0);
			mtb.add(this.NoteValueButtons[i],cic);
		}
		this.flagged_semiminima = false;
		this.selectedNVButton = 3;
		this.NoteValueButtons[this.selectedNVButton].setIcon(EditorWin.NVIcons_light[this.selectedNVButton]);
		mtb.addSeparator();
		this.RestValueButtons = Array(EditorWin.NVButtonVals.length);
		for(
		let i:number = 0;i < EditorWin.NVButtonVals.length;i ++)
		{
			this.RestValueButtons[i]= new JButton();
			this.RestValueButtons[i].setMargin(new Insets(1,1,1,1));
			this.RestValueButtons[i].setIcon(EditorWin.RVIcons_light[i]);
			this.RestValueButtons[i].setToolTipText(NoteEvent.NoteTypeNames[EditorWin.NVButtonVals[i]]+ " rest");
			this.RestValueButtons[i].setFocusable(false);
			this.RestValueButtons[i].addActionListener(this);
			cic.gridx =(( 5 + i % 4) | 0);
			cic.gridy =((<number> i / 4) | 0);
			mtb.add(this.RestValueButtons[i],cic);
		}
		mtb.addSeparator();
		this.ClefButtons = Array(EditorWin.ClefButtonVals.length);
		for(
		let i:number = 0;i < EditorWin.ClefButtonVals.length;i ++)
		{
			this.ClefButtons[i]= new JButton();
			this.ClefButtons[i].setMargin(new Insets(1,1,1,1));
			this.ClefButtons[i].setIcon(EditorWin.ClefIcons[i]);
			this.ClefButtons[i].setToolTipText("Clef: " + Clef.ClefNames[EditorWin.ClefButtonVals[i]]);
			this.ClefButtons[i].setFocusable(false);
			this.ClefButtons[i].addActionListener(this);
			cic.gridx =(( 10 + i % 3) | 0);
			cic.gridy =((<number> i / 3) | 0);
			mtb.add(this.ClefButtons[i],cic);
		}
		cic.gridx ++;
		mtb.addSeparator();
		let startx:number =(( cic.gridx + 1) | 0);
		this.MiscButtons = Array(EditorWin.MiscButtonVals.length);
		for(
		let i:number = 0;i < EditorWin.MiscButtonVals.length;i ++)
		{
			this.MiscButtons[i]= new JButton();
			this.MiscButtons[i].setMargin(new Insets(1,1,1,1));
			this.MiscButtons[i].setIcon(EditorWin.MiscIcons[i]);
			this.MiscButtons[i].setToolTipText(EditorWin.MiscButtonNames[i]);
			this.MiscButtons[i].setFocusable(false);
			this.MiscButtons[i].addActionListener(this);
			cic.gridx =(( startx +((<number> i / 2) | 0)) | 0);
			cic.gridy = i % 2;
			mtb.add(this.MiscButtons[i],cic);
			mtb.add(this.MiscButtons[i],cic);
		}
		cic.gridx ++;
		mtb.addSeparator();
		startx =(( cic.gridx + 1) | 0);
		this.MensButtons = Array(EditorWin.MensButtonVals.length);
		for(
		let i:number = 0;i < EditorWin.MensButtonVals.length;i ++)
		{
			this.MensButtons[i]= new JButton();
			this.MensButtons[i].setMargin(new Insets(1,1,1,1));
			this.MensButtons[i].setIcon(( i == EditorWin.MENS_BUTTON_DOT || i == EditorWin.MENS_BUTTON_STROKE) ? EditorWin.MensIcons_dark[i]:EditorWin.MensIcons_light[i]);
			this.MensButtons[i].setToolTipText("Mensuration: " + EditorWin.MensButtonNames[i]);
			this.MensButtons[i].setFocusable(false);
			this.MensButtons[i].addActionListener(this);
			cic.gridx =(( startx +((<number> i / 2) | 0)) | 0);
			cic.gridy = i % 2;
			mtb.add(this.MensButtons[i],cic);
			mtb.add(this.MensButtons[i],cic);
		}
		cic.gridx ++;
		mtb.addSeparator();
		cic.weightx = 1;
		cic.anchor = GridBagConstraints.EAST;
		this.PlayButton = new JButton("PLAY");
		this.PlayButton.addActionListener(this);
		cic.gridx ++;
		cic.gridy = 0;
		mtb.add(this.PlayButton,cic);
		cic.gridx ++;
		mtb.addSeparator();
		cic.weightx = 0;
		cic.gridx ++;
		cic.gridy = 0;
		mtb.add(this.createTBZoomControl(),cic);
		let versionsBoxLabel:JLabel = new JLabel("Version: ");
		this.variantVersionsBox = null;
		this.initVariantVersionsBox();
		let versionsComboGroup:Box = Box.createHorizontalBox();
		versionsComboGroup.add(versionsBoxLabel);
		versionsComboGroup.add(this.variantVersionsBox);
		cic.weightx = 0;
		cic.anchor = GridBagConstraints.EAST;
		cic.gridy = 1;
		mtb.add(versionsComboGroup,cic);
		this.textEditorFrame = new TextEditorFrame(this);
		this.createEventEditorFrame();
		return mtb;
	}

	/* note-value buttons */
	/* Semibrevis */
	/* rest-value buttons */
	/* clef buttons */
	/*        if (i==ClefButtonVals.length-1)
          cic.weightx=1;*/
	/* misc buttons */
	/* mensuration buttons */
	/* RIGHT SIDE */
	/* ------------------------- SEPARATE FRAMES ------------------------- */
	/* modern text editor */
	/* event editor - must first create modern text editor */
	/*------------------------------------------------------------------------
Method:  void toggleFlaggedSemiminima()
Purpose: Toggle between colored and flagged semiminima style on toolbar
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public toggleFlaggedSemiminima():void
	{
		let TMP_light:ImageIcon = EditorWin.NVIcons_light[EditorWin.NVB_SEMIMINIMA];
		let TMP_dark:ImageIcon = EditorWin.NVIcons_dark[EditorWin.NVB_SEMIMINIMA];
		EditorWin.NVIcons_light[EditorWin.NVB_SEMIMINIMA]= EditorWin.OtherSM_light;
		EditorWin.NVIcons_dark[EditorWin.NVB_SEMIMINIMA]= EditorWin.OtherSM_dark;
		EditorWin.OtherSM_light = TMP_light;
		EditorWin.OtherSM_dark = TMP_dark;
		this.NoteValueButtons[EditorWin.NVB_SEMIMINIMA].setIcon(this.selectedNVButton == EditorWin.NVB_SEMIMINIMA ? EditorWin.NVIcons_light[EditorWin.NVB_SEMIMINIMA]:EditorWin.NVIcons_dark[EditorWin.NVB_SEMIMINIMA]);
		this.flagged_semiminima = ! this.flagged_semiminima;
	}

	/* swap icon images */
	/* update button and flag */
	public useFlaggedSemiminima():boolean
	{
		return this.flagged_semiminima;
	}

	/*------------------------------------------------------------------------
Method:  void selectNVButton(int bnum)
Purpose: Switch selected note-value button
Parameters:
  Input:  int bnum - number of button to be selected
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public selectNVButton(bnum:number):void
	{
		if( bnum == this.selectedNVButton)
			return;

		if( bnum >= EditorWin.NVButtonVals.length)
			bnum =(( EditorWin.NVButtonVals.length - 1) | 0);
		else
			if( bnum < 0)
				bnum = 0;

		this.NoteValueButtons[this.selectedNVButton].setIcon(EditorWin.NVIcons_dark[this.selectedNVButton]);
		this.selectedNVButton = bnum;
		this.NoteValueButtons[this.selectedNVButton].setIcon(EditorWin.NVIcons_light[this.selectedNVButton]);
	}

	/* convert note type to button number */
	public NTtoBNum(nt:number):number
	{
		for(
		let i:number = 0;i < EditorWin.NVButtonVals.length;i ++)
		if( nt == EditorWin.NVButtonVals[i])
			return i;

		return - 1;
	}

	/*------------------------------------------------------------------------
Method:  int getSelectedNoteVal()
Purpose: Return currently selected note value (for adding notes)
Parameters:
  Input:  -
  Output: -
  Return: selected note value
------------------------------------------------------------------------*/
	public getSelectedNoteVal():number
	{
		return EditorWin.NVButtonVals[this.selectedNVButton];
	}

	/*------------------------------------------------------------------------
Method:  void setSectionNum(int snum)
Purpose: Update GUI to reflect section number of cursor
Parameters:
  Input:  int snum - cursor's current section number
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setSectionNum_2(snum:number):void
	{
		this.sectionAttribsFrame.setSectionNum_1(snum);
	}

	public updateSectionGUI_2(snum:number):void
	{
		this.sectionAttribsFrame.updateSectionGUI_1(snum);
	}
	/*------------------------------------------------------------------------
Method:  void createEventEditorFrame()
Purpose: Create window for editing individual event info
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	eventEditorFrame:JDialog;
	/* event info panel */
	eventInfoPanel:JPanel;
	eventTypeLabel:JLabel;
	eventVariPanel:JPanel;
	/* proportion fields / event attributes */
	proportionPanel:JPanel;
	proportionLabel:JLabel;
	eventProportion1:JSpinner;
	eventProportion2:JSpinner;
	eventEditorialCheckBox:JCheckBox;
	eventErrorCheckBox:JCheckBox;
	/* note info view/editor */
	noteInfoPanel:NoteInfoPanel;
	/* modern key signature view/editor */
	modernKeySigPanel:ModernKeySigPanel;
	/* mensuration editor */
	mensurationPanel:MensurationChooser;
	/* coloration chooser */
	colorationPanel:ColorationChooser;
	/* text annotation editor */
	annotationPanel:JPanel;
	annotationTextField:JTextField;
	static NO_EVENT_LABEL:string = "No event selected";
	static MULTI_EVENT_LABEL:string = " events selected";

	createEventEditorFrame():void
	{
		this.eventEditorFrame = new JDialog(this,"Event information",false);
		let eecp:Container = this.eventEditorFrame.getContentPane();
		eecp.setLayout(new BoxLayout(eecp,BoxLayout.Y_AXIS));
		let topPanel:JPanel = new JPanel();
		topPanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder(""),BorderFactory.createEmptyBorder(5,5,5,5)));
		topPanel.setLayout(new BoxLayout(topPanel,BoxLayout.X_AXIS));
		this.eventInfoPanel = new JPanel();
		this.eventTypeLabel = new JLabel(EditorWin.NO_EVENT_LABEL);
		this.eventTypeLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
		this.eventInfoPanel.add(this.eventTypeLabel);
		this.eventProportion1 = new JSpinner(new SpinnerNumberModel(1,1,999,1));
		this.eventProportion2 = new JSpinner(new SpinnerNumberModel(1,1,999,1));
		let proportionNumberPanel:JPanel = new JPanel();
		proportionNumberPanel.add(this.eventProportion1);
		proportionNumberPanel.add(this.eventProportion2);
		proportionNumberPanel.setAlignmentX(Component.RIGHT_ALIGNMENT);
		this.proportionPanel = new JPanel(new GridLayout(1,0));
		this.proportionLabel = new JLabel();
		this.proportionLabel.setHorizontalAlignment(SwingConstants.RIGHT);
		this.proportionPanel.add(this.proportionLabel);
		this.proportionPanel.add(proportionNumberPanel);
		this.eventProportion1.setEnabled(false);
		this.eventProportion2.setEnabled(false);
		this.eventProportion1.addChangeListener(this);
		this.eventProportion2.addChangeListener(this);
		this.eventInfoPanel.setAlignmentX(Component.LEFT_ALIGNMENT);
		this.proportionPanel.setAlignmentX(Component.RIGHT_ALIGNMENT);
		topPanel.add(this.eventInfoPanel);
		topPanel.add(Box.createGlue());
		topPanel.add(this.proportionPanel);
		let bottomPanel:JPanel = new JPanel();
		bottomPanel.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder(""),BorderFactory.createEmptyBorder(5,5,5,5)));
		bottomPanel.setLayout(new BoxLayout(bottomPanel,BoxLayout.Y_AXIS));
		let eventAttribsBox:Box = Box.createHorizontalBox();
		this.eventEditorialCheckBox = new JCheckBox("Editorial");
		this.eventErrorCheckBox = new JCheckBox("Error");
		eventAttribsBox.add(this.eventEditorialCheckBox);
		eventAttribsBox.add(this.eventErrorCheckBox);
		eventAttribsBox.add(Box.createHorizontalGlue());
		this.eventEditorialCheckBox.setEnabled(false);
		this.eventErrorCheckBox.setEnabled(false);
		this.eventEditorialCheckBox.addActionListener(this);
		this.eventErrorCheckBox.addActionListener(this);
		bottomPanel.add(eventAttribsBox);
		this.eventVariPanel = new JPanel();
		bottomPanel.add(this.eventVariPanel);
		this.createNoteInfoPanel();
		this.createModernKeySigPanel();
		this.createMensurationChooser();
		this.createColorationChooser();
		this.createAnnotationEditor();
		this.eventVariPanel.add(this.mensurationPanel);
		eecp.add(topPanel);
		eecp.add(bottomPanel);
		this.eventEditorFrame.pack();
		let els:Dimension = new Dimension(this.eventTypeLabel.getSize());
		els.width += 20;
		this.eventTypeLabel.setPreferredSize(els);
		this.eventVariPanel.setPreferredSize(this.eventVariPanel.getSize());
		this.eventEditorFrame.pack();
		this.eventEditorFrame.setDefaultCloseOperation(WindowConstants.HIDE_ON_CLOSE);
		this.addWindowListener(
		{

			//    eventEditorFrame.setUndecorated(true);
			/* event proportion fields */
			/* individual editors which can appear in bottom panel */
			/* temporarily add largest editor panel to get size */
			/* pack and play with sizes */
			windowClosing:(event:WindowEvent):void =>
			{
				this.setEditMenuDisplayEventEditor(false);
			}
		}
		);
		this.updateEventEditor_1();
	}

	/*------------------------------------------------------------------------
Method:  void setEventEditorLocation()
Purpose: Position event editor relative to parent frame
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setEventEditorLocation():void
	{
		let eex:number = this.getLocation().x;
		let eey:number =(( this.getLocation().y + this.getSize().height) | 0);
		let eeWidth:number = this.eventEditorFrame.getSize().width;
		let eeHeight:number = this.eventEditorFrame.getSize().height;
		let screenSize:Dimension = Toolkit.getDefaultToolkit().getScreenSize();
		if((( eey + eeHeight) | 0) > screenSize.height)
			{
				eey = this.getLocation().y;
				eex += this.getSize().width;
			}

		if((( eex + eeWidth) | 0) > screenSize.width)
			eex =(( screenSize.width - eeWidth) | 0);

		this.eventEditorFrame.pack();
		this.eventEditorFrame.setLocation(eex,eey);
		this.toFront();
	}

	/* position relative to main frame */
	/* if too low on screen, position to right of main window */
	//    eventEditorFrame.setVisible(true);
	public setEditingOptionsLocation():void
	{
		this.editingOptionsFrame.setLocation((( this.eventEditorFrame.getLocation().x + this.eventEditorFrame.getSize().width) | 0),this.eventEditorFrame.getLocation().y);
	}
	/*------------------------------------------------------------------------
Method:  void disableAllEventEditors()
Purpose: Mark all individual event editor types as disabled
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	_noteInfoPanelEnabled:boolean = false;
	_modernKeySigPanelEnabled:boolean = false;
	_mensurationChooserEnabled:boolean = false;
	_colorationChooserEnabled:boolean = false;
	_annotationEditorEnabled:boolean = false;
	allDisabled:boolean = false;

	disableAllEventEditors():void
	{
		this.eventVariPanel.removeAll();
		this._noteInfoPanelEnabled = false;
		this._modernKeySigPanelEnabled = false;
		this._mensurationChooserEnabled = false;
		this._colorationChooserEnabled = false;
		this._annotationEditorEnabled = false;
		this.disableNoteInfoPanel();
		this.disableModernKeySigPanel();
		this.disableProportionPanel();
		this.disableEventAttributesGUI();
		this.textEditorFrame.disableSetSyllable();
		this.textEditorFrame.disableRemoveSyllable();
		this.changeCommentaryTextAreaStatus(false);
		this.allDisabled = true;
	}

	/*------------------------------------------------------------------------
Method:  void clipboard[Copy|Cut|Paste]()
Purpose: Clipboard functions based on current cursor position and
         highlighted items
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public clipboardCopy_2():void
	{
		this.EditScr.clipboardCopy_1();
		for(let ew of MusicWin.fileWindows)
		if( ew instanceof EditorWin)
			(<EditorWin> ew).EditMenuPaste.setEnabled(ScoreEditorCanvas.clipboard != null);

	}

	public clipboardCut_2():void
	{
		this.EditScr.clipboardCut_1();
		for(let ew of MusicWin.fileWindows)
		if( ew instanceof EditorWin)
			(<EditorWin> ew).EditMenuPaste.setEnabled(ScoreEditorCanvas.clipboard != null);

	}

	public clipboardPaste_2():void
	{
		this.EditScr.clipboardPaste_1();
	}

	/*------------------------------------------------------------------------
Method:  void updateEventEditor([Event e|int ne])
Purpose: Set event editor to reflect state of currently highlighted events
Parameters:
  Input:  Event e - event to edit
          int ne  - number of highlighted events
  Output: -
  Return: -
------------------------------------------------------------------------*/
	/* nothing highlighted */
	public updateEventEditor_1():void
	{
		if( this.allDisabled)
			return;

		this.disableAllEventEditors();
		this.eventTypeLabel.setText(EditorWin.NO_EVENT_LABEL);
		this.eventEditorFrame.pack();
		this.eventEditorFrame.repaint();
		this.EditMenuCut.setEnabled(false);
		this.EditMenuDelete.setEnabled(false);
		this.updateToolbarMens(null);
	}

	/* multiple events highlighted */
	public updateEventEditor_2(ne:number):void
	{
		this.disableAllEventEditors();
		this.eventTypeLabel.setText(ne + EditorWin.MULTI_EVENT_LABEL);
		this.eventEditorFrame.pack();
		this.eventEditorFrame.repaint();
		this.allDisabled = false;
		this.EditMenuCut.setEnabled(true);
		this.EditMenuCopy.setEnabled(true);
		this.EditMenuDelete.setEnabled(true);
		this.updateToolbarMens(null);
	}

	/* one event highlighted */
	public updateEventEditor_3(re:RenderedEvent):void
	{
		let e:Event = re.getEvent_1();
		this.disableAllEventEditors();
		this.eventTypeLabel.setText(e.getTypeName());
		this.enableEventAttributesGUI(e);
		this.loadCommentaryText(e);
		this.changeCommentaryTextAreaStatus(true);
		switch( e.geteventtype())
		{
			case Event.EVENT_NOTE:
			{
				if( e.getLength_1() != null)
					this.enableProportionPanel("Length (minims)",e.getLength_1());

				this.textEditorFrame.enableSetSyllable();
				if((<NoteEvent> e).getModernText() != null)
					this.textEditorFrame.enableRemoveSyllable();

				this.enableNoteInfoPanel(re);
				break;
			}
			case Event.EVENT_REST:
			{
				if( e.getLength_1() != null)
					this.enableProportionPanel("Length (minims)",e.getLength_1());

				break;
			}
			case Event.EVENT_MODERNKEYSIGNATURE:
			{
				this.enableModernKeySigPanel((<ModernKeySignatureEvent> e).getSigInfo());
				break;
			}
			case Event.EVENT_MENS:
			{
				this.enableProportionPanel("Proportion",(<MensEvent> e).getTempoChange());
				this.enableMensurationChooser(<MensEvent> e);
				this.updateToolbarMens(<MensEvent> e);
				break;
			}
			case Event.EVENT_PROPORTION:
			{
				this.enableProportionPanel("",(<ProportionEvent> e).getproportion());
				break;
			}
			case Event.EVENT_COLORCHANGE:
			{
				this.enableColorationChooser((<ColorChangeEvent> e).getcolorscheme());
				break;
			}
			case Event.EVENT_ANNOTATIONTEXT:
			{
				this.enableAnnotationEditor((<AnnotationTextEvent> e).gettext());
				break;
			}
			case Event.EVENT_LACUNA:
			{
				this.enableProportionPanel("Length (minims)",e.getLength_1());
				break;
			}
			case Event.EVENT_MULTIEVENT:
			{
				let ne:NoteEvent =(<MultiEvent> e).getLowestNote();
				if( ne != null)
					{
						this.textEditorFrame.enableSetSyllable();
						if( ne.getModernText() != null)
							this.textEditorFrame.enableRemoveSyllable();

					}

				break;
			}
		}
		this.eventEditorFrame.pack();
		this.eventEditorFrame.repaint();
		this.allDisabled = false;
		this.EditMenuCut.setEnabled(true);
		this.EditMenuCopy.setEnabled(true);
		this.EditMenuDelete.setEnabled(true);
	}

	public updateToolbarMens(me:MensEvent):void
	{
		let dotIcon:ImageIcon = EditorWin.MensIcons_dark[EditorWin.MENS_BUTTON_DOT];
		let strokeIcon:ImageIcon = EditorWin.MensIcons_dark[EditorWin.MENS_BUTTON_STROKE];
		if( me != null)
			{
				if( ! me.getMainSign().dotted)
					dotIcon = EditorWin.MensIcons_light[EditorWin.MENS_BUTTON_DOT];

				if( ! me.getMainSign().stroke)
					strokeIcon = EditorWin.MensIcons_light[EditorWin.MENS_BUTTON_STROKE];

			}

		this.MensButtons[EditorWin.MENS_BUTTON_DOT].setIcon(dotIcon);
		this.MensButtons[EditorWin.MENS_BUTTON_STROKE].setIcon(strokeIcon);
	}

	public setEditMenuDisplayEventEditor(newval:boolean):void
	{
		this.EditMenuDisplayEventEditor.setSelected(newval);
	}

	public setEditMenuEditingOptions(newval:boolean):void
	{
		this.EditMenuEditingOptions.setSelected(newval);
	}

	public toggleEditingOptionsColoration():void
	{
		this.editingOptionsFrame.toggleColorationOption();
	}

	public setInputColorationOn(newval:boolean):void
	{
		this.EditScr.setColorationOn(newval);
	}

	/* ------------------------- SECTION WINDOW -------------------------- */
	public setSectionsMenuDisplaySectionAttribs(newval:boolean):void
	{
		this.SectionsMenuDisplaySectionAttribs.setSelected(newval);
	}

	public setVoiceUsedInSection(snum:number,vnum:number,newState:boolean):void
	{
		let ms:MusicSection = this.musicData.getSection(snum);
		if( newState ==( ms.getVoice_1(vnum) != null))
			return;

		if( newState == true)
			ms.initializeNewVoice_1(vnum,this.musicData.getVoiceData()[vnum]);
		else
			{
				ms.removeVoice_1(vnum);
				if( vnum == this.EditScr.getCurVoiceNum())
					{
						this.EditScr.setVoicenum(ms.getValidVoicenum(0));
						this.EditScr.setEventNum(0);
					}

			}

		this.fileModified_2();
		this.rerendermusic = true;
		this.repaint();
	}

	/*------------------------------------------------------------------------
Method:  void [enable|disable]ProportionPanel(String s,Proportion p)
Purpose: Enable/disable proportion display/input on tool bar (for timed events
         and proportions)
Parameters:
  Input:  String s     - label for panel
          Proportion p - value to edit
  Output: -
  Return: -
------------------------------------------------------------------------*/
	enableProportionPanel(s:string,p:Proportion):void
	{
		this.eventProportion1.setEnabled(false);
		this.eventProportion2.setEnabled(false);
		this.proportionLabel.setText(s);
		this.eventProportion1.setValue(new Integer(p.i1));
		this.eventProportion2.setValue(new Integer(p.i2));
		this.eventProportion1.setEnabled(true);
		this.eventProportion2.setEnabled(true);
	}

	disableProportionPanel():void
	{
		this.proportionLabel.setText(null);
		this.eventProportion1.setEnabled(false);
		this.eventProportion2.setEnabled(false);
		this.eventProportion1.setValue(new Integer(1));
		this.eventProportion2.setValue(new Integer(1));
	}

	proportionPanelEnabled():boolean
	{
		return this.eventProportion1.isEnabled();
	}

	enableEventAttributesGUI(e:Event):void
	{
		this.eventEditorialCheckBox.setEnabled(false);
		this.eventErrorCheckBox.setEnabled(false);
		this.eventEditorialCheckBox.setSelected(e.isEditorial());
		this.eventErrorCheckBox.setSelected(e.isError());
		this.eventEditorialCheckBox.setEnabled(true);
		this.eventErrorCheckBox.setEnabled(true);
	}

	disableEventAttributesGUI():void
	{
		this.eventEditorialCheckBox.setEnabled(false);
		this.eventErrorCheckBox.setEnabled(false);
		this.eventEditorialCheckBox.setSelected(false);
		this.eventErrorCheckBox.setSelected(false);
	}

	/*------------------------------------------------------------------------
Method:  void createNoteInfoPanel()
Purpose: Create and lay out note editor/display
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	createNoteInfoPanel():void
	{
		this.noteInfoPanel = new NoteInfoPanel(MusicFont.new0());
	}

	/*------------------------------------------------------------------------
Method:  void [enable|disable]NoteInfoPanel(RenderedEvent rne)
Purpose: Enable/disable note display/input
Parameters:
  Input:  RenderedEvent rne - rendered event with values to edit
  Output: -
  Return: -
------------------------------------------------------------------------*/
	enableNoteInfoPanel(rne:RenderedEvent):void
	{
		this.eventVariPanel.removeAll();
		this.noteInfoPanel.setInfo_2(rne);
		this.eventVariPanel.add(this.noteInfoPanel);
		this.eventEditorFrame.pack();
		this.eventEditorFrame.repaint();
		this._noteInfoPanelEnabled = true;
	}

	disableNoteInfoPanel():void
	{
		this.eventVariPanel.removeAll();
		this.eventEditorFrame.pack();
		this.eventEditorFrame.repaint();
		this._noteInfoPanelEnabled = false;
	}

	noteInfoPanelEnabled():boolean
	{
		return this._noteInfoPanelEnabled;
	}

	/*------------------------------------------------------------------------
Method:  void createModernKeySigPanel()
Purpose: Create and lay out modern key signature display/editor
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	createModernKeySigPanel():void
	{
		this.modernKeySigPanel = new ModernKeySigPanel(this.MusicGfx);
	}

	/*------------------------------------------------------------------------
Method:  void [enable|disable]ModernKeySigPanel(ModernKeySignature sigInfo)
Purpose: Enable/disable modern key signature display/input
Parameters:
  Input:  ModernKeySignature sigInfo - values to edit
  Output: -
  Return: -
------------------------------------------------------------------------*/
	enableModernKeySigPanel(sigInfo:ModernKeySignature):void
	{
		this.eventVariPanel.removeAll();
		this.modernKeySigPanel.setInfo_1(sigInfo);
		this.eventVariPanel.add(this.modernKeySigPanel);
		this.eventEditorFrame.pack();
		this.eventEditorFrame.repaint();
		this._modernKeySigPanelEnabled = true;
	}

	disableModernKeySigPanel():void
	{
		this.eventVariPanel.removeAll();
		this.eventEditorFrame.pack();
		this.eventEditorFrame.repaint();
		this._modernKeySigPanelEnabled = false;
	}

	modernKeySigPanelEnabled():boolean
	{
		return this._modernKeySigPanelEnabled;
	}

	/*------------------------------------------------------------------------
Method:  void createMensurationChooser()
Purpose: Create and lay out mensuration editor
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	createMensurationChooser():void
	{
		this.mensurationPanel = MensurationChooser.new0_2();
		this.mensurationPanel.mensOButton.addActionListener(this);
		this.mensurationPanel.mensCButton.addActionListener(this);
		this.mensurationPanel.mens2Button.addActionListener(this);
		this.mensurationPanel.mens3Button.addActionListener(this);
		this.mensurationPanel.deleteButton.addActionListener(this);
		this.mensurationPanel.mensDotBox.addActionListener(this);
		this.mensurationPanel.mensStrokeBox.addActionListener(this);
		this.mensurationPanel.mensReverseBox.addActionListener(this);
		this.mensurationPanel.mensNoScoreSigBox.addActionListener(this);
		this.mensurationPanel.prolatioBinaryButton.addActionListener(this);
		this.mensurationPanel.prolatioTernaryButton.addActionListener(this);
		this.mensurationPanel.tempusBinaryButton.addActionListener(this);
		this.mensurationPanel.tempusTernaryButton.addActionListener(this);
		this.mensurationPanel.modus_minorBinaryButton.addActionListener(this);
		this.mensurationPanel.modus_minorTernaryButton.addActionListener(this);
		this.mensurationPanel.modus_maiorBinaryButton.addActionListener(this);
		this.mensurationPanel.modus_maiorTernaryButton.addActionListener(this);
	}

	/*------------------------------------------------------------------------
Method:  void [enable|disable]MensurationChooser(MensEvent me)
Purpose: Enable/disable mensuration display/input
Parameters:
  Input:  MensEvent me - event with values to edit
  Output: -
  Return: -
------------------------------------------------------------------------*/
	enableMensurationChooser(me:MensEvent):void
	{
		this.eventVariPanel.removeAll();
		this.mensurationPanel.setIndices_2(me);
		this.eventVariPanel.add(this.mensurationPanel);
		this.eventEditorFrame.pack();
		this.eventEditorFrame.repaint();
		this._mensurationChooserEnabled = true;
	}

	disableMensurationChooser():void
	{
		this.eventVariPanel.removeAll();
		this.eventEditorFrame.pack();
		this.eventEditorFrame.repaint();
		this._mensurationChooserEnabled = false;
	}

	mensurationChooserEnabled():boolean
	{
		return this._mensurationChooserEnabled;
	}

	/*------------------------------------------------------------------------
Method:  void createColorationChooser()
Purpose: Create and lay out coloration editor
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	createColorationChooser():void
	{
		this.colorationPanel = ColorationChooser.new0_1();
		this.colorationPanel.PrimaryColorChooser.addActionListener(this);
		this.colorationPanel.PrimaryFillChooser.addActionListener(this);
		this.colorationPanel.SecondaryColorChooser.addActionListener(this);
		this.colorationPanel.SecondaryFillChooser.addActionListener(this);
	}

	/*------------------------------------------------------------------------
Method:  void [enable|disable]ColorationChooser(Coloration c)
Purpose: Enable/disable coloration display/input
Parameters:
  Input:  Coloration c - value to edit
  Output: -
  Return: -
------------------------------------------------------------------------*/
	enableColorationChooser(c:Coloration):void
	{
		this.eventVariPanel.removeAll();
		this.colorationPanel.setIndices_1(c);
		this.eventVariPanel.add(this.colorationPanel);
		this.eventEditorFrame.pack();
		this.eventEditorFrame.repaint();
		this._colorationChooserEnabled = true;
	}

	disableColorationChooser():void
	{
		this.eventVariPanel.removeAll();
		this.eventEditorFrame.pack();
		this.eventEditorFrame.repaint();
		this._colorationChooserEnabled = false;
	}

	colorationChooserEnabled():boolean
	{
		return this._colorationChooserEnabled;
	}

	/*------------------------------------------------------------------------
Method:  void createAnnotationEditor()
Purpose: Create and lay out annotation editor
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	createAnnotationEditor():void
	{
		this.annotationPanel = new JPanel();
		this.annotationTextField = new JTextField(20);
		this.annotationPanel.add(this.annotationTextField);
		this.annotationTextField.addActionListener(this);
	}

	/*------------------------------------------------------------------------
Method:  void [enable|disable]AnnotationEditor(String s)
Purpose: Enable/disable text annotation display/input
Parameters:
  Input:  String s - value to edit
  Output: -
  Return: -
------------------------------------------------------------------------*/
	enableAnnotationEditor(s:string):void
	{
		this.eventVariPanel.removeAll();
		this.annotationTextField.setText(s);
		this.eventVariPanel.add(this.annotationPanel);
		this.eventEditorFrame.pack();
		this.eventEditorFrame.repaint();
		this._annotationEditorEnabled = true;
	}

	disableAnnotationEditor():void
	{
		this.eventVariPanel.removeAll();
		this.eventEditorFrame.pack();
		this.eventEditorFrame.repaint();
		this._annotationEditorEnabled = false;
	}

	annotationEditorEnabled():boolean
	{
		return this._annotationEditorEnabled;
	}

	/*------------------------------------------------------------------------
Method:     void stateChanged(ChangeEvent e)
Implements: ChangeListener.stateChanged
Purpose:    Take action when a proportion-spinner value has changed
Parameters:
  Input:  ChangeEvent e - state-changed event
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public stateChanged(e:ChangeEvent):void
	{
		if( ! this.proportionPanelEnabled())
			return;

		let itemChanged:any = e.getSource();
		this.EditScr.setEventProportion(Proportion.new0((<Integer>( this.eventProportion1.getValue())).intValue(),(<Integer>( this.eventProportion2.getValue())).intValue()));
	}
	/*------------------------------------------------------------------------
Method:  void [create|close]GeneralInfoFrame()
Purpose: Create or close panel for editing general/voice info
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	/* general/voice info editing panel */
	inGeneralInfoFrame:boolean = false;

	createGeneralInfoFrame():void
	{
		this.generalInfoFrame = new GeneralInfoFrame(this,this.EditScr.getCurVoiceNum());
	}

	public closeGeneralInfoFrame():void
	{
		this.inGeneralInfoFrame = false;
		this.generalInfoFrame.closewin_2();
	}

	/*------------------------------------------------------------------------
Method:  void [edit|save]GeneralInfo()
Purpose: Edit and apply general info changes to music data and close dialog
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	editGeneralInfo():void
	{
		this.createGeneralInfoFrame();
		this.inGeneralInfoFrame = true;
		this.generalInfoFrame.setVisible(true);
	}

	public saveGeneralInfo():void
	{
		this.generalInfoFrame.saveData();
		let numVoicesChanged:boolean = this.generalInfoFrame.numVoicesChanged();
		let editorVoiceDeleted:boolean = this.generalInfoFrame.editorVoiceDeleted();
		let newEditorVoiceNum:number = this.generalInfoFrame.getNewEditorVoiceNum();
		this.fileModified_2();
		this.closeGeneralInfoFrame();
		if( numVoicesChanged)
			{
				this.reinitVoiceTextAreas();
				this.EditScr.initdrawingparams();
				this.EditScr.newsize(this.EditScr.screensize.width,this.EditScr.screensize.height);
				this.pack();
				this.setSubframeLocations_1();
			}

		this.musicData.recalcAllEventParams();
		this.rerendermusic = true;
		if( editorVoiceDeleted)
			{
				this.EditScr.setVoicenum(this.EditScr.getCurSection().getValidVoicenum(0));
				this.EditScr.setEventNum(0);
			}

		else
			this.EditScr.setVoicenum(newEditorVoiceNum);

		this.repaint();
	}
	/*------------------------------------------------------------------------
Method:  void editVariantVersionInfo()
Purpose: Edit variant version info in separate dialog
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	variantVersionInfoFrame:VariantVersionInfoFrame = null;

	editVariantVersionInfo():void
	{
		this.variantVersionInfoFrame = new VariantVersionInfoFrame(this);
		this.variantVersionInfoFrame.setVisible(true);
	}

	/*------------------------------------------------------------------------
Method:  void initVariantVersionsBox()
Purpose: Initialize combo box with list of version names
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public initVariantVersionsBox():void
	{
		let versionNames:LinkedList<string> = new LinkedList<string>();
		for(let vvd of this.musicData.getVariantVersions())
		versionNames.add(vvd.getID());
		let newBox:boolean = false;
		if( this.variantVersionsBox == null)
			{
				this.variantVersionsBox = new JComboBox<string>();
				newBox = true;
			}

		this.variantVersionsBox.removeAllItems();
		for(let s of versionNames)
		this.variantVersionsBox.addItem(s);
		if( newBox)
			this.variantVersionsBox.addActionListener(this);

	}
	//    versionNames.add("Default");
	/*------------------------------------------------------------------------
Method:  void [show|create]InsertSectionDialog()
Purpose: Bring up dialog for inserting new section
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	insertSectionDialog:JDialog;

	showInsertSectionDialog():void
	{
		this.insertSectionDialog.setLocationRelativeTo(this);
		this.insertSectionDialog.setVisible(true);
	}
	ISMensuralButton:JRadioButton;
	ISChantButton:JRadioButton;
	ISTextButton:JRadioButton;
	insertSectionOKButton:JButton;
	insertSectionCancelButton:JButton;

	createInsertSectionDialog():void
	{
		this.insertSectionDialog = new JDialog(this,"Insert new section",true);
		let optionsPane:JPanel = new JPanel();
		optionsPane.setLayout(new BoxLayout(optionsPane,BoxLayout.Y_AXIS));
		optionsPane.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Section type"),BorderFactory.createEmptyBorder(5,5,5,5)));
		this.ISMensuralButton = new JRadioButton("Mensural music",true);
		this.ISChantButton = new JRadioButton("Plainchant");
		this.ISTextButton = new JRadioButton("Text");
		let SectionTypeGroup:ButtonGroup = new ButtonGroup();
		SectionTypeGroup.add(this.ISMensuralButton);
		SectionTypeGroup.add(this.ISChantButton);
		SectionTypeGroup.add(this.ISTextButton);
		optionsPane.add(this.ISMensuralButton);
		optionsPane.add(this.ISChantButton);
		optionsPane.add(this.ISTextButton);
		this.insertSectionOKButton = new JButton("Insert");
		this.insertSectionCancelButton = new JButton("Cancel");
		let buttonPane:Box = Box.createHorizontalBox();
		buttonPane.add(Box.createHorizontalGlue());
		buttonPane.add(this.insertSectionOKButton);
		buttonPane.add(Box.createHorizontalStrut(10));
		buttonPane.add(this.insertSectionCancelButton);
		buttonPane.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
		let gpcp:Container = this.insertSectionDialog.getContentPane();
		gpcp.add(optionsPane,BorderLayout.CENTER);
		gpcp.add(buttonPane,BorderLayout.SOUTH);
		this.insertSectionOKButton.addActionListener(this);
		this.insertSectionCancelButton.addActionListener(this);
		this.insertSectionDialog.pack();
	}

	/* action buttons */
	/* lay out frame */
	/* register listeners */
	/*------------------------------------------------------------------------
Method:  void insertNewSection()
Purpose: Insert new section, type based on dialog selection
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	insertNewSection():void
	{
		let newSectionType:number = MusicSection.MENSURAL_MUSIC;
		if( this.ISChantButton.isSelected())
			newSectionType = MusicSection.PLAINCHANT;
		else
			if( this.ISTextButton.isSelected())
				newSectionType = MusicSection.TEXT;

		this.EditScr.insertSection(newSectionType);
		this.insertSectionDialog.setVisible(false);
	}

	/*------------------------------------------------------------------------
Method:  void deleteSection(int snum)
Purpose: Delete one section
Parameters:
  Input:  int snum - number of section to delete
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public deleteSection_2(snum:number):void
	{
		this.EditScr.deleteSection_1(snum);
	}

	/*------------------------------------------------------------------------
Method:  void combineSectionWithNext()
Purpose: Combine section currently holding cursor with following section
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public combineSectionWithNext_2():void
	{
		this.EditScr.combineSectionWithNext_1();
	}

	/*------------------------------------------------------------------------
Method:  void showTextEditorFrame()
Purpose: Show panel for editing text for music
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	initVoiceTextAreas():void
	{
	}

	/*    voiceTextAreasPanel.setLayout(new GridBagLayout());
    GridBagConstraints vtc=new GridBagConstraints();
    vtc.anchor=GridBagConstraints.LINE_START;
    voiceTextAreasPanel.setBorder(BorderFactory.createCompoundBorder(
      BorderFactory.createTitledBorder("Voice texts"),
      BorderFactory.createEmptyBorder(5,5,5,5)));

    Voice[] voices=musicData.getVoiceData();
    int     numvoices=voices.length;
    voiceTextAreas=new JTextPane[numvoices];
    for (int i=0; i<numvoices; i++)
      {
        JTextPane   curTP=new JTextPane();
        JScrollPane curSP=new JScrollPane(curTP);
        curTP.setEditable(false);
        curSP.setPreferredSize(new Dimension(350,40));
        curSP.setMinimumSize(new Dimension(10,10));
        JLabel curL=new JLabel(voices[i].getName());
        curL.setLabelFor(curSP);
        curL.setBorder(BorderFactory.createEmptyBorder(0,5,0,5));
        vtc.gridx=0; vtc.gridy=i; voiceTextAreasPanel.add(curL,vtc);
        vtc.gridx=1; vtc.gridy=i; voiceTextAreasPanel.add(curSP,vtc);

        voiceTextAreas[i]=curTP;
      }*/
	public reinitVoiceTextAreas():void
	{
	}

	/*    voiceTextAreasPanel.removeAll();
    initVoiceTextAreas();
    textEditorFrame.pack();*/
	showTextEditorFrame():void
	{
		let tex:number =(( this.getLocation().x + this.getSize().width) | 0);
		let tey:number = this.getLocation().y;
		let teWidth:number = this.textEditorFrame.getSize().width;
		let teHeight:number = this.textEditorFrame.getSize().height;
		let screenSize:Dimension = Toolkit.getDefaultToolkit().getScreenSize();
		if((( tex + teWidth) | 0) > screenSize.width)
			tex =(( screenSize.width - teWidth) | 0);

		if((( tey + teHeight) | 0) > screenSize.height)
			tey =(( screenSize.height - teHeight) | 0);

		this.textEditorFrame.setLocation(tex,tey);
		this.textEditorFrame.setVisible(true);
	}

	/* position relative to parent frame */
	closeTextEditorFrame():void
	{
		this.textEditorFrame.setVisible(false);
	}

	textEditorFrameEnabled():boolean
	{
		return this.textEditorFrame.isVisible();
	}

	/*------------------------------------------------------------------------
Method:  void addOriginalText(String t)
Purpose: Insert string as new OriginalText event
Parameters:
  Input:  String t - text to insert
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addOriginalText_3(t:string):void
	{
		this.EditScr.addOriginalText_1(t);
	}

	/*------------------------------------------------------------------------
Method:  void setNoteSyllable(String t,boolean wordEnd)
Purpose: Set text syllable on currently highlighted note
Parameters:
  Input:  String t        - syllable text
          boolean wordEnd - word end?
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setNoteSyllable_2(t:string,wordEnd:boolean):void
	{
		this.EditScr.setNoteSyllable_1(t,wordEnd);
		this.highlightNextNote();
	}

	/*------------------------------------------------------------------------
Method:  void highlight[Next|Previous]Note()
Purpose: Highlight next or previous note event from current cursor position
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	highlightNextNote():void
	{
		let snum:number = this.EditScr.getCurSectionNum();
		let vnum:number = this.EditScr.getCurVoiceNum();
		let eventnum:number = this.EditScr.getCurEventNum();
		if( this.EditScr.oneItemHighlighted())
			eventnum ++;

		let nextnenum:number = this.EditScr.getNeighboringEventNumOfType(Event.EVENT_NOTE,snum,vnum,eventnum,1);
		if( nextnenum == - 1)
			this.EditScr.moveCursor(snum,vnum,eventnum);
		else
			this.EditScr.highlightOneItem(snum,vnum,nextnenum);

	}

	/* no note, just move cursor */
	highlightPreviousNote():void
	{
		let snum:number = this.EditScr.getCurSectionNum();
		let vnum:number = this.EditScr.getCurVoiceNum();
		let eventnum:number = this.EditScr.getCurEventNum();
		let nextnenum:number = this.EditScr.getNeighboringEventNumOfType(Event.EVENT_NOTE,snum,vnum,(( eventnum - 1) | 0),- 1);
		if( nextnenum == - 1)
			this.EditScr.moveCursor(snum,vnum,eventnum);
		else
			this.EditScr.highlightOneItem(snum,vnum,nextnenum);

	}

	/* no note, just move cursor */
	/*------------------------------------------------------------------------
Method:  void loadVoiceNamesInComboBox(JComboBox cb)
Purpose: Initialize combo box with names of voices
Parameters:
  Input:  JComboBox cb - box to init
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public loadVoiceNamesInComboBox(cb:JComboBox<string>):void
	{
		for(let v of this.musicData.getVoiceData())
		cb.addItem(v.getName());
	}

	/*------------------------------------------------------------------------
Method:  String voice[Orig|Mod]TextToStr(int vnum)
Purpose: Create string containing all texting in one voice (original or
         modern)
Parameters:
  Input:  int vnum - number of voice
  Output: -
  Return: String containing all text in voice
------------------------------------------------------------------------*/
	public voiceOrigTextToStr(vnum:number):string
	{
		return this.EditScr.getMusicData_1().voiceOrigTextToStr(vnum);
	}

	public voiceModTextToStr(vnum:number):string
	{
		return this.EditScr.getMusicData_1().voiceModTextToStr(vnum);
	}

	/*------------------------------------------------------------------------
Method:  void open[Modern]TextDeleteDialog()
Purpose: Show text deletion dialog
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	openOriginalTextDeleteDialog():void
	{
		new OriginalTextDeleteDialog(this);
	}

	openModernTextDeleteDialog():void
	{
		new ModernTextDeleteDialog(this);
	}

	/*------------------------------------------------------------------------
Method:  void deleteOriginalText(ArrayList<VariantVersionData> versions,boolean[] voices)
Purpose: Delete original text from a given set of versions/voices
Parameters:
  Input:  ArrayList<VariantVersionData> versions - versions from which to delete
          boolean[] voices                       - voices from which to delete
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public deleteOriginalText(versions:ArrayList<VariantVersionData>,voices:boolean[]):void
	{
		let modified:boolean = false;
		for(let vvd of versions)
		{
			if( this.musicData.deleteOriginalText(vvd,voices))
				modified = true;

		}
		this.musicData.consolidateAllReadings();
		if( modified)
			this.fileModified_2();

		this.EditScr.resetMusicData();
	}

	/* rerender and reset EditScr */
	public deleteModernText(voices:boolean[]):void
	{
		let modified:boolean = this.musicData.deleteModernText(voices);
		if( modified)
			this.fileModified_2();

		this.EditScr.resetMusicData();
	}

	/* rerender and reset EditScr */
	/*------------------------------------------------------------------------
Method:  void setVersionTextAsDefault(VariantVersionData v)
Purpose: Set the original texting of one version as the default
Parameters:
  Input:  VariantVersionData v - version to get text from
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setVersionTextAsDefault(v:VariantVersionData):void
	{
		if( v.isDefault())
			return;

		let modified:boolean = this.musicData.setVersionTextAsDefault(v);
		this.musicData.consolidateAllReadings();
		if( modified)
			this.fileModified_2();

		this.EditScr.resetMusicData();
	}

	/* rerender and reset EditScr */
	setCurrentVersionAsDefault():void
	{
		let v:VariantVersionData = this.getCurrentVariantVersion_2();
		if( v.isDefault() || ! this.confirmAction("Copy readings from version " + v.getID() + " to default?","Confirm new default readings"))
			return;

		let modified:boolean = this.musicData.setVersionAsDefault(v);
		this.musicData.consolidateAllReadings();
		if( modified)
			this.fileModified_2();

		this.EditScr.resetMusicData();
	}

	/* rerender and reset EditScr */
	/*------------------------------------------------------------------------
Method:  ViewCanvas createMusicCanvas(PieceData p,MusicFont mf,MusicWin mw,OptionSet os)
Purpose: Create music editing area
Parameters:
  Input:  PieceData p,MusicFont mf,MusicWin mw,OptionSet os - constructor params
  Output: -
  Return: editing canvas
------------------------------------------------------------------------*/
	public createMusicCanvas_1(p:PieceData,mf:MusicFont,mw:MusicWin,os:OptionSet):ViewCanvas
	{
		return new ScoreEditorCanvas(p,mf,mw,os);
	}

	/*------------------------------------------------------------------------
Method:  void setKeyboardHandler()
Purpose: Add keyboard handler
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setKeyboardHandler_1():void
	{
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
		if( item == this.FileMenuNew)
			EditorWin.newfile();
		else
			if( item == this.FileMenuOpen)
				this.fileChooseAndOpen();
			else
				if( item == this.FileMenuSave)
					this.fileSave();
				else
					if( item == this.FileMenuSaveAs)
						this.fileSaveAs();
					else
						if( item == this.FMExportMIDI)
							this.fileExportAs(EditorWin.FILETYPE_MIDI);
						else
							if( item == this.FMExportXML)
								this.fileExportAs(EditorWin.FILETYPE_XML);
							else
								if( item == this.FileMenuGeneratePDF)
									{
										let tmppw:PartsWin = PartsWin.new0_8(this.musicData,this.MusicGfx,this,true);
										let pdfname:string =( this.windowFileName == "Untitled score") ? "untitled.pdf":"data/PDFout/" + this.windowFileName.replaceFirst("cmme\\.xml","pdf");
										try
										{
											PDFCreator.new0(tmppw.getRenderLists()).createPDF_2(pdfname);
										}
										catch( e)
										{
											if( e instanceof Exception)
												{
													this.handleRuntimeError(e);
												}

											else
												throw e;

										}
										tmppw.closewin_3();
									}

								else
									if( item == this.FileMenuClose)
										this.closewin_1();
									else
										if( item == this.FileMenuExit)
											EditorWin.exitprogram();
										else
											if( item == this.EditMenuCopy)
												this.clipboardCopy_2();
											else
												if( item == this.EditMenuCut)
													this.clipboardCut_2();
												else
													if( item == this.EditMenuPaste)
														this.clipboardPaste_2();
													else
														if( item == this.EditMenuSelectAll)
															this.EditScr.highlightAll();
														else
															if( item == this.EditMenuDelete)
																this.EditScr.deleteHighlightedItems();
															else
																if( item == this.EditMenuGeneralInformation)
																	this.editGeneralInfo();
																else
																	if( item == this.SectionsMenuInsertSection)
																		this.showInsertSectionDialog();
																	else
																		if( item == this.SectionsMenuInsertSectionBreak)
																			this.EditScr.splitMensuralSection();
																		else
																			if( item == this.TextMenuOpenEditor)
																				this.showTextEditorFrame();
																			else
																				if( item == this.TextMenuSetCurrentAsDefault)
																					this.setVersionTextAsDefault(this.getCurrentVariantVersion_2());
																				else
																					if( item == this.TextMenuDeleteOriginalText)
																						this.openOriginalTextDeleteDialog();
																					else
																						if( item == this.TextMenuDeleteModernText)
																							this.openModernTextDeleteDialog();
																						else
																							if( item == this.VersionsMenuGeneralInfo)
																								this.editVariantVersionInfo();
																							else
																								if( item == this.VersionsMenuSetVersionAsDefault)
																									this.setCurrentVersionAsDefault();
																								else
																									if( item == this.VersionsMenuNewNotesWindow)
																										this.openNewNotesWindow();
																									else
																										if( item == this.VersionsMenuSourceAnalysis)
																											this.openSourceAnalysisWindow();
																										else
																											if( item == this.ViewMenuViewParts)
																												this.openPartsLayout_1(false);
																											else
																												if( item == this.ViewMenuPrintPreview)
																													this.openPartsLayout_1(true);
																												else
																													if( item == this.ViewMenuOpenInViewer)
																														this.openInViewer();
																													else
																														if( item == this.MTZoomControl.viewSizeField)
																															this.ViewSizeFieldAction();
																														else
																															if( item == this.VMVSZoomOut || item == this.MTZoomControl.zoomOutButton)
																																this.zoomOut_2();
																															else
																																if( item == this.VMVSZoomIn || item == this.MTZoomControl.zoomInButton)
																																	this.zoomIn_2();
																																else
																																	if( item == this.insertSectionOKButton)
																																		this.insertNewSection();
																																	else
																																		if( item == this.insertSectionCancelButton)
																																			this.insertSectionDialog.setVisible(false);
																																		else
																																			if( item == this.eventEditorialCheckBox)
																																				this.EditScr.toggleEditorial();
																																			else
																																				if( item == this.eventErrorCheckBox)
																																					this.EditScr.toggleError();
																																				else
																																					if( this.mensurationChooserEnabled())
																																						{
																																							if( item == this.mensurationPanel.mensOButton)
																																								this.EditScr.addMensurationElementSign(MensSignElement.MENS_SIGN_O);
																																							else
																																								if( item == this.mensurationPanel.mensCButton)
																																									this.EditScr.addMensurationElementSign(MensSignElement.MENS_SIGN_C);
																																								else
																																									if( item == this.mensurationPanel.mens2Button)
																																										this.EditScr.addMensurationElementNumber_2(2);
																																									else
																																										if( item == this.mensurationPanel.mens3Button)
																																											this.EditScr.addMensurationElementNumber_2(3);
																																										else
																																											if( item == this.mensurationPanel.deleteButton)
																																												this.EditScr.deleteMensurationElement(this.mensurationPanel.getSelectedElementNum());
																																											else
																																												if( item == this.mensurationPanel.mensDotBox)
																																													this.EditScr.toggleMensurationDot();
																																												else
																																													if( item == this.mensurationPanel.mensStrokeBox)
																																														this.EditScr.toggleMensurationStroke();
																																													else
																																														if( item == this.mensurationPanel.mensReverseBox)
																																															this.EditScr.setMensurationSign(this.mensurationPanel.mensReverseBox.isSelected() ? MensSignElement.MENS_SIGN_CREV:MensSignElement.MENS_SIGN_C);
																																														else
																																															if( item == this.mensurationPanel.mensNoScoreSigBox)
																																																this.EditScr.toggleMensurationNoScoreSig();
																																															else
																																																if( this.mensurationPanel.isMensurationButton(item))
																																																	this.EditScr.setEventMensuration(this.mensurationPanel.createMensuration());

																																						}

																																					else
																																						if( this.colorationChooserEnabled() &&( item == this.colorationPanel.PrimaryColorChooser || item == this.colorationPanel.PrimaryFillChooser || item == this.colorationPanel.SecondaryColorChooser || item == this.colorationPanel.SecondaryFillChooser))
																																							{
																																								let pci:number = this.colorationPanel.PrimaryColorChooser.getSelectedIndex();
																																								let pfi:number = this.colorationPanel.PrimaryFillChooser.getSelectedIndex();
																																								let sci:number = this.colorationPanel.SecondaryColorChooser.getSelectedIndex();
																																								let sfi:number = this.colorationPanel.SecondaryFillChooser.getSelectedIndex();
																																								if( item == this.colorationPanel.PrimaryColorChooser)
																																									sci = pci;
																																								else
																																									if( item == this.colorationPanel.PrimaryFillChooser)
																																										sfi = Coloration.complementaryFill(pfi);

																																								this.EditScr.setEventColoration(Coloration.new0(pci,pfi,sci,sfi));
																																							}

																																						else
																																							if( this.annotationEditorEnabled() && item == this.annotationTextField)
																																								this.EditScr.setAnnotationText(this.annotationTextField.getText());
																																							else
																																								if( item == this.editingOptionsFrame.colorationTypeImperfectio)
																																									this.EditScr.setEditorColorationType(Coloration.IMPERFECTIO);
																																								else
																																									if( item == this.editingOptionsFrame.colorationTypeSesquialtera)
																																										this.EditScr.setEditorColorationType(Coloration.SESQUIALTERA);
																																									else
																																										if( item == this.editingOptionsFrame.colorationTypeMinorColor)
																																											this.EditScr.setEditorColorationType(Coloration.MINOR_COLOR);

		for(
		let i:number = 0;i < this.NoteValueButtons.length;i ++)
		if( item == this.NoteValueButtons[i])
			{
				this.selectNVButton(i);
				return;
			}

		for(
		let i:number = 0;i < this.RestValueButtons.length;i ++)
		if( item == this.RestValueButtons[i])
			{
				if( this.EditScr.getHighlightBegin() == - 1)
					this.EditScr.addRest(EditorWin.NVButtonVals[i]);
				else
					if( this.EditScr.oneItemHighlighted() && this.EditScr.getCurEvent_2().getEvent_1().geteventtype() == Event.EVENT_REST)
						this.EditScr.modifyNoteType(EditorWin.NVButtonVals[i]);

				return;
			}

		for(
		let i:number = 0;i < this.ClefButtons.length;i ++)
		if( item == this.ClefButtons[i])
			{
				this.EditScr.doClefAction_1(EditorWin.ClefButtonVals[i]);
				return;
			}

		for(
		let i:number = 0;i < this.MiscButtons.length;i ++)
		if( item == this.MiscButtons[i])
			{
				switch( i)
				{
					case EditorWin.MISC_BUTTON_DOT:
					{
						this.EditScr.addDot_2(DotEvent.DT_Addition);
						break;
					}
					case EditorWin.MISC_BUTTON_DOTDIV:
					{
						this.EditScr.addDot_2(DotEvent.DT_Division);
						break;
					}
				}
				return;
			}

		for(
		let i:number = 0;i < this.MensButtons.length;i ++)
		if( item == this.MensButtons[i])
			{
				switch( i)
				{
					case EditorWin.MENS_BUTTON_O:
					{
						this.EditScr.doMensurationAction(MensSignElement.MENS_SIGN_O);
						break;
					}
					case EditorWin.MENS_BUTTON_C:
					{
						this.EditScr.doMensurationAction(MensSignElement.MENS_SIGN_C);
						break;
					}
					case EditorWin.MENS_BUTTON_DOT:
					{
						this.EditScr.toggleMensurationDot();
						break;
					}
					case EditorWin.MENS_BUTTON_STROKE:
					{
						this.EditScr.toggleMensurationStroke();
						break;
					}
					case EditorWin.MENS_BUTTON_3:
					{
						this.EditScr.doMensurationNumberAction(3);
						break;
					}
					case EditorWin.MENS_BUTTON_2:
					{
						this.EditScr.doMensurationNumberAction(2);
						break;
					}
				}
				return;
			}

		if( item == this.variantVersionsBox)
			this.setCurrentVariantVersion_2(this.variantVersionsBox.getSelectedIndex());
		else
			if( item == this.PlayButton)
				this.toggleMIDIPlay();

	}

	/* File Menu */
	/* Edit Menu */
	/* Text Menu */
	/* Versions Menu */
	/* View Menu */
	/* Insert Section dialog */
	/* editor frames */
	/* editing options */
	/* toolbar note buttons */
	/* toolbar rest buttons */
	/* toolbar clef buttons */
	/* toolbar misc buttons */
	/* toolbar mensuration buttons */
	/* toolbar versions box */
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
		let item:any = event.getItemSelectable();
		if( item == this.EditMenuDisplayEventEditor)
			this.eventEditorFrame.setVisible(this.EditMenuDisplayEventEditor.isSelected());
		else
			if( item == this.EditMenuEditingOptions)
				this.editingOptionsFrame.setVisible(this.EditMenuEditingOptions.isSelected());
			else
				if( item == this.editingOptionsFrame.colorationOnCheckBox)
					this.setInputColorationOn(this.editingOptionsFrame.colorationOnCheckBox.isSelected());
				else
					if( item == this.SectionsMenuDisplaySectionAttribs)
						this.showSectionAttribsFrame(this.SectionsMenuDisplaySectionAttribs.isSelected());

		super.itemStateChanged(event);
	}

	/*------------------------------------------------------------------------
Method:     void [insert|remove|changed]Update(DocumentEvent e)
Implements: DocumentListener.[insert|remove|changed]Update
Purpose:    Check for changes to commentary text area and take appropriate
            action
Parameters:
  Input:  DocumentEvent e - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public insertUpdate(e:DocumentEvent):void
	{
		this.doDocChange();
	}

	public removeUpdate(e:DocumentEvent):void
	{
		this.doDocChange();
	}

	public changedUpdate(e:DocumentEvent):void
	{
	}

	/* actual change handler (for both insertion and deletion) */
	doDocChange():void
	{
		if( this.commentaryGUIupdating > 0)
			{
				return;
			}

		this.commentaryGUIupdating ++;
		this.EditScr.setEventCommentary(this.commentaryTextArea.getText());
		this.commentaryGUIupdating --;
	}

	//        commentaryGUIupdating--;
	/*------------------------------------------------------------------------
Method:  boolean fileSaveAs()
Purpose: Choose new file name and save score
Parameters:
  Input:  -
  Output: -
  Return: whether file saved successfully
------------------------------------------------------------------------*/
	fileSaveAs():boolean
	{
		return false;
	}

	//CHANGE
	/* 
    String origWindowFileName=new String(windowFileName),
           origWindowFilePath=windowFilePath==null ? null : new String(windowFilePath);

    int fcval=getSaveFileChooser().showSaveDialog(this);

    if (fcval==JFileChooser.APPROVE_OPTION)
      try
        {
          File saveFile=saveFileChooser.getSelectedFile();

          //make sure extension is valid 
          String fn=saveFile.getCanonicalPath();
          if (!isCMMEFilename(fn))
            {
              fn+=FILENAME_EXTENSION_CMME;
              saveFile=new File(fn);
            }

          if (doNotOverwrite(saveFile))
            return false;

          // save 
          windowFileName=saveFile.getName();
          windowFilePath=fn;
          writeCMMEFile(saveFile);

          return true;
        }
      catch (Exception e)
        {
          displayErrorMessage("Error saving file \""+musicWinFileChooser.getSelectedFile().getName()+"\":\n"+e,"File not saved");

//          System.err.println("Error saving "+musicWinFileChooser.getSelectedFile().getName());
//          e.printStackTrace();

          windowFileName=origWindowFileName;
          windowFilePath=origWindowFilePath;
        }

    return false;*/
	//CHANGE
	/*------------------------------------------------------------------------
Method:  boolean fileSave()
         void writeCMMEFile(File f)
Purpose: Save current score into file
Parameters:
  Input:  File f - file to save into
  Output: -
  Return: whether file saved successfully
------------------------------------------------------------------------*/
	fileSave():boolean
	{
		try
		{
			this.writeCMMEFile(new File(this.windowFilePath));
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					this.handleRuntimeError(e);
					return false;
				}

			else
				throw e;

		}
		return true;
	}

	// if (windowFilePath==null)
	//   return fileSaveAs();
	// else
	//          System.err.println("Error saving "+windowFilePath);
	//          e.printStackTrace();
	//displayErrorMessage("Error saving "+windowFilePath+":\n"+e,"File not saved");
	writeCMMEFile(f:File):void
	{
		CMMEParser.outputPieceData(this.musicData,new FileOutputStream(f));
		this.addCMMETitle_1(this.windowFileName);
		this.modified = false;
	}

	/*------------------------------------------------------------------------
Method:  void fileModified()
Purpose: Update GUI to reflect modification of the current file from its
         last saved state
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	fileModified_2():void
	{
		if( this.modified)
			return;

		this.modified = true;
		this.setTitle(this.getTitle() + " (modified)");
	}

	/*------------------------------------------------------------------------
Method:    void unregisterMenuListeners()
Overrides: Gfx.MusicWin.unregisterMenuListeners
Purpose: Remove all action/item/etc listeners when disposing of window
         resources
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	/* 
private WindowFocusListener[] eventEditorFramegetListeners(Object o) //CHANGE
	{
		throw new RuntimeException();
	}*/
	/*private WindowFocusListener[] getListeners(Object o) //CHANGE
	{
		throw new RuntimeException();
	}*/
	public unregisterListeners_3():void
	{
		let wl:WindowFocusListener[]= this.getListeners("WindowFocusListener");
		for(
		let i:number = 0;i < wl.length;i ++)
		this.removeWindowFocusListener(wl[i]);
		super.unregisterListeners_3();
	}

	public unregisterToolListeners_1():void
	{
		this.FileMenuNew.removeActionListener(this);
		this.FileMenuOpen.removeActionListener(this);
		this.FileMenuSave.removeActionListener(this);
		this.FileMenuSaveAs.removeActionListener(this);
		this.FMExportMIDI.removeActionListener(this);
		this.FMExportXML.removeActionListener(this);
		this.FileMenuGeneratePDF.removeActionListener(this);
		this.FileMenuClose.removeActionListener(this);
		this.FileMenuExit.removeActionListener(this);
		this.EditMenuCopy.removeActionListener(this);
		this.EditMenuCut.removeActionListener(this);
		this.EditMenuPaste.removeActionListener(this);
		this.EditMenuSelectAll.removeActionListener(this);
		this.EditMenuDelete.removeActionListener(this);
		this.EditMenuGeneralInformation.removeActionListener(this);
		this.EditMenuDisplayEventEditor.removeItemListener(this);
		this.EditMenuEditingOptions.removeItemListener(this);
		this.SectionsMenuInsertSectionBreak.removeActionListener(this);
		this.SectionsMenuInsertSection.removeActionListener(this);
		this.SectionsMenuDisplaySectionAttribs.removeActionListener(this);
		this.TextMenuOpenEditor.removeActionListener(this);
		this.TextMenuSetCurrentAsDefault.removeActionListener(this);
		this.TextMenuDeleteOriginalText.removeActionListener(this);
		this.TextMenuDeleteModernText.removeActionListener(this);
		for(
		let i:number = 0;i < this.VMVSnumItems.length;i ++)
		this.VMVSnumItems[i].removeActionListener(this.VSListener);
		for(
		let i:number = 0;i < this.VMBSItems.length;i ++)
		this.VMBSItems[i].removeActionListener(this.VMBSListener);
		this.VMVSZoomOut.removeActionListener(this);
		this.VMVSZoomIn.removeActionListener(this);
		this.VMTOrigText.removeActionListener(this);
		this.VMTModText.removeActionListener(this);
		this.VMTBothText.removeActionListener(this);
		this.ViewMenuUsemodernclefs.removeItemListener(this);
		this.ViewMenuDisplayEditorialAccidentals.removeItemListener(this);
		this.ViewMenuModernAccidentalSystem.removeItemListener(this);
		this.ViewMenuDisplayallnewlineclefs.removeItemListener(this);
		this.ViewMenuDisplayligbrackets.removeItemListener(this);
		this.ViewMenuEdCommentary.removeItemListener(this);
		this.ViewMenuViewParts.removeActionListener(this);
		this.ViewMenuPrintPreview.removeActionListener(this);
		this.ViewMenuOpenInViewer.removeActionListener(this);
		this.VersionsMenuGeneralInfo.removeActionListener(this);
		this.VersionsMenuSetVersionAsDefault.removeActionListener(this);
		this.VersionsMenuNewNotesWindow.removeActionListener(this);
		this.VersionsMenuSourceAnalysis.removeActionListener(this);
		for(
		let i:number = 0;i < this.NoteValueButtons.length;i ++)
		this.NoteValueButtons[i].removeActionListener(this);
		for(
		let i:number = 0;i < this.RestValueButtons.length;i ++)
		this.RestValueButtons[i].removeActionListener(this);
		for(
		let i:number = 0;i < this.ClefButtons.length;i ++)
		this.ClefButtons[i].removeActionListener(this);
		for(
		let i:number = 0;i < this.MiscButtons.length;i ++)
		this.MiscButtons[i].removeActionListener(this);
		for(
		let i:number = 0;i < this.MensButtons.length;i ++)
		this.MensButtons[i].removeActionListener(this);
		this.MTZoomControl.removeListeners_2();
		this.variantVersionsBox.removeActionListener(this);
		this.PlayButton.removeActionListener(this);
		for(let wl of this.eventEditorFrame.getListeners("WindowListener"))
		this.removeWindowListener(wl);
		this.editingOptionsFrame.removeListeners_3();
		this.sectionAttribsFrame.unregisterListeners_6();
		this.eventProportion1.removeChangeListener(this);
		this.eventProportion2.removeChangeListener(this);
		this.eventEditorialCheckBox.removeActionListener(this);
		this.eventErrorCheckBox.removeActionListener(this);
		this.commentaryTextArea.getDocument().removeDocumentListener(this);
		this.mensurationPanel.mensOButton.removeActionListener(this);
		this.mensurationPanel.mensCButton.removeActionListener(this);
		this.mensurationPanel.mens2Button.removeActionListener(this);
		this.mensurationPanel.mens3Button.removeActionListener(this);
		this.mensurationPanel.deleteButton.removeActionListener(this);
		this.mensurationPanel.mensDotBox.removeActionListener(this);
		this.mensurationPanel.mensStrokeBox.removeActionListener(this);
		this.mensurationPanel.mensReverseBox.removeActionListener(this);
		this.mensurationPanel.mensNoScoreSigBox.removeActionListener(this);
		this.mensurationPanel.prolatioBinaryButton.removeActionListener(this);
		this.mensurationPanel.prolatioTernaryButton.removeActionListener(this);
		this.mensurationPanel.tempusBinaryButton.removeActionListener(this);
		this.mensurationPanel.tempusTernaryButton.removeActionListener(this);
		this.mensurationPanel.modus_minorBinaryButton.removeActionListener(this);
		this.mensurationPanel.modus_minorTernaryButton.removeActionListener(this);
		this.mensurationPanel.modus_maiorBinaryButton.removeActionListener(this);
		this.mensurationPanel.modus_maiorTernaryButton.removeActionListener(this);
		this.colorationPanel.PrimaryColorChooser.removeActionListener(this);
		this.colorationPanel.PrimaryFillChooser.removeActionListener(this);
		this.colorationPanel.SecondaryColorChooser.removeActionListener(this);
		this.colorationPanel.SecondaryFillChooser.removeActionListener(this);
		this.annotationTextField.removeActionListener(this);
		this.textEditorFrame.unregisterListeners_7();
	}

	//CHANGE
	/*------------------------------------------------------------------------
Method:    boolean closewin()
Overrides: Gfx.MusicWin.closewin
Purpose:   Close window and dependents
Parameters:
  Input:  -
  Output: -
  Return: whether window was closed or not
------------------------------------------------------------------------*/
	public closewin_1():boolean
	{
		if( this.modified)
			{
				let confirm_option:number = JOptionPane.showConfirmDialog(this,"Save changes to " + this.windowFileName + "?","File not saved",JOptionPane.YES_NO_CANCEL_OPTION,JOptionPane.WARNING_MESSAGE);
				switch( confirm_option)
				{
					case JOptionPane.YES_OPTION:
					{
						if( this.fileSave() == false)
							return false;

						break;
					}
					case JOptionPane.NO_OPTION:
					{
						break;
					}
					case JOptionPane.CANCEL_OPTION:
					{
						return false;
					}
					default:
					{
						return false;
					}
				}
			}

		this.stopMIDIPlay();
		EditorWin.fileWindows.remove(this);
		this.EditScr.stopThreads();
		let openNotesWindows:ArrayList<CriticalNotesWindow> = new ArrayList<CriticalNotesWindow>(this.notesWindows);
		for(let cnw of openNotesWindows)
		cnw.closeFrame_2();
		this.genPDFDialog.dispose();
		this.insertSectionDialog.dispose();
		this.unregisterListeners_3();
		if( this.partsWin != null)
			this.partsWin.closewin_3();

		this.textEditorFrame.dispose();
		this.dispose();
		return true;
	}
}
