import { } from '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	return input
		.lines()
		.map( line => {
			const seqs: number[][] = [ line.match( /-?\d+/g )!.map( Number ) ];

			while ( !seqs.last()!.every( n => n === 0 ) ) {
				seqs.push( seqs.last()!.sliding( 2 ).map( ( [ a, b ] ) => b - a ) );
			}

			seqs.reverse();
			seqs.first()!.push( 0 );

			for ( let i = 1; i < seqs.length; i++ ) {
				const prevSeq = seqs[ i - 1 ];
				seqs[ i ].push( seqs[ i ].last()! + prevSeq.last()! );
			}

			return seqs.last()!.last()!;
		} )
		.sum()
}

bench( 'part 1 example', () => part1( example ), undefined );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	return input
		.lines()
		.map( line => {
			const seqs: number[][] = [ line.match( /-?\d+/g )!.map( Number ).reverse() ];

			while ( !seqs.last()!.every( n => n === 0 ) ) {
				seqs.push( seqs.last()!.sliding( 2 ).map( ( [ a, b ] ) => b - a ) );
			}

			seqs.reverse();
			seqs.first()!.push( 0 );

			for ( let i = 1; i < seqs.length; i++ ) {
				const prevSeq = seqs[ i - 1 ];
				seqs[ i ].push( seqs[ i ].last()! + prevSeq.last()! );
			}

			return seqs.last()!.last()!;
		} )
		.sum()
}

bench( 'part 2 example', () => part2( example ), undefined );

bench( 'part 2 input', () => part2( input ) );
