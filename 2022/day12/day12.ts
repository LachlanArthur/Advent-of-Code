import '../../extensions.ts';
import { Grid } from '../../grid.ts';
import { AStarGrid } from '../../pathfinder.ts';

import example from './example.ts';
import input from './input.ts';

function parse( input: string ) {
	let startPos: [ number, number ] | undefined;
	let endPos: [ number, number ] | undefined;

	const grid = Grid.fromString(
		input,
		( char, x, y ) => {
			switch ( char ) {
				default: return char.charCodeAt( 0 ) - 96;
				case 'S': startPos = [ x, y ]; return 1;
				case 'E': endPos = [ x, y ]; return 26;
			}
		}
	);

	if ( !startPos ) throw new Error( 'Start position not found' );
	if ( !endPos ) throw new Error( 'End position not found' );

	const pathfinder = AStarGrid.fromGrid(
		grid,
		undefined,
		( source, destination ) => destination.value - source.value < 2 ? 1 : null,
	);

	const start = pathfinder.vertices[ grid.getCell( ...startPos )!.index ];
	const end = pathfinder.vertices[ grid.getCell( ...endPos )!.index ];

	return {
		pathfinder,
		start,
		end,
		width: grid.width,
		height: grid.height,
	}
}

function part1( input: string ) {
	const { pathfinder, start, end } = parse( input );

	const path = pathfinder.path( start, end );

	pathfinder.display( path );

	return path.length - 1;
}

console.assert( part1( example ) === 31 );

console.log( part1( input ) );

function part2( input: string ) {
	const { pathfinder, end } = parse( input );

	const paths = pathfinder.vertices
		.filter( vertex => vertex.value === 1 )
		.map( vertex => pathfinder.path( vertex, end ) )
		.filter( path => path.length > 0 )
		.sort( ( a, b ) => a.length - b.length );

	const shortest = paths.shift()!;

	pathfinder.display( shortest );

	return shortest.length - 1;
}

console.assert( part2( example ) === 29 );

console.log( part2( input ) );
