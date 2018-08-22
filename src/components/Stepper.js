
import React, { Component } from "react";
import PropTypes from "prop-types";


class Stepper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,

        };
    }
    handleChange = (e) => {
        if (this.props.isDisabledEl.checked) {
            this.setState({ value: e.target.value });
        }
    }
    increment = () => {
        if (this.props.isDisabledEl.checked) {
            let value = Number(this.state.value);
            value += 1;
            this.setState({ value });

        } else {
            this.setState({ isDisabled: false });
        }
    }

    decrement = () => {
        if (this.props.isDisabledEl.checked) {
            let value = Number(this.state.value);
            if (value >= 0) {
                value -= 1;
                this.setState({ value });
            }
        } else {
            this.setState({ isDisabled: false });
        }
    }

    render() {

        return (
            <div className='stepper'>
                {this.state.value === 0
                    ? <span className='placeholder'>ADD</span>
                    :
                    <span className='input-container'>
                        <button className='dec' onClick={this.decrement}>-</button>
                        <input
                            value={this.state.value}
                            onChange={this.handleChange}
                            ref={el => this.props.setref(el)}
                        />
                    </span>}
                <button className='inc' onClick={this.increment}>+</button>
            </div>


        );
    }
}

Stepper.propTypes = {
    isDisabledEl: PropTypes.any,
    setref: PropTypes.func

};



export default Stepper;
