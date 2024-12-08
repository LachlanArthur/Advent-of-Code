import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Cell, Grid } from '../../grid.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const grid = Grid.fromString<string, Cell<string>>( input );
	const nodes = grid.findCells( cell => cell.value != '.' );
	const nodeGroups = nodes.groupBy( 'value' );

	return nodeGroups
		.valuesArray()
		.flatMap( nodes => {
			return nodes.combinations( 2 )
				.flatMap( ( [ a, b ] ) => {
					const xDiff = b.x - a.x;
					const yDiff = b.y - a.y;

					return [
						new Cell( a.x - xDiff, a.y - yDiff, '#' ),
						new Cell( b.x + xDiff, b.y + yDiff, '#' ),
					];
				} )
		} )
		.filter( cell => cell.x >= 0 && cell.y >= 0 && cell.x < grid.width && cell.y < grid.height )
		.map( cell => ( {
			key: `${cell.x},${cell.y}`,
			cell,
		} ) )
		.uniqueBy( 'key' )
		.length
}

bench( 'part 1 example', () => part1( example ), 14 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const grid = Grid.fromString<string, Cell<string>>( input );
	const nodes = grid.findCells( cell => cell.value != '.' );
	const nodeGroups = nodes.groupBy( 'value' );

	return nodeGroups
		.valuesArray()
		.flatMap( nodes => {
			return nodes.combinations( 2 )
				.flatMap( ( [ a, b ] ) => {
					const xDiff = b.x - a.x;
					const yDiff = b.y - a.y;

					const antiNodes = [];

					for ( let x = a.x, y = a.y; x >= 0 && x < grid.width && y >= 0 && y < grid.height; x -= xDiff, y -= yDiff ) {
						antiNodes.push( new Cell( x, y, '#' ) );
					}

					for ( let x = b.x, y = b.y; x >= 0 && x < grid.width && y >= 0 && y < grid.height; x += xDiff, y += yDiff ) {
						antiNodes.push( new Cell( x, y, '#' ) );
					}

					return antiNodes;
				} )
		} )
		.filter( cell => cell.x >= 0 && cell.y >= 0 && cell.x < grid.width && cell.y < grid.height )
		.map( cell => ( {
			key: `${cell.x},${cell.y}`,
			cell,
		} ) )
		.uniqueBy( 'key' )
		.length
}

bench( 'part 2 example', () => part2( example ), 34 );

bench( 'part 2 input', () => part2( input ) );
