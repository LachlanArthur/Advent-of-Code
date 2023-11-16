import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function react( units: number[] ): number[] {
	let reduced: boolean;

	do {
		reduced = false;

		units = units.reduce<number[]>( function ( nextUnits, unit ) {
			if ( Math.abs( ( nextUnits.at( -1 ) ?? NaN ) - unit ) === 32 ) {
				nextUnits.pop();
				reduced = true;
			} else {
				nextUnits.push( unit );
			}
			return nextUnits;
		}, [] );

	} while ( reduced );

	return units;
}

function part1( input: string ): number {
	return react( input.charCodes() ).length;
}

bench( 'part 1 example', () => part1( example ), 10 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const units = input.charCodes();
	const lengths = new Map<string, number>();

	for ( const letter of 'abcdefghijklmnopqrstuvwxyz' ) {
		const letterCode = letter.charCodeAt( 0 );
		lengths.set( letter, react( units.filter( unit => unit !== letterCode && unit !== letterCode - 32 ) ).length );
	}

	return lengths
		.valuesArray()
		.min();
}

bench( 'part 2 example', () => part2( example ), 4 );

bench( 'part 2 input', () => part2( input ) );
