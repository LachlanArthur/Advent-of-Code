import '../../extensions.ts';

import example from './example.ts';
import input from './input.ts';

class Base {
	protected readonly base: number;
	protected readonly charValues: Map<string, number>;
	protected readonly valueChars: Map<number, string>;
	protected readonly maxValue: number;

	constructor(
		charValues: Map<string, number>,
	) {
		this.base = charValues.size;
		this.charValues = Object.freeze( charValues );
		this.valueChars = Object.freeze( charValues.flip() );
		this.maxValue = charValues.valuesArray().max();
	}

	fromDecimal( input: number ): string {
		const negative = ( Math.sign( input ) === -1 ? '-' : '' );
		const chars: string[] = [];

		input = Math.abs( input );

		if ( input === 0 ) return this.valueChars.get( 0 )!;

		while ( input > 0 ) {
			let placeValue = input % this.base;
			input = Math.floor( input / this.base );

			if ( placeValue > this.maxValue ) {
				const difference = placeValue - this.base;
				placeValue = difference;
				input++;
			}

			chars.push( this.valueChars.get( placeValue )! );
		}

		return negative + chars.reverse().join( '' );
	}

	toDecimal( input: string ): number {
		let output = 0;

		for ( let i = 0; i < input.length; i++ ) {
			output += ( this.charValues.get( input[ input.length - 1 - i ] ) ?? NaN ) * this.base ** i;
		}

		return output;
	}
}

function part1( input: string ) {
	const snafu = new Base( new Map( [
		[ '=', -2 ],
		[ '-', -1 ],
		[ '0', 0 ],
		[ '1', 1 ],
		[ '2', 2 ],
	] ) );

	const decimals = input
		.split( '\n' )
		.map( n => snafu.toDecimal( n ) )

	return snafu.fromDecimal( decimals.sum() );
}

console.time( 'part 1 example' );
console.assert( part1( example ) === '2=-1=0' );
console.timeEnd( 'part 1 example' );

console.time( 'part 1 input' );
console.log( 'part 1 output:', part1( input ) );
console.timeEnd( 'part 1 input' );
