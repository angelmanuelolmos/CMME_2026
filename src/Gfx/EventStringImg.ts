
import { StringBuffer } from '../java/lang/StringBuffer';
import { Math } from '../java/lang/Math';
import { MusicFont } from './MusicFont';
import { EventImg } from './EventImg';
import { EventGlyphImg } from './EventGlyphImg';
import { Font } from '../java/awt/Font';
import { Color } from '../java/awt/Color';
import { Graphics2D } from '../java/awt/Graphics2D';
import { FontMetrics } from '../java/awt/FontMetrics';
import { ImageObserver } from '../java/awt/image/ImageObserver';
import { BufferedImage } from '../java/awt/image/BufferedImage';
import { ArrayList } from '../java/util/ArrayList';
import { Iterator } from '../java/util/Iterator';
import { JLabel } from '../javax/swing/JLabel';
/*------------------------------------------------------------------------
Class:   EventStringImg
Extends: EventImg
Purpose: Information about one image for a rendered event
------------------------------------------------------------------------*/
import { Coloration } from '../DataStruct/Coloration';

export class EventStringImg extends EventImg
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static genericBI:BufferedImage = new BufferedImage(10,10,BufferedImage.TYPE_INT_ARGB);
	public static genericG:Graphics2D = EventStringImg.genericBI.createGraphics();
	public static BSObserver:JLabel = new JLabel();
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public imgtext:string;
	public imgtextWithoutSymbols:string;
	public specialImages:ArrayList<EventGlyphImg>;
	public textXSize:number;
	fontSize:number;
	fontStyle:number;
	imgfont:Font;
	imgcolor:Color;

	public static new2(s:string,syp:number,xo:number,yo:number,uxo:number,uyo:number,c:number,size:number):EventStringImg
	{
		let _new2:EventStringImg = new EventStringImg;
		EventStringImg.set2(_new2,s,syp,xo,yo,uxo,uyo,c,size);
		return _new2;
	}

	public static set2(new2:EventStringImg,s:string,syp:number,xo:number,yo:number,uxo:number,uyo:number,c:number,size:number):void
	{
		EventStringImg.set3(new2,s,syp,xo,yo,uxo,uyo,c,size,Font.PLAIN);
	}

	public static new3(s:string,syp:number,xo:number,yo:number,uxo:number,uyo:number,c:number,size:number,style:number):EventStringImg
	{
		let _new3:EventStringImg = new EventStringImg;
		EventStringImg.set3(_new3,s,syp,xo,yo,uxo,uyo,c,size,style);
		return _new3;
	}

	public static set3(new3:EventStringImg,s:string,syp:number,xo:number,yo:number,uxo:number,uyo:number,c:number,size:number,style:number):void
	{
		new3.imgtext = s;
		new3.imgfont = style == Font.ITALIC ? MusicFont.defaultTextItalFont:MusicFont.defaultTextFont;
		if( new3.imgfont.getSize() != size)
			new3.imgfont = new3.imgfont.deriveFont(style,<number> size);

		new3.fontSize = size;
		new3.fontStyle = style;
		new3.color = c;
		new3.imgcolor = Coloration.AWTColors[new3.color];
		new3.staffypos = syp;
		new3.xsize = 0;
		new3.xoff = xo;
		new3.yoff = yo;
		new3.UNSCALEDxoff = uxo;
		new3.UNSCALEDyoff = uyo;
		new3.initimage();
	}

	/* create image displaying string */
	initimage():void
	{
		EventStringImg.genericG.setFont(this.imgfont);
		let metrics:FontMetrics = EventStringImg.genericG.getFontMetrics();
		let textyloc:number = metrics.getHeight();
		let textdescent:number = metrics.getDescent();
		let picysize:number =(( textyloc + textdescent) | 0);
		this.textXSize = metrics.stringWidth(this.imgtext);
		this.specialImages = new ArrayList<EventGlyphImg>();
		let curx:number = 0;
		let escapeglyphnum:number;
		let c:string;
		let textarray:string[]= Array(this.imgtext.length);
		for(
		let i:number = 0;i < this.imgtext.length;i ++)
		{
			textarray[i]= `${this.imgtext.charAt(i)}`;
		}
		let textarrayWithoutSymbols:StringBuffer = new StringBuffer();
		for(
		let i:number = 0;i < textarray.length;i ++)
		{
			if( textarray[i]== "\\")
				{
					if((( i + 1) | 0) < textarray.length && textarray[((( i + 1) | 0))]== "m")
						{
							i += 2;
							if( i < textarray.length)
								{
									if( textarray[i]== "O")
										escapeglyphnum = MusicFont.PIC_MENS_O;
									else
										if( textarray[i]== "C")
											escapeglyphnum = MusicFont.PIC_MENS_C;
										else
											escapeglyphnum = MusicFont.PIC_MENS_NONE;

									if((( i + 1) | 0) < textarray.length && textarray[((( i + 1) | 0))]== "r")
										{
											i ++;
											escapeglyphnum = MusicFont.PIC_MENS_CREV;
										}

									let mensxoff:number = curx - MusicFont.PICXOFFSET;
									let mensyoff:number =(((( MusicFont.PICYCENTER - textyloc) | 0) + textdescent) | 0);
									let USmensxoff:number =<number> curx *( MusicFont.SCREEN_TO_GLYPH_FACTOR + 8);
									let USmensyoff:number = MusicFont.CONNECTION_ANNOTATION_MENSSYMBOL;
									let ei:EventGlyphImg = new EventGlyphImg((((( MusicFont.PIC_MENSSTART + escapeglyphnum) | 0) + MusicFont.PIC_MENS_OFFSETSMALL) | 0),0,mensxoff,mensyoff,USmensxoff,USmensyoff,this.color);
									this.specialImages.add(ei);
									textarrayWithoutSymbols.append("   ");
									if((( i + 1) | 0) < textarray.length && textarray[((( i + 1) | 0))]== "|")
										{
											i ++;
											this.specialImages.add(new EventGlyphImg((((( MusicFont.PIC_MENSSTART + MusicFont.PIC_MENS_STROKE) | 0) + MusicFont.PIC_MENS_OFFSETSMALL) | 0),0,mensxoff,mensyoff,USmensxoff,USmensyoff,this.color));
										}

									if((( i + 1) | 0) < textarray.length && textarray[((( i + 1) | 0))]== ".")
										{
											i ++;
											this.specialImages.add(new EventGlyphImg((((( MusicFont.PIC_MENSSTART + MusicFont.PIC_MENS_DOT) | 0) + MusicFont.PIC_MENS_OFFSETSMALL) | 0),0,mensxoff,mensyoff,USmensxoff,USmensyoff,this.color));
										}

									curx += ei.xsize;
								}

						}

				}

			else
				{
					c = textarray[i];
					textarrayWithoutSymbols.append(c);
					curx += metrics.stringWidth(c);
				}

		}
		this.imgtextWithoutSymbols = textarrayWithoutSymbols.toString();
		this.xsize =<number> Math.round(curx);
	}

	/* calculate size of image */
	/* initialize text/image list */
	/* draw string (translating escape sequences) */
	//    imgtext.toCharArray(); //CHANGE
	/* escape sequence */
	/* mensuration sign */
	/* attributes (stroke/dot) */
	/* regular character */
	//CHANGE was charwidth
	/*------------------------------------------------------------------------
Method:  void draw(java.awt.Graphics2D g,MusicFont mf,ImageObserver ImO,
                   double xl,double yl,int c,double VIEWSCALE)
Purpose: Draws image into given graphical context
Parameters:
  Input:  Graphics2D g      - graphical context for drawing
          MusicFont mf      - font for drawing symbols
          ImageObserver ImO - observer for drawImage
          double xl,yl       - location of event in graphical context
          int c             - color
          double VIEWSCALE   - scaling factor
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public draw(g:Graphics2D,mf:MusicFont,ImO:ImageObserver,xl:number,yl:number,c:number,VIEWSCALE:number):void
	{
		if( this.color == Coloration.GRAY)
			c = this.color;

		this.imgcolor = Coloration.AWTColors[c];
		g.setFont(mf.chooseTextFont(this.fontSize,this.fontStyle));
		g.setColor(this.imgcolor);
		g.drawString(this.imgtextWithoutSymbols,<number>( xl + this.xoff * VIEWSCALE),<number>( yl - this.yoff * VIEWSCALE));
		for(
		let i:Iterator<EventGlyphImg> = this.specialImages.iterator();i.hasNext();)
		(<EventImg>( i.next())).draw_2(g,mf,ImO,xl + this.xoff * VIEWSCALE,yl - this.yoff * VIEWSCALE);
	}
}
