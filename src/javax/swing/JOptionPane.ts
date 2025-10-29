
import {Component } from '../../java/awt/Component'; 



import {JComponent } from './JComponent'; 
export class JOptionPane extends JComponent
{ 
	public static showConfirmDialog (arg0: Component ,arg1: any ,arg2: string ,arg3: number ,arg4: number ): number 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	public static showMessageDialog (arg0: Component ,arg1: any ,arg2: string ,arg3: number ): void 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	public static YES_NO_OPTION: number; 
	public static YES_OPTION: number; 
	public static NO_OPTION: number; 
	public static ERROR_MESSAGE: number; 
	public static WARNING_MESSAGE: number; 

	public static CANCEL_OPTION:number;
	public static YES_NO_CANCEL_OPTION:number;
	
} 

