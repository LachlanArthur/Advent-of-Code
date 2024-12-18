import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Cell, Grid } from '../../grid.ts';

import example from './example.ts';
import input from './input.ts';
import { AStarGrid, GridVertex } from '../../pathfinder.ts';

function part1( input: string, size: number, bytes: number ) {
	const points = input.lines()
		.takeFirst( bytes )
		.map( line => line.match( /\d+/g )!.map( Number ) as [ number, number ] );

	const cellsArray: Cell<number>[][] = [];

	for ( let y = 0; y < size; y++ ) {
		cellsArray[ y ] ??= [];
		for ( let x = 0; x < size; x++ ) {
			const value = points.findIndex( point => point[ 1 ] === y && point[ 0 ] === x );
			cellsArray[ y ][ x ] = new Cell( x, y, value === -1 ? Infinity : value );
		}
	}

	const grid = new Grid<number, Cell<number>>( cellsArray );

	const pathfinder = AStarGrid.fromGrid<number, GridVertex<number>>(
		grid,
		cell => {
			const vert = new GridVertex( cell.x, cell.y, cell.value );
			vert.traversible = !isFinite( cell.value );
			return vert;
		},
		( source, dest ) => dest.traversible ? 1 : null,
	);

	const start = pathfinder.getVertex( 0, 0 )!;
	const end = pathfinder.getVertex( size - 1, size - 1 )!;

	const path = pathfinder.path( start, end );

	if ( path.length === 0 ) {
		throw new Error( 'No path' );
	}

	return path.length - 1;
}

bench( 'part 1 example', () => part1( example, 7, 12 ), 22 );

bench( 'part 1 input', () => part1( input, 71, 1024 ) );

function part2( input: string, size: number ) {
	const lines = input.lines();

	for ( let i = lines.length; i > 0; i-- ) {
		try {
			part1( input, size, i );
		} catch ( e ) {
			continue;
		}
		return lines[ i ];
	}
}

bench( 'part 2 example', () => part2( example, 7 ), '6,1' );

bench( 'part 2 input', () => part2( input, 71 ) );
