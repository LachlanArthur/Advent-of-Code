import * as fs from "https://deno.land/std@0.209.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.209.0/path/mod.ts";
import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { BinaryHeap } from "https://deno.land/std@0.209.0/data_structures/binary_heap.ts";
import FIFO from "https://deno.land/x/fifo@v0.2.2/mod.ts";

import "./extensions.ts";
import { renderBrailleGrid } from "./debug.ts";
import { Cell, Grid, manhattanFlat } from "./grid.ts";
import { inferno } from "./colourmaps.ts";
import { range } from "./maths.ts";

export interface Vertex {
	edges: Map<Vertex, number>;
	traversible: boolean;

	is( other: Vertex ): boolean;
}

export interface Pathfinder<V extends Vertex> {
	path( start: V, end: V ): V[];
}

export abstract class AStar<V extends Vertex> implements Pathfinder<V> {
	protected abstract heuristic( a: V, b: V ): number;

	protected reconstructPath( cameFrom: Map<V, V>, current: V ): V[] {
		const path: V[] = [ current ];

		while ( current = cameFrom.get( current )! ) {
			path.unshift( current );
		}

		return path;
	}

	*pathSteps( start: V, end: V ) {
		const openSet = new BinaryHeap<V>( ( a, b ) => fScore.get( a )! - fScore.get( b )! );
		const cameFrom = new Map<V, V>();
		const gScore = new Map<V, number>();
		const fScore = new Map<V, number>();

		openSet.push( start );
		gScore.set( start, 0 );
		fScore.set( start, this.heuristic( start, end ) );

		while ( !openSet.isEmpty() ) {
			const current = openSet.pop()!;

			yield {
				current,
				openSet: openSet.toArray(),
				cameFrom,
				gScore,
				fScore,
			};

			const currentGScore = gScore.get( current )!;

			if ( current.is( end ) ) {
				return this.reconstructPath( cameFrom, current );
			}

			for ( const [ edgeVertex, edgeWeight ] of current.edges as Map<V, number> ) {
				if ( !edgeVertex.traversible ) continue;

				const surroundGScore = gScore.get( edgeVertex ) ?? Infinity;
				const tentativeGScore = currentGScore + edgeWeight;

				if ( tentativeGScore < surroundGScore ) {
					cameFrom.set( edgeVertex, current );
					gScore.set( edgeVertex, tentativeGScore );
					fScore.set( edgeVertex, tentativeGScore + this.heuristic( edgeVertex, end ) );
					openSet.push( edgeVertex );
				}
			}
		}

		return [];
	}

	path( start: V, end: V ): V[] {
		const steps = this.pathSteps( start, end );
		let result;
		while ( !( result = steps.next() ).done ) { }
		return result.value;
	}

