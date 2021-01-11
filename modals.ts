import { App, FuzzySuggestModal, TFile } from 'obsidian';
import Metatemplates from './main';

export class TemplateSuggestModal extends FuzzySuggestModal<TFile> {
  app: App;
  plugin: Metatemplates;
  creating: boolean;

  constructor(app: App, plugin: Metatemplates, creating: boolean) {
    super(app);
    this.app = app;
    this.plugin = plugin;
    this.creating = creating;
  }

  getItems(): TFile[] {
    this.plugin.reloadTemplates();
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
