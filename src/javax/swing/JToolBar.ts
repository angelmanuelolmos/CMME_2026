
import {SwingConstants } from './SwingConstants'; 
import {JComponent } from './JComponent'; 
export class JToolBar extends JComponent implements SwingConstants
{ 
	public constructor ( ) 
	{ 
		super("div", ["JToolBar"]);
		
        this._getHTMLElement().style.display = "flex";
        this._getHTMLElement().style.gap = "5px";
        this._getHTMLElement().style.padding = "5px";
        this._getHTMLElement().style.background = "#ddd";
	} 

	private items: JComponent[] = [];
	

	public setRollover (arg0: boolean ): void 
	{ 
		
	} 
	
	public addSeparator ( ): void 
	{ 
		/*
		const separator = document.createElement("div");
		separator.classList.add("separator");
        separator.style.width = "1px";
        separator.style.background = "#aaa";
        separator.style.margin = "0 5px";
        this._getHTMLElement().appendChild(separator);*/
	} 
	
	public setFloatable (arg0: boolean ): void 
	{ 
		
	} 
	
	
} 

