export const sum = ( numbers: number[] ) => numbers.reduce( ( p, v ) => p + v );

export const byNumberAsc = ( a: number, b: number ): number => a - b;
export const byNumberDesc = ( a: number, b: number ): number => b - a

export const chunker = <T>( size: number ) => ( chunks: T[][], line: T, i: number ) => {
	( chunks[ Math.floor( i / size ) ] ??= [] )[ i % size ] = line;
	return chunks;
}

export function findSharedLetter( [ first, ...rest ]: string[] ): string {
	return first
		.split( '' )
		.filter( letter => rest.every( item => item.includes( letter ) ) )[0]
}

export function* chunks<T>( items: Iterable<T>, size: number, offset = 0 ) {
	const iterator = items[ Symbol.iterator ]();
	let lastN: T[] = [];

	while ( true ) {
		const { done, value } = iterator.next();
		if ( done ) break;

		lastN.push( value );

		if ( lastN.length === size ) {
			yield lastN.slice( 0, size );

			lastN.splice( 0, size + offset );

			for ( let skip = 0; skip < Math.max( 0, offset ); skip++ ) {
				iterator.next();
			}
		}
	}

	if ( lastN.length ) {
		yield lastN;
	}
}
