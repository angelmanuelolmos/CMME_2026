

class Rectangle2DFloat
{
    public x:number;
    public y:number;
    public w:number;
    public h:number;

    public constructor(x:number, y:number, w:number, h:number)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

export class Rectangle2D
{
    static Float:any = Rectangle2DFloat;
}