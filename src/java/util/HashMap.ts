
import {Map  as JavaMap} from './Map'; 
import {AbstractMap } from './AbstractMap'; 
export class HashMap<K,V> extends AbstractMap< K, V> implements JavaMap< K, V>
{ 
	public constructor ( ) 
	{ 
		super();
	} 
	
	private map:Map<K, V> = new Map();

	public get (arg0: any ): V 
	{ 
		return this.map.get(arg0);
	} 
	
	public put (arg0: K ,arg1: V ): V 
	{ 
		this.map.set(arg0, arg1);
		return arg1;
	} 
	
	
} 

