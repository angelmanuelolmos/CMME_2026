
import { Character } from '../java/lang/Character';
import { MusicFont } from './MusicFont';
import { EventImg } from './EventImg';
/*----------------------------------------------------------------------*/
/*

        Module          : EventGlyphImg

        Package         : Gfx

        Classes	Included: EventGlyphImg

        Purpose         : Low-level information for drawing one glyph image
                          within an event (notehead, flag, etc)

        Programmer      : Ted Dumitrescu

        Date Started    : 2005 (moved to separate file 7/25/05)

        Updates         :
7/26/05: added unscaled XY values (for typesetting)
9/2/05:  converted 'EventImg' to abstract class to add support for non-glyph
images (e.g., EventShapeImg)

                                                                        */
/*----------------------------------------------------------------------*/
/*----------------------------------------------------------------------*/
/* Imported packages */
import { Graphics2D } from '../java/awt/Graphics2D';
import { ImageObserver } from '../java/awt/image/ImageObserver';
/*------------------------------------------------------------------------
Class:   EventGlyphImg
Extends: EventImg
Purpose: Information about one image for a rendered event
------------------------------------------------------------------------*/
import { Coloration } from '../DataStruct/Coloration';

export class EventGlyphImg extends EventImg
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public imgnum:string;
	/* index of image in music font */
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: EventGlyphImg(int in,int syp,double xo,double yo,double uxo,double uyo,int c)
Purpose:     Initialize image information
Parameters:
  Input:  int in        - image number
          int syp       - staff y position
          double xo,yo   - XY offset for display
          double uxo,uyo - unscaled XY offset
          int c         - color
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(_in:number,syp:number,xo:number,yo:number,uxo:number,uyo:number,c:number)
	{
		super();
		this.imgnum = Character.toString(_in);
		this.color = c;
		this.staffypos = syp;
		this.xsize = MusicFont.getDefaultGlyphWidth(Character.codePointAt(this.imgnum,0));
		this.xoff = xo;
		this.yoff = yo;
		this.UNSCALEDxoff = uxo;
		this.UNSCALEDyoff = uyo;
	}

	/*------------------------------------------------------------------------
Method:  void draw(java.awt.Graphics2D g,MusicFont mf,ImageObserver ImO,
                   double xl,double yl,int c,double VIEWSCALE)
Purpose: Draws image into given graphical context
Parameters:
  Input:  Graphics2D g      - graphical context for drawing
          MusicFont mf      - font for drawing symbols
          ImageObserver ImO - observer for drawImage
          double xl,yl      - location of event in graphical context
          int c             - color
          double VIEWSCALE  - scaling factor
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public draw(g:Graphics2D,mf:MusicFont,ImO:ImageObserver,xl:number,yl:number,c:number,VIEWSCALE:number):void
	{
		if( this.color == Coloration.GRAY)
			c = this.color;

		if( Character.codePointAt(this.imgnum,0) != - 1)
			mf.drawGlyph(g,Character.codePointAt(this.imgnum,0),xl +( this.xoff + 5) * VIEWSCALE,yl -( this.yoff - MusicFont.PICYCENTER) * VIEWSCALE,Coloration.AWTColors[c]);

	}
}
