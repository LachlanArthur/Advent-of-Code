import { } from '../../extensions.ts';
import { bench } from '../../bench.ts';
import { CharGrid } from '../../grid.ts';
import { Direction } from '../../pathfinder.ts';

import example from './example.ts';
import input from './input.ts';

function slide( grid: string[][], direction: Direction ) {
	const width = grid[ 0 ].length;
	const height = grid.length;

	switch ( direction ) {
		case 'up':
			for ( let x = 0; x < width; x++ ) {
				for ( const [ y, char ] of slideLeft( grid.pluck( x ) ).entries() ) {
					grid[ y ][ x ] = char;
				}
			}
			break;
		case 'down':
			for ( let x = 0; x < width; x++ ) {
				for ( const [ y, char ] of slideLeft( grid.pluck( x ).toReversed() ).toReversed().entries() ) {
					grid[ y ][ x ] = char;
				}
			}
			break;
		case 'left':
			for ( let y = 0; y < height; y++ ) {
				grid[ y ] = slideLeft( grid[ y ] );
			}
			break;
		case 'right':
			for ( let y = 0; y < height; y++ ) {
				grid[ y ] = slideLeft( grid[ y ].toReversed() ).toReversed();
			}
			break;
	}

	return grid;
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
	let grid = input.linesAndChars();

	grid = slide( grid, 'up' );

	const grid_ = new CharGrid( CharGrid.flatten( grid ) );
	return grid_.find( 'O' ).map( ( [ , y ] ) => grid_.height - y ).sum();
}

bench( 'part 1 example', () => part1( example ), 136 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	let grid = input.linesAndChars();
	const directions: Direction[] = [ 'up', 'left', 'down', 'right' ];

	const cache = new Map<string, number>();

	const spinCycles = 1_000_000_000;

	for ( let i = 0; i < spinCycles; i++ ) {
		const cacheKey = CharGrid.flatten( grid );
		if ( cache.has( cacheKey ) ) {
			const loopStart = cache.get( cacheKey )!;
			const loopSize = i - loopStart;
			const remainingLoops = Math.floor( ( spinCycles - i ) / loopSize );
			i += ( remainingLoops * loopSize );

			cache.clear();
		}

		cache.set( cacheKey, i );

		for ( const direction of directions ) {
			grid = slide( grid, direction );
		}
	}

	const grid_ = new CharGrid( CharGrid.flatten( grid ) );

	return grid_.find( 'O' ).map( ( [ , y ] ) => grid_.height - y ).sum();
}

bench( 'part 2 example', () => part2( example ), 64 );

bench( 'part 2 input', () => part2( input ) );
