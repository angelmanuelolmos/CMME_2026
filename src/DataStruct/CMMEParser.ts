
import { Resources } from '../Util/Resources';
import { Exception } from '../java/lang/Exception';
import { System } from '../java/lang/System';
import { Integer } from '../java/lang/Integer';
import { Float } from '../java/lang/Float';
import { RuntimeException } from '../java/lang/RuntimeException';
import { NumberFormatException } from '../java/lang/NumberFormatException';
import { VoiceMensuralData } from './VoiceMensuralData';
import { VoiceEventListData } from './VoiceEventListData';
import { VoiceChantData } from './VoiceChantData';
import { Voice } from './Voice';
import { VariantVersionData } from './VariantVersionData';
import { VariantReading } from './VariantReading';
import { VariantMarkerEvent } from './VariantMarkerEvent';
import { TacetInfo } from './TacetInfo';
import { Signum } from './Signum';
import { RestEvent } from './RestEvent';
import { ProportionEvent } from './ProportionEvent';
import { Proportion } from './Proportion';
import { Pitch } from './Pitch';
import { PieceData } from './PieceData';
import { OriginalTextEvent } from './OriginalTextEvent';
import { NoteEvent } from './NoteEvent';
import { MusicTextSection } from './MusicTextSection';
import { MusicSection } from './MusicSection';
import { MusicMensuralSection } from './MusicMensuralSection';
import { MusicChantSection } from './MusicChantSection';
import { MultiEvent } from './MultiEvent';
import { ModernKeySignatureEvent } from './ModernKeySignatureEvent';
import { ModernKeySignatureElement } from './ModernKeySignatureElement';
import { ModernKeySignature } from './ModernKeySignature';
import { ModernAccidental } from './ModernAccidental';
import { MetaData } from './MetaData';
import { Mensuration } from './Mensuration';
import { MensSignElement } from './MensSignElement';
import { MensEvent } from './MensEvent';
import { LineEndEvent } from './LineEndEvent';
import { LacunaEvent } from './LacunaEvent';
import { Event } from './Event';
import { DotEvent } from './DotEvent';
import { CustosEvent } from './CustosEvent';
import { ColorChangeEvent } from './ColorChangeEvent';
import { Coloration } from './Coloration';
import { ClefEvent } from './ClefEvent';
import { Clef } from './Clef';
import { BarlineEvent } from './BarlineEvent';
import { AnnotationTextEvent } from './AnnotationTextEvent';
import { URL } from '../java/net/URL';
import { OutputStream } from '../java/io/OutputStream';
import { InputStream } from '../java/io/InputStream';
import { IOException } from '../java/io/IOException';
import { ArrayList } from '../java/util/ArrayList';
import { Iterator } from '../java/util/Iterator';
import { List } from '../java/util/List';
import { LinkedList } from '../java/util/LinkedList';
//import org.w3c.dom.Attr;
//import DataStruct.XMLReader;
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   CMMEParser
Extends: -
Purpose: Input, parsing, and output of CMME music files
------------------------------------------------------------------------*/
import { JProgressBar } from '../javax/swing/JProgressBar';



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

 export class CMMEParser
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	static cmmens:string;
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public piece:PieceData;
	fileVersion:number;

	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  String getFileVersion(URL remoteloc)
Purpose: Return version of CMME file
Parameters:
  Input:  URL remoteloc - URL for input
  Output: -
  Return: Version as specified in CMMEversion _Attribute, "0.5" for old files
          with no version information
