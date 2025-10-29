
import {KeyStroke } from './KeyStroke'; 



export class InputMap 
{ 
    private map:Map<KeyStroke, any> = new Map();

	public put(keyStroke:KeyStroke, actionMapKey:any):void
    {
        this.map.set(keyStroke, actionMapKey);
    }
} 

