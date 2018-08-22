
import React, { Component } from "react";
import PropTypes from "prop-types";


class Stepper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }
    handleChange = (e) => {
        if (this.props.isDisabledEl.checked) {
            this.setState({ value: e.target.value });
        }
    }

    render() {

        return (
            <input
                value={this.state.value}
                placeholder={this.props.placeholder}
                className='text-charges'
                onChange={this.handleChange}
                ref={el => this.props.setref(el)}
            />
        );
    }
}

Stepper.propTypes = {
    isDisabledEl: PropTypes.any,
    setref: PropTypes.func,
    placeholder: PropTypes.string

};



export default Stepper;
