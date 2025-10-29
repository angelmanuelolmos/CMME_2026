import {RuntimeException } from '../../java/lang/RuntimeException'; 
import {Namespace } from './Namespace'; 
import {Attribute } from './Attribute'; 
import {List } from '../../java/util/List'; 
export class Element 
{ 
	public static new0 (name:  string ): Element 
	{ 
		let _new0 : Element = new Element; Element . set0 ( _new0 , name ); 
		return _new0 ; 
		
	} 
	
	public static set0 (new0: Element ,name:  string ): void 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public static new1 (name: string ,namespace: Namespace ): Element 
	{ 
		let _new1 : Element = new Element; Element . set1 ( _new1 , name , namespace ); 
		return _new1 ; 
		
	} 
	
	public static set1 (new1: Element ,name: string ,namespace: Namespace ): void 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getChild_1 (name: string ,ns: Namespace ): Element 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getChild_2 (name: string ): Element 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getChildText_1 (name:  string ):  string 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getChildText_2 (name: string ,ns: Namespace ): string 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getChildren_1 (name:  string ): List<any>
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getChildren_2 (name: string ,ns: Namespace ): List <any>
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getChildren_3 ( ): List <any>
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getName ( ): string 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getText ( ): string 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public setAttribute_1 (name: string ,value: string ): Element 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public addNamespaceDeclaration (additionalNamespace: Namespace ): void 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public setAttribute_2 (name: string ,value: string ,ns: Namespace ): Element 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public addContent_1 (child: Element ): Element 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public setText (text: string ): Element 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getAttribute (name:  string ): Attribute 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public indexOf (child: Element ): number 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public addContent_2 (index: number ,child: Element ): Element 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	
} 

