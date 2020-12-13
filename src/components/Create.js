import React, {useState, useEffect} from 'react'

function Create(props) {

    const [size, setSize] = useState(8)
    const [line, setLine] = useState(0)
    const [error, setError] = useState('')
    const [id, setID] = useState('')


    useEffect(() => {
        setID(randomString(4, '0123456789abcdefghijklmnopqrstuvwxyz'))
    }, [])

    const randomString = (length, chars) => {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        let pieces = []

        let pawns = parseInt(e.target.pawn.value)
        let rooks = parseInt(e.target.rook.value)
        let knights = parseInt(e.target.knight.value)
        let bishops = parseInt(e.target.bishop.value)
        let queens = parseInt(e.target.queen.value)
        
        for (let i = 0; i < pawns; i++) pieces.push(6)
        for (let i = 0; i < rooks; i++) pieces.push(5)
        for (let i = 0; i < knights; i++) pieces.push(4)
        for (let i = 0; i < bishops; i++) pieces.push(3)
        for (let i = 0; i < queens; i++) pieces.push(2)

        if (pieces.length+1 > (size*size)/2)
            setError('Too many pieces. Increase board size or decrease pieces')
        else {
            setError('')
            props.history.push({
                pathname: `/game/${id}`,
                boardSize: size,
                pieces: pieces,
                lines: line
            })
        }
    }

    const handleSize = (e) => {
        setSize(e.target.value)

        if (line > e.target.value / 2)
            setLine(e.target.value/2)
    }

    return (
        <div className="container d-flex align-items-center flex-column w-100">
            <button className="btn btn-link mr-auto mt-3 ml-5" type="button" onClick={()=>props.history.push('/')}>&lt;-- go back</button>

            <form className="pt-4 pb-5" onSubmit={handleSubmit}>
                <h1 className="display-4 ml-5 mr-5">Create Game</h1>
                <div className="mb-4 text-center w-100">Game ID: <span className="text-info font-weight-bold h4">{id}</span></div>
                
                <div className="form-group d-flex">
                    <label htmlFor="size" style={{whiteSpace: 'nowrap'}}>Board Size: {size}x{size}</label>
                    <input className="custom-range ml-3" type="range" id="size" name="size" min="2" max="10" step="2" value={size} onChange={handleSize}/>
                </div>

                <div className="form-group d-flex">
                    <label htmlFor="line" style={{whiteSpace: 'nowrap'}}>Auto-fill Lines: {line}</label>
                    <input className="custom-range ml-3" type="range" id="line" name="line" min="0" max={size/2} step="1" value={line} onChange={(e)=>setLine(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="pawn">Pawns</label>
                    <input className="form-control" type="number" id="pawn" name="pawn" min="0" defaultValue="8"/>
                </div>

                <div className="form-group">
                    <label htmlFor="rook">Rooks</label>
                    <input className="form-control" type="number" id="rook" name="rook" min="0" defaultValue="2"/>
                </div>
                
                <div className="form-group">
                    <label htmlFor="knight">Knights</label>
                    <input className="form-control" type="number" id="knight" name="knight" min="0" defaultValue="2"/>
                </div>

                <div className="form-group">
                    <label htmlFor="bishop">Bishops</label>
                    <input className="form-control" type="number" id="bishop" name="bishop" min="0" defaultValue="2"/>
                </div>

                <div className="form-group">
                    <label htmlFor="queen">Queens</label>
                    <input className="form-control" type="number" id="queen" name="queen" min="0" defaultValue="1"/>
                </div>

                <div className="font-weight-bold text-danger mb-1">
                    {error}
                </div>
                <button className="btn btn-primary btn-block">Create</button>
            </form>
        </div>
    )
}

export default Create
