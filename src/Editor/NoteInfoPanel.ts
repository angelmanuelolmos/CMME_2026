
import { TextDeleteDialog } from './TextDeleteDialog';
import { OriginalTextDeleteDialog } from './OriginalTextDeleteDialog';
import { ModernTextDeleteDialog } from './ModernTextDeleteDialog';
import { ModernKeySigPanel } from './ModernKeySigPanel';
import { MensurationChooser } from './MensurationChooser';
import { GeneralInfoFrame } from './GeneralInfoFrame';
import { EditingOptionsFrame } from './EditingOptionsFrame';
import { ColorationChooser } from './ColorationChooser';
import { JPanel } from '../javax/swing/JPanel';
import { ImageIcon } from '../javax/swing/ImageIcon';
import { JLabel } from '../javax/swing/JLabel';
import { Color } from '../java/awt/Color';
import { Graphics2D } from '../java/awt/Graphics2D';
import { BufferedImage } from '../java/awt/image/BufferedImage';
import { MusicFont } from '../Gfx/MusicFont';
import { RenderedEvent } from '../Gfx/RenderedEvent';

export class NoteInfoPanel extends JPanel
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	/* standard note shape canvas sizes */
	static XSMALL:number = 200;
	static YSMALL:number = 200;
	static XLARGE:number = 500;
	static YLARGE:number = 300;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	musicGfx:MusicFont;
	shapePanel:JPanel;
	noteShapeLabel:JLabel;
	noteShapeIcon:ImageIcon;
	smallNoteShapeImage:BufferedImage;
	largeNoteShapeImage:BufferedImage;
	XlargeNoteShapeImage:BufferedImage;
	smallG:Graphics2D;
	largeG:Graphics2D;
	/*------------------------------------------------------------------------
Constructor: NoteInfoPanel(MusicFont mf)
Purpose:     Initialize and lay out note info panel
Parameters:
  Input:  MusicFont mf - music font (for drawing notes)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(mf:MusicFont)
	{
		super();
		this.musicGfx = mf;
		this.smallNoteShapeImage = new BufferedImage(NoteInfoPanel.XSMALL,NoteInfoPanel.YSMALL,BufferedImage.TYPE_INT_ARGB);
		this.smallG = this.smallNoteShapeImage.createGraphics();
		this.noteShapeIcon = new ImageIcon(this.smallNoteShapeImage);
		this.noteShapeLabel = new JLabel(this.noteShapeIcon);
		this.shapePanel = new JPanel();
		this.shapePanel.add(this.noteShapeLabel);
		this.add(this.shapePanel);
	}
	//smallG.setRenderingHint(RenderingHints.KEY_ANTIALIASING,RenderingHints.VALUE_ANTIALIAS_ON);//CHANGE
	/*------------------------------------------------------------------------
Method:  void setInfo(RenderedEvent rne)
Purpose: Set values for GUI
Parameters:
  Input:  RenderedEvent rne - data for GUI
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static ClearColor:Color = new Color(0,true);

	public setInfo_2(rne:RenderedEvent):void
	{
		this.smallG.setBackground(NoteInfoPanel.ClearColor);
		this.smallG.clearRect(0,0,NoteInfoPanel.XSMALL,NoteInfoPanel.YSMALL);
		this.smallG.setColor(Color.black);
		if( rne.getLigInfo().firstEventNum != - 1)
			rne.drawLig(this.smallG,this.musicGfx,this,5,100);
		else
			rne.draw_1(this.smallG,this.musicGfx,this,5,100);

		this.noteShapeIcon.setImage(this.smallNoteShapeImage);
		this.noteShapeLabel.setIcon(this.noteShapeIcon);
	}
}
