import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { tuple } from '../../structures.ts';
import { range } from '../../maths.ts';

import example from './example.ts';
import input from './input.ts';

type Point2d = [ number, number ];
type Point3d = [ number, number, number ];

type Brick = Point3d[];

function createBrick( a: Point3d, b: Point3d ): Brick {
	const xRange = [ ...range( a[ 0 ], b[ 0 ] ) ];
	const yRange = [ ...range( a[ 1 ], b[ 1 ] ) ];
	const zRange = [ ...range( a[ 2 ], b[ 2 ] ) ];

	const length = Math.max( xRange.length, yRange.length, zRange.length );

	return [
		xRange.pad( length, xRange[ 0 ] ),
		yRange.pad( length, yRange[ 0 ] ),
		zRange.pad( length, zRange[ 0 ] ),
	].transpose().map( point => tuple( ...point ) as Point3d );
}

function brickShadow( brick: Brick ): Point2d[] {
	return brick.map( ( [ x, y ] ) => tuple( x, y ) as Point2d ).unique()
}

function part1( input: string ) {
	let bricks: Brick[] = [];

	for ( const line of input.lines() ) {
		const [ left, right ] = line.split( '~' ).map( s => s.split( ',' ).map( Number ) as Point3d );
		const brick = createBrick( left, right );
		bricks.push( brick );
	}

	bricks = bricks.sortByNumberAsc( brick => brick.pluck( '2' ).min() );

	const heightMap = new Map<Point2d, number>();

	for ( const [ i, brick ] of bricks.entries() ) {
		const bottom = brick.pluck( '2' ).min();
		const shadow = brickShadow( brick );
		const fallTo = shadow.map( point2d => ( heightMap.get( point2d ) ?? 0 ) + 1 ).max();

		const shiftZ = bottom - fallTo;

		if ( shiftZ < 0 ) {
			throw new Error( 'Brick started below the heightmap' );
		}

		const newBrick = brick.map( ( [ x, y, z ] ) => tuple( x, y, z - shiftZ ) as Point3d );

		bricks[ i ] = newBrick;

		for ( const [ x, y, z ] of newBrick ) {
			heightMap.set( tuple( x, y ) as Point2d, z );
		}
	}

	bricks = bricks.sortByNumberAsc( brick => brick.pluck( '2' ).min() );

	const brickPointLookup = new Map<Point3d, number>();

	for ( const [ brickIndex, brick ] of bricks.entries() ) {
		for ( const point of brick ) {
			brickPointLookup.set( point, brickIndex );
		}
	}

	let disintegrated = 0;

	for ( const [ brickIndex, brick ] of bricks.entries() ) {
		const above = Object.values( Object.groupBy(
			brick.map( ( [ x, y, z ] ) => tuple( x, y, z + 1 ) as Point3d ),
			( [ x, y ] ) => `${x},${y}`,
		) )
			.map( points => {
				const x = points.pluck( '0' )[ 0 ];
				const y = points.pluck( '1' )[ 0 ];
				const z = points.pluck( '2' ).max();

				return tuple( x, y, z ) as Point3d;
			} );

		const supportedBricks = above
			.map( point3d => brickPointLookup.get( point3d ) )
			.filterExists()
			.unique();

		if ( supportedBricks.length === 0 ) {
			disintegrated++;
			continue;
		}

		if ( supportedBricks.every( supportedBrickIndex => {
			const supportedBrick = bricks[ supportedBrickIndex ];
			const below = Object.values( Object.groupBy(
				supportedBrick.map( ( [ x, y, z ] ) => tuple( x, y, z - 1 ) as Point3d ),
				( [ x, y ] ) => `${x},${y}`,
			) )
				.map( points => {
					const x = points.pluck( '0' )[ 0 ];
					const y = points.pluck( '1' )[ 0 ];
					const z = points.pluck( '2' ).min();

					return tuple( x, y, z ) as Point3d;
				} );

			const otherSupporterBricks = below
				.map( point3d => brickPointLookup.get( point3d ) )
				.filterExists()
				.without( brickIndex )
				.unique();

			return otherSupporterBricks.length > 0;
		} ) ) {
			disintegrated++;
			continue;
		}
	}

	return disintegrated;
}

