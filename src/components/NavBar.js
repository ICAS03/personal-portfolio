import { useEffect, useState } from "react";
import { Navbar , Container , Nav } from "react-bootstrap";
import logo from '../assets/img/logo.svg'
import navIcon1 from '../assets/img/fb.svg';
import navIcon2 from '../assets/img/ig.svg';
import navIcon3 from '../assets/img/linkedin.svg';

export const NavBar = () => {
    const [activelink , setActiveLink] = useState('home');
    const [scrolled , setScrolled] = useState(false);

    useEffect( () => {
        const onScroll = () => {
            if(window.scrollY > 50){
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        }

        window.addEventListener("scroll" , onScroll);

        return () => window.removeEventListener("scroll",onScroll);
    } , [])

    const onUpdateActiveLink = (value) => {
        setActiveLink(value);
    }

    return (
        <Navbar expand="lg" className={scrolled? "scrolled" : ""}>
          <Container>
            <Navbar.Brand href="#home"> 
            <img src={logo} alt="LOGO"></img>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav">
               <span className="navbar-toggle-icon"></span> 
            </Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#home" className={activelink === 'home' ? 'active navbar-link' : 'navbar-link' } onClick={()=> onUpdateActiveLink('home')}>Home</Nav.Link>
                <Nav.Link href="#skills" className={activelink === 'skills' ? 'active navbar-link' : 'navbar-link' } onClick={()=> onUpdateActiveLink('skills')}>Skills</Nav.Link>
                <Nav.Link href="#project" className={activelink === 'project' ? 'active navbar-link' : 'navbar-link'} onClick={()=> onUpdateActiveLink('project')}>Projects</Nav.Link>
              </Nav>
              <span className="navbar-text">
                <div className="social-icon">
                    <a href={"https://www.facebook.com/ivy.chung.543/" || "#"}><img src={navIcon1} alt=""></img></a>
                    <a href="#"><img src={navIcon2} alt=""></img></a>
                    <a href={"https://www.linkedin.com/in/ivy-shin-3760b526a/" || "#"}><img src={navIcon3} alt=""></img></a>
                </div>
                <button className="vvd" onClick={()=> console.log('conect')}><span>Let's Connect</span></button>
              </span>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
}