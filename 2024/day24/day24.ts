import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example1 from './example1.ts';
import example2 from './example2.ts';
import example3 from './example3.ts';
import input from './input.ts';

function AND( a: boolean, b: boolean ): boolean {
	return a && b;
}

function OR( a: boolean, b: boolean ): boolean {
	return a || b;
}

function XOR( a: boolean, b: boolean ): boolean {
	return a !== b;
}

const operators = { AND, OR, XOR }

function part1( input: string ) {
	const [ initialValuesInput, gatesInput ] = input.split( '\n\n' );

	const wires: Record<string, () => boolean> = {};

	for ( const line of initialValuesInput.split( '\n' ) ) {
		const [ wire, value ] = line.split( ': ' );
		wires[ wire ] = () => value === '1';
	}

	for ( const line of gatesInput.split( '\n' ) ) {
		const [ left, operator, right, , out ] = line.split( ' ' );
		wires[ out ] = () => operators[ operator as keyof typeof operators ]( wires[ left ](), wires[ right ]() );
	}

	const outputWires = Object.keys( wires ).filter( wire => wire.startsWith( 'z' ) );

	const binary = outputWires
		.toSorted()
		.map( wire => wires[ wire ]() ? '1' : '0' )
		.toReversed()
		.join( '' )

	return parseInt( binary, 2 );
}

bench( 'part 1 example 1', () => part1( example1 ), 0b100 ); // 4

bench( 'part 1 example 2', () => part1( example2 ), 0b0011111101000 ); // 2024

bench( 'part 1 input', () => part1( input ) );

function part2( input: string, targetOperation: ( a: number, b: number ) => number, swaps: number ) {
	const [ initialValuesInput, gatesInput ] = input.split( '\n\n' );

	const wires: Record<string, () => boolean> = {};

	for ( const line of initialValuesInput.split( '\n' ) ) {
		const [ wire, value ] = line.split( ': ' );
		wires[ wire ] = () => value === '1';
	}

	for ( const line of gatesInput.split( '\n' ) ) {
		const [ left, operatorName, right, , out ] = line.split( ' ' );
		wires[ out ] = () => operators[ operatorName as keyof typeof operators ]( wires[ left ](), wires[ right ]() );
	}

	const wireGroups = Object.keys( wires ).groupBy( 0 );

	const inputLeftWires = wireGroups.get( 'x' )!.toSorted();
	const inputRightWires = wireGroups.get( 'y' )!.toSorted();
	const outputWires = wireGroups.get( 'z' )!.toSorted();
	const swapWires = Object.keys( wires ).without( ...inputLeftWires, ...inputRightWires );

	console.log( {
		inputLeftWires,
		inputRightWires,
		outputWires,
	} );

	function setWireValues( wireList: string[], input: number ) {
		for ( const [ index, wire ] of wireList.entries() ) {
			wires[ wire ] = () => ( input & ( 1 << index ) ) !== 0;
		}
	}

	function setLeft( input: number ) {
		setWireValues( inputLeftWires, input );
	}

	function setRight( input: number ) {
		setWireValues( inputRightWires, input );
	}

	function output() {
		return parseInt(
			outputWires
				.map( wire => wires[ wire ]() ? '1' : '0' )
				.toReversed()
				.join( '' ),
			2
		);
	}

	function swap( pair: [ string, string ] ) {
		const a = wires[ pair[ 0 ] ];
		const b = wires[ pair[ 1 ] ];

		wires[ pair[ 0 ] ] = b;
		wires[ pair[ 1 ] ] = a;
	}

	const maxBits = inputLeftWires.length;
	const maxInt = 2 ** maxBits - 1;

	function test() {
		for ( let bits = 1; bits < maxBits; bits++ ) {
			const input = 2 ** bits - 1;
			const expect = targetOperation( input, input );

			setLeft( input );
			setRight( input );

			if ( output() !== expect ) {
				return false;
			}
		}

		return true;
	}



	// const swapGroups = swapWires.combinations( 2 )
	// 	.combinationsLazy( swaps )
	// 	.filter( combination => {
	// 		const flat = combination.flat();
	// 		return flat.unique().length === flat.length
	// 	} );

	// for ( const swapPairs of swapGroups ) {
	// 	// console.group( 'Swapping %s', swapPairs.map( pair => pair.join( ' <-> ' ) ).join( ', ' ) );
	// 	swapPairs.forEach( swap );

	// 	if ( test() ) {
	// 		return swapPairs.flat().toSorted().join( ',' );
	// 	}

	// 	swapPairs.forEach( swap );
	// 	// console.groupEnd();
	// }

	// throw new Error( 'Failed to find a valid swap' );






	// let swapGroups: string[][] = swapWires.combinations( 2 );

	// for ( let i = 1; i < swaps; i++ ) {
	// 	swapGroups = swapGroups.flatMap( swapGroup => swapWires.without( ...swapGroup ).combinations( 2 ).map( subGroup => [ ...swapGroup, ...subGroup ] ) )
	// }

	// console.log( swapGroups );




	// for ( const swapList of swapWires.combinationsLazy( swaps * 2 ) ) {
	// 	console.group( swapList );

	// 	for ( let i = 0; i <= swaps; i++ ) {
	// 		swapGroups.push( ... )
	// 	}
	// 	console.groupEnd();
	// }

	// const outputWires = Object.keys( wires ).filter( wire => wire.startsWith( 'z' ) );

	// const binary = outputWires
	// 	.toSorted()
	// 	.map( wire => wires[ wire ]() ? '1' : '0' )
	// 	.toReversed()
	// 	.join( '' )

	// return parseInt( binary, 2 );
}

bench( 'part 2 example', () => part2( example3, ( a, b ) => a & b, 2 ), 'z00,z01,z02,z05' );

bench( 'part 2 input', () => part2( input, ( a, b ) => a + b, 4 ) );
