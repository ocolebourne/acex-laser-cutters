import React from "react";
import { useCookies } from "react-cookie";

import "../index.css";
import {
  Navbar,
  Container,
  Nav,
  Column,
  Row,
  Col,
  Modal,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";

// function templateModal(props) {
//   const [readOnly, setReadOnly] = React.useState(false);
//   const [loadingSpinner, setLoadingSpinner] = React.useState(false);

//   const oldPassword = React.useRef();

//   const handleKeyPress = (event) => {
//       if (event.key === "Enter") {
//         onSubmit();
//       }
//   };

//   function onSubmit() {
//     setReadOnly(true)
//   }

//   return (
//     <Modal
//       {...props}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton>
//         <Modal.Title id="contained-modal-title-vcenter">Add User</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form.Group className="mb-3">
//           <Form.Label>Short code</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="e.g. ab1234"
//             readOnly={readOnly ? true : false}
//           />
//         </Form.Group>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="primary" type="submit">
//           Change Password
//         </Button>
//         <Button variant="secondary" onClick={props.onHide}>
//           Cancel
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

//function CheckUserModal

function DeleteUserModal(props) {
  const [readOnly, setReadOnly] = React.useState(false);
  const [cardID, setCardID] = React.useState("");
  const [scannerEnabled, setScannerEnabled] = React.useState(false);
  const [loadingSpinner, setLoadingSpinner] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const [shortCodeInvalid, setShortCodeInvalid] = React.useState(false);
  const [cardIDInvalid, setCardIDInvalid] = React.useState(false);
  const [fieldErrorMsg, setFieldErrorMsg] = React.useState("");

  const cardIdInput = React.useRef();
  const shortCode = React.useRef();

  const handleKeyPress = (event) => {
    resetModal();
    if (event.key === "Enter") {
      if (scannerEnabled) {
        //if enter key prevent default
        event.preventDefault();
        console.log(cardIdInput.current.value);
        if (cardIdInput.current.value.length === 10) {
          //if input data length 10, run finduser
          console.log("here");
          const currCardId = cardIdInput.current.value;
          setCardID(currCardId);
        }
      } else {
        onSubmit();
        readOnly(true);
      }
    }
  };

  function resetModal() {
    setShowSuccessMessage(false);
    setShowErrorMessage(false);
    setShortCodeInvalid(false);
    setCardIDInvalid(false);
    setReadOnly(false);
  }

  function onSubmit() {
    const shortC = shortCode.current.value;
    const card = cardIdInput.current.value;
    if (!shortC && !card) {
      setFieldErrorMsg("Please enter valid user details");
      setShortCodeInvalid(true);
      setCardIDInvalid(true);
    } else {
      setReadOnly(true);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      };
      if (card) {
        requestOptions.body = JSON.stringify({
          card_id: card,
        });
      } else if (shortC) {
        requestOptions.body = JSON.stringify({
          short_code: shortC,
        });
      }
      fetch("/api/delUser", requestOptions)
        .then((response) => {
          if (response.ok) {
            setLoadingSpinner(false);
            setShowSuccessMessage(true);
            setTimeout(() => {
              props.onHide();
              resetModal();
              setCardID("");
            }, 2000);
          } else if (response.status === 403) {
            console.log("Auth token bad");
            resetModal();
            setCardID("");
            props.kick();
            throw new Error(response.statusText);
          } else if (response.status === 404) {
            console.log("User not found");
            setFieldErrorMsg("User not found, try again");
            setCardID("");
            if (card) {
              setCardIDInvalid(true);
            } else if (shortC) {
              setShortCodeInvalid(true);
            }
            throw new Error(response.statusText);
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
          setReadOnly(false);
          setLoadingSpinner(false);
          setShowErrorMessage(true);
        });
    }
  }

  React.useEffect(() => {
    if (scannerEnabled) {
      cardIdInput.current.value = "";
      cardIdInput.current.focus();
      setShowSuccessMessage(false);
      setShowErrorMessage(false);
      setShortCodeInvalid(false);
      setCardIDInvalid(false);
      setCardID("");
    }
  }, [scannerEnabled]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <input
        className="scanner-input"
        ref={cardIdInput}
        onKeyPress={handleKeyPress}
        onBlur={() => setScannerEnabled(false)}
      />
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Delete User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Short code</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. ab1234"
            readOnly={readOnly ? true : false}
            onKeyPress={handleKeyPress}
            ref={shortCode}
            isInvalid={shortCodeInvalid}
          />
          <Form.Control.Feedback type="invalid">
            {fieldErrorMsg}
          </Form.Control.Feedback>
        </Form.Group>
        <h5 className="mb20">OR</h5>
        <Form.Group className="mb-3">
          <Form.Label>Card ID</Form.Label>
          <Row>
            <Col xs="auto">
              <Button
                className="scanner-button"
                onClick={() => setScannerEnabled(true)}
                variant="primary"
                disabled={scannerEnabled || readOnly ? true : false}
              >
                {scannerEnabled ? "Scan card" : "Enable Scanner"}
              </Button>
            </Col>
            <Col>
              <Form.Control
                type="password"
                placeholder=""
                value={cardID}
                readOnly
                isInvalid={cardIDInvalid}
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrorMsg}
              </Form.Control.Feedback>
            </Col>
          </Row>
        </Form.Group>
      </Modal.Body>
      <AdminModalFooter
        loadingSpinner={loadingSpinner}
        showErrorMessage={showErrorMessage}
        showSuccessMessage={showSuccessMessage}
        readOnly={readOnly}
        onSubmit={onSubmit}
        onHide={props.onHide}
        cancel={"Cancel"}
        actionButton={"Delete User"}
        actionButtonRed={true}
      />
    </Modal>
  );
}

