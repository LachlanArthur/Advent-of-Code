export function renderBrailleGrid( grid: boolean[][] ) {
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
				+ ( +( grid[ y + 3 ]?.[ x + 1 ] ) << 7 )
				+ ( +( grid[ y + 3 ]?.[ x + 0 ] ) << 6 )
				+ ( +( grid[ y + 2 ]?.[ x + 1 ] ) << 5 )
				+ ( +( grid[ y + 1 ]?.[ x + 1 ] ) << 4 )
				+ ( +( grid[ y + 0 ]?.[ x + 1 ] ) << 3 )
				+ ( +( grid[ y + 2 ]?.[ x + 0 ] ) << 2 )
				+ ( +( grid[ y + 1 ]?.[ x + 0 ] ) << 1 )
				+ ( +( grid[ y + 0 ]?.[ x + 0 ] ) << 0 )
			);
		}

		lines.push( String.fromCharCode.apply( String, line ) );
	}

	console.log( lines.join( '\n' ) );
}
