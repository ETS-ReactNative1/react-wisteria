import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/index.js',
    plugins: [
        babel(),
        commonjs({
            transformMixedEsModules: true
        }),
        resolve()
    ],
    external: ['react'],
    output: [{
        file: 'dist/cjs.js',
        format: 'cjs'
    }, {
        file: 'dist/es.js',
        format: 'es'
    }]
};
