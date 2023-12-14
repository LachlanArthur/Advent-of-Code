const { firstBy } = ( await import( 'npm:thenby' ) ).default;
import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

type Card = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';
type Hand = [ Card, Card, Card, Card, Card ];

function cardValue( card: Card ): number {
	switch ( card ) {
		case 'A': return 13;
		case 'K': return 12;
		case 'Q': return 11;
		case 'J': return 10;
		case 'T': return 9;
		case '9': return 8;
		case '8': return 7;
		case '7': return 6;
		case '6': return 5;
		case '5': return 4;
		case '4': return 3;
		case '3': return 2;
		case '2': return 1;
	}
}

function handType( hand: Hand ): number {
	const groups = Object.entries( Object.groupBy( hand, card => card ) )
		.map( ( [ card, cards ] ) => [ card, cards.length ] as [ Card, number ] )
		.sortByNumberDesc( '1' )

	switch ( groups.length ) {
		case 1:
			// Five of a kind
			return 7;
		case 2:
			if ( groups[ 0 ][ 1 ] === 4 ) {
				// Four of a kind
				return 6;

			}
			// Full house
			return 5;
		case 3:
			if ( groups[ 0 ][ 1 ] === 3 ) {
				// Three of a kind
				return 4;

			}
			// Two pair
			return 3;
		case 4:
			// One pair
			return 2;
		case 5:
			// High card
			return 1;
		default:
			throw new Error( 'Invalid hand' );
	}
}

function part1( input: string ) {
	let handCount: number;
	return input
		.lines()
		.tee( items => handCount = items.length )
		.map( line => {
			const [ handStr, bidStr ] = line.split( ' ' );
			const hand = handStr.split( '' ) as Hand;
			const bid = Number( bidStr );
			return { hand, bid };
		} )
		.sort(
			firstBy( ( { hand } ) => handType( hand ), 'desc' )
				.thenBy( ( { hand } ) => cardValue( hand[ 0 ] ), 'desc' )
				.thenBy( ( { hand } ) => cardValue( hand[ 1 ] ), 'desc' )
				.thenBy( ( { hand } ) => cardValue( hand[ 2 ] ), 'desc' )
				.thenBy( ( { hand } ) => cardValue( hand[ 3 ] ), 'desc' )
				.thenBy( ( { hand } ) => cardValue( hand[ 4 ] ), 'desc' )
		)
		.entriesArray()
		.map( ( [ index, { bid } ] ) => ( handCount - index ) * bid )
		.sum()
}

bench( 'part 1 example', () => part1( example ), 6440 );

bench( 'part 1 input', () => part1( input ) );

const handTypeWildCache = new Map<string, number>();

function handTypeWild( hand: Hand ): number {
	if ( hand.includes( 'J' ) ) {
		const cacheKey = hand.join( '' );

		if ( handTypeWildCache.has( cacheKey ) ) {
			const best = handTypeWildCache.get( cacheKey )!;
			return best;
		}

		const jIndexes = hand.entriesArray().flatMap( ( [ i, card ] ) => card === 'J' ? [ i ] : [] )
		const otherCards: Card[] = [ 'A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2' ];
		const width = jIndexes.length;
		const radix = otherCards.length;

		if ( width >= 4 ) {
			handTypeWildCache.set( cacheKey, 7 );
			return 7;
		}

		// A silly way to generate all the combinations
		const variations: Card[][] = [];
		for ( let i = 0; i < ( radix ** width ); i++ ) {
			variations.push(
				i.toString( radix )
					.padStart( width, '0' )
					.split( '' )
					.map( c => otherCards[ parseInt( c, radix ) ] )
			)
		}

		const possibilities: Hand[] = [];

		for ( const variation of variations ) {
			const newHand: Hand = [ ...hand ];
			for ( const index of jIndexes ) {
				newHand[ index ] = variation.shift()!;
			}
			possibilities.push( newHand );
		}

		const best = possibilities
			.map( handType )
			.max();

		handTypeWildCache.set( cacheKey, best );

		return best;
	}

	return handType( hand );
}

function cardValueWild( card: Card ): number {
	if ( card === 'J' ) return 0;
	return cardValue( card );
}

function part2( input: string ) {
	let handCount: number;
	return input
		.lines()
		.tee( items => handCount = items.length )
		.map( line => {
			const [ handStr, bidStr ] = line.split( ' ' );
			const hand = handStr.split( '' ) as Hand;
			const bid = Number( bidStr );
			return { hand, bid };
		} )
		.sort(
			firstBy( ( { hand } ) => handTypeWild( hand ), 'desc' )
				.thenBy( ( { hand } ) => cardValueWild( hand[ 0 ] ), 'desc' )
				.thenBy( ( { hand } ) => cardValueWild( hand[ 1 ] ), 'desc' )
				.thenBy( ( { hand } ) => cardValueWild( hand[ 2 ] ), 'desc' )
				.thenBy( ( { hand } ) => cardValueWild( hand[ 3 ] ), 'desc' )
				.thenBy( ( { hand } ) => cardValueWild( hand[ 4 ] ), 'desc' )
		)
		.map( ( { hand, bid } ) => ( { hand: hand.join( '' ), bid } ) )
		.entriesArray()
		.map( ( [ index, { bid } ] ) => ( handCount - index ) * bid )
		.sum()
}

bench( 'part 2 example', () => part2( example ), 5905 );

bench( 'part 2 input', () => part2( input ) );
