import "./extensions.ts";
import { renderBrailleGrid, renderGrid, renderSextantGrid } from "./debug.ts";
import { AStarGrid, Direction, GridVertex } from "./pathfinder.ts";

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

export function gridDistance( ax: number, ay: number, bx: number, by: number ): number {
	return Math.max( Math.abs( ax - bx ) + 1, Math.abs( ay - by ) + 1 );
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

	static fromString<T, C extends Cell<T>>( input: string, transform: ( char: string, x: number, y: number ) => T = char => char as T ) {
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

	vertices<T, V extends GridVertex<T>>( {
		createVertex,
		getEdgeValue
	}: {
		createVertex?: ( cell: Cell<T> ) => V,
		getEdgeValue?: ( source: V, destination: V, direction: Direction ) => number | null,
	} = {} ) {
		return AStarGrid.fromGrid(
			this,
			createVertex,
			getEdgeValue,
		).vertices;
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

export class CharGrid<Char extends string = string> {
	grid: Char[][];
	height: number;
	width: number;

	constructor( input: string | Char[][] ) {
		if ( typeof input === 'string' ) {
			this.grid = input.trim().linesAndChars() as Char[][];
		} else {
			this.grid = input;
		}
		this.width = this.grid[ 0 ].length;
		this.height = this.grid.length;
	}

	static flatten( grid: string[][] ): string {
		return grid.map( row => row.join( '' ) ).join( '\n' );
	}

	find( char: Char ): CharGridCell[] {
		return this.filter( c => c === char );
	}

	filter( predicate: ( char: Char, x: number, y: number ) => boolean ): CharGridCell[] {
		return this.flatMap(
			( char, x, y ) => predicate( char, x, y )
				? [ { x, y, char } ]
				: []
		)
	}

	flatMap<U>( callback: ( char: Char, x: number, y: number ) => U | ReadonlyArray<U> ): U[] {
		return this.grid.flatMap(
			( row, y ) => row.flatMap(
				( char, x ) => callback( char, x, y )
			)
		);
	}

	map<NewChar extends string>( callback: ( char: Char, x: number, y: number ) => string ): CharGrid<NewChar> {
		return new CharGrid<NewChar>(
			this.grid.map(
				( row, y ) => row.map(
					( char, x ) => callback( char, x, y ) as NewChar
				)
			)
		);
	}

	reduce<T>( callback: ( acc: T, char: Char, x: number, y: number ) => T, initial: T ): T {
		return this.grid.reduce(
			( acc, row, y ) => row.reduce(
				( acc, char, x ) => callback( acc, char, x, y ),
				acc
			),
			initial
		);
	}

	mapRows<NewChar extends string>( callback: ( row: Char[], y: number ) => NewChar[] ): CharGrid<NewChar> {
		return new CharGrid( this.getRows().map( callback ) );
	}

	mapCols<NewChar extends string>( callback: ( col: Char[], x: number ) => NewChar[] ): CharGrid<NewChar> {
		return new CharGrid( this.getCols().map( callback ).transpose() );
	}

	get( x: number, y: number ): Char | undefined {
		return this.grid[ y ]?.[ x ];
	}

	set( x: number, y: number, char: Char ) {
		this.grid[ y ] ??= [];
		this.grid[ y ][ x ] = char;
	}

	getRows() {
		return this.grid;
	}

	getCols() {
		return this.grid.transpose();
	}

	getRow( y: number ): Char[] {
		return [ ...this.grid[ y ] ];
	}

	getCol( x: number ): Char[] {
		return this.grid.pluck( x );
	}

	setRow( y: number, row: Char[] ) {
		this.grid[ y ] = [ ...row ];

		return this;
	}

	setCol( x: number, col: Char[] ) {
		for ( let y = 0; y < this.height; y++ ) {
			this.grid[ y ][ x ] = col[ y ];
		}

		return this;
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

	charCount() {
		return this.grid.flat().countUnique();
	}

	subgrid( x1: number, y1: number, x2: number, y2: number ): CharGrid<Char> {
		if ( x1 > x2 ) [ x1, x2 ] = [ x2, x1 ];
		if ( y1 > y2 ) [ y1, y2 ] = [ y2, y1 ];

		return new CharGrid(
			this.grid.slice( y1, y2 + 1 ).map( row => row.slice( x1, x2 + 1 ) )
		)
	}

	replaceChar<OldChar extends Char, NewChar extends string>( oldChar: OldChar, newChar: NewChar ): CharGrid<Exclude<Char, OldChar> | NewChar> {
		return this.map( char => char === oldChar ? newChar : char );
	}
}

export function polygonGridArea( coords: [ number, number ][] ): number {
	// Ensure the loop is closed
	if ( !coords.at( 0 )!.same( coords.at( -1 )! ) ) {
		coords.push( coords.at( 0 )! );
	}

	return coords.sliding( 2 )
		.map( ( [ [ ax, ay ], [ bx, by ] ] ) => ( ay + by ) * ( ax - bx ) )
		.sum() * 0.5
		// The area formula above doesn't account for the area of the cell border itself
		// Add half the perimeter
		+ ( polygonGridPerimeter( coords ) / 2 )
		// And a single extra cell for the missing corner
		+ 1;
}

export function polygonGridPerimeter( coords: [ number, number ][] ): number {
	// Ensure the loop is closed
	if ( !coords.at( 0 )!.same( coords.at( -1 )! ) ) {
		coords.push( coords.at( 0 )! );
	}

	return coords.sliding( 2 )
		.map( ( [ [ ax, ay ], [ bx, by ] ] ) => gridDistance( ax, ay, bx, by ) - 1 )
		.sum()
}
