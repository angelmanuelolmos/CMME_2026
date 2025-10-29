
import { Font } from "./Font";

export class FontMetrics
{
    public constructor(font:Font)
    {

    }

    charWidth(s:string):number { return 25}

    getHeight():number {return 25;}
    getDescent():number { return 25;}

    stringWidth(str:string):number { return 20;}
}