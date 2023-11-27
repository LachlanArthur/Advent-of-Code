import { } from '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Tuple, tuple } from '../../structures.ts';

import example from './example.ts';
import input from './input.ts';
import { AStar, Vertex } from '../../pathfinder.ts';
import { manhattan } from '../../grid.ts';

function up( xy: Tuple ): Tuple {
	return tuple( xy[ 0 ], xy[ 1 ] - 1 );
}

function down( xy: Tuple ): Tuple {
	return tuple( xy[ 0 ], xy[ 1 ] + 1 );
}

function left( xy: Tuple ): Tuple {
	return tuple( xy[ 0 ] - 1, xy[ 1 ] );
}

function right( xy: Tuple ): Tuple {
	return tuple( xy[ 0 ] + 1, xy[ 1 ] );
}

enum RegionType {
	Rocky = 0,
	Wet = 1,
	Narrow = 2,
}

class Geology {
	private geologicIndexCache = new Map<Tuple, number>();
	private erosionLevelCache = new Map<Tuple, number>();

	constructor(
		private depth: number,
		private target: Tuple,
	) { }

	geologicIndex( xy: Tuple ): number {
		if ( !this.geologicIndexCache.has( xy ) ) {
			let index: number;
			if ( xy[ 0 ] === 0 && xy[ 1 ] === 0 ) {
				index = 0;
			} else if ( xy === this.target ) {
				index = 0;
			} else if ( xy[ 1 ] === 0 ) {
				index = xy[ 0 ] * 16807;
			} else if ( xy[ 0 ] === 0 ) {
				index = xy[ 1 ] * 48271;
			} else {
				index = this.erosionLevel( up( xy ) ) * this.erosionLevel( left( xy ) );
			}
			this.geologicIndexCache.set( xy, index );
		}
		return this.geologicIndexCache.get( xy )!;
	}

	erosionLevel( xy: Tuple ): number {
		if ( !this.erosionLevelCache.has( xy ) ) {
			this.erosionLevelCache.set( xy, ( this.geologicIndex( xy ) + this.depth ) % 20183 );
		}

		return this.erosionLevelCache.get( xy )!;
	}

	type( xy: Tuple ): RegionType {
		return this.erosionLevel( xy ) % 3 as RegionType;
	}
}

function part1( input: string ) {
	const [ depth, targetX, targetY ] = input.match( /\d+/g )!.map( Number );

	const cave = new Geology( depth, tuple( targetX, targetY ) );

	let risk = 0;

	for ( let y = 0; y <= targetY; y++ ) {
		for ( let x = 0; x <= targetX; x++ ) {
			risk += cave.type( tuple( x, y ) );
		}
	}

	return risk;
}

bench( 'part 1 example', () => part1( example ), 114 );

bench( 'part 1 input', () => part1( input ) );

enum Gear {
	Neither,
	Torch,
	ClimbingGear,
}

function canUseGearInRegionType( gear: Gear, regionType: RegionType ): boolean {
	return (
		( regionType === RegionType.Rocky && gear !== Gear.Neither ) ||
		( regionType === RegionType.Wet && gear !== Gear.Torch ) ||
		( regionType === RegionType.Narrow && gear !== Gear.ClimbingGear )
	);
}

class RegionGear implements Vertex {
	traversible = true;
	constructor(
		public xy: Tuple,
		public type: RegionType,
		public gear: Gear,
		private grid: Map<Tuple, RegionGear[]>,
	) { }
	is( other: RegionGear ): boolean {
		return this.xy === other.xy && this.gear === other.gear;
	}
	private edgeCache: Map<RegionGear, number> | undefined;
	get edges(): Map<RegionGear, number> {
		if ( !this.edgeCache ) {
			this.edgeCache = new Map();

			for ( const direction of [ up( this.xy ), right( this.xy ), down( this.xy ), left( this.xy ) ] ) {
				// Move to another space with the same gear
				const move = this.grid.get( direction );
				if ( !move ) continue;
				for ( const other of move ) {
					if ( this.gear === other.gear ) {
						this.edgeCache.set( other, 1 );
					}
				}

				// Stay in the same space, but change gear
				const change = this.grid.get( this.xy )!;
				for ( const other of change ) {
					if ( this === other ) continue;
					this.edgeCache.set( other, 7 );
				}
			}
		}
		return this.edgeCache;
	}
}

class Pathfinder extends AStar<RegionGear> {
	heuristic( a: RegionGear, b: RegionGear ): number {
		return manhattan( a.xy[ 0 ], a.xy[ 1 ], b.xy[ 0 ], b.xy[ 1 ] );
	}
}

function part2( input: string ) {
	const [ depth, targetX, targetY ] = input.match( /\d+/g )!.map( Number );

	const extend = 12; // Check paths this far beyond the target
	const start = tuple( 0, 0 );
	const target = tuple( targetX, targetY );
	const cave = new Geology( depth, tuple( targetX, targetY ) );
	const grid = new Map<Tuple, RegionGear[]>();

	for ( let y = 0; y <= targetY + extend; y++ ) {
		for ( let x = 0; x <= targetX + extend; x++ ) {
			const xy = tuple( x, y );
			const type = cave.type( xy );

			if ( xy === start || xy === target ) {
				grid.push( xy, new RegionGear( xy, type, Gear.Torch, grid ) );
			} else {
				for ( let g: Gear = 0; g < 3; g++ ) {
					if ( canUseGearInRegionType( g, type ) ) {
						grid.push( xy, new RegionGear( xy, type, g, grid ) );
					}
				}
			}
		}
	}

	const pathfinder = new Pathfinder();
	const path = pathfinder.path(
		grid.get( start )![ 0 ],
		grid.get( target )![ 0 ],
	);

	if ( path.length === 0 ) {
		throw new Error( 'No path found, try extending the bounds' );
	}

	return path.sliding( 2 )
		.map( ( [ a, b ] ) => a.edges.get( b )! )
		.sum();
}

bench( 'part 2 example', () => part2( example ), 45 );

bench( 'part 2 input', () => part2( input ) );
