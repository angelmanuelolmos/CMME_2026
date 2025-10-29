
import {ActionListener } from '../../java/awt/event/ActionListener'; 

import {SwingConstants } from './SwingConstants'; 
import {JTextComponent } from './text/JTextComponent'; 
import { ActionEvent } from '../../java/awt/event/ActionEvent';
import { isNumber, isString } from '../../js';
export class JTextField extends JTextComponent implements SwingConstants 
{ 	
	public constructor(columns:number);
	public constructor (text: string ,columns: number ) 
	public constructor(a:any, b:any = undefined)
	{ 
		super("input", ["JTextField"]);
	
		var text:string = null;
		var columns:number = 1;
		if( arguments.length == 1)
		{
			text == null;
			columns = a as number;
		}

		else
		{
			text = a;
			columns = b; 
		}
		
        this.setText(text);
        (this._textElement() as HTMLInputElement).size = columns;
        
        this._textElement().addEventListener("keydown", (event:KeyboardEvent) => {
            if (event.key === "Enter") {
                this._fireActionEvent();
            }
        });
	} 
	
	private _fireActionEvent(): void {
        this.actionListeners.forEach(listener => listener.actionPerformed(new ActionEvent(this.getText(), this)));
    }

	private actionListeners: ActionListener[] = [];

	public addActionListener (arg0: ActionListener ): void 
	{ 
		this.actionListeners.push(arg0);
	} 
	
	public removeActionListener (arg0: ActionListener ): void 
	{ 
		this.actionListeners = this.actionListeners.filter(listener => listener !== arg0);
	} 
	
	
} 

