import { FaceConnection, Facing } from "./shared.ts";

export const input = `                                                  ......#...........#..#....#...#..........................#..###..#...........................#......
                                                  ............#..........#..#......#..#...#..........#............................#...................
                                                  ......#.#....#....................#...#.......#.....#......................#.#......#...............
                                                  ...#......#..#............#...................##...................#........................#..#....
                                                  ........#...............#...................#.......#..#.....................#......................
                                                  ..#..#............................#..#...#.............#..........................##.#.......#......
                                                  ................#.....#.#.........#............#.#..........#.........#....#................#.......
                                                  ..............#.......................#......................#.............#...#....................
                                                  ..#.#................#.......#......#..#...#........#.#............#..........#......#...#....#..#..
                                                  ...#......#.#....#.......#.#.#......#......#....................#.......#......#................#...
                                                  ...#..#.#.......#........#...##.........##............#...........#............#.#....#.......#.....
                                                  ..#.................#......#......#.#..#.........#...#....#.....##..#......#.......................#
                                                  .......#..#..........................#........#.......#............#........................#.#.....
                                                  ...#..............#...#.......#.........#..........##....#....#.#..#..........#......#...........#..
                                                  ....................................#............#.....................................#............
                                                  ........#.#................#.........#...........#.................#...##......#....................
                                                  ..........#....#..........#...#..............#.........#.#.......#........#........##...............
                                                  .....#........#.................#..#.#........................#.....#..............#................
                                                  ........#...#.................#...#..#........#.#.............................................#.....
                                                  .#...#....................#................................#..........#..............#.....#....#...
                                                  ............#.............#......#....#........##...................................#.............#.
                                                  #.............#.....#..#............................#....#..............#..#...........#..........#.
                                                  .................#.....#.#.......#..........#...........#......#......#........#.........#..........
                                                  ....#........................#.........................#.....#...#....................#.......###...
                                                  ....................#........#....................#...........###..#....#..........#............##..
                                                  .............#...#........#.......#.....#.............#...#......................#...#........#..#..
                                                  ....#..............#.#....#........#.......#...#...#...............#..............#.##..#...........
                                                  ..................#.............#....#...#..#....#.......#........#......#..........................
                                                  ............#...........#............#.................#...#........................................
                                                  .............#.....#.....................#.............#.........#...##...........................#.
                                                  ........#...........................#..#...............#.............#..#.........#.#...............
                                                  ...#........#..#....#........#..........#....#.....#.##....................#.#.........#......#.##..
                                                  .................................#.............................................#...........#........
                                                  ..........................#..........#........#..............#..#........#.....##....#........#.#...
                                                  ......###.#..#............................................#...........##.#.#..#.......##....#.......
                                                  ...................#.................##..............##..#............#.............................
                                                  #....#...#....#...................#..............#...##....##.................#.....#.#.....#.......
                                                  .........#..........#.....................................#..#..............................#....#..
                                                  ........#......................................#.....#.................#...#.........#...#.....#....
                                                  #..............................#......................#.....#.#....#.................#..............
                                                  .....#..#.....##........#......#......#..#..#....#...#..........#..................#...#....#.......
                                                  #....#..........#...........................#................................#..#.......#.......#...
                                                  ....#......................#.....#.#..#.........#...#.#.........#.......................#..#......#.
                                                  ..........#.##...............#....##................#.......#........#...##.........................
                                                  ..#..#..........#..................................#............#............#..#..................#
                                                  ...........#.......#........#.#.......#........#..........#.....#....#.........#....................
                                                  ......................#...........................#.................##...#.....#.#...........#......
                                                  .......#.................#.........#...........##..#...#................#................#..#.......
                                                  ......................#..............#...#..#....#........................###...........#.#..#.#....
                                                  .#........#..............##......#........#.#..........#......#......................#..............
                                                  .........................#.........####...........
                                                  .............#........#.........#.##..............
                                                  #.#..#........#.......#....................#......
                                                  .....#............##.....##..........#...#........
                                                  ....................#........#......#.............
                                                  ..#...............#..#.................#..........
                                                  #........#......##..#...#...............#.........
                                                  .....................##.................#.........
                                                  ................#.......#..#.............#..#.....
                                                  ............#..#.#............#...........#.......
                                                  ...........#..#.....#....#.............#..........
                                                  ...................#........#.........#...........
                                                  ....#...#...........#........#.##............#....
                                                  ......#....##..........##..........#......#.....#.
                                                  .#................................#...............
                                                  ............#.#.......#...................#..##.#.
                                                  .#.....#...................##...#.................
                                                  ..#..#........................#...................
                                                  ....#...............#..#..#...#................#.#
                                                  .#..........#..#.......................#....#.....
                                                  .....................#...........................#
                                                  ..#.#...#...........#.#..............#..........#.
                                                  ..#.................#.#.......#............#.#.#..
                                                  .#......#...................#...#.........#....#..
                                                  .......##....#.........................#..........
                                                  ...#..#.............##.#.......#..........#.......
                                                  ....................#......#.#....................
                                                  .....##......#..#......#......#...................
                                                  .......#.........#.#........................#.....
                                                  #...#.............#..#......#........#............
                                                  ....#..#.....#.....................#.....#........
                                                  .....#.............#................#..........#..
                                                  ....#......#...#.#..#............#..........#.....
                                                  .#....#....................................#......
                                                  ....#......................#.##...............#..#
                                                  ........#.#.......................................
                                                  ......#........................##.....#.....#.....
                                                  .###.....#......#.........#............#..........
                                                  ..#......#...............#.#......................
                                                  .......#..................#......#...........#...#
                                                  .#...............................#.....#..........
                                                  ##.##.................#.....#.............#..#....
                                                  #.#...#.........##..#.....#......#................
                                                  .......#........#..#...................#..........
                                                  .....##..........##..#..........#.........#.......
                                                  ..#.....#...#.#...#..................#.......#..##
                                                  #.#...........#......#..#...........#.......#.....
                                                  ...#.....................#..#....###..............
                                                  ....#............#.......................#........
                                                  .......................#...........#.##...#.......
.#........#....#.......##......................#............#........................#............#.
#.........#..#....................................#.#...........#....#...#........#.......#.........
.....#.....#....#..#............................#.....#..#..........#.....##..#...#...............#.
..#........#...##.....................#......#..#........#.#.#.........#.............#..............
......#....#..#................#....#..#................................#....#......................
.......##.........##....#................................#........................#..#...#.#......#.
..#......#.............#....................#....#........#........................#..#......#......
.........#...#.#.....##......#...............................#........#.....#.....#....##..........#
......#................###.......#..............#.#.....##.....#....#....#..........#......#...##...
..#..........#..........#.........#....#.......#....##.........#..........#........#..............#.
......#..#........#...........#.#.....#...#....#......#...............#......##..#.....#...........#
#.......#......#........#...#.....................#.......#............................#....#...#...
..##............#..........................##....................#.....#.......#............#.......
..#..........................#....................#...#.........#.........#...............#.........
.#.............................#.........#......#..#................#...................#......#....
............#........#......#.................##................................##..........#.......
...#.......#.......#.#.......##...#............#...........#........................#........#...#.#
#.............#...#............................#.....#...#...............##....#....................
........#..#...............#..............#....................#..#.......#........##.............#.
...........#.............#...#..............#.....#....#....#.....#.#.......#.....#.................
...........................#......#...............#....#............................................
.....#.#......................#................#..............#..#......#......#...#............#...
#.........#........................#..#........#...#....#.....#.........##........................#.
......#.........#........................#..##........#.............#.....#...#........####.........
......#...................#.#...............#..................#............#.............#.........
......#............##......................#........#......#.......................#......#.........
......#........#........#.................#.......##...#......................#............#.##.....
..............#............#....................................#.##..#.....##....#............#....
..#.............................#............................................................#...#..
.............#........................#.#.........#....#.........#..........................#.......
.....#.........#...#.......................#....................#......#...#........................
.....#.....#.....#.......#........#.............#...#.....#......##.#..........##..#................
..#............#.....#.............................#.#........#.................#..#................
..#.#......#..#.......#.......#..........#..........#...#..................#.......................#
.................#............#....#.....................#.#....#.#.#.#................#............
#..........#..........#...........#........#.##....#...#...........#.....#.....#....................
....#....#...#......#..............#.#.........#...........##...................#......##.....##.#..
..#...#.....#.#..#......#.......##...#..........#.#.....#......#.....#.........#....................
........#......................##....#....#...#.#...#.........#.......................##..........#.
..............#......#.#........#....#......#..#....#.......#...........##...#........##............
.#..#...#..#.....#...............#.#...................##.................#........................#
##........#....#.#........#....................#..........#....#..........#.......##................
.......#.#.........#..........#......#............#..........#.#.#.........#...#..................#.
....#............#.................................#.#............#....#............#..#............
....#.................##.....#............................#..#...........#......................#...
...##....#......#.............#...##.........#........##................#..........#....#.....#..#..
.......#........##.................##....#.......#..................................................
.........#..................#..........#.#...................#............................#........#
.......#.#...#.....##...#....#..#...#...................#...#................#.............#.###....
............#......................#.......#..#..............#...........................#.......#..
.......................#..............#...........
...#......#.#..............#...##.#.........#.....
.........#.........#......#.......#...#...#......#
................................#..........##.....
..#...#.....#...#............#..#.................
#.........#......#................................
........##..........#.............#....#......#...
..............#......#...#........................
#...#.................#.#........#.....#..#.......
.......#.#................##..#.#..#..............
................#....#........#.................#.
................................#......#.#...###..
...#........................#....#.........#..#...
...........#.#...#......#............#.#..##......
...#...............#.#....##.......#..............
.....................#..#.........................
................#...#......................#......
.#....#.......#..............#....#......#........
.......................#..........###.......#.....
.........#.........#..........#.##....#.....#.....
.#......#....#........#...........................
..#..#.....#.............#.......................#
...#.................#..............#.............
..#..........#.....................#.............#
....#....#..............#...................#.....
....#..#....#...............................#....#
..........#..#..............#........#...#........
.#..#................#......##............#.......
.#......#...........................#.#.....#.....
.............#........................#...........
.##....#...#.................................#....
#..........##.#.#.................#.....#.........
..#....#..#.......##.........#..........#...#...#.
..............#...#.#........#...#.........#......
............#.#.............#................#....
.......#...#..........................##.......#..
.......................#.............#....#.......
...#...............#.............#.#.#.#.#........
......#....#......................#........#......
......#.......#....#.#..........................#.
...............#...............................#..
.........#.............#.#.###.............#......
.....#............................................
....................................#.....#.......
...........................................#......
...........................#....#...#...#..#......
.....#......#..........#.......#...............#..
............#.....#........#...................#.#
...............#..#.#........................##...
....#....#............#..#.....#....#..#..........

22L4L21L31L22L2L32L31R19L18L12R37R9L10L43L22L49R38L26L42R25R16L7R49R14L24L22L50L41L31R18R42R46L17R1R9R11L8R16L38R2L26R17R1R31L41L23R2L45L35R48L40R2R39L38R5L41R32R30L50L29R45R32R26R11R24R30R12L50R3R38R3R2L7L37R38L14L37R24L18R39R1L30L44L41L43L47L15L38R20R8L37R23R2R10R11R45L30R42R33L10L39R44R23R14L26L39R32L2L45L15L4L48R19L15L39L44L37L46R21R34L36L23L4L14L27R35R6R1L34R38L21L39L3L37R40L36R26L49R41R14R35R49R11L47L43L29R27L50L11L15R39R26R35L33R5L23L6R1R43L43R33L1R43R1R9L25L1R34L43R40L21R29R34L40R22L50L7R49L38R30L23R7L34L4R49L28L26R32L32L38L1L40L45L10L16R44R36R34R43R13L24L35L47R18L27L2L34L20L6R31L19R10R4R13R50L25L14L40L23L27L11L17R47R25L38L29R40R14L46L29R30L10L16L16L17L48R21R47L5L29R31R48R28R46R24R44R8R13R12L7R20R8L29L50L30R18L27L4L7R1R47L50R8L35R15L49L46L42R15L5L8L39R22L44R41R18R15L22L19L7R28L10R19R5R36R14L2L6R31R22L10L26L34L15L21L37L22L27R43L10R43L48L2R37R33R2R26L31R19L34R7R37L13R13R27R15L36L33L36R43L43R30R21R9R30L25L39L31L20L11L35R34L18R27R11L44L5L21L21L37R34R2R37R47R17R19R41L42L42R26L19R4R13R25R35L37R50R41L50L29L11R2L12R16R48R27R23L25L8L4R37L6L31R9L19R42R27R41R44R7R50R10L2L12L43L44R15L2L19L17L13R43L9R9L30R49L10L28L39L15R38L16L9L24R36L46R15R44R26R33L22L14R14R22R9L18R42L30L13L47R6R5R25L46L4R39R33L36L35R36L2L17L36L45L21R46L12L11R13L10L5R31L33L38L44R7R16L46R49R2R41L28R24L6L47R47L34L49R30L31L12R16L21R43R11L32L39L8L22L32R10R7R45R14R47L13L9L5R40L6L16L35R15R34R36R3R48R25L22R6R36L40L44R50R17L41L29R16R5R11L35L41R9R14R10L18R40R45L5R14L36R10R49R13L7R25R26L43R7R31R23R10L32R34L29L46R32R11R14L27L46L11L8R22L31L22L48L22R12R26R37R11R10L10L18L36L5L28R35L32R29L49L33L40R28R23R42R18L46L3L14L14L46R22R29L10R36L50R11L35L5R21L16L31R49R41L30R40L46R48R8R3L26R21L16R43R46L50R39R23L10L17L24R11L28R32L13L15R8R33L32R12R43R10L7L15L4L32L3R36L50L40L50L35L2R31R35L4L11R33L16L13L38L16L26R39L48L34R24L43R2L8R19R13R29L43L5R19R43L25R21R1R27R44L50R40L15R8R6R21R6R37L34L50R16L5R42R50L9L17L48L48R3R21L6R40R6R17R11R31R11L12L35L43L36L35R15L9L36L36L1R37L43R45R8L34R21L21R45L49R24L18R36L29L1L49L25L32R35L48R28R6L12L27R34L20L18L31L16R29L31R27L27R46L37R46R5R37L1L36L37L17R6R39L6R1R25R25L29L14L25L24L15R11R39R6L29L24L32R14L46R2L1L10R11L1R5R38R8R9L22R20R35L8R10L30L7R22L37R35L42L26L36R9L8R35R28R11R46L29R5L21L44R30R36L28L44L44L18L43L37R43R21L20R28L45R43R25L49R41R45L22R3R44L41R9L48R2R25L8L37L2R2R36R25L18L32R3L48R39R16R27R40R47L28L48L34L40R32R48L43R45R26L3L42L31R47R12R27L15L2L20L46R22R48L2R32R30R17R7R42L23L44L43L41L36R47L38L30R24L11L29R2L31R9L3R6L42L32L25L41R42L4L31L42L14R22R45R41L16R43L50L33R21L40R30L2R35R49R4L42L32L14L37L6R37R21R43R48L40R46R34R12L28R45R6L17R1R4L8L33L47R43L31L12R18R44L28R49R40R31R23L41L9R36R14L35R29R1R49R36L29R21L27R17R15R20R30L41L8L44L50R29R13L41L47L15L50R10R3L8R46L33L22L12R30R50R35L1L10R20R22L18R49R45L18L29R23R36L49L32L35R35R2L37L34L36R17L46L50R43R32L2R36L22R32L27L18L43R23R8L37L12R11L49R31R46L1R27R50L43R32L39R44L7L47L10R35L40R22L11L12L35R11L21L35R33R2L36R46L11R25R13L48L30L13L37L15L47R50R14R23R38L40R37L4L24R47L17L30R31L3L19R19R26R11R36R18R29R26L17R32L17R9R7R8R47R28R46L34R20R41R45R25R28L11R34R50R3L49R28R20R23R20R42R26L16R9L47L43L16L35L38R9L13L12L1L8R34L23L9R4R16L34L21R24R4R4L43L6L39R36R10R7L40L31R36R13R1R24R23L39L32L45L38L1R21R12L34R41R43R15L14R34R46R20L48L19L32R12R11L19R43L10L39R15R11R23R27L46L11R16R22R2L31L28R10R14R29R50L33L22L4L14L40L43L36L22L3L48L50L29L16R6L47R19L16R28R19R18L13L5L16R4L11R16R50L35L6L40R5R31L45L38L34L30R15L40R31L22R15R9R32R34L25R14R17L6L5R35L22R29L18R17L47L40L3L27L21R36L50R24R7L19R27L48L13R36L32R21R27R38R8L43L14R39R13R39L28L24R28L45L29R37R22L8R21R44L11L32R5L24L14R37L26L8R43R3L14L4L25L23L1L18R8L28L31L48R46L16L10L5L25R8L40R28L40L18L37L8L5L30L38R30R6L23L26L50R39R24L3R47R18R43L13R3L13R37R20L26R24R9R40R43L26R1R1R42R27L23L31L12L39L36L33R49L23L48L7L47L11R45L48L21R21R19L15L40L18R11L28R33R43R29L17L48L32R29R21L31L31L23R42R42L38L10L6L31R11L17L21R3R3R17R44L47R4R27L28L18R15L37R44L21L10R45L31R50L14R31L50L41R24R43R43R37R1R44R50R34L47R4R7R45L5L27L42L39L23L33R27R9R47L49L31L44L28R29L7L25L24L11L19R43L30R45R35R33L4R13L37L35L23R37L37R45R21L26L3L49R10R13R37L32L22L32L28R24R41L47R5L31L12R16L42R31R31L4R48L30L36L42R17L13L48L9L26L18L43L20R2L19L32R36L2R13R2L42R18R43R40L19R36R2R12R40R37R40R18L43R15L19L26L29R43R35L13L37R50L22R47R31R5R5R3R6L48L25L38R43L44R30R36L43L36R11R41R31L1R15R25L36R46R15L2R37R50R10L18R45R29R26R42L5L50R2R18L19R30L30R33L48L6R26L38R26R9L44R3R20R2R49R4L18L23L13R45L44L1L3L8R49L25L40L34R49L47L40R40R33L24R34L5R28L5L3R2L36L29L31R15L50R32R35R33R14L8L49L19R9L40L14R25R17R1R3R8R20L38R36R10R46L40R8L22L35L11L48R37L6R50R47L38R31L23L22L17R22R5L28R4R45L17R15R25R31L38R40L16R32R16R18L8R44L49L23L41R30R34R7R25R9R38R22L28R45L27R45L19R14L45R7R2L11R14R6R48R14R21R27R28L19L13R50R36L2L14R40R20L33R14R49R2L42L10R11R38L26R6L10R42L1L24R3L41R16L42R26R13L24R32L23L1L20L47R27R10L10R43L20L29R29R23R30L4R24R31L33L46L39L35L41R26R7R15L1R5R25R47R35R15L3L15R5L3L17R29L32R11L48R48L41R39R38L25L33L28L2L34R17L35R35L19L45R13L5R27L33R23R44R31R49L42R47L37R29L8L41L41L2R6L31R23R34R7R46L3L10R46R27R46R9R42R7R21R35L13L17L43R12L11L6R30R45R47R33R29L42R44L43R13L9R24L19R24R24R40L7L46L42L41R34L26L3L17R16L5L14R48L31R7R39R41R20R11L28L41R5L28R13R10R17R29L2R2L32L21L39R7R43L1R12R1L43L16R16L40R27R37L31L43R20L33L11L14L40L30L3R42L36R38L24L5L46R28R15L33L31R13L28L22R18R36L35R27L19R9R43L13L7L50R35L41R33R20R2R46R38R47R19R38R36R47L22R16L8R35R35L38L15R45R44L41L22R12R6L3L37R25L15R49R34R26R4R24L45R32L43L17R45L10R21R17L33L14L38R24R40R37R29L46R25L49L41R11L15R25L10R26L26L46L22L36R25R38R32L50R18R43R34R37L50R50R13L49L13L11R17R17R21R39R39L30R14L43L25R45L33L4L42R7R7L24R46L6R18L48L25R49L27L42L47R15L18L36R38R45R26L35L5L16R10L18R40R17R26R38R31R49L12R27R38R20L10R45R12R19R23R27L16R36L48R47L8R1L13R45L15R15R48R26R7L21L7R45R4R3R44R19R49L15R19L42R27R30L40R49R47R12L29R33R38L32R8L39R34R35R41R45L44`;

