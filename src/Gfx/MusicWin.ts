
import { Exception } from '../java/lang/Exception';
import { System } from '../java/lang/System';
import { Integer } from '../java/lang/Integer';
import { Float } from '../java/lang/Float';
import { Math } from '../java/lang/Math';
import { ZoomControl } from './ZoomControl';
import { ViewCanvas } from './ViewCanvas';
import { VariantDisplayOptionsFrame } from './VariantDisplayOptionsFrame';
import { VariantAnalysisList } from './VariantAnalysisList';
import { ScorePageRenderer } from './ScorePageRenderer';
import { ScorePagePreviewWin } from './ScorePagePreviewWin';
import { ScorePageCanvas } from './ScorePagePreviewWin';
import { RenderList } from './RenderList';
import { PDFCreator } from './PDFCreator';
import { PartPainter } from './PartsWin';
import { IncipitView } from './PartsWin';
import { VoicePartView } from './PartsWin';
import { PartsSizeParams } from './PartsWin';
import { PartsWin } from './PartsWin';
import { OptionSet } from './OptionSet';
import { MusicXMLGenerator } from './MusicXMLGenerator';
import { } from './MusicXMLGenerator';
import { } from './MusicXMLGenerator';
import { } from './MusicXMLGenerator';
import { } from './MusicXMLGenerator';
import { } from './MusicXMLGenerator';
import { MusicFont } from './MusicFont';
import { MIDIPlayer } from './MIDIPlayer';
import { SequenceParams } from './MIDIPlayer';
import { MessageWin } from './MessageWin';
import { GeneralInfoFrame } from './GeneralInfoFrame';
import { CriticalNotesWindow } from './CriticalNotesWindow';
import { File } from '../java/io/File';
import { ArrayList } from '../java/util/ArrayList';
import { LinkedList } from '../java/util/LinkedList';
import { FileFilter } from '../javax/swing/filechooser/FileFilter';
import { URL } from '../java/net/URL';
import { ImageIO } from '../javax/imageio/ImageIO';
import { JPanel } from '../javax/swing/JPanel';
import { Box } from '../javax/swing/Box';
import { JFileChooser } from '../javax/swing/JFileChooser';
import { JDialog } from '../javax/swing/JDialog';
import { ImageIcon } from '../javax/swing/ImageIcon';
import { JMenu } from '../javax/swing/JMenu';
import { BorderFactory } from '../javax/swing/BorderFactory';
import { BoxLayout } from '../javax/swing/BoxLayout';
import { JRadioButton } from '../javax/swing/JRadioButton';
import { ButtonGroup } from '../javax/swing/ButtonGroup';
import { JFrame } from '../javax/swing/JFrame';
import { JButton } from '../javax/swing/JButton';
import { KeyStroke } from '../javax/swing/KeyStroke';
import { JMenuItem } from '../javax/swing/JMenuItem';
import { JCheckBoxMenuItem } from '../javax/swing/JCheckBoxMenuItem';
import { JScrollBar } from '../javax/swing/JScrollBar';
import { JMenuBar } from '../javax/swing/JMenuBar';
import { JEditorPane } from '../javax/swing/JEditorPane';
import { JScrollPane } from '../javax/swing/JScrollPane';
import { JOptionPane } from '../javax/swing/JOptionPane';
import { JLabel } from '../javax/swing/JLabel';
import { JRadioButtonMenuItem } from '../javax/swing/JRadioButtonMenuItem';
import { JToolBar } from '../javax/swing/JToolBar';
import { Dimension } from '../java/awt/Dimension';
import { Component } from '../java/awt/Component';
import { Image } from '../java/awt/Image';
import { Color } from '../java/awt/Color';
import { Container } from '../java/awt/Container';
import { Toolkit } from '../java/awt/Toolkit';
import { GridBagConstraints } from '../java/awt/GridBagConstraints';
import { Graphics2D } from '../java/awt/Graphics2D';
import { GridBagLayout } from '../java/awt/GridBagLayout';
import { Insets } from '../java/awt/Insets';
import { BorderLayout } from '../java/awt/BorderLayout';
import { WindowAdapter } from '../java/awt/event/WindowAdapter';
import { ComponentAdapter } from '../java/awt/event/ComponentAdapter';
import { WindowListener } from '../java/awt/event/WindowListener';
import { ComponentEvent } from '../java/awt/event/ComponentEvent';
import { WindowEvent } from '../java/awt/event/WindowEvent';
import { KeyEvent } from '../java/awt/event/KeyEvent';
import { ItemListener } from '../java/awt/event/ItemListener';
import { WindowFocusListener } from '../java/awt/event/WindowFocusListener';
import { ActionEvent } from '../java/awt/event/ActionEvent';
import { ComponentListener } from '../java/awt/event/ComponentListener';
import { ActionListener } from '../java/awt/event/ActionListener';
import { ItemEvent } from '../java/awt/event/ItemEvent';
import { AdjustmentListener } from '../java/awt/event/AdjustmentListener';
import { AdjustmentEvent } from '../java/awt/event/AdjustmentEvent';
import { BufferedImage } from '../java/awt/image/BufferedImage';
import { JDOMException } from '../org/jdom/JDOMException';
import { CMMEParser } from '../DataStruct/CMMEParser';
import { MetaData } from '../DataStruct/MetaData';
import { PieceData } from '../DataStruct/PieceData';
import { VariantReading } from '../DataStruct/VariantReading';
import { VariantVersionData } from '../DataStruct/VariantVersionData';
import { Main } from '../Viewer/Main';
//import Gfx.PartsWin;
/*------------------------------------------------------------------------
Class:   MusicWin
Extends: JFrame
Purpose: Lays out and implements main music window
------------------------------------------------------------------------*/
import { Resources } from '../Util/Resources';

export class MusicWin extends JFrame implements ActionListener,ItemListener,WindowFocusListener
{
	mytype_WindowFocusListener:boolean = true;
	mytype_ItemListener:boolean = true;
	mytype_ActionListener:boolean = true;
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static FILETYPE_CMME:number = 0;
	public static FILETYPE_MIDI:number = 1;
	public static FILETYPE_XML:number = 2;
	public static FILENAME_EXTENSION_CMME:string = ".cmme.xml";
	public static FILENAME_EXTENSION_MIDI:string = ".MID";
	public static FILENAME_EXTENSION_XML:string = ".xml";
	public static FILENAME_EXTENSION_HTML:string = ".html";
	public static FILENAME_PATTERN_CMME:string = ".*\\.cmme\\.xml";
	public static FILENAME_PATTERN_MIDI:string = ".*\\.[Mm][Ii][Dd]";
	public static FILENAME_PATTERN_XML:string = ".*\\.[Xx][Mm][Ll]";
	public static FILENAME_PATTERN_HTML:string = ".*\\.[Hh][Tt][Mm][Ll]";
	public static SCREEN_DIMENSION:Dimension = Toolkit.getDefaultToolkit().getScreenSize();
	public static DEFAULT_PDFDIR:string = "PDFout/";
	public static DEFAULT_CRITNOTESDIR:string = "TXTout/";
	public static MAX_STACK_TRACE_LEVELS:number = 8;
	public static BaseDataURL:string;
	static initDir:string;
	static initPDFDir:string;
	static initCritNotesDir:string;
	public static DefaultViewScale:number;
	/* music windows currently open */
	protected static fileWindows:LinkedList<MusicWin> = null;
	protected static curWindow:MusicWin = null;
	protected static exitingProgram:boolean = false;
	protected static viewerWin:Main = null;
	/* global file chooser variables */
	protected static CMMEFFilter:CMMEFileFilter;
	protected static MIDIFFilter:MIDIFileFilter;
	protected static XMLFFilter:XMLFileFilter;
	protected static HTMLFFilter:HTMLFileFilter;
	protected static PDFFFilter:PDFFileFilter;
	protected static musicWinFileChooser:JFileChooser;
	protected static saveFileChooser:JFileChooser;
	protected static exportFileChooser:JFileChooser;
	protected static PDFFileChooser:JFileChooser;
	protected static critNotesFileChooser:JFileChooser;
	/* GUI icons */
	static NoteShapesOldIcon_light:ImageIcon;
	static NoteShapesOldIcon_dark:ImageIcon;
	static NoteShapesModIcon_light:ImageIcon;
	static NoteShapesModIcon_dark:ImageIcon;
	static ClefsOldIcon_light:ImageIcon;
	static ClefsOldIcon_dark:ImageIcon;
	static ClefsModIcon_light:ImageIcon;
	static ClefsModIcon_dark:ImageIcon;
	static EdAccidentalsIcon_light:ImageIcon;
	static EdAccidentalsIcon_dark:ImageIcon;
	static PitchOldIcon_light:ImageIcon;
	static PitchOldIcon_dark:ImageIcon;
	static PitchModIcon_light:ImageIcon;
	static PitchModIcon_dark:ImageIcon;
	static TextingOldIcon_light:ImageIcon;
	static TextingOldIcon_dark:ImageIcon;
	static TextingModIcon_light:ImageIcon;
	static TextingModIcon_dark:ImageIcon;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public updatemusicgfx:boolean = true;
	public rerendermusic:boolean = false;
	public redrawscr:boolean = false;
	public musicData:PieceData;
	//CHANGE 
	public MusicGfx:MusicFont;
	public optSet:OptionSet;
	protected partsWin:PartsWin;
	protected scorePageWin:ScorePagePreviewWin;
	protected genPDFDialog:JDialog;
	public cp:Container;
	public origsize:Dimension;
	public WinBorder:Dimension;
	public windowFileName:string;
	public windowIcon:Image;
	/* Main options GUI */
	TopMenuBar:JMenuBar;
	FileMenu:JMenu;
	EditMenu:JMenu;
	ViewMenu:JMenu;
	SectionsMenu:JMenu;
	TextMenu:JMenu;
	VersionsMenu:JMenu;
	AnalysisMenu:JMenu;
	MainToolBar:JToolBar;
	protected MTZoomControl:ZoomControl;
	/* Viewing/action area */
	protected ViewScr:ViewCanvas;
	BottomPanel:JPanel;
	StatusPanel:JPanel;
	StatusMeasureLabel:JLabel;
	StatusMeasureNum:JLabel;
	MusicScrollBarX:JScrollBar;
	MusicScrollBarY:JScrollBar;
	/* action listeners */
	protected VSListener:ViewSizeListener = new ViewSizeListener(this);
	protected VMBSListener:BarlineStyleListener = new BarlineStyleListener(this);
	protected VMNSListener:NoteShapeStyleListener = new NoteShapeStyleListener(this);
	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  Dimension fitInScreen(Dimension dimToCheck,float scrProportion)
Purpose: Check whether dimension can fit within screen space and if not,
         calculate new dimension which does
Parameters:
  Input:  Dimension dimToCheck - dimension to check
          float scrProportion  - proportion of screen space to allow
  Output: -
  Return: New dimension which fits within screen dimensions * scrProportion
------------------------------------------------------------------------*/
	static AVAIL_SCREEN_PROPORTION:number = 0.95;

	public static fitInScreen_1(dimToCheck:Dimension):Dimension
	{
		return MusicWin.fitInScreen_2(dimToCheck,MusicWin.AVAIL_SCREEN_PROPORTION);
	}

	public static fitInScreen_2(dimToCheck:Dimension,scrProportion:number):Dimension
	{
		return MusicWin.fitInScreen_3(dimToCheck,scrProportion,scrProportion);
	}

	public static fitInScreen_3(dimToCheck:Dimension,scrProportionX:number,scrProportionY:number):Dimension
	{
		let d:Dimension = new Dimension(dimToCheck);
		if( d.width ><number>( MusicWin.SCREEN_DIMENSION.width * scrProportionX))
			d.width =<number>( MusicWin.SCREEN_DIMENSION.width * scrProportionX);

		if( d.height ><number>( MusicWin.SCREEN_DIMENSION.height * scrProportionY))
			d.height =<number>( MusicWin.SCREEN_DIMENSION.height * scrProportionY);

		return d;
	}

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
	public static isCMMEFilename(filename:string):boolean
	{
		return filename.matches(".*\\.[Cc][Mm][Mm][Ee]\\.[Xx][Mm][Ll]");
	}

	public static isMIDIFilename(filename:string):boolean
	{
		return filename.matches(MusicWin.FILENAME_PATTERN_MIDI);
	}

	public static isMusicXMLFilename(filename:string):boolean
	{
		return filename.matches(MusicWin.FILENAME_PATTERN_XML) && ! MusicWin.isCMMEFilename(filename);
	}

	public static isHTMLFilename(filename:string):boolean
	{
		return filename.matches(MusicWin.FILENAME_PATTERN_HTML);
	}

	public static getMusicWinFileChooser():JFileChooser
	{
		if( MusicWin.musicWinFileChooser == null)
			{
				MusicWin.musicWinFileChooser = new JFileChooser(MusicWin.initDir);
				MusicWin.musicWinFileChooser.addChoosableFileFilter(MusicWin.CMMEFFilter);
				MusicWin.musicWinFileChooser.addChoosableFileFilter(MusicWin.MIDIFFilter);
				MusicWin.musicWinFileChooser.addChoosableFileFilter(MusicWin.XMLFFilter);
				MusicWin.musicWinFileChooser.setFileFilter(MusicWin.CMMEFFilter);
			}

		return MusicWin.musicWinFileChooser;
	}

	public static getSaveFileChooser():JFileChooser
	{
		if( MusicWin.saveFileChooser == null)
			{
				MusicWin.saveFileChooser = new JFileChooser(MusicWin.initDir);
				MusicWin.saveFileChooser.addChoosableFileFilter(MusicWin.CMMEFFilter);
				MusicWin.saveFileChooser.setFileFilter(MusicWin.CMMEFFilter);
			}

		MusicWin.saveFileChooser.setCurrentDirectory(MusicWin.getMusicWinFileChooser().getCurrentDirectory());
		return MusicWin.saveFileChooser;
	}

