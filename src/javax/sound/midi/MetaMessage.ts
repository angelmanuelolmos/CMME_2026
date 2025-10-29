
import { MidiMessage } from "./MidiMessage";

export class MetaMessage extends MidiMessage
{
    private type: number;
    private data: number[];
    private length: number;

    public constructor() {
        super();
        this.type = 0;
        this.data = [];
        this.length = 0;
    }

    public setMessage(type: number, data: number[], length: number): void {
        this.type = type;
        this.data = data;
        this.length = length;
    }

    public getType(): number {
        return this.type;
    }

    public getData(): number[] {
        return this.data;
    }
}