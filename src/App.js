import React, { Component } from 'react';
import PlayingField from "./PlayingField"

class App extends Component {  
  render() {
    return (
      <div className="App">
        <div className="outer">
        <PlayingField />         
        </div>        
      </div>
    );
  }
}

export default App;
