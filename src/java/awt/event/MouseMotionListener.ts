import {MouseEvent } from './MouseEvent'; 
import {EventListener } from '../../util/EventListener'; 
export interface MouseMotionListener extends EventListener 
{ 
	mouseDragged(e:MouseEvent):void
    mouseMoved(e:MouseEvent):void
} 

