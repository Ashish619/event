
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as actions from "actions/events";
import { Container, Row, Col, Button } from 'reactstrap';
import Select from 'react-select';
import Alerts from "components/Alerts";
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
            lastpartydate: "",
            alertOpen: false,
            alertColor: '',
            alertMessage: ''

        };
        this.services = [];
        this.snacksVeg = [];
        this.meals = [];
    }

    restrictNum = (event) => {

        if (/\D/.test(event.target.value)) {
            event.target.value = event.target.value.replace(/\D/g, "");
        }
    }

    handleChange = (event) => {
        let text = event.target.value;
        if (event.target.name == 'primaryphone' || event.target.name == 'secondaryphone') {

            if (/\D/.test(text)) {
                text = text.replace(/\D/g, "");
            }
        }
        this.setState({ [event.target.name]: text });
    }

    componentDidMount = () => {
        this.props.actions.fetchEventDetails();
    }

    componentDidUpdate(prevProps) {

        if (this.props.loaded !== prevProps.loaded) {
            if (this.props.unabletofetchPrePartyDetails  == true) {
                this.setState({
                    alertOpen: true,
                    alertColor: 'warning',
                    alertMessage: 'Some Network issue in fetching list of item try connect later...'
                });
            }
            this.setState({
                services: this.props.services,
                snacksVeg: this.props.snacks,
                meals: this.props.meals
            }, () => { this.forceUpdate(); });
        }


    }

    handleChangeCity = (selectedCity) => {
        this.setState({ selectedCity });
    }
    alertClose = () => {
        this.setState({ alertOpen: false });
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


        if (this.state.mgrfirstname == "" ||
            this.state.mgrlastname == "" ||
            this.state.coname == "" ||
            this.state.coaddress == "" ||
            this.state.officecity == "" ||
            this.state.officestate == "" ||

            this.state.primaryphone == "" ||

            this.state.email == "" ||
            this.state.message == ""
        ) {
            this.setState({
                alertOpen: true,
                alertColor: 'warning',
                alertMessage: 'please fill general details'
            });

        }



        let promise = actions.registerVendorDetails({
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


        promise.then(function (response) {
            return response.json();
        }).then(response => {

            if (response.hasOwnProperty('status') && response.status == false) {
                this.setState({
                    alertOpen: true,
                    alertColor: 'warning',
                    alertMessage: response.message
                });
            }
            else {
                this.setState({
                    alertOpen: true,
                    alertColor: 'success',
                    alertMessage: 'you have been successfully registered and will be redirected to signin page'
                }, () => {
                    setTimeout(() => {
                        window.location.href = "signIn";
                    }, 5000);
                });
            }
        }).catch(error => {
            this.setState({
                alertOpen: true,
                alertColor: 'warning',
                alertMessage: 'Network Issue'
            });
        });




    }

    render() {

        if (this.props.loaded) {
            const { selectedCity } = this.state;
            const colourStyles = {
                control: styles => ({ ...styles, backgroundColor: 'white', borderColor: '#b30274' }),
                placeholder: styles => ({ ...styles, color: ' #b2b2b2' }),

            };
            let serviceCard = this.state.services.map((item, i) => {
                return (<Col md={{ size: 4 }} key={i} >
                    <div className='item-list'>
                        <img src={'assets/images/' + item.image} />
                        <div className='ctrl'>
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
                        </div>
                    </div>
                        </Col>);
            });

            let snacksVegCard = this.state.snacksVeg.map((item, i) => {
                return (
                    <Col md={{ size: 4 }} key={i} >
                        <div className='item-list'>
                            <img src={'assets/images/' + item.image} />
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
                            <img src={'assets/images/' + item.image} />
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
                    <Alerts
                        isOpen={this.state.alertOpen}
                        color={this.state.alertColor}
                        Message={this.state.alertMessage}
                        onDismiss={this.alertClose} />
                    <p className='header-title'>Vendor Details</p>
                    <p className='header-subtitle'>General Details</p>
                    <div className='details-content'>

                        <Row>
                            <Col md={{ size: 4 }} >
                                <input className='input-text' placeholder='Company Name'
                                    name='coname'
                                    value={this.state.coname}
                                    onChange={this.handleChange} />
                            </Col>
                            <Col md={{ size: 4 }} >
                                <input className='input-text' placeholder='Manager First Name'
                                    name='mgrfirstname'
                                    value={this.state.mgrfirstname}
                                    onChange={this.handleChange} />
                            </Col>
                            <Col md={{ size: 4 }} >
                                <input className='input-text' placeholder='Manager Last Name'
                                    name='mgrlastname'
                                    value={this.state.mgrlastname}
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
                                <input className='input-text'
                                    placeholder='Phone Number(Main/Primary)'
                                    name='primaryphone'
                                    value={this.state.primaryphone}
                                    onChange={this.handleChange} />
                            </Col>
                            <Col md={{ size: 4 }} >
                                <input className='input-text'
                                    placeholder='Phone Number(Alernate)'
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
                    <div className='snackveg-details'>
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
    unabletofetchPrePartyDetails: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        unabletofetchPrePartyDetails: state.event.catalogue.data.unabletofetchPrePartyDetails,
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
