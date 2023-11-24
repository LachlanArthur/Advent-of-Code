import './extensions.ts';

export function renderCoords( coords: [ number, number ][], meta?: ( y: number ) => string ): void;
export function renderCoords( coordsWithChar: [ number, number, string ][], meta?: ( y: number ) => string ): void;
export function renderCoords( coords: [ number, number ][] | [ number, number, string ][], meta?: ( y: number ) => string ): void {
	const coordsWithChar: [ number, number, string ][] = [];
	let minX = Infinity,
		minY = Infinity,
		maxX = -Infinity,
		maxY = -Infinity;

	for ( const [ x, y, c ] of coords ) {
		coordsWithChar.push( [ x, y, c ?? '#' ] );

		if ( x < minX ) minX = x;
		if ( x > maxX ) maxX = x;
		if ( y < minY ) minY = y;
		if ( y > maxY ) maxY = y;
	}

	const width = maxX - minX + 1;
	const height = maxY - minY + 1;

	const grid: string[][] = Array.filled( height, () => Array.filled( width, () => '.' ) );

	for ( const [ x, y, c ] of coordsWithChar ) {
		grid[ y - minY ][ x - minX ] = c;
	}

	console.log( grid.map( ( row, y ) => row.join( '' ) + ( meta ? ' ' + meta( y ) : '' ) ).join( '\n' ) );
}

export function renderGrid<T>( grid: T[][], transform = ( value: T ) => String( value ) ) {
	console.log(
		grid.map( row => row
			.map( cell => transform( cell ) )
			.join( '' )
		)
			.join( '\n' )
	);
}

export function renderGridSpec( minX: number, maxX: number, minY: number, maxY: number, transform: ( x: number, y: number ) => string, meta?: ( y: number, row: string ) => string ) {
	const width = maxX - minX + 1;
	const height = maxY - minY + 1;

	console.log(
		Array.from(
			{ length: height },
			( _, y ) => {
				const row = Array.from(
					{ length: width },
					( _, x ) => transform( x + minX, y + minY )
				).join( '' );
				return row + ( meta ? ' ' + meta( y + minY, row ) : '' );
			}
		).join( '\n' )
	);
}

export function renderBrailleGrid<T>( grid: T[][], transform = ( value: T ) => Boolean( value ) ) {
	const height = grid.length;
	const width = grid[ 0 ].length;
	const lines: string[] = [];

	for ( let y = 0; y < height; y += 4 ) {
		const line: number[] = [];

		for ( let x = 0; x < width; x += 2 ) {
			// Braille Unicode range starts at U2800 (= 10240 decimal)
			// Each of the eight dots is mapped to a bit in a byte which
			// determines its position in the range.
			// https://en.wikipedia.org/wiki/Braille_Patterns
			line.push(
				10240
				+ ( ( transform( grid[ y + 3 ]?.[ x + 1 ] ) as any ) << 7 )
				+ ( ( transform( grid[ y + 3 ]?.[ x + 0 ] ) as any ) << 6 )
				+ ( ( transform( grid[ y + 2 ]?.[ x + 1 ] ) as any ) << 5 )
				+ ( ( transform( grid[ y + 1 ]?.[ x + 1 ] ) as any ) << 4 )
				+ ( ( transform( grid[ y + 0 ]?.[ x + 1 ] ) as any ) << 3 )
				+ ( ( transform( grid[ y + 2 ]?.[ x + 0 ] ) as any ) << 2 )
				+ ( ( transform( grid[ y + 1 ]?.[ x + 0 ] ) as any ) << 1 )
				+ ( ( transform( grid[ y + 0 ]?.[ x + 0 ] ) as any ) << 0 )
			);
		}

		lines.push( String.fromCharCode.apply( String, line ) );
	}

	console.log( lines.join( '\n' ) );
}

export function renderBrailleCoords( coords: [ number, number ][] ) {
	renderBrailleGrid( Array.filledFromCoordinates( coords, () => true, () => false ) as boolean[][] );
}

export function renderSextantGrid<T>( grid: T[][], transform = ( value: T ) => Boolean( value ) ) {
	const height = grid.length;
	const width = grid[ 0 ].length;
	const lines: string[] = [];

	for ( let y = 0; y < height; y += 3 ) {
		const line: number[] = [];

		for ( let x = 0; x < width; x += 2 ) {
			let value = 0
				+ ( ( transform( grid[ y + 2 ]?.[ x + 1 ] ) as any ) << 5 )
				+ ( ( transform( grid[ y + 2 ]?.[ x + 0 ] ) as any ) << 4 )
				+ ( ( transform( grid[ y + 1 ]?.[ x + 1 ] ) as any ) << 3 )
				+ ( ( transform( grid[ y + 1 ]?.[ x + 0 ] ) as any ) << 2 )
				+ ( ( transform( grid[ y + 0 ]?.[ x + 1 ] ) as any ) << 1 )
				+ ( ( transform( grid[ y + 0 ]?.[ x + 0 ] ) as any ) << 0 )

			if ( value === 0 ) {
				line.push( 32 ); // Space
			} else if ( value === 64 ) {
				line.push( 9608 ); // Full block
			} else if ( value === 21 ) {
				line.push( 9612 ); // Left half block
			} else if ( value === 42 ) {
				line.push( 9616 ); // Right half block
			} else {
				// Re-align due to replacements
				if ( value > 42 ) value--;
				if ( value > 21 ) value--;

				line.push( 55358, 57087 + value );
			}
		}

		lines.push( String.fromCharCode.apply( String, line ) );
	}

	console.log( lines.join( '\n' ) );
}
