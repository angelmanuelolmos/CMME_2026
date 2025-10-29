
import {Container } from '../../java/awt/Container'; 

import {Frame } from '../../java/awt/Frame'; 

import {RootPaneContainer } from './RootPaneContainer'; 
import {WindowConstants } from './WindowConstants'; 
import {Dialog } from '../../java/awt/Dialog'; 
import { JPanel } from './JPanel';
import { JFrame } from './JFrame';
import { isString } from '../../js';
export class JDialog extends Dialog implements WindowConstants, RootPaneContainer 
{ 
	private contentPane: Container;

    private titleBar:HTMLDivElement;
    private closeButton: HTMLButtonElement;

    constructor(arg0: Frame, arg1: boolean);
    constructor(arg0: Frame, arg1: string, arg2: boolean);
    constructor(arg0: any, arg1: any, arg2: any = undefined) {
        super("div", ["JDialog"]);


        this.titleBar = document.createElement('div');
        this.closeButton = document.createElement('button');
        JFrame._addTitleBarWithCloseButton(this, this.titleBar, this.closeButton, isString(arg1)? arg1 : "", ()=>this.closeWindow(), false);
        this._getHTMLElement().appendChild(this.titleBar);

        this.contentPane = new JPanel();
        this._getHTMLElement().appendChild(this.contentPane._getHTMLElement());
    }

    private closeWindow(): void {
        // Logic to hide or remove the window
        this._getHTMLElement().style.display = 'none'; // Hide the window

        // Optionally you could remove the window entirely from the DOM
         this._getHTMLElement().remove();
        
        // Or send a message, perform cleanup, etc.
        console.log('Window closed');
    }

    public getContentPane(): Container {
        return this.contentPane;
    }


    private operation:number;
    public setDefaultCloseOperation(operation:number):void
    {
        this.operation = operation;
    }
} 

