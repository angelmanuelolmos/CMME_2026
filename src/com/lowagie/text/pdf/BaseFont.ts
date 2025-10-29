import {RuntimeException } from '../../../../java/lang/RuntimeException'; 
import {DocumentException } from '../DocumentException'; 
import {IOException } from '../../../../java/io/IOException'; 
export class BaseFont 
{ 
	public static HELVETICA: string = ""; 
	public static CP1252: string = ""; 
	public static NOT_EMBEDDED: boolean = false; 
	public static IDENTITY_H: string = ""; 
	public static EMBEDDED: boolean = false; 
	public static createFont (name: string ,encoding: string ,embedded: boolean ): BaseFont 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getWidthPoint (text: string ,fontSize: number ): number 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getAscentPoint (text: string ,fontSize: number ): number 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	
} 

