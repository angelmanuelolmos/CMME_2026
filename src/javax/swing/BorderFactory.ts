
import {TitledBorder } from './border/TitledBorder'; 

import {CompoundBorder } from './border/CompoundBorder'; 

import {Border } from './border/Border'; 
import { EmptyBorder } from './border/EmptyBorder';
export class BorderFactory 
{ 
	public static createCompoundBorder (arg0: Border ,arg1: Border ): CompoundBorder 
	{ 
		return new CompoundBorder(arg0, arg1);
	} 
	
	public static createTitledBorder (arg0: string ): TitledBorder 
	{ 
		return new TitledBorder(arg0);
	} 
	
	public static createEmptyBorder (arg0: number ,arg1: number ,arg2: number ,arg3: number ): Border 
	{ 
		return new EmptyBorder(arg0, arg1, arg2, arg3);
	} 
	
	
} 





