
import { Exception } from '../java/lang/Exception';
import { System } from '../java/lang/System';
import { Math } from '../java/lang/Math';
import { ViewCanvas } from './ViewCanvas';
import { StaffEventData } from './StaffEventData';
import { RenderParams } from './RenderParams';
import { RenderedEvent } from './RenderedEvent';
import { RenderedClefSet } from './RenderedClefSet';
import { PartRenderer } from './PartRenderer';
import { OptionSet } from './OptionSet';
import { MusicFont } from './MusicFont';
/*----------------------------------------------------------------------*/
/*

        Module          : VariantReadingPanel.java

        Package         : Gfx

        Classes Included: VariantReadingPanel

        Purpose         : Panel displaying one reading in musical notation

        Programmer      : Ted Dumitrescu

        Date Started    : 7/19/08 (moved out of functions in VariantDisplayFrame)

        Updates         :
8/4/08: Converted drawing system to on-the-fly painting instead of pre-drawing
        into BufferedImage (to save memory when large numbers of
        VariantReadingPanels are kept in memory simultaneously for a
        critical notes window)

                                                                        */
/*----------------------------------------------------------------------*/
/*----------------------------------------------------------------------*/
/* Imported packages */
import { Dimension } from '../java/awt/Dimension';
import { Graphics } from '../java/awt/Graphics';
import { Graphics2D } from '../java/awt/Graphics2D';
import { Color } from '../java/awt/Color';
import { BufferedImage } from '../java/awt/image/BufferedImage';
import { File } from '../java/io/File';
import { ImageIO } from '../javax/imageio/ImageIO';
import { JPanel } from '../javax/swing/JPanel';
import { List } from '../java/util/List';
import { Event } from '../DataStruct/Event';
import { NoteEvent } from '../DataStruct/NoteEvent';
import { VariantReading } from '../DataStruct/VariantReading';
import { VariantVersionData } from '../DataStruct/VariantVersionData';
import { VoiceEventListData } from '../DataStruct/VoiceEventListData';

