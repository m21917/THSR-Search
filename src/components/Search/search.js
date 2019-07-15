import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { getStationList, searchTrainByDateAndStop, getTrainStayStation } from "../../dao/thsrObject";
import AlertDialog from '../Utils/dialogs';
import monent from 'moment';
import Modal from '@material-ui/core/Modal';
import ResultTable from './resultTable';
import TrainStayStation from '../Utils/trainStayStation';

const styles = theme => ({
    root: {
        padding: theme.spacing(1, 2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    button: {
        marginTop: '13px',
    },
    textField: {
        marginTop: 0,
    },
    gridRight: {
        textAlign: 'right',
    }
});

class Search extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        startStation: '',
        stopStation: '',
        stationList: [],
        searchResult: [],
        TrainNo: '',
        modalOpen: false,
        dateTime: monent().format("YYYY-MM-DD"),
        dialogs: {
            open: false,
            title: '',
            content: '',
        }
      }
    }

    componentDidMount() {
        getStationList().then((result) => {
            console.log(result)
            const stationList = [];
            result.map((station) => {
                let item = {
                    name: station.StationName.Zh_tw,
                    value: station.StationID,
                };
                stationList.push(item);
            });
            this.setState({ stationList });
        }).catch(function(err) {
            console.log(err)
        });
    }

    handleChange = (name, e) => {
        console.log(e.target.value)
        this.setState({
            [name]: e.target.value,
        });
    };

    searchTrain = () => {
        const sortByTime = (a, b) => {
            const aTime = monent(a.DepartureTime, "HH:mm");
            const bTime = monent(b.DepartureTime, "HH:mm");
            if (aTime.isAfter(bTime)) return 1;
            else return -1;
        };
        searchTrainByDateAndStop(this.state.startStation, this.state.stopStation, this.state.dateTime)
            .then((result) => {
                const searchResult = [];
                result.map((trainInfo) => {
                    let item = {
                        TrainNo: trainInfo.DailyTrainInfo.TrainNo,
                        StartingStationName: trainInfo.DailyTrainInfo.StartingStationName.Zh_tw,
                        EndingStationName: trainInfo.DailyTrainInfo.EndingStationName.Zh_tw,
                        DepartureStationName: trainInfo.OriginStopTime.StationName.Zh_tw,
                        ArrivalStationName: trainInfo.DestinationStopTime.StationName.Zh_tw,
                        ArrivalTime: trainInfo.DestinationStopTime.ArrivalTime,
                        DepartureTime: trainInfo.OriginStopTime.ArrivalTime,
                    };
                    const now = monent();
                    const trainDepatureTime = monent(`${this.state.dateTime} ${item.DepartureTime}`, "YYYY-MM-DD HH:mm");
                    if (trainDepatureTime.isAfter(now)) searchResult.push(item);
                    
                });
                if (!searchResult.length) {
                    this.setState({ 
                        dialogs: {
                            open: true,
                            title: "提示",
                            content: "查無任何班次！",
                        } 
                    });
                    return;
                }
                searchResult.sort(sortByTime);
                this.setState({ searchResult });
            }).catch((err) => {

            });
    }

    handleClickStayStation = () => {
        const trainNo = this.state.TrainNo;
        if (trainNo === '') {
            this.setState({ 
                dialogs: {
                    open: true,
                    title: "提示",
                    content: "請輸入車次號碼",
                } 
            });
            return;
        }
        getTrainStayStation(trainNo).then((result) => {
            if (!result.length) {
                this.setState({ 
                    dialogs: {
                        open: true,
                        title: "提示",
                        content: "查無車次資訊",
                    } 
                });
                return;
            }
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

    headleDialogsClose = () => this.setState({ dialogs: { ...this.state.dialogs, open: false } });

    handleCloseModal = () => this.setState({ modalOpen: false });

    render() {
        const { classes } = this.props;

        return (
            <Box m={1} p={1}>
                <Paper className={classes.root}>
                    <h3>查詢車次</h3>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="startStation">啟程站</InputLabel>
                                <Select
                                    native
                                    value={this.state.startStation}
                                    onChange={(e) => this.handleChange('startStation', e)}
                                    inputProps={{
                                        name: 'startStation',
                                        id: 'startStation',
                                    }}
                                >
                                    <option value="" />
                                    {this.state.stationList.map(station => <option key={station.value} value={station.value}>{station.name}</option>)}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="stopStation">到達站</InputLabel>
                                <Select
                                    native
                                    value={this.state.stopStation}
                                    onChange={(e) => this.handleChange('stopStation', e)}
                                    inputProps={{
                                        name: 'stopStation',
                                        id: 'stopStation',
                                    }}
                                >
                                    <option value="" />
                                    {this.state.stationList.map(station => <option key={station.value} value={station.value}>{station.name}</option>)}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    id="date"
                                    label="日期"
                                    type="date"
                                    value={this.state.dateTime}
                                    onChange={(e) => this.handleChange('dateTime', e)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <Button 
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={this.searchTrain}
                                >
                                    搜尋
                                </Button>
                            </FormControl> 
                        </Grid>
                        <Grid item xs={6} className={classes.gridRight}>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    id="standard-name"
                                    label="車次號碼"
                                    className={classes.textField}
                                    value={this.state.TrainNo}
                                    onChange={(e) => this.handleChange('TrainNo', e)}
                                    margin="normal"
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <Button 
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={this.handleClickStayStation}
                                >
                                    查看沿途停靠
                                </Button>
                            </FormControl> 
                        </Grid>
                    </Grid>
                    
                    {this.state.searchResult.length > 0 && <ResultTable data={this.state.searchResult} />}
                </Paper>
                <Modal
                    open={this.state.modalOpen}
                    onClose={this.handleCloseModal}
                >
                    <TrainStayStation data={this.state.trainStayStation} />
                </Modal>
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

Search.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Search);