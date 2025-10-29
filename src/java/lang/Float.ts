export class Float {
    static readonly MAX_VALUE = 3.4028235e38;  // Java Float.MAX_VALUE
    static readonly MIN_VALUE = 1.4e-45;       // Java Float.MIN_VALUE
    static readonly NaN = NaN;
    static readonly POSITIVE_INFINITY = Infinity;
    static readonly NEGATIVE_INFINITY = -Infinity;

    private value: number;

    constructor(value: number | string) {
        this.value = typeof value === "string" ? Float.parseFloat(value) : Math.fround(value);
    }

    static parseFloat(s: string): number {
        let result = parseFloat(s);
        if (isNaN(result)) {
            throw new Error(`NumberFormatException: For input string "${s}"`);
        }
        return Math.fround(result); // Ensure 32-bit float precision
    }

    static valueOf(s: string): Float {
        return new Float(Float.parseFloat(s));
    }

    static isNaN(v: number): boolean {
        return isNaN(v);
    }

    static toString(v: number): string {
        return v.toString();
    }

    floatValue(): number {
        return this.value;
    }

    toString(): string {
        return this.value.toString();
    }
}
