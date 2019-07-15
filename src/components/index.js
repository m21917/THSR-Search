import React from 'react';
import Header from './header';
import News from './News/index';

class Index extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
        <div>
            <Header/>
            <News/>
            {this.props.children}
        </div>
        );
    }
    
}
  
export default Index;