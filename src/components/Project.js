import { Container, Row, Col, Tab, Nav, TabContainer } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import proimg1 from "../assets/img/proimg1.png";
import proimg2 from "../assets/img/proimg2.png";
import proimg3 from "../assets/img/proimg3.png";
import bg2 from "../assets/img/bg2.png"

export const Project = () => {
    const projects = [
        {
            title: "EatUp",
            description: "A food notifying application",
            imgUrl: proimg1,
        },
        {
            title: "EMR Record",
            description: "A healthcare EMR record",
            imgUrl: proimg2,
        },
        {
            title: "XcessCITY",
            description: "A pot-hole detector application",
            imgUrl: proimg3,
        },
        {
            title: "EatUp",
            description: "A food notifying application",
            imgUrl: proimg1,
        },
        {
            title: "EMR Record",
            description: "A healthcare EMR record",
            imgUrl: proimg2,
        },
        {
            title: "XcessCITY",
            description: "A pot-hole detector application",
            imgUrl: proimg3,
        },
    ];

    return (
        <section className="project" id="project">
            <Container>
                <Row>
                    <Col size={12}>
                        <h2>Projects</h2>
                        <p>These are some of my past projects</p>
                        <Tab.Container id="projects-tabs" defaultActiveKey="first">
                        <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab" >
                         <Nav.Item>
                           <Nav.Link eventKey="first">TAB 1</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="second">TAB 2</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="third">TAB 3</Nav.Link>
                        </Nav.Item>
                       </Nav>
                       <Tab.Content>
                        <Tab.Pane eventKey="first">
                            <Row>
                                {
                                    projects.map((project,index)=>{
                                        return (
                                           <ProjectCard key={index} {...project}></ProjectCard>
                                        )
                                    })
                                }
                            </Row>
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">Lorem Ipsum</Tab.Pane>
                        <Tab.Pane eventKey="third">Lorem Ipsum</Tab.Pane>
                       </Tab.Content>
                       </Tab.Container>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}