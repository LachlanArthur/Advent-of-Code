export function permutations<T>( values: T[], size: number ): T[][] {
	if ( values.length > 36 ) throw new RangeError( 'Too many items' );

	const base = values.length;

	// It's kinda silly, but easy
	const totalString = ( base - 1 ).toString( base ).repeat( size );
	const totalLength = totalString.length;
	const total = parseInt( totalString, base );

	const permutations = Array.filled(
		total,
		( _, index ) => index
			.toString( base )
			.padStart( totalLength, '0' )
			.split( '' )
			.map( n => values[ parseInt( n, base ) ] )
	)

	return permutations;
}

export function combinations<T>( values: T[], size: number ): T[][] {
	const output: T[][] = [];

	const build = ( length = size, index = 0, result: T[] = new Array( size ) ) => {
		if ( length === 0 ) {
			output.push( result );
			return;
		}

		for ( let i = index; i <= values.length - length; i++ ) {
			result[ result.length - length ] = values[ i ];
			build( length - 1, i + 1, [ ...result ] );
		}
	}

	build();

	return output;
}

export function triangleNumber( n: number ): number {
	let output = 0;

	for ( let i = 0; i < n; i++ ) {
		output += i;
	}

	return output;
}

export function pascalTriangleRow( row: number ): number[] {
	const output = Array.from( { length: row }, () => 1 );

	for ( let i = 1; i < Math.ceil( row / 2 ); i++ ) {
		const value = output.at( i - 1 )! * ( ( row + 1 - i ) / i );
		output.splice( i, 1, value );
		output.splice( -( i + 1 ), 1, value );
	}

	return output;
}

export type Fraction<T extends number | bigint> = [ T, T ];

export function simplifyFraction( [ numerator, denominator ]: Fraction<number> ): Fraction<number>;
export function simplifyFraction( [ numerator, denominator ]: Fraction<bigint> ): Fraction<bigint>;
export function simplifyFraction( [ numerator, denominator ]: Fraction<number | bigint> ): Fraction<number | bigint> {
	const divisor = gcd( [ numerator, denominator ] as any );
	return [ numerator as any / divisor as any, denominator as any / divisor as any ];
}

export function addFractions( fractions: Fraction<number>[] ): Fraction<number>
export function addFractions( fractions: Fraction<bigint>[] ): Fraction<bigint>
export function addFractions( fractions: Fraction<number | bigint>[] ): Fraction<number | bigint> {
	if ( fractions.length === 0 ) {
		throw new RangeError( 'At least one fraction is required' );
	}

	let total = fractions.pop()!;

	while ( fractions.length ) {
		const [ n1, d1 ] = total;
		const [ n2, d2 ] = fractions.pop()!;

		total = simplifyFraction( [
			( n1 as any ) * ( d2 as any ) + ( n2 as any ) * ( d1 as any ),
			( d1 as any ) * ( d2 as any ),
		] );
	}

	return total;
}

export function sharedDenominators( fractions: Fraction<number>[] ): Fraction<number>[]
export function sharedDenominators( fractions: Fraction<bigint>[] ): Fraction<bigint>[]
export function sharedDenominators( fractions: Fraction<number | bigint>[] ): Fraction<number | bigint>[] {
	const denominator = lcm( fractions.pluck( '1' ) as any );

	return fractions.map( ( [ n, d ]: any[] ) => [ n * ( denominator / d ), denominator ] );
}

const stirlingNumbersFirstKindCache = new Map<bigint, bigint[]>( [
	[ 0n, [ 1n ] ],
	[ 1n, [ 0n, 1n ] ],
] );

/**
 * @see https://en.wikipedia.org/wiki/Stirling_numbers_of_the_first_kind
 */
export function stirlingNumbersFirstKind( row: bigint ): bigint[] {
	if ( !stirlingNumbersFirstKindCache.has( row ) ) {
		const previousRow = row - 1n;
		const numbers: bigint[] = [ 0n ];
		const previousNumbers = stirlingNumbersFirstKind( previousRow );

		for ( let i = 1; i <= row; i++ ) {
			numbers.push( -previousRow * ( previousNumbers[ i ] ?? 0n ) + ( previousNumbers[ i - 1 ] ?? 0n ) );
		}

		stirlingNumbersFirstKindCache.set( row, numbers );
	}

	return stirlingNumbersFirstKindCache.get( row )!;
}

export function abs( n: number ): number;
export function abs( n: bigint ): bigint;
export function abs( n: number | bigint ): number | bigint {
	if ( typeof n === 'bigint' ) {
		return n < 0n ? -n : n;
	} else {
		return Math.abs( n );
	}
}

export function gcd( numbers: number[] ): number;
export function gcd( numbers: bigint[] ): bigint;
export function gcd( numbers: number[] | bigint[] ): number | bigint {
	if ( numbers.length < 2 ) {
		throw new RangeError( 'At least two arguments are required' );
	}

	if ( numbers.length === 2 ) {
		let [ a, b ] = numbers;
		a = abs( a as any );
		b = abs( b as any );

		return ( a ? gcd( [ b % a, a ] ) : b );
	}

	return numbers.reduce( ( a, b ) => gcd( [ a, b ] as any ) );
}

export function lcm( numbers: number[] ): number;
export function lcm( numbers: bigint[] ): bigint;
export function lcm( numbers: number[] | bigint[] ): number | bigint {
	if ( numbers.length < 2 ) {
		throw new RangeError( 'At least two arguments are required' );
	}

	if ( numbers.length === 2 ) {
		let [ a, b ] = numbers;
		a = abs( a as any );
		b = abs( b as any );

		return ( b / gcd( [ a, b ] as any ) * a );
	}

	return numbers.reduce( ( a, b ) => lcm( [ a, b ] as any ) );
}

