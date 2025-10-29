import {Exception } from '../../java/lang/Exception'; 
import {RuntimeException } from '../../java/lang/RuntimeException'; 
export class JDOMException extends Exception 
{ 
	public constructor (message: string ) 
	{ 
		super ( ); 
		throw new RuntimeException ( ) ; 
		
	} 
	
	
} 

