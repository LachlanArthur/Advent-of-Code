import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function hash( input: string ): number {
	let result = 0;

	for ( const char of input ) {
		result += char.charCodeAt( 0 );
		result *= 17
		result %= 256;
	}

	return result;
}

function part1( messages: string ) {
	return messages.split( ',' )
		.map( hash )
		.sum()
}

bench( 'part 1 example', () => part1( 'HASH' ), 52 );
bench( 'part 1 example', () => part1( example ), 1320 );

bench( 'part 1 input', () => part1( input ) );

type Lens = { label: string, focal: number };

function part2( messages: string ) {
	const boxes = new Map<number, Lens[]>();

	for ( const message of messages.split( ',' ) ) {
		const [ , label, operation, focal ] = message.match( /^([a-z]+)([=-])(.*)$/ )!;
		const box = hash( label );

		if ( operation === '-' ) {
			const lenses = boxes.get( box );
			if ( lenses ) {
				boxes.set( box, lenses.filter( lens => lens.label != label ) );
			}
		} else {
			const newLens = {
				label,
				focal: Number( focal )
			};
			let lenses = boxes.get( box ) ?? [];
			let replaced = false;
			lenses = lenses.map( lens => {
				if ( lens.label === label ) {
					replaced = true;
					return newLens;
				} else {
					return lens;
				}
			} )
			if ( !replaced ) {
				lenses.push( newLens );
			}
			boxes.set( box, lenses );
		}
	}

	let total = 0;

	for ( const [ box, lenses ] of boxes ) {
		for ( const [ i, { focal } ] of lenses.entries() ) {
			total += ( 1 + box ) * ( i + 1 ) * focal;
		}
	}

	return total;
}

bench( 'part 2 example', () => part2( example ), 145 );

bench( 'part 2 input', () => part2( input ) );
