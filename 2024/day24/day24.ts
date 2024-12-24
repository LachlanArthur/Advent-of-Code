import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example1 from './example1.ts';
import example2 from './example2.ts';
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
