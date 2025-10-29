
import { Exception } from '../java/lang/Exception';
import { System } from '../java/lang/System';
import { Math } from '../java/lang/Math';
import { File } from '../java/io/File';
import { PrintStream } from '../java/io/PrintStream';
import { Event } from '../DataStruct/Event';
import { MensEvent } from '../DataStruct/MensEvent';
import { MensSignElement } from '../DataStruct/MensSignElement';
import { Mensuration } from '../DataStruct/Mensuration';
import { MultiEvent } from '../DataStruct/MultiEvent';
import { NoteEvent } from '../DataStruct/NoteEvent';
import { PieceData } from '../DataStruct/PieceData';
import { Pitch } from '../DataStruct/Pitch';
import { Proportion } from '../DataStruct/Proportion';
import { ProportionEvent } from '../DataStruct/ProportionEvent';
import { Voice } from '../DataStruct/Voice';
import { MeasureInfo } from '../Gfx/MeasureInfo';
import { MusicFont } from '../Gfx/MusicFont';
import { MusicWin } from '../Gfx/MusicWin';
import { OptionSet } from '../Gfx/OptionSet';
import { RenderedEvent } from '../Gfx/RenderedEvent';
import { RenderedSectionParams } from '../Gfx/RenderedSectionParams';
import { RenderedSonority } from '../Gfx/RenderedSonority';
import { RenderList } from '../Gfx/RenderList';
import { ScoreRenderer } from '../Gfx/ScoreRenderer';

