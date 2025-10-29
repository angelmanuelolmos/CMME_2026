
import { Exception } from '../java/lang/Exception';
import { System } from '../java/lang/System';
import { Runnable } from '../java/lang/Runnable';
import { Timer } from '../javax/swing/Timer';
import { JPanel } from '../javax/swing/JPanel';
import { Box } from '../javax/swing/Box';
import { BorderFactory } from '../javax/swing/BorderFactory';
import { JList } from '../javax/swing/JList';
import { JApplet } from '../javax/swing/JApplet';
import { JFrame } from '../javax/swing/JFrame';
import { JButton } from '../javax/swing/JButton';
import { SwingUtilities } from '../javax/swing/SwingUtilities';
import { JScrollPane } from '../javax/swing/JScrollPane';
import { DefaultListModel } from '../javax/swing/DefaultListModel';
import { SwingConstants } from '../javax/swing/SwingConstants';
import { JLabel } from '../javax/swing/JLabel';
import { ParserDelegator } from '../javax/swing/text/html/parser/ParserDelegator';
import { Container } from '../java/awt/Container';
import { BorderLayout } from '../java/awt/BorderLayout';
import { WindowAdapter } from '../java/awt/event/WindowAdapter';
import { ComponentAdapter } from '../java/awt/event/ComponentAdapter';
import { ComponentEvent } from '../java/awt/event/ComponentEvent';
import { WindowEvent } from '../java/awt/event/WindowEvent';
import { ActionEvent } from '../java/awt/event/ActionEvent';
import { ComponentListener } from '../java/awt/event/ComponentListener';
import { ActionListener } from '../java/awt/event/ActionListener';
import { URL } from '../java/net/URL';
import { ArrayList } from '../java/util/ArrayList';
import { File } from '../java/io/File';
import { CMMEParser } from '../DataStruct/CMMEParser';
import { MetaData } from '../DataStruct/MetaData';
//import DataStruct.XMLReader;
import { PieceData } from '../DataStruct/PieceData';
import { MessageWin } from '../Gfx/MessageWin';
import { MusicFont } from '../Gfx/MusicFont';
import { MusicWin } from '../Gfx/MusicWin';
import { AppContext } from '../Util/AppContext';
/*------------------------------------------------------------------------
Class:   Main
Extends: JApplet
Purpose: Contains main routines
------------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Inner Class: ButtonListener
Implements:  ActionListener
Purpose:     Handles button events
------------------------------------------------------------------------*/
import { Resources } from '../Util/Resources';

class ButtonListener implements ActionListener
{
	mytype_ActionListener:boolean = true;public constructor(inner:Main)
	{
		this.inner = inner;
	}
	private inner:Main;

	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Method:  void actionPerformed(ActionEvent event)
Purpose: Check for action types on buttons and take appropriate action
Parameters:
Input:  ActionEvent event - event to handle
Output: -
Return: -
------------------------------------------------------------------------*/
	public actionPerformed(event:ActionEvent):void
	{
		let item:any = event.getSource();
		if( Main.local && item == this.inner.BrowseButton)
			{
				let fn:string = Main.musicWinFuncs.fileChooseAndOpen();
				if( fn != null)
					{
						fn =( new File(fn)).getName();
						this.inner.insertIntoWindowList(fn);
					}

			}

	}
}

