
import { Exception } from '../java/lang/Exception';
import { System } from '../java/lang/System';
import { Math } from '../java/lang/Math';
import { Character } from '../java/lang/Character';
import { VariantEditorFrame } from './VariantEditorFrame';
import { TextDeleteDialog } from './TextDeleteDialog';
import { OriginalTextDeleteDialog } from './OriginalTextDeleteDialog';
import { NoteInfoPanel } from './NoteInfoPanel';
import { ModernTextDeleteDialog } from './ModernTextDeleteDialog';
import { ModernKeySigPanel } from './ModernKeySigPanel';
import { MensurationChooser } from './MensurationChooser';
import { GeneralInfoFrame } from './GeneralInfoFrame';
import { EditorWin } from './EditorWin';
import { EditingOptionsFrame } from './EditingOptionsFrame';
import { ColorationChooser } from './ColorationChooser';
import { ClipboardData } from './ClipboardData';
import { Graphics2D } from '../java/awt/Graphics2D';
import { Color } from '../java/awt/Color';
import { Point } from '../java/awt/Point';
import { PrintStream } from '../java/io/PrintStream';
import { Iterator } from '../java/util/Iterator';
import { LinkedList } from '../java/util/LinkedList';
import { MouseListener } from '../java/awt/event/MouseListener';
import { MouseEvent } from '../java/awt/event/MouseEvent';
import { KeyEvent } from '../java/awt/event/KeyEvent';
import { MouseMotionListener } from '../java/awt/event/MouseMotionListener';
import { FocusListener } from '../java/awt/event/FocusListener';
import { ActionEvent } from '../java/awt/event/ActionEvent';
import { KeyListener } from '../java/awt/event/KeyListener';
import { FocusEvent } from '../java/awt/event/FocusEvent';
import { Timer } from '../javax/swing/Timer';
import { Action } from '../javax/swing/Action';
import { AbstractAction } from '../javax/swing/AbstractAction';
import { AnnotationTextEvent } from '../DataStruct/AnnotationTextEvent';
import { BarlineEvent } from '../DataStruct/BarlineEvent';
import { Clef } from '../DataStruct/Clef';
import { ClefEvent } from '../DataStruct/ClefEvent';
import { ClefSet } from '../DataStruct/ClefSet';
import { Coloration } from '../DataStruct/Coloration';
import { ColorChangeEvent } from '../DataStruct/ColorChangeEvent';
import { CustosEvent } from '../DataStruct/CustosEvent';
import { DotEvent } from '../DataStruct/DotEvent';
import { Event } from '../DataStruct/Event';
import { EventListData } from '../DataStruct/EventListData';
import { EventLocation } from '../DataStruct/EventLocation';
import { LacunaEvent } from '../DataStruct/LacunaEvent';
import { LineEndEvent } from '../DataStruct/LineEndEvent';
import { MensEvent } from '../DataStruct/MensEvent';
import { MensSignElement } from '../DataStruct/MensSignElement';
import { Mensuration } from '../DataStruct/Mensuration';
import { ModernAccidental } from '../DataStruct/ModernAccidental';
import { ModernKeySignature } from '../DataStruct/ModernKeySignature';
import { ModernKeySignatureEvent } from '../DataStruct/ModernKeySignatureEvent';
import { MultiEvent } from '../DataStruct/MultiEvent';
import { MusicChantSection } from '../DataStruct/MusicChantSection';
import { MusicMensuralSection } from '../DataStruct/MusicMensuralSection';
import { MusicSection } from '../DataStruct/MusicSection';
import { NoteEvent } from '../DataStruct/NoteEvent';
import { OriginalTextEvent } from '../DataStruct/OriginalTextEvent';
import { PieceData } from '../DataStruct/PieceData';
import { Pitch } from '../DataStruct/Pitch';
import { Proportion } from '../DataStruct/Proportion';
import { ProportionEvent } from '../DataStruct/ProportionEvent';
import { RestEvent } from '../DataStruct/RestEvent';
import { Signum } from '../DataStruct/Signum';
import { VariantMarkerEvent } from '../DataStruct/VariantMarkerEvent';
import { VariantReading } from '../DataStruct/VariantReading';
import { VariantVersionData } from '../DataStruct/VariantVersionData';
import { Voice } from '../DataStruct/Voice';
import { VoiceChantData } from '../DataStruct/VoiceChantData';
import { VoiceEventListData } from '../DataStruct/VoiceEventListData';
import { VoiceMensuralData } from '../DataStruct/VoiceMensuralData';
import { MeasureInfo } from '../Gfx/MeasureInfo';
import { MusicFont } from '../Gfx/MusicFont';
import { MusicWin } from '../Gfx/MusicWin';
import { OptionSet } from '../Gfx/OptionSet';
import { RenderedClefSet } from '../Gfx/RenderedClefSet';
import { RenderedEvent } from '../Gfx/RenderedEvent';
import { RenderedEventGroup } from '../Gfx/RenderedEventGroup';
import { ViewCanvas } from '../Gfx/ViewCanvas';
/*------------------------------------------------------------------------
Class:   ScoreEditorCanvas
Extends: Gfx.ViewCanvas
Purpose: Handles music-editing area (in score view)
------------------------------------------------------------------------*/
import { Analyzer } from '../Util/Analyzer';

export class ScoreEditorCanvas extends ViewCanvas implements KeyListener,MouseListener,MouseMotionListener,FocusListener
{
	mytype_FocusListener:boolean = true;
	mytype_MouseMotionListener:boolean = true;
	mytype_MouseListener:boolean = true;
	mytype_KeyListener:boolean = true;
	/*----------------------------------------------------------------------*/
	/* Class variables */
	public static clipboard:ClipboardData = null;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	parentEditorWin:EditorWin;
	Cursor:EditorCursor;
	Cursor_Timer:Timer;
	hl_anchor:number = - 1;
	/* event index where highlight began */
	focused:boolean = false;
	/* whether the canvas has the input focus */
	/* input-control parameters */
	editorColorationType:number = Coloration.MINOR_COLOR;
	editorStemDir:number = NoteEvent.STEM_UP;
	colorationOn:boolean = false;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: ScoreEditorCanvas(PieceData p,MusicFont mf,MusicWin mw,OptionSet os)
Purpose:     Initialize canvas
Parameters:
  Input:  PieceData p,MusicFont mf,MusicWin mw,OptionSet os - ViewCanvas params
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(p:PieceData,mf:MusicFont,mw:MusicWin,os:OptionSet)
	{
		super(p,mf,mw,os);
		this.parentEditorWin =<EditorWin> this.parentwin;
		this.Cursor = new EditorCursor(this);
		let updateCursorAction:Action =
		{

			/* initialize cursor */
			/* cursor blinking */
			actionPerformed:(e:ActionEvent):void =>
			{
				this.Cursor.toggleCursor();
			}
		}
		;
		this.Cursor_Timer = new Timer(500,updateCursorAction);
		this.Cursor_Timer.start();
		this.addKeyListener(this);
		this.addMouseMotionListener(this);
		this.setFocusable(true);
		this.addFocusListener(this);
	}

	/* input handlers */
	//    addMouseListener(this);
	/*------------------------------------------------------------------------
Method:    void realpaintbuffer(Graphics2D g)
Overrides: Gfx.ViewCanvas.realpaintbuffer
Purpose:   Repaint area into offscreen buffer
Parameters:
  Input:  Graphics2D g - offscreen graphical context
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public realpaintbuffer_1(g:Graphics2D):void
	{
		super.realpaintbuffer_1(g);
		this.Cursor.repaintHighlight(g);
	}

	/*------------------------------------------------------------------------
Method:  void showCursor()
Purpose: Enable cursor display
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public showCursor():void
	{
		this.Cursor.showCursor();
	}

	/*------------------------------------------------------------------------
Method:  void shiftCursorLoc(int xs,int vs)
Purpose: Attempt to shift cursor position
Parameters:
  Input:  int xs - number of events to go left/right
          int vs - number of voices to go up/down
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public shiftCursorLoc(xs:number,vs:number):void
	{
		this.Cursor.shiftCursorLoc(xs,vs);
		this.parentEditorWin.updateEventEditor_1();
	}

	/*------------------------------------------------------------------------
Method:  void modifyHighlight(int xs)
Purpose: Attempt to expand or contract highlight
Parameters:
  Input:  int xs - number of events to expand/contract left/right
  Output: -
  Return: -
------------------------------------------------------------------------*/
	modifyHighlight(xs:number):void
	{
		this.Cursor.modifyHighlight(xs);
		if( this.Cursor.oneItemHighlighted())
			this.parentEditorWin.updateEventEditor_3(this.getCurEvent_2());
		else
			if( this.Cursor.getHighlightBegin() == - 1)
				this.parentEditorWin.updateEventEditor_1();
			else
				this.parentEditorWin.updateEventEditor_2((((( this.Cursor.getHighlightEnd() - this.Cursor.getHighlightBegin()) | 0) + 1) | 0));

	}

	/*------------------------------------------------------------------------
Method:  void shiftHighlightWithinMultiEvent(int offset)
Purpose: Attempt to shift cursor position within multi-event
Parameters:
  Input:  int offset - number of events to shift
  Output: -
  Return: -
------------------------------------------------------------------------*/
	shiftHighlightWithinMultiEvent(offset:number):void
	{
		this.Cursor.shiftHighlightWithinMultiEvent(offset);
	}

	/*------------------------------------------------------------------------
Method:  void moveCursor(int newsnum,int newvnum,int neweventnum)
Purpose: Move cursor to a new position and display
Parameters:
  Input:  int newsnum,newvnum,neweventnum - new cursor parameters
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public moveCursor(newsnum:number,newvnum:number,neweventnum:number):void
	{
		this.Cursor.moveCursor(newsnum,newvnum,neweventnum);
		this.parentEditorWin.updateEventEditor_1();
	}

	/*------------------------------------------------------------------------
Method:  void newCursorLoc(int x,int y)
Purpose: Attempt to move cursor to a given XY position in canvas
Parameters:
  Input:  int x - desired x position
          int y - desired y position
  Output: -
  Return: -
------------------------------------------------------------------------*/
	newCursorLoc(x:number,y:number):void
	{
		this.Cursor.newCursorLoc(x,y);
		this.parentEditorWin.updateEventEditor_1();
	}

	/*------------------------------------------------------------------------
Method:  void moveCursorToHome()
Purpose: Move cursor to start of current voice
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public moveCursorToHome():void
	{
		let vnum:number = this.Cursor.getVoiceNum();
		let snum:number = 0;
		while( snum < this.numSections && this.renderedSections[snum].eventinfo[vnum]== null)
		snum ++;
		if( snum == this.numSections)
			snum = 0;

		this.moveCursor(snum,vnum,0);
	}

	/* choose valid location for this voice */
	/*------------------------------------------------------------------------
Method:  void moveCursorToEnd()
Purpose: Move cursor to end of current voice
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public moveCursorToEnd():void
	{
		let vnum:number = this.Cursor.getVoiceNum();
		let snum:number =(( this.numSections - 1) | 0);
		let evnum:number = 0;
		while( snum >= 0 && this.renderedSections[snum].eventinfo[vnum]== null)
		snum --;
		if( snum < 0)
			snum = 0;
		else
			evnum =(( this.renderedSections[snum].eventinfo[vnum].size() - 1) | 0);

		this.moveCursor(snum,vnum,evnum);
	}

	/* choose valid location for this voice */
	/*------------------------------------------------------------------------
Method:  void highlightItems(int snum,int vnum,int firstenum,int lastenum)
Purpose: Highlight one or more events and update GUI if necessary
Parameters:
  Input:  int snum,vnum          - section/voice number
          int firstenum,lastenum - indices of first and last events to be highlighted
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public highlightItems(snum:number,vnum:number,firstenum:number,lastenum:number):void
	{
		this.Cursor.highlightEvents(snum,vnum,firstenum,lastenum);
		if( this.Cursor.oneItemHighlighted())
			this.parentEditorWin.updateEventEditor_3(this.getCurEvent_2());
		else
			this.parentEditorWin.updateEventEditor_2((((( lastenum - firstenum) | 0) + 1) | 0));

	}

	public highlightOneItem(snum:number,vnum:number,eventnum:number):void
	{
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	public highlightAll():void
	{
		this.hl_anchor = 0;
		this.highlightItems(this.Cursor.getSectionNum(),this.Cursor.getVoiceNum(),0,(( this.renderedSections[this.Cursor.getSectionNum()].eventinfo[this.Cursor.getVoiceNum()].size() - 2) | 0));
	}

	/*------------------------------------------------------------------------
Method:  void clipboard[Copy|Cut|Paste]()
Purpose: Clipboard functions based on current cursor position and
         highlighted items
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public clipboardCopy_1():void
	{
		if( this.Cursor.getHighlightBegin() < 0)
			ScoreEditorCanvas.clipboard = null;
		else
			ScoreEditorCanvas.clipboard = new ClipboardData(this.renderedSections,this.Cursor.getSectionNum(),this.Cursor.getVoiceNum(),this.Cursor.getHighlightBegin(),this.Cursor.getHighlightEnd());

	}

	public clipboardCut_1():void
	{
		this.clipboardCopy_1();
		this.deleteHighlightedItems();
	}

	public clipboardPaste_1():void
	{
		if( this.Cursor.getHighlightBegin() >= 0)
			this.deleteHighlightedItems();

		this.insertEventList(this.Cursor.getSectionNum(),this.Cursor.getVoiceNum(),this.Cursor.getEventNum(),ScoreEditorCanvas.clipboard.getEventList().createCopy());
	}
	/*------------------------------------------------------------------------
Method:  int deleteItem(int snum,int vnum,int eventnum)
Purpose: Delete one event and adjust context if necessary
Parameters:
  Input:  int snum,vnum,eventnum - section, voice and event number for deletion
  Output: -
  Return: number of items actually deleted
------------------------------------------------------------------------*/
	secondDeletedIndex:number;

	/* if we delete more than one item, index of the second */
	deleteItem(snum:number,vnum:number,eventnum:number):number
	{
		let itemsdeleted:number = 1;
		this.secondDeletedIndex = - 1;
		let ev_to_delete:Event = this.renderedSections[snum].eventinfo[vnum].getEvent(eventnum).getEvent_1();
		if( ev_to_delete.geteventtype() == Event.EVENT_NOTE && this.curVariantVersion == this.musicData.getDefaultVariantVersion())
			{
				let nexte:RenderedEvent = this.renderedSections[snum].eventinfo[vnum].getEvent((( eventnum + 1) | 0));
				if( nexte != null && nexte.getEvent_1().geteventtype() == Event.EVENT_DOT &&((<DotEvent> nexte.getEvent_1()).getdottype() & DotEvent.DT_Addition) != 0)
					{
						this.musicData.deleteEvent(snum,vnum,this.renderedSections[snum].getVoicedataPlace(vnum,(( eventnum + 1) | 0)));
						itemsdeleted ++;
					}

			}

		else
			if( ev_to_delete.geteventtype() == Event.EVENT_DOT &&((<DotEvent> ev_to_delete).getdottype() & DotEvent.DT_Addition) != 0 && this.curVariantVersion == this.musicData.getDefaultVariantVersion())
				{
					let lastne:NoteEvent =<NoteEvent> this.getNeighboringEventOfType(Event.EVENT_NOTE,snum,vnum,(( eventnum - 1) | 0),- 1);
					if( lastne != null)
						{
							let notelength:Proportion = lastne.getLength_1();
							notelength.multiply_1(2,3);
						}

				}

			else
				if( ev_to_delete.geteventtype() == Event.EVENT_VARIANTDATA_START)
					{
						let ei:number =(( eventnum + 1) | 0);
						let cure:Event = this.renderedSections[snum].eventinfo[vnum].getEvent(ei).getEvent_1();
						while( cure.geteventtype() != Event.EVENT_VARIANTDATA_END)
						{
							cure = this.renderedSections[snum].eventinfo[vnum].getEvent(++ ei).getEvent_1();
						}
						this.secondDeletedIndex = ei;
						this.musicData.deleteEvent(snum,vnum,this.renderedSections[snum].getVoicedataPlace(vnum,ei));
					}

				else
					if( ev_to_delete.geteventtype() == Event.EVENT_VARIANTDATA_END)
						{
							let ei:number =(( eventnum - 1) | 0);
							let cure:Event = this.renderedSections[snum].eventinfo[vnum].getEvent(ei).getEvent_1();
							while( cure.geteventtype() != Event.EVENT_VARIANTDATA_START)
							{
								cure = this.renderedSections[snum].eventinfo[vnum].getEvent(-- ei).getEvent_1();
							}
							this.secondDeletedIndex = ei;
							this.musicData.deleteEvent(snum,vnum,this.renderedSections[snum].getVoicedataPlace(vnum,eventnum));
							eventnum = ei;
						}

					else
						if( ev_to_delete.geteventtype() == Event.EVENT_LACUNA)
							{
							}

		let listPos:number = this.renderedSections[snum].getVoicedataPlace(vnum,eventnum);
		if( this.curVariantVersion != this.musicData.getDefaultVariantVersion())
			{
				let eventPos:number = this.musicData.deleteVariantEvent(this.curVariantVersion,this.curVersionMusicData,snum,vnum,listPos);
				switch( eventPos)
				{
					case VariantReading.NEWVARIANT:
					{
						listPos ++;
						eventnum ++;
						break;
					}
					case VariantReading.BEGINNING:
					{
						break;
					}
					case VariantReading.MIDDLE:
					{
						break;
					}
					case VariantReading.END:
					{
						break;
					}
					case VariantReading.COMBINED:
					{
					}
					case VariantReading.DELETED:
					{
						listPos --;
						eventnum --;
						itemsdeleted += 2;
						this.secondDeletedIndex = listPos;
						break;
					}
					case VariantReading.NOACTION:
					{
						return itemsdeleted;
					}
					case VariantReading.NEWREADING:
					{
						let vmi1:number = this.getNeighboringEventNumOfType(Event.EVENT_VARIANTDATA_START,snum,vnum,eventnum,- 1);
						let vmi2:number = this.getNeighboringEventNumOfType(Event.EVENT_VARIANTDATA_END,snum,vnum,eventnum,1);
						let varListPlace:number =(( this.renderedSections[snum].getVoicedataPlace(vnum,vmi1) + 1) | 0);
						for(
						let vi:number =(( vmi1 + 1) | 0);vi < vmi2;vi ++)
						{
							let re:RenderedEvent = this.renderedSections[snum].eventinfo[vnum].getEvent(vi);
							re.setEvent(this.curVersionMusicData.getEvent_2(snum,vnum,varListPlace ++));
						}
						break;
					}
				}
			}

		this.curVersionMusicData.deleteEvent(snum,vnum,listPos);
		return itemsdeleted;
	}