	public static getExportFileChooser():JFileChooser
	{
		if( MusicWin.exportFileChooser == null)
			{
				MusicWin.exportFileChooser = new JFileChooser(MusicWin.initDir);
				MusicWin.exportFileChooser.addChoosableFileFilter(MusicWin.MIDIFFilter);
				MusicWin.exportFileChooser.addChoosableFileFilter(MusicWin.XMLFFilter);
				MusicWin.exportFileChooser.setFileFilter(MusicWin.XMLFFilter);
			}

		MusicWin.exportFileChooser.setCurrentDirectory(MusicWin.getSaveFileChooser().getCurrentDirectory());
		return MusicWin.exportFileChooser;
	}

	public static getPDFFileChooser():JFileChooser
	{
		if( MusicWin.PDFFileChooser == null)
			{
				MusicWin.PDFFileChooser = new JFileChooser(MusicWin.initPDFDir);
				MusicWin.PDFFileChooser.addChoosableFileFilter(MusicWin.PDFFFilter);
				MusicWin.PDFFileChooser.setFileFilter(MusicWin.PDFFFilter);
			}

		return MusicWin.PDFFileChooser;
	}

	public static getCritNotesFileChooser():JFileChooser
	{
		if( MusicWin.critNotesFileChooser == null)
			{
				MusicWin.critNotesFileChooser = new JFileChooser(MusicWin.initCritNotesDir);
				MusicWin.critNotesFileChooser.addChoosableFileFilter(MusicWin.HTMLFFilter);
				MusicWin.critNotesFileChooser.setFileFilter(MusicWin.HTMLFFilter);
			}

		return MusicWin.critNotesFileChooser;
	}

