import {RuntimeException } from '../../../java/lang/RuntimeException'; 
import {SAXHandler } from './SAXHandler'; 
import {Document } from '../Document'; 
import { InputStream } from '../../../java/io/InputStream';
import { URL } from '../../../java/net/URL';
export class SAXBuilder 
{ 
	public constructor (saxDriverClass: string ,validate: boolean ) 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public setFeature (name: string ,value: boolean ): void 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public setEntityResolver (entityResolver: any ): void 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getValidation ( ): boolean 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public build_1 (systemId:  string ): Document 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public build_2 (url:  URL ): Document 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public build_3 (_in: InputStream ): Document 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public createContentHandler ( ): SAXHandler 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	
} 

