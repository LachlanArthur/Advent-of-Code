export default [
	[ `^WNE$`, 3 ],
	[ `^ENWWW(NEEE|SSE(EE|N))$`, 10 ],
	[ `^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$`, 18 ],
	[ `^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$`, 23 ],
	[ `^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$`, 31 ],
] as [ string, number ][];
