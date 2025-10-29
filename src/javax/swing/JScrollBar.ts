


import {AdjustmentListener } from '../../java/awt/event/AdjustmentListener'; 


import {Adjustable } from '../../java/awt/Adjustable'; 
import {JComponent } from './JComponent'; 
import { AdjustmentEvent } from '../../java/awt/event/AdjustmentEvent';
//import { KeyEvent } from '../../java/awt/event/KeyEvent';
export class JScrollBar extends JComponent implements Adjustable
{ 
    public HORIZONTAL:number = 0;
    public VERTICAL:number = 1;
	public static HORIZONTAL:number = 0;
    public static VERTICAL:number = 1;

	private orientation: number;
    private value: number;
    private min: number;
    private max: number;
    private visibleAmount: number;
    private blockIncrement: number = 10;
    private unitIncrement: number = 1;
    private thumb: HTMLDivElement;
    private adjustmentListeners: AdjustmentListener[] = [];

	public constructor (orientation: number ,value: number ,extent: number ,min: number ,max: number ) 
	{ 
		super("div", ["JScrollBar"]);
        this.orientation = orientation;
        this.value = value;
        this.visibleAmount = extent;
        this.min = min;
        this.max = max;

        this._getHTMLElement().style.position = "relative";
        this._getHTMLElement().style.background = "#ccc";
        this._getHTMLElement().style.cursor = "pointer";
       // this._getHTMLElement().style.border = "1px solid #aaa";

        if (this.orientation === JScrollBar.HORIZONTAL) {
            this._getHTMLElement().style.width = "100%";
            this._getHTMLElement().style.height = "10px";
        } else {
            this._getHTMLElement().style.width = "10px";
            this._getHTMLElement().style.height = "100%";
        }

        this.thumb = document.createElement("div");
        this.thumb.style.position = "absolute";
        this.thumb.style.background = "#888";
        this.thumb.style.borderRadius = "5px";
        
        if (this.orientation === JScrollBar.HORIZONTAL)
            this.thumb.style.height = "100%";

        else
            this.thumb.style.width = "100%";

        this._getHTMLElement().appendChild(this.thumb);
        this.updateThumbSize();
        this.updateThumbPosition();
        this.setupDragging();

       /* document.addEventListener("keydown", (e:KeyboardEvent)=>
        {
            if( this.orientation == JScrollBar.HORIZONTAL )
                this.setValue(e.keyCode == 39? this.getValue() + 1 : this.getValue()-1);
        });*/
	} 
    
    private getThumbSizePercentage(): number
    {
        var extent:number = Math.min(this.visibleAmount, this.max-this.min);

        return Math.max((extent / (this.max - this.min)) * 100, 10); // Ensure minimum size
    }
	
    /** Adjusts the thumb size to match the visible proportion */
    private updateThumbSize(): void
    {
        const size = this.getThumbSizePercentage();
        
        if (this.orientation === JScrollBar.HORIZONTAL) 
            this.thumb.style.width = `${size}%`;

        else 
            this.thumb.style.height = `${size}%`;
    }

    /** Updates the thumb position based on the current scroll value */
    private updateThumbPosition(): void
    {
        var extent:number = Math.min(this.visibleAmount, this.max-this.min);

        const range = this.max - this.min - extent;
        const scrollFactor = (this.value - this.min) / range;
        const position = scrollFactor * (100  - this.getThumbSizePercentage());

        if (this.orientation === JScrollBar.HORIZONTAL)
            this.thumb.style.left = `${position}%`;
        
        else 
            this.thumb.style.top = `${position}%`;
    }

	/** Handles mouse dragging of the scrollbar thumb */
    private setupDragging(): void
    {
        let startClient = 0;
        let startValue  = 0;

        this.thumb.addEventListener("mousedown", (event) =>
        {
            startClient = this.orientation === JScrollBar.HORIZONTAL ? event.clientX : event.clientY;
            startValue  = this.value;
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        const onMouseUp = () =>
        {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        const onMouseMove = (event: MouseEvent) =>
        {
            let deltaClient = this.orientation === JScrollBar.HORIZONTAL ? event.clientX - startClient : event.clientY - startClient;

            let totalArea = this.orientation == JScrollBar.HORIZONTAL? this._getHTMLElement().clientWidth : this._getHTMLElement().clientHeight;
            totalArea -= (this.getThumbSizePercentage() / 100) * totalArea;

            let fac = deltaClient / Math.max(1, totalArea);

            var extent:number = Math.min(this.visibleAmount, this.max-this.min);
            const range = this.max - this.min - extent;

            let newValue = startValue + (fac * range);

            this.setValue(newValue);
        };

        

        
    }
	
	public getValue(): number {
        return this.value;
    }

    public setValue(newValue: number): void
    {
        var extent:number = Math.min(this.visibleAmount, this.max-this.min);

        newValue = Math.max(this.min, Math.min(this.max - extent, newValue));

        newValue |= 0;

        if( newValue != this.value )
        {
            this.value = newValue;
            this.updateThumbPosition();
            this.fireAdjustmentEvent();
        }
    }

    /** Fires an adjustment event to listeners */
    private fireAdjustmentEvent(): void {
        this.adjustmentListeners.forEach(listener => listener.adjustmentValueChanged(new AdjustmentEvent(this))); //if not undefined, blocks zooming for some reason
    }

    public addAdjustmentListener(arg0: AdjustmentListener): void {
        this.adjustmentListeners.push(arg0);
    }

    public removeAdjustmentListener(arg0: AdjustmentListener): void {
        this.adjustmentListeners = this.adjustmentListeners.filter(listener => listener !== arg0);
    }
   
    public setBlockIncrement(arg0: number): void {
        this.blockIncrement = arg0;
    }

    public setUnitIncrement(arg0: number): void {
        this.unitIncrement = arg0;
    }

    public setMaximum(max: number): void
    {
        if( this.max != max )
        {
            this.max = max;
            this.setValue(this.value); // Ensure value remains within bounds
            this.updateThumbSize();
            this.updateThumbPosition();
        }
    }

    public setVisibleAmount(extent: number): void
    {
        if( extent != this.visibleAmount )
        {
            this.visibleAmount = extent;
            this.setValue(this.value); // Ensure value remains within bounds
            this.updateThumbSize();
            this.updateThumbPosition();
        }
    }
	
	
} 

