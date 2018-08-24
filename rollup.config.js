import typescript from 'rollup-plugin-typescript2';
import sourcemaps from 'rollup-plugin-sourcemaps';
import nodeResolve from 'rollup-plugin-node-resolve';
import nodeGlobals from 'rollup-plugin-node-globals';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import { terser } from "rollup-plugin-terser";
import commonjs from 'rollup-plugin-commonjs';
import pascalCase from 'pascal-case';
const pkg = require('./package');

let override = { compilerOptions: { declaration: false } };

export default {
  input: 'es/SearchClient.js',
  output: {
    file: 'dist/SearchClient.js',
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
    commonjs({ 
      namedExports: {'node_modules/jwt-simple/index.js': ['decode']}
    }),
    //terser()
  ]
}
