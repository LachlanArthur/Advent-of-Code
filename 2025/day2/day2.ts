import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	return input
		.split( ',' )
		.map( rangeStr => rangeStr.split( '-' ).map( Number ) )
		.flatMap( ( [ from, to ] ) => [ ...findInvalid( from, to ) ] )
		.sum();
}

function* findInvalid( from: number, to: number ) {
	for ( let i = from; i <= to; i++ ) {
		if ( isInvalid( i ) ) {
			yield i;
		}
	}
}

function isInvalid( id: number ) {
	const digitCount = Math.ceil( Math.log10( id + 1 ) );

	if ( digitCount % 2 === 1 ) {
		// Odd number of digits are valid
		return false;
	}

	const middle = 10 ** ( digitCount / 2 );
	const little = Math.floor( id / middle );
	const big = id % middle;

	return little === big;
}

bench( 'part 1 example', () => part1( example ), 1227775554 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	return input
		.split( ',' )
		.map( rangeStr => rangeStr.split( '-' ).map( Number ) )
		.flatMap( ( [ from, to ] ) => [ ...findInvalid2( from, to ) ] )
		.sum();
}

function* findInvalid2( from: number, to: number ) {
	for ( let i = from; i <= to; i++ ) {
		if ( isInvalid2( i ) ) {
			yield i;
		}
	}
}

function isInvalid2( id: number ) {
	const digitCount = Math.ceil( Math.log10( id + 1 ) );
	const maxSize = Math.floor( digitCount / 2 );

	for ( let size = 1; size <= maxSize; size++ ) {
		const repeats = digitCount / size;

		if ( !Number.isInteger( repeats ) ) {
			continue;
		}

		if ( id.toString() === id.toString().substring( 0, size ).repeat( repeats ) ) {
			return true;
		}
	}

	return false;
}

bench( 'part 2 example', () => part2( example ), 4174379265 );

bench( 'part 2 input', () => part2( input ) );
