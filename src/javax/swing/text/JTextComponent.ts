
import {Document } from './Document'; 

import {Scrollable } from '../Scrollable'; 
import {JComponent } from '../JComponent'; 
import { DefaultStyledDocument } from './DefaultStyledDocument';
export abstract class JTextComponent extends JComponent implements Scrollable 
{ 
	constructor(tag:string, arrClass:Array<string>)
    constructor()
	constructor(a:any = undefined, b:any = undefined)
	{
        super(a === undefined? "input" : a, b === undefined? ["JTextComponent"] : b.concat(["JTextComponent"]));

    }

	_textElement():HTMLInputElement |HTMLTextAreaElement
	{
		return this._getHTMLElement() as HTMLInputElement|HTMLTextAreaElement;
	}

	public getText ( ): string 
	{ 
		return this._textElement().value;
	} 
	
	public setEditable (arg0: boolean ): void 
	{ 
		this._textElement().readOnly = !arg0;
	} 
	
	public setText (arg0: string ): void 
	{ 
		this._textElement().value = arg0;
	} 
	
	private doc:DefaultStyledDocument = new DefaultStyledDocument();

	public getDocument():Document
	{
		return this.doc;
	}

	public setSelectionEnd(selectionEnd:number):void
	{
		this._textElement().selectionEnd = selectionEnd;
	}

	public setSelectionStart(selectionStart:number):void
	{
		this._textElement().selectionStart = selectionStart;
	}

	public setCaretPosition(position:number):void
	{
		const textElem = this._textElement();
		textElem.selectionStart = position;
		textElem.selectionEnd = position;
	}

	public getCaretPosition():number
	{
		return this._textElement().selectionStart;
	}
} 