function ChangePasswordModal(props) {
  const [readOnly, setReadOnly] = React.useState(false);
  const [loadingSpinner, setLoadingSpinner] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);

  const oldPassword = React.useRef();
  const newPassword = React.useRef();

  const handleKeyPress = (event) => {
    resetModal();
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  function resetModal() {
    setShowSuccessMessage(false);
    setShowErrorMessage(false);
    setPasswordError(false);
  }

  function onSubmit() {
    setReadOnly(true);
    const oldPass = oldPassword.current.value;
    const newPass = newPassword.current.value;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({ old_password: oldPass, new_password: newPass }),
    };
    fetch("/api/changepass", requestOptions)
      .then((response) => {
        if (response.ok) {
          setLoadingSpinner(false);
          setShowSuccessMessage(true);
          setTimeout(() => {
            props.onHide();
            setReadOnly(false);
            setShowSuccessMessage(false);
          }, 2000);
        } else if (response.status === 401) {
          console.log("Incorrect old password");
          setPasswordError(true);
          throw new Error(response.statusText);
        } else if (response.status === 403) {
          console.log("Auth token bad");
          props.kick();
          throw new Error(response.statusText);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
        setReadOnly(false);
        setLoadingSpinner(false);
        setShowErrorMessage(true);
      });
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Change Admin Password
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Old password</Form.Label>
            <Form.Control
              type="password"
              placeholder=""
              readOnly={readOnly ? true : false}
              ref={oldPassword}
              isInvalid={passwordError}
              isValid={showSuccessMessage}
              onKeyPress={handleKeyPress}
            />
            <Form.Control.Feedback type="invalid">
              Incorrect old password, try again
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New password</Form.Label>
            <Form.Control
              type="password"
              placeholder=""
              readOnly={readOnly ? true : false}
              ref={newPassword}
              onKeyPress={handleKeyPress}
              isValid={showSuccessMessage}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <AdminModalFooter
        loadingSpinner={loadingSpinner}
        showErrorMessage={showErrorMessage}
        showSuccessMessage={showSuccessMessage}
        readOnly={readOnly}
        onSubmit={onSubmit}
        onHide={props.onHide}
        cancel={"Cancel"}
        actionButton={"Change Password"}
      />
    </Modal>
  );
}

// function CheckUserModal(props) {
//   const [readOnly, setReadOnly] = React.useState(false);
//   const [cardID, setCardID] = React.useState("");
//   const [scannerEnabled, setScannerEnabled] = React.useState(false);
//   const [loadingSpinner, setLoadingSpinner] = React.useState(false);
//   const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
//   const [showErrorMessage, setShowErrorMessage] = React.useState(false);
//   const [cardIDInvalid, setCardIDInvalid] = React.useState(false);
//   const [cardIDInvalid, setCardIDInvalid] = React.useState(false);

