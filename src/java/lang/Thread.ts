
import {Runnable } from './Runnable'; 
export class Thread implements Runnable 
{ 
	public constructor (arg0: Runnable ) 
	{ 
		throw new Error("Not Implemented"); 
	} 
	run(): void {
		throw new Error('Method not implemented.');
	}
	
	public static currentThread ( ): Thread 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	public join ( ): void 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	public start ( ): void 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	public interrupt ( ): void 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	
} 

