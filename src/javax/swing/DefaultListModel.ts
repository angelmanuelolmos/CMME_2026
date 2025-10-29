
import {AbstractListModel } from './AbstractListModel'; 
export class DefaultListModel<E> extends AbstractListModel< E> 
{ 
	private items: E[] = [];

    public constructor() {
        super();
    }

    public getSize(): number {
        return this.items.length;
    }

    public insertElementAt(element: E, index: number): void {
        if (index < 0 || index > this.items.length) {
            throw new RangeError("Index out of bounds");
        }
        this.items.splice(index, 0, element);
    }

    public removeElementAt(index: number): void {
        if (index < 0 || index >= this.items.length) {
            throw new RangeError("Index out of bounds");
        }
        this.items.splice(index, 1);
    }

    public getElementAt(index: number): E {
        if (index < 0 || index >= this.items.length) {
            throw new RangeError("Index out of bounds");
        }
        return this.items[index];
    }
} 

