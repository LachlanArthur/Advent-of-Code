import { bench } from '../../bench.ts';
import '../../extensions.ts';
import { manhattan } from "../../grid.ts";
import { AStar, Vertex } from "../../pathfinder.ts";

import example from './example.ts';
import input from './input.ts';

type Point = [ number, number ];
type PointKey = string;

const toPointKey = ( point: Point ) => point.join() as PointKey;
const fromPointKey = ( key: PointKey ) => key.split( ',' ).map( Number ) as Point;

class BlizVertex implements Vertex {
	constructor(
		public x: number,
		public y: number,
		public minute: number,
		protected getEdges: () => Map<BlizVertex, number>,
	) { }

	get edges() {
		return this.getEdges();
	}

	is( other: BlizVertex ) {
		return this.x === other.x && this.y === other.y;
	}
}

class BlizPathfinder extends AStar<BlizVertex> {
	protected heuristic( a: BlizVertex, b: BlizVertex ): number {
		return manhattan( a.x, a.y, b.x, b.y );
	}
}

function parse( input: string ) {
	const blizUp = new Set<string>();
	const blizDown = new Set<string>();
	const blizLeft = new Set<string>();
	const blizRight = new Set<string>();

	const valleyRows = input.split( '\n' );

	let height = valleyRows.length - 2;
	let width!: number;

	for ( const [ y, row ] of valleyRows.slice( 1, -1 ).entries() ) {
		const chars = row.split( '' ).slice( 1, -1 );
		width ??= chars.length;

		for ( const [ x, char ] of chars.entries() ) {
			const key = toPointKey( [ x, y ] );
			switch ( char ) {
				case '^': blizUp.add( key ); break;
				case 'v': blizDown.add( key ); break;
				case '<': blizLeft.add( key ); break;
				case '>': blizRight.add( key ); break;
			}
		}
	}

	const startPoint: Point = [ valleyRows[ 0 ].indexOf( '.' ) - 1, -1 ];
	const endPoint: Point = [ valleyRows[ valleyRows.length - 1 ].indexOf( '.' ) - 1, valleyRows.length - 2 ];

	const vertices = new Map<string, BlizVertex>();

	const getVertex = ( x: number, y: number, minute: number ) => {
		const key = [ x, y, minute ].join();

		if ( !vertices.has( key ) ) {
			vertices.set( key, new BlizVertex( x, y, minute, edgeGetter( x, y, minute ) ) );
		}

		return vertices.get( key )!;
	}

	const blizAt = ( [ x, y ]: Point, minute: number ): boolean => {
		return [
			blizUp.has( toPointKey( [ x, ( y + minute ).mod( height ) ] ) ),
			blizDown.has( toPointKey( [ x, ( y - minute ).mod( height ) ] ) ),
			blizRight.has( toPointKey( [ ( x - minute ).mod( width ), y ] ) ),
			blizLeft.has( toPointKey( [ ( x + minute ).mod( width ), y ] ) ),
		].some( Boolean );
	}

	const edgeGetter = ( x: number, y: number, minute: number ) => () => {
		const surround = [
			// Up
			[ x, y - 1 ],
			// Down
			[ x, y + 1 ],
			// Left
			[ x - 1, y ],
			// Right
			[ x + 1, y ],
			// Stay
			[ x, y ],
		]
			.filter( ( [ x, y ] ) =>
				// Inside valley
				( 0 <= x && x < width && 0 <= y && y < height )
				// Or start point
				|| ( x === startPoint[ 0 ] && y === startPoint[ 1 ] )
				// Or end point
				|| ( x === endPoint[ 0 ] && y === endPoint[ 1 ] )
			);

		return new Map<BlizVertex, number>(
			surround
				.filter( ( [ x, y ] ) => !blizAt( [ x, y ], minute + 1 ) )
				.map( ( [ x, y ] ) => [ getVertex( x, y, minute + 1 ), 1 ] )
		)
	}

	const start = getVertex( ...startPoint, 0 );
	const end = getVertex( ...endPoint, -1 );

	return {
		start,
		end,
	}
}

function part1( input: string ): number {
	const { start, end } = parse( input );

	const pathfinder = new BlizPathfinder();
	const path = pathfinder.path( start, end );

	return path.pop()!.minute;
}

bench( 'part 1 example', () => part1( example ), 18 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ): number {
	const { start, end } = parse( input );

	const pathfinder = new BlizPathfinder();

	// There...
	const path1 = pathfinder.path( start, end );

	// Back...
	const path2 = pathfinder.path( path1.pop()!, start );

	// And again...
	const path3 = pathfinder.path( path2.pop()!, end );

	return path3.pop()!.minute;
}

bench( 'part 2 example', () => part2( example ), 54 );

bench( 'part 2 input', () => part2( input ) );
