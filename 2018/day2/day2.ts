import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import example2 from './example2.ts';
import input from './input.ts';

function part1( input: string ): number {
	const counts = input
		.lines()
		.flatMap( line => line.split( '' )
			.countUnique()
			.valuesArray()
			.unique()
		)
		.countUnique()

	return counts.get( 2 )! * counts.get( 3 )!;
}

bench( 'part 1 example', () => part1( example ), 12 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ): string {
	return input
		.lines()
		.combinations( 2 )
		.map( ( [ lineA, lineB ] ) =>
			Array.zipEntries( lineA.chars(), lineB.chars() )
				.flatMap( ( [ charA, charB ] ) => charA === charB ? [ charA ] : [] )
				.join( '' )
		)
		.sortByNumberDesc( 'length' )
		.first()!;
}

bench( 'part 2 example', () => part2( example2 ), 'fgij' );

bench( 'part 2 input', () => part2( input ) );
