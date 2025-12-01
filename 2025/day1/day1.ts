import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import example2 from './example2.ts';
import input from './input.ts';

function part1( input: string, start: number ) {
	return input
		.lines()
		.map( line => parseInt( line.substring( 1 ) ) * ( line.startsWith( 'R' ) ? 1 : -1 ) )
		.reduce( ( carry, turn ) => {
			carry.current += turn;
			carry.current %= 100;

			if ( carry.current === 0 ) {
				carry.zero++;
			}

			return carry;
		}, { current: start, zero: 0 } )
		.zero
}

bench( 'part 1 example', () => part1( example, 50 ), 3 );

bench( 'part 1 input', () => part1( input, 50 ) );

function part2( input: string, start: number ) {
	return input
		.lines()
		.map( line => parseInt( line.substring( 1 ) ) * ( line.startsWith( 'R' ) ? 1 : -1 ) )
		.reduce( ( carry, turn ) => {
			let crossings = Math.floor( Math.abs( ( carry.current + turn ) / 100 ) );

			// If we end up negative (or zero), we crossed zero an additional time
			if ( carry.current !== 0 && carry.current + turn <= 0 ) {
				crossings++;
			}

			carry.current = ( ( ( carry.current + turn ) % 100 ) + 100 ) % 100;
			carry.zero += crossings;

			return carry;
		}, { current: start, zero: 0 } )
		.zero
}

bench( 'part 2 example', () => part2( example, 50 ), 6 );
bench( 'part 2 example 2', () => part2( example2, 50 ), 14 );

bench( 'part 2 input', () => part2( input, 50 ) );
