import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { Cell, CellDirectionKing, Grid, manhattan } from '../../grid.ts';
import { allPaths, AStarGrid, AStarManhattan, GridVertex, pathLength, simplifyGraph, Vertex2d } from '../../pathfinder.ts';

class DirectionVertex implements Vertex2d {
	edges = new Map<DirectionVertex, number>();
	traversible = true;
	constructor(
		public x: number,
		public y: number,
		public direction: CellDirectionKing,
	) { }
	is( other: DirectionVertex ): boolean {
		return this.x === other.x && this.y === other.y;
	}
}

class DirectionGrid extends AStarManhattan<DirectionVertex> {
	protected heuristic( a: DirectionVertex, b: DirectionVertex ): number {
		// The normal distance
		return manhattan( a.x, a.y, b.x, b.y ) +
			// Plus we have to turn at least once
			( a.x !== b.x && a.y !== b.y ? 1000 : 0 );
	}

	getVertex( x: number, y: number, direction?: CellDirectionKing ): DirectionVertex | undefined {
		if ( direction ) {
			return this.vertices.find( v => v.x === x && v.y === y && v.direction === direction );
		}

		return this.vertices.find( v => v.x === x && v.y === y );
	}
}

function part1( input: string ) {
	const grid = Grid.fromString( input );

	const verts: Record<CellDirectionKing, DirectionVertex[][]> = {
		up: [],
		down: [],
		left: [],
		right: [],
	};

	const nonWalls = grid.flatCells().filter( cell => cell.value !== '#' );

	for ( const { x, y } of nonWalls ) {
		( verts.up[ y ] ??= [] )[ x ] = new DirectionVertex( x, y, 'up' );
		( verts.down[ y ] ??= [] )[ x ] = new DirectionVertex( x, y, 'down' );
		( verts.left[ y ] ??= [] )[ x ] = new DirectionVertex( x, y, 'left' );
		( verts.right[ y ] ??= [] )[ x ] = new DirectionVertex( x, y, 'right' );
	}

	for ( const cell of nonWalls ) {
		const { x, y } = cell;

		const up = verts.up[ y ][ x ];
		const down = verts.down[ y ][ x ];
		const left = verts.left[ y ][ x ];
		const right = verts.right[ y ][ x ];

		// Move in same direction
		cell.up && cell.up.value !== '#' && up.edges.set( verts.up[ cell.up.y ][ cell.up.x ], 1 );
		cell.down && cell.down.value !== '#' && down.edges.set( verts.down[ cell.down.y ][ cell.down.x ], 1 );
		cell.left && cell.left.value !== '#' && left.edges.set( verts.left[ cell.left.y ][ cell.left.x ], 1 );
		cell.right && cell.right.value !== '#' && right.edges.set( verts.right[ cell.right.y ][ cell.right.x ], 1 );

		// Turn in place
		up.edges.set( left, 1000 );
		up.edges.set( right, 1000 );
		down.edges.set( left, 1000 );
		down.edges.set( right, 1000 );
		left.edges.set( up, 1000 );
		left.edges.set( down, 1000 );
		right.edges.set( up, 1000 );
		right.edges.set( down, 1000 );
	}

	const pathfinder = new DirectionGrid( Object.values( verts ).flat( 2 ) );

	const startCell = grid.findCell( cell => cell.value === 'S' )!;
	const endCell = grid.findCell( cell => cell.value === 'E' )!;

	const start = pathfinder.getVertex( startCell.x, startCell.y, 'right' )!;
	const ends = [
		pathfinder.getVertex( endCell.x, endCell.y, 'up' )!,
		pathfinder.getVertex( endCell.x, endCell.y, 'down' )!,
		pathfinder.getVertex( endCell.x, endCell.y, 'left' )!,
		pathfinder.getVertex( endCell.x, endCell.y, 'right' )!,
	];

	return ends.map( end => pathLength( pathfinder.path( start, end ) ) ).min()
}

