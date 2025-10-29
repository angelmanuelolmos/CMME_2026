
import {FilterOutputStream } from './FilterOutputStream'; 
export class PrintStream extends FilterOutputStream 
{ 
	public constructor(fileName:string);
	public constructor(a:any)
	{
		super();
	}

	public println (arg0: any ): void; 
	public println (arg0: string ): void; 
	public println ( ): void; 
	public println (arg0: any = undefined ): void 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	public print (arg0: string ): void 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	public close():void
	{
		throw new Error();
	}
	
} 

