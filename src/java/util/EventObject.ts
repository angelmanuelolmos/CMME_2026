


import { Component } from '../awt/Component';
export class EventObject 
{ 
	public constructor(source:Component)
	{
		this.source = source;
	}

	private source:Component;

	public getSource ( ): any 
	{ 
		return this.source;
	} 
	
	
} 

