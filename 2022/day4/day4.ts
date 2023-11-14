import { bench } from '../../bench.ts';
import '../../extensions.ts';

import example from './example.ts';
import input from './input.ts';

function rangesFullyOverlap( a: [ number, number ], b: [ number, number ] ) {
	return ( a[ 0 ] >= b[ 0 ] && a[ 1 ] <= b[ 1 ] )
		|| ( a[ 0 ] <= b[ 0 ] && a[ 1 ] >= b[ 1 ] );
}

function rangesPartiallyOverlap( a: [ number, number ], b: [ number, number ] ) {
	return ( a[ 0 ] >= b[ 0 ] && a[ 0 ] <= b[ 1 ] )
		|| ( a[ 1 ] >= b[ 0 ] && a[ 1 ] <= b[ 1 ] )
		|| ( b[ 0 ] >= a[ 0 ] && b[ 0 ] <= a[ 1 ] )
		|| ( b[ 1 ] >= a[ 0 ] && b[ 1 ] <= a[ 1 ] );
}

function part1( input: string ) {
	return input
		.split( '\n' )
		.map( line => line
			.split( ',' )
			.map( bounds => bounds.split( '-' ).map( Number ) )
		)
		.filter( ( [ a, b ] ) => rangesFullyOverlap( a as [ number, number ], b as [ number, number ] ) )
		.length
}

bench( 'part 1 example', () => part1( example ), 2 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	return input
		.split( '\n' )
		.map( line => line
			.split( ',' )
			.map( bounds => bounds.split( '-' ).map( Number ) )
		)
		.filter( ( [ a, b ] ) => rangesPartiallyOverlap( a as [ number, number ], b as [ number, number ] ) )
		.length
}

bench( 'part 2 example', () => part2( example ), 4 );

bench( 'part 2 input', () => part2( input ) );
