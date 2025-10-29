import {JGraphFacade } from './JGraphFacade'; 
export interface JGraphLayout 
{ 
	//mytype_JGraphLayout: boolean = true; 
	run (graph: JGraphFacade ): void; 
	
} 