	public static initScoreWindowing_1(bdu:string,initDir:string,inApplet:boolean):void
	{
		MusicWin.musicWinFileChooser = null;
		MusicWin.initDir = initDir;
		MusicWin.BaseDataURL = bdu;
		try
		{
			MusicWin.initPDFDir = new URL(MusicWin.BaseDataURL + MusicWin.DEFAULT_PDFDIR).getFile();
			MusicWin.initCritNotesDir = new URL(MusicWin.BaseDataURL + MusicWin.DEFAULT_CRITNOTESDIR).getFile();
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					MusicWin.initPDFDir = initDir;
					MusicWin.initCritNotesDir = initDir;
				}

			else
				throw e;

		}
		MusicWin.CMMEFFilter = new CMMEFileFilter();
		MusicWin.MIDIFFilter = new MIDIFileFilter();
		MusicWin.XMLFFilter = new XMLFileFilter();
		MusicWin.HTMLFFilter = new HTMLFileFilter();
		MusicWin.PDFFFilter = new PDFFileFilter();
		MusicWin.fileWindows = new LinkedList<MusicWin>();
		let dvs:number =(<number> MusicWin.SCREEN_DIMENSION.height) / 1200;
		MusicWin.DefaultViewScale = Math.round(dvs * 100);
		MusicWin.initGUIIcons();
	}

	/* calculate default scaling based on screen dimensions */
	public static closeAllWindows():void
	{
		let fileWindowsList:LinkedList<MusicWin> = new LinkedList<MusicWin>(MusicWin.fileWindows);
		for(let mw of fileWindowsList)
		mw.closewin_1();
	}

	/*------------------------------------------------------------------------
Method:  void initGUIIcons()
Purpose: Initialize tool icons for viewer GUI
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public static initGUIIcons():void
	{
		try
		{
			let lightBG:BufferedImage = ImageIO.read(Resources.getResource("data/imgs/GUIicons/buttonbg-light.gif"));
			let darkBG:BufferedImage = ImageIO.read(Resources.getResource("data/imgs/GUIicons/buttonbg-dark.gif"));
			MusicWin.NoteShapesOldIcon_light = MusicWin.makeIconWithBG("noteval-buttonORIGa.gif",lightBG);
			MusicWin.NoteShapesOldIcon_dark = MusicWin.makeIconWithBG("noteval-buttonORIGa.gif",darkBG);
			MusicWin.NoteShapesModIcon_light = MusicWin.makeIconWithBG("noteval-buttonMODERNa.gif",lightBG);
			MusicWin.NoteShapesModIcon_dark = MusicWin.makeIconWithBG("noteval-buttonMODERNa.gif",darkBG);
			MusicWin.ClefsOldIcon_light = MusicWin.makeIconWithBG("clef-buttonC1a.gif",lightBG);
			MusicWin.ClefsOldIcon_dark = MusicWin.makeIconWithBG("clef-buttonC1a.gif",darkBG);
			MusicWin.ClefsModIcon_light = MusicWin.makeIconWithBG("clef-buttonMODERNG1a.gif",lightBG);
			MusicWin.ClefsModIcon_dark = MusicWin.makeIconWithBG("clef-buttonMODERNG1a.gif",darkBG);
			MusicWin.EdAccidentalsIcon_light = MusicWin.makeIconWithBG("edacc-button.gif",lightBG);
			MusicWin.EdAccidentalsIcon_dark = MusicWin.makeIconWithBG("edacc-button.gif",darkBG);
			MusicWin.PitchOldIcon_light = MusicWin.makeIconWithBG("clef-buttonBmol1a.gif",lightBG);
			MusicWin.PitchOldIcon_dark = MusicWin.makeIconWithBG("clef-buttonBmol1a.gif",darkBG);
			MusicWin.PitchModIcon_light = MusicWin.makeIconWithBG("clef-buttonMODERNFLAT1a.gif",lightBG);
			MusicWin.PitchModIcon_dark = MusicWin.makeIconWithBG("clef-buttonMODERNFLAT1a.gif",darkBG);
			MusicWin.TextingOldIcon_light = MusicWin.makeIconWithBG("textorig-button.gif",lightBG);
			MusicWin.TextingOldIcon_dark = MusicWin.makeIconWithBG("textorig-button.gif",darkBG);
			MusicWin.TextingModIcon_light = MusicWin.makeIconWithBG("textmodern-button.gif",lightBG);
			MusicWin.TextingModIcon_dark = MusicWin.makeIconWithBG("textmodern-button.gif",darkBG);
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					System.err.println("Error loading icons: " + e);
					if( MetaData.CMME_OPT_TESTING)
						e.printStackTrace();

				}

			else
				throw e;

		}
	}

	/* basic image elements */
	/* note shapes */
	/* cleffing */
	/* editorial accidentals */
	/* pitch system */
	/* texting */
	/*------------------------------------------------------------------------
Method:  ImageIcon makeIconWithBG(String imgFilename,BufferedImage BG)
Purpose: Combine background image with image file to create icon
Parameters:
  Input:  String imgFilename - filename for foreground image
          BufferedImage BG   - background image
  Output: -
  Return: icon with combined images
------------------------------------------------------------------------*/
	static makeIconWithBG(imgFilename:string,BG:BufferedImage):ImageIcon
	{
		let curCanvas:BufferedImage = new BufferedImage(BG.getWidth(),BG.getHeight(),BufferedImage.TYPE_INT_ARGB);
		let curFileImg:BufferedImage = ImageIO.read(Resources.getResource("data/imgs/GUIicons/" + imgFilename));
		let curG:Graphics2D = curCanvas.createGraphics();
		curG.drawImage(BG,0,0,null);
		curG.drawImage(curFileImg,0,0,null);
		return new ImageIcon(curCanvas);
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set parameters and options
Parameters:
  Input:  new values for parameters and options
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public static setViewerWin(newval:Main):void
	{
		MusicWin.viewerWin = newval;
	}

	public static new0_6(fn:string,p:PieceData,xl:number,yl:number):MusicWin
	{
		let _new0:MusicWin = new MusicWin;
		MusicWin.set0_6(_new0,fn,p,xl,yl);
		return _new0;
	}

	public static set0_6(new0:MusicWin,fn:string,p:PieceData,xl:number,yl:number):void
	{
		new0.musicData = p;
		new0.windowFileName = fn;
		new0.origsize = new Dimension(- 1,- 1);
		new0.WinBorder = new Dimension(- 1,- 1);
		if( xl == - 1)
			{
				xl = 10;
				yl = 10;
				if( MusicWin.curWindow != null)
					{
						xl =(( MusicWin.curWindow.getLocation().x + 20) | 0);
						yl =(( MusicWin.curWindow.getLocation().y + 20) | 0);
					}

			}

		new0.cp = new0.getContentPane();
		new0.addCMMETitle_1(fn);
		new0.windowIcon = new ImageIcon(new URL(MusicWin.BaseDataURL + "imgs/icon1.gif")).getImage();
		new0.setIconImage(new0.windowIcon);
		new0.cp.setLayout(new BorderLayout());
		new0.optSet = new OptionSet(new0);
		new0.initializeOptions_1();
		new0.MusicGfx = MusicFont.new1(<number> new0.optSet.getVIEWSCALE());
		new0.TopMenuBar = new JMenuBar();
		new0.FileMenu = new0.createFileMenu_1();
		new0.EditMenu = new0.createEditMenu_1();
		new0.ViewMenu = new0.createViewMenu_1();
		new0.SectionsMenu = new0.createSectionsMenu_1();
		new0.TextMenu = new0.createTextMenu_1();
		new0.VersionsMenu = new0.createVersionsMenu_1();
		new0.AnalysisMenu = new0.createAnalysisMenu_1();
		new0.TopMenuBar.add(new0.FileMenu);
		if( new0.EditMenu != null)
			new0.TopMenuBar.add(new0.EditMenu);

		new0.TopMenuBar.add(new0.ViewMenu);
		if( new0.SectionsMenu != null)
			new0.TopMenuBar.add(new0.SectionsMenu);

		if( new0.TextMenu != null)
			new0.TopMenuBar.add(new0.TextMenu);

		new0.TopMenuBar.add(new0.VersionsMenu);
		new0.setJMenuBar(new0.TopMenuBar);
		new0.ViewScr = new0.createMusicCanvas_1(new0.musicData,new0.MusicGfx,new0,new0.optSet);
		new0.cp.add("Center",new0.ViewScr);
		new0.partsWin = new0.createInitialPartsWin_1();
		new0.scorePageWin = null;
		new0.createGenPDFDialog();
		new0.MainToolBar = new0.createMainToolBar_1();
		if( new0.MainToolBar != null)
			new0.cp.add("North",new0.MainToolBar);

		new0.BottomPanel = new JPanel();
		new0.StatusPanel = new0.createStatusPanel_1();
		new0.MusicScrollBarX = new JScrollBar(JScrollBar.HORIZONTAL,0,0,0,new0.ViewScr.nummeasures);
		new0.MusicScrollBarY = new JScrollBar(JScrollBar.VERTICAL,0,new0.ViewScr.screensize.height,0,<number> Math.round(new0.ViewScr.SCREEN_MINHEIGHT * new0.optSet.getVIEWSCALE()));
		new0.MusicScrollBarX.setFocusable(false);
		new0.MusicScrollBarY.setFocusable(false);
		new0.MusicScrollBarX.addAdjustmentListener(
		{

			adjustmentValueChanged:(e:AdjustmentEvent):void =>
			{
				let newmeasure:number = new0.MusicScrollBarX.getValue();
				new0.setmeasurenum((( newmeasure + 1) | 0));
				new0.ViewScr.movedisplay_1(newmeasure);
			}
		}
		);
		new0.MusicScrollBarY.addAdjustmentListener(
		{

			adjustmentValueChanged:(e:AdjustmentEvent):void =>
			{
				let newy:number = new0.MusicScrollBarY.getValue();
				new0.ViewScr.newY_1(newy);
			}
		}
		);
		new0.BottomPanel.setLayout(new BorderLayout());
		new0.BottomPanel.add("South",new0.StatusPanel);
		new0.BottomPanel.add("Center",new0.MusicScrollBarX);
		new0.cp.add("South",new0.BottomPanel);
		new0.cp.add("East",new0.MusicScrollBarY);
		new0.setKeyboardHandler_1();
		new0.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
		new0.addWindowListener(
		{

			windowClosing:(event:WindowEvent):void =>
			{
				new0.closewin_1();
			}
		}
		);
		new0.addComponentListener(
		{

			componentResized:(event:ComponentEvent):void =>
			{
				if( new0.origsize.getHeight() >= 0)
					new0.ViewScr.newsize((( new0.cp.getSize().width - new0.WinBorder.width) | 0),(((( new0.cp.getSize().height - new0.WinBorder.height) | 0) +( new0.commentaryPanelDisplayed ? 0:new0.commentaryPanel.getSize().height)) | 0));

			}
		}
		);
		new0.addWindowFocusListener(new0);
		new0.pack();
		new0.setLocation(xl,yl);
		new0.setSubframeLocations_1();
		new0.ViewScr.requestFocusInWindow();
		new0.setVisible(true);
		new0.toFront();
		MusicWin.fileWindows.add(new0);
		MusicWin.curWindow = new0;
		new0.origsize.setSize(new0.cp.getSize());
		new0.WinBorder.setSize((( new0.origsize.width - new0.ViewScr.cursize().width) | 0),(( new0.origsize.height - new0.ViewScr.cursize().height) | 0));
	}

	public static new1_6(fn:string,p:PieceData):MusicWin
	{
		let _new1:MusicWin = new MusicWin;
		MusicWin.set1_6(_new1,fn,p);
		return _new1;
	}

	public static set1_6(new1:MusicWin,fn:string,p:PieceData):void
	{
		MusicWin.set0_6(new1,fn,p,- 1,- 1);
	}

	public static new2():MusicWin
	{
		let _new2:MusicWin = new MusicWin;
		MusicWin.set2(_new2);
		return _new2;
	}

	public static set2(new2:MusicWin):void
	{
	}

	/*------------------------------------------------------------------------
Method:  MusicWin getWinToReplace()
Purpose: If a new opening score window is to replace another one, return
         window to be replaced
Parameters:
  Input:  -
  Output: -
  Return: window to be replaced
------------------------------------------------------------------------*/
	public getWinToReplace_1():MusicWin
	{
		return null;
	}

	/*------------------------------------------------------------------------
Method:  MusicWin openWin(String fn,String path,PieceData musicData,int xl,int yl)
Purpose: Open new window after loading music data
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
		return MusicWin.new0_6(fn,musicData,xl,yl);
	}

	/*------------------------------------------------------------------------
Method:  void openFile(String fn)
Purpose: Open new music window for one file
Parameters:
  Input:  String fn - name of file
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public openFile(filename:string):void
	{
		let blankWin:MusicWin = this.getWinToReplace_1();
		let f:File = new File(filename);
		let fURL:URL = null;
		let parser:CMMEParser = null;
		let musicdat:PieceData = null;
		let windowFilename:string = null;
		let path:string = null;
		let convertedData:boolean = false;
		let lw:MessageWin = MessageWin.new0_7("Loading, please wait...",MusicWin.curWindow,true);
		try
		{
			if( MusicWin.isMIDIFilename(filename))
				{
					windowFilename = "Untitled score";
					convertedData = true;
				}

			else
				{
					fURL = f.toURI().toURL();
					parser = CMMEParser.new2(fURL,lw.getProgressBar());
					musicdat = parser.piece;
					windowFilename = f.getName();
					path = f.getCanonicalPath();
				}

		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					let errorMsg:string = "Error loading " + filename;
					if( e instanceof JDOMException)
						errorMsg += "\n\n" + e;

					try
					{
						if( Float.parseFloat(CMMEParser.getFileVersion_1(fURL)) > MetaData.CMME_VERSION_FLOAT)
							errorMsg += "\n\n" + "This file appears to have been created with a later version of the CMME software.\n" + "Please update your software to the latest version to open this file.";

					}
					catch( e)
					{
						if( e instanceof Exception)
							{
							}

						else
							throw e;

					}
					JOptionPane.showMessageDialog(MusicWin.curWindow,errorMsg,"Error",JOptionPane.ERROR_MESSAGE);
					if( MetaData.CMME_OPT_TESTING)
						e.printStackTrace();

					blankWin = null;
				}

			else
				throw e;

		}
		if( musicdat != null)
			try
			{
				let xl:number = 10;
				let yl:number = 10;
				if( MusicWin.curWindow != null)
					{
						xl =(( MusicWin.curWindow.getLocation().x + 20) | 0);
						yl =(( MusicWin.curWindow.getLocation().y + 20) | 0);
					}

				if( blankWin != null)
					{
						xl = blankWin.getLocation().x;
						yl = blankWin.getLocation().y;
					}

				this.openWin_1(windowFilename,path,musicdat,convertedData,xl,yl);
			}
			catch( e)
			{
				if( e instanceof Exception)
					{
						JOptionPane.showMessageDialog(MusicWin.curWindow,"Error creating score window","Error",JOptionPane.ERROR_MESSAGE);
						if( MetaData.CMME_OPT_TESTING)
							{
								System.err.println("Error creating score window: " + e);
								e.printStackTrace();
							}

						blankWin = null;
					}

				else
					throw e;

			}

		lw.dispose();
		if( blankWin != null)
			blankWin.closewin_1();

	}

	/* load file and create window in separate thread */
	// final SwingWorker OFThread=new SwingWorker()
	// {
	// public Object construct()
	// {
	/* ---------- real code ---------- */
	/* load music data */
	// musicdat=MIDIReaderWriter.MIDtoCMME(f); //CHANGE
	/* else if (isMusicXMLFilename(filename))   CHANGE removed musicxmlreader
          {
            musicdat=MusicXMLReader.MusicXMLtoCMME(new FileInputStream(f));
            windowFilename="Untitled score";
            convertedData=true;
          }*/
	// int flen=fURL.openConnection().getContentLength();
	// ProgressInputStream musIn=
	// new ProgressInputStream(fURL.openStream(),
	//                              lw.getProgressBar(),flen,0,75);
	//parser=new CMMEParser(musIn,lw.getProgressBar());
	//CHANGE
	//System.out.println(" GC: "+(long)(Runtime.getRuntime().totalMemory()-Runtime.getRuntime().freeMemory()));
	/* open music window */
	/* ---------- end real code ---------- */
	// return null; /* not used */
	// }
	//   }; /* end SwingWorker */
	//  OFThread.start();
	/*------------------------------------------------------------------------
Method:  String fileChooseAndOpen()
Purpose: Allow user to select file and open
Parameters:
  Input:  -
  Output: -
  Return: name of opened file
------------------------------------------------------------------------*/
	public fileChooseAndOpen():string
	{
		

      var callback = () => {
        try 
        { 
          var f:File = MusicWin . getMusicWinFileChooser ( ) . getSelectedFile ( );

          this . openFile ( f.getName() ); 

          
        } 
        catch (  e  ) 
        { 
          if (  e instanceof Exception  ) 
          { 
            System . err . println ( "Error loading " + MusicWin . getMusicWinFileChooser ( ) . getSelectedFile ( ) . getName ( ) ); 

            
          } 
          else  throw e ; 
        }
    };

    MusicWin . getMusicWinFileChooser ( ) . showOpenDialog ( this, callback ); 
    return "";

 
	}

	/*------------------------------------------------------------------------
Method:  boolean doNotOverwrite(File saveFile)
Purpose: Check whether a file to be saved already exists, and if so,
         display confirmation dialog for user to decide whether to overwrite
Parameters:
  Input:  -
  Output: -
  Return: true if user cancels save, false if file doesn't exist or user
          continues
------------------------------------------------------------------------*/
	public doNotOverwrite(saveFile:File):boolean
	{
		if( saveFile.exists())
			{
				if( ! this.confirmAction("Overwrite " + saveFile.getName() + "?","File already exists"))
					return true;

			}

		return false;
	}

	public confirmAction(queryText:string,dialogTitle:string):boolean
	{
		let confirmOption:number = JOptionPane.showConfirmDialog(this,queryText,dialogTitle,JOptionPane.YES_NO_OPTION,JOptionPane.WARNING_MESSAGE);
		if( confirmOption == JOptionPane.YES_OPTION)
			return true;

		return false;
	}

	/*------------------------------------------------------------------------
Method:  void addCMMETitle(String fn)
Purpose: Add title to window
Parameters:
  Input:  String fn - name of file in window
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addCMMETitle_1(fn:string):void
	{
		this.setTitle(fn + ": CMME Viewer");
	}

	/*------------------------------------------------------------------------
Method:  void initializeOptions()
Purpose: Initialize option set before creating view canvas
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public initializeOptions_1():void
	{
		let newVS:number =( MusicWin.curWindow != null) ? MusicWin.curWindow.optSet.getVIEWSCALE():<number> MusicWin.DefaultViewScale / 100;
		this.optSet.setVIEWSCALE(newVS);
		try
		{
			this.optSet.initFromGlobalConfig();
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
	}

	/*------------------------------------------------------------------------
Method:  void setSubframeLocations()
Purpose: Set locations of frames dependent upon main window (after window
         has been packed)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setSubframeLocations_1():void
	{
		this.genPDFDialog.setLocationRelativeTo(this);
		this.setVariantDisplayOptionsFrameLocation();
	}

	/*------------------------------------------------------------------------
Method:  void setEventEditorLocation()
Purpose: Position event editor relative to parent frame
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setVariantDisplayOptionsFrameLocation():void
	{
		let eex:number =(( this.getLocation().x + this.getSize().width) | 0);
		let eey:number = this.getLocation().y;
		let eeWidth:number = this.variantDisplayOptionsFrame.getSize().width;
		let eeHeight:number = this.variantDisplayOptionsFrame.getSize().height;
		let screenSize:Dimension = Toolkit.getDefaultToolkit().getScreenSize();
		if((( eex + eeWidth) | 0) > screenSize.width)
			eex =(( screenSize.width - eeWidth) | 0);

		this.variantDisplayOptionsFrame.setLocation(eex,eey);
	}

	/* position relative to main frame */
	/*------------------------------------------------------------------------
Method:  PartsWin createInitialPartsWin()
Purpose: Initialize unscored parts window when opening window
Parameters:
  Input:  -
  Output: -
  Return: new parts window
------------------------------------------------------------------------*/
	public createInitialPartsWin_1():PartsWin
	{
		return null;
	}
	//    return new PartsWin(musicData,MusicGfx,this);
	/*------------------------------------------------------------------------
Method:  JMenu createFileMenu()
Purpose: Create File menu for window
Parameters:
  Input:  -
  Output: -
  Return: menu
------------------------------------------------------------------------*/
	protected FileMenuAbout:JMenuItem;
	protected FileMenuClose:JMenuItem;
	protected FileMenuGeneratePDF:JMenuItem;
	protected FileMenuExport:JMenu;
	protected FMExportMIDI:JMenuItem;
	protected FMExportXML:JMenuItem;

	public createFileMenu_1():JMenu
	{
		let FM:JMenu = new JMenu("File");
		this.FileMenuAbout = new JMenuItem("About this edition...");
		this.FileMenuAbout.setMnemonic(KeyEvent.VK_A);
		this.FileMenuClose = new JMenuItem("Close window");
		this.FileMenuClose.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_W,ActionEvent.CTRL_MASK));
		this.FileMenuClose.setMnemonic(KeyEvent.VK_C);
		this.FileMenuClose.setVisible(false);
		this.FileMenuExport = new JMenu("Export");
		this.FileMenuExport.setMnemonic(KeyEvent.VK_E);
		this.FMExportMIDI = new JMenuItem("MIDI");
		this.FMExportXML = new JMenuItem("MusicXML");
		this.FileMenuExport.add(this.FMExportMIDI);
		this.FileMenuExport.add(this.FMExportXML);
		this.FileMenuGeneratePDF = new JMenuItem("Generate PDF...");
		this.FileMenuGeneratePDF.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_P,ActionEvent.CTRL_MASK));
		this.FileMenuGeneratePDF.setMnemonic(KeyEvent.VK_P);
		this.FileMenuGeneratePDF.setVisible(false);
		FM.add(this.FileMenuAbout);
		if( MusicWin.viewerWin == null || ! Main.inApplet)
			{
				FM.add(this.FileMenuExport);
			}

		this.FileMenuAbout.addActionListener(this);
		this.FileMenuClose.addActionListener(this);
		this.FMExportMIDI.addActionListener(this);
		this.FMExportXML.addActionListener(this);
		this.FileMenuGeneratePDF.addActionListener(this);
		return FM;
	}

	/* create menu and items */
	// FM.add(FileMenuClose);
	/* no export/PDF-generation in applet */
	//  FM.add(FileMenuGeneratePDF);
	/* applet PDF test - figure out security settings to avoid access control exception
    else if (viewerWin.inApplet)
      FM.add(FileMenuGeneratePDF);*/
	/* handle menu actions */
	/*------------------------------------------------------------------------
Method:  JMenu create*Menu()
Purpose: Create menus for window
Parameters:
  Input:  -
  Output: -
  Return: menu
------------------------------------------------------------------------*/
	public createEditMenu_1():JMenu
	{
		return null;
	}

	public createSectionsMenu_1():JMenu
	{
		return null;
	}

	public createTextMenu_1():JMenu
	{
		return null;
	}
	/* Versions Menu */
	protected VersionsMenuGeneralInfo:JMenuItem;
	protected VersionsMenuNewNotesWindow:JMenuItem;
	protected VersionsMenuDisplayVariantOptions:JCheckBoxMenuItem;
	protected VersionsMenuSourceAnalysis:JMenuItem;
	protected variantDisplayOptionsFrame:VariantDisplayOptionsFrame;
	protected VersionsMenuDisplayMenu:JMenu;
	protected VersionsMenuOptionsMenu:JMenu;
	protected VMDMVersions:JRadioButtonMenuItem[];
	protected VMOMMarkAllVariants:JRadioButtonMenuItem;
	protected VMOMMarkSubstantiveVariants:JRadioButtonMenuItem;
	protected VMOMMarkNoVariants:JRadioButtonMenuItem;
	protected VMOMMarkSelectedVariants:JRadioButtonMenuItem;
	protected VMOMCustomVariants:JCheckBoxMenuItem[];

	public createVersionsMenu_1():JMenu
	{
		let VM:JMenu = new JMenu("Versions");
		this.VersionsMenuGeneralInfo = new JMenuItem("Variant Version Information...");
		this.VersionsMenuGeneralInfo.setMnemonic(KeyEvent.VK_I);
		this.VersionsMenuDisplayMenu = new JMenu("Display version");
		this.VersionsMenuOptionsMenu = new JMenu("Variant marking options");
		if( this.musicData.getVariantVersions().size() == 0)
			{
				this.VersionsMenuGeneralInfo.setEnabled(false);
				this.VersionsMenuDisplayMenu.setEnabled(false);
				this.VersionsMenuOptionsMenu.setEnabled(false);
				this.VMDMVersions = Array(0);
			}

		else
			{
				this.VMDMVersions = Array(this.musicData.getVariantVersions().size());
				let VMDMGroup:ButtonGroup = new ButtonGroup();
				let vi:number = 0;
				for(let vvd of this.musicData.getVariantVersions())
				{
					this.VMDMVersions[vi]= new JRadioButtonMenuItem(vvd.getID());
					VMDMGroup.add(this.VMDMVersions[vi]);
					this.VersionsMenuDisplayMenu.add(this.VMDMVersions[vi]);
					this.VMDMVersions[vi].addActionListener(this);
					vi ++;
				}
				this.VMDMVersions[0].setSelected(true);
			}

		let VMOMMarkGroup:ButtonGroup = new ButtonGroup();
		this.VMOMMarkAllVariants = new JRadioButtonMenuItem("Mark all variants on score");
		this.VMOMMarkAllVariants.setSelected(this.optSet.getMarkVariants() == OptionSet.OPT_VAR_ALL);
		VMOMMarkGroup.add(this.VMOMMarkAllVariants);
		this.VersionsMenuOptionsMenu.add(this.VMOMMarkAllVariants);
		this.VMOMMarkSubstantiveVariants = new JRadioButtonMenuItem("Mark substantive variants on score");
		this.VMOMMarkSubstantiveVariants.setSelected(this.optSet.getMarkVariants() == OptionSet.OPT_VAR_SUBSTANTIVE);
		VMOMMarkGroup.add(this.VMOMMarkSubstantiveVariants);
		this.VersionsMenuOptionsMenu.add(this.VMOMMarkSubstantiveVariants);
		this.VMOMMarkNoVariants = new JRadioButtonMenuItem("Mark no variants on score");
		this.VMOMMarkNoVariants.setSelected(this.optSet.getMarkVariants() == OptionSet.OPT_VAR_NONE);
		VMOMMarkGroup.add(this.VMOMMarkNoVariants);
		this.VersionsMenuOptionsMenu.add(this.VMOMMarkNoVariants);
		this.VMOMMarkSelectedVariants = new JRadioButtonMenuItem("Mark selected variants on score:");
		this.VMOMMarkSelectedVariants.setSelected(this.optSet.getMarkVariants() == OptionSet.OPT_VAR_CUSTOM);
		VMOMMarkGroup.add(this.VMOMMarkSelectedVariants);
		this.VersionsMenuOptionsMenu.add(this.VMOMMarkSelectedVariants);
		this.VMOMCustomVariants = Array(((( VariantReading.typeNames.length - 1) | 0)));
		for(
		let vi:number = 1;vi < VariantReading.typeNames.length;vi ++)
		{
			let curCB:JCheckBoxMenuItem = new JCheckBoxMenuItem(VariantReading.typeNames[vi]);
			curCB.setSelected(this.optSet.markCustomVariant(1 <<((( vi - 1) | 0))));
			curCB.setEnabled(this.optSet.getMarkVariants() == OptionSet.OPT_VAR_CUSTOM);
			curCB.addItemListener(this);
			this.VersionsMenuOptionsMenu.add(curCB);
			this.VMOMCustomVariants[((( vi - 1) | 0))]= curCB;
		}
		this.VersionsMenuNewNotesWindow = new JMenuItem("New critical notes list...");
		this.VersionsMenuNewNotesWindow.setMnemonic(KeyEvent.VK_N);
		this.VersionsMenuSourceAnalysis = new JMenuItem("Source analysis...");
		this.VersionsMenuSourceAnalysis.setMnemonic(KeyEvent.VK_A);
		this.VersionsMenuDisplayVariantOptions = new JCheckBoxMenuItem("Display variant marking options");
		this.VersionsMenuDisplayVariantOptions.setSelected(false);
		this.VersionsMenuDisplayVariantOptions.setMnemonic(KeyEvent.VK_O);
		this.variantDisplayOptionsFrame = new VariantDisplayOptionsFrame(this);
		VM.add(this.VersionsMenuDisplayVariantOptions);
		this.VersionsMenuGeneralInfo.addActionListener(this);
		this.VersionsMenuNewNotesWindow.addActionListener(this);
		this.VersionsMenuDisplayVariantOptions.addItemListener(this);
		this.VersionsMenuSourceAnalysis.addActionListener(this);
		this.variantDisplayOptionsFrame.registerListeners_6();
		this.VMOMMarkAllVariants.addActionListener(this);
		this.VMOMMarkSubstantiveVariants.addActionListener(this);
		this.VMOMMarkNoVariants.addActionListener(this);
		this.VMOMMarkSelectedVariants.addActionListener(this);
		return VM;
	}
	/* create menu and items */
	/*        VMDMVersions[0]=new JRadioButtonMenuItem("Default");
        VMDMGroup.add(VMDMVersions[0]);
        VersionsMenuDisplayMenu.add(VMDMVersions[0]);
        VMDMVersions[0].setSelected(true);
        VMDMVersions[0].addActionListener(this);*/
	//    VM.add(VersionsMenuDisplayMenu);
	//    VM.add(VersionsMenuOptionsMenu);
	//    VM.add(VersionsMenuGeneralInfo);
	// VM.add(VersionsMenuNewNotesWindow);
	//    VM.add(VersionsMenuSourceAnalysis);
	/* handle menu actions */
	/* View Menu */
	protected ViewMenuViewSize:JMenu;
	protected ViewMenuBarlineStyle:JMenu;
	protected ViewMenuNoteShapeStyle:JMenu;
	protected ViewMenuTexting:JMenu;
	protected ViewMenuPitchSystem:JMenu;
	protected VMVSZoomOut:JMenuItem;
	protected VMVSZoomIn:JMenuItem;
	protected VMVSnumItems:JRadioButtonMenuItem[];
	public VMVSDefaultNums:number[]=[200,175,150,125,100,75,50];
	public VMVSnums:number[];
	public curVMVSnum:number;
	public curViewSize:number;
	protected VMBSItems:JRadioButtonMenuItem[];
	protected VMNSItems:JRadioButtonMenuItem[];
	protected VMTOrigText:JRadioButtonMenuItem;
	protected VMTModText:JRadioButtonMenuItem;
	protected VMTBothText:JRadioButtonMenuItem;
	protected VMTNoText:JRadioButtonMenuItem;
	protected ViewMenuUsemodernclefs:JCheckBoxMenuItem;
	protected ViewMenuDisplayEditorialAccidentals:JCheckBoxMenuItem;
	protected ViewMenuModernAccidentalSystem:JCheckBoxMenuItem;
	protected ViewMenuDisplayallnewlineclefs:JCheckBoxMenuItem;
	protected ViewMenuDisplayligbrackets:JCheckBoxMenuItem;
	protected ViewMenuEdCommentary:JCheckBoxMenuItem;
	protected ViewMenuViewParts:JMenuItem;
	protected ViewMenuPrintPreviews:JMenu;
	protected VMPPParts:JMenuItem;
	protected VMPPScore:JMenuItem;

	public createViewMenu_1():JMenu
	{
		let VM:JMenu = new JMenu("View");
		this.ViewMenuViewSize = new JMenu("View Size");
		this.ViewMenuBarlineStyle = new JMenu("Barline Style");
		this.ViewMenuNoteShapeStyle = new JMenu("Note shapes / reduction");
		this.ViewMenuTexting = new JMenu("Texting");
		this.ViewMenuPitchSystem = new JMenu("Pitch system");
		this.ViewMenuUsemodernclefs = new JCheckBoxMenuItem("Modern clefs");
		this.ViewMenuUsemodernclefs.setSelected(true);
		this.ViewMenuDisplayallnewlineclefs = new JCheckBoxMenuItem("Display all newline clefs");
		this.ViewMenuDisplayligbrackets = new JCheckBoxMenuItem("Display ligature brackets");
		this.ViewMenuEdCommentary = new JCheckBoxMenuItem("Mark editorial commentary");
		this.ViewMenuDisplayligbrackets.setSelected(true);
		this.ViewMenuEdCommentary.setSelected(true);
		this.ViewMenuViewParts = new JMenuItem("Original parts window");
		this.ViewMenuViewParts.setMnemonic(KeyEvent.VK_P);
		this.ViewMenuPrintPreviews = new JMenu("Print Previews");
		this.VMVSZoomOut = new JMenuItem("Zoom out");
		this.VMVSZoomIn = new JMenuItem("Zoom in");
		this.VMVSZoomOut.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_MINUS,ActionEvent.CTRL_MASK));
		this.VMVSZoomIn.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_EQUALS,ActionEvent.CTRL_MASK));
		this.ViewMenuViewSize.add(this.VMVSZoomOut);
		this.ViewMenuViewSize.add(this.VMVSZoomIn);
		this.ViewMenuViewSize.addSeparator();
		let VMVSgroup:ButtonGroup = new ButtonGroup();
		this.curVMVSnum = - 1;
		for(
		let i:number = 0;i < this.VMVSDefaultNums.length;i ++)
		if( this.VMVSDefaultNums[i]== MusicWin.DefaultViewScale)
			{
				this.curVMVSnum = i;
				break;
			}

		if( this.curVMVSnum != - 1)
			this.VMVSnums = this.VMVSDefaultNums;
		else
			{
				this.VMVSnums = Array(((( this.VMVSDefaultNums.length + 1) | 0)));
				let vi:number = 0;
				for(
				let i:number = 0;i < this.VMVSDefaultNums.length;i ++)
				{
					if( vi == i && this.VMVSDefaultNums[i]< MusicWin.DefaultViewScale)
						{
							this.VMVSnums[vi]= MusicWin.DefaultViewScale;
							this.curVMVSnum = vi;
							vi ++;
						}

					this.VMVSnums[( vi ++)]= this.VMVSDefaultNums[i];
				}
				if( vi <= this.VMVSDefaultNums.length)
					{
						this.VMVSnums[vi]= MusicWin.DefaultViewScale;
						this.curVMVSnum = vi;
					}

			}

		this.curViewSize =( MusicWin.curWindow != null) ? MusicWin.curWindow.curViewSize:MusicWin.DefaultViewScale;
		this.VMVSnumItems = Array(this.VMVSnums.length);
		for(
		let i:number = 0;i < this.VMVSnums.length;i ++)
		{
			this.VMVSnumItems[i]= new JRadioButtonMenuItem(this.VMVSnums[i]+ "%");
			this.VMVSnumItems[i].setActionCommand(Integer.toString(i));
			this.VMVSnumItems[i].addActionListener(this.VSListener);
			VMVSgroup.add(this.VMVSnumItems[i]);
			this.ViewMenuViewSize.add(this.VMVSnumItems[i]);
			if( this.VMVSnums[i]== this.curViewSize)
				this.VMVSnumItems[( this.curVMVSnum = i)].setSelected(true);

		}
		let VMBSgroup:ButtonGroup = new ButtonGroup();
		this.VMBSItems = Array(OptionSet.BarlineStrings.length);
		for(
		let i:number = 0;i < this.VMBSItems.length;i ++)
		{
			this.VMBSItems[i]= new JRadioButtonMenuItem(OptionSet.BarlineStrings[i]);
			this.VMBSItems[i].setActionCommand(Integer.toString(i));
			this.VMBSItems[i].addActionListener(this.VMBSListener);
			VMBSgroup.add(this.VMBSItems[i]);
			this.ViewMenuBarlineStyle.add(this.VMBSItems[i]);
		}
		this.VMBSItems[this.optSet.get_barline_type()].setSelected(true);
		let VMNSgroup:ButtonGroup = new ButtonGroup();
		this.VMNSItems = Array(OptionSet.NoteShapeStrings.length);
		for(
		let i:number = 0;i < this.VMNSItems.length;i ++)
		{
			this.VMNSItems[i]= new JRadioButtonMenuItem(OptionSet.NoteShapeStrings[i]);
			this.VMNSItems[i].setActionCommand(Integer.toString(i));
			this.VMNSItems[i].addActionListener(this.VMNSListener);
			VMNSgroup.add(this.VMNSItems[i]);
			this.ViewMenuNoteShapeStyle.add(this.VMNSItems[i]);
		}
		this.VMNSItems[this.optSet.get_noteShapeType()].setSelected(true);
		let VMTgroup:ButtonGroup = new ButtonGroup();
		this.VMTOrigText = new JRadioButtonMenuItem("Original Text");
		this.VMTOrigText.addActionListener(this);
		VMTgroup.add(this.VMTOrigText);
		this.ViewMenuTexting.add(this.VMTOrigText);
		this.VMTModText = new JRadioButtonMenuItem("Modern Text");
		this.VMTModText.addActionListener(this);
		VMTgroup.add(this.VMTModText);
		this.ViewMenuTexting.add(this.VMTModText);
		this.VMTBothText = new JRadioButtonMenuItem("Original and Modern Texts");
		this.VMTBothText.addActionListener(this);
		VMTgroup.add(this.VMTBothText);
		this.ViewMenuTexting.add(this.VMTBothText);
		this.VMTNoText = new JRadioButtonMenuItem("No Text");
		this.VMTNoText.addActionListener(this);
		VMTgroup.add(this.VMTNoText);
		this.ViewMenuTexting.add(this.VMTNoText);
		this.VMTOrigText.setSelected(true);
		this.ViewMenuDisplayEditorialAccidentals = new JCheckBoxMenuItem("Display editorial accidentals");
		this.ViewMenuDisplayEditorialAccidentals.setSelected(this.optSet.get_modacc_type() != OptionSet.OPT_MODACC_NONE);
		this.ViewMenuModernAccidentalSystem = new JCheckBoxMenuItem("Modern accidentals/signatures");
		this.ViewMenuModernAccidentalSystem.setSelected(this.optSet.getUseModernAccidentalSystem());
		this.ViewMenuPitchSystem.add(this.ViewMenuDisplayEditorialAccidentals);
		this.ViewMenuPitchSystem.add(this.ViewMenuModernAccidentalSystem);
		this.ViewMenuDisplayEditorialAccidentals.addItemListener(this);
		this.ViewMenuModernAccidentalSystem.addItemListener(this);
		this.VMPPParts = new JMenuItem("Parts...");
		this.VMPPScore = new JMenuItem("Score...");
		this.ViewMenuPrintPreviews.add(this.VMPPParts);
		this.ViewMenuPrintPreviews.add(this.VMPPScore);
		VM.add(this.ViewMenuViewSize);
		VM.add(this.ViewMenuBarlineStyle);
		VM.add(this.ViewMenuNoteShapeStyle);
		VM.add(this.ViewMenuTexting);
		VM.add(this.ViewMenuPitchSystem);
		VM.add(this.ViewMenuUsemodernclefs);
		VM.add(this.ViewMenuDisplayallnewlineclefs);
		VM.add(this.ViewMenuDisplayligbrackets);
		VM.add(this.ViewMenuEdCommentary);
		VM.addSeparator();
		VM.add(this.ViewMenuViewParts);
		if( MusicWin.viewerWin == null || ! Main.inApplet)
			VM.add(this.ViewMenuPrintPreviews);

		this.VMVSZoomOut.addActionListener(this);
		this.VMVSZoomIn.addActionListener(this);
		this.ViewMenuUsemodernclefs.addItemListener(this);
		this.ViewMenuDisplayallnewlineclefs.addItemListener(this);
		this.ViewMenuDisplayligbrackets.addItemListener(this);
		this.ViewMenuEdCommentary.addItemListener(this);
		this.ViewMenuViewParts.addActionListener(this);
		this.VMPPParts.addActionListener(this);
		this.VMPPScore.addActionListener(this);
		return VM;
	}
	/* view size submenu */
	/* insert DefaultViewScale into VMVSnums array */
	/* was DefaultViewScale not inserted? */
	/* barline style submenu */
	/* note shape / reduction submenu */
	/* texting submenu */
	/* pitch system submenu */
	/* print previews submenu */
	/* add menus and items */
	/* add listeners for menu items */
	/* Analysis Menu */
	AnalysisMenuMarkDissonances:JCheckBoxMenuItem;
	AnalysisMenuMarkDirectedProgressions:JCheckBoxMenuItem;

	public createAnalysisMenu_1():JMenu
	{
		let AM:JMenu = new JMenu("Analysis");
		this.AnalysisMenuMarkDissonances = new JCheckBoxMenuItem("Mark dissonances");
		this.AnalysisMenuMarkDirectedProgressions = new JCheckBoxMenuItem("Mark directed progressions");
		AM.add(this.AnalysisMenuMarkDissonances);
		AM.add(this.AnalysisMenuMarkDirectedProgressions);
		this.AnalysisMenuMarkDissonances.addItemListener(this);
		this.AnalysisMenuMarkDirectedProgressions.addItemListener(this);
		return AM;
	}

	/*------------------------------------------------------------------------
Method:  ZoomControl createTBZoomControl()
Purpose: Create zoom control for main toolbar
Parameters:
  Input:  -
  Output: -
  Return: zoom control (also stored in MTZoomControl)
------------------------------------------------------------------------*/
	public createTBZoomControl():ZoomControl
	{
		return this.MTZoomControl = ZoomControl.new0_5(this.curViewSize,this);
	}
	/*------------------------------------------------------------------------
Method:  JToolBar createMainToolBar()
Purpose: Create main tool bar beneath menu
Parameters:
  Input:  -
  Output: -
  Return: tool bar
------------------------------------------------------------------------*/
	MTNoteShapesModButton:JButton;
	MTNoteShapesOldButton:JButton;
	MTClefsModButton:JButton;
	MTClefsOldButton:JButton;
	MTEdAccidentalsButton:JButton;
	MTPitchModButton:JButton;
	MTPitchOldButton:JButton;
	MTTextingModButton:JButton;
	MTTextingOldButton:JButton;
	MTVersionLabel:JLabel = null;
	protected PlayButton:JButton;

	public createMainToolBar_1():JToolBar
	{
		let mtb:JToolBar = new JToolBar();
		mtb.setFloatable(false);
		mtb.setFocusable(false);
		mtb.setRollover(true);
		mtb.setLayout(new GridBagLayout());
		mtb.setAlignmentY(Component.LEFT_ALIGNMENT);
		mtb.setAlignmentX(Component.LEFT_ALIGNMENT);
		let tbc:GridBagConstraints = new GridBagConstraints();
		tbc.anchor = GridBagConstraints.WEST;
		tbc.weightx = 0;
		this.MTNoteShapesOldButton = this.createMainTBButton(MusicWin.NoteShapesOldIcon_light,"Original noteshapes");
		this.MTNoteShapesModButton = this.createMainTBButton(MusicWin.NoteShapesModIcon_dark,"Modern noteshapes");
		this.MTClefsOldButton = this.createMainTBButton(MusicWin.ClefsOldIcon_light,"Original clefs");
		this.MTClefsModButton = this.createMainTBButton(MusicWin.ClefsModIcon_dark,"Modern clefs");
		this.MTEdAccidentalsButton = this.createMainTBButton(MusicWin.EdAccidentalsIcon_dark,"Show/hide editorial accidentals");
		this.MTPitchOldButton = this.createMainTBButton(MusicWin.PitchOldIcon_light,"Original accidental system");
		this.MTPitchModButton = this.createMainTBButton(MusicWin.PitchModIcon_dark,"Modern accidental/key system");
		this.MTTextingOldButton = this.createMainTBButton(MusicWin.TextingOldIcon_light,"Original texting");
		this.MTTextingModButton = this.createMainTBButton(MusicWin.TextingModIcon_dark,"Modern texting");
		this.setTexting(this.optSet.get_displayOrigText(),this.optSet.get_displayModText());
		this.setUseModernClefs(this.optSet.get_usemodernclefs());
		this.setUseModernPitch(this.optSet.getUseModernAccidentalSystem());
		this.setEdAccidentals(this.optSet.get_modacc_type());
		this.updateTBNSButtons();
		this.PlayButton = new JButton("PLAY");
		this.PlayButton.addActionListener(this);
		tbc.gridx = - 1;
		tbc.gridx ++;
		tbc.gridy = 0;
		tbc.weightx = 0;
		mtb.add(this.MTNoteShapesOldButton,tbc);
		tbc.gridx ++;
		tbc.gridy = 0;
		tbc.weightx = 0;
		mtb.add(this.MTNoteShapesModButton,tbc);
		tbc.gridx ++;
		mtb.addSeparator();
		tbc.gridx ++;
		tbc.gridy = 0;
		tbc.weightx = 0;
		mtb.add(this.MTClefsOldButton,tbc);
		tbc.gridx ++;
		tbc.gridy = 0;
		tbc.weightx = 0;
		mtb.add(this.MTClefsModButton,tbc);
		tbc.gridx ++;
		mtb.addSeparator();
		tbc.gridx ++;
		tbc.gridy = 0;
		tbc.weightx = 0;
		mtb.add(this.MTEdAccidentalsButton,tbc);
		tbc.gridx ++;
		mtb.addSeparator();
		tbc.gridx ++;
		tbc.gridy = 0;
		tbc.weightx = 0;
		mtb.add(this.MTPitchOldButton,tbc);
		tbc.gridx ++;
		tbc.gridy = 0;
		tbc.weightx = 0;
		mtb.add(this.MTPitchModButton,tbc);
		tbc.gridx ++;
		mtb.addSeparator();
		tbc.gridx ++;
		tbc.gridy = 0;
		tbc.weightx = 0;
		mtb.add(this.MTTextingOldButton,tbc);
		tbc.gridx ++;
		tbc.gridy = 0;
		tbc.weightx = 1;
		mtb.add(this.MTTextingModButton,tbc);
		tbc.gridx ++;
		mtb.addSeparator();
		tbc.gridx ++;
		tbc.gridy = 0;
		tbc.weightx = 0;
		mtb.add(this.PlayButton,tbc);
		tbc.gridx ++;
		mtb.addSeparator();
		tbc.gridx ++;
		tbc.gridy = 0;
		tbc.weightx = 0;
		mtb.add(this.MTVersionLabel = this.createTBVersionDisplay(),tbc);
		tbc.gridx ++;
		tbc.gridy = 0;
		tbc.weightx = 0;
		mtb.add(this.MTZoomControl = this.createTBZoomControl(),tbc);
		return mtb;
	}

	//    setUseModernNoteShapes(optSet.useModernNoteShapes());
	/*------------------------------------------------------------------------
Method:  JButton createMainTBButton(ImageIcon img,String tipText)
Purpose: Create one button for main tool bar
Parameters:
  Input:  ImageIcon img  - image for button
          String tipText - tool tip text
  Output: -
  Return: button
------------------------------------------------------------------------*/
	createMainTBButton(img:ImageIcon,tipText:string):JButton
	{
		let b:JButton = new JButton();
		b.setMargin(new Insets(1,1,1,1));
		b.setIcon(img);
		b.setToolTipText(tipText);
		b.setFocusable(false);
		b.addActionListener(this);
		return b;
	}
	/*------------------------------------------------------------------------
Method:  JLabel createTBVersionDisplay()
Purpose: Create version display area for main tool bar
Parameters:
  Input:  -
  Output: -
  Return: label
------------------------------------------------------------------------*/
	static VERSION_LABEL_TEXT:string = "Version: ";
	static VERSION_DEFAULT_TEXT:string = "Default";

	createTBVersionDisplay():JLabel
	{
		let versionText:string = "";
		if( this.musicData.getVariantVersions().size() > 0)
			{
				versionText = MusicWin.VERSION_LABEL_TEXT + this.musicData.getVariantVersion_1(0).getID() + " ";
			}

		let newLabel:JLabel = new JLabel(versionText);
		newLabel.setForeground(Color.GRAY);
		return newLabel;
	}

	/*------------------------------------------------------------------------
Method:  void updateTBVersionDisplay(VariantVersionData v)
Purpose: Update version display area in main tool bar
Parameters:
  Input:  VariantVersionData v - new version for display
  Output: -
  Return: -
------------------------------------------------------------------------*/
	updateTBVersionDisplay(v:VariantVersionData):void
	{
		if( this.MTVersionLabel == null)
			return;

		let newText:string = v == null ? MusicWin.VERSION_DEFAULT_TEXT:v.getID();
		this.MTVersionLabel.setText(MusicWin.VERSION_LABEL_TEXT + newText + " ");
		this.pack();
	}

	/*------------------------------------------------------------------------
Method:  ViewCanvas createMusicCanvas(PieceData p,MusicFont mf,MusicWin mw,OptionSet os)
Purpose: Create music viewing area
Parameters:
  Input:  PieceData p,MusicFont mf,MusicWin mw,OptionSet os - constructor params
  Output: -
  Return: viewing canvas
------------------------------------------------------------------------*/
	public createMusicCanvas_1(p:PieceData,mf:MusicFont,mw:MusicWin,os:OptionSet):ViewCanvas
	{
		return new ViewCanvas(p,mf,mw,os);
	}
	/*------------------------------------------------------------------------
Method:  JPanel createStatusPanel()
Purpose: Create information panel under viewscreen/scrollbar
Parameters:
  Input:  -
  Output: -
  Return: panel
------------------------------------------------------------------------*/
	protected static commentaryLabel:string = "<font color=\"red\"><i>Commentary: </i></font>";
	protected static commentaryDefault:string = "No commentary selected";
	protected commentaryTextArea:JEditorPane = null;
	protected commentaryScrollPane:JScrollPane;
	protected commentaryPanel:JPanel;
	protected commentaryPanelDisplayed:boolean;

	public createStatusPanel_1():JPanel
	{
		let measurePanel:JPanel = new JPanel();
		this.StatusMeasureLabel = new JLabel("Measure:");
		this.StatusMeasureNum = new JLabel("1/" + this.ViewScr.nummeasures);
		measurePanel.add("West",this.StatusMeasureLabel);
		measurePanel.add("East",this.StatusMeasureNum);
		this.commentaryTextArea = new JEditorPane("text/html",MusicWin.commentaryLabel + MusicWin.commentaryDefault);
		this.commentaryScrollPane = new JScrollPane(this.commentaryTextArea);
		this.commentaryTextArea.setEditable(false);
		this.commentaryScrollPane.setPreferredSize(new Dimension(100,75));
		this.commentaryScrollPane.setMinimumSize(new Dimension(20,20));
		this.commentaryPanel = new JPanel();
		this.commentaryPanel.setLayout(new BoxLayout(this.commentaryPanel,BoxLayout.X_AXIS));
		this.commentaryPanelDisplayed = true;
		let sp:JPanel = new JPanel();
		this.layoutStatusPanel(sp,measurePanel,this.commentaryPanel);
		return sp;
	}

	//commentaryPanel.add(commentaryScrollPane,0);
	//sp.setVisible(false); //change
	layoutStatusPanel(sp:JPanel,measurePanel:JPanel,commentaryPanel:JPanel):void
	{
		sp.removeAll();
		sp.setLayout(new BoxLayout(sp,BoxLayout.Y_AXIS));
		sp.add(measurePanel);
		if( this.commentaryPanelDisplayed)
			sp.add(commentaryPanel);

	}

	public showCommentaryPanel(show:boolean):void
	{
		if( show == this.commentaryPanelDisplayed)
			return;

		this.commentaryPanelDisplayed = show;
		if( show)
			this.StatusPanel.add(this.commentaryPanel);
		else
			this.StatusPanel.remove(this.commentaryPanel);

		this.StatusPanel.validate();
		this.pack();
	}

	public updateCommentaryArea(vnum:number,mnum:number,edCommentary:string):void
	{
		if( vnum < 0)
			{
				this.commentaryTextArea.setText(MusicWin.commentaryLabel + MusicWin.commentaryDefault);
				return;
			}

		vnum ++;
		mnum ++;
		let commentaryLoc:string = "<font color=\"blue\">Voice " + vnum + ", m. " + mnum + ": </font>";
		this.commentaryTextArea.setText(MusicWin.commentaryLabel + commentaryLoc + edCommentary);
	}

	/* no commentary selected */
	/*------------------------------------------------------------------------
Method:  void [show|create]GenPDFDialog()
Purpose: Bring up dialog with PDF-generation options
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	showGenPDFDialog():void
	{
		this.genPDFDialog.setLocationRelativeTo(this);
		this.genPDFDialog.setVisible(true);
	}
	//    new PDFCreator(partsWin.getRenderLists(),"test.pdf");
	PDFScoreButton:JRadioButton;
	PDFPartsButton:JRadioButton;
	genPDFOKButton:JButton;
	genPDFCancelButton:JButton;

	createGenPDFDialog():void
	{
		this.genPDFDialog = new JDialog(this,"Generate PDF",true);
		let optionsPane:JPanel = new JPanel();
		optionsPane.setLayout(new BoxLayout(optionsPane,BoxLayout.Y_AXIS));
		optionsPane.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder("Options"),BorderFactory.createEmptyBorder(5,5,5,5)));
		this.PDFScoreButton = new JRadioButton("Score",true);
		this.PDFPartsButton = new JRadioButton("Parts");
		let ScoreOrPartsGroup:ButtonGroup = new ButtonGroup();
		ScoreOrPartsGroup.add(this.PDFScoreButton);
		ScoreOrPartsGroup.add(this.PDFPartsButton);
		optionsPane.add(this.PDFScoreButton);
		optionsPane.add(this.PDFPartsButton);
		this.genPDFOKButton = new JButton("Generate...");
		this.genPDFCancelButton = new JButton("Cancel");
		let buttonPane:Box = Box.createHorizontalBox();
		buttonPane.add(Box.createHorizontalGlue());
		buttonPane.add(this.genPDFOKButton);
		buttonPane.add(Box.createHorizontalStrut(10));
		buttonPane.add(this.genPDFCancelButton);
		buttonPane.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
		let gpcp:Container = this.genPDFDialog.getContentPane();
		gpcp.add(optionsPane,BorderLayout.CENTER);
		gpcp.add(buttonPane,BorderLayout.SOUTH);
		this.genPDFOKButton.addActionListener(this);
		this.genPDFCancelButton.addActionListener(this);
		this.genPDFDialog.pack();
	}

	/* action buttons */
	/* lay out frame */
	/* register listeners */
	/*------------------------------------------------------------------------
Method:  boolean fileExportAs(int fileType)
Purpose: Choose file name and export score in external format
Parameters:
  Input:  -
  Output: -
  Return: whether file saved successfully
------------------------------------------------------------------------*/
	checkAndAddExtension(fn:string,fileType:number):string
	{
		switch( fileType)
		{
			case MusicWin.FILETYPE_MIDI:
			{
				if( ! MusicWin.isMIDIFilename(fn))
					fn += MusicWin.FILENAME_EXTENSION_MIDI;

				break;
			}
			case MusicWin.FILETYPE_XML:
			{
				if( ! MusicWin.isMusicXMLFilename(fn))
					fn += MusicWin.FILENAME_EXTENSION_XML;

			}
		}
		return fn;
	}

	public fileExportAs(fileType:number):boolean
	{
		try
		{
			switch( fileType)
			{
				case MusicWin.FILETYPE_MIDI:
				{
					new MIDIPlayer(this,this.ViewScr.getMusicData_1(),this.ViewScr.getRenderedMusic()).exportMIDIFile("");
					break;
				}
				case MusicWin.FILETYPE_XML:
				{
					this.writeMusicXMLFile("");
					break;
				}
				default:
				{
					throw new Exception("Unsupported file type");
				}
			}
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
				}

			else
				throw e;

		}
		return true;
	}

	/* 
    JFileChooser fc=getExportFileChooser();
    FileFilter   ff=null;
    switch (fileType)
      {
        case FILETYPE_MIDI:
          ff=MIDIFFilter;
          break;
        case FILETYPE_XML:
          ff=XMLFFilter;
          break;
      }
    fc.setFileFilter(ff);
    int fcval=fc.showSaveDialog(this);

    if (fcval==JFileChooser.APPROVE_OPTION)
      try
        {
          File saveFile=exportFileChooser.getSelectedFile();

          // make sure extension is valid 
          String fn=saveFile.getCanonicalPath(),
                 fullFN=checkAndAddExtension(fn,fileType);
          if (!fn.equals(fullFN))
            {
              fn=fullFN;
              saveFile=new File(fn);
            }

          if (doNotOverwrite(saveFile))
            return false;

          switch (fileType)
            {
              case FILETYPE_MIDI:
               // new MIDIPlayer(this,ViewScr.getMusicData(),ViewScr.getRenderedMusic()).exportMIDIFile(fn); //CHANGE
                break;
              case FILETYPE_XML:
                writeMusicXMLFile(saveFile);
                break;
              default:
                throw new Exception("Unsupported file type");
            }
        }
      catch (Exception e)
        {
          displayErrorMessage("Error saving file \""+exportFileChooser.getSelectedFile().getName()+"\":\n"+e,"File not saved");

//          System.err.println("Error saving "+musicWinFileChooser.getSelectedFile().getName());
//          e.printStackTrace();
        }
*/
	writeMusicXMLFile(s:string):void
	{
		let renderedPages:ScorePageRenderer = new ScorePageRenderer(this.musicData,OptionSet.makeDEFAULT_FULL_MODERN(this),new Dimension(ScorePagePreviewWin.STAFFXSIZE,ScorePagePreviewWin.DRAWINGSPACEY),ScorePagePreviewWin.STAFFSCALE,ScorePagePreviewWin.CANVASYSCALE);
		new MusicXMLGenerator(renderedPages).outputPieceData(null);
	}

	/*File f*/
	/*new FileOutputStream(f)*/
	//CHANGE removed musicxmlgenerator
	/*------------------------------------------------------------------------
Method:  void generatePDF()
Purpose: Create PDF with user-chosen options
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	generatePDF():void
	{
		let pdfName:string = null;
		let genParts:boolean = this.PDFPartsButton.isSelected();
		let renderedPages:ScorePageRenderer = null;
		let renderedParts:ArrayList<RenderList>[]= null;
		if( genParts)
			{
				let PDFPartsWin:PartsWin = PartsWin.new0_8(this.ViewScr.getMusicData_1(),this.MusicGfx,this,true);
				renderedParts = PDFPartsWin.getRenderLists();
				PDFPartsWin.closewin_3();
				pdfName = this.windowFileName.replaceFirst("\\.cmme\\.xml","-parts.pdf");
			}

		else
			{
				renderedPages = new ScorePageRenderer(this.ViewScr.getMusicData_1(),this.optSet,new Dimension(ScorePagePreviewWin.STAFFXSIZE,ScorePagePreviewWin.DRAWINGSPACEY),ScorePagePreviewWin.STAFFSCALE,ScorePagePreviewWin.CANVASYSCALE);
				pdfName = this.windowFileName.replaceFirst("cmme\\.xml","pdf");
			}

		MusicWin.PDFFileChooser = MusicWin.getPDFFileChooser();
		let initFile:File = new File(MusicWin.PDFFileChooser.getCurrentDirectory(),pdfName);
		MusicWin.PDFFileChooser.setSelectedFile(initFile);
		let FCval:number = MusicWin.PDFFileChooser.showSaveDialog(this);
		if( FCval == JFileChooser.APPROVE_OPTION)
			try
			{
				let saveFile:File = MusicWin.PDFFileChooser.getSelectedFile();
				if( this.doNotOverwrite(saveFile))
					return;

				let fn:string = saveFile.getCanonicalPath();
				if( ! fn.matches(".*\\.pdf"))
					{
						fn = fn.concat(".pdf");
						saveFile = new File(fn);
					}

				if( genParts)
					PDFCreator.new0(renderedParts).createPDF_1(saveFile);
				else
					PDFCreator.new1(renderedPages).createPDF_1(saveFile);

			}
			catch( e)
			{
				if( e instanceof Exception)
					{
						System.err.println("Error saving " + MusicWin.PDFFileChooser.getSelectedFile().getName());
						this.handleRuntimeError(e);
					}

				else
					throw e;

			}

		this.genPDFDialog.setVisible(false);
	}

	/* save */
	/*------------------------------------------------------------------------
Method:  void setViewSize|ViewSizeFieldAction|zoomIn|zoomOut()
Purpose: Functions to control view scale through GUI
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public ViewSizeFieldAction():void
	{
		this.setViewSize_2(this.MTZoomControl.viewSizeFieldAction());
	}

	public zoomOut_2():void
	{
		this.VMVSnumItems[this.MTZoomControl.getSizeIndex(this.MTZoomControl.zoomOut_1())].doClick();
	}

	public zoomIn_2():void
	{
		this.VMVSnumItems[this.MTZoomControl.getSizeIndex(this.MTZoomControl.zoomIn_1())].doClick();
	}

	public setViewSize_2(ns:number):void
	{
		this.curViewSize = ns;
		if( this.MTZoomControl != null)
			this.MTZoomControl.setViewSize_1(this.curViewSize);

		this.optSet.setVIEWSCALE(<number> this.curViewSize / 100);
		this.ViewScr.newViewScale_1();
	}

	getGreaterVSNum(vs:number):number
	{
		for(
		let i:number =(( this.VMVSnums.length - 1) | 0);i >= 0;i --)
		if( this.VMVSnums[i]> vs)
			return i;

		return - 1;
	}

	getLesserVSNum(vs:number):number
	{
		for(
		let i:number = 0;i < this.VMVSnums.length;i ++)
		if( this.VMVSnums[i]< vs)
			return i;

		return - 1;
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
Purpose:    Check for action types in menu and take appropriate action
Parameters:
  Input:  ActionEvent event - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public actionPerformed(event:ActionEvent):void
	{
		let item:any = event.getSource();
		if( item == this.FileMenuAbout)
			this.openAboutWin();
		else
			if( item == this.FileMenuClose)
				this.closewin_1();
			else
				if( item == this.FMExportMIDI)
					this.fileExportAs(MusicWin.FILETYPE_MIDI);
				else
					if( item == this.FMExportXML)
						this.fileExportAs(MusicWin.FILETYPE_XML);
					else
						if( item == this.FileMenuGeneratePDF)
							this.showGenPDFDialog();
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
										if( item == this.VMTOrigText)
											this.setTexting(true,false);
										else
											if( item == this.VMTModText)
												this.setTexting(false,true);
											else
												if( item == this.VMTBothText)
													this.setTexting(true,true);
												else
													if( item == this.VMTNoText)
														this.setTexting(false,false);
													else
														if( item == this.ViewMenuViewParts)
															this.openPartsLayout_1(false);
														else
															if( item == this.VMPPParts)
																this.openPartsLayout_1(true);
															else
																if( item == this.VMPPScore)
																	this.openScorePagePreview();
																else
																	if( item == this.VMOMMarkAllVariants)
																		this.setVariantMarkingOption_2(OptionSet.OPT_VAR_ALL);
																	else
																		if( item == this.VMOMMarkSubstantiveVariants)
																			this.setVariantMarkingOption_2(OptionSet.OPT_VAR_SUBSTANTIVE);
																		else
																			if( item == this.VMOMMarkNoVariants)
																				this.setVariantMarkingOption_2(OptionSet.OPT_VAR_NONE);
																			else
																				if( item == this.VMOMMarkSelectedVariants)
																					this.setVariantMarkingOption_2(OptionSet.OPT_VAR_CUSTOM);
																				else
																					if( item == this.VersionsMenuNewNotesWindow)
																						this.openNewNotesWindow();
																					else
																						if( item == this.VersionsMenuSourceAnalysis)
																							this.openSourceAnalysisWindow();
																						else
																							if( item == this.genPDFOKButton)
																								this.generatePDF();
																							else
																								if( item == this.genPDFCancelButton)
																									this.genPDFDialog.setVisible(false);
																								else
																									if( item == this.MTNoteShapesOldButton)
																										{
																											if( this.optSet.useModernNoteShapes())
																												this.VMNSItems[OptionSet.OPT_NOTESHAPE_ORIG].doClick();

																										}

																									else
																										if( item == this.MTNoteShapesModButton)
																											{
																												if( ! this.optSet.useModernNoteShapes())
																													this.VMNSItems[OptionSet.OPT_NOTESHAPE_MOD_1_1].doClick();

																											}

																										else
																											if( item == this.MTClefsOldButton)
																												{
																													if( this.optSet.get_usemodernclefs())
																														this.ViewMenuUsemodernclefs.doClick();

																												}

																											else
																												if( item == this.MTClefsModButton)
																													{
																														if( ! this.optSet.get_usemodernclefs())
																															this.ViewMenuUsemodernclefs.doClick();

																													}

																												else
																													if( item == this.MTEdAccidentalsButton)
																														this.ViewMenuDisplayEditorialAccidentals.doClick();
																													else
																														if( item == this.MTPitchOldButton)
																															{
																																if( this.optSet.getUseModernAccidentalSystem())
																																	this.ViewMenuModernAccidentalSystem.doClick();

																															}

																														else
																															if( item == this.MTPitchModButton)
																																{
																																	if( ! this.optSet.getUseModernAccidentalSystem())
																																		this.ViewMenuModernAccidentalSystem.doClick();

																																}

																															else
																																if( item == this.MTTextingOldButton)
																																	{
																																		if( this.optSet.get_displayOrigText())
																																			if( this.optSet.get_displayModText())
																																				this.VMTModText.doClick();
																																			else
																																				this.VMTNoText.doClick();


																																		else
																																			if( this.optSet.get_displayModText())
																																				this.VMTBothText.doClick();
																																			else
																																				this.VMTOrigText.doClick();

																																	}

																																else
																																	if( item == this.MTTextingModButton)
																																		{
																																			if( this.optSet.get_displayModText())
																																				if( this.optSet.get_displayOrigText())
																																					this.VMTOrigText.doClick();
																																				else
																																					this.VMTNoText.doClick();


																																			else
																																				if( this.optSet.get_displayOrigText())
																																					this.VMTBothText.doClick();
																																				else
																																					this.VMTModText.doClick();

																																		}

																																	else
																																		if( item == this.PlayButton)
																																			this.toggleMIDIPlay();

		for(
		let i:number = 0;i < this.VMDMVersions.length;i ++)
		if( item == this.VMDMVersions[i])
			this.setCurrentVariantVersion_2(i);

		if( this.updatemusicgfx || this.rerendermusic)
			this.repaint();

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
		let item:any = event.getItemSelectable();
		if( item == this.ViewMenuUsemodernclefs)
			this.setUseModernClefs(! this.optSet.get_usemodernclefs());
		else
			if( item == this.ViewMenuDisplayEditorialAccidentals)
				this.setEdAccidentals(this.optSet.get_modacc_type() == OptionSet.OPT_MODACC_NONE ? OptionSet.OPT_MODACC_ABOVESTAFF:OptionSet.OPT_MODACC_NONE);
			else
				if( item == this.ViewMenuModernAccidentalSystem)
					this.setUseModernPitch(! this.optSet.getUseModernAccidentalSystem());
				else
					if( item == this.ViewMenuDisplayallnewlineclefs)
						{
							this.optSet.set_displayallnewlineclefs(! this.optSet.get_displayallnewlineclefs());
							this.rerendermusic = true;
						}

					else
						if( item == this.ViewMenuDisplayligbrackets)
							{
								this.optSet.set_displayligbrackets(! this.optSet.get_displayligbrackets());
								this.updatemusicgfx = true;
							}

						else
							if( item == this.ViewMenuEdCommentary)
								{
									this.optSet.setViewEdCommentary(! this.optSet.getViewEdCommentary());
									this.showCommentaryPanel(this.optSet.getViewEdCommentary());
									this.rerendermusic = true;
								}

							else
								if( item == this.VersionsMenuDisplayVariantOptions)
									this.variantDisplayOptionsFrame.setVisible(this.VersionsMenuDisplayVariantOptions.isSelected());
								else
									if( item == this.AnalysisMenuMarkDissonances)
										{
											this.optSet.set_markdissonances(! this.optSet.get_markdissonances());
											this.updatemusicgfx = true;
										}

									else
										if( item == this.AnalysisMenuMarkDirectedProgressions)
											{
												this.optSet.set_markdirectedprogressions(! this.optSet.get_markdirectedprogressions());
												this.updatemusicgfx = true;
											}

		if( this.VMOMCustomVariants != null)
			for(
			let vi:number = 0;vi < this.VMOMCustomVariants.length;vi ++)
			if( item == this.VMOMCustomVariants[vi])
				{
					let vflag:number = 1 << vi;
					if( this.VMOMCustomVariants[vi].isSelected())
						this.optSet.addCustomVariantFlags(vflag);
					else
						this.optSet.removeCustomVariantFlags(vflag);

					this.rerendermusic = true;
				}

		if( this.updatemusicgfx || this.rerendermusic)
			this.repaint();

	}

	/*------------------------------------------------------------------------
Method:  void setCurrentVariantVersion(int vi)
Purpose: Select one variant version for display/editing
Parameters:
  Input:  int vi - index of selected version (0 or -1 for DEFAULT)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setCurrentVariantVersion_2(vi:number):void
	{
		let newVersion:VariantVersionData = vi < 0 ? this.musicData.getDefaultVariantVersion():this.musicData.getVariantVersion_1(vi);
		this.setCurrentVariantVersion_3(newVersion);
	}

	public setCurrentVariantVersion_3(newVersion:VariantVersionData):void
	{
		this.ViewScr.setCurrentVariantVersion_1(newVersion);
		this.updateTBVersionDisplay(newVersion);
	}

	public reconstructCurrentVersion():void
	{
		this.ViewScr.setCurrentVariantVersion_1(this.ViewScr.getCurrentVariantVersion_1());
	}

	public rerender_3():void
	{
		this.rerendermusic = true;
		this.repaint();
	}

	/*------------------------------------------------------------------------
Method:  void setUseModern*(boolean newstate)
Purpose: Change state of notational style and update GUI
Parameters:
  Input:  boolean newstate - new state of flag
  Output: -
  Return: -
------------------------------------------------------------------------*/
	updateTBNSButtons():void
	{
		switch( this.optSet.get_noteShapeType())
		{
			case OptionSet.OPT_NOTESHAPE_ORIG:
			{
				this.MTNoteShapesOldButton.setIcon(MusicWin.NoteShapesOldIcon_light);
				this.MTNoteShapesModButton.setIcon(MusicWin.NoteShapesModIcon_dark);
				break;
			}
			default:
			{
				this.MTNoteShapesOldButton.setIcon(MusicWin.NoteShapesOldIcon_dark);
				this.MTNoteShapesModButton.setIcon(MusicWin.NoteShapesModIcon_light);
				break;
			}
		}
	}

	setUseModernClefs(newstate:boolean):void
	{
		if( newstate == true)
			{
				this.MTClefsOldButton.setIcon(MusicWin.ClefsOldIcon_dark);
				this.MTClefsModButton.setIcon(MusicWin.ClefsModIcon_light);
			}

		else
			{
				this.MTClefsOldButton.setIcon(MusicWin.ClefsOldIcon_light);
				this.MTClefsModButton.setIcon(MusicWin.ClefsModIcon_dark);
			}

		this.optSet.set_usemodernclefs(newstate);
		this.rerendermusic = true;
	}

	/*    if (newstate==optSet.get_usemodernclefs())
      return;*/
	/*------------------------------------------------------------------------
Method:  void setEdAccidentals(int newstate)
Purpose: Change state of editorial accidental display and update GUI
Parameters:
  Input:  int newstate - new state of flag
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setEdAccidentals(newstate:number):void
	{
		if( newstate == OptionSet.OPT_MODACC_NONE)
			this.MTEdAccidentalsButton.setIcon(MusicWin.EdAccidentalsIcon_dark);
		else
			this.MTEdAccidentalsButton.setIcon(MusicWin.EdAccidentalsIcon_light);

		this.optSet.set_modacc_type(newstate);
		this.rerendermusic = true;
	}

	/*    if (newstate==optSet.get_modacc_type())
      return;*/
	/*------------------------------------------------------------------------
Method:  void setUseModernPitch(boolean newstate)
Purpose: Change state of pitch system and update GUI
Parameters:
  Input:  boolean newstate - new state of flag
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setUseModernPitch(newstate:boolean):void
	{
		if( newstate == true)
			{
				this.MTPitchOldButton.setIcon(MusicWin.PitchOldIcon_dark);
				this.MTPitchModButton.setIcon(MusicWin.PitchModIcon_light);
			}

		else
			{
				this.MTPitchOldButton.setIcon(MusicWin.PitchOldIcon_light);
				this.MTPitchModButton.setIcon(MusicWin.PitchModIcon_dark);
			}

		this.optSet.setUseModernAccidentalSystem(newstate);
		this.rerendermusic = true;
	}

	/*    if (newstate==optSet.getUseModernAccidentalSystem())
      return;*/
	/*------------------------------------------------------------------------
Method:  void setTexting(boolean origText,boolean modText)
Purpose: Change state of texting and update GUI
Parameters:
  Input:  boolean origText,modText - new states of flags
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setTexting(origText:boolean,modText:boolean):void
	{
		this.MTTextingOldButton.setIcon(origText ? MusicWin.TextingOldIcon_light:MusicWin.TextingOldIcon_dark);
		this.MTTextingModButton.setIcon(modText ? MusicWin.TextingModIcon_light:MusicWin.TextingModIcon_dark);
		this.optSet.set_displayOrigText(origText);
		this.optSet.set_displayModText(modText);
		this.rerendermusic = true;
	}

	/*    if (origText==optSet.get_displayOrigText() &&
        modText==optSet.get_displayModText())
      return;*/
	/*------------------------------------------------------------------------
Method:  void setVariantMarkingOption(int newOption)
Purpose: Change state of variant marking and update GUI
Parameters:
  Input:  int newOption - new state of flags
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setVariantMarkingOption_1(newOption:number,newFlags:number):void
	{
		this.optSet.setCustomVariantFlags(newFlags);
		this.setVariantMarkingOption_2(newOption);
	}

	setVariantMarkingOption_2(newOption:number):void
	{
		this.optSet.setMarkVariants(newOption);
		this.rerendermusic = true;
		for(let cb of this.VMOMCustomVariants)
		cb.setEnabled(this.optSet.getMarkVariants() == OptionSet.OPT_VAR_CUSTOM);
	}

	setVersionsMenuDisplayVariantOptions(newval:boolean):void
	{
		this.VersionsMenuDisplayVariantOptions.setSelected(newval);
	}

	/*------------------------------------------------------------------------
Method:  void unregisterListeners()
Purpose: Remove all action/item/etc listeners when disposing of window
         resources
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public unregisterListeners_3():void
	{
		let al:AdjustmentListener[]= this.MusicScrollBarX.getListeners("AdjustmentListener");
		for(
		let i:number = 0;i < al.length;i ++)
		this.MusicScrollBarX.removeAdjustmentListener(al[i]);
		al = this.MusicScrollBarY.getListeners("AdjustmentListener");
		for(
		let i:number = 0;i < al.length;i ++)
		this.MusicScrollBarY.removeAdjustmentListener(al[i]);
		let wl:WindowListener[]= this.getListeners("WindowListener");
		for(
		let i:number = 0;i < wl.length;i ++)
		this.removeWindowListener(wl[i]);
		let cl:ComponentListener[]= this.getListeners("ComponentListener");
		for(
		let i:number = 0;i < cl.length;i ++)
		this.removeComponentListener(cl[i]);
		this.genPDFOKButton.removeActionListener(this);
		this.genPDFCancelButton.removeActionListener(this);
		this.ViewScr.unregisterListeners_1();
		this.unregisterToolListeners_1();
	}

	/* override just this one when changing menu/tool structures in subclasses */
	public unregisterToolListeners_1():void
	{
		this.FileMenuAbout.removeActionListener(this);
		this.FileMenuClose.removeActionListener(this);
		this.FMExportMIDI.removeActionListener(this);
		this.FMExportXML.removeActionListener(this);
		this.FileMenuGeneratePDF.removeActionListener(this);
		for(
		let i:number = 0;i < this.VMVSnumItems.length;i ++)
		this.VMVSnumItems[i].removeActionListener(this.VSListener);
		for(
		let i:number = 0;i < this.VMBSItems.length;i ++)
		this.VMBSItems[i].removeActionListener(this.VMBSListener);
		for(
		let i:number = 0;i < this.VMNSItems.length;i ++)
		this.VMNSItems[i].removeActionListener(this.VMNSListener);
		this.VMVSZoomOut.removeActionListener(this);
		this.VMVSZoomIn.removeActionListener(this);
		this.VMTOrigText.removeActionListener(this);
		this.VMTModText.removeActionListener(this);
		this.VMTBothText.removeActionListener(this);
		this.VMTNoText.removeActionListener(this);
		this.ViewMenuUsemodernclefs.removeItemListener(this);
		this.ViewMenuDisplayEditorialAccidentals.removeItemListener(this);
		this.ViewMenuModernAccidentalSystem.removeItemListener(this);
		this.ViewMenuDisplayallnewlineclefs.removeItemListener(this);
		this.ViewMenuDisplayligbrackets.removeItemListener(this);
		this.ViewMenuEdCommentary.removeItemListener(this);
		this.ViewMenuViewParts.removeActionListener(this);
		this.VMPPParts.removeActionListener(this);
		this.VMPPScore.removeActionListener(this);
		this.MTNoteShapesOldButton.removeActionListener(this);
		this.MTNoteShapesModButton.removeActionListener(this);
		this.MTClefsModButton.removeActionListener(this);
		this.MTClefsOldButton.removeActionListener(this);
		this.MTZoomControl.removeListeners_2();
		this.PlayButton.removeActionListener(this);
		this.VersionsMenuGeneralInfo.removeActionListener(this);
		for(let jr of this.VMDMVersions)
		jr.removeActionListener(this);
		this.VersionsMenuNewNotesWindow.removeActionListener(this);
		this.VersionsMenuDisplayVariantOptions.removeItemListener(this);
		this.VersionsMenuSourceAnalysis.removeActionListener(this);
		this.variantDisplayOptionsFrame.unregisterListeners_9();
		this.VMOMMarkAllVariants.removeActionListener(this);
		this.VMOMMarkSubstantiveVariants.removeActionListener(this);
		this.VMOMMarkNoVariants.removeActionListener(this);
		this.VMOMMarkSelectedVariants.removeActionListener(this);
		for(let cb of this.VMOMCustomVariants)
		cb.removeItemListener(this);
		this.AnalysisMenuMarkDissonances.removeItemListener(this);
		this.AnalysisMenuMarkDirectedProgressions.removeItemListener(this);
	}

	/*------------------------------------------------------------------------
Method:  boolean closewin()
Purpose: Close window and dependents
Parameters:
  Input:  -
  Output: -
  Return: whether window was closed or not
------------------------------------------------------------------------*/
	public closewin_1():boolean
	{
		if( this.partsWin != null)
			{
				this.partsWin.closewin_3();
				this.partsWin = null;
			}

		if( this.scorePageWin != null)
			{
				this.scorePageWin.closewin_4();
				this.scorePageWin = null;
			}

		let openNotesWindows:ArrayList<CriticalNotesWindow> = new ArrayList<CriticalNotesWindow>(this.notesWindows);
		for(let cnw of openNotesWindows)
		cnw.closeFrame_2();
		this.genPDFDialog.dispose();
		this.unregisterListeners_3();
		this.stopMIDIPlay();
		MusicWin.fileWindows.remove(this);
		if( MusicWin.viewerWin != null)
			MusicWin.viewerWin.removeFromWindowList(this.windowFileName);

		this.dispose();
		return true;
	}
	/*------------------------------------------------------------------------
Method:  void gotomeasure(int mnum)
Purpose: Move scroll bar and display to new measure
Parameters:
  Input:  int mnum - measure number
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public updateMeasure:number = - 1;

	public gotomeasure(mnum:number):void
	{
		this.MusicScrollBarX.setValue(mnum);
		if( this.MusicScrollBarX.getValue() != mnum)
			this.MusicScrollBarX.setValue(mnum);

		if( this.MusicScrollBarX.getValue() != mnum)
			this.updateMeasure = mnum;
		else
			this.updateMeasure = - 1;

	}

	/*------------------------------------------------------------------------
Method:  void gotoHeight(int newY)
Purpose: Move vertical scroll bar and display to new height
Parameters:
  Input:  int newY - new Y val
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public gotoHeight(newY:number):void
	{
		this.MusicScrollBarY.setValue(newY);
	}

	//    while (MusicScrollBarY.getValue()!=newY)
	/*------------------------------------------------------------------------
Method:  void setmeasurenum(int mnum)
Purpose: Display measure number in status panel
Parameters:
  Input:  int mnum - measure number
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setmeasurenum(mnum:number):void
	{
		this.StatusMeasureNum.setText(mnum + "/" + this.ViewScr.nummeasures);
	}

	/*------------------------------------------------------------------------
Method:  void setScrollBarXextent(int extent)
Purpose: Set the extent of the horizontal scrollbar
Parameters:
  Input:  int extent - new extent
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setScrollBarXextent(extent:number):void
	{
		this.MusicScrollBarX.setVisibleAmount(extent);
		this.MusicScrollBarX.setBlockIncrement(extent);
	}

	/*------------------------------------------------------------------------
Method:  void setScrollBarXmax(int max)
Purpose: Set the maximum value of the horizontal scrollbar
Parameters:
  Input:  int max - new maximum
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setScrollBarXmax_1(max:number):void
	{
		this.MusicScrollBarX.setMaximum(max);
	}

	public setScrollBarXmax_2():void
	{
		this.setScrollBarXmax_1(this.ViewScr.nummeasures);
	}

	/*------------------------------------------------------------------------
Method:  void setScrollBarYparams(int virtual_height,int view_height,int val)
Purpose: Set parameters for the vertical scrollbar
Parameters:
  Input:  int virtual_height - total y size of view screen
          int view_height    - y amount of view screen visible
          int val            - scroll bar position
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setScrollBarYparams(virtual_height:number,view_height:number,val:number):void
	{
		this.MusicScrollBarY.setValue(val);
		this.MusicScrollBarY.setMaximum(virtual_height);
		this.MusicScrollBarY.setVisibleAmount(view_height);
		this.MusicScrollBarY.setUnitIncrement(10);
		this.MusicScrollBarY.setBlockIncrement(((<number> virtual_height / 10) | 0));
	}
	//System.out.println("VirtH="+virtual_height+" ViewH="+view_height);
	/*------------------------------------------------------------------------
Method:  void openAboutWin()
Purpose: Open general information window
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	aboutWin:GeneralInfoFrame = null;

	public openAboutWin():void
	{
		if( this.aboutWin == null)
			this.aboutWin = new GeneralInfoFrame(this);

		this.aboutWin.setVisible(true);
		this.aboutWin.toFront();
	}

	/*------------------------------------------------------------------------
Method:  void openPartsLayout(boolean printpreview)
Purpose: Open new window with unscored parts in original notation
Parameters:
  Input:  boolean printpreview - whether to open print view or regular view
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public openPartsLayout_1(printpreview:boolean):void
	{
		if( this.partsWin != null)
			this.partsWin.closewin_3();

		if( this.ViewScr.getCurrentVariantVersion_1() == this.musicData.getDefaultVariantVersion())
			printpreview = true;

		this.partsWin = PartsWin.new0_8(this.ViewScr.getMusicData_1(),this.MusicGfx,this,printpreview);
		this.partsWin.openwin_1();
	}

	public openPartsLayout_2():void
	{
		this.openPartsLayout_1(false);
	}

	/*------------------------------------------------------------------------
Method:  void openScorePagePreview()
Purpose: Open new window with score in page layout
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public openScorePagePreview():void
	{
		if( this.scorePageWin != null)
			this.scorePageWin.closewin_4();

		this.scorePageWin = new ScorePagePreviewWin(this.musicData,this);
		this.scorePageWin.openwin_2();
	}
	/*------------------------------------------------------------------------
Method:  void openNewNotesWindow()
Purpose: Open new window with critical notes
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	protected notesWindows:LinkedList<CriticalNotesWindow> = new LinkedList<CriticalNotesWindow>();

	public openNewNotesWindow():void
	{
		let notesWin:CriticalNotesWindow = new CriticalNotesWindow(this.musicData,this,this.MusicGfx,this.ViewScr.STAFFSCALE,this.ViewScr.VIEWSCALE);
		this.notesWindows.add(notesWin);
		notesWin.setVisible(true);
	}

	public notesWindowClosed(notesWin:CriticalNotesWindow):void
	{
		this.notesWindows.remove(notesWin);
	}

	/*------------------------------------------------------------------------
Method:  void openSourceAnalysisWindow()
Purpose: Open window with source/variant analysis visualizations
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public openSourceAnalysisWindow():void
	{
		let val:VariantAnalysisList = VariantAnalysisList.new0_3(this.musicData,this);
	}
	/* MIDI Playback functions */
	scorePlayer:MIDIPlayer = null;

	public toggleMIDIPlay():void
	{
		if( this.scorePlayer == null || ! this.scorePlayer.currentlyPlaying())
			{
				this.startMIDIPlay();
				this.PlayButton.setText("STOP");
			}

		else
			{
				this.stopMIDIPlay();
				this.PlayButton.setText("PLAY");
			}

	}

	public startMIDIPlay():void
	{
		this.scorePlayer = new MIDIPlayer(this,this.ViewScr.getMusicData_1(),this.ViewScr.getRenderedMusic());
		this.scorePlayer.play_2(this.ViewScr.curmeasure);
	}

	public stopMIDIPlay():void
	{
		if( this.scorePlayer != null)
			this.scorePlayer.stop();

		this.ViewScr.MIDIMeasureStarted_1(- 1,null);
	}

	public MIDIEnded():void
	{
		this.PlayButton.setText("PLAY");
		this.ViewScr.MIDIMeasureStarted_1(- 1,null);
	}

	public MIDIMeasureStarted_2(mnum:number):void
	{
		this.ViewScr.MIDIMeasureStarted_1(mnum,this.MusicScrollBarX);
	}

	/*------------------------------------------------------------------------
Methods:    void window[Gained|Lost]Focus(WindowEvent e)
Implements: WindowFocusListener.window[Gained|Lost]Focus
Purpose:    Take action when window focus is gained or lost
Parameters:
  Input:  WindowEvent e - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public windowGainedFocus(e:WindowEvent):void
	{
		MusicWin.curWindow = this;
	}

	public windowLostFocus(e:WindowEvent):void
	{
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getCurrentVariantVersion_2():VariantVersionData
	{
		return this.ViewScr.getCurrentVariantVersion_1();
	}

	public getMusicData_2():PieceData
	{
		return this.musicData;
	}

	public getWindowFileName():string
	{
		return this.windowFileName;
	}

	/*------------------------------------------------------------------------
Method:  void handleRuntimeError(Exception e)
Purpose: Default handler for exceptions thrown by AWT threads
Parameters:
  Input:  Exception e - exception to report
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public handleRuntimeError(e:Exception):void
	{
		if( MetaData.CMME_OPT_TESTING)
			{
				let stackTraceStr:string = "";
				for(
				let i:number = 0;i < e.getStackTrace().length && i < MusicWin.MAX_STACK_TRACE_LEVELS;i ++)
				stackTraceStr += e.getStackTrace()[i]+ "\n";
				this.displayErrorMessage("An error has occurred: " + e + "\n" + "Location: \n" + stackTraceStr,"CMME internal error");
				System.err.println("Exception: " + e);
				e.printStackTrace();
			}

	}

	public displayErrorMessage(msg:string,winTitle:string):void
	{
		JOptionPane.showMessageDialog(this,msg,winTitle,JOptionPane.ERROR_MESSAGE);
	}
}

/* ----- chooser filter for CMME files ----- */
export class CMMEFileFilter extends FileFilter
{

