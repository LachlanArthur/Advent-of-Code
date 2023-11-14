import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

const scores = {
	// Rock
	A: {
		// Rock
		X: 1 + 3,
		// Paper
		Y: 2 + 6,
		// Scissors
		Z: 3 + 0,
	},
	// Paper
	B: {
		// Rock
		X: 1 + 0,
		// Paper
		Y: 2 + 3,
		// Scissors
		Z: 3 + 6,
	},
	// Scissors
	C: {
		// Rock
		X: 1 + 6,
		// Paper
		Y: 2 + 0,
		// Scissors
		Z: 3 + 3,
	},
}

const part1 = ( input: string ) =>
	input.split( '\n' )
		.map( line => {
			const [ them, us ] = line.split( ' ' );
			return scores[ them ][ us ]
		} )
		.sum()

bench( 'part 1 example', () => part1( example ), 15 );

bench( 'part 1 input', () => part1( input ) );

const outcomes = {
	// Rock
	A: {
		// Lose
		X: 0 + 3, // Scissors
		// Draw
		Y: 3 + 1, // Rock
		// Win
		Z: 6 + 2, // Paper
	},
	// Paper
	B: {
		// Lose
		X: 0 + 1, // Rock
		// Draw
		Y: 3 + 2, // Paper
		// Win
		Z: 6 + 3, // Scissors
	},
	// Scissors
	C: {
		// Lose
		X: 0 + 2, // Paper
		// Draw
		Y: 3 + 3, // Scissors
		// Win
		Z: 6 + 1, // Rock
	},
}

const part2 = ( input: string ) =>
	input.split( '\n' )
		.map( line => {
			const [ them, us ] = line.split( ' ' );
			return outcomes[ them ][ us ]
		} )
		.sum()

bench( 'part 2 example', () => part2( example ), 12 );

bench( 'part 2 input', () => part2( input ) );
