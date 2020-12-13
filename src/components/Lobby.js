import React, {useState} from 'react'

function Create(props) {
    const [roomID, setRoomID] = useState('')

    const handleChange = (e) => {
        setRoomID(e.target.value)
    }

    const handleSubmit = (e) => {
        props.history.push(`/game/${roomID}`)
    }

    const createRoom = (e) => {
        props.history.push('/create')
    }

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vw-100 vh-100">
            <h1 className="display-1">Just Chess</h1>
            <form className="mt-5 mb-5" onSubmit={handleSubmit}>
                <label className="mr-3" htmlFor="roomID">Join Game</label>
                <input type="text" placeholder="Game ID" id="roomID" onChange={handleChange} value={roomID}></input>
            </form>
            <button className="btn btn-danger" type="button" onClick={createRoom}>Create Game</button>
            <button className="btn btn-secondary" type="button" onClick={()=>props.history.push('/instructions')}>How to Play</button>
        </div>
    )
}

export default Create
