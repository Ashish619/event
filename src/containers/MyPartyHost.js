
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
import moment from 'moment';
import StarRatingComponent from 'react-star-rating-component';
import * as types from "actions/types";
import Alerts from "components/Alerts";

class MyPartyHost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentParty: {},
            showPartyEdit: false,
            partyid: null,
            currentStatus: null,
            selectedCity: null,
            selectedCityDefault: null,
            selectedThemeDefault: null,
            startDate: null,
            startTime: null,
            selectedTheme: null,
            services: this.props.services,
            snacksVeg: this.props.snacks,
            meals: this.props.meals,
            rating: 1,
            showPenalityBox: false,
            alertOpen: false,
            alertColor: '',
            alertMessage: ''

        };

        this.userinfo = {
            firstname: "",
            lastname: "",
            mobile: "",
            email: "",
            partyVenue: "",
            guestcount: "",
            partytitle: "",
            feedback: ""

        };
        this.services = [];
        this.snacksVeg = [];
        this.meals = [];
    }
    onStarClick(nextValue) {
        this.setState({ rating: nextValue });
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
            }, () => { this.forceUpdate(); });
        }
    }


    componentWillMount = () => {

        if (!this.props.userinfo.hasOwnProperty('sessiontoken')) {
            window.location.pathname = '/SignIn';
        }

    }

    componentDidMount = () => {
        this.props.actions.fetchEventDetails();
        let [dispatch, promise] = this.props.actions.fetchPartyDetails(this.props.userinfo.email,
            this.props.userinfo.sessiontoken);

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

                dispatch({
                    type: types.GET_PARTY_DETAILS,
                    value: response
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



    getPartyId = () => {


        let promise = actions.getPartyByID(this.state.partyid, this.props.userinfo.sessiontoken);

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
                this.setState({ currentParty: response, showPartyEdit: true }, () => {
                    this.updateParty();
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

    updateParty = () => {
        let party = { ...this.state.currentParty };

        let currentTimeObj = new Date();
        let time = party.time.split(":");
        currentTimeObj.setHours(time[0], time[1]);

        this.userinfo.firstname.value = party.host_first_name;
        this.userinfo.lastname.value = party.host_last_name;
        this.userinfo.mobile.value = party.mobile;
        this.userinfo.email.value = party.email;
        this.userinfo.partyVenue.value = party.venue;
        this.userinfo.guestcount.value = party.guest_count;
        this.userinfo.partytitle.value = party.title;


        let city_idobj;
        for (let k = 0; k < this.props.cities.length; k++) {
            if (this.props.cities[k].city_id == party.city) {
                city_idobj = k;
            }
        }

        let theme_idobj;
        for (let k = 0; k < this.props.themes.length; k++) {
            if (this.props.themes[k].theme == party.party_type) {
                theme_idobj = k;
            }
        }



        this.setState({
            startDate: moment(new Date(party.date)),
            startTime: moment(currentTimeObj),
            selectedCityDefault: city_idobj,
            selectedCity: this.props.cities[city_idobj],
            selectedTheme: this.props.themes[theme_idobj],
            selectedThemeDefault: theme_idobj,
        }, () => { () => { this.forceUpdate(); }; });
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


    serviceDefault = (param, item) => {

        let defaultValue = 0;
        if (this.state.currentParty.hasOwnProperty(param)) {
            this.state.currentParty[param].forEach(element => {

                if (element.id == item.id) {
                    defaultValue = element.count;
                }
            });
        }

        return defaultValue;
    }

    setChecked = (item, param, el) => {
        if (el) {
            let defaultValue = false;
            if (this.state.currentParty.hasOwnProperty(param)) {
                this.state.currentParty[param].forEach(element => {

                    if (param == "services") {
                        if (element.service == item.id) {
                            defaultValue = true;
                        }
                    } else {
                        if (element.id == item.id) {
                            defaultValue = true;
                        }
                    }
                });
            }

            el.checked = defaultValue;
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


     let promise =  actions.updatePartyHost(this.state.partyid, partyinfo, this.props.userinfo.sessiontoken);

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

    restrictNum = (event) => {

        if (/\D/.test(event.target.value)) {
            event.target.value = event.target.value.replace(/\D/g, "");
        }
    }
    logout = () => {
        let promise = actions.logout(this.props.userinfo.sessiontoken);

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
                window.sessionStorage.clear();
                this.setState({
                    alertOpen: true,
                    alertColor: 'success',
                    alertMessage: 'you have been successfully logout and will be redirected to signin page'
                }, () => {
                    setTimeout(() => {
                        window.location.href = "/signIn";
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

    openDetails = (obj) => {
        this.setState({ partyid: obj.id, currentStatus: obj.status },
            () => { this.getPartyId(); });

    }
    changeStatus = (state) => {

        if (state == "Cancelled") {
            this.setState({ showPenalityBox: true });
        } else {

            let promise = actions.updatePartyStatus(this.props.userinfo.sessiontoken, this.state.partyid, state);

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
                        alertMessage: response
                    },
                        this.getPartyId());
                }
            }).catch(error => {
                this.setState({
                    alertOpen: true,
                    alertColor: 'warning',
                    alertMessage: 'Network Issue'
                });
            });

        }
    }

    confirmCancel = () => {
        let promise = actions.updatePartyStatus(this.props.userinfo.sessiontoken, this.state.partyid, "Cancelled");

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
                    showPenalityBox: false,
                    alertOpen: true,
                    alertColor: 'success',
                    alertMessage: response
                }, () => { this.getPartyId(); });

            }
        }).catch(error => {
            this.setState({
                alertOpen: true,
                alertColor: 'warning',
                alertMessage: 'Network Issue'
            });
        });
    }

    rejectCancel = () => {
        this.setState({ showPenalityBox: false });
    }
    closeView = () => {
        let [dispatch, promise] = this.props.actions.fetchPartyDetails(this.props.userinfo.email,
            this.props.userinfo.sessiontoken);

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

                dispatch({
                    type: types.GET_PARTY_DETAILS,
                    value: response
                });

            }
        }).catch(error => {
            this.setState({
                alertOpen: true,
                alertColor: 'warning',
                alertMessage: 'Network Issue'
            });
        });


        this.setState({
            showPartyEdit: false,
            rating: 1
        }, () => {
            this.userinfo.feedback = "";
        });
    }

    sendRatingFeedback = () => {

        let promise = actions.sendRateFeed(this.state.partyid,
            {
                "fid": 0,
                "email": this.props.userinfo.email,
                "stars": this.state.rating,
                "feedback": this.userinfo.feedback.value,
                "partyid": this.state.partyid
            }
            , this.props.userinfo.sessiontoken);


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
                    alertMessage: response.msg
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


        const { selectedTheme } = this.state;

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
                            <input type='checkbox'
                                ref={el => {
                                    this.setChecked(item, "services", el);
                                    this.services.push({ id: item.id, el: el });
                                }} />
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
                                <input type='checkbox' ref={el => {
                                    this.setChecked(item, "snacks", el);
                                    this.snacksVeg.push({ id: item.id, el: el });
                                }} />
                                <div className='control__indicator' />
                            </label>
                            {this.snacksVeg[i] && this.snacksVeg[i].el && (
                                <div className='stepperCont'>
                                    <Stepper
                                        isDisabledEl={this.snacksVeg[i].el}
                                        setref={(ref) => { this.snacksVeg[i]["inputValue"] = ref; }}
                                        defaultValue={
                                            this.serviceDefault('snacks', item)
                                        }
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
                                <input type='checkbox' ref={el => {
                                    this.setChecked(item, "meals", el);
                                    this.meals.push({ id: item.id, el: el });
                                }} />
                                <div className='control__indicator' />
                            </label>
                            {this.meals[i] && this.meals[i].el && (
                                <div className='stepperCont'>
                                    <Stepper
                                        isDisabledEl={this.meals[i].el}
                                        setref={(ref) => { this.meals[i]["inputValue"] = ref; }}
                                        defaultValue={
                                            this.serviceDefault('meals', item)
                                        }
                                    />     <p className='cust-text'>Customisable</p>
                                </div>)}
                        </div>
                    </div>
                </Col>

            );

        });



        let partydetails = this.props.partydetails.parties || [];

        function tConvert(time) {
            // Check correct time format and split into components
            time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

            if (time.length > 1) { // If time format correct
                time = time.slice(1);  // Remove full string match value
                time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
                time[0] = +time[0] % 12 || 12; // Adjust hours

                return time;
            }
        }


        let partycards = partydetails.map((item, i) => {


            let date = new Date(item.date);
            let dd = date.getDate();
            let mm = date.getMonth() + 1;
            let yyyy = date.getFullYear();
            if (dd < 10) { dd = '0' + dd; }
            if (mm < 10) { mm = '0' + mm; }
            date = dd + '/' + mm + '/' + yyyy;



            let time = tConvert(item.time);

            return (
                <Row key={i} className='titles-item'>
                    <Col md={{ size: 2 }}  >
                        {item.title}
                    </Col>
                    <Col md={{ size: 2 }}  >
                        {item.partytype}
                    </Col>
                    <Col md={{ size: 3 }}  >
                        {date} {time.join('')}
                    </Col>
                    <Col md={{ size: 2 }}  >
                        {item.status}
                    </Col>
                    <Col md={{ size: 3 }}  >
                        <button className='btn btn-secondary' onClick={this.openDetails.bind(this, item)}>
                            View Details
                        </button>
                    </Col>
                </Row>
            );
        });
        if (this.state.showPenalityBox) {

            return (<Container fluid={true} className='details' >
                <Alerts
                    isOpen={this.state.alertOpen}
                    color={this.state.alertColor}
                    Message={this.state.alertMessage}
                    onDismiss={this.alertClose} />
                <p className='header-title'>Penality Details</p>
                <button onClick={this.confirmCancel}>Confirm</button>
                <button onClick={this.rejectCancel}>Cancel</button>
                    </Container>);
        }

        return (<Container fluid={true} className='details' >
            <Alerts
                isOpen={this.state.alertOpen}
                color={this.state.alertColor}
                Message={this.state.alertMessage}
                onDismiss={this.alertClose} />
            <div className={this.state.showPartyEdit ? "hide" : "show"}>
                <p className='header-title'>Party Details</p>
                <p className='header-subtitle'>General Details</p>

                <div className='action-container'>
                    <button className='btn btn-action' onClick={this.logout}>Logout</button>
                    <a href='/HostEdit' className='btn btn-action'>Edit Profile</a>
                    <a href='/PlanParty' className='btn btn-action'>Plan Party</a>
                </div>

                <Row className='titles'>
                    <Col md={{ size: 2 }}  >
                        Party Title
                    </Col>
                    <Col md={{ size: 2 }}  >
                        Party Type
                    </Col>
                    <Col md={{ size: 3 }}  >
                        Party Date And Time
                    </Col>
                    <Col md={{ size: 2 }}  >
                        Party Status
                    </Col>
                    <Col md={{ size: 3 }} />
                </Row>

                {partycards}
            </div>
            <div className={this.state.showPartyEdit ? "show" : "hide"}>
                <p className='header-title'>Party Details</p>
                <div className='action-container'>
                    <button className='btn btn-action'
                        style={{ float: 'left' }} onClick={this.closeView}>Back
                    </button>
                    <span style={{ float: 'right' }}> Status : {this.state.currentParty.status}</span>
                </div>

                <div className='action-container' >
                    {this.state.currentParty.status == "Processing"
                        || this.state.currentParty.status == "Pending"
                        || this.state.currentParty.status == "Accepted" ?
                        <div> <button className='btn btn-action'
                            onClick={this.changeStatus.bind(this, 'Cancelled')}>Cancel
                              </button>
                        </div> : null}
                    {this.state.currentParty.status == "Cancelled"
                        || this.state.currentParty.status == "finished"
                        ? <div> <button className='btn btn-action'
                            onClick={this.changeStatus.bind(this, 'Closed')}>Close
                                </button>
                            <Col className='feedback-section' xs={{ size: 12 }} md={{ size: 6 }}>
                                <span style={{ float: 'left' }}>Rating : {this.state.rating}</span>
                                <StarRatingComponent
                                    name='rating'
                                    starCount={5}
                                    value={this.state.rating}
                                    onStarClick={this.onStarClick.bind(this)}
                                />

                                <input ref={el =>
                                    this.userinfo.feedback = el} className='input-text' placeholder='feedback' />
                                <button className='btn btn-action'
                                    onClick={this.sendRatingFeedback}>Send feedback
                                </button>
                            </Col>
                          </div> : null}
                </div>

                <p className='header-title'>Party Details</p>
                <p className='header-subtitle'>Edit Details</p>
                <div className='details-content'>
                    <Row>
                        <Col md={{ size: 4 }} >
                            <input disabled='disabled' ref={el =>
                                this.userinfo.firstname = el} className='input-text' placeholder='First Name' />
                            <input disabled='disabled' ref={el =>
                                this.userinfo.mobile = el} 
                                onChange={this.restrictNum}
                                className='input-text' placeholder='Phone Number' />
                        </Col>
                        <Col md={{ size: 4 }} >
                            <input disabled='disabled' ref={el =>
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
                            <input disabled='disabled' ref={el =>
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
                                onChange={this.restrictNum}
                                 className='input-text' placeholder='Guest Count' />
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
            </div>
                </Container>);
    }
}

MyPartyHost.propTypes = {
    actions: PropTypes.object,
    userinfo: PropTypes.object,
    loaded: PropTypes.bool,
    snacks: PropTypes.array,
    cities: PropTypes.array,
    services: PropTypes.array,
    meals: PropTypes.array,
    themes: PropTypes.array,
    partydetails: PropTypes.object,
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
        partydetails: state.event.partydetails,
        unabletofetchPrePartyDetails: state.event.catalogue.data.unabletofetchPrePartyDetails
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(
            {
                fetchPartyDetails: actions.fetchPartyDetails,
                fetchEventDetails: actions.fetchEventDetails
            },
            dispatch
        )
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyPartyHost));
