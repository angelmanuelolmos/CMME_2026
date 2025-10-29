
import { Component } from '../Component';
import {ComponentEvent } from './ComponentEvent'; 
export abstract class InputEvent extends ComponentEvent 
{ 
    public static SHIFT_MASK:number = 1;
    public static CTRL_MASK:number = 2;
    public static META_MASK:number = 4;
    

    public constructor(source:Component, modifiers:number)
    {
        super(source)
        this.modifiers = modifiers;
    }

    private modifiers:number;

	isShiftDown(): boolean {
        return (this.modifiers & InputEvent.SHIFT_MASK) !== 0;
    }

    // Check if Meta key is pressed (typically the "Command" key on macOS or "Windows" key on Windows)
    public isMetaDown(): boolean {
        return (this.modifiers & InputEvent.META_MASK) !== 0;
    }

    // Check if Control key is pressed
    public isControlDown(): boolean {
        return (this.modifiers & InputEvent.CTRL_MASK) !== 0;
    }
} 

