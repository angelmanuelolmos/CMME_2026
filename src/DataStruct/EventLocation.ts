

/*----------------------------------------------------------------------*/
/*

        Module          : EventLocation.java

        Package         : DataStruct

        Classes Included: EventLocation

        Purpose         : Store event location

        Programmer      : Ted Dumitrescu

        Date Started    : 1/23/08

        Updates         :

                                                                        */
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   EventLocation
Extends: -
Purpose: Low-level storage for event location (section number, voice
         number, index in event list)
------------------------------------------------------------------------*/
export class EventLocation
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public sectionNum:number;
	public voiceNum:number;
	public eventNum:number;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: EventLocation(int sectionNum,int voiceNum,int eventNum)
Purpose:     Initialization
Parameters:
  Input:  int sectionNum,voiceNum,eventNum - location attributes
  Output: -
------------------------------------------------------------------------*/
	public constructor(sectionNum:number,voiceNum:number,eventNum:number)
	{
		this.sectionNum = sectionNum;
		this.voiceNum = voiceNum;
		this.eventNum = eventNum;
	}

	/*------------------------------------------------------------------------
Method:  String toString()
Purpose: Convert to string
Parameters:
  Input:  -
  Output: -
  Return: string representation of this
------------------------------------------------------------------------*/
	public toString():string
	{
		return "S: " + this.sectionNum + " V: " + this.voiceNum + " E: " + this.eventNum;
	}
}
