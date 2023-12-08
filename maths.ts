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

export function gcd( ...numbers: number[] ): number {
	if ( numbers.length < 2 ) {
		throw new RangeError( 'At least two arguments are required' );
	}

	if ( numbers.length === 2 ) {
		let [ a, b ] = numbers;

		if ( a < b ) {
			return gcd( b, a );
		}

		while ( a % b !== 0 ) {
			const temp = b;
			b = a % b;
			a = temp;
		}

		return b;
	}

	return numbers.reduce( ( a, b ) => gcd( a, b ) );
}

export function lcm( ...numbers: number[] ): number {
	if ( numbers.length < 2 ) {
		throw new RangeError( 'At least two arguments are required' );
	}

	if ( numbers.length === 2 ) {
		let [ a, b ] = numbers;

		return Math.abs( b ) / gcd( a, b ) * Math.abs( a );
	}

	return numbers.reduce( ( a, b ) => lcm( a, b ) );
}
