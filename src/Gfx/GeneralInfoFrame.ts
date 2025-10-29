
import { NoteShapeStyleListener } from './MusicWin';
import { BarlineStyleListener } from './MusicWin';
import { ViewSizeListener } from './MusicWin';
import { PDFFileFilter } from './MusicWin';
import { HTMLFileFilter } from './MusicWin';
import { XMLFileFilter } from './MusicWin';
import { MIDIFileFilter } from './MusicWin';
import { CMMEFileFilter } from './MusicWin';
import { MusicWin } from './MusicWin';
import { Container } from '../java/awt/Container';
import { ArrayList } from '../java/util/ArrayList';
import { JPanel } from '../javax/swing/JPanel';
import { JDialog } from '../javax/swing/JDialog';
import { JEditorPane } from '../javax/swing/JEditorPane';
import { PieceData } from '../DataStruct/PieceData';
import { VariantVersionData } from '../DataStruct/VariantVersionData';

export class GeneralInfoFrame extends JDialog
{
	/*----------------------------------------------------------------------*/
	/* Instance variables */
	ownerWin:MusicWin;
	/*----------------------------------------------------------------------*/
	/* Instance methods */
	/*------------------------------------------------------------------------
Constructor: GeneralInfoFrame(MusicWin ownerWin)
Purpose:     Lay out frame
Parameters:
  Input:  MusicWin ownerWin - music window to which this frame is connected
  Output: -
------------------------------------------------------------------------*/
	public constructor(ownerWin:MusicWin)
	{
		super(ownerWin,"About this edition",false);
		this.ownerWin = ownerWin;
		let cp:Container = this.getContentPane();
		cp.add(this.createTextPanel(ownerWin.getMusicData_2()));
		this.pack();
		this.setLocationRelativeTo(ownerWin);
	}

	/*------------------------------------------------------------------------
Method:  JPanel create*Panel()
Purpose: Initialize individual panes within frame
Parameters:
  Input:  -
  Output: -
  Return: one frame section as JPanel
------------------------------------------------------------------------*/
	/* text panel */
	createTextPanel(musicData:PieceData):JPanel
	{
		let infoHTML:string = "";
		infoHTML += "<style type=\"text/css\">" + "h1         { text-align:center }" + "h2         { font-style:italic; text-align:center }" + "h3         { color:red }" + "span.label { color:red; font-style:italic }" + "</style>\n";
		infoHTML += "<h1>" + musicData.getComposer() + ": " + musicData.getTitle() + "</h1>\n";
		if( musicData.getSectionTitle() != null)
			infoHTML += "<h2>" + musicData.getSectionTitle() + "</h2>\n";

		infoHTML += "<p><span class=\"label\">Editor:</span> " + musicData.getEditor();
		if( musicData.getPublicNotes() != null && musicData.getPublicNotes().length > 0)
			infoHTML += "<br/><span class=\"label\">Notes:</span> " + musicData.getPublicNotes().replaceAll("\\n","<br/>");

		let defaultVersion:VariantVersionData = musicData.getDefaultVariantVersion();
		if( defaultVersion.getSourceName() != null)
			infoHTML += "<br/><span class=\"label\">Main source:</span> " + defaultVersion.getSourceName();

		infoHTML += "</p>\n";
		let versions:ArrayList<VariantVersionData> = musicData.getVariantVersions();
		if( versions.size() > 1)
			{
				infoHTML += "<hr/>\n";
				infoHTML += "<h3>Variant Versions</h3>\n";
				infoHTML += "<p>\n";
				for(
				let vi:number = 1;vi < versions.size();vi ++)
				{
					let vvd:VariantVersionData = versions.get(vi);
					infoHTML += vvd.getID();
					if( vvd.getSourceName() != null && !( vvd.getID() == vvd.getSourceName()))
						infoHTML += " (source: " + vvd.getSourceName() + ")";

					infoHTML += "<br/>\n";
				}
				infoHTML += "</p>\n";
			}

		let textArea:JEditorPane = new JEditorPane("text/html",infoHTML);
		textArea.setEditable(false);
		let textPanel:JPanel = new JPanel();
		textPanel.add(textArea);
		return textPanel;
	}
}
