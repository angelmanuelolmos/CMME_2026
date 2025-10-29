
import { RenderedEvent } from './RenderedEvent';
import { Iterator } from '../java/util/Iterator';
import { LinkedList } from '../java/util/LinkedList';
import { Event } from '../DataStruct/Event';
import { MultiEvent } from '../DataStruct/MultiEvent';
import { Pitch } from '../DataStruct/Pitch';
import { Proportion } from '../DataStruct/Proportion';

export class RenderedSonority
{
	pitches:LinkedList<Pitch>;
	rNotes:LinkedList<RenderedEvent>;
	/* lowest to highest */
	musicTime:Proportion;

	public static new0():RenderedSonority
	{
		let _new0:RenderedSonority = new RenderedSonority;
		RenderedSonority.set0(_new0);
		return _new0;
	}

	public static set0(new0:RenderedSonority):void
	{
		new0.pitches = new LinkedList<Pitch>();
		new0.rNotes = new LinkedList<RenderedEvent>();
		new0.musicTime = Proportion.new0(0,1);
	}

	public static new1(toCopy:RenderedSonority):RenderedSonority
	{
		let _new1:RenderedSonority = new RenderedSonority;
		RenderedSonority.set1(_new1,toCopy);
		return _new1;
	}

	public static set1(new1:RenderedSonority,toCopy:RenderedSonority):void
	{
		new1.pitches = new LinkedList<Pitch>(toCopy.pitches);
		new1.rNotes = new LinkedList<RenderedEvent>(toCopy.rNotes);
		new1.musicTime = toCopy.musicTime;
	}

	public copyWithout(re:RenderedEvent):RenderedSonority
	{
		let newSonority:RenderedSonority = RenderedSonority.new1(this);
		newSonority.remove(re);
		return newSonority;
	}

	public add(re:RenderedEvent):void
	{
		let e:Event = re.getEvent_1();
		switch( e.geteventtype())
		{
			case Event.EVENT_MULTIEVENT:
			{
				for(
				let i:Iterator<Event> =(<MultiEvent> re.getEvent_1()).iterator_2();i.hasNext();)
				{
					let ne:Event =<Event> i.next();
					if( ne.geteventtype() == Event.EVENT_NOTE)
						this.insertNote(re,ne.getPitch_1());

				}
				break;
			}
			case Event.EVENT_NOTE:
			{
				this.insertNote(re,e.getPitch_1());
				break;
			}
		}
	}

	public remove(re:RenderedEvent):void
	{
		if( re == null)
			return;

		let e:Event = re.getEvent_1();
		switch( e.geteventtype())
		{
			case Event.EVENT_MULTIEVENT:
			{
				for(
				let i:Iterator<Event> =(<MultiEvent> re.getEvent_1()).iterator_2();i.hasNext();)
				{
					let ne:Event =<Event> i.next();
					if( ne.geteventtype() == Event.EVENT_NOTE)
						this.removeNote(re,ne.getPitch_1());

				}
				break;
			}
			case Event.EVENT_NOTE:
			{
				this.removeNote(re,e.getPitch_1());
				break;
			}
		}
	}

	insertNote(re:RenderedEvent,p:Pitch):void
	{
		let insertPos:number = this.calcInsertPos(p);
		this.rNotes.add(insertPos,re);
		this.pitches.add(insertPos,p);
	}

	removeNote(re:RenderedEvent,p:Pitch):void
	{
		this.rNotes.remove(re);
		this.pitches.remove(p);
	}

	calcInsertPos(p:Pitch):number
	{
		let pos:number;
		for(
		pos = 0;pos < this.pitches.size();pos ++)
		if( p.isLowerThan(this.pitches.get(pos)))
			return pos;

		return pos;
	}

	public setMusicTime(newMusicTime:Proportion):void
	{
		this.musicTime = newMusicTime;
	}

	public getMusicTime():Proportion
	{
		return this.musicTime;
	}

	public getNumPitches():number
	{
		return this.pitches.size();
	}

	public getPitch(i:number):Pitch
	{
		return this.pitches.get(i);
	}

	public getRenderedNote(i:number):RenderedEvent
	{
		return this.rNotes.get(i);
	}

	public toString():string
	{
		let s:string = "Sonority at " + this.musicTime + ":";
		for(let p of this.pitches)
		s += " " + p;
		return s;
	}
}
