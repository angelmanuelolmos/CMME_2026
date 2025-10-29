
import { Exception } from '../java/lang/Exception';
import { System } from '../java/lang/System';
import { Math } from '../java/lang/Math';
import { ViewCanvas } from './ViewCanvas';
import { StaffEventData } from './StaffEventData';
import { RenderList } from './RenderList';
import { RenderedEvent } from './RenderedEvent';
import { PartRenderer } from './PartRenderer';
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
/*----------------------------------------------------------------------*/
/*

        Module          : PartsWin

        Package         : Gfx

        Classes Included: PartsWin,VoicePartView,IncipitView,PartPainter

        Purpose         : Display unscored parts in original notation

        Programmer      : Ted Dumitrescu

        Date Started    : 7/8/05

Updates:
3/27/06:  Moved unscored part renderer to separate public class
          (PartRenderer.java)
          Created PartPainter class to share drawing functions between different
          classes
          Added IncipitView, which puts all parts on one canvas
11/13/06: No longer pre-draws parts images into buffers holding entire parts
          (too much memory usage, and drawing on the fly is fast enough)

                                                                        */
/*----------------------------------------------------------------------*/
/*----------------------------------------------------------------------*/
/* Imported packages */
import { Color } from '../java/awt/Color';
import { Container } from '../java/awt/Container';
import { Dimension } from '../java/awt/Dimension';
import { FontMetrics } from '../java/awt/FontMetrics';
import { Graphics } from '../java/awt/Graphics';
import { Graphics2D } from '../java/awt/Graphics2D';
import { Rectangle } from '../java/awt/Rectangle';
import { BufferedImage } from '../java/awt/image/BufferedImage';
import { WindowAdapter } from '../java/awt/event/WindowAdapter';
import { WindowListener } from '../java/awt/event/WindowListener';
import { WindowEvent } from '../java/awt/event/WindowEvent';
import { ActionEvent } from '../java/awt/event/ActionEvent';
import { ActionListener } from '../java/awt/event/ActionListener';
import { AffineTransform } from '../java/awt/geom/AffineTransform';
import { File } from '../java/io/File';
import { ArrayList } from '../java/util/ArrayList';
import { Iterator } from '../java/util/Iterator';
import { ImageIO } from '../javax/imageio/ImageIO';
import { JPanel } from '../javax/swing/JPanel';
import { JFileChooser } from '../javax/swing/JFileChooser';
import { BoxLayout } from '../javax/swing/BoxLayout';
import { JFrame } from '../javax/swing/JFrame';
import { JButton } from '../javax/swing/JButton';
import { JComponent } from '../javax/swing/JComponent';
import { JScrollPane } from '../javax/swing/JScrollPane';
import { JOptionPane } from '../javax/swing/JOptionPane';
import { Event } from '../DataStruct/Event';
import { NoteEvent } from '../DataStruct/NoteEvent';
import { PieceData } from '../DataStruct/PieceData';
import { Voice } from '../DataStruct/Voice';

export class PartsWin extends JFrame implements ActionListener
{
	mytype_ActionListener:boolean = true;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	/* windowing variables */
	win_visible:boolean;
	musicwin:MusicWin;
	/* data */
	musicData:PieceData;
	numvoices:number;
	printPreview:boolean;
	renderedVoices:ArrayList<RenderList>[];

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute values
Parameters:
  Input:  -
  Output: -
  Return: attribute values
------------------------------------------------------------------------*/
	public static getDefaultSTAFFXSIZE():number
	{
		return VoicePartView.defaultSTAFFXSIZE;
	}

	public static getDefaultSTAFFSCALE():number
	{
		return VoicePartView.defaultSTAFFSCALE;
	}

	public static new0_8(p:PieceData,mf:MusicFont,mw:MusicWin,pp:boolean):PartsWin
	{
		let _new0:PartsWin = new PartsWin;
		PartsWin.set0_8(_new0,p,mf,mw,pp);
		return _new0;
	}

