import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { withRouter } from "react-router";

const styles = theme => ({
    title: {
        marginRight: 20,
    },
});


class Header extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      }
    }

    render() {
        const { classes } = this.props;
        return (
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" color="inherit" className={classes.title}>
                        高鐵查詢系統
                    </Typography>
                    <nav className="headerNav">
                        <ul>
                            <li className={this.props.location.pathname === "/" ? "active" : ""}>
                                <Link to="/">查詢車次</Link>
                            </li>
                            <li className={this.props.location.pathname === "/AvailableSeat" ? "active" : ""}>
                                <Link to="/AvailableSeat">空位查詢</Link>
                            </li>
                        </ul>
                    </nav>
                </Toolbar>
            </AppBar>
        );
    }
    
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withRouter(withStyles(styles)(Header));