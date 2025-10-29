import {RuntimeException } from '../../../../../java/lang/RuntimeException'; 
import {JGraphFacade } from '../../JGraphFacade'; 
import {JGraphLayout } from '../../JGraphLayout'; 
export class JGraphFastOrganicLayout implements JGraphLayout 
{ 
	mytype_JGraphLayout: boolean = true; 
	public run (graph: JGraphFacade ): void 
	{ 
		throw new RuntimeException ( ) ; 
		
	} 
	
	
} 

