

import { Graphics } from "./Graphics";

import { Font } from "./Font";

import { Color } from "./Color";

import { FontMetrics } from "./FontMetrics";

//import { Shape } from "./graphics/Shape";

import { Line2D, Line2DFloat } from "./geom/Line2D";
import { AffineTransform } from "./geom/AffineTransform";
import { Shape } from "./Shape";

export class Graphics2D extends Graphics
{
    public constructor(context:CanvasRenderingContext2D)
    {
        super(context);
    }

    private font:Font = new Font("Arial", 0, 10);
    private color:Color = Color.black;

    getFontMetrics(font:Font | undefined = undefined):FontMetrics
    {
        font = font === undefined? this.font : font;

        return new FontMetrics(font);
    }

    setFont(font:Font):void
    {
        this.font =font;
    }

    setColor(c:Color):void
    {
        this.color = c;

        this.ctx.fillStyle = c._str;
        this.ctx.strokeStyle = c._str;
    }

    drawString(str:string, x:number, y:number)
    {
        this.ctx.font = this.font._context()
        this.ctx.fillText(str, x, y);
    }

    drawArc(x:number, y:number, width:number, height:number, startAngle:number, arcAngle:number):void
    { 
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const radiusX = Math.abs((width + 1) / 2);
        const radiusY = Math.abs((height + 1) / 2);

        if (radiusX === 0 || radiusY === 0) {
            return; // Avoid invalid ellipse drawing
        }

        // Convert degrees to radians
        const startRad = (Math.PI / 180) * -startAngle;
        const endRad = startRad + (Math.PI / 180) * -arcAngle;

        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, startRad, endRad, arcAngle < 0);
        this.ctx.stroke();
        
    }


    //t:AffineTransform = new AffineTransform();

    getTransform():AffineTransform
    {
        return new AffineTransform(this.ctx.getTransform());
    }

    translate(tx:number, ty:number):void
    { 
        this.ctx.translate(tx, ty);
    }

    scale(sx:number, sy:number):void
    {
        this.ctx.scale(sx, sy);
    }

    rotate(theta:number):void
    {
        this.ctx.rotate(theta);
    }

    draw(shape:Shape):void
    { 
        if( shape instanceof Line2DFloat )
        {
            var line:Line2DFloat = shape as Line2DFloat;

            this.drawLine(line.x1, line.y1, line.x2, line.y2);
        }

        else
            console.log("draw")
    }

    fill(shape:Shape):void { console.log("fill")}
    setTransform(at:AffineTransform):void
    {
        this.ctx.setTransform(at._matrix);
    }

    fillRect(x:number, y:number, w:number, h:number):void
    {
        this.ctx.fillRect(x, y, w, h); 
    }

    drawLine(x1:number, y1:number, x2:number, y2:number):void
    {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    setRenderingHint(a:number, b:number):void {}

    setBackground( color:Color):void
    {
        const prevFillStyle = this.ctx.fillStyle; // Save current fill style
        this.ctx.fillStyle = color._str;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = prevFillStyle;
    }
    
}