	public static set0_8(new0:PartsWin,p:PieceData,mf:MusicFont,mw:MusicWin,pp:boolean):void
	{
		new0.musicwin = mw;
		new0.musicData = p;
		new0.printPreview = pp;
		new0.win_visible = false;
		new0.setTitle(new0.musicwin.getTitle() +( new0.printPreview ? " (print preview)":" (parts layout)"));
		new0.setIconImage(new0.musicwin.windowIcon);
		let contentPane:Container = new0.getContentPane();
		contentPane.setLayout(new BoxLayout(contentPane,BoxLayout.Y_AXIS));
		new0.numvoices = new0.musicData.getVoiceData().length;
		if( new0.printPreview && new0.musicData.isIncipitScore())
			new0.layoutIncipitWindow(contentPane);
		else
			new0.layoutPartsPanels(contentPane);

		new0.pack();
		new0.setLocationRelativeTo(mw);
		new0.addWindowListener(
		{

			windowClosing:(event:WindowEvent):void =>
			{
				new0.closewin_3();
			}
		}
		);
	}

	public static new1_8(p:PieceData,mf:MusicFont,mw:MusicWin):PartsWin
	{
		let _new1:PartsWin = new PartsWin;
		PartsWin.set1_8(_new1,p,mf,mw);
		return _new1;
	}

	public static set1_8(new1:PartsWin,p:PieceData,mf:MusicFont,mw:MusicWin):void
	{
		PartsWin.set0_8(new1,p,mf,mw,false);
	}

