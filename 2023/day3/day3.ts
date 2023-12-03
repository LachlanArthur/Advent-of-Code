import { } from '../../extensions.ts';
import { bench } from '../../bench.ts';
import { pointsAroundSquare } from '../../grid.ts';
import { tuple, Tuple } from '../../structures.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	let total = 0;

	const grid = input.lines().map( line => line.split( '' ) );
	for ( const [ y, row ] of grid.entries() ) {
		let firstX: number | undefined;
		let allFirstX: number[] = [];
		for ( const [ x, char ] of row.entries() ) {
			if ( /\d/.test( char ) ) {
				if ( firstX === undefined ) {
					firstX = x;
				}

				if ( Array.from( pointsAroundSquare( x, y, 1 ) ).some( ( [ x, y ] ) => {
					const surround = grid[ y ]?.[ x ];
					if ( typeof surround === 'undefined' ) return false;
					if ( surround === '.' ) return false;
					if ( isNaN( Number( surround ) ) ) return true; // I don't know what all the symbols are
					return false;
				} ) ) {
					allFirstX.push( firstX );
				}
			} else {
				firstX = undefined;
			}
		}

		for ( const firstX of allFirstX.unique() ) {
			total += Number( row.slice( firstX ).join( '' ).match( /\d+/ )![ 0 ] );
		}
	}

	return total;
}

bench( 'part 1 example', () => part1( example ), 4361 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	let total = 0;

	const gears = new Map<Tuple, Tuple[]>();

	const grid = input.lines().map( line => line.split( '' ) );
	for ( const [ y, row ] of grid.entries() ) {
		let firstX: number | undefined;
		for ( const [ x, char ] of row.entries() ) {
			if ( /\d/.test( char ) ) {
				if ( firstX === undefined ) {
					firstX = x;
				}

				for ( const [ surroundX, surroundY ] of pointsAroundSquare( x, y, 1 ) ) {
					const surround = grid[ surroundY ]?.[ surroundX ];
					if ( surround !== '*' ) continue;

					gears.push( tuple( surroundX, surroundY ), tuple( firstX, y ) );
				}
			} else {
				firstX = undefined;
			}
		}
	}

	for ( const numberCoords of gears.values() ) {
		const uniqueCoords = numberCoords.unique();
		if ( uniqueCoords.length === 2 ) {
			let gearRatio = 1;
			for ( const [ nX, nY ] of uniqueCoords ) {
				gearRatio *= Number( grid[ nY ].slice( nX ).join( '' ).match( /\d+/ )![ 0 ] );
			}
			total += gearRatio;
		}
	}

	return total;
}

bench( 'part 2 example', () => part2( example ), 467835 );

bench( 'part 2 input', () => part2( input ) );
