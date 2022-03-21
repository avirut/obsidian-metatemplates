# obsidian-metatemplates
Take advantage of YAML front-matter in generating notes from templates

## Disclaimer
I haven't really tested this plugin at all on any vaults but my own, and there are likely many places where the appropriate checks for `null` or `undefined` values are missing. Therefore, you may experience significant errors early on. When this happens, please open DevTools (`ctrl/cmd + shift + i`), save the console error output, and report it as an issue through this repository's `Issues` tab. This plugin *shouldn't* delete your files or anything, but it may just occassionally not work as expected. 

## Frontmatter-based templates
This plugin is more or less intended to be used as a replacement for the core `templates` plugin.
![sample template](https://github.com/avirut/obsidian-metatemplates/blob/master/imgs/template-sample.png?raw=true)

## Usage
First, refer to plugin settings and specify a template folder location as well as desired date and time formats.

Each template is distinguished by its `type` property in the frontmatter. You then can additionally specify a `nameFormat` property and a `destFolder` property. The `nameFormat` property will be used to dynamically rename other notes elsewhere in your Obsidian vault (but outside of the templates folder) that are of the same `type`. That is, any template with a `nameFormat` specified will apply to other notes that were generated using that template. The `nameFormat` property draws from the other frontmatter attributes for each file, and updates automatically when there are changes to the frontmatter.

The `destFolder` property is used along with the `metatemplates: Create  from template` command (available in the command pallette and assignable to a hotkey via settings). When this property is specified, any notes created from that template will be automatically placed in the specified location (relative path to vault root). 

The dynamically filled upon note insertion/creation values `{{date}}` and `{{time}}` are replaced by `<<date>>` and `<<time>>` when using metatemplates, in order to minimize confusion. 

## Sample Output
![sample output](https://github.com/avirut/obsidian-metatemplates/blob/master/imgs/from-template.png?raw=true)

## Credits
Thanks to Liam and Licat in the Discord #plugins channel for their frequent help!
