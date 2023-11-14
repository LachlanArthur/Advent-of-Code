import '../../extensions.ts';
import { renderBrailleGrid } from '../../debug.ts';
import { Cell, Grid } from "../../grid.ts";

import example, { simpleExample } from './example.ts';
import input from './input.ts';
import { bench } from '../../bench.ts';

type Point = [ number, number ];
type PointKey = string;

const toPointKey = ( point: Point ) => point.join() as PointKey;
const fromPointKey = ( key: PointKey ) => key.split( ',' ).map( Number ) as Point;

function part1( input: string, maxRounds: number ) {
	let elfPositions = new Set<PointKey>;

	const chars = input
		.split( '\n' )
		.map( line => line.split( '' ) );

	for ( const [ y, line ] of chars.entries() ) {
		for ( const [ x, char ] of line.entries() ) {
			if ( char === '#' ) {
				elfPositions.add( toPointKey( [ x, y ] ) );
			}
		}
	}

	const elfAt = ( point: Point ) => elfPositions.has( toPointKey( point ) );

	const surroundPoints = ( [ x, y ]: Point ): [ Point, Point, Point, Point, Point, Point, Point, Point ] => [
		[ x - 1, y - 1 ], [ x, y - 1 ], [ x + 1, y - 1 ],
		[ x - 1, y     ],               [ x + 1, y     ],
		[ x - 1, y + 1 ], [ x, y + 1 ], [ x + 1, y + 1 ],
	]
	const northPoints = ( [ x, y ]: Point ): [ Point, Point, Point ] => [ [ x - 1, y - 1 ], [ x, y - 1 ], [ x + 1, y - 1 ] ]
	const southPoints = ( [ x, y ]: Point ): [ Point, Point, Point ] => [ [ x - 1, y + 1 ], [ x, y + 1 ], [ x + 1, y + 1 ] ]
	const eastPoints = ( [ x, y ]: Point ): [ Point, Point, Point ] => [ [ x + 1, y - 1 ], [ x + 1, y ], [ x + 1, y + 1 ] ]
	const westPoints = ( [ x, y ]: Point ): [ Point, Point, Point ] => [ [ x - 1, y - 1 ], [ x - 1, y ], [ x - 1, y + 1 ] ]

	const tryMove = ( from: Point, points: Point[] ): Point | null => {
		if ( points.some( elfAt ) ) return null;
		return points[ 1 ];
	}

	const tryNorth = ( point: Point ): Point | null => tryMove( point, northPoints( point ) );
	const trySouth = ( point: Point ): Point | null => tryMove( point, southPoints( point ) );
	const tryEast = ( point: Point ): Point | null => tryMove( point, eastPoints( point ) );
	const tryWest = ( point: Point ): Point | null => tryMove( point, westPoints( point ) );

	const move = ( currentPositionSet: Set<PointKey>, round: number ) => {
		const currentPositions = currentPositionSet.valuesArray().map( fromPointKey );
		const moved: Point[] = [];
		const stationary: Point[] = [];

		const proposalMap = new Map<string, Point[]>();

		const propose = ( from: Point, to: Point ) => {
			const key = toPointKey( to );

			if ( !proposalMap.has( key ) ) {
				proposalMap.set( key, [] );
			}

			proposalMap.get( key )!.push( from );
		}

		const actionOrder = [
			tryNorth,
			trySouth,
			tryWest,
			tryEast,
		]

		actionOrder.push( ...actionOrder.splice( 0, round % actionOrder.length ) );

		for ( const point of currentPositions ) {
			const [ x, y ] = point;
			const isAlone = !surroundPoints( point ).some( elfAt );

			if ( isAlone ) {
				stationary.push( point );
				continue;
			}

			const result = actionOrder
				.map( action => action( point ) )
				.filter( result => result )[ 0 ] ?? null;

			if ( result ) {
				propose( point, result );
			} else {
				stationary.push( point );
			}
		}

		for ( const [ targetPointKey, sourcePoints ] of proposalMap ) {
			if ( sourcePoints.length === 1 ) {
				moved.push( fromPointKey( targetPointKey ) );
			} else {
				stationary.push( ...sourcePoints );
			}
		}

		return {
			moved: new Set( moved.map( toPointKey ) ),
			stationary: new Set( stationary.map( toPointKey ) ),
		};
	}

	// console.log(
	// 	Array.filledFromCoordinates( elfPositions, () => '#', '.' )
	// 		.map( line => line.join( '' ) )
	// 		.join('\n')
	// )

	for ( let round = 0; round < maxRounds; round++ ) {
		const { moved, stationary } = move( elfPositions, round );

		// console.log( { moved, stationary } );

		elfPositions = new Set( [
			...moved,
			...stationary
		] );

		// console.log(
		// 	Array.filledFromCoordinates( elfPositions, () => '#', '.' )
		// 		.map( line => line.join( '' ) )
		// 		.join('\n')
		// )

		if ( moved.size === 0 ) {
			console.log( 'stabilised at round', round );
			break;
		}
	}

	const elfCount = elfPositions.size // ?

	const [ width, height ] = elfPositions
		.valuesArray()
		.map( fromPointKey )
		.log()
		.transpose()
		.map( numbers => numbers.max() - numbers.min() ) // ?

	return width * height - elfCount; // ?

	// console.log( elfPositions );
}

bench( 'part 1 example', () => part1( example, 10 ), 110 );

bench( 'part 1 input', () => part1( input, 10 ) );

bench( 'part 2 example', () => part1( example, Infinity ), 20 );

bench( 'part 2 input', () => part1( input, Infinity ) );
