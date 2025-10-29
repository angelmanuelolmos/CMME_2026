
import { Float } from '../java/lang/Float';

/*----------------------------------------------------------------------*/
/*

        Module          : MetaData.java

        Package         : DataStruct

        Classes Included: MetaData

        Purpose         : CMME system meta-data

        Programmer      : Ted Dumitrescu

        Date Started    : 3/1/07

        Updates         :

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   MetaData
Extends: -
Purpose: CMME system meta-data
------------------------------------------------------------------------*/
export class MetaData
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static CMME_VERSION:string = "0.98";
	public static CMME_VERSION_FLOAT:number = Float.parseFloat(MetaData.CMME_VERSION);
	public static CMME_SOFTWARE_NAME:string = "CMME Editor v" + MetaData.CMME_VERSION;
	public static CMME_OPT_TESTING:boolean = false;
	public static CMME_OPT_VALIDATEXML:boolean = false;
}
