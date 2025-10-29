
//https://docs.oracle.com/javase/8/docs/api/index.html?java/awt/geom/Rectangle2D.html

import { PrintStream } from "../io/PrintStream";


export class Out extends PrintStream
{
    public constructor()
    {
        super(null);
    }

    println(data:any = undefined):void
    {
        if( data === undefined )
            console.log(data);

        if( data === null ) 
            console.log("null")

        if( (data as any)["valueOf"] !== undefined )
            console.log( (data as any).valueOf() );

        else
        {
            console.log("" + data);
        }
    }
    
    print(x:any):void
    {
        console.log(x);
    }
}

export class Err
{
    print(x:any):void
    {
        console.log(x);
    }

    println(ln:string|undefined = undefined):void
    {
        console.log(ln === undefined? "\n" : ln);
    }
}

export class System
{
    public static out:Out = new Out();
    public static err:Err = new Err();

    public static exit (code:number):void
    {
        
    }

    public static currentTimeMillis()
    {
        return Date.now();
    }
}