bench( 'part 1 example', () => part1( example ), 7036 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const grid = Grid.fromString( input );

	const verts: Record<CellDirectionKing, DirectionVertex[][]> = {
		up: [],
		down: [],
		left: [],
		right: [],
	};

	const nonWalls = grid.flatCells().filter( cell => cell.value !== '#' );

	for ( const { x, y } of nonWalls ) {
		( verts.up[ y ] ??= [] )[ x ] = new DirectionVertex( x, y, 'up' );
		( verts.down[ y ] ??= [] )[ x ] = new DirectionVertex( x, y, 'down' );
		( verts.left[ y ] ??= [] )[ x ] = new DirectionVertex( x, y, 'left' );
		( verts.right[ y ] ??= [] )[ x ] = new DirectionVertex( x, y, 'right' );
	}

	for ( const cell of nonWalls ) {
		const { x, y } = cell;

		const up = verts.up[ y ][ x ];
		const down = verts.down[ y ][ x ];
		const left = verts.left[ y ][ x ];
		const right = verts.right[ y ][ x ];

		// Move in same direction
		cell.up && cell.up.value !== '#' && up.edges.set( verts.up[ cell.up.y ][ cell.up.x ], 1 );
		cell.down && cell.down.value !== '#' && down.edges.set( verts.down[ cell.down.y ][ cell.down.x ], 1 );
		cell.left && cell.left.value !== '#' && left.edges.set( verts.left[ cell.left.y ][ cell.left.x ], 1 );
		cell.right && cell.right.value !== '#' && right.edges.set( verts.right[ cell.right.y ][ cell.right.x ], 1 );

		// Turn in place
		up.edges.set( left, 1000 );
		up.edges.set( right, 1000 );
		down.edges.set( left, 1000 );
		down.edges.set( right, 1000 );
		left.edges.set( up, 1000 );
		left.edges.set( down, 1000 );
		right.edges.set( up, 1000 );
		right.edges.set( down, 1000 );
	}

	const simpleGraph = AStarGrid.fromGrid(
		grid,
		cell => {
			const vert = new GridVertex( cell.x, cell.y, cell.value );
			if ( cell.value === '#' ) {
				vert.traversible = false;
			}
			return vert;
		},
		( source, dest ) => dest.value === '#' ? null : 1,
	);

	const pathfinder = new DirectionGrid( Object.values( verts ).flat( 2 ) );

	const startCell = grid.findCell( cell => cell.value === 'S' )!;
	const endCell = grid.findCell( cell => cell.value === 'E' )!;

	const start = pathfinder.getVertex( startCell.x, startCell.y, 'right' )!;
	const ends = [
		pathfinder.getVertex( endCell.x, endCell.y, 'up' )!,
		pathfinder.getVertex( endCell.x, endCell.y, 'down' )!,
		pathfinder.getVertex( endCell.x, endCell.y, 'left' )!,
		pathfinder.getVertex( endCell.x, endCell.y, 'right' )!,
	];

	const endPaths = ends.map( end => pathfinder.path( start, end ) );
	const { bestEnd, bestCost, bestPath } = endPaths.map( path => {
		return {
			bestEnd: path.at( -1 )!,
			bestCost: pathLength( path ),
			bestPath: path,
		};
	} )
		.sortByNumberAsc( 'bestCost' )
		.first()!;

	console.log( { bestCost } );

	const bestPathLength = bestPath.map( ( { x, y } ) => `${x},${y}` ).unique().length;

	const simpleStart = simpleGraph.getVertex( start.x, start.y )!;
	const simpleEnd = simpleGraph.getVertex( bestEnd.x, bestEnd.y )!;

	const paths = allPaths( simpleStart, simpleEnd, bestPathLength );

	const bestTiles = new Set<string>();

	for ( const path of paths ) {
		if ( path.vertices.length !== bestPathLength ) continue;

		let direction = 'right' as CellDirectionKing;
		let totalCost = 0;

		// simpleGraph.display( path.vertices );

		path.vertices
			.sliding( 2 )
			.forEach( ( [ source, dest ] ) => {
				const sourceCell = grid.getCell( source.x, source.y )!;
				const destCell = grid.getCell( dest.x, dest.y )!;

				let newDirection: CellDirectionKing;

				switch ( destCell ) {
					default:
						throw new Error( `Somehow moved from ${source.x},${source.y} to ${dest.x},${dest.y}` );
					case sourceCell.up:
						newDirection = 'up';
						break;
					case sourceCell.down:
						newDirection = 'down';
						break;
					case sourceCell.left:
						newDirection = 'left';
						break;
					case sourceCell.right:
						newDirection = 'right';
						break;
				}

				let cost: number;

				if ( direction === newDirection ) {
					cost = 1;
				} else if (
					direction === 'up' && newDirection === 'down' ||
					direction === 'down' && newDirection === 'up' ||
					direction === 'left' && newDirection === 'right' ||
					direction === 'right' && newDirection === 'left'
				) {
					throw new Error( 'Backtracking' );
				} else {
					cost = 1001;
				}

				totalCost += cost;

				// console.log( { newDirection, cost, totalCost } );

				direction = newDirection;
			} )

		if ( totalCost === bestCost ) {
			// simpleGraph.display( path.vertices );
			for ( const { x, y } of path.vertices ) {
				bestTiles.add( `${x},${y}` );
			}
		}
	}

	return bestTiles.size;

	// const bestPaths: DirectionVertex[][] = [];
	// for ( const path of allPaths( start, bestEnd, bestCost ) ) {
	// 	console.log( path.edgeTotal );
	// 	// bestPaths.push( path );
	// 	// if (  > bestCost ) {
	// 	// 	break;
	// 	// }
	// }

	// console.log( bestPaths.length );

	// return bestPaths
	// 	.flat( 1 )
	// 	.map( vert => `${vert.x},${vert.y}` )
	// 	.unique()
	// 	.length
}

bench( 'part 2 example', () => part2( example ), 45 );

bench( 'part 2 input', () => part2( input ) );
