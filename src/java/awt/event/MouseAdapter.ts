import {MouseWheelEvent } from './MouseWheelEvent'; 
import {MouseEvent } from './MouseEvent'; 
import {MouseMotionListener } from './MouseMotionListener'; 

import {MouseListener } from './MouseListener'; 
export abstract class MouseAdapter implements MouseListener, MouseMotionListener 
{
    mouseDragged(e: MouseEvent): void {
        throw new Error('Method not implemented.');
    }
    mouseMoved(e: MouseEvent): void {
        throw new Error('Method not implemented.');
    }
    mouseClicked(e: MouseEvent): void {
        throw new Error('Method not implemented.');
    }
    mousePressed(e: MouseEvent): void {
        throw new Error('Method not implemented.');
    }
    mouseReleased(e: MouseEvent): void {
        throw new Error('Method not implemented.');
    }
    mouseEntered(e: MouseEvent): void {
        throw new Error('Method not implemented.');
    }
    mouseExited(e: MouseEvent): void {
        throw new Error('Method not implemented.');
    } 
	
} 

