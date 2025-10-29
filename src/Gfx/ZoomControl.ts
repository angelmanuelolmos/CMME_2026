
import { Exception } from '../java/lang/Exception';
import { System } from '../java/lang/System';
import { Integer } from '../java/lang/Integer';
import { NoteShapeStyleListener } from './MusicWin';
import { BarlineStyleListener } from './MusicWin';
import { ViewSizeListener } from './MusicWin';
import { PDFFileFilter } from './MusicWin';
import { HTMLFileFilter } from './MusicWin';
import { XMLFileFilter } from './MusicWin';
import { MIDIFileFilter } from './MusicWin';
import { CMMEFileFilter } from './MusicWin';
import { MusicWin } from './MusicWin';
import { GridBagConstraints } from '../java/awt/GridBagConstraints';
import { GridBagLayout } from '../java/awt/GridBagLayout';
import { Insets } from '../java/awt/Insets';
import { ActionListener } from '../java/awt/event/ActionListener';
import { URL } from '../java/net/URL';
import { MalformedURLException } from '../java/net/MalformedURLException';
import { JPanel } from '../javax/swing/JPanel';
import { ImageIcon } from '../javax/swing/ImageIcon';
import { JButton } from '../javax/swing/JButton';
import { JTextField } from '../javax/swing/JTextField';

