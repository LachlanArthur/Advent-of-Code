import { BinaryHeap } from "https://deno.land/std@0.209.0/data_structures/binary_heap.ts";
import { renderBrailleGrid } from "./debug.ts";
import "./extensions.ts";
import { Cell, Grid } from "./grid.ts";

export interface Vertex {
	edges: Map<Vertex, number>;
	traversible: boolean;

	is( other: Vertex ): boolean;
}

export class GridVertex<T> implements Vertex {
	edges = new Map<GridVertex<T>, number>();
	traversible = true;

	constructor( public x: number, public y: number, public value: T ) { }

	is( other: GridVertex<T> ) {
		return this === other;
	}
}

export interface Pathfinder<V extends Vertex> {
	path( start: V, end: V ): V[];
}

export abstract class AStar<V extends Vertex> implements Pathfinder<V> {
	protected abstract heuristic( a: V, b: V ): number;

	protected reconstructPath = ( cameFrom: Map<V, V>, current: V ): V[] => {
		const path: V[] = [ current ];

		while ( current = cameFrom.get( current )! ) {
			path.unshift( current );
		}

		return path;
	}

	path( start: V, end: V ): V[] {
		const openSet = new BinaryHeap<V>( ( a, b ) => fScore.get( a )! - fScore.get( b )! );
		const cameFrom = new Map<V, V>();
		const gScore = new Map<V, number>();
		const fScore = new Map<V, number>();

		openSet.push( start );
		gScore.set( start, 0 );
		fScore.set( start, this.heuristic( start, end ) );

		while ( openSet.length > 0 ) {
			const current = openSet.pop()!;

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
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export class AStarGrid<T extends any, V extends GridVertex<T>> extends AStar<V> {
	constructor( public vertices: V[] ) {
		super();
	}

	/**
	 * The best case distance estimate between two vertices
	 */
	protected heuristic( a: V, b: V ): number {
		return Math.abs( a.x - b.x ) + Math.abs( a.y - b.y );
	}

	/**
	 * Render the given path to the console
	 */
	display( path: V[] ) {
		renderBrailleGrid( Array.filledFromCoordinates( path.map( vertex => [ vertex.x, vertex.y ] ), () => true, () => false ) as boolean[][] );
	}

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

export function breadthFirstSearch<T extends Vertex>( start: T, end: T ) {
	const queue: T[] = [ start ];
	const seen = new Set<T>( [ start ] );
	const parents = new Map<T, T>();

	const reconstruct = () => {
		let current = end;
		const path: T[] = [ current ];

		while ( current = parents.get( current )! ) {
			path.unshift( current );
		}

		return path;
	}

	while ( queue.length > 0 ) {
		const next = queue.pop()!;

		if ( next.is( end ) ) {
			return reconstruct();
		}

		for ( const [ edge, value ] of next.edges as Map<T, number> ) {
			if ( !edge.traversible ) continue;
			if ( seen.has( edge ) ) continue;
			seen.add( edge );
			parents.set( edge, next );
			queue.unshift( edge );
		}
	}

	return []
}
