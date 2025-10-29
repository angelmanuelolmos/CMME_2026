
import { Color } from "./Color";
import {BufferedImage} from "./image/BufferedImage";
import { Rectangle } from "./Rectangle";

export class Graphics
{
    protected ctx:CanvasRenderingContext2D;

    public constructor(ctx:CanvasRenderingContext2D, bgCol:string = "white")
    {
        this.ctx = ctx;
        this.bgCol = bgCol;
    }

    private clipBounds:Rectangle | null = null;

    private bgCol:string;

    private col:string;

    setColor (c:Color):void
    {
        this.col = c._str;
    }

    setClip(x:number, y:number, w:number, h:number):void
    {
        this.clipBounds = new Rectangle(x, y, w, h);
        
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.clip();
    }

    getClipBounds():Rectangle
    {
        if (!this.clipBounds) {
            return new Rectangle(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }
        else
        return this.clipBounds;  //copy?

    }

    drawImage(curbuffer:BufferedImage, x:number, y:number, io:any):void
    {
        if( curbuffer.canvas.width != 0 && curbuffer.canvas.height != 0 )
            this.ctx.drawImage(curbuffer.canvas, x, y);
    }

    fillRect(x:number, y:number, width:number, height:number):void
    {
        this.ctx.fillRect(x, y, width, height);
    }

    clearRect(x:number, y:number, width:number, height:number):void
    {
        const prevFillStyle = this.ctx.fillStyle;
        this.ctx.fillStyle = this.bgCol;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.fillStyle = prevFillStyle;
    }

    drawLine(x1:number, y1:number, x2:number, y2:number):void
    {
        throw new Error();
    }

    setXORMode(c1: Color): void 
    {
        this.ctx.globalCompositeOperation = 'xor';

        this.ctx.fillStyle = c1._str;
    }

    setPaintMode(): void
    {
        this.ctx.globalCompositeOperation = 'source-over';
    }
}