bench( 'part 1 example', () => part1( example ), 5 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	let bricks: Brick[] = [];

	for ( const line of input.lines() ) {
		const [ left, right ] = line.split( '~' ).map( s => s.split( ',' ).map( Number ) as Point3d );
		const brick = createBrick( left, right );
		bricks.push( brick );
	}

	bricks = bricks.sortByNumberAsc( brick => brick.pluck( '2' ).min() );

	const heightMap = new Map<Point2d, number>();

	for ( const [ i, brick ] of bricks.entries() ) {
		const bottom = brick.pluck( '2' ).min();
		const shadow = brickShadow( brick );
		const fallTo = shadow.map( point2d => ( heightMap.get( point2d ) ?? 0 ) + 1 ).max();

		const shiftZ = bottom - fallTo;

		if ( shiftZ < 0 ) {
			throw new Error( 'Brick started below the heightmap' );
		}

		const newBrick = brick.map( ( [ x, y, z ] ) => tuple( x, y, z - shiftZ ) as Point3d );

		bricks[ i ] = newBrick;

		for ( const [ x, y, z ] of newBrick ) {
			heightMap.set( tuple( x, y ) as Point2d, z );
		}
	}

	bricks = bricks.sortByNumberAsc( brick => brick.pluck( '2' ).min() );

	const brickPointLookup = new Map<Point3d, number>();

	for ( const [ brickIndex, brick ] of bricks.entries() ) {
		for ( const point of brick ) {
			brickPointLookup.set( point, brickIndex );
		}
	}

	function getBricksAbove( brickIndex: number ): number[] {
		const above = Object.values( Object.groupBy(
			bricks[ brickIndex ].map( ( [ x, y, z ] ) => tuple( x, y, z + 1 ) as Point3d ),
			( [ x, y ] ) => `${x},${y}`,
		) )
			.map( points => {
				const x = points.pluck( '0' )[ 0 ];
				const y = points.pluck( '1' )[ 0 ];
				const z = points.pluck( '2' ).max();

				return tuple( x, y, z ) as Point3d;
			} );

		return above
			.map( point3d => brickPointLookup.get( point3d ) )
			.filterExists()
			.unique();
	}

	function getBricksBelow( brickIndex: number ): number[] {
		const below = Object.values( Object.groupBy(
			bricks[ brickIndex ].map( ( [ x, y, z ] ) => tuple( x, y, z - 1 ) as Point3d ),
			( [ x, y ] ) => `${x},${y}`,
		) )
			.map( points => {
				const x = points.pluck( '0' )[ 0 ];
				const y = points.pluck( '1' )[ 0 ];
				const z = points.pluck( '2' ).min();

				return tuple( x, y, z ) as Point3d;
			} );

		return below
			.map( point3d => brickPointLookup.get( point3d ) )
			.filterExists()
			.unique();
	}

	function getPerilousBricks( removeBrick: number ): number {
		let nextRemovals: number[] = [ removeBrick ];
		const perilousBricks: number[] = [];

		do {
			const supportedBricks = nextRemovals.flatMap( getBricksAbove ).unique();

			nextRemovals = supportedBricks.filter( supportedBrickIndex => {
				return getBricksBelow( supportedBrickIndex ).without( removeBrick, ...nextRemovals, ...perilousBricks ).length === 0;
			} ).unique();

			perilousBricks.push( ...nextRemovals );

		} while ( nextRemovals.length > 0 );

		return perilousBricks.length;
	}

	return bricks.keysArray().map( getPerilousBricks ).sum();
}

bench( 'part 2 example', () => part2( example ), 7 );

bench( 'part 2 input', () => part2( input ) );
