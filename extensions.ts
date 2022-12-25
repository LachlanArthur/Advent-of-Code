type KeysWithValsOfType<T, V> = keyof { [ P in keyof T as T[ P ] extends V ? P : never ]: P } & keyof T;

declare global {
	interface Array<T> {
		log( message?: string ): this;
		chunks( size: number, offset?: number, leftovers?: boolean ): T[][];
		unique(): T[];
		duplicates(): T[];
		hasDuplicates(): boolean;
		entriesArray(): [ number, T ][];
		keysArray(): number[];
		valuesArray(): T[];
		intersectChunks( this: T[] ): T;
		takeFirst( count?: number ): T[];
		takeNth( n: number, offset?: number ): T[];
		takeEven(): T[];
		takeOdd(): T[];
		skipFirst( count?: number ): T[];
		skipNth( n: number, offset?: number ): T[];
		/**
		 * Like dealing cards to players.
		 */
		deal( intoHands: number, leftovers?: boolean ): T[][];
		/**
		 * Chunk into specific sizes
		 */
		partitionBy( sizes: number[], leftovers?: boolean ): T[][];
		transpose<T>( this: T[][] ): T[][];
		sum( this: number[] ): number;
		product( this: number[] ): number;
		sortByNumberAsc( this: number[] ): T[];
		sortByNumberDesc( this: number[] ): T[];
		sortByNumberAsc<T, K extends KeysWithValsOfType<T, number>>( this: T[], property: K ): T[];
		sortByNumberDesc<T, K extends KeysWithValsOfType<T, number>>( this: T[], property: K ): T[];
		max( this: number[] ): number;
		min( this: number[] ): number;
		pluck<K extends keyof T>( this: T[], property: K ): T[ K ][];
		tee<T>( this: T[], callback: ( items: T[] ) => void ): T[];
		prepend<T>( this: T[], ...items: T[] ): T[];
		append<T>( this: T[], ...items: T[] ): T[];
		same<T>( this: T[], other: T[] ): boolean;
		fillEmpty<T>( this: T[], value?: T ): T[];
		pad<T>( this: T[], length: number, value: T | ( () => T ) ): T[];
		filterExists<T>( this: ( T | undefined | null )[] ): T[];
		groupBy<T, K extends keyof T>( this: T[], property: K ): Map<T[ K ], T[]>;
		without<T>( this: T[], ...values: T[] ): T[];
		clone<T>( this: T[] ): T[];
	}

	interface ArrayConstructor {
		fromLines( lines: string ): string[];
		fromChars( input: string ): string[];
		fromRange( start: number, end: number, step?: number ): number[];
		filled<T>( count: number, filler: T | ( ( value: undefined, index: number, array: undefined[] ) => T ) ): T[];
		filledFromCoordinates<T>( coords: [ number, number ][], filler: ( coord: [ number, number ], index: number ) => T, blank?: T ): ( T | undefined )[][];
		intersect<T>( ...arrays: T[] ): T;
		same<T>( a: T[], b: T[] ): boolean;
		zipEntries<K, V>( keys: K[], values: V[], fill?: V ): [ K, V ][];
	}

	interface Map<K, V> {
		entriesArray(): [ K, V ][];
		keysArray(): K[];
		valuesArray(): V[];
		increment<K>( this: Map<K, number>, key: K, amount?: number ): Map<K, number>;
		decrement<K>( this: Map<K, number>, key: K, amount?: number ): Map<K, number>;
		flip<K, V>( this: Map<K, V> ): Map<V, K>;
	}

	interface MapConstructor {
		zip<K, V>( keys: K[], values: V[], fill?: V ): Map<K, V>;
	}

	interface Set<T> {
		entriesArray(): [ number, T ][];
		keysArray(): number[];
		valuesArray(): T[];
	}

	interface Number {
		mod( this: number, mod: number ): number;
	}
}

Array.prototype.log = function <T>( this: T[], message?: string ) {
	if ( message ) {
		console.group( message );
	}

	console.log( this );

	if ( message ) {
		console.groupEnd();
	}

	return this;
}

Array.prototype.chunks = function <T>( this: T[], size: number, offset = 0, leftovers = true ) {
	const iterator = this[ Symbol.iterator ]();
	const output: T[][] = [];
	let lastN: T[] = [];

	while ( true ) {
		const { done, value } = iterator.next();
		if ( done ) break;

		lastN.push( value );

		if ( lastN.length === size ) {
			output.push( lastN.slice( 0, size ) );

			lastN.splice( 0, size + offset );

			for ( let skip = 0; skip < Math.max( 0, offset ); skip++ ) {
				iterator.next();
			}
		}
	}

	if ( leftovers && lastN.length ) {
		output.push( lastN );
	}

	return output;
}

Array.prototype.unique = function <T>( this: T[] ) {
	return Array.from( new Set( this ) );
}

Array.prototype.duplicates = function <T>( this: T[] ) {
	const seen = new Set<T>();
	const duplicates: T[] = [];

	for ( const item of this ) {
		if ( seen.has( item ) ) {
			duplicates.push( item );
		} else {
			seen.add( item );
		}
	}

	return duplicates;
}

