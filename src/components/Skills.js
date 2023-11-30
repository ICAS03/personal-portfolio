import { Container } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import pg1 from '../assets/img/pg1.svg';
import pg2 from '../assets/img/pg2.svg';
import pg3 from '../assets/img/pg3.svg';
import pg4 from '../assets/img/pg4.svg';
import bg1 from '../assets/img/bg1.png';
import bg2 from '../assets/img/bg2.png';

export const Skills = () => {
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };

      return (
        <section className="skill" id="skills">
            <div className="container">
                <div className="row">
                <div className="col-12">
                    <div className="skill-bx">
                        <h2>
                            Skills
                        </h2>
                        <p>These are skills that I have attained and achieved over the course of 1 year.<br></br>With high desire in learning , more skills will be further developed or polished</p>
                        <Carousel responsive={responsive} infinite={true} className="skill-slider">
                        <div className="item">
                            <img src={pg1} alt="Image"></img>
                            <h5>Web Developement</h5>
                        </div>
                        <div className="item">
                            <img src={pg2} alt="Image"></img>
                            <h5>App Developement</h5>
                        </div>
                        <div className="item">
                            <img src={pg3} alt="Image"></img>
                            <h5>Certified Cloud Engineer</h5>
                        </div>
                        <div className="item">
                            <img src={pg4} alt="Image"></img>
                            <h5>UI/UX Designer</h5>
                        </div>
                        <div className="item">
                            <img src={pg4} alt="Image"></img>
                            <h5>3D Modelling</h5>
                        </div>
                        </Carousel>
                    </div>
                </div>
                </div>
            </div>
        </section>
      )
}