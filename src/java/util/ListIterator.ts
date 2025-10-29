import { Iterator } from "./Iterator"

export interface ListIterator<T> extends Iterator<T> {
  hasPrevious(): boolean;
  previous(): T;
  nextIndex(): number;
  previousIndex(): number;
  set(element: T): void;
  add(element: T): void;
}
