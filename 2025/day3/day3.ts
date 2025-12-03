import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string, digits: number ) {
	return input
		.lines()
		.map( line => line.split( '' ).map( Number ) )
		.map( batteries => parseInt( maxNumber( batteries, digits ).join( '' ) ) )
		.sum()
}

const cache = new Map<string, number[]>();

function maxNumber( input: number[], digits: number ): number[] {
	if ( digits === 1 ) {
		return [ input.max() ];
	}

	const cacheKey = [ digits, ...input ].join( ',' );
	if ( cache.has( cacheKey ) ) {
		return cache.get( cacheKey )!;
	}

	let bestArray: number[] = [];
	let bestInt = 0;

	for ( let slice = 1; slice <= input.length - ( digits - 1 ); slice++ ) {
		const left = input.slice( 0, slice ).max();
		const right = maxNumber( input.slice( slice ), digits - 1 );
		const candidateArray = [ left, ...right ];
		const candidateInt = parseInt( candidateArray.join( '' ) );

		if ( candidateInt > bestInt ) {
			bestArray = candidateArray;
			bestInt = candidateInt;
		}
	}

	cache.set( cacheKey, bestArray );

	return bestArray;
}

bench( 'part 1 example', () => part1( example, 2 ), 357 );

bench( 'part 1 input', () => part1( input, 2 ) );

bench( 'part 2 example', () => part1( example, 12 ), 3121910778619 );

bench( 'part 2 input', () => part1( input, 12 ) );
