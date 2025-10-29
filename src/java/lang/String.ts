export class String
{
    public constructor(s:string | String |undefined = undefined)
    {
        if( s === undefined )
            this.str = "";

        else
            this.str = s instanceof String? s.str : s;
    }

    private str:string;

    public equals(s:String):boolean
    {
        return this.str == s.str;
    }

    
}