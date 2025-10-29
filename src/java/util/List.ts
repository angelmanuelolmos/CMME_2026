
import { ListIterator } from "./ListIterator";
import { Collection } from "./Collection";

export interface List<T> extends Collection<T>, Iterable<T> {
    add(element: T): boolean;
    get(index: number): T;
    size(): number;
    remove(index: number): T;
    contains(element: T): boolean;
    isEmpty(): boolean;
 
    clear(): void;
    listIterator(index?: number): ListIterator<T>;

    toArray():Array<T>;
}