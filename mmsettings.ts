import { PluginSettingTab, App, Setting } from 'obsidian';
import Metamatter from './main'

export const DEFAULT_SETTINGS: MetamatterSettings = {
	templateFolder: 'templates',
	dateFormat: 'YYMMDD',
	timeFormat: 'HHmm'
}

export interface MetamatterSettings {
	templateFolder: string;
	dateFormat: string;
	timeFormat: string;
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
				.setValue(this.plugin.settings.templateFolder)
				.onChange(async (value: string) => {
					this.plugin.settings.templateFolder = value;
					await this.plugin.saveSettings();
					this.plugin.reloadTemplates();
				}));

		new Setting(containerEl)
			.setName('Date format')
			.setDesc('<<date>> in the template file will be replaced with this value.')
			.addText(text => text
				.setPlaceholder('Example: YY.MM.DD')
				.setValue(this.plugin.settings.dateFormat)
				.onChange(async (value: string) => {
					this.plugin.settings.dateFormat = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Time format')
			.setDesc('<<time>> in the template file will be replaced with this value.')
			.addText(text => text
				.setPlaceholder('Example: HH:mm.ss')
				.setValue(this.plugin.settings.timeFormat)
				.onChange(async (value: string) => {
					this.plugin.settings.timeFormat = value;
					await this.plugin.saveSettings();
				}));
	}
}
