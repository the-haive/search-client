import typescript from 'rollup-plugin-typescript2';
import sourcemaps from 'rollup-plugin-sourcemaps';
import nodeResolve from 'rollup-plugin-node-resolve';
import nodeGlobals from 'rollup-plugin-node-globals';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import { uglify } from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';
import pascalCase from 'pascal-case';
const pkg = require('./package');

let override = { compilerOptions: { declaration: false } };

export default {
  input: 'es/index.js',
  output: {
    file: 'dist/bundle.js',
    amd: {
      id: pkg.name,
    },
    format: 'umd',
    exports: 'named',
    name: pascalCase(pkg.name),
    sourcemap: true
  },
	plugins: [
    typescript({
      tsconfig: "tsconfig.json",
      tsconfigOverride: { 
        compilerOptions: { 
          declaration: false 
        } 
      }
    }),
    sourcemaps(),
    nodeResolve(),
    nodeGlobals(),
    nodeBuiltins(),
    commonjs(),
    uglify()
  ]
}
