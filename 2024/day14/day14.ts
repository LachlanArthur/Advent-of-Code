import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { renderBrailleCoords, renderSextantGrid } from '../../debug.ts';
import { findClusters, Vertex2d } from '../../pathfinder.ts';

import example from './example.ts';
import input from './input.ts';

type Robot = [ number, number, number, number ];

function simulate( robots: Robot[], seconds: number, width: number, height: number ): [ number, number ][] {
	return robots.map( robot => [
		( ( robot[ 0 ] + robot[ 2 ] * seconds ) % width + width ) % width,
		( ( robot[ 1 ] + robot[ 3 ] * seconds ) % height + height ) % height,
	] );
}

function part1( input: string, seconds: number, width: number, height: number ) {
	const robots = input
		.lines()
		.map( line => line.match( /-?\d+/g )!.map( Number ) as Robot );

	const halfWidth = Math.floor( width / 2 );
	const halfHeight = Math.floor( height / 2 );

	return simulate( robots, seconds, width, height )
		.flatMap( ( [ x, y ] ) => {
			if ( x < halfWidth ) {
				if ( y < halfHeight ) {
					return [ 'topLeft' ];
				}
				if ( y > halfHeight ) {
					return [ 'bottomLeft' ];
				}
			}
			if ( x > halfWidth ) {
				if ( y < halfHeight ) {
					return [ 'topRight' ];
				}
				if ( y > halfHeight ) {
					return [ 'bottomRight' ];
				}
			}

			return [];
		} )
		.countUnique()
		.valuesArray()
		.product()
}

bench( 'part 1 example', () => part1( example, 100, 11, 7 ), 12 );

bench( 'part 1 input', () => part1( input, 100, 101, 103 ) );

function part2( input: string, width: number, height: number ) {
	const robots = input
		.lines()
		.map( line => line.match( /-?\d+/g )!.map( Number ) as Robot );

	let bestCluster = 0;
	let bestSecond = 0;

	const statesSeen = new Set<string>();

	for ( let second = 0; true; second++ ) {
		const state = simulate( robots, second, width, height );
		const stateKey = state.map( pos => pos.join( ',' ) ).join( ',' );

		if ( statesSeen.has( stateKey ) ) {
			break;
		}

		statesSeen.add( stateKey );

		const verts = state.map<Vertex2d & { id: number }>( ( [ x, y ], id ) => ( {
			x,
			y,
			id,
			is( other ) { return other.id === this.id },
			traversible: true,
			edges: new Map(),
		} ) );

		const grid: Vertex2d[][] = [];

		for ( const vert of verts ) {
			grid[ vert.y ] ??= [];
			grid[ vert.y ][ vert.x ] = vert;
		}

		for ( const vert of verts ) {
			const up = grid[ vert.y - 1 ]?.[ vert.x ];
			const down = grid[ vert.y + 1 ]?.[ vert.x ];
			const left = grid[ vert.y ]?.[ vert.x - 1 ];
			const right = grid[ vert.y ]?.[ vert.x + 1 ];

			up && vert.edges.set( up, 1 );
			down && vert.edges.set( down, 1 );
			left && vert.edges.set( left, 1 );
			right && vert.edges.set( right, 1 );
		}

		const clusters = findClusters( verts );
		const biggestCluster = clusters.pluck( 'length' ).max();

		if ( biggestCluster > bestCluster ) {
			bestCluster = biggestCluster;
			bestSecond = second;
		}
	}

	renderBrailleCoords( simulate( robots, bestSecond, width, height ) );

	return bestSecond;
}

bench( 'part 2 input', () => part2( input, 101, 103 ) );
