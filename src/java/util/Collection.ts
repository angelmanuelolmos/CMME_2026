import { Iterator as JavaIterator } from "./Iterator";

export interface Collection<E> extends Iterable<E> 
{
    size(): number;
    iterator(): JavaIterator<E>;
  
}
  