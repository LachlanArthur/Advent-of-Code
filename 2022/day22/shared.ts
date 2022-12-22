export type Input = {
	input: string,
	netSize: number,
	faceCoords: [ number, number ][],
	faceConnections: FaceConnection[],
}

export enum Facing {
	Right = 0,
	Down = 1,
	Left = 2,
	Up = 3,
}

export type FaceConnection = Record<Facing, { face: number, side: Facing }>;
