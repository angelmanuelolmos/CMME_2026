
import { Iterator as JavaIterator } from "./Iterator";

export interface Iterable<T>
{
    iterator(): JavaIterator<T>;
}