
import {Runnable } from '../../java/lang/Runnable'; 


import {SwingConstants } from './SwingConstants'; 
export class SwingUtilities implements SwingConstants 
{ 
	public static invokeLater (arg0: Runnable ): void 
	{ 
		arg0.run();
	} 
	
	
} 

