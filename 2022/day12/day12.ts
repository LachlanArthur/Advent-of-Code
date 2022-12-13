import '../../extensions';

import example from './example';
import input from './input';

class Vertex {
	public edges = new Map<Vertex, number>();

	constructor(
		public x: number,
		public y: number,
		public height: number,
	) { }
}

function parse( input: string ) {
	let width: number;
	let height: number;
	let start: Vertex;
	let end: Vertex;

	const vertexList = input
		.split( '\n' )
		.tee( lines => height = lines.length )
		.flatMap( ( line, y ) => line
			.split( '' )
			.tee( chars => width = chars.length )
			.map( ( char, x ) => {
				const height = char.charCodeAt( 0 ) - 96;
				const vertex = new Vertex( x, y, height );
				if ( char === 'S' ) {
					vertex.height = 1;
					start = vertex;
				} else if ( char === 'E' ) {
					vertex.height = 26;
					end = vertex;
				}
				return vertex;
			} ) )

	const getIndex = ( x: number, y: number ) => width! * y + x;
	const canVisit = ( from: Vertex, to: Vertex ) => to.height - from.height < 2;

	for ( const vertex of vertexList ) {
		if ( vertex.y > 0 ) {
			const up = vertexList[ getIndex( vertex.x, vertex.y - 1 ) ];
			if ( canVisit( vertex, up ) ) vertex.edges.set( up, 1 );
		}

		if ( vertex.y < height! - 1 ) {
			const down = vertexList[ getIndex( vertex.x, vertex.y + 1 ) ];
			if ( canVisit( vertex, down ) ) vertex.edges.set( down, 1 );
		}

		if ( vertex.x > 0 ) {
			const left = vertexList[ getIndex( vertex.x - 1, vertex.y ) ];
			if ( canVisit( vertex, left ) ) vertex.edges.set( left, 1 );
		}

		if ( vertex.x < width! - 1 ) {
			const right = vertexList[ getIndex( vertex.x + 1, vertex.y ) ];
			if ( canVisit( vertex, right ) ) vertex.edges.set( right, 1 );
		}
	}

	return {
		start: start!,
		end: end!,
		width: width!,
		height: height!,
		vertexList,
	};
}

function minDistance( a: Vertex, b: Vertex ): number {
	return Math.abs( a.x - b.x ) + Math.abs( a.y - b.y );
}

function findPath( start: Vertex, end: Vertex ) {
	const reconstruct = ( cameFrom: Map<Vertex, Vertex>, current: Vertex ) => {
		const path: Vertex[] = [ current ];

		while ( current = cameFrom.get( current )! ) {
			path.unshift( current );
		}

		return path;
	}

	const path = ( () => {
		const openSet = new Set<Vertex>( [ start ] );
		const cameFrom = new Map<Vertex, Vertex>();
		const gScore = new Map<Vertex, number>();
		const fScore = new Map<Vertex, number>();

		gScore.set( start, 0 );
		fScore.set( start, minDistance( start, end ) );

		while ( openSet.size > 0 ) {
			const current = openSet.valuesArray()
				.sort( ( a, b ) => fScore.get( a )! - fScore.get( b )! )
				.shift()!;

			const currentGScore = gScore.get( current )!;

			if ( current === end ) {
				return reconstruct( cameFrom, current );
			}

			openSet.delete( current );

			for ( const [ surround, weight ] of current.edges ) {
				const surroundGScore = gScore.get( surround ) ?? Infinity;
				const tentativeGScore = currentGScore + weight;

				if ( tentativeGScore < surroundGScore ) {
					cameFrom.set( surround, current );
					gScore.set( surround, tentativeGScore );
					fScore.set( surround, tentativeGScore + minDistance( surround, end ) );
					openSet.add( surround );
				}
			}
		}

		return [];
	} )();

	return path;
}

function displayPath( coords: [ number, number ][], width: number, height: number ) {
	const points = new Set( coords.map( coord => coord.join( ',' ) ) );
	const grid: string[][] = [];

	console.log( points.size );

	for ( let y = 0; y < height; y++ ) {
		grid.push( [] );
		for ( let x = 0; x < width; x++ ) {
			grid[ y ][ x ] = points.has( `${x},${y}` ) ? '#' : ' ';
		}
	}

	console.log( grid.map( row => row.join( '' ) ).join( '\n' ) )
}

function part1( input: string ) {
	const { start, end, width, height } = parse( input );

	const path = findPath( start, end );

	// displayPath( path.map( vertex => [ vertex.x, vertex.y ] ), width, height );

	return path.length - 1;
}

console.assert( part1( example ) === 31 );

console.log( part1( input ) );

function part2( input: string ) {
	const { end, width, height, vertexList } = parse( input );

	const paths = vertexList.filter( vertex => vertex.height === 1 )
		.map( vertex => findPath( vertex, end ) )
		.filter( path => path.length > 0 )
		.sort( ( a, b ) => a.length - b.length );

	// displayPath( paths[ 0 ].map( vertex => [ vertex.x, vertex.y ] ), width, height );

	return paths.shift()!.length - 1;
}

console.assert( part2( example ) === 29 );

console.log( part2( input ) );
