import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { cellIndexFromCoordinates, generateCoordinates } from '../../grid.ts';

function powerlevelCell( x: number, y: number, serial: number ): number {
	return ( ( ( ( ( x + 10 ) * y + serial ) * ( x + 10 ) ) / 100 << 0 ) % 10 ) - 5;
}

function findAreaTotals( serial: number, maxSize: number ) {
	const width = 300;
	const height = 300;

	const gridSpec: [ number, number, number, number ] = [ 1, 1, width, height ];

	const cells = Array.from( generateCoordinates( ...gridSpec ) )
		.map( ( [ x, y ] ) => [ x, y, powerlevelCell( x, y, serial ) ] );

	const bestAreasForCells: ( [ number, number ] | undefined )[] = cells
		.flatMap( ( [ x, y, value ], index ) => {
			const areaTotals: number[] = [ 0, value ];
			const maxSizeForCell = Math.min( maxSize, Math.min( width - x, height - y ) );

			for ( let size = 2; size <= maxSizeForCell; size++ ) {
				const maxX = x + size - 1;
				const maxY = y + size - 1;

				areaTotals[ size ] = areaTotals[ size - 1 ];

				// East
				for ( let yExtra = y; yExtra < maxY; yExtra++ ) {
					areaTotals[ size ] += cells[ cellIndexFromCoordinates( maxX, yExtra, ...gridSpec ) ][ 2 ];
				}

				// South
				for ( let xExtra = x; xExtra < maxX; xExtra++ ) {
					areaTotals[ size ] += cells[ cellIndexFromCoordinates( xExtra, maxY, ...gridSpec ) ][ 2 ];
				}

				// Corner
				areaTotals[ size ] += cells[ cellIndexFromCoordinates( maxX, maxY, ...gridSpec ) ][ 2 ];
			}

			if ( areaTotals.length < 4 ) {
				return [ undefined ];
			}

			return [
				areaTotals
					.entriesArray()
					.slice( 3 ) // Ignore areas of size 0, 1, 2
					.maxBy( '1' )!
			];
		} );

	const [ cellIndex, [ size, power ] ] = bestAreasForCells.entriesArray().maxBy( entry => {
		if ( typeof entry[ 1 ] === 'undefined' ) {
			return -Infinity;
		}
		return entry[ 1 ][ 1 ];
	} )! as [ number, [ number, number ] ];

	const [ x, y ] = cells[ cellIndex ];

	return {
		x,
		y,
		size,
		power
	};
}

function part1( serial: number ) {
	const { x, y } = findAreaTotals( serial, 3 );

	return `${x},${y}`;
}

bench( 'power test 1', () => powerlevelCell( 3, 5, 8 ), 4 );
bench( 'power test 2', () => powerlevelCell( 122, 79, 57 ), -5 );
bench( 'power test 3', () => powerlevelCell( 217, 196, 39 ), 0 );
bench( 'power test 4', () => powerlevelCell( 101, 153, 71 ), 4 );

bench( 'part 1 example 1', () => part1( 18 ), '33,45' );
bench( 'part 1 example 2', () => part1( 42 ), '21,61' );

bench( 'part 1 input', () => part1( input ) );

function part2( serial: number ) {
	const { x, y, size } = findAreaTotals( serial, 300 );

	return `${x},${y},${size}`;
}

bench( 'part 2 example 1', () => part2( 18 ), '90,269,16' );
bench( 'part 2 example 2', () => part2( 42 ), '232,251,12' );

bench( 'part 2 input', () => part2( input ) );
