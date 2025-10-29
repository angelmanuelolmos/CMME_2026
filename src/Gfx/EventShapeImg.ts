
import { MusicFont } from './MusicFont';
import { EventImg } from './EventImg';
import { Color } from '../java/awt/Color';
import { Shape } from '../java/awt/Shape';
import { Graphics2D } from '../java/awt/Graphics2D';
import { AffineTransform } from '../java/awt/geom/AffineTransform';
import { ImageObserver } from '../java/awt/image/ImageObserver';
/*------------------------------------------------------------------------
Class:   EventShapeImg
Extends: EventImg
Purpose: Information about one image for a rendered event
------------------------------------------------------------------------*/
import { Coloration } from '../DataStruct/Coloration';

export class EventShapeImg extends EventImg
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	screenshape:Shape;
	/* shape outline for screen */
	shapecolor:Color;
	public printshapex:number[];
	public printshapey:number[];
	public filled:boolean;
	public multipleypos:boolean = false;
	public staffypos2:number;
	public yswitchnum:number;

	public static new0(ss:Shape,psx:number[],psy:number[],c:number,cf:number,ssn1:number):EventShapeImg
	{
		let _new0:EventShapeImg = new EventShapeImg;
		EventShapeImg.set0(_new0,ss,psx,psy,c,cf,ssn1);
		return _new0;
	}

	public static set0(new0:EventShapeImg,ss:Shape,psx:number[],psy:number[],c:number,cf:number,ssn1:number):void
	{
		new0.screenshape = ss;
		new0.printshapex = psx;
		new0.printshapey = psy;
		new0.xoff =<number>( ss.getBounds().getX());
		new0.xsize =<number>( ss.getBounds().getWidth());
		new0.color = c;
		new0.shapecolor = Coloration.AWTColors[new0.color];
		new0.filled = cf == Coloration.FULL;
		new0.staffypos = ssn1;
	}

	public static new1(ss:Shape,psx:number[],psy:number[],c:number,cf:number,ssn1:number,ssn2:number,switchn:number):EventShapeImg
	{
		let _new1:EventShapeImg = new EventShapeImg;
		EventShapeImg.set1(_new1,ss,psx,psy,c,cf,ssn1,ssn2,switchn);
		return _new1;
	}

	public static set1(new1:EventShapeImg,ss:Shape,psx:number[],psy:number[],c:number,cf:number,ssn1:number,ssn2:number,switchn:number):void
	{
		EventShapeImg.set0(new1,ss,psx,psy,c,cf,ssn1);
		new1.multipleypos = true;
		new1.staffypos2 = ssn2;
		new1.yswitchnum = switchn;
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

		g.setColor(Coloration.AWTColors[c]);
		let saveAT:AffineTransform = g.getTransform();
		g.translate(xl,yl);
		g.scale(VIEWSCALE,VIEWSCALE);
		g.translate(5,0);
		g.draw(this.screenshape);
		if( this.filled)
			g.fill(this.screenshape);

		g.setTransform(saveAT);
	}
}
