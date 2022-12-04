import { chunker, findSharedLetter, sum } from '../helpers';

import example from './example';
import input from './input';

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

console.assert( part1( example ) === 2 );

console.log( part1( input ) );

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

console.assert( part2( example ) === 4 );

console.log( part2( input ) );
