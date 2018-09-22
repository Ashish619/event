
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as actions from "actions/events";
import { Container, Row, Col, Button } from 'reactstrap';


class HostEdit extends Component {
    constructor(props) {
        super(props);

        this.userinfo = {
            firstname: null,
            phone: null,
            email: null,
            lastname: null,
        };

    }
    componentWillMount = () => {

        actions.getHostDetails(this.props.userinfo.email, this.props.userinfo.sessiontoken)
            .then(res => res.json())
            .then(
                res => {
                    this.userinfo.firstname.value = res.first_name;
                    this.userinfo.lastname.value = res.last_name;
                    this.userinfo.phone.value = res.mobile;
                    this.userinfo.email.value = res.email;

                }
            );

    }

    update = () => {
        actions.updateHostDetails({

            "first_name": this.userinfo.firstname.value,
            "last_name": this.userinfo.lastname.value,
            "mobile": this.userinfo.phone.value,

        }, this.props.userinfo.sessiontoken, this.userinfo.email.value);
    }

    cancelRequest = () => {
        window.location.href= "/MyPartyHost";
    }

    render() {

        return (

            <Container fluid={true} className='details' >
                <p className='header-title'>User Details</p>
                <p className='header-subtitle'>General Details</p>
                <div className='details-content'>
                    <Row>
                        <Col md={{ size: 6 }} >
                            <input ref={el =>
                                this.userinfo.firstname = el}
                                className='input-text'
                                placeholder='First Name'
                            />
                            <input ref={el =>
                                this.userinfo.phone = el} className='input-text' placeholder='Phone Number' />
                        </Col>
                        <Col md={{ size: 6 }} >
                            <input ref={el =>
                                this.userinfo.lastname = el} className='input-text' placeholder='Last Name' />
                            <input disabled='disabled' ref={el =>
                                this.userinfo.email = el} className='input-text' placeholder='Email' />
                        </Col>
                    </Row>
                </div>
                <div className='next-blk'>
                    <Button onClick={this.update}>Update</Button>
                    <Button onClick={this.cancelRequest} style={{ margin:'0 0 0 20px' }}>Cancel</Button>
                </div>
            </Container>

        );
    }
}

HostEdit.propTypes = {
    userinfo: PropTypes.object
};

function mapStateToProps(state) {
    return {
        userinfo: state.event.userinfo
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(
            {

            },
            dispatch
        )
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HostEdit));