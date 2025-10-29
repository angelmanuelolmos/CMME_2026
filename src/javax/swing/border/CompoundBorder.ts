
import {Border } from './Border'; 
import {AbstractBorder } from './AbstractBorder'; 


export class CompoundBorder extends AbstractBorder implements Border
{
    constructor(outer: Border, inner: Border)
    {
        super();

        this.outer = outer;
        this.inner = inner;
    }

    private outer: Border
    private inner: Border

    _applyTo(element: HTMLElement): void
    {
        this.outer._applyTo(element);
        this.inner._applyTo(element);
    }
}
