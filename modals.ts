import { App, FuzzySuggestModal, TFile } from 'obsidian';
import Metamatter from './main';

export class TemplateSuggestModal extends FuzzySuggestModal<TFile> {
  app: App;
  plugin: Metamatter;
  creating: boolean;

  constructor(app: App, plugin: Metamatter, creating: boolean) {
    super(app);
    this.app = app;
    this.plugin = plugin;
    this.creating = creating;
  }

  getItems(): TFile[] {
    return this.plugin.templates;
  }

  getItemText(item: TFile) {
    return item.basename;
  }

  onChooseItem(item: TFile) {
    if (this.creating) {
      this.plugin.createNoteFromTemplate(item);
    } else {
      this.plugin.insertTemplate(item);
    }
  }
}
