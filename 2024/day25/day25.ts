import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const [ locks, keys ] = input
		.split( '\n\n' )
		.groupBy( 0 )
		.valuesArray()
		.map( group => group
			.map( schematic => schematic
				.split( '\n' )
				.map( line => line.split( '' ) )
				.transpose()
				.map( column => column.countUnique().get( '#' )! )
			)
		);

	return keys.crossJoinLazy( locks )
		.filter( combination => combination
			.transpose()
			.every( pair => pair.sum() <= 7 )
		)
		.length
}

bench( 'part 1 example', () => part1( example ), 3 );

bench( 'part 1 input', () => part1( input ) );
