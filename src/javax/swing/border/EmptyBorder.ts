
import {AbstractBorder } from './AbstractBorder'; 
import { Border } from './Border';

export class EmptyBorder extends AbstractBorder implements Border
{
    constructor(private top: number, private right: number, private bottom: number, private left: number)
    {
        super();
    }

    _applyTo(element: HTMLElement): void {
        element.style.border = 'none';
        element.style.padding = `${this.top}px ${this.right}px ${this.bottom}px ${this.left}px`;
    }
}

