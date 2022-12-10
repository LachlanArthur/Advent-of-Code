import '../../extensions';

import example from './example';
import input from './input';

type Pair = [ string, string ];

export function findSharedLetter( words: string[] ): string {
	return words
		.map( word => word.split( '' ) )
		.intersectChunks()
		[ 0 ];
}

const halve = ( input: string ): Pair => [
	input.substring( 0, input.length / 2 ),
	input.substring( input.length / 2 ),
];

const letterValue = ( letter: string ): number => {
	const value = letter.charCodeAt( 0 );
	if ( value >= 97 && value <= 122 ) return value - 96;
	return value - 38;
}

function part1( input: string ): number {
	return input.split( '\n' )
		.map( halve )
		.map( findSharedLetter )
		.map( letterValue )
		.sum()
}

console.assert( part1( example ) === 157 );

console.log( part1( input ) );

function part2( input: string ): number {
	return input.split( '\n' )
		.chunks( 3 )
		.map( findSharedLetter )
		.map( letterValue )
		.sum()
}

console.assert( part2( example ) === 70 );

console.log( part2( input ) );
