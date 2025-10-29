
import {Container } from '../../java/awt/Container'; 

import {LayoutManager } from '../../java/awt/LayoutManager'; 
export class BoxLayout implements LayoutManager 
{ 
	public static X_AXIS: number = 0;
    public static Y_AXIS: number = 1;
    private axis: number;

    constructor(arg0: Container, arg1: number) {
        this.axis = arg1;
        arg0._getHTMLElement().style.display = "flex";
        arg0._getHTMLElement().style.flexDirection = this.axis === BoxLayout.X_AXIS ? "row" : "column";
    }

    layoutContainer(container: Container): void {
        container._getHTMLElement().style.display = "flex";
        container._getHTMLElement().style.flexDirection = this.axis === BoxLayout.X_AXIS ? "row" : "column";
        container._getHTMLElement().style.alignItems = "flex-start";
    }
} 

