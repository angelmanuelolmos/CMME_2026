
import {Graphics2D} from "../Graphics2D";

import { Image } from "../Image";

export class BufferedImage extends Image
{
    public static readonly TYPE_INT_ARGB:number = 0;
    public static readonly TYPE_INT_RGB:number = 0;

    canvas:HTMLCanvasElement

    constructor(img:HTMLImageElement);
    constructor(w:number, h:number, fmt:number);
    constructor(a:any, b:any = undefined, c:any = undefined)
    {
        super();

        this.canvas = document.createElement("canvas");

        if( a instanceof HTMLImageElement)
        {
            this.canvas.width = a.naturalWidth;
            this.canvas.height = a.naturalHeight;
            
            const ctx = this.canvas.getContext("2d")
            ctx.drawImage(a, 0, 0, this.canvas.width, this.canvas.height);
        }

        else
        {
            this.canvas.width = a;
            this.canvas.height = b;
        }
    }

    createGraphics():Graphics2D
    {
        var context:CanvasRenderingContext2D = this.canvas.getContext("2d") as CanvasRenderingContext2D;    

        return new Graphics2D(context);
    }

    public getWidth():number
    {
        return this.canvas.width;
    }

    public getHeight():number
    {
        return this.canvas.height;
    }
}