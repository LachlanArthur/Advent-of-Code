type KeysWithValuesOfType<T, V> = keyof { [ P in keyof T as T[ P ] extends V ? P : never ]: P } & keyof T;

declare global {
	interface Array<T> {
		log( message?: string ): this;
		chunks( size: number, leftovers?: boolean ): T[][];
		sliding( size: number, skip?: number, leftovers?: boolean ): T[][];
		unique(): T[];
		uniqueBy<K extends keyof T>( property: K ): T[];
		uniqueBy( callback: ( item: T ) => any ): T[];
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
		mean( this: number[] ): number;
		median( this: number[] ): number;
		/**
		 * Standard deviation
		 */
		stdDev( this: number[] ): number;
		sortByNumberAsc( this: number[] ): T[];
		sortByNumberDesc( this: number[] ): T[];
		sortByNumberAsc<T, K extends KeysWithValuesOfType<T, number>>( this: T[], property: K ): T[];
		sortByNumberDesc<T, K extends KeysWithValuesOfType<T, number>>( this: T[], property: K ): T[];
		sortByNumberAsc<T>( this: T[], callback: ( item: T ) => number ): T[];
		sortByNumberDesc<T>( this: T[], callback: ( item: T ) => number ): T[];
		max( this: number[] ): number;
		min( this: number[] ): number;
		minMax( this: number[] ): [ number, number ];
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
		looping<T>( this: T[] ): Generator<T, never, undefined>;
		combinations<T>( this: T[], size: number, unique?: boolean ): T[][];
		countUnique<T>( this: T[] ): Map<T, number>;
		countUnique<T, K extends keyof T>( this: T[], property: K ): Map<K, number>;
		first<T>( this: T[] ): T | undefined;
		last<T>( this: T[] ): T | undefined;
		maxBy<T, K extends KeysWithValuesOfType<T, number>>( this: T[], property: K ): T | undefined;
		minBy<T, K extends KeysWithValuesOfType<T, number>>( this: T[], property: K ): T | undefined;
		maxBy<T>( this: T[], callback: ( item: T ) => number ): T | undefined;
		minBy<T>( this: T[], callback: ( item: T ) => number ): T | undefined;
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
		log( message?: string ): this;
		entriesArray(): [ K, V ][];
		keysArray(): K[];
		valuesArray(): V[];
		increment<K>( this: Map<K, number>, key: K, amount?: number ): Map<K, number>;
		decrement<K>( this: Map<K, number>, key: K, amount?: number ): Map<K, number>;
		flip<K, V>( this: Map<K, V> ): Map<V, K>;
		push<K, V>( this: Map<K, V[]>, key: K, value: V ): Map<K, V[]>;
		pop<K, V>( this: Map<K, V[]>, key: K ): V | undefined;
		unshift<K, V>( this: Map<K, V[]>, key: K, value: V ): Map<K, V[]>;
		shift<K, V>( this: Map<K, V[]>, key: K ): V | undefined;
		sortBy<K, V>( this: Map<K, V>, callback: ( ( item: V, key: K, index: number ) => number ) ): Map<K, V>;
		sortByKeyAsc<V>( this: Map<number, V> ): Map<number, V>;
		sortByKeyDesc<V>( this: Map<number, V> ): Map<number, V>;
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

	interface String {
		lines(): string[];
		chars(): string[];
		charCodes(): number[];
		linesToNumbers(): number[];
	}

	interface Iterator<T> {
		runningTotal( this: IterableIterator<number> ): IterableIterator<number>;
		firstRepeated( this: IterableIterator<T> ): T | null;
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

Array.prototype.chunks = function <T>( this: T[], size: number, leftovers = true ) {
	return this.sliding( size, size, leftovers );
}

Array.prototype.sliding = function <T>( this: T[], size: number, slide = 1, leftovers = false ) {
	if ( slide < 1 ) {
		throw new RangeError( 'Slide value must be greater than zero' );
	}

	const windowCount = Math.max( 0, Math.floor( ( this.length - size ) / slide ) ) + 1;

	const output: T[][] = Array.from( { length: windowCount } );

	for ( let windowIndex = 0; windowIndex < windowCount; windowIndex++ ) {
		output[ windowIndex ] = Array.from( { length: size } );

		for ( let itemIndex = 0; itemIndex < size; itemIndex++ ) {
			const index = windowIndex * slide + itemIndex;
			if ( index >= this.length ) break;
			output[ windowIndex ][ itemIndex ] = this[ index ];
		}
	}

	if ( leftovers ) {
		const leftoverIndex = windowCount * slide;
		if ( leftoverIndex < this.length ) {
			output.push( this.slice( leftoverIndex ) );
		}
	}

	return output;
}

Array.prototype.unique = function <T>( this: T[] ) {
	return Array.from( new Set( this ) );
}

Array.prototype.uniqueBy = function <T, K extends keyof T>( this: T[], property: K | ( ( item: T ) => any ) ) {
	const seen = new Set();

	return this.filter( item => {
		const key = typeof property === 'function' ? property( item ) : item[ property ];

		if ( seen.has( key ) ) {
			return false;
		}

		seen.add( key );

		return true;
	} );
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

	for ( const chunk of this.sliding( intoHands, 0, leftovers ) ) {
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

Array.prototype.mean = function ( this: number[] ): number {
	return this.sum() / this.length;
}

Array.prototype.median = function ( this: number[] ): number {
	return this.sortByNumberAsc()[ Math.floor( this.length / 2 ) ];
}

Array.prototype.stdDev = function ( this: number[] ): number {
	const mean = this.mean();

	return Math.sqrt( this.map( x => ( x - mean ) ** 2 ).mean() );
}

Array.prototype.sortByNumberAsc = function <T>( this: T[], property?: string | ( ( item: T ) => number ) ) {
	if ( typeof property === 'function' ) {
		return this.toSorted( ( a, b ): number => property( a ) - property( b ) );
	} else if ( property ) {
		return this.toSorted( ( a: any, b: any ): number => a[ property ] - b[ property ] );
	} else {
		return this.toSorted( ( a: any, b: any ): number => a - b );
	}
}

Array.prototype.sortByNumberDesc = function <T>( this: T[], property?: string | ( ( item: T ) => number ) ) {
	if ( typeof property === 'function' ) {
		return this.toSorted( ( a, b ): number => property( b ) - property( a ) );
	} else if ( property ) {
		return this.toSorted( ( a: any, b: any ): number => b[ property ] - a[ property ] );
	} else {
		return this.toSorted( ( a: any, b: any ): number => b - a );
	}
}

Array.prototype.max = function ( this: number[] ) {
	return max( this );
}

Array.prototype.min = function ( this: number[] ) {
	return min( this );
}

Array.prototype.minMax = function ( this: number[] ) {
	return [ min( this ), max( this ) ];
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

Array.prototype.looping = function* <T>( this: T[] ) {
	while ( true ) {
		yield* this;
	}
}

Array.prototype.combinations = function <T>( this: T[], size: number, unique = true ): T[][] {
	if ( this.length === 0 ) return [ [] ];

	const items = unique ? this.unique() : this;
	if ( items.length === 1 ) return [ items ];

	if ( size === 1 ) return items.map( item => [ item ] );

	const output: T[][] = [];

	for ( const [ index, item ] of items.entries() ) {
		const rest = items.slice( index + 1 );
		if ( rest.length === 0 ) continue;
		const combinations = rest.combinations( size - 1, false );

		for ( const combination of combinations ) {
			output.push( [ item, ...combination ] );
		}
	}

	return output;
}

Array.prototype.countUnique = function <T, K extends keyof T>( this: T[], property?: K ) {
	if ( property ) {
		const counts = new Map<T[ K ], number>();

		for ( const item of this ) {
			counts.increment( item[ property ] );
		}

		return counts;
	}

	const counts = new Map<T, number>();

	for ( const item of this ) {
		counts.increment( item );
	}

	return counts;
}

Array.prototype.first = function <T>( this: T[] ): T | undefined {
	return this.at( 0 );
}

Array.prototype.last = function <T>( this: T[] ): T | undefined {
	return this.at( -1 );
}

Array.prototype.maxBy = function <T, K extends KeysWithValuesOfType<T, number>>( this: T[], property: K | ( ( item: T ) => number ) ) {
	return this.sortByNumberDesc( property as any )[ 0 ];
}

Array.prototype.minBy = function <T, K extends KeysWithValuesOfType<T, number>>( this: T[], property: K | ( ( item: T ) => number ) ) {
	return this.sortByNumberAsc( property as any )[ 0 ];
}

Array.fromLines = function ( lines: string ) {
	return lines.lines();
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

Map.prototype.log = function <K, V>( this: Map<K, V>, message?: string ) {
	if ( message ) {
		console.group( message );
	}

	console.log( this );

	if ( message ) {
		console.groupEnd();
	}

	return this;
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

Map.prototype.push = function <K, V>( this: Map<K, V[]>, key: K, ...values: V[] ): Map<K, V[]> {
	if ( !this.has( key ) ) {
		return this.set( key, values );
	}

	this.get( key )!.push( ...values );

	return this;
}

Map.prototype.pop = function <K, V>( this: Map<K, V[]>, key: K ): V | undefined {
	const items = this.get( key );
	const value = items?.pop();

	if ( items?.length === 0 ) {
		this.delete( key );
	}

	return value;
}

Map.prototype.unshift = function <K, V>( this: Map<K, V[]>, key: K, ...values: V[] ): Map<K, V[]> {
	if ( !this.has( key ) ) {
		return this.set( key, values );
	}

	this.get( key )!.unshift( ...values );

	return this;
}

Map.prototype.shift = function <K, V>( this: Map<K, V[]>, key: K ): V | undefined {
	const items = this.get( key );
	const value = items?.shift();

	if ( items?.length === 0 ) {
		this.delete( key );
	}

	return value;
}

Map.prototype.sortBy = function <K, V>( this: Map<K, V>, callback: ( ( item: V, key: K, index: number ) => number ) ): Map<K, V> {
	return new Map(
		this
			.entriesArray()
			.entriesArray()
			.toSorted( ( [ indexA, [ keyA, valueA ] ], [ indexB, [ keyB, valueB ] ] ) => callback( valueA, keyA, indexA ) - callback( valueB, keyB, indexB ) )
			.pluck( '1' )
	);
}

Map.prototype.sortByKeyAsc = function <V>( this: Map<number, V> ) {
	return this.sortBy( ( _, key ) => key );
}

Map.prototype.sortByKeyDesc = function <V>( this: Map<number, V> ) {
	return this.sortBy( ( _, key ) => -key );
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

String.prototype.lines = function ( this: string ) {
	return this.split( '\n' );
}

String.prototype.chars = function ( this: string ) {
	return this.split( '' );
}

String.prototype.charCodes = function ( this: string ) {
	return Array.from( new TextEncoder().encode( this ) );
}

String.prototype.linesToNumbers = function () {
	return this.lines().map( Number );
}

const IteratorPrototype = Object.getPrototypeOf( Object.getPrototypeOf( [][ Symbol.iterator ]() ) );

IteratorPrototype.runningTotal = function* ( this: IterableIterator<number> ) {
	let total = 0;

	for ( const item of this ) {
		total += item;
		yield total;
	}
}

IteratorPrototype.firstRepeated = function <T>( this: IterableIterator<T> ) {
	const seen = new Set<T>();

	for ( const item of this ) {
		if ( seen.has( item ) ) {
			return item;
		}

		seen.add( item );
	}

	return null;
}

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
