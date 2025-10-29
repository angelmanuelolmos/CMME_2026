
import { Runnable } from '../java/lang/Runnable';
import { Math } from '../java/lang/Math';
import { VariantDisplayFrame } from './VariantDisplayFrame';
import { ScoreRenderer } from './ScoreRenderer';
import { VoiceGfxInfo } from './ScoreRenderer';
import { RenderList } from './RenderList';
import { RenderedSectionParams } from './RenderedSectionParams';
import { RenderedLigature } from './RenderedLigature';
import { RenderedEventGroup } from './RenderedEventGroup';
import { RenderedEvent } from './RenderedEvent';
import { RenderedClefSet } from './RenderedClefSet';
import { PDFCreator } from './PDFCreator';
import { OptionSet } from './OptionSet';
import { NoteShapeStyleListener } from './MusicWin';
import { BarlineStyleListener } from './MusicWin';
import { ViewSizeListener } from './MusicWin';
import { PDFFileFilter } from './MusicWin';
import { HTMLFileFilter } from './MusicWin';
import { XMLFileFilter } from './MusicWin';
import { MIDIFileFilter } from './MusicWin';
import { CMMEFileFilter } from './MusicWin';
import { MusicWin } from './MusicWin';
import { MusicFont } from './MusicFont';
import { MeasureInfo } from './MeasureInfo';
/*----------------------------------------------------------------------*/
/*

        Module          : ViewCanvas.java

        Package         : Gfx

        Classes Included: ViewCanvas

        Purpose         : Handles music-displaying area

        Programmer      : Ted Dumitrescu

        Date Started    : 99 (moved to separate file 5/2/05)

Updates:
5/23/05:  removed custom double-buffering code (Swing double-buffers
          automatically)
3/20/06:  added ellipsis-drawing support (for incipit-scores)
11/3/06:  removed Swing/AWT-based canvas scaling (too slow); to be replaced
          by custom code altering drawing sizes/scale based on user selection
11/8/06:  converted integer coordinate calculations to float (for accuracy in
          scaling)
12/5/06:  added mouse-listening functions (for selecting events to display
          editorial commentary)
2/20/09:  added line to show audio playback location
12/30/09: display code for text sections

                                                                        */
/*----------------------------------------------------------------------*/
/*----------------------------------------------------------------------*/
/* Imported packages */
import { Graphics } from '../java/awt/Graphics';
import { Graphics2D } from '../java/awt/Graphics2D';
import { Color } from '../java/awt/Color';
import { Dimension } from '../java/awt/Dimension';
import { Font } from '../java/awt/Font';
import { FontMetrics } from '../java/awt/FontMetrics';
import { MouseListener } from '../java/awt/event/MouseListener';
import { MouseEvent } from '../java/awt/event/MouseEvent';
import { BufferedImage } from '../java/awt/image/BufferedImage';
import { Toolkit } from '../java/awt/Toolkit';
import { JComponent } from '../javax/swing/JComponent';
import { JScrollBar } from '../javax/swing/JScrollBar';
import { SwingUtilities } from '../javax/swing/SwingUtilities';
import { Iterator } from '../java/util/Iterator';
import { List } from '../java/util/List';
import { PdfContentByte } from '../com/lowagie/text/pdf/PdfContentByte';
import { Clef } from '../DataStruct/Clef';
import { Coloration } from '../DataStruct/Coloration';
import { Event } from '../DataStruct/Event';
import { ModernKeySignature } from '../DataStruct/ModernKeySignature';
import { ModernKeySignatureElement } from '../DataStruct/ModernKeySignatureElement';
import { MusicSection } from '../DataStruct/MusicSection';
import { MusicTextSection } from '../DataStruct/MusicTextSection';
import { NoteEvent } from '../DataStruct/NoteEvent';
import { PieceData } from '../DataStruct/PieceData';
import { VariantMarkerEvent } from '../DataStruct/VariantMarkerEvent';
import { VariantReading } from '../DataStruct/VariantReading';
import { VariantVersionData } from '../DataStruct/VariantVersionData';

export class ViewCanvas extends JComponent implements MouseListener
{
	mytype_MouseListener:boolean = true;
	/*----------------------------------------------------------------------*/
	/* Class variables */
	static DEFAULT_TEXTFONTSMALL_SIZE:number = 12;
	static DEFAULT_TEXTFONTLARGE_SIZE:number = 18;
	static LEFTBREAK_XSIZE:number = 10;
	static LEFTINFO_XPADDING:number = 5;
	static LEFT_BLANK_BORDER:number = 10;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public parentwin:MusicWin;
	protected musicData:PieceData;
	protected MusicGfx:MusicFont;
	protected options:OptionSet;
	public numSections:number;
	public leftRendererNum:number;
	public renderedSections:ScoreRenderer[];
	protected curVariantVersion:VariantVersionData;
	protected curVersionMusicData:PieceData;
	/* music data for
                                                       currently active
                                                       variant version */
	public nummeasures:number;
	public viewsize:Dimension;
	/* size of view area, before scaling */
	public screensize:Dimension;
	/* screen dimensions of view area (after scaling) */
	public SCREEN_MINHEIGHT:number;
	/* minimum height of view area */
	/* offscreen buffers */
	curbuffer:BufferedImage;
	curbufferg2d:Graphics2D;
	/* music display parameters */
	public STAFFSCALE:number;
	/* # of pixels per staff line+space */
	public STAFFPOSSCALE:number;
	/* # of pixels per staff position (line or space) */
	public STAFFSPACING:number;
	/* number of staff spaces for each voice's vertical space */
	public BREVESCALE:number;
	/* default # of horizontal pixels for one breve of time */
	public VIEWSCALE:number;
	/* scaling factor (for zooming in/out) */
	public XLEFT:number;
	public YTOP:number;
	public ORIGXLEFT:number;
	public VIEWYSTART:number;
	public TEXT_NAMES_SIZE:number;
	public curmeasure:number;
	public selectedVoicenum:number;
	public selectedEventnum:number;
	public numvoices:number;
	voicelabels:string[];
	FontPLAIN12:Font;
	FontBOLD18:Font;
	defaultTextFontSMALL:Font;
	defaultTextFontLARGE:Font;
	/* options loaded at the beginning of a draw */
	barline_type:number;
	usemodernclefs:boolean;
	useModernAccSystem:boolean;
	displayligbrackets:boolean;
	displayEditTags:boolean;
	displayVarTexts:boolean;
	markdissonances:boolean;
	markdirectedprogressions:boolean;
	public redisplaying:number = 0;
	/* number of paintComponent calls currently running */
	public num_redisplays:number = 0;
	nummeasuresdisplayed:number = 0;
	MIDIMeasurePlaying:number = - 1;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: ViewCanvas(PieceData p,MusicFont mf,MusicWin mw,OptionSet os)
Purpose:     Initialize canvas
Parameters:
  Input:  PieceData p  - music data to display
          MusicFont mf - music symbols for drawing
          MusicWin mw  - parent window
          OptionSet os - display options
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(p:PieceData,mf:MusicFont,mw:MusicWin,os:OptionSet)
	{
		super();
		this.MusicGfx = mf;
		this.musicData = p;
		this.parentwin = mw;
		this.options = os;
		this.curVariantVersion = this.musicData.getDefaultVariantVersion();
		this.curVersionMusicData = this.musicData;
		this.addMouseListener(this);
		this.initdrawingparams();
	}

	/* real initialization */
	public initdrawingparams():void
	{
		this.numvoices = this.curVersionMusicData.getVoiceData().length;
		this.curmeasure = 0;
		this.selectedVoicenum =( this.selectedEventnum = - 1);
		this.renderSections_1();
		this.loadoptions();
		this.viewsize = new Dimension(0,0);
		this.screensize = new Dimension(Math.round(1200 * this.VIEWSCALE),Math.round(this.SCREEN_MINHEIGHT * this.VIEWSCALE));
		let actualDisplaySize:Dimension = Toolkit.getDefaultToolkit().getScreenSize();
		if( this.screensize.width ><number> actualDisplaySize.width * 0.9)
			this.screensize.width =<number>(<number> actualDisplaySize.width * 0.9);

		if( this.screensize.height ><number> actualDisplaySize.height * 0.9)
			this.screensize.height =<number>(<number> actualDisplaySize.height * 0.9);

		this.VIEWYSTART = 0;
		this.FontPLAIN12 = new Font(null,Font.PLAIN,12);
		this.FontBOLD18 = new Font(null,Font.BOLD,18);
		this.initVoiceLabels();
		this.initbuffers();
	}

	//System.out.println("SCREEN_MINHEIGHT="+SCREEN_MINHEIGHT);
	/*------------------------------------------------------------------------
Method:  void renderSections()
Purpose: Pre-render all sections for display
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public renderSections_1():void
	{
		this.numSections = this.curVersionMusicData.getNumSections();
		this.renderedSections = ScoreRenderer.renderSections(this.curVersionMusicData,this.options);
		this.leftRendererNum = 0;
		this.nummeasures = 0;
		for(
		let i:number = 0;i < this.numSections;i ++)
		this.nummeasures += this.renderedSections[i].getNumMeasures();
	}

	/*------------------------------------------------------------------------
Method:  void loadoptions()
Purpose: Get low-level drawing options from OptionSet (for quick access
         during drawing routines)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	loadoptions():void
	{
		this.STAFFSCALE = this.options.getSTAFFSCALE();
		this.STAFFPOSSCALE =(( this.STAFFSCALE / 2) | 0);
		this.STAFFSPACING = this.options.getSTAFFSPACING();
		this.BREVESCALE = this.options.getBREVESCALE();
		this.VIEWSCALE =<number> this.options.getVIEWSCALE();
		this.SCREEN_MINHEIGHT =(((((( this.curVersionMusicData.getVoiceData().length * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0) + 80) | 0);
	}

	/*------------------------------------------------------------------------
Method:  void initVoiceLabels()
Purpose: Initialize text labels for voice names
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	initVoiceLabels():void
	{
		let vn:string;
		let avn:string;
		this.voicelabels = Array(this.numvoices);
		for(
		let i:number = 0;i < this.numvoices;i ++)
		{
			vn = this.curVersionMusicData.getVoiceData()[i].getName();
			if( vn.length == 0)
				avn = "";
			else
				if( vn.length > 1 && vn.charAt(0) == "[")
					avn = "[" + vn.charAt(1) + "]";
				else
					avn = `${vn.charAt(0)}`;

			this.voicelabels[i]= avn;
		}
	}

	/* abbrev voice name */
	/*------------------------------------------------------------------------
Method:  void initbuffers()
Purpose: Initialize offscreen buffers and drawing parameters
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	initbuffers():void
	{
		this.loadoptions();
		let vssy:number = this.screensize.height > this.SCREEN_MINHEIGHT ? this.screensize.height:this.SCREEN_MINHEIGHT;
		let pbsx:number = this.screensize.width;
		let pbsy:number = vssy;
		if( this.VIEWSCALE > 1)
			pbsy *= this.VIEWSCALE;

		this.viewsize.setSize(pbsx,pbsy);
		this.curbuffer = new BufferedImage(pbsx,pbsy,BufferedImage.TYPE_INT_ARGB);
		this.curbufferg2d = this.curbuffer.createGraphics();
		this.defaultTextFontSMALL = this.FontPLAIN12.deriveFont(<number> ViewCanvas.DEFAULT_TEXTFONTSMALL_SIZE * this.VIEWSCALE);
		this.defaultTextFontLARGE = this.FontPLAIN12.deriveFont(<number> ViewCanvas.DEFAULT_TEXTFONTLARGE_SIZE * this.VIEWSCALE);
		this.curbufferg2d.setFont(this.defaultTextFontSMALL);
		this.ORIGXLEFT = this.calcstaffleft(this.curbufferg2d);
		this.TEXT_NAMES_SIZE = this.calcTextNamesSize(this.curbufferg2d);
		this.YTOP = 80 * this.VIEWSCALE;
	}

	/* calculate buffer sizes */
	/* buffer size */
	/* viewsize == size in virtual (scaled) coordinates */
	/* create buffer */
	/*    curbufferg2d.scale(VIEWSCALE,VIEWSCALE);
    if (VIEWSCALE<1)
      curbufferg2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION,RenderingHints.VALUE_INTERPOLATION_BICUBIC);*/
	/* make text fonts */
	/*------------------------------------------------------------------------
Method:  float calcstaffleft(Graphics2D g)
Purpose: Calculate left x location for staves
Parameters:
  Input:  -
  Output: -
  Return: left x location for staves
------------------------------------------------------------------------*/
	calcstaffleft(g:Graphics2D):number
	{
		let longestnamelen:number = 0;
		let metrics:FontMetrics = g.getFontMetrics();
		for(
		let i:number = 0;i < this.numvoices;i ++)
		{
			let vn:string = this.voicelabels[i];
			if( metrics.stringWidth(vn) > longestnamelen)
				longestnamelen = metrics.stringWidth(vn);

		}
		return longestnamelen + ViewCanvas.LEFT_BLANK_BORDER * 2 * this.VIEWSCALE;
	}

