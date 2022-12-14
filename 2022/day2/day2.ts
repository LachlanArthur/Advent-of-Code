import '../../extensions';

import example from './example';
import input from './input';

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

console.assert( part1( example ) === 15 )

console.log( part1( input ) )

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

console.assert( part2( example ) === 12 )

console.log( part2( input ) )
