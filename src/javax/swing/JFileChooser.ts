


import {Component } from '../../java/awt/Component'; 

import {File } from '../../java/io/File'; 

import {JComponent } from './JComponent'; 
import { Resources } from '../../Util/Resources';
export class JFileChooser extends JComponent
{ 
	private fileInput: HTMLInputElement;
    private selectedFile: File | null = null;

	public constructor (currentDirectoryPath: string ) 
	{ 
		super("div", ["JFileChooser"]);

		// Create a hidden file input element
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.style.display = 'none';

        // Event listener for when a file is selected
        this.fileInput.addEventListener('change', async (event) =>
		{
            const input = event.target as HTMLInputElement;
            if (input.files && input.files.length > 0)
			{
				this.selectedFile = new File(input.files[0].name);
                //this.selectedFile = input.files[0];

				await Resources.bootResourceFileString(input.files[0]);

				if(this.callback )
					this.callback();
            }
        });

        // Append the file input element to the component's HTMLElement
        this._getHTMLElement().appendChild(this.fileInput);
		
	} 
	
	public addChoosableFileFilter (arg0: any ): void 
	{ 
		//throw new Error("Not Implemented"); 
	} 
	
	public getCurrentDirectory ( ): File 
	{ 
		return new File("");
		//throw new Error("Not Implemented"); 
	} 
	
	public getSelectedFile ( ): File 
	{ 
		return this.selectedFile;
	} 
	
	public setCurrentDirectory (arg0: File ): void 
	{ 
		//throw new Error("Not Implemented"); 
	} 
	
	public setFileFilter (arg0: any ): void 
	{ 
		//throw new Error("Not Implemented"); 
	} 
	
	public setSelectedFile (arg0: File ): void 
	{ 
		//throw new Error("Not Implemented"); 
	} 
	
	private callback:()=>void | null = null;

	public showOpenDialog (arg0: Component, callback:()=>void): number 
	{ 
		this.callback = callback;
		this.fileInput.click();
        return JFileChooser.APPROVE_OPTION;
	} 
	
	public showSaveDialog (arg0: Component ): number 
	{ 
		//throw new Error("Not Implemented"); 
		return JFileChooser.APPROVE_OPTION;
	} 
	
	public static APPROVE_OPTION: number = 0;
	
} 

