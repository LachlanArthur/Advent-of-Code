import '../../extensions.ts';
import { Grid } from '../../grid.ts';
import { Direction, forwards, turn90Clockwise } from '../../pathfinder.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

type Guard = {
	x: number;
	y: number;
	d: Direction;
}

function part1( input: string ) {
	const grid = Grid.fromString( input );

	const guardCell = grid.findCell( cell => cell.value === '^' )!;
	guardCell.value = '.';

	const guard: Guard = {
		x: guardCell.x,
		y: guardCell.y,
		d: 'up',
	};

	const path: { x: number, y: number }[] = [];

	while ( true ) {
		const { x, y, d } = guard;

		path.push( { x, y } );

		const inFront = grid.getCell( x, y )![ d ];

		if ( !inFront ) {
			break;
		}

		switch ( inFront.value ) {
			case '#':
				guard.d = turn90Clockwise( d );
				break;

			case '.':
				const next = forwards( x, y, d );
				guard.x = next.x;
				guard.y = next.y;
				break;

			default:
				throw new Error( `Unexpected cell value ${inFront.value} at [${inFront.x},${inFront.y}]` );
		}
	}

	return path.map( ( { x, y } ) => `${x},${y}` )
		.countUnique()
		.size
}

bench( 'part 1 example', () => part1( example ), 41 );

bench( 'part 1 input', () => part1( input ) );

// function part2( input: string ) {

// }

// bench( 'part 2 example', () => part2( example ), 6 );

// bench( 'part 2 input', () => part2( input ) );
