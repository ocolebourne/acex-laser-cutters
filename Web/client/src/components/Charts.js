//File containing user frontend chart components

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
  Button,
  ButtonGroup,
} from "react-bootstrap";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Chart1(props) { //Chart 1 usage vs gas on a longer time frame
  const [data, setData] = React.useState({});

  const [dateRange, setDateRange] = React.useState([
    new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    new Date(),
  ]);
  const [showPeriodError, setShowPeriodError] = React.useState(false);
  const [startDate, endDate] = dateRange;
  const maxPeriod = 24 * 60 * 60 * 1000 * 7; //7 days in milliseconds

  const [show350, setShow350] = React.useState(true);
  const [show460, setShow460] = React.useState(true);
  const [showGas, setShowGas] = React.useState(true);
  const [autoY, setAutoY] = React.useState(false);

  async function handleDateChange() {
    setShowPeriodError(false);
    if (endDate.getTime() - startDate.getTime() > maxPeriod) { //upon date range select check and correct if over 7 days
      console.log("7 days max");
      setShowPeriodError(true);
      await setDateRange([
        startDate,
        new Date(startDate.getTime() + maxPeriod),
      ]);
    }
    updateGraph();
  }

  React.useEffect(() => {
    updateGraph();
  }, []);

  async function updateGraph() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const params = {
      start: startDate,
      end: endDate,
    };
    fetch(`/api/getchart1data?` + new URLSearchParams(params), requestOptions) //get request with start and end date
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
        // setData({ //for testing w/o api
        //   gas: [
        //     { value: 14, dt: 1503617297689 },
        //     { value: 15, dt: 1503616962277 },
        //     { value: 15, dt: 1503616882654 },
        //     { value: 20, dt: 1503613184594 },
        //     { value: 15, dt: 1503611308914 },
        //   ],
        //   cutter0: [
        //     { status: 1, dt: 1503617247689 },
        //     { status: 0, dt: 1503617248689 },
        //     { status: 0, dt: 1503616965277 },
        //     { status: 1, dt: 1503616966277 },
        //     { status: 1, dt: 1503616882254 },
        //     { status: 0, dt: 1503616883254 },
        //     { status: 0, dt: 1503613133594 },
        //     { status: 1, dt: 1503613134594 },
        //     { status: 1, dt: 1503611304914 },
        //     { status: 0, dt: 1503611305914 },
        //   ],
        //   cutter1: [
        //     { status: 1, dt: 1503617247389 },
        //     { status: 1, dt: 1503616965477 },
        //     { status: 0, dt: 1503616882454 },
        //     { status: 1, dt: 1503613133594 },
        //     { status: 1, dt: 1503611305414 },
        //   ],
        // });
      });
  }

  return (
    <Col xs={12}>
      <div className="dash-card">
        <h3>Usage vs Gas: Long-term</h3>
        <ResponsiveContainer width="95%" height={500}>
          <ScatterChart>
            <Legend verticalAlign="top" height={50} />
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
              domain={autoY ? ["dataMin", "dataMax"] : [0, 350]}
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
              formatter={(value) => { //format tooltip to show date time in iso string, and usage data a in use/available
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
            {showGas ? (
              <Scatter
                yAxisId="left"
                data={data.gas}
                line={{ stroke: "#8884d8" }}
                fill="#8884d8"
                lineJointType="monotoneX"
                lineType="joint"
                name="Gas"
              />
            ) : (
              <></>
            )}
            {show350 ? (
              <Scatter
                yAxisId="right"
                data={data.cutter0}
                line={{ stroke: "#82ca9d" }}
                fill="#82ca9d"
                lineJointType="monotoneX"
                lineType="joint"
                name="VLS3.50"
              />
            ) : (
              <></>
            )}
            {show460 ? (
              <Scatter
                yAxisId="right"
                data={data.cutter1}
                line={{ stroke: "#82b7ca" }}
                fill="#82b7ca"
                lineJointType="monotoneX"
                lineType="joint"
                name="VLS4.60"
              />
            ) : (
              <></>
            )}
          </ScatterChart>
        </ResponsiveContainer>
        <Row style={{ width: "100%" }}>
          <Col className="mt20">
            <DatePicker
              dateFormat="dd/MM/yyy"
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              withPortal
              onCalendarClose={() => handleDateChange()}
            />
            {showPeriodError ? (
              <div className="error-message">Max. 7 days</div>
            ) : (
              <div>
                <br></br>
              </div>
            )}
          </Col>
          <Col className="graph-tools">
            <Button variant="secondary" onClick={() => setAutoY(!autoY)}>
              Auto Y: {autoY ? "on" : "off"}
            </Button>
          </Col>
          <Col className="graph-tools">
            <ButtonGroup>
              <Button
                variant={show350 ? "secondary" : "outline-secondary"}
                onClick={() => setShow350(!show350)}
              >
                VLS3.50
              </Button>
              <Button
                variant={show460 ? "secondary" : "outline-secondary"}
                onClick={() => setShow460(!show460)}
              >
                VLS4.60
              </Button>
              <Button
                variant={showGas ? "secondary" : "outline-secondary"}
                onClick={() => setShowGas(!showGas)}
              >
                Gas
              </Button>
            </ButtonGroup>
          </Col>
          <Col className="graph-tools">
            <Button variant="secondary" onClick={() => updateGraph()}>
              Refresh data
            </Button>
          </Col>
        </Row>
      </div>
    </Col>
  );
}

function Chart2(props) {
  const [data, setData] = React.useState({});
  const today = new Date().setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = React.useState(today);
  const [autoY, setAutoY] = React.useState(false);
  const dayInMilli = 24 * 60 * 60 * 1000;

  const [show350, setShow350] = React.useState(true);
  const [show460, setShow460] = React.useState(true);
  const [showGas, setShowGas] = React.useState(true);

  function handleDateChange(direction) { //handle next/prev day buttons
    const newDate = new Date(
      new Date(selectedDate).getTime() + direction * dayInMilli
    ).toISOString();
    setSelectedDate(newDate);
    updateGraph(newDate);
  }

  React.useEffect(() => {
    updateGraph(today);
  }, []);

  async function updateGraph(day) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const params = {
      date: new Date(day),
    };
    console.log(params);
    fetch(`/api/getchart2data?` + new URLSearchParams(params), requestOptions) //GET request for chart 2 data on selected day
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Error updating Chart2");
          throw new Error(response.statusText);
        }
      })
      .then((chartData) => {
        console.log(chartData);
        setData(chartData);
      })
      .catch((error) => {
        console.log(error);
        // setData({ //for testing w/o api
        //   gas: [
        //     { value: 14, dt: 1503617297689 },
        //     { value: 15, dt: 1503616962277 },
        //     { value: 15, dt: 1503616882654 },
        //     { value: 20, dt: 1503613184594 },
        //     { value: 15, dt: 1503611308914 },
        //   ],
        //   cutter0: [
        //     { status: 1, dt: 1503617247689 },
        //     { status: 0, dt: 1503617248689 },
        //     { status: 0, dt: 1503616965277 },
        //     { status: 1, dt: 1503616966277 },
        //     { status: 1, dt: 1503616882254 },
        //     { status: 0, dt: 1503616883254 },
        //     { status: 0, dt: 1503613133594 },
        //     { status: 1, dt: 1503613134594 },
        //     { status: 1, dt: 1503611304914 },
        //     { status: 0, dt: 1503611305914 },
        //   ],
        //   cutter1: [
        //     { status: 1, dt: 1503617247389 },
        //     { status: 1, dt: 1503616965477 },
        //     { status: 0, dt: 1503616882454 },
        //     { status: 1, dt: 1503613133594 },
        //     { status: 1, dt: 1503611305414 },
        //   ],
        // });
      });
  }

  return (
    <Col xs={12}>
      <div className="dash-card">
        <h3>Usage vs Gas: Daily</h3>
        <ResponsiveContainer width="95%" height={500}>
          <ScatterChart>
            <Legend verticalAlign="top" height={50} />
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
              domain={autoY ? ["dataMin", "dataMax"] : [0, 350]}
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
              formatter={(value) => { //format tooltip to show date time in iso string, and usage data a in use/available
                if (value > 1000000) {
                  return new Date(value).toLocaleString();
                } else if (value == (1 || 0.99)) {
                  return "In use";
                } else if (value == 0) {
                  return "Available";
                } else {
                  return value;
                }
              }}
            />
            {showGas ? (
              <Scatter
                yAxisId="left"
                data={data.gas}
                line={{ stroke: "#8884d8" }}
                fill="#8884d8"
                lineJointType="monotoneX"
                lineType="joint"
                name="Gas"
              />
            ) : (
              <></>
            )}
            {show350 ? (
              <Scatter
                yAxisId="right"
                data={data.cutter0}
                line={{ stroke: "#82ca9d" }}
                fill="#82ca9d"
                lineJointType="monotoneX"
                lineType="joint"
                name="VLS3.50"
              />
            ) : (
              <></>
            )}
            {show460 ? (
              <Scatter
                yAxisId="right"
                data={data.cutter1}
                line={{ stroke: "#82b7ca" }}
                fill="#82b7ca"
                lineJointType="monotoneX"
                lineType="joint"
                name="VLS4.60"
              />
            ) : (
              <></>
            )}
          </ScatterChart>
        </ResponsiveContainer>
        <Row style={{ width: "100%" }}>
          <Col className="graph-tools">
            <Button variant="secondary" onClick={() => handleDateChange(-1)}>
              Prev.
            </Button>
            <div className="selected-day">
              {new Date(selectedDate).toLocaleDateString()}
            </div>
            <Button variant="secondary" onClick={() => handleDateChange(1)}>
              Next
            </Button>
          </Col>
          <Col className="graph-tools">
            <Button variant="secondary" onClick={() => setAutoY(!autoY)}>
              Auto Y: {autoY ? "on" : "off"}
            </Button>
          </Col>
          <Col className="graph-tools">
            <ButtonGroup>
              <Button
                variant={show350 ? "secondary" : "outline-secondary"}
                onClick={() => setShow350(!show350)}
              >
                VLS3.50
              </Button>
              <Button
                variant={show460 ? "secondary" : "outline-secondary"}
                onClick={() => setShow460(!show460)}
              >
                VLS4.60
              </Button>
              <Button
                variant={showGas ? "secondary" : "outline-secondary"}
                onClick={() => setShowGas(!showGas)}
              >
                Gas
              </Button>
            </ButtonGroup>
          </Col>
          <Col className="graph-tools">
            <Button
              variant="secondary"
              onClick={() => updateGraph(selectedDate)}
            >
              Refresh data
            </Button>
          </Col>
        </Row>
      </div>
    </Col>
  );
}

export { Chart1, Chart2 };
