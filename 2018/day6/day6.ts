import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { manhattan } from '../../grid.ts';

function part1( input: string ) {
	const points = input
		.lines()
		.map( line => line.split( ', ' ).map( Number ) as [ number, number ] );

	const areas = new Map<string, [ number, number ][]>( points.map( point => [ point.join( ',' ), [] ] ) );

	const [ minX, maxX ] = points.pluck( '0' ).minMax();
	const [ minY, maxY ] = points.pluck( '1' ).minMax();

	for ( let x = minX; x <= maxX; x++ ) {
		for ( let y = minY; y <= maxY; y++ ) {
			if ( areas.has( `${x},${y}` ) ) {
				continue;
			}

			const distances = new Map<number, [ number, number ][]>();

			for ( const point of points ) {
				distances.push( manhattan( x, y, ...point ), point );
			}

			const closestPoints = distances
				.sortByKeyAsc()
				.valuesArray()
				.first()!;

			if ( closestPoints.length === 1 ) {
				areas.push( closestPoints[ 0 ].join( ',' ), [ x, y ] );
			}
		}
	}

	// Areas including points on the edge of the map are considered infinite, remove them
	const finiteAreas = areas
		.entriesArray()
		.filter( ( [ area, points ] ) => !points.some( ( [ x, y ] ) => x === minX || x === maxX || y === minY || y === maxY ) );

	const largestArea = finiteAreas.maxBy( ( [ area, points ] ) => points.length );

	if ( !largestArea ) {
		throw new Error( 'No finite areas found' );
	}

	return largestArea[ 1 ].length + 1; // Plus the point itself
}

bench( 'part 1 example', () => part1( example ), 17 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string, maxDistance: number ) {
	const points = input
		.lines()
		.map( line => line.split( ', ' ).map( Number ) as [ number, number ] );

	let safePoints = 0;

	const [ minX, maxX ] = points.pluck( '0' ).minMax();
	const [ minY, maxY ] = points.pluck( '1' ).minMax();

	for ( let x = minX; x <= maxX; x++ ) {
		for ( let y = minY; y <= maxY; y++ ) {

			const totalDistance = points
				.map( point => manhattan( x, y, ...point ) )
				.sum();

			if ( totalDistance < maxDistance ) {
				safePoints++;
			}
		}
	}

	return safePoints;
}

bench( 'part 2 example', () => part2( example, 32 ), 16 );

bench( 'part 2 input', () => part2( input, 10000 ) );
