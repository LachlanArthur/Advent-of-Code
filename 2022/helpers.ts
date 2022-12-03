export const sum = ( numbers: number[] ) => numbers.reduce( ( p, v ) => p + v );

export const byNumberAsc = ( a: number, b: number ): number => a - b;
export const byNumberDesc = ( a: number, b: number ): number => b - a

export const chunker = <T>( size: number ) => ( chunks: T[][], line: T, i: number ) => {
	( chunks[ Math.floor( i / size ) ] ??= [] )[ i % size ] = line;
	return chunks;
}

export function findSharedLetter( [ first, ...rest ]: string[] ): string {
	return first
		.split( '' )
		.filter( letter => rest.every( item => item.includes( letter ) ) )[0]
}
