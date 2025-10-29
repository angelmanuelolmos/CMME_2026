
import {Container } from './Container'; 
export class Panel extends Container 
{ 
	constructor(tag:string, arrClass:Array<string>)
    {
        super(tag, arrClass.concat("panel"));
    }
} 

