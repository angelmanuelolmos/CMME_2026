import {KeyEvent } from './KeyEvent'; 
import {EventListener } from '../../util/EventListener'; 
export interface KeyListener extends EventListener 
{ 
	 keyTyped( e:KeyEvent):void;
     keyPressed( e:KeyEvent):void;
     keyReleased( e:KeyEvent):void;
} 

