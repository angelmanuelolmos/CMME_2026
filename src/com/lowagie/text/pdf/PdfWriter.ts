import {RuntimeException } from '../../../../java/lang/RuntimeException'; 
import {PdfContentByte } from './PdfContentByte'; 
import {OutputStream } from '../../../../java/io/OutputStream'; 
import {Document } from '../Document'; 
export class PdfWriter 
{ 
	public static getInstance (document: Document ,os: OutputStream ): PdfWriter 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getDirectContent ( ): PdfContentByte 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	
} 

