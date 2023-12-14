import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { range, tetrahedralNumber, triangleNumber } from '../../maths.ts';

function part1( input: string ) {
	return input.lines()
		.map( line => {
			const [ layoutStr, groupStr ] = line.split( ' ' );
			const groups = groupStr.split( ',' ).map( Number );

			const unknownCount = ( layoutStr.match( /\?/g ) ?? [] ).length;
			const regex = new RegExp( groups.map( g => `#{${g}}` ).join( '\\.+' ) );

			const matches = new Set<string>();

			if ( regex.test( layoutStr ) ) {
				matches.add( layoutStr );
			}

			for ( let i = 0; i <= 2 ** unknownCount; i++ ) {
				const binary = i.toString( 2 ).padStart( unknownCount, '0' );
				let n = 0;
				const testLayout = layoutStr.replace( /\?/g, () => binary[ n++ ] === '1' ? '#' : '.' )
				if ( regex.test( testLayout ) ) {
					matches.add( testLayout );
					// console.log( { binary, testLayout, groups, match: regex.test( testLayout ), matches } );
				}
			}

			// console.log( { layoutStr, groups, matches } );

			return matches.size;
		} )
		.sum()
}

// bench( 'part 1 example', () => part1( example ), 21 );

// bench( 'part 1 input', () => part1( input ) );

// function part2( input: string, unfold: number ) {
// 	return input.lines()
// 		.map( line => {
// 			const [ layoutStr_, groupStr_ ] = line.split( ' ' );

// 			const layoutStr = Array.filled( unfold, layoutStr_ ).join( '?' );
// 			const groupStr = Array.filled( unfold, groupStr_ ).join( ',' );

// 			console.group( layoutStr );

// 			const groups = groupStr.split( ',' ).map( Number );

// 			const unknownCount = ( layoutStr.match( /\?/g ) ?? [] ).length;

// 			const minMatchSize = groups.sum() + groups.length - 1;

// 			const addBlanks = layoutStr.length - minMatchSize;

// 			if ( addBlanks === 0 ) {
// 				// No space for any groups to shift around, only one solution
// 				console.log( 'No wiggleroom, only 1 solution' );
// 				console.groupEnd();
// 				return 1;
// 			}

// 			const areas = layoutStr.split( /\.+/g ).filter( String );

// 			for ( const area of areas ) {

// 				const fillings: number[] = [];

// 			}

// 			// Identify the locked groups
// 			// - Find the largest group size
// 			// - check if there are any areas that can only

// 			console.log( { areas, groups, unknownCount, minMatchSize, addBlanks } );
// 			// TODO: Handle large groups
// 			console.error( '%clarge areas not implemented', 'color: red' );
// 			console.groupEnd();

// 			return 0;
// 		} )
// 		.sum()
// }

function part2( input: string, unfold: number ) {
	return input.lines()
		.map( line => {
			const [ layoutStr, groupStr ] = line.split( ' ' );

			const layout = `${layoutStr}?`.repeat( unfold ).slice( 0, -1 )
				.replaceAll( /^\.+|\.+$/g, '' )
				.replaceAll( /\.+/g, '.' );
			const groups = ( groupStr + ',' ).repeat( unfold ).slice( 0, -1 )
				.split( ',' )
				.map( Number );

			function variations( layout: string, groups: number[] ): number {
				console.group( { layout, groups } );

				let result = 0;

				const minMatchSize = groups.sum() + groups.length - 1;
				const maxStartIndex = layout.length - minMatchSize;

				console.log( { maxStartIndex } );

				if ( maxStartIndex === 0 ) {
					// No space for any groups to shift around, only one solution
					console.log( 'No wiggleroom, only 1 solution' );
					console.groupEnd();
					return 1;
				}

				for ( const [ groupIndex, group ] of groups.entries() ) {

					const positions: number[] = [];

					const nextGroups = groups.slice( groupIndex );
					const minMatchSize = nextGroups.sum() + nextGroups.length - 1;
					const maxStartIndex = substr.length - minMatchSize;

					for ( let i = 0; i <= maxStartIndex; i++ ) {
						const substr = layout.slice( i );

						if ( !( new RegExp( `^[?#]{${group}}(?!#)` ).test( substr ) ) ) {
							continue;
						}

						positions.push( i );

						if ( substr.at( 0 ) === '#' ) {
							// Cannot skip a hash
							break;
						}

						// const [ matchedGroup, ...nextGroups ] = groups;
						// const nextLayout = layout.slice( matchedGroup + 1 );

						// if ( nextGroups.length > 1 && nextLayout.length > 1 ) {
						// 	result = variations( nextLayout, nextGroups, result );
						// }
					}

					let [ minIndex, maxIndex ] = positions.minMax();

					console.log( 'Group matches range', { minIndex, maxIndex } );

					console.groupEnd();

					return result;
				}

			}


			console.groupEnd();

			return variations( layout, groups );
		} )
		.sum()
}

bench( 'part 1 example', () => part2( example, 1 ), 21 );

// bench( 'part 1 input', () => part2( input, 1 ) );

bench( 'part 2 example', () => part2( example, 5 ), 525152 );

// bench( 'part 2 input', () => part2( input, 5 ) );
