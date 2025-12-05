import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { combineIntervals } from '../../interval.ts';

function part1( input: string ) {
	const [ rangeInput, listInput ] = input.split( '\n\n' );

	const ranges = rangeInput
		.split( '\n' )
		.map( line => line.split( '-' ).map( Number ) as [ number, number ] )

	const list = listInput
		.split( '\n' )
		.map( Number );

	const combined = combineIntervals( ranges );

	return list
		.filter( id => combined.some( ( [ from, to ] ) => id >= from && id <= to ) )
		.length
}

bench( 'part 1 example', () => part1( example ), 3 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const [ rangeInput, listInput ] = input.split( '\n\n' );

	const ranges = rangeInput
		.split( '\n' )
		.map( line => line.split( '-' ).map( Number ) as [ number, number ] )

	const list = listInput
		.split( '\n' )
		.map( Number );

	const combined = combineIntervals( ranges );

	return combined
		.map( ( [ from, to ] ) => to - from + 1 )
		.sum()
}

bench( 'part 2 example', () => part2( example ), 14 );

bench( 'part 2 input', () => part2( input ) );
