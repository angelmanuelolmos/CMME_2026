

export class MidiChannel
{
    public controlChange(controller: number, value: number): void {
        // Handle control change message for a given controller and value
        console.log(`Control change: Controller ${controller}, Value ${value}`);
    }

    public noteOn(note: number, velocity: number): void {
        console.log(`Note On: ${note} with velocity ${velocity}`);
    }

    public noteOff(note: number): void {
        console.log(`Note Off: ${note}`);
    }

    public programChange(program: number): void {
        console.log(`Program Change: Program ${program}`);
    }
}