export class Analyzer
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	/* for standalone application use */
	static screenoutput:boolean = false;
	static recursive:boolean = false;
	public static BaseDataDir:string = "/data/";
	public static BaseDataURL:string;
	static initdirectory:string;
	static NUM_MENSURATIONS:number = 4;
	static MENS_O:number = 0;
	static MENS_C:number = 1;
	static MENS_3:number = 2;
	static MENS_P:number = 3;
	static MENSURATION_NAMES:string[]=["O","C","3","P"];
	static NUMVOICES_FOR_RHYTHM_AVG:number = 2;
	/*----------------------------------------------------------------------*/
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	musicData:PieceData;
	renderedSections:ScoreRenderer[];
	numVoices:number;
	/* analysis results */
	public vad:VoiceAnalysisData[];
	public totalUnpreparedSBDiss:number = 0;
	public totalPassingDissSMPair:number = 0;
	public totalOffbeatDissM:number = 0;
	public avgRhythmicDensity:number[];
	public avgSyncopationDensity:number = 0;
	public OCLength:number = 0;
	public passingSMDissDensity:number = 0;
	public offbeatMDissDensity:number = 0;
	public dissDensity:number = 0;

	/*----------------------------------------------------------------------*/
	/*----------------------------------------------------------------------*/
	/* Class methods */
	/*------------------------------------------------------------------------
Method:  void main(String args[])
Purpose: Main routine
Parameters:
  Input:  String args[] - program arguments
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public static main(args:string[]):void
	{
		let cmdlineFilename:string = Analyzer.parseCmdLine(args);
		try
		{
			Analyzer.initdirectory = new File(".").getCanonicalPath() + Analyzer.BaseDataDir;
			Analyzer.BaseDataURL = "file:///" + Analyzer.initdirectory;
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					System.err.println("Error loading local file locations: " + e);
					e.printStackTrace();
				}

			else
				throw e;

		}
		MusicWin.initScoreWindowing_1(Analyzer.BaseDataURL,Analyzer.initdirectory + "music/",false);
		try
		{
			MusicFont.loadmusicface(Analyzer.BaseDataURL);
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					System.err.println("Error loading font: " + e);
					e.printStackTrace();
				}

			else
				throw e;

		}
		Analyzer.analyzeFiles(cmdlineFilename);
	}

	/* initialize data locations */
	//DataStruct.XMLReader.initparser(BaseDataURL,false); //CHANGE
	/*------------------------------------------------------------------------
Method:  void analyzeFiles(String mainFilename)
Purpose: Analyze one set of files (recursing to subdirectories if necessary)
Parameters:
  Input:  String mainFilename - name of file set in one directory
          String subdirName   - name of subdirectory (null for base directory)
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static analyzeFiles(mainFilename:string):void
	{
	}

	/* //CHANGE
    try
      {
        PrintStream outs;
        OptionSet   optSet=new OptionSet(null);

        RecursiveFileList    fl=new RecursiveFileList(mainFilename,recursive);
        LinkedList<Analyzer> results=new LinkedList<Analyzer>();

        //analyze individual pieces 
        for (File curfile : fl)
          {
            URL fileURL=curfile.toURI().toURL();
            String fileName=curfile.getName();
                   
            System.out.print("Analyzing: "+fileName+"...");

            PieceData       musicData=new CMMEParser(fileURL).piece;
            ScoreRenderer[] renderedSections=renderSections(musicData,optSet);
            Analyzer        a=new Analyzer(musicData,renderedSections);

            outs=screenoutput ? System.out : new PrintStream("data/stats/"+fileName+".txt");
            a.printGeneralAnalysis(outs);
            if (!screenoutput)
              outs.close();

            System.out.println("done");

            results.add(a);
          }

        // output result summary 
        outs=screenoutput ? System.out : new PrintStream("data/stats/summary.txt");
        if (screenoutput)
          {
            outs.println();
            outs.println("SUMMARY");
            outs.println();
          }
        outs.println("Composer\tTitle\tDensity (O)\tDensity (C)\tDensity (3)\tDensity (P)\tSyncop density\tUnprepared syncop diss\tPassing SM diss density\tOffbeat M diss density");
        for (Analyzer a : results)
          {
            outs.print(a.musicData.getComposer()+"\t"+a.musicData.getFullTitle());
            for (int mi=0; mi<NUM_MENSURATIONS; mi++)
              {
                outs.print("\t");
                if (a.avgRhythmicDensity[mi]>0)
                  outs.print(String.valueOf(a.avgRhythmicDensity[mi]));
                else
                  outs.print("-");
              }
            outs.print("\t"+a.avgSyncopationDensity+"\t"+a.totalUnpreparedSBDiss);
            outs.print("\t"+a.passingSMDissDensity+"\t"+a.offbeatMDissDensity);
            outs.println();
          }
        if (!screenoutput)
          outs.close();
      }
    catch (Exception e)
      {
        System.err.println("Error: "+e);
        e.printStackTrace();
      }*/
	/*------------------------------------------------------------------------
Method:  String parseCmdLine(String args[])
Purpose: Parse command line
Parameters:
  Input:  String args[] - program arguments
  Output: -
  Return: filename (or "*" if recursive with no filename specified)
------------------------------------------------------------------------*/
	static parseCmdLine(args:string[]):string
	{
		let fn:string = null;
		if( args.length < 1)
			Analyzer.usage_exit();

		for(
		let i:number = 0;i < args.length;i ++)
		if( args[i].charAt(0) == "-")
			for(
			let opti:number = 1;opti < args[i].length;opti ++)
			switch( args[i].charAt(opti))
			{
				case "s":
				{
					Analyzer.screenoutput = true;
					break;
				}
				case "r":
				{
					Analyzer.recursive = true;
					break;
				}
				default:
				{
					Analyzer.usage_exit();
				}
			}

		else
			if( i !=(( args.length - 1) | 0))
				Analyzer.usage_exit();
			else
				fn = args[i];

		if( fn == null)
			if( Analyzer.recursive)
				fn = "*";
			else
				Analyzer.usage_exit();

		return "data\\music\\" + fn;
	}

	/* options */
	/* filename */
	/*------------------------------------------------------------------------
Method:  void usage_exit()
Purpose: Exit for invalid command line
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	static usage_exit():void
	{
		System.err.println("Usage: java Util.Analyzer [options] filename");
		System.err.println("Options:");
		System.err.println("  -s: Screen output");
		System.err.println("  -r: Recursively search subdirectories");
		System.exit(1);
	}
	/*------------------------------------------------------------------------
Method:  ScoreRenderer[] void renderSections()
Purpose: Pre-render all sections of one piece
Parameters:
  Input:  -
  Output: -
  Return: rendered section array
------------------------------------------------------------------------*/
	static SECTION_END_SPACING:number = 10;

	static renderSections(musicData:PieceData,options:OptionSet):ScoreRenderer[]
	{
		let startX:number = 0;
		let numVoices:number = musicData.getVoiceData().length;
		let sectionParams:RenderedSectionParams[]= Array(numVoices);
		for(
		let i:number = 0;i < numVoices;i ++)
		sectionParams[i]= RenderedSectionParams.new0();
		let numSections:number = musicData.getNumSections();
		let renderedSections:ScoreRenderer[]= Array(numSections);
		let nummeasures:number = 0;
		for(
		let i:number = 0;i < numSections;i ++)
		{
			renderedSections[i]= new ScoreRenderer(i,musicData.getSection(i),musicData,sectionParams,options,nummeasures,startX);
			sectionParams = renderedSections[i].getEndingParams();
			nummeasures += renderedSections[i].getNumMeasures();
			startX += renderedSections[i].getXsize() + Analyzer.SECTION_END_SPACING;
		}
		return renderedSections;
	}
	/* initialize voice parameters */
	/* initialize sections */
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: Analyzer(PieceData musicData,ScoreRenderer renderedSections[])
Purpose:     Initialize analysis functions for one score
Parameters:
  Input:  PieceData musicData              - original music data
          ScoreRenderer renderedSections[] - scored+rendered music data
  Output: -
