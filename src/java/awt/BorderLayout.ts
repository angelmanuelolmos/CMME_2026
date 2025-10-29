
import {Container } from './Container'; 

import {Component } from './Component'; 

import {LayoutManager } from './LayoutManager'; 
import { isString } from '../../js';
export class BorderLayout implements LayoutManager
{ 
	public constructor ( ) 
	{ 
		
	} 
	
	public static SOUTH: string; 
	public static CENTER: string; 
    public static NORTH: string; 
	
	layoutContainer(container: Container): void {
        container._getHTMLElement().style.display = "grid";
        container._getHTMLElement().style.height = "100%";
        container._getHTMLElement().style.width = "100%";

		var constraints:any[] = container._getConstraints();
		var components:Array<Component> = container.getComponents();

		const iNorth:number  = constraints.findIndex(x => isString(x) && x.toLowerCase() == "north" );
        const iSouth:number  = constraints.findIndex(x => isString(x) && x.toLowerCase() == "south" );
        const iWest:number   = constraints.findIndex(x => isString(x) && x.toLowerCase() == "west" );
        const iEast:number   = constraints.findIndex(x => isString(x) && x.toLowerCase() == "east" );
        const iCenter:number = constraints.findIndex(x => isString(x) && x.toLowerCase() == "center" );

		const hasNorth  = iNorth  != -1;
        const hasSouth  = iSouth  != -1;
        const hasWest   = iWest   != -1;
        const hasEast   = iEast   != -1;
        const hasCenter = iCenter != -1;

        let rows = [];
        if (hasNorth) rows.push("auto"); // `North` takes its content height
        rows.push("1fr"); // `Center` (or just empty space)
        if (hasSouth) rows.push("auto"); // `South` takes its content height

        let cols = [];
        if (hasWest) cols.push("auto"); // `West` takes content width
        cols.push("1fr"); // `Center` expands
        if (hasEast) cols.push("auto"); // `East` takes content width

        container._getHTMLElement().style.gridTemplateRows = rows.join(" ");
        container._getHTMLElement().style.gridTemplateColumns = cols.join(" ");

        // Add components to grid
        if (hasNorth) {
            const northElem = components[iNorth]._getHTMLElement();
            northElem.style.gridColumn = "1 / -1";
        }

        if (hasWest) {
            const westElem = components[iWest]._getHTMLElement();
            westElem.style.gridRow = "2";
        }

        if (hasCenter) {
            const centerElem = components[iCenter]._getHTMLElement();
            centerElem.style.gridRow = hasNorth ? "2" : "1";
            centerElem.style.gridColumn = hasWest ? "2" : "1";
        }

        if (hasEast) {
            const eastElem = components[iEast]._getHTMLElement();
            eastElem.style.gridRow = "2";
        }

        if (hasSouth) {
            const southElem = components[iSouth]._getHTMLElement();
            southElem.style.gridColumn = "1 / -1";
        }

    }
} 