	/*------------------------------------------------------------------------
Method:  void layoutPartsPanels(Container c)
Purpose: Add parts displays in separate panels
Parameters:
  Input:  Container c  - component to which to add parts display
  Output: -
  Return: -
------------------------------------------------------------------------*/
	layoutPartsPanels(c:Container):void
	{
		let voiceAreas:VoicePartView[];
		let voiceAreaPanes:JScrollPane[];
		let VS:number =<number> this.musicwin.optSet.getVIEWSCALE();
		let panelSize:Dimension = new Dimension(Math.round(830 * VS),Math.round(200 * VS));
		voiceAreas = Array(this.numvoices);
		voiceAreaPanes = Array(this.numvoices);
		this.renderedVoices = Array(this.numvoices);
		for(
		let i:number = 0;i < this.numvoices;i ++)
		{
			voiceAreas[i]= new VoicePartView(this.musicData.getVoiceData()[i],this.musicwin.optSet,this.printPreview);
			voiceAreaPanes[i]= new JScrollPane(voiceAreas[i]);
			voiceAreaPanes[i].setPreferredSize(panelSize);
			voiceAreaPanes[i].getViewport().setBackground(Color.WHITE);
			c.add(voiceAreaPanes[i]);
			this.renderedVoices[i]= voiceAreas[i].getRenderedData();
		}
	}
	/*------------------------------------------------------------------------
Method:  void layoutIncipitWindow(Container c)
Purpose: Add parts displays on a single canvas
Parameters:
  Input:  Container c - component to which to add parts display
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static incipitImageFileChooser:JFileChooser = null;
	generateImageButton:JButton = null;
	iView:IncipitView;

	layoutIncipitWindow(c:Container):void
	{
		try
		{
			if( PartsWin.incipitImageFileChooser == null)
				PartsWin.incipitImageFileChooser = new JFileChooser(new File(".").getCanonicalPath() + "/data/IMGout/");

		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					System.err.println("Error initializing incipit image file chooser: " + e);
				}

			else
				throw e;

		}
		let controlsPanel:JPanel = new JPanel();
		this.generateImageButton = new JButton("Generate image file...");
		this.generateImageButton.addActionListener(this);
		controlsPanel.add(this.generateImageButton);
		c.add(controlsPanel);
		this.iView = new IncipitView(this.musicData,this.musicwin.optSet);
		let iPane:JScrollPane = new JScrollPane(this.iView);
		iPane.getViewport().setBackground(Color.WHITE);
		c.add(iPane);
	}

	/*------------------------------------------------------------------------
Method:     void actionPerformed(ActionEvent event)
Implements: ActionListener.actionPerformed
Purpose:    Check for actions in GUI and take appropriate action
Parameters:
  Input:  ActionEvent event - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public actionPerformed(event:ActionEvent):void
	{
		let item:any = event.getSource();
		if( item == this.generateImageButton)
			this.genIncipitImageFile();

	}

	/*------------------------------------------------------------------------
Method:  void genIncipitImageFile()
Purpose: Save incipit image to file
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	genIncipitImageFile():void
	{
		let defaultImgName:string = this.musicwin.windowFileName.replaceFirst("\\.cmme\\.xml","-incipit.JPG");
		let saveFile:File = new File(defaultImgName);
		PartsWin.incipitImageFileChooser.setSelectedFile(saveFile);
		let saveResponse:number = PartsWin.incipitImageFileChooser.showSaveDialog(this);
		if( saveResponse == JFileChooser.APPROVE_OPTION)
			try
			{
				let savefile:File = PartsWin.incipitImageFileChooser.getSelectedFile();
				if( savefile.exists())
					{
						let confirm_option:number = JOptionPane.showConfirmDialog(this,"Overwrite " + savefile.getName() + "?","File already exists",JOptionPane.YES_NO_OPTION,JOptionPane.WARNING_MESSAGE);
						if( confirm_option == JOptionPane.NO_OPTION)
							return;

					}

				let fn:string = savefile.getCanonicalPath();
				if( ! fn.matches(".*\\.[Jj][Pp][Gg]"))
					{
						fn = fn.concat(".JPG");
						savefile = new File(fn);
					}

				ImageIO.write(this.iView.createBufferedImage(),"jpg",savefile);
			}
			catch( e)
			{
				if( e instanceof Exception)
					{
						System.err.println("Error creating " + PartsWin.incipitImageFileChooser.getSelectedFile().getName());
					}

				else
					throw e;

			}

	}

	/* overwrite existing file? */
	/* save */
	/*------------------------------------------------------------------------
Method:  void openwin()
Purpose: Make window appear in front
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public openwin_1():void
	{
		this.setVisible(true);
		this.toFront();
		this.win_visible = true;
	}

	/*------------------------------------------------------------------------
Method:  void closewin()
Purpose: Hide window
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public closewin_3():void
	{
		this.win_visible = false;
		let wl:WindowListener[]= this.getListeners("WindowListener");
		for(
		let i:number = 0;i < wl.length;i ++)
		this.removeWindowListener(wl[i]);
		if( this.generateImageButton != null)
			this.generateImageButton.removeActionListener(this);

		this.dispose();
	}

	/* unregister listeners */
	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getRenderLists():ArrayList<RenderList>[]
	{
		return this.renderedVoices;
	}
}

