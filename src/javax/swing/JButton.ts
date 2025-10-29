
import {Icon } from './Icon'; 

import {AbstractButton } from './AbstractButton'; 
import { ImageIcon } from './ImageIcon';
export class JButton extends AbstractButton  
{ 
	private icon?: ImageIcon;
    private label?: string;

	public constructor (arg0: string ); 
	public constructor (arg0: Icon ); 
	public constructor ( ); 
    constructor(arg0?: string | ImageIcon) {
        super("button", ["JButton"]);
        this._getHTMLElement().style.display = 'inline-flex';
        this._getHTMLElement().style.alignItems = 'center';
        this._getHTMLElement().style.justifyContent = 'center';
        this._getHTMLElement().style.padding = '5px 10px';
        this._getHTMLElement().style.border = '1px solid #ccc';
        this._getHTMLElement().style.background = '#f0f0f0';
        this._getHTMLElement().style.cursor = 'pointer';

        if (typeof arg0 === 'string') {
            this.setText(arg0);
        } else if (arg0 instanceof ImageIcon) {
            this.setIcon(arg0);
        }
    }
/*
    public setText(text: string): void {
        this.label = text;
        this._getHTMLElement().textContent = text;
    }

    public getText(): string | undefined {
        return this.label;
    }

    public setIcon(icon: ImageIcon): void {
        this.icon = icon;
        this.element.innerHTML = '';
        const img = document.createElement('img');
        img.src = (icon.getImage() as BufferedImage).canvas.toDataURL();
        img.style.maxWidth = '24px';
        img.style.maxHeight = '24px';
        img.style.marginRight = this.label ? '5px' : '0';
        this.element.appendChild(img);
        if (this.label) {
            this.element.appendChild(document.createTextNode(this.label));
        }
    }

    public getIcon(): ImageIcon | undefined {
        return this.icon;
    }*/
} 