	pathAnimation(
		start: V,
		end: V,
		folder: string,
		width: number,
		height: number,
		getXY: ( v: V ) => [ number, number ],
		fps = 30,
	): V[] {
		const folderPath = path.resolve( folder );
		const canvas = createCanvas( width, height );
		const ctx = canvas.getContext( '2d' );

		let frameNumber = 1;
		const previousFrames: [ number, number ][][] = [];
		// Keep two seconds worth of points
		const fadeFrames = fps * 2;
		const drawFrame = ( newPoints: [ number, number ][] ) => {
			ctx.save();

			ctx.fillStyle = 'black';
			ctx.fillRect( 0, 0, width, height );

			previousFrames.unshift( newPoints );
			if ( previousFrames.length > fadeFrames ) {
				previousFrames.pop();
			}

			for ( const [ index, points ] of previousFrames.entriesArray().reverse() ) {
				const strength = ( fadeFrames - index ) / fadeFrames;
				ctx.fillStyle = inferno( strength );
				for ( const [ x, y ] of points ) {
					ctx.fillRect( x, y, 1, 1 );
				}
			}

			Deno.writeFileSync( `${folderPath}/image-${frameNumber.toString().padStart( 10, '0' )}.png`, canvas.toBuffer() );
			frameNumber++;

			ctx.restore();
		}

		fs.emptyDirSync( folderPath );

		const frameFrequency = 1000;
		const steps = this.pathSteps( start, end );
		let iteration = 1;
		let result;
		while ( !( result = steps.next() ).done ) {
			const { current, openSet, cameFrom } = result.value;

			if ( iteration % frameFrequency === 0 ) {
				drawFrame( openSet.map( getXY ) );
			}

			iteration++;
		}

		// show the final path for two seconds
		for ( let i = 0; i < fps * 2; i++ ) {
			drawFrame(
				result.value
					.sliding( 2 )
					.flatMap( ( [ a, b ] ) => {
						const points: [ number, number ][] = [];

						const [ ax, ay ] = getXY( a );
						const [ bx, by ] = getXY( b );

						for ( const [ x, y ] of lineBetween( ax, ay, bx, by ) ) {
							points.push( [ x, y ] );
						}

						return points;
					} )
			);
		}

		// fade out for two seconds
		for ( let i = 0; i < fps * 2; i++ ) {
			drawFrame( [] );
		}

		const ffmpegCommand = new Deno.Command( 'ffmpeg', {
			args: [
				'-y',
				'-framerate', `${fps}`,
				'-pattern_type', 'sequence',
				'-i', `${folderPath}/image-%10d.png`,
				'-vf', "scale=w='max(1000,iw)':h='max(1000,ih)':flags=neighbor:force_original_aspect_ratio=increase:force_divisible_by=2",
				'-c:v', 'libx265',
				'-pix_fmt', 'p010le',
				`${folderPath}.mp4`,
			],
		} );

		ffmpegCommand.spawn().ref();

		return result.value;
	}
}

export interface Vertex2d extends Vertex {
	x: number;
	y: number;
}

export class AStarManhattan<V extends Vertex2d> extends AStar<V> {
	constructor( public vertices: V[] ) {
		super();
	}

	protected heuristic( a: V, b: V ): number {
		return manhattanFlat( a.x, a.y, b.x, b.y );
	}

	getVertex( x: number, y: number ): V | undefined {
		return this.vertices.find( v => v.x === x && v.y === y );
	}

	/**
	 * Render the given path to the console
	 */
	display( path: V[], lineBetweenPoints = true ) {
		renderBrailleGrid(
			Array.filledFromCoordinates(
				lineBetweenPoints
					? path.sliding( 2 ).flatMap( ( [ a, b ] ) => lineBetween( a.x, a.y, b.x, b.y ) )
					: path.map( p => [ p.x, p.y ] ),
				() => true,
				() => false,
			) as boolean[][]
		);
	}
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export function turn90Clockwise( direction: Direction ): Direction {
	return ( {
		up: 'right',
		down: 'left',
		left: 'up',
		right: 'down',
	} as Record<Direction, Direction> )[ direction ];
}

export function turn90Anticlockwise( direction: Direction ): Direction {
	return ( {
		up: 'left',
		down: 'right',
		left: 'down',
		right: 'up',
	} as Record<Direction, Direction> )[ direction ];
}

export function forwards( x: number, y: number, direction: Direction ): { x: number, y: number } {
	switch ( direction ) {
		case "up":
			return { x: x, y: y - 1 };
		case "down":
			return { x: x, y: y + 1 };
		case "left":
			return { x: x - 1, y: y };
		case "right":
			return { x: x + 1, y: y };
	}
}

export class GridVertex<T> implements Vertex2d {
	edges = new Map<GridVertex<T>, number>();
	traversible = true;

	constructor( public x: number, public y: number, public value: T ) { }

