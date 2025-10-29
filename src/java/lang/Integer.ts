import { NumberFormatException } from "./NumberFormatException";

export class Integer {
    private value: number;

    constructor(value: number | string) {
        if (typeof value === "string") {
            this.value = Integer.parseInt(value);
        } else {
            this.value = Math.trunc(value); // Ensure it's an integer
        }
    }

    static toString(i: number, radix: number = 10): string {
        if (radix < 2 || radix > 36) {
            throw new Error(`IllegalArgumentException: radix ${radix} out of range`);
        }
        return Math.trunc(i).toString(radix);
    }

    toString(radix: number = 10): string {
        return Integer.toString(this.value, radix);
    }

    static parseInt(s: string, radix: number = 10): number {
        let result = parseInt(s, radix);
        if (isNaN(result)) {
           // throw new Error(`NumberFormatException: For input string "${s}"`);
           throw new  NumberFormatException();
        }
        return result;
    }

    intValue(): number {
        return this.value;
    }
}
