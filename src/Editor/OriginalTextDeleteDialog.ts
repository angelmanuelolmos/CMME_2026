
import { TextDeleteDialog } from './TextDeleteDialog';
import { NoteInfoPanel } from './NoteInfoPanel';
import { ModernTextDeleteDialog } from './ModernTextDeleteDialog';
import { ModernKeySigPanel } from './ModernKeySigPanel';
import { MensurationChooser } from './MensurationChooser';
import { GeneralInfoFrame } from './GeneralInfoFrame';
import { EditorWin } from './EditorWin';
import { EditingOptionsFrame } from './EditingOptionsFrame';
import { ColorationChooser } from './ColorationChooser';
import { ArrayList } from '../java/util/ArrayList';
import { Container } from '../java/awt/Container';
import { VariantVersionData } from '../DataStruct/VariantVersionData';
import { SelectionPanel } from '../Gfx/SelectionPanel';

export class OriginalTextDeleteDialog extends TextDeleteDialog
{
	versionsPanel:SelectionPanel;public constructor(owner:EditorWin)
	{
		super(owner);
	}

	/* @Overrides TextDeleteDialog.createPanels */
	createPanels_1():void
	{
		super.createPanels_1();
		this.versionsPanel = this.createVersionsPanel_4();
	}

	/* @Overrides TextDeleteDialog.addPanelsToLayout */
	addPanelsToLayout_1(cp:Container):void
	{
		cp.add(this.versionsPanel);
		super.addPanelsToLayout_1(cp);
	}

	/* @Overrides TextDeleteDialog.deleteText */
	deleteText_1():void
	{
		let versionsToDelete:ArrayList<VariantVersionData> = new ArrayList<VariantVersionData>();
		let voicesToDelete:boolean[]= Array(this.musicData.getVoiceData().length);
		for(
		let i:number = 0;i < this.versionsPanel.checkBoxes.length;i ++)
		if( this.versionsPanel.checkBoxes[i].isSelected())
			versionsToDelete.add(this.musicData.getVariantVersions().get(i));

		for(
		let i:number = 0;i < this.voiceCheckBoxes.length;i ++)
		voicesToDelete[i]= this.voiceCheckBoxes[i].isSelected();
		this.owner.deleteOriginalText(versionsToDelete,voicesToDelete);
	}

	createVersionsPanel_4():SelectionPanel
	{
		let versionsPanel:SelectionPanel = SelectionPanel.new1_3("Versions",this.musicData.getVariantVersionNames(),SelectionPanel.CHECKBOX,4);
		versionsPanel.checkBoxes[0].setSelected(false);
		versionsPanel.checkBoxes[0].setEnabled(false);
		for(
		let i:number = 1;i < versionsPanel.checkBoxes.length;i ++)
		versionsPanel.checkBoxes[i].setSelected(this.musicData.getVariantVersion_1(i) == this.owner.getCurrentVariantVersion_2());
		return versionsPanel;
	}
}
