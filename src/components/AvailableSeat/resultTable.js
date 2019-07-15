import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { withStyles } from '@material-ui/core/styles';
import TrainStayStation from '../Utils/trainStayStation';
import { getTrainStayStation } from '../../dao/thsrObject';

const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: "#a9d0d0",
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

class ResultTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          currentPage: 0,
          rowsPerPage: 10,
          trainStayStation: [],
          modalOpen: false,
      }
    }

    componentDidMount() {
        console.log("enter");
        console.log(this.props.data);
    }

    handleChangePage = (object, page) => {
        this.setState({ currentPage: page});
    }

    handleChangeRowsPerPage = (e) => {
        this.setState({ rowsPerPage: e.target.value});
    }

    handleClickStayStation = (trainNo) => {
        getTrainStayStation(trainNo).then((result) => {
            const trainStayStation = [];
            result[0].GeneralTimetable.StopTimes.map((station) => {
                let item = {
                    StopSequence: station.StopSequence,
                    StationID: station.StationID,
                    StationName: station.StationName.Zh_tw,
                    DepartureTime: station.DepartureTime,
                };
                trainStayStation.push(item);
            });
            this.setState({ trainStayStation, modalOpen: true });
        }).catch(function(err) {
            console.log(err)
        });
    }

    handleCloseModal = () => this.setState({ modalOpen: false });

    render() {
        return (
            <div>
                <div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>車次</StyledTableCell>
                                <StyledTableCell>出發站</StyledTableCell>
                                <StyledTableCell>抵達站</StyledTableCell>
                                <StyledTableCell>發車時間</StyledTableCell>
                                <StyledTableCell>標準座位</StyledTableCell>
                                <StyledTableCell>商務座位</StyledTableCell>
                                <StyledTableCell>功能</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.data.map((row, index) => {
                                const displayStart = this.state.currentPage * this.state.rowsPerPage;
                                const displayEnd = (this.state.currentPage + 1) * this.state.rowsPerPage;
                                if(index >= displayStart && index < displayEnd) {
                                    return (<TableRow key={row.TrainNo}>
                                        <TableCell>{row.TrainNo}</TableCell>
                                        <TableCell>{row.StationName}</TableCell>
                                        <TableCell>{row.StopStationName}</TableCell>
                                        <TableCell>{row.DepartureTime}</TableCell>
                                        <TableCell>{row.StandardSeatStatus === "Available" ? "尚有座位": "座位有限" }</TableCell>
                                        <TableCell>{row.BusinessSeatStatus === "Available" ? "尚有座位": "座位有限" }</TableCell>
                                        <TableCell>
                                            <Button
                                                color="primary"
                                                onClick={() => this.handleClickStayStation(row.TrainNo)}
                                            >
                                            沿途停靠
                                            </Button>
                                        </TableCell>
                                    </TableRow>);
                                } else {
                                    return null;
                                }
                            })}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[10, 30, 60]}
                    component="div"
                    count={this.props.data.length}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.currentPage}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    labelRowsPerPage="每頁顯示筆數"
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
                <Modal
                    open={this.state.modalOpen}
                    onClose={this.handleCloseModal}
                >
                    <TrainStayStation data={this.state.trainStayStation} />
                </Modal>
            </div>
        );
    }
    
}

ResultTable.propTypes = {
    data: PropTypes.array.isRequired,
};
  
export default ResultTable;