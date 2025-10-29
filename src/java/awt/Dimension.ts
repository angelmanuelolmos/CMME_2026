
export class Dimension {

    public width:number;
    public height:number;

    public getWidth():number
    {
        return this.width;
    }

    public getHeight():number
    {
        return this.height;
    }

    constructor(d:Dimension)
    constructor(width: number, height: number)
    constructor(a:any, b:any = undefined)
    {
        if( a instanceof Dimension )
        {
            this.width = a.width;
            this.height= a.height;
        }

        else
        {
            this.width = a;
            this.height = b;
        }
    }

    setSize(d:Dimension):void
    setSize(width:number, height:number):void
    setSize(a:any, b:any = undefined)
    {
        if( a instanceof Dimension )
        {
            this.width = a.width;
            this.height = a.height;
        }

        else
        {
            this.width = a;
            this.height = b;
        }
    }
}