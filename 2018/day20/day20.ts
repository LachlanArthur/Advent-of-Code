import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Tuple, tuple } from '../../structures.ts';
import { manhattan, normaliseCoords } from '../../grid.ts';
import { AStar, Vertex } from '../../pathfinder.ts';
import { renderGridSpec } from '../../debug.ts';

import examples from './example.ts';
import input from './input.ts';

type Direction = 'N' | 'W' | 'E' | 'S';

class Room implements Record<Direction, Room | undefined>, Vertex {
	N: Room | undefined;
	W: Room | undefined;
	E: Room | undefined;
	S: Room | undefined;
	traversible = true;

	constructor( public readonly xy: Tuple ) { }

	get edges(): Map<Room, number> {
		const edges = new Map();
		this.N && edges.set( this.N, 1 );
		this.W && edges.set( this.W, 1 );
		this.E && edges.set( this.E, 1 );
		this.S && edges.set( this.S, 1 );
		return edges;
	}

	is( other: Room ): boolean {
		return this.xy === other.xy;
	}

	walk( callback: ( room: Room ) => void ) {
		const seen = new Set<Room>();
		const open: Room[] = [ this ];

		while ( open.length > 0 ) {
			const current = open.shift()!;
			seen.add( current );

			callback( current );

			for ( const [ edge ] of current.edges ) {
				if ( !seen.has( edge ) ) {
					open.push( edge );
				}
			}
		}
	}
}

function generateMap( regexChars: string[] ): Room {
	const rooms = new Map<Tuple, Room>();

	function recurse( start: Room, chars: string[] ): Room[] {
		const path: Room[] = [];
		let current = start;

		for ( let i = 0; i < chars.length; i++ ) {
			const c = chars[ i ];

			switch ( c ) {
				default:
					throw new Error( `Invalid character "${c}" at ${i}` );
				case 'N':
				case 'W':
				case 'E':
				case 'S': {
					let direction: Direction = c;
					let opposite: Direction = ( { N: 'S', W: 'E', E: 'W', S: 'N' } as Record<Direction, Direction> )[ direction ];
					let xy = tuple(
						current.xy[ 0 ] + ( { N: 0, W: -1, E: 1, S: 0 } as Record<Direction, number> )[ direction ],
						current.xy[ 1 ] + ( { N: -1, W: 0, E: 0, S: 1 } as Record<Direction, number> )[ direction ],
					);
					current[ direction ] = rooms.get( xy );
					if ( !current[ direction ] ) {
						current[ direction ] = new Room( xy );
						rooms.set( xy, current[ direction ]! );
					}
					current[ direction ]![ opposite ] = current;
					current = current[ direction ]!;
					path.push( current );
					break;
				}
				case '(': {
					// Consume the entire group
					let depth = 1;
					let groups: string[][] = [ [] ];
					while ( depth > 0 ) {
						const c = chars[ ++i ];

						if ( c === '|' && depth === 1 ) {
							groups.push( [] );
						}

						if ( depth > 1 || ( c !== '|' && c !== ')' ) ) {
							groups.at( -1 )!.push( c );
						}

						if ( c === '(' ) {
							depth++;
						} else if ( c === ')' ) {
							depth--;
						}
					}
					const groupPaths = groups.map( group => recurse( current, group ) );
					path.push( ...groupPaths.find( path => path.length > 0 )! );
					current = path.at( -1 )!;
					break;
				}
				case ')':
				case '|':
					console.error( chars );
					throw new Error( `Invalid group char "${c}" at ${i}` );
				case '^':
					// Ignore
					break;
				case '$':
					// Ignore
					break;
			}
		}

		return path;
	}

	const start = new Room( tuple( 0, 0 ) );
	recurse( start, regexChars );
	return start;
}

class Pathfinder extends AStar<Room> {
	protected heuristic( a: Room, b: Room ) {
		return manhattan( a.xy[ 0 ], a.xy[ 1 ], b.xy[ 0 ], b.xy[ 1 ] );
	}
}

function roomDistances( input: string ) {
	const start = generateMap( input.chars() );

	const rooms: Room[] = [];
	start.walk( room => rooms.push( room ) );

	const normalisedCoords = normaliseCoords( rooms.pluck( 'xy' ) as [ number, number ][] );
	const roomCoords = new Map<Tuple, Room>(
		rooms.map( ( room, i ) => {
			const [ x, y ] = normalisedCoords[ i ];
			return [ tuple( x * 2, y * 2 ), room ];
		} )
	);

	const [ maxX, maxY ] = roomCoords.keysArray().aggregateColumns( max );

	// console.log( 'Regex: %s', input );
	// console.log( '' );
	// renderGridSpec(
	// 	-1, maxX + 1, -1, maxY + 1,
	// 	( x, y ) => {
	// 		const room = roomCoords.get( tuple( x, y ) );

	// 		if ( room ) {
	// 			if ( room === start ) {
	// 				return 'X';
	// 			}
	// 			return ' ';
	// 		}

	// 		if ( x % 2 === 0 ) {
	// 			const N = roomCoords.get( tuple( x, y - 1 ) );
	// 			const S = roomCoords.get( tuple( x, y + 1 ) );
	// 			if ( N && S && N?.S === S ) {
	// 				return '-';
	// 			}
	// 			return '#';
	// 		}

	// 		if ( y % 2 === 0 ) {
	// 			const W = roomCoords.get( tuple( x - 1, y ) );
	// 			const E = roomCoords.get( tuple( x + 1, y ) );
	// 			if ( W && E && W?.E === E ) {
	// 				return '|';
	// 			}
	// 			return '#';
	// 		}

	// 		return '#';
	// 	}
	// )
	// console.log( '' );

	const distances: number[] = [];
	const pathfinder = new Pathfinder();

	for ( const room of rooms ) {
		if ( room === start ) continue;
		distances.push( pathfinder.path( start, room ).length - 1 ); // Path includes the start and end rooms
	}

	return distances;
}

function part1( input: string ) {
	return roomDistances( input ).max();
}

for ( const [ example, answer ] of examples ) {
	bench( 'part 1 example', () => part1( example ), answer );
}

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	return roomDistances( input ).filter( distance => distance >= 1000 ).length;
}

bench( 'part 2 input', () => part2( input ) );
