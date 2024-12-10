import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Grid } from '../../grid.ts';
import { allPaths, AStarGrid, GridVertex } from '../../pathfinder.ts';

import example1 from './example1.ts';
import example2 from './example2.ts';
import example3 from './example3.ts';
import input from './input.ts';

function part1( input: string ) {
	const grid = Grid.fromString( input );

	const pathfinder = AStarGrid.fromGrid(
		grid,
		cell => {
			const vertex = new GridVertex( cell.x, cell.y, Number( cell.value ) );
			if ( cell.value === '.' ) {
				vertex.traversible = false;
			}
			return vertex;
		},
		( from, to ) => to.value - from.value === 1 ? 1 : null,
	);

	const starts = grid
		.findCells( cell => cell.value === '0' )
		.map( ( { x, y } ) => pathfinder.getVertex( x, y )! );

	const ends = grid
		.findCells( cell => cell.value === '9' )
		.map( ( { x, y } ) => pathfinder.getVertex( x, y )! );

	return starts.crossJoin( ends )
		.filter( ( [ start, end ] ) => pathfinder.path( start, end ).length > 0 )
		.groupBy( 0 )
		.valuesArray()
		.pluck( 'length' )
		.sum()
}

bench( 'part 1 example 1', () => part1( example1 ), 1 );

bench( 'part 1 example 2', () => part1( example2 ), 2 );

bench( 'part 1 example 3', () => part1( example3 ), 36 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const grid = Grid.fromString( input );

	const pathfinder = AStarGrid.fromGrid(
		grid,
		cell => {
			const vertex = new GridVertex( cell.x, cell.y, Number( cell.value ) );
			if ( cell.value === '.' ) {
				vertex.traversible = false;
			}
			return vertex;
		},
		( from, to ) => to.value - from.value === 1 ? 1 : null,
	);

	const starts = grid
		.findCells( cell => cell.value === '0' )
		.map( ( { x, y } ) => pathfinder.getVertex( x, y )! );

	const ends = grid
		.findCells( cell => cell.value === '9' )
		.map( ( { x, y } ) => pathfinder.getVertex( x, y )! );

	return starts.crossJoin( ends )
		.map( ( [ start, end ] ) => ( {
			start: `${start.x},${start.y}`,
			end: `${end.x},${end.y}`,
			paths: allPaths( start, end ).toArray().length,
		} ) )
		.groupBy( 'start' )
		.valuesArray()
		.map( paths => paths.pluck( 'paths' ).sum() )
		.sum()
}

bench( 'part 2 example 3', () => part2( example3 ), 81 );

bench( 'part 2 input', () => part2( input ) );
