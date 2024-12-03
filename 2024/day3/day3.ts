import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import example2 from './example2.ts';
import input from './input.ts';

function part1( input: string ) {
	return Array.from( input.matchAll( /mul\((\d{1,3}),(\d{1,3})\)/g ) )
		.map( ( [ , a, b ] ) => +a * +b )
		.sum()
}

bench( 'part 1 example', () => part1( example ), 161 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	return Array.from( input.matchAll( /(?<instr>mul)\((?<a>\d{1,3}),(?<b>\d{1,3})\)|(?<instr>do)\(\)|(?<instr>don't)\(\)/g ) )
		.reduce( ( { sum, enabled }, { groups } ) => {
			switch ( groups!.instr ) {
				case 'mul':
					if ( enabled ) {
						sum += +groups!.a * +groups!.b;
					}
					break;

				case 'do':
					enabled = true;
					break;

				case "don't":
					enabled = false;
					break;
			}

			return { sum, enabled };
		}, { sum: 0, enabled: true } )
		.sum
}

bench( 'part 2 example', () => part2( example2 ), 48 );

bench( 'part 2 input', () => part2( input ) );
