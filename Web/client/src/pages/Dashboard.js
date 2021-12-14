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
  OverlayTrigger,
  Tooltip as BSTooltip,
} from "react-bootstrap";

function Chart1(props) {
  const [timeSinceUpdate, setTimeSinceUpdate] = React.useState(0);
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    updateGraph();
    const interval = setInterval(() => {
      console.log("Refreshing Chart 1");
    }, 120000); //every 2 minutes

    return () => clearInterval(interval);
  }, []);

  async function updateGraph() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("/api/getchart1data", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Error updating Chart1");
          throw new Error(response.statusText);
        }
      })
      .then((chartData) => {
        console.log(chartData);
        setData(chartData);
      })
      .catch((error) => {
        console.log(error);
        setData({
          gas: [
            { value: 14, dt: 1503617297689 },
            { value: 15, dt: 1503616962277 },
            { value: 15, dt: 1503616882654 },
            { value: 20, dt: 1503613184594 },
            { value: 15, dt: 1503611308914 },
          ],
          cutter0: [
            { status: 1, dt: 1503617247689 },
            { status: 0, dt: 1503616965277 },
            { status: 1, dt: 1503616882254 },
            { status: 1, dt: 1503613134594 },
            { status: 0, dt: 1503611305914 },
          ],
          cutter1: [
            { status: 1, dt: 1503617247389 },
            { status: 1, dt: 1503616965477 },
            { status: 0, dt: 1503616882454 },
            { status: 1, dt: 1503613133594 },
            { status: 1, dt: 1503611305414 },
          ],
        });
      });
  }

  return (
    <Col xs={12}>
      <div className="dash-card">
        <h3>Usage vs Gas</h3>
        <ResponsiveContainer width="95%" height={500}>
          <ScatterChart>
            <XAxis
              dataKey="dt"
              domain={["auto", "auto"]}
              name="Time"
              tickFormatter={(unixTime) => new Date(unixTime).toLocaleString()}
              type="number"
            />
            <YAxis
              yAxisId="left"
              dataKey="value"
              name="Gas"
              label={{ value: "Gas", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              dataKey="status"
              name="Usage"
              orientation="right"
              tickFormatter={(status) => (status ? "In use" : "Available")}
              tickCount={2}
              label={{
                value: "Laser cutter usage",
                angle: -90,
                position: "center",
              }}
            />
            <Tooltip
              formatter={(value) => {
                if (value > 1000000) {
                  return new Date(value).toLocaleString();
                } else if (value == 1) {
                  return "In use";
                } else if (value == 0) {
                  return "Available";
                } else {
                  return value;
                }
              }}
            />
            <Scatter
              yAxisId="left"
              data={data.gas}
              line={{ stroke: "#8884d8" }}
              fill="#8884d8"
              lineJointType="monotoneX"
              lineType="joint"
              name="Gas"
            />
            <Scatter
              yAxisId="right"
              data={data.cutter0}
              line={{ stroke: "#82ca9d" }}
              fill="#82ca9d"
              lineJointType="monotoneX"
              lineType="joint"
              name="Usage"
            />
            <Scatter
              yAxisId="right"
              data={data.cutter1}
              line={{ stroke: "#82ca4d" }}
              fill="#82ca9d"
              lineJointType="monotoneX"
              lineType="joint"
              name="Usage"
            />
            <Brush dataKey="dt" data={data.gas} />
          </ScatterChart>
        </ResponsiveContainer>
        <OverlayTrigger
          key="chart1"
          placement="top"
          overlay={<BSTooltip id="tooltip-chart1">Click to refresh</BSTooltip>}
        >
          <a className="mla mt10 update-text" alt="Click to refresh">
            Updated {timeSinceUpdate}mins ago
          </a>
        </OverlayTrigger>
      </div>
    </Col>
  );
}

function Dashboard(props) {
  const [deviceList, setDeviceList] = React.useState([]);
  const [page, setPage] = React.useState(0);

  function updateDeviceList() {
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
        setDeviceList(devices);
      })
      .catch((error) => {
        setDeviceList([
          {
            index: 0,
            name: "abc3.50",
            nickname: "Left Laser Cutter",
            status: 1,
          },
          {
            index: 1,
            name: "def4.60",
            nickname: "Right Laser Cutter",
            status: 0,
          },
        ]);
        console.log(error);
      });
  }

  React.useEffect(() => {
    updateDeviceList();
    const interval = setInterval(() => {
      console.log("refreshing devices");
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="home">
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="">AceX Laser Cutters</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Dashboard</Nav.Link>
              <Nav.Link href="#charts">Charts</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <h1 className="mt75">Welcome</h1>
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
      <Container id="charts">
        <h1>Charts</h1>
        <Row className="justify-content-md-left mt30">
          <Chart1 />
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
