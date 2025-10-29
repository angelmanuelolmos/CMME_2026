
import { MetaEventListener } from "./MetaEventListener";
import {Sequence} from "./Sequence";
import { Transmitter } from "./Transmitter";

export interface Sequencer
{
    open():void 
    setSequence(sequence:Sequence):void
    getTransmitter():Transmitter;
    addMetaEventListener(listener:MetaEventListener):boolean
    removeMetaEventListener( listener:MetaEventListener):void
    setTickPosition(tick:number):void
    setTempoInBPM(bpm:number):void
    start():void
    stop():void
    close():void
    setTempoFactor(factor:number):void

}