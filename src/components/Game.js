import React, {useState, useEffect} from 'react'
import pieceMap from '../config/pieceMap'
import socketIOClient from 'socket.io-client'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
const ENDPOINT = '/'

function Home(props) {
    const id = props.match.params.id
    const [boardSize, setBoardSize] = useState(0)
    const [board, setBoard] = useState([])
    const [selected, setSelected] = useState({})
    const [curPlayer, setCurPlayer] = useState(0)
    const [player, setPlayer] = useState(0)
    const [legalMoves, setLegalMoves] = useState([])
    const [dragPiece, setDragPiece] = useState(null)
    const [dragHover, setDragHover] = useState(null)
    const [pieces, setPieces] = useState([])
    const [placeBoard, setPlaceBoard] = useState([])
    const [state, setState] = useState(0)
    const [winner, setWinner] = useState(0)
    const [modal, setModal] = useState(false);
    const [socket, setSocket] = useState(null)

    let hadWinner = false


    useEffect(() => {
        let localPlayer = 0
        const socket = socketIOClient(ENDPOINT)
        setSocket(socket)
        if (props.location.boardSize) {
            socket.emit('create', {
                id: id,
                boardSize: props.location.boardSize,
                pieces: props.location.pieces,
                lines: props.location.lines,
            })
        } else {
            socket.emit('join', id)
        }

        socket.emit('get-board', id)
        socket.emit('get-place-board', id)

        socket.on('disconnect', () => {
            props.history.push('/')
        })

        socket.on('get-winner', (winner) => {
            //("GET WINNER", winner)

            if (winner !== 0 && !hadWinner) {
                setModal(true)
                hadWinner = true
            }

            setWinner(winner)
        })
        socket.on('get-board-size', (boardSize) => {
            //("BOARD SIZE", boardSize)
            setBoardSize(boardSize)
        })
        socket.on('get-pieces', (pieces) => {
            //("GET PIECES", pieces)
            setPieces(pieces)
        })
        socket.on('get-board', (board) => {
            //("GET BOARD", board)
            setBoard(board)
        })
        socket.on('get-place-board', (placeBoard) => {
            //("GET PLACE BOARD", placeBoard)
            setPlaceBoard(placeBoard)
        })
        socket.on('get-cur-player', (player) => {
            //("GET CUR PLAYER", player)
            setCurPlayer(player)
        })
        socket.on('set-player', (player) => {
            //("SET PLAYER", player)
            // socket.emit('get-pieces', player)
            localPlayer = player
            setPlayer(player)
        })
        socket.on('get-state', (state) => {
            //("GET STATE", state)

            if (state === 2) {
                socket.emit('get-pieces', {
                    player: localPlayer,
                    id: id
                })
                //("GET STATE 2", localPlayer)
                socket.emit('get-board', id)

            } else if (state === 3) {
                socket.emit('get-board', id)
            }

            setState(state)
        })

    }, [])

    const disconnect = () => {
        socket.emit('disconnect')
        socket.disconnect()
    }

    const movePiece = (row, col, piece) => {
        //("MOVE PIECE", selected)

        socket.emit('move-piece', {
            prevRow: selected.row,
            prevCol: selected.col,
            newRow: row,
            newCol: col,
            piece: selected.piece,
            id: id
        })
    }

    const clickTile = (e) => {
        const row = parseInt(e.target.dataset.tilerow)
        const col = parseInt(e.target.dataset.tilecol)

        //("CLICK TIlE", curPlayer, player)
        
        if (placeBoard.length && board.length)
        if (curPlayer !== 0 && curPlayer === player)
        if (state === 0) {
            if (placeBoard[row][col] === 0) {

                socket.emit('claim-tile', {
                    row: row,
                    col: col,
                    player: player,
                    id: id
                })
            }

        } else if (state === 3) {
            const piece = board[row][col]
            //("PIECE", piece)

            let move = legalMoves.filter(move => {
                if (move[0] === row && move[1] === col)
                    return true
                return false
            })

            if (move.length) {
                //("MOVE")
                movePiece(row, col)
                
                setSelected({})
                setLegalMoves([])
            } else {
                if (piece * player > 0) {
                    //("SELECT")
                    const selectedInfo = {
                        piece: piece,
                        row: row,
                        col: col
                    }
                    setSelected(selectedInfo)

                    switch (piece) {
                        case -6:
                        case 6: pawnMoves(row, col, piece); break;
                        case -5:
                        case 5: rookMoves(row, col, piece); break;
                        case -4:
                        case 4: knightMoves(row, col, piece); break;
                        case -3:
                        case 3: bishopMoves(row, col, piece); break;
                        case -2:
                        case 2: queenMoves(row, col, piece); break;
                        case -1:
                        case 1: kingMoves(row, col, piece); break;
                    }
                } else {
                    setSelected({})
                    setLegalMoves([])
                }
            }
        }
    }

    const dragMoveStart = (e) => {
        // e.preventDefault()
        if (curPlayer * player > 0) {

            //("DRAG START", e.target)
            setDragPiece(e.target)

            const row = parseInt(e.target.dataset.tilerow)
            const col = parseInt(e.target.dataset.tilecol)
            const piece = board[row][col]
            //("PIECE", piece)

            if (piece * player > 0) {
                //("SELECT")
                const selectedInfo = {
                    piece: piece,
                    row: row,
                    col: col
                }
                setSelected(selectedInfo)

                switch (piece) {
                    case -6:
                    case 6: pawnMoves(row, col, piece); break;
                    case -5:
                    case 5: rookMoves(row, col, piece); break;
                    case -4:
                    case 4: knightMoves(row, col, piece); break;
                    case -3:
                    case 3: bishopMoves(row, col, piece); break;
                    case -2:
                    case 2: queenMoves(row, col, piece); break;
                    case -1:
                    case 1: kingMoves(row, col, piece); break;
                }
            } else {
                setSelected({})
                setLegalMoves([])
            }
        }
    }

    const dragPlaceStart = (e) => {
        // e.preventDefault()
        //("STATE", state)
        if (state > 0) {

            //("DRAG START", e.target)
            setDragPiece(e.target)
        }
    }

    const dragOver = (e) => {
        // e.preventDefault()
        if (state > 0) {

            e.stopPropagation();
            e.preventDefault();
            // //("DRAG OVER", e.target)
            
            setDragHover(e.target)
        }
    }

    const dragPlaceEnd = (e) => {
        // e.preventDefault()
        // console.log("DRAG PLACE END")
        if (state > 0 && dragHover) {

            //("ADD PIECE", dragPiece.dataset.piece)
            const row = parseInt(dragHover.dataset.tilerow)
            const col = parseInt(dragHover.dataset.tilecol)
            const piece = parseInt(dragPiece.dataset.piece)

            if (placeBoard[row][col] * piece > 0 && board[row][col] === 0) {
                socket.emit('set-piece', {
                    row: row,
                    col: col,
                    piece: piece,
                    player: player,
                    id: id
                })
            }
            setDragPiece(null)
        }
    }

    const dragPlaceDrop = (e) => {
        // console.log("DRAG PLACE DROP")
        e.preventDefault()
    }

    const dragEnd = (e) => {

        if (curPlayer * player > 0) {


            //("DRAG END")
            if (state === 3) {
            
            const row = parseInt(dragHover.dataset.tilerow)
            const col = parseInt(dragHover.dataset.tilecol)
    
                let move = legalMoves.filter(move => {
                    //("MVOES", move, row, col)
                    if (move[0] === row && move[1] === col)
                        return true
                    return false
                })
                if (move.length) {
                    //("MOVE")
                    movePiece(row, col)
                    
                    // setCurPlayer(curPlayer * -1)
                    setSelected({})
                    setLegalMoves([])
                }
            

            setDragHover(null)
            setDragPiece(null)
            }
        }
    }

    const getState = () => {
        switch(state) {
            case 0: return 'CLAIM TILES';
            case 1: return 'POSITION PIECES';
            case 2: return 'PLACE KING';
            case 3: return 'PLAY CHESS';
            default: return 'NO STATE'
        }
    }

    
    const rookMoves = (row, col, piece) => {
        let moves = []
        for (let r = row+1; r < boardSize; r++) {
            if (board[r][col] === 0)
                moves.push([r, col])
            else if (board[r][col] * piece < 0) {
                moves.push([r, col])
                break;
            }
            else
                break;
        }
        for (let r = row-1; r >= 0; r--) {
            if (board[r][col] === 0)
                moves.push([r, col])
            else if (board[r][col] * piece < 0) {
                moves.push([r, col])
                break;
            }
            else
                break;
        }
        for (let c = col+1; c < boardSize; c++) {
            if (board[row][c] === 0)
                moves.push([row, c])
            else if (board[row][c] * piece < 0) {
                moves.push([row, c])
                break;
            }
            else
                break;
        }
        for (let c = col-1; c >= 0; c--) {
            if (board[row][c] === 0)
                moves.push([row, c])
            else if (board[row][c] * piece < 0) {
                moves.push([row, c])
                break;
            }
            else
                break;
        }

        //("ROOK MOVES", moves)
        setLegalMoves(moves)
    }

    const knightMoves = (row, col, piece) => {
        let moves = []
        if (row+2 < boardSize && col+1 < boardSize)
            if (board[row+2][col+1] === 0 || board[row+2][col+1] * piece < 0)
                moves.push([row+2, col+1])
        if (row+2 < boardSize && col-1 >= 0)
            if (board[row+2][col-1] === 0 || board[row+2][col-1] * piece < 0)
                moves.push([row+2, col-1])
        
        if (row-2 >= 0 && col+1 < boardSize)
            if (board[row-2][col+1] === 0 || board[row-2][col+1]* piece < 0)
                moves.push([row-2, col+1])
        if (row-2 >= 0 && col-1 >= 0)
            if (board[row-2][col-1] === 0 || board[row-2][col-1] * piece < 0)
                moves.push([row-2, col-1])

        if (row+1 < boardSize && col+2 < boardSize)
            if (board[row+1][col+2] === 0 || board[row+1][col+2] * piece < 0)
                moves.push([row+1, col+2])
        if (row+1 < boardSize && col-2 >= 0)
            if (board[row+1][col-2] === 0 || board[row+1][col-2] * piece < 0)
                moves.push([row+1, col-2])
        
        if (row-1 >= 0 && col+2 < boardSize)
            if (board[row-1][col+2] === 0 || board[row-1][col+2] * piece < 0)
                moves.push([row-1, col+2])
        if (row-1 >= 0 && col-2 >= 0)
            if (board[row-1][col-2] === 0 || board[row-1][col-2] * piece < 0)
                moves.push([row-1, col-2])
        
        //("KNIGHT MOVES", moves)
        setLegalMoves(moves)
    }

    const bishopMoves = (row, col, piece) => {
        let moves = []

        for (let r = row+1; r < boardSize; r++) {
            let c = col-(r-row)
            if (c < 0) break;

            if (board[r][c] === 0)
                moves.push([r, c])
            else if (board[r][c] * piece < 0) {
                moves.push([r, c])
                break;
            }
            else
                break;
        }
        for (let r = row+1; r < boardSize; r++) {
            let c = col+(r-row)
            if (c >= boardSize) break;

            if (board[r][c] === 0)
                moves.push([r, c])
            else if (board[r][c] * piece < 0) {
                moves.push([r, c])
                break;
            }
            else
                break;
        }

        for (let r = row-1; r >= 0; r--) {
            let c = col-(r-row)
            if (c < 0) break;

            if (board[r][c] === 0)
                moves.push([r, c])
            else if (board[r][c] * piece < 0) {
                moves.push([r, c])
                break;
            }
            else
                break;
        }
        for (let r = row-1; r >= 0; r--) {
            let c = col+(r-row)
            if (c >= boardSize) break;

            if (board[r][c] === 0)
                moves.push([r, c])
            else if (board[r][c] * piece < 0) {
                moves.push([r, c])
                break;
            }
            else
                break;
        }

        //("BISHOP MOVES", moves)
        setLegalMoves(moves)
    }

    const pawnMoves = (row, col, piece) => {
        let moves = []

        if (piece < 0) {
            if (row === 1 && row+2 < boardSize && board[row+2][col] === 0)
                moves.push([row+2, col])
            if (row+1 < boardSize && board[row+1][col] === 0)
                moves.push([row+1, col])
            if (row+1 < boardSize && col-1 >= 0 && board[row+1][col-1] < 0)
                moves.push([row+1, col-1])
            if (row+1 < boardSize && col+1 < boardSize && board[row+1][col+1] < 0)
                moves.push([row+1, col+1])
        } else {
            if (row === boardSize-2 && row-2 >= 0 && board[row-2][col] === 0)
                moves.push([row-2, col])
            if (row-1 >= 0 && board[row-1][col] === 0)
                moves.push([row-1, col])
            if (row-1 >= 0 && col-1 >= 0 && board[row-1][col-1] > 0)
                moves.push([row-1, col-1])
            if (row-1 >= 0 && col+1 < boardSize && board[row-1][col+1] > 0)
                moves.push([row-1, col+1])
        }

        //("PAWN MOVES", moves)
        setLegalMoves(moves)
    }

    const queenMoves = (row, col, piece) => {
        let moves = []
        
        for (let r = (row+1); r < boardSize; r++) {
            //("QUEEN MOVES BOARD", r, boardSize)
            if (board[r][col] === 0)
                moves.push([r, col])
            else if (board[r][col] * piece < 0) {
                moves.push([r, col])
                break;
            }
            else
                break;
        }
        for (let r = row-1; r >= 0; r--) {
            if (board[r][col] === 0)
                moves.push([r, col])
            else if (board[r][col] * piece < 0) {
                moves.push([r, col])
                break;
            }
            else
                break;
        }
        for (let c = col+1; c < boardSize; c++) {
            if (board[row][c] === 0)
                moves.push([row, c])
            else if (board[row][c] * piece < 0) {
                moves.push([row, c])
                break;
            }
            else
                break;
        }
        for (let c = col-1; c >= 0; c--) {
            if (board[row][c] === 0)
                moves.push([row, c])
            else if (board[row][c] * piece < 0) {
                moves.push([row, c])
                break;
            }
            else
                break;
        }

        for (let r = row+1; r < boardSize; r++) {
            let c = col-(r-row)
            if (c < 0) break;

            if (board[r][c] === 0)
                moves.push([r, c])
            else if (board[r][c] * piece < 0) {
                moves.push([r, c])
                break;
            }
            else
                break;
        }
        for (let r = row+1; r < boardSize; r++) {
            let c = col+(r-row)
            if (c >= boardSize) break;

            if (board[r][c] === 0)
                moves.push([r, c])
            else if (board[r][c] * piece < 0) {
                moves.push([r, c])
                break;
            }
            else
                break;
        }
        for (let r = row-1; r >= 0; r--) {
            let c = col-(r-row)
            if (c < 0) break;

            if (board[r][c] === 0)
                moves.push([r, c])
            else if (board[r][c] * piece < 0) {
                moves.push([r, c])
                break;
            }
            else
                break;
        }
        for (let r = row-1; r >= 0; r--) {
            let c = col+(r-row)
            if (c >= boardSize) break;

            if (board[r][c] === 0)
                moves.push([r, c])
            else if (board[r][c] * piece < 0) {
                moves.push([r, c])
                break;
            }
            else
                break;
        }

        //("QUEEN MOVES", moves)
        setLegalMoves(moves)
    }

    const kingMoves = (row, col, piece) => {
        let moves = []

        if (row < boardSize-1 && (board[row+1][col] === 0 || board[row+1][col] * piece < 0))
            moves.push([row+1, col])
        if (row > 0 && (board[row-1][col] === 0 || board[row-1][col] * piece < 0))
            moves.push([row-1, col])

        if (col < boardSize-1 && (board[row][col+1] === 0 || board[row][col+1] * piece < 0))
            moves.push([row, col+1])
        if (col > 0 && (board[row][col-1] === 0 || board[row][col-1] * piece < 0))
            moves.push([row, col-1])

        if (row < boardSize-1 && col < boardSize-1 && (board[row+1][col+1] === 0 || board[row+1][col+1] * piece < 0))
            moves.push([row+1, col+1])
        if (row < boardSize-1 && col > 0 && (board[row+1][col-1] === 0 || board[row+1][col-1] * piece < 0))
            moves.push([row+1, col-1])

        if (row > 0 && col < boardSize-1 && (board[row-1][col+1] === 0 || board[row-1][col+1] * piece < 0))
            moves.push([row-1, col+1])
        if (row > 0 && col > 0 && (board[row-1][col-1] === 0 || board[row-1][col-1] * piece < 0))
            moves.push([row-1, col-1])


        //("KING MOVES", moves)
        setLegalMoves(moves)
    }


    return (
        <div className="container vw-100 vh-100 d-flex flex-row justify-content-center align-items-center">


            <Modal isOpen={modal}>
                <ModalHeader>{player * winner > 0 ? 'Winner' : 'Loser'}</ModalHeader>
                <ModalBody>
                    {winner !== 0 ? (winner > 0 ? 'White Wins!' : 'Black Wins!') : ''}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={disconnect}>Leave</Button>{' '}
                    <Button color="secondary" onClick={()=>setModal(false)}>Keep Playing</Button>
                </ModalFooter>
            </Modal>

            <div className="mr-3">
                <h1 className="mb-2" style={{color: "var(--tile-black)"}}>{player > 0 ? 'White' : 'Black'}</h1>
                <div className="mb-3">Game ID: {id}</div>
                <div className="font-weight-bold">{getState()}</div>
                {state === 1 || state === 2 ? <div className="font-weight-bold">{pieces.length === 0 ? 'Waiting for other player' : `${pieces.length} Pieces Left`}</div> : <div className="font-weight-bold">{curPlayer > 0 ? 'White' : 'Black'} Turn</div>}
                <button className="btn btn-danger mt-3" type="button" onClick={disconnect}>Leave</button>
            </div>

            <div className="d-flex flex-wrap mh-100" style={{maxWidth: "250px"}}>
                {pieces.map((piece, index) => {
                    const pieceImg = pieceMap.get(piece);
                    return <img src={`/img/${pieceImg}`} data-piece={piece} data-index={index} width="75" height="75" draggable="true" onDragStart={dragPlaceStart} onDragEnd={dragPlaceEnd} onDrop={dragPlaceDrop}></img>
                })}
            </div>
                
                


            <div className="board ml-3">
                <div className="black-indicator"></div>
                {board.map((row, rIndex) => {
                    return (
                        <div className="d-flex">
                            {row.map((tile, tIndex) => {
                                let piece = pieceMap.get(tile);
                               
                                let classString = 'tile-feature'
                                if (placeBoard.length)
                                if (state < 3) {
                                    if (placeBoard[rIndex][tIndex] !== 0)
                                        if (placeBoard[rIndex][tIndex] > 0)
                                            classString += ' white-claim'
                                        else
                                            classString += ' black-claim'
                                } else {
                                    let move = legalMoves.filter(move => {
                                        if (move[0] === rIndex && move[1] === tIndex)
                                            return true
                                        return false
                                    })

                                    if (move.length)
                                        classString += ' tile-highlight'
                                }

                                return(
                                    <div data-tilerow={rIndex} data-tilecol={tIndex} onDragOver={dragOver} onDragEnd={dragEnd} onClick={clickTile} className={`tile ${((rIndex+tIndex) % 2 === 0) ? 'tile-white' : 'tile-black'}`}>
                                        {piece.length ? <img src={`/img/${piece}`} className="piece-img" width="75" height="75" data-tilerow={rIndex} data-tilecol={tIndex} onClick={clickTile} draggable={tile*player > 0 ? "true" : "false"} onDragStart={dragMoveStart}></img> : null}
                                        <div className={classString}>
                                        </div>
                                    </div>
                                    
                                )
                            })}
                        </div>
                    )
                })}
                <div className="white-indicator"></div>

            </div>
        </div>
    )
}



export default Home
