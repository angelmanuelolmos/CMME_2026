
import {JComponent } from './JComponent'; 
export class JViewport extends JComponent
{ 
	private content: HTMLElement;
    private viewportElement: HTMLElement;

    constructor() {
        super("div", ["JViewport"]);
        this.viewportElement = document.createElement('div');
        this.viewportElement.style.width = '100%';
        this.viewportElement.style.height = '100%';
        this.viewportElement.style.overflow = 'auto'; // enable scrolling

        // Append to the root element of JComponent
        this._getHTMLElement().appendChild(this.viewportElement);
    }

    public setContent(content: JComponent): void {
        this.content = content._getHTMLElement();
        this.viewportElement.appendChild(this.content);
    }

    

} 

