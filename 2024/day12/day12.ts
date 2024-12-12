import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Cell, Grid } from '../../grid.ts';
import { AStarGrid, findClusters, GridVertex } from '../../pathfinder.ts';

import example1 from './example1.ts';
import example2 from './example2.ts';
import example3 from './example3.ts';
import example4 from './example4.ts';
import example5 from './example5.ts';
import input from './input.ts';

function part1( input: string ) {
	const grid = Grid.fromString<string, Cell<string>>( input );

	const verts = grid.vertices( {
		createVertex: cell => new GridVertex( cell.x, cell.y, cell.value ),
		getEdgeValue: ( source, dest, dir ) => source.value === dest.value ? 1 : null,
	} )

	return findClusters( verts )
		.map( cluster => {
			const area = cluster.length;
			const perimeter = cluster.length * 4 - cluster.map( cell => cell.edges.size ).sum()
			return area * perimeter;
		} )
		.sum()
}

bench( 'part 1 example 1', () => part1( example1 ), 140 );
bench( 'part 1 example 2', () => part1( example2 ), 772 );
bench( 'part 1 example 3', () => part1( example3 ), 1930 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const grid = Grid.fromString<string, Cell<string>>( input );

	const pathfinder = AStarGrid.fromGrid(
		grid,
		cell => new GridVertex( cell.x, cell.y, cell.value ),
		( source, dest ) => source.value === dest.value ? 1 : null,
	);

	return findClusters( pathfinder.vertices )
		.map( cluster => {
			const clusterSet = new Set( cluster );
			const area = cluster.length;

			const upEdges = new Map<number, number[]>();
			const leftEdges = new Map<number, number[]>();
			const downEdges = new Map<number, number[]>();
			const rightEdges = new Map<number, number[]>();

			for ( const vert of cluster ) {
				const cell = grid.getCell( vert.x, vert.y )!;

				if ( !cell.up || !clusterSet.has( pathfinder.getVertex( cell.up.x, cell.up.y )! ) ) {
					upEdges.push( cell.y, cell.x );
				}

				if ( !cell.down || !clusterSet.has( pathfinder.getVertex( cell.down.x, cell.down.y )! ) ) {
					downEdges.push( cell.y + 1, cell.x );
				}

				if ( !cell.left || !clusterSet.has( pathfinder.getVertex( cell.left.x, cell.left.y )! ) ) {
					leftEdges.push( cell.x, cell.y );
				}

				if ( !cell.right || !clusterSet.has( pathfinder.getVertex( cell.right.x, cell.right.y )! ) ) {
					rightEdges.push( cell.x + 1, cell.y );
				}
			}

			const allEdges = [
				...upEdges.valuesArray(),
				...leftEdges.valuesArray(),
				...downEdges.valuesArray(),
				...rightEdges.valuesArray(),
			];

			let count = 0;

			for ( const line of allEdges ) {
				count++;
				const sorted = line.sortByNumberAsc();

				for ( const [ point, next ] of sorted.sliding( 2 ) ) {
					if ( next - point > 1 ) {
						count++;
					}
				}
			}

			return area * count;
		} )
		.sum()
}

bench( 'part 2 example 1', () => part2( example1 ), 80 );
bench( 'part 2 example 2', () => part2( example2 ), 436 );
bench( 'part 2 example 3', () => part2( example3 ), 1206 );
bench( 'part 2 example 4', () => part2( example4 ), 236 );
bench( 'part 2 example 5', () => part2( example5 ), 368 );

bench( 'part 2 input', () => part2( input ) );
