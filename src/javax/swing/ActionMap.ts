import {Action } from './Action'; 


export class ActionMap 
{ 
    private map:Map<any, Action> = new Map();

	public put(key:any, action:Action ):void
    {
        this.map.set(key, action);
    }
} 

