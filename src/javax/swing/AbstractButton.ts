
import {Insets } from '../../java/awt/Insets'; 

import {ActionEvent } from '../../java/awt/event/ActionEvent'; 
import {ItemEvent } from '../../java/awt/event/ItemEvent'; 
import {ItemListener } from '../../java/awt/event/ItemListener'; 

import {ActionListener } from '../../java/awt/event/ActionListener'; 

import {SwingConstants } from './SwingConstants'; 
import {JComponent } from './JComponent'; 
import { ImageIcon } from './ImageIcon';
import { BufferedImage } from '../../java/awt/image/BufferedImage';
export abstract class AbstractButton extends JComponent implements SwingConstants 
{ 
	private actionListeners: ActionListener[] = [];
    private itemListeners: ItemListener[] = [];
    private actionCommand?: string;
    private selected: boolean = false;
    private text?: string;
    private icon2?: ImageIcon;

    constructor(tag:string, arrClass:Array<string>) {
        //super('button', ["AbstractButton"]);
        super(tag, arrClass.concat("AbstractButton"));
        
        this._getHTMLElement().addEventListener('click', (event) => { this.doClick(); event.stopPropagation(); } );
    }

    public addActionListener(listener: ActionListener): void {
        this.actionListeners.push(listener);
    }

    public removeActionListener(listener: ActionListener): void {
        this.actionListeners = this.actionListeners.filter(l => l !== listener);
    }

    public setActionCommand(command: string): void {
        this.actionCommand = command;
    }

    public setMnemonic(key: number): void
    {
        const mnemonicChar = String.fromCharCode(key).toLowerCase();
        this._getHTMLElement().setAttribute("accesskey", mnemonicChar);
    }

    public getText():string
    {
        return this.text;
    }


    public setText(text: string): void {
        this.text = text;
        this._getHTMLElement().textContent = text;
    }

    public doClick(): void {
        this.actionListeners.forEach(listener => listener.actionPerformed(new ActionEvent(this.actionCommand, this) ));

        this.clickPerformed();
    }

    protected clickPerformed():void
    {

    }


    public setIcon(icon: ImageIcon): void {
        this.icon2 = icon;
        this._getHTMLElement().innerHTML = '';
        const img = document.createElement('img');
        img.src = (icon.getImage() as BufferedImage).canvas.toDataURL();
        img.style.maxWidth = '24px';
        img.style.maxHeight = '24px';
        img.style.marginRight = this.text ? '5px' : '0';
        this._getHTMLElement().appendChild(img);
        if (this.text) {
            this._getHTMLElement().appendChild(document.createTextNode(this.text));
        }
    }

    public setSelected(selected: boolean): void {
        this.selected = selected;
    }

    public isSelected(): boolean {
        return this.selected;
    }

    public setEnabled(enabled: boolean): void {
        (this._getHTMLElement() as HTMLButtonElement).disabled = !enabled;
    }

    public setMargin(arg0: Insets): void {
        //this.margin = arg0;
        this._getHTMLElement().style.padding = `${arg0.top}px ${arg0.right}px ${arg0.bottom}px ${arg0.left}px`;
   
    }

    public addItemListener(listener: ItemListener): void {
        this.itemListeners.push(listener);
    }

    public removeItemListener(listener: ItemListener): void {
        this.itemListeners = this.itemListeners.filter(l => l !== listener);
    }
	
    protected fireItemEvent(event: ItemEvent): void
	{
        this.itemListeners.forEach(listener => listener.itemStateChanged(event));
    }
} 

