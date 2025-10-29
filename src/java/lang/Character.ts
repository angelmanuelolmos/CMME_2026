
import{ isNumber }from "../../js";

export class Character
{
    public static _(v:number):Character
    public static _(v:string):Character
    public static _(a:any):Character
    {
        return isNumber(a)? new Character(a) : new Character( (a as string).charCodeAt(0) );
    }

    public constructor(val:number)
    {
        this.val = val;
    }

    private val:number;

    public toString():string
    {
        return String.fromCharCode(this.val);
    }

    public _number():number
    {
        return this.val;
    }

    public static codePointAt(str:string, index:number):number
    {
        return str.charCodeAt(index);
    }

    public static toString(n:number):string
    {
        return String.fromCharCode(n);
    }

    public static toUpperCase(c:number):number
    {
        return String.fromCharCode(c).toUpperCase().charCodeAt(0);
    }
}