
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
import Charges from 'components/Charges';

class vendorDetails extends Component {
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

    componentDidMount = () => {
        this.props.actions.fetchEventDetails();
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

        let serviceCard = this.state.services.map((item, i) => {
            return (<Col md={{ size: 3 }} key={i} >
                <label className='control control--checkbox'>
                    {item.desc}
                    <input type='checkbox' ref={el => this.services.push({ id: item.id, el: el })} />
                    <div className='control__indicator' />
                </label>
                {this.services[i] && this.services[i].el && (
                    <div className='stepperCont vendor'>
                        <Charges
                            placeholder='Charges'
                            isDisabledEl={this.services[i].el}
                            setref={(ref) => { this.services[i]["inputValue"] = ref; }}
                        />
                    </div>)}
                    </Col>);
        });

        let snacksVegCard = this.state.snacksVeg.map((item, i) => {
            return (
                <Col md={{ size: 4 }} key={i} >
                    <div className='item-list'>
                        <img src='assets/images/item.jpg' />
                        <div className='ctrl'>
                            <label className='control control--checkbox'>
                                {item.desc}
                                <input type='checkbox' ref={el => this.snacksVeg.push({ id: item.id, el: el })} />
                                <div className='control__indicator' />
                            </label>
                            {this.snacksVeg[i] && this.snacksVeg[i].el && (
                                <div className='stepperCont vendor'>
                                    <Charges
                                        placeholder='Charges'
                                        isDisabledEl={this.snacksVeg[i].el}
                                        setref={(ref) => { this.snacksVeg[i]["inputValue"] = ref; }}
                                    />
                                </div>)}
                        </div>
                    </div>
                </Col>
            );
        });

        let mealsCard = this.state.meals.map((item, i) => {
            return (
                <Col md={{ size: 4 }} key={i} >
                    <div className='item-list'>
                        <img src='assets/images/item.jpg' />
                        <div className='ctrl'>
                            <label className='control control--checkbox'>
                                {item.desc}
                                <input type='checkbox' ref={el => this.meals.push({ id: item.id, el: el })} />
                                <div className='control__indicator' />
                            </label>
                            {this.meals[i] && this.meals[i].el && (
                                <div className='stepperCont vendor'>
                                    <Charges
                                        placeholder='Charges'
                                        isDisabledEl={this.meals[i].el}
                                        setref={(ref) => { this.meals[i]["inputValue"] = ref; }}
                                    />
                                </div>)}
                        </div>
                    </div>
                </Col>

            );

        });


        return (
            this.props.loaded ?
                <Container fluid={true} className='details' >
                    <p className='header-title'>Vendor Details</p>
                    <p className='header-subtitle'>General Details</p>
                    <div className='details-content'>

                        <Row>
                            <Col md={{ size: 8 }} >
                                <input className='input-text' placeholder='Company Name' />
                            </Col>
                            <Col md={{ size: 4 }} >
                                <input className='input-text' placeholder='Contact Name' />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ size: 4 }} >
                                <input className='input-text' placeholder='Email' />
                            </Col>
                            <Col md={{ size: 4 }} >
                                <input className='input-text' placeholder='Phone Number(Main/Primary)' />
                            </Col>
                            <Col md={{ size: 4 }} >
                                <input className='input-text' placeholder='Phone Number(Alernate)' />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ size: 12 }} >
                                <input className='input-text' placeholder='Office Address' />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ size: 6 }} >
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
                            <Col md={{ size: 6 }} >
                                <div className='select'>
                                    <Select
                                        value={selectedTheme}
                                        onChange={this.handleChangeTheme}
                                        options={this.props.themes}
                                        placeholder='State'
                                        styles={colourStyles}
                                    />
                                </div>
                            </Col>

                        </Row>


                        <input className='input-text' placeholder='Message if any' />
                    </div>
                    <p className='header-subtitle'>Services Offered : Charges</p>
                    <div className='service-details vendor'>
                        <Row >
                            {serviceCard}
                        </Row>
                    </div>
                    <p className='header-subtitle'>Snacks Vegetarian: Price (Rs)/Rate</p>
                    <div className='snackveg-details'>
                        <Row >
                            {snacksVegCard}
                        </Row>
                    </div>

                    <p className='header-subtitle'>: Price (Rs)/Rate</p>
                    <div className='snackveg-details'>
                        <Row >
                            {mealsCard}
                        </Row>
                    </div>

                    <div className='next-blk'>
                        <Button>Save</Button>
                    </div>
                </Container>
                : <div className='loader-dots' />
        );
    }
}

vendorDetails.propTypes = {
    actions: PropTypes.object,
    loaded: PropTypes.bool,
    snacks: PropTypes.array,
    cities: PropTypes.array,
    services: PropTypes.array,
    meals: PropTypes.array,
    themes: PropTypes.array,
};

function mapStateToProps(state) {
    return {
        loaded: state.event.catalogue.loaded,
        snacks: state.event.catalogue.data.snacks,
        cities: state.event.catalogue.data.cities,
        services: state.event.catalogue.data.services,
        meals: state.event.catalogue.data.meals,
        themes: state.event.catalogue.data.themes,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(
            {
                fetchEventDetails: actions.fetchEventDetails
            },
            dispatch
        )
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(vendorDetails));
