
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as actions from "actions/events";
import { Container, Row, Col, Button } from 'reactstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Stepper from 'components/Stepper';

class MyParty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCity: null,
            startDate: null,
            selectedTheme: null,
            services: this.props.services,
            snacksVeg: this.props.snacks,
            meals: this.props.meals
        };

        this.services = [];
        this.snacksVeg = [];
        this.meals = [];
    }

    componentWillMount = () => {
        /*  if (!this.props.userinfo.hasOwnProperty('sessiontoken')) {
              window.location.pathname = '/SignIn';
          }*/
    }

    componentDidUpdate = () => {
        /* if (!this.props.userinfo.hasOwnProperty('sessiontoken')) {
             window.location.pathname = '/SignIn';
         }*/
    }

    componentDidMount = () => {
        console.log(this.props.userinfo);
        this.props.actions.fetchPartyDetails(this.props.userinfo.email, this.props.userinfo.sessiontoken);
    }

    handleChangeCity = (selectedCity) => {
        this.setState({ selectedCity });
    }

    handleChangeTheme = (selectedTheme) => {
        this.setState({ selectedTheme });
    }

    handleChangedate = (date) => {
        this.setState({
            startDate: date
        });
    }

    render() {

        const { selectedCity, selectedTheme } = this.state;

        const colourStyles = {
            control: styles => ({ ...styles, backgroundColor: 'white', borderColor: '#b30274' }),
            placeholder: styles => ({ ...styles, color: ' #b2b2b2' }),

        };

        return (

            <Container fluid={true} className='details' >
                <p className='header-title'>Party Details</p>
                <p className='header-subtitle'>General Details</p>
                <div className='details-content'>
                    <Row>
                        <Col md={{ size: 4 }} >
                            <input className='input-text' placeholder='First Name' />
                            <input className='input-text' placeholder='Phone Number' />
                        </Col>
                        <Col md={{ size: 4 }} >
                            <input className='input-text' placeholder='Last Name' />
                            <div className='datepicker'>
                                <DatePicker
                                    placeholderText='--/--/----'
                                    selected={this.state.startDate}
                                    onChange={this.handleChangedate}
                                />
                            </div>
                        </Col>
                        <Col md={{ size: 4 }} >
                            <input className='input-text' placeholder='Email' />
                            <input className='input-text' placeholder='------' />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ size: 8 }} >
                            <div className='select'>
                                <Select
                                    value={selectedTheme}
                                    onChange={this.handleChangeTheme}
                                    options={this.props.themes}
                                    placeholder='Party Theme'
                                    styles={colourStyles}
                                />
                            </div>
                            <input className='input-text' placeholder='Party Venue' />
                        </Col>
                        <Col md={{ size: 4 }} >
                            <input className='input-text' placeholder='Guest Count' />
                            <div className='select'>
                                <Select
                                    value={selectedCity}
                                    onChange={this.handleChangeCity}
                                    options={this.props.cities}
                                    placeholder='City'
                                    styles={colourStyles}
                                />
                            </div>
                        </Col>

                    </Row>
                    <input className='input-text' placeholder='Party Title' />
                </div>
            </Container>
        );
    }
}

MyParty.propTypes = {
    actions: PropTypes.object,
    userinfo: PropTypes.object,
    partydetails: PropTypes.object
};

function mapStateToProps(state) {
    return {
        userinfo: state.event.userinfo,
        partydetails: state.event.userinfo
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(
            {
                fetchPartyDetails: actions.fetchPartyDetails
            },
            dispatch
        )
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyParty));
