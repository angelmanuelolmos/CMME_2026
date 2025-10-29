
import {ListIterator } from './ListIterator'; 

import {Iterator } from './Iterator'; 

import {List } from './List'; 
import {AbstractList } from './AbstractList'; 
export class Vector<E> extends AbstractList< E> implements List< E>
{
    add(element: E): boolean {
        throw new Error('Method not implemented.');
    }
    get(index: number): E {
        throw new Error('Method not implemented.');
    }
    remove(index: number): E {
        throw new Error('Method not implemented.');
    }
    contains(element: E): boolean {
        throw new Error('Method not implemented.');
    }
    isEmpty(): boolean {
        throw new Error('Method not implemented.');
    }
    clear(): void {
        throw new Error('Method not implemented.');
    }
    listIterator(index?: number): ListIterator<E> {
        throw new Error('Method not implemented.');
    }
    size(): number {
        throw new Error('Method not implemented.');
    }
    iterator(): Iterator<E> {
        throw new Error('Method not implemented.');
    } 
	
    toArray(): E[]
    {
        throw new Error('Method not implemented.');   
    }
} 

