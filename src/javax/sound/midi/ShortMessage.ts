import { MidiMessage } from "./MidiMessage";


export class ShortMessage extends MidiMessage
{
    public static PROGRAM_CHANGE:number = 0xC0;
    public static NOTE_ON:number = 0x90;
    public static NOTE_OFF:number = 0x80;

    public constructor()
    {
        super();

        this.status = 0;
        this.data1 = 0;
        this.data2 = 0;
    }

    private status: number;
    private data1: number;
    private data2: number;

    public setMessage(status:number, data1:number, data2:number):void;
    public setMessage(command:number, channel:number, data1:number, data2:number):void
    public setMessage(a:number, b:number, c:number, d:number|undefined = undefined)
    {
        if( arguments.length == 3 )
        {
            this.status = a;
            this.data1 = b;
            this.data2 = c;
        } 
        
        else
        {
            this.status = (a & 0xF0) | (b & 0x0F); // (command & 0xF0) ensures the command bits are preserved, and (channel & 0x0F) ensures the channel is encoded in the lower nibble.
            this.data1 = c;
            this.data2 = d;
        }
    }

    public getData(): number[]
    {
        return [this.status, this.data1, this.data2];
    }

    
}