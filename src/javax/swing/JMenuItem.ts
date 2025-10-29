
import {KeyStroke } from './KeyStroke'; 

import {MenuElement } from './MenuElement'; 

import {AbstractButton } from './AbstractButton'; 
import { JMenu } from './JMenu';
export class JMenuItem extends AbstractButton implements  MenuElement 
{ 
    constructor(label:string, tag:string, arrClass:Array<string>)
	constructor(label: string)
    constructor(label:string, a:any = undefined, b:any = undefined)
	{
        super(a!== undefined? a :"button", b!==undefined? (b as Array<string>).concat(["JMenuItem"]) : ["JMenuItem"]);
        
        this.setText(label);
        this._getHTMLElement().style.cursor = "pointer";
        this._getHTMLElement().style.padding = "5px 10px";
        this._getHTMLElement().style.border = "1px solid transparent";

        this._getHTMLElement().addEventListener("mouseenter", () => {
            this._getHTMLElement().style.backgroundColor = "#ddd";
        });
        this._getHTMLElement().addEventListener("mouseleave", () => {
            this._getHTMLElement().style.backgroundColor = "";
        });
    }
	
	public setAccelerator (arg0: KeyStroke ): void 
	{ 
		
	} 

    protected clickPerformed():void
    {
        if( (this as any).parentMenu !== undefined ) 
            (this as any).parentMenu.childMenuClicked();
    }


} 

/*
	public setEnabled (arg0: boolean ): void 
	{ 
		throw new Error("Not Implemented"); 
	} */

	//protected subMenu?: JMenu;