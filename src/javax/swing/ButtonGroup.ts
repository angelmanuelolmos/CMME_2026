
import {AbstractButton } from './AbstractButton'; 

export class ButtonGroup  
{
    private buttons: AbstractButton[] = [];
    private selectedButton: AbstractButton | null = null;

    public add(button: AbstractButton): void {
        if (this.buttons.includes(button)) return;
        this.buttons.push(button);

		var self:ButtonGroup = this;
        button.addActionListener( { actionPerformed: () => self.setSelected(button) });
    }

    private setSelected(button: AbstractButton): void {
        if (this.selectedButton !== button) {
            this.selectedButton?.setSelected(false);
            button.setSelected(true);
            this.selectedButton = button;
        }
    }
}
