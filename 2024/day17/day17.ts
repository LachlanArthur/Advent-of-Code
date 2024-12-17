import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example1.ts';
import example2 from './example2.ts';
import input from './input.ts';
import { range } from '../../maths.ts';

function run( registers: number[], program: number[] ) {
	function combo( operand: number ): number {
		switch ( operand ) {
			case 0:
			case 1:
			case 3: return operand;
			case 4: return registers[ 0 ];
			case 5: return registers[ 1 ];
			case 6: return registers[ 2 ];
			default: throw new Error( 'Invalid combo operand' );
		}
	}

	let instructionPointer = 0;
	const output: number[] = [];

	const opcodes = [
		// 0
		function adv( operand: number ) {
			registers[ 0 ] = Math.floor( registers[ 0 ] / 2 ** combo( operand ) );
			instructionPointer += 2;
		},
		// 1
		function bxl( operand: number ) {
			registers[ 1 ] ^= operand;
			instructionPointer += 2;
		},
		// 2
		function bst( operand: number ) {
			registers[ 1 ] = combo( operand ) % 8;
			instructionPointer += 2;
		},
		// 3
		function jnz( operand: number ) {
			if ( registers[ 0 ] !== 0 ) {
				instructionPointer = operand;
			} else {
				instructionPointer += 2;
			}
		},
		// 4
		function bxc( operand: number ) {
			registers[ 1 ] ^= registers[ 2 ];
			instructionPointer += 2;
		},
		// 5
		function out( operand: number ) {
			output.push( combo( operand ) % 8 );
			instructionPointer += 2;
		},
		// 6
		function bdv( operand: number ) {
			registers[ 1 ] = Math.floor( registers[ 0 ] / 2 ** combo( operand ) );
			instructionPointer += 2;
		},
		// 7
		function cdv( operand: number ) {
			registers[ 2 ] = Math.floor( registers[ 0 ] / 2 ** combo( operand ) );
			instructionPointer += 2;
		},
	];

	// console.log( { registers, program } );

	while ( true ) {
		try {
			// console.log(
			// 	`%s: %s(%o) $o`,
			// 	[
			// 		'0       ',
			// 		' 1      ',
			// 		'  2     ',
			// 		'   3    ',
			// 		'    4   ',
			// 		'     5  ',
			// 		'      6 ',
			// 		'       7',
			// 	][ program[ instructionPointer ] ],
			// 	opcodes[ program[ instructionPointer ] ].name,
			// 	program[ instructionPointer + 1 ],
			// 	registers,
			// )
			opcodes[ program[ instructionPointer ] ]( program[ instructionPointer + 1 ] );
		} catch ( e ) {
			return output.join( ',' );
		}
	}
}

function part1( input: string ) {
	const [ registerInput, programInput ] = input.split( '\n\n' );
	const registers = registerInput.match( /-?\d+/g )!.map( Number );
	const program = programInput.match( /\d/g )!.map( Number );

	return run( registers, program );
}

// bench( 'part 1 example', () => part1( example ), '4,6,3,5,6,3,5,2,1,0' );

// bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const [ registerInput, programInput ] = input.split( '\n\n' );
	const registers = registerInput.match( /-?\d+/g )!.map( Number );
	const program = programInput.match( /\d/g )!.map( Number );

	const target = program.join( ',' );
	let output: string;

	// console.log( 'Regular run' );
	// console.log( run( registers, program ) );
	// console.log( 'Quine run' );
	// console.log( run( [ 3118709535330, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( target );

	// for ( const i of range( 0, 64 ) ) {
	// 	console.log( i, run( [ i, registers[ 1 ], registers[ 2 ] ], program ) );
	// }

	// for ( const e of range( 0, 16 ) ) {
	// 	// for ( const i of range( 0, 8 ** e ) ) {
	// 	console.log( 8 ** e, run( [ 8 ** e, registers[ 1 ], registers[ 2 ] ], program ) );
	// 	// }
	// }

	// console.log( run( [ 8 + 1, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 8 + 8, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 8 + 64, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 8 + 512, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 8 + 4096, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 8 + 32768, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 8 + 262144, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 8 + 2097152, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 8 + 16777216, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 8 + 134217728, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 8 + 1073741824, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 8 + 8589934592, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 8 + 68719476736, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 8 + 549755813888, registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 8 + 4398046511104, registers[ 1 ], registers[ 2 ] ], program ) );


	// const i = 7
	// 	+ 5 * ( 8 ** 1 )
	// 	+ 0 * ( 8 ** 2 )
	// 	+ 5 * ( 8 ** 3 ) // 7,5,3,1
	// 	+ 0 * ( 8 ** 4 )
	// 	+ 0 * ( 8 ** 5 )
	// 	+ 0 * ( 8 ** 6 ) // (?) 0,1
	// 	+ 5 * ( 8 ** 7 ) // (4)
	// 	+ 7 * ( 8 ** 8 ) // (1)
	// 	+ 2 * ( 8 ** 9 ) // (4) 6,2
	// 	+ 3 * ( 8 ** 10 ) // (0)
	// 	+ 7 * ( 8 ** 11 ) // (3) 4,6,7
	// 	+ 1 * ( 8 ** 12 ) // (5)
	// 	+ 1 * ( 8 ** 13 ) // (5)
	// 	+ 6 * ( 8 ** 14 ) // (3)
	// 	+ 5 * ( 8 ** 15 ); // (0)

	const i = 7          // (2)
		+ 5 * ( 8 ** 1 ) // (4)
		+ 0 * ( 8 ** 2 ) // (1)
		+ 5 * ( 8 ** 3 ) // (1) 1,3,5,7
		+ 2 * ( 8 ** 4 ) // (7)
		+ 0 * ( 8 ** 5 ) // (5)
		+ 2 * ( 8 ** 6 ) // (4) 2,4,6
		+ 3 * ( 8 ** 7 ) // (4)
		+ 5 * ( 8 ** 8 ) // (1) 1,5
		+ 3 * ( 8 ** 9 ) // (4) 2,3 ??? 2(6)/3(2,6)
		+ 3 * ( 8 ** 10 ) // (0)
		+ 7 * ( 8 ** 11 ) // (3)
		+ 1 * ( 8 ** 12 ) // (5)
		+ 1 * ( 8 ** 13 ) // (5)
		+ 6 * ( 8 ** 14 ) // (3)
		+ 5 * ( 8 ** 15 ); // (0)

	// 2,4,1,1,7,5,4,4,1,4,0,3,5,5,3,0

