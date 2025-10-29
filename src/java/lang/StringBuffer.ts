
export class StringBuffer 
{
    private buffer: string[];

    constructor(initial?: string) {
        this.buffer = initial ? [initial] : [];
    }

    append(str: string): this {
        this.buffer.push(str);
        return this;
    }

    insert(index: number, str: string): this {
        const current = this.toString();
        this.buffer = [current.slice(0, index), str, current.slice(index)];
        return this;
    }

    replace(start: number, end: number, str: string): this {
        const current = this.toString();
        this.buffer = [current.slice(0, start), str, current.slice(end)];
        return this;
    }

    toString(): string {
        return this.buffer.join('');
    }
}