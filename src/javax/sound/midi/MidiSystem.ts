import { MetaEventListener } from "./MetaEventListener";
import { MetaMessage } from "./MetaMessage";
import { MidiChannel } from "./MidiChannel";
import { MidiEvent } from "./MidiEvent";
import { Receiver } from "./Receiver";
import { Sequence } from "./Sequence";
import { Sequencer } from "./Sequencer";
import { ShortMessage } from "./ShortMessage";
import { Synthesizer } from "./Synthesizer";
import { Track } from "./Track";
import { Transmitter } from "./Transmitter";
import { File } from "../../../java/io/File";


export class MidiSystem
{
    public static getSequencer(): Sequencer {
        return new SequencerWebAudioImpl();
    }

    public static getSynthesizer(): Synthesizer {
        return new SynthesizerImpl();
    }

    public static write(sequence:Sequence, type:number, out:File):number
    {
        var blob:Blob = MidiFileWriter.write(sequence);

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "export.midi";
        link.click();
        URL.revokeObjectURL(url);

        return blob.size;
    }
}

class SynthesizerImpl implements Synthesizer
{
    private channels: MidiChannel[];

    public constructor() {
        this.channels = Array.from({ length: 16 }, () => new MidiChannel());
    }

    public open(): void {
        console.log('Synthesizer opened');
    }

    public getReceiver(): Receiver {
        return new ReceiverImpl();
    }

    public getChannels(): MidiChannel[] {
        return this.channels;
    }
}

class ReceiverImpl implements Receiver
{
}

class TransmitterImpl implements Transmitter {
    public setReceiver(receiver: Receiver): void {
        console.log('Receiver set');
    }
}

class SequencerDebugImpl implements Sequencer
{
    protected sequence: Sequence | null = null;

    private currentTick: number = 0;
    protected isRunning: boolean = false;
    protected timerId: number | null = null;
    private listeners: MetaEventListener[] = [];

    private loop():void
    {
        if (!this.isRunning || !this.sequence) return;

        // Get the current track and its events
        const tracks = this.sequence.getTracks();
        
        tracks.forEach(track => {
            const events = track.getEventsForTick(this.currentTick);
            events.forEach(event => {
                // Here you would process the MIDI event, e.g., print it to the console
                console.log(`Tick ${this.currentTick}:`, event);
            });
        });

        // Move to the next tick
        this.currentTick++;

        // Request the next frame
        if (this.isRunning) {
            this.timerId = requestAnimationFrame( ()=>this.loop() );
        }
    };

    public open(): void {
        console.log('Sequencer opened');
    }

    public setSequence(sequence: Sequence): void {
        this.sequence = sequence;
        console.log('Sequence set');
    }

    public getTransmitter(): Transmitter {
        return new TransmitterImpl();
    }

    public addMetaEventListener(listener: MetaEventListener): boolean
    {
        this.listeners.push(listener);
        return true;
    }

    public removeMetaEventListener(listener: MetaEventListener): void {
        this.listeners = this.listeners.filter(l => l !== listener);
 
    }

    public setTickPosition(tick: number): void {
        this.currentTick = tick;
        console.log(`Tick position set to ${tick}`);
    }

    public setTempoInBPM(bpm: number): void {
        console.log(`Tempo set to ${bpm} BPM`);
        // You could adjust the timing of the `loop` based on the BPM here
 
    }

    public start(): void {
        if (this.isRunning) return;
        this.isRunning = true;
        this.loop(); // Start the sequence
        console.log('Sequencer started');
    }

    public stop(): void {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.timerId !== null) {
            cancelAnimationFrame(this.timerId);
        }
        console.log('Sequencer stopped');
    }

    public close(): void {
        console.log('Sequencer closed');
    }

    public setTempoFactor(factor: number): void {
        console.log(`Tempo factor set to ${factor}`);
    }
}
//this.sequencer.getTransmitter().setReceiver(synthesizer.getReceiver());

class SequencerWebAudioImpl implements Sequencer
{
    private audioContext: AudioContext;
    
    private secPlaybackStart: number = 0;
    private tick:number = 0;
    
    protected timerId: number | null = null;

    private sequence:Sequence | null = null;

