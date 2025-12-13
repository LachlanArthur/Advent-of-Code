import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { combinations, gcd, max, permutations, Polynomial } from '../../maths.ts';
import { AStar, pathLength, Vertex } from '../../pathfinder.ts';

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

// 		console.log( line );

// 		// console.log( {
// 		// 	targetJoltages: targetJoltages.join(),
// 		// 	buttons: buttons.map( a => a.join() ),
// 		// } );

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
// 				// console.log( 'JoltageState [%o]', JoltageState.all.size, ...joltages );
// 				JoltageState.all.set( this.key, this );
// 			}
// 			#edges: Map<JoltageState, number> | undefined;
// 			edgeButtons: Map<JoltageState, number> | undefined;
// 			get edges() {
// 				if ( !this.#edges ) {
// 					this.#edges = new Map<JoltageState, number>();
// 					this.edgeButtons = new Map<JoltageState, number>();

// 					for ( const [ buttonIndex, buttonJoltages ] of buttons.entries() ) {
// 						const maxPresses = buttonJoltages
// 							.flatMap( ( influence, joltageIndex ) =>
// 								influence === 1
// 									? [ targetJoltages[ joltageIndex ] - this.joltages[ joltageIndex ] ]
// 									: [] )
// 							.min();

// 						if ( !Number.isFinite( maxPresses ) ) {
// 							continue;
// 						}

// 						// console.log( 'button %o can be pressed up to %o times', buttonIndex, maxPresses );

// 						for ( let press = 1; press <= maxPresses; press++ ) {
// 							const edge = JoltageState.find(
// 								this.joltages.map( ( joltage, joltageIndex ) => joltage + ( buttonJoltages[ joltageIndex ] * press ) )
// 							);
// 							this.#edges.set( edge, press );
// 							this.edgeButtons.set( edge, buttonIndex );
// 						}

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

// 		// start.edges

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

// 		const path = pathfinder.path( start, end );
// 		path.sliding( 2 ).map( ( [ a, b ] ) => `button ${a.edgeButtons!.get( b )!} pressed ${a.edges.get( b )} times` ).log();
// 		const nextPresses = pathLength( path );
// 		totalPresses += nextPresses;
// 		console.log( '+ %o = %o (%o%%)', nextPresses, totalPresses, lineIndex / inputLineCount * 100 );
// 	}

// 	return totalPresses;
// }


// function part2( input: string ) {
// 	let totalPresses = 0;

// 	const inputLines = input.lines();
// 	const inputLineCount = inputLines.length;
// 	let solved = 0;
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

// 		const currentJoltages = targetJoltages.map( () => 0 );

// 		function pressButton( buttonIndex: number, times: number ) {
// 			console.log( 'Pressing button %o %o times', buttonIndex, times );

// 			for ( const [ joltageIndex, joltageChange ] of buttons[ buttonIndex ].entries() ) {
// 				currentJoltages[ joltageIndex ] += joltageChange * times;
// 				targetJoltages[ joltageIndex ] -= joltageChange * times;
// 			}
// 			totalPresses += times;
// 		}

// 		let joltageInfluencers = buttons
// 			.transpose()
// 			.map( column => column.flatMap( ( v, i ) => v === 1 ? [ i ] : [] ) );

// 		const removeInfluencer = ( index: number ) => joltageInfluencers = joltageInfluencers.map( arr => arr.without( index ) );

// 		console.group( line );

// 		while ( true ) {
// 			// console.log( {
// 			// 	targetJoltages: targetJoltages.join(),
// 			// 	buttons: buttons.map( a => a.join() ),
// 			// 	joltageInfluencers,
// 			// } );

// 			let pressed = totalPresses;

// 			if ( pressLoneInfluencers() ) {
// 				solved++;
// 				console.log( '%cSOLVED!', 'color: green' );
// 				break;
// 			}

