import { useEffect, useState } from 'react';
import Graph from './components/Graph'
import { Button, Col, Row } from 'react-bootstrap';

function App() {
  let [graphs, setGraphs] = useState([0]);
  let [nextGraphId, setNextGraphId] = useState(1);

  useEffect(() => { document.title = "Izzy's Toast Masters timer"}, []);

  return (
  <div className="container" >
    <Row xs={3}>
      {graphs.map((graph) => <Graph key={graph} handleDelete={() => {
        let newGraphs = [...graphs];
        newGraphs.splice(newGraphs.indexOf(graph), 1);
        setGraphs(newGraphs);
        }} />)}
      <Col className='align-content-center'>
        <Button 
        variant="primary" 
        onClick={() => {
          setGraphs([ ...graphs, nextGraphId]);
          setNextGraphId(nextGraphId + 1);
        }}
        >
          +
        </Button>
      </Col>
    </Row>
  </div>
  )
}

export default App;
