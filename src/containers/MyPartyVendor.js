import * as types from "actions/types";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as actions from "actions/events";
import { Container, Row, Col } from 'reactstrap';
import Alerts from "components/Alerts";
import moment from 'moment';
import StarRatingComponent from 'react-star-rating-component';

class MyPartyVendor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentParty: {},
            showPartyEdit: false,
            partyid: null,
            currentStatus: null,
            rating: 1,
            showPenalityBox: false,
            alertOpen: false,
            alertColor: '',
            alertMessage: ''
        };

        this.userinfo = {
            feedback: ""
        };
    }

    componentWillMount = () => {
        if (!this.props.userinfo.hasOwnProperty('sessiontoken')) {
            window.location.pathname = '/SignIn';
        }

    }

    alertClose = () => {
        this.setState({ alertOpen: false });
    }
    onStarClick(nextValue) {
        this.setState({ rating: nextValue });
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
                this.setState({ currentParty: response, showPartyEdit: true });
            }
        }).catch(error => {
            this.setState({
                alertOpen: true,
                alertColor: 'warning',
                alertMessage: 'Network Issue'
            });
        });

    }


    componentDidUpdate(prevProps) {
        if (this.props.loaded !== prevProps.loaded) {
            if (this.props.unabletofetchPrePartyDetails !== prevProps.unabletofetchPrePartyDetails) {
                this.setState({
                    alertOpen: true,
                    alertColor: 'warning',
                    alertMessage: 'Some Network issue in fetching list of item try connect later...'
                });
            }

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
        this.props.actions.fetchPartyDetails(this.props.userinfo.email, this.props.userinfo.sessiontoken);
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
    getCity(id) {
        let city_idobj;
        for (let k = 0; k < this.props.cities.length; k++) {
            if (this.props.cities[k].city_id == id) {
                city_idobj = k;
            }
        }
        return city_idobj.city;
    }

    render() {
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
        let partydetails = this.props.partydetails.parties || [];
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
                    <Col xs={{ size: 3 }}  >
                        {item.partytype}
                    </Col>
                    <Col xs={{ size: 3 }}  >
                        {date} {time.join('')}
                    </Col>
                    <Col xs={{ size: 3 }}  >
                        {item.status}
                    </Col>
                    <Col xs={{ size: 3 }}  >
                        <button className='btn btn-secondary'
                            onClick={this.openDetails.bind(this, item)}> View Details
                        </button>
                    </Col>
                </Row>
            );
        });
        let mealsViewCard, snacksViewCard, servicesViewCard;
        if (this.state.currentParty.hasOwnProperty('meals')) {
            mealsViewCard = this.state.currentParty.meals.map((item, i) => (
                <Col md={{ size: 4 }} key={i} >
                    <div className='item-list'>
                        <img src={'assets/images/' + item.image} />
                        <div className='ctrl'>
                            <label className='control control--checkbox'>
                                {item.name}
                                <br />
                                People Count : {item.count}

                            </label>

                        </div>
                    </div>
                </Col>));
        }

        if (this.state.currentParty.hasOwnProperty('snacks')) {
            snacksViewCard = this.state.currentParty.snacks.map((item, i) => (
                <Col md={{ size: 4 }} key={i} >
                    <div className='item-list'>
                        <img src={'assets/images/' + item.image} />
                        <div className='ctrl'>
                            <label className='control control--checkbox'>
                                {item.name}
                                <br />
                                People Count : {item.count}

                            </label>

                        </div>
                    </div>
                </Col>));
        }

        if (this.state.currentParty.hasOwnProperty('services')) {
            servicesViewCard = this.state.currentParty.services.map((item, i) => (
                <Col md={{ size: 4 }} key={i} >
                    <div className='item-list'>
                        <img src={'assets/images/' + item.image} />
                        <div className='ctrl'>
                            <label className='control control--checkbox'>
                                {item.name}
                            </label>
                        </div>
                    </div>
                </Col>
            ));
        }

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

        if (this.state.showPartyEdit) {
            let date = new Date(this.state.currentParty.date);
            let dd = date.getDate();
            let mm = date.getMonth() + 1;
            let yyyy = date.getFullYear();
            if (dd < 10) { dd = '0' + dd; }
            if (mm < 10) { mm = '0' + mm; }
            date = dd + '/' + mm + '/' + yyyy;
            let time = tConvert(this.state.currentParty.time);
            return (<Container fluid={true} className='details' >
                <Alerts
                    isOpen={this.state.alertOpen}
                    color={this.state.alertColor}
                    Message={this.state.alertMessage}
                    onDismiss={this.alertClose} />

                <p className='header-title'>Party Details</p>
                <div className='action-container' >
                    <button className='btn btn-action'
                        style={{ float: 'left' }} onClick={this.closeView}>Back
                    </button>
                    <span style={{ float: 'right' }}> Status : {this.state.currentParty.status}</span>

                </div>


                <div className='action-container' >

                    {this.state.currentParty.status == "Processing"
                        || this.state.currentParty.status == "Pending"
                        ?
                        <div> <button className='btn btn-action'
                            onClick={this.changeStatus.bind(this, 'Accepted')}>Accept
                              </button>
                            <button className='btn btn-action'
                                onClick={this.changeStatus.bind(this, 'Rejected')}>Rejected
                            </button>
                        </div> : null}

                    {this.state.currentParty.status == "Accepted"
                        ?
                        <div> <button className='btn btn-action'
                            onClick={this.changeStatus.bind(this, 'Cancelled')}>Cancel
                              </button>
                            <button className='btn btn-action'
                                onClick={this.changeStatus.bind(this, 'Started')}>Start
                            </button>
                        </div> : null}

                    {this.state.currentParty.status == "Started"
                        ?
                        <div> <button className='btn btn-action'
                            onClick={this.changeStatus.bind(this, 'finished')}>finish
                              </button>
                        </div> : null}

                    {this.state.currentParty.status == "Cancelled"
                        || this.state.currentParty.status == "finished"
                        ? <Col className='feedback-section' xs={{ size: 12 }} md={{ size: 6 }}>
                            <span style={{ float: 'left' }}>Rating : {this.state.rating}</span>
                            <StarRatingComponent
                                name='rating'
                                starCount={5}
                                value={this.state.rating}
                                onStarClick={this.onStarClick.bind(this)}
                            />

                            <input ref={el =>
                                this.userinfo.feedback = el} className='input-text' placeholder='feedback' />
                            <button onClick={this.sendRatingFeedback} className='btn btn-action'>Send feedback</button>
                          </Col> : null}
                </div>
                <p className='header-subtitle'>General Details</p>

                <Row className='info-host'>
                    <Col xs={{ size: 6 }}  >
                        Title : {this.state.currentParty.title}
                    </Col>
                    <Col xs={{ size: 6 }}  >
                        Host First Name : {this.state.currentParty.host_first_name}
                    </Col>
                </Row>

                <Row className='info-host'>
                    <Col xs={{ size: 6 }}  >
                        Host Last Name : {this.state.currentParty.host_last_name}
                    </Col>
                    <Col xs={{ size: 6 }}  >
                        Email : {this.state.currentParty.email}
                    </Col>
                </Row>

                <Row className='info-host'>
                    <Col xs={{ size: 6 }}  >
                        Mobile {this.state.currentParty.mobile}
                    </Col>
                    <Col xs={{ size: 6 }}  >
                        Date : {date}
                    </Col>
                </Row>

                <Row className='info-host'>
                    <Col xs={{ size: 6 }}  >
                        Time : {time}
                    </Col>
                    <Col xs={{ size: 6 }}  >
                        Venue : {this.state.currentParty.venue}
                    </Col>
                </Row>

                <Row className='info-host'>
                    <Col xs={{ size: 6 }}  >
                        Guest Count : {this.state.currentParty.guest_count}
                    </Col>
                    <Col xs={{ size: 6 }}  >
                        City : {this.props.cities.filter(obj => obj.city_id == this.state.currentParty.city)[0].city}
                    </Col>
                </Row>


                <Row className='info-host'>
                    <Col xs={{ size: 6 }}  >
                        Party Type : {this.state.currentParty.party_type}
                    </Col>
                    <Col xs={{ size: 6 }} />
                </Row>
                <br />
                <p className='header-subtitle'>Services Details</p>
                <div className='snackveg-details'>
                    <Row >
                        {servicesViewCard}
                    </Row>
                </div>

                <p className='header-subtitle'>Snacks Details</p>
                <div className='snackveg-details'>
                    <Row >
                        {snacksViewCard}
                    </Row>
                </div>

                <p className='header-subtitle'>Meals Details</p>
                <div className='snackveg-details'>
                    <Row >
                        {mealsViewCard}
                    </Row>
                </div>

                    </Container>);
        }
        else {
            return (<Container fluid={true} className='details' >
                <Alerts
                    isOpen={this.state.alertOpen}
                    color={this.state.alertColor}
                    Message={this.state.alertMessage}
                    onDismiss={this.alertClose} />
                <p className='header-title'>Party Details</p>
                <p className='header-subtitle'>General Details</p>
                <div className='action-container'>
                    <button className='btn btn-action' onClick={this.logout}>Logout</button>
                    <a href='/vendorEdit' className='btn btn-action'>Edit Profile</a>
                </div>
                <Row className='titles'>
                    <Col xs={{ size: 3 }}  >
                        Party Type
                    </Col>
                    <Col xs={{ size: 3 }}  >
                        Party Date And Time
                    </Col>
                    <Col xs={{ size: 3 }}  >
                        Party Status
                    </Col>
                    <Col xs={{ size: 3 }} />
                </Row>
                {partycards}
                    </Container>);
        }

    }
}

MyPartyVendor.propTypes = {
    actions: PropTypes.object,
    userinfo: PropTypes.object,
    partydetails: PropTypes.object,
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
        partydetails: state.event.partydetails,
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
                fetchEventDetails: actions.fetchEventDetails,
                fetchPartyDetails: actions.fetchPartyDetails
            },
            dispatch
        )
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyPartyVendor));
