import {InputStream } from './InputStream'; 
import {FilterInputStream } from './FilterInputStream'; 
export class BufferedInputStream extends FilterInputStream 
{ 
	public constructor (arg0: InputStream ) 
	{ 
		super(arg0._path);
	} 
	
	public read (arg0: number [ ] ,arg1: number ,arg2: number ): number 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	
} 

