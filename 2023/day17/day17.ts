import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Grid } from '../../grid.ts';
import { AStarManhattan, Vertex2d } from '../../pathfinder.ts';
import { renderBrailleGrid } from '../../debug.ts';

import example from './example.ts';
import input from './input.ts';

enum Direction {
	up,
	down,
	left,
	right,
}

class CityBlock implements Vertex2d {
	edges = new Map<CityBlock, number>();
	traversible = true;

	constructor(
		public x: number,
		public y: number,
		public heat: number,
		public direction: Direction,
	) { }

	is( other: CityBlock ): boolean {
		return this.x === other.x && this.y === other.y;
	}
}

const directions: Direction[] = [
	Direction.up,
	Direction.down,
	Direction.left,
	Direction.right,
];

const directionOffset: Record<Direction, [ number, number ]> = {
	[ Direction.up ]: [ 0, -1 ],
	[ Direction.down ]: [ 0, 1 ],
	[ Direction.left ]: [ -1, 0 ],
	[ Direction.right ]: [ 1, 0 ],
}

function findPath( input: string, minStraight: number, maxStraight: number ) {
	const grid = Grid.fromString(
		input,
		char => Number( char ),
	);

	const vertexMap = new Map<string, CityBlock>(
		grid.flatCells().flatMap<[ string, CityBlock ]>( cell => {
			const versions: [ string, CityBlock ][] = [];

			for ( const dir of directions ) {
				versions.push( [ `${cell.x},${cell.y},${dir}`, new CityBlock( cell.x, cell.y, cell.value, dir ) ] );
			}

			return versions;
		} )
	);

	// Connect the edges
	for ( const [ vertexKey, vertex ] of vertexMap ) {
		let allowedDirections: Direction[] = [];

		if ( vertex.x === 0 && vertex.y === 0 ) {
			// The start position has no direction, it connects directly to its neighbours
			allowedDirections = [
				Direction.right,
				Direction.down,
			];
		} else switch ( vertex.direction ) {
			case Direction.up:
			case Direction.down:
				allowedDirections = [ Direction.left, Direction.right ];
				break;
			case Direction.left:
			case Direction.right:
				allowedDirections = [ Direction.up, Direction.down ];
				break;
		}

		for ( const dir of allowedDirections ) {
			for ( let i = minStraight; i <= maxStraight; i++ ) {
				const [ offsetX, offsetY ] = directionOffset[ dir ];
				const targetX = vertex.x + ( i * offsetX );
				const targetY = vertex.y + ( i * offsetY );
				const target = vertexMap.get( `${targetX},${targetY},${dir}` );
				if ( target ) {
					let heat = 0;

					for ( let step = 1; step <= i; step++ ) {
						const stepX = vertex.x + ( step * offsetX );
						const stepY = vertex.y + ( step * offsetY );
						heat += vertexMap.get( `${stepX},${stepY},${dir}` )!.heat;
					}

					vertex.edges.set( target, heat );
				}
			}
		}
	}

	const pathfinder = new AStarManhattan<CityBlock>();

	const start = vertexMap.get( `0,0,${Direction.up}` )!;
	const end = vertexMap.get( `${grid.width - 1},${grid.height - 1},${Direction.up}` )!;

	const path = pathfinder.path( start, end );
	// const path = pathfinder.pathAnimation( start, end, 'animation', grid.width, grid.height, v => [ v.x, v.y ] );

	if ( path.length === 0 ) {
		throw new Error( 'Failed to find path' );
	}

	// pathfinder.display( path );

	return path.sliding( 2 )
		.map( ( [ a, b ] ) => a.edges.get( b )! )
		.sum();
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
