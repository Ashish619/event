
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as actions from "actions/events";
import Alerts from "components/Alerts";
import { Container, Row, Col, Button } from 'reactstrap';


class HostEdit extends Component {
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
    alertClose = () => {
        this.setState({ alertOpen: false });
    }
    update = () => {

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

        let promise = actions.updateHostDetails({

            "first_name": this.userinfo.firstname.value,
            "last_name": this.userinfo.lastname.value,
            "mobile": this.userinfo.phone.value,

        }, this.props.userinfo.sessiontoken, this.userinfo.email.value);



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
                    alertMessage: 'you details are update and now you  will be redirected to signin page'

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

    cancelRequest = () => {
        window.location.href = "/MyPartyHost";
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
                            <input disabled='disabled' ref={el =>
                                this.userinfo.email = el} className='input-text' placeholder='Email' />
                        </Col>
                    </Row>
                </div>
                <div className='next-blk'>
                    <Button onClick={this.update}>Update</Button>
                    <Button onClick={this.cancelRequest} style={{ margin: '0 0 0 20px' }}>Cancel</Button>
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