
import {GridBagConstraints } from './GridBagConstraints'; 

import {Container } from './Container'; 

import {Component } from './Component'; 

export class GridBagLayout
{ 
	public constructor ( ) 
	{ 
		
	} 
	layoutContainer(container: Container): void
    {
        var constraints:any[] = container._getConstraints();
		var components:Array<Component> = container.getComponents();

        // Find max grid size
        let maxRow = 0, maxCol = 0;
        for (let c of constraints)
        {
            if( ! (c instanceof GridBagConstraints))
                continue;

            maxRow = Math.max(maxRow, c.gridy);
            maxCol = Math.max(maxCol, c.gridx + (c.gridwidth === GridBagConstraints.REMAINDER ? 1 : c.gridwidth));
        }
 
        // Create a CSS Grid container
        const elem = container._getHTMLElement();
        elem.style.display = "grid";
        elem.style.gridTemplateColumns = `repeat(${maxCol}, auto)`;
        elem.style.gridTemplateRows = `repeat(${maxRow + 1}, auto)`;
 
        // Layout components
        for (let i = 0; i < components.length; i++)
        {
            const component = components[i];
            const c = constraints[i];
 
            if( ! (c instanceof GridBagConstraints ))
                continue;

            const childElem = component._getHTMLElement();
            childElem.style.gridColumnStart = "" + (c.gridx + 1);
            childElem.style.gridRowStart    = "" + (c.gridy + 1);
 
            // Handle grid width
            if (c.gridwidth === GridBagConstraints.REMAINDER)
            {
                childElem.style.gridColumnEnd = "-1"; // Span until the end
            } 
            
            else if (c.gridwidth > 1) //bug if constraint changes as property will remain
            {
                childElem.style.gridColumnEnd = `span ${c.gridwidth}`;
            }
 
             // Handle weightx (flex grow)
            if (c.weightx > 0)
            {
                childElem.style.flexGrow = `${c.weightx}`;
            }
 
            // Handle anchor (only WEST supported)
            if (c.anchor === GridBagConstraints.WEST)
            {
                childElem.style.justifySelf = "start";
            }

	    }
    } 

}

