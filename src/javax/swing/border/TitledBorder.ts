
import {Border } from './Border'; 
import {AbstractBorder } from './AbstractBorder'; 

export class TitledBorder extends AbstractBorder implements Border
{
    constructor(title: string)
    {
        super();

        this.title = title;
    }

    private title:string;

    _applyTo(element: HTMLElement): void
    {
        element.style.border = '1px solid black';
        element.style.position = 'relative';
        element.style.padding = '5px';
        const titleLabel = document.createElement('span');
        titleLabel.textContent = this.title;
        //titleLabel.style.position = 'absolute';
        titleLabel.style.top = '-10px';
        titleLabel.style.left = '10px';
        titleLabel.style.backgroundColor = 'white';
        element.appendChild(titleLabel);
    }
}