
import { Exception } from '../java/lang/Exception';
import { System } from '../java/lang/System';
import { File } from '../java/io/File';
import { Clef } from '../DataStruct/Clef';
import { ClefEvent } from '../DataStruct/ClefEvent';
import { PieceData } from '../DataStruct/PieceData';

export class ConvertCMME
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	static screenoutput:boolean = false;
	static recursive:boolean = false;
	public static BaseDataDir:string = "/data/";
	public static BaseDataURL:string;
	static initdirectory:string;

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  void main(String args[])
Purpose: Main routine
Parameters:
  Input:  String args[] - program arguments
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public static main(args:string[]):void
	{
		let cmdlineFilename:string = ConvertCMME.parseCmdLine(args);
		try
		{
			ConvertCMME.initdirectory = new File(".").getCanonicalPath() + ConvertCMME.BaseDataDir;
			ConvertCMME.BaseDataURL = "file:///" + ConvertCMME.initdirectory;
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					System.err.println("Error loading local file locations: " + e);
					e.printStackTrace();
				}

			else
				throw e;

		}
		ConvertCMME.convertFiles(cmdlineFilename);
	}

	/* initialize data locations */
	// DataStruct.XMLReader.initparser(BaseDataURL,false);
	/*------------------------------------------------------------------------
Method:  void convertFiles(String mainFilename)
Purpose: Convert one set of files (recursing to subdirectories if necessary)
Parameters:
  Input:  String mainFilename - name of file set in one directory
          String subdirName   - name of subdirectory (null for base directory)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static convertFiles(mainFilename:string):void
	{
	}

	//CHANGE
	/*try
      {
        OutputStream outs;

        RecursiveFileList fl=new RecursiveFileList(mainFilename,recursive);
        for (File curfile : fl)
          {
            URL fileURL=curfile.toURI().toURL();
            String fileName=curfile.getName(),
                   fileVersion=CMMEParser.getFileVersion(fileURL);
            if (Float.valueOf(fileVersion).floatValue()>=0.8)
              System.out.println(fileName+": already v. "+fileVersion+", skipping...");
            else
              {
                System.out.print("Converting: "+fileName+"...");

                PieceData musicdat=new CMMEOldVersionParser(fileURL).piece;
                musicdat=convertCMMEData(musicdat);

                outs=screenoutput ? System.out : new FileOutputStream(curfile);
                CMMEParser.outputPieceData(musicdat,outs);
                if (!screenoutput)
                  outs.close();

                System.out.println("done");
              }
          }
      }
    catch (Exception e)
      {
        System.err.println("Error: "+e);
        e.printStackTrace();
      }*/
	/*------------------------------------------------------------------------
Method:  String parseCmdLine(String args[])
Purpose: Parse command line
Parameters:
  Input:  String args[] - program arguments
  Output: -
  Return: filename (or "*" if recursive with no filename specified)
------------------------------------------------------------------------*/
	static parseCmdLine(args:string[]):string
	{
		let fn:string = null;
		if( args.length < 1)
			ConvertCMME.usage_exit();

		for(
		let i:number = 0;i < args.length;i ++)
		if( args[i].charAt(0) == "-")
			for(
			let opti:number = 1;opti < args[i].length;opti ++)
			switch( args[i].charAt(opti))
			{
				case "s":
				{
					ConvertCMME.screenoutput = true;
					break;
				}
				case "r":
				{
					ConvertCMME.recursive = true;
					break;
				}
				default:
				{
					ConvertCMME.usage_exit();
				}
			}

		else
			if( i !=(( args.length - 1) | 0))
				ConvertCMME.usage_exit();
			else
				fn = args[i];

		if( fn == null)
			if( ConvertCMME.recursive)
				fn = "*";
			else
				ConvertCMME.usage_exit();

		return "data\\music\\" + fn;
	}

	/* options */
	/* filename */
	/*------------------------------------------------------------------------
Method:  void usage_exit()
Purpose: Exit for invalid command line
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static usage_exit():void
	{
		System.err.println("Usage: java Util.ConvertCMME [options] filename");
		System.err.println("Options:");
		System.err.println("  -s: Screen output");
		System.err.println("  -r: Recursively search subdirectories");
		System.exit(1);
	}

	/*------------------------------------------------------------------------
Method:  PieceData convertCMMEData(PieceData p)
Purpose: Transform data from old to new format (internal representation)
Parameters:
  Input:  PieceData p - music data
  Output: -
  Return: converted music data
------------------------------------------------------------------------*/
	static convertCMMEData(p:PieceData):PieceData
	{
		return p;
	}

	/* version .67 conversion: note lengths now to be expressed in terms of
       minims, not breves 

    int lengthMultiplier=4;  4 minims to the breve in our "default" mensuration 

    Voice[] v=p.getVoiceData();
    for (int vi=0; vi<v.length; vi++)
      for (int ei=0; ei<v[vi].getnumevents(); ei++)
        {
          Event e=v[vi].getevent(ei);

           set base mensuration info (number of minims in a breve) 
          Mensuration mensInfo=e.getMensInfo();
          if (mensInfo!=null)
            {
              lengthMultiplier=mensInfo.prolatio==Mensuration.MENS_BINARY ? 2 : 3;
              lengthMultiplier*=mensInfo.tempus==Mensuration.MENS_BINARY ? 2 : 3;
            }

           adjust lengths of timed events 
          Proportion l=e.getLength();
          if (l!=null)
            l.multiply(lengthMultiplier,1);

           mark all flats as signature clefs by default 
          if (e.geteventtype()==Event.EVENT_CLEF)
            markFlatAsSig((ClefEvent)e);
          else if (e.geteventtype()==Event.EVENT_MULTIEVENT)
            for (Iterator i=((MultiEvent)e).iterator(); i.hasNext();)
              {
                Event cure=(Event)i.next();
                if (cure.geteventtype()==Event.EVENT_CLEF)
                  markFlatAsSig((ClefEvent)cure);
              }
        }*/
	static markFlatAsSig(ce:ClefEvent):void
	{
		let c:Clef = ce.getClef_1(false,false);
		if( c.isflat())
			ce.setSignature(true);

	}
}