Array.prototype.hasDuplicates = function <T>( this: T[] ) {
	return this.duplicates().length > 0;
}

Array.prototype.entriesArray = function <T>( this: T[] ) {
	return Array.from( this.entries() );
}

Array.prototype.keysArray = function <T>( this: T[] ) {
	return Array.from( this.keys() );
}

Array.prototype.valuesArray = function <T>( this: T[] ) {
	return Array.from( this.values() );
}

Array.prototype.intersectChunks = function <T>( this: T[][] ): T[] {
	const itemsInChunks = new Map<T, Set<number>>();
	const chunkCount = this.length;
	const output = new Set<T>();

	for ( const [ chunkIndex, chunk ] of this.entries() ) {
		for ( const item of chunk ) {
			const seenInChunks = itemsInChunks.get( item );

			if ( !seenInChunks ) {
				itemsInChunks.set( item, new Set( [ chunkIndex ] ) );
				continue;
			}

			seenInChunks.add( chunkIndex );

			if ( seenInChunks.size === chunkCount ) {
				output.add( item );
			}
		}
	}

	return Array.from( output.values() );
}

Array.prototype.takeFirst = function <T>( this: T[], count = 1 ) {
	return this.slice( 0, count );
}

Array.prototype.takeNth = function <T>( this: T[], n: number, offset = 0 ) {
	return this.filter( ( value, index ) => ( index + 1 ) % n === offset );
}

Array.prototype.takeEven = function <T>( this: T[] ) {
	return this.takeNth( 2 );
}

Array.prototype.takeOdd = function <T>( this: T[] ) {
	return this.takeNth( 2, 1 );
}

Array.prototype.skipFirst = function <T>( this: T[], count = 1 ) {
	return this.slice( count );
}

Array.prototype.skipNth = function <T>( this: T[], n: number, offset = 0 ) {
	return this.filter( ( value, index ) => ( index + 1 ) % n !== offset );
}

Array.prototype.deal = function <T>( this: T[], intoHands: number, leftovers = true ) {
	const output: T[][] = Array.filled( intoHands, () => [] );

	for ( const chunk of this.chunks( intoHands, 0, leftovers ) ) {
		for ( const [ index, item ] of chunk.entries() ) {
			output[ index ].push( item );
		}
	}

	return output;
}

Array.prototype.partitionBy = function <T>( this: T[], sizes: number[], leftovers = false ) {
	const output: T[][] = [];

	let i = 0;
	for ( const size of sizes ) {
		output.push( this.slice( i, i + size ) );
		i += size;
	}

	if ( leftovers ) {
		output.push( this.slice( i ) );
	}

	return output;
}

Array.prototype.transpose = function () {
	const colCount = this.length;
	const rowCount = Math.min( ...( this as any ).pluck( 'length' ) );

	if ( rowCount === 0 || colCount === 0 ) return [];

	const output = Array.filled( rowCount, () => [] as any );

	for ( let row = 0; row < rowCount; row++ ) {
		for ( let col = 0; col < colCount; col++ ) {
			output[ row ][ col ] = this[ col ][ row ];
		}
	}

	return output as any;
}

Array.prototype.sum = function ( this: number[] ) {
	let sum = 0;

	for ( const item of this ) {
		sum += item;
	}

	return sum;
}

Array.prototype.product = function ( this: number[] ) {
	let product = 1;

	for ( const item of this ) {
		product *= item;
	}

	return product;
}

Array.prototype.sortByNumberAsc = function ( this: any[], property?: string ) {
	if ( property ) {
		return this.sort( ( a, b ): number => a[ property ] - b[ property ] );
	} else {
		return this.sort( ( a, b ): number => a - b );
	}
}

Array.prototype.sortByNumberDesc = function ( this: any[], property?: string ) {
	if ( property ) {
		return this.sort( ( a, b ): number => b[ property ] - a[ property ] );
	} else {
		return this.sort( ( a, b ): number => b - a );
	}
}

Array.prototype.max = function ( this: number[] ) {
	return max( this );
}

Array.prototype.min = function ( this: number[] ) {
	return min( this );
}

Array.prototype.pluck = function ( property: string | number | symbol ) {
	return this.map( item => item[ property ] )
}

Array.prototype.tee = function <T>( this: T[], callback: ( items: T[] ) => void ): T[] {
	callback( this );

	return this;
}

Array.prototype.prepend = function <T>( this: T[], ...items: T[] ) {
	this.unshift( ...items );

	return this;
}

Array.prototype.append = function <T>( this: T[], ...items: T[] ) {
	this.push( ...items );

	return this;
}

Array.prototype.same = function <T>( this: T[], other: T[] ) {
	return Array.same( this, other );
}

Array.prototype.pad = function <T>( this: T[], length: number, value: T | ( () => T ) ) {
	const extra = Math.max( length, this.length ) - this.length;

	if ( extra > 0 ) {
		this.push( ...Array.filled( extra, value ) );
	}

	return this;
}