	/* deal with other events affected by the event to be deleted */
	/* delete dot attached to note */
	/* change length of notes affected by dots of addition */
	//            cure.setEditorial(false);
	/* now delete VARIANTDATA_END event */
	//            cure.setEditorial(false);
	/* now delete VARIANTDATA_END event, set START as main item to be deleted */
	// insert code to deal with deleting LACUNA and LACUNA_END simultaneously
	/* delete main event */
	/* create/modify variant data */
	/* reading has been added; update render list to contain replaced events */
	/*------------------------------------------------------------------------
Method:  void deleteHighlightedItems()
Purpose: Attempt to delete highlighted events
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	deleteWithoutRender(snum:number,vnum:number,firstEventNum:number,lastEventNum:number):number
	{
		let newevnum:number = firstEventNum;
		let endEvent:number = lastEventNum;
		for(
		let i:number = firstEventNum;i <= endEvent;)
		{
			i += this.deleteItem(snum,vnum,i);
			if( this.secondDeletedIndex > - 1 && this.secondDeletedIndex <= lastEventNum)
				if( this.secondDeletedIndex >= firstEventNum)
					endEvent --;
				else
					newevnum --;

		}
		return newevnum;
	}

	deleteHighlightedWithoutRender():number
	{
		return this.deleteWithoutRender(this.Cursor.getSectionNum(),this.Cursor.getVoiceNum(),this.Cursor.getHighlightBegin(),this.Cursor.getHighlightEnd());
	}

	public deleteHighlightedItems():void
	{
		if( this.Cursor.getHighlightBegin() < 0)
			return;

		let mei:number = this.Cursor.getMultiEventHLindex();
		if( mei != - 1)
			{
				this.deleteHighlightedItemWithinMultiEvent(mei);
				return;
			}

		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		for(
		let i:number = this.Cursor.getHighlightBegin();i <= this.Cursor.getHighlightEnd();i ++)
		if( this.getEvent(snum,vnum,i).getEvent_1() instanceof VariantMarkerEvent)
			return;

		let newevnum:number = this.deleteHighlightedWithoutRender();
		this.Cursor.setNoHighlight();
		this.rerender_1();
		this.checkVariant(snum,vnum,newevnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.moveCursor(snum,vnum,newevnum);
	}

	/* nothing highlighted */
	/* check for variant markers */
	deleteHighlightedItemWithinMultiEvent(mei:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let e:Event = this.getCurEvent_2().getEvent_1();
		let me:Event = this.getCurMainEvent().getEvent_1();
		let newme:Event =(<MultiEvent> me).deleteEvent(e);
		if( newme == me)
			{
				this.rerender_1();
				this.shiftHighlightWithinMultiEvent(0);
			}

		else
			{
				this.Cursor.resetMultiEventHLindex();
				this.deleteItem(snum,vnum,eventnum);
				eventnum = this.insertEvent(snum,vnum,eventnum,newme);
				this.rerender_1();
			}

		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void deleteCurItem(int event_offset)
Purpose: Attempt to delete event at location relative to cursor position
Parameters:
  Input:  int event_offset - offset from current cursor location for event
                             to delete
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public deleteCurItem(event_offset:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number =(( this.Cursor.getEventNum() + event_offset) | 0);
		if( eventnum < 0 || eventnum >=(( this.renderedSections[snum].eventinfo[vnum].size() - 1) | 0))
			return;

		let re:RenderedEvent = this.renderedSections[snum].eventinfo[vnum].getEvent(eventnum);
		let offsetAdd:number = event_offset < 0 ? - 1:1;
		while( re != null &&( ! re.isdisplayed() || re.getEvent_1().geteventtype() == Event.EVENT_VARIANTDATA_START || re.getEvent_1().geteventtype() == Event.EVENT_VARIANTDATA_END))
		{
			eventnum += offsetAdd;
			if( eventnum < 0 || eventnum >=(( this.renderedSections[snum].eventinfo[vnum].size() - 1) | 0))
				re = null;
			else
				re = this.renderedSections[snum].eventinfo[vnum].getEvent(eventnum);

		}
		if( eventnum < 0 || eventnum >=(( this.renderedSections[snum].eventinfo[vnum].size() - 1) | 0))
			return;

		this.Cursor.hideCursor();
		this.deleteItem(snum,vnum,eventnum);
		if( this.secondDeletedIndex > - 1 && this.secondDeletedIndex < eventnum)
			eventnum --;

		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.moveCursor(snum,vnum,eventnum);
	}

	/* don't delete invisible items */
	/*------------------------------------------------------------------------
Method:  int insertEvent(int snum,int vnum,int eventnum,Event e)
Purpose: Insert event at given location and display
Parameters:
  Input:  int snum,vnum,eventnum - section, voice, and event number for insertion
          Event e                - event to insert
  Output: -
  Return: list index where event was inserted
------------------------------------------------------------------------*/
	insertEventWithoutRerender(snum:number,vnum:number,eventnum:number,e:Event):number
	{
		e.setcolorparams_1(this.getCurColoration(snum,vnum,(( eventnum - 1) | 0)));
		e.setModernKeySigParams(this.getCurModernKeySig(snum,vnum,(( eventnum - 1) | 0)));
		let listPos:number = this.renderedSections[snum].getVoicedataPlace(vnum,eventnum);
		if( this.curVariantVersion != this.musicData.getDefaultVariantVersion())
			{
				let eventPos:number = this.musicData.addVariantEvent(this.curVariantVersion,this.curVersionMusicData,snum,vnum,listPos,this.renderedSections[snum].getDefaultVoicedataPlace(vnum,eventnum),e);
				switch( eventPos)
				{
					case VariantReading.NEWVARIANT:
					{
						listPos ++;
						eventnum ++;
						break;
					}
					case VariantReading.BEGINNING:
					{
						listPos ++;
						eventnum ++;
						break;
					}
					case VariantReading.MIDDLE:
					{
						break;
					}
					case VariantReading.END:
					{
						listPos --;
						eventnum --;
						break;
					}
				}
			}

		this.curVersionMusicData.addEvent(snum,vnum,listPos,e);
		return listPos;
	}

	//    e.setEditorial(inEditorialSection(snum,vnum,eventnum-1));
	/* create variant data */
	insertEvent(snum:number,vnum:number,eventnum:number,e:Event):number
	{
		eventnum = this.insertEventWithoutRerender(snum,vnum,eventnum,e);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
		return eventnum;
	}

	insertEventList(snum:number,vnum:number,eventnum:number,el:EventListData):number
	{
		let origEventnum:number = eventnum;
		for(
		let ei:number = 0;ei < el.getNumEvents();ei ++)
		{
			eventnum =(( this.insertEventWithoutRerender(snum,vnum,eventnum,el.getEvent(ei)) + 1) | 0);
			this.rerender_2(snum);
		}
		this.curVersionMusicData.getSection(snum).getVoice_1(vnum).recalcEventParams_1();
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.moveCursor(snum,vnum,eventnum);
		return eventnum;
	}

	/*------------------------------------------------------------------------
Method:  long checkVariant(int snum,int vnum,int eventNum)
Purpose: (Re-)calculate variant type flags at a given location
Parameters:
  Input:  int snum,vnum,eventNum - section, voice, and event number
  Output: -
  Return: new flags representing variation types present
------------------------------------------------------------------------*/
	checkVariant(snum:number,vnum:number,eventNum:number):number
	{
		let re:RenderedEvent = this.getEvent(snum,vnum,eventNum);
		let renderedVar:RenderedEventGroup = null;
		if( re != null)
			renderedVar = this.renderedSections[snum].eventinfo[vnum].getEvent(eventNum).getVarReadingInfo();

		if( renderedVar == null)
			return VariantReading.VAR_NONE;

		let vme1:VariantMarkerEvent =<VariantMarkerEvent> this.getEvent(snum,vnum,renderedVar.firstEventNum).getEvent_1();
		let vme2:VariantMarkerEvent =<VariantMarkerEvent> this.getEvent(snum,vnum,renderedVar.lastEventNum).getEvent_1();
		let origvt:number = vme1.getVarTypeFlags();
		let vt:number = vme1.calcVariantTypes(this.musicData.getSection(snum).getVoice_1(vnum));
		vme2.setVarTypeFlags(vt);
		if( vt != origvt &&( vt == VariantReading.VAR_ORIGTEXT || origvt == VariantReading.VAR_ORIGTEXT))
			this.rerender_1();

		return vt;
	}

	/* no variants here */
	/*------------------------------------------------------------------------
Method:  Event getEventForModification(int snum,int vnum,int eventnum)
Purpose: Locate event for modification, or create new variant reading if
         necessary with copy of default event
Parameters:
  Input:  int snum,vnum,eventnum - section, voice, and event number
  Output: -
  Return: event to be modified
------------------------------------------------------------------------*/
	getEventForModification(snum:number,vnum:number,eventnum:number):Event
	{
		let e:Event = this.getEvent(snum,vnum,eventnum).getEvent_1();
		if( this.curVariantVersion != this.musicData.getDefaultVariantVersion())
			return this.musicData.duplicateEventInVariant(this.curVariantVersion,this.curVersionMusicData,snum,vnum,e.getListPlace(false));
		else
			return e;

	}

	/* in default reading */
	/*------------------------------------------------------------------------
Method:  Event getEventsForModification(int snum,int vnum,int e1i,int e2i)
Purpose: Locate events for modification, creating new variant reading if
         necessary
Parameters:
  Input:  int snum,vnum - section and voice number
          int e1i,e2i   - (rendered) event numbers of first and second events
  Output: -
  Return: first event to be modified
------------------------------------------------------------------------*/
	getEventsForModification(snum:number,vnum:number,e1i:number,e2i:number):Event
	{
		let e1:Event = this.renderedSections[snum].eventinfo[vnum].getEvent(e1i).getEvent_1();
		let e2:Event = this.renderedSections[snum].eventinfo[vnum].getEvent(e2i).getEvent_1();
		if( this.curVariantVersion != this.musicData.getDefaultVariantVersion())
			return this.musicData.duplicateEventsInVariant(this.curVariantVersion,this.curVersionMusicData,snum,vnum,e1.getListPlace(false),e2.getListPlace(false));
		else
			return e1;

	}

	/* in default reading */
	/*------------------------------------------------------------------------
Method:  NoteEvent getNoteEventForLigation(int snum,int vnum,int note1i,int note2i)
Purpose: Locate note event for modification of ligation, creating new
         variant reading if necessary
Parameters:
  Input:  int snum,vnum     - section and voice, and event number
          int note1i,note2i - (rendered) event numbers of first and second
                              notes for ligature modification
  Output: -
  Return: event to be modified
------------------------------------------------------------------------*/
	getNoteEventForLigation(snum:number,vnum:number,note1i:number,note2i:number):NoteEvent
	{
		let ne1:NoteEvent =<NoteEvent> this.renderedSections[snum].eventinfo[vnum].getEvent(note1i).getEvent_1();
		let ne2:NoteEvent =<NoteEvent> this.renderedSections[snum].eventinfo[vnum].getEvent(note2i).getEvent_1();
		if( this.curVariantVersion != this.musicData.getDefaultVariantVersion())
			return<NoteEvent> this.musicData.duplicateEventsInVariant(this.curVariantVersion,this.curVersionMusicData,snum,vnum,ne1.getListPlace(false),ne2.getListPlace(false));
		else
			return ne1;

	}

	/* in default reading */
	/*------------------------------------------------------------------------
Method:  void setEventProportion(Proportion p)
Purpose: Modify one number in an event's proportion (Note, Rest, Proportion, etc)
Parameters:
  Input:  Proportion p - new proportion for event
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setEventProportion(p:Proportion):void
	{
		if( ! this.Cursor.oneItemHighlighted())
			System.err.println("Error: more than one item highlighted");

		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let origEvent:Event = this.getCurEvent_2().getEvent_1();
		let oldp:Proportion;
		if( origEvent.geteventtype() == Event.EVENT_PROPORTION)
			oldp =(<ProportionEvent> origEvent).getproportion();
		else
			if( origEvent.geteventtype() == Event.EVENT_MENS)
				oldp =(<MensEvent> origEvent).getTempoChange();
			else
				oldp = Proportion.new1(origEvent.getLength_1());

		if( p.i2 <= 0 || p.i1 <= 0 || p.equals(oldp))
			return;

		this.Cursor.hideCursor();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - origEvent.getListPlace(! this.inVariantVersion())) | 0);
		if( e.geteventtype() == Event.EVENT_LACUNA)
			(<LacunaEvent> e).setLength_1(p);
		else
			if( e.geteventtype() == Event.EVENT_MENS)
				(<MensEvent> e).setTempoChange(p);
			else
				if( e.geteventtype() == Event.EVENT_NOTE)
					(<NoteEvent> e).setLength_1(p);
				else
					if( e.geteventtype() == Event.EVENT_PROPORTION)
						(<ProportionEvent> e).setproportion_2(p);
					else
						if( e.geteventtype() == Event.EVENT_REST)
							(<RestEvent> e).setLength_1(p);
						else
							System.err.println("Error: no proportion for this type of event");

		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/* save old proportion to check for file modification */
	/* check for file modification 
    Proportion newp;
    if (e.geteventtype()==Event.EVENT_PROPORTION)
      newp=((ProportionEvent)e).getproportion();
    else
      newp=new Proportion(e.getLength());*/
	/*------------------------------------------------------------------------
Method:  void setEventCommentary(String c)
Purpose: Set editorial commentary text for any event
Parameters:
  Input:  String c - new commentary text
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setEventCommentary(c:string):void
	{
		if( ! this.Cursor.oneItemHighlighted())
			System.err.println("Error: more than one item highlighted");

		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let oldCommNull:boolean = orige.getEdCommentary() == null;
		let newCommNull:boolean =( c == "");
		if( oldCommNull && newCommNull)
			return;

		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		if(( c == ""))
			c = null;

		e.setEdCommentary(c);
		this.Cursor.hideCursor();
		this.parentEditorWin.fileModified_2();
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void makeMultiEvent()
Purpose: Combine this event and the previous one to make a multi-event
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public makeMultiEvent():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		if( eventnum == 0 || ! this.validMultiEventType(orige) ||( orige.geteventtype() == Event.EVENT_DOT &&((<DotEvent> orige).getdottype() & DotEvent.DT_Addition) != 0))
			return;

		let origprev:Event = this.getCurEvent_1(- 1).getEvent_1();
		if( ! this.validMultiEventType(origprev) && origprev.geteventtype() != Event.EVENT_MULTIEVENT)
			return;

		let prev:Event = this.getEventsForModification(snum,vnum,(( eventnum - 1) | 0),eventnum);
		if( prev == null)
			return;

		eventnum --;
		if( prev != origprev)
			{
				eventnum +=(( prev.getListPlace(! this.inVariantVersion()) - origprev.getListPlace(! this.inVariantVersion())) | 0);
				this.rerender_1();
			}

		let e:Event = this.getRenderedEvent(snum,vnum,(( eventnum + 1) | 0)).getEvent_1();
		let me:MultiEvent;
		if( prev.geteventtype() == Event.EVENT_MULTIEVENT)
			{
				me =<MultiEvent> prev;
				me.addEvent(e);
				this.deleteItem(snum,vnum,(( eventnum + 1) | 0));
			}

		else
			{
				me = MultiEvent.new23();
				me.addEvent(prev);
				me.addEvent(e);
				this.deleteItem(snum,vnum,(( eventnum + 1) | 0));
				this.deleteItem(snum,vnum,eventnum);
				this.insertEvent(snum,vnum,eventnum,me);
			}

		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/* check if event is valid for combination with previous */
	/* attempt to create invalid variant arrangement */
	/* eventnum now needs to match first event */
	/* combine into multi-event */
	validMultiEventType(e:Event):boolean
	{
		if( e.geteventtype() == Event.EVENT_LINEEND || e.geteventtype() == Event.EVENT_SECTIONEND || e.geteventtype() == Event.EVENT_PROPORTION || e.geteventtype() == Event.EVENT_COLORCHANGE || e instanceof VariantMarkerEvent)
			return false;

		return true;
	}

	/*------------------------------------------------------------------------
Method:  void insertEditorialDataSection()
Purpose: Insert editorial section start and end markers at current cursor
         location
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public insertEditorialDataSection():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		if( this.inEditorialSection(snum,vnum,eventnum))
			return;

		this.Cursor.hideCursor();
		let eds:Event = Event.new1(Event.EVENT_VARIANTDATA_START);
		let ede:Event = Event.new1(Event.EVENT_VARIANTDATA_END);
		let insertionPlace:number = this.renderedSections[snum].getVoicedataPlace(vnum,eventnum);
		this.musicData.getSection(snum).getVoice_1(vnum).addEvent_2(insertionPlace,ede);
		this.musicData.getSection(snum).getVoice_1(vnum).addEvent_2(insertionPlace,eds);
		this.Cursor.setNoHighlight();
		this.rerender_1();
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.moveCursor(snum,vnum,(( eventnum + 1) | 0));
	}

	/*------------------------------------------------------------------------
Method:  void toggleEditorialData()
Purpose: Toggle whether highlighted events are part of an editorial data
         section
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public toggleEditorialData():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let firstenum:number = this.Cursor.getHighlightBegin();
		let lastenum:number = this.Cursor.getHighlightEnd();
		this.Cursor.hideCursor();
		this.Cursor.setNoHighlight();
		this.rerender_1();
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.moveCursor(snum,vnum,(( firstenum + 1) | 0));
	}

	/*    Event eds=new Event(Event.EVENT_VARIANTDATA_START),
          ede=new Event(Event.EVENT_VARIANTDATA_END);
    if (inEditorialSection(snum,vnum,firstenum))
      {
        musicData.getSection(snum).getVoice(vnum).addEvent(renderedSections[snum].getVoicedataPlace(vnum,lastenum+1),eds);
        musicData.getSection(snum).getVoice(vnum).addEvent(renderedSections[snum].getVoicedataPlace(vnum,firstenum),ede);
      }
    else
      {
        musicData.getSection(snum).getVoice(vnum).addEvent(renderedSections[snum].getVoicedataPlace(vnum,lastenum+1),ede);
        musicData.getSection(snum).getVoice(vnum).addEvent(renderedSections[snum].getVoicedataPlace(vnum,firstenum),eds);
      }*/
	/*------------------------------------------------------------------------
Method:  void toggle[Editorial|Error]()
Purpose: Change generic attributes of currently highlighted event
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	toggleEditorial():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		e.setEditorial(! e.isEditorial());
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	toggleHighlightedEditorial():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let firste:number = this.Cursor.getHighlightBegin();
		let laste:number = this.Cursor.getHighlightEnd();
		let orige:Event = this.renderedSections[snum].eventinfo[vnum].getEvent(firste).getEvent_1();
		let e:Event = this.getEventsForModification(snum,vnum,firste,laste);
		if( e == null)
			return;

		firste +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		laste +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		this.rerender_1();
		for(
		let i:number = firste;i <= laste;i ++)
		{
			let re:RenderedEvent = this.renderedSections[snum].eventinfo[vnum].getEvent(i);
			e = re.getEvent_1();
			e.setEditorial(! e.isEditorial());
		}
		this.rerender_1();
		this.checkVariant(snum,vnum,firste);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = firste;
		this.highlightItems(snum,vnum,firste,laste);
	}

	/* attempt to create invalid variant arrangement */
	//eventnum;
	toggleError():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		e.setError(! e.isError());
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:    void setMusicDataForDisplay(PieceData musicData)
Overrides: Gfx.ViewCanvas.setMusicDataForDisplay
Purpose:   Update rendered data to match current variant version
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setMusicDataForDisplay_1(musicData:PieceData):void
	{
		super.setMusicDataForDisplay_1(musicData);
		this.Cursor.setNoHighlight();
		if( this.getCurEvent_2() == null)
			this.setEventNum((( this.renderedSections[this.Cursor.getSectionNum()].eventinfo[this.Cursor.getVoiceNum()].size() - 1) | 0));

	}

	/* ensure cursor remains at a valid location after re-rendering */
	/*------------------------------------------------------------------------
Method:  void combineVariantReadings()
Purpose: Combine variant reading at current cursor position with next reading
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	combineVariantReadings():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let vr1:RenderedEventGroup = this.getCurEvent_2().getVarReadingInfo();
		if( vr1 == null)
			return;

		let vr2:RenderedEventGroup = this.renderedSections[snum].eventinfo[vnum].getEvent((( vr1.lastEventNum + 1) | 0)).getVarReadingInfo();
		if( vr2 == null)
			return;

		this.Cursor.hideCursor();
		this.musicData.combineReadingWithNext(this.curVersionMusicData,snum,vnum,this.renderedSections[snum].getVoicedataPlace(vnum,vr1.firstEventNum),this.renderedSections[snum].getVoicedataPlace(vnum,vr2.firstEventNum));
		this.Cursor.setNoHighlight();
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.moveCursor(snum,vnum,eventnum);
	}

	/* check that cursor is positioned at a variant reading followed by another
       variant reading */
	/*------------------------------------------------------------------------
Method:  void deleteAllVariantReadings()
Purpose: Delete all variant readings at current cursor position
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public deleteAllVariantReadings():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		this.Cursor.hideCursor();
		this.musicData.deleteAllVariantReadingsAtLoc(this.curVariantVersion,this.curVersionMusicData,snum,vnum,this.renderedSections[snum].getVoicedataPlace(vnum,eventnum));
		if( ! this.curVariantVersion.isDefault())
			this.parentEditorWin.reconstructCurrentVersion();

		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.Cursor.setNoHighlight();
		this.moveCursor(snum,vnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void deleteVariantReading()
Purpose: Delete variant reading at current cursor position
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public deleteVariantReading_1():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		if( this.curVersionMusicData.getVariantReading(snum,vnum,this.renderedSections[snum].getVoicedataPlace(vnum,eventnum),this.curVariantVersion) == null)
			return;

		this.Cursor.hideCursor();
		this.musicData.deleteVariantReading_1(this.curVariantVersion,this.curVersionMusicData,snum,vnum,this.renderedSections[snum].getVoicedataPlace(vnum,eventnum));
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.Cursor.setNoHighlight();
		this.moveCursor(snum,vnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void deleteVariantReading(VariantMarkerEvent vme,VariantVersionData vvd,VariantEditorFrame vef)
Purpose: Delete variant reading specified in popup GUI
Parameters:
  Input:  VariantMarkerEvent vme - start marker for readings
          VariantVersionData vvd - version to remove
          VariantEditorFrame vef - popup with controls for this variant
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public deleteVariantReading_2(vme:VariantMarkerEvent,vvd:VariantVersionData,vef:VariantEditorFrame):void
	{
		let loc:EventLocation = this.musicData.findEvent(vme);
		if( loc == null)
			{
				vef.closeFrame_1();
				return;
			}

		this.musicData.deleteVariantReading_2(vvd,loc.sectionNum,loc.voiceNum,loc.eventNum);
		vef.closeFrame_1();
		this.setCurrentVariantVersion_1(this.curVariantVersion);
		this.rerender_1();
		this.repaint();
		this.parentEditorWin.fileModified_2();
	}

	/*------------------------------------------------------------------------
Method:  void toggleVariantError()
Purpose: Toggle whether variant reading contains an error
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public toggleVariantError():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let vr:VariantReading = this.curVersionMusicData.getVariantReading(snum,vnum,this.renderedSections[snum].getVoicedataPlace(vnum,eventnum),this.curVariantVersion);
		if( vr == null)
			return;

		vr.setError(! vr.isError());
		this.rerender_1();
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
	}

	/*------------------------------------------------------------------------
Method:  void showCurrentVariants()
Purpose: Open popup displaying readings of variant at cursor location
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public showCurrentVariants():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventNum:number = this.Cursor.getEventNum();
		let cursorLoc:Point = this.Cursor.getLocation();
		this.showVariants_1(snum,vnum,eventNum,cursorLoc.x,cursorLoc.y);
	}

	/*------------------------------------------------------------------------
Method:    void showVariants(int snum,int vnum,int eventNum,int fx,int fy)
Overrides: Gfx.ViewCanvas.showVariants
Purpose:   Show variant readings popup in GUI (if there are readings at this point)
------------------------------------------------------------------------*/
	public showVariants_1(snum:number,vnum:number,eventNum:number,fx:number,fy:number):void
	{
		if( this.musicData.getVariantVersions().size() == 0)
			return;

		let re:RenderedEvent = this.renderedSections[snum].eventinfo[vnum].getEvent(eventNum);
		let renderedVar:RenderedEventGroup = re.getVarReadingInfo();
		if( renderedVar == null)
			return;

		let varFrame:VariantEditorFrame = new VariantEditorFrame(renderedVar,this.musicData.getSection(snum).getVoice_1(vnum),this.renderedSections[snum],vnum,fx,fy,this,this.MusicGfx,this.STAFFSCALE,this.VIEWSCALE);
		varFrame.setVisible(true);
	}

	/* no variants here */
	/*------------------------------------------------------------------------
Method:  void consolidateReadings(VariantMarkerEvent vme,VariantEditorFrame vef)
Purpose: Find duplicate readings at one location and consolidate
Parameters:
  Input:  VariantMarkerEvent vme - start marker for readings
          VariantEditorFrame vef - popup with controls for this variant
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public consolidateReadings(vme:VariantMarkerEvent,vef:VariantEditorFrame):void
	{
		let loc:EventLocation = this.musicData.findEvent(vme);
		if( loc == null)
			{
				vef.closeFrame_1();
				return;
			}

		if( this.musicData.consolidateReadings(loc))
			{
				vef.closeFrame_1();
				this.setCurrentVariantVersion_1(this.curVariantVersion);
				this.rerender_1();
				this.repaint();
				this.parentEditorWin.fileModified_2();
			}

	}

	/*------------------------------------------------------------------------
Method:  void addVersionToReading(VariantMarkerEvent vme,int ri,
                                  VariantVersionData newv,VariantEditorFrame vef)
Purpose: Associate one variant version with one reading
Parameters:
  Input:  VariantMarkerEvent vme  - start marker for readings
          int ri                  - index of reading within marker's list
          VariantVersionData newv - version to add to reading
          VariantEditorFrame vef  - popup with controls for this variant
  Output: -
  Return: -
------------------------------------------------------------------------*/
	addVersionToReading(vme:VariantMarkerEvent,ri:number,newv:VariantVersionData,vef:VariantEditorFrame):void
	{
		let loc:EventLocation = this.musicData.findEvent(vme);
		if( loc == null)
			{
				vef.closeFrame_1();
				return;
			}

		if( this.musicData.addVersionToReading(loc,ri,newv))
			{
				vef.closeFrame_1();
				this.setCurrentVariantVersion_1(this.curVariantVersion);
				this.rerender_1();
				this.repaint();
				this.parentEditorWin.fileModified_2();
			}

	}

	/*------------------------------------------------------------------------
Method:  void setReadingAsDefault(VariantMarkerEvent vme,int ri,
                                  VariantEditorFrame vef)
Purpose: Set one variant reading as default, swapping out current default
Parameters:
  Input:  VariantMarkerEvent vme  - start marker for readings
          int ri                  - index of reading within marker's list
          VariantEditorFrame vef  - popup with controls for this variant
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setReadingAsDefault(vme:VariantMarkerEvent,ri:number,vef:VariantEditorFrame):void
	{
		let loc:EventLocation = this.musicData.findEvent(vme);
		if( loc == null)
			{
				vef.closeFrame_1();
				return;
			}

		if( this.musicData.setReadingAsDefault(loc,ri))
			{
				vef.closeFrame_1();
				this.setCurrentVariantVersion_1(this.curVariantVersion);
				this.rerender_1();
				this.repaint();
				this.parentEditorWin.fileModified_2();
			}

	}

	/*------------------------------------------------------------------------
Method:  void modifyHighlightedEventLocations(int offset)
Purpose: Change pitch/location of currently highlighted events
Parameters:
  Input:  int offset - number of places to shift event
  Output: -
  Return: -
------------------------------------------------------------------------*/
	modifyHighlightedEventLocations(offset:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum1:number = this.Cursor.getHighlightBegin();
		let eventnum2:number = this.Cursor.getHighlightEnd();
		let eventsAdded:number = 0;
		let firstEventNum:number = eventnum1;
		for(
		let i:number = eventnum1;i <= eventnum2;i ++)
		{
			let origEvent:Event = this.renderedSections[snum].eventinfo[vnum].getEvent(i).getEvent_1();
			let e:Event = this.getEventForModification(snum,vnum,i);
			if( e != origEvent)
				{
					if( i == firstEventNum)
						eventnum1 +=(( e.getListPlace(! this.inVariantVersion()) - origEvent.getListPlace(! this.inVariantVersion())) | 0);

					if( e.getListPlace(! this.inVariantVersion()) > origEvent.getListPlace(! this.inVariantVersion()))
						eventsAdded += 2;

				}

			switch( e.geteventtype())
			{
				case Event.EVENT_NOTE:
				{
					e.modifyPitch_1(offset);
					(<NoteEvent> e).setPitchOffset(this.getCurModernKeySig(snum,vnum,i).calcNotePitchOffset_1(e.getPitch_1(),null));
					break;
				}
				case Event.EVENT_CUSTOS:
				{
				}
				case Event.EVENT_DOT:
				{
					e.modifyPitch_1(offset);
					break;
				}
				case Event.EVENT_REST:
				{
					let re:RestEvent =<RestEvent> e;
					re.setbottomline((( re.getbottomline_2() + offset) | 0));
					break;
				}
				case Event.EVENT_MENS:
				{
					let me:MensEvent =<MensEvent> e;
					me.setStaffLoc((( me.getStaffLoc() + offset) | 0));
					break;
				}
				case Event.EVENT_ANNOTATIONTEXT:
				{
					let ae:AnnotationTextEvent =<AnnotationTextEvent> e;
					ae.setstaffloc((( ae.getstaffloc() + offset) | 0));
					break;
				}
			}
		}
		if( eventsAdded > 0)
			eventsAdded --;

		eventnum2 += eventsAdded;
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum1);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.highlightItems(snum,vnum,eventnum1,eventnum2);
	}

	/*------------------------------------------------------------------------
Method:  int calcStemDir(Pitch p)
Purpose: Choose stem direction for new note
Parameters:
  Input:  Pitch p - pitch for note
  Output: -
  Return: stem direction
------------------------------------------------------------------------*/
	calcStemDir(p:Pitch):number
	{
		if( this.editorStemDir != - 1)
			return this.editorStemDir;

		return( p.staffspacenum > 4) ? NoteEvent.STEM_DOWN:NoteEvent.STEM_UP;
	}

