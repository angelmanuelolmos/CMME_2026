import { JTextComponent } from "./text/JTextComponent";


export class JTextArea extends JTextComponent
{
    public constructor(text:string, rows:number, columns:number)
    {
        super("textarea", ["JTextArea"]);

        (this._textElement() as HTMLTextAreaElement).rows = rows;
        (this._textElement() as HTMLTextAreaElement).cols = columns;
        
        this.setText(text);
    }   

}