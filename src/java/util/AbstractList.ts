import {AbstractCollection} from "./AbstractCollection";
import { List } from "./List";
import { ListIterator } from "./ListIterator";

export abstract class AbstractList<E> extends AbstractCollection<E> implements List<E> {
    constructor() {
      super();
    }
    abstract toArray(): E[];

    abstract add(element: E): boolean;

    abstract get(index: number): E 
    abstract remove(index: number): E 
    abstract contains(element: E): boolean 
    abstract isEmpty(): boolean 
    abstract clear(): void 

    abstract listIterator(index?: number): ListIterator<E>;
  
   // abstract get(index: number): E;
   // abstract add(element: E): void;
}