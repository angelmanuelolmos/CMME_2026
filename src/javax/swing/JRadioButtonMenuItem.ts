
import {JMenuItem } from './JMenuItem'; 
export class JRadioButtonMenuItem extends JMenuItem 
{ 
	

    constructor(label: string) {
        super(label, "button", ["JRadioButtonMenuItem"]);

        this._getHTMLElement().addEventListener("click", () => {
            this.setSelected(true);
        });
    }

   
} 