export class PartsSizeParams
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static defaultSTAFFSCALE:number = 10;
	public static defaultCANVASXSIZE:number = 1000;
	public static defaultCANVASYSCALE:number =(( PartsSizeParams.defaultSTAFFSCALE * 10) | 0);
	/* amount of vertical space per staff */
	public static defaultXMARGIN:number = 20;
	public static defaultYMARGIN:number = 20;
	/* margins of drawing space */
	public static defaultYSTAFFSTART:number =(( PartsSizeParams.defaultYMARGIN +(( PartsSizeParams.defaultSTAFFSCALE * 3) | 0)) | 0);
	/* top margin for staff drawing */
	public static defaultSTAFFXSIZE:number =(( PartsSizeParams.defaultCANVASXSIZE -(( PartsSizeParams.defaultXMARGIN * 2) | 0)) | 0);
	static defaultVIEWSCALE:number = 0.75;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public STAFFSCALE:number;
	public CANVASXSIZE:number;
	public CANVASYSCALE:number;
	public XMARGIN:number;
	public YMARGIN:number;
	public YSTAFFSTART:number;
	public STAFFXSIZE:number;
	public VIEWSCALE:number;
	public canvasSize:Dimension;
	public musicGfx:MusicFont;

	public static new0(vs:number,staves:ArrayList<RenderList>):PartsSizeParams
	{
		let _new0:PartsSizeParams = new PartsSizeParams;
		PartsSizeParams.set0(_new0,vs,staves);
		return _new0;
	}

	public static set0(new0:PartsSizeParams,vs:number,staves:ArrayList<RenderList>):void
	{
		new0.VIEWSCALE = vs;
		new0.STAFFSCALE = vs *<number> PartsSizeParams.defaultSTAFFSCALE;
		new0.CANVASXSIZE = vs *<number> PartsSizeParams.defaultCANVASXSIZE;
		new0.CANVASYSCALE = vs *<number> PartsSizeParams.defaultCANVASYSCALE;
		new0.XMARGIN = vs *<number> PartsSizeParams.defaultXMARGIN;
		new0.YMARGIN = vs *<number> PartsSizeParams.defaultYMARGIN;
		new0.YSTAFFSTART = vs *<number> PartsSizeParams.defaultYSTAFFSTART;
		new0.STAFFXSIZE = vs *<number> PartsSizeParams.defaultSTAFFXSIZE;
		if( staves != null && staves.size() == 1)
			{
				new0.STAFFXSIZE = staves.get(0).totalxsize * vs;
				new0.CANVASXSIZE = 2 * new0.XMARGIN + new0.STAFFXSIZE;
			}

		let numStaves:number =( staves == null) ? 0:staves.size();
		new0.musicGfx = MusicFont.new1(new0.VIEWSCALE);
		new0.canvasSize = new Dimension(Math.round(new0.CANVASXSIZE),Math.round(new0.YSTAFFSTART + new0.CANVASYSCALE * numStaves));
	}

	public static new1(vs:number):PartsSizeParams
	{
		let _new1:PartsSizeParams = new PartsSizeParams;
		PartsSizeParams.set1(_new1,vs);
		return _new1;
	}

	public static set1(new1:PartsSizeParams,vs:number):void
	{
		PartsSizeParams.set0(new1,vs,null);
	}
}

/*------------------------------------------------------------------------
Class:   VoicePartView
Extends: JComponent
Purpose: Canvas for displaying one voice part in original notation
------------------------------------------------------------------------*/
export class VoicePartView extends JComponent
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static defaultSTAFFSCALE:number = PartsSizeParams.defaultSTAFFSCALE;
	public static defaultSTAFFXSIZE:number = PartsSizeParams.defaultSTAFFXSIZE;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	sizeParams:PartsSizeParams;
	painter:PartPainter;
	/* music data */
	renderer:PartRenderer;
	renderedStaves:ArrayList<RenderList>;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: VoicePartView(Voice voiceinfo,OptionSet os,boolean pp)
