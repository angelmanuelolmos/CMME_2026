

/*----------------------------------------------------------------------*/
/*

        Module          : RenderedScorePage

        Package         : Gfx

        Classes Included: RenderedScorePage

        Purpose         : Parameters for one page in score page display

        Programmer      : Ted Dumitrescu

        Date Started    : 8/2/06

        Updates         :

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   RenderedScorePage
Extends: -
Purpose: One page in scored page display
------------------------------------------------------------------------*/
export class RenderedScorePage
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public startSystem:number;
	public numSystems:number;
	public numStaves:number;
	public ySpace:number;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: RenderedScorePage(int ss,int ns)
Purpose:     Initialize structure
Parameters:
  Input:  int ss - starting system number
          int ns - number of systems on page
  Output: -
------------------------------------------------------------------------*/
	public constructor(ss:number,ns:number)
	{
		this.startSystem = ss;
		this.numSystems = ns;
		this.numStaves = 0;
		this.ySpace = 0;
	}
}
