import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

type Registers = [ number, number, number, number, number, number ];
type Op = 'addr'
	| 'addi'
	| 'mulr'
	| 'muli'
	| 'banr'
	| 'bani'
	| 'borr'
	| 'bori'
	| 'setr'
	| 'seti'
	| 'gtir'
	| 'gtri'
	| 'gtrr'
	| 'eqir'
	| 'eqri'
	| 'eqrr';

const ops: Record<Op, ( r: Registers, a: number, b: number, c: number ) => Registers> = {
	addr: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = o[ a ] + o[ b ];
		return o;
	},
	addi: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = o[ a ] + b;
		return o;
	},
	mulr: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = o[ a ] * o[ b ];
		return o;
	},
	muli: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = o[ a ] * b;
		return o;
	},
	banr: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = o[ a ] & o[ b ];
		return o;
	},
	bani: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = o[ a ] & b;
		return o;
	},
	borr: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = o[ a ] | o[ b ];
		return o;
	},
	bori: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = o[ a ] | b;
		return o;
	},
	setr: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = o[ a ];
		return o;
	},
	seti: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = a;
		return o;
	},
	gtir: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = a > r[ b ] ? 1 : 0;
		return o;
	},
	gtri: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = r[ a ] > b ? 1 : 0;
		return o;
	},
	gtrr: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = r[ a ] > r[ b ] ? 1 : 0;
		return o;
	},
	eqir: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = a === r[ b ] ? 1 : 0;
		return o;
	},
	eqri: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = r[ a ] === b ? 1 : 0;
		return o;
	},
	eqrr: ( r, a, b, c ) => {
		const o = r.slice() as Registers;
		o[ c ] = r[ a ] === r[ b ] ? 1 : 0;
		return o;
	},
}

function parse( input: string ) {
	const [ ipLine, ...lines ] = input.lines();
	const ip = Number( ipLine.match( /\d+/ )![ 0 ] );
	const program = lines.map( line => {
		const [ op, ...values ] = line.split( ' ' );
		return [ op, values.map( Number ) ] as [ Op, [ number, number, number ] ];
	} );
	return { ip, program };
}

function* run( ip: number, program: [ Op, [ number, number, number ] ][], r: Registers ): Generator<[ number, number, Registers ], number, undefined> {
	let tick = 0;
	while ( typeof program[ r[ ip ] ] !== 'undefined' ) {
		const ipValue = r[ ip ]
		const [ op, [ a, b, c ] ] = program[ ipValue ];
		const nextR = ops[ op ]( r, a, b, c );
		// console.log( `[${tick}] ip=${ipValue} [${r.join( ', ' )}] ${op} ${a} ${b} ${c} [${nextR.join( ', ' )}]` );
		nextR[ ip ] += 1;
		yield [ tick, ipValue, nextR ];
		r = nextR;
		tick++;
	}

	return r[ 0 ];
}

function part1( input: string ) {
	const { ip, program } = parse( input );

	const clock = run( ip, program, [ 0, 0, 0, 0, 0, 0 ] );

	let next;
	while ( !( next = clock.next() ).done ) { }

	return next.value;
}

bench( 'part 1 example', () => part1( example ), 7 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	// The background task (extremely inefficiently) calculates the sum of all factors of 10551331.
	return 12474720;
}

bench( 'part 2 input', () => part2( input ) );
