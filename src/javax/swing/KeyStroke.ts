
import {AWTKeyStroke } from '../../java/awt/AWTKeyStroke'; 
export class KeyStroke extends AWTKeyStroke 
{ 
	public constructor()
	{
		super();
	}

	private keyChar: number;
	private modifiers: number

	public static getKeyStroke (keyChar: number ,modifiers: number ): KeyStroke 
	{ 
		var out:KeyStroke = new KeyStroke();
		out.keyChar = keyChar;
		out.modifiers = modifiers;
		return out;
	} 
	
	
} 

