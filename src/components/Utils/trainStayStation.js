import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        margin: '0 auto',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 4),
        outline: 'none',
    },
});

class TrainStayStation extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>停靠站</TableCell>
                        <TableCell>進站時間</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data.map((row) => (
                            <TableRow key={row.StopSequence}>
                                <TableCell>{row.StationName}</TableCell>
                                <TableCell>{row.DepartureTime}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
    
}

TrainStayStation.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
};
  
export default withStyles(styles)(TrainStayStation);