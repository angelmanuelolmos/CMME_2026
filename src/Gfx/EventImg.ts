
import { MusicFont } from './MusicFont';
import { ImageObserver } from '../java/awt/image/ImageObserver';
/*------------------------------------------------------------------------
Class:   EventImg
Extends: -
Purpose: Information about one image for a rendered event
------------------------------------------------------------------------*/
import { Graphics2D } from '../java/awt/Graphics2D';

export abstract class EventImg
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public staffypos:number;
	/* base y position on staff */
	public xsize:number;
	/* horizontal space occupied by image */
	public color:number;
	public xoff:number;
	public yoff:number;
	/* offset from event beginning */
	public UNSCALEDxoff:number;
	public UNSCALEDyoff:number;

	public abstract draw(g:Graphics2D,mf:MusicFont,ImO:ImageObserver,xl:number,yl:number,c:number,VIEWSCALE:number):void;

	public draw_1(g:Graphics2D,mf:MusicFont,ImO:ImageObserver,xl:number,yl:number,VIEWSCALE:number):void
	{
		this.draw(g,mf,ImO,xl,yl,this.color,VIEWSCALE);
	}

	public draw_2(g:Graphics2D,mf:MusicFont,ImO:ImageObserver,xl:number,yl:number):void
	{
		this.draw_3(g,mf,ImO,xl,yl,this.color);
	}

	public draw_3(g:Graphics2D,mf:MusicFont,ImO:ImageObserver,xl:number,yl:number,c:number):void
	{
		this.draw(g,mf,ImO,xl,yl,c,1);
	}
}
