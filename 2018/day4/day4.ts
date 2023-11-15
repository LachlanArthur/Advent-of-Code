import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { Interval } from '../../interval.ts';

interface Nap {
	guard: number,
	date: string,
	interval: Interval,
	duration: number,
}

function parse( input: string ): Nap[] {
	const naps: Nap[] = [];
	let currentGuard = NaN;
	let fellAsleepAt = NaN;

	for ( const line of input.lines().sort() ) {
		const { date, hour, minute, event } = line.match( /^\[\d{4}-(?<date>\d{2}-\d{2}) (?<hour>\d{2}):(?<minute>\d{2})\] (?<event>.+)$/ )!.groups!;
		const guardId = event.match( /^Guard #(\d+) begins shift$/ )?.[ 1 ];

		if ( guardId ) {
			currentGuard = parseInt( guardId );
		} else if ( event === 'falls asleep' ) {
			fellAsleepAt = parseInt( minute );
		} else if ( event === 'wakes up' ) {
			naps.push( {
				guard: currentGuard,
				date,
				interval: [ fellAsleepAt, parseInt( minute ) - 1 ],
				duration: parseInt( minute ) - fellAsleepAt,
			} );
			fellAsleepAt = NaN;
		} else {
			throw new Error( `Unknown event: ${event}` );
		}
	}

	return naps;
}

function part1( input: string ) {
	const naps = parse( input );

	const biggestNapper = naps
		.groupBy( 'guard' )
		.entriesArray()
		.map( ( [ id, guardNaps ] ) => ( {
			id,
			totalDuration: guardNaps.pluck( 'duration' ).sum(),
			minuteFrequencies: guardNaps.pluck( 'interval' )
				.flatMap( ( [ start, end ] ) => Array.fromRange( start, end, 1 ) )
				.countUnique()
				.flip(),
		} ) )
		.sortByNumberDesc( 'totalDuration' )
		.first()!;

	return biggestNapper.id * biggestNapper.minuteFrequencies.entriesArray()
		.sortByNumberDesc( '0' )
		.first()![ 1 ];
}

bench( 'part 1 example', () => part1( example ), 240 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const naps = parse( input );

	const consistentNapper = naps
		.groupBy( 'guard' )
		.entriesArray()
		.map( ( [ id, guardNaps ] ) => {
			const [ minute, frequency ] = guardNaps.pluck( 'interval' )
				.flatMap( ( [ start, end ] ) => Array.fromRange( start, end, 1 ) )
				.countUnique()
				.entriesArray()
				.sortByNumberDesc( '1' )
				.first()!;
			return ( {
				id,
				minute,
				frequency,
			} )
		} )
		.sortByNumberDesc( 'frequency' )
		.first()!;

	return consistentNapper.id * consistentNapper.minute;
}

bench( 'part 2 example', () => part2( example ), 4455 );

bench( 'part 2 input', () => part2( input ) );
