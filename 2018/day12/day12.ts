import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

class Pot {
	l: Pot | undefined;
	r: Pot | undefined;

	constructor( public index: number, public alive: boolean ) { }

	growLeft(): Pot {
		if ( this.l ) throw new Error( 'left already exists' );

		this.l = new Pot( this.index - 1, true );
		this.l.r = this;

		return this.l;
	}

	growRight(): Pot {
		if ( this.r ) throw new Error( 'right already exists' );

		this.r = new Pot( this.index + 1, true );
		this.r.l = this;

		return this.r;
	}
}

class Kernel {
	constructor( private rules: boolean[] ) { }

	apply( ll: boolean, l: boolean, c: boolean, r: boolean, rr: boolean ): boolean {
		return this.rules[
			( ll as any ) << 4 |
			( l as any ) << 3 |
			( c as any ) << 2 |
			( r as any ) << 1 |
			( rr as any ) << 0
		] ?? false;
	}
}

function parse( input: string ): { pots: Pot[], kernel: Kernel } {
	const [ initialString, rulesString ] = input.split( '\n\n' );

	const pots = initialString
		.slice( 15 )
		.chars()
		.map( ( alive, index ) => new Pot( index, alive === '#' ) );

	for ( const pot of pots ) {
		pot.l = pots[ pot.index - 1 ];
		pot.r = pots[ pot.index + 1 ];
	}

	const rules: boolean[] = Array.filled( 2 ** 5, false );

	for ( const [ pattern, alive ] of rulesString.lines().map( line => line.split( ' => ' ) as [ string, string ] ) ) {
		rules[ parseInt( pattern.replaceAll( '#', '1' ).replaceAll( '.', '0' ), 2 ) ] = alive === '#';
	}

	const kernel = new Kernel( rules );

	return {
		pots,
		kernel,
	}
}

function reducePots<T>( start: Pot, callback: ( acc: T, pot: Pot ) => T, acc: T ): T {
	let pot: Pot | undefined = start;

	do {
		acc = callback( acc, pot );
	} while ( pot = pot.r );

	return acc;
}

function forEachPots( start: Pot, callback: ( pot: Pot ) => any ) {
	let pot: Pot | undefined = start;

	do {
		callback( pot );
	} while ( pot = pot.r );
}

function part1( input: string, generations: number ): number {
	const { pots, kernel } = parse( input );

	let firstPot = pots.at( 0 )!;
	let lastPot = pots.at( -1 )!;

	let previousPattern: boolean[] = [];
	let previousPatternIndex: number = 0;

	for ( let i = 1; i <= generations; i++ ) {
		const nextState = reducePots( firstPot, ( state, pot ) => {
			return state.set( pot.index, kernel.apply(
				pot.l?.l?.alive ?? false,
				pot.l?.alive ?? false,
				pot.alive,
				pot.r?.alive ?? false,
				pot.r?.r?.alive ?? false,
			) );
		}, new Map<number, boolean>() );

		const createLeft = kernel.apply(
			false,
			false,
			false,
			firstPot.alive,
			firstPot.r?.alive ?? false,
		);

		const createRight = kernel.apply(
			lastPot.l?.alive ?? false,
			lastPot.alive,
			false,
			false,
			false,
		);

		forEachPots( firstPot, pot => pot.alive = nextState.get( pot.index )! );

		if ( createLeft ) {
			firstPot = firstPot.growLeft();
		}

		if ( createRight ) {
			lastPot = lastPot.growRight();
		}

		// Prune dead left pots
		while ( !firstPot.alive && firstPot.r ) {
			firstPot = firstPot.r;
			firstPot.l = undefined;
		}

		// Prune dead right pots
		while ( !lastPot.alive && lastPot.l ) {
			lastPot = lastPot.l;
			lastPot.r = undefined;
		}

		const currentPattern = reducePots<boolean[]>( firstPot, ( pattern, pot ) => {
			pattern.push( pot.alive );
			return pattern;
		}, [] );

		if ( currentPattern.same( previousPattern ) ) {
			let finalIndex = ( generations - i ) * ( firstPot.index - previousPatternIndex ) + firstPot.index;

			forEachPots( firstPot, pot => pot.index = finalIndex++ );

			break;
		}

		previousPattern = currentPattern;
		previousPatternIndex = firstPot.index;
	}

	return reducePots( firstPot, ( total, pot ) => total += ( pot.alive ? pot.index : 0 ), 0 );
}

bench( 'part 1 example', () => part1( example, 20 ), 325 );

bench( 'part 1 input', () => part1( input, 20 ) );

bench( 'part 2 input', () => part1( input, 50000000000 ) );