/*

2,4,1,1,7,5,4,4,1,1,3
2,4,1,1,7,5,4,4,1,1,3,5
2,4,1,1,7,5,4,4,1,1,3,7
2,4,1,1,7,5,4,4,1,1,3,6
2,4,1,1,7,5,4,4,1,1,3,1
2,4,1,1,7,5,4,4,1,1,3,0
2,4,1,1,7,5,4,4,1,1,3,3
2,4,1,1,7,5,4,4,1,1,3,2

2,4,1,1,7,5,4,4,1,2,3
2,4,1,1,7,5,4,4,1,2,3,5
2,4,1,1,7,5,4,4,1,2,3,7
2,4,1,1,7,5,4,4,1,2,3,6
2,4,1,1,7,5,4,4,1,2,3,1
2,4,1,1,7,5,4,4,1,2,3,0
2,4,1,1,7,5,4,4,1,2,3,3
2,4,1,1,7,5,4,4,1,2,3,2


*/

	for ( const unit of range( 0, 7 ) ) {
		const e = 0;
		const add = unit * ( 8 ** e );
		// console.log( i, `+ ${unit}*${8 ** e} = ${add}`, i + add, run( [ i + add, registers[ 1 ], registers[ 2 ] ], program ) );
		console.log( run( [ i + add, registers[ 1 ], registers[ 2 ] ], program ) );
	}

	// console.log( i, run( [ i, registers[ 1 ], registers[ 2 ] ], program ) );
	console.log( '----\n' + target );

	return;










	// // console.log( run( [ 46 + ( 35184372088832 * 1 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 2 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 3 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 4 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 46 + ( 35184372088832 * 5 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 6 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 7 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 8 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( '---' );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 1 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 2 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 3 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 4 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 5 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 7 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( '---' );
	// console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 2 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 3 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 4 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 5 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 6 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 7 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( '---' );
	// console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 2 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 3 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 4 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 5 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 6 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 7 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( '---' );
	// console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 1 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 2 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 3 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 4 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 5 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 6 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 7 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( '---' );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 0 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 1 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 2 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 3 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 4 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 5 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// // console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 6 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 7 ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( '---' );
	// console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 7 ) + ( 134217728 * ( 0 + 8 + 8 ) ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 7 ) + ( 134217728 * ( 1 + 8 + 8 ) ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 7 ) + ( 134217728 * ( 2 + 8 + 8 ) ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 7 ) + ( 134217728 * ( 3 + 8 + 8 ) ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 7 ) + ( 134217728 * ( 4 + 8 + 8 ) ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 7 ) + ( 134217728 * ( 5 + 8 + 8 ) ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 7 ) + ( 134217728 * ( 6 + 8 + 8 ) ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( run( [ 46 + ( 35184372088832 * 5 ) + ( 4398046511104 * 6 ) + ( 549755813888 * 1 ) + ( 68719476736 * 1 ) + ( 8589934592 * 0 ) + ( 1073741824 * 7 ) + ( 134217728 * ( 7 + 8 + 8 ) ), registers[ 1 ], registers[ 2 ] ], program ) );
	// console.log( '---' );
	// console.log( target );

	for ( let j = 0; true; j++ ) {
		output = run( [ i + j, registers[ 1 ], registers[ 2 ] ], program );

		// if ( j % 1000 === 0 ) {
		console.log( '%o: %s', i + j, output );
		// }

		if ( target === output ) {
			return i + j;
		}

		// output = run( [ i - j, registers[ 1 ], registers[ 2 ] ], program );

		// if ( j % 1000 === 0 ) {
		// 	console.log( '%o: %s', i - j, output );
		// }

		// if ( target === output ) {
		// 	return i - j;
		// }
	}
}

// bench( 'part 2 example', () => part2( example2 ), 117440 );

bench( 'part 2 input', () => part2( input ) );

// Target:
// 2,4,1,1,7,5,4,4,1,4,0,3,5,5,3,0

/*

7
2,4,1,2,-3,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,2,-3,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,2,7,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,2,-2,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,2,1,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,2,0,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,2,3,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,2,2,-3,5,4,1,4,0,3,5,5,3,0

5
2,4,1,0,-3,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,0,-3,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,-7,7,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,-7,-2,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,-6,1,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,-6,0,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,-5,3,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,-5,2,-3,5,4,1,4,0,3,5,5,3,0

3
2,4,1,6,-3,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,4,-3,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,2,7,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,0,-2,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,6,1,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,4,0,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,2,3,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,0,2,-3,5,4,1,4,0,3,5,5,3,0

1
2,4,1,5,-3,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,5,-3,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,5,7,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,5,-2,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,5,1,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,5,0,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,5,3,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,5,2,-3,5,4,1,4,0,3,5,5,3,0


2,4,1,0,-3,-3,5,4,1,4,0,3,5,5,3,0
2,4,1,0,-3,-7,5,4,1,4,0,3,5,5,3,0
2,4,1,0,-3,-3,3,4,1,4,0,3,5,5,3,0
2,4,1,0,-3,-7,6,4,1,4,0,3,5,5,3,0
2,4,1,0,-3,-3,6,4,1,4,0,3,5,5,3,0
2,4,1,0,-3,-7,6,4,1,4,0,3,5,5,3,0
2,4,1,0,-3,-3,0,4,1,4,0,3,5,5,3,0
2,4,1,0,-3,-7,5,4,1,4,0,3,5,5,3,0

2,4,1           4,1,4,0,3,5,5,3,0
	  1,7,5,4


*/



