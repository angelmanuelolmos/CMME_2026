
import { BorderFactory } from '../javax/swing/BorderFactory';
import { JFrame } from '../javax/swing/JFrame';
import { JProgressBar } from '../javax/swing/JProgressBar';
import { SwingConstants } from '../javax/swing/SwingConstants';
import { JLabel } from '../javax/swing/JLabel';
import { Component } from '../java/awt/Component';
import { Container } from '../java/awt/Container';
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   MessageWin
Extends: JFrame
Purpose: Handles a simple text window
------------------------------------------------------------------------*/
import { BorderLayout } from '../java/awt/BorderLayout';

export class MessageWin extends JFrame
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	progressBar:JProgressBar = null;

	public static new0_7(msg:string,parentWin:Component,pbar:boolean):MessageWin
	{
		let _new0:MessageWin = new MessageWin;
		MessageWin.set0_7(_new0,msg,parentWin,pbar);
		return _new0;
	}

	public static set0_7(new0:MessageWin,msg:string,parentWin:Component,pbar:boolean):void
	{
		let cp:Container = new0.getContentPane();
		new0.setTitle("CMME");
		cp.setLayout(new BorderLayout());
		let MsgLabel:JLabel = new JLabel(msg,SwingConstants.CENTER);
		MsgLabel.setFont(MsgLabel.getFont().deriveFont(<number> 14));
		MsgLabel.setBorder(BorderFactory.createEmptyBorder(10,10,10,10));
		cp.add(MsgLabel,"Center");
		if( pbar)
			{
				new0.progressBar = new JProgressBar(0,100);
				new0.progressBar.setValue(0);
				cp.add(new0.progressBar,"South");
			}

		new0.pack();
		new0.setLocationRelativeTo(parentWin);
		new0.setVisible(true);
		new0.toFront();
	}

	public static new1_7(msg:string,parentWin:Component):MessageWin
	{
		let _new1:MessageWin = new MessageWin;
		MessageWin.set1_7(_new1,msg,parentWin);
		return _new1;
	}

	public static set1_7(new1:MessageWin,msg:string,parentWin:Component):void
	{
		MessageWin.set0_7(new1,msg,parentWin,false);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getProgressBar():JProgressBar
	{
		return this.progressBar;
	}
}
