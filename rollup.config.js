import babel from 'rollup-plugin-babel';

export default {
    input: 'src/index.js',
    plugins: [
        babel()
    ],
    output: [{
        file: 'dist/cjs.js',
        format: 'cjs'
    }, {
        file: 'dist/es.js',
        format: 'es'
    }]
};
