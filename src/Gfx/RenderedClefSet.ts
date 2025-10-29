
import { System } from '../java/lang/System';
import { RenderedEvent } from './RenderedEvent';
import { PDFCreator } from './PDFCreator';
import { MusicFont } from './MusicFont';
import { LinkedList } from '../java/util/LinkedList';
import { Graphics2D } from '../java/awt/Graphics2D';
import { Clef } from '../DataStruct/Clef';
import { ClefSet } from '../DataStruct/ClefSet';
/*------------------------------------------------------------------------
Class:   RenderedCleftSet
Extends: java.util.LinkedList
Purpose: Handles one set of rendered clef events
------------------------------------------------------------------------*/
import { PdfContentByte } from '../com/lowagie/text/pdf/PdfContentByte';

export class RenderedClefSet extends LinkedList<RenderedEvent>
{
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: RenderedClefSet(RenderedClefSet lastRCS,RenderedEvent ce,boolean modClefs,Clef smc)
Purpose:     Initialize clef set
Parameters:
  Input:  RenderedClefSet lastRCS - clef set preceding the new clef event
          RenderedEvent           - new clef event in list
          boolean modClefs        - use modern clef sets?
          Clef smc                - suggested modern clef
  Output: -
------------------------------------------------------------------------*/
	public constructor(lastRCS:RenderedClefSet,ce:RenderedEvent,modClefs:boolean,smc:Clef)
	{
		super();
		if( lastRCS == null || ce.getEvent_1().hasPrincipalClef_1())
			this.add(ce);
		else
			{
				this.addAll(lastRCS);
				let lastCS:ClefSet = lastRCS.getLastClefSet(modClefs);
				let thisCS:ClefSet = ce.getEvent_1().getClefSet_2(modClefs);
				if( lastCS == thisCS || thisCS.contradicts_2(lastCS,modClefs,smc))
					this.add(ce);

			}

	}

	/* create clef set, combining with last valid clef set if necessary */
	/* new clef set */
	/* combine with last set */
	/*------------------------------------------------------------------------
Method:  double draw(boolean princOnly,
                     java.awt.Graphics2D g,MusicFont mf,
                     double xl,double yl,double VIEWSCALE)
Purpose: Draws this clef set into a given graphical context
Parameters:
  Input:  boolean princOnly - whether to draw only principal clefs
          Graphics2D g      - graphical context for drawing
          MusicFont mf      - font for drawing symbols
          double xl,yl      - location in context to draw event
          double VIEWSCALE  - scaling factor
  Output: -
  Return: amount of x-space used
------------------------------------------------------------------------*/
	public draw_1(princOnly:boolean,g:Graphics2D,mf:MusicFont,xl:number,yl:number,VIEWSCALE:number):number
	{
		let origxl:number = xl;
		for(let re of this)
		if(( ! princOnly) || re.getEvent_1().hasPrincipalClef_1())
			xl += re.drawClefs_1(g,mf,null,xl,yl,VIEWSCALE);

		return xl - origxl;
	}

	/*------------------------------------------------------------------------
Method:  float drawClefs(PDFCreator outp,PdfContentByte cb,float xl,float yl)
Purpose: Draws this clef set into PDF
Parameters:
  Input:  PDFCreator outp   - PDF-writing object
          PdfContentByte cb - PDF graphical context
          float xl,yl       - location in context to draw event
  Output: -
  Return: amount of x-space used
------------------------------------------------------------------------*/
	public draw_2(princOnly:boolean,outp:PDFCreator,cb:PdfContentByte,xl:number,yl:number):number
	{
		let origxl:number = xl;
		for(let re of this)
		if(( ! princOnly) || re.getEvent_1().hasPrincipalClef_1())
			xl += re.drawClefs_2(outp,cb,xl,yl);

		return xl - origxl;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getPrincipalClefEvent():RenderedEvent
	{
		return this.get(0);
	}

	public getLastClefEvent():RenderedEvent
	{
		return this.getLast();
	}

	public getLastClefSet(modClefs:boolean):ClefSet
	{
		return this.getLastClefEvent().getEvent_1().getClefSet_2(modClefs);
	}

	public getXSize():number
	{
		let xsize:number = 0;
		for(let re of this)
		xsize += re.getClefImgXSize();
		return xsize;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attributes
  Output: -
  Return: -
------------------------------------------------------------------------*/
	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Prints information about this clef set
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public prettyprint_3():void
	{
		System.out.println(this);
	}

	public toString():string
	{
		let strVal:string = "RenderedClefSet: [ ";
		for(let re of this)
		strVal += re.getEvent_1() + " ";
		strVal += "]";
		return strVal;
	}
}
