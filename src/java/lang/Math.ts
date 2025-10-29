


import { NativeMath } from "./_Math";

export class Math
{
    

    static PI:number = NativeMath.PI;

    static abs(a: number): number {
        // Math.abs in Java handles -0.0 correctly, so we replicate that
        return a === 0 ? 0 : (a < 0 ? -a : a);
    }

    static round(v:number):number
    {
        return NativeMath.round(v);
    }

    static max(a:number, b:number):number
    {
        return NativeMath.max(a, b);
    }

    static min(a:number, b:number):number
    {
        return NativeMath.min(a, b);
    }
    
    static toRadians(degrees: number): number
    {
        return degrees * (Math.PI / 180);
    }
    static ceil(n:number):number
    {
        return NativeMath.ceil(n);
    }
    
    static floor(a:number):number
    {
        return NativeMath.floor(a);
    }

    static log(a:number):number
    {
        return NativeMath.log(a);
    }
    
}
