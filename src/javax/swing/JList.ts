

import {ListModel } from './ListModel'; 

import {Vector } from '../../java/util/Vector'; 

import {Scrollable } from './Scrollable'; 
import {JComponent } from './JComponent'; 
export class JList<E> extends JComponent implements Scrollable 
{ 
	public constructor(listData:Vector<E>)
	public constructor (arg0: ListModel<E> ) 
	public constructor(a:any = undefined)
	{ 
		super("div", ["JList"]);
		
	} 
	
	public setSelectionMode (mode: number ): void 
	{ 
		this.selectionMode = mode;
	} 

	private selectionMode:number;
	
	public setVisibleRowCount (arg0: number ): void 
	{ 
		this.visibleRowCount = arg0;
	} 

	private visibleRowCount:number;
	
	public setLayoutOrientation (arg0: number ): void 
	{ 
		this.layoutOrientation = arg0;
	} 

	private layoutOrientation:number;
	
	public static VERTICAL: number = 0;

	public static HORIZONTAL_WRAP:number =1;

	public getSelectedIndex():number
	{
		throw new Error();
	}

	public setSelectedIndex(index:number):void
	{
		throw new Error();
	}

	public setListData(listData:E[]):void
	public setListData(listData:Vector<E>):void
	public setListData(a:any)
	{
		throw new Error();
	}

	
	
} 

