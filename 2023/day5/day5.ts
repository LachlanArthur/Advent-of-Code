import '../../extensions.ts';
import { bench100 } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const [
		seedStr,
		...maps
	] = input.split( '\n\n' );

	const seeds = seedStr.match( /\d+/g )!.map( Number );

	const [
		seedSoil,
		soilFert,
		fertWater,
		waterLight,
		lightTemp,
		tempHumid,
		HumidLoc,
	] = maps.map( lines => {
		const data = lines
			.split( '\n' )
			.skipFirst( 1 )
			.map( line => {
				const [ dest, source, size ] = line.match( /\d+/g )!.map( Number )
				return [ source, source + size, dest ] as [ number, number, number ];
			} )
			.sortByNumberAsc( '0' )

		return function ( input: number ): number {
			const [ min, max, dest ] = data.find( ( [ min, max ] ) => min <= input && input <= max ) ?? [ 0, 0, 0 ];

			const offset = input - min;
			const output = dest + offset;

			return output;
		};
	} );

	return seeds
		.map( seedSoil )
		.map( soilFert )
		.map( fertWater )
		.map( waterLight )
		.map( lightTemp )
		.map( tempHumid )
		.map( HumidLoc )
		.min();

}

bench100( 'part 1 example', () => part1( example ), 35 );

bench100( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const [
		seedStr,
		...mapsStr
	] = input.split( '\n\n' );

	const seedRanges = seedStr.match( /\d+/g )!.map( Number ).chunks( 2 ) as [ number, number ][];

	const maps = mapsStr.map( lines => {
		const ranges = lines
			.split( '\n' )
			.skipFirst( 1 )
			.map( line => {
				const [ dest, source, size ] = line.match( /\d+/g )!.map( Number )
				return [ source, source + size - 1, dest, dest + size - 1 ] as [ number, number, number, number ];
			} )
			.sortByNumberAsc( '0' )

		return ranges;
	} )

	function getLowest( min: number, count: number ) {
		let ranges: [ number, number ][] = [
			[ min, min + count - 1 ],
		];

		for ( const map of maps ) {

			const oldRanges: ( [ number, number ] | undefined )[] = ranges;
			const newRanges: [ number, number ][] = [];

			for ( const [ inputMin, inputMax, outputMin, outputMax ] of map ) {
				const offset = outputMin - inputMin;

				for ( const [ i, range ] of oldRanges.entries() ) {
					if ( !range ) continue;

					const [ rangeMin, rangeMax ] = range;

					if ( rangeMax < inputMin || rangeMin > inputMax ) {
						// Range doesn't overlap
					} else if ( rangeMin >= inputMin && rangeMax <= inputMax ) {
						// Range is totally inside map
						newRanges.push( [ rangeMin + offset, rangeMax + offset ] );
						oldRanges[ i ] = undefined;
					} else if ( rangeMin === inputMin && rangeMax > inputMax ) {
						// Range starts at map min, extends past max
						newRanges.push( [ outputMin, outputMax ] );
						oldRanges[ i ] = [ inputMax + 1, rangeMax ];
					} else if ( rangeMin < inputMin && rangeMax === inputMax ) {
						// Range starts before map min, ends at max
						newRanges.push( [ outputMin, outputMax ] );
						oldRanges[ i ] = [ rangeMin, inputMin - 1 ];
					} else if ( rangeMin < inputMin && rangeMax > inputMax ) {
						// Range starts before map and ends after map
						newRanges.push( [ outputMin, outputMax ] );
						oldRanges[ i ] = undefined;
						oldRanges.push( [ rangeMin, inputMin - 1 ], [ inputMax + 1, rangeMax ] );
					} else if ( rangeMin < inputMin && rangeMax === inputMin ) {
						// Range overlaps by one
						newRanges.push( [ outputMin, outputMin ] );
						oldRanges[ i ] = [ rangeMin, rangeMax - 1 ];
					} else if ( rangeMin === inputMax && rangeMax > inputMax ) {
						// Range overlaps by one
						newRanges.push( [ outputMax, outputMax ] );
						oldRanges[ i ] = [ rangeMin + 1, rangeMax ];
					} else if ( rangeMin < inputMin && rangeMax > inputMin && rangeMax < inputMax ) {
						// Range extends past the map min
						newRanges.push( [ outputMin, rangeMax + offset ] );
						oldRanges[ i ] = [ rangeMin, inputMin - 1 ];
					} else if ( rangeMin > inputMin && rangeMin < inputMax && rangeMax > inputMax ) {
						// Range extends past the map max
						newRanges.push( [ rangeMin + offset, outputMax ] );
						oldRanges[ i ] = [ inputMax + 1, rangeMax ];
					} else {
						console.error( { inputMin, inputMax, rangeMin, rangeMax } );
						throw new Error();
					}

				}
			}

			ranges = [
				...oldRanges.filter( r => typeof r !== 'undefined' ) as [ number, number ][],
				...newRanges,
			];
		}

		return ranges.pluck( '0' ).min();
	}

	return seedRanges
		.map( ( [ a, b ] ) => getLowest( a, b ) )
		.min();
}

bench100( 'part 2 example', () => part2( example ), 46 );

bench100( 'part 2 input', () => part2( input ) );
