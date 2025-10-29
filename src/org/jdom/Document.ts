import {RuntimeException } from '../../java/lang/RuntimeException'; 
import {Element } from './Element'; 
import {DocType } from './DocType'; 
export class Document 
{ 
	public constructor (rootElement: Element ) 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getDocument ( ): Document 
	{ 
		return this ; 
		
	} 
	
	public getRootElement ( ): Element 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public setDocType (docType: DocType ): Document 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	
} 

