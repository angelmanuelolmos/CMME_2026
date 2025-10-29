
import {Color } from '../../java/awt/Color'; 

import {Font } from '../../java/awt/Font'; 

import {Border } from './border/Border'; 

import {InputMap } from './InputMap'; 
import {ActionMap } from './ActionMap'; 


import {Dimension } from '../../java/awt/Dimension'; 
import {Graphics } from '../../java/awt/Graphics'; 

import {Container } from '../../java/awt/Container'; 
export abstract class JComponent extends Container 
{ 
	private border?: Border;
    private background?: Color;
    private foreground?: Color;
   // private font?: Font;
    private preferredSize?: Dimension;
    private minimumSize?: Dimension;
    private alignmentX: number = 0.5;
    private alignmentY: number = 0.5;
    private toolTipText?: string;
   // private focusable: boolean = false;


   protected context: CanvasRenderingContext2D|null = null;


    constructor();
    constructor(tag:string, arrClass:Array<string>)
    constructor(a:any = undefined, b:any = undefined)
    {
        super(a === undefined?"div" :a, a === undefined? ["JComponent"] : b.concat("JComponent"));

        if( this.paintImmediately !== JComponent.prototype.paintImmediately
        ||  this.paint            !== JComponent.prototype.paint
        ||  this.paintComponent   !== JComponent.prototype.paintComponent )
        {
            var c:HTMLCanvasElement = document.createElement("canvas");
            c.style.position = "absolute";
            c.style.top = "0";
            c.style.left = "0";
            this.context = c.getContext("2d");
            this._getHTMLElement().appendChild(c);
        }
        
        
       // this.repaint();
    }

    public paintImmediately(x: number, y: number, w: number, h: number): void
    {
        if( this.context !== null )
        {
            this.context.clearRect(x, y, w, h);
            this.paint();
        }
    }

    paint(): void
    {
        if( this.context !== null )
        {
            this.context.canvas.width  = this._getHTMLElement().clientWidth;
            this.context.canvas.height = this._getHTMLElement().clientHeight;
            this.paintComponent( new Graphics(this.context, "grey") );
        }

        for(var component of this.children.keys())
			component.repaint();

    }

    public paintComponent(arg0: Graphics): void
    {
        arg0.clearRect(0, 0, this._getHTMLElement().clientWidth, this._getHTMLElement().clientHeight);
    }

    

    public setAlignmentX(arg0: number): void {
        this.alignmentX = arg0;
    }

    public setAlignmentY(arg0: number): void {
        this.alignmentY = arg0;
    }

    public setBorder(border: Border): void {
        this.border = border;
        border._applyTo(this._getHTMLElement());
    }

    public setToolTipText(arg0: string): void {
        this.toolTipText = arg0;
        this._getHTMLElement().title = arg0;
    }

    public getPreferredSize(): Dimension {
        return this.preferredSize ?? new Dimension(this._getHTMLElement().offsetWidth, this._getHTMLElement().offsetHeight);
    }

    public setPreferredSize(arg0: Dimension): void {
        this.preferredSize = arg0;
       // this._getHTMLElement().style.width = `${arg0.width}px`;
       // this._getHTMLElement().style.height = `${arg0.height}px`;
    }

    public setMinimumSize(arg0: Dimension): void {
        this.minimumSize = arg0;
        this._getHTMLElement().style.minWidth = `${arg0.width}px`;
        this._getHTMLElement().style.minHeight = `${arg0.height}px`;
    }

	
    public requestFocusInWindow(): boolean {
        if (this.getFocusable()) {
            this._getHTMLElement().focus();
            return true;
        }
        return false;
    }

    public revalidate(): void {
        //this._getHTMLElement().style.display = "none";
       //// requestAnimationFrame(() => {
       //     this._getHTMLElement().style.display = "";
       // });
    }

    public setBackground(arg0: Color): void {
        this.background = arg0;
        this._getHTMLElement().style.backgroundColor = arg0.toString();
    }

    public setForeground(arg0: Color): void {
        this.foreground = arg0;
        this._getHTMLElement().style.color = arg0.toString();
    }

    public setFont(arg0: Font): void {
        this.font = arg0;
       // this.element.style.fontFamily = arg0.family;
       // this.element.style.fontSize = `${arg0.size}px`;
       // this.element.style.fontStyle = arg0.style;
	   this._getHTMLElement().style.font = arg0._context();
    }

    public getListeners(arg0: any): any[] {
        throw new Error("Not Implemented");
    }
	
    private enabled:boolean = false;
    public setEnabled(enabled:boolean):void
    {
        this.enabled = enabled;
        const elem = this._getHTMLElement();

        if (elem instanceof HTMLInputElement || elem instanceof HTMLButtonElement || elem instanceof HTMLSelectElement)
        {
            // Use native `disabled` attribute for form elements
            elem.disabled = !enabled;
        } 
        
        else
        {
            // For non-form elements, use CSS
            elem.style.opacity = enabled ? "1" : "0.5";
            elem.style.pointerEvents = enabled ? "auto" : "none";
        }

        // Recursively disable child elements (if needed)
        /*Array.from(elem.children).forEach(child =>
        {
            if (child instanceof HTMLElement) {
                child.style.opacity = enabled ? "1" : "0.5";
                child.style.pointerEvents = enabled ? "auto" : "none";
            }
        });*/
    }

    public isEnabled():boolean
    {
        return this.enabled;
    }

    private actionMap:ActionMap = new ActionMap();

    public  getActionMap():ActionMap
    {
        return this.actionMap;
    }

    private inputMap:InputMap = new InputMap();

    public  getInputMap():InputMap
    {
        return this.inputMap;
    }
} 

