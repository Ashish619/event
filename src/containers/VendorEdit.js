
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as actions from "actions/events";
import { Container, Row, Col, Button } from 'reactstrap';
import Select from 'react-select';

import Charges from 'components/Charges';

class VendorEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCity: null,
            services: this.props.services,
            snacksVeg: this.props.snacks,
            meals: this.props.meals,
            officecity: "",
             lastpartydate: "",
            vendor: {},
            selectedCityDefault: null,
            showVendorEdit: false

        };

        this.services = [];
        this.snacksVeg = [];
        this.meals = [];

        this.userinfo = {
            primaryphone: "",
            secondaryphone: "",
            email: "",
            message: "",
            officestate: "",
            mgrfirstname: "",
            mgrlastname: "",
            coname: "",
            coaddress: "",
        };

    }


    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    componentDidMount = () => {
        actions.resetEmployee();
        this.props.actions.fetchEventDetails();
        actions.getVendorDetails(this.props.userinfo.email, this.props.userinfo.sessiontoken).
            then(res => res.json()).then(res => {
                this.setState({ vendor: res },
                    () => { this.updateUser(res); });
            });
    }

    componentDidUpdate(prevProps) {

        if (this.props.loaded !== prevProps.loaded) {
            this.setState({
                services: this.props.services,
                snacksVeg: this.props.snacks,
                meals: this.props.meals
            }, () => {
                actions.getVendorDetails(this.props.userinfo.email, this.props.userinfo.sessiontoken).
                    then(res => res.json()).then(res => {
                        this.setState({ vendor: res },
                            () => { this.updateUser(res); });
                    }); this.forceUpdate();
            });
        }
    }

    handleChangeCity = (selectedCity) => {
        this.setState({ selectedCity });
    }

    serviceDefault = (param, item) => {
        let defaultValue = '';
        if (this.state.vendor.hasOwnProperty(param)) {
            this.state.vendor[param].forEach(element => {
                if (element.service == item.id) {
                    defaultValue = element.price;
                }
            });
        }
        return defaultValue;
    }


    setChecked = (item, param, el) => {
        if (el) {
            let defaultValue = false;
            if (this.state.vendor.hasOwnProperty(param)) {
                this.state.vendor[param].forEach(element => {
                    if (element.service == item.id) {
                        defaultValue = true;
                    }

                });
            }
            el.checked = defaultValue;
        }

    }
    updateUser = (res) => {
        let vendor = { ...this.state.vendor };
        let city_idobj;
        for (let k = 0; k < this.props.cities.length; k++) {
            if (this.props.cities[k].city_id == vendor.officecity) {
                city_idobj = k;
            }
        }


        this.userinfo.primaryphone.value = vendor.primaryphone;
        this.userinfo.secondaryphone.value = vendor.secondaryphone;
        this.userinfo.email.value = vendor.email;
        this.userinfo.message.value = vendor.message;
        this.userinfo.officestate.value = vendor.officestate;
        this.userinfo.mgrfirstname.value = vendor.mgrfirstname;
        this.userinfo.mgrlastname.value = vendor.mgrlastname;
        this.userinfo.coname.value = vendor.coname;
        this.userinfo.coaddress.value = vendor.coaddress;


        this.setState({
            selectedCityDefault: city_idobj,
            selectedCity: this.props.cities[city_idobj],
            showVendorEdit: true
        }, () => { this.forceUpdate(); });
    }

    cancelRequest = () => {
        window.location.href = "/MyPartyVendor";
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






        actions.updateVendorDetails({
            mgrfirstname: this.userinfo.mgrfirstname.value,
            mgrlastname: this.userinfo.mgrlastname.value,
            coname: this.userinfo.coname.value,
            coaddress: this.userinfo.coaddress.value,
            officecity: Number(this.state.selectedCity.city_id),
            officestate: this.userinfo.officestate.value,
            country: "",
            primaryphone: this.userinfo.primaryphone.value,
            secondaryphone: this.userinfo.secondaryphone.value,
            email: this.userinfo.email.value,
            message: this.userinfo.message.value,
            lastpartydate: this.state.lastpartydate,
            services: selectedServices,
            snacks: selectedsnacksVeg,
            meals: selectedmeals

        }, this.props.userinfo.sessiontoken, this.props.userinfo.email);
    }

    render() {


        if (this.props.loaded) {

            const colourStyles = {
                control: styles => ({ ...styles, backgroundColor: 'white', borderColor: '#b30274' }),
                placeholder: styles => ({ ...styles, color: ' #b2b2b2' }),

            };
            let serviceCard = this.state.services.map((item, i) => {
                return (<Col md={{ size: 3 }} key={i} >
                    <label className='control control--checkbox'>
                        {item.desc}
                        <input type='checkbox' ref={el => {
                            this.setChecked(item, "services", el);
                            this.services.push({ id: item.id, el: el });
                        }} />
                        <div className='control__indicator' />
                    </label>
                    {this.services[i] && this.services[i].el && (
                        <div className='stepperCont vendor'>
                            <Charges
                                placeholder='Charges'
                                isDisabledEl={this.services[i].el}
                                setref={(ref) => { this.services[i]["inputValue"] = ref; }}
                                defaultValue={
                                    this.serviceDefault('services', item)
                                }
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
                                    <input type='checkbox' ref={el => {
                                        this.setChecked(item, "snacks", el);
                                        this.snacksVeg.push({ id: item.id, el: el });
                                    }} />
                                    <div className='control__indicator' />
                                </label>
                                {this.snacksVeg[i] && this.snacksVeg[i].el && (
                                    <div className='stepperCont vendor'>
                                        <Charges
                                            placeholder='Charges'
                                            isDisabledEl={this.snacksVeg[i].el}
                                            setref={(ref) => { this.snacksVeg[i]["inputValue"] = ref; }}
                                            defaultValue={
                                                this.serviceDefault('snacks', item)
                                            }
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
                                    <input type='checkbox' ref={el => {
                                        this.setChecked(item, "meals", el);
                                        this.meals.push({ id: item.id, el: el });
                                    }} />
                                    <div className='control__indicator' />
                                </label>
                                {this.meals[i] && this.meals[i].el && (
                                    <div className='stepperCont vendor'>
                                        <Charges
                                            placeholder='Charges'
                                            isDisabledEl={this.meals[i].el}
                                            setref={(ref) => { this.meals[i]["inputValue"] = ref; }}
                                            defaultValue={
                                                this.serviceDefault('meals', item)
                                            }
                                        />
                                    </div>)}
                            </div>
                        </div>
                    </Col>

                );

            });




            return (
                <Container fluid={true} className='details' >
                    <div>
                        <p className='header-title'>Edit Vendor Details</p>
                        <p className='header-subtitle'>General Details</p>
                        <div className='details-content'>

                            <Row>
                                <Col md={{ size: 4 }} >
                                    <input className='input-text' placeholder='Company Name'
                                        ref={el => this.userinfo.coname = el} />
                                </Col>

                                <Col md={{ size: 4 }} >
                                    <input className='input-text' placeholder='Manager First Name'
                                        ref={el => this.userinfo.mgrfirstname = el}
                                    />
                                </Col>
                                <Col md={{ size: 4 }} >
                                    <input className='input-text' placeholder='Manager Last Name'
                                        ref={el => this.userinfo.mgrlastname = el}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={{ size: 4 }} >
                                    <input disabled='disabled' className='input-text' placeholder='Email'
                                        ref={el => this.userinfo.email = el} />
                                </Col>
                                <Col md={{ size: 4 }} >
                                    <input className='input-text' placeholder='Phone Number(Main/Primary)'

                                        ref={el => this.userinfo.primaryphone = el}
                                    />
                                </Col>
                                <Col md={{ size: 4 }} >
                                    <input className='input-text' placeholder='Phone Number(Alernate)'
                                        ref={el => this.userinfo.secondaryphone = el}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={{ size: 12 }} >
                                    <input className='input-text' placeholder='Office Address'
                                        ref={el => this.userinfo.coaddress = el}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={{ size: 6 }} >
                                    <div className='select'>
                                        {this.state.selectedCityDefault != null && this.props.cities.length > 0 &&
                                            (<Select
                                                defaultValue={this.props.cities[this.state.selectedCityDefault]}
                                                onChange={this.handleChangeCity}
                                                options={this.props.cities}
                                                placeholder='City'
                                                styles={colourStyles}

                                            />)}
                                    </div>
                                </Col>
                                <Col md={{ size: 6 }} >
                                    <input
                                        className='input-text'
                                        placeholder='State'
                                        style={{ position: 'relative', top: 5 + 'px' }}
                                        ref={el => this.userinfo.officestate = el}
                                    />
                                </Col>
                            </Row>
                            <input className='input-text' placeholder='Message if any'
                                ref={el => this.userinfo.message = el}
                            />
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
                            <Button onClick={this.cancelRequest} style={{ margin: '0 0 0 20px' }}>Cancel</Button>
                        </div>
                    </div>
                </Container>

            );
        }
        else {
            return (<div className='loader-dots' />);
        }


    }
}

VendorEdit.propTypes = {
    actions: PropTypes.object,
    loaded: PropTypes.bool,
    snacks: PropTypes.array,
    cities: PropTypes.array,
    services: PropTypes.array,
    meals: PropTypes.array,
    themes: PropTypes.array,
    userinfo: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        loaded: state.event.catalogue.data.loaded,
        snacks: state.event.catalogue.data.snacks,
        cities: state.event.catalogue.data.cities,
        services: state.event.catalogue.data.services,
        meals: state.event.catalogue.data.meals,
        themes: state.event.catalogue.data.themes,
        userinfo: state.event.userinfo,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(
            {
                fetchEventDetails: actions.fetchEventDetails,
                resetEmployee: actions.resetEmployee
            },
            dispatch
        )
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VendorEdit));