Array.prototype.filterExists = function <T>( this: ( T | undefined | null )[] ): T[] {
	const items: T[] = [];

	for ( const item of this ) {
		if ( item === null || typeof item === 'undefined' ) continue;
		items.push( item );
	}

	return items;
}

Array.prototype.groupBy = function ( this, property ) {
	const groups = new Map();

	for ( const item of this ) {
		if ( !groups.has( item[ property ] ) ) {
			groups.set( item[ property ], [ item ] );
		} else {
			groups.get( item[ property ] )!.push( item );
		}
	}

	return groups;
}

Array.prototype.without = function <T>( this: T[], ...values: T[] ) {
	const remove = new Set( values );
	return this.filter( x => !remove.has( x ) );
}

Array.prototype.clone = function <T>( this: T[] ) {
	return [ ...this ];
}

Array.fromLines = function ( lines: string ) {
	return collect( lines.split( '\n' ) );
}

Array.fromChars = function ( input: string ) {
	return collect( input.split( '' ) );
}

Array.fromRange = function ( start: number, end: number, step = 1 ) {
	const output: number[] = [];

	for ( let i = start; i <= end; i += step ) {
		output.push( i );
	}

	return output;
}

Array.filled = function <T>( count: number, filler: T | ( ( value: undefined, index: number, array: undefined[] ) => T ) ) {
	const output = new Array( count );

	if ( filler instanceof Function ) {
		return output.fill( undefined ).map( filler );
	}

	return output.fill( filler );
}

Array.filledFromCoordinates = function <T>( coords: [ number, number ][], filler: ( coord: [ number, number ], index: number ) => T, blank?: T ): ( T | undefined )[][] {
	const grid: T[][] = [];

	for ( const [ i, [ x, y ] ] of coords.entries() ) {
		( grid[ y ] ??= [] )[ x ] = filler( [ x, y ], i );
	}

	const maxWidth = Math.max( ...grid.pluck( 'length' ).filter( Number ) )

	return new Array( grid.length ).fill( undefined )
		.map( ( _, rowIndex ) => Array.filled( maxWidth, ( _, i ) => grid[ rowIndex ]?.[ i ] ?? blank ) )
}

Array.intersect = function <T>( ...arrays: T[] ) {
	return arrays.intersectChunks();
}

Array.same = function <T>( a: T[], b: T[] ) {
	if ( a.length !== b.length ) return false;

	return a.every( ( aValue, index ) => {
		const bValue = b[ index ];

		if ( Array.isArray( aValue ) && Array.isArray( bValue ) ) {
			return Array.same( aValue, bValue );
		}

		return aValue === bValue;
	} );
}

Array.zipEntries = function <K, V>( keys: K[], values: V[], fill?: V ): [ K, V ][] {
	return ( [
		keys,
		values.pad( keys.length, fill ),
	] as any ).transpose();
}

Map.prototype.entriesArray = function () {
	return Array.from( this.entries() );
}

Map.prototype.keysArray = function () {
	return Array.from( this.keys() );
}

Map.prototype.valuesArray = function () {
	return Array.from( this.values() );
}

Map.prototype.increment = function <K>( this: Map<K, number>, key: K, amount = 1 ): Map<K, number> {
	this.set( key, ( this.get( key ) ?? 0 ) + amount );

	return this;
}

Map.prototype.decrement = function <K>( this: Map<K, number>, key: K, amount = 1 ): Map<K, number> {
	this.set( key, ( this.get( key ) ?? 0 ) - amount );

	return this;
}

Map.prototype.flip = function <K, V>( this: Map<K, V> ): Map<V, K> {
	const output = new Map<V, K>();

	for ( const [ k, v ] of this ) {
		output.set( v, k );
	}

	return output;
}

Map.zip = function <K, V>( keys: K[], values: V[], fill?: V ): Map<K, V> {
	return new Map( Array.zipEntries( keys, values, fill ) );
}

Set.prototype.entriesArray = function () {
	return Array.from( this.entries() );
}

Set.prototype.keysArray = function () {
	return Array.from( this.keys() );
}

Set.prototype.valuesArray = function () {
	return Array.from( this.values() );
}

Number.prototype.mod = function ( mod: number ) {
	"use strict";
	return ( ( this % mod ) + mod ) % mod;
};

export function collect<T>( input: Array<T> ): Array<T>;
export function collect<T>( ...input: Array<T> ): Array<T>;
export function collect<T>( ...args: any ): Array<T> {
	if ( args.length === 1 && Array.isArray( args[ 0 ] ) ) {
		return new Array<T>( ...args[ 0 ] );
	} else {
		return new Array<T>( ...args );
	}
}

// Can handle huge arrays
export function max( values: number[] ) {
	let length = values.length;
	let max = -Infinity;

	while ( length-- ) {
		max = values[ length ] > max ? values[ length ] : max;
	}

	return max;
}

// Can handle huge arrays
export function min( values: number[] ) {
	let length = values.length;
	let min = Infinity;

	while ( length-- ) {
		min = values[ length ] < min ? values[ length ] : min;
	}

	return min;
}
