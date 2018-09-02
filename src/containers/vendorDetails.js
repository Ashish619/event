
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as actions from "actions/events";
import { Container, Row, Col, Button } from 'reactstrap';
import Select from 'react-select';

import Charges from 'components/Charges';

class vendorDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCity: null,
            services: this.props.services,
            snacksVeg: this.props.snacks,
            meals: this.props.meals,
            mgrfirstname: "",
            mgrlastname: "",
            coname: "",
            coaddress: "",
            officecity: "",
            officestate: "",
            country: "",
            primaryphone: "",
            secondaryphone: "",
            email: "",
            message: "",
            lastpartydate: ""

        };
        this.services = [];
        this.snacksVeg = [];
        this.meals = [];
    }


    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    componentDidMount = () => {
        this.props.actions.fetchEventDetails();
    }

    componentDidUpdate(prevProps) {

        if (this.props.loaded !== prevProps.loaded) {
            this.setState({
                services: this.props.services,
                snacksVeg: this.props.snacks,
                meals: this.props.meals
            });
        }
    }

    handleChangeCity = (selectedCity) => {
        this.setState({ selectedCity });
    }

    submitRequest = () => {
        let selectedServices = this.services.filter(obj => obj.el &&
            obj.el.checked &&
            obj.hasOwnProperty('inputValue')).map(obj => ({
                service: Number(obj.id),
                price: Number(obj.inputValue.value)
            }));

        let selectedsnacksVeg = this.snacksVeg.filter(obj => obj.el &&
            obj.el.checked &&
            obj.hasOwnProperty('inputValue')).map(obj => ({
                service: Number(obj.id),
                price: Number(obj.inputValue.value)
            }));

        let selectedmeals = this.meals.filter(obj => obj.el &&
            obj.el.checked &&
            obj.hasOwnProperty('inputValue')).map(obj => ({
                service: Number(obj.id),
                price: Number(obj.inputValue.value)
            }));



        actions.registerVendorDetails({

            mgrfirstname: this.state.mgrfirstname,
            mgrlastname: this.state.mgrlastname,
            coname: this.state.coname,
            coaddress: this.state.coaddress,
            officecity: Number(this.state.selectedCity.city_id),
            officestate: this.state.officestate,
            country: this.state.country,
            primaryphone: this.state.primaryphone,
            secondaryphone: this.state.secondaryphone,
            email: this.state.email,
            message: this.state.message,
            lastpartydate: this.state.lastpartydate,
            services: selectedServices,
            snacks: selectedsnacksVeg,
            meals: selectedmeals

        });
    }

    render() {

        if (this.props.loaded) {
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

                <Container fluid={true} className='details' >
                    <p className='header-title'>Vendor Details</p>
                    <p className='header-subtitle'>General Details</p>
                    <div className='details-content'>

                        <Row>
                            <Col md={{ size: 8 }} >
                                <input className='input-text' placeholder='Company Name'
                                    name='coname'
                                    value={this.state.coname}
                                    onChange={this.handleChange} />
                            </Col>
                            <Col md={{ size: 4 }} >
                                <input className='input-text' placeholder='Contact Name'
                                    name='mgrfirstname'
                                    value={this.state.mgrfirstname}
                                    onChange={this.handleChange} />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ size: 4 }} >
                                <input className='input-text' placeholder='Email'
                                    name='email'
                                    value={this.state.email}
                                    onChange={this.handleChange} />
                            </Col>
                            <Col md={{ size: 4 }} >
                                <input className='input-text' placeholder='Phone Number(Main/Primary)'
                                    name='primaryphone'
                                    value={this.state.primaryphone}
                                    onChange={this.handleChange} />
                            </Col>
                            <Col md={{ size: 4 }} >
                                <input className='input-text' placeholder='Phone Number(Alernate)'
                                    name='secondaryphone'
                                    value={this.state.secondaryphone}
                                    onChange={this.handleChange} />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ size: 12 }} >
                                <input className='input-text' placeholder='Office Address'
                                    name='coaddress'
                                    value={this.state.coaddress}
                                    onChange={this.handleChange} />
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
                                <input
                                    className='input-text'
                                    placeholder='State'
                                    style={{ position: 'relative', top: 5 + 'px' }}
                                    onChange={this.handleChange}
                                    name='officestate'
                                    value={this.state.officestate} />
                            </Col>
                        </Row>
                        <input className='input-text' placeholder='Message if any'
                            onChange={this.handleChange}
                            name='message'
                            value={this.state.message} />
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
                        <Button onClick={this.submitRequest}>Save</Button>
                    </div>
                </Container>

            );
        } else {
            return (<div className='loader-dots' />);
        }
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
        loaded: state.event.catalogue.data.loaded,
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
