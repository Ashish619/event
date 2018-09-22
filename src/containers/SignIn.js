
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

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.username = null;
    this.password = null;
  }

  componentWillMount = () => {
    /*  if (this.props.userinfo.hasOwnProperty('sessiontoken')) {
        window.location.pathname = '/MyParty';
      }*/
  }

  componentDidUpdate = () => {
    if (this.props.userinfo.hasOwnProperty('sessiontoken')) {

      if (this.props.userinfo.role == 3) {
        window.location.pathname = '/MyPartyVendor';
      } else if (this.props.userinfo.role == 2) {
        window.location.pathname = '/MyPartyHost';
      }
    }
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  initiateLogin = () => {
    this.props.actions.fetchUserDetails(this.username.value, this.password.value);
  }

  forgetPwd = () => {

    console.log(this.username);
    actions.resetPassword(this.username.value).then(res => res.json()).then(res => { console.log(res); });
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
                  <NavLink href='/signIn'
                    className={this.props.match.path === '/signIn' ? 'active' : ""} >
                    Sign in
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href='/signUp' >Sign Up</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className='bodered-nav'>Get In Touch</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <Row className='banner-wrapper signin'>
          <Col sm={{ size: 12 }} >
            <div className='banner'>
              <div className='signin-content'>
                <p className='heading'>Login</p>
                <div className='form-content'>
                  <form>
                    <input ref={el => { this.username = el; }}
                      type='text' placeholder='username' className='text-bodered' />
                    <input ref={el => { this.password = el; }}
                      type='password' placeholder='password' className='text-bodered' />
                    <div className='rem-blk'>
                      <label className='control control--checkbox'>
                        Remember Me
                        <input type='checkbox' />
                        <div className='control__indicator' />
                      </label>
                    </div>
                    <div className='btn-blk'>
                      <Button onClick={this.initiateLogin}>Login</Button>
                    </div>
                    <p className='singup-links' >Not a Member?  <a href='/signUp'>Sign Up</a>
                      <br /> <a onClick={this.forgetPwd}> Forget password?</a>
                    </p>
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

SignIn.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn));
