
import {Component } from '../../java/awt/Component'; 

import {MenuElement } from './MenuElement'; 

import {JMenuItem } from './JMenuItem'; 

export class JMenu extends JMenuItem implements MenuElement 
{ 
	private menuItems: JMenuItem[] = [];
    private menuElement: HTMLDivElement;

    private static currentOpenMenu: JMenu | null = null;

    constructor(label: string)
	{
        super(label, "button", ["JMenu"]);
        this.menuElement = document.createElement("div");
        this.menuElement.style.display = "none";
        this.menuElement.style.position = "absolute";
        this.menuElement.style.background = "white";
        this.menuElement.style.border = "1px solid black";
        this.menuElement.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.2)";
        this.menuElement.style.padding = "5px 0";
        this.menuElement.style.zIndex= "99999";

       /* this._getHTMLElement().addEventListener("click", (event) => {
            this.toggleMenu();
            event.stopPropagation();
        });*/

       // document.addEventListener("mousedown", (event) => this.handleOutsideClick(event));
  
    }

  


 
    protected addImpl( comp:Component,  constraints:any, index:number):void
    {
        this.menuItems.push(comp as JMenuItem);
        this.menuElement.appendChild(comp._getHTMLElement());
        (comp as any).parentMenu = this;
    }

    protected removeImpl(component:Component):void
    {
        var i:number = this.menuItems.indexOf(component as JMenuItem);

        if( i == -1 )
            debugger;

        this.menuItems.splice(i, 1);
        this.menuElement.removeChild(component._getHTMLElement());
    }

    public addSeparator(): void {
        const separator = document.createElement("div");
        separator.style.borderTop = "1px solid #ccc";
        separator.style.margin = "5px 0";
        this.menuElement.appendChild(separator);
    }

    private toggleMenu(): void
    {
        if( this.isOpen() )
            this.closeMenu();

        else
            this.openMenu();
    }

    private isOpen():boolean
    {
        return this.menuElement.style.display === "block";
    }

    private openMenu():void
    {
        if (JMenu.currentOpenMenu !== this) {
            JMenu.currentOpenMenu?.closeMenu(); // Close any other open menu
            JMenu.currentOpenMenu = this; // Set this as the currently open menu
        }

        if (!this.isOpen()) {
            document.body.appendChild(this.menuElement);
            const rect = this._getHTMLElement().getBoundingClientRect();
            this.menuElement.style.left = `${rect.left}px`;
            this.menuElement.style.top = `${rect.bottom}px`;
            this.menuElement.style.display = "block";
        }
    }

    private closeMenu():void
    {
        if( this.isOpen() )
        {
            this.menuElement.style.display = "none";
            document.body.removeChild(this.menuElement);
        }
    }

    private childMenuClicked():void
    {
        this.closeMenu();

        if( (this as any).parentMenu !== undefined ) 
            (this as any).parentMenu.childMenuClicked();
    }

    protected clickPerformed():void
    {
        if( this.isOpen() )
        {
            this.closeMenu();
        }

        else
        {
            this.openMenu();
        }


        //if( (this as any).parentMenu !== undefined ) 
          //  (this as any).parentMenu.childMenuClicked();
    }

    private handleOutsideClick(event: MouseEvent): void {
        if (!this._getHTMLElement().contains(event.target as Node) &&
            !this.menuElement.contains(event.target as Node)) {
            this.menuElement.style.display = "none";
        }
    }
}




 /* public add(arg0: JMenuItem): JMenuItem {
        this.menuItems.push(arg0);
        this.menuElement.appendChild(arg0.getHTMLElement());
        return arg0;
    }*/