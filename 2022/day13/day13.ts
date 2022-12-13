import '../../extensions';

import example from './example';
import input from './input';

function parse( input: string ) {
	return input
		.split( '\n' )
		.filter( String )
		.map( line => JSON.parse( line ) )
}

function checkOrdered( a: number | number[], b: number | number[] ): boolean | null {
	if ( typeof a === 'number' && typeof b === 'number' ) {
		if ( a === b ) return null;
		return a < b;
	}

	if ( Array.isArray( a ) && Array.isArray( b ) ) {
		if ( a.length === b.length ) {
			return a.map( ( aItem, index ) => checkOrdered( aItem, b[ index ] ) )
				.filter( result => result !== null )
			[ 0 ] ?? null;
		} else {
			const minLength = Math.min( a.length, b.length );
			const result = checkOrdered( a.slice( 0, minLength ), b.slice( 0, minLength ) );

			if ( result === null ) {
				return a.length < b.length;
			}

			return result;
		}
	}

	if ( Array.isArray( a ) ) return checkOrdered( a as number[], [ b as number ] );

	return checkOrdered( [ a as number ], b as number[] );
}

function part1( input: string ) {
	return parse( input )
		.chunks( 2 )
		.entriesArray()
		.filter( ( [ index, [ left, right ] ] ) => checkOrdered( left, right ) )
		.pluck( '0' )
		.map( index => index + 1 )
		.sum()
}

console.assert( part1( example ) === 13 );

console.log( part1( input ) );

function part2( input: string ) {
	const flags = [ [ [ 2 ] ], [ [ 6 ] ] ];

	return parse( input )
		.append( ...flags )
		.sort( ( a, b ) => {
			const result = checkOrdered( a, b );
			if ( result === null ) return 0;
			return result ? -1 : 1;
		} )
		.entriesArray()
		.filter( ( [ index, value ] ) => flags.some( flag => Array.same( [ value ], [ flag ] ) ) )
		.pluck( '0' )
		.map( index => index + 1 )
		.product()
}

console.assert( part2( example ) === 140 );

console.log( part2( input ) );