	calcTextNamesSize(g:Graphics2D):number
	{
		let longestNameWidth:number = 0;
		let metrics:FontMetrics = g.getFontMetrics();
		for(let vvd of this.musicData.getVariantVersions())
		{
			let nameWidth:number = metrics.stringWidth(vvd.getID());
			if( nameWidth > longestNameWidth)
				longestNameWidth = nameWidth;

		}
		return<number> longestNameWidth;
	}

	/*------------------------------------------------------------------------
Method:  MeasureInfo getLeftMeasure()
Purpose: Return leftmost measure in score window
Parameters:
  Input:  -
  Output: -
  Return: measure info object
------------------------------------------------------------------------*/
	public getLeftMeasure():MeasureInfo
	{
		return this.renderedSections[this.leftRendererNum].getMeasure(this.curmeasure);
	}

	/*------------------------------------------------------------------------
Method:  MeasureInfo getMeasure(int m)
Purpose: Retrieve measure from correct section
Parameters:
  Input:  int m - measure number
  Output: -
  Return: measure info object
------------------------------------------------------------------------*/
	public getMeasure(m:number):MeasureInfo
	{
		return this.renderedSections[ScoreRenderer.calcRendererNum(this.renderedSections,m)].getMeasure(m);
	}

	/*------------------------------------------------------------------------
Method:  double getMeasureX(int m)
Purpose: Calculate global x-location of any measure
Parameters:
  Input:  int m - measure number
  Output: -
  Return: x-coordinate at left of measure
------------------------------------------------------------------------*/
	public getMeasureX(m:number):number
	{
		let snum:number = ScoreRenderer.calcRendererNum(this.renderedSections,m);
		return this.renderedSections[snum].getStartX() + this.renderedSections[snum].getMeasure(m).leftx;
	}

	/*------------------------------------------------------------------------
Method:  float calcXLEFT(int mnum)
Purpose: Calculate value for XLEFT at a given measure
Parameters:
  Input:  int mnum - measure number
  Output: -
  Return: XLEFT value (x position at beginning of first displayed measure)
------------------------------------------------------------------------*/
	public calcXLEFT(mnum:number):number
	{
		if( mnum == 0)
			return this.ORIGXLEFT;

		let snum:number = ScoreRenderer.calcRendererNum(this.renderedSections,mnum);
		let leftMeasure:MeasureInfo = this.renderedSections[snum].getMeasure(mnum);
		let me:RenderedEvent;
		let curXLEFT:number = this.ORIGXLEFT;
		let xloc:number = 0;
		let maxx:number = 0;
		if( this.leftRendererNum > 0 && this.curmeasure == this.renderedSections[this.leftRendererNum].getFirstMeasureNum())
			{
				let lastSectionParams:RenderedSectionParams[]= this.renderedSections[((( this.leftRendererNum - 1) | 0))].getEndingParams();
				for(
				let i:number = 0;i < this.numvoices;i ++)
				{
					xloc = this.XLEFT;
					let curCS:RenderedClefSet = lastSectionParams[i].getClefSet();
					if( curCS != null)
						{
							xloc += curCS.getXSize() * this.VIEWSCALE;
							let mk:ModernKeySignature = curCS.getLastClefEvent().getModernKeySig();
							if( mk.numEls() > 0 &&( this.displayEditTags || this.useModernAccSystem))
								xloc += this.getModKeySigSize(mk,curCS.getPrincipalClefEvent());

						}

					me = lastSectionParams[i].getMens();
					if( me != null)
						xloc += me.getimgxsize() * this.VIEWSCALE;

					if( xloc > maxx)
						maxx = xloc;

				}
			}

		else
			for(
			let i:number = 0;i < this.curVersionMusicData.getSection(snum).getNumVoices_1();i ++)
			if( this.curVersionMusicData.getSection(snum).getVoice_1(i) != null)
				{
					xloc = curXLEFT;
					let curCS:RenderedClefSet = this.renderedSections[snum].eventinfo[i].getClefEvents(leftMeasure.reventindex[i]);
					if( curCS != null)
						xloc += curCS.getXSize() * this.VIEWSCALE;

					let mk:ModernKeySignature = this.renderedSections[snum].eventinfo[i].getModernKeySig(leftMeasure.reventindex[i]);
					if( mk.numEls() > 0 && curCS != null &&( this.displayEditTags || this.useModernAccSystem))
						xloc += this.getModKeySigSize(mk,curCS.getPrincipalClefEvent());

					me = leftMeasure.startMensEvent[i];
					if( me != null)
						{
							me = leftMeasure.startMensEvent[i];
							xloc += me.getimgxsize() * this.VIEWSCALE;
						}

					if( xloc > maxx)
						maxx = xloc;

				}

		maxx += ViewCanvas.LEFTINFO_XPADDING * this.VIEWSCALE;
		return maxx + ViewCanvas.LEFTBREAK_XSIZE * this.VIEWSCALE;
	}

	/* clefs */
	/* modern key signature */
	/* mensuration */
	/* modern key signature */
	//renderedSections[snum].eventinfo[i].getMensEvent(leftMeasure.reventindex[i]);
	/*------------------------------------------------------------------------
Method:  void forcePaint()
Purpose: Repaint immediately
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public forcePaint():void
	{
		this.paintImmediately(0,0,this.screensize.width,this.screensize.height);
	}

	/*------------------------------------------------------------------------
Method:  void rerender()
Purpose: Force immediate music rerendering
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public rerender_1():void
	{
		let oldSCREEN_MINHEIGHT:number = this.SCREEN_MINHEIGHT;
		this.loadoptions();
		this.numvoices = this.curVersionMusicData.getVoiceData().length;
		this.initVoiceLabels();
		let oldnummeasures:number = this.nummeasures;
		this.renderSections_1();
		if( this.curmeasure >= this.nummeasures)
			this.curmeasure =(( this.nummeasures - 1) | 0);

		if( this.nummeasures > oldnummeasures)
			{
				this.parentwin.setScrollBarXmax_2();
				this.parentwin.setmeasurenum((( this.curmeasure + 1) | 0));
			}

		if( this.SCREEN_MINHEIGHT != oldSCREEN_MINHEIGHT)
			this.updateScrollBarY();

		this.parentwin.updatemusicgfx = true;
	}

	public rerender_2(snum:number):void
	{
		let oldSCREEN_MINHEIGHT:number = this.SCREEN_MINHEIGHT;
		this.loadoptions();
		this.numvoices = this.curVersionMusicData.getVoiceData().length;
		this.initVoiceLabels();
		let oldnummeasures:number = this.nummeasures;
		this.renderedSections[snum].render();
		if( this.curmeasure >= this.nummeasures)
			this.curmeasure =(( this.nummeasures - 1) | 0);

		if( this.nummeasures > oldnummeasures)
			{
				this.parentwin.setScrollBarXmax_2();
				this.parentwin.setmeasurenum((( this.curmeasure + 1) | 0));
			}

		if( this.SCREEN_MINHEIGHT != oldSCREEN_MINHEIGHT)
			this.updateScrollBarY();

		this.parentwin.updatemusicgfx = true;
	}

	/*------------------------------------------------------------------------
Method:  void update(Graphics g)
Purpose: Update graphics area
Parameters:
  Input:  Graphics g - graphical context
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public update(g:Graphics):void
	{
		this.paintComponent(g);
	}

	/*------------------------------------------------------------------------
Method:  void paintComponent(Graphics g)
Purpose: Repaint area
Parameters:
  Input:  Graphics g - graphical context
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public paintComponent(g:Graphics):void
	{
		this.redisplaying ++;
		super.paintComponent(g);
		if( this.parentwin.rerendermusic)
			{
				this.parentwin.rerendermusic = false;
				this.rerender_1();
			}

		if( this.parentwin.updatemusicgfx)
			{
				this.parentwin.updatemusicgfx = false;
				g.setClip(0,0,this.screensize.width,this.screensize.height);
				this.paintbuffer(this.curbufferg2d);
				this.parentwin.setScrollBarXmax_2();
				this.parentwin.setmeasurenum((( this.curmeasure + 1) | 0));
			}

		if( this.parentwin.redrawscr)
			{
				this.parentwin.redrawscr = false;
				g.setClip(0,0,this.screensize.width,this.screensize.height);
			}

		g.drawImage(this.curbuffer,0,Math.round(0 - this.VIEWYSTART),this);
		if( this.parentwin.updateMeasure != - 1)
			this.parentwin.gotomeasure(this.parentwin.updateMeasure);

		this.redisplaying --;
	}

	/* rerender music if necessary */
	/* redraw music if necessary */
	/* set parameters for redraw if necessary */
	/* copy current offscreen buffer to screen */
	/*------------------------------------------------------------------------
Method:  Dimension cursize()
Purpose: Return current canvas size
Parameters:
  Input:  -
  Output: -
  Return: current size
------------------------------------------------------------------------*/
	public cursize():Dimension
	{
		return this.getSize();
	}

	//    return screensize;
	/*------------------------------------------------------------------------
Method:  Graphics2D getbufferg2d()
Purpose: Return graphics for display buffer
Parameters:
  Input:  -
  Output: -
  Return: curbufferg2d
------------------------------------------------------------------------*/
	public getbufferg2d():Graphics2D
	{
		return this.curbufferg2d;
	}

	/*------------------------------------------------------------------------
Method:  void newsize(int newwidth,int newheight)
Purpose: Resize canvas
Parameters:
  Input:  int newwidth,newheight - new size
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public newsize(newwidth:number,newheight:number):void
	{
		this.screensize.setSize(newwidth,newheight);
		this.initbuffers();
		this.updateScrollBarY();
		this.parentwin.updatemusicgfx = true;
		this.repaint();
	}

	/*------------------------------------------------------------------------
Method:  void newViewScale()
Purpose: Update graphics when scale has changed
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public newViewScale_1():void
	{
		this.initbuffers();
		if( this.VIEWYSTART > this.SCREEN_MINHEIGHT - this.screensize.height / this.VIEWSCALE)
			this.VIEWYSTART = this.SCREEN_MINHEIGHT - this.screensize.height / this.VIEWSCALE;

		if( this.VIEWYSTART < 0)
			this.VIEWYSTART = 0;

		this.updateScrollBarY();
		this.MusicGfx.newScale(this.VIEWSCALE);
		this.parentwin.updatemusicgfx = true;
		this.repaint();
	}

	/*------------------------------------------------------------------------
Method:  void updateScrollBarY()
Purpose: Update vertical scroll bar to reflect buffer size
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public updateScrollBarY():void
	{
		this.parentwin.setScrollBarYparams(Math.round(this.SCREEN_MINHEIGHT * this.VIEWSCALE),this.screensize.height,Math.round(this.VIEWYSTART));
	}

	//System.out.println("SMH*VS="+(SCREEN_MINHEIGHT*VIEWSCALE)+" SSH="+screensize.height);
	/*------------------------------------------------------------------------
Method:  void newY(int newystart)
Purpose: Change y position of viewport
Parameters:
  Input:  int newystart - new value for VIEWYSTART
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public newY_1(newystart:number):void
	{
		this.redisplaying ++;
		this.VIEWYSTART = newystart;
		this.paintbuffer(this.curbufferg2d);
		this.parentwin.redrawscr = true;
		this.repaint();
		this.redisplaying --;
	}

	/*------------------------------------------------------------------------
Method:  Dimension getPreferredSize()
Purpose: Return canvas size preference
Parameters:
  Input:  -
  Output: -
  Return: size preference
------------------------------------------------------------------------*/
	public getPreferredSize():Dimension
	{
		return this.screensize;
	}

