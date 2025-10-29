
import { Track } from "./Track";

export class Sequence
{
    public static PPQ: number = 960; // Typical PPQ value

    private tracks: Track[];

    public constructor(divisionType: number, resolution: number, numTracks: number)
    {
        this.divisionType = divisionType;
        this.resolution = resolution;    
        
        this.tracks = new Array(numTracks).fill(null).map(() => new Track());
    }

    private divisionType: number;
    private resolution: number;

    public getResolution():number
    {
        return this.resolution;
    }

    public getTracks(): Track[] {
        return this.tracks;
    }
}