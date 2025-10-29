
import {Action } from './Action'; 
import { ActionEvent } from '../../java/awt/event/ActionEvent';
export abstract class AbstractAction implements Action
{
    abstract actionPerformed(e: ActionEvent): void;
	
} 

