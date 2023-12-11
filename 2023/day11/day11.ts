import { } from '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { manhattan } from '../../grid.ts';

type Point = [ number, number ];

function part1( input: string ) {
	const grid = input
		.linesAndChars()
		// Duplicate rows
		.flatMap( row => row.every( c => c === '.' ) ? [ row, row ] : [ row ] )
		// Duplicate cols
		.transpose()
		.flatMap( row => row.every( c => c === '.' ) ? [ row, row ] : [ row ] )
		.transpose()
		;

	const points: Point[] = [];

	for ( const [ y, row ] of grid.entries() ) {
		for ( const [ x, c ] of row.entries() ) {
			if ( c === '#' ) {
				points.push( [ x, y ] );
			}
		}
	}

	return points
		.combinations( 2 )
		.map( ( [ [ ax, ay ], [ bx, by ] ] ) => manhattan( ax, ay, bx, by ) )
		.sum();
}

bench( 'part 1 example', () => part1( example ), 374 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string, multiplier: number ) {
	const grid = input.linesAndChars();

	const emptyRows = grid.flatMap( ( row, y ) => row.every( c => c === '.' ) ? [ y ] : [] );
	const emptyCols = grid.transpose().flatMap( ( col, x ) => col.every( c => c === '.' ) ? [ x ] : [] );

	const points: Point[] = [];

	for ( const [ y, row ] of grid.entries() ) {
		for ( const [ x, c ] of row.entries() ) {
			if ( c === '#' ) {
				const newX = x + emptyCols.filter( col => col < x ).length * ( multiplier - 1 );
				const newY = y + emptyRows.filter( row => row < y ).length * ( multiplier - 1 );
				points.push( [ newX, newY ] );
			}
		}
	}

	return points
		.combinations( 2 )
		.map( ( [ [ ax, ay ], [ bx, by ] ] ) => manhattan( ax, ay, bx, by ) )
		.sum();
}

bench( 'part 2 example', () => part2( example, 10 ), 1030 );
bench( 'part 2 example', () => part2( example, 100 ), 8410 );

bench( 'part 2 input', () => part2( input, 1000000 ) );
