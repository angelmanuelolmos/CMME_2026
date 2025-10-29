

/*----------------------------------------------------------------------*/
/*

        Module          : TacetInfo.java

        Package         : DataStruct

        Classes Included: TacetInfo

        Purpose         : Information about tacet text for one voice in
                          one section

        Programmer      : Ted Dumitrescu

        Date Started    : 12/22/07 (moved from MusicMensuralSection)

        Updates         :

                                                                        */
/*----------------------------------------------------------------------*/
export class TacetInfo
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public voiceNum:number;
	public tacetText:string;
	/*------------------------------------------------------------------------
Constructor: TacetInfo(int voiceNum,String tacetText)
Purpose:     Initialize info
Parameters:
  Input:  int voiceNum     - voice number
          String tacetText - textual tacet instruction
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(voiceNum:number,tacetText:string)
	{
		this.voiceNum = voiceNum;
		this.tacetText = tacetText;
	}
}
