

import {AWTEvent } from '../AWTEvent'; 
import { Component } from '../Component';
export class ActionEvent extends AWTEvent 
{ 
	public constructor(actionCommand:string | null = null, source:Component)
	{
		super(source);
		this.actionCommand = actionCommand;
	}

	private actionCommand:string | null;

	public getActionCommand ( ): string 
	{ 
		return this.actionCommand;
	} 
	
	public static CTRL_MASK: number; 
	
} 