------------------------------------------------------------------------*/
	public constructor(musicData:PieceData,renderedSections:ScoreRenderer[])
	{
		this.musicData = musicData;
		this.renderedSections = renderedSections;
		this.numVoices = musicData.getVoiceData().length;
	}

	/*------------------------------------------------------------------------
Method:  void printGeneralAnalysis(PrintStream outp)
Purpose: Print generic score analysis
Parameters:
  Input:  -
  Output: PrintStream outp - output destination
  Return: -
------------------------------------------------------------------------*/
	public printGeneralAnalysis(outp:PrintStream):void
	{
		outp.println("General analysis: " + this.musicData.getComposer() + ", " + this.musicData.getFullTitle());
		outp.println();
		outp.println("Number of voices: " + this.numVoices);
		outp.println("Number of sections: " + this.renderedSections.length);
		outp.println();
		this.vad = Array(this.numVoices);
		for(
		let i:number = 0;i < this.numVoices;i ++)
		{
			this.vad[i]= new VoiceAnalysisData();
			this.vad[i].vData = this.musicData.getVoiceData()[i];
		}
		this.totalUnpreparedSBDiss = 0;
		this.totalPassingDissSMPair = 0;
		for(let s of this.renderedSections)
		{
			for(
			let i:number = 0;i < s.getNumVoices();i ++)
			{
				let curMens:number = Analyzer.MENS_C;
				let curProp:Proportion = Proportion.new1(Proportion.EQUALITY);
				let curPropVal:number = curProp.toDouble();
				let curMensStartTime:number = 0;
				let rl:RenderList = s.getRenderedVoice(i);
				if( rl == null)
					break;

				let vnum:number = - 1;
				for(
				let i1:number = 0;i1 < this.numVoices;i1 ++)
				if( rl.getVoiceData() == this.vad[i1].vData)
					vnum = i1;

				let ne:NoteEvent = null;
				let rne:RenderedEvent = null;
				let renum:number = 0;
				for(let re of rl)
				{
					switch( re.getEvent_1().geteventtype())
					{
						case Event.EVENT_NOTE:
						{
							ne =<NoteEvent> re.getEvent_1();
							rne = re;
							this.vad[i].numNotes[curMens]++;
							this.vad[i].totalNumNotes ++;
							this.vad[i].totalNoteLengths[curMens]+= ne.getmusictime().toDouble() * curPropVal;
							if( ne.getPitch_1().isLowerThan(this.vad[i].lowestPitch))
								this.vad[i].lowestPitch = ne.getPitch_1();

							if( ne.getPitch_1().isHigherThan(this.vad[i].highestPitch))
								this.vad[i].highestPitch = ne.getPitch_1();

							if( curMens != Analyzer.MENS_3 && curMens != Analyzer.MENS_P)
								{
									this.vad[i].numNotesOC ++;
									if( this.syncopated(s,re))
										this.vad[i].totalOffbeat ++;

									if( this.isUnpreparedSuspension(s,re))
										{
											this.totalUnpreparedSBDiss ++;
											outp.println("Unprepared SB/M dissonance in m. " +((( re.getmeasurenum() + 1) | 0)));
										}

									if( this.isPassingDissonantSMPair(s,i,renum))
										this.totalPassingDissSMPair ++;

									if( this.isOffbeatDissonantM(s,re))
										this.totalOffbeatDissM ++;

								}

							break;
						}
						case Event.EVENT_MULTIEVENT:
						{
							let m:Mensuration = re.getEvent_1().getMensInfo_1();
							if( m != null)
								curMens = this.getMensType(m);

							break;
						}
						case Event.EVENT_MENS:
						{
							this.vad[i].totalPassageLengths[curMens]+= re.getmusictime().toDouble() - curMensStartTime;
							curMensStartTime = re.getmusictime().toDouble();
							curMens = this.getMensType(re.getEvent_1().getMensInfo_1());
							if( curMens == Analyzer.MENS_O &&(<MensEvent> re.getEvent_1()).getSigns().size() > 1 ||(<MensEvent> re.getEvent_1()).getMainSign().signType == MensSignElement.NUMBERS)
								curMens = Analyzer.MENS_3;

							break;
						}
						case Event.EVENT_PROPORTION:
						{
							curProp.multiply_2((<ProportionEvent> re.getEvent_1()).getproportion());
							curPropVal = curProp.toDouble();
							break;
						}
					}
					renum ++;
				}
				if( ne != null)
					{
						this.vad[i].numNotes[curMens]--;
						this.vad[i].totalNumNotes --;
						this.vad[i].totalNoteLengths[curMens]-= ne.getmusictime().toDouble() * curPropVal;
						this.vad[i].totalPassageLengths[curMens]+= rne.getmusictime().toDouble() - curMensStartTime;
					}

			}
		}
		if( this.totalUnpreparedSBDiss > 0)
			outp.println();

		for(
		let i:number = 0;i < this.numVoices;i ++)
		{
			outp.println("Voice " +((( i + 1) | 0)) + ": " + this.musicData.getVoiceData()[i].getName());
			outp.println("  Range: " + this.vad[i].lowestPitch + " - " + this.vad[i].highestPitch);
			for(
			let mi:number = 0;mi < Analyzer.NUM_MENSURATIONS;mi ++)
			if( this.vad[i].numNotes[mi]!= 0)
				{
					outp.println("  Mensuration type: " + Analyzer.MENSURATION_NAMES[mi]);
					outp.println("    Number of notes (not including final): " + this.vad[i].numNotes[mi]);
					outp.println("    Total note lengths: " + this.vad[i].totalNoteLengths[mi]);
					this.vad[i].rhythmicDensity[mi]= this.vad[i].totalNoteLengths[mi]/<number> this.vad[i].numNotes[mi];
					outp.println("    Rhythmic density: " + this.vad[i].rhythmicDensity[mi]);
				}

			this.vad[i].syncopationDensity =<number> this.vad[i].totalOffbeat /<number> this.vad[i].numNotesOC;
			outp.println("  Number of syncopated notes: " + this.vad[i].totalOffbeat);
			outp.println("  Syncopation density: " + this.vad[i].syncopationDensity);
			outp.println();
		}
		this.avgRhythmicDensity =[0,0,0,0];
		outp.println();
		outp.println("Averages for highest " + Analyzer.NUMVOICES_FOR_RHYTHM_AVG + " voices");
		for(
		let i:number = 0;i < this.numVoices && i < Analyzer.NUMVOICES_FOR_RHYTHM_AVG;i ++)
		for(
		let mi:number = 0;mi < Analyzer.NUM_MENSURATIONS;mi ++)
		if( this.vad[i].numNotes[mi]> 0)
			this.avgRhythmicDensity[mi]+= this.vad[i].rhythmicDensity[mi]/ 2;

		for(
		let mi:number = 0;mi < Analyzer.NUM_MENSURATIONS;mi ++)
		{
			if( this.numVoices >(( Analyzer.NUMVOICES_FOR_RHYTHM_AVG - 1) | 0))
				this.avgRhythmicDensity[mi]/=<number> Analyzer.NUMVOICES_FOR_RHYTHM_AVG;

			if( this.avgRhythmicDensity[mi]> 0)
				outp.println("  Rhythmic density in SB (" + Analyzer.MENSURATION_NAMES[mi]+ "): " + this.avgRhythmicDensity[mi]);

		}
		this.avgSyncopationDensity = 0;
		for(
		let i:number = 0;i < this.numVoices && i < Analyzer.NUMVOICES_FOR_RHYTHM_AVG;i ++)
		this.avgSyncopationDensity += this.vad[i].syncopationDensity;
		if( this.numVoices >(( Analyzer.NUMVOICES_FOR_RHYTHM_AVG - 1) | 0))
			this.avgSyncopationDensity /=<number> Analyzer.NUMVOICES_FOR_RHYTHM_AVG;

		outp.println("  Syncopation density: " + this.avgSyncopationDensity);
		if( this.totalUnpreparedSBDiss > 0)
			outp.println("Number of unprepared syncopated SB/M dissonances: " + this.totalUnpreparedSBDiss);

		outp.println("Number of passing dissonant SM pairs: " + this.totalPassingDissSMPair);
		outp.println("Number of dissonant offbeat Ms: " + this.totalOffbeatDissM);
		let avgMensLengths:number[]=[0,0,0,0];
		for(
		let i:number = 0;i < this.numVoices;i ++)
		for(
		let mi:number = 0;mi < Analyzer.NUM_MENSURATIONS;mi ++)
		avgMensLengths[mi]+= this.vad[i].totalPassageLengths[mi];
		for(
		let mi:number = 0;mi < Analyzer.NUM_MENSURATIONS;mi ++)
		avgMensLengths[mi]/=<number> this.numVoices;
		this.OCLength =((( avgMensLengths[Analyzer.MENS_O]+ avgMensLengths[Analyzer.MENS_C]) / 2) | 0);
		this.passingSMDissDensity = this.totalPassingDissSMPair / this.OCLength;
		this.offbeatMDissDensity = this.totalOffbeatDissM / this.OCLength;
		this.dissDensity =((( this.totalPassingDissSMPair + this.totalOffbeatDissM) | 0)) / this.OCLength;
		outp.println("Total length of O/C sections: " + this.OCLength);
		outp.println("Passing dissonant SM pair density: " + this.passingSMDissDensity);
		outp.println("Offbeat dissonant M density: " + this.offbeatMDissDensity);
	}

	// to be implemented
	/* discount final longa */
	/* averages of the top two voices */
	// for SB, not minims
	/* in SB */
	//    outp.println("Basic dissonance density: "+dissDensity);
	getMensType(m:Mensuration):number
	{
		if( m.prolatio == Mensuration.MENS_TERNARY)
			return Analyzer.MENS_P;

		if( m.tempus == Mensuration.MENS_TERNARY)
			return Analyzer.MENS_O;

		return Analyzer.MENS_C;
	}

	isUnpreparedSuspension(s:ScoreRenderer,re:RenderedEvent):boolean
	{
		let measure:MeasureInfo = s.getMeasure(re.getmeasurenum());
		let mt:number = re.getmusictime().toDouble();
		let measurePos:number = mt - measure.startMusicTime.toDouble();
		let len:number = re.getEvent_1().getLength_1().toDouble();
		let ne:NoteEvent =<NoteEvent> re.getEvent_1();
		if( re.getmusictime().i2 % 3 == 0)
			return false;

		if( len < 1)
			return false;

		if( len >= 2 &&(<number> measurePos) % 2 == 0)
			return false;

		if( len >= 1 && len < 2 &&<number>( measurePos -<number> measurePos) <= 0)
			return false;

		let p:Pitch = ne.getPitch_1();
		let rs:RenderedSonority = re.getFullSonority();
		for(
		let i:number = 0;i < rs.getNumPitches();i ++)
		if( this.isDissonant(p,rs.getPitch(i),i == 0) && rs.getRenderedNote(i).getmusictime().toDouble() < mt)
			return true;

		return false;
	}

	/* avoid sesquialtera/tripla */
	isPassingDissonantSMPair(s:ScoreRenderer,vnum:number,renum:number):boolean
	{
		let re:RenderedEvent = s.eventinfo[vnum].getEvent(renum);
		let measure:MeasureInfo = s.getMeasure(re.getmeasurenum());
		let mt:number = re.getmusictime().toDouble();
		let measurePos:number = mt - measure.startMusicTime.toDouble();
		let ne:NoteEvent =<NoteEvent> re.getEvent_1();
		if( ne.getnotetype_1() != NoteEvent.NT_Semiminima ||<number>( measurePos -<number> measurePos) > 0 ||(<number> measurePos) % 2 == 0)
			return false;

		let nextNote:RenderedEvent = s.getNeighboringEventOfType(Event.EVENT_NOTE,vnum,(( renum + 1) | 0),1);
		if( nextNote == null || nextNote.getmusictime().toDouble() > mt + 0.5)
			return false;

		let e:Event = nextNote.getEvent_1();
		let ne2:NoteEvent = e.geteventtype() == Event.EVENT_MULTIEVENT ?(<MultiEvent> e).getLowestNote():<NoteEvent> e;
		if( ne2.getnotetype_1() != NoteEvent.NT_Semiminima)
			return false;

		let p:Pitch = ne.getPitch_1();
		let rs:RenderedSonority = re.getFullSonority();
		for(
		let i:number = 0;i < rs.getNumPitches();i ++)
		if( this.isDissonant(p,rs.getPitch(i),i == 0))
			return true;

		return false;
	}

	/* check next note */
	/* check for dissonance */
	isOffbeatDissonantM(s:ScoreRenderer,re:RenderedEvent):boolean
	{
		let measure:MeasureInfo = s.getMeasure(re.getmeasurenum());
		let mt:number = re.getmusictime().toDouble();
		let measurePos:number = mt - measure.startMusicTime.toDouble();
		let len:number = re.getEvent_1().getLength_1().toDouble();
		let ne:NoteEvent =<NoteEvent> re.getEvent_1();
		if( ne.getnotetype_1() != NoteEvent.NT_Minima ||<number>( measurePos -<number> measurePos) > 0 ||(<number> measurePos) % 2 == 0)
			return false;

		if( len > 1)
			return false;

		let p:Pitch = ne.getPitch_1();
		let rs:RenderedSonority = re.getFullSonority();
		for(
		let i:number = 0;i < rs.getNumPitches();i ++)
		if( this.isDissonant(p,rs.getPitch(i),i == 0) && rs.getRenderedNote(i).getmusictime().toDouble() < mt)
			return true;

		return false;
	}

	isDissonant(p1:Pitch,p2:Pitch,bassInterval:boolean):boolean
	{
		let interval:number = this.getAbsInterval(p1,p2);
		if( interval == 2 || interval == 7 ||( bassInterval && interval == 4))
			return true;

		return false;
	}

	getAbsInterval(p1:Pitch,p2:Pitch):number
	{
		return(( Math.abs((( p1.placenum - p2.placenum) | 0)) % 7 + 1) | 0);
	}

	syncopated(s:ScoreRenderer,re:RenderedEvent):boolean
	{
		let measure:MeasureInfo = s.getMeasure(re.getmeasurenum());
		let mt:number = re.getmusictime().toDouble();
		let measurePos:number = mt - measure.startMusicTime.toDouble();
		let len:number = re.getEvent_1().getLength_1().toDouble();
		if( re.getmusictime().i2 % 3 == 0)
			return false;

		if( len <= 0.5)
			return false;

		if( len <= 1 && measurePos -<number> measurePos > 0)
			return true;

		if( len > 1 &&( measurePos -<number> measurePos > 0 ||(<number> measurePos) % 2 != 0))
			return true;

		return false;
	}
}

/* avoid sesquialtera/tripla */
/* no SM or smaller */
/*------------------------------------------------------------------------
Class:   VoiceAnalysisData
Extends: -
Purpose: Analysis parameters for one voice
------------------------------------------------------------------------*/
export class VoiceAnalysisData
{
	vData:Voice = null;
	numNotes:number[]=[0,0,0,0];
	totalNumNotes:number = 0;
	numNotesOC:number = 0;
	totalNoteLengths:number[]=[0,0,0,0];
	rhythmicDensity:number[]=[0,0,0,0];
	totalPassageLengths:number[]=[0,0,0,0];
	lowestPitch:Pitch = Pitch.HIGHEST_PITCH;
	highestPitch:Pitch = Pitch.LOWEST_PITCH;
	totalOffbeat:number = 0;
	syncopationDensity:number = 0;public constructor()
	{
	}
}
