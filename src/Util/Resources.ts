import { InputStream } from "../java/io/InputStream";
import { RuntimeException } from "../java/lang/RuntimeException";
import { URL } from "../java/net/URL";

export class Resources 
{ 
	public static getResource (s: string ): URL 
	{ 
        s = s.toLowerCase();
		var u:URL = new URL(s);
          u._content = Resources.map.get(s);

        return u;
	} 
	
    public static ensureResource(url:URL):URL
    {
        url._content = Resources.map.get(url.getFile().toLowerCase());
        return url;
    }


	public static getResourceAsStream (s: string ): InputStream 
	{ 
        s = s.toLowerCase();

		throw new RuntimeException ( ) ; 
		
	} 
	
    private static map:Map<string, any> = new Map();

    static bootResourceImage(file:string):Promise<void>
    {
        const img = new Image();
    
        const promise = new Promise<void>((resolve, reject) => {
            img.onload = () => {
                this.map.set(file.toLowerCase(), img);
                resolve();
            };
            img.onerror = () => reject(new Error(`Failed to load image: ${file}`));
        });

        img.src = file;

        return promise;
    }

    static bootResourceFileString(file:File):Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            const reader = new FileReader();
    
            reader.onload = (event) => {
                const fileContent = event.target?.result as string; // The content of the file as a string
               
                this.map.set(file.name, fileContent);
               
                resolve(); // Resolve the Promise with the content
            };
    
            // Set up the onerror event handler to handle any errors that occur while reading the file
            reader.onerror = function(event) {
                reject(new Error("Error reading file")); // Reject the Promise with an error
            };
    
