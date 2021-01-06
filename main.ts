import { App, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import 'fs';

interface MetamatterSettings {
	templateFolder: string;
}

const DEFAULT_SETTINGS: MetamatterSettings = {
	templateFolder: '/templates'
}

export default class Metamatter extends Plugin {
	settings: MetamatterSettings;
	templates: Array<TFile>;

	async onload() {
		console.log('loading metamatter');

		await this.loadSettings();

		this.addCommand({
			id: 'reload-templates',
			name: 'Reload Templates',
			callback: () => {
				this.reloadTemplates();
			}
			// checkCallback: (checking: boolean) => {
			// 	let leaf = this.app.workspace.activeLeaf;
			// 	if (leaf) {
			// 		if (!checking) {
			// 			new SampleModal(this.app).open();
			// 		}
			// 		return true;
			// 	}
			// 	return false;
			// }
		});

		this.addSettingTab(new MetamatterSettingTab(this.app, this));

		// this.registerCodeMirror((cm: CodeMirror.Editor) => {
		// 	console.log('codemirror', cm);
		// });

		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		//this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	reloadTemplates() {
		let files = this.app.vault.getMarkdownFiles();

		this.templates = [];

		for (var file of files) {
			if (file.path.indexOf(this.settings.templateFolder) == 0) {
				console.log('inside')
				this.templates.push(file);
			}
		}

		console.log(this.templates);
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

class MetamatterSettingTab extends PluginSettingTab {
	plugin: Metamatter;

	constructor(app: App, plugin: Metamatter) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Metamatter Settings'});

		new Setting(containerEl)
			.setName('Template folder location')
			.setDesc('Files in this folder will be available as templates.')
			.addText(text => text
				.setPlaceholder('Example: folder1/folder2')
				.setValue('templates')
				.onChange(async (value: string) => {
					this.plugin.settings.templateFolder = value;
					await this.plugin.saveSettings();
				}));
	}
}
