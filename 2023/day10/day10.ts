import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Grid } from '../../grid.ts';

import example from './example.ts';
import input from './input.ts';
import example2 from './example2.ts';
import { AStarGrid, Direction, GridVertex } from '../../pathfinder.ts';

class Pipe<T> extends GridVertex<T> {
	constructor( x: number, y: number, value: T ) {
		super( x, y, value );
		if ( value === '.' ) {
			this.traversible = false;
		}
	}
}

type CellValue = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';

function hasUp( cell: CellValue ): boolean {
	return [ '|', 'L', 'J', 'S' ].includes( cell );
}
function hasDown( cell: CellValue ): boolean {
	return [ '|', '7', 'F', 'S' ].includes( cell );
}
function hasLeft( cell: CellValue ): boolean {
	return [ '-', '7', 'J', 'S' ].includes( cell );
}
function hasRight( cell: CellValue ): boolean {
	return [ '-', 'L', 'F', 'S' ].includes( cell );
}
function connect( a: CellValue, b: CellValue, direction: Direction ): boolean {
	switch ( direction ) {
		case 'up': return hasUp( a ) && hasDown( b );
		case 'down': return hasDown( a ) && hasUp( b );
		case 'left': return hasLeft( a ) && hasRight( b );
		case 'right': return hasRight( a ) && hasLeft( b );
	}
}

function part1( input: string ) {
	const grid = Grid.fromString( input, ( c, x, y ) => c as CellValue );
	const pathfinder = AStarGrid.fromGrid(
		grid,
		cell => new Pipe( cell.x, cell.y, cell.value ),
		( source, destination, direction ) => connect( source.value, destination.value, direction ) ? 1 : null,
	);

	const start = pathfinder.vertices.find( v => v.value === 'S' )!;

	const loop = [ start, start.edges.keysArray()[ 0 ] ];

	do {
		const prev = loop.at( -2 )!;
		const current = loop.at( -1 )!;
		const edges = current.edges.keysArray();
		const next = edges.find( e => e !== prev );

		if ( !next ) {
			throw new Error( 'Break in loop' );
		}

		loop.push( next );
	} while ( loop.at( -1 ) !== start );

	loop.pop();

	return loop.length / 2;
}

bench( 'part 1 example', () => part1( example ), 4 );
bench( 'part 1 example', () => part1( example2 ), 8 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const grid = Grid.fromString( input, ( c, x, y ) => c as CellValue );
	const pathfinder = AStarGrid.fromGrid(
		grid,
		cell => new Pipe( cell.x, cell.y, cell.value ),
		( source, destination, direction ) => connect( source.value, destination.value, direction ) ? 1 : null,
	);

	const start = pathfinder.vertices.find( v => v.value === 'S' )!;

	const loop = [ start, start.edges.keysArray()[ 0 ] ];

	do {
		const prev = loop.at( -2 )!;
		const current = loop.at( -1 )!;
		const edges = current.edges.keysArray();
		const next = edges.find( e => e !== prev );

		if ( !next ) {
			throw new Error( 'Break in loop' );
		}

		loop.push( next );
	} while ( loop.at( -1 ) !== start );

	loop.pop();

	// Replace the start value
	const startUp = connect( 'S', grid.getCell( start.x, start.y - 1 )?.value ?? '.', 'up' );
	const startDown = connect( 'S', grid.getCell( start.x, start.y + 1 )?.value ?? '.', 'down' );
	const startLeft = connect( 'S', grid.getCell( start.x - 1, start.y )?.value ?? '.', 'left' );
	const startRight = connect( 'S', grid.getCell( start.x + 1, start.y )?.value ?? '.', 'right' );

	if ( startUp && startRight ) { start.value = 'L'; }
	else if ( startUp && startDown ) { start.value = '|'; }
	else if ( startUp && startLeft ) { start.value = 'J'; }
	else if ( startRight && startDown ) { start.value = 'F'; }
	else if ( startRight && startLeft ) { start.value = '-'; }
	else if ( startDown && startLeft ) { start.value = '7'; }
	else { throw new Error( 'Unknown start config' ); }

	const loopCoords = new Map( loop.map( ( { x, y, value } ) => [ `${x},${y}`, value ] ) );

	const [ xMin, xMax ] = loop.pluck( 'x' ).minMax();
	const [ yMin, yMax ] = loop.pluck( 'y' ).minMax();

	let enclosed = 0;
	for ( let y = yMin; y <= yMax; y++ ) {
		let inside = false;
		let edgeUpInside = false;
		for ( let x = xMin; x <= xMax; x++ ) {
			const curr = loopCoords.get( `${x},${y}` ) ?? '.';

			switch ( curr ) {
				case '-':
					// Unchanged
					break;
				case '|':
					// Crossed a wall
					inside = !inside;
					break;
				case '7':
					inside = edgeUpInside;
					break;
				case 'F':
					edgeUpInside = inside;
					break;
				case 'J':
					inside = !edgeUpInside;
					break;
				case 'L':
					edgeUpInside = !inside;
					break;
				case 'S':
					throw new Error( 'Start should be replaced' );
				case '.':
					if ( inside ) {
						enclosed++;
					}
					break;
			}
		}
	}

	return enclosed;
}

bench( 'part 2 example', () => part2( `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........` ), 4 );

bench( 'part 2 example', () => part2( `..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........` ), 4 );

bench( 'part 2 example', () => part2( `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...` ), 8 );

bench( 'part 2 input', () => part2( input ) );
