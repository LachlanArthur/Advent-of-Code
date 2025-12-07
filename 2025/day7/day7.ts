import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const grid = input.linesAndChars();

	let beams = [ grid[ 0 ].indexOf( 'S' ) ];
	let splits = 0;

	for ( const row of grid.slice( 1 ) ) {
		beams = beams
			.flatMap( x => {
				switch ( row[ x ] ) {
					case '.':
						return [ x ];
					case '^':
						splits++;
						return [ x - 1, x + 1 ];
					default:
						throw new Error( 'Unexpected char: ' + row[ x ] );
				}
			} )
			.unique();
	}

	return splits;
}

bench( 'part 1 example', () => part1( example ), 21 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const grid = input.linesAndChars();

	let beams = [ grid[ 0 ].indexOf( 'S' ) ];
	let timelines: number[] = grid[ 0 ].map( c => c === 'S' ? 1 : 0 );

	for ( const row of grid.slice( 1 ) ) {
		beams = beams
			.flatMap( x => {
				switch ( row[ x ] ) {
					case '.':
						return [ x ];
					case '^':
						timelines[ x - 1 ] += timelines[ x ];
						timelines[ x + 1 ] += timelines[ x ];
						timelines[ x ] = 0;
						return [ x - 1, x + 1 ];
					default:
						throw new Error( 'Unexpected char: ' + row[ x ] );
				}
			} )
			.unique();
	}

	return timelines.sum();
}

bench( 'part 2 example', () => part2( example ), 40 );

bench( 'part 2 input', () => part2( input ) );
