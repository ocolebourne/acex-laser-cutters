import React from "react";

import "../index.css";
import { Navbar, Container, Nav, Column, Row, Col } from "react-bootstrap";

function Dashboard(props) {
  return (
    <div>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="">AceX Admin</Navbar.Brand>
          <Nav.Link href="#link">Logout</Nav.Link>
        </Container>
      </Navbar>
      <Container>
        <h1>Welcome</h1>
        <Row>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
