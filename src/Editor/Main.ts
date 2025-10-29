
import { Exception } from '../java/lang/Exception';
import { System } from '../java/lang/System';
import { Runnable } from '../java/lang/Runnable';
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
import { SwingUtilities } from '../javax/swing/SwingUtilities';
import { MetaData } from '../DataStruct/MetaData';
import { MusicFont } from '../Gfx/MusicFont';
/*------------------------------------------------------------------------
Class:   Main
Extends: -
Purpose: Contains main routines
------------------------------------------------------------------------*/
import { AppContext } from '../Util/AppContext';

export class Main
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	static initfilename:string;
	static curdir:string = "";

	/*----------------------------------------------------------------------*/
	/* Instance variables */
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
		Main.parsecmdline(args);
		Main.init();
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
		if( args.length > 1)
			Main.usageexit();

		Main.initfilename = args.length > 0 ? args[0]:null;
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
		System.out.println("Usage: java Editor.Main [filename]");
		System.exit(0);
	}

	/*------------------------------------------------------------------------
Method:  void init()
Purpose: Perform initializations
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static init():void
	{
		MetaData.CMME_OPT_TESTING = AppContext.CMME_OPT_TESTING;
		MetaData.CMME_OPT_VALIDATEXML = AppContext.CMME_OPT_VALIDATEXML;
		try
		{
			AppContext.setBaseDataLocations(null,true,false);
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					Main.showError("Error loading local file locations: " + e);
				}

			else
				throw e;

		}
		EditorWin.initScoreWindowing_1(AppContext.BaseDataURL,AppContext.BaseDataDir + "music/",false);
		try
		{
			MusicFont.loadmusicface(AppContext.BaseDataURL);
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					Main.showError("Error loading font: " + e);
				}

			else
				throw e;

		}
		SwingUtilities.invokeLater(
		{

			/* initialize data locations */
			/* initialize edit window objects */
			/* load XML parser */
			//TODO: make a command line option to specify schema location.
			// DataStruct.XMLReader.initparser(null,true); //CHANGE
			/* load base music font */
			/* start GUI on event dispatching thread */
			run:():void =>
			{
				if( Main.initfilename != null)
					EditorWin.new5().openFile(Main.initfilename);
				else
					EditorWin.newfile();

			}
		}
		);
	}

	/*curdir+"\\"+*/
	//CHANGE
	/*------------------------------------------------------------------------
Method:  void showError(String e)
Purpose: Show error information
Parameters:
  Input:  String e - error info
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static showError(e:string):void
	{
		System.err.println(e);
	}
}