------------------------------------------------------------------------*/
	public static getFileVersion_1(remoteloc:URL):string
	{
		let CMMEdoc:_Document = _XMLReader.load(remoteloc);
		let CMMEversion:_Attribute = CMMEdoc.getRoot_Element().get_Attribute("CMMEversion");
		if( CMMEversion == null)
			return "0.5";
		else
			return CMMEversion.getValue();

	}

	public static new0(fn:string,pbar:JProgressBar):CMMEParser
	{
		let _new0:CMMEParser = new CMMEParser;
		CMMEParser.set0(_new0,fn,pbar);
		return _new0;
	}

	public static set0(new0:CMMEParser,fn:string,pbar:JProgressBar):void
	{
		new0.constructPieceData(_XMLReader.parse(fn),pbar);
	}

	public static new1(fn:string):CMMEParser
	{
		let _new1:CMMEParser = new CMMEParser;
		CMMEParser.set1(_new1,fn);
		return _new1;
	}

	public static set1(new1:CMMEParser,fn:string):void
	{
		CMMEParser.set0(new1,fn,null);
	}

	public static new2(remoteloc:URL,pbar:JProgressBar):CMMEParser
	{
		let _new2:CMMEParser = new CMMEParser;
		CMMEParser.set2(_new2,remoteloc,pbar);
		return _new2;
	}

	public static set2(new2:CMMEParser,remoteloc:URL,pbar:JProgressBar):void
	{
		new2.constructPieceData(_XMLReader.load(remoteloc),pbar);
	}

	public static new3(remoteloc:URL):CMMEParser
	{
		let _new3:CMMEParser = new CMMEParser;
		CMMEParser.set3(_new3,remoteloc);
		return _new3;
	}

	public static set3(new3:CMMEParser,remoteloc:URL):void
	{
		CMMEParser.set2(new3,remoteloc,null);
	}

	public static new4(musIn:InputStream,pbar:JProgressBar):CMMEParser
	{
		let _new4:CMMEParser = new CMMEParser;
		CMMEParser.set4(_new4,musIn,pbar);
		return _new4;
	}

	public static set4(new4:CMMEParser,musIn:InputStream,pbar:JProgressBar):void
	{
		throw new RuntimeException();
	}
	//constructPieceData(XMLReader.getParser().build(musIn),pbar);
	/*------------------------------------------------------------------------
Method:  void constructPieceData(_Document cmmedoc)
Purpose: Use parsed _Document to construct data structure for piece
Parameters:
  Input:  _Document cmmedoc - DOM tree holding CMME data
  Output: -
  Return: -
------------------------------------------------------------------------*/
	/* parameters for use while parsing one voice */
	clefinfoevent:Event[];
	mensinfoevent:Event[];
	curcolor:Coloration[];
	curModKeySig:ModernKeySignature[];
	lastevent:Event[];
	lastNoteEvent:NoteEvent;

	constructPieceData(cmmedoc:_Document,progressBar:JProgressBar):void
	{
		this.piece = PieceData.new0();
		CMMEParser.cmmens = "http://www.cmme.org";
		this.fileVersion = 0;
		let CMMEversion:_Attribute = cmmedoc.getRoot_Element().get_Attribute("CMMEversion");
		if( CMMEversion == null)
			System.err.println("Deprecated _Document version (pre-.81)");
		else
			this.fileVersion = Float.parseFloat(CMMEversion.getValue());

		let GDNode:_Element = cmmedoc.getRoot_Element().getChild("GeneralData",CMMEParser.cmmens);
		this.piece.setGeneralData(GDNode.getChildText("Title",CMMEParser.cmmens),GDNode.getChildText("Section",CMMEParser.cmmens),GDNode.getChildText("Composer",CMMEParser.cmmens),GDNode.getChildText("Editor",CMMEParser.cmmens),GDNode.getChildText("PublicNotes",CMMEParser.cmmens),GDNode.getChildText("Notes",CMMEParser.cmmens));
		let BC:_Element = GDNode.getChild("BaseColoration",CMMEParser.cmmens);
		if( BC != null)
			this.piece.setBaseColoration(this.parseColoration(BC));

		if( GDNode.getChild("Incipit",CMMEParser.cmmens) != null)
			this.piece.setIncipitScore(true);

		let VDNode:_Element = cmmedoc.getRoot_Element().getChild("VoiceData",CMMEParser.cmmens);
		let numvoices:number = Integer.parseInt(VDNode.getChildText("NumVoices",CMMEParser.cmmens));
		let vl:Voice[]= Array(numvoices);
		this.clefinfoevent = Array(numvoices);
		this.mensinfoevent = Array(numvoices);
		this.curcolor = Array(numvoices);
		this.curModKeySig = Array(numvoices);
		this.lastevent = Array(numvoices);
		let vi:number = 0;
		for(let curObj of VDNode.getChildren("Voice",CMMEParser.cmmens))
		{
			let curvel:_Element =<_Element> curObj;
			let suggestedModernClef:Clef = null;
			if( curvel.getChild("SuggestedModernClef",CMMEParser.cmmens) != null)
				suggestedModernClef = Clef.DefaultModernClefs[Clef.strToCleftype(curvel.getChildText("SuggestedModernClef",CMMEParser.cmmens))];

			let curv:Voice = Voice.new0(this.piece,(( vi + 1) | 0),curvel.getChildText("Name",CMMEParser.cmmens),curvel.getChild("Editorial",CMMEParser.cmmens) != null,suggestedModernClef);
			this.clefinfoevent[vi]= null;
			this.mensinfoevent[vi]= null;
			this.curcolor[vi]= this.piece.getBaseColoration();
			this.curModKeySig[vi]= ModernKeySignature.DEFAULT_SIG;
			this.lastevent[vi]= null;
			vl[( vi ++)]= curv;
		}
		this.piece.setVoiceData(vl);
		let varVersionNum:number = 0;
		if( this.fileVersion < 0.895)
			this.piece.addVariantVersion(VariantVersionData.new0("Default",varVersionNum ++));

		for(let curObj of GDNode.getChildren("VariantVersion",CMMEParser.cmmens))
		{
			let curVVel:_Element =<_Element> curObj;
			let vvd:VariantVersionData = VariantVersionData.new0(curVVel.getChildText("ID",CMMEParser.cmmens),varVersionNum ++);
			let sourceEl:_Element = curVVel.getChild("Source",CMMEParser.cmmens);
			if( sourceEl != null)
				try
				{
					vvd.setSourceInfo(sourceEl.getChildText("Name",CMMEParser.cmmens),Integer.parseInt(sourceEl.getChildText("ID",CMMEParser.cmmens)));
				}
				catch( e)
				{
					if( e instanceof NumberFormatException)
						{
						}

					else
						throw e;

				}

			vvd.setEditor(curVVel.getChildText("Editor",CMMEParser.cmmens));
			vvd.setDescription(curVVel.getChildText("Description",CMMEParser.cmmens));
			let mvEl:_Element = curVVel.getChild("MissingVoices",CMMEParser.cmmens);
			if( mvEl != null)
				for(let curMVObj of mvEl.getChildren("VoiceNum",CMMEParser.cmmens))
				{
					let curMVel:_Element =<_Element> curMVObj;
					let vnum:number = 1;
					try
					{
						vnum = Integer.parseInt(curMVel.getText());
					}
					catch( e)
					{
						if( e instanceof NumberFormatException)
							{
							}

						else
							throw e;

					}
					for(let v of this.piece.getVoiceData())
					if( v.getNum() == vnum)
						vvd.setMissingVoice(v,true);

				}

			this.piece.addVariantVersion(vvd);
		}
		let sectionList:List<_Element> = cmmedoc.getRoot_Element().getChildren("MusicSection",CMMEParser.cmmens);
		let numSections:number = sectionList.size();
		let PBAdd:number = 0;
		if( progressBar != null)
			PBAdd =((((( progressBar.getMaximum() - progressBar.getValue()) | 0)) / numSections) | 0);

		for(let curObj of sectionList)
		{
			let sectionEl:_Element =<_Element> curObj;
			let editorialSection:boolean = false;
			let sectionSource:string = null;
			let sectionSourceNum:number = 0;
			let curSection:MusicSection = null;
			for(let curSectionChildObj of sectionEl.getChildren())
			{
				let curSectionChild:_Element =<_Element> curSectionChildObj;
				let childName:string = curSectionChild.getName();
				if( childName ==( "Editorial"))
					editorialSection = true;
				else
					if( childName ==( "PrincipalSource"))
						{
							sectionSource = curSectionChild.getChildText("Name",CMMEParser.cmmens);
							sectionSourceNum = Integer.parseInt(curSectionChild.getChildText("ID",CMMEParser.cmmens));
						}

					else
						if( childName ==( "MensuralMusic"))
							curSection = this.parseMensuralMusicSection(curSectionChild);
						else
							if( childName ==( "Plainchant"))
								curSection = this.parsePlainchantSection(curSectionChild);
							else
								if( childName ==( "Text"))
									curSection = this.parseTextSection(curSectionChild);

			}
			curSection.setEditorial(editorialSection);
			curSection.setPrincipalSource(sectionSource);
			curSection.setPrincipalSourceNum(sectionSourceNum);
			this.piece.addSection_2(curSection);
			if( progressBar != null)
				progressBar.setValue((( progressBar.getValue() + PBAdd) | 0));

		}
		this.piece.recalcAllEventParams();
	}

	/* version */
	/* General data section */
	/* Voice data section */
	/* Variant version declarations */
	/* pre-0.895 files do not declare the "default" variant version;
         create one */
	/* Music sections */
	//        curSection.setVersion(piece.getVariantVersions().get(0));
	/*------------------------------------------------------------------------
Method:  MusicMensuralSection parseMensuralMusicSection(_Element curSectionEl)
Purpose: Create section of mensural music from _Document tree segment
Parameters:
  Input:  _Element curSectionEl - tree segment representing mensural music section
  Output: -
  Return: mensural music section
------------------------------------------------------------------------*/
	parseMensuralMusicSection(curSectionEl:_Element):MusicMensuralSection
	{
		let numVoices:number = Integer.parseInt(curSectionEl.getChildText("NumVoices",CMMEParser.cmmens));
		let sectionVoiceNum:number = 0;
		let curSection:MusicMensuralSection = MusicMensuralSection.new2(this.piece.getVoiceData().length,false,this.piece.getBaseColoration());
		if( curSectionEl.getChild("BaseColoration",CMMEParser.cmmens) != null)
			curSection.setBaseColoration(this.parseColoration(curSectionEl.getChild("BaseColoration",CMMEParser.cmmens)));

		for(
		let vi:number = 0;vi < this.curcolor.length;vi ++)
		this.curcolor[vi]= curSection.getBaseColoration();
		this.parseTacetInstructions(curSectionEl,curSection);
		for(let curObj of curSectionEl.getChildren("Voice",CMMEParser.cmmens))
		{
			let curVoiceEl:_Element =<_Element> curObj;
			let vnum:number =(( Integer.parseInt(curVoiceEl.getChildText("VoiceNum",CMMEParser.cmmens)) - 1) | 0);
			this.lastNoteEvent = null;
			let curv:VoiceMensuralData = VoiceMensuralData.new3(this.piece.getVoiceData()[vnum],curSection);
			for(let curMVObj of curVoiceEl.getChildren("MissingVersionID",CMMEParser.cmmens))
			curv.addMissingVersion(this.piece.getVariantVersion_2((<_Element> curMVObj).getText()));
			for(let curEvObj of curVoiceEl.getChild("EventList",CMMEParser.cmmens).getChildren())
			{
				let cureventel:_Element =<_Element> curEvObj;
				let eventtype:string = cureventel.getName();
				if( eventtype ==( "VariantReadings"))
					this.addVariantReadings(vnum,curv,cureventel);
				else
					if( eventtype ==( "EditorialData"))
						this.addEditorialEvents(vnum,curv,cureventel);
					else
						this.addSingleOrMultiEvent_1(curv,cureventel);

			}
			this.addNewEvent(vnum,curv,Event.new1(Event.EVENT_SECTIONEND));
			curSection.setVoice_1(vnum,curv);
		}
		return curSection;
	}

	/* event list for one voice */
	/* create structure for current event depending on type */
	/* add SectionEnd event at end of each voice */
	/* set voice data in section */
	/*------------------------------------------------------------------------
Method:  MusicChantSection parsePlainchantSection(_Element curSectionEl)
Purpose: Create section of plainchant from _Document tree segment
Parameters:
  Input:  _Element curSectionEl - tree segment representing plainchant section
  Output: -
  Return: plainchant section
------------------------------------------------------------------------*/
	parsePlainchantSection(curSectionEl:_Element):MusicChantSection
	{
		let numVoices:number = Integer.parseInt(curSectionEl.getChildText("NumVoices",CMMEParser.cmmens));
		let curSection:MusicChantSection = MusicChantSection.new0(this.piece.getVoiceData().length,false,Coloration.DEFAULT_CHANT_COLORATION);
		if( curSectionEl.getChild("BaseColoration",CMMEParser.cmmens) != null)
			curSection.setBaseColoration(this.parseColoration(curSectionEl.getChild("BaseColoration",CMMEParser.cmmens)));

		for(
		let vi:number = 0;vi < this.curcolor.length;vi ++)
		this.curcolor[vi]= curSection.getBaseColoration();
		this.parseTacetInstructions(curSectionEl,curSection);
		for(let curObj of curSectionEl.getChildren("Voice",CMMEParser.cmmens))
		{
			let curVoiceEl:_Element =<_Element> curObj;
			let vnum:number =(( Integer.parseInt(curVoiceEl.getChildText("VoiceNum",CMMEParser.cmmens)) - 1) | 0);
			this.lastNoteEvent = null;
			let curv:VoiceChantData = VoiceChantData.new1(this.piece.getVoiceData()[vnum],curSection);
			for(let curMVObj of curVoiceEl.getChildren("MissingVersionID",CMMEParser.cmmens))
			curv.addMissingVersion(this.piece.getVariantVersion_2((<_Element> curMVObj).getText()));
			for(let curEvObj of curVoiceEl.getChild("EventList",CMMEParser.cmmens).getChildren())
			{
				let cureventel:_Element =<_Element> curEvObj;
				let eventtype:string = cureventel.getName();
				if( eventtype ==( "VariantReadings"))
					this.addVariantReadings(vnum,curv,cureventel);
				else
					if( eventtype ==( "EditorialData"))
						this.addEditorialEvents(vnum,curv,cureventel);
					else
						this.addSingleOrMultiEvent_1(curv,cureventel);

			}
			this.addNewEvent(vnum,curv,Event.new1(Event.EVENT_SECTIONEND));
			curSection.setVoice_1(vnum,curv);
		}
		return curSection;
	}

	/* event list for one voice */
	/* create structure for current event depending on type */
	/* add SectionEnd event at end of each voice */
	/* set voice data in section */
	/*------------------------------------------------------------------------
Method:  void parseTacetInstructions(_Element curSectionEl,MusicSection curSection)
Purpose: Parse list of tacet instructions and add to section
Parameters:
  Input:  _Element curSectionEl - tree segment representing section
  Output: MusicSection curSection - section being created
  Return: -
------------------------------------------------------------------------*/
	parseTacetInstructions(curSectionEl:_Element,curSection:MusicSection):void
	{
		for(let curObj of curSectionEl.getChildren("TacetInstruction",CMMEParser.cmmens))
		{
			let curTacetEl:_Element =<_Element> curObj;
			curSection.setTacetText((( Integer.parseInt(curTacetEl.getChildText("VoiceNum",CMMEParser.cmmens)) - 1) | 0),curTacetEl.getChildText("TacetText",CMMEParser.cmmens));
		}
	}

	/*------------------------------------------------------------------------
Method:  MusicTextSection parseTextSection(_Element curSectionEl)
Purpose: Create text section from _Document tree segment
Parameters:
  Input:  _Element curSectionEl - tree segment representing section
  Output: -
  Return: text section
------------------------------------------------------------------------*/
	parseTextSection(curSectionEl:_Element):MusicTextSection
	{
		let sectionText:string = curSectionEl.getChildText("Content",CMMEParser.cmmens);
		let curSection:MusicTextSection = MusicTextSection.new5(sectionText);
		return curSection;
	}
	/*------------------------------------------------------------------------
Method:  void addVariantReadings(int vnum,VoiceEventListData v,_Element varRootEl)
Purpose: Parse segment of variant readings and add to voice data
Parameters:
  Input:  int vnum             - voice number
          _Element varRootEl    - root variant node to parse
  Output: VoiceEventListData v - voice being constructed
  Return: -
------------------------------------------------------------------------*/
	parsingVariant:boolean = false;

	addVariantReadings(vnum:number,v:VoiceEventListData,varRootEl:_Element):void
	{
		let varStarti:number = v.getNumEvents();
		let vd1:VariantMarkerEvent = VariantMarkerEvent.new33(Event.EVENT_VARIANTDATA_START);
		this.addNewEvent(vnum,v,vd1);
		this.lastevent[vnum]= vd1;
		for(let reObj of varRootEl.getChildren("Reading",CMMEParser.cmmens))
		{
			let curReadingEl:_Element =<_Element> reObj;
			let curReading:VariantReading = null;
			let versionIDList:List<_Element> = curReadingEl.getChildren("VariantVersionID",CMMEParser.cmmens);
			let evList:VoiceEventListData = null;
			let readingVnum:number = vnum;
			if( versionIDList.size() == 1 && "DEFAULT" ==( curReadingEl.getChildText("VariantVersionID",CMMEParser.cmmens)))
				evList = v;
			else
				if( versionIDList.size() > 0)
					{
						this.parsingVariant = true;
						curReading = VariantReading.new0();
						for(let vIDe of versionIDList)
						curReading.addVersion(this.piece.getVariantVersion_2((<_Element> vIDe).getText()));
						if( curReadingEl.getChild("Error",CMMEParser.cmmens) != null)
							curReading.setError(true);

						if( v instanceof VoiceMensuralData)
							evList = VoiceMensuralData.new4();
						else
							if( v instanceof VoiceChantData)
								evList = VoiceChantData.new2();

					}

			this.addEventList(readingVnum,evList,curReadingEl.getChild("Music",CMMEParser.cmmens));
			if( curReading != null)
				{
					curReading.addEventList_1(evList);
					vd1.addReading(curReading);
				}

			this.parsingVariant = false;
		}
		let vd2:VariantMarkerEvent = VariantMarkerEvent.new34(Event.EVENT_VARIANTDATA_END,vd1.getReadings());
		this.addNewEvent(vnum,v,vd2);
		this.lastevent[vnum]= vd2;
		vd1.calcVariantTypes(v);
		vd2.setVarTypeFlags(vd1.getVarTypeFlags());
	}

	//            readingVnum=-1;
	/*------------------------------------------------------------------------
Method:  void addEventList(int vnum,VoiceEventListData v,_Element elistEl)
Purpose: Parse event list for one default or variant reading
Parameters:
  Input:  int vnum             - voice number for event list (-1 for variant)
          _Element elistEl      - root node of event list tree
  Output: VoiceEventListData v - list being constructed
  Return: -
------------------------------------------------------------------------*/
	addEventList(vnum:number,v:VoiceEventListData,elistEl:_Element):void
	{
		for(
		let ei:Iterator<_Element> = elistEl.getChildren().iterator();ei.hasNext();)
		{
			this.addSingleOrMultiEvent_2(vnum,v,<_Element> ei.next());
		}
	}

	/*        if (vnum!=-1)
          lastevent[vnum].setEditorial(true);*/
	/*------------------------------------------------------------------------
Method:  void addEditorialEvents(int vnum,VoiceEventListData v,_Element cureventel)
Purpose: Parse one editorial event list (for backwards compatibility) and
         add to event list of a given voice
Parameters:
  Input:  int vnum             - voice number (-1 for variant)
          _Element cureventel   - event node to parse
  Output: VoiceEventListData v - voice being constructed
  Return: -
------------------------------------------------------------------------*/
	addEditorialEvents(vnum:number,v:VoiceEventListData,cureventel:_Element):void
	{
		let ed:Event = AnnotationTextEvent.new3("ED DATA START");
		this.addNewEvent(vnum,v,ed);
		this.lastevent[vnum]= ed;
		for(
		let edei:Iterator<_Element> = cureventel.getChild("NewReading",CMMEParser.cmmens).getChildren().iterator();edei.hasNext();)
		this.addSingleOrMultiEvent_1(v,<_Element> edei.next());
		this.addNewEvent(vnum,v,ed = AnnotationTextEvent.new3("ED DATA END"));
		this.lastevent[vnum]= ed;
	}

	/*------------------------------------------------------------------------
Method:  void addNewEvent(int vnum,VoiceEventListData v,Event e)
Purpose: Add one parsed event to event list of a given voice
Parameters:
  Input:  int vnum             - voice number (-1 for variant)
          Event e              - parsed event
  Output: VoiceEventListData v - voice being constructed
  Return: -
------------------------------------------------------------------------*/
	addNewEvent(vnum:number,v:VoiceEventListData,e:Event):void
	{
		if( vnum != - 1)
			{
				e.setclefparams(this.clefinfoevent[vnum]);
				e.setmensparams_1(this.mensinfoevent[vnum]);
				e.setcolorparams_1(this.curcolor[vnum]);
				e.setModernKeySigParams(this.curModKeySig[vnum]);
			}

		v.addEvent_1(e);
	}

	/*------------------------------------------------------------------------
Method:  void addSingleOrMultiEvent(VoiceEventListData v,_Element cureventel)
Purpose: Parse one event and add to event list of a given voice
Parameters:
  Input:  _Element cureventel   - event node to parse
  Output: VoiceEventListData v - voice being constructed
  Return: -
------------------------------------------------------------------------*/
	addSingleOrMultiEvent_1(v:VoiceEventListData,cureventel:_Element):void
	{
		this.addSingleOrMultiEvent_2((( v.getMetaData().getNum() - 1) | 0),v,cureventel);
	}

	addSingleOrMultiEvent_2(vnum:number,v:VoiceEventListData,cureventel:_Element):void
	{
		let eventtype:string = cureventel.getName();
		let curevent:Event;
		if( eventtype ==( "MultiEvent"))
			curevent = this.parseMultiEvent(vnum,cureventel);
		else
			curevent = this.parseSingleEvent(vnum,cureventel);

		this.addNewEvent(vnum,v,curevent);
		if( vnum != - 1)
			this.lastevent[vnum]= curevent;

	}

	/* add event to list */
	/* add data-free marker for end of lacunae 
    if (curevent.geteventtype()==Event.EVENT_LACUNA)
      addNewEvent(vnum,v,curevent=new Event(Event.EVENT_LACUNA_END));*/
	/*------------------------------------------------------------------------
Method:  MultiEvent parseMultiEvent(int vnum,_Element cureventel)
Purpose: Create multi-event (list of simultaneous events) from _Document
         tree segment
Parameters:
  Input:  int vnum           - voice number
          _Element cureventel - multi-event node
  Output: -
  Return: multi-event
------------------------------------------------------------------------*/
	parseMultiEvent(vnum:number,cureventel:_Element):MultiEvent
	{
		let curevent:MultiEvent = MultiEvent.new23();
		let curclefevent:Event = this.clefinfoevent[vnum];
		for(
		let ei:Iterator<_Element> = cureventel.getChildren().iterator();ei.hasNext();)
		{
			let e:Event = this.parseSingleEvent(vnum,<_Element> ei.next());
			curevent.addEvent(e);
			if( vnum != - 1 && this.mensinfoevent[vnum]== e)
				this.mensinfoevent[vnum]= curevent;

		}
		if( curevent.hasSignatureClef_1())
			{
				curevent.constructClefSets_1(this.lastevent[vnum],curclefevent);
				this.checkClefInfoEvent(vnum,curevent);
			}

		return curevent;
	}

	/*------------------------------------------------------------------------
Method:  Event parseSingleEvent(int vnum,_Element cureventel)
Purpose: Create single event from _Document tree segment
Parameters:
  Input:  int vnum           - voice number
          _Element cureventel - event node
  Output: -
  Return: event
------------------------------------------------------------------------*/
	parseSingleEvent(vnum:number,cureventel:_Element):Event
	{
		let curevent:Event;
		let eventtype:string = cureventel.getName();
		if( eventtype ==( "Clef"))
			{
				curevent = this.parseClefEvent(vnum,cureventel,this.lastevent[vnum]);
				this.checkClefInfoEvent(vnum,curevent);
			}

		else
			if( eventtype ==( "Mensuration"))
				{
					curevent = this.parseMensurationEvent(cureventel);
					if( vnum != - 1)
						this.mensinfoevent[vnum]= curevent;

				}

			else
				if( eventtype ==( "Rest"))
					curevent = this.parseRestEvent(cureventel,this.mensinfoevent[vnum]);
				else
					if( eventtype ==( "Note"))
						curevent = this.parseNoteEvent(cureventel,this.clefinfoevent[vnum],this.curModKeySig[vnum]);
					else
						if( eventtype ==( "Dot"))
							curevent = this.parseDotEvent(cureventel,this.mensinfoevent[vnum],this.clefinfoevent[vnum]);
						else
							if( eventtype ==( "OriginalText"))
								curevent = this.parseOriginalTextEvent(cureventel);
							else
								if( eventtype ==( "Proportion"))
									curevent = this.parseProportionEvent(cureventel);
								else
									if( eventtype ==( "ColorChange"))
										{
											curevent = this.parseColorChangeEvent(cureventel,this.curcolor[vnum]);
											if( vnum != - 1)
												this.curcolor[vnum]=(<ColorChangeEvent> curevent).getcolorscheme();

										}

									else
										if( eventtype ==( "Custos"))
											curevent = this.parseCustosEvent(cureventel,this.clefinfoevent[vnum]);
										else
											if( eventtype ==( "LineEnd"))
												curevent = this.parseLineEndEvent(cureventel);
											else
												if( eventtype ==( "MiscItem"))
													curevent = this.parseMiscItemEvent(cureventel);
												else
													if( eventtype ==( "ModernKeySignature"))
														{
															curevent = this.parseModernKeySignatureEvent(cureventel);
															if( vnum != - 1)
																this.curModKeySig[vnum]=(<ModernKeySignatureEvent> curevent).getSigInfo();

														}

													else
														{
															System.err.println("Unknown event type: " + eventtype);
															curevent = Event.new0();
														}

		if( vnum != - 1)
			{
				curevent.setclefparams(this.clefinfoevent[vnum]);
				curevent.setmensparams_1(this.mensinfoevent[vnum]);
				curevent.setcolorparams_1(this.curcolor[vnum]);
				curevent.setModernKeySigParams(this.curModKeySig[vnum]);
			}

		if( cureventel.getChild("Colored",CMMEParser.cmmens) != null)
			curevent.setColored_1(true);

		if( cureventel.getChild("Editorial",CMMEParser.cmmens) != null)
			curevent.setEditorial(true);

		if( cureventel.getChild("Error",CMMEParser.cmmens) != null)
			curevent.setError(true);

		curevent.setEdCommentary(cureventel.getChildText("EditorialCommentary",CMMEParser.cmmens));
		return curevent;
	}

	/* generic event _Attributes */
	/*------------------------------------------------------------------------
Method:  void checkClefInfoEvent(int vnum,Event e)
Purpose: Check whether an event has clef/signature info, and set voice
         params if necessary
Parameters:
  Input:  int vnum - voice number
          Event e  - event to check
  Output: -
  Return: -
------------------------------------------------------------------------*/
	checkClefInfoEvent(vnum:number,e:Event):void
	{
		if( e.hasSignatureClef_1() && vnum != - 1 && ! this.parsingVariant &&( this.clefinfoevent[vnum]== null || e.getClefSet_1() != this.clefinfoevent[vnum].getClefSet_1()))
			{
				this.clefinfoevent[vnum]= e;
				this.curModKeySig[vnum]= e.getClefSet_1().getKeySig();
			}

	}

	/*------------------------------------------------------------------------
Method:  Event parseClefEvent(int vnum,_Element e,Event le)
Purpose: Create clef event from _Document tree segment
Parameters:
  Input:  int vnum  - voice number
          _Element e - "Clef" node
          Event le  - last event parsed
  Output: -
  Return: clef event
------------------------------------------------------------------------*/
	parseClefEvent(vnum:number,e:_Element,le:Event):Event
	{
		return ClefEvent.new6(e.getChildText("Appearance",CMMEParser.cmmens),Integer.parseInt(e.getChildText("StaffLoc",CMMEParser.cmmens)),Pitch.new1(e.getChild("Pitch",CMMEParser.cmmens).getChildText("LetterName",CMMEParser.cmmens).substring(0,1),Integer.parseInt(e.getChild("Pitch",CMMEParser.cmmens).getChildText("OctaveNum",CMMEParser.cmmens))),le,vnum >= 0 ? this.clefinfoevent[vnum]:null,e.getChild("Signature",CMMEParser.cmmens) != null);
	}

	/*------------------------------------------------------------------------
Method:  Event parseMensurationEvent(_Element e)
Purpose: Create mensuration event from _Document tree segment
Parameters:
  Input:  _Element e - "Mensuration" node
  Output: -
  Return: mensuration event
------------------------------------------------------------------------*/
	parseMensurationEvent(e:_Element):Event
	{
		let signs:LinkedList<MensSignElement> = new LinkedList<MensSignElement>();
		let mensInfo:Mensuration = null;
		let ssnum:number = 4;
		let vertical:boolean = false;
		let small:boolean = false;
		let noScoreSig:boolean = false;
		let curmensel:_Element;
		for(
		let i:Iterator<_Element> = e.getChildren().iterator();i.hasNext();)
		{
			curmensel =<_Element> i.next();
			if( curmensel.getName() ==( "Sign"))
				{
					let ms:string = curmensel.getChildText("MainSymbol",CMMEParser.cmmens);
					let signType:number = MensSignElement.NO_SIGN;
					let dotted:boolean = false;
					let stroke:boolean = false;
					if( ms ==( "C"))
						{
							let or:_Element = curmensel.getChild("Orientation",CMMEParser.cmmens);
							if( or != null && or.getText() ==( "Reversed"))
								signType = MensSignElement.MENS_SIGN_CREV;
							else
								signType = MensSignElement.MENS_SIGN_C;

						}

					else
						if( ms ==( "O"))
							signType = MensSignElement.MENS_SIGN_O;

					if(( curmensel.getChild("Strokes",CMMEParser.cmmens) != null) && Integer.parseInt(curmensel.getChildText("Strokes",CMMEParser.cmmens)) > 0)
						stroke = true;

					if( curmensel.getChild("Dot",CMMEParser.cmmens) != null)
						dotted = true;

					signs.add(MensSignElement.new0(signType,dotted,stroke));
				}

			else
				if( curmensel.getName() ==( "Number"))
					signs.add(MensSignElement.new1(MensSignElement.NUMBERS,this.parseProportion(curmensel)));
				else
					if( curmensel.getName() ==( "StaffLoc"))
						ssnum = Integer.parseInt(curmensel.getText());
					else
						if( curmensel.getName() ==( "Orientation") && curmensel.getText() ==( "Vertical"))
							vertical = true;
						else
							if( curmensel.getName() ==( "Small"))
								small = true;
							else
								if( curmensel.getName() ==( "MensInfo"))
									mensInfo = Mensuration.new1(Integer.parseInt(curmensel.getChildText("Prolatio",CMMEParser.cmmens)),Integer.parseInt(curmensel.getChildText("Tempus",CMMEParser.cmmens)),Integer.parseInt(curmensel.getChildText("ModusMinor",CMMEParser.cmmens)),Integer.parseInt(curmensel.getChildText("ModusMaior",CMMEParser.cmmens)),curmensel.getChild("TempoChange",CMMEParser.cmmens) == null ? Mensuration.DEFAULT_TEMPO_CHANGE:this.parseProportion(curmensel.getChild("TempoChange",CMMEParser.cmmens)));
								else
									if( curmensel.getName() ==( "NoScoreEffect"))
										noScoreSig = true;

		}
		return MensEvent.new17(signs,ssnum,small,vertical,mensInfo,noScoreSig);
	}

	/*------------------------------------------------------------------------
Method:  Event parseRestEvent(_Element e,Event me)
Purpose: Create rest event from _Document tree segment
Parameters:
  Input:  _Element e - "Rest" node
          Event me  - current mensuration event
  Output: -
  Return: rest event
------------------------------------------------------------------------*/
	parseRestEvent(e:_Element,me:Event):Event
	{
		let re:RestEvent = RestEvent.new32(e.getChildText("Type",CMMEParser.cmmens),this.parseProportion(e.getChild("Length",CMMEParser.cmmens)),Integer.parseInt(e.getChildText("BottomStaffLine",CMMEParser.cmmens)),Integer.parseInt(e.getChildText("NumSpaces",CMMEParser.cmmens)),me == null ? 2:me.getMensInfo_1().modus_maior);
		re.setCorona(this.parseSignum(e.getChild("Corona",CMMEParser.cmmens)));
		re.setSignum(this.parseSignum(e.getChild("Signum",CMMEParser.cmmens)));
		return re;
	}

	/*------------------------------------------------------------------------
Method:  Event parseNoteEvent(_Element e,Event ce,ModernKeySignature keySig)
Purpose: Create note event from _Document tree segment
Parameters:
  Input:  _Element e                 - "Note" node
          Event ce                  - current clef event
          ModernKeySignature keySig - current modern key signature
  Output: -
  Return: note event
------------------------------------------------------------------------*/
	parseNoteEvent(e:_Element,ce:Event,keySig:ModernKeySignature):Event
	{
		let pitchOffset:ModernAccidental;
		let ligstatus:number = NoteEvent.LIG_NONE;
		let tieType:number = NoteEvent.TIE_NONE;
		let opte:_Element;
		let col:boolean = false;
		let wordEnd:boolean = false;
		let modernTextEditorial:boolean = false;
		let numFlags:number = 0;
		let stemdir:number = NoteEvent.STEM_NONE;
		let stemside:number = NoteEvent.STEM_NONE;
		let halfCol:number = NoteEvent.HALFCOLORATION_NONE;
		let modernText:string = null;
		let pitch:Pitch = Pitch.new0(e.getChildText("LetterName",CMMEParser.cmmens).substring(0,1),Integer.parseInt(e.getChildText("OctaveNum",CMMEParser.cmmens)),ce != null ? ce.getPrincipalClef(false):null);
		pitchOffset = this.parseModernAccidental_1(e,pitch,keySig);
		if(( opte = e.getChild("Lig",CMMEParser.cmmens)) != null)
			if( opte.getText() ==( "Recta"))
				ligstatus = NoteEvent.LIG_RECTA;
			else
				if( opte.getText() ==( "Obliqua"))
					ligstatus = NoteEvent.LIG_OBLIQUA;

		if(( opte = e.getChild("Tie",CMMEParser.cmmens)) != null)
			if( opte.getText() ==( "Under"))
				tieType = NoteEvent.TIE_UNDER;
			else
				tieType = NoteEvent.TIE_OVER;

		if( e.getChild("Colored",CMMEParser.cmmens) != null)
			col = true;

		if(( opte = e.getChild("Flagged",CMMEParser.cmmens)) != null)
			numFlags =(( opte = opte.getChild("NumFlags",CMMEParser.cmmens)) == null) ? 1:Integer.parseInt(opte.getText());

		if(( opte = e.getChild("Stem",CMMEParser.cmmens)) != null)
			{
				stemdir = NoteEvent.strtoStemDir(opte.getChildText("Dir",CMMEParser.cmmens));
				let ss:string = opte.getChildText("Side",CMMEParser.cmmens);
				if( ss != null)
					stemside = NoteEvent.strtoStemDir(ss);

			}

		let halfColType:string = e.getChildText("HalfColoration",CMMEParser.cmmens);
		if( halfColType != null)
			if( halfColType ==( "PrimarySecondary"))
				halfCol = NoteEvent.HALFCOLORATION_PRIMARYSECONDARY;
			else
				if( halfColType ==( "SecondaryPrimary"))
					halfCol = NoteEvent.HALFCOLORATION_SECONDARYPRIMARY;

		if(( opte = e.getChild("ModernText",CMMEParser.cmmens)) != null)
			{
				modernText = opte.getChildText("Syllable",CMMEParser.cmmens);
				if( opte.getChild("WordEnd",CMMEParser.cmmens) != null)
					wordEnd = true;

				if( opte.getChild("Editorial",CMMEParser.cmmens) != null)
					modernTextEditorial = true;

			}

		let ne:NoteEvent = NoteEvent.new25(e.getChildText("Type",CMMEParser.cmmens),this.parseProportion(e.getChild("Length",CMMEParser.cmmens)),pitch,pitchOffset,ligstatus,col,halfCol,stemdir,stemside,numFlags,modernText,wordEnd,modernTextEditorial,tieType);
		ne.setCorona(this.parseSignum(e.getChild("Corona",CMMEParser.cmmens)));
		ne.setSignum(this.parseSignum(e.getChild("Signum",CMMEParser.cmmens)));
		this.lastNoteEvent = ne;
		return ne;
	}

	/*------------------------------------------------------------------------
Method:  Event parseDotEvent(_Element e,Event me)
Purpose: Create dot event from _Document tree segment
Parameters:
  Input:  _Element e - "Dot" node
          Event me  - current mensuration event
          Event ce  - current clef event
  Output: -
  Return: dot event
------------------------------------------------------------------------*/
	parseDotEvent(e:_Element,me:Event,ce:Event):Event
	{
		let mens:Mensuration = me == null ? Mensuration.DEFAULT_MENSURATION:me.getMensInfo_1();
		let lne:NoteEvent = this.lastNoteEvent;
		if( lne != null && lne.getmusictime() != null && mens.ternary(lne.getnotetype_1()) && lne.getmusictime().greaterThan(NoteEvent.getTypeLength(lne.getnotetype_1(),mens)))
			lne = null;

		let sle:_Element = e.getChild("Pitch",CMMEParser.cmmens);
		let p:Pitch = null;
		let sl:number = 0;
		let de:DotEvent;
		if( sle != null)
			de = DotEvent.new11(Pitch.new0(sle.getChildText("LetterName",CMMEParser.cmmens).substring(0,1),Integer.parseInt(sle.getChildText("OctaveNum",CMMEParser.cmmens)),ce != null ? ce.getPrincipalClef(false):null),lne);
		else
			de = DotEvent.new11(this.oldDotSLToPitch(Integer.parseInt(e.getChildText("StaffLoc",CMMEParser.cmmens)),ce),lne);

		this.lastNoteEvent = null;
		return de;
	}

	/* IMPLEMENT: relative staff location */
	/* convert deprecated dot staff location (int) to Pitch */
	oldDotSLToPitch(sl:number,ce:Event):Pitch
	{
		let staffLoc:number =(((( sl * 2) | 0) - 1) | 0);
		let p:Pitch = Pitch.new2(staffLoc);
		if( ce != null)
			p.setclef(ce.getPrincipalClef(false));

		return p;
	}

	/*------------------------------------------------------------------------
Method:  Event parseOriginalTextEvent(_Element e)
Purpose: Create original text event from _Document tree segment
Parameters:
  Input:  _Element e - "OriginalText" node
  Output: -
  Return: original text event
------------------------------------------------------------------------*/
	parseOriginalTextEvent(e:_Element):Event
	{
		return OriginalTextEvent.new28(e.getChildText("Phrase",CMMEParser.cmmens));
	}

	/*------------------------------------------------------------------------
Method:  Event parseProportionEvent(_Element e)
Purpose: Create proportion event from _Document tree segment
Parameters:
  Input:  _Element e - "Proportion" node
  Output: -
  Return: proportion event
------------------------------------------------------------------------*/
	parseProportionEvent(e:_Element):Event
	{
		return ProportionEvent.new30(this.parseProportion(e));
	}

	/*------------------------------------------------------------------------
Method:  Event parseColorChangeEvent(_Element e,Coloration lastc)
Purpose: Create color change event from _Document tree segment
Parameters:
  Input:  _Element e        - "ColorChange" node
          Coloration lastc - previous coloration scheme
  Output: -
  Return: color change event
------------------------------------------------------------------------*/
	parseColorChangeEvent(e:_Element,lastc:Coloration):Event
	{
		return ColorChangeEvent.new8(Coloration.new1(lastc,this.parseColoration(e)));
	}

	/* new coloration = last coloration + differences */
	/*------------------------------------------------------------------------
Method:  Event parseCustosEvent(_Element e,Event ce)
Purpose: Create custos event from _Document tree segment
Parameters:
  Input:  _Element e - "Custos" node
          Event ce  - current clef event
  Output: -
  Return: custos event
------------------------------------------------------------------------*/
	parseCustosEvent(e:_Element,ce:Event):Event
	{
		return CustosEvent.new9(Pitch.new0(e.getChildText("LetterName",CMMEParser.cmmens).substring(0,1),Integer.parseInt(e.getChildText("OctaveNum",CMMEParser.cmmens)),ce != null ? ce.getPrincipalClef(false):null));
	}

	/*------------------------------------------------------------------------
Method:  Event parseLineEndEvent(_Element e)
Purpose: Create line end event from _Document tree segment
Parameters:
  Input:  _Element e - "LineEnd" node
  Output: -
  Return: line end event
------------------------------------------------------------------------*/
	parseLineEndEvent(e:_Element):Event
	{
		return LineEndEvent.new16(e.getChild("PageEnd",CMMEParser.cmmens) != null);
	}

	/*------------------------------------------------------------------------
Method:  Event parseMiscItemEvent(_Element e)
Purpose: Create misc event from _Document tree segment
Parameters:
  Input:  _Element e - "MiscItem" node
  Output: -
  Return: event
------------------------------------------------------------------------*/
	parseMiscItemEvent(e:_Element):Event
	{
		let me:_Element;
		if(( me = e.getChild("Barline",CMMEParser.cmmens)) != null)
			{
				let attribEl:_Element = me.getChild("NumLines",CMMEParser.cmmens);
				let numLines:number = attribEl == null ? 1:Integer.parseInt(attribEl.getText());
				let repeatSign:boolean = me.getChild("RepeatSign",CMMEParser.cmmens) != null;
				attribEl = me.getChild("BottomStaffLine",CMMEParser.cmmens);
				let bottomLinePos:number = attribEl == null ? 0:Integer.parseInt(attribEl.getText());
				attribEl = me.getChild("NumSpaces",CMMEParser.cmmens);
				let numSpaces:number = attribEl == null ? 4:Integer.parseInt(attribEl.getText());
				return BarlineEvent.new5(numLines,repeatSign,bottomLinePos,numSpaces);
			}

		if(( me = e.getChild("TextAnnotation",CMMEParser.cmmens)) != null)
			{
				let s:string = me.getChildText("Text",CMMEParser.cmmens);
				let sle:_Element = me.getChild("StaffLoc",CMMEParser.cmmens);
				if( sle != null)
					return AnnotationTextEvent.new2(s,Integer.parseInt(sle.getText()));
				else
					return AnnotationTextEvent.new3(s);

			}

		if(( me = e.getChild("Lacuna",CMMEParser.cmmens)) != null)
			return this.parseLacunaEvent(me);

		if(( me = e.getChild("Ellipsis",CMMEParser.cmmens)) != null)
			return Event.new1(Event.EVENT_ELLIPSIS);

		return null;
	}

	/*------------------------------------------------------------------------
Method:  Event parseLacunaEvent(_Element e)
Purpose: Create lacuna event from _Document tree segment
Parameters:
  Input:  _Element e - "Lacuna" node
  Output: -
  Return: event
------------------------------------------------------------------------*/
	parseLacunaEvent(e:_Element):Event
	{
		throw new RuntimeException();
	}

	/* 
    _Element lengthEl=e.getChild("Length",cmmens);
    if (lengthEl!=null)
      return new LacunaEvent(parseProportion(lengthEl));
    if (e.getChild("Begin",cmmens)!=null)
      return new LacunaEvent(Event.EVENT_LACUNA);
    if (e.getChild("End",cmmens)!=null)
      return new LacunaEvent(Event.EVENT_LACUNA_END);

    return null;*/
	/*------------------------------------------------------------------------
Method:  Event parseModernKeySignatureEvent(_Element e)
Purpose: Create modern key signature event from _Document tree segment
Parameters:
  Input:  _Element e - "ModernKeySignature" node
  Output: -
  Return: event
------------------------------------------------------------------------*/
	parseModernKeySignatureEvent(e:_Element):Event
	{
		let mks:ModernKeySignature = ModernKeySignature.new0();
		for(
		let ei:Iterator<_Element> = e.getChildren().iterator();ei.hasNext();)
		{
			let curElTree:_Element =<_Element> ei.next();
			let pl:string = curElTree.getChildText("Pitch",CMMEParser.cmmens).substring(0,1);
			let po:number = - 1;
			if( curElTree.getChild("Octave",CMMEParser.cmmens) != null)
				po = Integer.parseInt(curElTree.getChildText("Octave",CMMEParser.cmmens));

			let ma:ModernAccidental = this.parseModernAccidental_2(curElTree.getChild("Accidental",CMMEParser.cmmens));
			mks.addElement(ModernKeySignatureElement.new0(Pitch.new1(pl,po),ma));
		}
		return ModernKeySignatureEvent.new22(mks);
	}

	/*------------------------------------------------------------------------
Method:  Proportion parseColoration(_Element e)
Purpose: Create Coloration structure from _Document tree segment
Parameters:
  Input:  _Element e - coloration node
  Output: -
  Return: coloration structure
------------------------------------------------------------------------*/
	parseColoration(e:_Element):Coloration
	{
		let pc:number = Coloration.NONE;
		let pf:number = Coloration.NONE;
		let sc:number = Coloration.NONE;
		let sf:number = Coloration.NONE;
		let colel:_Element = e.getChild("PrimaryColor",CMMEParser.cmmens);
		pc = Coloration.strtoColor(colel.getChildText("Color",CMMEParser.cmmens));
		pf = Coloration.strtoColorFill(colel.getChildText("Fill",CMMEParser.cmmens));
		if(( colel = e.getChild("SecondaryColor",CMMEParser.cmmens)) != null)
			{
				sc = Coloration.strtoColor(colel.getChildText("Color",CMMEParser.cmmens));
				sf = Coloration.strtoColorFill(colel.getChildText("Fill",CMMEParser.cmmens));
			}

		else
			{
				sc = pc;
				sf = Coloration.complementaryFill(pf);
			}

		return Coloration.new0(pc,pf,sc,sf);
	}

	/* secondary color unspecified: use default complement */
	/*------------------------------------------------------------------------
Method:  ModernAccidental parseModernAccidental(_Element e,Pitch p,ModernKeySignature keySig)
Purpose: Choose pitch offset for NoteEvent based on _Document tree segment
Parameters:
  Input:  _Element e                 - note _Element node
          Pitch p                   - note pitch
          ModernKeySignature keySig - current key signature
  Output: -
  Return: ModernAccidental structure
------------------------------------------------------------------------*/
	/* note accidental */
	parseModernAccidental_1(e:_Element,p:Pitch,keySig:ModernKeySignature):ModernAccidental
	{
		let pitchOffset:number = 0;
		let optional:boolean = false;
		let acce:_Element;
		if(( acce = e.getChild("ModernAccidental",CMMEParser.cmmens)) != null)
			{
				if( acce.getChild("AType",CMMEParser.cmmens) != null)
					{
						let numa:number =( acce.getChild("Num",CMMEParser.cmmens) != null) ? Integer.parseInt(acce.getChildText("Num",CMMEParser.cmmens)):1;
						let depAcc:ModernAccidental = ModernAccidental.new0(ModernAccidental.strtoMA(acce.getChildText("AType",CMMEParser.cmmens)),numa,false);
						pitchOffset = keySig.calcNotePitchOffset_1(p,depAcc);
					}

				else
					pitchOffset = Integer.parseInt(acce.getChildText("PitchOffset",CMMEParser.cmmens));

				optional = acce.getChild("Optional",CMMEParser.cmmens) != null;
			}

		else
			if( this.fileVersion < 0.894)
				pitchOffset = keySig.calcNotePitchOffset_1(p,null);

		return ModernAccidental.new3(pitchOffset,optional);
	}

	/* parse deprecated ModernAccidental structure */
	/* legacy code: pre-0.894 files have no pitch offset info for notes
       modified by key signature */
	/* signature accidental */
	parseModernAccidental_2(acce:_Element):ModernAccidental
	{
		let numa:number =( acce.getChild("Num",CMMEParser.cmmens) != null) ? Integer.parseInt(acce.getChildText("Num",CMMEParser.cmmens)):1;
		return ModernAccidental.new0(ModernAccidental.strtoMA(acce.getChildText("AType",CMMEParser.cmmens)),numa,acce.getChild("Optional",CMMEParser.cmmens) != null);
	}

	/*------------------------------------------------------------------------
Method:  Signum parseSignum(_Element e)
Purpose: Create Signum structure from _Document tree segment
Parameters:
  Input:  _Element e - signum node
  Output: -
  Return: signum
------------------------------------------------------------------------*/
	parseSignum(e:_Element):Signum
	{
		if( e == null)
			return null;

		let orientation:number = Signum.UP;
		let side:number = Signum.MIDDLE;
		let offsetStr:string = e.getChildText("Offset",CMMEParser.cmmens);
		let os:string = e.getChildText("Orientation",CMMEParser.cmmens);
		if( os != null &&( os == "Down"))
			orientation = Signum.DOWN;

		let ss:string = e.getChildText("Side",CMMEParser.cmmens);
		if( ss != null)
			if(( ss == "Left"))
				side = Signum.LEFT;
			else
				if(( ss == "Right"))
					side = Signum.RIGHT;

		if( offsetStr == null)
			return Signum.new1(orientation,side);

		return Signum.new0(Integer.parseInt(offsetStr),orientation,side);
	}

	/*------------------------------------------------------------------------
Method:  Proportion parseProportion(_Element e)
Purpose: Create Proportion structure from _Document tree segment
Parameters:
  Input:  _Element e - proportion node
  Output: -
  Return: proportion structure
------------------------------------------------------------------------*/
	parseProportion(e:_Element):Proportion
	{
		return e == null ? null:Proportion.new0(Integer.parseInt(e.getChildText("Num",CMMEParser.cmmens)),Integer.parseInt(e.getChildText("Den",CMMEParser.cmmens)));
	}
	/*----------------------------------------------------------------------*/
	/*--------------------------- OUTPUT METHODS ---------------------------*/
	/*----------------------------------------------------------------------*/
	/*------------------------------------------------------------------------
Method:  void outputPieceData(PieceData pdata,OutputStream outs)
Purpose: Output CMME format file from PieceData structure
Parameters:
  Input:  PieceData pdata   - structure containing music
          OutputStream outs - output destination
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static mainData:PieceData;

	public static outputPieceData(pdata:PieceData,outs:OutputStream):void
	{
		_Document.create(null,null,null);
		let outputdoc:_Document;
		let rootel:_Element;
		CMMEParser.mainData = pdata;
		CMMEParser.cmmens = "http://www.cmme.org";
		let xsins:string = "http://www.w3.org/2001/XMLSchema-instance";
		rootel = new _Element("Piece",CMMEParser.cmmens);
		rootel.addNamespaceDeclaration(CMMEParser.cmmens);
		rootel.addNamespaceDeclaration(xsins);
		rootel.set_Attribute("schemaLocation","http://www.cmme.org cmme.xsd",xsins);
		rootel.set_Attribute("CMMEversion",MetaData.CMME_VERSION);
		pdata.consolidateAllReadings();
		rootel.addContent(CMMEParser.createGeneralDataTree(pdata));
		rootel.addContent(CMMEParser.createVoiceDataTree(pdata.getVoiceData()));
		for(
		let si:number = 0;si < pdata.getNumSections();si ++)
		rootel.addContent(CMMEParser.createMusicSectionTree(pdata.getSection(si)));
		outputdoc = new _Document(rootel);
		try
		{
			let xout:_XMLOutputter = new _XMLOutputter("");
			xout.output(outputdoc,outs);
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

	// header/root 
	//,cmmens);
	// actual content 
	// output 
	/*Format.getRawFormat().setIndent("  ")*/
	/*------------------------------------------------------------------------
Method:  _Element createGeneralDataTree(PieceData pdata)
Purpose: Construct tree segment for GeneralData
Parameters:
  Input:  PieceData pdata - overall piece structure
  Output: -
  Return: root _Element (for this segment)
------------------------------------------------------------------------*/
	static createGeneralDataTree(pdata:PieceData):_Element
	{
		let gdel:_Element = new _Element("GeneralData",CMMEParser.cmmens);
		if( pdata.isIncipitScore())
			gdel.addContent(new _Element("Incipit",CMMEParser.cmmens));

		gdel.addContent(new _Element("Title",CMMEParser.cmmens).setText(pdata.getTitle()));
		let st:string = pdata.getSectionTitle();
		if( st != null)
			gdel.addContent(new _Element("Section",CMMEParser.cmmens).setText(st));

		gdel.addContent(new _Element("Composer",CMMEParser.cmmens).setText(pdata.getComposer()));
		gdel.addContent(new _Element("Editor",CMMEParser.cmmens).setText(pdata.getEditor()));
		let publicNotes:string = pdata.getPublicNotes();
		if( publicNotes != null && publicNotes.length > 0)
			gdel.addContent(new _Element("PublicNotes",CMMEParser.cmmens).setText(publicNotes));

		let notes:string = pdata.getNotes();
		if( notes != null && notes.length > 0)
			gdel.addContent(new _Element("Notes",CMMEParser.cmmens).setText(notes));

		let vvi:number = 0;
		for(let vvd of pdata.getVariantVersions())
		{
			let vvel:_Element = new _Element("VariantVersion",CMMEParser.cmmens);
			if( vvi ++ == 0)
				vvel.addContent(new _Element("Default",CMMEParser.cmmens));

			vvel.addContent(new _Element("ID",CMMEParser.cmmens).setText(vvd.getID()));
			let sourceID:number = vvd.getSourceID();
			if( sourceID > - 1)
				vvel.addContent(CMMEParser.createSourceInfoTree("Source",vvd.getSourceName(),sourceID));

			let vEditor:string = vvd.getEditor();
			if( vEditor != null && vEditor.length > 0)
				vvel.addContent(new _Element("Editor",CMMEParser.cmmens).setText(vEditor));

			let vDescription:string = vvd.getDescription();
			if( vDescription != null && vDescription.length > 0)
				vvel.addContent(new _Element("Description",CMMEParser.cmmens).setText(vDescription));

			let missingVoices:ArrayList<Voice> = vvd.getMissingVoices();
			if( missingVoices.size() > 0)
				{
					let mvel:_Element = new _Element("MissingVoices",CMMEParser.cmmens);
					for(let v of missingVoices)
					mvel.addContent(new _Element("VoiceNum",CMMEParser.cmmens).setText(`${v.getNum()}`));
					vvel.addContent(mvel);
				}

			gdel.addContent(vvel);
		}
		if( ! pdata.getBaseColoration().equals(Coloration.DEFAULT_COLORATION))
			gdel.addContent(CMMEParser.addColorationData(new _Element("BaseColoration",CMMEParser.cmmens),pdata.getBaseColoration()));

		return gdel;
	}

	// variant version declarations 
	/*------------------------------------------------------------------------
Method:  _Element createSourceInfoTree(String elName,String sName,int sNum)
Purpose: Construct tree segment for one source info
Parameters:
  Input:  String elName - name of _Element to be created
          String sName  - name of source
          int sNum      - source ID no.
  Output: -
  Return: root _Element (for this segment)
------------------------------------------------------------------------*/
	static createSourceInfoTree(elName:string,sName:string,sNum:number):_Element
	{
		let sourceEl:_Element = new _Element(elName,CMMEParser.cmmens);
		sourceEl.addContent(new _Element("Name",CMMEParser.cmmens).setText(sName));
		sourceEl.addContent(new _Element("ID",CMMEParser.cmmens).setText(`${sNum}`));
		return sourceEl;
	}

	/*------------------------------------------------------------------------
Method:  _Element createVoiceDataTree(Voice[] vdata)
Purpose: Construct tree segment for VoiceData
Parameters:
  Input:  Voice[] vdata - array of structures containing voice data
  Output: -
  Return: root _Element (for this segment)
------------------------------------------------------------------------*/
	static createVoiceDataTree(vdata:Voice[]):_Element
	{
		let vdel:_Element = new _Element("VoiceData",CMMEParser.cmmens);
		vdel.addContent(new _Element("NumVoices",CMMEParser.cmmens).setText(Integer.toString(vdata.length)));
		for(let curv of vdata)
		{
			let curvel:_Element = new _Element("Voice",CMMEParser.cmmens);
			curvel.addContent(new _Element("Name",CMMEParser.cmmens).setText(curv.getName()));
			if( curv.isEditorial())
				curvel.addContent(new _Element("Editorial",CMMEParser.cmmens));

			let c:Clef = curv.getSuggestedModernClef();
			if( c != null)
				curvel.addContent(new _Element("SuggestedModernClef",CMMEParser.cmmens).setText(Clef.ClefNames[c.cleftype]));

			vdel.addContent(curvel);
		}
		return vdel;
	}

	/*------------------------------------------------------------------------
Method:  _Element createMusicSectionTree(MusicSection ms)
Purpose: Construct tree segment for one MusicSection
Parameters:
  Input:  MusicSection ms - music section
  Output: -
  Return: root _Element (for this segment)
------------------------------------------------------------------------*/
	static createMusicSectionTree(ms:MusicSection):_Element
	{
		let msel:_Element = new _Element("MusicSection",CMMEParser.cmmens);
		if( ms.isEditorial())
			msel.addContent(new _Element("Editorial",CMMEParser.cmmens));

		let msSource:string = ms.getPrincipalSource();
		if( msSource != null && !( msSource == ""))
			msel.addContent(CMMEParser.createSourceInfoTree("PrincipalSource",msSource,ms.getPrincipalSourceNum()));

		switch( ms.getSectionType())
		{
			case MusicSection.MENSURAL_MUSIC:
			{
				msel.addContent(CMMEParser.createMusicMensuralSectionTree(<MusicMensuralSection> ms));
				break;
			}
			case MusicSection.PLAINCHANT:
			{
				msel.addContent(CMMEParser.createMusicChantSectionTree(<MusicChantSection> ms));
				break;
			}
			default:
			{
				System.err.println("Save error: Attempting to create tree for unsupported section type");
				break;
			}
		}
		return msel;
	}

	/*------------------------------------------------------------------------
Method:  _Element createMusicMensuralSectionTree(MusicMensuralSection mms)
Purpose: Construct tree segment for one MusicMensuralSection
Parameters:
  Input:  MusicMensuralSection mms - mensural music section
  Output: -
  Return: root _Element (for this segment)
------------------------------------------------------------------------*/
	static createMusicMensuralSectionTree(mms:MusicMensuralSection):_Element
	{
		let mmsel:_Element = new _Element("MensuralMusic",CMMEParser.cmmens);
		mmsel.addContent(new _Element("NumVoices",CMMEParser.cmmens).setText(Integer.toString(mms.getNumVoicesUsed())));
		if( mms.getBaseColoration() != null && ! mms.getBaseColoration().equals(CMMEParser.mainData.getBaseColoration()))
			mmsel.addContent(CMMEParser.addColorationData(new _Element("BaseColoration",CMMEParser.cmmens),mms.getBaseColoration()));

		CMMEParser.addTacetInstructions(mmsel,mms);
		for(
		let vi:number = 0;vi < mms.getNumVoices_1();vi ++)
		if( mms.getVoice_1(vi) != null)
			{
				let curvmd:VoiceMensuralData =<VoiceMensuralData> mms.getVoice_1(vi);
				let curvel:_Element = new _Element("Voice",CMMEParser.cmmens);
				curvel.addContent(new _Element("VoiceNum",CMMEParser.cmmens).setText(Integer.toString(curvmd.getVoiceNum())));
				for(let vvd of curvmd.getMissingVersions())
				curvel.addContent(new _Element("MissingVersionID",CMMEParser.cmmens).setText(vvd.getID()));
				curvel.addContent(CMMEParser.createVoiceEventTree(curvmd));
				mmsel.addContent(curvel);
			}

		return mmsel;
	}

	/*------------------------------------------------------------------------
Method:  _Element createMusicChantSectionTree(MusicChantSection mcs)
Purpose: Construct tree segment for one MusicChantSection
Parameters:
  Input:  MusicChantSection mcs - plainchant section
  Output: -
  Return: root _Element (for this segment)
------------------------------------------------------------------------*/
	static createMusicChantSectionTree(mcs:MusicChantSection):_Element
	{
		let mcsel:_Element = new _Element("Plainchant",CMMEParser.cmmens);
		mcsel.addContent(new _Element("NumVoices",CMMEParser.cmmens).setText(Integer.toString(mcs.getNumVoicesUsed())));
		if( mcs.getBaseColoration() != null && ! mcs.getBaseColoration().equals(Coloration.DEFAULT_CHANT_COLORATION))
			mcsel.addContent(CMMEParser.addColorationData(new _Element("BaseColoration",CMMEParser.cmmens),mcs.getBaseColoration()));

		CMMEParser.addTacetInstructions(mcsel,mcs);
		for(
		let vi:number = 0;vi < mcs.getNumVoices_1();vi ++)
		if( mcs.getVoice_1(vi) != null)
			{
				let curvd:VoiceEventListData = mcs.getVoice_1(vi);
				let curvel:_Element = new _Element("Voice",CMMEParser.cmmens);
				curvel.addContent(new _Element("VoiceNum",CMMEParser.cmmens).setText(Integer.toString(curvd.getVoiceNum())));
				for(let vvd of curvd.getMissingVersions())
				curvel.addContent(new _Element("MissingVersionID",CMMEParser.cmmens).setText(vvd.getID()));
				curvel.addContent(CMMEParser.createVoiceEventTree(curvd));
				mcsel.addContent(curvel);
			}

		return mcsel;
	}

	/*------------------------------------------------------------------------
Method:  void addTacetInstructions(_Element sectionEl,MusicSection section)
Purpose: Add tree segments for voice tacet texts in one MusicSection
Parameters:
  Input:  MusicSection section - music section
  Output: _Element sectionEl    - _Element representing music section
  Return: -
------------------------------------------------------------------------*/
	static addTacetInstructions(sectionEl:_Element,section:MusicSection):void
	{
		if( section.getTacetInfo() == null)
			return;

		for(let ti of section.getTacetInfo())
		if( !( ti.tacetText == ""))
			{
				let tacetEl:_Element = new _Element("TacetInstruction",CMMEParser.cmmens);
				tacetEl.addContent(new _Element("VoiceNum",CMMEParser.cmmens).setText(Integer.toString((( ti.voiceNum + 1) | 0))));
				tacetEl.addContent(new _Element("TacetText",CMMEParser.cmmens).setText(ti.tacetText));
				sectionEl.addContent(tacetEl);
			}

	}
	/*------------------------------------------------------------------------
Method:  _Element createVoiceEventTree(VoiceEventListData v)
Purpose: Construct tree segment for all Events in one voice section
Parameters:
  Input:  VoiceEventListData v - data for one voice
  Output: -
  Return: root _Element (for this segment)
------------------------------------------------------------------------*/
	static lastcol:Coloration;

	static createVoiceEventTree(v:VoiceEventListData):_Element
	{
		let elel:_Element = new _Element("EventList",CMMEParser.cmmens);
		let curevel:_Element;
		let cure:Event;
		CMMEParser.lastcol = v.getSection().getBaseColoration();
		for(
		let i:Iterator<Event> = v.events.iterator();i.hasNext();)
		{
			cure =<Event> i.next();
			if( cure.geteventtype() == Event.EVENT_VARIANTDATA_START)
				curevel = CMMEParser.createVariantDataTree(i,(<VariantMarkerEvent> cure).getReadings());
			else
				curevel = CMMEParser.createOneEventTree(cure);

			if( curevel != null)
				elel.addContent(curevel);

		}
		return elel;
	}

	/*------------------------------------------------------------------------
Method:  _Element createVariantDataTree(Iterator i,ArrayList<VariantReadings> varReadings)
Purpose: Construct tree segment for set of variant readings
Parameters:
  Input:  Iterator i - event list iterator, positioned at start of variant
                       segment
          ArrayList<VariantReadings> varReadings - variant readings
  Output: Iterator i
  Return: root _Element (for this segment)
------------------------------------------------------------------------*/
	static createVariantDataTree(i:Iterator<Event>,varReadings:ArrayList<VariantReading>):_Element
	{
		let variantRootEl:_Element = new _Element("VariantReadings",CMMEParser.cmmens);
		let readingEl:_Element = new _Element("Reading",CMMEParser.cmmens);
		let eventListEl:_Element = null;
		let curevel:_Element;
		let cure:Event;
		readingEl.addContent(new _Element("VariantVersionID",CMMEParser.cmmens).setText("DEFAULT"));
		eventListEl = new _Element("Music",CMMEParser.cmmens);
		cure = i.hasNext() ?<Event> i.next():null;
		while( cure.geteventtype() != Event.EVENT_VARIANTDATA_END)
		{
			curevel = CMMEParser.createOneEventTree(cure);
			if( curevel != null)
				eventListEl.addContent(curevel);

			cure = i.hasNext() ?<Event> i.next():null;
		}
		readingEl.addContent(eventListEl);
		variantRootEl.addContent(readingEl);
		for(let vr of varReadings)
		{
			readingEl = new _Element("Reading",CMMEParser.cmmens);
			for(let vvd of vr.getVersions())
			readingEl.addContent(new _Element("VariantVersionID",CMMEParser.cmmens).setText(vvd.getID()));
			if( vr.isError())
				readingEl.addContent(new _Element("Error",CMMEParser.cmmens));

			eventListEl = new _Element("Music",CMMEParser.cmmens);
			for(
			let vi:number = 0;vi < vr.getNumEvents();vi ++)
			{
				let ve:Event = vr.getEvent(vi);
				curevel = CMMEParser.createOneEventTree(ve);
				if( curevel != null)
					eventListEl.addContent(curevel);

			}
			readingEl.addContent(eventListEl);
			variantRootEl.addContent(readingEl);
		}
		return variantRootEl;
	}

	// create event list for default reading 
	// create event lists for variant readings 
	/*------------------------------------------------------------------------
Method:  _Element createMultiEventTree(MultiEvent cure)
Purpose: Construct tree segment for a multi-event
Parameters:
  Input:  MultiEvent cure - multi-event data
  Output: -
  Return: root _Element (for this segment)
------------------------------------------------------------------------*/
	static createMultiEventTree(cure:MultiEvent):_Element
	{
		let melel:_Element = new _Element("MultiEvent",CMMEParser.cmmens);
		for(
		let i:Iterator<Event> = cure.iterator_2();i.hasNext();)
		melel.addContent(CMMEParser.createOneEventTree(<Event> i.next()));
		return melel;
	}

	/*------------------------------------------------------------------------
Method:  _Element createOneEventTree(Event cure)
Purpose: Construct tree segment for a single Event
Parameters:
  Input:  Event cure - single event data
  Output: -
  Return: root _Element (for this segment)
------------------------------------------------------------------------*/
	static createOneEventTree(cure:Event):_Element
	{
		let curevel:_Element;
		let mile:_Element;
		switch( cure.geteventtype())
		{
			case Event.EVENT_MULTIEVENT:
			{
				return CMMEParser.createMultiEventTree(<MultiEvent> cure);
			}
			case Event.EVENT_CLEF:
			{
				curevel = new _Element("Clef",CMMEParser.cmmens);
				let c:Clef =(<ClefEvent> cure).getClef_1(false,false);
				curevel.addContent(new _Element("Appearance",CMMEParser.cmmens).setText(Clef.ClefNames[c.cleftype]));
				curevel.addContent(new _Element("StaffLoc",CMMEParser.cmmens).setText(Integer.toString(c.linespacenum)));
				curevel.addContent(CMMEParser.addLocusData(new _Element("Pitch",CMMEParser.cmmens),c.pitch));
				if( c._signature)
					curevel.addContent(new _Element("Signature",CMMEParser.cmmens));

				break;
			}
			case Event.EVENT_MENS:
			{
				curevel = new _Element("Mensuration",CMMEParser.cmmens);
				let m:MensEvent =<MensEvent> cure;
				for(
				let i:Iterator<MensSignElement> = m.iterator_1();i.hasNext();)
				{
					let mse:MensSignElement =<MensSignElement> i.next();
					switch( mse.signType)
					{
						case MensSignElement.MENS_SIGN_O:
						{
						}
						case MensSignElement.MENS_SIGN_C:
						{
						}
						case MensSignElement.MENS_SIGN_CREV:
						{
							let signel:_Element = new _Element("Sign",CMMEParser.cmmens);
							signel.addContent(new _Element("MainSymbol",CMMEParser.cmmens).setText(mse.signType == MensSignElement.MENS_SIGN_O ? "O":"C"));
							if( mse.signType == MensSignElement.MENS_SIGN_CREV)
								signel.addContent(new _Element("Orientation",CMMEParser.cmmens).setText("Reversed"));

							if( mse.stroke)
								signel.addContent(new _Element("Strokes",CMMEParser.cmmens).setText("1"));

							if( mse.dotted)
								signel.addContent(new _Element("Dot",CMMEParser.cmmens));

							curevel.addContent(signel);
							break;
						}
						case MensSignElement.NUMBERS:
						{
							let numel:_Element = CMMEParser.addProportion(new _Element("Number",CMMEParser.cmmens),mse.number);
							curevel.addContent(numel);
							break;
						}
					}
				}
				if( m.getStaffLoc() != 4)
					curevel.addContent(new _Element("StaffLoc",CMMEParser.cmmens).setText(Integer.toString(m.getStaffLoc())));

				if( m.vertical())
					curevel.addContent(new _Element("Orientation",CMMEParser.cmmens).setText("Vertical"));

				if( m.small())
					curevel.addContent(new _Element("Small",CMMEParser.cmmens));

				if( m.nonStandard())
					{
						let mi:Mensuration = m.getMensInfo_1();
						let miel:_Element = new _Element("MensInfo",CMMEParser.cmmens);
						miel.addContent(new _Element("Prolatio",CMMEParser.cmmens).setText(mi.prolatio == Mensuration.MENS_TERNARY ? "3":"2"));
						miel.addContent(new _Element("Tempus",CMMEParser.cmmens).setText(mi.tempus == Mensuration.MENS_TERNARY ? "3":"2"));
						miel.addContent(new _Element("ModusMinor",CMMEParser.cmmens).setText(mi.modus_minor == Mensuration.MENS_TERNARY ? "3":"2"));
						miel.addContent(new _Element("ModusMaior",CMMEParser.cmmens).setText(mi.modus_maior == Mensuration.MENS_TERNARY ? "3":"2"));
						if( ! mi.tempoChange.equals(Mensuration.DEFAULT_TEMPO_CHANGE))
							miel.addContent(CMMEParser.addProportion(new _Element("TempoChange",CMMEParser.cmmens),mi.tempoChange));

						curevel.addContent(miel);
					}

				if( m.noScoreSig())
					curevel.addContent(new _Element("NoScoreEffect",CMMEParser.cmmens));

				break;
			}
			case Event.EVENT_REST:
			{
				curevel = new _Element("Rest",CMMEParser.cmmens);
				let r:RestEvent =<RestEvent> cure;
				CMMEParser.addNoteInfoData(curevel,r.getnotetype_1(),r.getLength_1());
				curevel.addContent(new _Element("BottomStaffLine",CMMEParser.cmmens).setText(Integer.toString(r.getbottomline_2())));
				curevel.addContent(new _Element("NumSpaces",CMMEParser.cmmens).setText(Integer.toString(r.getnumlines())));
				if( r.getCorona() != null)
					curevel.addContent(CMMEParser.addSignumData(new _Element("Corona",CMMEParser.cmmens),r.getCorona()));

				if( r.getSignum() != null)
					curevel.addContent(CMMEParser.addSignumData(new _Element("Signum",CMMEParser.cmmens),r.getSignum()));

				break;
			}
			case Event.EVENT_NOTE:
			{
				curevel = new _Element("Note",CMMEParser.cmmens);
				let n:NoteEvent =<NoteEvent> cure;
				CMMEParser.addNoteInfoData(curevel,n.getnotetype_1(),n.getLength_1());
				CMMEParser.addLocusData(curevel,n.getPitch_1());
				let ma:ModernAccidental = n.getPitchOffset();
				if( ma.pitchOffset != 0 || ma.optional == true)
					curevel.addContent(CMMEParser.addModernAccidentalData(new _Element("ModernAccidental",CMMEParser.cmmens),ma));

				if( n.isligated())
					curevel.addContent(new _Element("Lig",CMMEParser.cmmens).setText(NoteEvent.LigTypeNames[n.getligtype()]));

				if( n.getTieType() != NoteEvent.TIE_NONE)
					curevel.addContent(new _Element("Tie",CMMEParser.cmmens).setText(NoteEvent.TieTypeNames[n.getTieType()]));

				let numFlags:number = n.getNumFlags();
				if( numFlags > 0)
					{
						let flagEl:_Element = new _Element("Flagged",CMMEParser.cmmens);
						if( numFlags > 1)
							flagEl.addContent(new _Element("NumFlags",CMMEParser.cmmens).setText(Integer.toString(numFlags)));

						curevel.addContent(flagEl);
					}

				let stemel:_Element = null;
				if( n.getstemside() != - 1 && n.getstemdir() != - 1)
					{
						stemel = new _Element("Stem",CMMEParser.cmmens);
						stemel.addContent(new _Element("Dir",CMMEParser.cmmens).setText(NoteEvent.StemDirs[n.getstemdir()]));
						stemel.addContent(new _Element("Side",CMMEParser.cmmens).setText(NoteEvent.StemDirs[n.getstemside()]));
					}

				else
					if( n.getstemdir() != NoteEvent.STEM_UP && n.getstemdir() != - 1)
						{
							stemel = new _Element("Stem",CMMEParser.cmmens);
							stemel.addContent(new _Element("Dir",CMMEParser.cmmens).setText(NoteEvent.StemDirs[n.getstemdir()]));
						}

				if( stemel != null)
					curevel.addContent(stemel);

				if( n.getHalfColoration() != NoteEvent.HALFCOLORATION_NONE)
					{
						let halfColText:string = null;
						switch( n.getHalfColoration())
						{
							case NoteEvent.HALFCOLORATION_PRIMARYSECONDARY:
							{
								halfColText = "PrimarySecondary";
								break;
							}
							case NoteEvent.HALFCOLORATION_SECONDARYPRIMARY:
							{
								halfColText = "SecondaryPrimary";
								break;
							}
						}
						curevel.addContent(new _Element("HalfColoration",CMMEParser.cmmens).setText(halfColText));
					}

				if( n.getCorona() != null)
					curevel.addContent(CMMEParser.addSignumData(new _Element("Corona",CMMEParser.cmmens),n.getCorona()));

				if( n.getSignum() != null)
					curevel.addContent(CMMEParser.addSignumData(new _Element("Signum",CMMEParser.cmmens),n.getSignum()));

				let mt:string = n.getModernText();
				if( mt != null)
					{
						let mtel:_Element = new _Element("ModernText",CMMEParser.cmmens);
						mtel.addContent(new _Element("Syllable",CMMEParser.cmmens).setText(mt));
						if( n.isWordEnd())
							mtel.addContent(new _Element("WordEnd",CMMEParser.cmmens));

						if( n.isModernTextEditorial())
							mtel.addContent(new _Element("Editorial",CMMEParser.cmmens));

						curevel.addContent(mtel);
					}

				break;
			}
			case Event.EVENT_DOT:
			{
				curevel = new _Element("Dot",CMMEParser.cmmens);
				curevel.addContent(CMMEParser.addLocusData(new _Element("Pitch",CMMEParser.cmmens),(<DotEvent> cure).getPitch_1()));
				break;
			}
			case Event.EVENT_ORIGINALTEXT:
			{
				curevel = new _Element("OriginalText",CMMEParser.cmmens);
				curevel.addContent(new _Element("Phrase",CMMEParser.cmmens).setText((<OriginalTextEvent> cure).getText()));
				break;
			}
			case Event.EVENT_PROPORTION:
			{
				curevel = new _Element("Proportion",CMMEParser.cmmens);
				CMMEParser.addProportion(curevel,(<ProportionEvent> cure).getproportion());
				break;
			}
			case Event.EVENT_COLORCHANGE:
			{
				curevel = new _Element("ColorChange",CMMEParser.cmmens);
				let newcol:Coloration =(<ColorChangeEvent> cure).getcolorscheme();
				let coldiff:Coloration = newcol.differencebetween(CMMEParser.lastcol);
				let colel:_Element = new _Element("PrimaryColor",CMMEParser.cmmens);
				if( coldiff.primaryColor != Coloration.NONE || coldiff.primaryFill == Coloration.NONE)
					colel.addContent(new _Element("Color",CMMEParser.cmmens).setText(Coloration.ColorNames[newcol.primaryColor]));

				if( coldiff.primaryFill != Coloration.NONE)
					colel.addContent(new _Element("Fill",CMMEParser.cmmens).setText(Coloration.ColorFillNames[newcol.primaryFill]));

				curevel.addContent(colel);
				if( newcol.secondaryColor != newcol.primaryColor ||( newcol.secondaryColor == newcol.primaryColor && newcol.secondaryFill == newcol.primaryFill))
					{
						colel = new _Element("SecondaryColor",CMMEParser.cmmens);
						if( newcol.secondaryColor != newcol.primaryColor)
							colel.addContent(new _Element("Color",CMMEParser.cmmens).setText(Coloration.ColorNames[newcol.secondaryColor]));

						colel.addContent(new _Element("Fill",CMMEParser.cmmens).setText(Coloration.ColorFillNames[newcol.secondaryFill]));
						curevel.addContent(colel);
					}

				break;
			}
			case Event.EVENT_CUSTOS:
			{
				curevel = new _Element("Custos",CMMEParser.cmmens);
				CMMEParser.addLocusData(curevel,(<CustosEvent> cure).getPitch_1());
				break;
			}
			case Event.EVENT_LINEEND:
			{
				curevel = new _Element("LineEnd",CMMEParser.cmmens);
				if((<LineEndEvent> cure).isPageEnd())
					curevel.addContent(new _Element("PageEnd",CMMEParser.cmmens));

				break;
			}
			case Event.EVENT_BARLINE:
			{
				curevel = new _Element("MiscItem",CMMEParser.cmmens);
				let ble:_Element = new _Element("Barline",CMMEParser.cmmens);
				let curbe:BarlineEvent =<BarlineEvent> cure;
				let nl:number = curbe.getNumLines();
				if( nl != 1)
					ble.addContent(new _Element("NumLines",CMMEParser.cmmens).setText(Integer.toString(nl)));

				let isRepeatSign:boolean = curbe.isRepeatSign();
				if( isRepeatSign)
					ble.addContent(new _Element("RepeatSign",CMMEParser.cmmens));

				let bl:number = curbe.getBottomLinePos();
				if( bl != 0)
					ble.addContent(new _Element("BottomStaffLine",CMMEParser.cmmens).setText(Integer.toString(bl)));

				let ns:number = curbe.getNumSpaces();
				if( ns != 4)
					ble.addContent(new _Element("NumSpaces",CMMEParser.cmmens).setText(Integer.toString(ns)));

				curevel.addContent(ble);
				break;
			}
			case Event.EVENT_ANNOTATIONTEXT:
			{
				curevel = new _Element("MiscItem",CMMEParser.cmmens);
				let tae:_Element = new _Element("TextAnnotation",CMMEParser.cmmens);
				let ae:AnnotationTextEvent =<AnnotationTextEvent> cure;
				let sl:number = ae.getstaffloc();
				tae.addContent(new _Element("Text",CMMEParser.cmmens).setText(ae.gettext()));
				if( sl != AnnotationTextEvent.DEFAULT_STAFFLOC)
					tae.addContent(new _Element("StaffLoc",CMMEParser.cmmens).setText(Integer.toString(sl)));

				curevel.addContent(tae);
				break;
			}
			case Event.EVENT_LACUNA:
			{
				curevel = new _Element("MiscItem",CMMEParser.cmmens);
				mile = new _Element("Lacuna",CMMEParser.cmmens);
				let le:LacunaEvent =<LacunaEvent> cure;
				if( le.getLength_1().i1 > 0)
					mile.addContent(CMMEParser.addProportion(new _Element("Length",CMMEParser.cmmens),le.getLength_1()));
				else
					mile.addContent(new _Element("Begin",CMMEParser.cmmens));

				curevel.addContent(mile);
				break;
			}
			case Event.EVENT_LACUNA_END:
			{
				curevel = new _Element("MiscItem",CMMEParser.cmmens);
				mile = new _Element("Lacuna",CMMEParser.cmmens);
				mile.addContent(new _Element("End",CMMEParser.cmmens));
				curevel.addContent(mile);
				break;
			}
			case Event.EVENT_MODERNKEYSIGNATURE:
			{
				curevel = new _Element("ModernKeySignature",CMMEParser.cmmens);
				let mkse:ModernKeySignatureEvent =<ModernKeySignatureEvent> cure;
				for(
				let i:Iterator<ModernKeySignatureElement> = mkse.getSigInfo().iterator();i.hasNext();)
				{
					let curSigEl:ModernKeySignatureElement =<ModernKeySignatureElement> i.next();
					let sigElTree:_Element = new _Element("Sig_Element",CMMEParser.cmmens);
					sigElTree.addContent(new _Element("Pitch",CMMEParser.cmmens).setText(`${curSigEl.pitch.noteletter}`));
					if( curSigEl.pitch.octave != - 1)
						sigElTree.addContent(new _Element("Octave",CMMEParser.cmmens).setText(`${curSigEl.pitch.octave}`));

					sigElTree.addContent(CMMEParser.addModernAccidentalData(new _Element("Accidental",CMMEParser.cmmens),curSigEl.accidental));
					curevel.addContent(sigElTree);
				}
				break;
			}
			case Event.EVENT_ELLIPSIS:
			{
				curevel = new _Element("MiscItem",CMMEParser.cmmens);
				curevel.addContent(new _Element("Ellipsis",CMMEParser.cmmens));
				break;
			}
			case Event.EVENT_SECTIONEND:
			{
				return null;
			}
			default:
			{
				curevel = new _Element("Event",CMMEParser.cmmens);
			}
		}
		if( cure.isColored())
			curevel.addContent(new _Element("Colored",CMMEParser.cmmens));

		if( cure.isEditorial())
			curevel.addContent(new _Element("Editorial",CMMEParser.cmmens));

		if( cure.isError())
			curevel.addContent(new _Element("Error",CMMEParser.cmmens));

		let ec:string = cure.getEdCommentary();
		if( ec != null)
			curevel.addContent(new _Element("EditorialCommentary",CMMEParser.cmmens).setText(ec));

		CMMEParser.lastcol = cure.getcoloration();
		return curevel;
	}

	// need to add Orientation etc 
	//       -- deprecated --
	//       curevel.addContent(new _Element("StaffLoc",cmmens).setText(
	//          Integer.toString(((DotEvent)cure).getstaffloc())));
	// need to add support for StaffLoc with no Locus 
	/*_Element*/
	// generic event _Attributes 
	/*------------------------------------------------------------------------
Method:  _Element addModernAccidentalData(_Element e,ModernAccidental ma)
Purpose: Construct tree segment for modern accidental data and add to _Element
Parameters:
  Input:  ModernAccidental ma - accidental data
  Output: _Element e           - target _Element
  Return: new _Element containing accidental data tree
------------------------------------------------------------------------*/
	static addModernAccidentalData(e:_Element,ma:ModernAccidental):_Element
	{
		if( ma.accType == ModernAccidental.ACC_NONE)
			e.addContent(new _Element("PitchOffset",CMMEParser.cmmens).setText(Integer.toString(ma.pitchOffset)));
		else
			{
				e.addContent(new _Element("AType",CMMEParser.cmmens).setText(ModernAccidental.AccidentalNames[ma.accType]));
				if( ma.numAcc != 1)
					e.addContent(new _Element("Num",CMMEParser.cmmens).setText(Integer.toString(ma.numAcc)));

			}

		if( ma.optional)
			e.addContent(new _Element("Optional",CMMEParser.cmmens));

		return e;
	}

	/*------------------------------------------------------------------------
Method:  _Element addColorationData(_Element e,Coloration c)
Purpose: Construct tree segment for coloration data and add to _Element
Parameters:
  Input:  Coloration c - coloration data
  Output: _Element e    - target _Element
  Return: modified _Element
------------------------------------------------------------------------*/
	static addColorationData(e:_Element,c:Coloration):_Element
	{
		let colel:_Element = new _Element("PrimaryColor",CMMEParser.cmmens);
		colel.addContent(new _Element("Color",CMMEParser.cmmens).setText(Coloration.ColorNames[c.primaryColor]));
		colel.addContent(new _Element("Fill",CMMEParser.cmmens).setText(Coloration.ColorFillNames[c.primaryFill]));
		e.addContent(colel);
		colel = new _Element("SecondaryColor",CMMEParser.cmmens);
		colel.addContent(new _Element("Color",CMMEParser.cmmens).setText(Coloration.ColorNames[c.secondaryColor]));
		colel.addContent(new _Element("Fill",CMMEParser.cmmens).setText(Coloration.ColorFillNames[c.secondaryFill]));
		e.addContent(colel);
		return e;
	}

	/*------------------------------------------------------------------------
Method:  _Element addLocusData(_Element e,Pitch p)
Purpose: Construct tree segment for Locus (pitch) data and add to _Element
Parameters:
  Input:  Pitch p   - pitch data
  Output: _Element e - target _Element
  Return: modified _Element
------------------------------------------------------------------------*/
	static addLocusData(e:_Element,p:Pitch):_Element
	{
		e.addContent(new _Element("LetterName",CMMEParser.cmmens).setText(`${p.noteletter}`));
		e.addContent(new _Element("OctaveNum",CMMEParser.cmmens).setText(Integer.toString(p.octave)));
		return e;
	}

	/*------------------------------------------------------------------------
Method:  _Element addNumberSequence(_Element e,int num)
Purpose: Construct tree segment for NumberSequence and add to _Element
Parameters:
  Input:  _Element e - target _Element
          int num   - number data
  Output: -
  Return: modified _Element
------------------------------------------------------------------------*/
	static addNumberSequence(e:_Element,num:number):_Element
	{
		e.addContent(new _Element("Num",CMMEParser.cmmens).setText(Integer.toString(num)));
		return e;
	}

	/*------------------------------------------------------------------------
Method:  _Element addNoteInfoData(_Element e,int nt,Proportion l)
Purpose: Construct tree segment for NoteInfoData and add to _Element
Parameters:
  Input:  _Element e    - target _Element
          int nt       - note type
          Proportion l - note length
  Output: -
  Return: modified _Element
------------------------------------------------------------------------*/
	static addNoteInfoData(e:_Element,nt:number,l:Proportion):_Element
	{
		e.addContent(new _Element("Type",CMMEParser.cmmens).setText(NoteEvent.NoteTypeNames[nt]));
		if( l != null && l.i1 != 0)
			e.addContent(CMMEParser.addProportion(new _Element("Length",CMMEParser.cmmens),l.reduce()));

		return e;
	}

	/*------------------------------------------------------------------------
Method:  _Element addSignumData(_Element e,Signum s)
Purpose: Construct tree segment for Signum and add to _Element
Parameters:
  Input:  _Element e - target _Element
          Signum s  - signum data
  Output: -
  Return: modified _Element
------------------------------------------------------------------------*/
	static addSignumData(e:_Element,s:Signum):_Element
	{
		if( s.offset != Signum.DEFAULT_YOFFSET)
			e.addContent(new _Element("Offset",CMMEParser.cmmens).setText(Integer.toString(s.offset)));

		if( s.orientation != Signum.UP)
			e.addContent(new _Element("Orientation",CMMEParser.cmmens).setText(Signum.orientationNames[s.orientation]));

		if( s.side != Signum.MIDDLE)
			e.addContent(new _Element("Side",CMMEParser.cmmens).setText(Signum.sideNames[s.side]));

		return e;
	}

	/*------------------------------------------------------------------------
Method:  _Element addProportion(_Element e,Proportion p)
Purpose: Construct tree segment for Proportion and add to _Element
Parameters:
  Input:  _Element e    - target _Element
          Proportion p - proportion data
  Output: -
  Return: modified _Element
------------------------------------------------------------------------*/
	static addProportion(e:_Element,p:Proportion):_Element
	{
		e.addContent(new _Element("Num",CMMEParser.cmmens).setText(Integer.toString(p.i1)));
		e.addContent(new _Element("Den",CMMEParser.cmmens).setText(Integer.toString(p.i2)));
		return e;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return _Attribute variables
Parameters:
  Input:  -
  Output: -
  Return: _Attribute variables
------------------------------------------------------------------------*/
	public getFileVersion_2():number
	{
		return this.fileVersion;
	}
}
