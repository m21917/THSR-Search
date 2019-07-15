import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import RadioGroup from '@material-ui/core/RadioGroup';;
import Button from '@material-ui/core/Button';
import monent from 'moment';
import { withStyles } from '@material-ui/core/styles';
import ResultTable from './resultTable';
import AlertDialog from '../Utils/dialogs';
import { getStationList, getAvailableSeat } from "../../dao/thsrObject";


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
    }
});

class AvailableSeat extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        startStation: '',
        stopStation: '',
        stationList: [],
        Direction: "0",
        resultList: [],
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
                const item = {
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
        this.setState({
            [name]: e.target.value,
        });
    };

    searchSeat = () => {
        const direction = parseInt(this.state.Direction, 10);
        const sortByTime = (a, b) => {
            const aTime = monent(a.DepartureTime, "HH:mm");
            const bTime = monent(b.DepartureTime, "HH:mm");
            if (aTime.isAfter(bTime)) return 1;
            else return -1;
        };

        getAvailableSeat(this.state.startStation).then((result) => {
            const resultList = [];
            result[0].AvailableSeats.map((trainInfo) => {
                if (trainInfo.Direction === direction) {
                    trainInfo.StopStations.map((stopStation) => {
                        if (
                            stopStation.StationID === this.state.stopStation && 
                            (stopStation.StandardSeatStatus !== "Full" || stopStation.BusinessSeatStatus !== "Full")
                        ) {
                            const  item = {
                                TrainNo: trainInfo.TrainNo,
                                StationName: trainInfo.StationName.Zh_tw,
                                StopStationName: stopStation.StationName.Zh_tw,
                                DepartureTime: trainInfo.DepartureTime,
                                StandardSeatStatus: stopStation.StandardSeatStatus,
                                BusinessSeatStatus: stopStation.BusinessSeatStatus,
                            };
                            const now = monent();
                            const trainDepatureTime = monent(item.DepartureTime, "HH:mm");
                            if (trainDepatureTime.isAfter(now)) resultList.push(item);
                            
                        }
                    });
                }
            });
            if (!resultList.length) {
                this.setState({ 
                    dialogs: {
                        open: true,
                        title: "提示",
                        content: "查無任何班次！",
                    } 
                });
            }
            resultList.sort(sortByTime);
            this.setState({ resultList });
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
                    <h3>空位查詢</h3>
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
                        <RadioGroup 
                            aria-label="Direction"
                            name="Direction"
                            value={this.state.Direction}
                            onChange={(e) => this.handleChange('Direction', e)}
                            row
                        >
                            <FormControlLabel
                                value="0"
                                control={<Radio color="primary" />}
                                label="南下"
                                labelPlacement="start"
                            />
                            <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label="北上"
                                labelPlacement="start"
                            />
                        </RadioGroup>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <Button 
                            variant="contained"
                            color="primary"
                            onClick={this.searchSeat}
                        >
                            搜尋
                        </Button>
                    </FormControl> 
                    {this.state.resultList.length > 0 && <ResultTable data={this.state.resultList} />}
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

AvailableSeat.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(AvailableSeat);