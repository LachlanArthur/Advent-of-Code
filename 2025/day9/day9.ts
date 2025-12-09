import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { combinations, minMax } from '../../maths.ts';
import { generateCoordinates, gridDistance, normaliseCoords, polygonGridPerimeter } from '../../grid.ts';
import { lineBetween } from '../../pathfinder.ts';
import { intervalsPartiallyOverlap } from '../../interval.ts';
import { renderCoords, renderGrid, renderGridSpec } from '../../debug.ts';

function part1( input: string ) {
	const redTiles = input
		.lines()
		.map( line => line.split( ',' ).map( Number ) as [ number, number ] );

	return combinations( redTiles, 2 )
		.map( ( [ [ ax, ay ], [ bx, by ] ] ) => {
			return Math.abs( ( ax - bx + 1 ) * ( ay - by + 1 ) );
		} )
		.max();
}

bench( 'part 1 example', () => part1( example ), 50 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const redTiles = input
		.lines()
		.map( line => line.split( ',' ).map( Number ) as [ number, number ] );

	const totalX = redTiles.pluck( '0' ).max();
	const totalY = redTiles.pluck( '1' ).max();
	
	const perimeterIntervals = redTiles.sliding( 2 );
	perimeterIntervals.push( perimeterIntervals[ 0 ] ); // Close the loop

	return combinations( redTiles, 2 )
		.filter( ( [ a, b ] ) => {
			const [ ax, ay ] = a;
			const [ bx, by ] = b;
			const [ minX, maxX ] = minMax( [ ax, bx ] );
			const [ minY, maxY ] = minMax( [ ay, by ] );

			// console.group( 'Rect %o,%o -> %o,%o', minX, minY, maxX, maxY );

			const inside = perimeterIntervals
				.filter( ( [ p1, p2 ] ) => p1 !== a && p1 !== b && p2 !== a && p2 !== b )
				.some( ( [ p1, p2 ] ) => {
					const [ p1x, p1y ] = p1;
					const [ p2x, p2y ] = p2;
					const [ pMinX, pMaxX ] = minMax( [ p1x, p2x ] );
					const [ pMinY, pMaxY ] = minMax( [ p1y, p2y ] );

					// console.group( 'Line %o,%o -> %o,%o', pMinX, pMinY, pMaxX, pMaxY );

					// renderCoords( [
					// 	...generateCoordinates( 0, 0, totalX, totalY ).map( p => [ ...p, '.' ] as [ number, number, string ] ),
					// 	...generateCoordinates( minX, minY, maxX, maxY ).map( p => [ ...p, '#' ] as [ number, number, string ] ),
					// 	...lineBetween( pMinX, pMinY, pMaxX, pMaxY ).map( p => [ ...p, 'x' ] as [ number, number, string ] ),
					// ] );

					// console.groupEnd();
					return intervalsPartiallyOverlap( [ minX, maxX ], [ pMinX, pMaxX ] )
						&& intervalsPartiallyOverlap( [ minY, maxY ], [ pMinY, pMaxY ] );
				} );

			// console.log( 'Allowed?', !inside );
			// console.groupEnd();

			return !inside;
		} )
		.map( ( [ [ ax, ay ], [ bx, by ] ] ) => Math.abs( ( ax - bx + 1 ) * ( ay - by + 1 ) ) )
		.max();
}

bench( 'part 2 example', () => part2( example ), 24 );

bench( 'part 2 input', () => part2( input ) );
