
import {URLConnection } from './URLConnection'; 
import {URI } from './URI'; 
import {InputStream } from '../io/InputStream'; 

export class URL 
{ 
	public _content:any;

	private path:string;

	public constructor (arg0: string ) 
	{ 
		this.path = arg0;
	} 
	
	public openStream ( ): InputStream 
	{ 
		return new InputStream(this.path);
	} 
	
	public toURI ( ): URI 
	{ 
		return new URI(this.path);
	} 
	
	public getFile ( ): string 
	{ 
		return this.path;
	} 
	
	public getHost ( ): string 
	{ 
		return "";
	} 
	
	public openConnection ( ): URLConnection 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	
} 

