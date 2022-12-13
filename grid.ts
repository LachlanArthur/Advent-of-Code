export class Cell<T> {
	#grid: Grid<T>;

	constructor(
		readonly x: number,
		readonly y: number,
		public value: T,
	) { }

	set grid( grid: Grid<T> ) { this.#grid = grid }

	get up(): Cell<T> | undefined { return this.#grid.getCell( this.x, this.y - 1 ) }
	get down(): Cell<T> | undefined { return this.#grid.getCell( this.x, this.y + 1 ) }
	get left(): Cell<T> | undefined { return this.#grid.getCell( this.x - 1, this.y ) }
	get right(): Cell<T> | undefined { return this.#grid.getCell( this.x + 1, this.y ) }

	get index(): number { return this.y * this.#grid.width + this.x }
}

export class Grid<T> {
	readonly height: number;
	readonly width: number;

	constructor( public cells: Cell<T>[][] ) {
		this.height = cells.length;
		this.width = cells[ 0 ]?.length ?? 0;

		cells.flat( 1 ).forEach( cell => cell.grid = this );
	}

	static fromString<T>( input: string, transform: ( char: string, x: number, y: number ) => T ) {
		return new this(
			input.split( '\n' )
				.map( ( line, y ) =>
					line.split( '' )
						.map( ( char, x ) => new Cell( x, y, transform( char, x, y ) ) )
				)
		)
	}

	getCell( x: number, y: number ): Cell<T> | undefined {
		return this.cells[ y ]?.[ x ];
	}

	values(): T[][] {
		return this.cells.map( row => row.pluck( 'value' ) );
	}

	flatCells(): Cell<T>[] {
		return this.cells.flat( 1 );
	}
}
