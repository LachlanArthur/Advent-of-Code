import { bench } from '../../bench.ts';
import '../../extensions.ts';

import example from './example.ts';
import input from './input.ts';

type Point = [ number, number ];
type Line = [ Point, Point ];

function parse( input: string ) {
	const lines = input
		.split( '\n' )
		.flatMap( line => line
			.split( ' -> ' )
			.map( coord => coord.split( ',' ).map( Number ) as Point )
			.chunks( 2, -1, false )
		) as Line[]

	const maxY = lines
		.flatMap( line => line.pluck( '1' ) )
		.max();

	return {
		lines,
		maxY,
	}
}

function fillLines( lines: Line[] ) {
	return new Set<string>(
		lines.flatMap( ( [ [ ax, ay ], [ bx, by ] ] ) => {
			const range: string[] = [];

			// Get into ascending order
			if ( ay > by ) [ ay, by ] = [ by, ay ]
			if ( ax > bx ) [ ax, bx ] = [ bx, ax ]

			for ( let y = ay; y <= by; y++ ) {
				for ( let x = ax; x <= bx; x++ ) {
					range.push( [ x, y ].join() );
				}
			}

			return range;
		} )
	)
}

function part1( input: string ) {
	const { lines, maxY } = parse( input );

	const filled = fillLines( lines );

	const dropGrain = function ( grain: Point ): boolean {
		while ( true ) {
			const [ x, y ] = grain;
			const candidates: Point[] = [
				[ x + 0, y + 1 ],
				[ x - 1, y + 1 ],
				[ x + 1, y + 1 ],
			];

			const open = candidates.filter( candidate => !filled.has( candidate.join() ) )[ 0 ];

			if ( open ) {
				if ( open[ 1 ] > maxY ) return false;

				grain = open;
				continue;
			}

			filled.add( grain.join() );

			return true;
		}
	}

	let grainCount = 0;

	while ( dropGrain( [ 500, 0 ] ) ) {
		grainCount++;
	};

	return grainCount;
}

bench( 'part 1 example', () => part1( example ), 24 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const { lines, maxY } = parse( input );

	lines.push( [ [ -10000, maxY + 2 ], [ 10000, maxY + 2 ] ] );

	const filled = fillLines( lines );

	const dropGrain = function ( grain: Point ): boolean {
		while ( true ) {
			const [ x, y ] = grain;
			const candidates: Point[] = [
				[ x + 0, y + 1 ],
				[ x - 1, y + 1 ],
				[ x + 1, y + 1 ],
			];

			const open = candidates.filter( candidate => !filled.has( candidate.join() ) )[ 0 ];

			if ( open ) {
				grain = open;
				continue;
			}

			if ( grain[ 0 ] === 500 && grain[ 1 ] === 0 ) {
				return false;
			}

			filled.add( grain.join() );

			return true;
		}
	}

	let grainCount = 0;

	while ( dropGrain( [ 500, 0 ] ) ) {
		grainCount++;
	};

	return grainCount + 1;
}

bench( 'part 2 example', () => part2( example ), 93 );

bench( 'part 2 input', () => part2( input ) );
