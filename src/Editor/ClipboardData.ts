
import { TextDeleteDialog } from './TextDeleteDialog';
import { OriginalTextDeleteDialog } from './OriginalTextDeleteDialog';
import { NoteInfoPanel } from './NoteInfoPanel';
import { ModernTextDeleteDialog } from './ModernTextDeleteDialog';
import { ModernKeySigPanel } from './ModernKeySigPanel';
import { MensurationChooser } from './MensurationChooser';
import { GeneralInfoFrame } from './GeneralInfoFrame';
import { EditingOptionsFrame } from './EditingOptionsFrame';
import { ColorationChooser } from './ColorationChooser';
import { Event } from '../DataStruct/Event';
import { EventListData } from '../DataStruct/EventListData';
import { ScoreRenderer } from '../Gfx/ScoreRenderer';

export class ClipboardData
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	events:EventListData;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: ClipboardData(int snum,int vnum,int evnum1,int evnum2)
Purpose:     Init and copy events into list
Parameters:
  Input:  
  Output: -
------------------------------------------------------------------------*/
	public constructor(renderedSections:ScoreRenderer[],snum:number,vnum:number,evnum1:number,evnum2:number)
	{
		this.events = EventListData.new0();
		for(
		let ei:number = evnum1;ei <= evnum2;ei ++)
		{
			let e:Event = renderedSections[snum].eventinfo[vnum].getEvent(ei).getEvent_1();
			switch( e.geteventtype())
			{
				case Event.EVENT_VARIANTDATA_START:
				{
				}
				case Event.EVENT_VARIANTDATA_END:
				{
					break;
				}
				default:
				{
					let newe:Event = e.createCopy_1();
					this.events.addEvent_1(newe);
				}
			}
		}
	}

	/* copy events */
	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getEventList():EventListData
	{
		return this.events;
	}
}
