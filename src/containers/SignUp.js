
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter, Redirect } from "react-router";
import PropTypes from "prop-types";
import * as actions from "actions/events";

import {
    Container, Row, Col, Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Button
} from 'reactstrap';

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            role: 'host'
        };


    }

    componentWillMount = () => {
        /*  if (this.props.userinfo.hasOwnProperty('sessiontoken')) {
              window.location.pathname = '/MyParty';
          }*/
    }

    componentDidUpdate = () => {
        /* if (this.props.userinfo.hasOwnProperty('sessiontoken')) {
             window.location.pathname = '/MyParty';
         }*/
    }
    handleOptionChange = (event) => {
        this.setState({
            role: event.target.value
        });
    }

    initiateSignUp = () => {
        if (this.state.role === 'host') {
            window.location.pathname = '/bookParty';
        } else {
            window.location.pathname = '/businessPartner';
        }
    }

    render() {

        return (
            <Container fluid={true} className='landing'>
                <Navbar expand='md'>
                    <Container>
                        <NavbarBrand />
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink href='/'>Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='/bookParty'>Book Party</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='/businessPartner'>Business Partner</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink >Blogs</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='/signIn'                                    >
                                        Sign in
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='/signUp'
                                        className={this.props.match.path === '/signUp' ? 'active' : ""}>
                                        Sign Up
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className='bodered-nav'>Get In Touch</NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
                <Row className='banner-wrapper signin '>
                    <Col sm={{ size: 12 }} >
                        <div className='banner'>
                            <div className='signin-content'>
                                <p className='heading'>Sign Up</p>
                                <div className='form-content'>
                                    <form>

                                        <div className='rem-blk signup'>
                                            <label className='control control--radio'>
                                                Host
                        <input type='radio' value='host' checked={this.state.role === 'host'}
                                                    onChange={this.handleOptionChange} />
                                                <div className='control__indicator' />
                                            </label>
                                            <label className='control control--radio'>
                                                Vendor
                        <input type='radio' value='vendor' checked={this.state.role === 'vendor'}
                                                    onChange={this.handleOptionChange} />
                                                <div className='control__indicator' />
                                            </label>
                                        </div>
                                        <div className='btn-blk'>
                                            <Button onClick={this.initiateSignUp}>Go For SignUp</Button>
                                        </div>

                                    </form>
                                </div>

                            </div>
                        </div>

                    </Col>
                </Row>
            </Container>
        );
    }
}

SignUp.propTypes = {
    match: PropTypes.object,
    actions: PropTypes.object,
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
                fetchUserDetails: actions.fetchUserDetails
            },
            dispatch
        )
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignUp));
