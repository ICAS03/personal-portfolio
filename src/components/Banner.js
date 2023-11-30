import { useState, useEffect} from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ArrowRightCircle } from "react-bootstrap-icons";
import headerImg from "../assets/img/astro.svg";
import { clear } from "@testing-library/user-event/dist/clear";

export const Banner = () => {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const toRotate = ["Web Developer" , "App Developer" , "Cloud Engineer"];
    const [text, setText] = useState('');
    const [delta, setDelta]  = useState(300 - Math.random() * 100);
    const period = 2000;

    useEffect(()=>{
        let ticker = setInterval(() => {
            tick();
        }, delta);
        
        return () => { clearInterval(ticker)};
    }, [text])
    
    const tick = () => { 
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

        setText(updatedText);

        if(isDeleting){
            setDelta(prevDelta => prevDelta /2)
        }

        if(!isDeleting && updatedText === fullText){
            setIsDeleting(true);
            setDelta(period);
        } else if ( isDeleting && updatedText === "") {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setDelta(500);
        }
    }
    
    return (
        <section className="banner" id="home">
            <Container>
                <Row className="align-itmes-center">
                <Col xs={12} md={8} xl={6}>
                    <span className="tagline">Welcome to my Portfolio</span>
                    <h1>{'Hi I am Ivy Chung - '}<span className="wrap">{text}</span></h1>
                    <p>I am a Year 2 student specialising in Artificial Intelligence and minoring in Game Design currently studying in the School of Computer Science at Taylor's University . I have a strong passion in software development in particular application development and the eagerness in developing new skills in programming as well as diving into the world of design in technology.  </p>
                    <button onClick={()=> console.log('connect')}>Let's Connect <ArrowRightCircle size={25}></ArrowRightCircle> </button>
                </Col>
                <Col xs={12} md={7} xl={5}>
                    <img src={headerImg} alt="Header Img"></img>
                </Col>
                </Row>
            </Container>
        </section>
    )
}