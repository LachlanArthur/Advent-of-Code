import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { combinations } from '../../maths.ts';
import { findClusters, Vertex } from '../../pathfinder.ts';

class JunctionBox implements Vertex {
	edges = new Map<JunctionBox, number>();
	traversible = true;
	constructor(
		public x: number,
		public y: number,
		public z: number ) { }
	is( other: JunctionBox ): boolean {
		return this.x === other.x
			&& this.y === other.y
			&& this.z === other.z;
	}
}

function distance3d( a: JunctionBox, b: JunctionBox ): number {
	return Math.sqrt(
		( a.x - b.x ) ** 2 +
		( a.y - b.y ) ** 2 +
		( a.z - b.z ) ** 2
	)
}

function part1( input: string, maxConnections: number ) {
	const boxes = input
		.split( '\n' )
		.map( line => new JunctionBox( ...line.split( ',' ).map( Number ) as [ number, number, number ] ) );

	const candidateConnections = combinations( boxes, 2 )
		.map( ( [ a, b ] ) => ( { a, b, distance: distance3d( a, b ) } ) )
		.sortByNumberAsc( 'distance' )

	for ( const { a, b, distance } of candidateConnections.takeFirst( maxConnections ) ) {
		a.edges.set( b, distance );
		b.edges.set( a, distance );
	}

	return findClusters( boxes )
		.map( cluster => cluster.length )
		.sortByNumberDesc()
		.takeFirst( 3 )
		.product();
}

bench( 'part 1 example', () => part1( example, 10 ), 40 );

bench( 'part 1 input', () => part1( input, 1000 ) );

function part2( input: string ) {
	const boxes = input
		.split( '\n' )
		.map( line => new JunctionBox( ...line.split( ',' ).map( Number ) as [ number, number, number ] ) );

	const candidateConnections = combinations( boxes, 2 )
		.map( ( [ a, b ] ) => ( { a, b, distance: distance3d( a, b ) } ) )
		.sortByNumberAsc( 'distance' )

	for ( const { a, b, distance } of candidateConnections ) {
		a.edges.set( b, distance );
		b.edges.set( a, distance );

		if ( findClusters( boxes ).length === 1 ) {
			return a.x * b.x;
		}
	}

	throw new Error( 'More than one cluster' );
}

bench( 'part 2 example', () => part2( example ), 25272 );

bench( 'part 2 input', () => part2( input ) );