    constructor()
    {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    open(): void
    {
    }

    setSequence(sequence: Sequence): void
    {
        this.sequence = sequence;

        this.ppq = sequence.getResolution();
        
    }

    getTransmitter(): Transmitter
    {
        return new TransmitterImpl();
    }

    private listeners: MetaEventListener[] = [];

    public addMetaEventListener(listener: MetaEventListener): boolean
    {
        this.listeners.push(listener);
        return true;
    }

    public removeMetaEventListener(listener: MetaEventListener): void {
        this.listeners = this.listeners.filter(l => l !== listener);
 
    }

    setTickPosition(tick: number): void
    {
    }
    
    setTempoInBPM(bpm: number): void
    {
        this.tempoBPM = bpm;
    }

    close(): void
    {
    }
    
    setTempoFactor(factor: number): void
    {
    }

    isPlaying():boolean
    {
        return this.timerId != null;
    }

    private masterGain:GainNode | null = null

    public start(): void
    {
        if (this.isPlaying() )
            return;

        this.anotherLoop();

        this.secPlaybackStart = this.audioContext.currentTime;
        this.tick = 0;

        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        this.audioContext.resume();
    }

    public stop(): void
    {
        if (!this.isPlaying() )
            return;

        cancelAnimationFrame(this.timerId);
        this.timerId = null;

      //  this.masterGain.gain.setValueAtTime(0, 0);
        this.masterGain.disconnect();
        this.mapNoteToOscillatorNode.clear();
        this.gainNodes.clear();
    }

    private tickToSecs(tick:number):number
    {
        var ticksPerQuarterNote:number = this.ppq;
        var beatsPerSecond = this.tempoBPM / 60.0;

        var ticksPerSecond:number = ticksPerQuarterNote * beatsPerSecond;

        return tick / ticksPerSecond;
    }

    private tempoBPM:number = 120; 
    private ppq:number = 40;//960;

    private secsToTick(seconds: number): number
    {
        var ticksPerQuarterNote:number = this.ppq;
        var beatsPerSecond = this.tempoBPM / 60.0;
        var ticksPerSecond:number = ticksPerQuarterNote * beatsPerSecond;

        return Math.round(ticksPerSecond * seconds);
    }

    // The loop now triggers events using the Web Audio API
    private loop():void
    {
        if (!this.isPlaying() || !this.sequence)
            return;

        // Calculate the future tick position (current time + 2 seconds)
        const futureTime = this.audioContext.currentTime - this.secPlaybackStart + 0.2;
        const futureTick = this.secsToTick(futureTime);

        // Get the current track and its events
        const tracks = this.sequence.getTracks();

        tracks.forEach(track =>
        {
            let eventsToProcess = track.getEventsForTickRange(this.tick, futureTick);

            eventsToProcess.forEach(event =>
            {
                this.processEvent(event);
            });
        });

        this.tick = futureTick;

        this.anotherLoop();
    };

    private anotherLoop():void
    {
        this.timerId = requestAnimationFrame(() => this.loop() );
    }

    // Process each event: Start/Stop Oscillators
    private processEvent(event: MidiEvent): void
    {
        const message = event.getMessage();
        const tick = event.getTick();

        if (message instanceof ShortMessage)
        {
            const status = message.getData()[0];
            const note = message.getData()[1];
            const velocity = message.getData()[2];

            if (status === ShortMessage.NOTE_ON)
                this.noteOn(note, velocity, tick);
            
            else if (status === ShortMessage.NOTE_OFF)
                this.noteOff(note, tick);
        }

        else if (message instanceof MetaMessage) 
        {
            for (const listener of this.listeners)
            {
                listener.meta(message);
            }
        }

    }

    private noteOn(note: number, velocity: number, tick: number): void
    {
        const frequency = this.midiToFrequency(note);

        var secs:number = this.tickToSecs(tick) + this.secPlaybackStart;
        
        const oscillator = this.audioContext.createOscillator();
        oscillator.frequency.setValueAtTime(frequency, secs);

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(velocity / 127, secs); // Normalize the velocity to 0-1 range

        // Connect nodes
        oscillator.connect(gainNode);
        //gainNode.connect(this.audioContext.destination);
        gainNode.connect(this.masterGain);

        oscillator.start(secs);

        this.mapNoteToOscillatorNode.set(note, oscillator);
        this.gainNodes.set(note, gainNode);


        console.log("Note ON");
    }

    private mapNoteToOscillatorNode: Map<number, OscillatorNode> = new Map();
    private gainNodes: Map<number, GainNode> = new Map();

    private noteOff(note: number, tick: number): void
    {
        const oscillator:OscillatorNode | undefined = this.mapNoteToOscillatorNode.get(note);

        if(oscillator === undefined )
            return;

        const gainNode:GainNode = this.gainNodes.get(note) as GainNode;

        var secs:number = this.tickToSecs(tick) + this.secPlaybackStart;

        oscillator.stop(secs); 


        

        

//        if (oscillator && gainNode) {
  //          // Fade out the note by reducing its volume to 0
    //        gainNode.gain.setValueAtTime(0, startTime);
      //      oscillator.stop(startTime + 0.1); // Stop with a short fade out
        //}
    }

    private midiToFrequency(note: number): number
    {
        return 440 * Math.pow(2, (note - 69) / 12); // A4 = 440Hz, MIDI note 69
    }
}

class MidiFileWriter
{
    public static write(sequence:Sequence):Blob
    {
        var w:Writer = new Writer();

        MidiFileWriter.writeHeader(w, sequence);

        for (var i:number = 0; i < sequence.getTracks().length; i++)
        {
            MidiFileWriter.writeTrack(w, sequence.getTracks()[i], {});
        }

        //w buffer to blob
        return new Blob([new Uint8Array(w.getBuffer())], { type: "audio/midi" });
    }

