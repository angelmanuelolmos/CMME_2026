
import { ScorePageRenderer } from './ScorePageRenderer';
import { RenderList } from './RenderList';
import { RenderedEvent } from './RenderedEvent';
import { File } from '../java/io/File';
import { ArrayList } from '../java/util/ArrayList';
import { PdfContentByte } from '../com/lowagie/text/pdf/PdfContentByte';

export class PDFCreator
{
	public static XEVENTSPACE_SCALE:number = 0;

	public static new0(a:ArrayList<RenderList>[]):PDFCreator
	{
		let _new0:PDFCreator = new PDFCreator;
		PDFCreator.set0(_new0,a);
		return _new0;
	}

	public static set0(new0:PDFCreator,a:ArrayList<RenderList>[]):void
	{
	}

	public static new1(s:ScorePageRenderer):PDFCreator
	{
		let _new1:PDFCreator = new PDFCreator;
		PDFCreator.set1(_new1,s);
		return _new1;
	}

	public static set1(new1:PDFCreator,s:ScorePageRenderer):void
	{
	}

	public createPDF_1(saveFile:File):void
	{
	}

	public createPDF_2(name:string):void
	{
	}

	public drawEvent(a:RenderedEvent,b:number,c:number,d:boolean,e:PdfContentByte):void
	{
	}

	public drawGlyph(a:number,b:number,c:number,d:number,e:number,f:number,g:PdfContentByte):void
	{
	}
}
