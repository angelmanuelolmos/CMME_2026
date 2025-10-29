
import {Border } from './Border'; 
export abstract class AbstractBorder implements Border
{
    _applyTo(element: HTMLElement): void {
        throw new Error('Method not implemented.');
    } 
	
} 

