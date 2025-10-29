
import { Exception } from '../java/lang/Exception';
import { Integer } from '../java/lang/Integer';
import { Float } from '../java/lang/Float';
import { RuntimeException } from '../java/lang/RuntimeException';
import { Double } from '../java/lang/Double';
import { ScoreRenderer } from './ScoreRenderer';
import { VoiceGfxInfo } from './ScoreRenderer';
import { RenderedEvent } from './RenderedEvent';
import { NoteShapeStyleListener } from './MusicWin';
import { BarlineStyleListener } from './MusicWin';
import { ViewSizeListener } from './MusicWin';
import { PDFFileFilter } from './MusicWin';
import { HTMLFileFilter } from './MusicWin';
import { XMLFileFilter } from './MusicWin';
import { MIDIFileFilter } from './MusicWin';
import { CMMEFileFilter } from './MusicWin';
import { MusicWin } from './MusicWin';
import { MeasureInfo } from './MeasureInfo';
import { File } from '../java/io/File';
import { HashMap } from '../java/util/HashMap';
import { Iterator } from '../java/util/Iterator';
import { MidiSystem } from '../javax/sound/midi/MidiSystem';
import { MidiEvent } from '../javax/sound/midi/MidiEvent';
import { Synthesizer } from '../javax/sound/midi/Synthesizer';
import { Sequencer } from '../javax/sound/midi/Sequencer';
import { ShortMessage } from '../javax/sound/midi/ShortMessage';
import { MidiChannel } from '../javax/sound/midi/MidiChannel';
import { MetaMessage } from '../javax/sound/midi/MetaMessage';
import { Sequence } from '../javax/sound/midi/Sequence';
import { MetaEventListener } from '../javax/sound/midi/MetaEventListener';
import { Track } from '../javax/sound/midi/Track';
import { JOptionPane } from '../javax/swing/JOptionPane';
import { Event } from '../DataStruct/Event';
import { MultiEvent } from '../DataStruct/MultiEvent';
import { NoteEvent } from '../DataStruct/NoteEvent';
import { PieceData } from '../DataStruct/PieceData';
import { Proportion } from '../DataStruct/Proportion';
import { ProportionEvent } from '../DataStruct/ProportionEvent';
import { RestEvent } from '../DataStruct/RestEvent';
import { GlobalConfig } from '../Util/GlobalConfig';

export class SequenceParams
{
	curTime:Proportion;
	curProportion:Proportion;
	sectionStartTime:Proportion;
	vnum:number;
	inTie:boolean;
	beginTie:boolean;
	endTie:boolean;
	doubleTied:boolean;
}

/*------------------------------------------------------------------------
Class:   MIDIPlayer
Extends: -
Purpose: MIDI playback for CMME scores
------------------------------------------------------------------------*/
export class MIDIPlayer
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	static TICKS_PER_BEAT:number = 96;
	static TICKS_PER_MINIM:number =(( MIDIPlayer.TICKS_PER_BEAT / 2) | 0);
	static MAX_NORMAL_CHANNELS:number = 7;
	static VOLUME_CONTROLLER:number = 7;
	static MIDI_EVENT_MARKER:number = 6;
	static MIDI_EVENT_ENDOFTRACK:number = 47;
	static PATCH_TROMBONE:string = "57";
	static DEFAULTS:HashMap<string,string>;static
	{
		MIDIPlayer.DEFAULTS = new HashMap<string,string>();
		MIDIPlayer.DEFAULTS.put("BPM","80");
		MIDIPlayer.DEFAULTS.put("MPQ","800000");
		MIDIPlayer.DEFAULTS.put("RestBetweenSections","2");
		MIDIPlayer.DEFAULTS.put("Instrument",MIDIPlayer.PATCH_TROMBONE);
		MIDIPlayer.DEFAULTS.put("Velocity","50");
		MIDIPlayer.DEFAULTS.put("Gain","0.9");
	}

	static configVal(key:string):string
	{
		let val:string = GlobalConfig.get("MIDI/" + key);
		return val != null ? val:MIDIPlayer.DEFAULTS.get(key);
	}
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	parentWin:MusicWin;
	/* parent window */
	musicData:PieceData;
	/* original event lists */
	renderedSections:ScoreRenderer[];
	/* event lists rendered into measures */
	sequenceData:Sequence;
	sequencer:Sequencer = null;
	playbackListener:MetaEventListener;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: MIDIPlayer(MusicWin parentWin,PieceData musicData,ScoreRenderer[] renderedSections)
Purpose:     Initialize player for one piece
Parameters:
  Input:  MusicWin parentWin               - parent window
          PieceData musicData              - original event lists
          ScoreRenderer[] renderedSections - event lists rendered into measures
  Output: -
