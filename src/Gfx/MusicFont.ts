
import { Exception } from '../java/lang/Exception';
import { Character } from '../java/lang/Character';
import { Font } from '../java/awt/Font';
import { Color } from '../java/awt/Color';
import { Graphics2D } from '../java/awt/Graphics2D';
import { FontMetrics } from '../java/awt/FontMetrics';
import { BufferedImage } from '../java/awt/image/BufferedImage';
import { URL } from '../java/net/URL';

export class MusicFont
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static FontRelativeDir:string = "fonts/";
	public static DisplayFontFileName:string = "cmme.ttf";
	public static ModernFontFileName:string = "cmme-modern.ttf";
	public static PrintFontFileName:string = "cmme-printer.ttf";
	public static PIC_OFFSET:number = 0;
	public static PIC_NULL:number = 33;
	public static PIC_CLEFSTART:number = 34;
	public static PIC_NOTESTART:number =(( MusicFont.PIC_CLEFSTART + 30) | 0);
	public static PIC_MODNOTESTART:number =(( MusicFont.PIC_NOTESTART + 30) | 0);
	public static PIC_MENSSTART:number =(( MusicFont.PIC_NOTESTART + 40) | 0);
	public static PIC_RESTSTART:number = 0xae;
	public static PIC_MODRESTSTART:number =(( MusicFont.PIC_RESTSTART + 8) | 0);
	public static PIC_MISCSTART:number = 0xcc;
	public static PIC_NOTE_OFFSET_STEMUP:number = 10;
	public static PIC_NOTE_OFFSET_STEMDOWN:number = 20;
	public static PIC_MODNOTE_OFFSET_STEMUP:number = 0;
	public static PIC_MODNOTE_OFFSET_STEMDOWN:number = 2;
	public static PIC_MODNOTE_OFFSET_FLAGUP:number = 7;
	public static PIC_MODNOTE_OFFSET_FLAGDOWN:number = 8;
	public static PIC_MENS_O:number = 0;
	public static PIC_MENS_C:number = 1;
	public static PIC_MENS_CREV:number = 2;
	public static PIC_MENS_C90CW:number = 3;
	public static PIC_MENS_C90CCW:number = 4;
	public static PIC_MENS_STROKE:number = 5;
	public static PIC_MENS_DOT:number = 8;
	public static PIC_MENS_NONE:number = 9;
	public static PIC_MENS_OFFSETSMALL:number = 10;
	public static PIC_MISC_BLANK:number = 0;
	public static PIC_MISC_DOT:number = 1;
	public static PIC_MISC_STEM:number = 2;
	public static PIC_MISC_LEDGER:number = 3;
	public static PIC_MISC_LINEEND:number = 4;
	public static PIC_MISC_CUSTOS:number = 5;
	public static PIC_MISC_FLAGUP:number = 6;
	public static PIC_MISC_FLAGDOWN:number = 7;
	public static PIC_MISC_CORONAUP:number = 8;
	public static PIC_MISC_CORONADOWN:number = 9;
	public static PIC_MISC_SIGNUMUP:number = 10;
	public static PIC_MISC_SIGNUMDOWN:number = 11;
	public static PIC_MISC_ANGBRACKETLEFT:number = 12;
	public static PIC_MISC_ANGBRACKETRIGHT:number = 13;
	public static PIC_MISC_PARENSLEFT:number = 14;
	public static PIC_MISC_PARENSRIGHT:number = 15;
	public static PIC_MISC_PARENSLEFTSMALL:number = 16;
	public static PIC_MISC_PARENSRIGHTSMALL:number = 17;
	public static PIC_MISC_BRACKETLEFT:number = 18;
	public static PIC_MISC_BRACKETRIGHT:number = 19;
	/* connections for glyph combinations (in units of 1/1000 point) */
	public static CONNECTION_SB_UPSTEMX:number = 257;
	public static CONNECTION_SB_UPSTEMY:number = 280;
	public static CONNECTION_SB_DOWNSTEMX:number = 257;
	public static CONNECTION_SB_DOWNSTEMY:number = - 1757;
	public static CONNECTION_L_LEFTSTEMX:number = 0;
	public static CONNECTION_L_STEMX:number = 446;
	public static CONNECTION_L_UPSTEMY:number = 282.6;
	public static CONNECTION_L_DOWNSTEMY:number = - 1730;
	public static CONNECTION_MX_STEMX:number = 991;
	public static CONNECTION_STEM_UPFLAGY:number = 1700;
	public static CONNECTION_STEM_DOWNFLAGY:number = - 1650;
	public static CONNECTION_STEM_UPMODFLAGY:number = 1400;
	public static CONNECTION_STEM_DOWNMODFLAGY:number = - 1350;
	public static CONNECTION_MODFLAGX:number = 0;
	public static CONNECTION_FLAGINTERVAL:number = 700;
	public static CONNECTION_CORONAX:number = - 180;
	public static CONNECTION_DOTX:number = 240;
	public static CONNECTION_MODACCX:number = 180;
	public static CONNECTION_MODACC_DBLFLAT:number = - 270;
	public static CONNECTION_MODACC_DBLSHARP:number = - 450;
	public static CONNECTION_MODACC_PARENS:number = 270;
	public static CONNECTION_MODACCSMALLX:number = 180;
	public static CONNECTION_MODACC_SMALLDBLFLAT:number = - 360;
	public static CONNECTION_MODACC_SMALLDBLSHARP:number = - 450;
	public static CONNECTION_MODACC_SMALLNATURAL:number = 90;
	public static CONNECTION_MODACC_SMALLPARENS:number = 45;
	public static CONNECTION_ANGBRACKETLEFT:number = - 240;
	public static CONNECTION_ANGBRACKETRIGHT:number = 450;
	public static CONNECTION_LIG_RECTA:number = 446;
	public static CONNECTION_LIG_UPSTEMY:number = 200;
	public static CONNECTION_LIG_DOWNSTEMY:number = - 1650;
	public static CONNECTION_BARLINEX:number = 200;
	public static CONNECTION_ANNOTATION_MENSSYMBOL:number = 235;
	public static CONNECTION_MENSSIGNX:number = 800;
	public static CONNECTION_MENSNUMBERX:number = 90;
	public static CONNECTION_MENSNUMBERY:number = - 90;
	public static CONNECTION_SCREEN_ANGBRACKETLEFT:number = - 6;
	public static CONNECTION_SCREEN_ANGBRACKETRIGHT:number = 13;
	public static CONNECTION_SCREEN_BARLINEX:number = 5;
	public static CONNECTION_SCREEN_CORONAX:number = - 2;
	public static CONNECTION_SCREEN_DOTX:number = 6;
	public static CONNECTION_SCREEN_MODFLAGX:number = - 2;
	public static CONNECTION_SCREEN_FLAGINTERVAL:number = 8;
	public static CONNECTION_SCREEN_LIG_DOWNSTEMY:number = - 36;
	public static CONNECTION_SCREEN_LIG_RECTA:number = 11;
	public static CONNECTION_SCREEN_LIG_UPSTEMY:number = 6;
	public static CONNECTION_SCREEN_L_LEFTSTEMX:number = 0;
	public static CONNECTION_SCREEN_L_STEMX:number = 11;
	public static CONNECTION_SCREEN_L_UPSTEMY:number = 5;
	public static CONNECTION_SCREEN_L_DOWNSTEMY:number = - 35;
	public static CONNECTION_SCREEN_MENSNUMBERX:number = 10;
	public static CONNECTION_SCREEN_MENSNUMBERY:number = - 2;
	public static CONNECTION_SCREEN_MENSSIGNX:number = 15;
	public static CONNECTION_SCREEN_MODACCSMALLX:number = 3;
	public static CONNECTION_SCREEN_MODACCX:number = 2;
	public static CONNECTION_SCREEN_MODACC_DBLFLAT:number = - 2;
	public static CONNECTION_SCREEN_MODACC_DBLSHARP:number = - 5;
	public static CONNECTION_SCREEN_MODACC_PARENS:number = 4;
	public static CONNECTION_SCREEN_MODACC_SMALLDBLFLAT:number = - 2;
	public static CONNECTION_SCREEN_MODACC_SMALLDBLSHARP:number = - 4;
	public static CONNECTION_SCREEN_MODACC_SMALLNATURAL:number = 3;
	public static CONNECTION_SCREEN_MODACC_SMALLPARENSLEFT:number = 5;
	public static CONNECTION_SCREEN_MODACC_SMALLPARENSRIGHT:number = 4;
	public static CONNECTION_SCREEN_MX_STEMX:number = 21;
	public static CONNECTION_SCREEN_SB_UPSTEMX:number = 6;
	public static CONNECTION_SCREEN_SB_UPSTEMY:number = 6;
	public static CONNECTION_SCREEN_SB_DOWNSTEMX:number = 6;
	public static CONNECTION_SCREEN_SB_DOWNSTEMY:number = - 36;
	public static CONNECTION_SCREEN_STEM_UPFLAGY:number = 30;
	public static CONNECTION_SCREEN_STEM_DOWNFLAGY:number = 1;
	public static DEFAULT_MUSIC_FONTSIZE:number = 42;
	public static DEFAULT_TEXT_FONTSIZE:number = 14;
	public static DEFAULT_TEXT_SMALLFONTSIZE:number = 12;
	public static DEFAULT_TEXT_LARGEFONTSIZE:number = 20;
	public static PICXOFFSET:number = 4;
	public static PICYCENTER:number = 41;
	public static SCREEN_TO_GLYPH_FACTOR:number = 40;
	/* static generic G2D for creating FontMetrics */
	static genericBI:BufferedImage = new BufferedImage(10,10,BufferedImage.TYPE_INT_ARGB);
	static genericG:Graphics2D = MusicFont.genericBI.createGraphics();
	public static baseMusicFont:Font = null;
	public static defaultMusicFont:Font = null;
	public static defaultTextFont:Font = null;
	public static defaultTextItalFont:Font = null;
	public static defaultMusicFontMetrics:FontMetrics = null;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public displayOrigFont:Font;
	public displayModFont:Font;
	public displayTextFont:Font;
	public displayTextItalFont:Font;
	public displayTextSmallFont:Font;
	public displayTextItalSmallFont:Font;
	public displayTextLargeFont:Font;
	public displayTextItalLargeFont:Font;
	public displayOrigFontMetrics:FontMetrics;
	public displayTextFontMetrics:FontMetrics;
	public displayTextSmallFontMetrics:FontMetrics;
	public displayTextLargeFontMetrics:FontMetrics;

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  void loadmusicface(String database)
Purpose: Load music face from which all instances get their glyphs
Parameters:
  Input:  String database - base data directory location
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public static loadmusicface(database:string):void
	{
		MusicFont.baseMusicFont = Font.createFont(Font.TRUETYPE_FONT,new URL(database + MusicFont.FontRelativeDir + MusicFont.DisplayFontFileName).openStream());
		MusicFont.defaultMusicFont = MusicFont.baseMusicFont.deriveFont(MusicFont.DEFAULT_MUSIC_FONTSIZE);
		MusicFont.defaultTextFont = new Font(null,Font.PLAIN,<number> MusicFont.DEFAULT_TEXT_FONTSIZE);
		MusicFont.defaultTextItalFont = new Font(null,Font.ITALIC,<number> MusicFont.DEFAULT_TEXT_FONTSIZE);
		MusicFont.genericG.setFont(MusicFont.defaultMusicFont);
		MusicFont.defaultMusicFontMetrics = MusicFont.genericG.getFontMetrics();
	}

	/*------------------------------------------------------------------------
Method:  void destroyMusicFace()
Purpose: Release resources from main static music face
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public static destroyMusicFace():void
	{
		MusicFont.baseMusicFont = null;
	}

	/*------------------------------------------------------------------------
Method:  int getDefaultGlyphWidth(int glyphNum)
Purpose: Calculate default x-width required by one music glyph
Parameters:
  Input:  int glyphNum - number of glyph to check
  Output: -
  Return: default x-space required by glyph
------------------------------------------------------------------------*/
	public static getDefaultGlyphWidth(glyphNum:number):number
	{
		return MusicFont.defaultMusicFontMetrics.stringWidth(Character.toString((( MusicFont.PIC_OFFSET + glyphNum) | 0)));
	}

	//CHANGE was charwidth
	public static getDefaultPrintGlyphWidth(glyphNum:number):number
	{
		return MusicFont.getDefaultGlyphWidth(glyphNum) * MusicFont.SCREEN_TO_GLYPH_FACTOR;
	}

	public static new0():MusicFont
	{
		let _new0:MusicFont = new MusicFont;
		MusicFont.set0(_new0);
		return _new0;
	}

	public static set0(new0:MusicFont):void
	{
		MusicFont.set1(new0,<number> 1);
	}

	public static new1(VIEWSCALE:number):MusicFont
	{
		let _new1:MusicFont = new MusicFont;
		MusicFont.set1(_new1,VIEWSCALE);
		return _new1;
	}

	public static set1(new1:MusicFont,VIEWSCALE:number):void
	{
		new1.newScale(VIEWSCALE);
	}

	/*------------------------------------------------------------------------
Method:  void newScale(double VIEWSCALE)
Purpose: Change font size
Parameters:
  Input:  double VIEWSCALE - new size multiplier
  Output: -
  Return: -
------------------------------------------------------------------------*/
	newScale(VIEWSCALE:number):void
	{
		this.displayOrigFont = MusicFont.baseMusicFont.deriveFont(<number>( MusicFont.DEFAULT_MUSIC_FONTSIZE * VIEWSCALE));
		this.displayTextFont = MusicFont.defaultTextFont.deriveFont(<number>( MusicFont.DEFAULT_TEXT_FONTSIZE * VIEWSCALE));
		this.displayTextItalFont = MusicFont.defaultTextFont.deriveFont(Font.ITALIC,<number>( MusicFont.DEFAULT_TEXT_FONTSIZE * VIEWSCALE));
		this.displayTextSmallFont = MusicFont.defaultTextFont.deriveFont(<number>( MusicFont.DEFAULT_TEXT_SMALLFONTSIZE * VIEWSCALE));
		this.displayTextItalSmallFont = MusicFont.defaultTextFont.deriveFont(Font.ITALIC,<number>( MusicFont.DEFAULT_TEXT_SMALLFONTSIZE * VIEWSCALE));
		this.displayTextLargeFont = MusicFont.defaultTextFont.deriveFont(<number>( MusicFont.DEFAULT_TEXT_LARGEFONTSIZE * VIEWSCALE));
		this.displayTextItalLargeFont = MusicFont.defaultTextFont.deriveFont(Font.ITALIC,<number>( MusicFont.DEFAULT_TEXT_LARGEFONTSIZE * VIEWSCALE));
		MusicFont.genericG.setFont(this.displayOrigFont);
		this.displayOrigFontMetrics = MusicFont.genericG.getFontMetrics();
		MusicFont.genericG.setFont(this.displayTextFont);
		this.displayTextFontMetrics = MusicFont.genericG.getFontMetrics();
		MusicFont.genericG.setFont(this.displayTextSmallFont);
		this.displayTextSmallFontMetrics = MusicFont.genericG.getFontMetrics();
		MusicFont.genericG.setFont(this.displayTextLargeFont);
		this.displayTextLargeFontMetrics = MusicFont.genericG.getFontMetrics();
	}

	/*------------------------------------------------------------------------
Method:  void drawGlyph(Graphics2D g,int glyphNum,double x,double y,Color c)
Purpose: Draw one glyph into graphical context
Parameters:
  Input:  Graphics2D g - graphical context for drawing
          int glyphNum - number of glyph
          double x,y   - location in context to draw
          Color c      - color
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public drawGlyph(g:Graphics2D,glyphNum:number,x:number,y:number,c:Color):void
	{
		g.setFont(this.displayOrigFont);
		g.setColor(c);
		g.drawString(Character.toString((( MusicFont.PIC_OFFSET + glyphNum) | 0)),<number> x,<number> y);
	}

	/*------------------------------------------------------------------------
Method:  int getGlyphWidth(int glyphNum)
Purpose: Calculate x-width required by one music glyph
Parameters:
  Input:  int glyphNum - number of glyph to check
  Output: -
  Return: x-space required by glyph
------------------------------------------------------------------------*/
	public getGlyphWidth(glyphNum:number):number
	{
		return this.displayOrigFontMetrics.stringWidth(Character.toString((( MusicFont.PIC_OFFSET + glyphNum) | 0)));
	}

	//CHANGE was charWidth
	/*------------------------------------------------------------------------
Method:  Font chooseTextFont(int fsize,fstyle)
Purpose: Choose (scaled) font based on required size
Parameters:
  Input:  int fsize,fstyle - requested font size/style (unscaled)
  Output: -
  Return: closest available text font
------------------------------------------------------------------------*/
	public chooseTextFont(fsize:number,fstyle:number):Font
	{
		if( fsize <= MusicFont.DEFAULT_TEXT_SMALLFONTSIZE)
			return fstyle == Font.ITALIC ? this.displayTextItalSmallFont:this.displayTextSmallFont;

		if( fsize <= MusicFont.DEFAULT_TEXT_FONTSIZE)
			return fstyle == Font.ITALIC ? this.displayTextItalFont:this.displayTextFont;

		return fstyle == Font.ITALIC ? this.displayTextItalLargeFont:this.displayTextLargeFont;
	}
}
