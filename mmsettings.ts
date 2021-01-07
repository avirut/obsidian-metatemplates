import { PluginSettingTab, App, Setting } from 'obsidian';
import Metamatter from './main'

export const DEFAULT_SETTINGS: MetamatterSettings = {
	templateFolder: '/templates'
}

export interface MetamatterSettings {
	templateFolder: string;
}

export class MetamatterSettingTab extends PluginSettingTab {
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
