import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { pointsAroundSquare } from '../../grid.ts';

function simulate( input: string, minutes: number ) {
	let grid = input.linesAndChars();
	const height = grid.length;
	const width = grid[ 0 ].length;

	const stateTransitions = new Map<string, [ number, string ]>();

	for ( let m = 0; m < minutes; m++ ) {
		const gridString = flattenGrid( grid );
		let nextGrid: string[][] = [];

		if ( stateTransitions.has( gridString ) ) {
			const [ loopMinute, loopGrid ] = stateTransitions.get( gridString )!;
			const loopLength = m - loopMinute;
			const minutesRemaining = minutes - m;
			const loopsRemaining = Math.floor( minutesRemaining / loopLength );
			m += ( loopLength * loopsRemaining );
			stateTransitions.clear();
		}

		for ( let y = 0; y < height; y++ ) {
			nextGrid[ y ] = [];

			for ( let x = 0; x < width; x++ ) {

				const surround = Array.from( pointsAroundSquare( x, y, 1 ) )
					.map( ( [ x, y ] ) => grid[ y ]?.[ x ] as string | undefined )
					.countUnique();

				switch ( grid[ y ][ x ] ) {
					case '.':
						// Open
						if ( ( surround.get( '|' ) ?? 0 ) >= 3 ) {
							nextGrid[ y ][ x ] = '|';
						} else {
							nextGrid[ y ][ x ] = '.';
						}
						break;

					case '|':
						// Wooded
						if ( ( surround.get( '#' ) ?? 0 ) >= 3 ) {
							nextGrid[ y ][ x ] = '#';
						} else {
							nextGrid[ y ][ x ] = '|';
						}
						break;

					case '#':
						// Lumberyard
						if ( ( surround.get( '#' ) ?? 0 ) >= 1 && ( surround.get( '|' ) ?? 0 ) >= 1 ) {
							nextGrid[ y ][ x ] = '#';
						} else {
							nextGrid[ y ][ x ] = '.';
						}
						break;
				}
			}
		}

		stateTransitions.set( gridString, [ m, flattenGrid( nextGrid ) ] );

		grid = nextGrid;
	}

	const totals = grid.flat( 1 ).countUnique();

	return {
		open: totals.get( '.' ) ?? 0,
		wooded: totals.get( '|' ) ?? 0,
		lumberyard: totals.get( '#' ) ?? 0,
	};

	function flattenGrid( grid: string[][] ): string {
		return grid.map( row => row.join( '' ) ).join( '\n' );
	}
}

function part1( input: string ): number {
	const { wooded, lumberyard } = simulate( input, 10 );

	return wooded * lumberyard;
}

bench( 'part 1 example', () => part1( example ), 1147 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const { wooded, lumberyard } = simulate( input, 1000000000 );

	return wooded * lumberyard;
}

bench( 'part 2 input', () => part2( input ) );
