
import { RenderedLigature } from './RenderedLigature';
import { RenderedEventGroup } from './RenderedEventGroup';
import { RenderedEvent } from './RenderedEvent';
import { RenderedClefSet } from './RenderedClefSet';
import { Clef } from '../DataStruct/Clef';
import { Coloration } from '../DataStruct/Coloration';
import { Proportion } from '../DataStruct/Proportion';

export class RenderParams
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	public measurenum:number;
	public clefEvents:RenderedClefSet;
	public lastEvent:RenderedEvent;
	public mensEvent:RenderedEvent;
	public curProportion:Proportion;
	public curColoration:Coloration;
	public inEditorialSection:boolean;
	public inMultiEvent:boolean;
	public missingInVersion:boolean;
	public suggestedModernClef:Clef;
	public varReadingInfo:RenderedEventGroup;
	/* ligature-related */
	public ligInfo:RenderedLigature;
	public tieInfo:RenderedLigature;
	public endlig:boolean;
	public doubleTied:boolean;
	/* text-related */
	public lastModSyllXend:number;
	public lastOrigPhraseXend:number;
	public midWord:boolean;

	public static new0(mnum:number,ce:RenderedClefSet,le:RenderedEvent,me:RenderedEvent,p:Proportion,cc:Coloration,ies:boolean,miv:boolean,li:RenderedLigature,el:boolean,tieInfo:RenderedLigature,smc:Clef,varReadingInfo:RenderedEventGroup):RenderParams
	{
		let _new0:RenderParams = new RenderParams;
		RenderParams.set0(_new0,mnum,ce,le,me,p,cc,ies,miv,li,el,tieInfo,smc,varReadingInfo);
		return _new0;
	}

	public static set0(new0:RenderParams,mnum:number,ce:RenderedClefSet,le:RenderedEvent,me:RenderedEvent,p:Proportion,cc:Coloration,ies:boolean,miv:boolean,li:RenderedLigature,el:boolean,tieInfo:RenderedLigature,smc:Clef,varReadingInfo:RenderedEventGroup):void
	{
		new0.measurenum = mnum;
		new0.clefEvents = ce;
		new0.lastEvent = le;
		new0.mensEvent = me;
		new0.curProportion = p;
		new0.curColoration = cc;
		new0.inEditorialSection = ies;
		new0.missingInVersion = miv;
		new0.ligInfo = li;
		new0.endlig = el;
		new0.tieInfo = tieInfo;
		new0.doubleTied = false;
		new0.inMultiEvent = false;
		new0.suggestedModernClef = smc;
		new0.varReadingInfo = varReadingInfo;
	}

	public static new1(ce:RenderedClefSet):RenderParams
	{
		let _new1:RenderParams = new RenderParams;
		RenderParams.set1(_new1,ce);
		return _new1;
	}

	public static set1(new1:RenderParams,ce:RenderedClefSet):void
	{
		new1.clefEvents = ce;
		new1.measurenum = - 1;
		new1.lastEvent = null;
		new1.mensEvent = null;
		new1.curProportion = null;
		new1.curColoration = null;
		new1.inEditorialSection = false;
		new1.inMultiEvent = false;
		new1.missingInVersion = false;
		new1.ligInfo = null;
		new1.endlig = false;
		new1.tieInfo = null;
		new1.doubleTied = false;
		new1.suggestedModernClef = null;
		new1.varReadingInfo = null;
	}
}
