import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
	input: 'src/index.ts',
	output: [
		{
			file: 'dist/index.js',
			format: 'cjs',
			sourcemap: true
		},
		{
			file: 'dist/index.esm.js',
			format: 'esm',
			sourcemap: true
		}
	],
	plugins: [
		peerDepsExternal(),
		resolve(),
		commonjs(),
		typescript({
			tsconfig: './tsconfig.json',
			exclude: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx']
		}),
		babel({
			babelHelpers: 'bundled',
			exclude: 'node_modules/**',
			presets: [
				'@babel/preset-env',
				'@babel/preset-react',
				'@babel/preset-typescript'
			],
			extensions: ['.js', '.jsx', '.ts', '.tsx']
		}),
		terser()
	],
	external: ['react', 'react-dom']
};
