import { } from '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	return input
		.lines()
		.log()
}

bench( 'part 1 example', () => part1( example ), undefined );

bench( 'part 1 input', () => part1( input ) );

// function part2( input: string ) {

// }

// bench( 'part 2 example', () => part2( example ), undefined );

// bench( 'part 2 input', () => part2( input ) );