	public accept(f:File):boolean
	{
		if( f.isDirectory())
			return true;

		let fn:string = f.getName();
		return fn.matches(MusicWin.FILENAME_PATTERN_CMME) ? true:false;
	}

	public getDescription():string
	{
		return "CMME scores (.cmme.xml)";
	}
}

/* ----- chooser filter for MIDI files ----- */
export class MIDIFileFilter extends FileFilter
{

	public accept(f:File):boolean
	{
		if( f.isDirectory())
			return true;

		let fn:string = f.getName();
		return fn.matches(MusicWin.FILENAME_PATTERN_MIDI) ? true:false;
	}

	public getDescription():string
	{
		return "MIDI files (.mid)";
	}
}

/* ----- chooser filter for XML files ----- */
export class XMLFileFilter extends FileFilter
{

	public accept(f:File):boolean
	{
		if( f.isDirectory())
			return true;

		let fn:string = f.getName();
		return MusicWin.isMusicXMLFilename(fn);
	}

	public getDescription():string
	{
		return "MusicXML scores (.xml)";
	}
}

/* ----- chooser filter for HTML files ----- */
export class HTMLFileFilter extends FileFilter
{

	public accept(f:File):boolean
	{
		if( f.isDirectory())
			return true;

		let fn:string = f.getName();
		return MusicWin.isHTMLFilename(fn);
	}

