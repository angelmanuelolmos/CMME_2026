import { MidiChannel } from "./MidiChannel";
import { Receiver } from "./Receiver";


export class Synthesizer
{
    public open():void
    {
        throw new Error();
    }

    public getReceiver():Receiver
    {
        throw new Error();
    }

    getChannels():MidiChannel[]
    {
        throw new Error();
    }
}