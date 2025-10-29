
import { TextDeleteDialog } from './TextDeleteDialog';
import { OriginalTextDeleteDialog } from './OriginalTextDeleteDialog';
import { NoteInfoPanel } from './NoteInfoPanel';
import { ModernTextDeleteDialog } from './ModernTextDeleteDialog';
import { MensurationChooser } from './MensurationChooser';
import { GeneralInfoFrame } from './GeneralInfoFrame';
import { EditingOptionsFrame } from './EditingOptionsFrame';
import { ColorationChooser } from './ColorationChooser';
import { Color } from '../java/awt/Color';
import { Graphics2D } from '../java/awt/Graphics2D';
import { BufferedImage } from '../java/awt/image/BufferedImage';
import { Iterator } from '../java/util/Iterator';
import { JPanel } from '../javax/swing/JPanel';
import { ImageIcon } from '../javax/swing/ImageIcon';
import { JLabel } from '../javax/swing/JLabel';
import { MusicFont } from '../Gfx/MusicFont';
import { Clef } from '../DataStruct/Clef';
import { ModernKeySignature } from '../DataStruct/ModernKeySignature';
import { ModernKeySignatureElement } from '../DataStruct/ModernKeySignatureElement';

export class ModernKeySigPanel extends JPanel
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	/* standard canvas sizes */
	static XSMALL:number = 200;
	static YSMALL:number = 200;
	static XLARGE:number = 500;
	static YLARGE:number = 300;
	static STAFFPOSSCALE:number = 5;
	static STAFFSCALE:number =(( ModernKeySigPanel.STAFFPOSSCALE * 2) | 0);
	static YTOP:number =(((( ModernKeySigPanel.YSMALL / 2) | 0) -(( ModernKeySigPanel.STAFFSCALE * 2) | 0)) | 0);
	static XMARGIN:number = 15;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	musicGfx:MusicFont;
	sigPanel:JPanel;
	sigLabel:JLabel;
	sigIcon:ImageIcon;
	sigImage:BufferedImage;
	sigG:Graphics2D;
	/*------------------------------------------------------------------------
Constructor: ModernKeySigPanel(MusicFont mf)
Purpose:     Initialize and lay out modern key signature panel
Parameters:
  Input:  MusicFont mf - music font (for drawing music)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(mf:MusicFont)
	{
		super();
		this.musicGfx = mf;
		this.sigImage = new BufferedImage(ModernKeySigPanel.XSMALL,ModernKeySigPanel.YSMALL,BufferedImage.TYPE_INT_ARGB);
		this.sigG = this.sigImage.createGraphics();
		this.sigIcon = new ImageIcon(this.sigImage);
		this.sigLabel = new JLabel(this.sigIcon);
		this.sigPanel = new JPanel();
		this.sigPanel.add(this.sigLabel);
		this.add(this.sigPanel);
	}
	/*------------------------------------------------------------------------
Method:  void setInfo(ModernKeySignature sigInfo)
Purpose: Set values for GUI
Parameters:
  Input:  ModernKeySignature sigInfo - data for GUI
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static ClearColor:Color = new Color(0,true);

	public setInfo_1(sigInfo:ModernKeySignature):void
	{
		let curx:number = ModernKeySigPanel.XMARGIN;
		this.sigG.setBackground(ModernKeySigPanel.ClearColor);
		this.sigG.clearRect(0,0,ModernKeySigPanel.XSMALL,ModernKeySigPanel.YSMALL);
		this.sigG.setColor(Color.black);
		this.drawStaff_4(this.sigG,0,ModernKeySigPanel.YTOP,ModernKeySigPanel.XSMALL,ModernKeySigPanel.STAFFSCALE,5);
		this.musicGfx.drawGlyph(this.sigG,(( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNG) | 0),curx,(((( ModernKeySigPanel.YTOP +(( ModernKeySigPanel.STAFFSCALE * 4) | 0)) | 0) -(( ModernKeySigPanel.STAFFPOSSCALE * 2) | 0)) | 0),Color.black);
		curx += this.musicGfx.getGlyphWidth((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNG) | 0));
		for(
		let i:Iterator<ModernKeySignatureElement> = sigInfo.iterator();i.hasNext();)
		{
			let kse:ModernKeySignatureElement =<ModernKeySignatureElement> i.next();
			for(
			let ai:number = 0;ai < kse.accidental.numAcc;ai ++)
			{
				this.musicGfx.drawGlyph(this.sigG,(((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNFlat) | 0) + kse.accidental.accType) | 0),curx,(((( ModernKeySigPanel.YTOP +(( ModernKeySigPanel.STAFFSCALE * 4) | 0)) | 0) -(( ModernKeySigPanel.STAFFPOSSCALE *((( 3 + kse.calcAOffset()) | 0))) | 0)) | 0),Color.black);
				curx += this.musicGfx.getGlyphWidth((((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNFlat) | 0) + kse.accidental.accType) | 0)) + MusicFont.CONNECTION_SCREEN_MODACC_DBLFLAT;
			}
		}
		this.sigIcon.setImage(this.sigImage);
		this.sigLabel.setIcon(this.sigIcon);
	}

	/* draw staff and clef */
	/* draw individual accidentals in signature */
	/*------------------------------------------------------------------------
Method:  void drawStaff(Graphics2D g,int xloc,int yloc,int xsize,int yscale,int numlines)
Purpose: Draw staff at specified location
Parameters:
  Input:  Graphics2D g - graphical context
          int xloc     - x location for left end of staff
          int yloc     - y location for top of staff
          int xsize    - x size of staf
          int yscale   - vertical size of one staff space
          int numlines - number of lines for staff
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawStaff_4(g:Graphics2D,xloc:number,yloc:number,xsize:number,yscale:number,numlines:number):void
	{
		for(
		let i:number = 0;i < numlines;i ++)
		g.drawLine(xloc,(( yloc +(( i * yscale) | 0)) | 0),(((( xloc + xsize) | 0) - 1) | 0),(( yloc +(( i * yscale) | 0)) | 0));
	}
}
