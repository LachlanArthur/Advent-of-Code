import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Grid, pointsAroundManhattan } from '../../grid.ts';
import { GridVertex } from '../../pathfinder.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string, cheatLength: number ) {
	const grid = Grid.fromString( input );

	const verts = grid.vertices<string, GridVertex<string>>( {
		getEdgeValue: ( source, dest ) => {
			if ( source.value !== '#' ) {
				return dest.value === '#' ? null : 1;
			}
			return 1;
		},
	} );

	const start = verts.find( v => v.value === 'S' )!;
	const end = verts.find( v => v.value === 'E' )!;

	const path: GridVertex<string>[] = [ start ];

	while ( true ) {
		const prev = path.at( -2 );
		const current = path.at( -1 )!;

		if ( prev ) {
			const otherEdges = current.edges.keysArray().without( prev );

			// Can't have three edges
			console.assert( otherEdges.length < 2 );

			const next = otherEdges.first();

			if ( !next ) {
				break;
			}

			path.push( next );
		} else {
			path.push( current.edges.keysArray().first()! );
		}
	}

	console.assert( path.at( -1 ) === end );

	const walls = verts
		.filter( vert => vert.value === '#' )
		.filter( vert => {
			const edges = vert.edges.keysArray();
			const wallEdges = edges.filter( e => e.value === '#' );
			const pathEdges = edges.filter( e => e.value !== '#' );

			if ( wallEdges.length !== 2 || pathEdges.length !== 2 ) {
				return false;
			}

			return wallEdges[ 0 ].x === wallEdges[ 1 ].x || wallEdges[ 0 ].y === wallEdges[ 1 ].y;
		} );

	const cheats = walls
		.map( wall => {
			const [ start, end ] = wall.edges.keysArray().filter( e => e.value !== '#' );

			const startIndex = path.indexOf( start );
			const endIndex = path.indexOf( end );
			const length = Math.abs( endIndex - startIndex ) + 1;

			return length - 3;
		} )

	return cheats.filter( cheat => cheat >= cheatLength ).length;
}

bench( 'part 1 example', () => part1( example, 64 ), 1 );

bench( 'part 1 input', () => part1( input, 100 ) );

function part2( input: string ) {
	const grid = Grid.fromString( input );

	const verts = grid.vertices<string, GridVertex<string>>( {
		getEdgeValue: ( source, dest ) => {
			if ( source.value !== '#' ) {
				return dest.value === '#' ? null : 1;
			}
			return 1;
		},
	} );

	const start = verts.find( v => v.value === 'S' )!;
	const end = verts.find( v => v.value === 'E' )!;

	const path: GridVertex<string>[] = [ start ];

	while ( true ) {
		const prev = path.at( -2 );
		const current = path.at( -1 )!;

		if ( prev ) {
			const otherEdges = current.edges.keysArray().without( prev );

			// Can't have three edges
			console.assert( otherEdges.length < 2 );

			const next = otherEdges.first();

			if ( !next ) {
				break;
			}

			path.push( next );
		} else {
			path.push( current.edges.keysArray().first()! );
		}
	}

	console.assert( path.at( -1 ) === end );

	const cheatPathLengths: number[] = [];
	const positionIndexCache = new Map( path.map( ( vert, index ) => [ `${vert.x},${vert.y}`, index ] ) );

	for ( const [ startIndex, step ] of path.entries() ) {
		for ( let radius = 2; radius <= 20; radius++ ) {
			for ( const [ endX, endY ] of pointsAroundManhattan( step.x, step.y, radius ) ) {
				if ( !grid.inside( endX, endY ) ) {
					continue;
				}

				const endIndex = positionIndexCache.get( `${endX},${endY}` )!;

				if ( startIndex >= endIndex ) {
					continue;
				}

				const savedSteps = Math.abs( endIndex - startIndex ) - radius;

				cheatPathLengths.push( savedSteps );
			}
		}
	}

	return cheatPathLengths
		.filter( l => l >= 100 )
		.length
}

bench( 'part 2 example', () => part2( example ), 0 );

bench( 'part 2 input', () => part2( input ) );
