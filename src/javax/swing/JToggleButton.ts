
import {AbstractButton } from './AbstractButton'; 
export class JToggleButton extends AbstractButton
{ 
	public constructor(tag:string, arrClass:Array<string>)
    {
        super(tag, arrClass.concat("JToggleButton"));
    }
} 

