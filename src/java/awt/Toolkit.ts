
import {Dimension } from './Dimension'; 

export class Toolkit 
{ 
	public getScreenSize ( ): Dimension 
	{ 
		return new Dimension(640, 480);
	} 
	
	private static singleton:Toolkit = null;

	public static getDefaultToolkit ( ): Toolkit 
	{ 
		if( Toolkit.singleton == null )
			Toolkit.singleton = new Toolkit();

		return Toolkit.singleton;
	} 
	
	
} 

