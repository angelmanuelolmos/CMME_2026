
import {JToggleButton } from './JToggleButton'; 
export class JCheckBox extends JToggleButton 
{ 
	public constructor();
	public constructor(text:string, selected:boolean);
	public constructor (text: string );
	public constructor(a:any = undefined, b:any = undefined)
	{ 
		super("button", ["JCheckBox"]);
	
		this.updateCheckmark();
	} 

	private updateCheckmark(): void {
        this._getHTMLElement().innerHTML = ""; // Clear existing content
        const checkmark = document.createElement("span");
        checkmark.textContent = this.isSelected() ? "✔ " : ""; // Show checkmark when selected
        this._getHTMLElement().appendChild(checkmark);
        this._getHTMLElement().appendChild(document.createTextNode(this.getText()? this.getText() : "")); // Append text
    }

    /** Handles clicks to toggle the selected state */
    protected clickPerformed(): void {
      
		super.clickPerformed();
        this.setSelected(! this.isSelected());
        this.updateCheckmark();

    }
	
	
} 

