import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const particles = input
		.lines()
		.map( line => line.match( /-?\d+/g )!.map( Number ) );

	console.log( 'Paste this in to https://www.desmos.com/calculator\n' );
	console.log( 't=0' );
	console.log(
		particles
			.map( ( [ x, y, dx, dy ] ) => `( ${dx}t + ${x} , ${-dy}t + ${-y} )` )
			.join( '\n' )
	);
}

bench( 'part 1 input', () => part1( input ) );