Purpose:     Initialize canvas and render music
Parameters:
  Input:  Voice voiceinfo - voice/event data
          OptionSet os    - parent window's rendering options
          boolean pp      - whether to use 'print preview' mode
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(voiceinfo:Voice,os:OptionSet,pp:boolean)
	{
		super();
		this.renderer = new PartRenderer(voiceinfo,VoicePartView.defaultSTAFFXSIZE,pp);
		this.renderedStaves = this.renderer.getRenderedData();
		this.sizeParams = PartsSizeParams.new0(PartsSizeParams.defaultVIEWSCALE *<number> os.getVIEWSCALE(),this.renderedStaves);
		this.painter = new PartPainter(voiceinfo,this.renderedStaves,this.sizeParams,pp);
		this.setPreferredSize(this.sizeParams.canvasSize);
	}

	/* create music rendering information */
	/* set up graphics */
	/*------------------------------------------------------------------------
Method:    void paintComponent(Graphics g)
Overrides: javax.swing.JComponent.paintComponent
Purpose:   Repaint area
Parameters:
  Input:  Graphics g - graphical context
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public paintComponent(g:Graphics):void
	{
		this.painter.draw(g,0,0);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getRenderedData():ArrayList<RenderList>
	{
		return this.renderedStaves;
	}
}

/*------------------------------------------------------------------------
Class:   IncipitView
Extends: JComponent
Purpose: Canvas for displaying all incipits together
------------------------------------------------------------------------*/
export class IncipitView extends JComponent
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	static defaultVIEWSCALE:number = 0.8;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	/* ridiculous array of rendered voices (arrays of staves); no type-safe
     generic array creation (ArrayList<T>[]) */
	renderedVoices:ArrayList<ArrayList<RenderList>>;
	/* graphics data */
	public sizeParams:PartsSizeParams;
	painter:PartPainter[];
	nameHeight:number;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: IncipitView(PieceData musicData,OptionSet os)
Purpose:     Initialize canvas and render music
Parameters:
  Input:  PieceData musicData - event data for all voices
          OptionSet os        - parent window's rendering options
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(musicData:PieceData,os:OptionSet)
	{
		super();
		let numVoices:number = musicData.getVoiceData().length;
		let totalNumStaves:number = 0;
		let cury:number = 0;
		let maxx:number = 0;
		this.renderedVoices = new ArrayList<ArrayList<RenderList>>();
		for(
		let i:number = 0;i < numVoices;i ++)
		{
			this.renderedVoices.add(new PartRenderer(musicData.getVoiceData()[i],PartsSizeParams.defaultSTAFFXSIZE,true).getRenderedData());
			totalNumStaves += this.renderedVoices.get(i).size();
		}
		PartRenderer.incipitJustify(this.renderedVoices);
		for(
		let i:number = 0;i < numVoices;i ++)
		if( this.renderedVoices.get(i).get(0).totalxsize > maxx)
			maxx = this.renderedVoices.get(i).get(0).totalxsize;

		let numColumns:number =( numVoices > 1) ? 2:1;
		let numRows:number =<number> Math.round(Math.ceil((<number> numVoices) / 2));
		this.sizeParams = PartsSizeParams.new1(<number>( IncipitView.defaultVIEWSCALE));
		this.sizeParams.STAFFXSIZE = maxx * this.sizeParams.VIEWSCALE;
		this.nameHeight = this.sizeParams.musicGfx.displayTextFontMetrics.getHeight();
		let cs:Dimension = new Dimension(Math.round(( this.sizeParams.STAFFXSIZE + this.nameHeight) * numColumns + this.sizeParams.XMARGIN *((( numColumns + 2) | 0))),Math.round(((( numRows + 1) | 0)) * this.sizeParams.YSTAFFSTART + numRows * this.sizeParams.CANVASYSCALE));
		this.sizeParams.canvasSize = cs;
		this.setPreferredSize(this.sizeParams.canvasSize);
		this.painter = Array(numVoices);
		for(
		let i:number = 0;i < numVoices;i ++)
		this.painter[i]= new PartPainter(musicData.getVoiceData()[i],this.renderedVoices.get(i),this.sizeParams,true);
	}

	/* render music */
	//*os.getVIEWSCALE()));
	/*------------------------------------------------------------------------
Method:  BufferedImage createBufferedImage()
Purpose: Create image object displaying music in incipit layout
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public createBufferedImage():BufferedImage
	{
		let incImg:BufferedImage = new BufferedImage(this.sizeParams.canvasSize.width,this.sizeParams.canvasSize.height,BufferedImage.TYPE_INT_RGB);
		let g:Graphics = incImg.createGraphics();
		g.setColor(Color.white);
		g.fillRect(0,0,(( this.sizeParams.canvasSize.width + 1) | 0),(( this.sizeParams.canvasSize.height + 1) | 0));
		this.draw(g);
		return incImg;
	}

	/*------------------------------------------------------------------------
Method:    void paintComponent(Graphics g)
Overrides: javax.swing.JComponent.paintComponent
Purpose:   Repaint area
Parameters:
  Input:  Graphics g - graphical context
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public paintComponent(g:Graphics):void
	{
		this.draw(g);
	}

	/*------------------------------------------------------------------------
Method:  void draw(Graphics g)
Purpose: Draw incipit into any graphical context
Parameters:
  Input:  Graphics g - graphical context
  Output: -
  Return: -
------------------------------------------------------------------------*/
	draw(g:Graphics):void
	{
		for(
		let i:number = 0;i < this.painter.length;i ++)
		this.painter[i].draw(g,( i % 2) *( this.sizeParams.XMARGIN * 2 + this.nameHeight + this.sizeParams.STAFFXSIZE),this.sizeParams.YSTAFFSTART / 2 +((( i / 2) | 0)) *( this.sizeParams.YSTAFFSTART + this.sizeParams.CANVASYSCALE));
	}
}

