

/*----------------------------------------------------------------------*/
/*

        Module          : PrintParams

        Package         : Gfx

        Classes	Included: PrintParams

        Purpose         : Manipulate size parameters for printing

        Programmer      : Ted Dumitrescu

        Date Started    : 7/10/06

        Updates         :

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   PrintParams
Extends: -
Purpose: Store/manipulate information about related sizing parameters for
         printing music (e.g., staff gage, page margins, font sizes)
------------------------------------------------------------------------*/
export class PrintParams
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static DEFAULT_BookExample1:number = 0;
	public static DEFAULT_A4ScorePortrait:number = 1;
	public static DEFAULT_A4PartLandscape:number = 2;
	public static DEFAULT_LetterScorePortrait:number = 3;
	private static DEFAULTS:PrintParams[]=[PrintParams.new2(4.75 * 72,- 1,0.25 * 72,0.125 * 72,0.25,0.2,4,48,0.5,18,6,6,6,6,18,14),PrintParams.new2(595.35,841.95,70.8696,70.8696,0.4336,3,4.668,50,0.75,22,7,10,7,8,24,20),PrintParams.new2(841.95,595.35,70.8696,70.8696,0.4336,0.2,4.668,50,0.75,22,7,7,7,8,24,20),PrintParams.new2(8.5 * 72,11 * 72,0.9 * 72,0.9 * 72,0.4336,3,4.668,50,0.75,22,7,10,7,8,24,20)];
	/* BookExample1 - for printing within writing block 4.75 inches wide */
	/* PAGE[X|Y]SIZE */
	/* [X|Y]MARGIN */
	/* STAFFLINEWIDTH, LINEXADJUST */
	/* STAFFYSCALE, STAFFYSPACE */
	/* STEMWIDTH */
	/* [Music|Plain|Text|StaffName|ScoreAnnotation|Title|Subtitle]FONTSIZE */
	/* A4ScorePortrait */
	/* PAGE[X|Y]SIZE (210x297 mm) */
	/* [X|Y]MARGIN (25x25 mm) */
	/* STAFFLINEWIDTH, LINEXADJUST */
	/* STAFFYSCALE, STAFFYSPACE */
	/* STEMWIDTH */
	/* [Music|Plain|Text|StaffName|ScoreAnnotation|Title|Subtitle]FONTSIZE */
	/* DEFAULT_A4PartLandscape */
	/* PAGE[X|Y]SIZE (297x210 mm) */
	/* [X|Y]MARGIN (25x25 mm) */
	/* STAFFLINEWIDTH, LINEXADJUST */
	/* STAFFYSCALE, STAFFYSPACE */
	/* STEMWIDTH */
	/* [Music|Plain|Text|StaffName|ScoreAnnotation|Title|Subtitle]FONTSIZE */
	/* LetterScorePortrait */
	/* PAGE[X|Y]SIZE (8.5x11") */
	/* [X|Y]MARGIN */
	/* STAFFLINEWIDTH, LINEXADJUST */
	/* STAFFYSCALE, STAFFYSPACE */
	/* STEMWIDTH */
	/* [Music|Plain|Text|StaffName|ScoreAnnotation|Title|Subtitle]FONTSIZE */
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	/* page sizing/location parameters (in points, 72/inch) */
	/* page sizing/location parameters (in points, 72/inch) */
	public PAGEXSIZE:number;
	public PAGEYSIZE:number;
	public XMARGIN:number;
	public YMARGIN:number;
	public YMUSICSTART:number;
	public DRAWINGSPACEY:number;
	/* music/staff sizing */
	public STAFFXSIZE:number;
	public STAFFLINEWIDTH:number;
	public LINEXADJUST:number;
	/* amount to shift events past left staff margin */
	public STAFFYSCALE:number;
	public STAFFYPOSSCALE:number;
	public STAFFYSPACE:number;
	public STAFFYSIZE:number;
	public XYSCALE:number;
	public STEMWIDTH:number;
	public MusicFONTSIZE:number;
	public PlainFONTSIZE:number;
	public TextFONTSIZE:number;
	public StaffNameFONTSIZE:number;
	public ScoreAnnotationFONTSIZE:number;
	public TitleFONTSIZE:number;
	public SubtitleFONTSIZE:number;

	public static new0(defaultNum:number):PrintParams
	{
		let _new0:PrintParams = new PrintParams;
		PrintParams.set0(_new0,defaultNum);
		return _new0;
	}

	public static set0(new0:PrintParams,defaultNum:number):void
	{
		PrintParams.set1(new0,PrintParams.DEFAULTS[defaultNum]);
	}

	public static new1(other:PrintParams):PrintParams
	{
		let _new1:PrintParams = new PrintParams;
		PrintParams.set1(_new1,other);
		return _new1;
	}

	public static set1(new1:PrintParams,other:PrintParams):void
	{
		new1.PAGEXSIZE = other.PAGEXSIZE;
		new1.PAGEYSIZE = other.PAGEYSIZE;
		new1.XMARGIN = other.XMARGIN;
		new1.YMARGIN = other.YMARGIN;
		new1.YMUSICSTART = other.YMUSICSTART;
		new1.DRAWINGSPACEY = other.DRAWINGSPACEY;
		new1.STAFFXSIZE = other.STAFFXSIZE;
		new1.STAFFLINEWIDTH = other.STAFFLINEWIDTH;
		new1.LINEXADJUST = other.LINEXADJUST;
		new1.STAFFYSCALE = other.STAFFYSCALE;
		new1.STAFFYPOSSCALE = other.STAFFYPOSSCALE;
		new1.STAFFYSPACE = other.STAFFYSPACE;
		new1.STAFFYSIZE = other.STAFFYSIZE;
		new1.STEMWIDTH = other.STEMWIDTH;
		new1.MusicFONTSIZE = other.MusicFONTSIZE;
		new1.PlainFONTSIZE = other.PlainFONTSIZE;
		new1.TextFONTSIZE = other.TextFONTSIZE;
		new1.StaffNameFONTSIZE = other.StaffNameFONTSIZE;
		new1.ScoreAnnotationFONTSIZE = other.ScoreAnnotationFONTSIZE;
		new1.TitleFONTSIZE = other.TitleFONTSIZE;
		new1.SubtitleFONTSIZE = other.SubtitleFONTSIZE;
		new1.XYSCALE = other.XYSCALE;
	}

	public static new2(psx:number,psy:number,xm:number,ym:number,stlw:number,lxa:number,stysc:number,stysp:number,sw:number,mfs:number,pfs:number,tfs:number,snfs:number,safs:number,titfs:number,stitfs:number):PrintParams
	{
		let _new2:PrintParams = new PrintParams;
		PrintParams.set2(_new2,psx,psy,xm,ym,stlw,lxa,stysc,stysp,sw,mfs,pfs,tfs,snfs,safs,titfs,stitfs);
		return _new2;
	}

	public static set2(new2:PrintParams,psx:number,psy:number,xm:number,ym:number,stlw:number,lxa:number,stysc:number,stysp:number,sw:number,mfs:number,pfs:number,tfs:number,snfs:number,safs:number,titfs:number,stitfs:number):void
	{
		new2.PAGEXSIZE = psx;
		new2.PAGEYSIZE = psy;
		new2.XMARGIN = xm;
		new2.YMARGIN = ym;
		new2.STAFFLINEWIDTH = stlw;
		new2.LINEXADJUST = lxa;
		new2.STAFFXSIZE = new2.PAGEXSIZE - 2 * new2.XMARGIN;
		new2.STAFFYSCALE = stysc;
		new2.STAFFYPOSSCALE = new2.STAFFYSCALE / 2;
		new2.STAFFYSPACE = stysp;
		new2.STAFFYSIZE = new2.STAFFYSCALE * 4;
		new2.STEMWIDTH = sw;
		new2.MusicFONTSIZE = mfs;
		new2.PlainFONTSIZE = pfs;
		new2.TextFONTSIZE = tfs;
		new2.StaffNameFONTSIZE = snfs;
		new2.ScoreAnnotationFONTSIZE = safs;
		new2.TitleFONTSIZE = titfs;
		new2.SubtitleFONTSIZE = stitfs;
		new2.XYSCALE =( new2.MusicFONTSIZE - 1) / 2000;
		new2.YMUSICSTART = new2.YMARGIN + new2.STAFFYSCALE * 8;
		new2.DRAWINGSPACEY = new2.PAGEYSIZE - new2.YMUSICSTART - new2.YMARGIN;
	}
}
