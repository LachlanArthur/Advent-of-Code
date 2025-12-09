import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { combinations, minMax } from '../../maths.ts';
import { getDirection, getTurn, lineBetween, turn90Anticlockwise, turn90Clockwise } from '../../pathfinder.ts';
import { intervalsFullyOverlap, intervalsPartiallyOverlap } from '../../interval.ts';
import { renderCoords } from '../../debug.ts';
import { generateCoordinates } from '../../grid.ts';

function part1( input: string ) {
	const redTiles = input
		.lines()
		.map( line => line.split( ',' ).map( Number ) as [ number, number ] );

	return combinations( redTiles, 2 )
		.map( ( [ [ ax, ay ], [ bx, by ] ] ) => Math.abs( ( ax - bx + 1 ) * ( ay - by + 1 ) ) )
		.max();
}

bench( 'part 1 example', () => part1( example ), 50 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const redTiles = input
		.lines()
		.map( line => line.split( ',' ).map( Number ) as [ number, number ] );

	// const [ minX, maxX ] = redTiles.pluck( '0' ).minMax();
	// const [ minY, maxY ] = redTiles.pluck( '1' ).minMax();

	const perimeterLines = [ ...redTiles, redTiles[ 0 ] ]
		.sliding( 2 ) as [ [ number, number ], [ number, number ] ][];

	const perimeterDirections = perimeterLines
		.map( ( [ [ ax, ay ], [ bx, by ] ] ) => getDirection( ax, ay, bx, by )! );

	const perimeterTurns = [ ...perimeterDirections, perimeterDirections[ 0 ] ]
		.sliding( 2 )
		.map( ( [ from, to ] ) => getTurn( from, to )! );

	const totalTurns = perimeterTurns.sum();

	const insideDirections = totalTurns > 0
		? perimeterDirections.map( turn90Clockwise )
		: perimeterDirections.map( turn90Anticlockwise );


	const verticalPerimetersByX = new Map<number, number[]>();
	const horizontalPerimetersByY = new Map<number, number[]>();

	for ( const [ index, direction ] of perimeterDirections.entries() ) {
		switch ( direction ) {
			case 'up':
			case 'down':
				verticalPerimetersByX.push( perimeterLines[ index ][ 0 ][ 0 ], index );
				break;
			case 'left':
			case 'right':
				horizontalPerimetersByY.push( perimeterLines[ index ][ 0 ][ 1 ], index );
				break;
		}
	}

	const pointToPerimeterIndex = new Map<string, number[]>();
	for ( const [ i, [ a, b ] ] of perimeterLines.entries() ) {
		pointToPerimeterIndex.push( a.join( ',' ), i );
		pointToPerimeterIndex.push( b.join( ',' ), i );
	}




	// const perimeterCoordsDisplay = perimeterLines
	// 	.flatMap( ( [ [ ax, ay ], [ bx, by ] ] ) => lineBetween( ax, ay, bx, by )
	// 		.map( p => [ ...p, '.' ] as [ number, number, string ] ) );

	// renderCoords( perimeterCoordsDisplay, undefined, ' ' );



	return combinations( redTiles, 2 )
		.flatMap( ( [ a, b ] ) => {
			const [ ax, ay ] = a;
			const [ bx, by ] = b;
			const [ left, right ] = minMax( [ ax, bx ] );
			const [ top, bottom ] = minMax( [ ay, by ] );
			const width = right - left + 1;
			const height = bottom - top + 1;

			if ( redTiles.some( otherTile => otherTile[ 0 ] > left && otherTile[ 0 ] < right && otherTile[ 1 ] > top && otherTile[ 1 ] < bottom ) ) {
				// It's got a point inside it...
				return [];
			}

			// Excludes corners
			const topSide: [ [ number, number ], [ number, number ] ] = [ [ left + 1, top ], [ right - 1, top ] ];
			const leftSide: [ [ number, number ], [ number, number ] ] = [ [ left, top + 1 ], [ left, bottom - 1 ] ];
			const rightSide: [ [ number, number ], [ number, number ] ] = [ [ right, top + 1 ], [ right, bottom - 1 ] ];
			const bottomSide: [ [ number, number ], [ number, number ] ] = [ [ left + 1, bottom ], [ right - 1, bottom ] ];

			// Check for vertical edges that overlap the middle of the rectangle
			for ( let x = left + 1; x <= right - 1; x++ ) {
				if ( ( verticalPerimetersByX.get( x ) ?? [] ).some( index => intervalsFullyOverlap( perimeterLines[ index ].pluck( '1' ) as [ number, number ], [ top, bottom ] ) ) ) {
					return [];
				}
			}

			// Check for horizontal edges that overlap the middle of the rectangle
			for ( let y = top + 1; y <= bottom - 1; y++ ) {
				if ( ( horizontalPerimetersByY.get( y ) ?? [] ).some( index => intervalsFullyOverlap( perimeterLines[ index ].pluck( '0' ) as [ number, number ], [ left, right ] ) ) ) {
					return [];
				}
			}

			const topPerimetersIndexes = horizontalPerimetersByY.get( top ) ?? [];
			const leftPerimetersIndexes = verticalPerimetersByX.get( left ) ?? [];
			const rightPerimetersIndexes = verticalPerimetersByX.get( right ) ?? [];
			const bottomPerimetersIndexes = horizontalPerimetersByY.get( bottom ) ?? [];

			const overlappingTop = topPerimetersIndexes.filter( index => intervalsPartiallyOverlap( perimeterLines[ index ].pluck( '0' ) as [ number, number ], topSide.pluck( '0' ) as [ number, number ] ) );
			const overlappingLeft = leftPerimetersIndexes.filter( index => intervalsPartiallyOverlap( perimeterLines[ index ].pluck( '1' ) as [ number, number ], leftSide.pluck( '1' ) as [ number, number ] ) );
			const overlappingRight = rightPerimetersIndexes.filter( index => intervalsPartiallyOverlap( perimeterLines[ index ].pluck( '1' ) as [ number, number ], rightSide.pluck( '1' ) as [ number, number ] ) );
			const overlappingBottom = bottomPerimetersIndexes.filter( index => intervalsPartiallyOverlap( perimeterLines[ index ].pluck( '0' ) as [ number, number ], bottomSide.pluck( '0' ) as [ number, number ] ) );

			const overlappingTopInsides = overlappingTop.map( index => insideDirections[ index ] ).unique();
			const overlappingLeftInsides = overlappingLeft.map( index => insideDirections[ index ] ).unique();
			const overlappingRightInsides = overlappingRight.map( index => insideDirections[ index ] ).unique();
			const overlappingBottomInsides = overlappingBottom.map( index => insideDirections[ index ] ).unique();

			const validTop = overlappingTopInsides.every( direction => direction === 'down' )
			const validLeft = overlappingLeftInsides.every( direction => direction === 'right' )
			const validRight = overlappingRightInsides.every( direction => direction === 'left' )
			const validBottom = overlappingBottomInsides.every( direction => direction === 'up' )

			if ( !( validTop && validLeft && validRight && validBottom ) ) {
				return [];
			}

			// renderCoords( [
			// 	...generateCoordinates( minX, minY, maxX, maxY ).map( p => [ ...p, ' ' ] as [ number, number, string ] ),
			// 	...perimeterCoordsDisplay,
			// 	...generateCoordinates( left, top, right, bottom ).map( p => [ ...p, '#' ] as [ number, number, string ] ),
			// ] );

			// console.log( {
			// 	width,
			// 	height,
			// 	result: width * height,
			// 	validTop,
			// 	validLeft,
			// 	validRight,
			// 	validBottom,
			// 	overlappingTop,
			// 	overlappingLeft,
			// 	overlappingRight,
			// 	overlappingBottom,
			// 	overlappingTopInsides,
			// 	overlappingLeftInsides,
			// 	overlappingRightInsides,
			// 	overlappingBottomInsides,
			// } )

			if ( validTop && validLeft && validRight && validBottom ) {
				return [ width * height ];
			}
			return [];
		} )
		.max();
}


