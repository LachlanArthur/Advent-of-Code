export const sum = ( numbers: number[] ) => numbers.reduce( ( p, v ) => p + v );

export const byNumberAsc = ( a: number, b: number ): number => a - b;
export const byNumberDesc = ( a: number, b: number ): number => b - a

export const chunker = <T>( size: number ) => ( chunks: T[][], line: T, i: number ) => {
	( chunks[ Math.floor( i / size ) ] ??= [] )[ i % size ] = line;
	return chunks;
}

export function findSharedLetter( [ first, ...rest ]: string[] ): string {
	return Array.from( intersect( first, ...rest ) )[ 0 ];
}

export function* chunks<T>( items: Iterable<T>, size: number, offset = 0, leftovers = true ) {
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

	if ( leftovers && lastN.length ) {
		yield lastN;
	}
}

export function* unique<T>( items: Iterable<T> ): Generator<T, void, unknown> {
	const uniqueItems = new Set<T>();

	for ( const item of items ) {
		if ( uniqueItems.has( item ) ) {
			continue;
		} else {
			uniqueItems.add( item );

			yield item;
		}
	}
}

export function* duplicates<T>( items: Iterable<T> ): Generator<T, void, unknown> {
	const seen = new Set<T>();

	for ( const item of items ) {
		if ( seen.has( item ) ) {
			yield item;
		} else {
			seen.add( item );
		}
	}
}

export function hasDuplicates( items: Iterable<any> ): boolean {
	return Array.from( duplicates( items ) ).length === 0;
}

export function* intersect<T>( ...iterables: Iterable<T>[] ): Generator<T, void, unknown> {
	const seen = new Map<T, Set<number>>();
	const iterableCount = iterables.length;

	for ( const [ iterableIndex, iterable ] of iterables.entries() ) {
		for ( const item of iterable ) {
			const seenIn = seen.get( item );

			if ( !seenIn ) {
				seen.set( item, new Set( [ iterableIndex ] ) );
				continue;
			} else if ( seenIn.size === iterableCount ) {
				yield item;
			} else {
				seenIn.add( iterableIndex );
			}
		}
	}
}

export function* filter<T, I extends Iterable<T>>( items: I, filter: ( item: T, index: number, items: I ) => boolean ) {
	let index = 0;

	for ( const item of items ) {
		if ( filter( item, index++, items ) ) {
			yield item;
		}
	}
}

export function* takeFirst<T>( items: Iterable<T>, limit: number ) {
	let i = 0;

	for ( const item of items ) {
		if ( i++ >= limit ) {
			break;
		}

		yield item;
	}
}

export function* skipFirst<T>( items: Iterable<T>, skip: number ) {
	let i = 0;

	for ( const item of items ) {
		if ( i++ < skip ) {
			continue;
		}

		yield item;
	}
}

export function* takeNth<T>( items: Iterable<T>, nth: number, offset = 0 ) {
	let i = 1;

	for ( const item of items ) {
		if ( i++ % nth === offset ) {
			yield item;
		}
	}
}

export function* skipNth<T>( items: Iterable<T>, modulus: number, offset = 0 ) {
	let i = 1;

	for ( const item of items ) {
		if ( i++ % modulus === offset ) {
			continue;
		}

		yield item;
	}
}

export function* takeOdd<T>( items: Iterable<T> ) {
	yield* skipNth( items, 2, 0 );
}

export function* takeEven<T>( items: Iterable<T> ) {
	yield* skipNth( items, 2, 1 );
}

export function deal<T>( items: Iterable<T>, hands: number ): T[][] {
	const output: T[][] = filledArray( hands, () => [] );

	for ( const chunk of chunks( items, hands ) ) {
		for ( const [ index, item ] of chunk.entries() ) {
			output[ index ].push( item );
		}
	}

	return output;
}

export function filledArray<T>( length: number, fill?: T | ( ( value: undefined, index: number, array: any[] ) => T ) ): Array<T> {
	const output = new Array( length );

	if ( typeof fill === 'function' ) {
		return output.fill( undefined ).map( fill as ( value: any, index: number, array: any[] ) => T );
	}

	return output.fill( fill );
}

export function transpose<T>( input: T[][] ): T[][] {
	const colCount = input.length;
	const rowCount = input[ 0 ]?.length;

	if ( rowCount === 0 || colCount === 0 ) return [];

	const output = filledArray( rowCount, () => [] as T[] );

	for ( let row = 0; row < rowCount; row++ ) {
		for ( let col = 0; col < colCount; col++ ) {
			output[ row ][ col ] = input[ col ][ row ];
		}
	}

	return output;
}
