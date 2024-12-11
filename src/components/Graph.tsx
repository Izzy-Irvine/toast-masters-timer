import { FormEvent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';
import GaugeComponent from 'react-gauge-component';

function formatTime(totalTimeSeconds: number) {
  let minutes = Math.floor(totalTimeSeconds / 60)
  let seconds = totalTimeSeconds % 60;

  if (minutes > 0) {
    return minutes + 'm ' + seconds + 's';
  } else if (seconds > 0) {
    return seconds + 's';
  }
  return '0';
}

type GraphProps = { handleDelete: () => void;}

const Graph: React.FC<GraphProps> = ({ handleDelete }) => {
    const [green, setGreen] = useState(60);
    const [yellow, setYellow] = useState(90);
    const [red, setRed] = useState(120);
    const [max, setMax] = useState(150);
    const [actual, setActual] = useState(0);
    const [name, setName] = useState("Press 'Edit' to change name");
    const [showEditModal, setShowEditModal] = useState(false);
    const [timerActive, setTimerActive] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      let form = new FormData(event.currentTarget)

      let newMax = max;
      let newRed = red;
      let newYellow = yellow;
      let newGreen = green;
      
      let name = form.get('name')
      if (typeof name == "string") {
        setName(name);
      }

      let maxMinutes = form.get('maxMinutes')
      let maxSeconds = form.get('maxSeconds')
      if (typeof maxMinutes == "string" && typeof maxSeconds == "string") {
        newMax = Number(maxMinutes) * 60 + Number(maxSeconds);
      }

      let redMinutes = form.get('redMinutes')
      let redSeconds = form.get('redSeconds')
      if (typeof redMinutes == "string" && typeof redSeconds == "string") {
        let num = Number(redMinutes) * 60 + Number(redSeconds);
        if (num < newMax) {
          newRed = num;
        }
      }

      let yellowMinutes = form.get('yellowMinutes')
      let yellowSeconds = form.get('yellowSeconds')
      if (typeof yellowMinutes == "string" && typeof yellowSeconds == "string") {
        let num = Number(yellowMinutes) * 60 + Number(yellowSeconds);
        if (num < newRed) {
          newYellow = num;
        }
      }


      let greenMinutes = form.get('greenMinutes')
      let greenSeconds = form.get('greenSeconds')
      if (typeof greenMinutes == "string" && typeof greenSeconds == "string") {
        let num = Number(greenMinutes) * 60 + Number(greenSeconds);
        if (num < newYellow) {
          newGreen = num;
        }
      }

      setMax(newMax);
      setRed(newRed);
      setYellow(newYellow);
      setGreen(newGreen);

      setActual(Number(form.get('actualMinutes')) * 60 + Number(form.get('actualSeconds')));

      setShowEditModal(false)
    }

    useEffect(() => {
      if (timerActive) {
        const interval = setInterval(() => {
          setActual(actual + 1)
        }, 1000)
        return () => clearInterval(interval)
      }

    }, [timerActive, actual])

    return <Col>
        <h1 className="text-center">{name}</h1>
        <GaugeComponent
        arc={{
          subArcs: [
            {
              limit: green,
              color: '#DDD',
              showTick: true
            },
            {
              limit: yellow,
              color: '#28a745',
              showTick: true
            },
            {
              limit: red,
              color: '#ffc107',
              showTick: true
            },
            {
              limit: max,
              color: '#dc3545',
              showTick: true
            },
          ]
        }}
        type="radial"
        value={actual}
        maxValue={max}
        marginInPercent={{ top: 0.07, bottom: 0.00, left: 0.2, right: 0.2 }}
        labels={{
            valueLabel: {
                formatTextValue: value => formatTime(value),
                matchColorWithArc: true
            },
            tickLabels: {
                defaultTickValueConfig: {
                    formatTextValue: value => formatTime(value),
                    style: {
                        fontSize: 20
                    }
                }
            }
        }}
      />
      <center>
        <ButtonGroup>
          <Button variant='secondary' onClick={() => setShowEditModal(true)}>
              Edit
          </Button>
          <Button variant={timerActive ? "info" : 'secondary'} onClick={() => setTimerActive(!timerActive)}>
              {timerActive ? "Stop" : "Start"} Timer
          </Button>
        </ButtonGroup>
      </center>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit {name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" type="text" defaultValue={name} required/>
            </Form.Group>
            <Form.Group controlId="forGreenTime" className="mb-3">
              <Form.Label>Time till green</Form.Label>
              <Row>
                <Col>
                  <FloatingLabel label="minutes">
                    <Form.Control name="greenMinutes" type="number" defaultValue={Math.floor(green / 60)} min={0} required/>
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel label="seconds">
                    <Form.Control name="greenSeconds" type="number" defaultValue={green % 60} max={59} min={0} required/>
                  </FloatingLabel>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group controlId="forYellowTime" className="mb-3">
              <Form.Label>Time till yellow</Form.Label>
              <Row>
                <Col>
                  <FloatingLabel label="minutes">
                    <Form.Control name="yellowMinutes" type="number" defaultValue={Math.floor(yellow / 60)} min={0} required/>
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel label="seconds">
                    <Form.Control name="yellowSeconds" type="number" defaultValue={yellow % 60} max={59} min={0} required/>
                  </FloatingLabel>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group controlId="forRedTime" className="mb-3">
              <Form.Label>Time till red</Form.Label>
              <Row>
                <Col>
                  <FloatingLabel label="minutes">
                    <Form.Control name="redMinutes" type="number" defaultValue={Math.floor(red / 60)} min={0} required/>
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel label="seconds">
                    <Form.Control name="redSeconds" type="number" defaultValue={red % 60} max={59} min={0} required/>
                  </FloatingLabel>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group controlId="forMaxTime" className="mb-3">
              <Form.Label>Max time</Form.Label>
              <Row>
                <Col>
                  <FloatingLabel label="minutes">
                    <Form.Control name="maxMinutes" type="number" defaultValue={Math.floor(max / 60)} min={0} required/>
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel label="seconds">
                    <Form.Control name="maxSeconds" type="number" defaultValue={max % 60} max={59} min={0} required/>
                  </FloatingLabel>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group controlId="forActualTime" className="mb-3">
              <Form.Label>Actual time</Form.Label>
              <Row>
                <Col>
                  <FloatingLabel label="minutes">
                    <Form.Control name="actualMinutes" type="number" defaultValue={Math.floor(actual / 60)} min={0} required/>
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel label="seconds">
                    <Form.Control name="actualSeconds" type="number" defaultValue={actual % 60} max={59} min={0} required/>
                  </FloatingLabel>
                </Col>
              </Row>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="danger"
              onClick={handleDelete}>
              Delete
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Col>
}

export default Graph;
