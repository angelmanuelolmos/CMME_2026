
import {DocumentListener } from '../event/DocumentListener'; 


import {Document } from './Document'; 
export abstract class AbstractDocument implements Document 
{
    abstract putProperty(key: any, value: any): void;

    abstract addDocumentListener(listener: DocumentListener): void;

    abstract removeDocumentListener(listener: DocumentListener): void;
	
} 

