import { FaceConnection, Facing } from "./shared.ts";

export const input = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

// Some nice hardcoded values
export const netSize = 4;
export const faceCoords: [ number, number ][] = [
	/*                    */[ 2, 0 ],
	/**/[ 0, 1 ], [ 1, 1 ], [ 2, 1 ],
	/*                    */[ 2, 2 ], [ 3, 2 ],
];
export const faceConnections: FaceConnection[] = [
	{
		[ Facing.Right ]: { face: 5, side: Facing.Right },
		[ Facing.Down ]: { face: 3, side: Facing.Up },
		[ Facing.Left ]: { face: 2, side: Facing.Up },
		[ Facing.Up ]: { face: 1, side: Facing.Up },
	},
	{
		[ Facing.Right ]: { face: 2, side: Facing.Left },
		[ Facing.Down ]: { face: 4, side: Facing.Down },
		[ Facing.Left ]: { face: 5, side: Facing.Down },
		[ Facing.Up ]: { face: 0, side: Facing.Up },
	},
	{
		[ Facing.Right ]: { face: 3, side: Facing.Left },
		[ Facing.Down ]: { face: 4, side: Facing.Left },
		[ Facing.Left ]: { face: 1, side: Facing.Right },
		[ Facing.Up ]: { face: 0, side: Facing.Left },
	},
	{
		[ Facing.Right ]: { face: 5, side: Facing.Up },
		[ Facing.Down ]: { face: 4, side: Facing.Up },
		[ Facing.Left ]: { face: 2, side: Facing.Right },
		[ Facing.Up ]: { face: 0, side: Facing.Down },
	},
	{
		[ Facing.Right ]: { face: 5, side: Facing.Left },
		[ Facing.Down ]: { face: 1, side: Facing.Down },
		[ Facing.Left ]: { face: 2, side: Facing.Down },
		[ Facing.Up ]: { face: 3, side: Facing.Down },
	},
	{
		[ Facing.Right ]: { face: 0, side: Facing.Right },
		[ Facing.Down ]: { face: 1, side: Facing.Left },
		[ Facing.Left ]: { face: 4, side: Facing.Right },
		[ Facing.Up ]: { face: 3, side: Facing.Right },
	},
];
