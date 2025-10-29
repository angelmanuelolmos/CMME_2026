
import {SwingConstants } from './SwingConstants'; 
import {JComponent } from './JComponent'; 
export class JProgressBar extends JComponent implements SwingConstants
{ 
	public constructor (arg0: number ,arg1: number ) 
	{ 
		super("div", ["JProgressBar"]);
		
	} 
	
	public setValue (value: number ): void 
	{ 
		this.value = value;
	} 

	public getValue():number
	{
		return this.value;
	}

	public getMaximum():number
	{
		return this.max;
	}

	public max:number;
	public min:number;
	public value:number;
	
	
} 

