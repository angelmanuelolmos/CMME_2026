
import {Container } from '../../java/awt/Container'; 
import {RootPaneContainer } from './RootPaneContainer'; 

import {Applet } from '../../java/applet/Applet'; 
import { JPanel } from './JPanel';
export class JApplet extends Applet implements RootPaneContainer 
{ 
	public constructor()
	{
		super("div", ["JApplet"]);

		this.contentPane = new JPanel();

		this.add(this.contentPane);
	}

	public getContentPane ( ): Container 
	{ 
		return this.contentPane;
	} 

	private contentPane:JPanel;
	
	public getListeners (arg0: any ): any [ ] 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	
} 

