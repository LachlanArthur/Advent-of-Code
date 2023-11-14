import { bench } from '../../bench.ts';
import '../../extensions.ts';

import example from './example.ts';
import input from './input.ts';

function parse( input: string ) {
	const fileSizes = new Map<string, number>();
	let currentPath = '';

	for ( const section of input.split( '$ ' ).filter( String ) ) {
		const lines = section.split( '\n' );
		const [ command, params ] = lines.shift()!.split( ' ' );
		const output = lines.filter( String );

		switch ( command ) {

			case 'cd':
				switch ( params ) {
					default: currentPath += params + '/'; break;
					case '/': currentPath = '/'; break;
					case '..': currentPath = currentPath.replace( /[^\/]+\/$/, '' ); break;
				}
				break;

			case 'ls':
				for ( const entry of output ) {
					if ( entry.startsWith( 'dir ' ) ) {
						continue;
					} else {
						const [ filesizeString, filename ] = entry.split( ' ' );

						fileSizes.set( currentPath + filename, parseInt( filesizeString ) );
					}
				}
				break;

		}
	}

	return {
		fileSizes,
		directorySizes: directorySizes( fileSizes ),
	};
}

function directorySizes( filesizes: Map<string, number> ): Map<string, number> {
	const directories = new Set<string>();

	for ( const [ file ] of filesizes ) {
		let parts = file.split( '/' );
		while ( parts.pop() ) {
			directories.add( parts.join( '/' ) + '/' );
		}
	}

	const directorySizes = new Map<string, number>(
		directories.valuesArray()
			.map( dir => [ dir, 0 ] )
	);

	for ( const [ file, fileSize ] of filesizes ) {
		for ( const [ dir ] of directorySizes ) {
			if ( file.startsWith( dir ) ) {
				directorySizes.set( dir, directorySizes.get( dir )! + fileSize );
			}
		}
	}

	return directorySizes;
}

function part1( input: string ): number {
	const {
		fileSizes,
		directorySizes,
	} = parse( input );

	// console.table( filesizes );
	// console.table( directorySizes );

	return directorySizes.entriesArray()
		.filter( ( [ path, size ] ) => size <= 100000 )
		.map( ( [ path, size ] ) => size )
		.sum()
}

bench( 'part 1 example', () => part1( example ), 95437 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const {
		fileSizes,
		directorySizes,
	} = parse( input );

	// console.table( filesizes );
	// console.table( directorySizes );

	const driveSize = 70000000;
	const needed = 30000000;
	const used = directorySizes.get( '/' )!;
	const unused = driveSize - used;
	const toDelete = needed - unused;

	const largeDirs = directorySizes.entriesArray()
		.filter( ( [ path, size ] ) => size >= toDelete );

	return largeDirs
		.sort( ( [ pathA, sizeA ], [ pathB, sizeB ] ) => sizeA - sizeB )[ 0 ][ 1 ];

}

bench( 'part 2 example', () => part2( example ), 24933642 );

bench( 'part 2 input', () => part2( input ) );
