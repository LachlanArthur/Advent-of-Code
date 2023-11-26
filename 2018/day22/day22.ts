import { } from '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Tuple, tuple } from '../../structures.ts';

import example from './example.ts';
import input from './input.ts';

function up( xy: Tuple ): Tuple {
	return tuple( xy[ 0 ], xy[ 1 ] - 1 );
}

function left( xy: Tuple ): Tuple {
	return tuple( xy[ 0 ] - 1, xy[ 1 ] );
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

// function part2( input: string ) {

// }

// bench( 'part 2 example', () => part2( example ), undefined );

// bench( 'part 2 input', () => part2( input ) );
