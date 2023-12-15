import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { CharGrid, manhattan, manhattanPair } from '../../grid.ts';

type Point = [ number, number ];

function part1( input: string, multiplier: number ) {
	const grid = new CharGrid( input );

	const emptyRows = grid.rows().flatMap( ( row, y ) => row.every( c => c === '.' ) ? [ y ] : [] );
	const emptyCols = grid.cols().flatMap( ( col, x ) => col.every( c => c === '.' ) ? [ x ] : [] );

	return grid
		.find( '#' )
		.map<Point>( ( { x, y } ) => [
			x + emptyCols.filter( col => col < x ).length * ( multiplier - 1 ),
			y + emptyRows.filter( row => row < y ).length * ( multiplier - 1 ),
		] )
		.combinations( 2 )
		.map( manhattanPair )
		.sum();
}

bench( 'part 1 example', () => part1( example, 2 ), 374 );

bench( 'part 1 input', () => part1( input, 2 ) );

bench( 'part 2 example (10)', () => part1( example, 10 ), 1030 );
bench( 'part 2 example (100)', () => part1( example, 100 ), 8410 );

bench( 'part 2 input', () => part1( input, 1000000 ) );
