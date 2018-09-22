
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as actions from "actions/events";
import { Container, Row, Col } from 'reactstrap';


class MyPartyVendor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentParty: {},
            showPartyEdit: false,
            partyid: null,
            currentStatus: null
        };


    }

    componentWillMount = () => {
        if (!this.props.userinfo.hasOwnProperty('sessiontoken')) {
            window.location.pathname = '/SignIn';
        }
        
    }


    logout = () => {
        actions.logout(this.props.userinfo.sessiontoken);
    }

    openDetails = (obj) => {
        this.setState({ partyid: obj.id, currentStatus: obj.status },
            () => { this.getPartyId(); });

    }

    getPartyId = () => {
        actions.getPartyByID(this.state.partyid, this.props.userinfo.sessiontoken)
            .then(res => res.json()).then(res => { this.setState({ currentParty: res, showPartyEdit: true }); });
    }

    componentDidMount = () => {
        this.props.actions.fetchPartyDetails(this.props.userinfo.email, this.props.userinfo.sessiontoken);
    }

    changeStatus = (state) => {
        actions.updatePartyStatus(this.props.userinfo.sessiontoken, this.state.partyid, state)
            .then(res => res.json());
    }
    closeView = () => {
        this.setState({ showPartyEdit: false });
    }
    render() {

        let partydetails = this.props.partydetails.parties || [];
        let partycards = partydetails.map((item, i) => {
            return (
                <Row key={i}>
                    <Col md={{ size: 3 }}  >
                        {item.partytype}
                    </Col>
                    <Col md={{ size: 3 }}  >
                        {item.date}{item.time}
                    </Col>
                    <Col md={{ size: 3 }}  >
                        {item.status}
                    </Col>
                    <Col md={{ size: 3 }}  >
                        <button onClick={this.openDetails.bind(this, item)}> View Details</button>
                    </Col>
                </Row>
            );
        });
        let mealsViewCard, snacksViewCard, servicesViewCard;
        if (this.state.currentParty.hasOwnProperty('meals')) {
            mealsViewCard = this.state.currentParty.meals.map((item, i) => (
                <div key={i}>
                    {item.count} {item.id}
                </div>));
        }

        if (this.state.currentParty.hasOwnProperty('snacks')) {
            snacksViewCard = this.state.currentParty.snacks.map((item, i) => (
                <div key={i}>
                    {item.count} {item.id}
                </div>));
        }

        if (this.state.currentParty.hasOwnProperty('services')) {
            servicesViewCard = this.state.currentParty.services.map((item, i) => (
                <div key={i}>
                    {item.service} {item.is_must}
                </div>));
        }
        if (this.state.showPartyEdit) {
            return (<Container fluid={true} className='details' >
                <p className='header-title'>Party Details</p>
                <button onClick={this.closeView}>close</button>
                <p className='header-subtitle'>Action</p>
                Status{this.state.currentParty.status}
                {this.state.currentParty.status == 'Ordered' ?
                    <div>
                        <button onClick={this.changeStatus.bind(this, 'Accepted')}>Accept</button>
                        <button onClick={this.changeStatus.bind(this, 'Rejected')}>Reject</button>
                    </div> :
                    <div> <button onClick={this.changeStatus.bind(this, 'Cancelled')}>Cancel</button></div>}
                <p className='header-subtitle'>General Details</p>
                Title {this.state.currentParty.title}<br />
                host_first_name {this.state.currentParty.host_first_name}<br />
                host_last_name {this.state.currentParty.host_last_name}<br />
                email {this.state.currentParty.email}<br />
                mobile {this.state.currentParty.mobile}<br />
                date {this.state.currentParty.date}<br />
                time {this.state.currentParty.time}<br />
                venue {this.state.currentParty.venue}<br />
                guest_count {this.state.currentParty.guest_count}<br />
                city {this.state.currentParty.city}<br />
                party_type {this.state.currentParty.party_type}<br />
                <p className='header-subtitle'>Services Details</p>
                {servicesViewCard}
                <p className='header-subtitle'>Snacks Details</p>
                {snacksViewCard}
                <p className='header-subtitle'>Meals Details</p>
                {mealsViewCard}
                    </Container>);
        }
        else {
            return (<Container fluid={true} className='details' >
                <p className='header-title'>Party Details</p>
                <p className='header-subtitle'>General Details</p>
                <button onClick={this.logout}>Logout</button>
                <a href='/vendorEdit'>Edit Profile</a>
                {partycards}
                    </Container>);
        }

    }
}

MyPartyVendor.propTypes = {
    actions: PropTypes.object,
    userinfo: PropTypes.object,
    partydetails: PropTypes.object
};

function mapStateToProps(state) {
    return {
        userinfo: state.event.userinfo,
        partydetails: state.event.partydetails
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyPartyVendor));
