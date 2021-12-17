//main file for the user frontend panel

import React from "react";

import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Brush,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "../index.css";

import {
  Navbar,
  Container,
  Nav,
  Column,
  Row,
  Col,
  Image,
  Overlay,
  Tooltip as BSTooltip,
  Alert,
  Spinner,
} from "react-bootstrap";

import { Chart1, Chart2 } from "../components/Charts";

function LoadingSpinner(props) {
  //loading spinner overlay shown through props.showSpinner
  return (
    <>
      {props.showSpinner ? (
        <div className="loading-spinner">
          <Image className="loading-icon" fluid src="./logo512.png" alt=" " />
          <Spinner animation="border" />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

function Dashboard(props) {
  const [deviceList, setDeviceList] = React.useState([]);
  const [workshopStats, setWorkshopStats] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  function updateWorkshopStats() { //main fetch function for updating live analytics
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("/api/getworkshopstats", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Error retrieving workshop stats");
          throw new Error(response.statusText);
        }
      })
      .then((workshopStats) => {
        console.log(workshopStats);
        setWorkshopStats(workshopStats); //update displayed analytics with response
      })
      .catch((error) => {
        // setWorkshopStats({ //for testing w/o api
        //   lastHourAverage: "27.79",
        //   lastGasReadingValue: 26,
        //   lastGasReadingDt: "2021-12-16T18:46:30Z",
        //   usersToday: 1,
        //   timeUsed: 770590,
        //   morningThreshold: "31.11",
        //   isDangerous: 0,
        //   isAboveMorning: 0,
        // });
        console.log(error.message);
      });
  }

  function updateDeviceList() { //main fetch function for updating equipment statuses
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("/api/getdevicestatuses", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Error retrieving devices");
          throw new Error(response.statusText);
        }
      })
      .then((devices) => {
        console.log(devices);
        setDeviceList(devices); //update displayed equipment status
        setTimeout(()=>{setLoading(false)},2000); //hide loading spinner (for first time opening)
      })
      .catch((error) => {
        // setDeviceList([ //for testing w/o api
        //   {
        //     index: 0,
        //     name: "abc3.50",
        //     nickname: "Left Laser Cutter",
        //     status: 1,
        //   },
        //   {
        //     index: 1,
        //     name: "def4.60",
        //     nickname: "Right Laser Cutter",
        //     status: 0,
        //   },
        // ]);
        // setTimeout(()=>{setLoading(false)},2000);
        console.log(error.message);
      });
  }

  React.useEffect(() => { //on page load update device statuses and analytics then set 15s interval to refresh them dynamically
    updateDeviceList();
    updateWorkshopStats();
    const interval = setInterval(() => {
      updateDeviceList();
      updateWorkshopStats();
      console.log("refreshing devices and stats");
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="home">
      <LoadingSpinner showSpinner={loading}/>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="">AceX Workshop</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Status</Nav.Link>
              <Nav.Link href="#data">Data</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <h1 className="mt75">Status</h1>
        <Row className="justify-content-md-left mt30">
          {deviceList.map((device, i) => {
            return (
              <Col xs={12} md={6}>
                <div className="dash-card">
                  <Image
                    className="laser-icon"
                    fluid
                    src="./laser-cutter-icon.png"
                    alt=" "
                  />
                  <h3>{device.name}</h3>
                  <h3>
                    Status:{" "}
                    {device.status ? (
                      <b className="in-use-text">in use</b>
                    ) : (
                      <b className="available-text">available</b>
                    )}
                  </h3>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
      <Container id="data">
        <h1>Data</h1>
        <Row className="justify-content-md-left mt30">
          <Col xs={12} md={4}>
            <div className="stats-card">
              <Image
                className="stats-icon"
                fluid
                src="./user-icon.png"
                alt=" "
              />
              <h3>No. users today: {workshopStats.usersToday}</h3>
              <h3>
                Hours in use today:{" "}
                {(workshopStats.timeUsed / (1000 * 60 * 60)).toFixed(0)}h
                {(workshopStats.timeUsed / (1000 * 60)).toFixed(0)}m
              </h3>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="stats-card">
              <Image
                className="stats-icon"
                fluid
                src="./gas-icon.png"
                alt=" "
              />
              <h3>
                Last Reading (
                {new Date(workshopStats.lastGasReadingDt).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit", second: "2-digit" }
                )}
                ): {workshopStats.lastGasReadingValue}
              </h3>
              <h3>Last hour avg.: {workshopStats.lastHourAverage}</h3>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="stats-card">
              <Image
                className="stats-icon"
                fluid
                src="./warning-icon.png"
                alt=" "
              />
              <h3>Today's baseline: {workshopStats.morningThreshold}</h3>
              <h3>
                Relative gas level:{" "}
                {workshopStats.isDangerous ? (
                  <b className="error-message">HIGH</b>
                ) : (
                  <b className="success-message">
                    {workshopStats.isAboveMorning ? "NORMAL" : "LOW"}
                  </b>
                )}
              </h3>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-md-left mt30">
          <Chart2 />
        </Row>
        <Row className="justify-content-md-left mt30">
          <Chart1 />
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
