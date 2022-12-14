import "./extensions";
import { Cell, Grid } from "./grid";

export interface Vertex {
	edges: Map<this, number>;
}

export class GridVertex<T> implements Vertex {
	edges = new Map<this, number>();

	constructor( public x: number, public y: number, public value: T ) { }
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
		const openSet = new Set<V>( [ start ] );
		const cameFrom = new Map<V, V>();
		const gScore = new Map<V, number>();
		const fScore = new Map<V, number>();

		gScore.set( start, 0 );
		fScore.set( start, this.heuristic( start, end ) );

		while ( openSet.size > 0 ) {
			const current = openSet.valuesArray()
				.sort( ( a, b ) => fScore.get( a )! - fScore.get( b )! )
				.shift()!;

			const currentGScore = gScore.get( current )!;

			if ( current === end ) {
				return this.reconstructPath( cameFrom, current );
			}

			openSet.delete( current );

			for ( const [ edgeVertex, edgeWeight ] of current.edges ) {
				const surroundGScore = gScore.get( edgeVertex ) ?? Infinity;
				const tentativeGScore = currentGScore + edgeWeight;

				if ( tentativeGScore < surroundGScore ) {
					cameFrom.set( edgeVertex, current );
					gScore.set( edgeVertex, tentativeGScore );
					fScore.set( edgeVertex, tentativeGScore + this.heuristic( edgeVertex, end ) );
					openSet.add( edgeVertex );
				}
			}
		}

		return [];
	}
}

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
	display( path: V[], filled = '█', blank = '░' ) {
		const grid: string[][] = [];

		for ( const { x, y } of path ) {
			( grid[ y ] ??= [] )[ x ] = filled;
		}

		const maxWidth = Math.max( ...grid.pluck( 'length' ) );

		console.log(
			grid
				.map( row => Array.filled( maxWidth, ( _, i ) => row[ i ] ?? blank ) )
				.map( row => row.join( '' ) )
				.join( '\n' )
		)
	}

	/**
	 * Create a new instance from a grid of cells
	 *
	 * @param grid
	 * @param createVertex - Create a vertex from a cell
	 * @param getEdgeValue - Get the value of an edge between two vertices. Return null to remove the edge.
	 */
	static fromGrid<T, V extends GridVertex<T>>(
		grid: Grid<T>,
		createVertex?: ( cell: Cell<T> ) => V,
		getEdgeValue?: ( source: V, destination: V ) => number | null,
	): AStarGrid<T, V> {
		const cells = grid.flatCells();
		const vertices: V[] = [];

		createVertex ??= cell => new GridVertex<T>( cell.x, cell.y, cell.value ) as V;
		getEdgeValue ??= () => 1;

		for ( const sourceCell of cells ) {
			const source = ( vertices[ sourceCell.index ] ??= createVertex( sourceCell ) );

			for ( const direction of [ 'up', 'down', 'left', 'right' ] ) {
				const destinationCell = sourceCell[ direction as 'up' | 'down' | 'left' | 'right' ];

				if ( destinationCell ) {
					const destination = ( vertices[ destinationCell.index ] ??= createVertex( destinationCell ) );
					const value = getEdgeValue( source, destination );

					if ( value !== null ) {
						source.edges.set( destination, value );
					}
				}
			}
		}

		return new this( vertices );
	}
}
