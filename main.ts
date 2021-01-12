import { Plugin, TFile, MarkdownView, FrontMatterCache, parseFrontMatterEntry } from 'obsidian';
import { TemplateSuggestModal } from 'modals';
import { MetatemplatesSettings, MetatemplatesSettingTab, DEFAULT_SETTINGS } from './mmsettings'

import type { Moment } from 'moment';
import * as jsyaml from './js-yaml';

declare global {
  function moment(): Moment;
}

export default class Metatemplates extends Plugin {
  settings: MetatemplatesSettings;
  templates: Array<TFile>;
  type2titles: Map<string, string>;

  async onload() {
    console.log('loading plugin: metatemplates');

    await this.loadSettings();
    this.addSettingTab(new MetatemplatesSettingTab(this.app, this));

    this.addCommand({
      id: 'reload-templates',
      name: 'Reload templates',
      callback: () => {
        this.reloadTemplates();
      }
    });

    this.addCommand({
      id: 'insert-template',
      name: 'Insert template',
      checkCallback: (checking: boolean) => {
        let leaf = this.app.workspace.activeLeaf;
        if (leaf) {
          if (!checking) {
            new TemplateSuggestModal(this.app, this, false).open();
          }
          return true;
        }
        return false;
      }
    });

    this.addCommand({
      id: 'create-from-template',
      name: 'Create from template',
      callback: () => {
        new TemplateSuggestModal(this.app, this, true).open();
      }
    });

    this.app.metadataCache.on('changed', (file: TFile) => {
      if (file.path.indexOf(this.settings.templateFolder) === 0) {
        return;
      }

      let fm = this.app.metadataCache.getFileCache(file)?.frontmatter;
      let fnf = this.type2titles.get(parseFrontMatterEntry(fm, 'type'));

      let newfn = this.fnf2fn(fm, fnf);

      if (newfn) {
        let newpath = file.path.substring(0, file.path.lastIndexOf('/')) + '/' + newfn + '.md';
        if (newpath && newpath != file.path) {
          this.app.fileManager.renameFile(file, newpath);
        }
      }
    });

    this.app.workspace.on('layout-ready', () => {
      this.reloadTemplates();
    })

  }

  reloadTemplates() {
    let files = this.app.vault.getMarkdownFiles();

    this.templates = [];
    this.type2titles = new Map();

    for (var file of files) {
      if (file.path.indexOf(this.settings.templateFolder) === 0) {
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
    while (startInd > -1 && endInd > startInd + 1) {
      let attrName = newfn.substring(startInd + 2, endInd);
      if (fm[attrName]) {
        newfn = newfn.substring(0, startInd) + fm[attrName] + newfn.substring(endInd + 2);
      } else {
        newfn = newfn.substring(0, startInd) + attrName + newfn.substring(endInd + 2);
      }
      startInd = newfn.indexOf("<<");
      endInd = newfn.indexOf(">>");
    }

    newfn = newfn.replace(/[/\\?%*:|"<>]/g, '-');
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

  async createNoteFromTemplate(templateFile: TFile) {
    let fm = this.app.metadataCache.getFileCache(templateFile)?.frontmatter;
    let destFolder = parseFrontMatterEntry(fm, 'destFolder');

    let newPath = (destFolder || '') + '/' + moment().format('YYMMDD@HHmmss') + '.md';
    let content = await this.app.vault.read(templateFile);
    content = await this.fillTemplate(content);

    let newfile = this.app.vault.create(newPath, content);
    newfile.then((file) => {
      let leaf = this.app.workspace.activeLeaf;
      if (leaf) {
        leaf.openFile(file);
        this.app.workspace.setActiveLeaf(leaf);
      }
    })
  }

  async fillTemplate(content: string) {
    let startInd = content.indexOf('---') + 4;
    let endInd = content.substring(startInd).indexOf('---') - 1;
    let fmraw = content.substring(startInd, startInd + endInd);
    let fmparsed = jsyaml.load(fmraw);

    if (fmparsed['nameFormat']) {
      delete fmparsed['nameFormat'];
    }
    if (fmparsed['destFolder']) {
      delete fmparsed['destFolder'];
    }

    let dump = jsyaml.dump(fmparsed);

    // have to typecast to <any> because TypeScript isn't updated for
    // strings to have a replaceAll() method
    dump = (<any>dump).replaceAll("null", "");
    dump = (<any>dump).replaceAll("\n  - ''", " ['']");
    dump = (<any>dump).replaceAll("<<date>>", moment().format(this.settings.dateFormat));
    dump = (<any>dump).replaceAll("<<time>>", moment().format(this.settings.timeFormat));

    let ans = '---\n' + dump + content.substring(content.lastIndexOf('---'));

    return ans;
  }

  onunload() {
    console.log('unloading plugin: metatemplates');
  }

  async loadSettings() {
    this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
