// export const pieceMap = {
//     0: '',
//     1: 'chess-king.png',
//     2: 'chess-queen.png',
//     3: 'chess-bishop.png',
//     4: 'chess-knight.png',
//     5: 'chess-rook.png',
//     6: 'chess-pawn.png',
//     1: 'chess-king.png',
//     2: 'chess-queen.png',
//     3: 'chess-bishop.png',
//     4: 'chess-knight.png',
//     5: 'chess-rook.png',
//     6: 'chess-pawn.png',
// }

let pieceMap = new Map()
pieceMap.set(0, '');
pieceMap.set(1, 'chess-king.png');
pieceMap.set(2, 'chess-queen.png');
pieceMap.set(3, 'chess-bishop.png');
pieceMap.set(4, 'chess-knight.png');
pieceMap.set(5, 'chess-rook.png');
pieceMap.set(6, 'chess-pawn.png');
pieceMap.set(-1, 'chess-king-black.png');
pieceMap.set(-2, 'chess-queen-black.png');
pieceMap.set(-3, 'chess-bishop-black.png');
pieceMap.set(-4, 'chess-knight-black.png');
pieceMap.set(-5, 'chess-rook-black.png');
pieceMap.set(-6, 'chess-pawn-black.png');

export default pieceMap