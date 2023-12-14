import '../../extensions.ts';
import { bench100 } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	input = input.trim() + '\n';

	const width = input.indexOf( '\n' ) + 1;
	const lastRow = input.length - width;
	const special = /[^\d\n.]/;

	let total = 0;

	for ( const result of input.matchAll( /\d+/gd ) ) {
		const [ start, end ] = result.indices![ 0 ];

		const min = start - +( ( start % width ) !== 0 );
		const max = end + +( ( start % width ) !== width );

		if (
			// Left and Right
			special.test( input.slice( min, max ) ) ||
			// Above
			( start > width && special.test( input.slice( min - width, max - width ) ) ) ||
			// Below
			( start < lastRow && special.test( input.slice( min + width, max + width ) ) )
		) {
			total += Number( result[ 0 ] );
		}
	}

	return total;
}

bench100( 'part 1 example', () => part1( example ), 4361 );

bench100( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	input = input.trim() + '\n';

	const width = input.indexOf( '\n' ) + 1;
	const lastRow = input.length - width;

	let total = 0;

	for ( const result of input.matchAll( /\*/gd ) ) {
		const [ start, end ] = result.indices![ 0 ];

		const min = Math.max( ( ( start / width ) << 0 ) * width, start - 3 );
		const max = Math.min( ( ( start / width ) << 0 ) * width + width - 1, end + 3 );

		const gears: number[] = [
			// Left and right
			...findNumbers( input.slice( min, max ), start - min ),
		];

		// Above
		if ( start > width ) {
			gears.push( ...findNumbers( input.slice( min - width, max - width ), ( start - width ) - ( min - width ) ) );
		}

		// Below
		if ( start < lastRow ) {
			gears.push( ...findNumbers( input.slice( min + width, max + width ), ( start + width ) - ( min + width ) ) );
		}

		if ( gears.length === 2 ) {
			total += gears[ 0 ] * gears[ 1 ];
		}
	}

	return total;

	function* findNumbers( string: string, position: number ): Generator<number, void, undefined> {
		for ( const result of string.matchAll( /\d+/gd ) ) {
			const [ start, end ] = result.indices![ 0 ];

			if ( ( start - 1 ) <= position && position <= end ) {
				yield Number( result[ 0 ] );
			}
		}
	}
}

bench100( 'part 2 example', () => part2( example ), 467835 );

bench100( 'part 2 input', () => part2( input ) );
