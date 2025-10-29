
import {ChangeListener } from './event/ChangeListener'; 

import {SpinnerModel } from './SpinnerModel'; 
import { ChangeEvent } from './event/ChangeEvent';
import { Component } from '../../java/awt/Component';
export abstract class AbstractSpinnerModel implements SpinnerModel 
{
    public _source:Component;

    abstract getNextValue():any;

    abstract getPreviousValue():any;

    abstract getValue():any;

    abstract setValue(value: any): void;

    private changeListeners: ChangeListener[] = [];

	public addChangeListener (listener: ChangeListener ): void 
	{ 
		this.changeListeners.push(listener);
	} 
	
	public removeChangeListener (listener: ChangeListener ): void 
	{ 
		this.changeListeners = this.changeListeners.filter(l => l !== listener);
   
	} 

    protected fireStageChanged(): void
	{
        var e:ChangeEvent = new ChangeEvent(this._source);
        this.changeListeners.forEach(listener => listener.stateChanged(e));
    }
    
	
} 

