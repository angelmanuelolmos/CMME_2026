
import {Component } from '../../java/awt/Component'; 

import {JComponent } from './JComponent'; 
export class Box extends JComponent 
{ 
	private constructor(axis: 'horizontal' | 'vertical') {
        super("div", ["Box"]);
        this._getHTMLElement().style.display = 'flex';
        this._getHTMLElement().style.flexDirection = axis === 'horizontal' ? 'row' : 'column';
    }

    public static createHorizontalBox(): Box {
        return new Box('horizontal');
    }

    public static createVerticalBox(): Box {
        return new Box('vertical');
    }

    

    public static createVerticalStrut(height: number): Component {
        const strut = new Component("div", ["Component"]);
        strut._getHTMLElement().style.height = `${height}px`;
        strut._getHTMLElement().style.flex = 'none';
        return strut;
    }

    public static createHorizontalStrut(width: number): Component {
        const strut = new Component("div", ["Component"]);
        strut._getHTMLElement().style.width = `${width}px`;
        strut._getHTMLElement().style.flex = 'none';
        return strut;
    }

    public static createHorizontalGlue(): Component {
        const glue = new Component('div',["Component"]);
        glue._getHTMLElement().style.flexGrow = '1';
        return glue;
    }

    //new
    public static createGlue():Component
    {
        const glue = new Component("div", ["Component"]);
        glue._getHTMLElement().style.flexGrow = '1';  // Allow it to grow in both directions
        glue._getHTMLElement().style.flexShrink = '1'; // Allow it to shrink if needed
        glue._getHTMLElement().style.flexBasis = '0';  // Allow it to take up available space
        return glue;
    }
} 

