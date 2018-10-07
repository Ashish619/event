
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as actions from "actions/events";
import Alerts from "components/Alerts";
import { Container, Row, Col, Button } from 'reactstrap';


class HostDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alertOpen: false,
            alertColor: '',
            alertMessage: ''
        };
        this.userinfo = {
            firstname: null,
            phone: null,
            email: null,
            lastname: null,

        };

    }

    register = () => {

        if (this.userinfo.firstname.value == "" ||
            this.userinfo.phone.value == "" ||
            this.userinfo.email.value == "" ||
            this.userinfo.lastname.value == "") {
            this.setState({
                alertOpen: true,
                alertColor: 'warning',
                alertMessage: 'please fill all the details'
            });
            return;
        }
        let promise = actions.registerHostDetails({
            "email": this.userinfo.email.value,
            "first_name": this.userinfo.firstname.value,
            "last_name": this.userinfo.lastname.value,
            "mobile": this.userinfo.phone.value,

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

    cancelRequest = () => {
        window.location.href = "/";
    }

    alertClose = () => {
        this.setState({ alertOpen: false });
    }
    restrictNum = (event) => {

        if (/\D/.test(event.target.value)) {
            event.target.value = event.target.value.replace(/\D/g, "");
        }
    }
    render() {

        return (

            <Container fluid={true} className='details' >
                <Alerts
                    isOpen={this.state.alertOpen}
                    color={this.state.alertColor}
                    Message={this.state.alertMessage}
                    onDismiss={this.alertClose} />
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
                                this.userinfo.phone = el} className='input-text'
                                onChange={this.restrictNum} placeholder='Phone Number' />
                        </Col>
                        <Col md={{ size: 6 }} >
                            <input ref={el =>
                                this.userinfo.lastname = el} className='input-text' placeholder='Last Name' />
                            <input ref={el =>
                                this.userinfo.email = el} className='input-text' placeholder='Email'
                            />
                        </Col>
                    </Row>
                </div>
                <div className='next-blk'>
                    <Button onClick={this.register}>Save</Button>
                    <Button onClick={this.cancelRequest} style={{ margin: '0 0 0 20px' }}>Cancel</Button>
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