import { List } from "./List";
import { ListIterator } from "./ListIterator";

import { Iterator as JavaIterator } from "./Iterator";


/** Internal node structure */
class Node<T> 
{
    constructor(
        public value: T,
        public next: Node<T> | null = null,
        public prev: Node<T> | null = null
    ) {}
}

export class LinkedList<T> implements List<T> {
    private head: Node<T> | null = null;
    private tail: Node<T> | null = null;
    private _size: number = 0;

    constructor();
    constructor(collection: Iterable<T>);
    constructor(collection?: Iterable<T>) {
        if (collection) this.addAll(collection);
    }

    subList(fromIndex: number, toIndex: number): List<T> {
        if (fromIndex < 0 || toIndex > this._size || fromIndex > toIndex) {
            throw new Error("IndexOutOfBoundsException: Invalid range");
        }
    
        const sublist = new LinkedList<T>();
        let current = this.getNode(fromIndex);
        
        for (let i = fromIndex; i < toIndex; i++) {
            if (!current) break;
            sublist.add(current.value);
            current = current.next;
        }
    
        return sublist;
    }

    toArray():T[]
    {
        throw new Error();
    }
    
    addAll(collection: Iterable<T>): boolean {
        let added = false;
        for (const element of collection) {
            this.add(element);
            added = true;
        }
        return added;
    }
    
    removeLast(): T {
        if (!this.tail) {
            throw new Error("NoSuchElementException: LinkedList is empty");
        }
    
        const value = this.tail.value;
    
        if (this.tail.prev) {
            this.tail.prev.next = null;
        } else {
            this.head = null;
        }
    
        this.tail = this.tail.prev;
        this._size--;
    
        return value;
    }
    
    getFirst(): T {
        if (!this.head) {
            throw new Error("NoSuchElementException: LinkedList is empty");
        }
        return this.head.value;
    }

    getLast(): T {
        if (!this.tail) {
            throw new Error("NoSuchElementException: LinkedList is empty");
        }
        return this.tail.value;
    }

    size(): number {
        return this._size;
    }

    isEmpty(): boolean {
        return this._size === 0;
    }

    clear(): void {
        this.head = null;
        this.tail = null;
        this._size = 0;
    }

    add(element: T): boolean;
    add(index: number, element: T): void;

    add(arg1: number | T, arg2?: T): boolean | void {
        if (typeof arg1 === "number" && arg2 !== undefined) {
            const index = arg1;
            const element = arg2;

            if (index < 0 || index > this._size) {
                throw new Error("Index out of bounds");
            }

            const newNode = new Node(element);

            if (index === 0) {
                if (!this.head) {
                    this.head = this.tail = newNode;
                } else {
                    newNode.next = this.head;
                    this.head.prev = newNode;
                    this.head = newNode;
                }
            } else if (index === this._size) {
                this.add(element);
                return;
            } else {
                let current = this.getNode(index);
                newNode.prev = current!.prev;
                newNode.next = current;
                current!.prev!.next = newNode;
                current!.prev = newNode;
            }

            this._size++;
        } else {
            const element = arg1 as T;
            const newNode = new Node(element);

            if (!this.tail) {
                this.head = this.tail = newNode;
            } else {
                this.tail.next = newNode;
                newNode.prev = this.tail;
                this.tail = newNode;
            }

            this._size++;
            return true;
        }
    }

    get(index: number): T {
        const node = this.getNode(index);
        if (!node) throw new Error("Index out of bounds");
        return node.value;
    }

    remove(index: number): T;
    remove(element: T): boolean;

    remove(arg: number | T): T | boolean {
        if (typeof arg === "number") {
            if (arg < 0 || arg >= this._size) {
                throw new Error("Index out of bounds");
            }
            
            let current = this.getNode(arg);
            if (!current) throw new Error("Index out of bounds");
            
            if (current.prev) current.prev.next = current.next;
            if (current.next) current.next.prev = current.prev;
            if (current === this.head) this.head = current.next;
            if (current === this.tail) this.tail = current.prev;
            
            this._size--;
            return current.value;
        } else {
            let current = this.head;
            while (current) {
                if (current.value === arg) {
                    if (current.prev) current.prev.next = current.next;
                    else this.head = current.next;
                    
                    if (current.next) current.next.prev = current.prev;
                    else this.tail = current.prev;
                    
                    this._size--;
                    return true;
                }
                current = current.next;
            }
            return false;
        }
    }

