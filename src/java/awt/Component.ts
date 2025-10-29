
import {MouseEvent as JavaMouseEvent} from './event/MouseEvent'; 
import {KeyEvent } from './event/KeyEvent'; 

import {FocusEvent } from './event/FocusEvent'; 
import {ComponentEvent } from './event/ComponentEvent'; 

import {Font } from './Font'; 

import {MouseMotionListener } from './event/MouseMotionListener'; 
import {MouseListener } from './event/MouseListener'; 
import {KeyListener } from './event/KeyListener'; 

import {FocusListener } from './event/FocusListener'; 
import {ComponentListener } from './event/ComponentListener'; 

import {Dimension } from './Dimension'; 
import {Point } from './Point'; 

export class Component
{ 
	private element: HTMLElement;
    private componentListeners: ComponentListener[] = [];
    private keyListeners: KeyListener[] = [];
    private focusListeners: FocusListener[] = [];
    protected font?: Font;
    private focusable: boolean = false;
    private _hasFocus: boolean = false; // Tracks focus state

    public static LEFT_ALIGNMENT: number = 0.0;

    public static RIGHT_ALIGNMENT: number = 1;// new
    public static CENTER_ALIGNMENT:number = 2;

    

    constructor(tag: string, arrClass:Array<string>)
    {
        this.element = document.createElement(tag);
        
        arrClass.forEach(x => this.element.classList.add(x) );
        
        this.element.style.position = 'relative';

         // Focus handling
         this.element.addEventListener("focus", (event) => this.handleFocusGained(event));
         this.element.addEventListener("blur", (event) => this.handleFocusLost(event));
 
         // Key handling (only fires when focused)
         this.element.addEventListener("keydown", (event) => this.handleKeyEvent(event, "keyPressed"));
         this.element.addEventListener("keyup", (event) => this.handleKeyEvent(event, "keyReleased"));
 
    }

    _getHTMLElement(): HTMLElement {
        return this.element;
    }

    public addKeyListener(listener:KeyListener):void
    {
        this.keyListeners.push(listener);
    }

    public removeKeyListener(listener:KeyListener):void
    {
        this.keyListeners = this.keyListeners.filter(l => l !== listener);
   
    }

    private handleKeyEvent(event: KeyboardEvent, eventType: "keyPressed" | "keyReleased"): void {
        if (!this.hasFocus) return; // Ignore if not focused
        const keyEvent = new KeyEvent(this, KeyEvent.KEY_PRESSED, 0, 0, event.keyCode, event.key);

        this.keyListeners.forEach(listener =>    (listener as any)[eventType]?.(keyEvent));
    }

    public addFocusListener(listener:FocusListener):void
    {
        this.focusListeners.push(listener);
    }

    removeFocusListener(listener:FocusListener):void
    {
        this.focusListeners = this.focusListeners.filter(l => l !== listener);
  
    }

    private handleFocusGained(event: any): void {
        this._hasFocus = true;
        const focusEvent = new FocusEvent(this);
        this.focusListeners.forEach(listener => listener.focusGained(focusEvent));
    }

    /** Handles focus lost */
    private handleFocusLost(event: any): void {
        this._hasFocus = false;
        const focusEvent = new FocusEvent(this);
        this.focusListeners.forEach(listener => listener.focusLost(focusEvent));
    }

    public setFocusable(focusable: boolean): void {
        this.focusable = focusable;
        this.element.tabIndex = focusable ? 0 : -1;
    }

    public getFocusable():boolean
    {
        return this.focusable;
    }

    public requestFocus(): boolean {
        if (this.getFocusable()) {
            this.element.focus();
            return true;
        }
        return false;
    }

    public hasFocus(): boolean {
        return this._hasFocus;
    }

    public getLocation(): Point {
        return new Point(this.element.clientLeft, this.element.clientTop);
    }

    public getSize(): Dimension {
        return new Dimension(this.element.offsetWidth, this.element.offsetHeight);
    }

    public addComponentListener(listener: ComponentListener): void
    {
        this.componentListeners.push(listener);
        if (this.componentListeners.length === 1) {
            this.startObservers();
        }
    }

    public removeComponentListener(listener: ComponentListener): void
    {
        this.componentListeners = this.componentListeners.filter(l => l !== listener);
        if (this.componentListeners.length === 0) {
            this.stopObservers();
        }
    }

    private resizeObserver?: ResizeObserver;
    private lastWidth: number = 0;
    private lastHeight: number = 0;

    private startObservers(): void
    {
        if (!this.resizeObserver)
        {
            this.resizeObserver = new ResizeObserver(() =>
            {
                const width = this.element.clientWidth;
                const height = this.element.clientHeight;
                if (width !== this.lastWidth || height !== this.lastHeight)
                {
                    this.fireComponentResized();
                    this.lastWidth = width;
                    this.lastHeight = height;
                }
            });

            this.resizeObserver.observe(this.element);
        }
/*
        if (!this.mutationObserver) {
            this.mutationObserver = new MutationObserver(() => {
                const newVisibility = this.element.offsetParent !== null;
                if (newVisibility !== this.isVisible) {
                    if (newVisibility) {
                        this.fireComponentShown();
                    } else {
                        this.fireComponentHidden();
                    }
                    this.isVisible = newVisibility;
                }
            });

            this.mutationObserver.observe(document.body, { attributes: true, childList: true, subtree: true });
        }*/
    }

    /** Stop observers when no listeners are present */
    private stopObservers(): void {
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
       // this.mutationObserver?.disconnect();
       // this.mutationObserver = undefined;
    }

