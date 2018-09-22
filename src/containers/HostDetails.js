
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as actions from "actions/events";
import { Container, Row, Col, Button } from 'reactstrap';


class HostDetails extends Component {
    constructor(props) {
        super(props);

        this.userinfo = {
            firstname: null,
            phone: null,
            email: null,
            lastname: null,
        };

    }

    register = () => {
        actions.registerHostDetails({
            "email": this.userinfo.email.value,
            "first_name": this.userinfo.firstname.value,
            "last_name": this.userinfo.lastname.value,
            "mobile": this.userinfo.phone.value,

        });
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
                            <input ref={el =>
                                this.userinfo.email = el} className='input-text' placeholder='Email' />
                        </Col>
                    </Row>
                </div>
                <div className='next-blk'>
                    <Button onClick={this.register}>Save</Button>
                </div>
            </Container>

        );
    }
}

HostDetails.propTypes = {

};

function mapStateToProps(state) {
    return {

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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HostDetails));