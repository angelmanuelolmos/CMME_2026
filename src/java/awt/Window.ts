
import {Component } from './Component'; 



import {Container } from './Container'; 
export class Window extends Container
{ 
    public constructor(tag:string, arrClass:Array<string>)
    public constructor()
    public constructor(tag:string|undefined=undefined, arrClass:Array<string>|undefined = undefined)
    {
        super(tag === undefined? "div" : tag, arrClass === undefined?  ["Window"] : arrClass.concat("Window"));

        document.body.appendChild(this._getHTMLElement());

        this.toFront();
    }

    /*
    When window is created, toFront();
    
    When window is clicked in (drag frame) toFront();
    */

    public setSize(width: number, height: number): void {
       // this._getHTMLElement().style.width = `${width}px`;
        //this._getHTMLElement().style.height = `${height}px`;
    }

    public toFront(): void
    {
        var arrWindows:any = document.body.querySelectorAll(".Window")

        var max:number = 0;
        for(var i:number = 0 ; i < arrWindows.length ; i++)
        {
            var z:number = parseInt(arrWindows[i].style.zIndex);

            if(! isNaN(z) )
                max = Math.max(max, z);
        }

        this._getHTMLElement().style.zIndex = "" + (max + 1);
    }

    public getListeners(arg0: any): any[]
    {
       if( arg0 == "WindowFocusListener" )
            return this.windowFocusListeners.concat();

       if( arg0 == "WindowListener" )
        return this.windowListeners.concat();

       else
       {
        debugger;
       }
    }
    

    private windowFocusListeners: any[] = [];

    public addWindowFocusListener(listener: any): void {
        this.windowFocusListeners.push(listener);
    }

    public removeWindowFocusListener(listener:any):void
    {
        throw new Error();
    }

    public addWindowListener(listener: any): void {
        this.windowListeners.push(listener);
    }

    private windowListeners: any[] = [];

    public removeWindowListener(listener: any): void {
        this.windowListeners = this.windowListeners.filter(l => l !== listener);
    }

    public setLocationRelativeTo(component: Component): void {
        let x = 0, y = 0;

    if (component && component.isVisible() ) {
        // Get component's location and size
        const compRect = component._getHTMLElement().getBoundingClientRect();
        const winRect = this._getHTMLElement().getBoundingClientRect();

        // Calculate new position to center relative to component
        x = compRect.left + (compRect.width - winRect.width) / 2;
        y = compRect.top + (compRect.height - winRect.height) / 2;
    } else {
        // Center on screen
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        const winRect = this._getHTMLElement().getBoundingClientRect();

        x = (winWidth - winRect.width) / 2;
        y = (winHeight - winRect.height) / 2;
    }

    // Apply new position
    this.setLocation(x, y);
    }

    public pack(): void {
        let maxWidth = 0;
        let maxHeight = 0;

       /* this.children.forEach((constraint, component) => {
            const preferredSize = component.getPreferredSize();
            maxWidth = Math.max(maxWidth, preferredSize.width);
            maxHeight = Math.max(maxHeight, preferredSize.height);
        });

        // Account for window padding, borders, and layout constraints
        const padding = 10; // Example padding
        this.setSize(maxWidth + padding * 2, maxHeight + padding * 2);*/
    }

    public dispose(): void {
        this._getHTMLElement().remove();
    }

    public setLocation(x: number, y: number): void {
        this._getHTMLElement().style.left = `${x}px`;
        this._getHTMLElement().style.top = `${y}px`;
    }

    public _getLocationX():number
    {
        var out:number = parseInt(this._getHTMLElement().style.left);
        return isNaN(out)? 0 : out;
    }

    public _getLocationY():number
    {
        var out:number = parseInt(this._getHTMLElement().style.top);
        return isNaN(out)? 0 : out;
    }

    public setVisible(visible: boolean): void {
        this._getHTMLElement().style.display = visible ? "block" : "none";
    }

    public isShowing():boolean
    {
        return this._getHTMLElement().style.display != "none";
    }
	
} 

