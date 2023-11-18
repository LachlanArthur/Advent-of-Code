import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const particles = input
		.lines()
		.map( line => line.match( /-?\d+/g )!.map( Number ) );

	return 'Paste this in to https://www.desmos.com/calculator\n' +
		'Zoom out until you can see all the points\n' +
		'drag them inwards until the message appears\n' +
		'\n' +
		particles
			.map( ( [ x, y, dx, dy ] ) => `( ${dx}t + ${x} , ${-dy}t + ${-y} )` )
			.join( '\n' ) +
		'\n' +
		't = 0\n';
}

bench( 'part 1 input', () => part1( input ) );
