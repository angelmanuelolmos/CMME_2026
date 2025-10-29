
import {DocumentListener } from '../event/DocumentListener'; 


export interface Document 
{ 
	putProperty(key:any, value:any):void

    addDocumentListener( listener:DocumentListener):void
    removeDocumentListener( listener:DocumentListener):void
} 

