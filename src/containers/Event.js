
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import Carousel from 'nuka-carousel';
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
import Slider from "react-slick";

class Event extends Component {
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
    var settings = {
      centerMode: true,
      draggable: false,
      adaptiveHeight: true,
      autoplay: true,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3
    };
    return (
      <Container fluid={true} className='landing'>
        <Navbar expand='md'>
          <Container>
            <NavbarBrand />
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav navbar>
                <NavItem>
                  <NavLink href='/' className={this.props.match.path === '/' ? 'active' : ""}>Home</NavLink>
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
                  <NavLink href='/signIn' >Sign in</NavLink>
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
        <Row className='banner-wrapper'>
          <Col sm={{ size: 12 }} >
            <div className='banner'>
              <div className='banner-content'>
                <p className='heading'>Wah! Party</p>
                <p className='sub-heading'>A Party Without Stress</p>
                <p className='desc-text'>Book Your Party Online</p>
                <a href='/bookParty' className='btn'>Book Now</a>
              </div>
            </div>

          </Col>
        </Row>
        <div className='down-arrow' />
        <Row className='description'>
          <Col sm={{ size: 12 }} >
            <p className='des-title'>Loreum Ipsum</p>
            <p className='des-matter'>Loreum IpsumLoreum IpsumLoreum IpsumLoreum IpsumLoreum IpsumLoreum Ipsum</p>
          </Col>
        </Row>
        <div className='gallery-container'>


          <Slider {...settings}>
            <div>
              <img src={'assets/images/c_img1.png'} width='400' />
            </div>
            <div>
              <img src={'assets/images/c_img2.png'} width='400' />
            </div>
            <div>
              <img src={'assets/images/c_img3.png'} width='400' />
            </div>
            <div>
              <img src={'assets/images/c_img4.png'} width='400' />
            </div>
            <div>
              <img src={'assets/images/c_img5.png'} width='400' />
            </div>
            <div>
              <img src={'assets/images/c_img6.png'} width='400' />
            </div>
            <div>
              <img src={'assets/images/c_img7.png'} width='400' />
            </div>
            <div>
              <img src={'assets/images/c_img8.png'} width='400' />
            </div>
          </Slider>

        </div>
        <Row className='footer-links'>
          <Col sm={{ size: 12 }} className='social-icons' >
            <button> <i className='fa fa-facebook' /></button>
            <button> <i className='fa fa-twitter' /></button>
            <button> <i className='fa fa-instagram' /></button>
          </Col>
          <Col sm={{ size: 12 }} >
            <div className='links-container'>
              <ul className='left-links'>
                <li><a>Home</a></li>
                <li><a>Career</a></li>
                <li><a>Privacy Policy</a></li>
                <li><a>Reviews</a></li>
                <li><a>FAQ&apos;s</a></li>
              </ul>
              <ul className='right-links'>
                <li><a>Book Party</a></li>
                <li><a>Business Partner</a></li>
                <li><a>Blogs</a></li>
                <li><a>Sign In</a></li>
                <li><a>Get In Touch</a></li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

Event.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Event));
