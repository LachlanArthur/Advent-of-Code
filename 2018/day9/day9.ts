import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Deque } from '../../lib/deque.ts';

import examples from './examples.ts';
import input from './input.ts';

function parse( input: string ) {
	return input.match( /\b(\d+)\b/g )!.map( Number ) as [ number, number ];
}

function part1( playerCount: number, marbleCount: number ): number {
	const scores = Array.filled( playerCount, 0 );
	const circle = new Deque( [ 0 ] );

	for ( let marble = 1; marble <= marbleCount; marble++ ) {
		if ( marble % 23 === 0 ) {
			circle.rotate( -7 );
			scores[ marble % playerCount ] += marble + circle.pop();
		} else {
			circle.rotate( 2 );
			circle.push( marble );
		}
	}

	return scores.max();
}

for ( const [ i, [ example, answer ] ] of examples.entries() ) {
	bench( `part 1 example ${i + 1}`, () => part1( ...parse( example ) ), answer );
}

bench( 'part 1 input', () => part1( ...parse( input ) ) );

function part2( playerCount: number, marbleCount: number ): number {
	return part1( playerCount, marbleCount * 100 );
}

bench( 'part 2 input', () => part2( ...parse( input ) ) );
