import '../../extensions.ts';

export default [
	'#ip 2',
/*  0 */ 'seti 123 0 5', // r5 = 123
/*  1 */ 'bani 5 456 5', // r5 = r5 & 456

// if
/*  2 */ 'eqri 5 72 5', // if r5 === 72
/*  3 */ 'addr 5 2 2', // then goto 5
/*  4 */ 'seti 0 0 2', // then goto 1 (infinite loop)

// Some sort of input validation
/*  5 */ 'seti 0 3 5', // r5 = 0
/*  6 */ 'bori 5 65536 3', // r3 = r5 | 65536
/*  7 */ 'seti 9010242 6 5', // r5 = 9010242
/*  8 */ 'bani 3 255 1', // r1 = r3 & 255
/*  9 */ 'addr 5 1 5', // r5 += r1
/* 10 */ 'bani 5 16777215 5', // r5 &= 16777215
/* 11 */ 'muli 5 65899 5', // r5 *= 65899
/* 12 */ 'bani 5 16777215 5', // r5 &= 16777215

// if
/* 13 */ 'gtir 256 3 1', // if 256 > r3
/* 14 */ 'addr 1 2 2', // then goto 16(->28)
/* 15 */ 'addi 2 1 2', // else goto 17

// then: r3 was < 256
/* 16 */ 'seti 27 6 2', // goto 28

// else: r3 was >= 256
/* 17 */ 'seti 0 8 1', // r1 = 0
/* 18 */ 'addi 1 1 4', // r4 = r1 + 1
/* 19 */ 'muli 4 256 4', // r4 *= 256

/* 20 */ 'gtrr 4 3 4', // if r4 > r3
/* 21 */ 'addr 4 2 2', // then goto 23(->26)
/* 22 */ 'addi 2 1 2', // else goto 24

// then: r4 was > r3
/* 23 */ 'seti 25 5 2', // goto 26

// else: r4 was <= r3
/* 24 */ 'addi 1 1 1', // r1 += 1
/* 25 */ 'seti 17 7 2', // goto 18

/* 26 */ 'setr 1 3 3', // r3 = r1
/* 27 */ 'seti 7 2 2', // goto 8

// if
/* 28 */ 'eqrr 5 0 1', // if r5 === r0
/* 29 */ 'addr 1 2 2', // then halt
/* 30 */ 'seti 5 2 2', // else goto 6
].join( '\n' );