	/* editorStemDir==-1, auto-choose based on staff location */
	/*------------------------------------------------------------------------
Method:  void addNote(int nt,Pitch p)
Purpose: Insert note at current cursor location
Parameters:
  Input:  int nt  - note type
          Pitch p - pitch for note
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addNote_1(nt:number,p:Pitch):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let inChantSection:boolean = this.musicData.getSection(snum).getSectionType() == MusicSection.PLAINCHANT;
		this.Cursor.hideCursor();
		let ne:NoteEvent = NoteEvent.new26(NoteEvent.NoteTypeNames[nt],inChantSection ? null:NoteEvent.getTypeLength(nt,this.getCurMensInfo_1(snum,vnum,eventnum)),Pitch.new3(p),ModernAccidental.new3(this.getCurModernKeySig(snum,vnum,eventnum).calcNotePitchOffset_1(p,null),false),NoteEvent.LIG_NONE,false,NoteEvent.HALFCOLORATION_NONE,this.calcStemDir(p),- 1,this.parentEditorWin.useFlaggedSemiminima() ? 1:0,null);
		if( this.colorationOn)
			this.applyNoteColoration(snum,vnum,eventnum,ne,true);

		eventnum = this.insertEvent(snum,vnum,eventnum,ne);
	}

	/*------------------------------------------------------------------------
Method:  void addNote(int nt,char nl)
Purpose: Insert note at current cursor location (assign pitch based on pitch
         of last note or clef)
Parameters:
  Input:  int nt  - note type
          char nl - note letter
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addNote_2(nt:number,nl:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let p:Pitch;
		let curclef:Clef = this.getCurClef(snum,vnum,eventnum);
		if( curclef != null)
			{
				let lastnote:NoteEvent =<NoteEvent> this.getNeighboringEventOfType(Event.EVENT_NOTE,snum,vnum,(( eventnum - 1) | 0),- 1);
				p = lastnote != null ? lastnote.getPitch_1().closestpitch(Character.toString(nl)):Pitch.new0(`${nl}`,curclef.pitch.octave,curclef);
			}

		else
			p = Pitch.new2((( nl - Character.codePointAt("A",0)) | 0));

		this.addNote_1(nt,p);
	}

	/* no clef, assign staff position */
	/*------------------------------------------------------------------------
Method:  void addNote(int nt)
Purpose: Insert note at current cursor location, repeating pitch of last
         note
Parameters:
  Input:  int nt  - note type
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addNote_3(nt:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let lastnote:NoteEvent =<NoteEvent> this.getNeighboringEventOfType(Event.EVENT_NOTE,snum,vnum,(( eventnum - 1) | 0),- 1);
		if( lastnote != null)
			this.addNote_1(nt,lastnote.getPitch_1());
		else
			this.addNote_2(nt,Character.codePointAt("A",0));

	}

	/*------------------------------------------------------------------------
Method:  void modifyEventPitch(int offset|char nl)
Purpose: Change pitch of currently highlighted event
Parameters:
  Input:  int offset - number of places to shift note
          char nl    - new note letter
  Output: -
  Return: -
------------------------------------------------------------------------*/
	modifyEventPitch_int(offset:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		e.modifyPitch_1(offset);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		if( e.geteventtype() == Event.EVENT_CLEF)
			{
				this.curVersionMusicData.getSection(snum).getVoice_1(vnum).recalcEventParams_1();
			}

		else
			if( e.geteventtype() == Event.EVENT_NOTE)
				{
					(<NoteEvent> e).setPitchOffset(this.getCurModernKeySig(snum,vnum,eventnum).calcNotePitchOffset_1(e.getPitch_1(),null));
				}

		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*        ModernKeySignature oldSig=null;
        int                startei=-1;
        if (e.hasSignatureClef())
          {
            oldSig=e.getClefSet().getKeySig();
            startei=firstEventNumAfterClefSet(snum,vnum,eventnum+1,e.getClefSet());
          }*/
	/*        if (oldSig!=null)
          updateNoteAccidentals(snum,vnum,startei,oldSig,e.getClefSet().getKeySig());*/
	modifyEventPitch_char(nl:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let oldp:Pitch = Pitch.new3(orige.getPitch_1());
		let newp:Pitch;
		if( this.renderedSections[snum].eventinfo[vnum].getClefEvents(this.Cursor.getEventNum()) != null)
			newp = orige.getPitch_1().closestpitch(`${nl}`);
		else
			newp = Pitch.new2((( nl - Character.codePointAt("A",0)) | 0));

		if( newp.equals(oldp))
			return;

		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		e.setpitch_1(newp);
		if( this.getCurEvent_2().getEvent_1().geteventtype() == Event.EVENT_CLEF)
			this.curVersionMusicData.getSection(snum).getVoice_1(vnum).recalcEventParams_1();
		else
			if( e.geteventtype() == Event.EVENT_NOTE)
				(<NoteEvent> e).setPitchOffset(this.getCurModernKeySig(snum,vnum,eventnum).calcNotePitchOffset_1(e.getPitch_1(),null));

		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	// no principal clef
	/*------------------------------------------------------------------------
Method:  void changeNoteAccidental(int dir)
Purpose: Change modern accidental of currently highlighted note; create if
         none currently exists
Parameters:
  Input:  int dir - direction to shift pitch: 1==sharpward, -1==flatward
  Output: -
  Return: -
------------------------------------------------------------------------*/
	changeNoteAccidental(dir:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let ne:NoteEvent =<NoteEvent> this.getEventForModification(snum,vnum,eventnum);
		ne.modifyPitchOffset(dir);
		eventnum +=(( ne.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*    ModernKeySignature keySig=getCurModernKeySig(snum,vnum,eventnum);
    int                oldPitchOffset=keySig.calcNotePitchOffset(ne);
    ModernAccidental   newAcc=keySig.chooseNoteAccidental(ne,oldPitchOffset+dir),
                       oldAcc=ne.getModAcc();
    if (newAcc==null || oldAcc==null || !newAcc.equals(oldAcc))
      ne.setModAcc(newAcc);*/
	/*------------------------------------------------------------------------
Method:  void toggleNoteAccidentalOptional()
Purpose: Toggle optional status of modern accidental of currently highlighted
         note
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	toggleNoteAccidentalOptional():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let origne:NoteEvent =<NoteEvent> this.getCurEvent_2().getEvent_1();
		let ma:ModernAccidental = origne.getPitchOffset();
		if( ma == null)
			return;

		let ne:NoteEvent =<NoteEvent> this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( ne.getListPlace(! this.inVariantVersion()) - origne.getListPlace(! this.inVariantVersion())) | 0);
		ma = ne.getPitchOffset();
		ma.optional = ! ma.optional;
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void cycleTieType()
Purpose: Cycle through tie types (over, under, none) for currently highlighted
         note
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	cycleTieType():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let origne:NoteEvent =<NoteEvent> this.getCurEvent_2().getEvent_1();
		let newTieType:number = NoteEvent.TIE_NONE;
		switch( origne.getTieType())
		{
			case NoteEvent.TIE_NONE:
			{
				newTieType = NoteEvent.TIE_OVER;
				break;
			}
			case NoteEvent.TIE_OVER:
			{
				newTieType = NoteEvent.TIE_UNDER;
				break;
			}
		}
		let ne:NoteEvent =<NoteEvent> this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( ne.getListPlace(! this.inVariantVersion()) - origne.getListPlace(! this.inVariantVersion())) | 0);
		ne.setTieType(newTieType);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void modifyNoteType(int nt)
Purpose: Change note type of currently highlighted event
Parameters:
  Input:  int nt - new note type
  Output: -
  Return: -
------------------------------------------------------------------------*/
	modifyNoteType(nt:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		this.Cursor.hideCursor();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		let oldnt:number = e.getnotetype_1();
		let oldf:boolean = e.isflagged_1();
		e.setnotetype_1(nt,this.parentEditorWin.useFlaggedSemiminima() ? 1:0,this.getCurMensInfo_1(snum,vnum,eventnum));
		if( e.getLength_1() != null)
			e.setLength_1(NoteEvent.getTypeLength(nt,this.getCurMensInfo_1(snum,vnum,eventnum)));

		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		if( e.getnotetype_1() != oldnt || e.isflagged_1() != oldf)
			this.parentEditorWin.fileModified_2();

		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void modifyEventTime(Proportion p)
Purpose: Change length of currently highlighted event
Parameters:
  Input:  Proportion p - time amount to add/subtract
  Output: -
  Return: -
------------------------------------------------------------------------*/
	modifyEventTime(p:Proportion):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let e:Event = this.getCurEvent_2().getEvent_1();
		let curLen:Proportion = e.getLength_1();
		if( curLen == null)
			return;

		this.setEventProportion(Proportion.sum(curLen,p));
	}

	/*------------------------------------------------------------------------
Method:  void perfectNote()
Purpose: Make currently highlighted note perfect
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	perfectNote():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let e:Event = this.getCurEvent_2().getEvent_1();
		if( e.geteventtype() != Event.EVENT_NOTE)
			return;

		let ne:NoteEvent =<NoteEvent> e;
		let curmens:Mensuration = this.getCurMensInfo_1(snum,vnum,eventnum);
		if( ! ne.canBePerfect(curmens))
			return;

		this.setEventProportion(Proportion.new1(NoteEvent.getTypeLength(ne.getnotetype_1(),curmens)));
	}

	/*------------------------------------------------------------------------
Method:  void imperfectNote()
Purpose: Make currently highlighted note imperfect
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	imperfectNote():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let e:Event = this.getCurEvent_2().getEvent_1();
		if( e.geteventtype() != Event.EVENT_NOTE)
			return;

		let ne:NoteEvent =<NoteEvent> e;
		let curmens:Mensuration = this.getCurMensInfo_1(snum,vnum,eventnum);
		if( ! ne.canBePerfect(curmens))
			return;

		let newlength:Proportion = NoteEvent.getTypeLength(ne.getnotetype_1(),curmens);
		newlength.multiply_1(2,3);
		this.setEventProportion(newlength);
	}

	/*------------------------------------------------------------------------
Method:  void alterNote()
Purpose: Apply alteration to currently highlighted note
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	alterNote():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let e:Event = this.getCurEvent_2().getEvent_1();
		if( e.geteventtype() != Event.EVENT_NOTE)
			return;

		let ne:NoteEvent =<NoteEvent> e;
		let curmens:Mensuration = this.getCurMensInfo_1(snum,vnum,eventnum);
		if( ! ne.canBeAltered(curmens))
			return;

		let newlength:Proportion = NoteEvent.getTypeLength(ne.getnotetype_1(),curmens);
		newlength.multiply_1(2,1);
		this.setEventProportion(newlength);
	}

	/*------------------------------------------------------------------------
Method:  void applyNoteColoration(int snum,int vnum,int eventnum,boolean color)
Purpose: Update note event info based on coloration info (do not display)
Parameters:
  Input:  int snum,vnum,eventnum - section/voice/event number
          boolean color          - whether to color or not
  Output: -
  Return: -
------------------------------------------------------------------------*/
	applyNoteColoration(snum:number,vnum:number,eventnum:number,ne:NoteEvent,color:boolean):void
	{
		ne.setColored_1(color);
		let nt:number = ne.getnotetype_1();
		let curLength:Proportion = ne.getLength_1();
		if( curLength == null)
			return;

		if( ne.isColored())
			switch( this.editorColorationType)
			{
				case Coloration.IMPERFECTIO:
				{
					let curmens:Mensuration = this.getCurMensInfo_1(snum,vnum,eventnum);
					ne.setLength_1(NoteEvent.DefaultLengths[ne.getnotetype_1()]);
					break;
				}
				case Coloration.SESQUIALTERA:
				{
					curLength.multiply_1(2,3);
					ne.setLength_1(curLength);
					break;
				}
				case Coloration.MINOR_COLOR:
				{
					let lnevnum:number = this.getNeighboringEventNumOfType(Event.EVENT_NOTE,snum,vnum,(( eventnum - 1) | 0),- 1);
					let lne:NoteEvent = lnevnum == - 1 ? null:<NoteEvent> this.getRenderedEvent(snum,vnum,lnevnum).getEvent_1();
					let lastDefaultLen:Proportion = lne != null ? NoteEvent.getTypeLength(lne.getnotetype_1(),this.getCurMensInfo_1(snum,vnum,lnevnum)):null;
					if( nt < NoteEvent.NT_Semibrevis ||( lne != null && lne.isColored() && lne.getLength_1().toDouble() >((<number> lastDefaultLen.toDouble() * 2 / 3) | 0)))
						curLength.multiply_1(1,2);
					else
						curLength.multiply_1(3,4);

					ne.setLength_1(curLength);
					break;
				}
			}

		else
			ne.setLength_1(NoteEvent.getTypeLength(ne.getnotetype_1(),this.getCurMensInfo_1(snum,vnum,eventnum)));

	}

	/* choose coloration effect: sesquialtera, imperfection, or 'minor color' */
	//            if (ne.canBePerfect(curmens))
	/* minor color already started; note value is halved */
	/* start new minor color; note value *= 3/4 */
	/* de-color */
	/*------------------------------------------------------------------------
Method:  void toggleNoteColoration()
Purpose: Toggle note between colored/uncolored
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	toggleNoteColoration():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let ne:NoteEvent =<NoteEvent> this.getEventForModification(snum,vnum,eventnum);
		this.Cursor.hideCursor();
		this.applyNoteColoration(snum,vnum,eventnum,ne,! ne.isColored());
		eventnum +=(( ne.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void toggleHighlightedColoration()
Purpose: Toggle highlighted notes between colored/uncolored
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	toggleHighlightedColoration():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let firste:number = this.Cursor.getHighlightBegin();
		let laste:number = this.Cursor.getHighlightEnd();
		let orige:Event = this.renderedSections[snum].eventinfo[vnum].getEvent(firste).getEvent_1();
		let e:Event = this.getEventsForModification(snum,vnum,firste,laste);
		if( e == null)
			return;

		firste +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		laste +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		this.rerender_1();
		for(
		let i:number = firste;i <= laste;i ++)
		{
			let re:RenderedEvent = this.renderedSections[snum].eventinfo[vnum].getEvent(i);
			if( re.getEvent_1().geteventtype() == Event.EVENT_NOTE)
				{
					let ne:NoteEvent =<NoteEvent> re.getEvent_1();
					this.applyNoteColoration(snum,vnum,i,ne,! ne.isColored());
				}

		}
		this.rerender_1();
		this.checkVariant(snum,vnum,firste);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = firste;
		this.highlightItems(snum,vnum,firste,laste);
	}

	/* attempt to create invalid variant arrangement */
	//eventnum;
	/*------------------------------------------------------------------------
Method:  void cycleNoteHalfColoration()
Purpose: Change half-coloration attributes of currently highlighted note
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	cycleNoteHalfColoration():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let origne:NoteEvent =<NoteEvent> this.getCurEvent_2().getEvent_1();
		if( origne.getnotetype_1() != NoteEvent.NT_Brevis && origne.getnotetype_1() != NoteEvent.NT_Longa && origne.getnotetype_1() != NoteEvent.NT_Maxima)
			return;

		let ne:NoteEvent =<NoteEvent> this.getEventForModification(snum,vnum,eventnum);
		this.Cursor.hideCursor();
		let newHalfCol:number = ne.getHalfColoration();
		switch( newHalfCol)
		{
			case NoteEvent.HALFCOLORATION_NONE:
			{
				newHalfCol = NoteEvent.HALFCOLORATION_PRIMARYSECONDARY;
				break;
			}
			case NoteEvent.HALFCOLORATION_PRIMARYSECONDARY:
			{
				newHalfCol = NoteEvent.HALFCOLORATION_SECONDARYPRIMARY;
				break;
			}
			case NoteEvent.HALFCOLORATION_SECONDARYPRIMARY:
			{
				newHalfCol = NoteEvent.HALFCOLORATION_NONE;
				break;
			}
		}
		ne.setHalfColoration(newHalfCol);
		eventnum +=(( ne.getListPlace(! this.inVariantVersion()) - origne.getListPlace(! this.inVariantVersion())) | 0);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void cycleNoteStemDirection(NoteEvent ne)
Purpose: Change attributes of currently highlighted note - cycle stem
         direction (up/down/barline)
Parameters:
  Input:  NoteEvent ne - note to modify
  Output: NoteEvent ne
  Return: -
------------------------------------------------------------------------*/
	cycleNoteStemDirection(ne:NoteEvent):void
	{
		let newStemDir:number = ne.getstemdir();
		if( ne.getnotetype_1() == NoteEvent.NT_Longa || ne.getnotetype_1() == NoteEvent.NT_Maxima)
			switch( newStemDir)
			{
				case NoteEvent.STEM_UP:
				{
					newStemDir = NoteEvent.STEM_DOWN;
					break;
				}
				case NoteEvent.STEM_DOWN:
				{
					newStemDir = NoteEvent.STEM_BARLINE;
					break;
				}
				case NoteEvent.STEM_BARLINE:
				{
					newStemDir = NoteEvent.STEM_UP;
					break;
				}
			}

		else
			if( this.getCurSectionType() == MusicSection.PLAINCHANT)
				switch( newStemDir)
				{
					case NoteEvent.STEM_UP:
					{
						newStemDir = NoteEvent.STEM_DOWN;
						break;
					}
					case NoteEvent.STEM_DOWN:
					{
						newStemDir = NoteEvent.STEM_NONE;
						break;
					}
					case NoteEvent.STEM_NONE:
					{
						newStemDir = NoteEvent.STEM_UP;
						if( ne.getstemside() == NoteEvent.STEM_NONE)
							ne.setstemside(NoteEvent.STEM_LEFT);

						break;
					}
				}

			else
				newStemDir =( newStemDir == NoteEvent.STEM_UP) ? NoteEvent.STEM_DOWN:NoteEvent.STEM_UP;

		ne.setstemdir(newStemDir);
	}

	/* simply toggle up/down */
	/*------------------------------------------------------------------------
Method:  void cycleHighlightedStemDirections()
Purpose: Change attributes of all currently highlighted notes - cycle stem
         direction (up/down/barline)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	cycleHighlightedStemDirections():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum1:number = this.Cursor.getHighlightBegin();
		let eventnum2:number = this.Cursor.getHighlightEnd();
		let eventsAdded:number = 0;
		let firstEventNum:number = eventnum1;
		for(
		let i:number = eventnum1;i <= eventnum2;i ++)
		{
			let origEvent:Event = this.renderedSections[snum].eventinfo[vnum].getEvent(i).getEvent_1();
			if( origEvent.geteventtype() == Event.EVENT_NOTE)
				{
					let e:Event = this.getEventForModification(snum,vnum,i);
					if( e != origEvent)
						{
							if( i == firstEventNum)
								eventnum1 +=(( e.getListPlace(! this.inVariantVersion()) - origEvent.getListPlace(! this.inVariantVersion())) | 0);

							if( e.getListPlace(! this.inVariantVersion()) > origEvent.getListPlace(! this.inVariantVersion()))
								eventsAdded += 2;

						}

					if( e.geteventtype() == Event.EVENT_NOTE)
						this.cycleNoteStemDirection(<NoteEvent> e);

				}

		}
		if( eventsAdded > 0)
			eventsAdded --;

		eventnum2 += eventsAdded;
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum1);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.highlightItems(snum,vnum,eventnum1,eventnum2);
	}

	/*------------------------------------------------------------------------
Method:  void ligateTwoNotes(int snum,int vnum,int note1num)
Purpose: Choose ligation type and ligate two notes
Parameters:
  Input:  int snum,vnum - section/voice number
          int note1num  - event number of left note
  Output: -
  Return: -
------------------------------------------------------------------------*/
	ligateTwoNotes(snum:number,vnum:number,note1num:number):void
	{
		let ne:NoteEvent =<NoteEvent>( this.renderedSections[snum].eventinfo[vnum].getEvent(note1num).getEvent_1());
		let nextne:NoteEvent = null;
		let lastne:NoteEvent = null;
		ne.setligtype(NoteEvent.LIG_RECTA);
		nextne =<NoteEvent> this.getNeighboringEventOfType(Event.EVENT_NOTE,snum,vnum,(( note1num + 1) | 0),1);
		lastne =<NoteEvent> this.getNeighboringEventOfType(Event.EVENT_NOTE,snum,vnum,(( note1num - 1) | 0),- 1);
		if( lastne == null || ! lastne.isligated())
			{
				if( ne.getnotetype_1() == NoteEvent.NT_Semibrevis && nextne != null && nextne.getnotetype_1() == NoteEvent.NT_Semibrevis)
					{
						ne.setstemdir(NoteEvent.STEM_UP);
						ne.setstemside(NoteEvent.STEM_LEFT);
						if( ne.getPitch_1().isHigherThan(nextne.getPitch_1()))
							ne.setligtype(NoteEvent.LIG_OBLIQUA);

					}

				if( ne.getnotetype_1() == NoteEvent.NT_Brevis)
					if( nextne != null && ne.getPitch_1().isHigherThan(nextne.getPitch_1()))
						{
							if( nextne.getnotetype_1() == NoteEvent.NT_Brevis)
								ne.setligtype(NoteEvent.LIG_OBLIQUA);

							ne.setstemdir(NoteEvent.STEM_DOWN);
							ne.setstemside(NoteEvent.STEM_LEFT);
						}

				if( ne.getnotetype_1() == NoteEvent.NT_Longa)
					if( nextne != null)
						if( nextne.getPitch_1().isHigherThan(ne.getPitch_1()))
							{
								ne.setstemdir(NoteEvent.STEM_DOWN);
								ne.setstemside(NoteEvent.STEM_RIGHT);
							}

			}

		else
			switch( ne.getnotetype_1())
			{
				case NoteEvent.NT_Longa:
				{
					ne.setstemdir(NoteEvent.STEM_DOWN);
					ne.setstemside(NoteEvent.STEM_RIGHT);
					break;
				}
			}

		if( nextne != null && ! nextne.isligated())
			switch( nextne.getnotetype_1())
			{
				case NoteEvent.NT_Brevis:
				{
					if( ! nextne.getPitch_1().isHigherThan(ne.getPitch_1()))
						ne.setligtype(NoteEvent.LIG_OBLIQUA);

					break;
				}
				case NoteEvent.NT_Longa:
				{
					if( nextne.getPitch_1().isHigherThan(ne.getPitch_1()))
						{
							nextne.setstemdir(NoteEvent.STEM_DOWN);
							nextne.setstemside(NoteEvent.STEM_RIGHT);
						}

					else
						nextne.setstemside(- 1);

					break;
				}
			}

	}

	/* lig first note type */
	/* COP stem */
	/* most commonly recta ascending, obliqua descending */
	/* CP stem */
	/* longa stems */
	/* ligature middle */
	/* ligature end */
	/*------------------------------------------------------------------------
Method:  void ligateHighlighted()
Purpose: Ligate or un-ligate highlighted notes
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	ligateHighlighted():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let numnotes:number = 0;
		let firstNotei:number;
		let lastNotei:number;
		let waslig:boolean = false;
		let addlig:boolean = true;
		let modified:boolean = false;
		let ne:NoteEvent = null;
		let ne1:NoteEvent;
		let ne2:NoteEvent;
		firstNotei = this.getNeighboringEventNumOfType(Event.EVENT_NOTE,snum,vnum,this.Cursor.getHighlightBegin(),1);
		lastNotei = this.getNeighboringEventNumOfType(Event.EVENT_NOTE,snum,vnum,this.Cursor.getHighlightEnd(),- 1);
		if( firstNotei == - 1 || lastNotei == - 1 || firstNotei == lastNotei)
			return;

		ne1 =<NoteEvent> this.getRenderedEvent(snum,vnum,firstNotei).getEvent_1();
		ne2 =<NoteEvent> this.getRenderedEvent(snum,vnum,lastNotei).getEvent_1();
		if( this.curVariantVersion != this.musicData.getDefaultVariantVersion())
			{
				ne =<NoteEvent> this.musicData.duplicateEventsInVariant(this.curVariantVersion,this.curVersionMusicData,snum,vnum,ne1.getListPlace(false),ne2.getListPlace(false));
				if( ne == null)
					return;

				let offset:number =(( ne.getListPlace(false) - ne1.getListPlace(false)) | 0);
				firstNotei += offset;
				lastNotei += offset;
				this.rerender_1();
			}

		for(
		let i:number = firstNotei;i <= lastNotei;i ++)
		{
			let e:Event = this.renderedSections[snum].eventinfo[vnum].getEvent(i).getEvent_1();
			if( e.geteventtype() == Event.EVENT_NOTE)
				{
					modified = true;
					numnotes ++;
					ne =<NoteEvent> e;
					waslig = ne.isligated();
					if( numnotes == 1 && waslig)
						addlig = false;

					if( addlig)
						{
							if( i < lastNotei && ! waslig)
								this.ligateTwoNotes(snum,vnum,i);

						}

					else
						ne.setligtype(NoteEvent.LIG_NONE);

				}

		}
		if( ne != null && ! waslig)
			ne.setligtype(NoteEvent.LIG_NONE);

		this.rerender_1();
		this.checkVariant(snum,vnum,firstNotei);
		this.repaint();
		if( modified)
			this.parentEditorWin.fileModified_2();

		this.moveCursor(snum,vnum,firstNotei);
	}

	/* toggle ligation for each highlighted note */
	/* attempt to create invalid variant arrangement */
	/* ligate or de-ligate? depends on first note */
	/* ligate! (but don't overwrite existing lig information) */
	/* remove any NEW ligation mark from final note */
	/*------------------------------------------------------------------------
Method:  void ligateNoteToLast()
Purpose: Ligate or un-ligate currently highlighted note with previous note
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	ligateNoteToLast():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let lastneNum:number = this.getNeighboringEventNumOfType(Event.EVENT_NOTE,snum,vnum,(( eventnum - 1) | 0),- 1);
		let origNEplace:number = this.getCurEvent_2().getEvent_1().getListPlace(! this.inVariantVersion());
		if( lastneNum == - 1)
			return;

		let origLastNE:NoteEvent =<NoteEvent> this.renderedSections[snum].eventinfo[vnum].getEvent(lastneNum).getEvent_1();
		let lastne:NoteEvent = this.getNoteEventForLigation(snum,vnum,lastneNum,eventnum);
		if( lastne == null)
			return;

		let newNEplace:number = this.curVersionMusicData.getSection(snum).getVoice_1(vnum).getNextEventOfType(Event.EVENT_NOTE,(( lastne.getListPlace(! this.inVariantVersion()) + 1) | 0),1);
		eventnum +=(( newNEplace - origNEplace) | 0);
		this.rerender_1();
		lastneNum = this.getNeighboringEventNumOfType(Event.EVENT_NOTE,snum,vnum,(( eventnum - 1) | 0),- 1);
		lastne =<NoteEvent> this.renderedSections[snum].eventinfo[vnum].getEvent(lastneNum).getEvent_1();
		if( ! lastne.isligated())
			this.ligateTwoNotes(snum,vnum,lastneNum);
		else
			lastne.setligtype(NoteEvent.LIG_NONE);

		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/* attempt to create invalid variant arrangement */
	/* need to rerender, because ligateTwoNotes reads from rendered list */
	//lastne==origLastNE ? lastneNum : lastneNum+1);
	/* toggle ligation */
	/*------------------------------------------------------------------------
Method:  void changeLigType(int newligtype)
Purpose: Change ligature connection type of one note
Parameters:
  Input:  int newligtype - new connection type
  Output: -
  Return: -
------------------------------------------------------------------------*/
	changeLigType(newligtype:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum1:number = this.Cursor.getEventNum();
		let eventnum2:number;
		let finalEvNum:number = eventnum1;
		let ne:NoteEvent =<NoteEvent> this.getCurEvent_2().getEvent_1();
		let origne:NoteEvent = ne;
		if( this.getCurEvent_2().isligend())
			{
				eventnum2 = eventnum1;
				eventnum1 = this.getNeighboringEventNumOfType(Event.EVENT_NOTE,snum,vnum,(( eventnum2 - 1) | 0),- 1);
				ne =<NoteEvent> this.getRenderedEvent(snum,vnum,eventnum1).getEvent_1();
				origne = ne;
			}

		else
			eventnum2 = this.getNeighboringEventNumOfType(Event.EVENT_NOTE,snum,vnum,(( eventnum1 + 1) | 0),1);

		if( ne.getligtype() == NoteEvent.LIG_NONE || ne.getligtype() == newligtype || eventnum2 >= this.getNumRenderedEvents(snum,vnum))
			return;

		ne = this.getNoteEventForLigation(snum,vnum,eventnum1,eventnum2);
		if( ne == null)
			return;

		finalEvNum += ne != origne ? 1:0;
		ne.setligtype(newligtype);
		this.rerender_1();
		this.checkVariant(snum,vnum,finalEvNum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = finalEvNum;
		this.highlightItems(snum,vnum,finalEvNum,finalEvNum);
	}

	/* attempt to create invalid variant arrangement */
	/*------------------------------------------------------------------------
Method:  void setNoteSyllable(String s,boolean we)
Purpose: Set text syllable on note
Parameters:
  Input:  String s   - syllable text
          boolean we - word end?
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setNoteSyllable_1(s:string,we:boolean):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let ne:NoteEvent;
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		if( e.geteventtype() == Event.EVENT_MULTIEVENT)
			ne =(<MultiEvent> e).getLowestNote();
		else
			ne =<NoteEvent> e;

		ne.setModernText(s);
		ne.setWordEnd(we);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void toggleEditorialText()
Purpose: Toggle editorial status of text on current note
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	/*  void toggleEditorialText()
  {
    int       snum=Cursor.getSectionNum(),
              vnum=Cursor.getVoiceNum(),
              eventnum=Cursor.getEventNum();
    Event     orige=getCurEvent().getEvent();
    NoteEvent ne;

    Event e=getEventForModification(snum,vnum,eventnum);
    eventnum+=e.getListPlace(!inVariantVersion())-orige.getListPlace(!inVariantVersion());

    if (e.geteventtype()==Event.EVENT_MULTIEVENT)
      ne=((MultiEvent)e).getLowestNote();
    else
      ne=(NoteEvent)e;

    ne.setModernTextEditorial(!ne.isModernTextEditorial());

    rerender();
    checkVariant(snum,vnum,eventnum);
    repaint();
    parentEditorWin.fileModified();
    hl_anchor=eventnum;
    highlightItems(snum,vnum,eventnum,eventnum);
  }*/
	toggleHighlightedEditorialText():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum1:number = this.Cursor.getHighlightBegin();
		let eventnum2:number = this.Cursor.getHighlightEnd();
		let eventsAdded:number = 0;
		let firstEventNum:number = eventnum1;
		for(
		let i:number = eventnum1;i <= eventnum2;i ++)
		{
			let origEvent:Event = this.renderedSections[snum].eventinfo[vnum].getEvent(i).getEvent_1();
			if( origEvent.geteventtype() == Event.EVENT_NOTE)
				{
					let e:Event = this.getEventForModification(snum,vnum,i);
					if( e != origEvent)
						{
							if( i == firstEventNum)
								eventnum1 +=(( e.getListPlace(! this.inVariantVersion()) - origEvent.getListPlace(! this.inVariantVersion())) | 0);

							if( e.getListPlace(! this.inVariantVersion()) > origEvent.getListPlace(! this.inVariantVersion()))
								eventsAdded += 2;

						}

					if( e.geteventtype() == Event.EVENT_NOTE)
						{
							let ne:NoteEvent =<NoteEvent> e;
							ne.setModernTextEditorial(! ne.isModernTextEditorial());
						}

				}

		}
		if( eventsAdded > 0)
			eventsAdded --;

		eventnum2 += eventsAdded;
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum1);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.highlightItems(snum,vnum,eventnum1,eventnum2);
	}

	/*------------------------------------------------------------------------
Method:  void toggleCorona()
Purpose: Toggle presence of corona on a note or rest
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	toggleCorona():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		this.Cursor.hideCursor();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		e.setCorona(( e.getCorona() == null) ? Signum.new1(Signum.UP,Signum.MIDDLE):null);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void toggleSignum()
Purpose: Toggle presence of a signum congruentiae on a note or rest
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	toggleSignum():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		e.setSignum(( e.getSignum() == null) ? Signum.new0(4,Signum.UP,Signum.MIDDLE):null);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	toggleSignumOrientation():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let s:Signum = orige.getSignum();
		if( s == null)
			return;

		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		s.orientation = s.orientation == Signum.UP ? Signum.DOWN:Signum.UP;
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	cycleSignumSide():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let s:Signum = orige.getSignum();
		if( s == null)
			return;

		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		switch( s.side)
		{
			case Signum.LEFT:
			{
				s.side = Signum.MIDDLE;
				break;
			}
			case Signum.MIDDLE:
			{
				s.side = Signum.RIGHT;
				break;
			}
			case Signum.RIGHT:
			{
				s.side = Signum.LEFT;
				break;
			}
		}
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	shiftSignumVertical(offset:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		if( orige.geteventtype() != Event.EVENT_NOTE && orige.geteventtype() != Event.EVENT_REST)
			return;

		let s:Signum = orige.getSignum();
		if( s == null)
			return;

		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		s.offset += offset;
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void addRest(int nt)
Purpose: Insert rest at current cursor location
Parameters:
  Input:  int nt  - note type
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addRest(nt:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let m:Mensuration = this.getCurMensInfo_1(snum,vnum,eventnum);
		let inChantSection:boolean = this.musicData.getSection(snum).getSectionType() == MusicSection.PLAINCHANT;
		this.Cursor.hideCursor();
		let newVPos:number = 2;
		let lastNoteNum:number = this.getNeighboringEventNumOfType(Event.EVENT_NOTE,snum,vnum,(( eventnum - 1) | 0),- 1);
		let lastRestNum:number = this.getNeighboringEventNumOfType(Event.EVENT_REST,snum,vnum,(( eventnum - 1) | 0),- 1);
		let posEvNum:number = Math.max(lastNoteNum,lastRestNum);
		if( posEvNum > - 1)
			newVPos =(((( this.getRenderedEvent(snum,vnum,posEvNum).getssnum() / 2) | 0) + 1) | 0);

		let re:RestEvent = RestEvent.new32(NoteEvent.NoteTypeNames[nt],inChantSection ? null:NoteEvent.getTypeLength(nt,m),newVPos,RestEvent.calcNumLines(nt,m),m.modus_maior);
		if( this.colorationOn)
			re.setColored_1(true);

		eventnum = this.insertEvent(snum,vnum,eventnum,re);
	}

	/* guess vertical position of rest */
	/* default */
	/* add rest */
	/*------------------------------------------------------------------------
Method:  void addDot([int snum,int vnum,int eventnum,]int dottype)
Purpose: Insert dot at a given location
Parameters:
  Input:  int snum,vnum,eventnum - insertion location
          int dottype            - dot attributes (Addition, Division, etc.)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addDot_1(snum:number,vnum:number,eventnum:number,dottype:number):void
	{
		let dotPitch:Pitch = null;
		let ln:NoteEvent = null;
		this.Cursor.hideCursor();
		let lre:RenderedEvent = this.renderedSections[snum].eventinfo[vnum].getEvent((( eventnum - 1) | 0));
		if(( dottype & DotEvent.DT_Addition) == 0 || lre == null || lre.getEvent_1().geteventtype() != Event.EVENT_NOTE || lre.getEvent_1().getLength_1() == null)
			{
				dotPitch = Pitch.new2(10);
				let c:Clef = this.getCurClef(snum,vnum,eventnum);
				if( c != null)
					dotPitch = Pitch.new3(c.getStaffLocPitch(10));

				dottype = DotEvent.DT_Division;
			}

		else
			{
				ln =<NoteEvent> this.getEventForModification(snum,vnum,(( eventnum - 1) | 0));
				eventnum +=(( ln.getListPlace(! this.inVariantVersion()) - lre.getEvent_1().getListPlace(! this.inVariantVersion())) | 0);
				ln.setLength_1(Proportion.product(ln.getLength_1(),Proportion.new0(3,2)));
				if( this.inVariantVersion())
					this.rerender_1();

				let nsl:number = ln.getPitch_1().staffspacenum;
				dotPitch = Pitch.new3(ln.getPitch_1());
				if( nsl % 2 == 0)
					dotPitch.add(1);

				this.parentEditorWin.selectNVButton((( this.parentEditorWin.NTtoBNum(ln.getnotetype_1()) + 1) | 0));
			}

		let de:DotEvent = DotEvent.new10(dottype,dotPitch,ln);
		eventnum = this.insertEvent(snum,vnum,eventnum,de);
	}

	/* not a dot of addition */
	/* dot of addition: adjust length of previous note */
	/* select next-lowest note value for future input */
	public addDot_2(dottype:number):void
	{
		if( this.Cursor.oneItemHighlighted())
			this.addDot_1(this.Cursor.getSectionNum(),this.Cursor.getVoiceNum(),(( this.Cursor.getHighlightBegin() + 1) | 0),dottype);
		else
			if( this.Cursor.getHighlightBegin() == - 1)
				this.addDot_1(this.Cursor.getSectionNum(),this.Cursor.getVoiceNum(),this.Cursor.getEventNum(),dottype);

	}

	/*------------------------------------------------------------------------
Method:  void shiftDotPositions(int offset,int snum,int vnum,int startei)
Purpose: Change vertical locations of all dots of addition until next principal
         clef
Parameters:
  Input:  int offset    - number of places to shift dots
          int snum,vnum - section and voice number
          int startei   - index of first event in segment
  Output: -
  Return: -
------------------------------------------------------------------------*/
	/* FIX: deal with versions and dot positions */
	/* FIXED: dot position now represented as pitch */
	shiftDotPositions(offset:number,snum:number,vnum:number,startei:number):void
	{
		return;
	}

	/*    if (offset==0)
      return;

    Event cure=curVersionMusicData.getSection(snum).getVoice(vnum).getEvent(startei);
    while (cure!=null && !cure.hasPrincipalClef())
      {
        if (cure.geteventtype()==Event.EVENT_DOT)
          {
            DotEvent de=(DotEvent)cure;
            if ((de.getdottype()&DotEvent.DT_Addition)!=0)
              de.modifyPitch(offset);
          }
        cure=curVersionMusicData.getSection(snum).getVoice(vnum).getEvent(++startei);
      }*/
	/*------------------------------------------------------------------------
Method:  void doClefAction([int ct])
Purpose: Choose and perform appropriate action after clef-button or key
         has been pressed
Parameters:
  Input:  int ct - clef type indicated by user input
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public doClefAction_1(ct:number):void
	{
		if( this.getHighlightBegin() == - 1)
			this.addClef_2(ct);
		else
			if( this.oneItemHighlighted() && this.getCurEvent_2().getEvent_1().geteventtype() == Event.EVENT_CLEF)
				this.modifyClefType(ct);

	}

	public doClefAction_2():void
	{
		if( this.getHighlightBegin() == - 1)
			this.addClef_3();

	}

	/*------------------------------------------------------------------------
Method:  void addClef([Clef c|int ct])
Purpose: Insert clef at current cursor location
Parameters:
  Input:  Clef c - clef information to insert
          int ct - type for new clef
  Output: -
  Return: -
------------------------------------------------------------------------*/
	addClef_1(c:Clef):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let oldSig:ModernKeySignature = ModernKeySignature.new1(this.getCurModernKeySig(snum,vnum,eventnum));
		this.Cursor.hideCursor();
		let laste:Event = null;
		if( eventnum > 0 && ! c.isprincipalclef())
			laste = this.renderedSections[snum].eventinfo[vnum].getEvent((( eventnum - 1) | 0)).getEvent_1();

		let ce:ClefEvent = ClefEvent.new7(Clef.new1(c),laste,this.getCurClefEvent(snum,vnum,eventnum));
		let oldc:Clef = this.getCurClef(snum,vnum,eventnum);
		if( oldc != null)
			this.shiftDotPositions(((((( oldc.line1placenum - c.line1placenum) | 0)) / 2) | 0),snum,vnum,eventnum);

		eventnum = this.insertEvent(snum,vnum,eventnum,ce);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/* a new principal clef always starts a new clef set */
	/*    int startei=firstEventNumAfterClefSet(snum,vnum,eventnum+1,ce.getClefSet());
    updateNoteAccidentals(snum,vnum,startei,oldSig,ce.getClefSet().getKeySig());*/
	addClef_2(ct:number):void
	{
		let curclef:Clef = this.getCurClef(this.Cursor.getSectionNum(),this.Cursor.getVoiceNum(),this.Cursor.getEventNum());
		if( curclef != null && curclef.cleftype == ct)
			this.addClef_3();
		else
			this.addClef_1(Clef.new0(ct,Clef.defaultClefLoc(ct),Clef.DefaultClefPitches[ct],false,Clef.isFlatType(ct),curclef));

	}

	/* duplicate current clef */
	/* duplicate current principal clef */
	addClef_3():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let curclef:Clef = this.getCurClef(snum,vnum,eventnum);
		if( curclef != null)
			this.addClef_1(curclef);
		else
			this.addClef_1(Clef.new0(Clef.CLEF_C,1,Clef.DefaultClefPitches[Clef.CLEF_C],false,false,null));

	}

	/*------------------------------------------------------------------------
Method:  void modifyClef*(int ct,int loc|int offset)
Purpose: Change attributes of currently highlighted clef
Parameters:
  Input:  int ct     - new clef type
          int loc    - new vertical location
          int offset - number of places to shift clef vertically
  Output: -
  Return: -
------------------------------------------------------------------------*/
	modifyClef(ct:number,loc:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let origce:ClefEvent =<ClefEvent> this.getCurEvent_2().getEvent_1();
		let ce:ClefEvent =<ClefEvent> this.getEventForModification(snum,vnum,eventnum);
		let c:Clef = ce.getClef_1(false,false);
		let displayClef:Clef = this.getCurClef(snum,vnum,(( eventnum - 1) | 0));
		let oldct:number = c.getcleftype();
		let oldloc:number = c.getloc();
		let oldline1:number = c.line1placenum;
		let sig:boolean = c.signature();
		let oldSig:ModernKeySignature = this.getCurModernKeySig(snum,vnum,eventnum);
		eventnum +=(( ce.getListPlace(! this.inVariantVersion()) - origce.getListPlace(! this.inVariantVersion())) | 0);
		if( ! c.isflat() && Clef.isFlatType(ct))
			sig = true;

		c.setattributes(ct,loc,ct != c.cleftype ? Clef.DefaultClefPitches[ct]:c.pitch,false,sig,displayClef);
		this.curVersionMusicData.getSection(snum).getVoice_1(vnum).recalcEventParams_1();
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		if( c.getcleftype() != oldct || c.getloc() != oldloc || ce != origce)
			this.parentEditorWin.fileModified_2();

		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/* mark flats as signature clefs by default */
	/*    shiftDotPositions((oldline1-c.line1placenum)/2,snum,vnum,eventnum+1);
    int startei=firstEventNumAfterClefSet(snum,vnum,eventnum+1,ce.getClefSet());
    ModernKeySignature newSig=sig ? ce.getClefSet().getKeySig() :
                                    ce.getModernKeySig();
    updateNoteAccidentals(snum,vnum,startei,oldSig,newSig);*/
	modifyClefType(ct:number):void
	{
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let ce:ClefEvent =<ClefEvent> this.getCurEvent_2().getEvent_1();
		let c:Clef = ce.getClef_1(false,false);
		if( ct != c.cleftype)
			this.modifyClef(ct,Clef.defaultClefLoc(ct));
		else
			if( ct == Clef.CLEF_Bmol)
				this.modifyClef(Clef.CLEF_BmolDouble,c.getloc());
			else
				if( ct == Clef.CLEF_BmolDouble)
					this.modifyClef(Clef.CLEF_Bmol,c.getloc());
				else
					if( ct == Clef.CLEF_F)
						this.modifyClef(Clef.CLEF_Frnd,c.getloc());
					else
						if( ct == Clef.CLEF_Frnd)
							this.modifyClef(Clef.CLEF_F,c.getloc());
						else
							if( ct == Clef.CLEF_G)
								this.modifyClef(Clef.CLEF_Gamma,c.getloc());

	}

	modifyClefLocation(offset:number):void
	{
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let ce:ClefEvent =<ClefEvent> this.getCurEvent_2().getEvent_1();
		let c:Clef = ce.getClef_1(false,false);
		this.modifyClef(c.cleftype,(( c.linespacenum +(( offset *( c.isprincipalclef() ? 2:1)) | 0)) | 0));
	}

	toggleClefSignatureStatus():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let origce:ClefEvent =<ClefEvent> this.getCurEvent_2().getEvent_1();
		let c:Clef = origce.getClef_1(false,false);
		let oldSig:ModernKeySignature = this.getCurModernKeySig(snum,vnum,eventnum);
		if( !( c.isflat() || c.issharp()))
			return;

		let ce:ClefEvent =<ClefEvent> this.getEventForModification(snum,vnum,eventnum);
		c = ce.getClef_1(false,false);
		c.setSignature(! c.signature());
		this.curVersionMusicData.getSection(snum).getVoice_1(vnum).recalcEventParams_1();
		eventnum +=(( ce.getListPlace(! this.inVariantVersion()) - origce.getListPlace(! this.inVariantVersion())) | 0);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*    int startei=firstEventNumAfterClefSet(snum,vnum,eventnum+1,ce.getClefSet());
    ModernKeySignature newSig=c.signature() ? ce.getClefSet().getKeySig() :
                                              ce.getModernKeySig();
    updateNoteAccidentals(snum,vnum,startei,oldSig,newSig);*/
	toggleEventColoration():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		e.setColored_1(! e.isColored());
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void addMensurationSign(MensSignElement mse)
Purpose: Insert mensuration sign at current cursor location
Parameters:
  Input:  MensSignElement mse - initial element for new sign
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addMensurationSign_1(mse:MensSignElement):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		this.Cursor.hideCursor();
		let signs:LinkedList<MensSignElement> = new LinkedList<MensSignElement>();
		signs.add(mse);
		let me:MensEvent = MensEvent.new20(signs,4);
		eventnum = this.insertEvent(snum,vnum,eventnum,me);
	}

	public addMensurationSign_2():void
	{
		this.addMensurationSign_1(MensSignElement.new0(MensSignElement.MENS_SIGN_C,false,false));
	}

	public doMensurationAction(signType:number):void
	{
		if( this.Cursor.getHighlightBegin() == - 1)
			this.addMensurationSign_1(MensSignElement.new0(signType,false,false));
		else
			if( this.Cursor.oneItemHighlighted())
				this.setMensurationSign(signType);

	}

	/*------------------------------------------------------------------------
Method:  void setMensurationSign(int newSign)
Purpose: Change attributes of currently highlighted mensuration - main sign
Parameters:
  Input:  int newSign - new main sign type
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setMensurationSign(newSign:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		if( orige.geteventtype() != Event.EVENT_MENS)
			return;

		let origme:MensEvent =<MensEvent> orige;
		let mse:MensSignElement = origme.getMainSign();
		if( newSign == mse.signType)
			return;

		let me:MensEvent =<MensEvent> this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( me.getListPlace(! this.inVariantVersion()) - origme.getListPlace(! this.inVariantVersion())) | 0);
		mse = me.getMainSign();
		mse.signType = newSign;
		switch( newSign)
		{
			case MensSignElement.MENS_SIGN_O:
			{
				me.getMensInfo_1().tempus = Mensuration.MENS_TERNARY;
				break;
			}
			case MensSignElement.MENS_SIGN_C:
			{
			}
			case MensSignElement.MENS_SIGN_CREV:
			{
				me.getMensInfo_1().tempus = Mensuration.MENS_BINARY;
				break;
			}
		}
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void addMensurationElementSign(int newSign)
Purpose: Change attributes of currently highlighted mensuration - add new sign
Parameters:
  Input:  int newSign - new sign type
  Output: -
  Return: -
------------------------------------------------------------------------*/
	addMensurationElementSign(newSign:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		let me:MensEvent =<MensEvent> e;
		me.addSignElement(MensSignElement.new0(newSign,false,false));
		if( me.getSigns().size() == 1)
			switch( newSign)
			{
				case MensSignElement.MENS_SIGN_O:
				{
					me.getMensInfo_1().tempus = Mensuration.MENS_TERNARY;
					break;
				}
				case MensSignElement.MENS_SIGN_C:
				{
				}
				case MensSignElement.MENS_SIGN_CREV:
				{
					me.getMensInfo_1().tempus = Mensuration.MENS_BINARY;
					break;
				}
			}

		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void addMensurationElementNumber(int num1,int num2)
Purpose: Change attributes of currently highlighted mensuration - add new number(s)
Parameters:
  Input:  int num1,num2 - number pair to add
  Output: -
  Return: -
------------------------------------------------------------------------*/
	addMensurationElementNumber_1(num1:number,num2:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		if( orige.geteventtype() != Event.EVENT_MENS)
			return;

		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		let me:MensEvent =<MensEvent> e;
		me.addSignElement(MensSignElement.new1(MensSignElement.NUMBERS,Proportion.new0(num1,num2)));
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	public addMensurationElementNumber_2(num:number):void
	{
		this.addMensurationElementNumber_1(num,0);
	}

	public doMensurationNumberAction(num:number):void
	{
		if( this.Cursor.oneItemHighlighted())
			this.addMensurationElementNumber_2(num);
		else
			if( this.Cursor.getHighlightBegin() == - 1)
				switch( num)
				{
					case 2:
					{
						this.addProportion_1(2,3);
						break;
					}
					case 3:
					{
						this.addProportion_1(3,2);
						break;
					}
				}

	}

	/*------------------------------------------------------------------------
Method:  void deleteMensurationElement(int elNum)
Purpose: Change attributes of currently highlighted mensuration - delete one
         element
Parameters:
  Input:  int elNum - index of element to delete
  Output: -
  Return: -
------------------------------------------------------------------------*/
	deleteMensurationElement(elNum:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let origme:MensEvent =<MensEvent> this.getCurEvent_2().getEvent_1();
		if( origme.getSigns().size() < 2)
			return;

		let me:MensEvent =<MensEvent> this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( me.getListPlace(! this.inVariantVersion()) - origme.getListPlace(! this.inVariantVersion())) | 0);
		me.deleteSignElement(elNum);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void toggleMensurationStroke()
Purpose: Change attributes of currently highlighted mensuration - toggle
         presence of stroke
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	toggleMensurationStroke():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		if( orige.geteventtype() != Event.EVENT_MENS)
			return;

		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		let me:MensEvent =<MensEvent> e;
		let mse:MensSignElement = me.getMainSign();
		mse.stroke = ! mse.stroke;
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void toggleMensurationDot()
Purpose: Change attributes of currently highlighted mensuration - toggle
         presence of dot
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public toggleMensurationDot():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		if( orige.geteventtype() != Event.EVENT_MENS)
			return;

		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		let me:MensEvent =<MensEvent> e;
		let mse:MensSignElement = me.getMainSign();
		mse.dotted = ! mse.dotted;
		me.getMensInfo_1().prolatio = mse.dotted ? Mensuration.MENS_TERNARY:Mensuration.MENS_BINARY;
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void toggleMensurationNoScoreSig()
Purpose: Change attributes of currently highlighted mensuration - toggle
         whether event affects scoring/measure type
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	toggleMensurationNoScoreSig():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		let me:MensEvent =<MensEvent> e;
		me.toggleNoScoreSig();
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void toggleMensurationSize()
Purpose: Change attributes of currently highlighted mensuration - toggle
         size
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	toggleMensurationSize():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		let me:MensEvent =<MensEvent> e;
		me.toggleSize();
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void toggleMensurationVertical()
Purpose: Change attributes of currently highlighted mensuration - toggle
         vertical arrangement
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	toggleMensurationVertical():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		let me:MensEvent =<MensEvent> e;
		me.toggleVertical();
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void setEventMensuration(Mensuration m)
Purpose: Modify mensuration scheme of a MensEvent
Parameters:
  Input:  Mensuration m - new mensuration scheme
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setEventMensuration(m:Mensuration):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let origme:MensEvent =<MensEvent> this.getCurEvent_2().getEvent_1();
		if( origme.getMensInfo_1().equals(m))
			return;

		let me:MensEvent =<MensEvent> this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( me.getListPlace(! this.inVariantVersion()) - origme.getListPlace(! this.inVariantVersion())) | 0);
		me.setMensInfo(m);
		this.curVersionMusicData.getSection(snum).getVoice_1(vnum).recalcEventParams_1();
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void addOriginalText(String text)
Purpose: Insert OriginalText event at current cursor location
Parameters:
  Input:  String text - text phrase to add
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addOriginalText_1(text:string):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		this.Cursor.hideCursor();
		let oe:OriginalTextEvent = OriginalTextEvent.new28(text);
		eventnum = this.insertEvent(snum,vnum,eventnum,oe);
	}

	/* add currently highlighted phrase */
	public addOriginalText_2():void
	{
		this.parentEditorWin.textEditorFrame.insertOriginalTextPhrase();
	}

	/*------------------------------------------------------------------------
Method:  void addProportion()
Purpose: Insert proportion at current cursor location
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addProportion_1(i1:number,i2:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		this.Cursor.hideCursor();
		let pe:ProportionEvent = ProportionEvent.new29(i1,i2);
		eventnum = this.insertEvent(snum,vnum,eventnum,pe);
	}

	public addProportion_2():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let curProp:Proportion = this.getCurProportion(snum,vnum,eventnum);
		if( curProp == null || curProp.equals(Proportion.EQUALITY))
			curProp = Proportion.new0(2,3);

		this.addProportion_1(curProp.i2,curProp.i1);
	}

	/* default: cancel current proportion */
	/*------------------------------------------------------------------------
Method:  void addColorChange()
Purpose: Insert coloration change at current cursor location
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addColorChange():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		this.Cursor.hideCursor();
		let ce:ColorChangeEvent = ColorChangeEvent.new8(Coloration.new2(this.getCurColoration(snum,vnum,eventnum)));
		eventnum = this.insertEvent(snum,vnum,eventnum,ce);
	}

	/*------------------------------------------------------------------------
Method:  void setEventColoration(Coloration c)
Purpose: Modify coloration scheme of a ColorChange event
Parameters:
  Input:  Coloration c - new coloration for event
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setEventColoration(c:Coloration):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let origcce:ColorChangeEvent =<ColorChangeEvent> this.getCurEvent_2().getEvent_1();
		if( c.equals(origcce.getcolorscheme()))
			return;

		let cce:ColorChangeEvent =<ColorChangeEvent> this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( cce.getListPlace(! this.inVariantVersion()) - origcce.getListPlace(! this.inVariantVersion())) | 0);
		cce.setcolorscheme(c);
		this.curVersionMusicData.getSection(snum).getVoice_1(vnum).recalcEventParams_1();
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void addLineEnd()
Purpose: Insert line end at current cursor location
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addLineEnd():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let custosp:Pitch;
		let curCol:Coloration = this.getCurColoration(snum,vnum,(( eventnum - 1) | 0));
		this.Cursor.hideCursor();
		let eventlistplace:number = this.renderedSections[snum].getVoicedataPlace(vnum,eventnum);
		let custpitchnote:NoteEvent =<NoteEvent> this.getNeighboringEventOfType(Event.EVENT_NOTE,snum,vnum,eventnum,1);
		if( custpitchnote == null)
			custpitchnote =<NoteEvent> this.getNeighboringEventOfType(Event.EVENT_NOTE,snum,vnum,(( eventnum - 1) | 0),- 1);

		let curclef:Clef = this.getCurClef(snum,vnum,eventnum);
		if( custpitchnote != null)
			custosp = Pitch.new3(custpitchnote.getPitch_1());
		else
			if( curclef != null)
				custosp = Pitch.new3(curclef.pitch);
			else
				custosp = null;

		if( custosp != null)
			{
				let custe:CustosEvent = CustosEvent.new9(custosp);
				custe.setcolorparams_1(curCol);
				eventnum =(( this.insertEventWithoutRerender(snum,vnum,eventnum,custe) + 1) | 0);
				this.rerender_1();
			}

		let lee:LineEndEvent = LineEndEvent.new15();
		lee.setcolorparams_1(curCol);
		eventnum =(( this.insertEventWithoutRerender(snum,vnum,eventnum,lee) + 1) | 0);
		this.rerender_1();
		if( curclef != null)
			{
				let lastce:ClefEvent = null;
				let clefi:Iterator<Clef> = this.getCurClefSet(snum,vnum,this.Cursor.getEventNum()).iterator();
				while( clefi.hasNext())
				{
					lastce = ClefEvent.new7(Clef.new1(<Clef>( clefi.next())),lastce,this.getCurClefEvent(snum,vnum,this.Cursor.getEventNum()));
					lastce.setcolorparams_1(curCol);
					lastce.setColored_1(this.getCurClefEvent(snum,vnum,(( eventnum - 1) | 0)).isColored());
					eventnum =(( this.insertEventWithoutRerender(snum,vnum,eventnum,lastce) + 1) | 0);
					this.rerender_1();
				}
			}

		this.curVersionMusicData.getSection(snum).getVoice_1(vnum).recalcEventParams_1();
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.moveCursor(snum,vnum,eventnum);
	}

	//    boolean    editorial=inEditorialSection(snum,vnum,eventnum-1);
	/* custos */
	//        custe.setEditorial(editorial);
	/*        musicData.getSection(snum).getVoice(vnum).addEvent(eventlistplace++,custe);
        eventnum++;*/
	/* line end */
	//    lee.setEditorial(editorial);
	/*    musicData.getSection(snum).getVoice(vnum).addEvent(eventlistplace++,lee);
    eventnum++;*/
	/* clefs: duplicate current clef set */
	//            lastce.setEditorial(editorial);
	/*            musicData.getSection(snum).getVoice(vnum).addEvent(eventlistplace++,lastce);
            eventnum++;*/
	/*------------------------------------------------------------------------
Method:  void togglePageEnd()
Purpose: Toggle page-end attribute of currently highlighted LineEnd
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	togglePageEnd():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		let le:LineEndEvent =<LineEndEvent> e;
		le.setPageEnd(! le.isPageEnd());
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void addCustos()
Purpose: Insert custos at current cursor location
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addCustos():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let custosp:Pitch;
		this.Cursor.hideCursor();
		let custpitchnote:NoteEvent =<NoteEvent> this.getNeighboringEventOfType(Event.EVENT_NOTE,snum,vnum,eventnum,1);
		if( custpitchnote == null)
			custpitchnote =<NoteEvent> this.getNeighboringEventOfType(Event.EVENT_NOTE,snum,vnum,(( eventnum - 1) | 0),- 1);

		let curclef:Clef = this.getCurClef(snum,vnum,eventnum);
		if( custpitchnote != null)
			custosp = Pitch.new3(custpitchnote.getPitch_1());
		else
			if( curclef != null)
				custosp = Pitch.new3(curclef.pitch);
			else
				custosp = Pitch.new2(4);

		eventnum = this.insertEvent(snum,vnum,eventnum,CustosEvent.new9(custosp));
	}

	/*------------------------------------------------------------------------
Method:  void addBarline()
Purpose: Insert barline at current cursor location
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addBarline():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		this.Cursor.hideCursor();
		let be:BarlineEvent = BarlineEvent.new4();
		eventnum = this.insertEvent(snum,vnum,eventnum,be);
	}

	/*------------------------------------------------------------------------
Method:  void changeNumBarlines(int nl)
Purpose: Modify number of lines in barline event
Parameters:
  Input:  int nl - new number of lines for event
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public changeBarlineLength(offset:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let origbe:BarlineEvent =<BarlineEvent> this.getCurEvent_2().getEvent_1();
		let newNumSpaces:number =(( origbe.getNumSpaces() + offset) | 0);
		if( newNumSpaces < 1)
			return;

		let be:BarlineEvent =<BarlineEvent> this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( be.getListPlace(! this.inVariantVersion()) - origbe.getListPlace(! this.inVariantVersion())) | 0);
		be.setNumSpaces(newNumSpaces);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	public changeNumBarlines(nl:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let origbe:BarlineEvent =<BarlineEvent> this.getCurEvent_2().getEvent_1();
		if( nl == origbe.getNumLines())
			return;

		let be:BarlineEvent =<BarlineEvent> this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( be.getListPlace(! this.inVariantVersion()) - origbe.getListPlace(! this.inVariantVersion())) | 0);
		be.setNumLines(nl);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	public moveBarline(offset:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		let be:BarlineEvent =<BarlineEvent> e;
		be.setBottomLinePos((( be.getBottomLinePos() + offset) | 0));
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	public toggleRepeatSign():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		let be:BarlineEvent =<BarlineEvent> e;
		be.setRepeatSign(! be.isRepeatSign());
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void addAnnotationText()
Purpose: Insert text annotation at current cursor location
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addAnnotationText():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		this.Cursor.hideCursor();
		let ae:AnnotationTextEvent = AnnotationTextEvent.new3("");
		eventnum = this.insertEvent(snum,vnum,eventnum,ae);
	}

	/*------------------------------------------------------------------------
Method:  void setAnnotationText(String s)
Purpose: Set text of highlighted annotation
Parameters:
  Input:  String s - new text
  Output: -
  Return: -
------------------------------------------------------------------------*/
	setAnnotationText(s:string):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let origae:AnnotationTextEvent =<AnnotationTextEvent> this.getCurEvent_2().getEvent_1();
		if(( s == origae.gettext()))
			return;

		let ae:AnnotationTextEvent =<AnnotationTextEvent> this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( ae.getListPlace(! this.inVariantVersion()) - origae.getListPlace(! this.inVariantVersion())) | 0);
		ae.settext(s);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void modifyAnnotationLocation(int offset)
Purpose: Change vertical location of currently highlighted annotation
Parameters:
  Input:  int offset - number of places to shift annotation
  Output: -
  Return: -
------------------------------------------------------------------------*/
	modifyAnnotationLocation(offset:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		let ae:AnnotationTextEvent =<AnnotationTextEvent> e;
		ae.setstaffloc((( ae.getstaffloc() + offset) | 0));
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void addLacuna()
Purpose: Insert lacuna indicator at current cursor location
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addLacuna():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		this.Cursor.hideCursor();
		let le:LacunaEvent = LacunaEvent.new14(! this.inEditorialSection(snum,vnum,eventnum) ? Event.EVENT_LACUNA:Event.EVENT_LACUNA_END);
		eventnum = this.insertEvent(snum,vnum,eventnum,le);
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/* deprecated 
    int snum=Cursor.getSectionNum(),
        vnum=Cursor.getVoiceNum(),
        eventnum=Cursor.getEventNum(),
        eventlistplace=renderedSections[snum].getVoicedataPlace(vnum,eventnum);

    Cursor.hideCursor();
    LacunaEvent lce=new LacunaEvent(len);
    musicData.getSection(snum).getVoice(vnum).addEvent(eventlistplace++,lce);
    musicData.getSection(snum).getVoice(vnum).addEvent(eventlistplace,new Event(Event.EVENT_LACUNA_END));

    rerender();
    repaint();
    parentEditorWin.fileModified();
    hl_anchor=eventnum;
    highlightItems(snum,vnum,eventnum,eventnum);*/
	/*------------------------------------------------------------------------
Method:  void transformHighlightedIntoLacuna()
Purpose: Create new lacuna event to replace highlighted events
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	transformHighlightedIntoLacuna():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let lacunaLen:Proportion = Proportion.new0(0,1);
		for(
		let i:number = this.Cursor.getHighlightBegin();i <= this.Cursor.getHighlightEnd();i ++)
		lacunaLen.add(this.renderedSections[snum].eventinfo[vnum].getEvent(i).getEvent_1().getmusictime());
		let newevnum:number = this.deleteHighlightedWithoutRender();
		this.Cursor.setNoHighlight();
		this.rerender_1();
		this.moveCursor(snum,vnum,newevnum);
		this.addLacuna();
	}

	/* calculate total length of highlighted */
	/* delete highlighted */
	/* replace with lacuna */
	//    addLacuna(lacunaLen);
	/*------------------------------------------------------------------------
Method:  void addModernKeySignature()
Purpose: Insert modern key signature at current cursor location
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addModernKeySignature():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		this.Cursor.hideCursor();
		let mkse:ModernKeySignatureEvent = ModernKeySignatureEvent.new22(this.getCurModernKeySig(snum,vnum,(( eventnum - 1) | 0)));
		eventnum = this.insertEvent(snum,vnum,eventnum,mkse);
	}

	/*------------------------------------------------------------------------
Method:  void modifyModernKeySignature(int dir)
Purpose: Change currently highlighted modern key signature
Parameters:
  Input:  int dir - positive=sharpward, negative=flatward
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public modifyModernKeySignature(dir:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let orige:Event = this.getCurEvent_2().getEvent_1();
		let e:Event = this.getEventForModification(snum,vnum,eventnum);
		eventnum +=(( e.getListPlace(! this.inVariantVersion()) - orige.getListPlace(! this.inVariantVersion())) | 0);
		let mkse:ModernKeySignatureEvent =<ModernKeySignatureEvent> e;
		let oldSig:ModernKeySignature = ModernKeySignature.new1((<ModernKeySignatureEvent> orige).getSigInfo());
		if( dir > 0)
			mkse.addSharp();
		else
			if( dir < 0)
				mkse.addFlat();
			else
				return;

		this.curVersionMusicData.getSection(snum).getVoice_1(vnum).recalcEventParams_1();
		this.updateNoteAccidentals(snum,vnum,(( eventnum + 1) | 0),oldSig,mkse.getSigInfo());
		this.rerender_1();
		this.checkVariant(snum,vnum,eventnum);
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.hl_anchor = eventnum;
		this.highlightItems(snum,vnum,eventnum,eventnum);
	}

	/*------------------------------------------------------------------------
Method:  void updateNoteAccidentals(int snum,int vnum,int startei,
                                    ModernKeySignature oldSig,ModernKeySignature newSig)
Purpose: Make modern accidentals attached to notes coherent with a given key
         signature (e.g., remove 'accidental' b-flat on a note if it's already
         in the signature)
Parameters:
  Input:  int snum,vnum             - section/voice number
          int startei               - first event index to check
          ModernKeySignature oldSig - current key signature applied to note
          ModernKeySignature newSig - new signature to apply
  Output: -
  Return: -
------------------------------------------------------------------------*/
	updateNoteAccidentals(snum:number,vnum:number,startei:number,oldSig:ModernKeySignature,newSig:ModernKeySignature):void
	{
	}

	/*    int     i=startei;
    boolean done=startei>=renderedSections[snum].eventinfo[vnum].size() &&
                 snum==renderedSections.length-1;

    while (!done)
      {
        Event e=renderedSections[snum].eventinfo[vnum].getEvent(i).getEvent();
        if (e.geteventtype()==Event.EVENT_MODERNKEYSIGNATURE ||
            e.hasSignatureClef())
          return;
        if (e.geteventtype()==Event.EVENT_NOTE)
          {
            NoteEvent ne=(NoteEvent)e;
            ModernAccidental newAcc=newSig.chooseNoteAccidental(ne,oldSig.calcNotePitchOffset(ne)),
                             oldAcc=ne.getModAcc();
            if (newAcc==null || oldAcc==null || !newAcc.equals(oldAcc))
              ne.setModAcc(newAcc);
          }

        i++;
        if (i>=renderedSections[snum].eventinfo[vnum].size())
          {
            snum++;
            while (snum<renderedSections.length && renderedSections[snum].eventinfo[vnum]==null)
              snum++;  get to next section which includes this voice 
            i=0;
          }
        if (snum>=renderedSections.length)
          done=true;
      }*/
	/*------------------------------------------------------------------------
Method:  void addVoice()
Purpose: Add new voice to end of voice list
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addVoice():void
	{
		this.numvoices = this.musicData.getVoiceData().length;
		let newvoicelist:Voice[]= Array(((( this.numvoices + 1) | 0)));
		for(
		let i:number = 0;i < this.numvoices;i ++)
		newvoicelist[i]= this.musicData.getVoiceData()[i];
		newvoicelist[this.numvoices]= Voice.new1(this.musicData,(( this.numvoices + 1) | 0),"[" +((( this.numvoices + 1) | 0)) + "]",false);
		this.musicData.setVoiceData(newvoicelist);
		for(
		let si:number = 0;si < this.numSections;si ++)
		this.musicData.getSection(si).addVoice_1(newvoicelist[this.numvoices]);
		this.rerender_1();
		this.initdrawingparams();
		this.newsize(this.screensize.width,this.screensize.height);
		this.parentwin.pack();
		this.parentEditorWin.setEventEditorLocation();
		this.parentEditorWin.setEditingOptionsLocation();
		this.parentEditorWin.reinitVoiceTextAreas();
		this.parentEditorWin.initSectionAttribsFrame();
		this.parentEditorWin.setSectionAttribsFrameLocation();
		this.parentEditorWin.fileModified_2();
	}

	/* copy master voice list */
	/* add new voice, change voice list pointer, update all sections */
	/*------------------------------------------------------------------------
Method:    void renderSections()
Overrides: Gfx.ViewCanvas.renderSections
Purpose:   Pre-render all sections for display
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public renderSections_1():void
	{
		super.renderSections_1();
	}

	/*------------------------------------------------------------------------
Method:    void drawEvents(Graphics2D g)
Overrides: Gfx.ViewCanvas.drawEvents
Purpose:   Draw music on staves
Parameters:
  Input:  Graphics2D g - graphical context
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public drawEvents_1(g:Graphics2D):void
	{
		super.drawEvents_1(g);
	}

	/*------------------------------------------------------------------------
Method:  void splitMensuralSection()
Purpose: Create section break at current cursor position within mensural
         music section
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public splitMensuralSection():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let cursorXloc:number = this.Cursor.getCanvasXloc();
		this.Cursor.hideCursor();
		this.splitMensuralSectionData(snum,vnum,eventnum,cursorXloc);
		this.Cursor.setNoHighlight();
		this.rerender_1();
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.moveCursor((( snum + 1) | 0),vnum,0);
	}

	/*------------------------------------------------------------------------
Method:  void resetMusicData()
Purpose: Rerender and reposition cursor
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public resetMusicData():void
	{
		this.setCurrentVariantVersion_1(this.getCurrentVariantVersion_1());
		this.rerender_1();
		this.repaint();
		this.moveCursor(0,0,0);
	}

	/*------------------------------------------------------------------------
Method:  void splitMensuralSectionData(int snum,int vnum,int eventnum,int cursorXloc)
Purpose: Split data within mensural section at a given location
Parameters:
  Input:  int snum,vnum,eventnum,cursorXloc - location for split
  Output: -
  Return: -
------------------------------------------------------------------------*/
	splitMensuralSectionData(snum:number,vnum:number,eventnum:number,cursorXloc:number):void
	{
		let curSection:MusicMensuralSection =<MusicMensuralSection> this.musicData.getSection(snum);
		let newSection:MusicMensuralSection = MusicMensuralSection.new2(curSection.getNumVoices_1(),curSection.isEditorial(),this.getCurColoration(snum,vnum,eventnum));
		for(
		let vi:number = 0;vi < newSection.getNumVoices_1();vi ++)
		{
			let curv:VoiceMensuralData =<VoiceMensuralData> curSection.getVoice_1(vi);
			let newv:VoiceMensuralData = null;
			if( curv != null)
				{
					newv = VoiceMensuralData.new3(curv.getMetaData(),newSection);
					let curvEventnum:number = this.calcEventnum(this.calcSectionNum(cursorXloc),vi,cursorXloc);
					let deletionPoint:number = this.renderedSections[snum].getVoicedataPlace(vi,curvEventnum);
					for(
					let ei:number = curvEventnum;ei < curv.getNumEvents();ei ++)
					newv.addEvent_1(curv.getEvent(ei));
					curv.truncateEvents_1(deletionPoint);
				}

			newSection.setVoice_1(vi,newv);
		}
		this.musicData.addSection_1((( snum + 1) | 0),newSection);
	}

	//    newvoicelist[numvoices].addevent(new Event(Event.EVENT_SECTIONEND));
	/*------------------------------------------------------------------------
Method:  void insertSection(int newSectionType)
Purpose: Insert new section at current cursor position
Parameters:
  Input:  int newSectionType - type of section to insert
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public insertSection(newSectionType:number):void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number = this.Cursor.getEventNum();
		let cursorXloc:number = this.Cursor.getCanvasXloc();
		let newsnum:number = snum;
		this.Cursor.hideCursor();
		if( eventnum > 0)
			{
				this.splitMensuralSectionData(snum,vnum,eventnum,cursorXloc);
				newsnum ++;
			}

		let curSection:MusicSection = this.musicData.getSection(snum);
		let newSection:MusicSection = null;
		switch( newSectionType)
		{
			case MusicSection.MENSURAL_MUSIC:
			{
				let newMensSection:MusicMensuralSection = MusicMensuralSection.new2(curSection.getNumVoices_1(),curSection.isEditorial(),curSection.getBaseColoration());
				for(
				let vi:number = 0;vi < newMensSection.getNumVoices_1();vi ++)
				{
					let newv:VoiceMensuralData = VoiceMensuralData.new3(curSection.getVoiceMetaData_1(vi),newMensSection);
					newv.addEvent_1(Event.new1(Event.EVENT_SECTIONEND));
					newMensSection.setVoice_1(vi,newv);
				}
				newSection = newMensSection;
				break;
			}
			case MusicSection.PLAINCHANT:
			{
				let newChantSection:MusicChantSection = MusicChantSection.new0(curSection.getNumVoices_1(),curSection.isEditorial(),Coloration.DEFAULT_CHANT_COLORATION);
				for(
				let vi:number = 0;vi < 1;vi ++)
				{
					let newv:VoiceChantData = VoiceChantData.new1(curSection.getVoiceMetaData_1(vi),newChantSection);
					newv.addEvent_1(Event.new1(Event.EVENT_SECTIONEND));
					newChantSection.setVoice_1(vi,newv);
				}
				newSection = newChantSection;
				break;
			}
			case MusicSection.TEXT:
			{
				System.out.println("Insert text section (not implemented)");
				break;
			}
		}
		this.musicData.addSection_1(newsnum,newSection);
		this.Cursor.setNoHighlight();
		this.rerender_1();
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.moveCursor((( snum + 1) | 0),vnum,0);
	}

	/*------------------------------------------------------------------------
Method:  void deleteSection(int snum)
Purpose: Delete one section
Parameters:
  Input:  int snum - number of section to delete
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public deleteSection_1(snum:number):void
	{
		this.Cursor.hideCursor();
		this.musicData.deleteSection(snum);
		if( snum >= this.musicData.getSections().size())
			snum --;

		this.parentEditorWin.updateSectionGUI_2(snum);
		this.Cursor.setNoHighlight();
		this.rerender_1();
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.moveCursor(snum,0,0);
	}

	/*------------------------------------------------------------------------
Method:  void combineSectionWithNext()
Purpose: Combine section currently holding cursor with following section
         Validity checks must be performed elsewhere before calling this
         function
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public combineSectionWithNext_1():void
	{
		let snum:number = this.Cursor.getSectionNum();
		let vnum:number = this.Cursor.getVoiceNum();
		let eventnum:number =(( this.renderedSections[snum].eventinfo[vnum].size() - 1) | 0);
		this.Cursor.hideCursor();
		let curSection:MusicSection = this.musicData.getSection(snum);
		let nextSection:MusicSection = this.musicData.getSection((( snum + 1) | 0));
		for(
		let vi:number = 0;vi < this.numvoices;vi ++)
		{
			let v1:VoiceEventListData = curSection.getVoice_1(vi);
			let v2:VoiceEventListData = nextSection.getVoice_1(vi);
			if( v1 == null)
				{
					if( v2 != null)
						curSection.setVoice_1(vi,v2);

				}

			else
				if( v2 != null)
					{
						v1.deleteEvent_1((( v1.getNumEvents() - 1) | 0));
						for(
						let ei:number = 0;ei < v2.getNumEvents();ei ++)
						v1.addEvent_1(v2.getEvent(ei));
					}

		}
		this.musicData.deleteSection((( snum + 1) | 0));
		this.Cursor.setNoHighlight();
		this.rerender_1();
		this.repaint();
		this.parentEditorWin.fileModified_2();
		this.moveCursor(snum,vnum,eventnum);
	}

	/* remove SectionEnd */
	/*------------------------------------------------------------------------
Method:  void set[Voice|Event]num(int i)
Purpose: Change cursor settings without immediate display/recalculation
Parameters:
  Input:  int i - new voice|event number
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setVoicenum(i:number):void
	{
		this.Cursor.setVoicenum(i);
	}

	public setEventNum(i:number):void
	{
		this.Cursor.setEventNum(i);
	}

	public setHLAnchor(i:number):void
	{
		this.hl_anchor = i;
	}

	/*------------------------------------------------------------------------
Method:  int getCur[Section|Voice|Event]Num()
Purpose: Return number of section/voice/event at current cursor position
Parameters:
  Input:  -
  Output: -
  Return: number of current voice
------------------------------------------------------------------------*/
	public getCurSectionNum():number
	{
		return this.Cursor.getSectionNum();
	}

	public getCurVoiceNum():number
	{
		return this.Cursor.getVoiceNum();
	}

	public getCurEventNum():number
	{
		return this.Cursor.getEventNum();
	}

	public getHLAnchor():number
	{
		return this.hl_anchor;
	}

	/*------------------------------------------------------------------------
Method:  boolean oneItemHighlighted()
Purpose: Check whether just one item is highlighted
Parameters:
  Input:  -
  Output: -
  Return: true if only one item is highlighted
------------------------------------------------------------------------*/
	public oneItemHighlighted():boolean
	{
		return this.Cursor.oneItemHighlighted();
	}

	/*------------------------------------------------------------------------
Method:  int getHighlightBegin()
Purpose: Return index of event at start of highlight (-1 for none)
Parameters:
  Input:  -
  Output: -
  Return: index of highlight start
------------------------------------------------------------------------*/
	public getHighlightBegin():number
	{
		return this.Cursor.getHighlightBegin();
	}

	/*------------------------------------------------------------------------
Method:  RenderedEvent getCurEvent(int offset)
Purpose: Return event at or near current cursor position
Parameters:
  Input:  int offset - event number offset from current position
  Output: -
  Return: current RenderedEvent
------------------------------------------------------------------------*/
	public getCurEvent_1(offset:number):RenderedEvent
	{
		let re:RenderedEvent = this.renderedSections[this.Cursor.getSectionNum()].eventinfo[this.Cursor.getVoiceNum()].getEvent((( this.Cursor.getEventNum() + offset) | 0));
		let mei:number = this.Cursor.getMultiEventHLindex();
		if( mei == - 1)
			return re;
		else
			return re.getEvent_2(mei);

	}

	public getCurEvent_2():RenderedEvent
	{
		return this.getCurEvent_1(0);
	}

	public getEvent(snum:number,vnum:number,evnum:number):RenderedEvent
	{
		return this.renderedSections[snum].eventinfo[vnum].getEvent(evnum);
	}

	/* return primary event (don't look inside multi-events) */
	getCurMainEvent():RenderedEvent
	{
		return this.renderedSections[this.Cursor.getSectionNum()].eventinfo[this.Cursor.getVoiceNum()].getEvent(this.Cursor.getEventNum());
	}

	getCurSection():MusicSection
	{
		return this.musicData.getSection(this.Cursor.getSectionNum());
	}

	/*------------------------------------------------------------------------
Method:  RenderedEvent getRenderedEvent(int snum,int vnum,int eventnum)
Purpose: Return event at given position
Parameters:
  Input:  int snum,vnum - section/voice number
          int eventnum  - event index
  Output: -
  Return: RenderedEvent at given position
------------------------------------------------------------------------*/
	getRenderedEvent(snum:number,vnum:number,eventnum:number):RenderedEvent
	{
		return this.renderedSections[snum].eventinfo[vnum].getEvent(eventnum);
	}

	/*------------------------------------------------------------------------
Method:  Clef getCur*(int snum,int vnum,int eventnum)
Purpose: Return rendering parameters valid at specified location
Parameters:
  Input:  int snum,vnum - section/voice number
          int eventnum  - event index
  Output: -
  Return: parameter structures
------------------------------------------------------------------------*/
	getCurClef(snum:number,vnum:number,eventnum:number):Clef
	{
		let rcs:RenderedClefSet = this.renderedSections[snum].eventinfo[vnum].getClefEvents(eventnum);
		if( rcs != null)
			return rcs.getPrincipalClefEvent().getEvent_1().getClefSet_2(false).getprincipalclef();

		return null;
	}

	getCurClefSet(snum:number,vnum:number,eventnum:number):ClefSet
	{
		let rcs:RenderedClefSet = this.renderedSections[snum].eventinfo[vnum].getClefEvents(eventnum);
		if( rcs != null)
			return rcs.getLastClefSet(false);

		return null;
	}

	getCurClefEvent(snum:number,vnum:number,eventnum:number):Event
	{
		let rcs:RenderedClefSet = this.renderedSections[snum].eventinfo[vnum].getClefEvents(eventnum);
		if( rcs != null)
			return rcs.getPrincipalClefEvent().getEvent_1();

		return null;
	}

	getCurMensInfo_1(snum:number,vnum:number,eventnum:number):Mensuration
	{
		let re:RenderedEvent = this.renderedSections[snum].eventinfo[vnum].getMensEvent(eventnum);
		if( re != null)
			{
				let me:Event = re.getEvent_1();
				return me.getMensInfo_1();
			}

		return Mensuration.DEFAULT_MENSURATION;
	}

	getCurMensInfo_2():Mensuration
	{
		return this.getCurMensInfo_1(this.Cursor.getSectionNum(),this.Cursor.getVoiceNum(),this.Cursor.getEventNum());
	}

	getCurColoration(snum:number,vnum:number,eventnum:number):Coloration
	{
		return this.renderedSections[snum].eventinfo[vnum].getColoration(eventnum);
	}

	getCurProportion(snum:number,vnum:number,eventnum:number):Proportion
	{
		return this.renderedSections[snum].eventinfo[vnum].getProportion(eventnum);
	}

	getCurModernKeySig(snum:number,vnum:number,eventnum:number):ModernKeySignature
	{
		if( eventnum < 0 && snum > 0)
			{
				for(
				snum --;snum >= 0;snum --)
				if( this.renderedSections[snum].eventinfo[vnum]!= null)
					return this.renderedSections[snum].eventinfo[vnum].getModernKeySig((( this.renderedSections[snum].eventinfo[vnum].size() - 1) | 0));

				return ModernKeySignature.DEFAULT_SIG;
			}

		else
			return this.renderedSections[snum].eventinfo[vnum].getModernKeySig(eventnum);

	}

	inEditorialSection(snum:number,vnum:number,eventnum:number):boolean
	{
		return this.renderedSections[snum].eventinfo[vnum].inEditorialSection(eventnum);
	}

	getCurSectionType():number
	{
		return this.musicData.getSection(this.getCurSectionNum()).getSectionType();
	}

	/*------------------------------------------------------------------------
Method:  NoteEvent getNeighboringNoteEvent(int snum,int vnum,int eventnum,int dir)
Purpose: Return last note event before or after specified location
Parameters:
  Input:  int snum,vnum - section/voice number to check
          int eventnum  - event index to start search
          int dir       - direction to search (1=right, -1=left)
  Output: -
  Return: last NoteEvent
------------------------------------------------------------------------*/
	/*  NoteEvent getNeighboringNoteEvent(int snum,int vnum,int eventnum,int dir)
  {
    int nenum=getNeighboringNoteEventNum(snum,vnum,eventnum,dir);
    if (nenum==-1)
      return null;
    else
      {
        Event e=renderedSections[snum].eventinfo[vnum].getEvent(nenum).getEvent();
        if (e.geteventtype()==Event.EVENT_MULTIEVENT)
          return ((MultiEvent)e).getLowestNote();
        else
          return (NoteEvent)e;
      }
  }

  public int getNeighboringNoteEventNum(int snum,int vnum,int eventnum,int dir)
  {
    for (int i=eventnum; i>=0 && i<renderedSections[snum].eventinfo[vnum].size(); i+=dir)
      {
        Event e=renderedSections[snum].eventinfo[vnum].getEvent(i).getEvent();
        if (e.hasEventType(Event.EVENT_NOTE))
          return i;
      }
    return -1;
  }*/
	getNeighboringEventOfType(etype:number,snum:number,vnum:number,eventnum:number,dir:number):Event
	{
		let nenum:number = this.getNeighboringEventNumOfType(etype,snum,vnum,eventnum,dir);
		if( nenum == - 1)
			return null;
		else
			{
				let e:Event = this.renderedSections[snum].eventinfo[vnum].getEvent(nenum).getEvent_1();
				if( e.geteventtype() == Event.EVENT_MULTIEVENT)
					switch( etype)
					{
						case Event.EVENT_NOTE:
						{
							return(<MultiEvent> e).getLowestNote();
						}
						default:
						{
							return(<MultiEvent> e).getFirstEventOfType_1(etype);
						}
					}

				else
					return e;

			}

	}

	public getNeighboringEventNumOfType(etype:number,snum:number,vnum:number,eventnum:number,dir:number):number
	{
		for(
		let i:number = eventnum;i >= 0 && i < this.renderedSections[snum].eventinfo[vnum].size();i += dir)
		{
			let e:Event = this.renderedSections[snum].eventinfo[vnum].getEvent(i).getEvent_1();
			if( e.hasEventType_1(etype))
				return i;

		}
		return - 1;
	}

	public getNumRenderedEvents(snum:number,vnum:number):number
	{
		return this.renderedSections[snum].eventinfo[vnum].size();
	}

	/*------------------------------------------------------------------------
Method:  int FirstEventNumAfterClefSet(int snum,int vnum,int startei,ClefSet cs)
Purpose: Return first event number after clef set at a given location
Parameters:
  Input:  int snum,vnum - voice number to check
          int eventnum  - event index to start search
          ClefSet cs    - clef set to check
  Output: -
  Return: event number
------------------------------------------------------------------------*/
	firstEventNumAfterClefSet(snum:number,vnum:number,startei:number,cs:ClefSet):number
	{
		for(
		let i:number = startei;i < this.renderedSections[snum].eventinfo[vnum].size();i ++)
		if( this.renderedSections[snum].eventinfo[vnum].getEvent(i).getEvent_1().getClefSet_1() != cs)
			return i;

		return - 1;
	}

	/*------------------------------------------------------------------------
Method:  void set*()
Purpose: Set global editing/input parameterts
Parameters:
  Input:  new editing parameter values
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setColorationOn(newState:boolean):void
	{
		this.colorationOn = newState;
	}

	/* tmp */
	cycleEditorStemDir():void
	{
		switch( this.editorStemDir)
		{
			case NoteEvent.STEM_UP:
			{
				this.editorStemDir = NoteEvent.STEM_DOWN;
				break;
			}
			case NoteEvent.STEM_DOWN:
			{
				this.editorStemDir = - 1;
				break;
			}
			default:
			{
				this.editorStemDir = NoteEvent.STEM_UP;
				break;
			}
		}
	}

	public setEditorColorationType(colType:number):void
	{
		this.editorColorationType = colType;
	}

	/*------------------------------------------------------------------------
Method:     void keyPressed(KeyEvent e)
Implements: KeyListener.keyPressed
Purpose:    Act on key press
Parameters:
  Input:  KeyEvent e - event representing keypress
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public keyPressed(k:KeyEvent):void
	{
		try
		{
			if( k.isControlDown())
				{
					switch( k.getKeyCode())
					{
						case KeyEvent.VK_A:
						{
							this.highlightAll();
							break;
						}
						case KeyEvent.VK_D:
						{
							if( this.Cursor.getHighlightBegin() != - 1)
								this.toggleHighlightedEditorial();

							break;
						}
						case KeyEvent.VK_I:
						{
							this.addVoice();
							break;
						}
						case KeyEvent.VK_L:
						{
							if( this.Cursor.getHighlightBegin() == - 1)
								this.addLacuna();
							else
								this.transformHighlightedIntoLacuna();

							break;
						}
						case KeyEvent.VK_BACK_SLASH:
						{
							System.out.println("CurV=" + this.getCurVoiceNum());
							let curenum:number = this.getCurEvent_2().getEvent_1().getListPlace(false);
							for(
							let i:number = 0;i < curenum;i ++)
							this.curVersionMusicData.getSection(this.getCurSectionNum()).getVoice_1(this.getCurVoiceNum()).getEvent(i).prettyprint_1();
							System.out.println("DONE LIST");
							break;
						}
						case KeyEvent.VK_SLASH:
						{
							let a:Analyzer = new Analyzer(this.musicData,this.renderedSections);
							a.printGeneralAnalysis(System.out);
							if(( this.parentwin.windowFileName == "Untitled score"))
								break;

							let outp:PrintStream = null;
							try
							{
								outp = new PrintStream("data/stats/" + this.parentwin.windowFileName + ".txt");
							}
							catch( e)
							{
								if( e instanceof Exception)
									{
										System.err.println("Error opening file: " + e);
										e.printStackTrace();
									}

								else
									throw e;

							}
							System.out.println();
							System.out.print("Writing analysis to file...");
							a.printGeneralAnalysis(outp);
							System.out.println("done");
							outp.close();
							break;
						}
						case KeyEvent.VK_SEMICOLON:
						{
							let snum:number = this.Cursor.getSectionNum();
							let vnum:number = this.Cursor.getVoiceNum();
							let eventnum:number = this.Cursor.getEventNum();
							let re:RenderedEvent = this.renderedSections[snum].eventinfo[vnum].getEvent(eventnum);
							if( re != null && re.getFullSonority() != null)
								System.out.println(re.getFullSonority());

							break;
						}
						case KeyEvent.VK_PERIOD:
						{
							this.showCurrentVariants();
							break;
						}
						case KeyEvent.VK_1:
						{
							this.toggleVariantError();
							break;
						}
						case KeyEvent.VK_9:
						{
							if( this.Cursor.oneItemHighlighted())
								this.modifyEventTime(Proportion.new0(- 1,1));

							break;
						}
						case KeyEvent.VK_0:
						{
							if( this.Cursor.oneItemHighlighted())
								this.modifyEventTime(Proportion.new0(1,1));

							break;
						}
						case KeyEvent.VK_DELETE:
						{
							if( k.isShiftDown())
								this.deleteAllVariantReadings();

							break;
						}
					}
					if( this.Cursor.oneItemHighlighted())
						if( this.getCurMainEvent().getEvent_1().geteventtype() == Event.EVENT_MULTIEVENT)
							switch( k.getKeyCode())
							{
								case KeyEvent.VK_RIGHT:
								{
								}
								case KeyEvent.VK_KP_RIGHT:
								{
									this.shiftHighlightWithinMultiEvent(1);
									break;
								}
								case KeyEvent.VK_LEFT:
								{
								}
								case KeyEvent.VK_KP_LEFT:
								{
									this.shiftHighlightWithinMultiEvent(- 1);
									break;
								}
							}

						else
							{
								let keych:number = Character.toUpperCase(k.getKeyChar());
								if( keych == Character.codePointAt("]",0))
									this.shiftSignumVertical(1);
								else
									if( keych == Character.codePointAt("[",0))
										this.shiftSignumVertical(- 1);

							}

				}

			else
				if( this.Cursor.oneItemHighlighted())
					{
						let he:Event = this.getCurEvent_2().getEvent_1();
						switch( k.getKeyCode())
						{
							case KeyEvent.VK_LEFT:
							{
							}
							case KeyEvent.VK_KP_LEFT:
							{
								if( k.isShiftDown())
									this.modifyHighlight(- 1);
								else
									this.shiftCursorLoc(- 1,0);

								break;
							}
							case KeyEvent.VK_RIGHT:
							{
							}
							case KeyEvent.VK_KP_RIGHT:
							{
							}
							case KeyEvent.VK_ENTER:
							{
								if( k.isShiftDown())
									this.modifyHighlight(1);
								else
									this.shiftCursorLoc(1,0);

								break;
							}
							case KeyEvent.VK_UP:
							{
							}
							case KeyEvent.VK_KP_UP:
							{
								if( he.getPitch_1() != null)
									this.modifyEventPitch_int(k.isShiftDown() ? 7:1);
								else
									if( he.geteventtype() == Event.EVENT_BARLINE)
										if( k.isShiftDown())
											this.changeBarlineLength(1);
										else
											this.moveBarline(1);


									else
										if( he.geteventtype() == Event.EVENT_CLEF)
											this.modifyClefLocation(1);
										else
											this.modifyHighlightedEventLocations(1);

								break;
							}
							case KeyEvent.VK_DOWN:
							{
							}
							case KeyEvent.VK_KP_DOWN:
							{
								if( he.getPitch_1() != null)
									this.modifyEventPitch_int(k.isShiftDown() ? - 7:- 1);
								else
									if( he.geteventtype() == Event.EVENT_BARLINE)
										if( k.isShiftDown())
											this.changeBarlineLength(- 1);
										else
											this.moveBarline(- 1);


									else
										if( he.geteventtype() == Event.EVENT_CLEF)
											this.modifyClefLocation(- 1);
										else
											this.modifyHighlightedEventLocations(- 1);

								break;
							}
							case KeyEvent.VK_END:
							{
								this.moveCursorToEnd();
								break;
							}
							case KeyEvent.VK_HOME:
							{
								this.moveCursorToHome();
								break;
							}
							case KeyEvent.VK_BACK_SPACE:
							{
							}
							case KeyEvent.VK_DELETE:
							{
								this.deleteHighlightedItems();
								break;
							}
							case KeyEvent.VK_I:
							{
								if( he.geteventtype() == Event.EVENT_NOTE)
									if( k.isShiftDown())
										this.cycleNoteHalfColoration();
									else
										this.toggleNoteColoration();


								else
									if( he.geteventtype() == Event.EVENT_CLEF || he.geteventtype() == Event.EVENT_REST)
										this.toggleEventColoration();

								break;
							}
							case KeyEvent.VK_L:
							{
								if( he.geteventtype() == Event.EVENT_NOTE)
									this.ligateNoteToLast();

								break;
							}
							case KeyEvent.VK_O:
							{
								if( he.geteventtype() == Event.EVENT_NOTE)
									this.changeLigType(NoteEvent.LIG_OBLIQUA);
								else
									if( he.geteventtype() == Event.EVENT_MENS)
										this.setMensurationSign(MensSignElement.MENS_SIGN_O);

								break;
							}
							case KeyEvent.VK_P:
							{
								if( he.geteventtype() == Event.EVENT_NOTE)
									this.toggleNoteAccidentalOptional();
								else
									if( he.geteventtype() == Event.EVENT_LINEEND)
										this.togglePageEnd();

								break;
							}
							case KeyEvent.VK_R:
							{
								if( he.geteventtype() == Event.EVENT_BARLINE)
									this.toggleRepeatSign();
								else
									if( he.geteventtype() == Event.EVENT_NOTE)
										this.changeLigType(NoteEvent.LIG_RECTA);
									else
										if( he.geteventtype() == Event.EVENT_MENS)
											this.setMensurationSign(MensSignElement.MENS_SIGN_CREV);

								break;
							}
							case KeyEvent.VK_S:
							{
								if( he.geteventtype() == Event.EVENT_CLEF)
									this.toggleClefSignatureStatus();
								else
									if( he.geteventtype() == Event.EVENT_MENS)
										this.toggleMensurationSize();
									else
										if( he.geteventtype() == Event.EVENT_NOTE || he.geteventtype() == Event.EVENT_REST)
											this.toggleSignum();

								break;
							}
							case KeyEvent.VK_T:
							{
								if( he.geteventtype() == Event.EVENT_NOTE)
									this.cycleTieType();

								break;
							}
							case KeyEvent.VK_U:
							{
								if( he.geteventtype() == Event.EVENT_NOTE || he.geteventtype() == Event.EVENT_REST)
									this.toggleSignumOrientation();

								break;
							}
							case KeyEvent.VK_V:
							{
								if( he.geteventtype() == Event.EVENT_MENS)
									this.toggleMensurationVertical();
								else
									this.combineVariantReadings();

								break;
							}
							case KeyEvent.VK_CLOSE_BRACKET:
							{
								this.shiftSignumVertical(1);
								break;
							}
							case KeyEvent.VK_OPEN_BRACKET:
							{
								this.shiftSignumVertical(- 1);
								break;
							}
							case KeyEvent.VK_PERIOD:
							{
								if( he.geteventtype() == Event.EVENT_NOTE)
									this.addDot_2(DotEvent.DT_Addition);
								else
									if( he.geteventtype() == Event.EVENT_MENS)
										this.toggleMensurationDot();

								break;
							}
							case KeyEvent.VK_SEMICOLON:
							{
								if( he.geteventtype() == Event.EVENT_NOTE || he.geteventtype() == Event.EVENT_REST)
									this.cycleSignumSide();

								if( k.isShiftDown())
									if( he.geteventtype() == Event.EVENT_NOTE)
										this.addDot_1(this.Cursor.getSectionNum(),this.Cursor.getVoiceNum(),(( this.Cursor.getHighlightBegin() + 1) | 0),DotEvent.DT_Addition);
									else
										if( he.geteventtype() == Event.EVENT_MENS)
											this.toggleMensurationDot();

								break;
							}
							case KeyEvent.VK_SLASH:
							{
							}
							case KeyEvent.VK_COLON:
							{
							}
							case KeyEvent.VK_NUMBER_SIGN:
							{
								if( he.geteventtype() == Event.EVENT_MENS)
									this.toggleMensurationStroke();
								else
									if( he.geteventtype() == Event.EVENT_NOTE)
										this.cycleHighlightedStemDirections();

								break;
							}
							case KeyEvent.VK_PLUS:
							{
							}
							case KeyEvent.VK_EQUALS:
							{
								if( he.geteventtype() == Event.EVENT_NOTE)
									this.changeNoteAccidental(1);
								else
									if( he.geteventtype() == Event.EVENT_MODERNKEYSIGNATURE)
										this.modifyModernKeySignature(1);

								break;
							}
							case KeyEvent.VK_MINUS:
							{
								if( he.geteventtype() == Event.EVENT_NOTE)
									this.changeNoteAccidental(- 1);
								else
									if( he.geteventtype() == Event.EVENT_MODERNKEYSIGNATURE)
										this.modifyModernKeySignature(- 1);

								break;
							}
							default:
							{
								let keych:number = Character.toUpperCase(k.getKeyChar());
								if( he.getPitch_1() != null && he.geteventtype() != Event.EVENT_CLEF)
									{
										if( keych >= Character.codePointAt("A",0) && keych <= Character.codePointAt("G",0))
											this.modifyEventPitch_char(keych);

									}

								else
									if( he.geteventtype() == Event.EVENT_CLEF)
										{
											if( keych == Character.codePointAt("C",0))
												this.doClefAction_1(Clef.CLEF_C);

											if( keych == Character.codePointAt("F",0))
												this.doClefAction_1(Clef.CLEF_F);

											if( keych == Character.codePointAt("G",0))
												this.doClefAction_1(Clef.CLEF_G);

											if( keych == Character.codePointAt("B",0))
												this.doClefAction_1(Clef.CLEF_Bmol);

											if( keych == Character.codePointAt("H",0))
												this.doClefAction_1(Clef.CLEF_Bqua);

											if( keych == Character.codePointAt("X",0))
												this.doClefAction_1(Clef.CLEF_Diesis);

										}

									else
										if( he.geteventtype() == Event.EVENT_MENS && keych == Character.codePointAt("C",0))
											this.setMensurationSign(MensSignElement.MENS_SIGN_C);
										else
											if( keych == Character.codePointAt("]",0))
												this.shiftSignumVertical(1);
											else
												if( keych == Character.codePointAt("[",0))
													this.shiftSignumVertical(- 1);
												else
													if( he.geteventtype() == Event.EVENT_BARLINE)
														if( keych >= Character.codePointAt("1",0) && keych <= Character.codePointAt("8",0))
															this.changeNumBarlines(<number>((((( keych - Character.codePointAt("1",0)) | 0) + 1) | 0)));

								if( keych == Character.codePointAt("0",0) || keych == Character.codePointAt("M",0))
									this.makeMultiEvent();

								if( he.geteventtype() == Event.EVENT_NOTE || he.geteventtype() == Event.EVENT_REST)
									{
										if( keych >= Character.codePointAt("1",0) && keych <= Character.codePointAt("8",0))
											{
												this.parentEditorWin.selectNVButton((( keych - Character.codePointAt("1",0)) | 0));
												this.modifyNoteType(this.parentEditorWin.getSelectedNoteVal());
											}

										else
											if( keych == Character.codePointAt("*",0))
												this.toggleCorona();
											else
												if( keych == Character.codePointAt("<",0))
													this.toggleHighlightedEditorialText();
												else
													if( he.getLength_1() != null)
														if( k.getKeyCode() == KeyEvent.VK_1 && k.isShiftDown())
															this.imperfectNote();
														else
															if( k.getKeyCode() == KeyEvent.VK_2 && k.isShiftDown())
																this.alterNote();
															else
																if( k.getKeyCode() == KeyEvent.VK_3 && k.isShiftDown())
																	this.perfectNote();

									}

							}
						}
					}

				else
					if( this.Cursor.getHighlightBegin() != - 1)
						{
							let he:Event = this.getCurEvent_2().getEvent_1();
							switch( k.getKeyCode())
							{
								case KeyEvent.VK_I:
								{
									this.toggleHighlightedColoration();
									break;
								}
								case KeyEvent.VK_L:
								{
									this.ligateHighlighted();
									break;
								}
								case KeyEvent.VK_O:
								{
									if( he.geteventtype() == Event.EVENT_NOTE)
										this.changeLigType(NoteEvent.LIG_OBLIQUA);

									break;
								}
								case KeyEvent.VK_R:
								{
									if( he.geteventtype() == Event.EVENT_NOTE)
										this.changeLigType(NoteEvent.LIG_RECTA);

									break;
								}
								case KeyEvent.VK_V:
								{
									this.combineVariantReadings();
									break;
								}
								case KeyEvent.VK_SLASH:
								{
								}
								case KeyEvent.VK_COLON:
								{
								}
								case KeyEvent.VK_NUMBER_SIGN:
								{
									this.cycleHighlightedStemDirections();
									break;
								}
								case KeyEvent.VK_UP:
								{
								}
								case KeyEvent.VK_KP_UP:
								{
									this.modifyHighlightedEventLocations(1);
									break;
								}
								case KeyEvent.VK_DOWN:
								{
								}
								case KeyEvent.VK_KP_DOWN:
								{
									this.modifyHighlightedEventLocations(- 1);
									break;
								}
								case KeyEvent.VK_LEFT:
								{
								}
								case KeyEvent.VK_KP_LEFT:
								{
									if( k.isShiftDown())
										this.modifyHighlight(- 1);
									else
										this.shiftCursorLoc(- 1,0);

									break;
								}
								case KeyEvent.VK_RIGHT:
								{
								}
								case KeyEvent.VK_KP_RIGHT:
								{
									if( k.isShiftDown())
										this.modifyHighlight(1);
									else
										this.shiftCursorLoc(1,0);

									break;
								}
								case KeyEvent.VK_END:
								{
									this.moveCursorToEnd();
									break;
								}
								case KeyEvent.VK_HOME:
								{
									this.moveCursorToHome();
									break;
								}
								case KeyEvent.VK_BACK_SPACE:
								{
								}
								case KeyEvent.VK_DELETE:
								{
									this.deleteHighlightedItems();
									break;
								}
								default:
								{
									let keych:number = Character.toUpperCase(k.getKeyChar());
									if( keych == Character.codePointAt("<",0))
										this.toggleHighlightedEditorialText();

								}
							}
						}

					else
						switch( k.getKeyCode())
						{
							case KeyEvent.VK_BACK_SLASH:
							{
								if( k.isShiftDown())
									{
										this.cycleEditorStemDir();
										break;
									}

								if( this.getCurEvent_1(- 1) != null)
									{
										System.out.println("Eventloc " + this.getCurEvent_1(- 1).getEvent_1().getListPlace(false) + ", DefaultEventloc " + this.getCurEvent_1(- 1).getEvent_1().getDefaultListPlace());
										this.getCurEvent_1(- 1).prettyprint();
									}

								System.out.println("Eventloc " + this.getCurEvent_2().getEvent_1().getListPlace(false) + ", DefaultEventloc " + this.getCurEvent_2().getEvent_1().getDefaultListPlace());
								this.getCurEvent_2().prettyprint();
								break;
							}
							case KeyEvent.VK_LEFT:
							{
							}
							case KeyEvent.VK_KP_LEFT:
							{
								if( k.isShiftDown())
									this.modifyHighlight(- 1);
								else
									this.shiftCursorLoc(- 1,0);

								break;
							}
							case KeyEvent.VK_RIGHT:
							{
							}
							case KeyEvent.VK_KP_RIGHT:
							{
								if( k.isShiftDown())
									this.modifyHighlight(1);
								else
									this.shiftCursorLoc(1,0);

								break;
							}
							case KeyEvent.VK_UP:
							{
							}
							case KeyEvent.VK_KP_UP:
							{
								this.shiftCursorLoc(0,- 1);
								break;
							}
							case KeyEvent.VK_DOWN:
							{
							}
							case KeyEvent.VK_KP_DOWN:
							{
								this.shiftCursorLoc(0,1);
								break;
							}
							case KeyEvent.VK_END:
							{
								this.moveCursorToEnd();
								break;
							}
							case KeyEvent.VK_HOME:
							{
								this.moveCursorToHome();
								break;
							}
							case KeyEvent.VK_BACK_SPACE:
							{
								this.deleteCurItem(- 1);
								break;
							}
							case KeyEvent.VK_DELETE:
							{
								if( k.isShiftDown())
									this.deleteVariantReading_1();
								else
									this.deleteCurItem(0);

								break;
							}
							case KeyEvent.VK_PERIOD:
							{
								this.addDot_2(DotEvent.DT_Addition);
								break;
							}
							case KeyEvent.VK_COMMA:
							{
								this.addDot_2(DotEvent.DT_Division);
								break;
							}
							case KeyEvent.VK_I:
							{
								if( k.isShiftDown())
									this.parentEditorWin.toggleEditingOptionsColoration();

								break;
							}
							case KeyEvent.VK_K:
							{
								this.addModernKeySignature();
								break;
							}
							case KeyEvent.VK_L:
							{
								this.addColorChange();
								break;
							}
							case KeyEvent.VK_M:
							{
								this.addMensurationSign_2();
								break;
							}
							case KeyEvent.VK_N:
							{
								this.addAnnotationText();
								break;
							}
							case KeyEvent.VK_P:
							{
								this.addProportion_2();
								break;
							}
							case KeyEvent.VK_T:
							{
								this.addOriginalText_2();
								break;
							}
							case KeyEvent.VK_V:
							{
								this.combineVariantReadings();
								break;
							}
							case KeyEvent.VK_X:
							{
								this.doClefAction_2();
								break;
							}
							case KeyEvent.VK_Z:
							{
								this.addRest(this.parentEditorWin.getSelectedNoteVal());
								break;
							}
							case KeyEvent.VK_SLASH:
							{
								this.addLineEnd();
								break;
							}
							case KeyEvent.VK_SEMICOLON:
							{
								this.addCustos();
								break;
							}
							case KeyEvent.VK_CLOSE_BRACKET:
							{
								this.addBarline();
								break;
							}
							case KeyEvent.VK_SPACE:
							{
								this.addNote_3(this.parentEditorWin.getSelectedNoteVal());
								break;
							}
							default:
							{
								let keych:number = Character.toUpperCase(k.getKeyChar());
								if( keych >= Character.codePointAt("A",0) && keych <= Character.codePointAt("G",0))
									this.addNote_2(this.parentEditorWin.getSelectedNoteVal(),keych);
								else
									if( keych >= Character.codePointAt("1",0) && keych <= Character.codePointAt("8",0))
										this.parentEditorWin.selectNVButton((( keych - Character.codePointAt("1",0)) | 0));
									else
										if( k.getKeyCode() == KeyEvent.VK_6 && k.isShiftDown())
											this.parentEditorWin.toggleFlaggedSemiminima();

								break;
							}
						}

		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					this.parentEditorWin.handleRuntimeError(e);
				}

			else
				throw e;

		}
	}

	/*                addLacuna(NoteEvent.getTypeLength(parentEditorWin.getSelectedNoteVal(),
                          getCurMensInfo()));*/
	/* TMP: show analysis */
	//System.out;
	/* move between events within a multi-event */
	/* German keyboard */
	/* ------------------------ ONE ITEM HIGHLIGHTED ------------------------ */
	/* highlighted event */
	/* cursor movement */
	/*              else if (he.geteventtype()==Event.EVENT_DOT)
                modifyDotLocation(1);
              else if (he.geteventtype()==Event.EVENT_REST)
                modifyRestLocation(1);
              else if (he.geteventtype()==Event.EVENT_MENS)
                modifyMensLocation(1);
              else if (he.geteventtype()==Event.EVENT_ANNOTATIONTEXT)
                modifyAnnotationLocation(1);*/
	/*              else if (he.geteventtype()==Event.EVENT_DOT)
                modifyDotLocation(-1);
              else if (he.geteventtype()==Event.EVENT_REST)
                modifyRestLocation(-1);
              else if (he.geteventtype()==Event.EVENT_CLEF)
                modifyClefLocation(-1);
              else if (he.geteventtype()==Event.EVENT_MENS)
                modifyMensLocation(-1);
              else if (he.geteventtype()==Event.EVENT_ANNOTATIONTEXT)
                modifyAnnotationLocation(-1);*/
	/* delete event */
	/* modify event */
	/* French keyboards */
	/* German */
	/* German keyboard */
	/* --------------------- MULTIPLE ITEMS HIGHLIGHTED --------------------- */
	/* multiple items highlighted */
	/* first highlighted event */
	/* German */
	/* cursor movement */
	/* delete event */
	/* ------------------------ NO ITEMS HIGHLIGHTED ------------------------ */
	/* debugging */
	/* cursor movement */
	/* delete event */
	/* add events */
	/*          case KeyEvent.VK_OPEN_BRACKET:
            addEllipsis();
            break;*/
	/* repeat pitch of last note */
	/* add note/change attributes */
	/* empty KeyListener methods */
	public keyReleased(e:KeyEvent):void
	{
	}

	public keyTyped(e:KeyEvent):void
	{
	}
	/* mouse attributes */
	mouseButtonDown:boolean = false;
	/*------------------------------------------------------------------------
Method:     void mousePressed(MouseEvent e)
Implements: MouseListener.mousePressed
Purpose:    Handle mouse click on canvas
Parameters:
  Input:  MouseEvent e - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	focusingEvent:MouseEvent = null;

	public mousePressed(e:MouseEvent):void
	{
		if( e.isMetaDown())
			this.doRightClick(e);
		else
			switch( e.getButton())
			{
				case MouseEvent.BUTTON1:
				{
					this.doLeftClick(e);
					break;
				}
				case MouseEvent.BUTTON2:
				{
				}
				case MouseEvent.BUTTON3:
				{
					this.doRightClick(e);
					break;
				}
			}

	}

	public doLeftClick(e:MouseEvent):void
	{
		this.showCursor();
		if( e.isShiftDown())
			{
				let newvnum:number = this.Cursor.getVoiceNum();
				let newsnum:number = this.calcSectionNum(e.getX());
				let newevnum:number = this.calcHLEventnum(newsnum,newvnum,e.getX());
				let cursnum:number = this.Cursor.getSectionNum();
				let curevnum:number = this.Cursor.getEventNum();
				if( newsnum < cursnum)
					newevnum = 0;

				if( newsnum > cursnum)
					newevnum =(( this.renderedSections[cursnum].eventinfo[newvnum].size() - 1) | 0);

				if( newevnum < 0)
					newevnum = 0;

				if( this.Cursor.getHighlightBegin() == - 1 && newevnum != curevnum)
					{
						this.hl_anchor = this.Cursor.getEventNum();
						this.highlightItems(cursnum,newvnum,Math.min(curevnum,newevnum),(( Math.max(curevnum,newevnum) - 1) | 0));
					}

				else
					if( this.Cursor.getHighlightBegin() != - 1)
						if( newsnum == cursnum && newevnum == this.hl_anchor)
							this.moveCursor(newsnum,newvnum,newevnum);
						else
							this.highlightItems(cursnum,newvnum,Math.min(this.hl_anchor,newevnum),(( Math.max(this.hl_anchor,newevnum) - 1) | 0));

			}

		if( ! this.focused)
			{
				this.focusingEvent = e;
				this.requestFocusInWindow();
				this.Cursor.showCursor();
				this.repaint();
			}

		if( ! e.isShiftDown())
			this.newCursorLoc(e.getX(),e.getY());

		this.mouseButtonDown = true;
	}

	/* highlight events */
	/* remove highlight */
	public doRightClick(e:MouseEvent):void
	{
		let x:number = e.getX();
		let y:number = e.getY();
		let newSNum:number = this.calcSectionNum(x);
		let newVNum:number = this.calcVNum(newSNum,y);
		let newEventnum:number = this.calcEventnum(newSNum,newVNum,x);
		this.showVariants_1(newSNum,newVNum,newEventnum,e.getXOnScreen(),e.getYOnScreen());
	}

	/*------------------------------------------------------------------------
Method:     void mouseReleased(MouseEvent e)
Implements: MouseListener.mouseReleased
Purpose:    Handle mouse button release
Parameters:
  Input:  MouseEvent e - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public mouseReleased(e:MouseEvent):void
	{
		this.mouseButtonDown = false;
	}

	/*------------------------------------------------------------------------
Method:     void mouseDragged(MouseEvent e)
Implements: MouseMotionListener.mouseDragged
Purpose:    Handle mouse drag
Parameters:
  Input:  MouseEvent e - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public mouseDragged(e:MouseEvent):void
	{
		if( ! this.mouseButtonDown)
			return;

		let newvnum:number = this.Cursor.getVoiceNum();
		let newsnum:number = this.calcSectionNum(e.getX());
		let newevnum:number = this.calcHLEventnum(newsnum,newvnum,e.getX());
		let cursnum:number = this.Cursor.getSectionNum();
		let curevnum:number = this.Cursor.getEventNum();
		if( newsnum < cursnum)
			newevnum = 0;

		if( newsnum > cursnum)
			newevnum =(( this.renderedSections[cursnum].eventinfo[newvnum].size() - 1) | 0);

		if( newevnum < 0)
			newevnum = 0;

		if( this.Cursor.getHighlightBegin() == - 1)
			{
				this.hl_anchor = this.Cursor.getEventNum();
				if( newevnum > this.Cursor.getEventNum())
					this.highlightItems(cursnum,newvnum,this.Cursor.getEventNum(),(( newevnum - 1) | 0));
				else
					if( newevnum < this.Cursor.getEventNum())
						this.highlightItems(cursnum,newvnum,newevnum,(( this.Cursor.getEventNum() - 1) | 0));

			}

		else
			{
				if( newevnum == this.hl_anchor)
					this.moveCursor(cursnum,newvnum,newevnum);
				else
					if( newevnum < this.hl_anchor)
						this.highlightItems(cursnum,newvnum,newevnum,(( this.hl_anchor - 1) | 0));
					else
						this.highlightItems(cursnum,newvnum,this.hl_anchor,(( newevnum - 1) | 0));

			}

	}

	/* create new highlight */
	/* modify existing highlight */
	/* remove highlight */
	/* newevnum>hl_anchor */
	/* empty Mouse*Listener methods */
	public mouseEntered(e:MouseEvent):void
	{
	}

	public mouseExited(e:MouseEvent):void
	{
	}

	public mouseClicked(e:MouseEvent):void
	{
	}

	public mouseMoved(e:MouseEvent):void
	{
	}

	/*------------------------------------------------------------------------
Methods:    void focus[Gained|Lost](FocusEvent e)
Implements: FocusListener.focus[Gained|Lost]
Purpose:    Take action when keyboard focus is gained or lost
Parameters:
  Input:  FocusEvent e - event to handle
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public focusGained(e:FocusEvent):void
	{
		this.focused = true;
		if( this.parentwin.rerendermusic)
			this.rerender_1();

		if( this.focusingEvent != null)
			{
				this.mousePressed(this.focusingEvent);
				this.mouseReleased(null);
				this.focusingEvent = null;
			}

		this.Cursor.showCursor();
	}

	public focusLost(e:FocusEvent):void
	{
		this.Cursor.hideCursor();
		this.focused = false;
	}

	/*------------------------------------------------------------------------
Method:  void stopThreads()
Purpose: Stop any timer threads associated with this object
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public stopThreads():void
	{
		this.Cursor_Timer.stop();
	}

	/*------------------------------------------------------------------------
Method:    void movedisplay(int newmeasure)
Overrides: ViewCanvas.movedisplay
Purpose:   Move display to a new measure location
Parameters:
  Input:  int newmeasure - leftmost measure of new display location
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public movedisplay_1(newmeasure:number):void
	{
		this.Cursor.hideCursor();
		super.movedisplay_1(newmeasure);
		this.Cursor.showCursor();
	}

	/*------------------------------------------------------------------------
Method:  void newViewScale()
Overrides: ViewCanvas.newViewScale
Purpose: Update graphics when scale has changed
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public newViewScale_1():void
	{
		this.Cursor.hideCursor();
		super.newViewScale_1();
		this.Cursor.showCursor();
	}

	/*------------------------------------------------------------------------
Method:    void newY(int newystart)
Overrides: ViewCanvas.newY
Purpose:   Change y position of viewport
Parameters:
  Input:  int newystart - new value for VIEWYSTART
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public newY_1(newystart:number):void
	{
		this.Cursor.hideCursor();
		super.newY_1(newystart);
		this.Cursor.showCursor();
	}

	/*------------------------------------------------------------------------
Method:    void drawEndBarline(Graphics2D g,int xloc)
Overrides: Gfx.ViewCanvas.drawEndBarline
Purpose:   Draw score ending (don't break off staves in editor view)
Parameters:
  Input:  Graphics2D g - graphical context
          int xloc   - x location for barline
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public drawEndBarline_2(g:Graphics2D,xloc:number):void
	{
	}

	/*------------------------------------------------------------------------
Method:  void drawHighlightedEvents(Graphics2D g,int snum,int vnum,int firstenum,int lastenum)
Purpose: Paint events in highlighted color
Parameters:
  Input:  Graphics2D g           - graphical context
          int snum,vnum          - section/voice number
          int firstenum,lastenum - indices of first and last events to be highlighted
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public drawHighlightedEvents(g:Graphics2D,snum:number,vnum:number,firstenum:number,lastenum:number):void
	{
		let leftMeasure:MeasureInfo = this.getMeasure(this.curmeasure);
		let evloc:number;
		let xloc:number;
		let leftMeasureX:number = this.getMeasureX(this.curmeasure);
		let e:RenderedEvent;
		let done:boolean;
		evloc = snum == this.leftRendererNum ? leftMeasure.reventindex[vnum]:0;
		if( snum > this.leftRendererNum || firstenum > evloc)
			evloc = firstenum;

		done = this.leftRendererNum > snum || evloc >= this.renderedSections[snum].eventinfo[vnum].size() || evloc > lastenum;
		e = this.renderedSections[snum].eventinfo[vnum].getEvent(evloc);
		if( ! done && e.getEvent_1().geteventtype() == Event.EVENT_MULTIEVENT && firstenum == lastenum)
			{
				let mei:number = this.Cursor.getMultiEventHLindex();
				if( mei != - 1)
					{
						xloc = this.XLEFT +( this.renderedSections[snum].getEventXLoc(vnum,evloc) - leftMeasureX) * this.VIEWSCALE;
						e.getEvent_2(mei).drawHighlighted(g,this.MusicGfx,this,<number> xloc,this.YTOP +(( vnum *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) * this.VIEWSCALE,this.VIEWSCALE);
						done = true;
					}

			}

		while( ! done)
		{
			e = this.renderedSections[snum].eventinfo[vnum].getEvent(evloc);
			xloc = this.XLEFT +( this.renderedSections[snum].getEventXLoc(vnum,evloc) - leftMeasureX) * this.VIEWSCALE;
			if( xloc < this.viewsize.width)
				{
					if( xloc >= this.XLEFT && e.isdisplayed())
						e.drawHighlighted(g,this.MusicGfx,this,<number> xloc,this.YTOP +(( vnum *((( this.STAFFSCALE * this.STAFFSPACING) | 0))) | 0) * this.VIEWSCALE,this.VIEWSCALE);

					evloc ++;
					if( evloc >= this.renderedSections[snum].eventinfo[vnum].size() || evloc > lastenum)
						done = true;

				}

			else
				done = true;

		}
	}

	/* highlight only one event within a multi-event? */
	/* draw event */
	/*------------------------------------------------------------------------
Method:    void unregisterListeners()
Overrides: Gfx.ViewCanvas.unregisterListeners
Purpose:   Remove all action/item/etc listeners when disposing of resources
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public unregisterListeners_1():void
	{
		this.removeKeyListener(this);
		this.removeMouseListener(this);
		this.removeMouseMotionListener(this);
		this.removeFocusListener(this);
	}
}

/*------------------------------------------------------------------------
Class:   EditorCursor
Extends: -
Purpose: Handles cursor data and thread-safe display
------------------------------------------------------------------------*/
export class EditorCursor
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	private canvas:ScoreEditorCanvas;
	private sectionNum:number;
	private voiceNum:number;
	private eventnum:number;
	/* voice number, event number */
	private measurenum:number;
	private score_xloc:number;
	private canvas_xloc:number;
	private highlight_begin:number;
	private highlight_end:number;
	/* highlighted event indices:
                                                    -1 for no highlighting */
	private multiEventHLindex:number;
	/* index of single highlighted
                                                    event within a MultiEvent */
	private visible:boolean;
	/* currently showing? */
	private hidden:boolean;
	/* turned off for redraws etc.? */
	/* number of times canvas has been redrawn (for checking whether cursor
     has been overwritten) */
	private lastredisplaynum:number;
	/*----------------------------------------------------------------------*/
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: EditorCursor(ScoreEditorCanvas sec)
Purpose:     Initialize cursor
Parameters:
  Input:  ScoreEditorCanvas sec - canvas on which cursor is displayed
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(sec:ScoreEditorCanvas)
	{
		this.canvas = sec;
		this.sectionNum = 0;
		this.voiceNum = this.canvas.getMusicData_1().getSection(this.sectionNum).getValidVoicenum(0);
		this.eventnum = 0;
		this.measurenum = 0;
		this.score_xloc =( this.canvas_xloc = - 1);
		this.highlight_begin = - 1;
		this.multiEventHLindex = - 1;
		this.visible = false;
		this.hidden = true;
		this.lastredisplaynum = this.canvas.num_redisplays;
	}

	/* cursor display must be turned on explicitly */
	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getLocation():Point
	{
		return new Point(<number> Math.round(this.calcCursorX()),<number> Math.round(this.calcCursorYTop_2()));
	}

	public getSectionNum():number
	{
		return this.sectionNum;
	}

	public getVoiceNum():number
	{
		return this.voiceNum;
	}

	public getEventNum():number
	{
		return this.eventnum;
	}

	public getCanvasXloc():number
	{
		return this.canvas_xloc;
	}

	public isHidden():boolean
	{
		return this.hidden;
	}

	public getHighlightBegin():number
	{
		return this.highlight_begin;
	}

	public getHighlightEnd():number
	{
		return this.highlight_end;
	}

	public oneItemHighlighted():boolean
	{
		return this.highlight_begin != - 1 && this.highlight_begin == this.highlight_end;
	}

	public getMultiEventHLindex():number
	{
		return this.multiEventHLindex;
	}

	/*------------------------------------------------------------------------
Methods: set*()
Purpose: Routines to set attribute variables
Parameters:
  Input:  new attribute values
  Output: -
  Return: -
------------------------------------------------------------------------*/
	/* should only be called when cursor is hidden, about to be recalculated */
	public setSectionNum(i:number):void
	{
		this.sectionNum = i;
	}

	public setVoicenum(i:number):void
	{
		this.voiceNum = i;
	}

	public setEventNum(i:number):void
	{
		this.eventnum = i;
	}

	public resetMultiEventHLindex():void
	{
		this.multiEventHLindex = - 1;
	}

	/*------------------------------------------------------------------------
Methods: calc*()
Purpose: Routines to calculate drawing parameters
Parameters:
  Input:  -
  Output: -
  Return: parameters
------------------------------------------------------------------------*/
	calcCursorX():number
	{
		return this.canvas_xloc + 2 * this.canvas.VIEWSCALE;
	}

	calcCursorYTop_1(vn:number):number
	{
		return this.canvas.YTOP +((((((( vn * this.canvas.STAFFSCALE) | 0) * this.canvas.STAFFSPACING) | 0) - this.canvas.STAFFSCALE) | 0)) * this.canvas.VIEWSCALE;
	}

	calcCursorYTop_2():number
	{
		return this.calcCursorYTop_1(this.voiceNum);
	}

	calcCursorYSize():number
	{
		return(( this.canvas.STAFFSCALE * 6) | 0) * this.canvas.VIEWSCALE;
	}

	/*------------------------------------------------------------------------
Method:  void hideCursor()
Purpose: Disable cursor display
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public hideCursor():void
	{
		while( this.visible)
		this.toggleCursor();
		this.hidden = true;
	}

	/*------------------------------------------------------------------------
Method:  void showCursor()
Purpose: Enable cursor display
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public showCursor():void
	{
		if( ! this.canvas.focused)
			return;

		this.hidden = false;
		if( this.visible)
			return;

		this.calc_xlocs();
		this.visible = false;
		this.toggleCursor();
	}

	/*------------------------------------------------------------------------
Method:  void toggleCursor()
Purpose: Draw or erase cursor at current location
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public toggleCursor():void
	{
		if( this.hidden || this.canvas.repaintingbuffer > 0 || this.offScreenX() || this.highlight_begin != - 1)
			{
				this.visible = false;
				return;
			}

		if( this.canvas.num_redisplays != this.lastredisplaynum)
			this.visible = false;

		let g:Graphics2D = this.canvas.getbufferg2d();
		g.setColor(Color.black);
		g.setXORMode(Color.white);
		g.fillRect(<number> Math.round(this.calcCursorX()),<number> Math.round(this.calcCursorYTop_2()),Math.round(2 * this.canvas.VIEWSCALE),<number> Math.round(this.calcCursorYSize()));
		g.setPaintMode();
		this.visible = ! this.visible;
		this.canvas.repaint(<number> Math.round(this.calcCursorX()),<number> Math.round(this.calcCursorYTop_2() - this.canvas.VIEWYSTART),Math.round(2 * this.canvas.VIEWSCALE),<number> Math.round(this.calcCursorYSize()));
		this.lastredisplaynum = this.canvas.num_redisplays;
	}
	/* cursor has been overdrawn by buffer repainting */
	/* now display */
	/*------------------------------------------------------------------------
Method:  void paintHighlight(Graphics2D g[,int diff_begin,int diff_end])
Purpose: Graphically highlight events
Parameters:
  Input:  Graphics2D g            - graphical context for painting highlight
          int diff_begin,diff_end - boundaries of currently painted highlight
                                    (for painting only the difference)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	highlightVisible:boolean = false;

	paintHighlight_1(g:Graphics2D):void
	{
		if( this.highlight_begin == - 1)
			return;

		let leftx:number = this.calcevleftx(this.sectionNum,this.voiceNum,this.highlight_begin);
		let rightx:number = this.calcevrightx(this.sectionNum,this.voiceNum,this.highlight_end);
		let ytop:number = this.calcCursorYTop_2();
		let ysize:number = this.calcCursorYSize();
		this.drawHL(g,leftx,rightx,ytop,ysize);
		if( ! this.highlightVisible)
			this.canvas.drawHighlightedEvents(g,this.sectionNum,this.voiceNum,this.highlight_begin,this.highlight_end);
		else
			this.canvas.parentwin.updatemusicgfx = true;

		this.canvas.repaint();
		this.highlightVisible = ! this.highlightVisible;
	}

	/* nothing is highlighted */
	/* calculate left and right screen coordinates of highlighted area */
	//    canvas.repaint(leftx,ytop,rightx-leftx,ysize);
	paintHighlight_2(g:Graphics2D,diff_begin:number,diff_end:number):void
	{
		let newleftx:number = this.calcevleftx(this.sectionNum,this.voiceNum,this.highlight_begin);
		let newrightx:number = this.calcevrightx(this.sectionNum,this.voiceNum,this.highlight_end);
		let diffleftx:number = this.calcevleftx(this.sectionNum,this.voiceNum,diff_begin);
		let diffrightx:number = this.calcevrightx(this.sectionNum,this.voiceNum,diff_end);
		let leftx1:number = Math.min(newleftx,diffleftx);
		let leftx2:number = Math.max(newleftx,diffleftx);
		let rightx1:number = Math.min(newrightx,diffrightx);
		let rightx2:number = Math.max(newrightx,diffrightx);
		let ytop:number = this.calcCursorYTop_2();
		let ysize:number = this.calcCursorYSize();
		this.drawHL(g,leftx1,leftx2,ytop,ysize);
		this.drawHL(g,rightx1,rightx2,ytop,ysize);
		this.canvas.parentwin.updatemusicgfx = true;
		this.canvas.repaint();
	}

	/* calculate left and right screen coordinates of highlighted area */
	/* draw difference between old and new highlights */
	//    canvas.drawHighlightedEvents(g,voiceNum,highlight_begin,highlight_end);
	//    canvas.repaint(leftx1,ytop,rightx2-leftx1,ysize);
	public repaintHighlight(g:Graphics2D):void
	{
		this.highlightVisible = false;
		this.paintHighlight_1(g);
	}

	/*------------------------------------------------------------------------
Method:  void drawHL(Graphics2D g,double leftx,double rightx,double ytop,double ysize)
Purpose: Draw one highlight rectangle
Parameters:
  Input:  Graphics2D g        - graphical context for painting highlight
          double leftx,rightx - x bounds
          double ytop,ysize   - y bounds
  Output: -
  Return: -
------------------------------------------------------------------------*/
	drawHL(g:Graphics2D,leftx:number,rightx:number,ytop:number,ysize:number):void
	{
		g.setColor(Color.black);
		g.setXORMode(Color.white);
		g.fillRect(<number> Math.round(leftx),<number> Math.round(ytop),<number> Math.round(rightx - leftx),<number> Math.round(ysize));
		g.setPaintMode();
	}

	/*------------------------------------------------------------------------
Method:  void highlightEvents(int sn,int vn,int firstenum,int lastenum)
Purpose: Highlight one or more events
Parameters:
  Input:  int sn,vn              - section/voice number
          int firstenum,lastenum - indices of first and last events to be highlighted
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public highlightEvents(snum:number,vnum:number,firstenum:number,lastenum:number):void
	{
		if( this.canvas.renderedSections[snum].eventinfo[vnum].size() <= 1)
			return;

		if( this.visible)
			this.toggleCursor();

		let curhl_begin:number = this.highlight_begin;
		let curhl_end:number = this.highlight_end;
		this.highlight_begin = firstenum;
		this.highlight_end = lastenum;
		this.sectionNum = snum;
		this.voiceNum = vnum;
		this.eventnum = this.highlight_begin;
		this.measurenum = this.canvas.renderedSections[snum].eventinfo[vnum].getEvent(this.eventnum).getmeasurenum();
		this.calc_xlocs();
		this.hidden = false;
		if( curhl_begin != this.highlight_begin || curhl_end != this.highlight_end)
			this.multiEventHLindex = - 1;

		let g:Graphics2D = this.canvas.getbufferg2d();
		if( curhl_begin == - 1)
			this.paintHighlight_1(g);
		else
			this.paintHighlight_2(g,curhl_begin,curhl_end);

		if( this.offScreenX())
			this.canvas.parentwin.gotomeasure(this.chooseNewMeasureNum());

	}

	/* no events to highlight */
	/* save current highlight information */
	/* change highlight and draw */
	/* reset multi-event highlight */
	/* create new highlight */
	/* paint difference between old and new highlights */
	/*------------------------------------------------------------------------
Method:  void shiftHighlightWithinMultiEvent(int offset)
Purpose: Attempt to shift cursor position within multi-event
Parameters:
  Input:  int offset - number of events to shift
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public shiftHighlightWithinMultiEvent(offset:number):void
	{
		let me:MultiEvent =<MultiEvent> this.canvas.renderedSections[this.sectionNum].eventinfo[this.voiceNum].getEvent(this.eventnum).getEvent_1();
		this.multiEventHLindex += offset;
		if( this.multiEventHLindex < 0)
			this.multiEventHLindex =(( me.getNumEvents() - 1) | 0);
		else
			if( this.multiEventHLindex >= me.getNumEvents())
				this.multiEventHLindex = 0;

		this.canvas.parentwin.updatemusicgfx = true;
		this.canvas.repaint();
	}

	/*------------------------------------------------------------------------
Method:  double calcev[left|right]x(int sn,int vn,int en)
Purpose: Calculate left or right coordinate of one event
Parameters:
  Input:  int sn,vn - section/voice number
          int en    - event number
  Output: -
  Return: left or right x-value
------------------------------------------------------------------------*/
	calcevleftx(sn:number,vn:number,en:number):number
	{
		let leftMeasureX:number = this.canvas.getMeasureX(this.canvas.curmeasure);
		let ex:number = this.canvas.renderedSections[sn].getEventXLoc(vn,en);
		let leftx:number = this.canvas.XLEFT +((( ex - leftMeasureX + 5) | 0)) * this.canvas.VIEWSCALE;
		if( leftx < this.canvas.XLEFT)
			leftx = this.canvas.XLEFT;

		return leftx;
	}

	calcevrightx(sn:number,vn:number,en:number):number
	{
		let leftMeasureX:number = this.canvas.getMeasureX(this.canvas.curmeasure);
		let ex:number = this.canvas.renderedSections[sn].getEventXLoc(vn,en);
		let e:RenderedEvent = this.canvas.renderedSections[sn].eventinfo[vn].getEvent(en);
		let rightx:number = this.canvas.XLEFT +((( ex - leftMeasureX + e.getrenderedxsize() + 1) | 0)) * this.canvas.VIEWSCALE;
		if( rightx >= this.canvas.viewsize.width)
			rightx = this.canvas.viewsize.width;

		return rightx;
	}

	/*------------------------------------------------------------------------
Method:  void setNoHighlight()
Purpose: Remove highlight (without repainting)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setNoHighlight():void
	{
		this.highlight_begin = - 1;
	}

	/*------------------------------------------------------------------------
Method:  void shiftCursorLoc(int xs,int vs)
Purpose: Attempt to shift cursor position
Parameters:
  Input:  int xs - number of events to go left/right
          int vs - number of voices to go up/down
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public shiftCursorLoc(xs:number,vs:number):void
	{
		if( this.hidden)
			return;

		let newsnum:number;
		let newvnum:number;
		let neweventnum:number;
		for(
		newvnum =(( this.voiceNum + vs) | 0);newvnum > 0 && newvnum < this.canvas.getCurSection().getNumVoices_1() && this.canvas.getCurSection().getVoice_1(newvnum) == null;newvnum += vs)
		;
		if( this.highlight_begin == - 1)
			neweventnum =(( this.eventnum + xs) | 0);
		else
			neweventnum = xs > 0 ?(( this.highlight_end + xs) | 0):this.highlight_begin;

		if( newvnum < 0 || newvnum >= this.canvas.getCurSection().getNumVoices_1())
			return;

		if( vs != 0)
			{
				if( this.offScreenX())
					this.canvas.parentwin.gotomeasure(this.chooseNewMeasureNum());

				this.newCursorLoc(this.canvas_xloc,Math.round(this.canvas.YTOP - this.canvas.VIEWYSTART +((((( newvnum * this.canvas.STAFFSCALE) | 0) * this.canvas.STAFFSPACING) | 0)) * this.canvas.VIEWSCALE));
				return;
			}

		newsnum = this.sectionNum;
		if( neweventnum < 0)
			if( this.sectionNum == 0)
				neweventnum = 0;
			else
				{
					newsnum --;
					newvnum = this.canvas.renderedSections[newsnum].getSectionData().getValidVoicenum(newvnum);
					neweventnum =(( this.canvas.renderedSections[newsnum].eventinfo[newvnum].size() - 1) | 0);
				}

		if( neweventnum >= this.canvas.renderedSections[newsnum].eventinfo[newvnum].size())
			if( this.sectionNum ==(( this.canvas.numSections - 1) | 0))
				neweventnum =(( this.canvas.renderedSections[newsnum].eventinfo[newvnum].size() - 1) | 0);
			else
				{
					newsnum ++;
					newvnum = this.canvas.renderedSections[newsnum].getSectionData().getValidVoicenum(newvnum);
					neweventnum = 0;
				}

		if( xs < 0)
			while( neweventnum > 0 && ! this.canvas.renderedSections[newsnum].eventinfo[newvnum].getEvent(neweventnum).isdisplayed())
			neweventnum --;
		else
			if( xs > 0)
				while( neweventnum < this.canvas.renderedSections[newsnum].eventinfo[newvnum].size() && ! this.canvas.renderedSections[newsnum].eventinfo[newvnum].getEvent(neweventnum).isdisplayed())
				neweventnum ++;

		this.moveCursor(newsnum,newvnum,neweventnum);
	}

	/* deal with shift in voice number */
	/* deal with shift in event number */
	/* don't position cursor at undisplayed events (e.g., clefs which have been
       replaced for display) */
	/*------------------------------------------------------------------------
Method:  void modifyHighlight(int xs)
Purpose: Attempt to expand or contract highlight
Parameters:
  Input:  int xs - number of events to expand/contract left/right
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public modifyHighlight(xs:number):void
	{
		let neweventnum:number;
		if( this.highlight_begin == - 1)
			{
				neweventnum =(( this.eventnum + xs) | 0);
				if( neweventnum < 0 || neweventnum >= this.canvas.renderedSections[this.sectionNum].eventinfo[this.voiceNum].size())
					return;

				this.canvas.setHLAnchor(this.eventnum);
				this.highlightEvents(this.sectionNum,this.voiceNum,Math.min(this.eventnum,neweventnum),(( Math.max(this.eventnum,neweventnum) - 1) | 0));
			}

		else
			{
				let hl_anchor:number = this.canvas.getHLAnchor();
				if( this.highlight_begin >= hl_anchor)
					neweventnum =(((( this.highlight_end + xs) | 0) + 1) | 0);
				else
					neweventnum =(( this.highlight_begin + xs) | 0);

				if( neweventnum < 0)
					neweventnum = 0;

				if( neweventnum >= this.canvas.renderedSections[this.sectionNum].eventinfo[this.voiceNum].size())
					neweventnum =(( this.canvas.renderedSections[this.sectionNum].eventinfo[this.voiceNum].size() - 1) | 0);

				if( neweventnum == hl_anchor)
					{
						this.moveCursor(this.sectionNum,this.voiceNum,neweventnum);
						return;
					}

				this.highlightEvents(this.sectionNum,this.voiceNum,Math.min(hl_anchor,neweventnum),(( Math.max(hl_anchor,neweventnum) - 1) | 0));
			}

	}

	/* remove highlight */
	/*------------------------------------------------------------------------
Method:  void newCursorLoc(int x,int y)
Purpose: Attempt to move cursor to a given XY position in canvas
Parameters:
  Input:  int x - desired x position
          int y - desired y position
  Output: -
  Return: -
------------------------------------------------------------------------*/
	newCursorLoc(x:number,y:number):void
	{
		if( this.hidden)
			return;

		let newsnum:number = this.canvas.calcSectionNum(x);
		let newvnum:number = this.canvas.calcVNum(newsnum,y);
		let neweventnum:number = this.canvas.calcEventnum(newsnum,newvnum,x);
		this.moveCursor(newsnum,newvnum,neweventnum);
	}

	/*------------------------------------------------------------------------
Method:  void moveCursor(int newsnum,int newvnum,int neweventnum)
Purpose: Move cursor to a new position and display
Parameters:
  Input:  int newsnum,newvnum,neweventnum - new cursor parameters
  Output: -
  Return: -
------------------------------------------------------------------------*/
	moveCursor(newsnum:number,newvnum:number,neweventnum:number):void
	{
		this.hideCursor();
		if( this.highlight_begin != - 1)
			{
				this.paintHighlight_1(this.canvas.getbufferg2d());
				this.highlight_begin = - 1;
			}

		this.sectionNum = newsnum;
		this.voiceNum = newvnum;
		this.eventnum = neweventnum;
		if( this.sectionNum >= this.canvas.renderedSections.length)
			this.sectionNum =(( this.canvas.renderedSections.length - 1) | 0);

		while( this.voiceNum >= 0 && this.canvas.renderedSections[this.sectionNum].eventinfo[this.voiceNum]== null)
		this.voiceNum --;
		if( this.voiceNum < 0)
			{
				this.voiceNum =(( newvnum + 1) | 0);
				while( this.voiceNum < this.canvas.renderedSections[this.sectionNum].eventinfo.length && this.canvas.renderedSections[this.sectionNum].eventinfo[this.voiceNum]== null)
				this.voiceNum ++;
			}

		if( this.eventnum >= this.canvas.renderedSections[this.sectionNum].eventinfo[this.voiceNum].size())
			this.eventnum =(( this.canvas.renderedSections[this.sectionNum].eventinfo[this.voiceNum].size() - 1) | 0);

		this.measurenum = this.canvas.renderedSections[this.sectionNum].eventinfo[this.voiceNum].getEvent(this.eventnum).getmeasurenum();
		this.calc_xlocs();
		this.canvas.parentEditorWin.setSectionNum_2(this.sectionNum);
		let osx:boolean = this.offScreenX();
		let osy:boolean = this.offScreenY();
		if( osx)
			this.canvas.parentwin.gotomeasure(this.chooseNewMeasureNum());

		if( osy)
			this.canvas.parentwin.gotoHeight(this.choose_newHeight());

		if( !( osx || osy))
			this.showCursor();

	}

	/* unhighlight events */
	/* ensure a valid location */
	/*------------------------------------------------------------------------
Method:  void calc_xlocs()
Purpose: Calculate x-location of cursor on canvas and score, based on
         location in notation
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	calc_xlocs():void
	{
		this.score_xloc =((<number> this.canvas.renderedSections[this.sectionNum].getEventXLoc(this.voiceNum,this.eventnum) + 1) | 0);
		this.canvas_xloc = Math.round(this.canvas.XLEFT +<number>( this.score_xloc - this.canvas.getMeasureX(this.canvas.curmeasure)) * this.canvas.VIEWSCALE);
	}

	/*------------------------------------------------------------------------
Method:  boolean offScreenX()
Purpose: Check whether cursor is out of visible display area (horizontal)
Parameters:
  Input:  -
  Output: -
  Return: whether cursor is off-screen
------------------------------------------------------------------------*/
	offScreenX():boolean
	{
		let scrollXLEFT:number = this.canvas.XLEFT;
		let curEventOff:boolean = this.canvas_xloc < scrollXLEFT || this.canvas_xloc >= this.canvas.viewsize.width - 5 * this.canvas.VIEWSCALE;
		if( this.highlight_begin == - 1 || this.highlight_begin == this.highlight_end)
			return curEventOff;
		else
			{
				if( ! curEventOff)
					return false;

				let right_xloc:number =<number>( this.canvas.renderedSections[this.sectionNum].getEventXLoc(this.voiceNum,this.highlight_end) + 1) * this.canvas.VIEWSCALE;
				let right_canvas_xloc:number = this.canvas.XLEFT +<number>( right_xloc - this.canvas.getMeasureX(this.canvas.curmeasure)) * this.canvas.VIEWSCALE;
				return right_canvas_xloc < scrollXLEFT || right_canvas_xloc >= this.canvas.viewsize.width - 5 * this.canvas.VIEWSCALE;
			}

	}

	//canvas.curmeasure>0 ? canvas.XLEFT+leftmeasure.xlength : canvas.XLEFT;
	/* single event */
	/* multiple highlighted events */
	/* left side of highlight is offscreen; is right? */
	/*------------------------------------------------------------------------
Method:  boolean offScreenY()
Purpose: Check whether cursor is out of visible display area (vertical)
Parameters:
  Input:  -
  Output: -
  Return: whether cursor is off-screen
------------------------------------------------------------------------*/
	offScreenY():boolean
	{
		let ytop:number = this.calcCursorYTop_2();
		let ybottom:number = ytop + this.calcCursorYSize();
		if( Math.round(ybottom) > this.canvas.VIEWYSTART + this.canvas.screensize.height || Math.round(ytop) < this.canvas.VIEWYSTART)
			return true;

		return false;
	}

	/*------------------------------------------------------------------------
Method:  int chooseNewMeasureNum()
Purpose: Choose new measure for display, in order to return to current
         cursor location
Parameters:
  Input:  -
  Output: -
  Return: new measure number to go to
------------------------------------------------------------------------*/
	chooseNewMeasureNum():number
	{
		let newcursormnum:number = this.canvas.renderedSections[this.sectionNum].eventinfo[this.voiceNum].getEvent(this.eventnum).getmeasurenum();
		if( newcursormnum <= this.canvas.curmeasure)
			return newcursormnum > 0 ?(( newcursormnum - 1) | 0):0;

		let xspace_covered:number =<number> this.canvas.getMeasure(newcursormnum).xlength * this.canvas.VIEWSCALE;
		let leftmn:number =(( newcursormnum - 1) | 0);
		for(
		;leftmn >= 0 && xspace_covered < this.canvas.viewsize.width - 5 * this.canvas.VIEWSCALE - this.canvas.calcXLEFT((( leftmn + 1) | 0));leftmn --)
		xspace_covered += this.canvas.getMeasure(leftmn).xlength * this.canvas.VIEWSCALE;
		if( xspace_covered >= this.canvas.viewsize.width - 5 * this.canvas.VIEWSCALE - this.canvas.calcXLEFT((( leftmn + 1) | 0)))
			leftmn ++;

		let newLeftMeasureX:number = this.canvas.getMeasureX((( leftmn + 1) | 0));
		let new_canvas_xloc:number = this.canvas.calcXLEFT((( leftmn + 1) | 0)) +<number>( this.score_xloc - newLeftMeasureX) * this.canvas.VIEWSCALE;
		while( new_canvas_xloc >= this.canvas.viewsize.width - 5 * this.canvas.VIEWSCALE)
		{
			leftmn ++;
			newLeftMeasureX = this.canvas.getMeasureX((( leftmn + 1) | 0));
			new_canvas_xloc = this.canvas.calcXLEFT((( leftmn + 1) | 0)) +<number>( this.score_xloc - newLeftMeasureX) * this.canvas.VIEWSCALE;
		}
		return(( leftmn + 1) | 0);
	}

	/* to the left of the current display? put new measure near left; leave one
       measure buffer zone to avoid backspacing over offscreen events
       FIX: should this be modified so that there is always an event at the
       left? (i.e., skip back two measures for a Longa etc.) */
	/* otherwise put new measure at right side of screen */
	/* correct for cursor past measure end */
	/*------------------------------------------------------------------------
Method:  int choose_newHeight()
Purpose: Choose new y-value for display, in order to return to current
         cursor location
Parameters:
  Input:  -
  Output: -
  Return: new y-val to go to
------------------------------------------------------------------------*/
	choose_newHeight():number
	{
		let ytop:number = this.calcCursorYTop_2();
		let ybottom:number = ytop + this.calcCursorYSize();
		let newval:number = 0;
		if( Math.round(ybottom) > this.canvas.VIEWYSTART + this.canvas.screensize.height)
			newval = Math.round(this.calcCursorYTop_1((( this.voiceNum + 1) | 0))) - this.canvas.screensize.height;
		else
			if( Math.round(ytop) < this.canvas.VIEWYSTART)
				if( this.voiceNum == 0)
					newval = 0;
				else
					newval = Math.round(ytop -(( this.canvas.STAFFSPACING * 3) | 0) * this.canvas.VIEWSCALE);

		if( Math.round(ybottom) > newval + this.canvas.screensize.height)
			newval = Math.round(ybottom) - this.canvas.screensize.height;

		if( Math.round(ytop) < newval)
			newval = Math.round(ytop);

		if( newval + this.canvas.screensize.height > this.canvas.viewsize.height)
			newval =(( this.canvas.viewsize.height - this.canvas.screensize.height) | 0);

		if( newval < 0)
			newval = 0;

		return<number> newval;
	}
}