	/*------------------------------------------------------------------------
Method:  void movedisplay(int newmeasure)
Purpose: Move display to a new measure location
Parameters:
  Input:  int newmeasure - measure number
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public movedisplay_1(newmeasure:number):void
	{
		this.redisplaying ++;
		this.curmeasure = newmeasure < this.nummeasures ? newmeasure:(( this.nummeasures - 1) | 0);
		this.paintbuffer(this.curbufferg2d);
		this.parentwin.redrawscr = true;
		this.repaint();
		this.redisplaying --;
	}

	/*------------------------------------------------------------------------
Method:  void MIDIMeasureStarted(int mnum,JScrollBar musicScrollBarX)
Purpose: Show measure currently being played back
Parameters:
  Input:  int mnum                   - measure number
          JScrollBar musicScrollBarX - scroll bar controlling score position
  Output: -
  Return: -
------------------------------------------------------------------------*/
	measureDisplayed(mnum:number):boolean
	{
		if( this.nummeasures < 2)
			return true;

		if( mnum < this.curmeasure || mnum >=(((( this.curmeasure + this.nummeasuresdisplayed) | 0) - 1) | 0))
			return false;

		return true;
	}

	public MIDIMeasureStarted_1(mnum:number,musicScrollBarX:JScrollBar):void
	{
		this.MIDIMeasurePlaying = mnum;
		if( this.MIDIMeasurePlaying < 0)
			{
				this.movedisplay_1(this.curmeasure);
				return;
			}

		if( ! this.measureDisplayed(mnum))
			{
				musicScrollBarX.setValue((( mnum - 1) | 0));
				this.movedisplay_1((( mnum - 1) | 0));
			}

		else
			this.movedisplay_1(this.curmeasure);

	}

