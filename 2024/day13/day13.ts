import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string, offset = 0 ) {
	return input
		.split( '\n\n' )
		.map( str => {
			const [ ax, ay, bx, by, px_, py_ ] = str.match( /\d+/g )!.map( Number );

			const px = px_ + offset;
			const py = py_ + offset;

			const x = ( py * bx - px * by ) / ( -ax * by + ay * bx );
			const y = ( -ax * x + px ) / bx;

			if ( Math.round( x ) === x && Math.round( y ) === y ) {
				return 3 * x + y;
			}

			return 0;
		} )
		.sum()
}

bench( 'part 1 example', () => part1( example ), 480 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	return part1( input, 10000000000000 );
}

bench( 'part 2 input', () => part2( input ) );
