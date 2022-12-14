export function charRange(
	startIndex: number,
	...ranges: string[]
): Map<string, number> {
	const chars = new Map<string, number>();
	let index = startIndex;

	ranges
		.map( range => range.split( '-' ) as [ string, string | undefined ] )
		.forEach( ( [ start, end ] ) => {
			const startCode = start.charCodeAt( 0 );

			if ( end ) {
				const endCode = end.charCodeAt( 0 );

				for ( let i = startCode; i <= endCode; i++ ) {
					chars.set( String.fromCharCode( i ), index++ );
				}
			} else {
				chars.set( start, index++ );
			}
		} )

	return chars;
}
