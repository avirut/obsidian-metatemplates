import { App, Plugin, TFile } from 'obsidian';
import { TemplateSuggestModal } from 'modals';
import { MetamatterSettings, MetamatterSettingTab, DEFAULT_SETTINGS } from './mmsettings'

export default class Metamatter extends Plugin {
	settings: MetamatterSettings;
	templates: Array<TFile>;

	async onload() {
		console.log('loading metamatter');

		await this.loadSettings();

		this.reloadTemplates();

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

		this.addSettingTab(new MetamatterSettingTab(this.app, this));
	}

	reloadTemplates() {
		let files = this.app.vault.getMarkdownFiles();

		this.templates = [];

		for (var file of files) {
			if (file.path.indexOf(this.settings.templateFolder) == 0) {
				this.templates.push(file);
			}
		}
	}

	insertTemplate() {

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
