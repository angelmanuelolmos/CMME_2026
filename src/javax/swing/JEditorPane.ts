
import {JTextComponent } from './text/JTextComponent'; 
export class JEditorPane extends JTextComponent 
{ 
	public constructor();
	public constructor (type: string ,text: string );
	public constructor(a:any = undefined, b:any = undefined)
	{ 
		super("textarea", ["JEditorPane"]);

		if (typeof a === "string" && typeof b === "string")
		{
            this.setContentType(a);
            this.setText(b);
        } 
		
		else
            this.setContentType("text/plain");
	} 
	
	private contentType: string;

	public setContentType(type:string):void
	{
		this.contentType = type;
	}
	
	
} 

