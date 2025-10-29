
import {Component } from '../Component'; 
import {InputEvent } from './InputEvent'; 
export class MouseEvent extends InputEvent 
{ 
	public static MOUSE_CLICKED:number = 0;
	public static MOUSE_PRESSED:number = 1;
	public static MOUSE_RELEASED:number = 2;
	public static MOUSE_ENTERED:number = 3;
	public static MOUSE_EXITED:number = 4;

	public static MOUSE_DRAGGED:number = 5;
	public static MOUSE_MOVED:number = 6;

	public constructor(source:Component, id:number, when:number, modifiers:number, x:number, y:number, clickCount:number, popupTrgger:boolean)
	{
		super(source, modifiers);

		this.id = id;
		this.when = when;
		this.x = x;
		this.y = y;
		this.clickCount = clickCount;
		this.popupTrgger = popupTrgger;
	}

	id:number;
	when:number;
	x:number;
	y:number;
	clickCount:number;
	popupTrgger:boolean

	public getButton ( ): number 
	{ 
		return MouseEvent.BUTTON1;
	} 
	
	public getX ( ): number 
	{ 
		return this.x - this.getSource()._getHTMLElement().clientLeft;
	} 
	
	public getXOnScreen ( ): number 
	{ 
		return this.x;
	} 
	
	public getY ( ): number 
	{ 
		return this.y - this.getSource()._getHTMLElement().clientTop;
	} 
	
	public getYOnScreen ( ): number 
	{ 
		return this.y;
	} 
	
	public static BUTTON1: number = 1;
	public static BUTTON2: number = 2;
	public static BUTTON3: number = 3;
	
} 

