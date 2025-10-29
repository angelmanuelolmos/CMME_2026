
import {Exception } from './Exception'; 
export class RuntimeException extends Exception 
{ 
	public constructor ( ) 
	{ 
		super();
		throw new Error("Not Implemented"); 
	} 
	
	
} 

