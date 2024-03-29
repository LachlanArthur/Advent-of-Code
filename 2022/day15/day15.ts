import '../../extensions.ts';
import { Interval, combineIntervals } from '../../interval.ts';
import { manhattan } from '../../grid.ts';

import example from './example.ts';
import input from './input.ts';
import { bench } from '../../bench.ts';

class Sensor {
	public minRange: number;
	public minX: number;
	public maxX: number;
	public minY: number;
	public maxY: number;

	constructor(
		public x: number,
		public y: number,
		public beaconX: number,
		public beaconY: number,
	) {
		this.minRange = manhattan( x, y, beaconX, beaconY );
		this.minX = this.x - this.minRange;
		this.maxX = this.x + this.minRange;
		this.minY = this.y - this.minRange;
		this.maxY = this.y + this.minRange;
	}

	inRange( x: number, y: number, allowSelf = false ): boolean {
		if ( !allowSelf && ( ( x === this.x && y === this.y ) || ( x === this.beaconX && y === this.beaconY ) ) ) {
			return false;
		}

		return manhattan( x, y, this.x, this.y ) <= this.minRange;
	}

	xRange( y: number ): Interval | undefined {
		const rangeAtY = this.minRange - Math.abs( y - this.y );

		if ( rangeAtY < 0 ) return undefined;

		return [
			this.x - rangeAtY,
			this.x + rangeAtY,
		];
	}
}

function parse( input: string ) {
	return input
		.match( /x=(?<x>-?\d+), y=(?<y>-?\d+)/mg )!
		.map( xy => xy.match( /x=(?<x>-?\d+), y=(?<y>-?\d+)/ )!.groups! as Record<'x' | 'y', string> )
		.chunks( 2 )
		.map( ( [ s, b ] ) => new Sensor(
			parseInt( s.x ),
			parseInt( s.y ),
			parseInt( b.x ),
			parseInt( b.y ),
		) )
}

function part1( input: string, searchRow: number ) {
	const sensors = parse( input );

	const minX = sensors.pluck( 'minX' ).min();
	const maxX = sensors.pluck( 'maxX' ).max();

	let inside = 0;
	for ( let x = minX; x <= maxX; x++ ) {
		if ( sensors.some( sensor => sensor.inRange( x, searchRow ) ) ) {
			inside++;
		}
	}

	return inside;
}

bench( 'part 1 example', () => part1( example, 10 ), 26 );

bench( 'part 1 input', () => part1( input, 2000000 ) );

function part2( input: string, searchRange: number ) {
	const sensors = parse( input );

	const boundingIntervalA: Interval = [ 0, 0 ];
	const boundingIntervalB: Interval = [ searchRange, searchRange ];

	for ( let y = 0; y <= searchRange; y++ ) {
		const ranges = combineIntervals(
			[
				boundingIntervalA,
				...sensors
					.map( sensor => sensor.xRange( y ) )
					.filterExists(),
				boundingIntervalB,
			],
			true,
		);

		if ( ranges.length === 1 ) {
			continue;
		}

		if ( ranges.length === 2 ) {
			const x = ranges[ 0 ][ 1 ] + 1;
			// console.log( 'Found hole at', { x, y } );
			return x * 4000000 + y;
		}

		throw new Error( 'Too many ranges' );
	}

	throw new Error( 'Not found' );
}

bench( 'part 2 example', () => part2( example, 20 ), 56000011 );

bench( 'part 2 input', () => part2( input, 4000000 ) );
