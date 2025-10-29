import { InputStream } from "../io/InputStream";

export class Font
{
    public static readonly NORMAL:number = 0;
    public static readonly PLAIN:number = 0;
    public static readonly ITALIC:number = 1;
    public static readonly BOLD:number = 2;

    public static readonly TRUETYPE_FONT:number = 99;

    public _context():string
    {
        var str:string = "";
        if( (this.style & Font.ITALIC) != 0 )
            str += "italic ";

        if( (this.style & Font.BOLD) != 0 )
            str += "bold ";

        str += this.size + "px ";

        str += this.family;
        
//console.log(str);

        return str;
    }

    private family:string;
    private size:number;
    private style:number;

    constructor(font:Font);
    constructor(name:string | null, attributes:Map<any, any>);
    constructor(attributes:Map<any, any>);
    constructor(name:string | null, style:number, size:number);
    constructor(a:any, b:any = undefined, c:any = undefined)
    {
        var family:string | null = null;
        var style:number = 0;
        var size:number  =0;

        if( a instanceof Font ) //constructor(font:Font);
        {
            family = a.family;
            size = a.size;
            style = a.style;
        }

        else if( a instanceof Map ) //constructor(attributes:Map<any, any>);
        {
            if( a.has("FAMILY") )
                family = a.get("FAMILY");

            if( a.has("SIZE"))
                size = a.get("SIZE");
        }

        else
        {
            if( b instanceof Map )  //constructor(name:string | null, attributes:Map<any, any>);
            {
                family = a;

                if( b.has("SIZE"))
                    size = b.get("SIZE");
            }

            else // constructor(name:string | null, style:number, size:number);
            {
                family = a;
                style = b;
                size = c;
            }
        }

        this.family = family == null? "Arial" : family;
        this.style = style;
        this.size = size;
    }

    deriveFont(size:number):Font;
    deriveFont(style:number, size:number):Font
    deriveFont(a:number, b:number | undefined = undefined):Font
    {
        if( b === undefined )
        {
            var size:number = a;

            var out:Font = new Font(this);
            out.size = size;
            return out;
        }

        else
        {
            var style:number = a;
            var size:number = b;

            var out:Font = new Font(this);
            out.style = style;
            out.size = size;
            return out;
        }
    }

    static createFont(fontFormat:number, fontStream:InputStream):Font
    {
        return new Font("cmme", 0, 16);
    }

   

    getSize():number
    {
        return this.size;
    }
}