bench( 'part 2 example', () => part2( example ), 24 );

// bench( 'part 2 example', () => part2( `0,5
// 5,5
// 5,0
// 7,0
// 7,12
// 5,12
// 5,7
// 0,7` ) );

// bench( 'part 2 example', () => part2( `0,0
// 10,0
// 10,2
// 2,2
// 2,8
// 10,8
// 10,10
// 0,10` ) );

// bench( 'part 2 example', () => part2( `1,0
// 3,0
// 3,6
// 16,6
// 16,0
// 18,0
// 18,9
// 13,9
// 13,7
// 6,7
// 6,9
// 1,9` ), 30 );

// bench( 'part 2 example', () => part2( `4,2
// 13,2
// 13,4
// 8,4
// 8,6
// 11,6
// 11,10
// 4,10` ), 40 );

// bench( 'part 2 example', () => part2( `4,2
// 13,2
// 13,4
// 8,4
// 8,6
// 11,6
// 11,10
// 7,10
// 7,8
// 6,8
// 6,10
// 4,10` ), 30 );

// bench( 'part 2 example', () => part2( `3,2
// 17,2
// 17,13
// 13,13
// 13,11
// 15,11
// 15,8
// 11,8
// 11,15
// 18,15
// 18,17
// 4,17
// 4,12
// 6,12
// 6,5
// 3,5` ), 66 );

// bench( 'part 2 example', () => part2( `1,1
// 3,1
// 3,2
// 6,2
// 6,0
// 8,0
// 8,3
// 9,3
// 9,4
// 4,4
// 4,6
// 7,6
// 7,8
// 2,8
// 2,5
// 1,5` ), 18 );

// bench( 'part 2 example', () => part2( `1,1
// 11,1
// 11,11
// 10,11
// 10,2
// 1,2` ), 22 );

// bench( 'part 2 example', () => part2( `3,0
// 5,0
// 5,2
// 6,2
// 6,0
// 8,0
// 8,3
// 11,3
// 11,5
// 1,5
// 1,6
// 11,6
// 11,8
// 8,8
// 8,11
// 6,11
// 6,9
// 5,9
// 5,11
// 3,11
// 3,8
// 0,8
// 0,3
// 3,3` ) );

bench( 'part 2 input', () => part2( input ) );
