import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Cell, Grid } from '../../grid.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const grid = Grid.fromString<string, Cell<string>>( input );
	const antiNodes = new Set<string>();

	grid.findCells( cell => cell.value != '.' )
		.groupBy( 'value' )
		.valuesArray()
		.flatMap( nodes => nodes
			.combinations( 2 )
			.forEach( ( [ a, b ] ) => {
				const xDiff = b.x - a.x;
				const yDiff = b.y - a.y;

				const x1 = a.x - xDiff;
				const y1 = a.y - yDiff;
				const x2 = b.x + xDiff;
				const y2 = b.y + yDiff;

				grid.inside( x1, y1 ) && antiNodes.add( `${x1},${y1}` );
				grid.inside( x2, y2 ) && antiNodes.add( `${x2},${y2}` );
			} )
		)

	return antiNodes.size;
}

bench( 'part 1 example', () => part1( example ), 14 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const grid = Grid.fromString<string, Cell<string>>( input );
	const antiNodes = new Set<string>();

	grid.findCells( cell => cell.value != '.' )
		.groupBy( 'value' )
		.valuesArray()
		.forEach( nodes => nodes
			.combinations( 2 )
			.forEach( ( [ a, b ] ) => {
				const xDiff = b.x - a.x;
				const yDiff = b.y - a.y;

				for ( let x = a.x, y = a.y; grid.inside( x, y ); x -= xDiff, y -= yDiff ) {
					antiNodes.add( `${x},${y}` );
				}

				for ( let x = b.x, y = b.y; grid.inside( x, y ); x += xDiff, y += yDiff ) {
					antiNodes.add( `${x},${y}` );
				}
			} ) )

	return antiNodes.size;
}

bench( 'part 2 example', () => part2( example ), 34 );

bench( 'part 2 input', () => part2( input ) );
