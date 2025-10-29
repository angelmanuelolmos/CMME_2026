
import {Window } from './Window'; 
export class Frame extends Window
{ 
    public constructor(tag:string, arrClass:Array<string>)
    {
        super(tag, arrClass.concat("Frame"));
    }

	private title: string = "";

    public getTitle(): string {
        return this.title;
    }

    public setTitle(title: string): void {
        this.title = title;
    }
} 

