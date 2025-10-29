

/*----------------------------------------------------------------------*/
/*

        Module          : RenderedStaffSystem

        Package         : Gfx

        Classes	Included: RenderedStaffSystem

        Purpose         : Parameters for one staff system in page display

        Programmer      : Ted Dumitrescu

        Date Started    : 8/2/06

        Updates:

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   RenderedStaffSystem
Extends: -
Purpose: One staff system in page display
------------------------------------------------------------------------*/
export class RenderedStaffSystem
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public startMeasure:number;
	public endMeasure:number;
	public leftX:number;
	public rightX:number;
	public topY:number;
	public numVoices:number;
	public spacingCoefficient:number = 1;
	public displayVoiceNames:boolean;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: RenderedStaffSystem(int sm,int lx,int rx,int topY,int numVoices,boolean displayVoiceNames)
Purpose:     Initialize structure
Parameters:
  Input:  int sm                    - starting measure number
          int lx,rx                 - left and right X-coordinates of system
          int topY                  - top Y-coordinate
          int numVoices             - number of voices
          boolean displayVoiceNames - whether to display voice names at left
  Output: -
------------------------------------------------------------------------*/
	public constructor(sm:number,lx:number,rx:number,topY:number,numVoices:number,displayVoiceNames:boolean)
	{
		this.startMeasure =( this.endMeasure = sm);
		this.leftX = lx;
		this.rightX = rx;
		this.topY = topY;
		this.numVoices = numVoices;
		this.displayVoiceNames = displayVoiceNames;
	}
}