// 			if ( pressGlobalInfluencers() ) {
// 				solved++;
// 				console.log( '%cSOLVED!', 'color: green' );
// 				break;
// 			}

// 			if ( pressed === totalPresses ) {
// 				console.log( 'Nothing changed :(' );
// 				break;
// 			}
// 		}

// 		console.groupEnd();

// 		function pressLoneInfluencers() {
// 			while ( true ) {
// 				const joltageIndex = joltageInfluencers.findIndex( arr => arr.length === 1 );

// 				if ( joltageIndex === -1 ) {
// 					return false;
// 				}

// 				const loneInfluencer = joltageInfluencers[ joltageIndex ][ 0 ];

// 				pressButton( loneInfluencer, targetJoltages[ joltageIndex ] );

// 				removeInfluencer( loneInfluencer );

// 				if ( targetJoltages.sum() === 0 ) {
// 					return true;
// 				}
// 			}
// 		}

// 		function pressGlobalInfluencers() {
// 			while ( true ) {

// 				const globalInfluencers = Array.intersect( ...joltageInfluencers.filter( arr => arr.length > 1 ) );

// 				if ( globalInfluencers.length === 0 ) {
// 					return false;
// 				}

// 				const minPresses = targetJoltages.filter( ( _, i ) => joltageInfluencers[ i ].length > 0 ).min();

// 				pressButton( globalInfluencers[ 0 ], minPresses );

// 				removeInfluencer( globalInfluencers[ 0 ] )

// 				if ( targetJoltages.sum() === 0 ) {
// 					return true;
// 				}
// 			}
// 		}
// 	}

// 	console.log( 'Solved %o/%o lines (%s%%)', solved, inputLineCount, ( solved / inputLineCount * 100 ) );

// 	return totalPresses;
// }

function part2( input: string ) {
	let totalPresses = 0;

	const inputLines = input.lines();
	const inputLineCount = inputLines.length;
	let solved = 0;
	for ( const [ lineIndex, line ] of inputLines.entries() ) {

		console.log( '%o/%o (%s%%)', lineIndex, inputLineCount, ( lineIndex / inputLineCount * 100 ) );

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

		const joltageInfluencers = buttons
			.transpose()
			.map( column => column.flatMap( ( v, i ) => v === 1 ? [ i ] : [] ) );

		// console.group( line );

		// console.log( {
		// 	targetJoltages: targetJoltages.join(),
		// 	buttons: buttons.map( a => a.join() ),
		// 	joltageInfluencers,
		// } );

		type State = {
			activeButton: number,
			buttonPresses: number[],
		};

		function calculateJoltages( buttonPresses: number[] ): number[] {
			const joltages: number[] = [];

			for ( let joltageIndex = 0; joltageIndex < size; joltageIndex++ ) {
				joltages[ joltageIndex ] = 0;

				for ( const [ buttonIndex, button ] of buttons.entries() ) {
					joltages[ joltageIndex ] += button[ joltageIndex ] * buttonPresses[ buttonIndex ];
				}
			}

			return joltages;
		}

		function validateJoltages( buttonPresses: number[] ): number {
			let match = true;

			for ( let joltageIndex = 0; joltageIndex < size; joltageIndex++ ) {
				let joltage = 0;

				for ( const [ buttonIndex, button ] of buttons.entries() ) {
					joltage += button[ joltageIndex ] * buttonPresses[ buttonIndex ];

					if ( joltage > targetJoltages[ joltageIndex ] ) {
						// Overshoot
						return 1;
					}
				}

				if ( joltage !== targetJoltages[ joltageIndex ] ) {
					match = false;
				}
			}

			if ( !match ) {
				// Undershoot
				return -1;
			}

			// Exact
			return 0;
		}

		// TODO: Sort buttons by largest influencer

		const found: number[] = [];

		backtrack<State>( {
			start(): State {
				return {
					activeButton: -1, // Immediately gets incremented by "next"
					buttonPresses: buttons.map( () => 0 ),
				};
			},
			impossible( state ): boolean {
				if ( state.buttonPresses.sum() >= found.min() ) {
					// Don't bother with larger branches
					return false;
				}

				// Overshoots are impossible
				return validateJoltages( state.buttonPresses ) === 1;
			},
			accept( state ): boolean {
				return validateJoltages( state.buttonPresses ) === 0;
			},
			next( state ): State | null {
				let activeButton = state.activeButton;
				let buttonPresses = [ ...state.buttonPresses ];

				// console.log( 'next', activeButton, buttonPresses.join(), calculateJoltages( buttonPresses ).join() );

				if ( activeButton < buttons.length - 1 ) {
					activeButton++;
				} else {
					// console.log( '  Exhausted buttons' );
					return null;
				}

				// console.log( '  Moving to button %o', activeButton );

				return {
					activeButton,
					buttonPresses,
				};
			},
			extend( state ): State | null {
				let activeButton = state.activeButton;
				let buttonPresses = [ ...state.buttonPresses ];

				// console.log( 'extend', activeButton, buttonPresses.join(), calculateJoltages( buttonPresses ).join() );

				if ( validateJoltages( buttonPresses ) === -1 ) {
					// TODO: Start at max presses and work backwards
					buttonPresses[ activeButton ]++;
				} else {
					// console.log( '  Exhausted presses for button %o', activeButton );
					return null;
				}

				// console.log( '  Pressing button %o', activeButton );

				return {
					activeButton,
					buttonPresses,
				};
			},
			output( state ): boolean {
				found.push( state.buttonPresses.sum() );
				return false;
			},
		} );

		if ( found.length === 0 ) {
			throw 'NOT FOUND';
		}

		totalPresses += found.min();

		// console.groupEnd();
	}

	return totalPresses;
}

