
import React, { Component } from "react";
import PropTypes from "prop-types";


class Stepper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.defaultValue || 0,

        };
    }


    componentDidUpdate = (prevProps) => {
        if (this.props.defaultValue !== prevProps.defaultValue) {
            this.setState({ value: this.props.defaultValue });
        }

    }
    handleChange = (e) => {
        if (this.props.isDisabledEl.checked) {
            let text = e.target.value;
            if (/\D/.test(text)) {
                text = text.replace(/\D/g, "");
            }

            this.setState({ value: text });
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
    setref: PropTypes.func,
    defaultValue: PropTypes.any

};



export default Stepper;