export class ZoomControl extends JPanel
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static DEFAULT_MINSIZE:number = 10;
	public static DEFAULT_MAXSIZE:number = 400;
	public static DEFAULT_SIZES:number[]=[200,175,150,125,100,75,50];
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public zoomOutButton:JButton;
	public zoomInButton:JButton;
	public viewSizeField:JTextField = null;
	listener:ActionListener;
	curViewSize:number;
	minSize:number;
	maxSize:number;
	sizes:number[];

	public static new0_5(startSize:number,listener:ActionListener):ZoomControl
	{
		let _new0:ZoomControl = new ZoomControl;
		ZoomControl.set0_5(_new0,startSize,listener);
		return _new0;
	}

	public static set0_5(new0:ZoomControl,startSize:number,listener:ActionListener):void
	{
		ZoomControl.set1_5(new0,startSize,listener,ZoomControl.DEFAULT_MINSIZE,ZoomControl.DEFAULT_MAXSIZE,ZoomControl.DEFAULT_SIZES);
	}

	public static new1_5(startSize:number,listener:ActionListener,minSize:number,maxSize:number,sizes:number[]):ZoomControl
	{
		let _new1:ZoomControl = new ZoomControl;
		ZoomControl.set1_5(_new1,startSize,listener,minSize,maxSize,sizes);
		return _new1;
	}

	public static set1_5(new1:ZoomControl,startSize:number,listener:ActionListener,minSize:number,maxSize:number,sizes:number[]):void
	{
		new1.listener = listener;
		new1.curViewSize = startSize;
		new1.minSize = minSize;
		new1.maxSize = maxSize;
		new1.sizes = new1.insertIntoSizes(sizes,new1.curViewSize);
		new1.setLayout(new GridBagLayout());
		let zcc:GridBagConstraints = new GridBagConstraints();
		zcc.anchor = GridBagConstraints.WEST;
		zcc.weightx = 0;
		new1.viewSizeField = new JTextField(new1.curViewSize + "%",3);
		try
		{
			new1.zoomOutButton = new JButton(new ImageIcon(new URL(MusicWin.BaseDataURL + "imgs/zoomout-button.gif")));
			new1.zoomInButton = new JButton(new ImageIcon(new URL(MusicWin.BaseDataURL + "imgs/zoomin-button.gif")));
		}
		catch( e)
		{
			if( e instanceof MalformedURLException)
				{
					System.err.println("Error loading Zoom-Control icons: " + e);
				}

			else
				throw e;

		}
		new1.zoomOutButton.setFocusable(false);
		new1.zoomInButton.setFocusable(false);
		new1.zoomOutButton.setMargin(new Insets(1,1,1,1));
		new1.zoomInButton.setMargin(new Insets(1,1,1,1));
		new1.zoomOutButton.setToolTipText("Zoom out");
		new1.zoomInButton.setToolTipText("Zoom in");
		new1.addListeners_2();
		zcc.weightx = 0;
		zcc.gridx = 0;
		zcc.gridy = 0;
		new1.add(new1.zoomOutButton,zcc);
		zcc.weightx = 0;
		zcc.gridx ++;
		new1.add(new1.viewSizeField,zcc);
		zcc.weightx = 1;
		zcc.gridx ++;
		new1.add(new1.zoomInButton,zcc);
	}

	/*------------------------------------------------------------------------
Method:  void addListeners()
Purpose: Register GUI listeners
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	addListeners_2():void
	{
		this.viewSizeField.addActionListener(this.listener);
		this.zoomInButton.addActionListener(this.listener);
		this.zoomOutButton.addActionListener(this.listener);
	}

	/*------------------------------------------------------------------------
Method:  void removeListeners()
Purpose: Unregister GUI listeners (should match addListeners)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public removeListeners_2():void
	{
		this.viewSizeField.removeActionListener(this.listener);
		this.zoomInButton.removeActionListener(this.listener);
		this.zoomOutButton.removeActionListener(this.listener);
	}

	/*------------------------------------------------------------------------
Method:  void setViewSize|viewSizeFieldAction|zoomIn|zoomOut()
Purpose: Functions to control GUI
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public viewSizeFieldAction():number
	{
		let newVS:number;
		try
		{
			let intText:string = this.viewSizeField.getText().replaceAll("\\D","");
			newVS =( new Integer(intText)).intValue();
			if( newVS < this.minSize)
				newVS = this.minSize;
			else
				if( newVS > this.maxSize)
					newVS = this.maxSize;

		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					newVS = this.curViewSize;
				}

			else
				throw e;

		}
		this.curViewSize = newVS;
		return this.curViewSize;
	}

	public zoomOut_1():number
	{
		if( this.curViewSize > this.sizes[((( this.sizes.length - 1) | 0))])
			{
				let si:number = this.getLesserSize(this.curViewSize);
				this.setViewSize_1(this.sizes[si]);
			}

		return this.curViewSize;
	}

	public zoomIn_1():number
	{
		if( this.curViewSize < this.sizes[0])
			{
				let si:number = this.getGreaterSize(this.curViewSize);
				this.setViewSize_1(this.sizes[si]);
			}

		return this.curViewSize;
	}

	public setViewSize_1(ns:number):void
	{
		this.curViewSize = ns;
		if( this.viewSizeField != null)
			this.viewSizeField.setText(this.curViewSize + "%");

	}

	/* get next largest or smallest number in array of available sizes */
	getGreaterSize(vs:number):number
	{
		for(
		let i:number =(( this.sizes.length - 1) | 0);i >= 0;i --)
		if( this.sizes[i]> vs)
			return i;

		return - 1;
	}

	getLesserSize(vs:number):number
	{
		for(
		let i:number = 0;i < this.sizes.length;i ++)
		if( this.sizes[i]< vs)
			return i;

		return - 1;
	}

	getSizeIndex(vs:number):number
	{
		for(
		let i:number = 0;i < this.sizes.length;i ++)
		if( this.sizes[i]== vs)
			return i;

		return - 1;
	}

	insertIntoSizes(oldSizes:number[],newNum:number):number[]
	{
		let curIndex:number = - 1;
		for(
		let i:number = 0;i < oldSizes.length;i ++)
		if( oldSizes[i]== newNum)
			{
				curIndex = i;
				break;
			}

		if( curIndex != - 1)
			return oldSizes;

		let newSizes:number[]= Array(((( oldSizes.length + 1) | 0)));
		let vi:number = 0;
		for(
		let i:number = 0;i < oldSizes.length;i ++)
		{
			if( vi == i && oldSizes[i]< newNum)
				{
					newSizes[vi]= newNum;
					vi ++;
				}

			newSizes[( vi ++)]= oldSizes[i];
		}
		if( vi <= oldSizes.length)
			newSizes[vi]= newNum;

		return newSizes;
	}
}
