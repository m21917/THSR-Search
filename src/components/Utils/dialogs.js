import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
class AlertDialog extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClickClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {this.props.content}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.props.onClickClose} color="primary">確定</Button>
                </DialogActions>
            </Dialog>
        );
    }
    
}

AlertDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};

export default AlertDialog;