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
