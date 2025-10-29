
import {JViewport } from './JViewport'; 

import {Component } from '../../java/awt/Component'; 

import {ScrollPaneConstants } from './ScrollPaneConstants'; 
import {JComponent } from './JComponent'; 
export class JScrollPane extends JComponent implements ScrollPaneConstants
{ 
    private viewport: JViewport;
    private content: JComponent;
    private hsbPolicy: number; // Horizontal scrollbar policy
    private vsbPolicy: number; // Vertical scrollbar policy

    public constructor(view:Component, vsbPolicy:number, hsbPolicy:number)
	public constructor (view: JComponent ) 
    public constructor (view: JComponent, a:any = undefined, b:any = undefined ) 
	{ 
		super("div", ["JScrollPane"]);
		
        this.content = view;

        if( arguments.length == 3 )
        {
            this.vsbPolicy = a;
            this.hsbPolicy = b;
        }
        
        else
        {
            this.vsbPolicy = JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED;
            this.hsbPolicy = JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED;
        }

        

		this.content = view;
        this._getHTMLElement().style.overflow = 'auto';
        this._getHTMLElement().style.display = 'block';
        this._getHTMLElement().style.width = '100%';
        this._getHTMLElement().style.height = '100%';
        this._getHTMLElement().style.border = '1px solid #ccc';

        this.viewport = new JViewport();
        this.viewport.setContent(this.content);

        this._getHTMLElement().appendChild(this.viewport._getHTMLElement());
   
	} 

	public getViewport ( ): JViewport 
	{ 
		return this.viewport;
	} 

    public static HORIZONTAL_SCROLLBAR_AS_NEEDED:number = 0;
    public static HORIZONTAL_SCROLLBAR_ALWAYS:number = 1;
    public static VERTICAL_SCROLLBAR_AS_NEEDED:number = 2;
    public static VERTICAL_SCROLLBAR_ALWAYS:number = 3;

    private applyScrollPolicies(): void {
        const viewportElement = this.viewport._getHTMLElement();

        if (this.vsbPolicy === JScrollPane.VERTICAL_SCROLLBAR_ALWAYS) {
            viewportElement.style.overflowY = 'scroll'; // Always show vertical scrollbar
        } else if (this.vsbPolicy === JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED) {
            viewportElement.style.overflowY = 'auto'; // Show vertical scrollbar only when needed
        }

        if (this.hsbPolicy === JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS) {
            viewportElement.style.overflowX = 'scroll'; // Always show horizontal scrollbar
        } else if (this.hsbPolicy === JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED) {
            viewportElement.style.overflowX = 'auto'; // Show horizontal scrollbar only when needed
        }
    }
	
    private initialize(): void {
        this.applyScrollPolicies();
    }

    // After the content is added, call this to update the scroll policies
    public setContent(view: JComponent): void {
        this.content = view;
        this.viewport.setContent(view);
        this.initialize(); // Update the scroll policies
    }
	
} 

