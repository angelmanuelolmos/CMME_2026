
export class Rectangle
{
    private x:number;
    private y:number;
    private width:number;
    private height:number;

    public constructor();
    public constructor(x:number, y:number, width:number, height:number);
    public constructor(a:number | undefined = undefined, b:number | undefined = undefined, c:number | undefined = undefined, d:number | undefined = undefined)
    {
        if( a === undefined)
        {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }

        else
        {
            this.x = a as number;
            this.y = b as number;
            this.width = c as number;
            this.height = d as number;
        }
    }

    getX():number
    {
        return this.x;
    }

    getY():number
    {
        return this.y;
    }

    getWidth():number
    {
        return this.width;
    }

    getHeight():number
    {
        return this.height;
    }
}