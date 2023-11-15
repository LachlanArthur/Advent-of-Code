import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ): number {
	return input
		.replace( /\+/, '' )
		.linesToNumbers()
		.sum();
}

bench( 'part 1 example', () => part1( example ), 3 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ): number {
	return input
		.replace( /\+/, '' )
		.linesToNumbers()
		.looping()
		.runningTotal()
		.firstRepeated()!;
}

bench( 'part 2 example', () => part2( example ), 2 );

bench( 'part 2 input', () => part2( input ) );
