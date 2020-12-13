class Room {
    constructor(id) {
        this.id = id
        this.board = []
        this.placeBoard = []
        this.players = []
        this.curPlayer = 1
        this.boardSize = 0
        this.state = 0
        this.whitePieces = []
        this.blackPieces = []
        this.winner = 0

        this.clearBoard(this.boardSize)
    }

    clearBoard(boardSize) {
        this.board = []
        for(let r = 0; r < boardSize; r++) {
            let newRow = []
            for(let c = 0; c < boardSize; c++) {
                newRow.push(0)
            }
            this.board.push(newRow)
        }

        this.placeBoard = []
        for(let r = 0; r < boardSize; r++) {
            let newRow = []
            for(let c = 0; c < boardSize; c++) {
                newRow.push(0)
            }
            this.placeBoard.push(newRow)
        }
    }

    movePiece(prevRow, prevCol, newRow, newCol, piece) {
        this.curPlayer = Math.abs(piece)/piece * -1

        if (Math.abs(this.board[newRow][newCol]) === 1) {
            if (this.board[newRow][newCol] * piece < 0) {
                if (this.winner === 0)
                    this.winner = piece
            }
        }

        this.board[prevRow][prevCol] = 0
        this.board[newRow][newCol] = piece
    }

    setPiece(row, col, piece) {
        this.board[row][col] = piece

        if (piece > 0) {
            const i = this.whitePieces.indexOf(parseInt(piece))
            this.whitePieces.splice(i, 1)
        } else {
            const i = this.blackPieces.indexOf(parseInt(piece))
            this.blackPieces.splice(i, 1)
        }
    }

    setLines(lines) {
        if (lines > 0) {
            this.placeBoard = []
            for(let r = 0; r < this.boardSize; r++) {
                let newRow = []
                for(let c = 0; c < this.boardSize; c++) {
                    if (r < lines)
                        newRow.push(-1)
                    else if (r >= this.boardSize-lines)
                        newRow.push(1)
                    else
                        newRow.push(0)
                }
                this.placeBoard.push(newRow)
            }

            if (lines >= this.boardSize/2)
                this.setState(1)
        }
    }

    claimTile(row, col, player) {
        this.curPlayer = player * -1
        this.placeBoard[row][col] = player

        let boardFull = true
        for(let r = 0; r < this.placeBoard.length; r++) {
            for(let c = 0; c < this.placeBoard[r].length; c++) {
                if (this.placeBoard[r][c] === 0) {
                    boardFull = false
                    break
                }
            }
        }
        if (boardFull)
            this.state = 1
    }

    getPieces(player) {
        if (player > 0)
            return this.whitePieces
        else
            return this.blackPieces
    }
    setPieces(pieces) {
        this.whitePieces = [...pieces]
        this.blackPieces = [...pieces].map(p => p*-1)
    }

    getState() {
        return this.state
    }

    setState(state) {
        this.state = state
    }

    getCurPlayer() {
        return this.curPlayer
    }

    getBoard() {
        return this.board
    }

    setBoardSize(boardSize) {
        this.boardSize = boardSize
        this.clearBoard(this.boardSize)
    }

    getBoardSize() {
        return this.boardSize
    }
    
    getWinner() {
        return this.winner
    }

    getPlayerBoard(player) {
        let playerBoard = []
        for (let r = 0; r < this.boardSize; r++) {
            let newRow = []
            for (let c = 0; c < this.boardSize; c++) {
                let piece = this.board[r][c]
                if (piece * player > 0)
                    newRow.push(piece)
                else
                    newRow.push(0)
            }
            playerBoard.push(newRow)
        }
        return playerBoard
    }

    getPlaceBoard() {
        return this.placeBoard
    }

    getID() {
        return this.id
    }

    addPlayer(socket) {
        this.players.push(socket)
    }

    getPlayers() {
        return this.players
    }
}

module.exports = Room