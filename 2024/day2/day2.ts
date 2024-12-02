import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function safe( levels: number[] ): boolean {
	const diffs = levels.sliding( 2 ).map( ( [ a, b ] ) => b - a );
	const signs = diffs.map( Math.sign );
	return signs.countUnique().size === 1
		&& diffs.map( Math.abs ).every( diff => diff >= 1 && diff <= 3 );
}

function part1( input: string ) {
	return input
		.lines()
		.map( line => line.split( ' ' ).map( level => +level ) )
		.filter( safe )
		.length
}

bench( 'part 1 example', () => part1( example ), 2 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	return input
		.lines()
		.map( line => line.split( ' ' ).map( level => +level ) )
		.filter( levels => {
			if ( safe( levels ) ) {
				return true;
			}

			for ( let remove = 0; remove < levels.length; remove++ ) {
				if ( safe( levels.toSpliced( remove, 1 ) ) ) {
					return true;
				}
			}
			
			return false;
		} )
		.length
}

bench( 'part 2 example', () => part2( example ), 4 );

bench( 'part 2 input', () => part2( input ) );
