import React from 'react'

function Instructions(props) {
    return (
        <div className="d-flex justify-content-center w-100">
            <div className="d-flex flex-column align-items-center w-75 pb-5">
                <button className="btn btn-link mr-auto mt-3" type="button" onClick={()=>props.history.push('/')}>&lt;-- go back</button>
                
                <h1 className="display-4">How to Play</h1>
                
                <h1 className="display-6 mt-4">Step 1: Claim Tiles</h1>
                <div className="h4 d-flex align-items-center">
                    <img src="/img/step1.png" width="300"></img>
                    Players take turns claiming tiles until every tile is taken.
                    To claim a tile, click it and it will be outlined in your player color.
                </div>

                <h1 className="display-6 mt-4">Step 2: Position Pieces</h1>
                <div className="h4 d-flex align-items-center">
                    <img src="/img/step2.png" width="300"></img>
                    You are given pieces that you can place on any of your claimed tiles.
                    To place a piece, drag and drop it on to the desired tile.
                </div>

                <h1 className="display-6 mt-4">Step 3: Place Queen</h1>
                <div className="h4 d-flex align-items-center">
                    <img src="/img/step3.png" width="300"></img>
                    You are given your queen, which you can place on any of your claimed tiles.
                    The board is revealed so that you can place your queen somewhere safe.
                    To place the queen, drag and drop it on to the desired tile.
                </div>

                <h1 className="display-6 mt-4">Step 4: Play Chess</h1>
                <div className="h4 d-flex align-items-center">
                    <img src="/img/step4.png" width="300"></img>
                    All the pieces are in place, now just to play chess!
                    The game follows the same rules of chess, and whoever captures the opponent's king wins.
                    (Keep in mind that the game does not feature checking for checkmate or promotion)
                </div>

            </div>
        </div>
    )
}

export default Instructions
