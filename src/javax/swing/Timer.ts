
import {ActionListener } from '../../java/awt/event/ActionListener'; 

export class Timer
{ 
	private delay: number;
    private actionListener:ActionListener
    private repeats: boolean = true;
    private timerId: NodeJS.Timeout | null = null;

    constructor(delay: number, actionListener:ActionListener) {
        this.delay = delay;
        this.actionListener = actionListener;
    }

    public start(): void {
        if (this.timerId !== null) {
            return; // Prevent multiple timers from running
        }

        const execute = () => {
            this.actionListener.actionPerformed(null);
            if (this.repeats) {
                this.timerId = setTimeout(execute, this.delay);
            } else {
                this.timerId = null;
            }
        };

        // Ensure repeats flag is checked before scheduling the next timeout
        this.timerId = setTimeout(execute, this.delay);
    }

    public setRepeats(repeats: boolean): void {
        this.repeats = repeats;
    }

    public stop():void
    {
        throw new Error();
    }
} 

