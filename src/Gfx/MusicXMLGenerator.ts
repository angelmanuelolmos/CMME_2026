
import { Resources } from '../Util/Resources';
import { Exception } from '../java/lang/Exception';
import { System } from '../java/lang/System';
import { Integer } from '../java/lang/Integer';
import { StringBuffer } from '../java/lang/StringBuffer';
import { RuntimeException } from '../java/lang/RuntimeException';
import { Character } from '../java/lang/Character';
import { ScoreRenderer } from './ScoreRenderer';
import { VoiceGfxInfo } from './ScoreRenderer';
import { ScorePageRenderer } from './ScorePageRenderer';
import { RenderList } from './RenderList';
import { RenderedStaffSystem } from './RenderedStaffSystem';
import { RenderedScorePage } from './RenderedScorePage';
import { RenderedLigature } from './RenderedLigature';
import { RenderedEvent } from './RenderedEvent';
import { MeasureInfo } from './MeasureInfo';
import { OutputStream } from '../java/io/OutputStream';
import { URL } from '../java/net/URL';
import { DateFormat } from '../java/text/DateFormat';
import { FieldPosition } from '../java/text/FieldPosition';
import { SimpleDateFormat } from '../java/text/SimpleDateFormat';
import { List } from '../java/util/List';
import { Clef } from '../DataStruct/Clef';
import { Event } from '../DataStruct/Event';
import { MetaData } from '../DataStruct/MetaData';
import { ModernAccidental } from '../DataStruct/ModernAccidental';
import { ModernKeySignature } from '../DataStruct/ModernKeySignature';
import { NoteEvent } from '../DataStruct/NoteEvent';
import { PieceData } from '../DataStruct/PieceData';
import { Pitch } from '../DataStruct/Pitch';
import { Proportion } from '../DataStruct/Proportion';
import { RestEvent } from '../DataStruct/RestEvent';
import { Voice } from '../DataStruct/Voice';import { ArrayList } from '../java/util/ArrayList';




class _Attribute {
  private attr: Attr;

  constructor(attr: Attr) {
    this.attr = attr;
  }

  getValue(): string {
    return this.attr.value;
  }
}



class _Element {

//--write
    

   indexOf(e:_Element):number
  {
    return Array.from(this.element.children).indexOf(e.element);
  }

   addNamespaceDeclaration(cmmens:string ):void
  {
    this.element.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", cmmens);

  }

   set_Attribute( name:string,  value:string, ns:string | undefined = undefined):_Element
  {
    if( ns === undefined )
      this.element.setAttribute(name, value);

    else
      this.element.setAttributeNS(ns, name, value);

      return this;
  }
    
   addContent(index:number, e:_Element):_Element
   addContent( e:_Element):_Element;
   addContent(a:any, b:any = undefined)
   {
    if( arguments.length == 1 )
      this.element.appendChild(a.element);

    else  
    {
      const referenceNode = this.element.children[a]; 
      this.element.insertBefore(b.element, referenceNode);
    }


    return this;
   }
    
   setText( text:string):_Element
  {
    this.element.textContent = text;
    return this;
  }

//--write

  private element: Element;

 constructor( name:string);
  constructor( name:string,  namespace:string);
  constructor(element: Element);
  constructor(a:any, b:any = undefined)
  {
    if(arguments.length == 2 )
    {
      this.element = _Document.docWrite.createElementNS(b, a);
    }

    else
	{
		if( a instanceof Element )
			this.element = a;

		else
		this.element = _Document.docWrite.createElement(a);
	}
  }

  getName(): string {
    return this.element.tagName;
  }

  get_Attribute(name: string): _Attribute | null {
    const attr = this.element.getAttributeNode(name);
    return attr ? new _Attribute(attr) : null;
  }

  getChild(name: string, namespace?: string): _Element | null {
    const child = /*namespace
      ? this.element.querySelector(namespace + '|' + name)
      : */this.element.querySelector(name);
    return child ? new _Element(child) : null;
  }

  getChildText(name: string, namespace?: string): string | null {
    const child = this.getChild(name, namespace);
    return child ? child.getText() : null;
  }

  getChildren(name?: string, namespace?: string): ArrayList<_Element> {
    const selector = namespace ? (namespace + '|' + name) : (name || '*');
    var out = Array.from(this.element.children)
      .filter((child) => !name || child.tagName === name)
      .map((child) => new _Element(child));

    var outout:ArrayList<_Element> = new ArrayList<_Element>();
    for(var i:number = 0 ; i < out.length ; i++)
        outout.add(out[i]);

      return outout;
  }

