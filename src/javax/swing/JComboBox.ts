import { ActionEvent } from "../../java/awt/event/ActionEvent";
import { ActionListener } from "../../java/awt/event/ActionListener";
import { ItemEvent } from "../../java/awt/event/ItemEvent";
import { ItemListener } from "../../java/awt/event/ItemListener";
import { JComponent } from "./JComponent";

export class JComboBox<E> extends JComponent
{
    public constructor()
    public constructor(a:E[])
    public constructor(a:any = undefined)
    {
        super("div", ["JComboBox"]);

        this._getHTMLElement().style.position = "relative";
        this._getHTMLElement().style.display = "inline-block";
        this._getHTMLElement().style.border = "1px solid black";
        this._getHTMLElement().style.padding = "5px";
        this._getHTMLElement().style.cursor = "pointer";
        this._getHTMLElement().style.background = "white";

        // Create display area
        this.display = document.createElement("div");
        this.display.style.padding = "5px";
        this.display.style.userSelect = "none";

        // Create dropdown menu
        this.dropdown = document.createElement("div");
        this.dropdown.style.position = "absolute";
        this.dropdown.style.top = "100%";
        this.dropdown.style.left = "0";
        //this.dropdown.style.width = "100%";
        this.dropdown.style.background = "white";
        this.dropdown.style.border = "1px solid black";
        this.dropdown.style.display = "none";
        this.dropdown.style.zIndex = "999";

        this._getHTMLElement().appendChild(this.display);
        this._getHTMLElement().appendChild(this.dropdown);

        this._getHTMLElement().addEventListener("click", () => this._openDropdown());

        if (Array.isArray(a)) {
            a.forEach(item => this.addItem(item));
        }

        // Close dropdown on outside click
        document.addEventListener("mousedown", (event) => this.handleOutsideClick(event));
   
    }

    private items: E[] = [];
    private selectedIndex: number = -1;
    private actionListeners: ActionListener[] = [];
    private itemListeners: ItemListener[] = [];
    private dropdown: HTMLDivElement;
    private display: HTMLDivElement;

    private _closeDropdown():void
    {
        this.dropdown.style.display = "none";
    }

    private _openDropdown():void
    {
        this.dropdown.style.display = "block";
    }

    private _isOpen():boolean
    {
        return this.dropdown.style.display !== "none";
    }


    private toggleDropdown(): void
    {
        if( this._isOpen() ) 
            this._closeDropdown();

        else    
            this._openDropdown();
    }

    private handleOutsideClick(event: MouseEvent): void {
        if (!this._getHTMLElement().contains(event.target as Node)) {
            this._closeDropdown();
        }
    }

    public addItem(item: E): void {
        this.items.push(item);
        const option = document.createElement("div");
        option.classList.add("JComboBox_item");
        option.textContent = String(item);
        option.style.padding = "5px";
        option.style.cursor = "pointer";
        option.addEventListener("click", () => this.setSelectedIndex(this.items.indexOf(item)));

        this.dropdown.appendChild(option);
    }

    /** Removes all items from the combo box */
    public removeAllItems(): void {
        this.items = [];
        this.dropdown.innerHTML = "";
        this.selectedIndex = -1;
        this.display.textContent = "";
    }

    public getItemAt(index: number): E {
        return this.items[index];
    }

    public getSelectedIndex(): number {
        return this.selectedIndex;
    }

    public addActionListener(l:ActionListener):void
    {
        this.actionListeners.push(l);
    }

    public removeActionListener(l:ActionListener):void
    {
        this.actionListeners = this.actionListeners.filter(listener => listener !== l);
   
    }

    public addItemListener( l:ItemListener):void
    {
        this.itemListeners.push(l);
    }

    public removeItemListener( l:ItemListener):void
    {
        this.itemListeners = this.itemListeners.filter(listener => listener !== l);
   
    }

    public setSelectedIndex(index:number):void
    {
        if (index >= 0 && index < this.items.length)
        {
            this.selectedIndex = index;
            this.display.textContent = String(this.items[index]);
            this.dropdown.style.display = "none"; // Close dropdown

            // Fire item event
            const event = new ItemEvent(this, ItemEvent.ITEM_STATE_CHANGED, undefined, ItemEvent.SELECTED);
            this.itemListeners.forEach(listener => listener.itemStateChanged(event));

            // Fire action event
            const actionEvent = new ActionEvent(String(this.items[index]), this);
            this.actionListeners.forEach(listener => listener.actionPerformed(actionEvent));

            this._closeDropdown();
        }
    }

}