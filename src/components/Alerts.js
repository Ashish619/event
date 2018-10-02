
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert } from 'reactstrap';

class Alerts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: true
        };
    }


    render() {
        const { color, isOpen, Message, onDismiss } = this.props;
        return (
            <Alert color={color} isOpen={isOpen} toggle={onDismiss}>
                {Message}
            </Alert>
        );
    }
}

Alerts.propTypes = {
    Message: PropTypes.string,
    color: PropTypes.string,
    isOpen: PropTypes.bool,
    onDismiss: PropTypes.func

};



export default Alerts;
