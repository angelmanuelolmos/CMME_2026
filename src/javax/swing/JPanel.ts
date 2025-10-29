
import {LayoutManager } from '../../java/awt/LayoutManager'; 

import {JComponent } from './JComponent'; 

export class JPanel extends JComponent 
{ 
	public constructor(layout:LayoutManager);
	public constructor ();
	public constructor(a:any = undefined)
	{ 
		super("div", ["JPanel"]);

		if( a !== undefined )
			this.setLayout(a);
	} 

	
	
	
	
} 