/*------------------------------------------------------------------------
Class:   PartPainter
Extends: -
Purpose: Paints one unscored voice part into a given graphical context
------------------------------------------------------------------------*/
export class PartPainter
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	voiceinfo:Voice;
	staves:ArrayList<RenderList>;
	sizeParams:PartsSizeParams;
	printPreview:boolean;
	incipitScore:boolean;
	/*------------------------------------------------------------------------
Constructor: PartPainter(Voice voiceinfo,ArrayList<RenderList> staves,
                         PartsSizeParams psp,boolean pp)
Purpose:     Initialize canvas and render music
Parameters:
  Input:  Voice voiceinfo              - voice data
          ArrayList<RenderList> staves - rendered event placement information
          PartsSizeParams psp          - size/spacing/font information
          boolean pp                   - whether to use 'print preview' mode
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(voiceinfo:Voice,staves:ArrayList<RenderList>,psp:PartsSizeParams,pp:boolean)
	{
		this.voiceinfo = voiceinfo;
		this.staves = staves;
		this.sizeParams = psp;
		this.printPreview = pp;
		this.incipitScore = voiceinfo.getGeneralData().isIncipitScore();
	}

	/*------------------------------------------------------------------------
Method:  void draw(Graphics g)
Purpose: Draw area
Parameters:
  Input:  Graphics g - graphical context
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public draw(g1d:Graphics,startX:number,startY:number):void
	{
		let g:Graphics2D =<Graphics2D> g1d;
		let bounds:Rectangle = g.getClipBounds();
		let XMARGIN:number = this.sizeParams.XMARGIN;
		if( this.printPreview)
			{
				g.setColor(Color.black);
				g.setFont(this.sizeParams.musicGfx.displayTextFont);
				let vn:string = this.voiceinfo.getName();
				let fmetrics:FontMetrics = this.sizeParams.musicGfx.displayTextFontMetrics;
				let xs:number = fmetrics.stringWidth(vn);
				let ys:number = fmetrics.getHeight();
				XMARGIN += ys;
				let saveTransform:AffineTransform = g.getTransform();
				g.rotate(Math.toRadians(- 90));
				g.drawString(vn,0 - startY - this.sizeParams.YSTAFFSTART - this.sizeParams.STAFFSCALE * 2 - xs / 2,startX + XMARGIN - ys / 2);
				g.setTransform(saveTransform);
			}

		else
			{
				g.setColor(Color.red);
				g.setFont(this.sizeParams.musicGfx.displayTextLargeFont);
				g.drawString(this.voiceinfo.getName(),startX + XMARGIN,startY + this.sizeParams.YMARGIN);
			}

		g.setColor(Color.black);
		let cury:number = startY + this.sizeParams.YSTAFFSTART;
		for(
		let i:Iterator<RenderList> = this.staves.iterator();i.hasNext();)
		{
			let curstaff:StaffEventData =<StaffEventData> i.next();
			this.drawStaff_1(g,startX + XMARGIN,cury,5,(<number> curstaff.totalxsize) * this.sizeParams.VIEWSCALE);
			for(
			let ei:number = 0;ei < curstaff.size();ei ++)
			{
				let e:RenderedEvent = curstaff.getEvent(ei);
				if( e.isdisplayed())
					{
						e.draw_2(g,this.sizeParams.musicGfx,null,startX + XMARGIN +(<number> e.getxloc()) * this.sizeParams.VIEWSCALE,cury,this.sizeParams.VIEWSCALE);
						if( e.getEvent_1().hasEventType_1(Event.EVENT_NOTE))
							{
								let ne:NoteEvent =<NoteEvent>( e.getEvent_1().getFirstEventOfType_1(Event.EVENT_NOTE));
								if( ne.getTieType() != NoteEvent.TIE_NONE)
									{
										let x1:number = startX + XMARGIN +(<number> e.getxloc()) * this.sizeParams.VIEWSCALE;
										let x2:number = x1 +( MusicFont.CONNECTION_SCREEN_LIG_RECTA) * this.sizeParams.VIEWSCALE;
										let e2i:number = curstaff.getNextEventWithType(Event.EVENT_NOTE,(( ei + 1) | 0),1);
										if( e2i != - 1)
											x2 = startX + XMARGIN +(<number> curstaff.getEvent(e2i).getxloc()) * this.sizeParams.VIEWSCALE;

										ViewCanvas.drawTieOnCanvas_1(g,ne.getTieType(),x1,x2,ViewCanvas.calcTieY_1(e,cury,<number>( this.sizeParams.STAFFSCALE / this.sizeParams.VIEWSCALE),<number>( this.sizeParams.STAFFSCALE /( 2 * this.sizeParams.VIEWSCALE)),this.sizeParams.VIEWSCALE),startX,startX + this.sizeParams.STAFFXSIZE,this.sizeParams.VIEWSCALE);
									}

							}

					}

			}
			cury += this.sizeParams.CANVASYSCALE;
		}
	}

	/* initialize drawing context */
	// g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,RenderingHints.VALUE_ANTIALIAS_ON); //CHANGE
	/* write voice information */
	/* print voice name sideways at left */
	/* draw music */
	/* tie */
	/*------------------------------------------------------------------------
Method:  void drawStaff(Graphics g,float xloc,float yloc,int numlines,float xsize)
Purpose: Draw staff at specified location
Parameters:
  Input:  Graphics g      - graphical context
          float xloc,yloc - location for top/left of staff
          int numlines    - number of lines for staff
          float xsize     - width of staff
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawStaff_1(g:Graphics,xloc:number,yloc:number,numlines:number,xsize:number):void
	{
		if( xsize > this.sizeParams.STAFFXSIZE - 10 && xsize < this.sizeParams.STAFFXSIZE)
			xsize = this.sizeParams.STAFFXSIZE;

		g.setColor(Color.black);
		for(
		let i:number = 0;i < numlines;i ++)
		g.drawLine(Math.round(xloc),Math.round(yloc + i * this.sizeParams.STAFFSCALE),Math.round(xloc + xsize - 1),Math.round(yloc + i * this.sizeParams.STAFFSCALE));
		if( this.printPreview && this.incipitScore && this.voiceinfo.hasFinalisSection())
			g.drawLine(Math.round(xloc + xsize - 1),Math.round(yloc),Math.round(xloc + xsize - 1),Math.round(yloc +((( numlines - 1) | 0)) * this.sizeParams.STAFFSCALE));

	}

	/* ending barline */
	drawStaff_2(g:Graphics,xloc:number,yloc:number,numlines:number):void
	{
		this.drawStaff_1(g,xloc,yloc,numlines,this.sizeParams.STAFFXSIZE);
	}
}
