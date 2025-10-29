
import {Collection} from "./Collection";

import { Iterator as JavaIterator } from "./Iterator";

export abstract class AbstractCollection<E> implements Collection<E>
{
    abstract size(): number;

    abstract iterator(): JavaIterator<E>;

    [Symbol.iterator](): Iterator<E, any, any>
    {
        throw new Error("Method not implemented.");
    }
   // protected elements: E[] = [];
  
   // constructor() {}
  
   // abstract size(): number;
  
   // iterator(): JavaIterator<E> {
   //   return this.elements.values();
   // }
}