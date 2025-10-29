
import {RuntimeException } from '../../../java/lang/RuntimeException'; 
import {DefaultGraphCell } from './DefaultGraphCell'; 
export class DefaultEdge extends DefaultGraphCell 
{ 
	public static new1 ( ): DefaultEdge 
	{ 
		let _new1 : DefaultEdge = new DefaultEdge; DefaultEdge . set1 ( _new1 ); 
		return _new1 ; 
		
	} 
	
	public static set1 (new1: DefaultEdge ): void 
	{ 
		DefaultGraphCell . set0 ( new1 , null ); 
		
	} 
	
	public static new2 (userObject: any ): DefaultEdge 
	{ 
		let _new2 : DefaultEdge = new DefaultEdge; DefaultEdge . set2 ( _new2 , userObject ); 
		return _new2 ; 
		
	} 
	
	public static set2 (new2: DefaultEdge ,userObject: any ): void 
	{ 
		DefaultGraphCell . set0 ( new2 , userObject ); 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public setSource (port: any ): void 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public setTarget (port: any ): void 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	
} 

