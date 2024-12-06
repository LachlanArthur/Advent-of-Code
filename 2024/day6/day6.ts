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

function walk( input: string, obstacle?: { x: number, y: number } ) {
	const grid = Grid.fromString( input );

	const guardCell = grid.findCell( cell => cell.value === '^' )!;
	guardCell.value = '.';

	const guard: Guard = {
		x: guardCell.x,
		y: guardCell.y,
		d: 'up',
	};

	if ( obstacle ) {
		grid.getCell( obstacle.x, obstacle.y )!.value = '#';
	}

	const been = new Set<string>();
	const path = new Set<string>();

	while ( true ) {
		const { x, y, d } = guard;
		const beenKey = `${x},${y}`;
		const pathKey = `${x},${y},${d}`;

		if ( path.has( pathKey ) ) {
			return null;
		}

		path.add( pathKey );
		been.add( beenKey );

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

	return { been, path };
}

function part1( input: string ) {
	const { been } = walk( input )!;

	return been.size;
}

bench( 'part 1 example', () => part1( example ), 41 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const { been } = walk( input )!;

	const loopObstacles: { x: number, y: number }[] = [];

	for ( const step of been ) {
		const [ x, y ] = step.split( ',' ).map( Number );

		if ( walk( input, { x, y } ) === null ) {
			loopObstacles.push( { x, y } );
		}
	}

	return loopObstacles.length;
}

bench( 'part 2 example', () => part2( example ), 6 );

bench( 'part 2 input', () => part2( input ) );
