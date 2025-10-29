import {ChangeListener } from './event/ChangeListener'; 

export interface SpinnerModel 
{ 
	addChangeListener(l:ChangeListener):void
    getNextValue():any
    getPreviousValue():any
    getValue():any
    removeChangeListener(l:ChangeListener):void
    setValue(value:any):void
} 

