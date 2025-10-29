

import {Color } from './Color'; 

import {Window } from './Window'; 
export class Dialog extends Window 
{ 
    public constructor(tag:string, arrClass:Array<string>)
    {
        super(tag, arrClass);

        this.setVisible(false);
    }

	private title: string = "";

    public setTitle(arg0: string): void {
        this.title = arg0;
        this._getHTMLElement().setAttribute("data-title", arg0);
    }

    public setBackground(arg0: Color): void {
        this._getHTMLElement().style.backgroundColor = arg0._str;
    }

    public setVisible(arg0: boolean): void {
        this._getHTMLElement().style.display = arg0 ? "table" : "none";
        this.toFront();
    }
	
	
} 

