
import { List } from "./List";
import { Iterator as JavaIterator } from "./Iterator";
import { ListIterator } from "./ListIterator";
import { AbstractList } from "./AbstractList";
import { Collection } from "./Collection";

export class ArrayList<T> extends AbstractList<T> implements List<T> {
    private elements: T[] = [];

    constructor();
    constructor(collection: Collection<T>);
    constructor(initialCapacity:number);
    constructor(param?: number | Collection<T>)
    {
        super();

        if (typeof param === "number")
            this.elements = new Array(/*param*/); //capacity not size
         
        else if (param) // Initialize from collection
        {
          this.elements = Array.from(param); //assumed to be ts iterable
        }
        
        else // Default constructor (empty array)
        {
            this.elements = [];
        }
      }

      toArray():T[]
    {
            throw new Error();
        }

      addAll(collection: Iterable<T>): boolean;
      addAll(index: number, collection: Iterable<T>): boolean;
      addAll(arg1: number | Iterable<T>, arg2?: Iterable<T>): boolean
      {
          if (typeof arg1 === "number" && arg2)
        {
              // Insert at specified index
              const index = arg1;
              const collection = arg2;
      
              if (index < 0 || index > this.elements.length) {
                  throw new Error("Index out of bounds");
              }
      
              const items = Array.from(collection);
              this.elements.splice(index, 0, ...items);
              return items.length > 0;
          } else {
              // Append to the end
              const collection = arg1 as Iterable<T>;
              const items = Array.from(collection);
              this.elements.push(...items);
              return items.length > 0;
          }
      }
       


    add(element: T): boolean;
    add(index: number, element: T): void;

    // Single implementation handling both cases
    add(arg1: number | T, arg2?: T): boolean {
        if (typeof arg1 === "number" && arg2 !== undefined) {
            // Overload: add(index, element)
            this.elements.splice(arg1, 0, arg2);
        } else {
            // Overload: add(element)
            this.elements.push(arg1 as T);
        }

        return true;
    }

    indexOf(element:T):number
    {
        return this.elements.indexOf(element);
    }

    get(index: number): T {
        if (index < 0 || index >= this.elements.length) {
            throw new Error("Index out of bounds");
        }
        return this.elements[index];
    }

    size(): number {
        return this.elements.length;
    }

    remove(index: number): T;
    remove(element: T): boolean;

    /** Single method implementation */
    remove(arg: number | T): T | boolean {
        if (typeof arg === "number") {
            // Remove by index
            if (arg < 0 || arg >= this.elements.length) {
                throw new Error("Index out of bounds");
            }
            return this.elements.splice(arg, 1)[0];
        } else {
            // Remove by element
            const index = this.elements.indexOf(arg);
            if (index !== -1) {
                this.elements.splice(index, 1);
                return true;
            }
            return false;
        }
    }

    contains(element: T): boolean {
        return this.elements.includes(element);
    }

    isEmpty(): boolean {
        return this.elements.length === 0;
    }

    clear(): void {
        this.elements = [];
    }

    iterator(): JavaIterator<T> {
        return this.listIterator(0);
    }

    listIterator(index: number = 0): ListIterator<T> {
        if (index < 0 || index > this.elements.length) {
            throw new Error("Index out of bounds");
        }

        let cursor = index;
        let lastReturnedIndex = -1;
        const elements = this.elements;

        return {
            hasNext(): boolean {
                return cursor < elements.length;
            },
            next(): T {
                if (!this.hasNext()) {
                    throw new Error("No such element");
                }
                lastReturnedIndex = cursor;
                return elements[cursor++];
            },
            hasPrevious(): boolean {
                return cursor > 0;
            },
            previous(): T {
                if (!this.hasPrevious()) {
                    throw new Error("No such element");
                }
                lastReturnedIndex = --cursor;
                return elements[cursor];
            },
            nextIndex(): number {
                return cursor;
            },
            previousIndex(): number {
                return cursor - 1;
            },
            remove(): void {
                if (lastReturnedIndex < 0) {
                    throw new Error("Illegal state: next() or previous() must be called before remove()");
                }
                elements.splice(lastReturnedIndex, 1);
                if (cursor > lastReturnedIndex) {
                    cursor--; // Adjust cursor after removal
                }
                lastReturnedIndex = -1;
            },
            set(element: T): void {
                if (lastReturnedIndex < 0) {
                    throw new Error("Illegal state: next() or previous() must be called before set()");
                }
                elements[lastReturnedIndex] = element;
            },
            add(element: T): void {
                elements.splice(cursor, 0, element);
                cursor++; // Move cursor forward
                lastReturnedIndex = -1;
            }
        };
    }

    // ✅ FIX: Implements TypeScript's iterator protocol
    [Symbol.iterator](): Iterator<T, T | undefined> {
        let iter = this.listIterator(0);
        return {
            next(): IteratorResult<T, T | undefined> {
                if (iter.hasNext()) {
                    return { value: iter.next(), done: false };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
}