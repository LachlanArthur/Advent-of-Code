import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { intervalsPartiallyOverlap } from '../../interval.ts';

function parse( input: string ) {
	return input
		.lines()
		.map( line => {
			const [ x, y, w, h ] = line
				.match( /#\d+ @ (\d+),(\d+): (\d+)x(\d+)/ )!
				.slice( 1 )
				.map( Number );

			return [ x, y, x + w - 1, y + h - 1 ];
		} )
}

function part1( input: string ): number {
	const areas = parse( input );
	const maxX = areas.pluck( 2 ).max();
	const maxY = areas.pluck( 3 ).max();
	const fabric = Array.filled( maxY + 1, () => Array.filled( maxX + 1, 0 ) );

	for ( const [ x1, y1, x2, y2 ] of areas ) {
		for ( let x = x1; x <= x2; x++ ) {
			for ( let y = y1; y <= y2; y++ ) {
				fabric[ y ][ x ]++;
			}
		}
	}

	return fabric.flat( 2 ).filter( x => x > 1 ).length;
}

bench( 'part 1 example', () => part1( example ), 4 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ): number {
	const areas = parse( input );
	const overlaps = new Set<number>();

	for ( let i = 0; i < areas.length; i++ ) {
		for ( let j = i + 1; j < areas.length; j++ ) {
			if (
				intervalsPartiallyOverlap( [ areas[ i ][ 0 ], areas[ i ][ 2 ] ], [ areas[ j ][ 0 ], areas[ j ][ 2 ] ] ) &&
				intervalsPartiallyOverlap( [ areas[ i ][ 1 ], areas[ i ][ 3 ] ], [ areas[ j ][ 1 ], areas[ j ][ 3 ] ] )
			) {
				overlaps.add( i );
				overlaps.add( j );
			}
		}
	}

	for ( const i of areas.keys() ) {
		if ( !overlaps.has( i ) ) {
			return i + 1;
		}
	}

	throw new Error( 'not found' );
}

bench( 'part 2 example', () => part2( example ), 3 );

bench( 'part 2 input', () => part2( input ) );