	is( other: GridVertex<T> ) {
		return this === other;
	}
}

export class AStarGrid<T, V extends GridVertex<T>> extends AStarManhattan<V> {
	/**
	 * Create a new instance from a grid of cells
	 *
	 * @param grid
	 * @param createVertex - Create a vertex from a cell
	 * @param getEdgeValue - Get the value of an edge between two vertices. Return null to remove the edge.
	 */
	static fromGrid<T, V extends GridVertex<T>>(
		grid: Grid<T, Cell<T>>,
		createVertex?: ( cell: Cell<T> ) => V,
		getEdgeValue?: ( source: V, destination: V, direction: Direction ) => number | null,
	): AStarGrid<T, V> {
		const cells = grid.flatCells();
		const vertices: V[] = [];

		createVertex ??= cell => new GridVertex<T>( cell.x, cell.y, cell.value ) as V;
		getEdgeValue ??= () => 1;

		const directions: Direction[] = [ 'up', 'down', 'left', 'right' ];

		for ( const sourceCell of cells ) {
			const source = ( vertices[ sourceCell.index ] ??= createVertex( sourceCell ) );

			for ( const direction of directions ) {
				const destinationCell = sourceCell[ direction ];

				if ( destinationCell ) {
					const destination = ( vertices[ destinationCell.index ] ??= createVertex( destinationCell ) );
					const value = getEdgeValue( source, destination, direction );

					if ( value !== null ) {
						source.edges.set( destination, value );
					}
				}
			}
		}

		return new this( vertices );
	}
}

// TODO: use binary heap
export function dijkstra<T extends Vertex>( all: T[], start: T, end: T ): T[] {
	const dist = new Map<T, number>( all.map( ( v ) => [ v, Infinity ] ) );
	const prev = new Map<T, T>();
	const open = new Set<T>( all );
	const shortestOpen = (): T => dist
		.entriesArray()
		.filter( ( [ v ] ) => open.has( v ) )
		.sortByNumberAsc( '1' )[ 0 ][ 0 ];

	dist.set( start, 0 );

	const reconstruct = () => {
		let current = end;
		const path: T[] = [ current ];

		while ( current = prev.get( current )! ) {
			path.unshift( current );
		}

		return path;
	}

	while ( open.size > 0 ) {
		const next = shortestOpen();
		open.delete( next );

		if ( next.is( end ) ) {
			return reconstruct();
		}

		const distU = dist.get( next )!;

		for ( const [ edge, value ] of next.edges as Map<T, number> ) {
			if ( !edge.traversible ) continue;
			if ( !open.has( edge ) ) continue;

			const alt = distU + value;

			if ( alt < dist.get( edge )! ) {
				dist.set( edge, alt );
				prev.set( edge, next );
			}
		}
	}

	return []
}

export function* breadthFirstWalk<V extends Vertex>( start: V, exclude: V[] = [] ): Generator<[ V, V ]> {
	const queue = new FIFO<V>();
	const seen = new Set<V>( [ start, ...exclude ] );

	queue.push( start );

	while ( queue.length > 0 ) {
		const next = queue.shift()!;

		for ( const [ edge ] of next.edges as Map<V, number> ) {
			if ( seen.has( edge ) || !edge.traversible ) continue;

			yield [ next, edge ];

			seen.add( edge );
			queue.push( edge );
		}
	}

	return []
}

export function breadthFirstSearch<V extends Vertex>( start: V, end: V, exclude: V[] = [] ) {
	const parents = new Map<V, V>();

	const reconstruct = () => {
		let current = end;
		const path: V[] = [ current ];

		while ( current = parents.get( current )! ) {
			path.unshift( current );
		}

		return path;
	}

	for ( const [ parent, next ] of breadthFirstWalk( start, exclude ) ) {
		parents.set( next, parent );

		if ( next.is( end ) ) {
			return reconstruct();
		}
	}

	return []
}

export function* depthFirstWalk<V extends Vertex>( start: V, exclude: V[] = [] ): Generator<[ V, V ]> {
	const iteratorStack: [ V, Iterator<V> ][] = [
		[ start, ( start.edges as Map<V, number> ).keys() ],
	];
	const seen = new Set<V>( [ start, ...exclude ] );

	while ( iteratorStack.length > 0 ) {
		const [ current, edgeIterator ] = iteratorStack.at( -1 )!;

		let result: IteratorResult<V>;
		if ( !( result = edgeIterator.next() ).done ) {
			const next = result.value;

			if ( seen.has( next ) || !next.traversible ) continue;

			yield [ current, next ];

			seen.add( next );
			iteratorStack.push( [ next, ( next.edges as Map<V, number> ).keys() ] );
		} else {
			iteratorStack.pop();
		}
	}
}

export function depthFirstSearch<V extends Vertex>( start: V, end: V, exclude: V[] = [] ): V[] {
	const parents = new Map<V, V>();

	const reconstruct = () => {
		let current = end;
		const path: V[] = [ current ];

		while ( current = parents.get( current )! ) {
			path.unshift( current );
		}

		return path;
	}

	for ( const [ parent, next ] of depthFirstWalk( start, exclude ) ) {
		parents.set( next, parent );

		if ( next.is( end ) ) {
			return reconstruct();
		}
	}

	return [];
}

export function breadthFirstSearchEdges<T>( edges: [ T, T ][], start: T, end: T ): T[] {
	const edgeMap = new Map<T, T[]>();
	const queue = new FIFO<T>();
	const seen = new Set<T>( [ start ] );
	const parents = new Map<T, T>();

	for ( const [ a, b ] of edges ) {
		edgeMap.push( a, b );
	}

	queue.push( start );

	const reconstruct = () => {
		let current = end;
		const path: T[] = [ current ];

		while ( current = parents.get( current )! ) {
			path.unshift( current );
		}

		return path;
	}

	while ( queue.length > 0 ) {
		const current = queue.shift()!;

		for ( const edge of edgeMap.get( current ) ?? [] ) {
			if ( seen.has( edge ) ) continue;
			parents.set( edge, current );

			if ( edge === end ) {
				return reconstruct();
			}

			seen.add( edge );
			queue.push( edge );
		}
	}

	return []
}

export function lineBetween( ax: number, ay: number, bx: number, by: number ): [ number, number ][] {
	const points: [ number, number ][] = [];

	const xRange = ax - bx;
	const yRange = ay - by;

	if ( Math.abs( xRange ) > Math.abs( yRange ) ) {
		for ( const x of range( bx, ax ) ) {
			const y = Math.floor( ( x - bx ) / xRange * yRange + by );

			points.push( [ x, y ] );
		}
	} else {
		for ( const y of range( by, ay ) ) {
			const x = Math.floor( ( y - by ) / yRange * xRange + bx );

			points.push( [ x, y ] );
		}
	}

	return points;
}

export function bellmanFord<V extends Vertex>( vertices: V[], start: V ) {
	const distance = new Map<V, number>( vertices.map( v => [ v, Infinity ] ) );
	const predecessor = new Map<V, V | null>( vertices.map( v => [ v, null ] ) );
	const edges: [ V, V, number ][] = [];

	for ( const vertex of vertices ) {
		for ( const [ edge, weight ] of vertex.edges as Map<V, number> ) {
			edges.push( [ vertex, edge, weight ] );
		}
	}

	distance.set( start, 0 );

	for ( let i = 0; i < vertices.length - 1; i++ ) {
		for ( const [ u, v, weight ] of edges ) {
			if ( distance.get( u )! + weight < distance.get( v )! ) {
				distance.set( v, distance.get( u )! + weight );
				predecessor.set( v, u );
			}
		}
	}

	for ( let [ u, v, weight ] of edges ) {
		if ( distance.get( u )! + weight < distance.get( v )! ) {
			predecessor.set( v, u );

			const visited = new Set<V>( [ v ] );
			while ( !visited.has( u ) ) {
				visited.add( u );
				u = predecessor.get( u )!;
			}

			const negativeCycle = [ u ];
			v = predecessor.get( u )!;

			while ( v !== u ) {
				negativeCycle.push( v );
				v = predecessor.get( v )!;
			}

			console.error( negativeCycle );
			throw new Error( 'Negative cycle found' );
		}
	}

	return {
		distance,
		predecessor,
	}
}


export type SimplifyGraphOptions = {
	pruneDeadEnds: boolean,
	pruneNonTraversible: boolean,
};

export function simplifyGraph<V extends Vertex>(
	vertices: V[],
	keep: V[] = [],
	options: SimplifyGraphOptions = {
		pruneDeadEnds: true,
		pruneNonTraversible: true
	},
) {
	const incomingEdges = new Map<V, V[]>();

	for ( const v of vertices ) {
		for ( const [ e ] of v.edges ) {
			incomingEdges.push( e, v );
		}
	}

	let toRemove: number[] = [];
	let resimplify = true;
	while ( resimplify ) {
		resimplify = false;

		for ( const [ i, vertex ] of vertices.entries() ) {
			if ( keep.includes( vertex ) ) continue;

			if ( options.pruneNonTraversible && !vertex.traversible ) {
				for ( const incoming of incomingEdges.get( vertex ) ?? [] ) {
					incoming.edges.delete( vertex );
				}
				toRemove.push( i );
				resimplify = true;
				continue;
			}

			switch ( vertex.edges.size ) {
				case 0:
				case 1: {
					if ( options.pruneDeadEnds ) {
						const incoming = incomingEdges.get( vertex ) ?? [];

						if ( incoming.length === 0 ) {
							toRemove.push( i );
							break;
						}

						if (
							incoming.length === 1 &&
							vertex.edges.has( incoming[ 0 ] )
						) {
							incoming[ 0 ].edges.delete( vertex );
							toRemove.push( i );
							resimplify = true;
							break;
						}
					}

					break;
				}

				case 2: {
					const [ [ a, weightToA ], [ b, weightToB ] ] = vertex.edges as Map<V, number>;

					if ( a.edges.has( vertex ) && b.edges.has( vertex ) ) {
						const weightFromA = a.edges.get( vertex )!;
						const weightFromB = b.edges.get( vertex )!;

						a.edges.delete( vertex );
						b.edges.delete( vertex );

						a.edges.set( b, weightFromA + weightToB );
						b.edges.set( a, weightFromB + weightToA );

						toRemove.push( i );
						resimplify = true;
					}
					break;
				}

			}
		}

		for ( const i of toRemove.sortByNumberDesc() ) {
			vertices.splice( i, 1 );
		}

		toRemove = [];
	}
}

export type Path<V extends Vertex> = {
	vertices: V[],
	/**
	 * The sum of all edge weights on the path
	 */
	edgeTotal: number,
}

/**
 * Generates every possible self-avoiding walk of a graph
 */
export function* allPaths<V extends Vertex>( start: V, end: V ): Generator<Path<V>> {
	const openPaths: Path<V>[] = [ {
		vertices: [ start ],
		edgeTotal: pathLength( [ start ] ),
	} ];

	const endEdges = end.edges.keysArray() as V[];

	while ( openPaths.length > 0 ) {
		const { vertices: path } = openPaths.pop()!;
		const last = path.at( -1 )!;

		let next = last.edges.keysArray().without( ...path ) as V[];

		const availableEndEdges = endEdges.without( ...path );
		if ( availableEndEdges.length === 1 && availableEndEdges[ 0 ].is( last ) ) {
			// This node is connected to the end, which has no other open edges.
			// The current path must end here, all further paths are impossible.
			next = [ end ];
		}

		for ( const edge of next ) {
			const nextPathVertices = [ ...path, edge ];
			const nextPath: Path<V> = {
				vertices: nextPathVertices,
				edgeTotal: pathLength( nextPathVertices ),
			}

			if ( edge.is( end ) ) {
				yield nextPath;
			} else {
				// Verify that the next path can still get to the end
				if ( breadthFirstWalk( edge, path ).find( ( [ , v ] ) => v.is( end ) ) ) {
					openPaths.push( nextPath );
				}
			}
		}
	}
}

/**
 * Generate paths that walk over every vertex in the graph
 */
export function* hamiltonianPaths<V extends Vertex>( totalVertices: number, start: V, end: V ): Generator<Path<V>> {
	for ( const path of allPaths( start, end ) ) {
		if ( path.vertices.length === totalVertices ) {
			yield path;
		}
	}
}

export function pathLength<V extends Vertex>( path: V[] ): number {
	let total = 0;

	for ( let i = 0; i < path.length - 1; i++ ) {
		total += path[ i ].edges.get( path[ i + 1 ] )!;
	}

	return total;
}

export function disableBacktracking<V extends Vertex>( start: V ) {
	const open = [ start ];

	while ( open.length > 0 ) {
		const vertex = open.pop()!;

		for ( const [ next ] of vertex.edges as Map<V, number> ) {
			next.edges.delete( vertex );
			open.push( next );
		}
	}
}

export function findClusters( vertices: Vertex[] ): Vertex[][] {
	const clusters: Vertex[][] = [];
	const openComponents = new Set( vertices );

	while ( openComponents.size > 0 ) {
		const next = openComponents.valuesArray().pop()!;

		openComponents.delete( next );

		const cluster: Vertex[] = [ next ];
		for ( const [ , edge ] of breadthFirstWalk( next ) ) {
			cluster.push( edge );
			openComponents.delete( edge );
		}

		clusters.push( cluster );
	}

	return clusters;
}

export function minimumCut<V extends Vertex>( vertices: V[], targetCuts = Infinity ): [ V, V ][] {
	let best: [ V, V ][] | undefined;

	for ( const [ a, b ] of vertices.combinationsLazy( 2 ) ) {
		const bottleneck = minimumCutBetween( a, b, best?.length ?? targetCuts );

		if ( !bottleneck ) continue;

		if ( !best || bottleneck.length < best.length ) {
			best = bottleneck;
		}

		if ( best.length <= targetCuts ) {
			return best;
		}
	}

	if ( !best ) {
		throw new Error( 'Failed to find cut' );
	}

	return best;
}

export function minimumCutBetween<V extends Vertex>( a: V, b: V, targetCuts = Infinity ): [ V, V ][] | false {
	if ( a.is( b ) ) {
		return [];
	}

	let edges = allEdgesFrom( a );
	const allVertices = new Set( edges.flat( 1 ) );

	let cutCount = 0;
	// Remove all the paths from a to b
	while ( true ) {
		const path = breadthFirstSearchEdges( edges, a, b );

		if ( path.length === 0 ) break;

		if ( cutCount > targetCuts ) return false;

		for ( const [ u, v ] of path.sliding( 2, 1, false ) ) {
			edges = edges.filter( edge => !edge.same( [ u, v ] ) && !edge.same( [ v, u ] ) );
			edges.push( [ v, u ] );
		}

		cutCount++;
	}

	const reachable = new Set<V>();
	const unreachable = new Set<V>();

	for ( const v of allVertices ) {
		if ( a !== v && breadthFirstSearchEdges( edges, a, v ).length === 0 ) {
			unreachable.add( v );
		} else {
			reachable.add( v );
		}
	}

	return edges.filter( ( [ a, b ] ) => (
		( reachable.has( a ) && unreachable.has( b ) ) ||
		( reachable.has( b ) && unreachable.has( a ) )
	) );
}

export function allEdgesFrom<V extends Vertex>( start: V ) {
	const edges: [ V, V ][] = ( start.edges as Map<V, number> ).keysArray()
		.filter( edge => edge.traversible )
		.map( edge => [ start, edge ] );

	for ( const [ , v ] of breadthFirstWalk( start ) ) {
		for ( const [ edge ] of v.edges as Map<V, number> ) {
			edges.push( [ v, edge ] );
		}
	}

	return edges;
}