------------------------------------------------------------------------*/
	public constructor(parentWin:MusicWin,musicData:PieceData,renderedSections:ScoreRenderer[])
	{
		this.parentWin = parentWin;
		this.setMusicData(musicData,renderedSections);
	}

	/*------------------------------------------------------------------------
Method:  void setMusicData(PieceData musicData,ScoreRenderer[] renderedSections)
Purpose: Initialize player with new data and create sequence
Parameters:
  Input:  PieceData musicData              - original event lists
          ScoreRenderer[] renderedSections - event lists rendered into measures
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public setMusicData(musicData:PieceData,renderedSections:ScoreRenderer[]):void
	{
		this.musicData = musicData;
		this.renderedSections = renderedSections;
		try
		{
			this.sequenceData = this.constructSequence(musicData,renderedSections);
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					JOptionPane.showMessageDialog(this.parentWin,"Error initializing MIDI system: " + e,"Error",JOptionPane.ERROR_MESSAGE);
					this.sequenceData = null;
				}

			else
				throw e;

		}
	}

	/*------------------------------------------------------------------------
Method:  Sequence constructSequence(PieceData musicData,ScoreRenderer[] renderedSections)
Purpose: Create sequence out of music data
Parameters:
  Input:  PieceData musicData              - original event lists
          ScoreRenderer[] renderedSections - event lists rendered into measures
  Output: -
  Return: new MIDI sequence
------------------------------------------------------------------------*/
	constructSequence(musicData:PieceData,renderedSections:ScoreRenderer[]):Sequence
	{
		let s:Sequence = new Sequence(Sequence.PPQ,MIDIPlayer.TICKS_PER_BEAT,musicData.getVoiceData().length);
		let t:Track[]= s.getTracks();
		let MIDImsg:ShortMessage;
		for(
		let vi:number = 0;vi < musicData.getVoiceData().length;vi ++)
		{
			MIDImsg = new ShortMessage();
			MIDImsg.setMessage(ShortMessage.PROGRAM_CHANGE,vi % MIDIPlayer.MAX_NORMAL_CHANNELS,Integer.parseInt(MIDIPlayer.configVal("Instrument")),0);
			t[vi].add(new MidiEvent(MIDImsg,0));
		}
		let params:SequenceParams = new SequenceParams();
		let sectionEndTime:Proportion;
		params.sectionStartTime = Proportion.new0(0,1);
		for(let rs of renderedSections)
		{
			sectionEndTime = Proportion.new1(params.sectionStartTime);
			for(
			let vi:number = 0;vi < musicData.getVoiceData().length;vi ++)
			if( rs.eventinfo[vi]!= null)
				{
					params.vnum = vi;
					params.curTime = Proportion.new1(params.sectionStartTime);
					params.curProportion = Proportion.new0(1,1);
					params.inTie = false;
					for(let re of rs.eventinfo[vi])
					this.sequenceEvent_6(re,t[vi],params);
					if( params.curTime.greaterThan(sectionEndTime))
						sectionEndTime = params.curTime;

				}

			this.addMeasureMarkers(rs,t[0],params.sectionStartTime);
			params.sectionStartTime = Proportion.sum(sectionEndTime,Proportion.new0(Integer.parseInt(MIDIPlayer.configVal("RestBetweenSections")),1));
		}
		return s;
	}

	/* set patch (instrument) number for each voice */
	/* insert beat of rest between sections */
	sequenceEvent_1(e:NoteEvent,t:Track,params:SequenceParams,length:Proportion):void
	{
		if( !( params.doubleTied || params.endTie))
			{
				let MIDImsg:ShortMessage = new ShortMessage();
				MIDImsg.setMessage(ShortMessage.NOTE_ON,params.vnum % MIDIPlayer.MAX_NORMAL_CHANNELS,e.getMIDIPitch(),Integer.parseInt(MIDIPlayer.configVal("Velocity")));
				t.add(new MidiEvent(MIDImsg,<number>( params.curTime.toDouble() * MIDIPlayer.TICKS_PER_MINIM)));
			}

		params.curTime.add(length);
		if( !( params.beginTie || params.doubleTied))
			{
				let MIDImsg:ShortMessage = new ShortMessage();
				MIDImsg.setMessage(ShortMessage.NOTE_OFF,params.vnum % MIDIPlayer.MAX_NORMAL_CHANNELS,e.getMIDIPitch(),Integer.parseInt(MIDIPlayer.configVal("Velocity")));
				t.add(new MidiEvent(MIDImsg,<number>( params.curTime.toDouble() * MIDIPlayer.TICKS_PER_MINIM)));
			}

	}

	sequenceEvent_2(e:RestEvent,t:Track,params:SequenceParams,length:Proportion):void
	{
	}

	//    params.curTime.add(Proportion.quotient(e.getmusictime(),params.curProportion));
	sequenceEvent_3(e:ProportionEvent,t:Track,params:SequenceParams,length:Proportion):void
	{
		params.curProportion.multiply_2(e.getproportion());
	}

	sequenceEvent_4(me:MultiEvent,t:Track,params:SequenceParams,length:Proportion):void
	{
		let origTime:Proportion = Proportion.new1(params.curTime);
		let lastTime:Proportion = Proportion.new1(params.curTime);
		for(
		let i:Iterator<Event> = me.iterator_2();i.hasNext();)
		{
			let e:Event =<Event> i.next();
			switch( e.geteventtype())
			{
				case Event.EVENT_NOTE:
				{
					this.sequenceEvent_1(<NoteEvent> e,t,params,length);
					if( params.curTime.greaterThan(lastTime))
						lastTime = Proportion.new1(params.curTime);

					params.curTime = Proportion.new1(origTime);
					break;
				}
				case Event.EVENT_REST:
				{
					this.sequenceEvent_2(<RestEvent> e,t,params,length);
					if( params.curTime.greaterThan(lastTime))
						lastTime = Proportion.new1(params.curTime);

					params.curTime = Proportion.new1(origTime);
					break;
				}
			}
		}
		params.curTime = Proportion.new1(lastTime);
	}

	sequenceEvent_5(e:Event,t:Track,params:SequenceParams,length:Proportion):void
	{
		switch( e.geteventtype())
		{
			case Event.EVENT_NOTE:
			{
				this.sequenceEvent_1(<NoteEvent> e,t,params,length);
				break;
			}
			case Event.EVENT_REST:
			{
				this.sequenceEvent_2(<RestEvent> e,t,params,length);
				break;
			}
			case Event.EVENT_PROPORTION:
			{
				this.sequenceEvent_3(<ProportionEvent> e,t,params,length);
				break;
			}
			case Event.EVENT_MULTIEVENT:
			{
				this.sequenceEvent_4(<MultiEvent> e,t,params,length);
				break;
			}
			default:
			{
				break;
			}
		}
	}

	sequenceEvent_6(re:RenderedEvent,t:Track,params:SequenceParams):void
	{
		if( ! params.inTie)
			{
				params.beginTie =( params.inTie = re.getTieInfo().firstEventNum != - 1);
				params.doubleTied = false;
				params.endTie = false;
			}

		else
			{
				params.beginTie = false;
				params.doubleTied = re.doubleTied();
				params.endTie = ! params.doubleTied;
			}

		params.curTime = Proportion.sum(params.sectionStartTime,re.getmusictime());
		this.sequenceEvent_5(re.getEvent_1(),t,params,re.getMusicLength());
		if( params.endTie)
			params.inTie = false;

	}

	/*------------------------------------------------------------------------
Methods: void addMeasureMarkers(ScoreRenderer rs,Track t,Proportion startTime)
Purpose: Insert meta-event markers for measure beginnings
Parameters:
  Input:  ScoreRenderer rs     - section to calculate
          Proportion startTime - starting time of section
  Output: Track t              - track to update with events
  Return: -
------------------------------------------------------------------------*/
	stringGetBytes(s:string):number[]
	{
		
    const byteArray: number[] = [];
    for (let i = 0; i < s.length; i++)
    {
      const codePoint = s.charCodeAt(i);
      byteArray.push(codePoint);
    }
    return byteArray;    
}

	addMeasureMarkers(rs:ScoreRenderer,t:Track,startTime:Proportion):void
	{
		let curTime:Proportion = Proportion.new1(startTime);
		for(
		let mi:number = rs.getFirstMeasureNum();mi <= rs.getLastMeasureNum();mi ++)
		{
			let measureMsg:MetaMessage = new MetaMessage();
			let msgData:number[]= this.stringGetBytes("m" + mi);
			measureMsg.setMessage(MIDIPlayer.MIDI_EVENT_MARKER,msgData,msgData.length);
			t.add(new MidiEvent(measureMsg,<number>( curTime.toDouble() * MIDIPlayer.TICKS_PER_MINIM)));
			let m:MeasureInfo = rs.getMeasure(mi);
			curTime.add(Proportion.quotient(Proportion.new0(m.numMinims,1),m.defaultTempoProportion));
		}
	}

	/* add marker message for measure start */
	//byte[] msgData=("m"+mi).getBytes();
	/* advance timer */
	/*------------------------------------------------------------------------
Method:  void exportMIDIFile(String fn)
Purpose: Save to MIDI file
Parameters:
  Input:  String fn - filename
  Output: -
  Return: -
------------------------------------------------------------------------*/
	public exportMIDIFile(fn:string):void
	{
		MidiSystem.write(this.sequenceData,1,new File(fn));
	}
	// System.out.println("Wrote "+MidiSystem.write(sequenceData,1,new File(fn))+" bytes");  //CHANGE
	/*------------------------------------------------------------------------
Method:  void play/stop()
Purpose: Play back or stop pre-loaded music
Parameters:
  Input:  -
  Output: -
  Return: -
------------------------------------------------------------------------*/
	_currentlyPlaying:number = 0;

	public play_1():void
	{
		this.play_2(0);
	}

	private stringToInt(s:string):number
	{
		
 return parseInt(s, 10);
 
	}

	private byteArrayToString(msgData:number[],offset:number,length:number):string
	{
		
    let result = '';
    for (let i = offset; i < offset + length; i++) {
        result += String.fromCharCode(msgData[i]);
    }
    return result;
   
	}

	public play_2(measureNum:number):void
	{
		if( this.sequenceData == null)
			return;

		try
		{
			let synthesizer:Synthesizer;
			this.sequencer = MidiSystem.getSequencer();
			if( this.sequencer == null)
				throw new Exception("No sequencer available from system (may already be in use)");

			this.sequencer.open();
			this.sequencer.setSequence(this.sequenceData);
			if( !( this.sequencer instanceof Synthesizer))
				{
					synthesizer = MidiSystem.getSynthesizer();
					synthesizer.open();
					this.sequencer.getTransmitter().setReceiver(synthesizer.getReceiver());
				}

			else
				synthesizer =<Synthesizer> this.sequencer;

			this.playbackListener =
			{

				/* sequencer is not a synthesizer
               open default MIDI synth and chain to output of sequencer */
				/* set callback functions for playback */
				meta:(event:MetaMessage):void =>
				{
					switch( event.getType())
					{
						case MIDIPlayer.MIDI_EVENT_MARKER:
						{
							let msgData:number[]= event.getData();
							this.parentWin.MIDIMeasureStarted_2(this.stringToInt(this.byteArrayToString(msgData,1,(( msgData.length - 1) | 0))));
							break;
						}
						case MIDIPlayer.MIDI_EVENT_ENDOFTRACK:
						{
							this.parentWin.MIDIEnded();
							this.stop();
							break;
						}
					}
				}
			}
			;
			this.sequencer.addMetaEventListener(this.playbackListener);
			this.sequencer.setTickPosition(MIDIPlayer.TICKS_PER_MINIM * this.calcNumMinims(measureNum));
			this.sequencer.setTempoFactor(1);
			this.sequencer.setTempoInBPM(Float.parseFloat(MIDIPlayer.configVal("BPM")));
			for(let mc of synthesizer.getChannels())
			mc.controlChange(MIDIPlayer.VOLUME_CONTROLLER,<number>( Double.parseDouble(MIDIPlayer.configVal("Gain")) * 127));
			this.sequencer.start();
			this._currentlyPlaying ++;
		}
		catch( e)
		{
			if( e instanceof Exception)
				{
					JOptionPane.showMessageDialog(this.parentWin,"Error initializing MIDI system: " + e,"Error",JOptionPane.ERROR_MESSAGE);
				}

			else
				throw e;

		}
	}

	//Integer.valueOf(new String(msgData,1,msgData.length-1)).intValue());
	//        sequencer.setTempoInMPQ(Float.parseFloat(configVal("MPQ")));
	/* set volume */
	stop():void
	{
		if( this._currentlyPlaying <= 0)
			return;

		this._currentlyPlaying --;
		this.sequencer.stop();
		this.sequencer.close();
		this.sequencer.removeMetaEventListener(this.playbackListener);
	}

	/*------------------------------------------------------------------------
Methods: long calcNumMinims(int measureNum)
Purpose: Calculate the number of minims passed in the entire score at the
         beginning of a given measure
Parameters:
  Input:  int measureNum - measure number
  Output: -
  Return: music time in minims
------------------------------------------------------------------------*/
	calcNumMinims(measureNum:number):number
	{
		let totalMinims:number = 0;
		for(let rs of this.renderedSections)
		{
			for(
			let mi:number = rs.getFirstMeasureNum();mi <= rs.getLastMeasureNum();mi ++)
			{
				if( mi >= measureNum)
					return totalMinims;

				let m:MeasureInfo = rs.getMeasure(mi);
				totalMinims +=<number>( m.numMinims / m.defaultTempoProportion.toDouble());
			}
			totalMinims += Integer.parseInt(MIDIPlayer.configVal("RestBetweenSections"));
		}
		return totalMinims;
	}

	/*------------------------------------------------------------------------
Methods: get*() / is*()
Purpose: Routines to return attribute variables
Parameters:
  Input:  -
  Output: -
  Return: attribute variables
------------------------------------------------------------------------*/
	public currentlyPlaying():boolean
	{
		return this._currentlyPlaying > 0;
	}
}
