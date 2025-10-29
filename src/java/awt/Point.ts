
import {Point2D } from './geom/Point2D'; 
export class Point extends Point2D
{ 
	public constructor();
	public constructor(x:number, y:number);
	public constructor(a:any = undefined, b:any = undefined)
	{
		super();
		if( a === undefined)
		{
			this.x = 0;
			this.y = 0;
		}

		else
		{
			this.x = a;
			this.y = b;
		}
	}

	public x: number; 
	public y: number; 
	
} 

