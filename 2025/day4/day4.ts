import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { CharGrid, pointsAroundSquare } from '../../grid.ts';

function part1( input: string ) {
	const grid = new CharGrid( input );

	return grid.find( '@' )
		.filter( ( { x, y } ) => canAccess( grid, x, y ) )
		.length;
}

function canAccess( grid: CharGrid, x: number, y: number ): boolean {
	return pointsAroundSquare( x, y, 1 )
		.map( ( [ x, y ] ) => grid.get( x, y ) )
		.filter( char => char === '@' )
		.length < 4
}

bench( 'part 1 example', () => part1( example ), 13 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	let grid = new CharGrid( input );
	let totalRemoved = 0;

	while ( true ) {
		let removed = 0;

		grid = grid.map( ( char, x, y ) => {
			if ( char === '@' && canAccess( grid, x, y ) ) {
				removed++;
				return '.';
			}
			return char;
		} );

		if ( removed === 0 ) {
			break;
		}

		totalRemoved += removed;
	}

	return totalRemoved;
}

bench( 'part 2 example', () => part2( example ), 43 );

bench( 'part 2 input', () => part2( input ) );
