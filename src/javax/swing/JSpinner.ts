
import {ChangeListener } from './event/ChangeListener'; 


import {SpinnerModel } from './SpinnerModel'; 

import {JComponent } from './JComponent'; 
export class JSpinner extends JComponent 
{ 
	public constructor (arg0: SpinnerModel ) 
	{ 
		super("input", ["JSpinner"]);
		
		this.model = arg0;

		(this.model as any)._source = this;

		this._inputElement().addEventListener("input", () => this.handleInputChange());

		if( (arg0 as any)._getStepSize !== undefined )
			this._inputElement().step = (arg0 as any)._getStepSize();
 
	} 

	_inputElement():HTMLInputElement
	{
		return this._getHTMLElement() as HTMLInputElement;
	}

	private handleInputChange(): void
	{
        const newValue = parseFloat(this._inputElement().value);

		this.model.setValue(newValue)
    }

	private model: SpinnerModel;
	
	public getValue ( ): any 
	{ 
		return this.model.getValue();
	} 
	
	public setValue(val:any):void
	{
		this.model.setValue(val);
	}

	public addChangeListener (listener: ChangeListener ): void 
	{ 
		this.model.addChangeListener(listener);
	} 
	
	public removeChangeListener (listener: ChangeListener ): void 
	{ 
		this.model.removeChangeListener(listener);
   
	} 
	
	
	
} 

