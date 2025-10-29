
import { System } from '../java/lang/System';
import { Math } from '../java/lang/Math';
import { Character } from '../java/lang/Character';
import { RenderParams } from './RenderParams';
import { RenderedSonority } from './RenderedSonority';
import { RenderedLigature } from './RenderedLigature';
import { RenderedEventGroup } from './RenderedEventGroup';
import { RenderedClefSet } from './RenderedClefSet';
import { PDFCreator } from './PDFCreator';
import { OptionSet } from './OptionSet';
import { MusicFont } from './MusicFont';
import { EventStringImg } from './EventStringImg';
import { EventShapeImg } from './EventShapeImg';
import { EventImg } from './EventImg';
import { EventGlyphImg } from './EventGlyphImg';
import { Rectangle2D } from '../java/awt/geom/Rectangle2D';
import { Line2D } from '../java/awt/geom/Line2D';
import { ImageObserver } from '../java/awt/image/ImageObserver';
import { ArrayList } from '../java/util/ArrayList';
import { Iterator } from '../java/util/Iterator';
import { LinkedList } from '../java/util/LinkedList';
import { Polygon } from '../java/awt/Polygon';
import { PdfContentByte } from '../com/lowagie/text/pdf/PdfContentByte';
import { Graphics2D } from '../java/awt/Graphics2D';
import { Font } from '../java/awt/Font';
import { AnnotationTextEvent } from '../DataStruct/AnnotationTextEvent';
import { BarlineEvent } from '../DataStruct/BarlineEvent';
import { Clef } from '../DataStruct/Clef';
import { ClefEvent } from '../DataStruct/ClefEvent';
import { ClefSet } from '../DataStruct/ClefSet';
import { Coloration } from '../DataStruct/Coloration';
import { CustosEvent } from '../DataStruct/CustosEvent';
import { DotEvent } from '../DataStruct/DotEvent';
import { Event } from '../DataStruct/Event';
import { LineEndEvent } from '../DataStruct/LineEndEvent';
import { MensEvent } from '../DataStruct/MensEvent';
import { MensSignElement } from '../DataStruct/MensSignElement';
import { ModernAccidental } from '../DataStruct/ModernAccidental';
import { ModernKeySignature } from '../DataStruct/ModernKeySignature';
import { ModernKeySignatureElement } from '../DataStruct/ModernKeySignatureElement';
import { ModernKeySignatureEvent } from '../DataStruct/ModernKeySignatureEvent';
import { MultiEvent } from '../DataStruct/MultiEvent';
import { NoteEvent } from '../DataStruct/NoteEvent';
import { OriginalTextEvent } from '../DataStruct/OriginalTextEvent';
import { Proportion } from '../DataStruct/Proportion';
import { ProportionEvent } from '../DataStruct/ProportionEvent';
import { RestEvent } from '../DataStruct/RestEvent';
import { Signum } from '../DataStruct/Signum';
import { VariantMarkerEvent } from '../DataStruct/VariantMarkerEvent';
import { VariantReading } from '../DataStruct/VariantReading';
import { VariantVersionData } from '../DataStruct/VariantVersionData';

