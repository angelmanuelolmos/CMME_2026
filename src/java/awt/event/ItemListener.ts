import {ItemEvent } from './ItemEvent'; 
import {EventListener } from '../../util/EventListener'; 
export interface ItemListener extends EventListener 
{ 
	itemStateChanged(e:ItemEvent):void
} 