    private getNode(index: number): Node<T> | null {
        if (index < 0 || index >= this._size) return null;
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current!.next;
        }
        return current;
    }

    contains(element: T): boolean {
        return this.indexOf(element) !== -1;
    }

    indexOf(element: T): number {
        let current = this.head;
        let index = 0;
        while (current) {
            if (current.value === element) return index;
            current = current.next;
            index++;
        }
        return -1;
    }

    /** Returns a Java-like list iterator */
    listIterator(index: number = 0): ListIterator<T> {
        if (index < 0 || index > this._size) throw new Error("Index out of bounds");

        let current = this.getNode(index);
        let cursor = index;
        let lastReturned: Node<T> | null = null;

        return {
            hasNext(): boolean {
                return cursor < this._size;
            },
            next(): T {
                if (!this.hasNext()) throw new Error("No such element");
                lastReturned = current;
                if (current) current = current.next;
                cursor++;
                return lastReturned!.value;
            },
            hasPrevious(): boolean {
                return cursor > 0;
            },
            previous(): T {
                if (!this.hasPrevious()) throw new Error("No such element");
                if (current) current = current.prev;
                cursor--;
                lastReturned = current;
                return lastReturned!.value;
            },
            nextIndex(): number {
                return cursor;
            },
            previousIndex(): number {
                return cursor - 1;
            },
            remove(): void {
                if (!lastReturned) throw new Error("Illegal state: next() or previous() must be called before remove()");
                if (lastReturned.prev) lastReturned.prev.next = lastReturned.next;
                if (lastReturned.next) lastReturned.next.prev = lastReturned.prev;
                if (lastReturned === this.head) this.head = lastReturned.next;
                if (lastReturned === this.tail) this.tail = lastReturned.prev;
                this._size--;
                lastReturned = null;
            },
            set(element: T): void {
                if (!lastReturned) throw new Error("Illegal state: next() or previous() must be called before set()");
                lastReturned.value = element;
            },
            add(element: T): void {
                const newNode = new this.Node(element);
                if (!current) {
                    this.head = this.tail = newNode;
                } else {
                    newNode.next = current;
                    newNode.prev = current.prev;
                    if (current.prev) current.prev.next = newNode;
                    current.prev = newNode;
                    if (cursor === 0) this.head = newNode;
                }
                cursor++;
                this._size++;
                lastReturned = null;
            }
        };
    }

    iterator(): JavaIterator<T> {
        let current = this.head;
        let lastReturned: Node<T> | null = null;

        return {
            hasNext(): boolean {
                return current !== null;
            },
            next(): T {
                if (!current) throw new Error("NoSuchElementException: No more elements");
                lastReturned = current;
                const value = current.value;
                current = current.next;
                return value;
            },
            remove(): void {
                if (!lastReturned) throw new Error("IllegalStateException: next() must be called before remove()");
                if (lastReturned.prev) lastReturned.prev.next = lastReturned.next;
                if (lastReturned.next) lastReturned.next.prev = lastReturned.prev;
                if (lastReturned === this.head) this.head = lastReturned.next;
                if (lastReturned === this.tail) this.tail = lastReturned.prev;
                this._size--;
                lastReturned = null;
            }
        };
    }

    /** Implements TypeScript's iterator protocol for `for...of` support */
    [Symbol.iterator](): Iterator<T, T | undefined> {
        let iter = this.listIterator(0);
        return {
            next(): IteratorResult<T, T | undefined> {
                return iter.hasNext() ? { value: iter.next(), done: false } : { value: undefined, done: true };
            }
        };
    }
}
