import {Rectangle } from '../Rectangle'; 

import {Shape } from '../Shape'; 
export abstract class RectangularShape implements Shape
{
    public abstract getBounds(): Rectangle;
	
} 

