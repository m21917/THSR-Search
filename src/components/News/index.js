import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import AlertDialog from '../Utils/dialogs';
import { getNews } from '../../dao/thsrObject';
import monent from 'moment';

const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: "#a9d0d0",
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

const styles = theme => ({
    root: {
        padding: theme.spacing(1, 2),
    },
});

class News extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        News: [],
        dialogs: {
            open: false,
            title: '',
            content: '',
        }
      }
    }

    componentDidMount() {
        getNews().then((result) => {
            console.log(result);
            this.setState({ News: result});
        }).catch(function(err) {
            console.log(err)
        });
    }

    headleDialogsClose = () => this.setState({ dialogs: { ...this.state.dialogs, open: false } });

    render() {
        const { classes } = this.props;

        return (
            <Box m={1} p={1}>
                <Paper className={classes.root}>
                    <h3>最新消息</h3>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>發佈時間</StyledTableCell>
                                <StyledTableCell>分類</StyledTableCell>
                                <StyledTableCell>標題</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.News.map((row) => (
                                <TableRow key={row.NewsID}>
                                    <TableCell>{monent(row.PublishTime).format("YYYY-MM-DD")}</TableCell>
                                    <TableCell>{row.NewsCategory}</TableCell>
                                    <TableCell>
                                        <a href={row.NewsUrl} target="_blink">{row.Title}</a>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
                <AlertDialog 
                    open={this.state.dialogs.open}
                    title={this.state.dialogs.title}
                    content={this.state.dialogs.content} 
                    onClickClose={this.headleDialogsClose}
                />
            </Box>
        );
    }
    
}

News.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(News);