


import {AWTEvent } from '../AWTEvent'; 
import { Component } from '../Component';
export class ItemEvent extends AWTEvent 
{ 
	public static SELECTED:number = 1;
	public static DESELECTED:number = 0;
	public static ITEM_STATE_CHANGED:number = 3;

	public constructor(source:Component, id:number, item:any, stateChange:number)
	{
		super(source);
	}

	public getItemSelectable ( ): any 
	{ 
		return this.getSource();
	} 
	
	
} 

