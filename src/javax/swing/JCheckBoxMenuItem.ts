
import {SwingConstants } from './SwingConstants'; 
import {JMenuItem } from './JMenuItem'; 
import { ItemEvent } from '../../java/awt/event/ItemEvent';
export class JCheckBoxMenuItem extends JMenuItem implements SwingConstants 
{ 
	public constructor(text:string, selected:boolean)
	public constructor(text: string ) 
	public constructor(a:any, b:any = undefined)
	{ 
		super(a);

		if( b !== undefined )
			this.setState(b as boolean);

		this.updateCheckmark();
	} 
	
	
    /** Updates the visual checkmark based on state */
    private updateCheckmark(): void {
        this._getHTMLElement().innerHTML = ""; // Clear existing content
        const checkmark = document.createElement("span");
        checkmark.textContent = this.isSelected() ? "✔ " : ""; // Show checkmark when selected
        this._getHTMLElement().appendChild(checkmark);
        this._getHTMLElement().appendChild(document.createTextNode(this.getText())); // Append text
    }

    /** Handles clicks to toggle the selected state */
    protected clickPerformed(): void {
        this.setState(!this.isSelected()); // Toggle state
        this.updateCheckmark();
        
        // Notify item listeners (if any)
        const event = new ItemEvent(this, ItemEvent.ITEM_STATE_CHANGED, undefined, this.isSelected() ? ItemEvent.SELECTED : ItemEvent.DESELECTED);
        this.fireItemEvent(event);
        
        // Close the menu if needed
        if ((this as any).parentMenu !== undefined) {
            (this as any).parentMenu.childMenuClicked();
        }
    }

    /** Sets the selected state */
    public setSelected(selected: boolean): void
	{
        super.setSelected(selected);

        this.updateCheckmark();

		
    }

	setState(b:boolean):void
	{
		this.setSelected(b);
	}
} 

