import {RuntimeException } from '../../../java/lang/RuntimeException'; 
import {GraphModel } from './GraphModel'; 
import {GraphLayoutCache } from './GraphLayoutCache'; 
import {JComponent } from '../../../javax/swing/JComponent'; 
export class JGraph extends JComponent 
{ 
	public constructor (model: GraphModel ,cache: GraphLayoutCache ) 
	{ 
		super ( ); 
		throw new RuntimeException ( ) ; 
		
	} 
	
	public getGraphLayoutCache ( ): GraphLayoutCache 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	
} 

