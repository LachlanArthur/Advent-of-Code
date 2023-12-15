import { renderBrailleGrid, renderGrid, renderSextantGrid } from "./debug.ts";
import "./extensions.ts";

/**
 * Shift all the coords as close to the origin as possible
 */
export function normaliseCoords( coords: [ number, number ][] ): [ number, number ][] {
	let minX = Infinity,
		minY = Infinity;

	for ( const [ x, y ] of coords ) {
		if ( x < minX ) minX = x;
		if ( y < minY ) minY = y;
	}

	return coords.map( ( [ x, y ] ) => [ x - minX, y - minY ] );
}

export const manhattan = manhattanFlat;

export function manhattanPair( pair: [ [ number, number ], [ number, number ] ] ): number {
	return Math.abs( pair[ 0 ][ 0 ] - pair[ 1 ][ 0 ] ) + Math.abs( pair[ 0 ][ 1 ] - pair[ 1 ][ 1 ] );
}

export function manhattanPoints( a: [ number, number ], b: [ number, number ] ): number {
	return Math.abs( a[ 0 ] - b[ 0 ] ) + Math.abs( a[ 1 ] - b[ 1 ] );
}

export function manhattanFlat( ax: number, ay: number, bx: number, by: number ): number {
	return Math.abs( ax - bx ) + Math.abs( ay - by );
}

export class Cell<T> {
	#grid!: Grid<T, Cell<T>>;

	constructor(
		readonly x: number,
		readonly y: number,
		public value: T,
	) { }