export class VariantReadingPanel extends JPanel
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	static IMGYSPACE:number = 100;
	static IMGXBUFFER:number = 25;
	static YINDENT:number = 30;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	MusicGfx:MusicFont;
	STAFFSCALE:number;
	VIEWSCALE:number;
	IMGXSPACE:number;
	evXSpace:number;
	imgSize:Dimension;
	renderedStaff:StaffEventData;
	error:boolean;
	displayedVersions:List<VariantVersionData>;

	public static new0_4(v:VoiceEventListData,starti:number,rcs:RenderedClefSet,error:boolean,MusicGfx:MusicFont,STAFFSCALE:number,VIEWSCALE:number):VariantReadingPanel
	{
		let _new0:VariantReadingPanel = new VariantReadingPanel;
		VariantReadingPanel.set0_4(_new0,v,starti,rcs,error,MusicGfx,STAFFSCALE,VIEWSCALE);
		return _new0;
	}

	public static set0_4(new0:VariantReadingPanel,v:VoiceEventListData,starti:number,rcs:RenderedClefSet,error:boolean,MusicGfx:MusicFont,STAFFSCALE:number,VIEWSCALE:number):void
	{
		if( v.getEvent(starti).geteventtype() != Event.EVENT_VARIANTDATA_START)
			{
				System.out.println("Error: attempting to initialize variant panel with non-variant data");
				v.getEvent(starti).prettyprint_1();
			}

		new0.renderedStaff = new0.createVariantStaff();
		new0.initRenderingParams(MusicGfx,STAFFSCALE,VIEWSCALE);
		new0.error = error;
		let i:number =(( starti + 1) | 0);
		let iadd:number;
		let e:Event = v.getEvent(i);
		while( e.geteventtype() != Event.EVENT_VARIANTDATA_END)
		{
			iadd = 1;
			if( e.geteventtype() == Event.EVENT_NOTE &&(<NoteEvent> e).isligated())
				iadd = new0.renderedStaff.addlig_2(v,i,RenderParams.new1(rcs),true);
			else
				new0.renderedStaff.addevent_1(true,e,RenderParams.new1(rcs));

			i += iadd;
			e = v.getEvent(i);
			if( e == null)
				{
					System.out.println("no varend starti=" + starti + " i=" + i);
					for(
					let tmpi:number = starti;tmpi < i;tmpi ++)
					v.getEvent(tmpi).prettyprint_1();
				}

		}
		new0.initPaintingParams();
	}

	public static new1_4(vr:VariantReading,rcs:RenderedClefSet,error:boolean,MusicGfx:MusicFont,STAFFSCALE:number,VIEWSCALE:number):VariantReadingPanel
	{
		let _new1:VariantReadingPanel = new VariantReadingPanel;
		VariantReadingPanel.set1_4(_new1,vr,rcs,error,MusicGfx,STAFFSCALE,VIEWSCALE);
		return _new1;
	}

	public static set1_4(new1:VariantReadingPanel,vr:VariantReading,rcs:RenderedClefSet,error:boolean,MusicGfx:MusicFont,STAFFSCALE:number,VIEWSCALE:number):void
	{
		new1.renderedStaff = new1.createVariantStaff();
		new1.initRenderingParams(MusicGfx,STAFFSCALE,VIEWSCALE);
		new1.error = error;
		let i:number = 0;
		let iadd:number;
		let numEvents:number = vr.getNumEvents();
		let e:Event = vr.getEvent(i);
		while( i < numEvents)
		{
			iadd = 1;
			if( e.geteventtype() == Event.EVENT_NOTE &&(<NoteEvent> e).isligated())
				iadd = new1.renderedStaff.addlig_1(vr.getEvents(),i,RenderParams.new1(rcs));
			else
				new1.renderedStaff.addevent_1(true,e,RenderParams.new1(rcs));

			i += iadd;
			e = vr.getEvent(i);
		}
		new1.initPaintingParams();
	}

	/* render into staff */
	initRenderingParams(MusicGfx:MusicFont,STAFFSCALE:number,VIEWSCALE:number):void
	{
		this.MusicGfx = MusicGfx;
		this.STAFFSCALE = STAFFSCALE;
		this.VIEWSCALE = VIEWSCALE;
	}

	initPaintingParams():void
	{
		this.evXSpace = this.renderedStaff.size() > 0 ? this.renderedStaff.padEvents_2(PartRenderer.MAX_PADDING):VariantReadingPanel.IMGXBUFFER;
		this.IMGXSPACE =((<number> this.evXSpace +(( 2 * VariantReadingPanel.IMGXBUFFER) | 0)) | 0);
		this.imgSize = new Dimension(Math.round(this.IMGXSPACE * this.VIEWSCALE),Math.round(VariantReadingPanel.IMGYSPACE * this.VIEWSCALE));
		this.setBackground(Color.white);
	}

	/* create and initialize one staff renderer for variant display */
	createVariantStaff():StaffEventData
	{
		let renStaff:StaffEventData = StaffEventData.new4();
		renStaff.options.set_displayedittags(false);
		renStaff.options.set_usemodernclefs(false);
		renStaff.options.set_displayorigligatures(true);
		renStaff.options.set_modacc_type(OptionSet.OPT_MODACC_NONE);
		renStaff.options.setViewEdCommentary(true);
		renStaff.options.set_unscoredDisplay(true);
		return renStaff;
	}

	/*------------------------------------------------------------------------
Method:  void saveImgFile(String fn)
Purpose: Save img of this reading to file
Parameters:
  Input:  String fn - filename
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public saveImgFile(fn:string):void
	{
		let img:BufferedImage = new BufferedImage(this.imgSize.width,this.imgSize.height,BufferedImage.TYPE_INT_RGB);
		let g:Graphics = img.createGraphics();
		g.setColor(Color.white);
		g.fillRect(0,0,(( this.imgSize.width + 1) | 0),(( this.imgSize.height + 1) | 0));
		this.paintComponent(g);
		ImageIO.write(img,"jpg",new File(fn));
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
		return this.imgSize;
	}
	/*------------------------------------------------------------------------
Method:  void paintComponent(Graphics g)
Purpose: Repaint area
Parameters:
  Input:  Graphics g - graphical context
  Output: -
  Return: -
------------------------------------------------------------------------*/
	redisplaying:number = 0;

	public paintComponent(g:Graphics):void
	{
		this.redisplaying ++;
		super.paintComponent(g);
		let varG:Graphics2D =<Graphics2D> g;
		varG.setBackground(Color.white);
		varG.clearRect(0,0,this.IMGXSPACE,VariantReadingPanel.IMGYSPACE);
		varG.setColor(Color.black);
		if( this.renderedStaff.size() > 0)
			{
				ViewCanvas.drawStaff_2(varG,<number>( VariantReadingPanel.IMGXBUFFER * this.VIEWSCALE),<number>(( VariantReadingPanel.IMGXBUFFER + this.evXSpace) * this.VIEWSCALE),<number>( VariantReadingPanel.YINDENT * this.VIEWSCALE),5,this.STAFFSCALE,this.VIEWSCALE);
				for(
				let ei:number = 0;ei < this.renderedStaff.size();ei ++)
				{
					let re:RenderedEvent = this.renderedStaff.getEvent(ei);
					re.draw_2(varG,this.MusicGfx,this,( VariantReadingPanel.IMGXBUFFER + re.getxloc()) * this.VIEWSCALE,VariantReadingPanel.YINDENT * this.VIEWSCALE,this.VIEWSCALE);
				}
			}

		if( this.error)
			{
				varG.setColor(Color.red);
				varG.setFont(MusicFont.defaultTextFont);
				varG.drawString("x",10 * this.VIEWSCALE,15 * this.VIEWSCALE);
			}

		this.redisplaying --;
	}
}
