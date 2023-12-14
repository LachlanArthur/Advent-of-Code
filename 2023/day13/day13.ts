import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { CharGrid } from '../../grid.ts';

function stringDiff( a: string, b: string ) {
	const aChars = [ ...a ];
	const bChars = [ ...b ];

	return aChars.reduce( ( diffs, char, i ) => diffs + ( char !== bChars[ i ] ? 1 : 0 ), 0 );
}

function part1( input: string ) {
	const grids = input.split( '\n\n' );

	let output: number = 0;

	grid: for ( const gridStr of grids ) {
		const grid = new CharGrid( gridStr );

		searchX: for ( let x = 1; x < grid.width; x += 1 ) {

			for ( let distance = 1; distance <= Math.min( x, grid.width - x ); distance++ ) {
				const left = grid.col( x - distance );
				const right = grid.col( x + ( distance - 1 ) );

				if ( left.join( '' ) !== right.join( '' ) ) {
					continue searchX;
				}
			}

			output += x;
			continue grid;
		}

		searchY: for ( let y = 1; y < grid.height; y += 1 ) {
			for ( let distance = 1; distance <= Math.min( y, grid.height - y ); distance++ ) {
				const above = grid.row( y - distance );
				const below = grid.row( y + ( distance - 1 ) );

				if ( above.join( '' ) !== below.join( '' ) ) {
					continue searchY;
				}
			}

			output += y * 100;
			continue grid;
		}

		throw 'not found';
	}

	return output;
}

bench( 'part 1 example', () => part1( example ), 405 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const grids = input.split( '\n\n' );

	let output: number = 0;

	grid: for ( const gridStr of grids ) {
		const grid = new CharGrid( gridStr );

		for ( let x = 1; x < grid.width; x += 1 ) {
			let diffs = 0;

			for ( let distance = 1; distance <= Math.min( x, grid.width - x ); distance++ ) {
				const left = grid.col( x - distance );
				const right = grid.col( x + ( distance - 1 ) );

				diffs += stringDiff( left.join( '' ), right.join( '' ) );
			}

			if ( diffs === 1 ) {
				output += x;
				continue grid;
			}
		}

		for ( let y = 1; y < grid.height; y += 1 ) {
			let diffs = 0;

			for ( let distance = 1; distance <= Math.min( y, grid.height - y ); distance++ ) {
				const above = grid.row( y - distance );
				const below = grid.row( y + ( distance - 1 ) );

				diffs += stringDiff( above.join( '' ), below.join( '' ) );
			}

			if ( diffs === 1 ) {
				output += y * 100;
				continue grid;
			}
		}

		throw 'not found';
	}

	return output;
}

bench( 'part 2 example', () => part2( example ), 400 );

bench( 'part 2 input', () => part2( input ) );