	public getDescription():string
	{
		return "HTML files (.html)";
	}
}

/* ----- chooser filter for PDF files ----- */
export class PDFFileFilter extends FileFilter
{

	public accept(f:File):boolean
	{
		if( f.isDirectory())
			return true;

		let fn:string = f.getName();
		return fn.matches(".*\\.[Pp][Dd][Ff]") ? true:false;
	}

	public getDescription():string
	{
		return "PDF files (.pdf)";
	}
}

/*------------------------------------------------------------------------
Inner Class: ViewSizeListener
Implements:  ActionListener
Purpose:     Handles events for View Scale menu
------------------------------------------------------------------------*/
export class ViewSizeListener implements ActionListener
{
	mytype_ActionListener:boolean = true;
	private inner:MusicWin;public constructor(inner:MusicWin)
	{
		this.inner = inner;
	}

	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Method:  void actionPerformed(ActionEvent event)
Purpose: Check for action types in menu and take appropriate action
Parameters:
Input:  ActionEvent event - event to handle
Output: -
Return: -
------------------------------------------------------------------------*/
	public actionPerformed(event:ActionEvent):void
	{
		this.inner.curVMVSnum = Integer.parseInt(event.getActionCommand());
		this.inner.setViewSize_2(this.inner.VMVSnums[this.inner.curVMVSnum]);
	}
}

