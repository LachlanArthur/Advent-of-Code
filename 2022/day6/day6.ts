import { bench } from '../../bench.ts';
import '../../extensions.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string, size = 4 ): number {
	return input
		.split( '' )
		.sliding( size, 1, true )
		.map( ( chunk, index ) => new Set( chunk ).size === size ? index + size : null )
		.filter( Number )
	[ 0 ] as number
}

bench( 'part 1 example', () => part1( 'mjqjpqmgbljsphdztnvjfqwrcgsmlb' ), 7 );
bench( 'part 1 example', () => part1( 'bvwbjplbgvbhsrlpgdmjqwftvncz' ), 5 );
bench( 'part 1 example', () => part1( 'nppdvjthqldpwncqszvftbrmjlhg' ), 6 );
bench( 'part 1 example', () => part1( 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg' ), 10 );
bench( 'part 1 example', () => part1( 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw' ), 11 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ): number {
	return part1( input, 14 );
}

bench( 'part 2 example', () => part2( 'mjqjpqmgbljsphdztnvjfqwrcgsmlb' ), 19 );
bench( 'part 2 example', () => part2( 'bvwbjplbgvbhsrlpgdmjqwftvncz' ), 23 );
bench( 'part 2 example', () => part2( 'nppdvjthqldpwncqszvftbrmjlhg' ), 23 );
bench( 'part 2 example', () => part2( 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg' ), 29 );
bench( 'part 2 example', () => part2( 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw' ), 26 );

bench( 'part 2 input', () => part2( input ) );
