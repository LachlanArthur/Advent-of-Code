import { } from '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Tuple, tuple } from '../../structures.ts';
import { pointsAroundManhattan, pointsAroundManhattan3d } from '../../grid.ts';

import example from './example.ts';
import example2 from './example2.ts';
import input from './input.ts';

type Quad = [ number, number, number, number ];

function part1( input: string ) {
	const nanobots = input
		.lines()
		.map( line => line.match( /-?\d+/g )!.map( Number ) as Quad )

	const strongest = nanobots.maxBy( '3' )!;
	const inRange = nanobots.filter( nanobot => {
		return (
			Math.abs( nanobot[ 0 ] - strongest[ 0 ] ) +
			Math.abs( nanobot[ 1 ] - strongest[ 1 ] ) +
			Math.abs( nanobot[ 2 ] - strongest[ 2 ] ) <= strongest[ 3 ]
		);
	} );

	return inRange.length;
}

bench( 'part 1 example', () => part1( example ), 7 );

bench( 'part 1 input', () => part1( input ) );

function manhattan3d( ax: number, ay: number, az: number, bx: number, by: number, bz: number ) {
	return Math.abs( ax - bx ) + Math.abs( ay - by ) + Math.abs( az - bz );
}

function part2( input: string ) {
	const nanobots = input
		.lines()
		.map( line => line.match( /-?\d+/g )!.map( Number ) as Quad )

	const intersectionGroups = new Map<number, Set<number>>();

	for ( const [ [ aIndex, a ], [ bIndex, b ] ] of nanobots.entriesArray().combinationsLazy( 2 ) ) {
		if ( !intersectionGroups.has( aIndex ) ) intersectionGroups.set( aIndex, new Set() );
		if ( !intersectionGroups.has( bIndex ) ) intersectionGroups.set( bIndex, new Set() );

		const aRangeSet = intersectionGroups.get( aIndex )!;
		const bRangeSet = intersectionGroups.get( bIndex )!;
		aRangeSet.add( aIndex );
		bRangeSet.add( bIndex );

		if ( manhattan3d( a[ 0 ], a[ 1 ], a[ 2 ], b[ 0 ], b[ 1 ], b[ 2 ] ) <= a[ 3 ] + b[ 3 ] ) {
			aRangeSet.add( bIndex );
			bRangeSet.add( aIndex );
		}
	}

	while ( true ) {
		const [ smallestIndex ] = intersectionGroups.entriesArray()
			.minBy( ( [ , set ] ) => set.size )!

		intersectionGroups.delete( smallestIndex );

		for ( const [ , set ] of intersectionGroups ) {
			set.delete( smallestIndex );
		}

		if ( !intersectionGroups.valuesArray().combinationsLazy( 2 ).find( ( [ a, b ] ) => !a.same( b ) ) ) {
			// Every remaining set is the same
			break;
		}
	}

	const overlappingNanobotIndices = intersectionGroups.keysArray();

	// console.log( '%o nanobots share an overlapping area', intersectionGroups.size );

	let axis1min = -Infinity;
	let axis1max = Infinity;
	let axis2min = -Infinity
	let axis2max = Infinity
	let axis3min = -Infinity
	let axis3max = Infinity
	let axis4min = -Infinity;
	let axis4max = Infinity;

	for ( const i of overlappingNanobotIndices ) {
		const [ x, y, z, r ] = nanobots[ i ];
		axis1min = Math.max( axis1min, x + y + z - r );
		axis1max = Math.min( axis1max, x + y + z + r );
		axis2min = Math.max( axis2min, x + y - z - r );
		axis2max = Math.min( axis2max, x + y - z + r );
		axis3min = Math.max( axis3min, x - y + z - r );
		axis3max = Math.min( axis3max, x - y + z + r );
		axis4min = Math.max( axis4min, x - y - z - r );
		axis4max = Math.min( axis4max, x - y - z + r );
	}

	// console.log( [
	// 	'The largest intersection of nanobots is an octahedron defined by the intersection of the following planes:',
	// 	`x + y + z = ${axis1min}`,
	// 	`x + y + z = ${axis1max}`,
	// 	`x + y - z = ${axis2min}`,
	// 	`x + y - z = ${axis2max}`,
	// 	`x - y + z = ${axis3min}`,
	// 	`x - y + z = ${axis3max}`,
	// 	`x - y - z = ${axis4min}`,
	// 	`x - y - z = ${axis4max}`,
	// ].unique().join( '\n' ) );

	const intersectionMinX = Math.ceil( ( axis1min + axis4min ) / 2 );
	const intersectionMinY = Math.ceil( ( axis1min + axis2min ) / 2 - intersectionMinX );
	const intersectionMinZ = Math.ceil( ( axis1min + axis3min ) / 2 - intersectionMinX );
	const intersectionMaxX = Math.ceil( ( axis1max + axis4max ) / 2 );
	const intersectionMaxY = Math.ceil( ( axis1max + axis2max ) / 2 - intersectionMaxX );
	const intersectionMaxZ = Math.ceil( ( axis1max + axis3max ) / 2 - intersectionMaxX );

	// Build a new octahedron based on the intersection of the planes, it contains all the intersections
	const intersectionOctahedronX = ( intersectionMinX + intersectionMaxX ) / 2;
	const intersectionOctahedronY = ( intersectionMinY + intersectionMaxY ) / 2;
	const intersectionOctahedronZ = ( intersectionMinZ + intersectionMaxZ ) / 2;
	const intersectionOctahedronR = Math.max(
		Math.abs( intersectionMinX - intersectionOctahedronX ),
		Math.abs( intersectionMinY - intersectionOctahedronY ),
		Math.abs( intersectionMinZ - intersectionOctahedronZ ),
		Math.abs( intersectionMaxX - intersectionOctahedronX ),
		Math.abs( intersectionMaxY - intersectionOctahedronY ),
		Math.abs( intersectionMaxZ - intersectionOctahedronZ ),
	);

	let smallestDistance = Infinity;

	// The closest point to the origin will be on the shell of the intersection octahedron
	for ( const [ x, y, z ] of pointsAroundManhattan3d(
		intersectionOctahedronX,
		intersectionOctahedronY,
		intersectionOctahedronZ,
		intersectionOctahedronR,
	) ) {
		const distance = manhattan3d( 0, 0, 0, x, y, z );
		if ( distance < smallestDistance ) {
			smallestDistance = distance;
		}
	}

	return smallestDistance;
}

bench( 'part 2 example', () => part2( example2 ), 36 );

bench( 'part 2 input', () => part2( input ) );
