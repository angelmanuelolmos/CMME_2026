
import {JToggleButton } from './JToggleButton'; 
export class JRadioButton extends JToggleButton 
{ 
	public constructor (arg0: string ); 
	public constructor (arg0: string ,arg1: boolean ); 
	public constructor (arg0: any ,arg1: any = undefined ) 
	{ 
		super("button", ["JRadioButton"]);
		
		this.setText(arg0);

		if( arguments.length == 2 )
			this.setSelected(arg1 as boolean);

	} 
	
	
} 

