
import { Rectangle } from "../Rectangle";

export class Line2DFloat
{
    public x1:number;
    public y1:number;
    public x2:number;
    public y2:number;

    public constructor(x1:number, y1:number, x2:number, y2:number)
    {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    getBounds():Rectangle
    {
        var x:number;
        var y:number;
        var w:number;
        var h:number;
        if (this.x1 < this.x2)
        {
            x = this.x1;
            w = this.x2 - this.x1;
        } 
        
        else
        {
            x = this.x2;
            w = this.x1 - this.x2;
        }

        if (this.y1 < this.y2)
        {
            y = this.y1;
            h = this.y2 - this.y1;
        } 
        
        else
        {
            y = this.y2;
            h = this.y1 - this.y2;
        }

        return new Rectangle(x, y, w, h);
    }
}

export class Line2D //implements Shape
{
    static Float:any = Line2DFloat;

    
}