    private static writeHeader(w:Writer, sequence:Sequence):void
    {
        var format = 1;

        var timeDivision:number = sequence.getResolution();
  
        var h = new Writer();
        h.writeUInt16(format);
        h.writeUInt16(sequence.getTracks().length);
        h.writeUInt16(timeDivision)

        w.writeChunk('MThd', h.getBuffer())
    }

    private static writeTrack(w:Writer, track: Track, opts:any):void
    {
        MidiFileWriter.lastTick = 0;

        var t:Writer = new Writer();
        var i:number, len:number = track.getEvents().length;

        for (i=0; i < len; i++)
        {
            MidiFileWriter.writeEvent(t, track.getEvents()[i]);          
        }

        w.writeChunk('MTrk', t.getBuffer())
    }

    private static lastTick:number = 0;
    private static writeEvent(w:Writer, event:MidiEvent):void
    {
        var statusByte:number = event.getMessage().getData()[0];

        var messageType:number = (statusByte & 0xF0);// >> 4; // Extract upper 4 bits
        var messageChannel:number = statusByte & 0x0F;           // Extract lower 4 bits
        
        var type = messageType == 0x80? "noteOff" : messageType == 0x90? "noteOn" : "";
        
        if( type != "noteOn" && type != "noteOff")
            return null;

        var deltaTime = event.getTick() - MidiFileWriter.lastTick;
        MidiFileWriter.lastTick = event.getTick();
    
        var eventTypeByte:number | null = null;
        w.writeVarInt(deltaTime);
      
        switch (type)
        {
          case 'noteOff':
            var noteByte = 0x80;
      
            eventTypeByte = noteByte | messageChannel;
            w.writeUInt8(eventTypeByte)
            w.writeUInt8(event.getMessage().getData()[1])
            w.writeUInt8(event.getMessage().getData()[2])
            break;
      
          case 'noteOn':
            eventTypeByte = 0x90 | messageChannel;
            w.writeUInt8(eventTypeByte)
            w.writeUInt8(event.getMessage().getData()[1])
            w.writeUInt8(event.getMessage().getData()[2])
            break;
      
          default:
            return;
        }        
    }
   
}

class Writer
{
    constructor()
    {
        this.buffer = []
    }

    private buffer:Array<number>;

    public getBuffer():Array<number>
    {
        return this.buffer;
    }

    public writeUInt8(v:number)
    {
        this.buffer.push(v & 0xFF)
    }

    public writeInt8(v:number)
    {
        this.writeInt8(v);
    }

    public writeUInt16(v:number)
    {
        var b0 = (v >> 8) & 0xFF,
        b1 = v & 0xFF
  
        this.writeUInt8(b0)
        this.writeUInt8(b1)
    }

    public writeInt16(v:number)
    {
        this.writeUInt16(v);
    }

    public writeUInt24(v:number)
    {
        var b0 = (v >> 16) & 0xFF,
        b1 = (v >> 8) & 0xFF,
        b2 = v & 0xFF
  
        this.writeUInt8(b0)
        this.writeUInt8(b1)
        this.writeUInt8(b2)
    }

    public writeInt24(v:number)
    {
        this.writeUInt24(v);
    }
  
    public writeUInt32(v:number)
    {
        var b0 = (v >> 24) & 0xFF,
        b1 = (v >> 16) & 0xFF,
        b2 = (v >> 8) & 0xFF,
        b3 = v & 0xFF
  
        this.writeUInt8(b0)
        this.writeUInt8(b1)
        this.writeUInt8(b2)
        this.writeUInt8(b3)
    }

    public writeInt32(v:number)
    {
        this.writeUInt32(v);
    }
  
  
    public writeBytes(arr:Array<number>):void
    {
        this.buffer = this.buffer.concat(Array.prototype.slice.call(arr, 0))
    }
  
    public writeString(str:string):void
    {
        var i, len = str.length, arr = []
        for (i=0; i < len; i++) {
            arr.push(str.codePointAt(i))
        }
        this.writeBytes(arr)
    }
  
    public writeVarInt(v:number):void
    {
        if (v < 0) throw "Cannot write negative variable-length integer"
  
        if (v <= 0x7F)
        {
            this.writeUInt8(v)
        } 
        
        else
        {
            var i = v
            var bytes = []
            bytes.push(i & 0x7F)
            i >>= 7
            while (i)
            {
                var b = i & 0x7F | 0x80
                bytes.push(b)
                i >>= 7
            }
            
            this.writeBytes(bytes.reverse())
        }
    }
  
    public writeChunk(id:string, data:Array<number>):void
    {
        this.writeString(id)
        this.writeUInt32(data.length)
        this.writeBytes(data)
    }
}