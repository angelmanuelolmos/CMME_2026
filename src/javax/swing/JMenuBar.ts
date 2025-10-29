
import {MenuElement } from './MenuElement'; 

import {JComponent } from './JComponent'; 
export class JMenuBar extends JComponent implements  MenuElement 
{ 
	
	//private menus: JMenu[] = [];

	constructor() {
		super("div", ["JMenuBar"]);
		
		this._getHTMLElement().style.display = "flex";
		this._getHTMLElement().style.background = "#ddd";
		this._getHTMLElement().style.padding = "5px";
	}

	/*public add(arg0: JMenu): JMenu {
		this.menus.push(arg0);
		this.element.appendChild(arg0.getHTMLElement());
		return arg0;
	}*/

	/*
	protected addImpl( comp:Component,  constraints:any, index:number):Component
	{
		this.menus.push(comp as JMenu);
		this.element.appendChild(comp.getHTMLElement());
		return comp;
	}*/
} 

