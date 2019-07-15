import React from 'react';
import AppRouter from "./Router";

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      }
    }

    render() {
        return (
        <div className="App">
            <AppRouter />
        </div>
        );
    }
    
}
  
export default App;