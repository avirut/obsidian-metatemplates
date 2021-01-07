import { Plugin, TFile, MarkdownView, FrontMatterCache, MetadataCache, parseFrontMatterEntry, getAllTags } from 'obsidian';
import { TemplateSuggestModal } from 'modals';
import { MetamatterSettings, MetamatterSettingTab, DEFAULT_SETTINGS } from './mmsettings'

export default class Metamatter extends Plugin {
	settings: MetamatterSettings;
	templates: Array<TFile>;
	type2titles: Map<string, string>;

	async onload() {
		console.log('loading metamatter');

		await this.loadSettings();

		this.addCommand({
			id: 'reload-templates',
			name: 'Reload Templates',
			callback: () => {
				this.reloadTemplates();
			}
		});

		this.addCommand({
			id: 'insert-template',
			name: 'Insert Template',
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						new TemplateSuggestModal(this.app, this).open();
					}
					return true;
				}
				return false;
			}
		});

		this.app.metadataCache.on('changed', (file: TFile) => {
			let fm = this.app.metadataCache.getFileCache(file)?.frontmatter;
			let fnf = this.type2titles.get(parseFrontMatterEntry(fm, 'type'));

			let newfn = this.fnf2fn(fm, fnf);
			if (newfn) {
				this.app.fileManager.renameFile(file, newfn + '.md');
			}
		});


		this.addSettingTab(new MetamatterSettingTab(this.app, this));

		this.reloadTemplates();
	}

	reloadTemplates() {
		let files = this.app.vault.getMarkdownFiles();

		this.templates = [];
		this.type2titles = new Map();

		for (var file of files) {
			if (file.path.indexOf(this.settings.templateFolder) == 0) {
				this.templates.push(file);
				let fm = this.app.metadataCache.getFileCache(file)?.frontmatter;
				let type = parseFrontMatterEntry(fm, 'type');
				let nameFormat = parseFrontMatterEntry(fm, 'nameFormat');
				this.type2titles.set(type, nameFormat);
			}
		}
	}

	fnf2fn(fm: FrontMatterCache, fnf: string): string {
		let newfn = fnf;

		if (!newfn) {
			return;
		}

		let startInd = newfn.indexOf("<<");
		let endInd = newfn.indexOf(">>");
		while (startInd > -1 && endInd > startInd+1) {
			let attrName = newfn.substring(startInd+2, endInd);
			if (fm[attrName]) {
				newfn = newfn.substring(0, startInd) + fm[attrName] + newfn.substring(endInd+2);
			} else {
				newfn = newfn.substring(0, startInd) + attrName + newfn.substring(endInd+2);
			}
			startInd = newfn.indexOf("<<");
			endInd = newfn.indexOf(">>");
		}

		return newfn;
	}

	async insertTemplate(templateFile: TFile) {
		// mildly plagiarized from https://github.com/SilentVoid13/Templater/
		let active_view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (active_view == null) {
        return;
    }

    let editor = active_view.sourceMode.cmEditor;
    let doc = editor.getDoc();

    let content = await this.app.vault.read(templateFile);
		content = await this.fillTemplate(content);

    doc.replaceSelection(content);
    editor.focus();
	}

	async fillTemplate(content: string) {
		console.log(content);
		return content;
	}

	onunload() {
		console.log('unloading metamatter');
	}

	async loadSettings() {
		this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
