
import {LayoutManager } from './LayoutManager'; 

import {Component } from './Component'; 

import { isNumber, isString } from '../../js';

import { GridBagConstraints } from './GridBagConstraints';
export class Container extends Component 
{ 
	public constructor(tag:string, arrClass:Array<string>)	
	{
		super(tag, arrClass.concat(["container"]));
	}


	protected paint(): void
    {   
        super.paint();

		for(var component of this.children.keys())
			component.repaint();
    }

	private layout: LayoutManager = null;

    setLayout(layout: LayoutManager): void {
        this.layout = layout;
        this.layout.layoutContainer(this);
    }

	protected children: Map<Component, string | undefined> = new Map();

	public getComponents():Component[]
	{
		return  Array.from(this.children.keys());
	}

	public _getConstraints():any[]
	{
		return  Array.from(this.children.values());
	}


	add(comp:Component):Component; //Appends the specified component to the end of this container.
	add(comp:Component, index:number):Component; //Adds the specified component to this container at the given position.
	add(comp:Component, constraints:any):void; //Adds the specified component to the end of this container.
	add(comp:Component, constraints:any, index:number):void; // Adds the specified component to this container with the specified constraints at the specified index.
	add(name:string, comp:Component):Component; //Adds the specified component to this container.
	add(a:any, b:any = undefined, c:any = undefined):Component
	{
		var comp:Component;
		var constraints:any = undefined;
		var index:number = 0;

		if( isString(a) )
		{
			if( b === undefined )
				throw new Error();

			constraints = a;
			comp = b;
		}

		else
		{
			comp = a;

			if( b !== undefined )
			{
				if( isNumber(b) )
					index = b;

				else
				{
					constraints = b;

					if( c!==undefined && isNumber(c) )
						index = c;
				}
			}
		}

		if( constraints instanceof GridBagConstraints )
			constraints = constraints._copy();

		this.children.set(comp, constraints);

		this.addImpl(comp, constraints, index);

		if (this.layout)
            this.layout.layoutContainer(this);

        return comp;
	}
	
	protected addImpl( comp:Component,  constraints:any, index:number):void
    {
        this._getHTMLElement().appendChild(comp._getHTMLElement());
    }

    protected removeImpl(component:Component):void
    {
        this._getHTMLElement().removeChild(component._getHTMLElement());
    }

    public remove (component: Component ): void 
    { 
        this.children.delete(component);

        this.removeImpl(component);

		if (this.layout)
            this.layout.layoutContainer(this);
        
    } 
    
	public removeAll ( ): void 
	{ 
		var allChildren:Array<Component> = Array.from(this.children.keys());

		while(allChildren.length != 0)
			this.remove(allChildren.pop());
	} 
	
	public validate ( ): void 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	
	
	
} 