export class RenderedEvent
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	e:Event;
	musicparams:RenderParams;
	clefset:ClefSet;
	princlef:Clef;
	/* principal clef, for determining staffpos */
	accidental:ModernAccidental;
	options:OptionSet;
	fullSonority:RenderedSonority;
	/* other notes sounding simultaneously */
	multiEventList:LinkedList<RenderedEvent>;
	/* list of rendered events for
                                               one MultiEvent */
	xloc:number;
	useligxpos:boolean;
	/* whether x-pos should depend on previous note */
	ligEnd:boolean;
	modernNoteShapes:boolean;
	musictime:Proportion;
	/* position in terms of time */
	musicLength:Proportion;
	/* length in terms of time */
	ssnum:number;
	/* position on staff */
	imgcolor:number;
	imgxsize:number;
	UNSCALEDMainXSize:number;
	imgXSizeWithoutText:number;
	imgs:ArrayList<EventImg>;
	display:boolean;
	/* whether to display in score */
	attachedEventIndex:number;
	/* index of last dot or other event
                                             immediately following/attached */
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: RenderedEvent(boolean d,Event ev,RenderParams rp,OptionSet op)
Purpose:     Initialize event
Parameters:
  Input:  boolean d         - whether to display event
          Event ev          - event
          RenderParams rp   - musical parameters at this score location
          OptionSet op      - drawing/rendering options
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public constructor(d:boolean,ev:Event,rp:RenderParams,op:OptionSet)
	{
		this.e = ev;
		this.options = op;
		this.display = d;
		this.musicparams = rp;
		this.ligEnd = this.musicparams.endlig;
		this.attachedEventIndex = - 1;
		this.modernNoteShapes = this.options.useModernNoteShapes();
		this.musicLength = ev.getmusictime() != null ? Proportion.new1(ev.getmusictime()):null;
		this.multiEventList = null;
		if( this.e.geteventtype() == Event.EVENT_MULTIEVENT)
			{
				let savedCS:RenderedClefSet = this.musicparams.clefEvents;
				this.imgs = null;
				this.imgxsize =( this.imgXSizeWithoutText = 0);
				this.multiEventList = new LinkedList<RenderedEvent>();
				this.musicparams.inMultiEvent = true;
				for(
				let i:Iterator<Event> =(<MultiEvent> this.e).iterator_2();i.hasNext();)
				{
					let re:RenderedEvent = new RenderedEvent(d,<Event> i.next(),this.musicparams,op);
					this.multiEventList.add(re);
					if( re.imgxsize > this.imgxsize)
						this.imgxsize = re.imgxsize;

					if( re.imgXSizeWithoutText > this.imgXSizeWithoutText)
						this.imgXSizeWithoutText = re.imgXSizeWithoutText;

				}
				this.musicparams.clefEvents = savedCS;
			}

		if( ev.hasSignatureClef_1())
			this.musicparams.clefEvents = new RenderedClefSet(this.musicparams.clefEvents,this,this.options.get_usemodernclefs(),this.musicparams.suggestedModernClef);

		if( ev.getMensInfo_1() != null)
			this.musicparams.mensEvent = this;

		this.clefset = this.musicparams.clefEvents != null ? this.musicparams.clefEvents.getLastClefEvent().getEvent_1().getClefSet_2(op.get_usemodernclefs()):null;
		if( this.options.get_usemodernclefs() && this.musicparams.suggestedModernClef != null)
			this.princlef = this.musicparams.suggestedModernClef;
		else
			this.princlef = this.musicparams.clefEvents != null ? this.clefset.getprincipalclef():null;

		this.imgcolor = this.e.isEditorial() || this.e.displayAsEditorial() ? Coloration.GRAY:this.e.getcolor_1();
		this.accidental = null;
		if( this.multiEventList == null)
			this.initImages();

	}

	/* initialize event data */
	/* restore params modified by individual events in multi-event */
	/*------------------------------------------------------------------------
Method:  void initImages()
Purpose: Create image set for drawing event
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public initImages():void
	{
		let STAFFPOSSCALE:number =(( this.options.getSTAFFSCALE() / 2) | 0);
		let VIEWSCALE:number = this.options.getVIEWSCALE();
		let curxoff:number = 0;
		let UNSCALEDxoff:number = 0;
		let curImg:EventImg;
		this.imgs = new ArrayList<EventImg>();
		let xoff:number = 0;
		let vme:VariantMarkerEvent;
		let c:Clef;
		switch( this.e.geteventtype())
		{
			case Event.EVENT_CLEF:
			{
				c =(<ClefEvent> this.e).getClef_1(this.options.get_usemodernclefs(),this.options.getUseModernAccidentalSystem());
				if( c.isprincipalclef() && this.options.get_usemodernclefs() && this.musicparams.suggestedModernClef != null)
					c = this.musicparams.suggestedModernClef;

				if( c.cleftype == Clef.CLEF_NONE)
					break;

				this.ssnum = c.getypos(this.princlef);
				this.addLedgerLineImages();
				curImg = new EventGlyphImg((( MusicFont.PIC_CLEFSTART + c.cleftype) | 0),this.ssnum,curxoff,(( STAFFPOSSCALE * this.ssnum) | 0),UNSCALEDxoff,0,this.imgcolor);
				this.imgs.add(curImg);
				if( this.options.get_displayedittags() && c.issignatureclef() && ! c.isprincipalclef())
					{
						let sigMarkerPos:number = this.ssnum > 4 ?(( this.ssnum + 6) | 0):10;
						this.imgs.add(EventStringImg.new2(" S",sigMarkerPos,curxoff,((((( sigMarkerPos - 9) | 0)) * STAFFPOSSCALE) | 0),UNSCALEDxoff,0,Coloration.GRAY,<number> MusicFont.DEFAULT_TEXT_SMALLFONTSIZE));
					}

				curxoff += curImg.xsize;
				break;
			}
			case Event.EVENT_MENS:
			{
				let mense:MensEvent =<MensEvent> this.e;
				let ei:EventGlyphImg;
				let curssnum:number = mense.getStaffLoc();
				let smallMens:boolean = mense.small();
				if( this.modernNoteShapes && ! this.e.isEditorial() && ! this.musicparams.inMultiEvent)
					{
						curssnum = 4;
						smallMens = false;
					}

				for(
				let mei:Iterator<MensSignElement> = mense.iterator_1();mei.hasNext();)
				{
					let curSign:MensSignElement =<MensSignElement> mei.next();
					switch( curSign.signType)
					{
						case MensSignElement.NO_SIGN:
						{
							break;
						}
						case MensSignElement.NUMBERS:
						{
							this.imgs.add(EventStringImg.new2(`${curSign.number.i1}`,(( curssnum - 1) | 0),curxoff + MusicFont.CONNECTION_SCREEN_MENSNUMBERX,(((((((( STAFFPOSSCALE *((( curssnum - 1) | 0))) | 0) -(( this.options.getSTAFFSCALE() * 4) | 0)) | 0) - 1) | 0) +( smallMens ? 0:MusicFont.CONNECTION_SCREEN_MENSNUMBERY)) | 0),UNSCALEDxoff + MusicFont.CONNECTION_MENSNUMBERX,MusicFont.CONNECTION_MENSNUMBERY,this.imgcolor,smallMens ?<number> MusicFont.DEFAULT_TEXT_FONTSIZE:<number> MusicFont.DEFAULT_TEXT_LARGEFONTSIZE));
							if( mense.vertical())
								curssnum -= 2;
							else
								{
									curxoff += MusicFont.CONNECTION_SCREEN_MENSNUMBERX;
									UNSCALEDxoff += MusicFont.CONNECTION_MENSNUMBERX;
								}

							break;
						}
						default:
						{
							let picnum:number;
							let picoffset:number = smallMens ? MusicFont.PIC_MENS_OFFSETSMALL:0;
							if( curSign.signType == MensSignElement.MENS_SIGN_O)
								picnum =(( MusicFont.PIC_MENS_O + picoffset) | 0);
							else
								if( curSign.signType == MensSignElement.MENS_SIGN_C)
									picnum =(( MusicFont.PIC_MENS_C + picoffset) | 0);
								else
									if( curSign.signType == MensSignElement.MENS_SIGN_CREV)
										picnum =(( MusicFont.PIC_MENS_CREV + picoffset) | 0);
									else
										picnum =(( MusicFont.PIC_MENS_NONE + picoffset) | 0);

							this.imgs.add(ei = new EventGlyphImg((( MusicFont.PIC_MENSSTART + picnum) | 0),curssnum,curxoff,(( STAFFPOSSCALE * curssnum) | 0),UNSCALEDxoff,0,this.imgcolor));
							if( curSign.stroke)
								this.imgs.add(new EventGlyphImg((((( MusicFont.PIC_MENSSTART + MusicFont.PIC_MENS_STROKE) | 0) + picoffset) | 0),curssnum,curxoff,ei.yoff,UNSCALEDxoff,0,this.imgcolor));

							if( curSign.dotted)
								this.imgs.add(new EventGlyphImg((((( MusicFont.PIC_MENSSTART + MusicFont.PIC_MENS_DOT) | 0) + picoffset) | 0),curssnum,curxoff,ei.yoff,UNSCALEDxoff,0,this.imgcolor));

							if( mense.vertical())
								curssnum -= smallMens ? 2:4;
							else
								{
									curxoff += MusicFont.CONNECTION_SCREEN_MENSSIGNX *( smallMens ? 0.5:1);
									UNSCALEDxoff += MusicFont.CONNECTION_MENSSIGNX *( smallMens ? 0.5:1);
								}

						}
					}
				}
				break;
			}
			case Event.EVENT_NOTE:
			{
				let ne:NoteEvent =<NoteEvent> this.e;
				let yoff:number;
				this.ssnum = ne.getPitch_1().calcypos(this.princlef);
				this.addLedgerLineImages();
				let notetype:number = ne.getnotetype_1();
				let stemdir:number = - 1;
				let stemPicOffset:number = 0;
				if( ne.hasStem())
					{
						stemdir = this.calcStemDir(ne,this.modernNoteShapes || this.options.get_usemodernclefs());
						if( stemdir == NoteEvent.STEM_DOWN)
							stemPicOffset = this.modernNoteShapes ? MusicFont.PIC_MODNOTE_OFFSET_STEMDOWN:MusicFont.PIC_NOTE_OFFSET_STEMDOWN;
						else
							if( stemdir == NoteEvent.STEM_UP)
								stemPicOffset = this.modernNoteShapes ? MusicFont.PIC_MODNOTE_OFFSET_STEMUP:MusicFont.PIC_NOTE_OFFSET_STEMUP;

					}

				let noteheadImg:EventGlyphImg = new EventGlyphImg((((( MusicFont.PIC_NOTESTART + ne.getnoteheadstyle()) | 0) + stemPicOffset) | 0),this.ssnum,xoff = 0,yoff =(( STAFFPOSSCALE * this.ssnum) | 0),0,0,this.imgcolor);
				this.imgs.add(noteheadImg);
				this.imgxsize = noteheadImg.xsize;
				this.UNSCALEDMainXSize = MusicFont.getDefaultPrintGlyphWidth(Character.codePointAt(noteheadImg.imgnum,0));
				let origxoff:number = xoff;
				let origyoff:number = yoff;
				let UNSCALEDyoff:number = 0;
				UNSCALEDxoff = 0;
				if( stemdir == NoteEvent.STEM_BARLINE)
					this.imgs.add(EventShapeImg.new1(new Line2D.Float(<number>( xoff + MusicFont.CONNECTION_SCREEN_L_STEMX),<number>((( 0 - STAFFPOSSCALE) | 0)),<number>( xoff + MusicFont.CONNECTION_SCREEN_L_STEMX),<number>( this.options.getSTAFFSCALE() * 4.5)),[<number>( UNSCALEDxoff + MusicFont.CONNECTION_L_STEMX),<number>( UNSCALEDxoff + MusicFont.CONNECTION_L_STEMX)],[0,0],this.imgcolor,Coloration.VOID,8,0,1));

				if( ne.isflagged_1() || notetype == NoteEvent.NT_Semifusa || notetype == NoteEvent.NT_Fusa)
					{
						if( ! this.modernNoteShapes)
							{
								xoff += 1.2;
								UNSCALEDxoff += MusicFont.CONNECTION_SB_UPSTEMX;
							}

						else
							{
								xoff += MusicFont.CONNECTION_SCREEN_MODFLAGX;
								UNSCALEDxoff += MusicFont.CONNECTION_MODFLAGX;
							}

						let flagpic:number;
						if( stemdir == NoteEvent.STEM_UP)
							{
								UNSCALEDyoff += this.modernNoteShapes ? MusicFont.CONNECTION_STEM_UPMODFLAGY:MusicFont.CONNECTION_STEM_UPFLAGY;
								flagpic = this.modernNoteShapes ?(( MusicFont.PIC_MODNOTESTART + MusicFont.PIC_MODNOTE_OFFSET_FLAGUP) | 0):(( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_FLAGUP) | 0);
							}

						else
							{
								UNSCALEDyoff += this.modernNoteShapes ? MusicFont.CONNECTION_STEM_DOWNMODFLAGY:MusicFont.CONNECTION_STEM_DOWNFLAGY;
								flagpic = this.modernNoteShapes ?(( MusicFont.PIC_MODNOTESTART + MusicFont.PIC_MODNOTE_OFFSET_FLAGDOWN) | 0):(( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_FLAGDOWN) | 0);
							}

						this.imgs.add(new EventGlyphImg(flagpic,this.ssnum,xoff,yoff,UNSCALEDxoff,UNSCALEDyoff,this.imgcolor));
						let numFlags:number = ne.getNumFlags();
						let numFlagsLeft:number;
						let yincrdir:number = stemdir == NoteEvent.STEM_UP ? - 1:1;
						if( notetype == NoteEvent.NT_Semifusa)
							numFlagsLeft = 1;
						else
							if( numFlags > 0)
								numFlagsLeft =(( numFlags - 1) | 0);
							else
								numFlagsLeft = 0;

						while( -- numFlagsLeft >= 0)
						{
							UNSCALEDyoff += yincrdir * MusicFont.CONNECTION_FLAGINTERVAL;
							yoff += yincrdir * MusicFont.CONNECTION_SCREEN_FLAGINTERVAL;
							this.imgs.add(new EventGlyphImg(flagpic,this.ssnum,xoff,yoff,UNSCALEDxoff,UNSCALEDyoff,this.imgcolor));
						}
					}

				this.addNoteOptionImages(ne,origxoff,origyoff,this.ssnum,stemdir);
				break;
			}
			case Event.EVENT_REST:
			{
				let re:RestEvent =<RestEvent> this.e;
				let numSets:number = re.getNumSets();
				let bottomLine:number = re.getbottomline_1(this.options.get_usemodernclefs());
				this.ssnum =(( 2 *((( bottomLine - 1) | 0))) | 0);
				let RIMGBASE:number = this.modernNoteShapes ? MusicFont.PIC_MODRESTSTART:MusicFont.PIC_RESTSTART;
				this.addLedgerLineImages();
				xoff = 0;
				UNSCALEDxoff = 0;
				let curi:EventImg;
				for(
				let ri:number = 0;ri < numSets;ri ++)
				{
					this.imgs.add(curi = new EventGlyphImg((( RIMGBASE + re.getnotetype_1()) | 0),this.ssnum,xoff,(( STAFFPOSSCALE * this.ssnum) | 0),UNSCALEDxoff,0,this.imgcolor));
					for(
					let i:number = 1;i < re.getnumlines();i ++)
					this.imgs.add(curi = new EventGlyphImg((( RIMGBASE + re.getnotetype_1()) | 0),(( this.ssnum +(( 2 * i) | 0)) | 0),xoff,(( STAFFPOSSCALE *((( this.ssnum +(( 2 * i) | 0)) | 0))) | 0),UNSCALEDxoff,0,this.imgcolor));
					xoff += curi.xsize * 4;
					UNSCALEDxoff += MusicFont.CONNECTION_BARLINEX * 1.5;
				}
				break;
			}
			case Event.EVENT_DOT:
			{
				let de:DotEvent =<DotEvent> this.e;
				this.imgs.add(new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_DOT) | 0),this.calcDotLoc(de,this.options.get_usemodernclefs(),this.musicparams.lastEvent),MusicFont.CONNECTION_SCREEN_DOTX,(( STAFFPOSSCALE *( this.calcDotLoc(de,this.options.get_usemodernclefs(),this.musicparams.lastEvent))) | 0),0,0,this.imgcolor));
				break;
			}
			case Event.EVENT_ORIGINALTEXT:
			{
				let oe:OriginalTextEvent =<OriginalTextEvent> this.e;
				this.ssnum = - 6;
				let txtColor:number = Coloration.BLACK;
				xoff = 0;
				if( this.options.get_displayModText())
					this.ssnum += 2;

				let textVersion:VariantVersionData = oe.getVariantVersion();
				if( textVersion != null)
					{
						let versionNum:number = textVersion.getNumInList();
						this.ssnum -=(( versionNum * OptionSet.SPACES_PER_TEXTLINE) | 0);
						txtColor =(( versionNum % OptionSet.TEXTVERSION_COLORS + 1) | 0);
					}

				if( this.options.get_displayedittags())
					{
						let tagImg:EventGlyphImg = new EventGlyphImg(MusicFont.PIC_NULL,0,0,(( STAFFPOSSCALE * 8) | 0),0,0,Coloration.BLUE);
						this.imgs.add(tagImg);
						xoff += tagImg.xsize;
					}

				if( this.options.get_displayOrigText())
					{
						let textImg:EventStringImg = EventStringImg.new2(oe.getText(),this.ssnum,xoff,(((( STAFFPOSSCALE *( this.ssnum)) | 0) -(( this.options.getSTAFFSCALE() * 4) | 0)) | 0),0,0,txtColor,<number> MusicFont.DEFAULT_TEXT_FONTSIZE);
						textImg.xsize = 0;
						this.imgs.add(textImg);
					}

				break;
			}
			case Event.EVENT_CUSTOS:
			{
				let custe:CustosEvent =<CustosEvent> this.e;
				this.imgs.add(new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_CUSTOS) | 0),custe.getPitch_1().calcypos(this.princlef),0,(( STAFFPOSSCALE * custe.getPitch_1().calcypos(this.princlef)) | 0),0,0,this.imgcolor));
				break;
			}
			case Event.EVENT_LINEEND:
			{
				let le:LineEndEvent =<LineEndEvent> this.e;
				this.imgs.add(new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_LINEEND) | 0),0,0,0,0,0,this.imgcolor));
				if( le.isPageEnd())
					this.imgs.add(EventStringImg.new2("||",9,3,0,0,0,this.imgcolor,<number> MusicFont.DEFAULT_TEXT_SMALLFONTSIZE));

				break;
			}
			case Event.EVENT_PROPORTION:
			{
				let pp:Proportion =(<ProportionEvent> this.e).getproportion();
				if( this.options.get_displayedittags())
					{
						this.imgs.add(new EventGlyphImg(MusicFont.PIC_NULL,8,0,(( STAFFPOSSCALE * 8) | 0),0,0,Coloration.BLACK));
						this.imgs.add(EventStringImg.new2("[" + pp.i1 + ":" + pp.i2 + "]",10,0,this.options.getSTAFFSCALE(),0,0,Coloration.BLUE,<number> MusicFont.DEFAULT_TEXT_SMALLFONTSIZE));
					}

				break;
			}
			case Event.EVENT_COLORCHANGE:
			{
				if( this.options.get_displayedittags())
					this.imgs.add(new EventGlyphImg(MusicFont.PIC_NULL,0,0,(( STAFFPOSSCALE * 8) | 0),0,0,Coloration.BLACK));

				break;
			}
			case Event.EVENT_BARLINE:
			{
				let be:BarlineEvent =<BarlineEvent> this.e;
				this.ssnum =(( 2 * be.getBottomLinePos()) | 0);
				let isRepeatSign:boolean = be.isRepeatSign();
				let repeatSignOffset:number = isRepeatSign ? 3:0;
				for(
				let i:number = 0;i < be.getNumLines();i ++)
				{
					let esi:EventShapeImg = EventShapeImg.new1(new Line2D.Float(<number>(((( i + repeatSignOffset) | 0)) * MusicFont.CONNECTION_SCREEN_BARLINEX),<number>((( STAFFPOSSCALE *((( 8 - this.ssnum) | 0))) | 0)),<number>(((( i + repeatSignOffset) | 0)) * MusicFont.CONNECTION_SCREEN_BARLINEX),<number>((( STAFFPOSSCALE *((((( 8 - this.ssnum) | 0) -(( be.getNumSpaces() * 2) | 0)) | 0))) | 0))),[<number>( i * MusicFont.CONNECTION_BARLINEX),<number>( i * MusicFont.CONNECTION_BARLINEX)],[0,0],this.imgcolor,Coloration.VOID,8,0,1);
					esi.xsize += 10;
					this.imgs.add(esi);
				}
				if( isRepeatSign)
					{
						let dotPos:number = be.getBottomLinePos();
						for(
						let di:number = 0;di < be.getNumSpaces();di ++)
						{
							this.imgs.add(new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_DOT) | 0),(( 1 +((((( dotPos + di) | 0)) * 2) | 0)) | 0),MusicFont.CONNECTION_SCREEN_DOTX,(( STAFFPOSSCALE *((( 1 +((((( dotPos + di) | 0)) * 2) | 0)) | 0))) | 0),0,0,this.imgcolor));
							let esi:EventGlyphImg = new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_DOT) | 0),(( 1 +((((( dotPos + di) | 0)) * 2) | 0)) | 0),((( be.getNumLines() + repeatSignOffset) | 0)) * MusicFont.CONNECTION_SCREEN_BARLINEX,(( STAFFPOSSCALE *((( 1 +((((( dotPos + di) | 0)) * 2) | 0)) | 0))) | 0),0,0,this.imgcolor);
							esi.xsize += 10;
							this.imgs.add(esi);
						}
					}

				break;
			}
			case Event.EVENT_ANNOTATIONTEXT:
			{
				let ae:AnnotationTextEvent =<AnnotationTextEvent> this.e;
				if( this.options.get_displayedittags())
					this.imgs.add(new EventGlyphImg(MusicFont.PIC_NULL,0,0,(( STAFFPOSSCALE * 8) | 0),0,0,Coloration.BLACK));

				let textImg:EventStringImg = EventStringImg.new2(ae.gettext(),ae.getstaffloc(),5,(((( STAFFPOSSCALE * ae.getstaffloc()) | 0) -(( this.options.getSTAFFSCALE() * 4) | 0)) | 0),0,0,this.imgcolor,<number> MusicFont.DEFAULT_TEXT_FONTSIZE);
				textImg.xsize = 0;
				this.imgs.add(textImg);
				break;
			}
			case Event.EVENT_LACUNA:
			{
				this.imgs.add(new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_BRACKETLEFT) | 0),4,0,(( STAFFPOSSCALE * 4) | 0),0,0,Coloration.RED));
				break;
			}
			case Event.EVENT_LACUNA_END:
			{
				this.imgs.add(new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_BRACKETRIGHT) | 0),4,0,(( STAFFPOSSCALE * 4) | 0),0,0,Coloration.RED));
				break;
			}
			case Event.EVENT_VARIANTDATA_START:
			{
				vme =<VariantMarkerEvent> this.e;
				if( this.options.isLigatureList() || ! this.options.markVariant(vme.getVarTypeFlags()))
					{
						this.display = false;
						break;
					}

				if( this.options.get_displayedittags())
					if( vme.getVarTypeFlags() != VariantReading.VAR_ORIGTEXT)
						this.imgs.add(new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_BRACKETLEFT) | 0),4,0,(( STAFFPOSSCALE * 4) | 0),0,0,Coloration.GREEN));
					else
						{
							let esi:EventShapeImg = EventShapeImg.new1(new Line2D.Float(<number> MusicFont.CONNECTION_SCREEN_BARLINEX,<number>((( STAFFPOSSCALE * - 2) | 0)),<number> MusicFont.CONNECTION_SCREEN_BARLINEX,<number>((( STAFFPOSSCALE * 2) | 0))),[0,0],[0,0],Coloration.GREEN,Coloration.VOID,8,0,1);
							esi.xsize += 5;
							this.imgs.add(esi);
						}


				else
					{
						let vr:VariantReading = this.getVarReadingInfo() != null ? this.getVarReadingInfo().varReading:null;
						this.imgs.add(EventStringImg.new2("v",9,4,0,0,0,( vr != null && vr.isError()) ? Coloration.RED:Coloration.GREEN,<number> MusicFont.DEFAULT_TEXT_LARGEFONTSIZE));
						this.display = false;
					}

				break;
			}
			case Event.EVENT_VARIANTDATA_END:
			{
				vme =<VariantMarkerEvent> this.e;
				if( this.options.isLigatureList() || ! this.options.markVariant(vme.getVarTypeFlags()))
					{
						this.display = false;
						break;
					}

				if( this.options.get_displayedittags())
					if( vme.getVarTypeFlags() != VariantReading.VAR_ORIGTEXT)
						this.imgs.add(new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_BRACKETRIGHT) | 0),4,0,(( STAFFPOSSCALE * 4) | 0),0,0,Coloration.GREEN));
					else
						{
							let esi:EventShapeImg = EventShapeImg.new1(new Line2D.Float(5,<number>((( STAFFPOSSCALE * - 2) | 0)),5,<number>((( STAFFPOSSCALE * 2) | 0))),[0,0],[0,0],Coloration.GREEN,Coloration.VOID,8,0,1);
							esi.xsize += 5;
							this.imgs.add(esi);
						}


				else
					this.display = false;

				break;
			}
			case Event.EVENT_ELLIPSIS:
			{
				if( this.options.get_unscoredDisplay())
					{
						let ellXS:number = 50;
						let ellYS:number = this.options.getSTAFFSCALE() * 5.5;
						let esi:EventShapeImg = EventShapeImg.new1(new Rectangle2D.Float(0,<number>((( 0 - ellYS / 10) | 0)),<number> ellXS,<number> ellYS),[0,0,<number> ellXS,<number> ellXS],[0,<number> ellYS,<number> ellYS,0],Coloration.WHITE,Coloration.FULL,9,- 1,3);
						this.imgs.add(esi);
						this.imgs.add(EventStringImg.new2(". . .",0,ellXS / 3,0 - ellYS,0,0,Coloration.BLACK,<number> MusicFont.DEFAULT_TEXT_LARGEFONTSIZE));
					}

				else
					this.imgs.add(new EventGlyphImg(MusicFont.PIC_NULL,0,0,0,0,0,Coloration.BLACK));

				break;
			}
			case Event.EVENT_SECTIONEND:
			{
			}
			case Event.EVENT_BLANK:
			{
				break;
			}
			case Event.EVENT_MODERNKEYSIGNATURE:
			{
				if( this.options.get_displayedittags())
					{
						this.imgs.add(new EventGlyphImg(MusicFont.PIC_NULL,0,0,(( STAFFPOSSCALE * 8) | 0),0,0,this.imgcolor));
						this.imgs.add(EventStringImg.new2(" K",10,0,this.options.getSTAFFSCALE(),0,0,Coloration.BLUE,<number> MusicFont.DEFAULT_TEXT_SMALLFONTSIZE));
					}

				if( this.options.getUseModernAccidentalSystem())
					{
						let mk:ModernKeySignature =(<ModernKeySignatureEvent> this.e).getSigInfo();
						xoff = 5;
						c = this.princlef;
						let staffApos:number = c.getApos();
						let accColor:number = this.options.get_displayedittags() ? Coloration.BLUE:this.imgcolor;
						if( staffApos < 0)
							staffApos += 7;
						else
							if( staffApos > 5)
								staffApos -= 7;

						for(
						let i:Iterator<ModernKeySignatureElement> = mk.iterator();i.hasNext();)
						{
							let kse:ModernKeySignatureElement =<ModernKeySignatureElement> i.next();
							for(
							let ai:number = 0;ai < kse.accidental.numAcc;ai ++)
							{
								this.ssnum =(( staffApos + kse.calcAOffset()) | 0);
								let mkeImg:EventGlyphImg = new EventGlyphImg((((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNFlat) | 0) + kse.accidental.accType) | 0),this.ssnum,xoff,(( STAFFPOSSCALE * this.ssnum) | 0),0,0,accColor);
								this.imgs.add(mkeImg);
								xoff += mkeImg.xsize + MusicFont.CONNECTION_SCREEN_MODACC_DBLFLAT;
							}
						}
					}

				break;
			}
			default:
			{
				this.imgs.add(new EventGlyphImg(MusicFont.PIC_NULL,0,0,0,0,0,Coloration.BLACK));
			}
		}
		this.initExtraImgs();
		this.imgxsize =( this.imgXSizeWithoutText = 0);
		let eventType:number = this.e.geteventtype();
		for(let ei of this.imgs)
		{
			if( ei.xsize > 0 && ei.xoff + ei.xsize > this.imgxsize)
				this.imgxsize = ei.xoff + ei.xsize;

			if( ei.xsize > 0 && ei.xoff + ei.xsize > this.imgXSizeWithoutText)
				if( eventType != Event.EVENT_NOTE || !( ei instanceof EventStringImg))
					this.imgXSizeWithoutText = ei.xoff + ei.xsize;

		}
		if( eventType == Event.EVENT_NOTE)
			{
				let notetype:number =(<NoteEvent> this.e).getnotetype_1();
				switch( notetype)
				{
					case NoteEvent.NT_Fusa:
					{
					}
					case NoteEvent.NT_Flagged:
					{
						this.imgxsize -= 2;
						this.imgXSizeWithoutText -= 2;
						break;
					}
					case NoteEvent.NT_Semifusa:
					{
						this.imgxsize -= 4;
						this.imgXSizeWithoutText -= 4;
						break;
					}
				}
			}

		this.grayOutIfMissing();
	}

	/*    if (e.isEditorial())
      {
        EventGlyphImg edImg=new EventGlyphImg(
          MusicFont.PIC_MISCSTART+MusicFont.PIC_MISC_BRACKETLEFT,4,
          curxoff,STAFFPOSSCALE*4,UNSCALEDxoff,0f,Coloration.BLACK);
        imgs.add(edImg);
        curxoff+=edImg.xsize;
      }*/
	//CHANGE
	/* to ensure proper image size after numbers: 
          imgs.add(new EventStringImg(
            " ",curssnum-1,
            curxoff+MusicFont.CONNECTION_SCREEN_MENSNUMBERX,STAFFPOSSCALE*(curssnum-1)-options.getSTAFFSCALE()*4,
            0f,MusicFont.CONNECTION_MENSNUMBERY,
            Coloration.BLACK,12));*/
	// double    xoff=0,yoff;//CHANGE
	/* notehead */
	/* flags */
	/* multi-text */
	//tagImg.xsize=0;
	//VariantMarkerEvent vme=(VariantMarkerEvent)e;//CHANGE
	//CHANGE
	/* NO - need to use print values */
	/* add individual accidentals in signature */
	/* fix for note-spacing at small values */
	/* gray out music missing in current version */
	grayOutIfMissing():void
	{
		if( this.musicparams.missingInVersion)
			for(let ei of this.imgs)
			ei.color = Coloration.GRAY;

	}

	/*------------------------------------------------------------------------
Method:  void initExtraImgs()
Purpose: Initialize non-event-specific images (corona, signum congruentiae,
         etc)
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	initExtraImgs():void
	{
		let STAFFPOSSCALE:number =(( this.options.getSTAFFSCALE() / 2) | 0);
		let s:Signum = this.e.getCorona();
		if( s != null)
			this.addSignumImg(s,MusicFont.PIC_MISC_CORONAUP);

		s = this.e.getSignum();
		if( s != null)
			this.addSignumImg(s,MusicFont.PIC_MISC_SIGNUMUP);

		if( this.e.isError())
			{
				let eeImg:EventStringImg = EventStringImg.new2(" X",(( this.ssnum + 4) | 0),0,(( STAFFPOSSCALE *((((( this.ssnum + 4) | 0) - 9) | 0))) | 0),0,0,Coloration.RED,<number> MusicFont.DEFAULT_TEXT_LARGEFONTSIZE);
				this.imgs.add(eeImg);
			}

		let ec:string = this.e.getEdCommentary();
		if( ec != null && this.options.getViewEdCommentary())
			{
				let ecImg:EventStringImg = EventStringImg.new2(" *",9,0,(( this.options.getSTAFFSCALE() - STAFFPOSSCALE) | 0),0,0,Coloration.BLUE,<number> MusicFont.DEFAULT_TEXT_LARGEFONTSIZE);
				this.imgs.add(ecImg);
			}

	}

	/*------------------------------------------------------------------------
Method:  void addLedgerLineImages()
Purpose: Initialize images for ledger lines
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	addLedgerLineImages():void
	{
		let STAFFPOSSCALE:number =(( this.options.getSTAFFSCALE() / 2) | 0);
		if( this.ssnum < - 1 || this.ssnum > 9)
			{
				let curledgerplace:number;
				let incr:number;
				if( this.ssnum < 0)
					{
						curledgerplace = - 2;
						incr = - 2;
					}

				else
					{
						curledgerplace = 10;
						incr = 2;
					}

				for(
				;Math.abs(curledgerplace) <= Math.abs(this.ssnum);curledgerplace += incr)
				this.imgs.add(new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_LEDGER) | 0),curledgerplace,- 1,(( STAFFPOSSCALE * curledgerplace) | 0),0,0,Coloration.BLACK));
			}

	}

	/*------------------------------------------------------------------------
Method:  void addSignumImg(Signum s,int picnumUp)
Purpose: Initialize image for one corona or signum congruentiae
Parameters:
  Input:  Signum s     - sign position/orientation info
          int picnumUp - index of sign image (in up orientation)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	addSignumImg(s:Signum,picnumUp:number):void
	{
		let STAFFPOSSCALE:number =(( this.options.getSTAFFSCALE() / 2) | 0);
		let picnum:number =(((( MusicFont.PIC_MISCSTART + picnumUp) | 0) +( s.orientation == Signum.DOWN ? 1:0)) | 0);
		let syp:number = this.ssnum;
		let screen_xoff:number = 0;
		let xoff:number = 0;
		let screen_xconnect:number = 0;
		let xconnect:number = 0;
		if( this.imgs.size() > 0)
			{
				let firstimg:EventImg =<EventImg>( this.imgs.get(0));
				screen_xoff = firstimg.xoff;
				xoff = firstimg.UNSCALEDxoff;
				syp = firstimg.staffypos;
			}

		if( picnumUp == MusicFont.PIC_MISC_CORONAUP)
			{
				screen_xconnect = MusicFont.CONNECTION_SCREEN_CORONAX;
				xconnect = MusicFont.CONNECTION_CORONAX;
			}

		if( s.side == Signum.LEFT)
			screen_xoff -= 5;
		else
			if( s.side == Signum.RIGHT)
				screen_xoff += 5;

		let sigImg:EventGlyphImg = new EventGlyphImg(picnum,(( syp + s.offset) | 0),screen_xoff + screen_xconnect,(( STAFFPOSSCALE *((( syp + s.offset) | 0))) | 0),xoff + xconnect,0,this.imgcolor);
		sigImg.xsize = 0;
		this.imgs.add(sigImg);
	}

	/*------------------------------------------------------------------------
Method:  void renderaslig(RenderedEvent lastnote,RenderedEvent nextnote)
Purpose: Re-do image information to render note as part of a ligature in
         its original shape
Parameters:
  Input:  RenderedEvent lastnote,nextnote - previous and next notes in ligature
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public renderaslig(lastnote:RenderedEvent,nextnote:RenderedEvent):void
	{
		let ne:NoteEvent =<NoteEvent> this.e.getFirstEventOfType_1(Event.EVENT_NOTE);
		let nnssnum:number = nextnote == null ?(( this.ssnum + 1) | 0):nextnote.ssnum;
		if( ne != null)
			{
				this.imgs = new ArrayList<EventImg>();
				let STAFFSCALE:number = this.options.getSTAFFSCALE();
				let STAFFPOSSCALE:number =(( STAFFSCALE / 2) | 0);
				let lastne:NoteEvent = lastnote == null ? null:<NoteEvent> lastnote.getEvent_1().getFirstEventOfType_1(Event.EVENT_NOTE);
				let nextne:NoteEvent = nextnote == null ? null:<NoteEvent> nextnote.getEvent_1().getFirstEventOfType_1(Event.EVENT_NOTE);
				let UNSCALEDxoff:number = 0;
				let UNSCALEDyoff:number = 0;
				let xoff:number = 0;
				let yoff:number =(( STAFFPOSSCALE * this.ssnum) | 0);
				let origxoff:number = xoff;
				let origyoff:number = yoff;
				if( this.ssnum < - 1 || this.ssnum > 9)
					{
						let curledgerplace:number;
						let incr:number;
						if( this.ssnum < 0)
							{
								curledgerplace = - 2;
								incr = - 2;
							}

						else
							{
								curledgerplace = 10;
								incr = 2;
							}

						for(
						;Math.abs(curledgerplace) <= Math.abs(this.ssnum);curledgerplace += incr)
						this.imgs.add(new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_LEDGER) | 0),curledgerplace,xoff - 1,(( STAFFPOSSCALE * curledgerplace) | 0),0,0,this.imgcolor));
					}

				if( ne.getligtype() == NoteEvent.LIG_OBLIQUA)
					{
						let xl:number = MusicFont.CONNECTION_SCREEN_L_LEFTSTEMX;
						let xr:number = MusicFont.CONNECTION_SCREEN_LIG_RECTA * 2;
						let yl:number =(( MusicFont.PICYCENTER - yoff - STAFFPOSSCALE) | 0);
						let yr:number =(((( MusicFont.PICYCENTER -(( STAFFPOSSCALE * nnssnum) | 0)) | 0) - STAFFPOSSCALE) | 0);
						let totalx:number = xr - xl;
						let totaly:number = yr - yl;
						let USxl:number = MusicFont.CONNECTION_L_LEFTSTEMX;
						let USxr:number = MusicFont.CONNECTION_LIG_RECTA * 2;
						let USyup:number = MusicFont.CONNECTION_LIG_UPSTEMY;
						let USydown:number = 0 - MusicFont.CONNECTION_LIG_UPSTEMY;
						let UStotalx:number = USxr - USxl;
						let fullColored:boolean = this.e.getcolorfill_1() == Coloration.FULL &&( nextne != null && nextne.getcolorfill_1() == Coloration.FULL);
						this.imgs.add(EventShapeImg.new1(new Polygon([Math.round(<number> xl),Math.round(<number> xl),Math.round(<number> xr),Math.round(<number> xr)],[Math.round(<number> yl),Math.round(<number>( yl + STAFFSCALE)),Math.round(<number>( yr + STAFFSCALE)),Math.round(<number> yr)],4),[<number> USxl,<number> USxl,<number> USxr,<number> USxr],[<number> USyup,<number> USydown,<number> USydown,<number> USyup],this.imgcolor,fullColored ? Coloration.FULL:Coloration.VOID,this.ssnum,nnssnum,2));
						if( this.e.getcolorfill_1() == Coloration.FULL && ! fullColored)
							this.imgs.add(EventShapeImg.new1(new Polygon([Math.round(<number> xl),Math.round(<number> xl),Math.round(<number>( xl + totalx / 2)),Math.round(<number>( xl + totalx / 2))],[Math.round(<number> yl),Math.round(<number>( yl + STAFFSCALE)),Math.round(<number>((( yl + STAFFSCALE + totaly / 2) | 0))),Math.round(<number>( yl + totaly / 2))],4),[<number> USxl,<number> USxl,<number>( USxl + UStotalx / 2),<number>( USxl + UStotalx / 2)],[<number> USyup,<number> USydown,<number> USydown,<number> USyup],this.imgcolor,Coloration.FULL,this.ssnum,nnssnum,2));

					}

				else
					if( lastne != null && lastne.getligtype() == NoteEvent.LIG_OBLIQUA)
						{
							let fullColored:boolean = this.e.getcolorfill_1() == Coloration.FULL && lastne.getcolorfill_1() == Coloration.FULL;
							if( this.e.getcolorfill_1() == Coloration.FULL && ! fullColored)
								{
									let xl:number = 0;
									let xr:number = MusicFont.CONNECTION_SCREEN_LIG_RECTA;
									let lastyl:number =(((( MusicFont.PICYCENTER -(( STAFFPOSSCALE * lastnote.ssnum) | 0)) | 0) - STAFFPOSSCALE) | 0);
									let yr:number =(( MusicFont.PICYCENTER - yoff - STAFFPOSSCALE) | 0);
									let yl:number = lastyl +((( yr - lastyl) / 2) | 0);
									let USxl:number = 0;
									let USxr:number = MusicFont.CONNECTION_LIG_RECTA;
									let USyup:number = MusicFont.CONNECTION_LIG_UPSTEMY;
									let USydown:number = 0 - MusicFont.CONNECTION_LIG_UPSTEMY;
									this.imgs.add(EventShapeImg.new1(new Polygon([Math.round(<number> xl),Math.round(<number> xl),Math.round(<number> xr),Math.round(<number> xr)],[Math.round(<number> yl),Math.round(<number>( yl + STAFFSCALE)),Math.round(<number>( yr + STAFFSCALE)),Math.round(<number> yr)],4),[<number> USxl,<number> USxl,<number> USxr,<number> USxr],[<number> USyup,<number> USydown,<number> USydown,<number> USyup],this.imgcolor,Coloration.FULL,lastnote.ssnum,this.ssnum,2));
								}

						}

					else
						{
							this.imgs.add(new EventGlyphImg((( MusicFont.PIC_NOTESTART +( ne.getcolorfill_1() == Coloration.FULL ? NoteEvent.NOTEHEADSTYLE_FULLBREVE:NoteEvent.NOTEHEADSTYLE_BREVE)) | 0),this.ssnum,xoff,yoff,0,0,this.imgcolor));
							if( lastne != null && lastne.getligtype() == NoteEvent.LIG_RECTA)
								this.useligxpos = true;

						}

				if( ne.getligtype() == NoteEvent.LIG_NONE)
					this.imgxsize = MusicFont.getDefaultGlyphWidth((( MusicFont.PIC_NOTESTART + NoteEvent.NOTEHEADSTYLE_BREVE) | 0));
				else
					this.imgxsize = MusicFont.CONNECTION_SCREEN_L_STEMX;

				if( ne.getligtype() == NoteEvent.LIG_RECTA)
					{
						let nextyoff:number =(( STAFFPOSSCALE * nnssnum) | 0);
						let y1:number;
						let y2:number;
						let USy1:number;
						let USy2:number;
						if( nextyoff > yoff)
							{
								y1 = yoff - MusicFont.CONNECTION_SCREEN_L_UPSTEMY;
								y2 = nextyoff + MusicFont.CONNECTION_SCREEN_L_UPSTEMY;
								USy1 = 0 - MusicFont.CONNECTION_LIG_UPSTEMY;
								USy2 = MusicFont.CONNECTION_LIG_UPSTEMY;
							}

						else
							{
								y1 = nextyoff - MusicFont.CONNECTION_SCREEN_L_UPSTEMY;
								y2 = yoff + MusicFont.CONNECTION_SCREEN_L_UPSTEMY;
								USy1 = MusicFont.CONNECTION_LIG_UPSTEMY;
								USy2 = 0 - MusicFont.CONNECTION_LIG_UPSTEMY;
							}

						this.imgs.add(EventShapeImg.new1(new Line2D.Float(<number> MusicFont.CONNECTION_SCREEN_L_STEMX,<number>( MusicFont.PICYCENTER - y1),<number> MusicFont.CONNECTION_SCREEN_L_STEMX,<number>( MusicFont.PICYCENTER - y2)),[<number> MusicFont.CONNECTION_L_STEMX,<number> MusicFont.CONNECTION_L_STEMX],[<number> USy1,<number> USy2],this.imgcolor,Coloration.VOID,this.ssnum,nnssnum,1));
					}

				let stemdir:number = ne.getstemdir();
				let stemside:number = ne.getstemside();
				let stemssnum:number = this.ssnum;
				if( stemside != NoteEvent.STEM_NONE && stemdir != NoteEvent.STEM_NONE)
					{
						if( stemside == NoteEvent.STEM_LEFT)
							{
								UNSCALEDxoff += MusicFont.CONNECTION_L_LEFTSTEMX;
								xoff += MusicFont.CONNECTION_SCREEN_L_LEFTSTEMX;
								if( stemdir == NoteEvent.STEM_UP)
									{
										UNSCALEDyoff = MusicFont.CONNECTION_LIG_UPSTEMY;
										yoff += MusicFont.CONNECTION_SCREEN_LIG_UPSTEMY;
									}

								else
									{
										UNSCALEDyoff = MusicFont.CONNECTION_LIG_DOWNSTEMY;
										yoff += MusicFont.CONNECTION_SCREEN_LIG_DOWNSTEMY;
									}

							}

						else
							{
								UNSCALEDxoff += MusicFont.CONNECTION_L_STEMX;
								xoff += MusicFont.CONNECTION_SCREEN_L_STEMX;
								if( ne.isligated() && nnssnum < this.ssnum)
									{
										stemssnum = nnssnum;
										yoff =(( STAFFPOSSCALE * stemssnum) | 0);
									}

								UNSCALEDyoff = MusicFont.CONNECTION_LIG_DOWNSTEMY;
								yoff += MusicFont.CONNECTION_SCREEN_LIG_DOWNSTEMY;
							}

						this.imgs.add(new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_STEM) | 0),stemssnum,xoff,yoff,UNSCALEDxoff,UNSCALEDyoff,this.imgcolor));
					}

				this.addNoteOptionImages(ne,origxoff,origyoff,this.ssnum,- 1);
			}

		else
			{
				System.err.println("Error: called renderaslig with non-note type");
			}

		this.initExtraImgs();
		this.grayOutIfMissing();
	}

	/* ledger lines */
	/* notehead */
	/* obliqua start */
	/* half-coloration */
	/* FIX THIS!!! implement half-coloration y-vals for 'unscaled' coordinates */
	/* obliqua end */
	/* half-coloration */
	/* FIX THIS!!! implement half-coloration y-vals for 'unscaled' coordinates */
	/* recta (start or end) */
	/* vertical connecting line (only after recta start) */
	/* stem */
	/* always down on the right */
	/* non-note event type */
	/*------------------------------------------------------------------------
Method:  void addNoteOptionImages(NoteEvent ne,double origxoff,double origyoff,
                                  int ssnum,int stemdir)
Purpose: Create images for note elements besids noteheads and stems (modern
         accidentals, modern text, etc)
Parameters:
  Input:  NoteEvent ne            - note info
          double origxoff,origyoff - original drawing position
          int ssnum               - staff position of note
          int stemdir             - stem direction
  Output: -
  Return: -
------------------------------------------------------------------------*/
	addNoteOptionImages(ne:NoteEvent,origxoff:number,origyoff:number,ssnum:number,stemdir:number):void
	{
		let STAFFPOSSCALE:number =(( this.options.getSTAFFSCALE() / 2) | 0);
		let po:ModernAccidental = ne.getPitchOffset();
		let ma:ModernAccidental = null;
		let keySig:ModernKeySignature = ne.getModernKeySig();
		if( ! this.options.getUseModernAccidentalSystem())
			{
				let clefKeySig:ModernKeySignature = ModernKeySignature.DEFAULT_SIG;
				if( this.clefset != null)
					clefKeySig = this.clefset.getKeySig();

				ma = clefKeySig.chooseNoteAccidental(ne,po.pitchOffset);
			}

		else
			ma = keySig.chooseNoteAccidental(ne,po.pitchOffset);

		if( ma != null)
			ma.optional = po.optional;

		if( ma != null && ne.displayAccidental() &&( this.options.get_displayedittags() || this.options.get_modacc_type() != OptionSet.OPT_MODACC_NONE))
			{
				let accssnum:number = 10;
				let leftAccX:number = 0;
				let rightAccX:number = 0;
				let UNSCALEDleftAccX:number = 0;
				let UNSCALEDrightAccX:number = 0;
				if( stemdir == NoteEvent.STEM_UP &&(( ssnum + 9) | 0) > accssnum)
					accssnum =(( ssnum + 9) | 0);
				else
					if((( ssnum + 3) | 0) > accssnum)
						accssnum =(( ssnum + 3) | 0);

				if( ne.getCorona() != null)
					accssnum =(( ssnum + 7) | 0);

				if( accssnum < 10)
					accssnum = 10;

				if( ma.accType == ModernAccidental.ACC_Flat)
					{
						let UNSCALEDcurxoff:number =(( 0 -((( ma.numAcc - 1) | 0)) * MusicFont.CONNECTION_MODACCSMALLX) | 0);
						let curxoff:number =(( 0 -(((((((( ma.numAcc - 1) | 0)) *( MusicFont.getDefaultGlyphWidth((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNFlatSMALL) | 0)) + MusicFont.CONNECTION_SCREEN_MODACC_SMALLDBLFLAT)) | 0)) / 2) | 0)) | 0);
						leftAccX = curxoff;
						UNSCALEDleftAccX = UNSCALEDcurxoff;
						for(
						let i:number = 0;i < ma.numAcc;i ++)
						{
							this.imgs.add(new EventGlyphImg((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNFlatSMALL) | 0),accssnum,origxoff + curxoff + MusicFont.CONNECTION_SCREEN_MODACCSMALLX,(( STAFFPOSSCALE * accssnum) | 0),UNSCALEDcurxoff + MusicFont.CONNECTION_MODACCSMALLX,0,this.imgcolor));
							curxoff += MusicFont.getDefaultGlyphWidth((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNFlatSMALL) | 0)) + MusicFont.CONNECTION_SCREEN_MODACC_SMALLDBLFLAT;
							UNSCALEDcurxoff += MusicFont.CONNECTION_MODACCSMALLX * 2;
						}
						rightAccX = curxoff;
						UNSCALEDrightAccX = UNSCALEDcurxoff;
					}

				else
					if( ma.accType == ModernAccidental.ACC_Sharp)
						{
							if( stemdir != NoteEvent.STEM_UP && ssnum > 4)
								accssnum ++;

							let numSymbols:number =(( ma.numAcc % 2 +(( ma.numAcc / 2) | 0)) | 0);
							let UNSCALEDcurxoff:number =(( 0 -((( numSymbols - 1) | 0)) * MusicFont.CONNECTION_MODACCSMALLX) | 0);
							let curxoff:number =(( 0 -(((((((( numSymbols - 1) | 0)) *( MusicFont.getDefaultGlyphWidth((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNDoubleSharpSMALL) | 0)) + MusicFont.CONNECTION_SCREEN_MODACC_SMALLDBLSHARP)) | 0)) / 2) | 0)) | 0);
							leftAccX = curxoff;
							UNSCALEDleftAccX = UNSCALEDcurxoff;
							if( ma.numAcc == 1 || ma.numAcc % 2 != 0)
								{
									this.imgs.add(new EventGlyphImg((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNSharpSMALL) | 0),accssnum,origxoff + curxoff + MusicFont.CONNECTION_SCREEN_MODACCSMALLX,(( STAFFPOSSCALE * accssnum) | 0),UNSCALEDcurxoff + MusicFont.CONNECTION_MODACCSMALLX,0,this.imgcolor));
									curxoff += MusicFont.getDefaultGlyphWidth((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNSharpSMALL) | 0)) + MusicFont.CONNECTION_SCREEN_MODACC_SMALLDBLSHARP;
									UNSCALEDcurxoff += MusicFont.CONNECTION_MODACCSMALLX * 2;
									numSymbols --;
								}

							for(
							let i:number = 0;i < numSymbols;i ++)
							{
								this.imgs.add(new EventGlyphImg((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNDoubleSharpSMALL) | 0),accssnum,origxoff + curxoff + MusicFont.CONNECTION_SCREEN_MODACCSMALLX,(( STAFFPOSSCALE * accssnum) | 0),UNSCALEDcurxoff + MusicFont.CONNECTION_MODACCSMALLX,0,this.imgcolor));
								curxoff += MusicFont.getDefaultGlyphWidth((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNDoubleSharpSMALL) | 0)) + MusicFont.CONNECTION_SCREEN_MODACC_SMALLDBLSHARP;
								UNSCALEDcurxoff += MusicFont.CONNECTION_MODACCSMALLX * 2;
							}
							rightAccX = curxoff;
							UNSCALEDrightAccX = UNSCALEDcurxoff;
						}

					else
						{
							this.imgs.add(new EventGlyphImg((((((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNFlat) | 0) + ma.accType) | 0) + Clef.OFFSET_SMALL_ACC) | 0),accssnum,origxoff + MusicFont.CONNECTION_SCREEN_MODACCSMALLX,(( STAFFPOSSCALE * accssnum) | 0),MusicFont.CONNECTION_MODACC_SMALLNATURAL,0,this.imgcolor));
							rightAccX = MusicFont.getDefaultGlyphWidth((( MusicFont.PIC_CLEFSTART + Clef.CLEF_MODERNFlatSMALL) | 0)) + MusicFont.CONNECTION_SCREEN_MODACC_SMALLDBLFLAT;
							{ }
							UNSCALEDrightAccX = MusicFont.CONNECTION_MODACCSMALLX * 2;
						}

				if( ma.optional)
					{
						leftAccX -= MusicFont.getDefaultGlyphWidth((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_PARENSLEFTSMALL) | 0));
						UNSCALEDleftAccX -= MusicFont.CONNECTION_MODACCSMALLX + MusicFont.CONNECTION_MODACC_SMALLPARENS;
						this.imgs.add(new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_PARENSLEFTSMALL) | 0),accssnum,origxoff + leftAccX + MusicFont.CONNECTION_SCREEN_MODACC_SMALLPARENSLEFT,(( STAFFPOSSCALE * accssnum) | 0),UNSCALEDleftAccX + MusicFont.CONNECTION_MODACC_SMALLPARENS,0,this.imgcolor));
						this.imgs.add(new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_PARENSRIGHTSMALL) | 0),accssnum,origxoff + rightAccX + MusicFont.CONNECTION_SCREEN_MODACC_SMALLPARENSRIGHT,(( STAFFPOSSCALE * accssnum) | 0),UNSCALEDrightAccX + MusicFont.CONNECTION_MODACC_SMALLPARENS,0,this.imgcolor));
					}

			}

		this.accidental = ma;
		let modernText:string = ne.getModernText();
		let mtssnum:number = ssnum > - 3 ? - 6:(( ssnum - 4) | 0);
		let mtCol:number = Coloration.BLACK;
		if( this.options.get_displayedittags() || this.options.get_displayOrigText())
			{
				mtssnum -= 2;
				mtCol = Coloration.BLUE;
			}

		if( modernText != null && this.options.get_displayModText())
			{
				if( modernText.length <= 1)
					modernText = "  " + modernText;
				else
					if( modernText.length <= 2)
						modernText = " " + modernText;

				modernText += " ";
				if( ! ne.isWordEnd())
					modernText = modernText + "-";

				let textStyle:number = ne.isModernTextEditorial() ? Font.ITALIC:Font.PLAIN;
				let textImg:EventStringImg = EventStringImg.new3(modernText,mtssnum,origxoff,(((( STAFFPOSSCALE * mtssnum) | 0) -(( this.options.getSTAFFSCALE() * 4) | 0)) | 0),0,0,mtCol,<number> MusicFont.DEFAULT_TEXT_FONTSIZE,textStyle);
				this.imgs.add(textImg);
			}

		if( ne.hasModernDot())
			{
				let dotLoc:number = this.calcModernDotLoc();
				this.imgs.add(new EventGlyphImg((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_DOT) | 0),dotLoc,this.imgxsize + MusicFont.CONNECTION_SCREEN_DOTX,(( STAFFPOSSCALE * dotLoc) | 0),this.UNSCALEDMainXSize + MusicFont.CONNECTION_DOTX,0,this.imgcolor));
			}

	}

	/* modern accidental */
	/* if we're showing editorial accidentals but not modern key
           signatures, make sure signature accidentals are shown as
           accidentals on individual notes */
	//err starts here
	//err ends here
	/* parentheses for 'optional' accidentals */
	/* left parens */
	/* right parens */
	/* modern text */
	/* if notehead is too low, push syllable below it */
	/* temporary hack to show dashes between syllables! */
	/* modern dot */
	/*------------------------------------------------------------------------
Method:  void addcolorbracket(int side)
Purpose: Add angle bracket to mark coloration
Parameters:
  Input:  int side - 0=left, 1=right
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public addcolorbracket(side:number):void
	{
		let STAFFPOSSCALE:number =(( this.options.getSTAFFSCALE() / 2) | 0);
		let bracketssnum:number = 10;
		let xoff:number = side == 0 ? MusicFont.CONNECTION_SCREEN_ANGBRACKETLEFT:MusicFont.CONNECTION_SCREEN_ANGBRACKETRIGHT;
		let USxoff:number = side == 0 ? MusicFont.CONNECTION_ANGBRACKETLEFT:MusicFont.CONNECTION_ANGBRACKETRIGHT;
		if( this.e.geteventtype() == Event.EVENT_NOTE)
			{
				let ne:NoteEvent =<NoteEvent> this.e;
				if( side == 0 && ne.getstemside() == NoteEvent.STEM_LEFT && ne.getstemdir() == NoteEvent.STEM_UP)
					{
						xoff -= 4;
						USxoff -= 240;
					}

			}

		this.imgs.add(new EventGlyphImg((((( MusicFont.PIC_MISCSTART + MusicFont.PIC_MISC_ANGBRACKETLEFT) | 0) + side) | 0),bracketssnum,xoff,(( STAFFPOSSCALE *( bracketssnum)) | 0),USxoff,0,Coloration.BLACK));
	}

	/*------------------------------------------------------------------------
Method:  void draw(java.awt.Graphics2D g,MusicFont mf,ImageObserver ImO,
                   double xl,double yl,double VIEWSCALE)
Purpose: Draws event into given graphical context
Parameters:
  Input:  Graphics2D g      - graphical context for drawing
          MusicFont mf      - font for drawing symbols
          ImageObserver ImO - observer for drawImage
          double xl,yl       - location in context to draw event
          double VIEWSCALE   - scaling factor
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public draw_1(g:Graphics2D,mf:MusicFont,ImO:ImageObserver,xl:number,yl:number):void
	{
		this.draw_2(g,mf,ImO,xl,yl,1);
	}

	public draw_2(g:Graphics2D,mf:MusicFont,ImO:ImageObserver,xl:number,yl:number,VIEWSCALE:number):void
	{
		if( this.multiEventList != null)
			for(
			let i:Iterator<RenderedEvent> = this.multiEventList.iterator();i.hasNext();)
			(<RenderedEvent>( i.next())).draw_2(g,mf,ImO,xl,yl,VIEWSCALE);
		else
			for(
			let i:Iterator<EventImg> = this.imgs.iterator();i.hasNext();)
			(<EventImg>( i.next())).draw_1(g,mf,ImO,xl,yl,VIEWSCALE);

	}

	/* loop through events */
	/* loop through images */
	/*------------------------------------------------------------------------
Method:  void drawHighlighted(java.awt.Graphics2D g,MusicFont mf,ImageObserver ImO,
                              double xl,double yl,double VIEWSCALE)
Purpose: Draws highlighted version of event into given graphical context
Parameters:
  Input:  Graphics2D g      - graphical context for drawing
          MusicFont mf      - font for drawing symbols
          ImageObserver ImO - observer for drawImage
          double xl,yl       - location in context to draw event
          double VIEWSCALE   - scaling factor
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public drawHighlighted(g:Graphics2D,mf:MusicFont,ImO:ImageObserver,xl:number,yl:number,VIEWSCALE:number):void
	{
		if( this.multiEventList != null)
			for(
			let i:Iterator<RenderedEvent> = this.multiEventList.iterator();i.hasNext();)
			(<RenderedEvent>( i.next())).drawHighlighted(g,mf,ImO,xl,yl,VIEWSCALE);
		else
			for(
			let i:Iterator<EventImg> = this.imgs.iterator();i.hasNext();)
			(<EventImg>( i.next())).draw(g,mf,ImO,xl,yl,Coloration.CYAN,VIEWSCALE);

	}

	/* loop through events */
	/* loop through images */
	/*------------------------------------------------------------------------
Method:  void drawLig(java.awt.Graphics2D g,MusicFont mf,ImageObserver ImO,
                      int xl,int yl)
Purpose: Draws event's ligature (original form) into given graphical context
Parameters:
  Input:  Graphics2D g      - graphical context for drawing
          MusicFont mf      - font for drawing symbols
          ImageObserver ImO - observer for drawImage
          int xl,yl         - location in context to draw event
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public drawLig(g:Graphics2D,mf:MusicFont,ImO:ImageObserver,xl:number,yl:number):void
	{
		let li:RenderedLigature = this.getLigInfo();
		let re:RenderedEvent;
		for(
		let i:Iterator<RenderedEvent> = li.rligEvents.iterator();i.hasNext();)
		{
			re =<RenderedEvent> i.next();
			if( re.getEvent_1().geteventtype() == Event.EVENT_NOTE)
				re.draw_1(g,mf,ImO,<number>( xl + re.getxloc()),yl);

		}
	}

	/*------------------------------------------------------------------------
Method:  double drawClefs(java.awt.Graphics2D g,MusicFont mf,ImageObserver ImO,
                          double xl,double yl,double VIEWSCALE)
Purpose: Draws only clef events into given graphical context
Parameters:
  Input:  Graphics2D g      - graphical context for drawing
          MusicFont mf      - font for drawing symbols
          ImageObserver ImO - observer for drawImage
          double xl,yl      - location in context to draw event
          double VIEWSCALE  - scaling factor
  Output: -
  Return: amount of x-space used
------------------------------------------------------------------------*/
	public drawClefs_1(g:Graphics2D,mf:MusicFont,ImO:ImageObserver,xl:number,yl:number,VIEWSCALE:number):number
	{
		let xs:number = 0;
		if( this.multiEventList != null)
			for(
			let i:Iterator<RenderedEvent> = this.multiEventList.iterator();i.hasNext();)
			{
				let re:RenderedEvent =<RenderedEvent> i.next();
				let ce:Event = re.getEvent_1();
				if( ce.geteventtype() == Event.EVENT_CLEF && ce.hasSignatureClef_1() &&(<ClefEvent> ce).drawInSig(this.options.get_usemodernclefs(),this.options.getUseModernAccidentalSystem()))
					{
						re.draw_2(g,mf,ImO,xl,yl,VIEWSCALE);
						if( re.getimgxsize() > xs)
							xs = re.getimgxsize();

					}

			}

		else
			if((<ClefEvent> this.getEvent_1()).drawInSig(this.options.get_usemodernclefs(),this.options.getUseModernAccidentalSystem()))
				{
					this.draw_2(g,mf,ImO,xl,yl,VIEWSCALE);
					xs = this.getimgxsize();
				}

		return xs * VIEWSCALE;
	}

	/*------------------------------------------------------------------------
Method:  double drawClefs(PDFCreator outp,PdfContentByte cb,double xl,double yl)
Purpose: Draws only clef events into PDF
Parameters:
  Input:  PDFCreator outp   - PDF-writing object
          PdfContentByte cb - PDF graphical context
          double xl,yl       - location in context to draw event
  Output: -
  Return: amount of x-space used
------------------------------------------------------------------------*/
	public drawClefs_2(outp:PDFCreator,cb:PdfContentByte,xl:number,yl:number):number
	{
		let xs:number = 0;
		if( this.multiEventList != null)
			for(
			let i:Iterator<RenderedEvent> = this.multiEventList.iterator();i.hasNext();)
			{
				let re:RenderedEvent =<RenderedEvent> i.next();
				let ce:Event = re.getEvent_1();
				if( ce.geteventtype() == Event.EVENT_CLEF && ce.hasSignatureClef_1() &&(<ClefEvent> ce).drawInSig(this.options.get_usemodernclefs(),this.options.getUseModernAccidentalSystem()))
					{
						outp.drawEvent(re,xl,yl,false,cb);
						if( re.getimgxsize() > xs)
							xs = re.getimgxsize();

					}

			}

		else
			if((<ClefEvent> this.getEvent_1()).drawInSig(this.options.get_usemodernclefs(),this.options.getUseModernAccidentalSystem()))
				{
					outp.drawEvent(this,xl,yl,false,cb);
					xs = this.getimgxsize();
				}

		return<number>( xs * PDFCreator.XEVENTSPACE_SCALE);
	}

	/*------------------------------------------------------------------------
Method:  double getClefImgXSize()
Purpose: Get x size of visible clef images only
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public getClefImgXSize():number
	{
		let xs:number = 0;
		if( this.multiEventList != null)
			for(
			let i:Iterator<RenderedEvent> = this.multiEventList.iterator();i.hasNext();)
			{
				let re:RenderedEvent =<RenderedEvent> i.next();
				let ce:Event = re.getEvent_1();
				if( ce.geteventtype() == Event.EVENT_CLEF && ce.hasSignatureClef_1() &&(<ClefEvent> ce).drawInSig(this.options.get_usemodernclefs(),this.options.getUseModernAccidentalSystem()))
					{
						if( re.getimgxsize() > xs)
							xs = re.getimgxsize();

					}

			}

		else
			if((<ClefEvent> this.getEvent_1()).drawInSig(this.options.get_usemodernclefs(),this.options.getUseModernAccidentalSystem()))
				{
					xs = this.getimgxsize();
				}

		return xs;
	}

	/*------------------------------------------------------------------------
Method:  void drawMens(java.awt.Graphics2D g,MusicFont mf,ImageObserver ImO,
                       double xl,double yl,double VIEWSCALE)
Purpose: Draws only mensuration events into given graphical context
Parameters:
  Input:  Graphics2D g      - graphical context for drawing
          MusicFont mf      - font for drawing symbols
          ImageObserver ImO - observer for drawImage
          double xl,yl       - location in context to draw event
          double VIEWSCALE   - scaling factor
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public drawMens(g:Graphics2D,mf:MusicFont,ImO:ImageObserver,xl:number,yl:number,VIEWSCALE:number):void
	{
		if( this.multiEventList != null)
			for(
			let i:Iterator<RenderedEvent> = this.multiEventList.iterator();i.hasNext();)
			{
				let re:RenderedEvent =<RenderedEvent> i.next();
				if( re.getEvent_1().geteventtype() == Event.EVENT_MENS)
					re.draw_2(g,mf,ImO,xl,yl,VIEWSCALE);

			}

		else
			this.draw_2(g,mf,ImO,xl,yl,VIEWSCALE);

	}

	/*------------------------------------------------------------------------
Method:  int calcStemDir(NoteEvent ne,boolean modernNotation)
Purpose: Calculate stem direction for note, depending on whether
         original notational elements are retained
Parameters:
  Input:  NoteEvent ne           - note to check
          boolean modernNotation - whether modern notation display is on
  Output: -
  Return: stem direction for displaying note
------------------------------------------------------------------------*/
	calcStemDir(ne:NoteEvent,modernNotation:boolean):number
	{
		if( modernNotation)
			if( this.princlef.calcypos(ne.getPitch_1()) >= 5)
				return NoteEvent.STEM_DOWN;
			else
				return NoteEvent.STEM_UP;


		else
			return ne.getstemdir();

	}

	/* take direction specified in transcription */
	/* calculate tie direction depending on notation options */
	getTieType():number
	{
		if( this.e.geteventtype() != Event.EVENT_NOTE)
			return NoteEvent.TIE_NONE;

		let ne:NoteEvent =<NoteEvent> this.e;
		if( !( this.modernNoteShapes || this.options.get_usemodernclefs()))
			return ne.getTieType();

		if( this.princlef.calcypos(ne.getPitch_1()) >= 5)
			return NoteEvent.TIE_OVER;

		return NoteEvent.TIE_UNDER;
	}

	/*------------------------------------------------------------------------
Method:  int calcDotLoc(DotEvent de,boolean usemodernclefs,RenderedEvent laste)
Purpose: Calculate staff position for displaying dot, depending on whether
         original clefs are retained
Parameters:
  Input:  -
  Output: -
  Return: staff position for displaying dot
------------------------------------------------------------------------*/
	calcDotLoc(de:DotEvent,usemodernclefs:boolean,laste:RenderedEvent):number
	{
		if( usemodernclefs && laste != null)
			return laste.calcModernDotLoc();
		else
			return de.calcYPos(this.princlef);

	}

	/* only for note events */
	calcModernDotLoc():number
	{
		let noteloc:number = this.princlef.calcypos(this.e.getFirstEventOfType_1(Event.EVENT_NOTE).getPitch_1());
		return(( noteloc +( noteloc % 2 == 0 ? 1:0)) | 0);
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public getAttachedEventIndex():number
	{
		return this.attachedEventIndex;
	}

	public getEvent_1():Event
	{
		return this.e;
	}

	public getEvent_2(i:number):RenderedEvent
	{
		return this.multiEventList.get(i);
	}

	public getEventList():LinkedList<RenderedEvent>
	{
		return this.multiEventList;
	}

	public getFullSonority():RenderedSonority
	{
		return this.fullSonority;
	}

	public getOptions():OptionSet
	{
		return this.options;
	}

	public getRenderParams():RenderParams
	{
		return this.musicparams;
	}

	public isdisplayed():boolean
	{
		return this.display;
	}

	public getmeasurenum():number
	{
		return this.musicparams.measurenum;
	}

	public getxloc():number
	{
		return this.xloc;
	}

	public getssnum():number
	{
		return this.ssnum;
	}

	public getMusicLength():Proportion
	{
		return this.musicLength;
	}

	public getmusictime():Proportion
	{
		return this.musictime;
	}

	public getrenderedxsize():number
	{
		return this.display ? this.getimgxsize():0;
	}

	public getRenderedXSizeWithoutText():number
	{
		return this.display ? this.getImgXSizeWithoutText():0;
	}

	public getxend():number
	{
		return this.xloc + this.getRenderedXSizeWithoutText();
	}

	public getimgs():ArrayList<EventImg>
	{
		return this.imgs;
	}

	public getimgxsize():number
	{
		return this.imgxsize;
	}

	public getImgXSizeWithoutText():number
	{
		return this.imgXSizeWithoutText;
	}

	public getClefEvents():RenderedClefSet
	{
		return this.musicparams.clefEvents;
	}

	public getLastClefEvent():RenderedEvent
	{
		if( this.musicparams.clefEvents == null)
			return null;

		return this.musicparams.clefEvents.getLastClefEvent();
	}

	public getAccidental():ModernAccidental
	{
		return this.accidental;
	}

	public getClef():Clef
	{
		return this.princlef;
	}

	public getMensEvent():RenderedEvent
	{
		return this.musicparams.mensEvent;
	}

	public getColoration():Coloration
	{
		return this.musicparams.curColoration;
	}

	public getProportion():Proportion
	{
		return this.musicparams.curProportion;
	}

	public getModernKeySig():ModernKeySignature
	{
		return this.e.getModernKeySig();
	}

	public inEditorialSection():boolean
	{
		return this.musicparams.inEditorialSection;
	}

	public getLigInfo():RenderedLigature
	{
		return this.musicparams.ligInfo;
	}

	public isligend():boolean
	{
		return this.ligEnd;
	}

	public getTieInfo():RenderedLigature
	{
		return this.musicparams.tieInfo;
	}

	public doubleTied():boolean
	{
		return this.musicparams.doubleTied;
	}

	public get_useligxpos():boolean
	{
		return this.useligxpos;
	}

	public getVarReadingInfo():RenderedEventGroup
	{
		return this.musicparams.varReadingInfo;
	}

	/*------------------------------------------------------------------------
Methods: void set*()
Purpose: Routines to set parameters and options
Parameters:
  Input:  new values for parameters and options
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setAttachedEventIndex(attachedEventIndex:number):void
	{
		this.attachedEventIndex = attachedEventIndex;
	}

	public setDisplay(display:boolean):void
	{
		this.display = display;
	}

	public setEvent(e:Event):void
	{
		this.e = e;
	}

	public setLigEnd(ligEnd:boolean):void
	{
		this.ligEnd = ligEnd;
		this.musicparams.endlig = ligEnd;
	}

	public setLigInfo(ligInfo:RenderedLigature):void
	{
		this.musicparams.ligInfo = ligInfo;
	}

	public setMeasureNum(newval:number):void
	{
		this.musicparams.measurenum = newval;
	}

	public setMusicLength(newval:Proportion):void
	{
		this.musicLength = Proportion.new1(newval);
	}

	public setSonority(rs:RenderedSonority):void
	{
		this.fullSonority = rs;
	}

	public setTieInfo(tieInfo:RenderedLigature):void
	{
		this.musicparams.tieInfo = tieInfo;
	}

	public setDoubleTied(doubleTied:boolean):void
	{
		this.musicparams.doubleTied = doubleTied;
	}

	public setxloc(xl:number):void
	{
		this.xloc = xl;
	}

	public setmusictime(p:Proportion):void
	{
		this.musictime = Proportion.new1(p);
	}

	/*------------------------------------------------------------------------
Method:  void prettyprint()
Purpose: Prints information about this event
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public prettyprint():void
	{
		System.out.print("X=" + this.xloc + " m=" + this.musicparams.measurenum + " ");
		this.getEvent_1().prettyprint_1();
	}
}
