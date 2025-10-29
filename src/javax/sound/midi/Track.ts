import { MidiEvent } from "./MidiEvent";


export class Track
{
    private events: MidiEvent[]; //order?

    public constructor()
    {
        this.events = [];
    }

    public getEvents():MidiEvent[]
    {
        if( this.dirty )
            {
                this.dirty = false;
                this.events.sort((a, b) => a.getTick() - b.getTick());
            }

        return this.events;
    }

    private dirty:boolean = false;
    public add(event:MidiEvent):boolean
    {
        this.dirty = true;

        this.events.push(event);
        return true;
    }
    
    public getEventsForTick(tick: number): MidiEvent[]
    {
        if( this.dirty )
        {
            this.dirty = false;
            this.events.sort((a, b) => a.getTick() - b.getTick());
        }

        return this.events.filter(event => event.getTick() === tick);
    }

    public getEventsForTickRange(tickGreaterThanOrEqual: number, tickLessThan:number): MidiEvent[] {
        return this.events.filter(event => event.getTick() >= tickGreaterThanOrEqual && event.getTick() < tickLessThan);
    }

}