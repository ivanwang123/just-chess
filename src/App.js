import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Create from './components/Create'
import Instructions from './components/Instructions'
import Game from './components/Game'
import Lobby from './components/Lobby'

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Lobby} />
        <Route path="/create" component={Create} />
        <Route path="/instructions" component={Instructions} />
        <Route path="/game/:id" component={Game} />
      </Router>
    </div>
  );
}

export default App;
