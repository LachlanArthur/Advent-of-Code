import { chunker, findSharedLetter, sum } from '../helpers';

import example from './example';
import input from './input';

type Pair = [ string, string ];

const halve = ( input: string ): Pair => [
	input.substring( 0, input.length / 2 ),
	input.substring( input.length / 2 ),
];

const letterValue = ( letter: string ): number | null => {
	const value = letter.charCodeAt( 0 );
	if ( value >= 97 && value <= 122 ) return value - 96;
	if ( value >= 65 && value <= 90 ) return value - 38;
	return null;
}

function part1( input: string ): number {
	return sum(
		input.split( '\n' )
			.map( halve )
			.map( findSharedLetter )
			.map( letterValue ) as number[]
	)
}

console.log( part1( example ) );

console.log( part1( input ) );

function part2( input: string ): number {
	return sum(
		input.split( '\n' )
			.reduce( chunker( 3 ), [] )
			.map( findSharedLetter )
			.map( letterValue ) as number[]
	)
}

console.log( part2( example ) );

console.log( part2( input ) );
