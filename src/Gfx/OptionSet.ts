
import { BarlineStyleListener } from './MusicWin';
import { ViewSizeListener } from './MusicWin';
import { PDFFileFilter } from './MusicWin';
import { HTMLFileFilter } from './MusicWin';
import { XMLFileFilter } from './MusicWin';
import { MIDIFileFilter } from './MusicWin';
import { CMMEFileFilter } from './MusicWin';
import { MusicWin } from './MusicWin';
import { Event } from '../DataStruct/Event';
//import DataStruct.XMLReader;
import { VariantReading } from '../DataStruct/VariantReading';
/*------------------------------------------------------------------------
Class:   OptionSet
Extends: -
Purpose: Information about music display options
------------------------------------------------------------------------*/
import { GlobalConfig } from '../Util/GlobalConfig';

export class OptionSet
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static OPT_BARLINE_NONE:number = 0;
	public static OPT_BARLINE_MENSS:number = 1;
	public static OPT_BARLINE_TICK:number = 2;
	public static OPT_BARLINE_MODERN:number = 3;
	public static OPT_NOTESHAPE_ORIG:number = 0;
	public static OPT_NOTESHAPE_MOD_1_1:number = 1;
	public static OPT_NOTESHAPE_MOD_2_1:number = 2;
	public static OPT_NOTESHAPE_MOD_4_1:number = 3;
	public static OPT_NOTESHAPE_MOD_8_1:number = 4;
	public static OPT_MODACC_NONE:number = 0;
	public static OPT_MODACC_ABOVESTAFF:number = 1;
	public static OPT_COLORATION_NONE:number = 0;
	public static OPT_COLORATION_MINOR_COLOR:number = 1 << 0;
	public static OPT_COLORATION_OTHER:number = 1 << 1;
	public static OPT_VAR_ALL:number = 0;
	public static OPT_VAR_SUBSTANTIVE:number = 1;
	public static OPT_VAR_NONE:number = 2;
	public static OPT_VAR_CUSTOM:number = 3;
	static BarlineStrings:string[]=["None","Mensurstrich","Tick","Modern"];
	static NoteShapeStrings:string[]=["Original","Modern 1:1"];
	/*,
                                           "Modern 2:1",
                                           "Modern 4:1",
                                           "Modern 8:1" };*/
	public static DEFAULT_STAFFSPACING:number = 12;
	public static SPACES_PER_TEXTLINE:number = 2;
	public static TEXTVERSION_COLORS:number = 3;
	public static MIN_TEXTS_FOR_RESPACING:number = 4;
	/*----------------------------------------------------------------------*/
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	/* option variables */
	barline_type:number;
	noteShapeType:number;
	modacc_type:number;
	colorationDisplayFlags:number;
	displayOrigText:boolean;
	displayModText:boolean;
	usemodernclefs:boolean;
	useModernAccidentalSystem:boolean;
	displayallnewlineclefs:boolean;
	displayorigligatures:boolean;
	displayligbrackets:boolean;
	viewEdCommentary:boolean;
	markdissonances:boolean;
	markdirectedprogressions:boolean;
	displayedittags:boolean;
	unscoredDisplay:boolean;
	ligatureList:boolean;
	markVariants:number;
	customVariantFlags:number;
	musicWin:any;
	/* music display parameters */
	STAFFSCALE:number = 10;
	/* # of pixels per staff line+space */
	STAFFSPACING:number = OptionSet.DEFAULT_STAFFSPACING;
	/* number of staff spaces for each
                                               voice's vertical space */
	BREVESCALE:number = 100;
	/* default # of horizontal pixels for
                                               one breve of time */
	VIEWSCALE:number = 1;

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/* create OptionSet for fully modern notation */
	public static makeDEFAULT_FULL_MODERN(mwin:any):OptionSet
	{
		let o:OptionSet = new OptionSet(mwin);
		o.set_barline_type(OptionSet.OPT_BARLINE_MODERN);
		o.set_modacc_type(OptionSet.OPT_MODACC_ABOVESTAFF);
		o.set_noteShapeType(OptionSet.OPT_NOTESHAPE_MOD_1_1);
		o.set_displayOrigText(false);
		o.set_displayModText(true);
		o.set_usemodernclefs(true);
		o.setUseModernAccidentalSystem(true);
		o.setColorationDisplayFlags(OptionSet.OPT_COLORATION_MINOR_COLOR & OptionSet.OPT_COLORATION_OTHER);
		return o;
	}

	/* create OptionSet for original notation */
	public static makeDEFAULT_ORIGINAL(mwin:any):OptionSet
	{
		let o:OptionSet = new OptionSet(mwin);
		o.set_barline_type(OptionSet.OPT_BARLINE_TICK);
		o.set_modacc_type(OptionSet.OPT_MODACC_ABOVESTAFF);
		o.set_noteShapeType(OptionSet.OPT_NOTESHAPE_ORIG);
		o.set_displayOrigText(true);
		o.set_displayModText(false);
		o.set_usemodernclefs(false);
		o.setUseModernAccidentalSystem(false);
		o.setColorationDisplayFlags(OptionSet.OPT_COLORATION_NONE);
		return o;
	}
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: OptionSet(MusicWin mwin)
Purpose:     Initialize options
Parameters:
  Input:  MusicWin mwin - music window for these options
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(mwin:any)
	{
		this.musicWin = mwin;
		this.barline_type = OptionSet.OPT_BARLINE_MENSS;
		this.modacc_type = OptionSet.OPT_MODACC_ABOVESTAFF;
		this.noteShapeType = OptionSet.OPT_NOTESHAPE_MOD_1_1;
		this.displayOrigText = false;
		this.displayModText = true;
		this.usemodernclefs = true;
		this.useModernAccidentalSystem = true;
		this.colorationDisplayFlags = OptionSet.OPT_COLORATION_NONE;
		this.displayallnewlineclefs = false;
		this.displayorigligatures = false;
		this.displayligbrackets = true;
		this.viewEdCommentary = true;
		this.markdissonances = false;
		this.markdirectedprogressions = false;
		this.displayedittags = false;
		this.unscoredDisplay = false;
		this.ligatureList = false;
		this.markVariants = OptionSet.OPT_VAR_NONE;
		this.customVariantFlags = VariantReading.VAR_NONE;
	}

	/* initialize options for Viewer */
	public initFromGlobalConfig():void
	{
		let ns:string =( true) + "/Defaults/";
		let optStr:string;
		if(( optStr = GlobalConfig.get(ns + "NoteShapes")) != null)
			if(( optStr == "original"))
				this.noteShapeType = OptionSet.OPT_NOTESHAPE_ORIG;
			else
				this.noteShapeType = OptionSet.OPT_NOTESHAPE_MOD_1_1;

		if(( optStr = GlobalConfig.get(ns + "Barlines")) != null)
			if(( optStr == "tick"))
				this.barline_type = OptionSet.OPT_BARLINE_TICK;
			else
				if(( optStr == "mensurstrich"))
					this.barline_type = OptionSet.OPT_BARLINE_MENSS;
				else
					if(( optStr == "modern"))
						this.barline_type = OptionSet.OPT_BARLINE_MODERN;
					else
						this.barline_type = OptionSet.OPT_BARLINE_NONE;

		if(( optStr = GlobalConfig.get(ns + "Clefs")) != null)
			if(( optStr == "original"))
				this.usemodernclefs = false;
			else
				this.usemodernclefs = true;

		if(( optStr = GlobalConfig.get(ns + "AccidentalSystem")) != null)
			if(( optStr == "original"))
				this.useModernAccidentalSystem = false;
			else
				this.useModernAccidentalSystem = true;

		if(( optStr = GlobalConfig.get(ns + "ColorationBrackets")) != null)
			{
				if(( optStr == "minor") ||( optStr == "all"))
					this.addColorationDisplayFlags(OptionSet.OPT_COLORATION_MINOR_COLOR);

				if(( optStr == "other") ||( optStr == "all"))
					this.addColorationDisplayFlags(OptionSet.OPT_COLORATION_OTHER);

			}

		this.displayOrigText = false;
		this.displayModText = false;
		if(( optStr = GlobalConfig.get(ns + "Text")) != null)
			{
				if(( optStr == "original") ||( optStr == "all"))
					this.displayOrigText = true;

				if(( optStr == "modern") ||( optStr == "all"))
					this.displayModText = true;

			}

	}

	/*(musicWin instanceof MusicWin) ? "Viewer" : "Editor"*/
	//CHANGE
	/*------------------------------------------------------------------------
Methods: boolean markVariant(long varFlags)
Purpose: Check whether a variant of a certain type should be marked with
         the current option settings
Parameters:
  Input:  long varFlags - flags marking which types of variant are present
  Output: -
  Return: true if variant should be marked
------------------------------------------------------------------------*/
	public markVariant(varFlags:number):boolean
	{
		switch( this.markVariants)
		{
			case OptionSet.OPT_VAR_NONE:
			{
				return false;
			}
			case OptionSet.OPT_VAR_ALL:
			{
				return true;
			}
			case OptionSet.OPT_VAR_SUBSTANTIVE:
			{
				return varFlags != VariantReading.VAR_NONE;
			}
			case OptionSet.OPT_VAR_CUSTOM:
			{
				return( this.customVariantFlags & varFlags) > 0;
			}
		}
		return false;
	}

	/*------------------------------------------------------------------------
Methods: get*()
Purpose: Routines to return parameters and options
Parameters:
  Input:  -
  Output: -
  Return: parameter/option variables
------------------------------------------------------------------------*/
	public getSTAFFSCALE():number
	{
		return this.STAFFSCALE;
	}

	public getSTAFFSPACING():number
	{
		if( this.musicWin != null)
			{
				this.STAFFSPACING = OptionSet.DEFAULT_STAFFSPACING;
				let numVersions:number = this.musicWin.musicData.getVariantVersions().size();
				if( this.markVariant(VariantReading.VAR_ORIGTEXT) && ! this.get_displayedittags() && numVersions >= OptionSet.MIN_TEXTS_FOR_RESPACING)
					this.STAFFSPACING +=((((( numVersions - OptionSet.MIN_TEXTS_FOR_RESPACING) | 0)) * OptionSet.SPACES_PER_TEXTLINE) | 0);

			}

		return this.STAFFSPACING;
	}

	/* calculate spacing based on text to display */
	public getBREVESCALE():number
	{
		return this.BREVESCALE;
	}

	public getVIEWSCALE():number
	{
		return this.VIEWSCALE;
	}

	public get_barline_type():number
	{
		return this.barline_type;
	}

	public get_noteShapeType():number
	{
		return this.noteShapeType;
	}

	public useModernNoteShapes():boolean
	{
		return this.noteShapeType != OptionSet.OPT_NOTESHAPE_ORIG;
	}

	public get_modacc_type():number
	{
		return this.modacc_type;
	}

	public get_displayOrigText():boolean
	{
		return this.displayOrigText;
	}

	public get_displayModText():boolean
	{
		return this.displayModText;
	}

	public get_usemodernclefs():boolean
	{
		return this.usemodernclefs;
	}

	public getUseModernAccidentalSystem():boolean
	{
		return this.useModernAccidentalSystem;
	}

	public getColorationDisplayFlags():number
	{
		return this.colorationDisplayFlags;
	}

	public get_displayorigligatures():boolean
	{
		return this.displayorigligatures;
	}

	public get_displayligbrackets():boolean
	{
		return this.displayligbrackets;
	}

	public getViewEdCommentary():boolean
	{
		return this.viewEdCommentary;
	}

	public get_displayallnewlineclefs():boolean
	{
		return this.displayallnewlineclefs;
	}

	public get_markdissonances():boolean
	{
		return this.markdissonances;
	}

	public get_markdirectedprogressions():boolean
	{
		return this.markdirectedprogressions;
	}

	public get_displayedittags():boolean
	{
		return this.displayedittags;
	}

	public get_unscoredDisplay():boolean
	{
		return this.unscoredDisplay;
	}

	public isLigatureList():boolean
	{
		return this.ligatureList;
	}

	public getMarkVariants():number
	{
		return this.markVariants;
	}

	public markCustomVariant(varFlags:number):boolean
	{
		return( this.customVariantFlags & varFlags) > 0;
	}

	public displayColorationType(ct:number):boolean
	{
		return( this.colorationDisplayFlags & ct) != 0;
	}

	public displayColorationBracket(e:Event):boolean
	{
		if( this.colorationDisplayFlags == OptionSet.OPT_COLORATION_NONE || e.geteventtype() != Event.EVENT_NOTE || ! e.isColored())
			return false;

		if( e.isMinorColor_1())
			return this.displayColorationType(OptionSet.OPT_COLORATION_MINOR_COLOR);

		return this.displayColorationType(OptionSet.OPT_COLORATION_OTHER);
	}

	/*------------------------------------------------------------------------
Methods: void set*
Purpose: Routines to set parameters and options
Parameters:
  Input:  new values for parameters and options
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setVIEWSCALE(newval:number):void
	{
		this.VIEWSCALE = newval;
	}

	public set_barline_type(newval:number):void
	{
		this.barline_type = newval;
	}

	public addCustomVariantFlags(newFlags:number):void
	{
		this.customVariantFlags |= newFlags;
	}

	public removeCustomVariantFlags(newFlags:number):void
	{
		this.customVariantFlags &= ~ newFlags;
	}

	public setCustomVariantFlags(newFlags:number):void
	{
		this.customVariantFlags = newFlags;
	}

	public setLigatureList(newval:boolean):void
	{
		this.ligatureList = newval;
	}

	public set_modacc_type(newval:number):void
	{
		this.modacc_type = newval;
	}

	public set_noteShapeType(newval:number):void
	{
		this.noteShapeType = newval;
	}

	public set_displayOrigText(newval:boolean):void
	{
		this.displayOrigText = newval;
	}

	public set_displayModText(newval:boolean):void
	{
		this.displayModText = newval;
	}

	public set_usemodernclefs(newval:boolean):void
	{
		this.usemodernclefs = newval;
	}

	public addColorationDisplayFlags(newFlags:number):void
	{
		this.colorationDisplayFlags |= newFlags;
	}

	public setColorationDisplayFlags(newval:number):void
	{
		this.colorationDisplayFlags = newval;
	}

	public setUseModernAccidentalSystem(newval:boolean):void
	{
		this.useModernAccidentalSystem = newval;
	}

	public set_displayorigligatures(newval:boolean):void
	{
		this.displayorigligatures = newval;
	}

	public set_displayligbrackets(newval:boolean):void
	{
		this.displayligbrackets = newval;
	}

	public setViewEdCommentary(newval:boolean):void
	{
		this.viewEdCommentary = newval;
	}

	public set_displayallnewlineclefs(newval:boolean):void
	{
		this.displayallnewlineclefs = newval;
	}

	public set_markdissonances(newval:boolean):void
	{
		this.markdissonances = newval;
	}

	public set_markdirectedprogressions(newval:boolean):void
	{
		this.markdirectedprogressions = newval;
	}

	public set_displayedittags(newval:boolean):void
	{
		this.displayedittags = newval;
	}

	public set_unscoredDisplay(newval:boolean):void
	{
		this.unscoredDisplay = newval;
	}

	public setMarkVariants(newval:number):void
	{
		this.markVariants = newval;
	}
}
