
import {URL } from '../net/URL'; 
import {Panel } from '../awt/Panel'; 
export class Applet extends Panel 
{ 
	public constructor();
	public constructor(tag:string, arrClass:Array<string>)
	public constructor(tag:string|undefined = undefined, arrClass:Array<string>|undefined = undefined)
	{
		super(tag === undefined? "div" : tag, arrClass === undefined? ["Applet"] : arrClass.concat("Applet"));
	}


	public showStatus (arg0: string ): void 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	public getDocumentBase ( ): URL 
	{ 
		return new URL("");
	} 
	
	public static _mapParams:Map<string, string> = new Map();

	public getParameter (arg0: string ): string 
	{ 
		return Applet._mapParams.has(arg0)? Applet._mapParams.get(arg0) : null;
	} 
	
	
} 

