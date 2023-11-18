import '../../extensions.ts';
import { bench } from '../../bench.ts';

import examples from './examples.ts';
import input from './input.ts';

function parse( input: string ) {
	return input.match( /\b(\d+)\b/g )!.map( Number ) as [ number, number ];
}

function part1( playerCount: number, marbleCount: number ): number {
	const scores = new Map<number, number>();

	let circle = [ 0 ];

	playerCount < 10 && console.log( `[-]  (0)` );

	for (
		let nextMarble = 1,
		currentPlayer = 0,
		currentIndex = 0;
		nextMarble <= marbleCount;
		playerCount < 10 && console.log( `[${currentPlayer + 1}] ${circle.map( ( x, i ) => ( i === currentIndex ? `(${x})` : ` ${x} ` ).padStart( 4, ' ' ) ).join( '' )}` ),
		nextMarble++,
		currentPlayer = ( currentPlayer + 1 ) % playerCount
	) {
		if ( nextMarble % 23 === 0 ) {
			currentIndex = ( currentIndex - 7 + circle.length ) % circle.length;
			scores.increment( currentPlayer, nextMarble + circle.splice( currentIndex, 1 )[ 0 ] );
			continue;
		}

		let nextIndex = ( currentIndex + 2 + circle.length ) % circle.length;
		if ( nextIndex === 0 ) {
			nextIndex = circle.length;
		}

		circle.splice( nextIndex, 0, nextMarble );
		currentIndex = nextIndex;
	}

	return scores.valuesArray().max()!;
}

for ( const [ i, [ example, answer ] ] of examples.entries() ) {
	bench( `part 1 example ${i + 1}`, () => part1( ...parse( example ) ), answer );
}

bench( 'part 1 input', () => part1( ...parse( input ) ) );

// function part2( playerCount: number, marbleCount: number ): number {

// }

// bench( 'part 2 input', () => part2( ...parse( input ) ) );
