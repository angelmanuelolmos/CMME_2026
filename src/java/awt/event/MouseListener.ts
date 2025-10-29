import {MouseEvent } from './MouseEvent'; 
import {EventListener } from '../../util/EventListener'; 
export interface MouseListener extends EventListener 
{ 
	mouseClicked(e:MouseEvent):void
    mousePressed(e:MouseEvent):void
    mouseReleased(e:MouseEvent):void
    mouseEntered(e:MouseEvent):void
    mouseExited(e:MouseEvent):void
} 

