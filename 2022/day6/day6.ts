import { chunker, chunks, findSharedLetter, sum } from '../helpers';

import example from './example';
import input from './input';

function part1( input: string, size = 4 ): number {
	return Array.from(
		chunks( input.split( '' ), size, - size + 1 )
	)
		.map( ( chunk, index ) => new Set( chunk ).size === size ? index + size : null )
		.filter( Number )
	[ 0 ] as number
}

console.assert( part1( 'mjqjpqmgbljsphdztnvjfqwrcgsmlb' ) === 7 );
console.assert( part1( 'bvwbjplbgvbhsrlpgdmjqwftvncz' ) === 5 );
console.assert( part1( 'nppdvjthqldpwncqszvftbrmjlhg' ) === 6 );
console.assert( part1( 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg' ) === 10 );
console.assert( part1( 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw' ) === 11 );

console.log( part1( input ) );

function part2( input: string ): number {
	return part1( input, 14 );
}

console.assert( part2( 'mjqjpqmgbljsphdztnvjfqwrcgsmlb' ) === 19 );
console.assert( part2( 'bvwbjplbgvbhsrlpgdmjqwftvncz' ) === 23 );
console.assert( part2( 'nppdvjthqldpwncqszvftbrmjlhg' ) === 23 );
console.assert( part2( 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg' ) === 29 );
console.assert( part2( 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw' ) === 26 );

console.log( part2( input ) );