//   const cardIdInput = React.useRef();

//   const handleKeyPress = (event) => {
//     resetModal();
//     if (event.key === "Enter") {
//       if (scannerEnabled) {
//         //if enter key prevent default
//         event.preventDefault();
//         console.log(cardIdInput.current.value);
//         if (cardIdInput.current.value.length === 10) {
//           //if input data length 10, run finduser
//           console.log("here");
//           const currCardId = cardIdInput.current.value;
//           setCardID(currCardId);
//         }
//       } else {
//         onSubmit();
//         readOnly(true);
//       }
//     }
//   };

//   function resetModal() {
//     setShowSuccessMessage(false);
//     setShowErrorMessage(false);
//     setCardIDInvalid(false);
//   }

//   function onSubmit() {
//     const card = cardIdInput.current.value;
//     if (!card) {
//       setCardIDInvalid(true);
//     } else {
//       setReadOnly(true);
//       const requestOptions = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ card_id: card }),
//       };
//       fetch("/api/checkUser", requestOptions)
//         .then((response) => {
//           if (response.ok) {
//             setLoadingSpinner(false);
//             setShowSuccessMessage(true);

//           } else if (response.status === 403) {
//             console.log("Auth token bad");
//             props.kick();
//             throw new Error(response.statusText);
//           } else {
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//           setReadOnly(false);
//           setLoadingSpinner(false);
//           setShowErrorMessage(true);
//         });
//     }
//   }

//   React.useEffect(() => {
//     if (scannerEnabled) {
//       cardIdInput.current.value = "";
//       cardIdInput.current.focus();
//     }
//   }, [scannerEnabled]);

//   return (
//     <Modal
//       {...props}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <input
//         className="scanner-input"
//         ref={cardIdInput}
//         onKeyPress={handleKeyPress}
//         onBlur={() => setScannerEnabled(false)}
//       />
//       <Modal.Header closeButton>
//         <Modal.Title id="contained-modal-title-vcenter">Add User</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form.Group className="mb-3">
//           <Form.Label>Short code</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="e.g. ab1234"
//             readOnly={readOnly ? true : false}
//             onKeyPress={handleKeyPress}
//             ref={shortCode}
//             isInvalid={shortCodeInvalid}
//           />
//           <Form.Control.Feedback type="invalid">
//             Please enter a short code.
//           </Form.Control.Feedback>
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Card ID</Form.Label>
//           <Row>
//             <Col xs="auto">
//               <Button
//                 className="scanner-button"
//                 onClick={() => setScannerEnabled(true)}
//                 variant="primary"
//                 disabled={scannerEnabled || readOnly ? true : false}
//               >
//                 {scannerEnabled ? "Scan card" : "Enable Scanner"}
//               </Button>
//             </Col>
//             <Col>
//               <Form.Control
//                 type="password"
//                 placeholder=""
//                 value={cardID}
//                 readOnly
//                 isInvalid={cardIDInvalid}
//               />
//               <Form.Control.Feedback type="invalid">
//                 Please add a card ID.
//               </Form.Control.Feedback>
//             </Col>
//           </Row>
//         </Form.Group>
//       </Modal.Body>
//       <AdminModalFooter
//         loadingSpinner={loadingSpinner}
//         showErrorMessage={showErrorMessage}
//         showSuccessMessage={showSuccessMessage}
//         readOnly={readOnly}
//         onSubmit={onSubmit}
//         onHide={props.onHide}
//         cancel={"Cancel"}
//         actionButton={"Add User"}
//       />
//     </Modal>
//   );
// }