export class Main extends JApplet
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	static TitleText1:string = AppContext.CMME_OPT_TESTING ? "CMME Score Viewer (DEBUGGING VERSION " + MetaData.CMME_VERSION + ")":"CMME Score Viewer (beta " + MetaData.CMME_VERSION + ")";
	static TitleText2:string = "Currently viewing:";
	public static StatusStr:string = "CMME System loaded";
	public static inApplet:boolean = true;
	public static local:boolean = false;
	public static appletInited:boolean = false;
	static parentWin:Main;
	static musicWinFuncs:MusicWin;
	//=new MusicWin();
	static startingFilenames:ArrayList<string> = null;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	/* GUI */
	TitlePanel:JPanel;
	TitleLab1:JLabel;
	TitleLab2:JLabel;
	WindowListDisplay:JList<string>;
	WindowListData:DefaultListModel<string>;
	FileInfoScroller:JScrollPane;
	BrowseButton:JButton = null;
	// ArrayList musicfiles=null;
	curselection:number = - 1;

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  void main(String args[])
Purpose: Perform initializations as an application
Parameters:
  Input:  String args[] - program arguments
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public static main(args:string[]):void
	{
		Main.inApplet = false;
		Main.local = true;
		Main.startingFilenames = new ArrayList<string>();
		Main.parsecmdline(args);
		SwingUtilities.invokeLater(
		{

			/* set up GUI to run on swing's event-dispatching thread */
			run:():void =>
			{
				Main.createAppletFrame();
			}
		}
		);
	}
	/*------------------------------------------------------------------------
Method:  void createAppletFrame()
Purpose: Create frame to simulate applet
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static theFrame:ApplicationFrame;

	static createAppletFrame():void
	{
		let appletwin:ApplicationFrame = new ApplicationFrame("CMME Applet");
		appletwin.setSize(500,300);
		appletwin.setVisible(true);
		Main.theFrame = appletwin;
	}

	/*------------------------------------------------------------------------
Method:  void parsecmdline(String args[])
Purpose: Parse command line
Parameters:
  Input:  String args[] - program arguments
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static parsecmdline(args:string[]):void
	{
		for(
		let i:number = 0;i < args.length;i ++)
		if(( args[i]== "-local"))
			Main.local = true;
		else
			if( args[i].charAt(0) != "-")
				Main.startingFilenames.add(args[i]);
			else
				Main.usageexit();

	}

	/*------------------------------------------------------------------------
Method:  void usagexit()
Purpose: Print program usage and exit
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static usageexit():void
	{
		System.out.println("Usage: java Viewer.Main [-local]");
	}
	/* exit(); */
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Method:  void realinit()
Purpose: Perform initialization for both environments (applet & application)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	bListener:ButtonListener;

	/* May 2011: JRE is currently weird about running applets a second time. It calls
     init() a second time, but retains objects and variables from the previous
     run. reinit() tries to deal. */
	reinit():void
	{
		DTDSetter.resetDefaultDTD();
		this.layoutAppletFrame();
		Main.startingFilenames = new ArrayList<string>();
		if( Main.inApplet && this.getParameter("file") != null)
			Main.startingFilenames.add(this.getParameter("file"));

		for(let fn of Main.startingFilenames)
		this.openScore(fn);
	}

	/* hack: JRE 1.6.0_22 does not re-init ParserDelegator when applet is
       brought up a second time */
	realinit():void
	{
		Main.appletInited = true;
		Main.parentWin = this;
		MetaData.CMME_OPT_TESTING = AppContext.CMME_OPT_TESTING;
		MetaData.CMME_OPT_VALIDATEXML = AppContext.CMME_OPT_VALIDATEXML;
		try
		{
			MusicWin.setViewerWin(this);
			AppContext.setBaseDataLocations(this,Main.local,Main.inApplet);
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					this.showError("Error loading local file locations: " + e);
				}

			else
				throw e;

		}
		MusicWin.initScoreWindowing_1(AppContext.BaseDataURL,AppContext.BaseDataDir + "music/",Main.inApplet);
		try
		{
			MusicFont.loadmusicface(AppContext.BaseDataURL);
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					this.showError("Error loading font: " + e);
					e.printStackTrace();
				}

			else
				throw e;

		}
		this.layoutAppletFrame();
		if( Main.startingFilenames == null)
			Main.startingFilenames = new ArrayList<string>();

		if( Main.inApplet && this.getParameter("file") != null)
			Main.startingFilenames.add(this.getParameter("file"));

		for(let fn of Main.startingFilenames)
		if( Main.local)
			this.openLocalScore(fn);
		else
			this.openScore(fn);

	}

	/* initialize data locations */
	/* load XML parser */
	// XMLReader.initparser(AppContext.BaseDataURL,AppContext.CMME_OPT_VALIDATEXML);
	/* initialize graphics/score windowing system */
	/* open initial score file specified in applet parameter */
	layoutAppletFrame():void
	{
		this.TitlePanel = new JPanel();
		this.TitlePanel.setLayout(new BorderLayout());
		this.TitleLab1 = new JLabel(Main.TitleText1);
		this.TitleLab1.setHorizontalAlignment(SwingConstants.CENTER);
		this.TitleLab2 = new JLabel(Main.TitleText2);
		this.TitleLab2.setHorizontalAlignment(SwingConstants.CENTER);
		this.TitlePanel.add(this.TitleLab1,"North");
		this.TitlePanel.add(this.TitleLab2,"South");
		this.createWindowListDisplay();
		this.FileInfoScroller = new JScrollPane(this.WindowListDisplay);
		let ButtonPane:Box = Box.createHorizontalBox();
		ButtonPane.add(Box.createHorizontalGlue());
		if( Main.local)
			{
				this.BrowseButton = new JButton("Browse...");
				ButtonPane.add(this.BrowseButton);
				ButtonPane.add(Box.createHorizontalStrut(10));
			}

		ButtonPane.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
		if( Main.local)
			{
				this.bListener = new ButtonListener(this);
				this.BrowseButton.addActionListener(this.bListener);
			}

		let cp:Container = this.getContentPane();
		cp.add(this.TitlePanel,"North");
		cp.add(this.FileInfoScroller,"Center");
		cp.add(ButtonPane,"South");
		this.addComponentListener(
		{

			/* lay out applet frame */
			componentShown:(event:ComponentEvent):void =>
			{
				if( Main.inApplet)
					this.showStatus(Main.StatusStr);

			}
		}
		);
	}

	/*------------------------------------------------------------------------
Method:  void openScore(String filename)
Purpose: Open new music window for one file - APPLET VERSION
Parameters:
  Input:  String filename - name of file (local or remote)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public openLocalScore(filename:string):void
	{
	}
	//    if (musicWinFuncs.openFile(filename))
	//      insertIntoWindowList(filename);
	static jscriptOpenFilename:string;
	static jscriptOpenLauncher:ActionListener =
	{

		actionPerformed:(evt:ActionEvent):void =>
		{
			Main.realOpenScore(Main.jscriptOpenFilename);
		}
	}
	;

	public openScore(filename:string):void
	{
		Main.jscriptOpenFilename = filename;
		let launcher:Timer = new Timer(50,Main.jscriptOpenLauncher);
		launcher.setRepeats(false);
		launcher.start();
	}
	/* trick the security policy when this method is called from Javascript,
       otherwise the applet is not allowed to open a network connection even
       back to its originating host!!!
       the workaround: execute the score-opening code on a different thread by
       using a Timer to launch it */
	static tmpmusicdat:PieceData;

	static realOpenScore(filename:string):void
	{
		Main.tmpmusicdat = null;
		let lw:MessageWin = MessageWin.new0_7("Loading, please wait...",Main.parentWin,true);
		let fURL:URL = Resources.getResource("Missa-Mort-et-Merci_01kyrie.cmme.xml");
		Main.tmpmusicdat = CMMEParser.new3(fURL).piece;
		try
		{
			let newWin:MusicWin = MusicWin.new1_6(filename,Main.tmpmusicdat);
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					Main.parentWin.showError("Error creating music window: " + e);
					e.printStackTrace();
				}

			else
				throw e;

		}
		lw.dispose();
		Main.parentWin.insertIntoWindowList(filename);
	}

	/* load file and create window in separate thread */
	// final Gfx.SwingWorker ofthread=new Gfx.SwingWorker()
	// {
	// public Object construct()
	// {
	/* real code */
	/* use doPrivileged() to allow Javascript-invoked calls to open network connection 
       back to the originating host */
	//  new Util.ProgressInputStream(fURL.openStream(),
	//                             lw.getProgressBar(),flen,0,75));
	// tmpmusicdat=new CMMEParser(zipIn,lw.getProgressBar()).piece;
	/*java.security.AccessController.doPrivileged(new java.security.PrivilegedAction() //CHANGE
    {
    public Object run() {
    // privileged code goes here:

    // load music data 
    try
      {
            URL fURL=new URL(AppContext.BaseDataURL+"music/"+filename+".gz");
            int flen=fURL.openConnection().getContentLength();
            GZIPInputStream zipIn=new GZIPInputStream(
              new Util.ProgressInputStream(fURL.openStream(),
                                           lw.getProgressBar(),flen,0,75));
            tmpmusicdat=new CMMEParser(zipIn,lw.getProgressBar()).piece;

      }
    catch (Exception e)
      {
        JOptionPane.showMessageDialog(parentWin,
          "Error loading "+filename+"\n\n"+e+"\n\nURL: "+AppContext.BaseDataURL+"music/"+filename+".gz",
          "Error",JOptionPane.ERROR_MESSAGE);
        lw.dispose();
        if (AppContext.CMME_OPT_TESTING)
          e.printStackTrace();
        return null;
      }

    return null;
    }
    });*/
	/* open music window */
	//  return null; /* not used */
	//  }
	//  }; /* end SwingWorker */
	//  ofthread.start();
	/*------------------------------------------------------------------------
Method:  void createWindowListDisplay()
Purpose: Create list for display of currently open score windows
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	createWindowListDisplay():void
	{
		this.WindowListData = new DefaultListModel<string>();
		this.WindowListDisplay = new JList<string>(this.WindowListData);
		this.WindowListDisplay.setSelectionMode(0);
		this.WindowListDisplay.setLayoutOrientation(JList.VERTICAL);
		this.WindowListDisplay.setVisibleRowCount(- 1);
	}

	/*ListSelectionModel.SINGLE_SELECTION*/
	//CHANGE
	/*------------------------------------------------------------------------
Method:  void insertIntoWindowList(String fn)
Purpose: Add new title to list of open windows
Parameters:
  Input:  String fn - filename to add
  Output: -
  Return: -
------------------------------------------------------------------------*/
	insertIntoWindowList(fn:string):void
	{
		let insertPos:number = 0;
		for(
		let i:number = 0;i < this.WindowListData.getSize();i ++)
		{
			let curfn:string =<string> this.WindowListData.getElementAt(i);
			insertPos =(( i + 1) | 0);
		}
		this.WindowListData.insertElementAt(fn,insertPos);
	}

	//  if (curfn.compareTo(fn)>0) /* order alphabetically/lexically */
	//   break;
	//  else //CHANGE
	/*------------------------------------------------------------------------
Method:  void removeFromWindowList(String fn)
Purpose: Remove title from list of open windows
Parameters:
  Input:  String fn - filename to remove
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public removeFromWindowList(fn:string):void
	{
		let i:number = 0;
		let done:boolean = false;
		while( ! done)
		{
			let curfn:string =<string> this.WindowListData.getElementAt(i);
			if(( curfn == fn))
				{
					this.WindowListData.removeElementAt(i);
					done = true;
				}

			else
				{
					i ++;
					done = i >= this.WindowListData.getSize();
				}

		}
	}

	/*------------------------------------------------------------------------
Method:  void init/start()
Purpose: Perform applet initializations
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public init():void
	{
		if( ! Main.appletInited)
			this.realinit();
		else
			this.reinit();

	}

	public start():void
	{
		if( ! Main.appletInited)
			this.realinit();

	}

	/*------------------------------------------------------------------------
Method:  void exitprog()
Purpose: Clean up and get out
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public exitprog():void
	{
		this.destroy();
	}

	/*      mw.dispose();*/
	public destroy():void
	{
		MusicWin.closeAllWindows();
		if( Main.local)
			this.BrowseButton.removeActionListener(this.bListener);

		let cl:ComponentListener[]= this.getListeners("ComponentListener");
		for(
		let i:number = 0;i < cl.length;i ++)
		this.removeComponentListener(cl[i]);
	}

	//    Gfx.MusicFont.destroyMusicFace();
	/*------------------------------------------------------------------------
Method:  void showError(String e)
Purpose: Show error information
Parameters:
  Input:  String e - error info
  Output: -
  Return: -
------------------------------------------------------------------------*/
	showError(e:string):void
	{
		System.err.println(e);
		if( Main.inApplet)
			this.showStatus(e);

		Main.StatusStr = e;
	}
}

/*------------------------------------------------------------------------
Class:   ApplicationFrame
Extends: JFrame
Purpose: Window for application to simulate applet frame
------------------------------------------------------------------------*/
class ApplicationFrame extends JFrame
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	mainapplet:Main;
	/*------------------------------------------------------------------------
Constructor: ApplicationFrame(String title)
Purpose:     Initialize window
Parameters:
  Input:  String title - window title
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(title:string)
	{
		super(title);
		this.mainapplet = new Main();
		this.mainapplet.start();
		this.getContentPane().add(this.mainapplet,"Center");
		this.addWindowListener(
		{

			windowClosing:(event:WindowEvent):void =>
			{
				this.dispose();
				this.mainapplet.exitprog();
				System.exit(0);
			}
		}
		);
	}
}

class DTDSetter extends ParserDelegator
{

	static resetDefaultDTD():void
	{
		ParserDelegator.setDefaultDTD();
	}
}