    private fireComponentResized(): void
    {
        const event = new ComponentEvent(this);
        this.componentListeners.forEach(listener => (listener as any).componentResized? (listener as any).componentResized(event) : undefined );
    }

    private mouseListeners: MouseListener[] = [];

    public addMouseListener(listener: MouseListener): void
    {
        this.mouseListeners.push(listener);

        if( this.mouseListeners.length + this.mouseMotionListeners.length == 1 )
            this.startMouseListeners();
    }

    public removeMouseListener(listener: MouseListener): void
    {
        this.mouseListeners = this.mouseListeners.filter(l => l !== listener);

        if( this.mouseListeners.length + this.mouseMotionListeners.length == 0 )
            this.stopMouseListeners();
    }

    
    private mouseMotionListeners: MouseMotionListener[] = [];

    public addMouseMotionListener(listener:MouseMotionListener):void
    {
        this.mouseMotionListeners.push(listener);
        
        if( this.mouseListeners.length + this.mouseMotionListeners.length == 1 )
            this.startMouseListeners();
    }

    public removeMouseMotionListener(listener:MouseMotionListener):void
    {
        this.mouseMotionListeners = this.mouseMotionListeners.filter(l => l !== listener);

        if( this.mouseListeners.length + this.mouseMotionListeners.length == 0 )
            this.stopMouseListeners();
    }
    
    private startMouseListeners(): void
    {
    
        this.element.addEventListener("mousedown", (event) => this.handleMouseDown);
        this.element.addEventListener("mouseup", (event) => this.handleMouseUp);
        this.element.addEventListener("mouseleave", (event) => this.handleMouseLeave);
        this.element.addEventListener("mouseenter", (event) => this.handleMouseEnter);
        this.element.addEventListener("mousemove", (event) => this.handleMouseMove);
    }

    /** Stops mouse event listeners */
    private stopMouseListeners(): void
    {
        this.element.removeEventListener("mousedown", (event) => this.handleMouseDown);
        this.element.removeEventListener("mouseup", (event) => this.handleMouseUp);
        this.element.removeEventListener("mouseleave", (event) => this.handleMouseLeave);
        this.element.removeEventListener("mouseenter", (event) => this.handleMouseEnter);        
        this.element.removeEventListener("mousemove", (event) => this.handleMouseMove);
    }

    private isPotentialDrag: boolean = false;
    private isActualDrag:boolean = false;

    private handleMouseEnter(event:MouseEvent): void
    {
        const mouseEvent = new JavaMouseEvent(this, JavaMouseEvent.MOUSE_ENTERED, 0, 0, event.clientX, event.clientY, 0, false);
        this.mouseListeners.forEach(listener => listener.mouseEntered?.(mouseEvent));
    }

    private handleMouseLeave(event:MouseEvent): void
    {
        const mouseEvent = new JavaMouseEvent(this, JavaMouseEvent.MOUSE_EXITED, 0, 0, event.clientX, event.clientY, 0, false);
        this.mouseListeners.forEach(listener => listener.mouseExited?.(mouseEvent));
    }

    private handleMouseDown(event:MouseEvent): void
    {
        this.isPotentialDrag = true;

        const mouseEvent = new JavaMouseEvent(this, JavaMouseEvent.MOUSE_PRESSED, 0, 0, event.clientX, event.clientY, 0, false);
        this.mouseListeners.forEach(listener => listener.mousePressed?.(mouseEvent));
    }

    private handleMouseUp(event:MouseEvent):void
    {
        const mouseEvent = new JavaMouseEvent(this, JavaMouseEvent.MOUSE_RELEASED, 0, 0, event.clientX, event.clientY, 0, false);

        this.mouseListeners.forEach(listener => listener.mouseReleased?.(mouseEvent));

        if( this.isPotentialDrag == false )
        {
            const mouseEvent = new JavaMouseEvent(this, JavaMouseEvent.MOUSE_CLICKED, 0, 0, event.clientX, event.clientY, 0, false);
            this.mouseListeners.forEach(listener => listener.mouseClicked?.(mouseEvent));
        }

        this.isPotentialDrag = false;
        this.isActualDrag = false;
        
    }

    private handleMouseMove(event:MouseEvent):void
    {
        if( this.isPotentialDrag )
            this.isActualDrag = true;

        if( this.isActualDrag ) 
        {
            const mouseEvent = new JavaMouseEvent(this, JavaMouseEvent.MOUSE_DRAGGED, 0, 0, event.clientX, event.clientY, 0, false);
            this.mouseMotionListeners.forEach(listener => listener.mouseDragged?.(mouseEvent));
        }

        else
        {
            const mouseEvent = new JavaMouseEvent(this, JavaMouseEvent.MOUSE_MOVED, 0, 0, event.clientX, event.clientY, 0, false);
            this.mouseMotionListeners.forEach(listener => listener.mouseMoved?.(mouseEvent));
        }

    };


    public getFont(): Font {
        return this.font ?? new Font("Arial", 0, 12);
    }

    public repaint(x:number, y:number, width:number, height:number):void
    public repaint(): void
    public repaint(a:any = undefined, b:any = undefined, c:any = undefined, d:any = undefined)
    {
        requestAnimationFrame(() => this.paint());
    }

    /** Equivalent to `update(Graphics g)` in AWT */
    protected paint(): void
    {   
        // Placeholder - JComponent will override this
    }



    public setVisible(visible:boolean)
    {
        if( visible == false)
            this._getHTMLElement().style.display = "none";
    }

    public isVisible():boolean
    {
        return true;
    }
	
} 

