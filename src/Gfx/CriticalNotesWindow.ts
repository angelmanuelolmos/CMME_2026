
import { RuntimeException } from '../java/lang/RuntimeException';
import { RenderList } from './RenderList';
import { NoteShapeStyleListener } from './MusicWin';
import { BarlineStyleListener } from './MusicWin';
import { ViewSizeListener } from './MusicWin';
import { PDFFileFilter } from './MusicWin';
import { HTMLFileFilter } from './MusicWin';
import { XMLFileFilter } from './MusicWin';
import { MIDIFileFilter } from './MusicWin';
import { CMMEFileFilter } from './MusicWin';
import { MusicWin } from './MusicWin';
import { MusicFont } from './MusicFont';
import { MeasureInfo } from './MeasureInfo';
import { JFrame } from '../javax/swing/JFrame';
import { PieceData } from '../DataStruct/PieceData';

export class CriticalNotesWindow extends JFrame
{
	public constructor(a:PieceData,b:MusicWin,c:MusicFont,d:number,e:number)
	{
		super();
	}

	public closeFrame_2():void
	{
		throw new RuntimeException();
	}

	public static createMeasureString(a:RenderList,b:MeasureInfo,c:number):string
	{
		return "";
	}
}
