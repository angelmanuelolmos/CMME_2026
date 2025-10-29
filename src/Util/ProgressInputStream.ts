
import { Math } from '../java/lang/Math';
import { InputStream } from '../java/io/InputStream';
import { BufferedInputStream } from '../java/io/BufferedInputStream';
import { IOException } from '../java/io/IOException';
/*----------------------------------------------------------------------*/
/*------------------------------------------------------------------------
Class:   ProgressGZIPInputStream
Extends: java.util.zip.GZIPInputStream
Purpose: provide progress updates while reading from GZIP stream
------------------------------------------------------------------------*/
import { JProgressBar } from '../javax/swing/JProgressBar';

export class ProgressInputStream extends BufferedInputStream
{
	/*----------------------------------------------------------------------*/
	/* Class variables */
	/*----------------------------------------------------------------------*/
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	progressBar:JProgressBar;
	contentLen:number;
	/* length of stream */
	PBStart:number;
	PBEnd:number;
	/* numbers for setting progress bar
                                              at start and end of read */
	curStreamPos:number;
	curBarPos:number;
	lastBarPos:number;
	/*----------------------------------------------------------------------*/
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: ProgressInputStream(InputStream in,JProgressBar progressBar,
                                 int contentLen,int PBStart,int PBEnd)
Purpose:     Initialize stream with progress bar attributes
Parameters:
  Input:  InputStream in           - stream from which to read data
          JProgressBar progressBar - bar to update
          int contentLen           - length of stream
          int PBStart,PBEnd        - progress bar positions at start and end
                                     of read
  Output: -
------------------------------------------------------------------------*/
	public constructor(_in:InputStream,progressBar:JProgressBar,contentLen:number,PBStart:number,PBEnd:number)
	{
		super(_in);
		this.progressBar = progressBar;
		this.contentLen = contentLen;
		this.PBStart = PBStart;
		this.PBEnd = PBEnd;
		this.curStreamPos = 0;
		this.curBarPos =( this.lastBarPos =<number> PBStart);
	}

	public read(b:number[],off:number,len:number):number
	{
		let amountRead:number = super.read(b,off,len);
		if( amountRead >= 0)
			{
				this.curStreamPos += amountRead;
				this.curBarPos +=(((<number> amountRead /<number> this.contentLen) *((( this.PBEnd - this.PBStart) | 0))) | 0);
				if( this.curBarPos > this.lastBarPos + 10)
					{
						this.progressBar.setValue(<number> Math.round(this.curBarPos));
						this.lastBarPos = this.curBarPos;
					}

			}

		else
			this.progressBar.setValue(this.PBEnd);

		return amountRead;
	}
}
