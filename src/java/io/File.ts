
import {URI } from '../net/URI'; 


import { isString } from '../../js';

export class File 
{ 
	public constructor (arg0: string ); 
	public constructor (arg0: File ,arg1: string ); 
	public constructor (arg0: URI ); 
	public constructor (arg0: any ,arg1: any = undefined ) 
	{ 
		if( arg0 instanceof URI )
		{
			this.uri = arg0;
		}

		else if( isString(arg0) )
		{
			this.uri = new URI(arg0);
		}
		
		else
			throw new Error("Not Implemented"); 
	} 
	
	private uri:URI = null;

	public getName ( ): string 
	{ 
		return this.uri._path.split('/').pop() ?? "";
	} 
	
	public getCanonicalPath ( ): string 
	{ 
		return this.uri._path;
	} 
	
	public exists ( ): boolean 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	public getAbsolutePath ( ): string 
	{ 
		return this.uri._path;
	} 
	
	public isDirectory ( ): boolean 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	public toURI ( ): URI 
	{ 
		return new URI(this.uri._path);
	} 
	
	
} 