  getText(): string {
    return this.element.textContent || "";
  }
}

class _Document {


public static  docWrite:any = undefined;
  public static create(name:string | null, ident:string| null, system:string | null):void
  {
    var doctype = name != null? document.implementation.createDocumentType(name, ident, system) : null;


    this.docWrite = document.implementation.createDocument("", "", doctype);
 }

  public doc: Document;

  constructor(doc: Document);
  constructor(root:_Element);
  constructor(a:any)
  {
    if( a instanceof Document)
      this.doc = a;

    else
    {
      this.doc = _Document.docWrite;
      _Document.docWrite = undefined;

      this.doc.appendChild(a.element);    
    }
  }



  getRoot_Element(): _Element {
    if (!this.doc.documentElement) {
      throw new Error("Document has no root element");
    }
    return new _Element(this.doc.documentElement);
  }

  
  
}

export class _XMLReader
{
  public static load (url: URL ): _Document 
	{ 
    var res:any = Resources.ensureResource(url)._content;

		if( res === undefined )
			throw new Error("Missing Resource");  
		
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(res as string, "text/xml");
    return new _Document(xmlDoc);
      
		
	} 
	
	public static parse (s: string ): _Document 
	{ 
		
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(s, "text/xml");
    return new _Document(xmlDoc);
      
		
	} 
}

class _XMLOutputter
{
  constructor( format:any)
  {

  }

   output( outputdoc:_Document,  outs:OutputStream):void
  {
    const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(outputdoc.doc);

  // Step 3: Create an invisible anchor element for downloading
  const anchor = document.createElement("a");
  anchor.href = "data:text/xml;charset=utf-8," + encodeURIComponent(xmlString); // Use data URL scheme
  anchor.download = "save.xml"; // Name of the file to save

  // Step 4: Append the anchor to the body (it won't be visible)
  document.body.appendChild(anchor);

  // Step 5: Programmatically trigger a click on the anchor to start the download
  anchor.click();

  // Step 6: Clean up by removing the anchor element (optional)
  document.body.removeChild(anchor);
  }
}

 export class MusicXMLGenerator
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	static MUSICXML_VERSION:string = "2.0";
	static MusicXMLNS:string = "http://www.musicxml.org";
	static xsins:string = "http://www.w3.org/2001/XMLSchema-instance";
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	renderedScore:ScorePageRenderer;
	musicData:PieceData;

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/* create MusicXML ID based on CMME voice number */
	static makePartID(vnum:number):string
	{
		return "P" +((( vnum + 1) | 0));
	}

	static calcIntDuration(l:Proportion,divisions:number):number
	{
		return((((((( l.i1 * divisions) | 0) * 2) | 0)) / l.i2) | 0);
	}
	static MUSICXML_NOTETYPES:string[]=["X","X","X","256th","128th","64th","32nd","16th","eighth","quarter","half","whole","breve","long"];

	static notetypeToMusicXMLNotetype(nt:number,l:Proportion):string
	{
		return MusicXMLGenerator.MUSICXML_NOTETYPES[nt];
	}

	static CMMEtoMusicXMLOctave(p:Pitch):number
	{
		return(( p.octave +( Character.codePointAt(p.noteletter,0) > Character.codePointAt("B",0) ? 1:0)) | 0);
	}

	static CMMEtoMusicXMLAccidental(acc:ModernAccidental):string
	{
		return ModernAccidental.AccidentalNames[acc.accType].toLowerCase();
	}
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: MusicXMLGenerator(ScorePageRenderer renderedScore)
Purpose:     Initialize
Parameters:
  Input:  ScorePageRenderer renderedScore - rendered data, multi-page score layout
  Output: -
