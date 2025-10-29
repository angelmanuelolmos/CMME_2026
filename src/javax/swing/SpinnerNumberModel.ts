

import {AbstractSpinnerModel } from './AbstractSpinnerModel'; 
export class SpinnerNumberModel extends AbstractSpinnerModel
{ 
	public constructor (value: number ,minimum: number ,maximum: number ,stepSize: number ) 
	{ 
		super();

		this.value = value;
		this.minimum = minimum;
		this.maximum = maximum;
		this.stepSize = stepSize;
	} 

	private value: number;
	private minimum: number;
	private maximum: number;
	private stepSize: number ;

	_getStepSize():number
	{
		return this.stepSize;
	}

    getNextValue():number
	{
		return Math.min(this.maximum, this.value+this.stepSize);
	}

    getPreviousValue():number
	{
		return Math.max(this.minimum, this.value-this.stepSize);
	}

    getValue():number
	{
		return this.value;
	}

	setValue(value: any): void
	{
		value = Math.max(this.minimum, Math.min(this.maximum, value));

		if( value != this.value)
		{
			this.value = value;

			this.fireStageChanged();
		}
	}
	
	
} 