function AddUserModal(props) {
  const [readOnly, setReadOnly] = React.useState(false);
  const [cardID, setCardID] = React.useState("");
  const [scannerEnabled, setScannerEnabled] = React.useState(false);
  const [loadingSpinner, setLoadingSpinner] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const [shortCodeInvalid, setShortCodeInvalid] = React.useState(false);
  const [cardIDInvalid, setCardIDInvalid] = React.useState(false);

  const cardIdInput = React.useRef();
  const shortCode = React.useRef();

  const handleKeyPress = (event) => {
    resetModal();
    if (event.key === "Enter") {
      if (scannerEnabled) {
        //if enter key prevent default
        event.preventDefault();
        console.log(cardIdInput.current.value);
        if (cardIdInput.current.value.length === 10) {
          //if input data length 10, run finduser
          console.log("here");
          const currCardId = cardIdInput.current.value;
          setCardID(currCardId);
        }
      } else {
        onSubmit();
        readOnly(true);
      }
    }
  };

  function resetModal() {
    setShowSuccessMessage(false);
    setShowErrorMessage(false);
    setShortCodeInvalid(false);
    setCardIDInvalid(false);
    setReadOnly(false);
  }

  function onSubmit() {
    const shortC = shortCode.current.value;
    const card = cardIdInput.current.value;
    if (!shortC) {
      setShortCodeInvalid(true);
    } else if (!card) {
      setCardIDInvalid(true);
    } else {
      setReadOnly(true);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ short_code: shortC, card_id: card }),
      };
      fetch("/api/addUser", requestOptions)
        .then((response) => {
          if (response.ok) {
            setLoadingSpinner(false);
            setShowSuccessMessage(true);
            setTimeout(() => {
              props.onHide();
              setCardID("");
              resetModal();
            }, 2000);
          } else if (response.status === 403) {
            console.log("Auth token bad");
            props.kick();
            throw new Error(response.statusText);
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
          setReadOnly(false);
          setLoadingSpinner(false);
          setShowErrorMessage(true);
        });
    }
  }

  React.useEffect(() => {
    if (scannerEnabled) {
      cardIdInput.current.value = "";
      cardIdInput.current.focus();
      resetModal();
      setCardID("");
    }
  }, [scannerEnabled]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <input
        className="scanner-input"
        ref={cardIdInput}
        onKeyPress={handleKeyPress}
        onBlur={() => setScannerEnabled(false)}
      />
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Short code</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. ab1234"
            readOnly={readOnly ? true : false}
            onKeyPress={handleKeyPress}
            ref={shortCode}
            isInvalid={shortCodeInvalid}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a short code.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Card ID</Form.Label>
          <Row>
            <Col xs="auto">
              <Button
                className="scanner-button"
                onClick={() => setScannerEnabled(true)}
                variant="primary"
                disabled={scannerEnabled || readOnly ? true : false}
              >
                {scannerEnabled ? "Scan card" : "Enable Scanner"}
              </Button>
            </Col>
            <Col>
              <Form.Control
                type="password"
                placeholder=""
                value={cardID}
                readOnly
                isInvalid={cardIDInvalid}
              />
              <Form.Control.Feedback type="invalid">
                Please add a card ID.
              </Form.Control.Feedback>
            </Col>
          </Row>
        </Form.Group>
      </Modal.Body>
      <AdminModalFooter
        loadingSpinner={loadingSpinner}
        showErrorMessage={showErrorMessage}
        showSuccessMessage={showSuccessMessage}
        readOnly={readOnly}
        onSubmit={onSubmit}
        onHide={props.onHide}
        cancel={"Cancel"}
        actionButton={"Add User"}
      />
    </Modal>
  );
}

function AdminModalFooter(props) {
  return (
    <Modal.Footer>
      {props.loadingSpinner ? (
        <Col xs="auto">
          <Spinner className="mra" animation="border" />
        </Col>
      ) : (
        <></>
      )}
      {props.showSuccessMessage ? (
        <Col xs="auto">
          <div className="mra success-message">Success</div>
        </Col>
      ) : (
        <></>
      )}
      {props.showErrorMessage ? (
        <Col xs="auto">
          <div className="mra error-message">Error</div>
        </Col>
      ) : (
        <></>
      )}
      <Button variant="secondary" onClick={props.onHide} className="mla">
        {props.cancel}
      </Button>
      <Button
        variant={props.actionButtonRed ? "danger" : "primary"}
        type="submit"
        onClick={() => props.onSubmit()}
        disabled={props.readOnly ? true : false}
      >
        {props.actionButton}
      </Button>
    </Modal.Footer>
  );
}

