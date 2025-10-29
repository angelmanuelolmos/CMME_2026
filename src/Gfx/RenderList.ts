
import { System } from '../java/lang/System';
import { RenderParams } from './RenderParams';
import { RenderedEvent } from './RenderedEvent';
import { RenderedClefSet } from './RenderedClefSet';
import { OptionSet } from './OptionSet';
import { ArrayList } from '../java/util/ArrayList';
import { Coloration } from '../DataStruct/Coloration';
import { Event } from '../DataStruct/Event';
import { EventListData } from '../DataStruct/EventListData';
import { ModernKeySignature } from '../DataStruct/ModernKeySignature';
import { MusicSection } from '../DataStruct/MusicSection';
import { NoteEvent } from '../DataStruct/NoteEvent';
import { Proportion } from '../DataStruct/Proportion';
import { VariantMarkerEvent } from '../DataStruct/VariantMarkerEvent';
import { Voice } from '../DataStruct/Voice';
import { VoiceEventListData } from '../DataStruct/VoiceEventListData';

export class RenderList extends ArrayList<RenderedEvent>
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public totalxsize:number = 0;
	public options:OptionSet;
	voicedata:Voice;
	section:MusicSection;
	voiceEventData:VoiceEventListData;

	public static new0_2(o:OptionSet,v:Voice,section:MusicSection):RenderList
	{
		let _new0:RenderList = new RenderList;
		RenderList.set0_2(_new0,o,v,section);
		return _new0;
	}

	public static set0_2(new0:RenderList,o:OptionSet,v:Voice,section:MusicSection):void
	{
		new0.options = o;
		new0.voicedata = v;
		new0.voiceEventData = v == null ? null:section.getVoice_1((( v.getNum() - 1) | 0));
		new0.section = section;
	}

	public static new1_2(v:Voice,section:MusicSection):RenderList
	{
		let _new1:RenderList = new RenderList;
		RenderList.set1_2(_new1,v,section);
		return _new1;
	}

	public static set1_2(new1:RenderList,v:Voice,section:MusicSection):void
	{
		new1.options = OptionSet.makeDEFAULT_ORIGINAL(null);
		new1.voicedata = v;
		new1.section = section;
	}

	/*------------------------------------------------------------------------
Method:  RenderedEvent addevent(boolean display,Event e,RenderParams rp)
Purpose: Add event to list
Parameters:
  Input:  boolean display - whether to display event
          Event e         - event
          RenderParams rp - musical parameters at this score location
  Output: -
  Return: new event
------------------------------------------------------------------------*/
	public addevent_1(display:boolean,e:Event,rp:RenderParams):RenderedEvent
	{
		let newe:RenderedEvent = new RenderedEvent(display,e,rp,this.options);
		this.add(newe);
		return newe;
	}

	/*------------------------------------------------------------------------
Method:  int addlig(VoiceEventListData v,int firstevnum,RenderParams rp[,boolean varDisplay])
Purpose: Add ligature to list
Parameters:
  Input:  VoiceEventListData v - event list
          int evnum            - event list index of first note
          RenderParams rp      - musical parameters at this score location
          boolean varDisplay   - whether to stop at variant border
  Output: -
  Return: number of events in ligature
------------------------------------------------------------------------*/
	/* find next event in RenderList representing a NoteEvent */
	findnextnoteevent(i:number):RenderedEvent
	{
		for(
		;i < this.size();i ++)
		if( this.getEvent(i).getEvent_1().hasEventType_1(Event.EVENT_NOTE))
			return this.getEvent(i);

		return null;
	}

	public addlig_1(v:EventListData,evnum:number,rp:RenderParams):number
	{
		return this.addlig_2(v,evnum,rp,false);
	}

	public addlig_2(v:EventListData,evnum:number,rp:RenderParams,varDisplay:boolean):number
	{
		let e:Event = v.getEvent(evnum);
		let ne:NoteEvent =<NoteEvent> e.getFirstEventOfType_1(Event.EVENT_NOTE);
		let newe:RenderedEvent;
		let numeventsinlig:number = 0;
		if( ! ne.isligated())
			{
				System.err.println("!! ligature rendering error: attempting to render unligated note as ligature");
				ne.prettyprint_1();
			}

		let done:boolean = false;
		while( ! done)
		{
			newe = new RenderedEvent(true,e,rp,this.options);
			this.add(newe);
			numeventsinlig ++;
			ne =<NoteEvent> e.getFirstEventOfType_1(Event.EVENT_NOTE);
			if( ne != null && ! ne.isligated())
				done = true;

			e = v.getEvent(++ evnum);
			if( e == null ||( varDisplay && e instanceof VariantMarkerEvent))
				done = true;

		}
		let curligre:RenderedEvent;
		let lastne:RenderedEvent = null;
		let nextne:RenderedEvent = null;
		let cure:Event;
		for(
		let i:number =(( this.size() - numeventsinlig) | 0);i < this.size();i ++)
		{
			curligre = this.getEvent(i);
			cure = curligre.getEvent_1();
			ne =<NoteEvent> cure.getFirstEventOfType_1(Event.EVENT_NOTE);
			if( ne != null)
				{
					if( ne.isligated())
						nextne = this.findnextnoteevent((( i + 1) | 0));

					curligre.renderaslig(lastne,nextne);
					lastne = curligre;
				}

		}
		return numeventsinlig;
	}

	//        System.err.println("listplace="+e.getListPlace(v.isDefaultVersion())+" evnum="+evnum);
	//    if (e==null)
	//      return 0;
	/* now that ligature events have been rendered, redraw as ligature */
	/*------------------------------------------------------------------------
Method:  float drawclefset(int starti,boolean princOnly,
                           java.awt.Graphics2D g,MusicFont mf,
                           java.awt.image.ImageObserver ImO,
                           float xl,float yl,float VIEWSCALE)
Purpose: Draws multi-clef into given graphical context
Parameters:
  Input:  int starti        - index of first clef event
          boolean princOnly - whether to draw just principal clefs
          Graphics2D g      - graphical context for drawing
          MusicFont mf      - font for drawing symbols
          ImageObserver ImO - observer for drawImage
          float xl,yl       - location in context to draw event
          float VIEWSCALE   - scaling factor
  Output: -
  Return: x size of total clef set
------------------------------------------------------------------------*/
	/*
  public float drawclefset(int starti,boolean princOnly,
                           java.awt.Graphics2D g,MusicFont mf,
                           java.awt.image.ImageObserver ImO,
                           float xl,float yl,float VIEWSCALE)
  {
    float         origxl=xl;
    int           i=starti;
    RenderedEvent re=getEvent(i);
    Event         ce;
    ClefSet       origcs;

    if (re==null)
      return 0;
    ce=re.getEvent();
    origcs=ce.getClefSet(options.get_usemodernclefs());
    boolean done=!ce.hasSignatureClef();

     combine multiple clef events into a single display set 
    if (starti>0 && origcs.getprincipalclef().isprincipalclef() && !ce.hasPrincipalClef())
      xl+=drawclefset(getEvent(starti-1).getClefEventNum(),princOnly,g,mf,ImO,xl,yl,VIEWSCALE);

    while (!done)
      {
        if ((!princOnly) || ce.hasPrincipalClef())
          xl+=re.drawClefs(g,mf,ImO,xl,yl,VIEWSCALE);

        re=getEvent(++i);
        if (re!=null)
          {
            ce=re.getEvent();
            done=ce.getClefSet(options.get_usemodernclefs())!=origcs;
          }
        else
          done=true;
      }
    return xl-origxl;
  }*/
	/*------------------------------------------------------------------------
Method:  float drawclefset(int starti,PDFCreator outp,float xl,float yl)
Purpose: Draws multi-clef into PDF
Parameters:
  Input:  int starti        - index of first clef event
          PDFCreator outp   - PDF-writing object
          PdfContentByte cb - PDF graphical context
          float xl,yl       - location in context to draw event
  Output: -
  Return: x size of total clef set
------------------------------------------------------------------------*/
	/*
  public float drawclefset(int starti,PDFCreator outp,PdfContentByte cb,float xl,float yl)
  {
    float         origxl=xl;
    int           i=starti;
    RenderedEvent re=getEvent(i);
    Event         ce;
    ClefSet       origcs;

    if (re==null)
      return 0;
    ce=re.getEvent();
    origcs=ce.getClefSet(options.get_usemodernclefs());
    boolean done=!ce.hasSignatureClef();

     combine multiple clef events into a single display set 
    if (starti>0 && origcs.getprincipalclef().isprincipalclef() && !ce.hasPrincipalClef())
      xl+=drawclefset(getEvent(starti-1).getClefEventNum(),outp,cb,xl,yl);

    while (!done)
      {
        xl+=re.drawClefs(outp,cb,xl,yl);

        re=getEvent(++i);
        if (re!=null)
          {
            ce=re.getEvent();
            done=ce.getClefSet(options.get_usemodernclefs())!=origcs;
          }
        else
          done=true;
      }
    return xl-origxl;
  }
*/
	/*------------------------------------------------------------------------
Method:  float getclefsetsize(int starti)
Purpose: Calculate x size of multi-clef (without drawing)
Parameters:
  Input:  int starti - index of first clef event
  Output: -
  Return: x size of total clef set
------------------------------------------------------------------------*/
	/*
  public float getclefsetsize(int starti)
  {
    float         totalxsize=0;
    int           i=starti;
    RenderedEvent re=getEvent(i);
    Event         ce;
    ClefSet       origcs;

    if (re==null)
      return 0;
    ce=re.getEvent();
    origcs=ce.getClefSet(options.get_usemodernclefs());
    boolean done=!ce.hasSignatureClef();

     combine multiple clef events into a single display set 
    if (starti>0 && origcs.getprincipalclef().isprincipalclef() && !ce.hasPrincipalClef())
      totalxsize+=getclefsetsize(getEvent(starti-1).getClefEventNum());

    while (!done)
      {
        totalxsize+=re.getClefImgXSize();

        re=getEvent(++i);
        if (re!=null)
          {
            ce=re.getEvent();
            done=ce.getClefSet(options.get_usemodernclefs())!=origcs;
          }
        else
          done=true;
      }
    return totalxsize;
  }*/
	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getSection():MusicSection
	{
		return this.section;
	}

	public getVoiceData():Voice
	{
		return this.voicedata;
	}

	public getVoiceEventData():VoiceEventListData
	{
		return this.voiceEventData;
	}

	/*------------------------------------------------------------------------
Methods: get*(int i)
Purpose: Routines to return rendering parameters at particular list locations
Parameters:
  Input:  int i - list index to check
  Output: -
  Return: parameters (events/structures)
------------------------------------------------------------------------*/
	public getEvent(i:number):RenderedEvent
	{
		if( i >= 0 && i < this.size())
			return this.get(i);
		else
			return null;

	}

	public getClefEvents(i:number):RenderedClefSet
	{
		if( i < 0)
			return null;
		else
			if( i < this.size())
				return this.getEvent(i).getClefEvents();
			else
				if( this.size() > 0)
					return this.getEvent((( this.size() - 1) | 0)).getClefEvents();
				else
					return null;

	}

	public getMensEvent(i:number):RenderedEvent
	{
		if( i < 0)
			return null;

		if( i < this.size())
			return this.getEvent(i).getMensEvent();
		else
			if( this.size() > 0)
				return this.getEvent((( this.size() - 1) | 0)).getMensEvent();
			else
				return null;

	}

	public getColoration(i:number):Coloration
	{
		if( i < 0)
			return this.section.getBaseColoration();

		if( i < this.size())
			return this.getEvent(i).getColoration();
		else
			if( this.size() > 0)
				return this.getEvent((( this.size() - 1) | 0)).getColoration();
			else
				return null;

	}

	public getProportion(i:number):Proportion
	{
		if( i < 0)
			return Proportion.EQUALITY;

		if( i < this.size())
			return this.getEvent(i).getProportion();
		else
			if( this.size() > 0)
				return this.getEvent((( this.size() - 1) | 0)).getProportion();
			else
				return null;

	}

	public getModernKeySig(i:number):ModernKeySignature
	{
		if( i < 0)
			return ModernKeySignature.DEFAULT_SIG;

		if( i < this.size())
			return this.getEvent(i).getModernKeySig();
		else
			if( this.size() > 0)
				return this.getEvent((( this.size() - 1) | 0)).getModernKeySig();
			else
				return null;

	}

	public getOptions():OptionSet
	{
		return this.options;
	}

	public inEditorialSection(i:number):boolean
	{
		if( i < 0)
			return false;

		if( i < this.size())
			return this.getEvent(i).inEditorialSection();
		else
			if( this.size() > 0)
				return this.getEvent((( this.size() - 1) | 0)).inEditorialSection();
			else
				return false;

	}
}
