
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

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
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
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
                    className={this.props.match.path === '/SignIn' ? 'active' : ""} >
                    Sign in
                  </NavLink>
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
                    <input type='text' placeholder='username' className='text-bodered' />
                    <input type='password' placeholder='password' className='text-bodered' />
                    <div className='rem-blk'>
                      <label className='control control--checkbox'>
                        Remember Me
                        <input type='checkbox' />
                        <div className='control__indicator' />
                      </label>
                    </div>
                    <div className='btn-blk'>
                      <Button>Login</Button>
                      <a href='/bookParty' className='btn' >Continue As Guest</a>
                    </div>
                    <p className='singup-links' >Not a Member?  <a href=''>Sign Up</a>
                      <br /> <a href=''> Forget password?</a>
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
  match: PropTypes.object
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn));