function Admin(props) {
  const [addUserModalShow, setAddUserModalShow] = React.useState(false);
  const [delUserModalShow, setDelUserModalShow] = React.useState(false);
  const [changePassModalShow, setChangePassModalShow] = React.useState(false);
  // const [checkUserModalShow, setCheckUserModalShow] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loginReadOnly, setLoginReadOnly] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [showPasswordSpinner, setShowPasswordSpinner] = React.useState(false);
  const [showKickedMessage, setShowKickedMessage] = React.useState(false);

  const loginPassword = React.useRef();

  function onLoginButton() {
    const password = loginPassword.current.value;
    setShowPasswordSpinner(true);
    setLoginReadOnly(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password }),
    };
    fetch("/api/login", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setShowPasswordSpinner(false);
        sessionStorage.setItem("token", data.token);
        setLoginReadOnly(false);
        setLoggedIn(true);
      })
      .catch((error) => {
        console.log(error);
        setShowPasswordSpinner(false);
        setLoginReadOnly(false);
        setPasswordError(true);
        setPasswordErrorMessage("Incorrect password, try again");
      });
  }

  function onLogoutButton() {
    sessionStorage.removeItem("token");
    setLoggedIn(false);
  }

  function onKickedOut() {
    sessionStorage.removeItem("token");
    setLoggedIn(false);
    setShowKickedMessage(true);
  }

  function handleLoginEnter(event) {
    setPasswordError(false);
    if (event.key === "Enter") {
      onLoginButton();
    }
  }

  React.useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <div>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="">AceX Admin</Navbar.Brand>
          {loggedIn ? (
            <Nav.Link onClick={() => onLogoutButton()}>Logout</Nav.Link>
          ) : (
            <></>
          )}
        </Container>
      </Navbar>
      {loggedIn ? (
        <Container>
          <h1>Welcome</h1>
          <Row className="justify-content-md-left mt50">
            <Col xs={6} md={4} xl={3}>
              <div
                onClick={() => setAddUserModalShow(true)}
                className="admin-card"
              >
                <h2 className="mta">Add user</h2>
              </div>
            </Col>
            <Col xs={6} md={4} xl={3}>
              <div
                onClick={() => setDelUserModalShow(true)}
                className="admin-card"
              >
                <h2 className="mta">Delete user</h2>
              </div>
            </Col>
            <Col xs={6} md={4} xl={3}>
              <div
                onClick={() => setChangePassModalShow(true)}
                className="admin-card"
              >
                <h2 className="mta">Change password</h2>
              </div>
            </Col>
          </Row>
          <AddUserModal
            show={addUserModalShow}
            onHide={() => setAddUserModalShow(false)}
            kick={() => onKickedOut()}
          />
          <DeleteUserModal
            show={delUserModalShow}
            onHide={() => setDelUserModalShow(false)}
            kick={() => onKickedOut()}
          />
          <ChangePasswordModal
            show={changePassModalShow}
            onHide={() => setChangePassModalShow(false)}
            kick={() => onKickedOut()}
          />
          {/* <CheckUserModal
            show={checkUserModalShow}
            onHide={() => setCheckUserModalShow(false)}
            kick={() => onKickedOut()}
          /> */}
        </Container>
      ) : (
        <Container>
          <h1>Please enter the admin password</h1>
          <Form.Group className="mt50 mb-3">
            {showKickedMessage ? (
              <div className="mb10 error-message">
                Session expired, please log in again
              </div>
            ) : (
              <> </>
            )}
            <Row>
              <Col xs="9" md="4">
                <Form.Control
                  type="password"
                  placeholder=""
                  readOnly={loginReadOnly ? true : false}
                  ref={loginPassword}
                  onKeyPress={handleLoginEnter}
                  isInvalid={passwordError}
                />
                <Form.Control.Feedback type="invalid">
                  {passwordErrorMessage}
                </Form.Control.Feedback>
              </Col>
              <Col xs="auto">
                <Button
                  onClick={() => onLoginButton(true)}
                  type="submit"
                  disabled={loginReadOnly ? true : false}
                >
                  Login
                </Button>
              </Col>
              {showPasswordSpinner ? (
                <Col xs="auto">
                  <Spinner animation="border" />
                </Col>
              ) : (
                <></>
              )}
            </Row>
          </Form.Group>
        </Container>
      )}
    </div>
  );
}

export default Admin;
