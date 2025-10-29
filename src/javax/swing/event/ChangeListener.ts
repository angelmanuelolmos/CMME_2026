import {ChangeEvent } from './ChangeEvent'; 
import {EventListener } from '../../../java/util/EventListener'; 
export interface ChangeListener extends EventListener 
{ 
	stateChanged(e:ChangeEvent):void
} 