------------------------------------------------------------------------*/
	public constructor(renderedScore:ScorePageRenderer)
	{
		this.renderedScore = renderedScore;
		this.musicData = renderedScore.musicData;
	}

	/*------------------------------------------------------------------------
Method:  void outputPieceData(OutputStream outs)
Purpose: Output MusicXML format file
Parameters:
  Input:  OutputStream outs - output destination
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public outputPieceData(outs:OutputStream):void
	{
		let outputDoc:_Document;
		let rootEl:_Element;
		_Document.create("score-partwise","-//Recordare//DTD MusicXML 2.0 Partwise//EN","http://www.musicxml.org/dtds/partwise.dtd");
		rootEl = new _Element("score-partwise");
		rootEl.set_Attribute("version",MusicXMLGenerator.MUSICXML_VERSION);
		rootEl.addContent(this.createIdentificationTree());
		rootEl.addContent(this.createPartListTree());
		this.addPartMusicTrees(rootEl);
		outputDoc = new _Document(rootEl);
		try
		{
			let xout:_XMLOutputter = new _XMLOutputter("");
			xout.output(outputDoc,outs);
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					System.err.println("Error writing XML doc: " + e);
				}

			else
				throw e;

		}
	}

	/* header/root */
	/* actual content */
	/* output */
	//outputDoc.setDocType("score-partwise",
	//                               "-//Recordare//DTD MusicXML 2.0 Partwise//EN",
	//                             "http://www.musicxml.org/dtds/partwise.dtd");
	/*Format.getRawFormat().setIndent("  ")*/
	/*------------------------------------------------------------------------
Method:  _Element createIdentificationTree()
Purpose: Construct tree segment "identification" for basic metadata
Parameters:
  Input:  -
  Output: -
  Return: root _Element (for this segment)
------------------------------------------------------------------------*/
	encodeDate():string
	{
		
  return new Date().toISOString().split('T')[0];
 
	}

	createIdentificationTree():_Element
	{
		let baseEl:_Element = new _Element("identification");
		let encodingEl:_Element = new _Element("encoding");
		encodingEl.addContent(new _Element("software").setText(MetaData.CMME_SOFTWARE_NAME));
		encodingEl.addContent(new _Element("encoding-date").setText(this.encodeDate()));
		encodingEl.addContent(new _Element("supports").set_Attribute("_Attribute","new-system").set_Attribute("_Element","print").set_Attribute("type","yes").set_Attribute("value","yes"));
		encodingEl.addContent(new _Element("supports").set_Attribute("_Attribute","new-page").set_Attribute("_Element","print").set_Attribute("type","yes").set_Attribute("value","yes"));
		baseEl.addContent(encodingEl);
		return baseEl;
	}

	/* encoding */
	/*------------------------------------------------------------------------
Method:  _Element createPartListTree()
Purpose: Construct tree segment "part-list" for voice information
Parameters:
  Input:  -
  Output: -
  Return: root _Element (for this segment)
------------------------------------------------------------------------*/
	createPartListTree():_Element
	{
		let baseEl:_Element = new _Element("part-list");
		baseEl.addContent(new _Element("part-group").set_Attribute("number","1").set_Attribute("type","start"));
		let vnum:number = 0;
		for(let v of this.musicData.getVoiceData())
		{
			let voiceEl:_Element = new _Element("score-part");
			voiceEl.set_Attribute("id",MusicXMLGenerator.makePartID(vnum));
			voiceEl.addContent(new _Element("part-name").setText(v.getName()));
			voiceEl.addContent(new _Element("part-abbreviation").setText(v.getAbbrevLetter()));
			baseEl.addContent(voiceEl);
			vnum ++;
		}
		baseEl.addContent(new _Element("part-group").set_Attribute("number","1").set_Attribute("type","stop"));
		return baseEl;
	}

	/* voice definitions */
	/*------------------------------------------------------------------------
Method:  void addPartMusicTrees(_Element rootEl)
Purpose: Construct tree segment for each voice and add to root
Parameters:
  Input:  -
  Output: _Element rootEl - root _Element to add parts to
  Return: -
------------------------------------------------------------------------*/
	addPartMusicTrees(rootEl:_Element):void
	{
		for(
		let vi:number = 0;vi < this.musicData.getVoiceData().length;vi ++)
		rootEl.addContent(this.createPartMusicTree(vi));
	}
	/*------------------------------------------------------------------------
Method:  _Element createPartMusicTree(int vnum)
Purpose: Construct tree segment for music of one voice
Parameters:
  Input:  int vnum - voice number (in CMME data)
  Output: -
  Return: root _Element (for this segment)
------------------------------------------------------------------------*/
	addDivisions:boolean;
	DIVISIONS:number;
	curKeySig:ModernKeySignature;
	midWord:boolean;

	createPartMusicTree(vnum:number):_Element
	{
		let baseEl:_Element = new _Element("part");
		baseEl.set_Attribute("id",MusicXMLGenerator.makePartID(vnum));
		this.addDivisions = true;
		this.DIVISIONS = 4;
		this.curKeySig = ModernKeySignature.DEFAULT_SIG;
		this.midWord = false;
		for(
		let pi:number = 0;pi < this.renderedScore.pages.size();pi ++)
		this.addPage(vnum,pi,baseEl);
		return baseEl;
	}

	/* initialize GLOBAAAAALS */
	/*------------------------------------------------------------------------
Method:  void addPage(int vnum,int pnum,_Element partEl)
Purpose: Add nodes for music of one page of one part to doc
Parameters:
  Input:  int vnum,pnum  - voice/page number
  Output: _Element partEl - root _Element to add music to
  Return: -
------------------------------------------------------------------------*/
	addPage(vnum:number,pnum:number,partEl:_Element):void
	{
		let curPage:RenderedScorePage = this.renderedScore.pages.get(pnum);
		let startSys:number = curPage.startSystem;
		let endSys:number =(((( startSys + curPage.numSystems) | 0) - 1) | 0);
		if( endSys >= this.renderedScore.systems.size())
			endSys =(( this.renderedScore.systems.size() - 1) | 0);

		for(
		let curSys:number = startSys;curSys <= endSys;curSys ++)
		this.addSystem(vnum,curSys,partEl);
	}

	/*------------------------------------------------------------------------
Method:  void addSystem(int vnum,int snum,_Element partEl)
Purpose: Add nodes for music of one system of one part to doc
Parameters:
  Input:  int vnum,snum  - voice/system number
  Output: _Element partEl - root _Element to add music to
  Return: -
------------------------------------------------------------------------*/
	addSystem(vnum:number,snum:number,partEl:_Element):void
	{
		let curSystem:RenderedStaffSystem = this.renderedScore.systems.get(snum);
		let rendererNum:number = ScoreRenderer.calcRendererNum(this.renderedScore.scoreData,curSystem.startMeasure);
		for(
		let mi:number = curSystem.startMeasure;mi <= curSystem.endMeasure;mi ++)
		{
			let m:MeasureInfo = this.renderedScore.scoreData[rendererNum].getMeasure(mi);
			let measureEl:_Element = new _Element("measure");
			measureEl.set_Attribute("number",Integer.toString((( mi + 1) | 0)));
			let _AttributesEl:_Element = this.createDivisionsEl();
			if( _AttributesEl != null)
				measureEl.addContent(_AttributesEl);

			if( this.renderedScore.scoreData[rendererNum].eventinfo[vnum]!= null)
				{
					let leftei:number = m.reventindex[vnum];
					let rightei:number = this.renderedScore.getLastEventInMeasure(snum,rendererNum,vnum,mi);
					this.addEvents(measureEl,this.renderedScore.scoreData[rendererNum],vnum,leftei,rightei);
				}

			partEl.addContent(measureEl);
		}
	}

	addEvents(measureEl:_Element,renderer:ScoreRenderer,vnum:number,leftei:number,rightei:number):void
	{
		for(
		let ei:number = leftei;ei <= rightei;ei ++)
		this.addOneEvent(measureEl,renderer.eventinfo[vnum],renderer.getEvent(vnum,ei));
	}

	addMultiEvent(measureEl:_Element,elist:RenderList,rme:RenderedEvent):void
	{
		for(let re of rme.getEventList())
		this.addOneEvent(measureEl,elist,re);
	}

	addOneEvent(measureEl:_Element,elist:RenderList,re:RenderedEvent):void
	{
		let eventEl:_Element = null;
		let e:Event = re.getEvent_1();
		let attrib:boolean = false;
		switch( e.geteventtype())
		{
			case Event.EVENT_MULTIEVENT:
			{
				this.addMultiEvent(measureEl,elist,re);
				break;
			}
			case Event.EVENT_CLEF:
			{
				if( e.hasPrincipalClef_1())
					{
						eventEl = new _Element("clef");
						let c:Clef = re.getClef();
						eventEl.addContent(new _Element("sign").setText(Clef.ClefLetters[c.cleftype]));
						eventEl.addContent(new _Element("line").setText(Integer.toString(Clef.linespaceNumToLineNum(c.linespacenum))));
						if( c.cleftype == Clef.CLEF_MODERNG8)
							eventEl.addContent(new _Element("clef-octave-change").setText("-1"));

					}

				else
					if( e.hasSignatureClef_1())
						eventEl = this.createKeyEl(re);

				attrib = true;
				break;
			}
			case Event.EVENT_REST:
			{
				eventEl = new _Element("note").addContent(new _Element("rest"));
				let reste:RestEvent =<RestEvent> e;
				this.addNoteInfoData(eventEl,elist,re,reste.getModNoteType(),reste.getLength_1());
				break;
			}
			case Event.EVENT_NOTE:
			{
				eventEl = new _Element("note");
				let ne:NoteEvent =<NoteEvent> e;
				this.addPitchData(eventEl,ne.getPitch_1(),ne.getPitchOffset());
				this.addNoteInfoData(eventEl,elist,re,ne.getnotetype_1(),ne.getLength_1());
				if( ne.hasModernDot())
					eventEl.addContent(new _Element("dot"));

				let acc:ModernAccidental = re.getAccidental();
				if( acc != null)
					eventEl.addContent(new _Element("accidental").setText(MusicXMLGenerator.CMMEtoMusicXMLAccidental(acc)));

				if( ne.getModernText() != null)
					this.addLyricData(eventEl,ne);

				break;
			}
		}
		if( eventEl == null)
			return;

		if( ! attrib)
			measureEl.addContent(eventEl);
		else
			this.addMeasureAttrib(measureEl,eventEl);

	}

	addMeasureAttrib(measureEl:_Element,eventEl:_Element):void
	{
		let _AttributesEl:_Element = measureEl.getChild("Attributes");
		if( _AttributesEl != null)
			{
				if(( eventEl.getName() == "key"))
					{
						let clefIndex:number = _AttributesEl.indexOf(_AttributesEl.getChild("clef"));
						if( clefIndex != - 1)
							{
								_AttributesEl.addContent(clefIndex,eventEl);
								return;
							}

					}

				_AttributesEl.addContent(eventEl);
			}

		else
			{
				_AttributesEl = new _Element("Attributes").addContent(eventEl);
				measureEl.addContent(_AttributesEl);
			}

	}

	/* key signature has to come before clef. ?! */
	createDivisionsEl():_Element
	{
		let _AttributesEl:_Element = null;
		if( this.addDivisions)
			_AttributesEl = new _Element("Attributes").addContent(new _Element("divisions").setText(Integer.toString(this.DIVISIONS)));

		this.addDivisions = false;
		return _AttributesEl;
	}

	createKeyEl(re:RenderedEvent):_Element
	{
		let k:ModernKeySignature = re.getModernKeySig();
		if( k.equals(this.curKeySig))
			return null;

		let eventEl:_Element = new _Element("key");
		eventEl.addContent(new _Element("fifths").setText(Integer.toString(k.getAccDistance())));
		eventEl.addContent(new _Element("mode").setText("major"));
		this.curKeySig = k;
		return eventEl;
	}

	/* duration including tie info */
	addNoteInfoData(eventEl:_Element,elist:RenderList,re:RenderedEvent,nt:number,l:Proportion):void
	{
		eventEl.addContent(new _Element("duration").setText(Integer.toString(MusicXMLGenerator.calcIntDuration(l,this.DIVISIONS))));
		let tieInfo:RenderedLigature = re.getTieInfo();
		if( tieInfo.firstEventNum != - 1)
			{
				let tieEl:_Element = new _Element("tie");
				let tre1:RenderedEvent = elist.getEvent(tieInfo.firstEventNum);
				tieEl.set_Attribute("type",( tre1 == re) ? "start":"stop");
				eventEl.addContent(tieEl);
				if( re.doubleTied())
					eventEl.addContent(new _Element("tie").set_Attribute("type","start"));

			}

		eventEl.addContent(new _Element("type").setText(MusicXMLGenerator.notetypeToMusicXMLNotetype(nt,l)));
	}

	addPitchData(eventEl:_Element,p:Pitch,acc:ModernAccidental):void
	{
		let pitchEl:_Element = new _Element("pitch").addContent(new _Element("step").setText(p.noteletter));
		let alter:number =( acc != null) ? acc.pitchOffset:0;
		if( alter != 0)
			pitchEl.addContent(new _Element("alter").setText(Integer.toString(alter)));

		pitchEl.addContent(new _Element("octave").setText(Integer.toString(MusicXMLGenerator.CMMEtoMusicXMLOctave(p))));
		eventEl.addContent(pitchEl);
	}

	addLyricData(eventEl:_Element,ne:NoteEvent):void
	{
		let lyricEl:_Element = new _Element("lyric");
		let syllabicType:string = "";
		if( ne.isWordEnd())
			{
				syllabicType = this.midWord ? "end":"single";
				this.midWord = false;
			}

		else
			if( this.midWord)
				syllabicType = "middle";
			else
				{
					syllabicType = "begin";
					this.midWord = true;
				}

		lyricEl.addContent(new _Element("syllabic").setText(syllabicType));
		lyricEl.addContent(new _Element("text").setText(ne.getModernText()));
		eventEl.addContent(lyricEl);
	}
}
