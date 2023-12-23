import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Grid } from '../../grid.ts';
import { allPaths, simplifyGraph } from '../../pathfinder.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const grid = Grid.fromString( input );
	const vertices = grid.vertices( {
		getEdgeValue( source, destination, direction ) {
			switch ( source.value ) {
				default: throw new Error( `Unhandled grid input "${source.value}"` );
				case '#': return null;
				case '^': return direction === 'up' ? 1 : null;
				case 'v': return direction === 'down' ? 1 : null;
				case '<': return direction === 'left' ? 1 : null;
				case '>': return direction === 'right' ? 1 : null;
				case '.':
					switch ( destination.value ) {
						default: throw new Error( `Unhandled grid input "${destination.value}"` );
						case '#': return null;
						case '^': return direction === 'up' ? 1 : null;
						case 'v': return direction === 'down' ? 1 : null;
						case '<': return direction === 'left' ? 1 : null;
						case '>': return direction === 'right' ? 1 : null;
						case '.': return 1;
					}
			}
		},
	} );

	const start = vertices.find( ( { x, y } ) => x === 1 && y === 0 )!;
	const end = vertices.find( ( { x, y } ) => x === grid.width - 2 && y === grid.height - 1 )!;

	simplifyGraph( vertices, [ start, end ] );

	let longestPath = 0;

	for ( const { edgeTotal } of allPaths( start, end ) ) {
		if ( edgeTotal > longestPath ) {
			longestPath = edgeTotal;
		}
	}

	return longestPath;
}

bench( 'part 1 example', () => part1( example ), 94 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const grid = Grid.fromString( input );
	const vertices = grid.vertices();

	for ( const vertex of vertices ) {
		if ( vertex.value === '#' ) {
			vertex.traversible = false;
		}
	}

	const start = vertices.find( ( { x, y } ) => x === 1 && y === 0 )!;
	const end = vertices.find( ( { x, y } ) => x === grid.width - 2 && y === grid.height - 1 )!;

	simplifyGraph( vertices, [ start, end ] );

	let longestPath = 0;

	for ( const { edgeTotal } of allPaths( start, end ) ) {
		if ( edgeTotal > longestPath ) {
			longestPath = edgeTotal;
		}
	}

	return longestPath;
}

bench( 'part 2 example', () => part2( example ), 154 );

bench( 'part 2 input', () => part2( input ) );
