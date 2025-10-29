import {FocusEvent } from './FocusEvent'; 
import {EventListener } from '../../util/EventListener'; 
export interface FocusListener extends EventListener 
{ 
    focusGained(e:FocusEvent):void
    focusLost( e:FocusEvent):void
} 