	/* stopped */
	/* redisplay to move playback line, scrolling if necessary */
	/*------------------------------------------------------------------------
Method:  void selectEvent(int vnum,int eventnum)
Purpose: Select or de-select music events in GUI
Parameters:
  Input:  int vnum,eventnum - voice number/event number to select (vnum==-1
                              for none)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	selectEvent(vnum:number,eventnum:number):void
	{
		this.selectedVoicenum = vnum;
		this.selectedEventnum = eventnum;
		let measureNum:number = - 1;
		let edCommentary:string = null;
		if( this.selectedVoicenum >= 0)
			{
				let re:RenderedEvent = this.renderedSections[this.leftRendererNum].eventinfo[vnum].getEvent(eventnum);
				measureNum = re.getmeasurenum();
				edCommentary = re.getEvent_1().getEdCommentary();
				if( edCommentary == null)
					this.selectedVoicenum = - 1;

			}

		this.parentwin.updatemusicgfx = true;
		this.repaint();
		this.parentwin.updateCommentaryArea(this.selectedVoicenum,measureNum,edCommentary);
	}

	/* for now, only select commentary */
	/*------------------------------------------------------------------------
Method:  void showVariants(int snum,int vnum,int eventNum,int fx,int fy)
Purpose: Show variant readings popup in GUI (if there are readings at this point)
Parameters:
  Input:  int snum,vnum,eventNum - section number/voice number/event number
                                   to show (vnum==-1 for none)
          int fx,fy -              screen location to pop up frame
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public showVariants_1(snum:number,vnum:number,eventNum:number,fx:number,fy:number):void
	{
		if( this.musicData.getVariantVersions().size() == 0)
			return;

		let re:RenderedEvent = this.renderedSections[snum].eventinfo[vnum].getEvent(eventNum);
		let renderedVar:RenderedEventGroup = re.getVarReadingInfo();
		if( renderedVar == null)
			return;

		let varFrame:VariantDisplayFrame = new VariantDisplayFrame(renderedVar,this.musicData.getSection(snum).getVoice_1(vnum),this.renderedSections[snum],vnum,fx,fy,this,this.MusicGfx,this.STAFFSCALE,this.VIEWSCALE);
		varFrame.setVisible(true);
	}
	/* no variants here */
	/*------------------------------------------------------------------------
Method:  void paintbuffer(Graphics2D g)
Purpose: Repaint area into offscreen buffer
Parameters:
  Input:  Graphics2D g - offscreen graphical context
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public repaintingbuffer:number = 0;

	paintbuffer(g:Graphics2D):void
	{
		
    if (  this . repaintingbuffer > 0  ) 
		{ 
			let repaintg : Graphics2D = g;

      requestAnimationFrame(() => { this . paintbuffer ( repaintg );  });
		} 
		
    else
    {
		  this . repaintingbuffer ++; 
		  this . realpaintbuffer_1 ( g ); 
		  this . repaintingbuffer --; 
    }
		 
	}

	/* real painting code, which can be overridden */
	public realpaintbuffer_1(g:Graphics2D):void
	{
		try
		{
			this.ORIGXLEFT = this.displayVarTexts ? this.TEXT_NAMES_SIZE + ViewCanvas.LEFT_BLANK_BORDER * 2 * this.VIEWSCALE:this.ORIGXLEFT;
			this.XLEFT = this.ORIGXLEFT;
			this.num_redisplays ++;
			this.barline_type = this.options.get_barline_type();
			this.usemodernclefs = this.options.get_usemodernclefs();
			this.useModernAccSystem = this.options.getUseModernAccidentalSystem();
			this.displayligbrackets = this.options.get_displayligbrackets();
			this.displayEditTags = this.options.get_displayedittags();
			this.markdissonances = this.options.get_markdissonances();
			this.markdirectedprogressions = this.options.get_markdirectedprogressions();
			this.displayVarTexts = this.options.markVariant(VariantReading.VAR_ORIGTEXT) && ! this.options.get_displayedittags();
			g.setColor(Color.white);
			g.fillRect(0,0,(( this.viewsize.width + 1) | 0),(( this.viewsize.height + 1) | 0));
			g.setFont(this.defaultTextFontSMALL);
			g.setColor(Color.red);
			g.drawString(this.musicData.getFullTitle(),this.XLEFT,15 * this.VIEWSCALE);
			g.drawString(this.musicData.getComposer(),this.XLEFT,25 * this.VIEWSCALE);
			this.leftRendererNum = ScoreRenderer.calcRendererNum(this.renderedSections,this.curmeasure);
			let leftMeasure:MeasureInfo = this.getLeftMeasure();
			let fm:FontMetrics = g.getFontMetrics();
			g.setColor(Color.black);
			let XLEFT_AFTER_BREAK:number = this.calcXLEFT(this.curmeasure);
			let topLeftStaff:number = - 1;
			let bottomLeftStaff:number = - 1;
			let topNewStaff:number = - 1;
			let bottomNewStaff:number = - 1;
			let lastSectionParams:RenderedSectionParams[]= null;
			if( this.leftRendererNum > 0 && this.curmeasure == this.renderedSections[this.leftRendererNum].getFirstMeasureNum())
				lastSectionParams = this.renderedSections[((( this.leftRendererNum - 1) | 0))].getEndingParams();

			for(
			let i:number = 0;i < this.numvoices;i ++)
			{
				if( this.curVersionMusicData.getVoiceData()[i].isEditorial())
					g.setColor(Color.red);

				g.drawString(this.voicelabels[i],this.XLEFT - 10 - fm.stringWidth(this.voicelabels[i]),this.YTOP +((((((((( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) +(( 2 * this.STAFFSCALE) | 0)) | 0) + this.STAFFPOSSCALE) | 0) - 1) | 0)) * this.VIEWSCALE);
				g.setColor(Color.black);
				let si:number = this.leftRendererNum;
				let sectionStartDisplayX:number = XLEFT_AFTER_BREAK - leftMeasure.leftx * this.VIEWSCALE;
				let sectionStaffStartX:number = Math.max(sectionStartDisplayX,this.XLEFT);
				if( lastSectionParams != null &&( lastSectionParams[i].getClefSet() != null || lastSectionParams[i].getMens() != null))
					{
						this.drawStaff_1(g,<number> this.XLEFT,<number> Math.min(<number> sectionStartDisplayX,(( this.viewsize.width - 1) | 0)),this.YTOP +(( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) * this.VIEWSCALE,5);
						if( topLeftStaff == - 1)
							topLeftStaff = i;

						if( i > bottomLeftStaff)
							bottomLeftStaff = i;

					}

				let doneStaves:boolean = false;
				while( ! doneStaves)
				{
					let sectionEndX:number = sectionStartDisplayX +( this.renderedSections[si].getXsize() + ScoreRenderer.SECTION_END_SPACING) * this.VIEWSCALE;
					if( this.curVersionMusicData.getSection(si).getVoice_1(i) != null)
						{
							this.drawStaff_1(g,<number> sectionStaffStartX,<number> Math.min(<number> sectionEndX,(( this.viewsize.width - 1) | 0)),this.YTOP +(( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) * this.VIEWSCALE,5);
							if( sectionStaffStartX <= this.XLEFT)
								{
									if( topLeftStaff == - 1)
										topLeftStaff = i;

									if( i > bottomLeftStaff)
										bottomLeftStaff = i;

								}

							if( si == this.leftRendererNum)
								{
									if( topNewStaff == - 1)
										topNewStaff = i;

									if( i > bottomNewStaff)
										bottomNewStaff = i;

								}

						}

					si ++;
					if( si >= this.curVersionMusicData.getNumSections() || sectionEndX >= this.viewsize.width)
						doneStaves = true;
					else
						sectionStartDisplayX =( sectionStaffStartX = sectionEndX);

				}
			}
			if( this.curmeasure > 0)
				{
					g.setColor(Color.white);
					for(
					let i:number = 0;i < this.numvoices;i ++)
					g.fillRect(<number> Math.round(XLEFT_AFTER_BREAK - ViewCanvas.LEFTBREAK_XSIZE * this.VIEWSCALE),Math.round(this.YTOP +((((( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) - 1) | 0)) * this.VIEWSCALE),Math.round(ViewCanvas.LEFTBREAK_XSIZE * this.VIEWSCALE),Math.round(((((( this.STAFFSCALE * this.STAFFSPACING) | 0) + 2) | 0)) * this.VIEWSCALE));
					g.setColor(Color.black);
				}

			if( lastSectionParams == null)
				g.drawLine(Math.round(this.XLEFT),Math.round(this.YTOP +((((( topLeftStaff * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0)) * this.VIEWSCALE),Math.round(this.XLEFT),Math.round(this.YTOP +((((((( bottomLeftStaff * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0) +(( this.STAFFSCALE * 4) | 0)) | 0)) * this.VIEWSCALE));
			else
				{
					g.drawLine(<number> Math.round(XLEFT_AFTER_BREAK - ViewCanvas.LEFTBREAK_XSIZE * this.VIEWSCALE),Math.round(this.YTOP +((((( topLeftStaff * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0)) * this.VIEWSCALE),<number> Math.round(XLEFT_AFTER_BREAK - ViewCanvas.LEFTBREAK_XSIZE * this.VIEWSCALE),Math.round(this.YTOP +((((((( bottomLeftStaff * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0) +(( this.STAFFSCALE * 4) | 0)) | 0)) * this.VIEWSCALE));
					g.drawLine(<number> Math.round(XLEFT_AFTER_BREAK),Math.round(this.YTOP +((((( topNewStaff * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0)) * this.VIEWSCALE),<number> Math.round(XLEFT_AFTER_BREAK),Math.round(this.YTOP +((((((( bottomNewStaff * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0) +(( this.STAFFSCALE * 4) | 0)) | 0)) * this.VIEWSCALE));
				}

			if( this.curmeasure != 0)
				this.drawleftinfo(g);

			if( this.numvoices > 0)
				this.drawEvents_1(g);

			if( this.displayVarTexts)
				this.writeTextVersionNames_1(g);

			g.setFont(this.defaultTextFontSMALL);
		}
		catch( methodGuard)
		{ }
	}

	/* get drawing options */
	/* clear area */
	//g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,RenderingHints.VALUE_ANTIALIAS_ON);CHANGE removed
	/* write piece information */
	/* calculate section position */
	/* prepare staves */
	/* voice information */
	/* draw staves */
	/*        else
          if (sectionStaffStartX>XLEFT)
            sectionStaffStartX=XLEFT;*/
	/* visibly break initial information from music */
	/* left barline */
	//    if (curVersionMusicData.getSection(leftRendererNum).getSectionType()==MusicSection.MENSURAL_MUSIC)
	/* don't draw left barline at section change */
	/* section change barlines */
	/* add clef/mensuration at left */
	/* now draw music */
	/* version names for variant text display */
	writeTextVersionNames_1(g:Graphics2D):void
	{
		let textx:number = ViewCanvas.LEFT_BLANK_BORDER * this.VIEWSCALE;
		for(
		let vi:number = 0;vi < this.numvoices;vi ++)
		this.writeTextVersionNames_2(g,textx,this.YTOP +((((( vi *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) +(( 7 * this.STAFFSCALE) | 0)) | 0)) * this.VIEWSCALE);
	}

	writeTextVersionNames_2(g:Graphics2D,curx:number,cury:number):void
	{
		g.setColor(Color.white);
		g.fillRect(Math.round(this.ORIGXLEFT - 1 * this.VIEWSCALE),<number>( cury -((( this.STAFFPOSSCALE *((( OptionSet.SPACES_PER_TEXTLINE + 1) | 0))) | 0)) * this.VIEWSCALE),Math.round(3 * this.VIEWSCALE),Math.round(((((((( this.musicData.getVariantVersions().size() * this.STAFFPOSSCALE) | 0) * OptionSet.SPACES_PER_TEXTLINE) | 0) +(( this.STAFFPOSSCALE * 2) | 0)) | 0)) * this.VIEWSCALE));
		g.setFont(this.defaultTextFontSMALL);
		let versionNum:number = 0;
		for(let vvd of this.musicData.getVariantVersions())
		{
			let txtColor:number =((( versionNum ++) % OptionSet.TEXTVERSION_COLORS + 1) | 0);
			g.setColor(Coloration.AWTColors[txtColor]);
			g.drawString(vvd.getID(),curx,cury);
			cury +=((( this.STAFFPOSSCALE * OptionSet.SPACES_PER_TEXTLINE) | 0)) * this.VIEWSCALE;
		}
		g.setColor(Color.black);
	}

	/* clear area for version names */
	//               Math.round(TEXT_NAMES_SIZE),
	/* write names */
	/*------------------------------------------------------------------------
Method:  void drawleftinfo(Graphics2D g)
Purpose: Draw clefs/mensuration at left side of viewscreen, and shift event
         drawing space over
Parameters:
  Input:  Graphics2D g - graphical context
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawleftinfo(g:Graphics2D):void
	{
		let leftMeasure:MeasureInfo;
		let clefi:number;
		let me:RenderedEvent;
		let xloc:number = 0;
		let yloc:number = 0;
		let maxx:number = 0;
		leftMeasure = this.getLeftMeasure();
		let numLeftSectionVoices:number = this.curVersionMusicData.getSection(this.leftRendererNum).getNumVoices_1();
		if( this.leftRendererNum > 0 && this.curmeasure == this.renderedSections[this.leftRendererNum].getFirstMeasureNum())
			{
				let lastSectionParams:RenderedSectionParams[]= this.renderedSections[((( this.leftRendererNum - 1) | 0))].getEndingParams();
				for(
				let i:number = 0;i < numLeftSectionVoices;i ++)
				{
					xloc = this.XLEFT;
					yloc = this.YTOP +(( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) * this.VIEWSCALE;
					let curCS:RenderedClefSet = lastSectionParams[i].getClefSet();
					if( curCS != null)
						{
							xloc += curCS.draw_1(this.useModernAccSystem,g,this.MusicGfx,xloc,yloc,this.VIEWSCALE);
							let mk:ModernKeySignature = curCS.getLastClefEvent().getModernKeySig();
							if( mk.numEls() > 0 &&( this.displayEditTags || this.useModernAccSystem))
								xloc += this.drawModKeySig_3(g,mk,curCS.getPrincipalClefEvent(),xloc,yloc);

						}

					me = lastSectionParams[i].getMens();
					if( me != null)
						{
							me.drawMens(g,this.MusicGfx,this,xloc,yloc,this.VIEWSCALE);
							xloc += me.getimgxsize() * this.VIEWSCALE;
						}

					if( xloc > maxx)
						maxx = xloc;

				}
			}

		else
			for(
			let i:number = 0;i < numLeftSectionVoices;i ++)
			if( this.curVersionMusicData.getSection(this.leftRendererNum).getVoice_1(i) != null)
				{
					xloc = this.XLEFT;
					yloc = this.YTOP +(( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) * this.VIEWSCALE;
					let curCS:RenderedClefSet = this.renderedSections[this.leftRendererNum].eventinfo[i].getClefEvents(leftMeasure.reventindex[i]);
					if( curCS != null)
						xloc += curCS.draw_1(this.useModernAccSystem,g,this.MusicGfx,xloc,yloc,this.VIEWSCALE);

					let mk:ModernKeySignature = this.renderedSections[this.leftRendererNum].eventinfo[i].getModernKeySig(leftMeasure.reventindex[i]);
					if( mk.numEls() > 0 && curCS != null &&( this.displayEditTags || this.useModernAccSystem))
						xloc += this.drawModKeySig_3(g,mk,curCS.getPrincipalClefEvent(),xloc,yloc);

					me = leftMeasure.startMensEvent[i];
					if( me != null)
						{
							me = leftMeasure.startMensEvent[i];
							me.drawMens(g,this.MusicGfx,this,xloc,yloc,this.VIEWSCALE);
							xloc += me.getimgxsize() * this.VIEWSCALE;
						}

					if( xloc > maxx)
						maxx = xloc;

				}

		maxx += ViewCanvas.LEFTINFO_XPADDING * this.VIEWSCALE;
		g.setFont(this.defaultTextFontSMALL);
		g.setColor(Color.black);
		this.XLEFT = maxx + ViewCanvas.LEFTBREAK_XSIZE * this.VIEWSCALE;
		g.drawString(`${this.curmeasure + 1}`,this.XLEFT,this.YTOP -((( this.STAFFSCALE * 2) | 0)) * this.VIEWSCALE);
	}

	/* draw clefs */
	/* modern key signature */
	/* draw mensuration */
	/* draw clefs */
	/* modern key signature */
	/* draw mensuration */
	//renderedSections[leftRendererNum].eventinfo[i].getMensEvent(leftMeasure.reventindex[i]);
	/* barline to show section beginning, if necessary 
    if (leftRendererNum!=0 && curmeasure==renderedSections[leftRendererNum].getFirstMeasureNum())
      {
        g.setColor(Color.black);
        g.drawLine(Math.round(maxx),Math.round(YTOP),
                   Math.round(maxx),Math.round(YTOP+((numvoices-1)*STAFFSCALE*STAFFSPACING+STAFFSCALE*4)*VIEWSCALE));
        g.drawLine(Math.round(maxx+LEFTBREAK_XSIZE*VIEWSCALE),Math.round(YTOP),
                   Math.round(maxx+LEFTBREAK_XSIZE*VIEWSCALE),Math.round(YTOP+((numLeftSectionVoices-1)*STAFFSCALE*STAFFSPACING+STAFFSCALE*4)*VIEWSCALE));
      }*/
	/* measure number */
	/*------------------------------------------------------------------------
Method:  void drawEvents(Graphics2D g)
Purpose: Draw music on staves
Parameters:
  Input:  Graphics2D g - graphical context
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public drawEvents_1(g:Graphics2D):void
	{
		let evloc:number;
		let displayX:number;
		let sectionStartDisplayX:number;
		let e:RenderedEvent;
		let ligInfo:RenderedLigature = null;
		let tieInfo:RenderedLigature = null;
		let doneSections:boolean;
		let doneVoice:boolean;
		let curRenderer:ScoreRenderer;
		let leftMeasure:MeasureInfo;
		let curRendererNum:number;
		this.leftRendererNum = ScoreRenderer.calcRendererNum(this.renderedSections,this.curmeasure);
		leftMeasure = this.renderedSections[this.leftRendererNum].getMeasure(this.curmeasure);
		this.drawAllBarlines(g);
		curRendererNum = this.leftRendererNum;
		curRenderer = this.renderedSections[this.leftRendererNum];
		displayX =( sectionStartDisplayX = this.XLEFT - leftMeasure.leftx * this.VIEWSCALE);
		doneSections = false;
		let startv:number = - 1;
		let endv:number = - 1;
		while( ! doneSections)
		{
			if( this.musicData.isIncipitScore() && this.curmeasure == curRenderer.getFirstMeasureNum())
				{
					g.setColor(Color.blue);
					g.setFont(this.defaultTextFontSMALL);
					g.drawString("INCIPIT",Math.round(<number> sectionStartDisplayX),Math.round(this.YTOP -(( this.STAFFSCALE * 3) | 0) * this.VIEWSCALE));
				}

			let numv:number = curRenderer.getNumVoices();
			startv = numv;
			endv = - 1;
			let curSection:MusicSection = curRenderer.getSectionData();
			if( curSection instanceof MusicTextSection)
				this.drawSectionText(curRenderer,g,sectionStartDisplayX,this.YTOP);
			else
				for(
				let i:number = 0;i < numv;i ++)
				if( curSection.getVoice_1(i) != null)
					{
						if( i < startv)
							startv = i;

						if( i > endv)
							endv = i;

						evloc = curRendererNum == this.leftRendererNum ? leftMeasure.reventindex[i]:0;
						doneVoice =( evloc >= curRenderer.eventinfo[i].size());
						while( ! doneVoice)
						{
							e = curRenderer.eventinfo[i].getEvent(evloc);
							displayX = sectionStartDisplayX + e.getxloc() * this.VIEWSCALE;
							if( displayX < this.viewsize.width)
								{
									if( e.isdisplayed())
										if( e.getEvent_1().geteventtype() == Event.EVENT_ELLIPSIS)
											this.drawEllipsisBreak(g,i,displayX,e,curRenderer.eventinfo[i].getEvent((( evloc + 1) | 0)));
										else
											if( i == this.selectedVoicenum && evloc == this.selectedEventnum)
												e.drawHighlighted(g,this.MusicGfx,this,displayX,this.YTOP +(( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) * this.VIEWSCALE,this.VIEWSCALE);
											else
												e.draw_2(g,this.MusicGfx,this,displayX,this.YTOP +(( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) * this.VIEWSCALE,this.VIEWSCALE);

									ligInfo = e.getLigInfo();
									if( ligInfo.firstEventNum != - 1)
										{
											this.drawLigType(g,e,displayX + 3 * this.VIEWSCALE,this.calcligy(i,e));
											if( e.isligend())
												this.drawLigature_1(g,sectionStartDisplayX +( curRenderer.eventinfo[i].getEvent(ligInfo.firstEventNum).getxloc() + 4) * this.VIEWSCALE,displayX,this.calcligy(i,e),this.XLEFT,this.viewsize.width);

										}

									tieInfo = e.getTieInfo();
									if( tieInfo.firstEventNum != - 1 && tieInfo.lastEventNum == evloc)
										{
											let tre1:RenderedEvent = curRenderer.eventinfo[i].getEvent(tieInfo.firstEventNum);
											this.drawTies(g,tre1,e,i,sectionStartDisplayX + tre1.getxloc() * this.VIEWSCALE,displayX,this.XLEFT,this.viewsize.width);
										}

									let varReadingInfo:RenderedEventGroup = e.getVarReadingInfo();
									if( varReadingInfo != null && evloc >= varReadingInfo.lastEventNum)
										this.markVariantReading_1(g,sectionStartDisplayX +( curRenderer.eventinfo[i].getEvent(varReadingInfo.firstEventNum).getxloc() + 4) * this.VIEWSCALE,displayX,this.calcVarMarkY(curRenderer.eventinfo[i],i,e),this.XLEFT,this.viewsize.width,e.getEvent_1().getVariantReading_1(this.curVariantVersion),varReadingInfo.varMarker);

									this.draw_analysis(g,curRenderer,evloc,i,<number> displayX,this.YTOP +(( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0));
								}

							else
								{
									doneSections = true;
									doneVoice = true;
									break;
								}

							evloc ++;
							if( evloc >= curRenderer.eventinfo[i].size())
								doneVoice = true;

						}
						e = curRenderer.eventinfo[i].getEvent(evloc);
						ligInfo = e == null ? null:e.getLigInfo();
						if( ligInfo != null && ligInfo.firstEventNum != - 1 && evloc <(( curRenderer.eventinfo[i].size() - 1) | 0))
							this.drawLigature_1(g,sectionStartDisplayX +<number>( curRenderer.eventinfo[i].getEvent(ligInfo.firstEventNum).getxloc() + 4) * this.VIEWSCALE,this.viewsize.width,this.calcligy(i,e),this.XLEFT,this.viewsize.width);

						tieInfo = e == null ? null:e.getTieInfo();
						if( tieInfo != null && tieInfo.firstEventNum != - 1)
							{
								let tre1:RenderedEvent = curRenderer.eventinfo[i].getEvent(tieInfo.firstEventNum);
								if( displayX < this.viewsize.width && e.doubleTied())
									tre1 = e;

								let firstEventNum:number = e.doubleTied() ? evloc:tieInfo.firstEventNum;
								this.drawTies(g,tre1,curRenderer.eventinfo[i].getEvent(tieInfo.lastEventNum),i,sectionStartDisplayX + tre1.getxloc() * this.VIEWSCALE,displayX,this.XLEFT,this.viewsize.width);
							}

						let varReadingInfo:RenderedEventGroup = e == null ? null:e.getVarReadingInfo();
						if( varReadingInfo != null && evloc <(( curRenderer.eventinfo[i].size() - 1) | 0))
							if((( varReadingInfo.lastEventNum - varReadingInfo.firstEventNum) | 0) > 1)
								this.markVariantReading_1(g,sectionStartDisplayX +( curRenderer.eventinfo[i].getEvent(varReadingInfo.firstEventNum).getxloc() + 4) * this.VIEWSCALE,this.viewsize.width,this.calcVarMarkY(curRenderer.eventinfo[i],i,e),this.XLEFT,this.viewsize.width,e.getEvent_1().getVariantReading_1(this.curVariantVersion),varReadingInfo.varMarker);

					}

				else
					if( curRendererNum > this.leftRendererNum || this.curmeasure == curRenderer.getFirstMeasureNum())
						{
							let tacetText:string = this.curVersionMusicData.getSection(curRendererNum).getTacetText(i);
							if( tacetText != null)
								{
									g.setFont(this.MusicGfx.displayTextFont);
									g.setColor(Color.black);
									g.drawString(tacetText,<number> sectionStartDisplayX + ViewCanvas.LEFTBREAK_XSIZE * this.VIEWSCALE,this.YTOP +((((( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) +(( 5 * this.STAFFPOSSCALE) | 0)) | 0)) * this.VIEWSCALE);
								}

						}

			curRendererNum ++;
			if( curRendererNum < this.numSections)
				{
					if( sectionStartDisplayX >= this.ORIGXLEFT)
						this.drawSectionBarline(g,<number> Math.round(sectionStartDisplayX),startv,endv,false);

					sectionStartDisplayX +=( curRenderer.getXsize() + ScoreRenderer.SECTION_END_SPACING) * this.VIEWSCALE;
					this.drawSectionBarline(g,<number> Math.round(sectionStartDisplayX),startv,endv,this.musicData.isIncipitScore() && this.numSections > 1 && curRendererNum ==(( this.numSections - 1) | 0));
					curRenderer = this.renderedSections[curRendererNum];
				}

			else
				doneSections = true;

		}
		if( !( curRenderer.getSectionData() instanceof MusicTextSection))
			this.drawSectionBarline(g,<number> Math.round(sectionStartDisplayX),startv,endv,this.musicData.isIncipitScore() && this.numSections > 1 && curRendererNum ==(( this.numSections - 1) | 0));

		sectionStartDisplayX +=( curRenderer.getXsize() + ScoreRenderer.SECTION_END_SPACING) * this.VIEWSCALE;
		if( !( curRenderer.getSectionData() instanceof MusicTextSection))
			this.drawSectionBarline(g,<number> Math.round(sectionStartDisplayX),startv,endv,this.musicData.isIncipitScore() && this.numSections > 1 && curRendererNum ==(( this.numSections - 1) | 0));

	}

	/* draw barlines */
	/* draw each section in turn */
	/*        if (displayEditTags &&
            (curRendererNum>leftRendererNum || curmeasure==curRenderer.getFirstMeasureNum()))
          addSectionTag(g,curRenderer,(int)Math.round(sectionStartDisplayX),
                                      Math.round(YTOP-STAFFSCALE*2*VIEWSCALE));*/
	/* draw each voice in turn */
	/* draw event */
	//if (displayX>=XLEFT)
	/* draw ligatures */
	/* tie notes */
	/* mark variant readings */
	//                      if (varReadingInfo.lastEventNum-varReadingInfo.firstEventNum>1)
	//                      else
	//                        markVariantReading(g,displayX,calcVarMarkY(curRenderer.eventinfo[i],i,e));
	/* analysis functions */
	/* past right edge of view area = last section */
	//System.out.println("evloc="+evloc+" e="+e.getEvent()+" tieinfo="+e.getTieInfo());
	/* finish any remaining ligature */
	/* finish any unclosed tie */
	// &&
	//                (tieInfo.lastEventNum!=evloc || e.doubleTied()))
	//System.out.println("ttt v="+i+" double? "+e.doubleTied()+
	//                   " evloc="+evloc+" tie1="+tieInfo.firstEventNum+" tie2="+tieInfo.lastEventNum);
	/* finish any remaining variant reading */
	/* tacet text */
	//musicData.isIncipitScore() && numSections>1 && curRendererNum==numSections-1);
	//        if (curRendererNum>=numSections)
	/* barlines of last rendered section */
	//    g.setFont(defaultTextFontSMALL);
	/*------------------------------------------------------------------------
Method:  float calcligy(int vnum,RenderedEvent e)
Purpose: Calculate y position of a ligature at a given event
Parameters:
  Input:  int vnum        - voice number
          RenderedEvent e - event
  Output: -
  Return: y position of ligature
------------------------------------------------------------------------*/
	calcligy(vnum:number,e:RenderedEvent):number
	{
		let ligInfo:RenderedLigature = e.getLigInfo();
		let lige:RenderedEvent = ligInfo.reventList.getEvent(ligInfo.yMaxEventNum);
		let ligevclef:Clef = lige.getClef();
		let lignoteev:Event = ligInfo.yMaxEvent;
		let ligyval:number =(((((( this.STAFFSCALE * 4) | 0) - 12) | 0) -(( this.STAFFPOSSCALE * lignoteev.getPitch_1().calcypos(ligevclef)) | 0)) | 0);
		if( ligyval > - 7)
			ligyval = - 7;

		ligyval = this.YTOP +( ligyval +(((( vnum * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0)) * this.VIEWSCALE;
		return ligyval;
	}

	public static calcTieY_1(tieRE:RenderedEvent,yTop:number,STAFFSCALE:number,STAFFPOSSCALE:number,VIEWSCALE:number):number
	{
		return yTop + VIEWSCALE *((((((( STAFFSCALE * 4) | 0) - 12) | 0) -(( STAFFPOSSCALE * tieRE.getEvent_1().getPitch_1().calcypos(tieRE.getClef())) | 0)) | 0));
	}

	calcTieY_2(vnum:number,e:RenderedEvent):number
	{
		return ViewCanvas.calcTieY_1(e,this.YTOP +(((( vnum * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0) * this.VIEWSCALE,this.STAFFSCALE,this.STAFFPOSSCALE,this.VIEWSCALE);
	}

	//e.getTieInfo().reventList.getEvent(e.getTieInfo().yMaxEventNum),
	/*------------------------------------------------------------------------
Method:  float calcVarMarkY(RenderList rl,int vnum,RenderedEvent e)
Purpose: Calculate y position for marking variant readings at a given event
Parameters:
  Input:  RenderList rl   - rendered event list
          int vnum        - voice number
          RenderedEvent e - event
  Output: -
  Return: y position of variant marker
------------------------------------------------------------------------*/
	calcVarMarkY(rl:RenderList,vnum:number,e:RenderedEvent):number
	{
		return this.YTOP +((( - 8 +(((( vnum * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0)) | 0)) * this.VIEWSCALE;
	}

	/*------------------------------------------------------------------------
Method:  void drawStaff(Graphics2D g,float x1,float x2,float yloc,int numlines)
Purpose: Draw staff at specified location
Parameters:
  Input:  Graphics2D g - graphical context
          float x1,x2  - x location for left and right ends of staff
          float yloc   - y location for top of staff
          int numlines - number of lines for staff
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawStaff_1(g:Graphics2D,x1:number,x2:number,yloc:number,numlines:number):void
	{
		for(
		let i:number = 0;i < numlines;i ++)
		g.drawLine(Math.round(x1),Math.round(yloc +(( i * this.STAFFSCALE) | 0) * this.VIEWSCALE),Math.round(x2),Math.round(yloc +(( i * this.STAFFSCALE) | 0) * this.VIEWSCALE));
	}

	public static drawStaff_2(g:Graphics2D,x1:number,x2:number,yloc:number,numlines:number,STAFFSCALE:number,VIEWSCALE:number):void
	{
		for(
		let i:number = 0;i < numlines;i ++)
		g.drawLine(Math.round(x1),Math.round(yloc + i * STAFFSCALE * VIEWSCALE),Math.round(x2),Math.round(yloc + i * STAFFSCALE * VIEWSCALE));
	}

	/*------------------------------------------------------------------------
Method:  void drawLigType(Graphics2D g,RenderedEvent re,double x,double y)
Purpose: Indicate ligature connection type (recta/obliqua) at specified
         location
Parameters:
  Input:  Graphics2D g     - graphical context
          RenderedEvent re - first ligated note
          double x,y       - location in context for drawing
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawLigType(g:Graphics2D,re:RenderedEvent,x:number,y:number):void
	{
		if( ! this.displayligbrackets)
			return;

		let e:Event = re.getEvent_1();
		if( e.geteventtype() == Event.EVENT_NOTE)
			{
				let ne:NoteEvent =<NoteEvent> e;
				g.setFont(this.defaultTextFontSMALL);
				g.setColor(Color.gray);
				switch( ne.getligtype())
				{
					case NoteEvent.LIG_RECTA:
					{
						g.drawString("R",<number> x,<number> y);
						break;
					}
					case NoteEvent.LIG_OBLIQUA:
					{
						g.drawString("O",<number> x,<number> y);
						break;
					}
				}
				g.setColor(Color.black);
			}

	}

	/*------------------------------------------------------------------------
Method:  void drawLigature(Graphics2D g,double x1,double x2,double y,double leftx,double rightx)
Purpose: Draw ligature bracket for one voice
Parameters:
  Input:  Graphics2D g        - graphical context
          double x1,x2        - left and right coordinates of bracket
          double y            - y level of bracket
          double leftx,rightx - horizontal bounds of drawing space
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawLigature_1(g:Graphics2D,x1:number,x2:number,y:number,leftx:number,rightx:number):void
	{
		if( this.displayligbrackets)
			ViewCanvas.drawLigOnCanvas_1(g,x1,x2,y,leftx,rightx,this.VIEWSCALE);

	}

	public static drawLigOnCanvas_1(g:Graphics2D,x1:number,x2:number,y:number,leftx:number,rightx:number,VS:number):void
	{
		x1 += VS;
		if( x1 >= leftx)
			g.drawLine(<number> Math.round(x1),<number> Math.round(y),<number> Math.round(x1),<number> Math.round(y + 3 * VS));
		else
			x1 = leftx;

		x2 += VS *((( 4 + MusicFont.getDefaultGlyphWidth((( MusicFont.PIC_NOTESTART + NoteEvent.NOTEHEADSTYLE_SEMIBREVE) | 0))) | 0));
		if( x2 < rightx)
			g.drawLine(<number> Math.round(x2),<number> Math.round(y),<number> Math.round(x2),<number> Math.round(y + 3 * VS));
		else
			x2 = rightx - 1;

		g.drawLine(<number> Math.round(x1),<number> Math.round(y),<number> Math.round(x2),<number> Math.round(y));
	}

	public static drawLigOnCanvas_2(g:Graphics2D,x1:number,x2:number,y:number,leftx:number,rightx:number):void
	{
		ViewCanvas.drawLigOnCanvas_1(g,x1,x2,y,leftx,rightx,1);
	}

	drawTies(g:Graphics2D,tre1:RenderedEvent,tre2:RenderedEvent,vi:number,x1:number,x2:number,leftx:number,rightx:number):void
	{
		try
		{
			let multiEventList:List<RenderedEvent> = tre1.getEventList();
			if( multiEventList == null)
				this.drawTie_1(g,tre1.getTieType(),x1,x2,this.calcTieY_2(vi,tre2),leftx,rightx);
			else
				for(let re of multiEventList)
				{
					let tieType:number = re.getTieType();
					if( tieType != NoteEvent.TIE_NONE)
						this.drawTie_1(g,tieType,x1,x2,this.calcTieY_2(vi,re),leftx,rightx);

				}

		}
		catch( methodGuard)
		{ }
	}

	drawTie_1(g:Graphics2D,tieType:number,x1:number,x2:number,y:number,leftx:number,rightx:number):void
	{
		ViewCanvas.drawTieOnCanvas_1(g,tieType,x1,x2,y,leftx,rightx,this.VIEWSCALE);
	}

	public static drawTieOnCanvas_1(g:Graphics2D,tieType:number,x1:number,x2:number,y:number,leftx:number,rightx:number,VS:number):void
	{
		let xAdjust:number = VS *((( 4 + MusicFont.getDefaultGlyphWidth((( MusicFont.PIC_NOTESTART + NoteEvent.NOTEHEADSTYLE_SEMIBREVE) | 0))) | 0));
		x1 = Math.max(x1 + xAdjust,leftx - xAdjust / 2);
		x2 += VS * 4;
		let arc1:number = 0;
		let arc2:number = 180;
		if( tieType == NoteEvent.TIE_UNDER)
			{
				arc1 = 180;
				y += MusicFont.CONNECTION_SCREEN_L_UPSTEMY * 2 * VS;
			}

		g.drawArc(<number> Math.round(x1),<number> Math.round(y),<number> Math.round(x2 - x1),<number> Math.round(15 * VS),arc1,arc2);
	}

	public static drawTieOnCanvas_2(g:Graphics2D,tieType:number,x1:number,x2:number,y:number,leftx:number,rightx:number):void
	{
		ViewCanvas.drawTieOnCanvas_1(g,tieType,x1,x2,y,leftx,rightx,1);
	}

	/*------------------------------------------------------------------------
Method:  void drawSectionText(MusicTextSection ts,Graphics2D g,double x,double y)
Purpose: Draw text section on canvas
Parameters:
  Input:  ScoreRenderer rs - rendered section
          Graphics2D g     - graphical context
          double x,y       - location at which to draw
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawSectionText(rs:ScoreRenderer,g:Graphics2D,x:number,y:number):void
	{
		let ts:MusicTextSection =<MusicTextSection>( rs.getSectionData());
		x += ScoreRenderer.SECTION_END_SPACING * this.VIEWSCALE;
		g.setFont(this.MusicGfx.displayTextFont);
		g.setColor(Color.black);
		g.drawString(ts.getSectionText(),<number> x,<number> y);
	}

	/*------------------------------------------------------------------------
Method:  void markVariantReading(Graphics2D g,double x1,double x2,double y,double leftx,double rightx,
                                 VariantReading vr,VariantMarkerEvent vme)
Purpose: Draw variant reading mark
Parameters:
  Input:  Graphics2D g           - graphical context
          double x1,x2           - left and right coordinates of mark
          double y               - y level of mark
          double leftx,rightx    - horizontal bounds of drawing space
          VariantReading vr      - reading being marked
          VariantMarkerEvent vme - event marking start of variant
  Output: -
  Return: -
------------------------------------------------------------------------*/
	chooseVarColor(vr:VariantReading,vme:VariantMarkerEvent):Color
	{
		if( vr != null && vr.isError())
			return Color.red;

		if( vme.includesVarType(VariantReading.VAR_RHYTHM) || vme.includesVarType(VariantReading.VAR_PITCH))
			return Color.magenta;

		return Color.green;
	}

	markVariantReading_1(g:Graphics2D,x1:number,x2:number,y:number,leftx:number,rightx:number,vr:VariantReading,vme:VariantMarkerEvent):void
	{
		let varTypeFlags:number = vme.getVarTypeFlags();
		if( varTypeFlags == VariantReading.VAR_ORIGTEXT || ! this.options.markVariant(varTypeFlags & ~ VariantReading.VAR_ORIGTEXT))
			return;

		this.markVariantReadingOnCanvas_1(g,x1,x2,y,leftx,rightx,this.VIEWSCALE,this.chooseVarColor(vr,vme));
		if( vr != null && vr.isError())
			{
				g.setFont(this.defaultTextFontSMALL);
				g.drawString("X",<number> x1,<number> y);
			}

	}

	markVariantReading_2(g:Graphics2D,x:number,y:number,vr:VariantReading,vme:VariantMarkerEvent):void
	{
		let varTypeFlags:number = vme.getVarTypeFlags();
		if( varTypeFlags == VariantReading.VAR_ORIGTEXT || ! this.options.markVariant(varTypeFlags & ~ VariantReading.VAR_ORIGTEXT))
			return;

		this.markVariantReadingOnCanvas_2(g,x,y,this.VIEWSCALE,this.chooseVarColor(vr,vme));
		if( vr != null && vr.isError())
			{
				g.setFont(this.defaultTextFontSMALL);
				g.drawString("X",<number> x,<number> y);
			}

	}

	markVariantReadingOnCanvas_1(g:Graphics2D,x1:number,x2:number,y:number,leftx:number,rightx:number,VS:number,c:Color):void
	{
		let MARKSCALE:number = 5 * VS;
		g.setColor(c);
		x1 += VS;
		if( x1 >= leftx)
			{ }
		else
			x1 = leftx;

		if( this.displayEditTags)
			x2 += VS *((( 4 + MusicFont.getDefaultGlyphWidth((( MusicFont.PIC_NOTESTART + NoteEvent.NOTEHEADSTYLE_SEMIBREVE) | 0))) | 0));

		if( x2 < rightx)
			{ }
		else
			x2 = rightx - 1;

		g.drawLine(<number> Math.round(x1),<number> Math.round(y),<number> Math.round(x2),<number> Math.round(y));
	}

	//g.drawLine((int)Math.round(x1),(int)Math.round(y-MARKSCALE),(int)Math.round(x1),(int)Math.round(y+MARKSCALE));
	//g.drawLine((int)Math.round(x2),(int)Math.round(y-MARKSCALE),(int)Math.round(x2),(int)Math.round(y+MARKSCALE));
	markVariantReadingOnCanvas_2(g:Graphics2D,x:number,y:number,VS:number,c:Color):void
	{
		let MARKSCALE:number = 3 * VS;
		g.setColor(c);
		g.drawLine(<number> Math.round(x - 2 * MARKSCALE),<number> Math.round(y),<number> Math.round(x - MARKSCALE),<number> Math.round(y + 2 * MARKSCALE));
		g.drawLine(<number> Math.round(x - MARKSCALE),<number> Math.round(y + 2 * MARKSCALE),<number> Math.round(x),<number> Math.round(y));
		g.drawLine(<number> Math.round(x - 2 * MARKSCALE),<number> Math.round(y),<number> Math.round(x),<number> Math.round(y));
	}

	/*------------------------------------------------------------------------
Method:  float drawModKeySig(Graphics2D g,ModernKeySignature mk,RenderedEvent cre,float xloc,float yloc)
Purpose: Draw modern key signature on staff with specified clef
Parameters:
  Input:  Graphics2D g          - graphical context
          ModernKeySignature mk - signature to draw
          RenderedEvent cre     - event with current clef on staff
          float xloc,yloc       - location to draw
  Output: -
  Return: amount of x space taken by sig
------------------------------------------------------------------------*/
	public static drawModKeySig_1(g:Graphics2D,MusicGfx:MusicFont,mk:ModernKeySignature,cre:RenderedEvent,xloc:number,yloc:number,VIEWSCALE:number,displayEditTags:boolean,STAFFSCALE:number,STAFFPOSSCALE:number):number
	{
		let curx:number = xloc + 5 * VIEWSCALE;
		let c:Clef = cre.getClef();
		let staffApos:number = c.getApos();
		let accColor:number = displayEditTags ? Coloration.BLUE:Coloration.BLACK;
		if( staffApos < 0)
			staffApos += 7;
		else
			if( staffApos > 5)
				staffApos -= 7;

		for(
		let i:Iterator<ModernKeySignatureElement> = mk.iterator();i.hasNext();)
		{
			let kse:ModernKeySignatureElement =<ModernKeySignatureElement> i.next();
			for(
			let ai:number = 0;ai < kse.accidental.numAcc;ai ++)
			{
				MusicGfx.drawGlyph(g,(((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNFlat) | 0) + kse.accidental.accType) | 0),curx,yloc +((((( STAFFSCALE * 4) | 0) -(( STAFFPOSSCALE *((( staffApos + kse.calcAOffset()) | 0))) | 0)) | 0)) * VIEWSCALE,Coloration.AWTColors[accColor]);
				curx +=( MusicGfx.getGlyphWidth((((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNFlat) | 0) + kse.accidental.accType) | 0)) + MusicFont.CONNECTION_SCREEN_MODACC_DBLFLAT) * VIEWSCALE;
			}
		}
		return curx - xloc;
	}

	/* draw individual accidentals in signature */
	public static drawModKeySig_2(outp:PDFCreator,cb:PdfContentByte,mk:ModernKeySignature,cre:RenderedEvent,xloc:number,yloc:number):number
	{
		let curx:number = xloc + 5 * PDFCreator.XEVENTSPACE_SCALE;
		let c:Clef = cre.getClef();
		let staffApos:number = c.getApos();
		if( staffApos < 0)
			staffApos += 7;
		else
			if( staffApos > 5)
				staffApos -= 7;

		for(
		let i:Iterator<ModernKeySignatureElement> = mk.iterator();i.hasNext();)
		{
			let kse:ModernKeySignatureElement =<ModernKeySignatureElement> i.next();
			for(
			let ai:number = 0;ai < kse.accidental.numAcc;ai ++)
			{
				outp.drawGlyph((((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNFlat) | 0) + kse.accidental.accType) | 0),curx,yloc,0,0,(( staffApos + kse.calcAOffset()) | 0),cb);
				curx += MusicFont.CONNECTION_MODACCX * 2;
			}
		}
		return curx - xloc;
	}

	/* draw individual accidentals in signature */
	/*            MusicGfx.drawGlyph(
              g,MusicFont.PIC_CLEFSTART+Clef.CLEF_MODERNFlat+kse.accidental.accType,
              curx,yloc+(STAFFSCALE*4-STAFFPOSSCALE*(staffApos+kse.calcAOffset()))*VIEWSCALE,
              Coloration.AWTColors[accColor]);
            curx+=(MusicGfx.getGlyphWidth(MusicFont.PIC_CLEFSTART+Clef.CLEF_MODERNFlat+kse.accidental.accType)+
                   MusicFont.CONNECTION_SCREEN_MODACC_DBLFLAT)*VIEWSCALE;*/
	drawModKeySig_3(g:Graphics2D,mk:ModernKeySignature,cre:RenderedEvent,xloc:number,yloc:number):number
	{
		return ViewCanvas.drawModKeySig_1(g,this.MusicGfx,mk,cre,xloc,yloc,this.VIEWSCALE,this.displayEditTags,this.STAFFSCALE,this.STAFFPOSSCALE);
	}

	/*------------------------------------------------------------------------
Method:  float getModKeySigSize(ModernKeySignature mk,RenderedEvent cre)
Purpose: Get x-size of modern key signature on staff with specified clef
Parameters:
  Input:  ModernKeySignature mk - signature to draw
          RenderedEvent cre     - event with current clef on staff
  Output: -
  Return: amount of x space taken by sig
------------------------------------------------------------------------*/
	getModKeySigSize(mk:ModernKeySignature,cre:RenderedEvent):number
	{
		let curx:number = 5 * this.VIEWSCALE;
		let c:Clef = cre.getClef();
		for(
		let i:Iterator<ModernKeySignatureElement> = mk.iterator();i.hasNext();)
		{
			let kse:ModernKeySignatureElement =<ModernKeySignatureElement> i.next();
			for(
			let ai:number = 0;ai < kse.accidental.numAcc;ai ++)
			curx +=( this.MusicGfx.getGlyphWidth((((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNFlat) | 0) + kse.accidental.accType) | 0)) + MusicFont.CONNECTION_SCREEN_MODACC_DBLFLAT) * this.VIEWSCALE;
		}
		return curx;
	}

	/* loop through individual accidentals in signature */
	/*------------------------------------------------------------------------
Method:  void drawEllipsisBreak(Graphics2D g,int vnum,double xloc,RenderedEvent e1,RenderedEvent e2)
Purpose: Remove part of staff in one voice to show break between incipit and
         explicit (in incipit-score)
Parameters:
  Input:  Graphics2D g        - graphical context
          int vnum            - voice number
          double xloc         - left x-coordinate for drawing
          RenderedEvent e1,e2 - ellipsis event and next event (left and right
                                boundaries of break)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawEllipsisBreak(g:Graphics2D,vnum:number,xloc:number,e1:RenderedEvent,e2:RenderedEvent):void
	{
		let xsize:number =( e2.getxloc() - e1.getxloc()) * this.VIEWSCALE;
		let yloc:number = this.YTOP +((((( vnum *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) - this.STAFFSCALE) | 0)) * this.VIEWSCALE;
		let ysize:number =(( 6 * this.STAFFSCALE) | 0) * this.VIEWSCALE;
		if( xloc < this.XLEFT)
			{
				xsize -= this.XLEFT - xloc;
				xloc = this.XLEFT;
			}

		g.setColor(Color.white);
		g.fillRect(<number> Math.round(xloc),<number> Math.round(yloc),<number> Math.round(xsize),<number> Math.round(ysize));
		g.setColor(Color.black);
	}

	/* clip */
	/*------------------------------------------------------------------------
Method:  void drawAllBarlines(Graphics2D g)
Purpose: Draw barlines across screen
Parameters:
  Input:  Graphics2D g - graphical context
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public drawAllBarlines(g:Graphics2D):void
	{
		let i:number;
		let si:number;
		let xloc:number = this.XLEFT + 6 * this.VIEWSCALE;
		g.setColor(Color.black);
		this.nummeasuresdisplayed = 0;
		si = this.leftRendererNum;
		for(
		i = this.curmeasure;i <(( this.nummeasures - 1) | 0) && xloc < this.viewsize.width;i ++)
		{
			if( i > this.renderedSections[si].getLastMeasureNum())
				{
					si ++;
					xloc += ScoreRenderer.SECTION_END_SPACING * this.VIEWSCALE;
				}

			if( i == this.MIDIMeasurePlaying)
				this.drawPlaybackLine(g,Math.round(xloc));

			xloc += this.renderedSections[si].getMeasure(i).xlength * this.VIEWSCALE;
			if( i != this.renderedSections[si].getLastMeasureNum())
				this.drawBarlines_1(g,Math.round(xloc),si);

			this.nummeasuresdisplayed ++;
			if( this.nummeasuresdisplayed % 5 == 0)
				g.drawString(`${i + 2}`,xloc,this.YTOP -(( this.STAFFSCALE * 2) | 0) * this.VIEWSCALE);

		}
		if( i > this.renderedSections[si].getLastMeasureNum())
			si ++;

		if( i == this.MIDIMeasurePlaying)
			this.drawPlaybackLine(g,Math.round(xloc));

		if( i ==(( this.nummeasures - 1) | 0))
			{
				xloc += this.renderedSections[si].getMeasure(i).xlength * this.VIEWSCALE;
			}

		if( xloc < this.viewsize.width)
			this.nummeasuresdisplayed ++;

		this.parentwin.setScrollBarXextent(this.nummeasuresdisplayed);
	}

	/* advance one section */
	/* MIDI playback line */
	/* no barline at section change */
	/* measure number */
	/* MIDI playback line */
	/* ending barline */
	//        drawEndBarline(g,Math.round(xloc));
	drawPlaybackLine(g:Graphics2D,xloc:number):void
	{
		g.setColor(Color.blue);
		g.drawLine(xloc,0,xloc,this.viewsize.height);
		g.setColor(Color.black);
	}

	/*------------------------------------------------------------------------
Method:  void drawBarlines(Graphics2D g,int xloc,int snum)
Purpose: Draw barlines at specified x location
Parameters:
  Input:  Graphics2D g - graphical context
          int xloc     - x location for barlines
          int snum     - section number
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawBarlines_1(g:Graphics2D,xloc:number,snum:number):void
	{
		switch( this.barline_type)
		{
			case OptionSet.OPT_BARLINE_NONE:
			{
				break;
			}
			case OptionSet.OPT_BARLINE_MENSS:
			{
				let v1:number = - 1;
				for(
				let i:number = 0;i < this.numvoices;i ++)
				if( this.curVersionMusicData.getSection(snum).getVoice_1(i) != null)
					{
						if( v1 != - 1)
							g.drawLine(xloc,Math.round(this.YTOP +((((( v1 *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) +(( this.STAFFSCALE * 4) | 0)) | 0)) * this.VIEWSCALE),xloc,Math.round(this.YTOP +((( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0)) * this.VIEWSCALE));

						v1 = i;
					}

				break;
			}
			case OptionSet.OPT_BARLINE_TICK:
			{
				for(
				let i:number = 0;i < this.numvoices;i ++)
				if( this.curVersionMusicData.getSection(snum).getVoice_1(i) != null)
					{
						g.drawLine(xloc,Math.round(this.YTOP - 5 * this.VIEWSCALE +(( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) * this.VIEWSCALE),xloc,Math.round(this.YTOP +((( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0)) * this.VIEWSCALE));
						g.drawLine(xloc,Math.round(this.YTOP +((((( 5 +(( this.STAFFSCALE * 4) | 0)) | 0) +(( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0)) | 0)) * this.VIEWSCALE),xloc,Math.round(this.YTOP +((((( this.STAFFSCALE * 4) | 0) +(( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0)) | 0)) * this.VIEWSCALE));
					}

				break;
			}
			case OptionSet.OPT_BARLINE_MODERN:
			{
				for(
				let i:number = 0;i < this.numvoices;i ++)
				if( this.curVersionMusicData.getSection(snum).getVoice_1(i) != null)
					{
						g.drawLine(xloc,Math.round(this.YTOP +((( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0)) * this.VIEWSCALE),xloc,Math.round(this.YTOP +((((( this.STAFFSCALE * 4) | 0) +(( i *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0)) | 0)) * this.VIEWSCALE));
					}

				break;
			}
		}
	}

	/*------------------------------------------------------------------------
Method:  void drawSectionBarline(Graphics2D g,int xloc,int startv,int endv,boolean incipitEnd)
Purpose: Draw section barline (end or beginning) at specified x location
Parameters:
  Input:  Graphics2D g       - graphical context
          int xloc           - x location for barline
          int startv,endv    - starting/ending voice number (top/bottom)
          boolean incipitEnd - whether this barline separates an incipit
                               from its finalis
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public drawSectionBarline(g:Graphics2D,xloc:number,startv:number,endv:number,incipitEnd:boolean):void
	{
		if( xloc >= this.viewsize.width)
			return;

		if( incipitEnd)
			{
				g.setColor(Color.blue);
				g.setFont(this.defaultTextFontSMALL);
				g.drawString("FINALIS",xloc,Math.round(this.YTOP -(( this.STAFFSCALE * 3) | 0) * this.VIEWSCALE));
			}

		else
			g.setColor(Color.black);

		g.drawLine(xloc,Math.round(this.YTOP +((((( startv * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0)) * this.VIEWSCALE),xloc,Math.round(this.YTOP +((((((( endv * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0) +(( this.STAFFSCALE * 4) | 0)) | 0)) * this.VIEWSCALE));
		if( incipitEnd)
			g.setColor(Color.black);

	}

	/*------------------------------------------------------------------------
Method:  void drawEndBarline(Graphics2D g,int xloc)
Purpose: Draw ending (full) barline at specified x location
Parameters:
  Input:  Graphics2D g    - graphical context
          int startv,endv - starting/ending voice number (top/bottom)
          int xloc        - x location for barline
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public drawEndBarline_1(g:Graphics2D,startv:number,endv:number,xloc:number):void
	{
		if( xloc >= this.viewsize.width)
			return;

		g.drawLine(xloc,Math.round(this.YTOP +((((( startv * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0)) * this.VIEWSCALE),xloc,Math.round(this.YTOP +((((((( endv * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0) +(( this.STAFFSCALE * 4) | 0)) | 0)) * this.VIEWSCALE));
		g.setColor(Color.white);
		g.fillRect((( xloc + 1) | 0),0,(( this.viewsize.width - xloc) | 0),(( this.viewsize.height + 1) | 0));
		g.setColor(Color.black);
	}

	/*------------------------------------------------------------------------
Method:  void addSectionTag(Graphics2D g,ScoreRenderer rs,int x,int y)
Purpose: Add editing tag for music section at specified location
Parameters:
  Input:  ScoreRenderer rs - rendered section information
          int x,y          - location for display
  Output: Graphics2D g     - graphical context
  Return: -
------------------------------------------------------------------------*/
	public addSectionTag(g:Graphics2D,rs:ScoreRenderer,x:number,y:number):void
	{
	}

	/*------------------------------------------------------------------------
Method:  void draw_analysis(Graphics2D g,ScoreRenderer renderedSection,int renum,int vnum,float xloc,float yloc)
Purpose: Mark one event in score with analytical aids
Parameters:
  Input:  Graphics2D g                  - graphical context
          ScoreRenderer renderedSection - section to check
          int renum                     - index of event to check
          int vnum                      - voice number of event
          float xloc,yloc               - location at which event was drawn
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public draw_analysis(g:Graphics2D,renderedSection:ScoreRenderer,renum:number,vnum:number,xloc:number,yloc:number):void
	{
		let re:RenderedEvent = renderedSection.eventinfo[vnum].getEvent(renum);
		let e:Event = re.getEvent_1();
		if( e.geteventtype() != Event.EVENT_NOTE)
			return;

		let mt:number = re.getmusictime().toDouble();
		let measurepos:number =((( mt -<number> mt) * 4) | 0);
		g.setFont(this.FontBOLD18);
		if( this.markdissonances)
			{
				if(( measurepos == 0 || measurepos == 2) && this.isdissonant(renderedSection,re,vnum))
					{
						g.setColor(Color.red);
						g.drawString("X",xloc + 8,yloc - 5);
					}

				else
					if(( measurepos == 1 || measurepos == 3) && this.isdissonant(renderedSection,re,vnum))
						{
							g.setColor(Color.blue);
							g.drawString("X",xloc + 5,yloc - 5);
						}

			}

		if( this.markdirectedprogressions)
			if( measurepos == 0 || measurepos == 2)
				{
					g.setColor(Color.red);
					let progdir:number = this.getprogressiondir(renderedSection,renum,vnum);
					if( progdir != 0)
						g.drawLine(Math.round(xloc - 10),Math.round(yloc),Math.round(xloc + 10),Math.round(yloc +((( - 5 * progdir) | 0))));

				}

		g.setColor(Color.black);
	}

	/* mark dissonances */
	/* mark directed progressions */
	/*------------------------------------------------------------------------
Method:  boolean isdissonant(ScoreRenderer renderedSection,RenderedEvent re,int vnum)
Purpose: Check whether note is dissonant against other voices
Parameters:
  Input:  ScoreRenderer renderedSection - section to check
          RenderedEvent re              - event to check
          int vnum                      - voice number of event
  Output: -
  Return: true if dissonant
------------------------------------------------------------------------*/
	isdissonant(renderedSection:ScoreRenderer,re:RenderedEvent,vnum:number):boolean
	{
		let measure:MeasureInfo = renderedSection.getMeasure(re.getmeasurenum());
		let e:Event = re.getEvent_1();
		for(
		let i:number = 0;i < this.numvoices;i ++)
		if( i != vnum)
			{
				let ei:number = measure.reventindex[i];
				let otherre:RenderedEvent = renderedSection.eventinfo[i].getEvent(ei);
				while( otherre != null && otherre.getmusictime().toDouble() <= re.getmusictime().toDouble())
				{
					let oe:Event = otherre.getEvent_1();
					if( oe.geteventtype() == Event.EVENT_NOTE && otherre.getmusictime().equals(re.getmusictime()))
						{
							let p1:number =(<NoteEvent> e).getPitch_1().placenum;
							let p2:number =(<NoteEvent> oe).getPitch_1().placenum;
							let interval:number =(( Math.abs((( p1 - p2) | 0)) % 7 + 1) | 0);
							if( interval == 2 || interval == 7)
								return true;

						}

					otherre = renderedSection.eventinfo[i].getEvent(++ ei);
				}
			}

		return false;
	}

	/*------------------------------------------------------------------------
Method:  int getprogressiondir(ScoreRenderer renderedSection,int renum,int vnum)
Purpose: Check whether note is the end of a 6-8 directed progression, and whether
         it is ascending or descending
Parameters:
  Input:  ScoreRenderer renderedSection - section to check
          int renum                     - index of event to check
          int vnum                      - voice number of event
  Output: -
  Return: 1=ascending, -1=descending, 0=not a directed progression
------------------------------------------------------------------------*/
	getprogressiondir(renderedSection:ScoreRenderer,renum:number,vnum:number):number
	{
		let re:RenderedEvent = renderedSection.eventinfo[vnum].getEvent(renum);
		let e:Event = re.getEvent_1();
		let measure:MeasureInfo = renderedSection.getMeasure(re.getmeasurenum());
		for(
		let i:number = 0;i < this.numvoices;i ++)
		if( i != vnum)
			{
				let ei:number = measure.reventindex[i];
				let otherre:RenderedEvent = renderedSection.eventinfo[i].getEvent(ei);
				while( otherre != null && otherre.getmusictime().toDouble() <= re.getmusictime().toDouble())
				{
					let oe:Event = otherre.getEvent_1();
					if( oe.geteventtype() == Event.EVENT_NOTE && otherre.getmusictime().equals(re.getmusictime()))
						{
							let interval2:number = this.getAbsInterval(<NoteEvent> e,<NoteEvent> oe);
							if( interval2 == 1)
								{
									let pe1:NoteEvent = this.getPreviousNote(renderedSection,vnum,renum);
									let pe2:NoteEvent = this.getPreviousNote(renderedSection,i,ei);
									if( pe1 != null && pe2 != null)
										{
											let interval1:number = this.getAbsInterval(pe1,pe2);
											if( interval1 == 6 || interval1 == 3)
												{
													let thisint:number =(( e.getPitch_1().placenum - pe1.getPitch_1().placenum) | 0);
													let otherint:number =(((<NoteEvent> oe).getPitch_1().placenum - pe2.getPitch_1().placenum) | 0);
													if((( thisint + otherint) | 0) == 0)
														return thisint;

												}

										}

								}

						}

					otherre = renderedSection.eventinfo[i].getEvent(++ ei);
				}
			}

		return 0;
	}

	getAbsInterval(n1:NoteEvent,n2:NoteEvent):number
	{
		let p1:number = n1.getPitch_1().placenum;
		let p2:number = n2.getPitch_1().placenum;
		return(( Math.abs((( p1 - p2) | 0)) % 7 + 1) | 0);
	}

	getPreviousNote(renderedSection:ScoreRenderer,vnum:number,evnum:number):NoteEvent
	{
		for(
		let i:number =(( evnum - 1) | 0);i >= 0;i --)
		{
			let e:Event = renderedSection.eventinfo[vnum].getEvent(i).getEvent_1();
			if( e.geteventtype() == Event.EVENT_NOTE)
				return<NoteEvent> e;
			else
				if( e.geteventtype() == Event.EVENT_REST)
					return null;

		}
		return null;
	}

	/*------------------------- PUBLIC CALCULATIONS -------------------------*/
	/*------------------------------------------------------------------------
Method:  int calc[SectionNum|VNum|Eventnum|HLEventnum](int newsnum,int newvnum,int x,int y)
Purpose: Calculate section/voice/event number at given x-y screen coordinates
Parameters:
  Input:  int newsnum,newvnum - section/voice number (for calculating event numbers)
          int x,y             - coordinates on screen
  Output: -
  Return: section|voice|event number
------------------------------------------------------------------------*/
	public calcSectionNum(x:number):number
	{
		let absoluteX:number =<number>(( this.renderedSections[this.leftRendererNum].getStartX() + this.getLeftMeasure().leftx) * this.VIEWSCALE - this.XLEFT + x);
		for(
		let si:number = 0;si < this.numSections;si ++)
		if( absoluteX <( this.renderedSections[si].getStartX() + this.renderedSections[si].getXsize()) * this.VIEWSCALE)
			return si;

		return(( this.numSections - 1) | 0);
	}

	public calcVNum(snum:number,y:number):number
	{
		let newvnum:number;
		for(
		newvnum = 0;newvnum <(( this.renderedSections[snum].getNumVoices() - 1) | 0);newvnum ++)
		if( y + this.VIEWYSTART < this.YTOP +(((((((((( newvnum + 1) | 0)) * this.STAFFSCALE) | 0) * this.STAFFSPACING) | 0) -(((( this.STAFFSCALE *((( this.STAFFSPACING - 4) | 0))) | 0) / 2) | 0)) | 0)) * this.VIEWSCALE)
			break;

		return this.curVersionMusicData.getSection(snum).getValidVoicenum(newvnum);
	}

	public calcEventnum(newsnum:number,newvnum:number,x:number):number
	{
		let leftMeasure:MeasureInfo = this.getLeftMeasure();
		let neweventnum:number = newsnum == this.leftRendererNum ? leftMeasure.reventindex[newvnum]:0;
		let sectionXstart:number = 0 - leftMeasure.leftx;
		let exloc:number = 0;
		let lastexloc:number;
		let e:RenderedEvent;
		let nen_found:boolean = false;
		for(
		let si:number = this.leftRendererNum;si < newsnum;si ++)
		sectionXstart += this.renderedSections[si].getXsize() + ScoreRenderer.SECTION_END_SPACING;
		if( neweventnum >= this.renderedSections[newsnum].eventinfo[newvnum].size())
			neweventnum =(( this.renderedSections[newsnum].eventinfo[newvnum].size() - 1) | 0);

		while( ! nen_found)
		{
			e = this.renderedSections[newsnum].eventinfo[newvnum].getEvent(neweventnum);
			exloc = this.XLEFT +( sectionXstart + e.getxloc()) * this.VIEWSCALE;
			if( x > exloc)
				if((( neweventnum + 1) | 0) < this.renderedSections[newsnum].eventinfo[newvnum].size())
					neweventnum ++;
				else
					nen_found = true;


			else
				nen_found = true;

			if( nen_found)
				{
					if(( newsnum > this.leftRendererNum && neweventnum > 0) ||( newsnum == this.leftRendererNum && neweventnum > leftMeasure.reventindex[newvnum]))
						{
							lastexloc = this.XLEFT +( sectionXstart + this.renderedSections[newsnum].eventinfo[newvnum].getEvent((( neweventnum - 1) | 0)).getxloc()) * this.VIEWSCALE;
							if( x <= lastexloc +((( exloc - lastexloc) / 2) | 0))
								{
									neweventnum --;
									exloc = lastexloc;
								}

						}

				}

		}
		while( neweventnum < this.renderedSections[newsnum].eventinfo[newvnum].size() && ! this.renderedSections[newsnum].eventinfo[newvnum].getEvent(neweventnum).isdisplayed())
		neweventnum ++;
		return neweventnum;
	}

	//    newvnum=curVersionMusicData.getSection(newsnum).getValidVoicenum(newvnum);
	/*            if (newsnum<numSections-1)
              {
                sectionXstart+=renderedSections[newsnum].getXsize()+ScoreRenderer.SECTION_END_SPACING;
                newsnum++;
                neweventnum=0;
              }
            else*/
	/* make sure selection is a displayed event */
	/* calculate event numbers for highlighting */
	public calcHLEventnum(newsnum:number,newvnum:number,x:number):number
	{
		newvnum = this.curVersionMusicData.getSection(newsnum).getValidVoicenum(newvnum);
		let leftMeasure:MeasureInfo = this.getLeftMeasure();
		let neweventnum:number = newsnum == this.leftRendererNum ? leftMeasure.reventindex[newvnum]:0;
		let sectionXstart:number = 0 - leftMeasure.leftx;
		let exloc:number = 0;
		let lastexloc:number;
		let e:RenderedEvent;
		let nen_found:boolean = false;
		for(
		let si:number = this.leftRendererNum;si < newsnum;si ++)
		sectionXstart += this.renderedSections[si].getXsize() + ScoreRenderer.SECTION_END_SPACING;
		if( neweventnum >= this.renderedSections[newsnum].eventinfo[newvnum].size())
			neweventnum =(( this.renderedSections[newsnum].eventinfo[newvnum].size() - 1) | 0);

		while( ! nen_found)
		{
			e = this.renderedSections[newsnum].eventinfo[newvnum].getEvent(neweventnum);
			exloc = this.XLEFT +( sectionXstart + e.getxloc()) * this.VIEWSCALE;
			if( x > exloc)
				if((( neweventnum + 1) | 0) < this.renderedSections[newsnum].eventinfo[newvnum].size())
					neweventnum ++;
				else
					nen_found = true;


			else
				nen_found = true;

			if( nen_found)
				{
					if(( newsnum > this.leftRendererNum && neweventnum > 0) ||( newsnum == this.leftRendererNum && neweventnum > leftMeasure.reventindex[newvnum]))
						{
							let laste:RenderedEvent = this.renderedSections[newsnum].eventinfo[newvnum].getEvent((( neweventnum - 1) | 0));
							lastexloc = this.XLEFT +( sectionXstart + this.renderedSections[newsnum].eventinfo[newvnum].getEvent((( neweventnum - 1) | 0)).getxloc()) * this.VIEWSCALE;
							if( x <= lastexloc + laste.getrenderedxsize())
								{
									neweventnum --;
									exloc = lastexloc;
								}

						}

				}

		}
		while( neweventnum < this.renderedSections[newsnum].eventinfo[newvnum].size() && ! this.renderedSections[newsnum].eventinfo[newvnum].getEvent(neweventnum).isdisplayed())
		neweventnum ++;
		return neweventnum;
	}

	/*            if (newsnum<numSections-1)
              {
                sectionXstart+=renderedSections[newsnum].getXsize()+ScoreRenderer.SECTION_END_SPACING;
                newsnum++;
                neweventnum=0;
              }
            else*/
	/* make sure selection is a displayed event */
	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getCurrentVariantVersion_1():VariantVersionData
	{
		return this.curVariantVersion;
	}

	public getMusicData_1():PieceData
	{
		return this.curVersionMusicData;
	}

	public getRenderedMusic():ScoreRenderer[]
	{
		return this.renderedSections;
	}

	public inVariantVersion():boolean
	{
		return this.getCurrentVariantVersion_1() != this.musicData.getDefaultVariantVersion();
	}

	/*------------------------------------------------------------------------
Methods: set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attribute values
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setCurrentVariantVersion_1(vvd:VariantVersionData):void
	{
		this.curVariantVersion = vvd;
		this.setMusicDataForDisplay_1(this.curVariantVersion == this.musicData.getDefaultVariantVersion() ? this.musicData.recalcAllEventParams():this.curVariantVersion.constructMusicData_1(this.musicData).recalcAllEventParams());
	}

	public setMusicDataForDisplay_1(musicData:PieceData):void
	{
		this.curVersionMusicData = musicData;
		this.rerender_1();
		this.repaint();
	}

	/*--------------------------- EVENT LISTENERS ---------------------------*/
	/*------------------------------------------------------------------------
Method:     void mousePressed(MouseEvent e)
Implements: MouseListener.mousePressed
Purpose:    Handle mouse click on canvas
Parameters:
  Input:  MouseEvent e - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public mousePressed(e:MouseEvent):void
	{
		let newSNum:number = this.calcSectionNum(e.getX());
		let newVNum:number = this.calcVNum(newSNum,e.getY());
		let newEventnum:number = this.calcHLEventnum(newSNum,newVNum,e.getX());
		switch( e.getButton())
		{
			case MouseEvent.BUTTON1:
			{
				this.selectEvent(newVNum,newEventnum);
				break;
			}
			case MouseEvent.BUTTON2:
			{
			}
			case MouseEvent.BUTTON3:
			{
				this.showVariants_1(newSNum,newVNum,newEventnum,e.getXOnScreen(),e.getYOnScreen());
				break;
			}
		}
	}

	/* empty MouseListener methods */
	public mouseClicked(e:MouseEvent):void
	{
	}

	public mouseDragged(e:MouseEvent):void
	{
	}

	public mouseEntered(e:MouseEvent):void
	{
	}

	public mouseExited(e:MouseEvent):void
	{
	}

	public mouseReleased(e:MouseEvent):void
	{
	}

	/*------------------------------------------------------------------------
Method:  void unregisterListeners()
Purpose: Remove all action/item/etc listeners when disposing of resources
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public unregisterListeners_1():void
	{
		this.removeMouseListener(this);
	}
}
