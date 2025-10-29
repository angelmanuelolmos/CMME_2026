import {ActionEvent } from './ActionEvent'; 
import {EventListener } from '../../util/EventListener'; 
export interface ActionListener extends EventListener 
{ 
	actionPerformed(e:ActionEvent):void
} 

