import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { gridDistance, polygonGridArea } from '../../grid.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const directionOffets = {
		'U': [ 0, -1 ],
		'D': [ 0, 1 ],
		'L': [ -1, 0 ],
		'R': [ 1, 0 ],
	}

	const coords: [ number, number ][] = [
		[ 0, 0 ],
	];

	for ( const line of input.lines() ) {
		const [ x, y ] = coords.at( -1 )!;
		const [ direction, lengthStr ] = line.split( ' ' );
		const length = Number( lengthStr );

		const [ offsetX, offsetY ] = directionOffets[ direction as keyof typeof directionOffets ];

		coords.push( [
			x + ( offsetX * length ),
			y + ( offsetY * length ),
		] );
	}

	return polygonGridArea( coords );
}

bench( 'part 1 example', () => part1( example ), 62 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const directionOffetsHex = {
		'3': [ 0, -1 ],
		'1': [ 0, 1 ],
		'2': [ -1, 0 ],
		'0': [ 1, 0 ],
	}

	const coords: [ number, number ][] = [
		[ 0, 0 ],
	];

	for ( const line of input.lines() ) {
		const [ x, y ] = coords.at( -1 )!;
		const [ , , colour ] = line.split( ' ' );
		const lengthHex = colour.slice( 2, 7 );
		const directionHex = colour.slice( 7, 8 );
		const length = parseInt( lengthHex, 16 );

		const [ offsetX, offsetY ] = directionOffetsHex[ directionHex as keyof typeof directionOffetsHex ];

		coords.push( [
			x + ( offsetX * length ),
			y + ( offsetY * length ),
		] );
	}

	return polygonGridArea( coords );
}

bench( 'part 2 example', () => part2( example ), 952408144115 );

bench( 'part 2 input', () => part2( input ) );