function backtrack<T>( params: {
	/**
	 * The initial state
	 */
	start: () => T,
	/**
	 * Return true if the state is invalid/impossible
	 */
	impossible: ( state: T ) => boolean,
	/**
	 * Return true if the state is the desired result
	 */
	accept: ( state: T ) => boolean,
	/**
	 * Return the next state from the current state, or null if there are no more
	 */
	next: ( state: T ) => T | null,
	/**
	 * Return an extension of the current state, or null if there are no more
	 */
	extend: ( state: T ) => T | null,
	/**
	 * Receive the desired result, return true to continue to find more
	 */
	output: ( state: T ) => boolean,
} ) {
	const { start, impossible, accept, next, extend, output } = params;

	return _backtrack( start() );

	function _backtrack( state: T ) {
		if ( impossible( state ) ) {
			return;
		}

		if ( accept( state ) ) {
			if ( output( state ) === false ) {
				return false;
			}
		}

		let nextState = next( state );

		while ( nextState !== null ) {
			if ( _backtrack( nextState ) === false ) {
				return false;
			}

			nextState = extend( nextState );
		}
	}
}

bench( 'part 2 example', () => part2( example ), 33 ); // 10, 12, 11

bench( 'part 2 example', () => part2( '[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}' ), 12 ); // 2 5 0 5 0

// bench( 'part 2 example', () => part2( '[.#.####..#] (1,2,3,5,6,7) (0,3,5,9) (0,1,4,5,7,9) (0,1,2,3,4,7,8,9) (0,1,4,6,7,8,9) (0,1,4,5,6,8,9) (0,2,3,4,6,7,8,9) (1,7) (1,3,4,5,7,8) (0,1,2,3,4,5,8) {62,241,38,67,57,67,40,223,56,43}' ) );
bench( 'part 2 example', () => part2( '[####] (0,1,2,3) (0,1,3) {180,180,10,180}' ), 180 );
// bench( 'part 2 example', () => part2( '[###.] (0,1,3) (0,2) (1,3) (0,2,3) {31,32,13,38}' ) );

bench( 'part 2 input', () => part2( input ) );
