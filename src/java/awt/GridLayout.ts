import { Component } from "./Component";
import { Container } from "./Container";
import { LayoutManager } from "./LayoutManager";


export class GridLayout implements LayoutManager
{
    public constructor(rows:number, cols:number)
    {
        this.rows = rows;
        this.cols = cols;
    }

    private rows: number;
    private cols: number;

    layoutContainer(container: Container): void
    {
        const components: Component[] = container.getComponents();
        const total = components.length;

        // Ensure the container uses a CSS grid
        const containerElem = container._getHTMLElement();
        containerElem.style.display = "grid";
        containerElem.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        containerElem.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        containerElem.style.gap = "0"; // Default no spacing

        // Ensure all components are positioned correctly
        for (let i = 0; i < total; i++) {
            const comp = components[i]._getHTMLElement();
            comp.style.gridRow = `${Math.floor(i / this.cols) + 1}`;
            comp.style.gridColumn = `${(i % this.cols) + 1}`;
        }
    }
    
}