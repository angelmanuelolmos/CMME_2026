
import {Component } from '../Component'; 
import {ComponentEvent } from './ComponentEvent'; 
export class FocusEvent extends ComponentEvent 
{ 
	public constructor(source:Component)
    {
        super(source);
    }
} 