// Some nice hardcoded values
export const netSize = 50;
export const faceCoords: [ number, number ][] = [
	/*          */[ 1, 0 ], [ 2, 0 ],
	/*          */[ 1, 1 ],
	/**/[ 0, 2 ], [ 1, 2 ],
	/**/[ 0, 3 ],
];
export const faceConnections: FaceConnection[] = [
	{
		[ Facing.Right ]: { face: 1, side: Facing.Left },
		[ Facing.Down ]: { face: 2, side: Facing.Up },
		[ Facing.Left ]: { face: 3, side: Facing.Left },
		[ Facing.Up ]: { face: 5, side: Facing.Left },
	},
	{
		[ Facing.Right ]: { face: 4, side: Facing.Right },
		[ Facing.Down ]: { face: 2, side: Facing.Right },
		[ Facing.Left ]: { face: 0, side: Facing.Right },
		[ Facing.Up ]: { face: 5, side: Facing.Down },
	},
	{
		[ Facing.Right ]: { face: 1, side: Facing.Down },
		[ Facing.Down ]: { face: 4, side: Facing.Up },
		[ Facing.Left ]: { face: 3, side: Facing.Up },
		[ Facing.Up ]: { face: 0, side: Facing.Down },
	},
	{
		[ Facing.Right ]: { face: 4, side: Facing.Left },
		[ Facing.Down ]: { face: 5, side: Facing.Up },
		[ Facing.Left ]: { face: 0, side: Facing.Left },
		[ Facing.Up ]: { face: 2, side: Facing.Left },
	},
	{
		[ Facing.Right ]: { face: 1, side: Facing.Right },
		[ Facing.Down ]: { face: 5, side: Facing.Right },
		[ Facing.Left ]: { face: 3, side: Facing.Right },
		[ Facing.Up ]: { face: 2, side: Facing.Down },
	},
	{
		[ Facing.Right ]: { face: 4, side: Facing.Down },
		[ Facing.Down ]: { face: 1, side: Facing.Up },
		[ Facing.Left ]: { face: 0, side: Facing.Up },
		[ Facing.Up ]: { face: 3, side: Facing.Down },
	},
];
