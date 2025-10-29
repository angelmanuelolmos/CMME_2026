
import { TextDeleteDialog } from './TextDeleteDialog';
import { OriginalTextDeleteDialog } from './OriginalTextDeleteDialog';
import { NoteInfoPanel } from './NoteInfoPanel';
import { ModernKeySigPanel } from './ModernKeySigPanel';
import { MensurationChooser } from './MensurationChooser';
import { GeneralInfoFrame } from './GeneralInfoFrame';
import { EditorWin } from './EditorWin';
import { EditingOptionsFrame } from './EditingOptionsFrame';
import { ColorationChooser } from './ColorationChooser';

export class ModernTextDeleteDialog extends TextDeleteDialog
{
	public constructor(owner:EditorWin)
	{
		super(owner);
	}

	/* @Overrides TextDeleteDialog.deleteText */
	deleteText_1():void
	{
		let voicesToDelete:boolean[]= Array(this.musicData.getVoiceData().length);
		for(
		let i:number = 0;i < this.voiceCheckBoxes.length;i ++)
		voicesToDelete[i]= this.voiceCheckBoxes[i].isSelected();
		this.owner.deleteModernText(voicesToDelete);
	}
}
