import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';

export default {
  input: 'main.ts',
  output: {
    dir: 'C:/Users/avirut/Documents/GitHub/obsidian-pluginpilot/.obsidian/plugins/obsidian-metatemplates',
    sourcemap: 'inline',
    format: 'cjs',
    exports: 'default',
  },
  external: ['obsidian'],
  plugins: [
    typescript(),
    nodeResolve({browser: true}),
    commonjs(),
    copy({
      targets: [
        {src: 'manifest.json', dest: 'C:/Users/avirut/Documents/GitHub/obsidian-pluginpilot/.obsidian/plugins/obsidian-metatemplates'},
        {src: 'styles.css', dest: 'C:/Users/avirut/Documents/GitHub/obsidian-pluginpilot/.obsidian/plugins/obsidian-metatemplates'}
      ]
    })
  ]
};
