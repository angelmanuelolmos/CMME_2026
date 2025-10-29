
import { AppContext } from './AppContext';
import { HashMap } from '../java/util/HashMap';
import { List } from '../java/util/List';
import { Document } from '../org/jdom/Document';
import { Element } from '../org/jdom/Element';

export class GlobalConfig
{

	/*----------------------------------------------------------------------*/
	/* Class variables/methods */
	public static get(key:string):string
	{
		return GlobalConfig.getConfigMap().getVal(key);
	}
	/* lazy-load config */
	private static CONFIG_LOC:string = "config/cmme-config.xml";
	private static configMap:GlobalConfig = null;

	private static getConfigMap():GlobalConfig
	{
		if( GlobalConfig.configMap == null)
			GlobalConfig.configMap = new GlobalConfig(AppContext.BaseDataURL + GlobalConfig.CONFIG_LOC);

		return GlobalConfig.configMap;
	}
	/*----------------------------------------------------------------------*/
	/* Instance variables/methods */
	private config:HashMap<string,string>;public constructor(configLoc:string)
	{
		this.config = this.readConfigFromFile(configLoc);
	}

	getVal(key:string):string
	{
		return this.config.get(key);
	}

	private readConfigFromFile(configLoc:string):HashMap<string,string>
	{
		let configDoc:Document;
		let cmap:HashMap<string,string> = new HashMap<string,string>();
		return cmap;
	}

	/*  try
      {
        configDoc = XMLReader.getNonValidatingParser().build(new URL(configLoc));
      }
    catch (Exception e)
      {
        System.err.println("Exception loading config file: " + e);
        return cmap;
      }

    readConfigTree(configDoc.getRootElement(), cmap, "", true);*/
	//CHANGE
	/* inserts entries with slash-separated keys into cmap, e.g., "MIDI/BPM"="80" */
	private readConfigTree(el:Element,cmap:HashMap<string,string>,mapNS:string,root:boolean):void
	{
		let k:string = el.getName();
		let childNS:string;
		let children:List<any> =<List<any>> el.getChildren_3();
		if( ! children.isEmpty())
			{
				childNS = root ? "":mapNS + k + "/";
				for(let child of children)
				this.readConfigTree(<Element> child,cmap,childNS,false);
			}

		else
			cmap.put(mapNS + k,el.getText());

	}
}