/*------------------------------------------------------------------------
End Inner Class ViewSizeListener
------------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Inner Class: BarlineStyleListener
Implements:  ActionListener
Purpose:     Handles events for Barline Style menu
------------------------------------------------------------------------*/
export class BarlineStyleListener implements ActionListener
{
	mytype_ActionListener:boolean = true;
	private inner:MusicWin;public constructor(inner:MusicWin)
	{
		this.inner = inner;
	}

	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Method:  void actionPerformed(ActionEvent event)
Purpose: Check for action types in menu and take appropriate action
Parameters:
Input:  ActionEvent event - event to handle
Output: -
Return: -
------------------------------------------------------------------------*/
	public actionPerformed(event:ActionEvent):void
	{
		this.inner.optSet.set_barline_type(Integer.parseInt(event.getActionCommand()));
		this.inner.rerendermusic = true;
		this.inner.repaint();
	}
}

/*------------------------------------------------------------------------
End Inner Class BarlineStyleListener
------------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Inner Class: NoteShapeStyleListener
Implements:  ActionListener
Purpose:     Handles events for Note Shape / Reduction menu
------------------------------------------------------------------------*/
export class NoteShapeStyleListener implements ActionListener
{
	mytype_ActionListener:boolean = true;
	private inner:MusicWin;public constructor(inner:MusicWin)
	{
		this.inner = inner;
	}

	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Method:  void actionPerformed(ActionEvent event)
Purpose: Check for action types in menu and take appropriate action
Parameters:
Input:  ActionEvent event - event to handle
Output: -
Return: -
------------------------------------------------------------------------*/
	public actionPerformed(event:ActionEvent):void
	{
		this.inner.optSet.set_noteShapeType(Integer.parseInt(event.getActionCommand()));
		this.inner.updateTBNSButtons();
		this.inner.rerendermusic = true;
		this.inner.repaint();
	}
}
