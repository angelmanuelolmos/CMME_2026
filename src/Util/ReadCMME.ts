
import { Exception } from '../java/lang/Exception';
import { System } from '../java/lang/System';
/*----------------------------------------------------------------------*/
/*

	Module		: ReadCMME.java

        Package         : Util

        Classes	Included: ReadCMME

	Purpose		: Standalone program to read CMME files into
                          data structures (for debugging and converting)

        Programmer	: Ted Dumitrescu

	Date Started	: 2/23/05

	Updates		:

									*/
/*----------------------------------------------------------------------*/
/*----------------------------------------------------------------------*/
/* Imported packages */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   ReadCMME
Extends: -
Purpose: Read CMME files into data structures
------------------------------------------------------------------------*/
import { CMMEParser } from '../DataStruct/CMMEParser';

export class ReadCMME
{

	/*----------------------------------------------------------------------*/
	/* Class variables */
	/*----------------------------------------------------------------------*/
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	/*----------------------------------------------------------------------*/
	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*----------------------------------------------------------------------*/
	/* Instance methods */
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
		if( args.length != 1)
			{
				System.err.println("Usage: java Util.ReadCMME filename");
				System.exit(1);
			}

		try
		{
			let p:CMMEParser = CMMEParser.new1("data\\music\\" + args[0]);
			p.piece.prettyprint();
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					System.err.println("Error loading " + args[0]+ ": " + e);
				}

			else
				throw e;

		}
	}
}
