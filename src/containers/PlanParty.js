
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as actions from "actions/events";
import { Container, Row, Col, Button } from 'reactstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Stepper from 'components/Stepper';
import Alerts from "components/Alerts";
class PlanParty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCity: null,
            startDate: null,
            startTime: null,
            selectedTheme: null,
            services: this.props.services,
            snacksVeg: this.props.snacks,
            meals: this.props.meals,
            alertOpen: false,
            alertColor: '',
            alertMessage: ''
        };

        this.userinfo = {
            firstname: null,
            lastname: null,
            mobile: null,
            email: null,
            partyVenue: null,
            guestcount: null,
            partytitle: null

        };
        this.services = [];
        this.snacksVeg = [];
        this.meals = [];

    }

    componentWillMount = () => {

        if (!this.props.userinfo.hasOwnProperty('sessiontoken')) {
            window.location.pathname = '/SignIn';
        }

    }

    componentDidMount = () => {
        this.props.actions.fetchEventDetails();
        let promise = actions.getHostDetails(this.props.userinfo.email, this.props.userinfo.sessiontoken);

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
                this.userinfo.firstname.value = response.first_name;
                this.userinfo.lastname.value = response.last_name;
                this.userinfo.mobile.value = response.mobile;
                this.userinfo.email.value = response.email;
                this.forceUpdate();
            }
        }).catch(error => {
            this.setState({
                alertOpen: true,
                alertColor: 'warning',
                alertMessage: 'Network Issue'
            });
        });
    }

    alertClose = () => {
        this.setState({ alertOpen: false });
    }

    componentDidUpdate(prevProps) {


        if (this.props.loaded !== prevProps.loaded) {
            if (this.props.unabletofetchPrePartyDetails == true) {
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
            }, () => {
                let promise = actions.getHostDetails(this.props.userinfo.email, this.props.userinfo.sessiontoken);

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
                        this.userinfo.firstname.value = response.first_name;
                        this.userinfo.lastname.value = response.last_name;
                        this.userinfo.mobile.value = response.mobile;
                        this.userinfo.email.value = response.email;
                        this.forceUpdate();
                    }
                }).catch(error => {
                    this.setState({
                        alertOpen: true,
                        alertColor: 'warning',
                        alertMessage: 'Network Issue'
                    });
                });


            });
        }



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
        console.log(date);
    }

    handleChangeTime = (time) => {
        this.setState({
            startTime: time
        });
    }


    cancelRequest = () => {
        window.location.href = "/MyPartyHost";
    }


    restrictNum = (event) => {

        if (/\D/.test(event.target.value)) {
            event.target.value = event.target.value.replace(/\D/g, "");
        }
    }
    submitRequest = () => {

        if (this.userinfo.firstname.value == "" ||
            this.state.selectedCity == null ||
            this.userinfo.lastname.value == "" ||
            this.userinfo.mobile.value == "" ||
            this.userinfo.email.value == "" ||
            this.userinfo.partytitle.value == "" ||
            this.userinfo.guestcount.value == "" ||
            this.userinfo.partyVenue.value == "" ||

            this.state.selectedTheme.theme_id <= 0 ||
            this.state.startDate == null ||
            this.state.startTime == null
        ) {
            this.setState({
                alertOpen: true,
                alertColor: 'warning',
                alertMessage: 'please fill general details'
            });
            return;
        }



        var removeDups = (list) => {
            var uniq = new Set(list.map(e => JSON.stringify(e)));
            return Array.from(uniq).map(e => JSON.parse(e));
        };


        let selectedServices = removeDups(this.services.filter(obj => obj.el &&
            obj.el.checked).map(obj => ({
                service: Number(obj.id),
                "is_must": Number(1)
            })));

        let selectedsnacksVeg = this.snacksVeg.filter(obj => obj.el &&
            obj.el.checked &&
            obj.hasOwnProperty('inputValue')).map(obj => ({
                id: Number(obj.id),
                count: Number(obj.inputValue.value)
            }));

        let selectedmeals = this.meals.filter(obj => obj.el &&
            obj.el.checked &&
            obj.hasOwnProperty('inputValue')).map(obj => ({
                id: Number(obj.id),
                count: Number(obj.inputValue.value)
            }));



        let hours = this.state.startTime.hours() < 10
            ? '0' + this.state.startTime.hours()
            : this.state.startTime.hours();
        let minutes = this.state.startTime.minutes() < 10
            ? '0' + this.state.startTime.minutes()
            : this.state.startTime.minutes();
        let time = hours + ':' + minutes;
        let date = this.state.startDate.toDate();
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yyyy = date.getFullYear();
        if (dd < 10) { dd = '0' + dd; }
        if (mm < 10) { mm = '0' + mm; }
        date = yyyy + '-' + mm + '-' + dd;

        let partyinfo = {
            "host_first_name": this.userinfo.firstname.value,
            "host_last_name": this.userinfo.lastname.value,
            "mobile": this.userinfo.mobile.value,
            "email": this.userinfo.email.value,
            "title": this.userinfo.partytitle.value,
            "party_type": Number(this.state.selectedTheme.theme_id),
            "guest_count": this.userinfo.guestcount.value,
            "time": time,
            "date": date,
            "max_budget": 0,
            "min_budget": 0,
            "usertype": 0,
            "venue": this.userinfo.partyVenue.value,
            "city": Number(this.state.selectedCity.city_id),
            "services": selectedServices,
            "snacks": selectedsnacksVeg,
            "meals": selectedmeals
        };


        let promise = actions.planPartyHost(partyinfo, this.props.userinfo.sessiontoken);

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
                    alertMessage: 'you have been successfully created party' +
                        'and will be redirected to party page'
                }, () => {
                    setTimeout(() => {
                        window.location.href = "/MyPartyHost";
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

        const { selectedCity, selectedTheme } = this.state;

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
                                <div className='stepperCont'>
                                    <Stepper
                                        isDisabledEl={this.snacksVeg[i].el}
                                        setref={(ref) => { this.snacksVeg[i]["inputValue"] = ref; }}
                                    />     <p className='cust-text'>Customisable</p>
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
                                <div className='stepperCont'>
                                    <Stepper
                                        isDisabledEl={this.meals[i].el}
                                        setref={(ref) => { this.meals[i]["inputValue"] = ref; }}
                                    />     <p className='cust-text'>Customisable</p>
                                </div>)}
                        </div>
                    </div>
                </Col>

            );

        });


        return (
            this.props.loaded ?
                <Container fluid={true} className='details' >
                    <Alerts
                        isOpen={this.state.alertOpen}
                        color={this.state.alertColor}
                        Message={this.state.alertMessage}
                        onDismiss={this.alertClose} />

                    <p className='header-title'>Party Details</p>
             

                    <p className='header-subtitle'>General Details</p>
                    <div className='details-content'>
                        <Row>
                            <Col md={{ size: 4 }} >
                                <input ref={el =>
                                    this.userinfo.firstname = el} className='input-text' placeholder='First Name' />
                                <input ref={el =>
                                    this.userinfo.mobile = el}
                                    onChange={this.restrictNum} className='input-text' placeholder='Phone Number' />
                            </Col>
                            <Col md={{ size: 4 }} >
                                <input ref={el =>
                                    this.userinfo.lastname = el} className='input-text' placeholder='Last Name' />
                                <div className='datepicker'>
                                    <DatePicker
                                        placeholderText='--/--/----'
                                        selected={this.state.startDate}
                                        onChange={this.handleChangedate}
                                        dateFormat='DD/MM/YYYY'
                                    />
                                </div>
                            </Col>
                            <Col md={{ size: 4 }} >
                                <input ref={el =>
                                    this.userinfo.email = el} className='input-text' placeholder='Email' />
                                <div className='datepicker'>
                                    <DatePicker
                                        placeholderText='--/--'
                                        selected={this.state.startTime}
                                        onChange={this.handleChangeTime}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        dateFormat='LT'
                                        timeCaption='Time'
                                    />
                                </div>
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
                                <input ref={el =>
                                    this.userinfo.partyVenue = el} className='input-text' placeholder='Party Venue' />
                            </Col>
                            <Col md={{ size: 4 }} >
                                <input ref={el =>
                                    this.userinfo.guestcount = el}
                                    onChange={this.restrictNum} className='input-text' placeholder='Guest Count' />
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
                        <input ref={el =>
                            this.userinfo.partytitle = el} className='input-text' placeholder='Party Title' />
                    </div>
                    <p className='header-subtitle'>Services Required</p>
                    <div className='snackveg-details'>
                        <Row >
                            {serviceCard}
                        </Row>
                    </div>
                    <p className='header-subtitle'>Snacks Vegetarian</p>
                    <div className='snackveg-details'>
                        <Row >
                            {snacksVegCard}
                        </Row>
                    </div>

                    <p className='header-subtitle'>meals</p>
                    <div className='snackveg-details'>
                        <Row >
                            {mealsCard}
                        </Row>
                    </div>

                    <div className='next-blk'>
                        <Button onClick={this.submitRequest} >Save</Button>
                        <Button onClick={this.cancelRequest} style={{ margin: '0 0 0 20px' }}>Cancel</Button>
                    </div>
                </Container>
                : <div className='loader-dots' />
        );
    }
}

PlanParty.propTypes = {
    actions: PropTypes.object,
    userinfo: PropTypes.object,
    loaded: PropTypes.bool,
    snacks: PropTypes.array,
    cities: PropTypes.array,
    services: PropTypes.array,
    meals: PropTypes.array,
    themes: PropTypes.array,
    unabletofetchPrePartyDetails: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        userinfo: state.event.userinfo,
        loaded: state.event.catalogue.data.loaded,
        snacks: state.event.catalogue.data.snacks,
        cities: state.event.catalogue.data.cities,
        services: state.event.catalogue.data.services,
        meals: state.event.catalogue.data.meals,
        themes: state.event.catalogue.data.themes,
        unabletofetchPrePartyDetails: state.event.catalogue.data.unabletofetchPrePartyDetails
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlanParty));