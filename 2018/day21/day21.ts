import { } from '../../extensions.ts';
import { bench } from '../../bench.ts';

function part1() {
	// Manually translated instructions to code

	let r0 = 0;
	let r1 = 0;
	let r3 = 0;
	let r4 = 0;
	let r5 = 0;

	r5 = 123 // ip0

	// infinite loop
	do { // ip4
		r5 &= 456; // ip1
		// throw new Error( 'Infinite loop' );
	} while ( r5 !== 72 ) // ip2, ip3

	r5 = 0; // ip5

	while ( true ) { // ip30
		r3 = r5 | 65536; // ip6
		r5 = 9010242 // ip7

		while ( true ) {
			r1 = r3 & 255 // ip8
			r5 += r1 // ip9
			r5 &= 16777215 // ip10
			r5 *= 65899 // ip11
			r5 &= 16777215 // ip12

			if ( 256 > r3 ) { // ip13, ip14
				break; // ip16
			} else { // ip15
				// let i = 0; // ip17

				// while ( true ) { // ip20, ip25
				// 	r4 = ( i + 1 ) * 256; // ip18, ip19
				// 	if ( r3 < r4 ) { // ip20
				// 		break; // ip21, ip23
				// 	}
				// 	i++; // ip24
				// }

				// r3 = i; // ip26

				// Simplify the loop above
				r3 /= 256;
				r3 <<= 0;
			}
		}

		return r5;
	}
}

bench( 'part 1 input', () => part1() );

function part2() {
	// Simplify part 1 and detect the loop

	let r3 = 0;
	let r5 = 0;

	let last: number | undefined = undefined;
	let seen = new Set<number>();

	for ( let i = 0; i < 11000; i++ ) {
		let ticks = 0;

		r3 = r5 | 65536; // ip6
		r5 = 9010242 // ip7

		while ( true ) {
			r5 += ( r3 & 255 );
			r5 &= 16777215;
			r5 *= 65899;
			r5 &= 16777215;

			if ( r3 < 256 ) {
				break;
			}

			r3 /= 256;
			r3 <<= 0;

			ticks += r3;
		}

		if ( seen.has( r5 ) ) {
			// Started a new loop
			return last;
		}

		seen.add( r5 );
		last = r5;
	}
}

bench( 'part 2 input', () => part2() );
