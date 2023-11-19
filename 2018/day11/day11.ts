import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { Cell, Grid } from '../../grid.ts';

function powerlevelCell( x: number, y: number, serial: number ): number {
	return ( ( ( ( ( x + 10 ) * y + serial ) * ( x + 10 ) ) / 100 << 0 ) % 10 ) - 5;
}

function part1( serial: number ) {
	const width = 300;
	const height = 300;

	const grid = new Grid<number, Cell<number>>(
		Array.filled(
			height,
			( _, y ) => Array.filled(
				width,
				( _, x ) => new Cell( x, y, powerlevelCell( x + 1, y + 1, serial ) )
			)
		)
	);

	const { x, y, power } = grid
		.flatCells()
		.map( cell => ( {
			x: cell.x,
			y: cell.y,
			power: cell
				.aroundSquare( 1 )
				.concat( cell )
				.pluck( 'value' )
				.sum()
		} ) )
		.maxBy( 'power' )!

	return `${x},${y} = ${power}`;
}

bench( 'power test 1', () => powerlevelCell( 3, 5, 8 ), 4 );
bench( 'power test 2', () => powerlevelCell( 122, 79, 57 ), -5 );
bench( 'power test 3', () => powerlevelCell( 217, 196, 39 ), 0 );
bench( 'power test 4', () => powerlevelCell( 101, 153, 71 ), 4 );

bench( 'part 1 example 1', () => part1( 18 ), '33,45 = 29' );
bench( 'part 1 example 2', () => part1( 42 ), '21,61 = 30' );

bench( 'part 1 input', () => part1( input ) );
