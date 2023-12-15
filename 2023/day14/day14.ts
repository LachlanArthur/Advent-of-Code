import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { CharGrid } from '../../grid.ts';
import { Direction } from '../../pathfinder.ts';
import { cycleSkipper } from '../../loops.ts';

import example from './example.ts';
import input from './input.ts';

function slide( grid: CharGrid, direction: Direction ) {
	switch ( direction ) {
		case 'up':
		case 'down':
			return grid.mapCols( col => {
				if ( direction === 'up' ) {
					return slideLeft( col );
				} else {
					return slideLeft( col.toReversed() ).toReversed();
				}
			} )
		case 'left':
		case 'right':
			return grid.mapRows( row => {
				if ( direction === 'left' ) {
					return slideLeft( row );
				} else {
					return slideLeft( row.toReversed() ).toReversed();
				}
			} );
	}
}

function slideLeft( chars: string[] ): string[] {
	const output = [ ...chars ];
	for ( const [ i, char ] of output.entries() ) {
		if ( char !== '.' ) continue;
		const nextCircle = output.indexOf( 'O', i );
		const nextSquare = output.indexOf( '#', i );
		if ( nextCircle === -1 ) continue
		if ( nextSquare === -1 || nextCircle < nextSquare ) {
			output[ i ] = 'O';
			output[ nextCircle ] = '.';
		}
	}
	return output;
}

function part1( input: string ) {
	let grid = new CharGrid( input );

	grid = slide( grid, 'up' );

	return grid.find( 'O' ).map( ( { y } ) => grid.height - y ).sum();
}

bench( 'part 1 example', () => part1( example ), 136 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const grid = cycleSkipper( {
		start: new CharGrid( input ),
		transition: grid => {
			grid = slide( grid, 'up' );
			grid = slide( grid, 'left' );
			grid = slide( grid, 'down' );
			grid = slide( grid, 'right' );
			return grid;
		},
		iterations: 1_000_000_000,
		identity: grid => grid.toString(),
	} );

	return grid.find( 'O' ).map( ( { y } ) => grid.height - y ).sum();
}

bench( 'part 2 example', () => part2( example ), 64 );

bench( 'part 2 input', () => part2( input ) );
