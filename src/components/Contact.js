import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { CursorEyes } from "./CursorEyes";
import { ScrollReveal } from "./ScrollReveal";
import { ScrollText } from "./ScrollText";

export const Contact = () => {
  const formInitialDetails = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  };

  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState("Send");
  const [status, setStatus] = useState({});

  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Sending...");
    setStatus({});
    try {
      let response = await fetch("http://localhost:3001/contact", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json;charset=utf-8",
        },
        body: JSON.stringify(formDetails),
      });
      let result = await response.json();
      if (response.ok && result.code === 200) {
        setStatus({ success: true, message: "Message sent successfully" });
        setFormDetails(formInitialDetails);
      } else {
        setStatus({
          success: false,
          message:
            "Message could not be sent — please reach me on LinkedIn instead.",
        });
      }
    } catch {
      setStatus({
        success: false,
        message:
          "Message could not be sent — please reach me on LinkedIn instead.",
      });
    } finally {
      setButtonText("Send");
    }
  };

  return (
    <section className="contact" id="connect">
      <ScrollReveal>
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <CursorEyes />
          </Col>
          <Col md={6}>
            <ScrollText as="h2" text="A Sweet Message?" />
            <form onSubmit={handleSubmit}>
              <Row>
                <Col sm={6} className="px-1">
                  <input
                    type="text"
                    value={formDetails.firstName}
                    placeholder="First Name"
                    onChange={(e) => onFormUpdate("firstName", e.target.value)}
                  ></input>
                </Col>
                <Col sm={6} className="px-1">
                  <input
                    type="text"
                    value={formDetails.lastName}
                    placeholder="Last Name"
                    onChange={(e) => onFormUpdate("lastName", e.target.value)}
                  ></input>
                </Col>
                <Col sm={6} className="px-1">
                  <input
                    type="email"
                    value={formDetails.email}
                    placeholder="Email"
                    onChange={(e) => onFormUpdate("email", e.target.value)}
                  ></input>
                </Col>
                <Col sm={6} className="px-1">
                  <input
                    type="tel"
                    value={formDetails.phone}
                    placeholder="Phone No."
                    onChange={(e) => onFormUpdate("phone", e.target.value)}
                  ></input>
                </Col>
                <Col>
                  <textarea
                    rows="6"
                    value={formDetails.message}
                    placeholder="Message"
                    onChange={(e) => onFormUpdate("message", e.target.value)}
                  ></textarea>
                  <button type="submit">
                    <span>{buttonText}</span>
                  </button>
                </Col>
                {status.message && (
                  <Col>
                    <p
                      className={status.success == false ? "danger" : "success"}
                    >
                      {status.message}
                    </p>
                  </Col>
                )}
              </Row>
            </form>
          </Col>
        </Row>
      </Container>
      </ScrollReveal>
    </section>
  );
};
