
import {Image } from '../../java/awt/Image'; 

import {Container } from '../../java/awt/Container'; 

import {JMenuBar } from './JMenuBar'; 
import {RootPaneContainer } from './RootPaneContainer'; 
import {WindowConstants } from './WindowConstants'; 
import {Frame } from '../../java/awt/Frame'; 
import { JPanel } from './JPanel';
import { Window } from '../../java/awt/Window';
export class JFrame extends Frame implements WindowConstants, RootPaneContainer 
{ 
	static DO_NOTHING_ON_CLOSE: number = 0;
    private contentPane: Container;
    private menuBar?: JMenuBar;
    private iconImage?: Image;
    private titleBar:HTMLDivElement;
    private closeButton: HTMLButtonElement;

    constructor(arg0?: string) {
        super("div", ["JFrame"]);
        this._getHTMLElement().style.position = 'absolute';
        this._getHTMLElement().style.border = '1px solid black';
        this._getHTMLElement().style.padding = '10px';
        this._getHTMLElement().style.background = 'white';
        this._getHTMLElement().style.display = 'flex';
        this._getHTMLElement().style.flexDirection = 'column';

        this.contentPane = new JPanel();
        this.contentPane._getHTMLElement().style.flex = '1';

        this.titleBar = document.createElement('div');
        this.closeButton = document.createElement('button');
        JFrame._addTitleBarWithCloseButton(this, this.titleBar, this.closeButton, arg0, ()=>this.closeWindow() , true);
        this._getHTMLElement().appendChild(this.titleBar);

        //this._getHTMLElement().appendChild(this.contentPane._getHTMLElement());
        this.add(this.contentPane);
    }

    
    public static _addTitleBarWithCloseButton(window:Window, titleBar:HTMLDivElement, closeButton:HTMLButtonElement, title: string = '', fCloseWindow:Function, allowDrag:boolean):void
    {
        
        titleBar.textContent = title;
        titleBar.style.fontWeight = 'bold';
        titleBar.style.textAlign = 'center';
        titleBar.style.padding = '5px';
        titleBar.style.background = '#ddd';
        titleBar.style.position = 'relative';

        // Close Button
        
        closeButton.textContent = 'X';  // Close button label
       // closeButton.style.position = 'absolute';
        closeButton.style.right = '10px';
        closeButton.style.top = '5px';
        closeButton.style.border = 'none';
        closeButton.style.background = 'transparent';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';

        // Append title bar and close button
        titleBar.appendChild(closeButton);
        

        // Add event listener for the close button
        closeButton.addEventListener('click', () => fCloseWindow() );

        if( allowDrag )
            JFrame.setupDragging(window, titleBar);
    }

    private closeWindow(): void {
        // Logic to hide or remove the window
        this._getHTMLElement().style.display = 'none'; // Hide the window

        // Optionally you could remove the window entirely from the DOM
         this._getHTMLElement().remove();
        
        // Or send a message, perform cleanup, etc.
        console.log('Window closed');
    }

    private static setupDragging(window:Window, titleBar:HTMLDivElement): void
    {
        let startClientX = 0;
        let startClientY = 0;

        let startValueX = 0;
        let startValueY = 0;

        titleBar.addEventListener("mousedown", (event:MouseEvent) =>
        {
            startClientX = event.clientX;
            startClientY = event.clientY;

            startValueX = window._getLocationX();
            startValueY = window._getLocationY();

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);

            window.toFront();
        });

        const onMouseUp = () =>
        {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        const onMouseMove = (event: MouseEvent) =>
        {
            let deltaClientX = event.clientX - startClientX;
            let deltaClientY = event.clientY - startClientY;

            window.setLocation(startValueX + deltaClientX, startValueY + deltaClientY);
        };

        

        
    }
	

    public setDefaultCloseOperation(arg0: number): void {
        // Store behavior, could be used later when closing logic is implemented
    }

    public setJMenuBar(menuBar: JMenuBar): void {
        this.menuBar = menuBar;
        this._getHTMLElement().insertBefore(menuBar._getHTMLElement(), this.contentPane._getHTMLElement());
    }

    public getContentPane(): Container {
        return this.contentPane;
    }

    public setIconImage(image: Image): void {
        this.iconImage = image;
        // Would need logic to display the icon somewhere in UI
    }

    
	
} 

