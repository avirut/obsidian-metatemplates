import { App, FuzzySuggestModal, TFile } from 'obsidian';
import Metamatter from './main';

export class TemplateSuggestModal extends FuzzySuggestModal<TFile> {
  app: App;
  plugin: Metamatter;

  constructor(app: App, plugin: Metamatter) {
    super(app);
    this.app = app;
    this.plugin = plugin;
  }

  getItems(): TFile[] {
    return this.plugin.templates;
  }

  getItemText(item: TFile) {
    return item.basename;
  }

  onChooseItem(item: TFile) {
    console.log(item);
  }
}