	get grid() { return this.#grid }
	set grid( grid: Grid<T, Cell<T>> ) { this.#grid = grid }

	get up(): Cell<T> | undefined { return this.grid.getCell( this.x, this.y - 1 ) }
	get down(): Cell<T> | undefined { return this.grid.getCell( this.x, this.y + 1 ) }
	get left(): Cell<T> | undefined { return this.grid.getCell( this.x - 1, this.y ) }
	get right(): Cell<T> | undefined { return this.grid.getCell( this.x + 1, this.y ) }

	get index(): number { return this.y * this.grid.width + this.x }

	aroundSquare( radius: number ): Cell<T>[] {
		return Array
			.from( pointsAroundSquare( this.x, this.y, radius ), point => this.grid.getCell( ...point ) )
			.filter( Boolean ) as Cell<T>[];
	}

	aroundManhattan( radius: number ): Cell<T>[] {
		return Array
			.from( pointsAroundManhattan( this.x, this.y, radius ), point => this.grid.getCell( ...point ) )
			.filter( Boolean ) as Cell<T>[];
	}
}

export class Grid<T, C extends Cell<T>> {
	readonly height: number;
	readonly width: number;
	cells: Map<number, Map<number, C>> = new Map();

	constructor( cells: C[][] ) {
		this.height = cells.length;
		this.width = cells[ 0 ]?.length ?? 0;

		cells.flat( 1 ).forEach( cell => cell.grid = this );

		for ( const row of cells ) {
			for ( const cell of row ) {
				this.setCell( cell );
			}
		}
	}

	static fromString<T, C extends Cell<T>>( input: string, transform: ( char: string, x: number, y: number ) => T ) {
		return new this<T, C>(
			input.split( '\n' )
				.map( ( line, y ) =>
					line.split( '' )
						.map( ( char, x ) => new Cell( x, y, transform( char, x, y ) ) as C )
				)
		)
	}

	getCell( x: number, y: number ): C | undefined {
		return this.cells.get( y )?.get( x );
	}

	setCell( cell: C ): this {
		if ( !this.cells.has( cell.y ) ) {
			this.cells.set( cell.y, new Map() );
		}

		this.cells.get( cell.y )!.set( cell.x, cell );

		cell.grid = this;

		return this;
	}

	findCell( predicate: ( cell: C ) => boolean ): C | undefined {
		return this.flatCells().find( predicate );
	}

	toArray(): C[][] {
		return this.cells.valuesArray().map( row => row.valuesArray() );
	}

	values(): T[][] {
		return this.toArray().map( row => row.pluck( 'value' ) );
	}

	flatCells(): C[] {
		return this.toArray().flat( 1 );
	}

	render( transform = ( cell: C ) => String( cell.value ) ) {
		renderGrid( this.toArray(), transform );
	}

	renderBraille( transform = ( cell: C ) => Boolean( cell.value ) ) {
		renderBrailleGrid( this.toArray(), transform );
	}

	renderSextant( transform = ( cell: C ) => Boolean( cell.value ) ) {
		renderSextantGrid( this.toArray(), transform );
	}
}

/**
 * Generates a ring of points in a square around a centre point
 *
 * Example rings at radius 1 and 2:
 * ```
 *          2 2 2 2 2
 * 1 1 1    2       2
 * 1 x 1    2   x   2
 * 1 1 1    2       2
 *          2 2 2 2 2
 * ```
 */
export function* pointsAroundSquare( x: number, y: number, radius: number ): Generator<[ number, number ], void, unknown> {
	// North
	for ( let x_ = x - radius + 1; x_ <= x + radius; x_++ ) {
		yield [ x_, y - radius ];
	}

	// East
	for ( let y_ = y - radius + 1; y_ <= y + radius; y_++ ) {
		yield [ x + radius, y_ ];
	}

	// South
	for ( let x_ = x + radius - 1; x_ >= x - radius; x_-- ) {
		yield [ x_, y + radius ];
	}

	// West
	for ( let y_ = y + radius - 1; y_ >= y - radius; y_-- ) {
		yield [ x - radius, y_ ];
	}
}

/**
 * Generates a ring of points around a centre point using manhattan distance (diamond)
 *
 * Example rings:
 * ```
 *                2          3   3      4       4
 *     1        2   2      3       3
 *   1 x 1    2   x   2        x            x
 *     1        2   2      3       3
 *                2          3   3      4       4
 * ```
 */
export function* pointsAroundManhattan( x: number, y: number, radius: number ): Generator<[ number, number ], void, unknown> {
	if ( radius === 0 ) {
		yield [ x, y ];
		return;
	}

	// Northeast
	for ( let i = 0; i < radius; i++ ) {
		yield [ x + i, y - radius + i ];
	}

	// Southeast
	for ( let i = 0; i < radius; i++ ) {
		yield [ x + radius - i, y + i ];
	}

	// Southwest
	for ( let i = 0; i < radius; i++ ) {
		yield [ x - i, y + radius - i ];
	}

	// Northwest
	for ( let i = 0; i < radius; i++ ) {
		yield [ x - radius + i, y - i ];
	}
}

export function* pointsAroundManhattan3d( x: number, y: number, z: number, radius: number ): Generator<[ number, number, number ], void, unknown> {
	if ( radius === 0 ) {
		yield [ x, y, z ];
		return;
	}

	// Upper layers
	for ( let zLayer = -radius; zLayer < 0; zLayer++ ) {
		for ( const coord of pointsAroundManhattan( x, y, radius + zLayer ) ) {
			yield [ coord[ 0 ], coord[ 1 ], z + zLayer ];
		}
	}

	// Middle layer
	for ( const coord of pointsAroundManhattan( x, y, radius ) ) {
		yield [ coord[ 0 ], coord[ 1 ], z ];
	}

	// Lower layers
	for ( let zLayer = 1; zLayer <= radius; zLayer++ ) {
		for ( const coord of pointsAroundManhattan( x, y, radius - zLayer ) ) {
			yield [ coord[ 0 ], coord[ 1 ], z + zLayer ];
		}
	}
}

export function* generateCoordinates( minX: number, minY: number, maxX: number, maxY: number ): Generator<[ number, number ], void, unknown> {
	for ( let y = minY; y <= maxY; y++ ) {
		for ( let x = minX; x <= maxX; x++ ) {
			yield [ x, y ];
		}
	}
}

export function cellIndexFromCoordinates( x: number, y: number, minX: number, minY: number, maxX: number, maxY: number ): number {
	return ( y - minY ) * ( maxX - minX + 1 ) + ( x - minX );
}

type CharGridCell = {
	x: number,
	y: number,
	char: string,
};

export class CharGrid {
	grid: string[][];
	height: number;
	width: number;

	constructor( input: string | string[][] ) {
		if ( typeof input === 'string' ) {
			this.grid = input.trim().linesAndChars();
		} else {
			this.grid = input;
		}
		this.width = this.grid[ 0 ].length;
		this.height = this.grid.length;
	}

	static flatten( grid: string[][] ): string {
		return grid.map( row => row.join( '' ) ).join( '\n' );
	}

	find( char: string ): CharGridCell[] {
		return this.filter( c => c === char );
	}

	filter( predicate: ( char: string, x: number, y: number ) => boolean ): CharGridCell[] {
		return this.flatMap(
			( char, x, y ) => predicate( char, x, y )
				? [ { x, y, char } ]
				: []
		)
	}

	flatMap<U>( callback: ( char: string, x: number, y: number ) => U | ReadonlyArray<U> ): U[] {
		return this.grid
			.flatMap( ( row, y ) => row
				.flatMap( ( char, x ) => callback( char, x, y ) )
			);
	}

	get( x: number, y: number ): string | undefined {
		return this.grid[ y ]?.[ x ];
	}

	set( x: number, y: number, char: string ) {
		this.grid[ y ] ??= [];
		this.grid[ y ][ x ] = char;
	}

	rows() {
		return this.grid;
	}

	cols() {
		return this.grid.transpose();
	}

	row( y: number ): string[] {
		return this.grid[ y ];
	}

	col( x: number ): string[] {
		return this.grid.pluck( x );
	}

	toString() {
		return CharGrid.flatten( this.grid );
	}

	transpose() {
		return new CharGrid( this.grid.transpose() );
	}

	flipX() {
		return new CharGrid( this.grid.map( row => row.toReversed() ) );
	}

	flipY() {
		return new CharGrid( this.grid.clone().toReversed() )
	}

	rotateClockwise() {
		return this.transpose().flipX();
	}

	rotateAnticlockwise() {
		return this.transpose().flipY();
	}

	rotate180() {
		return this.flipX().flipY();
	}
}
