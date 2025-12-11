import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { combinations, gcd, permutations } from '../../maths.ts';
import { AStar, Vertex } from '../../pathfinder.ts';

function part1( input: string ) {
	let totalPresses = 0;

	for ( const line of input.lines() ) {
		const match = line.match( /^\[([.#]+)\]((?: \(\d+(?:,\d+)*\))*) \{(\d+(?:,\d+)*)\}+$/ );
		if ( !match ) throw 'parse failed'

		let lights = 0;
		let target = parseInt( match[ 1 ].split( '' ).map( c => c === '#' ? '1' : '0' ).join( '' ), 2 );
		let buttons = match[ 2 ].trim().split( ' ' ).map( str => {
			const mask = Array.filled( match[ 1 ].length, '0' );
			for ( const position of str.replaceAll( /[()]/g, '' ).split( ',' ).map( Number ) ) {
				mask[ position ] = '1';
			}
			return parseInt( mask.join( '' ), 2 );
		} );
		let joltages = match[ 3 ].split( ',' ).map( Number );

		for ( let presses = 1; presses <= buttons.length; presses++ ) {
			const result = combinations( buttons, presses )
				.find( combo => combo.reduce( ( carry, toggle ) => carry ^ toggle, lights ) === target );

			if ( result ) {
				totalPresses += result.length;
				break;
			}
		}
	}

	return totalPresses;
}

bench( 'part 1 example', () => part1( example ), 7 );

bench( 'part 1 input', () => part1( input ) );

// function part2( input: string ) {
// 	let totalPresses = 0;

// 	const inputLines = input.lines();
// 	const inputLineCount = inputLines.length;
// 	for ( const [ lineIndex, line ] of inputLines.entries() ) {
// 		const match = line.match( /^\[([.#]+)\]((?: \(\d+(?:,\d+)*\))*) \{(\d+(?:,\d+)*)\}+$/ );
// 		if ( !match ) throw 'parse failed'

// 		const size = match[ 1 ].length;

// 		const buttons = match[ 2 ]
// 			.trim()
// 			.split( ' ' )
// 			.map( str => {
// 				const mask = Array.filled( size, 0 );
// 				for ( const position of str.replaceAll( /[()]/g, '' ).split( ',' ).map( Number ) ) {
// 					mask[ position ] = 1;
// 				}
// 				return mask;
// 			} );

// 		const targetJoltages = match[ 3 ]
// 			.split( ',' )
// 			.map( Number );

// 		const maxJolt = targetJoltages.sum();

// 		class JoltageState implements Vertex {
// 			static all = new Map<string, JoltageState>();
// 			static find( joltages: number[] ) {
// 				return this.all.get( joltages.join() ) ?? new this( joltages );
// 			}
// 			static calculateJoltages( presses: number[] ): number[] {
// 				return Array.filled( targetJoltages.length, 0 )
// 					.map( ( _, joltIndex ) => presses.map( ( buttonPresses, buttonIndex ) => buttons[ buttonIndex ][ joltIndex ] * buttonPresses ).sum() )
// 			}
// 			constructor( public joltages: number[] ) {
// 				JoltageState.all.set( this.key, this );
// 			}
// 			#edges: Map<JoltageState, number> | undefined;
// 			edgeButtons: Map<JoltageState, number> | undefined;
// 			get edges() {
// 				if ( !this.#edges ) {
// 					this.#edges = new Map<JoltageState, number>();
// 					this.edgeButtons = new Map<JoltageState, number>();

// 					// TODO: large skips
// 					buttonLoop: for ( const [ buttonIndex, buttonJoltages ] of buttons.entries() ) {
// 						const candidateJoltages: number[] = [];

// 						for ( const [ joltageIndex, joltage ] of this.joltages.entries() ) {
// 							candidateJoltages[ joltageIndex ] = joltage + buttonJoltages[ joltageIndex ];
// 							if ( candidateJoltages[ joltageIndex ] > targetJoltages[ joltageIndex ] ) {
// 								continue buttonLoop;
// 							}
// 						}

// 						// console.log( { buttonIndex, buttonJoltages, candidateJoltages } );

// 						const edge = JoltageState.find( candidateJoltages );
// 						this.#edges.set( edge, 1 );
// 						this.edgeButtons.set( edge, buttonIndex );
// 					}
// 				}

// 				return this.#edges;
// 			}
// 			get key() {
// 				return this.joltages.join();
// 			}
// 			traversible = true;
// 			is( other: this ): boolean {
// 				return this.joltages.same( other.joltages );
// 			}
// 		}

// 		const startJoltages = Array.filled( targetJoltages.length, 0 );
// 		const start = JoltageState.find( startJoltages );
// 		const end = JoltageState.find( targetJoltages );

// 		// console.log( start );
// 		// console.log( start.edges );

// 		const pathfinder = new class extends AStar<JoltageState> {
// 			constructor() {
// 				super();
// 			}
// 			protected heuristic( a: JoltageState, b: JoltageState ): number {
// 				const aDistance = maxJolt - a.joltages.sum();
// 				const bDistance = maxJolt - b.joltages.sum();
// 				return aDistance - bDistance;
// 			}
// 		}

// 		const nextPresses = pathfinder.path( start, end ).length - 1;
// 		totalPresses += nextPresses;
// 		// console.log( '+ %o = %o (%o%%)', nextPresses, totalPresses, lineIndex / inputLineCount * 100 );
// 	}

// 	return totalPresses;
// }


function part2( input: string ) {
	let totalPresses = 0;

	const inputLines = input.lines();
	const inputLineCount = inputLines.length;
	let solved = 0;
	for ( const [ lineIndex, line ] of inputLines.entries() ) {
		const match = line.match( /^\[([.#]+)\]((?: \(\d+(?:,\d+)*\))*) \{(\d+(?:,\d+)*)\}+$/ );
		if ( !match ) throw 'parse failed'

		const size = match[ 1 ].length;

		const buttons = match[ 2 ]
			.trim()
			.split( ' ' )
			.map( str => {
				const mask = Array.filled( size, 0 );
				for ( const position of str.replaceAll( /[()]/g, '' ).split( ',' ).map( Number ) ) {
					mask[ position ] = 1;
				}
				return mask;
			} );

		const targetJoltages = match[ 3 ]
			.split( ',' )
			.map( Number );

		const maxJolt = targetJoltages.sum();

		const currentJoltages = targetJoltages.map( () => 0 );

		function pressButton( buttonIndex: number, times: number ) {
			for ( const [ joltageIndex, joltageChange ] of buttons[ buttonIndex ].entries() ) {
				currentJoltages[ joltageIndex ] += joltageChange * times;
				targetJoltages[ joltageIndex ] -= joltageChange * times;
			}
			totalPresses += times;
		}

		let joltageInfluencers = buttons
			.transpose()
			.map( column => column.flatMap( ( v, i ) => v === 1 ? [ i ] : [] ) );

		// console.log( 'NEXT LINE', {
		// 	targetJoltages: targetJoltages.join(),
		// 	buttons: buttons.map( a => a.join() ),
		// 	joltageInfluencers,
		// } );

		while ( true ) {
			let pressed = totalPresses;

			if ( pushLoneInfluencers() ) {
				solved++;
				break;
			}

			if ( simplifyGlobalInfluencers() ) {
				solved++;
				break;
			}

			// console.log( 'TODO: complex solution' );

			if ( pressed === totalPresses ) {
				// console.log( 'Nothing changed :(' );
				break;
			}
		}

		function pushLoneInfluencers() {
			while ( true ) {
				const joltageIndex = joltageInfluencers.findIndex( arr => arr.length === 1 );

				if ( joltageIndex === -1 ) {
					// console.log( 'No simple solution :(' );
					return false;
				}

				const loneInfluencer = joltageInfluencers[ joltageIndex ][ 0 ];

				// console.log( 'Lone influencer found: %o, pressing %o times', loneInfluencer, targetJoltages[ joltageIndex ] );

				pressButton( loneInfluencer, targetJoltages[ joltageIndex ] );

				joltageInfluencers = joltageInfluencers.map( arr => arr.without( loneInfluencer ) );

				// console.log( {
				// 	targetJoltages: targetJoltages.join(),
				// 	buttons: buttons.map( a => a.join() ),
				// 	joltageInfluencers,
				// } );

				if ( targetJoltages.sum() === 0 ) {
					// console.log( 'Solution found!' );
					return true;
				}
			}
		}

		function simplifyGlobalInfluencers() {
			while ( true ) {

				const globalInfluencers = Array.intersect( ...joltageInfluencers.filter( arr => arr.length > 1 ) );

				if ( globalInfluencers.length === 0 ) {
					// console.log( 'No global influencers found :(' );
					return false;
				}

				const minPresses = targetJoltages.filter( ( _, i ) => joltageInfluencers[ i ].length > 0 ).min();
				// console.log( 'Global influencer found: %o, pressing %o times', globalInfluencers[ 0 ], minPresses );
				pressButton( globalInfluencers[ 0 ], minPresses );

				joltageInfluencers = joltageInfluencers.map( arr => arr.without( globalInfluencers[ 0 ] ) );

				// console.log( {
				// 	targetJoltages: targetJoltages.join(),
				// 	buttons: buttons.map( a => a.join() ),
				// 	joltageInfluencers,
				// } );

				if ( targetJoltages.sum() === 0 ) {
					// console.log( 'Solution found!' );
					return true;
				}
			}
		}
	}

	console.log( 'Solved %o/%o lines (%s%%)', solved, inputLineCount, ( solved / inputLineCount * 100 ) );

	return totalPresses;
}

bench( 'part 2 example', () => part2( example ), 33 );

// bench( 'part 2 example', () => part2( '[.#.####..#] (1,2,3,5,6,7) (0,3,5,9) (0,1,4,5,7,9) (0,1,2,3,4,7,8,9) (0,1,4,6,7,8,9) (0,1,4,5,6,8,9) (0,2,3,4,6,7,8,9) (1,7) (1,3,4,5,7,8) (0,1,2,3,4,5,8) {62,241,38,67,57,67,40,223,56,43}' ) );
bench( 'part 2 example', () => part2( '[####] (0,1,2,3) (0,1,3) {180,180,10,180}' ), 180 );

bench( 'part 2 input', () => part2( input ) );
