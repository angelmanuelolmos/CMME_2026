

export class Color 
{
    public _str:string;

    public constructor(rgba:number, hasalpha:boolean);
    public constructor();
    public constructor(str:string)
    public constructor(a:any = undefined, b:any = undefined)
    {
        if( a === undefined && b == undefined )
            this._str = "black";

        else
        {
            if( b === undefined )
            {
                this._str = a;
            }

            else
            {
                var rgba:number = a;
                var hasalpha:boolean = b;

                const _a = hasalpha ? ((rgba >> 24) & 0xff) / 255 : 1;  // Extract alpha and normalize to [0, 1]
                const _r = (rgba >> 16) & 0xff;  // Extract red
                const _g = (rgba >> 8) & 0xff;   // Extract green
                const _b = rgba & 0xff;          // Extract blue

                // Return the fillStyle string for canvas
                this._str =  `rgba(${_r}, ${_g}, ${_b}, ${_a})`;
            }
        }

        //this._str = str == undefined? "black" : str;
    }

    public static black = new Color("black");
    public static red = new Color("red");
    public static blue = new Color("blue");
    public static yellow = new Color("yellow");
    public static cyan = new Color("cyan");
    public static white = new Color("white");
    public static WHITE = new Color("white");
    public static gray = new Color("gray");
    public static GRAY = new Color("gray");
    public static green = new Color("green");
    public static magenta = new Color("magenta");
}