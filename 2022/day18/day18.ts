import { bench } from '../../bench.ts';
import '../../extensions.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const inputLines = input.split( '\n' )

	const voxelCoords = inputLines
		.map( line => line.split( ',' ).map( Number ) ) as [ number, number, number ][]

	const [ maxX, maxY, maxZ ] = voxelCoords
		.transpose()
		.map( coords => coords.max() )

	const voxelSet = new Set( inputLines );

	let sharedFaces = 0;

	for ( const [ x, y, z ] of voxelCoords ) {
		voxelSet.has( [ x + 1, y, z ].join() ) && sharedFaces++;
		voxelSet.has( [ x - 1, y, z ].join() ) && sharedFaces++;
		voxelSet.has( [ x, y + 1, z ].join() ) && sharedFaces++;
		voxelSet.has( [ x, y - 1, z ].join() ) && sharedFaces++;
		voxelSet.has( [ x, y, z + 1 ].join() ) && sharedFaces++;
		voxelSet.has( [ x, y, z - 1 ].join() ) && sharedFaces++;
	}

	const maxFaces = voxelSet.size * 6;

	return maxFaces - sharedFaces;
}

bench( 'part 1 example', () => part1( example ), 64 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const inputLines = input.split( '\n' )

	const voxelCoords = inputLines
		.map( line => line.split( ',' ).map( Number ) ) as [ number, number, number ][]

	const [ [ minX, maxX ], [ minY, maxY ], [ minZ, maxZ ] ] = voxelCoords
		.transpose()
		.map( coords => [ coords.min(), coords.max() ] )

	const voxelSet = new Set( inputLines );

	let sharedFaces = 0;

	for ( const [ x, y, z ] of voxelCoords ) {
		voxelSet.has( [ x + 1, y, z ].join() ) && sharedFaces++;
		voxelSet.has( [ x - 1, y, z ].join() ) && sharedFaces++;
		voxelSet.has( [ x, y + 1, z ].join() ) && sharedFaces++;
		voxelSet.has( [ x, y - 1, z ].join() ) && sharedFaces++;
		voxelSet.has( [ x, y, z + 1 ].join() ) && sharedFaces++;
		voxelSet.has( [ x, y, z - 1 ].join() ) && sharedFaces++;
	}

	const maxFaces = voxelSet.size * 6;

	const surfaceArea = maxFaces - sharedFaces;

	const airSet = new Set<string>();
	for ( let x = minX; x <= maxX; x++ ) {
		for ( let y = minY; y <= maxY; y++ ) {
			for ( let z = minZ; z <= maxZ; z++ ) {
				if ( !voxelSet.has( [ x, y, z ].join() ) ) {
					airSet.add( [ x, y, z ].join() );
				}
			}
		}
	}

	let outsideAir = new Set<string>();
	let addedAir = false;

	do {
		addedAir = false;

		for ( const air of airSet ) {
			const [ x, y, z ] = air.split( ',' ).map( Number );

			if ( outsideAir.has( air ) ) continue;

			if (
				x === minX || x === maxX ||
				y === minX || y === maxY ||
				z === minZ || z === maxZ
			) {
				outsideAir.add( air );
				addedAir = true;
				continue;
			}

			if (
				outsideAir.has( [ x + 1, y, z ].join() ) ||
				outsideAir.has( [ x - 1, y, z ].join() ) ||
				outsideAir.has( [ x, y + 1, z ].join() ) ||
				outsideAir.has( [ x, y - 1, z ].join() ) ||
				outsideAir.has( [ x, y, z + 1 ].join() ) ||
				outsideAir.has( [ x, y, z - 1 ].join() )
			) {
				outsideAir.add( air );
				addedAir = true;
			}
		}
	} while ( addedAir )

	let insideAir = new Set<string>();

	for ( const air of airSet ) {
		if ( !outsideAir.has( air ) ) {
			insideAir.add( air );
		}
	}

	let enclosedFaces = 0;

	for ( const air of insideAir ) {
		const [ x, y, z ] = air.split( ',' ).map( Number );

		voxelSet.has( [ x + 1, y, z ].join() ) && enclosedFaces++;
		voxelSet.has( [ x - 1, y, z ].join() ) && enclosedFaces++;
		voxelSet.has( [ x, y + 1, z ].join() ) && enclosedFaces++;
		voxelSet.has( [ x, y - 1, z ].join() ) && enclosedFaces++;
		voxelSet.has( [ x, y, z + 1 ].join() ) && enclosedFaces++;
		voxelSet.has( [ x, y, z - 1 ].join() ) && enclosedFaces++;
	}

	return surfaceArea - enclosedFaces;
}

bench( 'part 2 example', () => part2( example ), 58 );

bench( 'part 2 input', () => part2( input ) );
