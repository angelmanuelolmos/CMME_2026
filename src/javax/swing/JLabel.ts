
import {Component } from '../../java/awt/Component'; 

import {Icon } from './Icon'; 

import {SwingConstants } from './SwingConstants'; 
import {JComponent } from './JComponent'; 

import { isString } from '../../js';
import { ImageIcon } from './ImageIcon';
import { BufferedImage } from '../../java/awt/image/BufferedImage';
export class JLabel extends JComponent implements SwingConstants 
{ 
	public constructor ( ); 
	public constructor(imageIcon:ImageIcon);
	public constructor (arg0: string ,arg1: number ); 
	public constructor (arg0: string ); 
	public constructor (arg0: any = undefined ,arg1: any = undefined ) 
	{ 
		super("div", ["JLabel"]);
		
		if (arg0 === undefined && arg1 === undefined )
		{
			this.setText("");
		}

		else
		{
			if (isString(arg0) )
			{
				this.setText(arg0);
			}

			else if( arg0 instanceof ImageIcon )
			{
				this.setIcon(arg0);
			}

			else
			{
				debugger;
			}
		}
	} 
	
	private text:string = "";

	public setText (arg0: string ): void 
	{ 
		this.text = arg0;
		this._getHTMLElement().textContent = arg0;
	} 
	
	public setHorizontalAlignment (arg0: number ): void 
	{ 
		if( arg0 == SwingConstants.CENTER )
		{
			this._getHTMLElement().style.textAlign = "center";
		}

		else if( arg0 == SwingConstants.RIGHT)
		{
			this._getHTMLElement().style.textAlign = "right";
		}

		else
		{
			debugger;
		}
	} 

	public setLabelFor(c:Component):void
	{
		//throw new Error();
	}

	private icon:Icon;
	public setIcon(icon:Icon):void
	{
		if(! (icon instanceof ImageIcon) )
			debugger;

		this.icon = icon;
		this._getHTMLElement().innerHTML = '';
		const img = document.createElement('img');
		img.src = ((icon as ImageIcon).getImage() as BufferedImage).canvas.toDataURL();
		img.style.maxWidth = '24px';
		img.style.maxHeight = '24px';
		img.style.marginRight = this.text ? '5px' : '0';
		this._getHTMLElement().appendChild(img);
		if (this.text) {
			this._getHTMLElement().appendChild(document.createTextNode(this.text));
		}
	
	}
	
	
} 

