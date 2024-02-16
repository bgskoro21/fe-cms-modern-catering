import React from "react";
import { Modal, Button } from "react-bootstrap";
import LoadingComponent from "../LoadingComponent/LoadingComponent";

const ModalComponent = (props) => {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        {props.loading ? (
          <LoadingComponent />
        ) : (
          <Button variant="primary" onClick={props.handleSubmit}>
            Save Changes
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