            // Read the file as a string (text)
            reader.readAsText(file);
        });
    }

    static bootResourceString(file: string): Promise<void>
    {
        return fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load text: ${file}`);
                }
                return response.text();
            })
            .then(text => {
                this.map.set(file.toLowerCase(), text);
            });
    }
    

    static async  boot(): Promise<void>
    {
        const arrPromises: Array<Promise<void>> = [];
    
        for(var i:number = 0 ; i < files.length ; i++)
        {
            var file:string = files[i];//.toLowerCase();

            if( file.endsWith(".xml") )
                arrPromises.push( Resources.bootResourceString(file) );

            else if (file.endsWith(".gif"))
                arrPromises.push( Resources.bootResourceImage(file) );

          //  else
           //     debugger;
        }
    
        await Promise.all(arrPromises);
    }
} 

var files:Array<string> =
[
 "Missa-Mort-et-Merci_01kyrie.cmme.xml"
,"data/imgs/buttonbg-dark.gif"
,"data/imgs/buttonbg-light.gif"
,"data/imgs/clef-buttonBmol1a.gif"
,"data/imgs/clef-buttonBmol1a.psd"
,"data/imgs/clef-buttonBqua1a.gif"
,"data/imgs/clef-buttonBqua1a.psd"
,"data/imgs/clef-buttonC1a.gif"
,"data/imgs/clef-buttonC1a.psd"
,"data/imgs/clef-buttonDiesis1a.gif"
,"data/imgs/clef-buttonDiesis1a.psd"
,"data/imgs/clef-buttonF1a.gif"
,"data/imgs/clef-buttonF1a.psd"
,"data/imgs/clef-buttonFrnd1a.psd"
,"data/imgs/clef-buttonG1a.gif"
,"data/imgs/clef-buttonG1a.psd"
,"data/imgs/clef-buttonMODERNFLAT1a.gif"
,"data/imgs/clef-buttonMODERNFLAT1a.psd"
,"data/imgs/clef-buttonMODERNG1a.gif"
,"data/imgs/clef-buttonMODERNG1a.psd"
,"data/imgs/clef-buttonMODERNnotea.gif"
,"data/imgs/clef-buttonMODERNnotea.psd"
,"data/imgs/edacc-button.gif"
,"data/imgs/edacc-button.psdv"
,"data/imgs/icon1.gif"
,"data/imgs/icon1.psd"
,"data/imgs/icon2.ico"
,"data/imgs/icon2.psd"
,"data/imgs/mens-button2.gif"
,"data/imgs/mens-button2.psd"
,"data/imgs/mens-button3.gif"
,"data/imgs/mens-button3.psd"
,"data/imgs/mens-buttonC.gif"
,"data/imgs/mens-buttonC.psd"
,"data/imgs/mens-buttonDot.gif"
,"data/imgs/mens-buttonDot.psd"
,"data/imgs/mens-buttonO.gif"
,"data/imgs/mens-buttonO.psd"
,"data/imgs/mens-buttonStroke.gif"
,"data/imgs/mens-buttonStroke.psd"
,"data/imgs/misc-buttonDot.gif"
,"data/imgs/misc-buttonDot.psd"
,"data/imgs/misc-buttonDotDiv.gif"
,"data/imgs/misc-buttonDotDiv.psd"
,"data/imgs/noteval-button1a-dark.gif"
,"data/imgs/noteval-button1a.gif"
,"data/imgs/noteval-button1a.psd"
,"data/imgs/noteval-button2a-dark.gif"
,"data/imgs/noteval-button2a.gif"
,"data/imgs/noteval-button2a.psd"
,"data/imgs/noteval-button3a-dark.gif"
,"data/imgs/noteval-button3a.gif"
,"data/imgs/noteval-button3a.psd"
,"data/imgs/noteval-button4a-dark.gif"
,"data/imgs/noteval-button4a.gif"
,"data/imgs/noteval-button4a.psd"
,"data/imgs/noteval-button5a-dark.gif"
,"data/imgs/noteval-button5a.gif"
,"data/imgs/noteval-button5a.psd"
,"data/imgs/noteval-button6a-dark.gif"
,"data/imgs/noteval-button6a.gif"
,"data/imgs/noteval-button6a.psd"
,"data/imgs/noteval-button6aa.psd"
,"data/imgs/noteval-button6b-dark.gif"
,"data/imgs/noteval-button6b.gif"
,"data/imgs/noteval-button6b.psd"
,"data/imgs/noteval-button7a-dark.gif"
,"data/imgs/noteval-button7a.gif"
,"data/imgs/noteval-button7a.psd"
,"data/imgs/noteval-button8a-dark.gif"
,"data/imgs/noteval-button8a.gif"
,"data/imgs/noteval-button8a.psd"
,"data/imgs/noteval-buttonMODERNa.gif"
,"data/imgs/noteval-buttonMODERNa.psd"
,"data/imgs/noteval-buttonORIGa.gif"
,"data/imgs/noteval-buttonORIGa.psd"
,"data/imgs/restval-button1a-dark.gif"
,"data/imgs/restval-button1a.gif"
,"data/imgs/restval-button1a.psd"
,"data/imgs/restval-button2a-dark.gif"
,"data/imgs/restval-button2a.gif"
,"data/imgs/restval-button2a.psd"
,"data/imgs/restval-button3a-dark.gif"
,"data/imgs/restval-button3a.gif"
,"data/imgs/restval-button3a.psd"
,"data/imgs/restval-button4a-dark.gif"
,"data/imgs/restval-button4a.gif"
,"data/imgs/restval-button4a.psd"
,"data/imgs/restval-button5a-dark.gif"
,"data/imgs/restval-button5a.gif"
,"data/imgs/restval-button5a.psd"
,"data/imgs/restval-button6a-dark.gif"
,"data/imgs/restval-button6a.gif"
,"data/imgs/restval-button6a.psd"
,"data/imgs/restval-button7a-dark.gif"
,"data/imgs/restval-button7a.gif"
,"data/imgs/restval-button7a.psd"
,"data/imgs/restval-button8a-dark.gif"
,"data/imgs/restval-button8a.gif"
,"data/imgs/restval-button8a.psd"
,"data/imgs/textmodern-button.gif"
,"data/imgs/textmodern-button.psd"
,"data/imgs/textorig-button.gif"
,"data/imgs/textorig-button.psd"
,"data/imgs/zoomin-button.gif"
,"data/imgs/zoomin-button.psd"
,"data/imgs/zoomout-button.gif"
,"data/imgs/zoomout-button.psd"
,"data/imgs/guiicons/buttonbg-dark.gif"
,"data/imgs/guiicons/buttonbg-light.gif"
,"data/imgs/guiicons/clef-buttonBmol1a.gif"
,"data/imgs/guiicons/clef-buttonC1a.gif"
,"data/imgs/guiicons/clef-buttonMODERNFLAT1a.gif"
,"data/imgs/guiicons/clef-buttonMODERNG1a.gif"
,"data/imgs/guiicons/edacc-button.gif"
,"data/imgs/guiicons/noteval-buttonMODERNa.gif"
,"data/imgs/guiicons/noteval-buttonORIGa.gif"
,"data/imgs/guiicons/textmodern-button.gif"
,"data/imgs/guiicons/textorig-button.gif"
,"data/imgs/guiicons/zoomin-button.gif"
,"data/imgs/guiicons/zoomout-button.gif"
];