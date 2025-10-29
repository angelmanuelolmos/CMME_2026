import {AdjustmentEvent } from './AdjustmentEvent'; 
import {EventListener } from '../../util/EventListener'; 
export interface AdjustmentListener extends EventListener 
{ 
	adjustmentValueChanged(e:AdjustmentEvent):void;
} 

