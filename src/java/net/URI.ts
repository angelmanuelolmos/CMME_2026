import {URL } from './URL'; 

export class URI 
{ 
	public constructor(_path:string)
	{
		this._path = _path;
	}

	public _path:string;

	public toURL ( ): URL 
	{ 
		return new URL(this._path);
	} 
	
	
} 

