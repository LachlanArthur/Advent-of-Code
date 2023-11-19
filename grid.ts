import "./extensions.ts";

export function manhattan( ax: number, ay: number, bx: number, by: number ): number {
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

	constructor( public cells: C[][] ) {
		this.height = cells.length;
		this.width = cells[ 0 ]?.length ?? 0;

		cells.flat( 1 ).forEach( cell => cell.grid = this );
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
		return this.cells[ y ]?.[ x ];
	}

	setCell( cell: C ): this {
		( this.cells[ cell.y ] ??= [] )[ cell.x ] = cell;

		cell.grid = this;

		return this;
	}

	values(): T[][] {
		return this.cells.map( row => row.pluck( 'value' ) );
	}

	flatCells(): C[] {
		return this.cells.flat( 1 );
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
