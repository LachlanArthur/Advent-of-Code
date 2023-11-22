import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

type Quad = [ number, number, number, number ];
type Sample = [ Quad, Quad, Quad ];

function parse( input: string ) {
	const [ samplesInput, programInput ] = input.split( '\n\n\n\n' );

	const samples = samplesInput
		.split( '\n\n' )
		.map( chunk => chunk.lines().map( line => line.match( /\d+/g )!.map( Number ) ) as Sample )

	const program = programInput
		.lines()
		.map( line => line.match( /\d+/g )!.map( Number ) as Quad )

	return { samples, program };
}

const ops: Record<string, ( r: Quad, a: number, b: number, c: number ) => Quad> = {
	addr: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = o[ a ] + o[ b ];
		return o;
	},
	addi: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = o[ a ] + b;
		return o;
	},
	mulr: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = o[ a ] * o[ b ];
		return o;
	},
	muli: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = o[ a ] * b;
		return o;
	},
	banr: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = o[ a ] & o[ b ];
		return o;
	},
	bani: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = o[ a ] & b;
		return o;
	},
	borr: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = o[ a ] | o[ b ];
		return o;
	},
	bori: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = o[ a ] | b;
		return o;
	},
	setr: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = o[ a ];
		return o;
	},
	seti: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = a;
		return o;
	},
	gtir: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = a > r[ b ] ? 1 : 0;
		return o;
	},
	gtri: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = r[ a ] > b ? 1 : 0;
		return o;
	},
	gtrr: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = r[ a ] > r[ b ] ? 1 : 0;
		return o;
	},
	eqir: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = a === r[ b ] ? 1 : 0;
		return o;
	},
	eqri: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = r[ a ] === b ? 1 : 0;
		return o;
	},
	eqrr: ( r, a, b, c ) => {
		const o = r.slice() as Quad;
		o[ c ] = r[ a ] === r[ b ] ? 1 : 0;
		return o;
	},
}

function part1( input: string ): number {
	const { samples, program } = parse( input );

	return samples
		.filter( ( [ before, [ i, a, b, c ], after ] ) =>
			Object.entries( ops )
				.filter( ( [ name, op ] ) => op( before, a, b, c ).same( after ) )
				.length >= 3
		)
		.length;
}

bench( 'part 1 input', () => part1( input ) );

// function part2( input: string ) {

// }

// bench( 'part 2 example', () => part2( example ), undefined );

// bench( 'part 2 input', () => part2( input ) );
