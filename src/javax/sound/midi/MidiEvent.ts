import { MidiMessage } from "./MidiMessage";


export class MidiEvent
{
    private message: MidiMessage;
    private tick: number;

    constructor(message: MidiMessage, tick: number) {
        this.message = message;
        this.tick = tick;
    }

    public getMessage(): MidiMessage {
        return this.message;
    }

    public getTick(): number {
        return this.tick;
    }
}