
import { Exception } from '../java/lang/Exception';
import { File } from '../java/io/File';
import { URL } from '../java/net/URL';
import { MalformedURLException } from '../java/net/MalformedURLException';
import { URISyntaxException } from '../java/net/URISyntaxException';
import { JApplet } from '../javax/swing/JApplet';

export class AppContext
{
	public static CMME_OPT_TESTING:boolean = false;
	public static CMME_OPT_VALIDATEXML:boolean = false;
	public static NetBaseDataDomain:string = AppContext.CMME_OPT_TESTING ? "test2.cmme.org":"www.cmme.org";
	public static BaseDataRelativeDir:string = "data/";
	public static BaseDataDomain:string;
	public static BaseDataURL:string;
	public static BaseDataDir:string;

	/*
   * Calculates data directories depending on context
   *
   * @param aContext - applet for context info
   * @param local - whether to get data from local file system or net
   * @param inApplet - whether the context is a real or simulated applet
   */
	public static setBaseDataLocations(aContext:JApplet,local:boolean,inApplet:boolean):void
	{
		if( inApplet)
			AppContext.BaseDataDomain = aContext.getDocumentBase().getHost();
		else
			AppContext.BaseDataDomain = AppContext.NetBaseDataDomain;

		if( local)
			{
				AppContext.BaseDataDir = AppContext.getBaseAppPath() + AppContext.BaseDataRelativeDir;
				AppContext.BaseDataURL = AppContext.BaseDataDir;
			}

		else
			AppContext.BaseDataURL = AppContext.BaseDataDomain + AppContext.BaseDataRelativeDir;

	}

	/*"file:///"+*/
	/*"http://"+*/
	/*
   * Returns path to base running directory.
   * JAR path stuff horked from the internet
   *
   * @param o - object to use for getting base path
   * @return string with base path
   */
	static getBaseAppPath():string
	{
		let JARurl:string = "";
		try
		{
			let dir:File = new File(new URL(JARurl).toURI());
			JARurl = dir.getAbsolutePath();
		}
		catch( e)
		{
			if( e instanceof MalformedURLException)
				{
					JARurl = null;
				}

			else
				if( e instanceof URISyntaxException)
					{
						JARurl = null;
					}

				else
					throw e;

		}
		let DIRurl:string = null;
		try
		{
			DIRurl = new File(".").getCanonicalPath();
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					DIRurl = null;
				}

			else
				throw e;

		}
		return JARurl == null ? DIRurl:JARurl;
	}
}