export function* range( from: number, to: number ) {
	const direction = Math.sign( to - from );

	yield from;

	if ( direction === 0 ) {
		return;
	}

	do {
		from += direction;
		yield from;
	} while ( from !== to );
}

/**
 * Only supports a single indeterminate (variable)
 *
 * @example Polynomial([3, -4, 5]) // 3x² - 4x + 5
 * @example Polynomial([7, 0, 1, 0]) // 7x³ + x
 * @example Polynomial([2, 3], 7) // (2x + 3) / 7
 */
export class Polynomial {
	/**
	 * The coefficients are stored in reverse order, so their index matches the exponent of their term
	 */
	public readonly coefficients: bigint[];

	/**
	 * The highest exponent in the polynomial
	 *
	 * It determines the polynomial's name:
	 * - 0: Constant
	 * - 1: Linear
	 * - 2: Quadratic
	 * - 3: Cubic
	 * - 4: Quartic
	 */
	public degree: number;

	constructor( coefficients: bigint[], public readonly divisor: bigint = 1n ) {
		while ( coefficients[ 0 ] === 0n ) {
			// Remove redundant leading zeroes
			coefficients.shift();
		}

		this.coefficients = coefficients.toReversed();
		this.degree = coefficients.length - 1;
	}

	/**
	 * Derive a polynomial from a sequence of values
	 *
	 * If the provided values are single-dimensional, the x values are assumed to start at 1.
	 *
	 * @see https://en.wikipedia.org/wiki/Newton_polynomial
	 */
	static fromSequence( yValues: number[] | bigint[] ): Polynomial;
	static fromSequence( xyValues: [ number, number ][] | [ bigint, bigint ][] ): Polynomial;
	static fromSequence( values: number[] | bigint[] | [ number, number ][] | [ bigint, bigint ][] ): Polynomial {
		if ( values.length === 0 ) {
			throw new Error( 'No values were provided' );
		}

		const pairs: [ bigint, bigint ][] = [];
		const uniqueX = new Set<bigint>();

		for ( const [ i, value ] of values.entries() ) {
			let x: bigint;
			let y: bigint;

			if ( Array.isArray( value ) ) {
				x = BigInt( value[ 0 ] );
				y = BigInt( value[ 1 ] );
			} else {
				x = BigInt( i + 1 );
				y = BigInt( value );
			}

			if ( uniqueX.has( x ) ) {
				throw new Error( 'Sequence has duplicate x values' );
			}

			pairs.push( [ x, y ] );
			uniqueX.add( x );
		}

		type Diff = { xMin: bigint, xMax: bigint, value: Fraction<bigint> };
		const diffs: Diff[][] = [ pairs.map( ( [ x, y ] ) => ( { xMin: x, xMax: x, value: [ y, 1n ] } ) ) ];

		while ( diffs.at( -1 )!.length > 1 && !diffs.at( -1 )!.every( diff => diff.value[ 0 ] === 0n ) ) {
			const previous = diffs.at( -1 )!;
			const next: Diff[] = [];

			for ( let i = 1; i < previous.length; i++ ) {
				const { xMax, value: [ numerator1, denominator1 ] } = previous[ i ];
				const { xMin, value: [ numerator2, denominator2 ] } = previous[ i - 1 ];
				let numerator = numerator1 * denominator2 - numerator2 * denominator1;
				let denominator = denominator1 * denominator2 * xMax - denominator1 * denominator2 * xMin;

				// Remove the negative from the denominator
				if ( denominator < 0n ) {
					numerator = -numerator;
					denominator = -denominator;
				}

				const value = simplifyFraction( [ numerator, denominator ] );
				next.push( { xMin, xMax, value } );
			}

			diffs.push( next );
		}

		// Remove trailing zero coefficients
		const diffValues = diffs.map( ( [ { value } ] ) => value );
		while ( diffValues.at( -1 )![ 0 ] === 0n ) {
			diffValues.pop();
		}

		const coefficients: Fraction<bigint>[] = [];

		for ( const [ i, frac ] of diffValues.entries() ) {
			coefficients[ i ] = frac;

			if ( i === 0 ) {
				continue;
			}

			const stirlings = stirlingNumbersFirstKind( BigInt( i ) + 1n ).toReversed();

			for ( let n = 1; n <= i; n++ ) {
				coefficients[ i - n ] = addFractions( [
					coefficients[ i - n ],
					[ stirlings[ n ] * frac[ 0 ], frac[ 1 ] ],
				] );
			}
		}

		const sharedCoefficients = sharedDenominators( coefficients );

		return new Polynomial( sharedCoefficients.pluck( '0' ).toReversed(), sharedCoefficients[ 0 ][ 1 ] );
	}

	calc( x: bigint ): bigint {
		return this.coefficients.reduce( ( total, coefficient, index ) => coefficient * x ** BigInt( index ) + total, 0n ) / this.divisor;
	}

	formula(): string {
		const coefficients = this.coefficients
			.entriesArray()
			.toReversed()
			.map( ( [ i, n ] ) => {
				if ( n === 0n ) {
					return '';
				}
				if ( i === 0 ) {
					return n;
				}
				if ( i === 1 ) {
					return `${n}x`;
				}
				return `${n}x^{${i}}`;
			} )
			.filter( String )
			.join( ' + ' )

		if ( this.divisor === 1n ) {
			return coefficients;
		}

		return `(${coefficients}) / ${this.divisor}`;
	}
}
