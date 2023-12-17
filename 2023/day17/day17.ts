import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Grid } from '../../grid.ts';
import { AStar, Vertex } from '../../pathfinder.ts';
import { renderBrailleGrid } from '../../debug.ts';

import example from './example.ts';
import input from './input.ts';

enum Direction {
	up,
	down,
	left,
	right,
}

class CityBlock implements Vertex {
	edges = new Map<CityBlock, number>();
	traversible = true;

	constructor(
		public x: number,
		public y: number,
		public heat: number,
		public direction: Direction,
		public distance: number,
	) { }

	is( other: CityBlock ): boolean {
		return this.x === other.x && this.y === other.y;
	}
}

class CityBlockAStar extends AStar<CityBlock> {
	protected heuristic( a: CityBlock, b: CityBlock ): number {
		return Math.abs( a.x - b.x ) + Math.abs( a.y - b.y );
	}
}

function findPath( input: string, minStraight: number, maxStraight: number ) {
	const grid = Grid.fromString(
		input,
		char => Number( char ),
	);

	const directions: Direction[] = [
		Direction.up,
		Direction.down,
		Direction.left,
		Direction.right,
	];

	const vertexMap = new Map<string, CityBlock[]>(
		grid.flatCells().flatMap<[ string, CityBlock[] ]>( cell => {
			const versions: [ string, CityBlock[] ][] = [];

			for ( const dir of directions ) {
				const distances: CityBlock[] = [];
				for ( let i = 1; i <= maxStraight; i++ ) {
					distances.push( new CityBlock( cell.x, cell.y, cell.value, dir, i ) );
				}
				versions.push( [ `${cell.x},${cell.y},${dir}`, distances ] );
			}

			return versions;
		} )
	);

	// Connect the edges
	for ( const [ vertexKey, distances ] of vertexMap ) {
		for ( const vertex of distances ) {

			const up = vertexMap.get( `${vertex.x},${vertex.y - 1},${Direction.up}` ) ?? [];
			const down = vertexMap.get( `${vertex.x},${vertex.y + 1},${Direction.down}` ) ?? [];
			const left = vertexMap.get( `${vertex.x - 1},${vertex.y},${Direction.left}` ) ?? [];
			const right = vertexMap.get( `${vertex.x + 1},${vertex.y},${Direction.right}` ) ?? [];

			let edges: CityBlock[] = [];

			if ( vertex.x === 0 && vertex.y === 0 ) {
				// The start position has no direction or distance
				vertex.edges.set( right[ 0 ], right[ 0 ].heat );
				vertex.edges.set( down[ 0 ], down[ 0 ].heat );
				continue;
			}

			switch ( vertex.direction ) {
				case Direction.up:
					edges = [ up[ vertex.distance ] ];

					if ( vertex.distance >= minStraight ) {
						edges.push( left[ 0 ], right[ 0 ] );
					}
					break;

				case Direction.down:
					edges = [ down[ vertex.distance ] ];

					if ( vertex.distance >= minStraight ) {
						edges.push( left[ 0 ], right[ 0 ] );
					}
					break;

				case Direction.left:
					edges = [ left[ vertex.distance ] ];

					if ( vertex.distance >= minStraight ) {
						edges.push( up[ 0 ], down[ 0 ] );
					}
					break;

				case Direction.right:
					edges = [ right[ vertex.distance ] ];

					if ( vertex.distance >= minStraight ) {
						edges.push( up[ 0 ], down[ 0 ] );
					}
					break;
			}

			for ( const edge of edges ) {
				if ( typeof edge === 'undefined' ) continue;

				if ( edge.x === grid.width - 1 && edge.y === grid.height - 1 ) {
					// Cannot get to the end unless it's over the minimum distance
					if ( edge.distance < minStraight ) continue;
				}

				vertex.edges.set( edge, edge.heat );
			}
		}
	}

	const pathfinder = new CityBlockAStar();

	const start = vertexMap.get( `0,0,${Direction.up}` )![ 0 ];
	const end = vertexMap.get( `${grid.width - 1},${grid.height - 1},${Direction.up}` )![ 0 ];

	const path = pathfinder.path( start, end );
	// const path = pathfinder.pathAnimation( start, end, 'animation', grid.width, grid.height, v => [ v.x, v.y ] );

	if ( path.length === 0 ) {
		throw new Error( 'Failed to find path' );
	}

	// renderBrailleGrid( Array.filledFromCoordinates( path.map( ( { x, y } ) => [ x, y ] ), () => true, () => false ) as boolean[][] );

	path.shift(); // Exclude start from total
	return path.map( vertex => vertex.heat ).sum();
}

function part1( input: string ) {
	return findPath( input, 1, 3 );
}

bench( 'part 1 example', () => part1( example ), 102 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	return findPath( input, 4, 10 )
}

bench( 'part 2 example', () => part2( example ), 94 );

bench( 'part 2 example 2', () => part2( `111111111111
999999999991
999999999991
999999999991
999999999991` ), 71 );

bench( 'part 2 input', () => part2( input ) );
