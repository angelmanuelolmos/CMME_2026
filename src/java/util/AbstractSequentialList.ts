

import {Iterator } from './Iterator'; 
import {AbstractList } from './AbstractList'; 
export abstract class AbstractSequentialList<E> extends AbstractList< E> 
{ 
	public iterator ( ): Iterator< E> 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	
} 

