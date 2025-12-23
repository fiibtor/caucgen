import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import { useState } from "react";
import  { createCaucasian }  from "./TextGen";
import { useEffect } from "react";

function getFeeling() {
    const flip = Math.round(Math.random());
    if (flip == 1){
        return "CAUCASIAN"
    } else {
        return "PEACHY"
    }
}

const caucOrPeach =  getFeeling();

function Index() {
    const [labelText, setLabelText] = useState("")
    const [speed, setSpeed] = useState(7);
    const [delay, setDelay] = useState(2);
    const [skew, setSkew] = useState(-0.25);
    const [kerning, setKerning] = useState(0);
    const [stroke, setStroke] = useState(4);
    const [imageSrc, setImageSrc] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NgAAIAAAUAAR4f7BQAAAAASUVORK5CYII=");

    useEffect(() => {
        document.title = caucOrPeach + " MAKER!";
    }, []);

    async function handleSubmit (e: React.FormEvent){
      e.preventDefault();
      if (labelText && labelText.length > 0) {
        const sanitizeLabelText = labelText.replaceAll('\\','\\\\')
        setImageSrc(await createCaucasian(sanitizeLabelText,skew,kerning,speed,delay,stroke));
      }
    }

    return (
    <>
        <div className={"vh-100 vw-100 d-flex flex-column"}>
            <div className={"title"}>
                <h1 className={caucOrPeach}>{caucOrPeach} MAKER!</h1>
            </div>
            <div className={"subtitle"}>
                <p className={"subtitle"}>by <a href={"https://fiibtor.tumblr.com"}>fiibtor</a></p>
            </div>
            <div >
                <Container fluid={"sm"} >
                    <div className={"pb-3"}></div>
                    <Form onSubmit={handleSubmit} className={"px-3 pb-3"}>
                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label >Text</Form.Label>
                                <Form.Control placeholder={caucOrPeach + "!"} value={labelText} onChange={(e) => setLabelText(e.target.value)}></Form.Control>
                            </Form.Group>
                        </Row>
                        <Row className={"mt-3"}>
                            <Form.Group as={Col}>
                                <Form.Label >Speed</Form.Label>
                                <Form.Range min={1} max={10} value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))}></Form.Range>
                                <Form.Label>{speed}</Form.Label>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Delay</Form.Label>
                                <Form.Range min={2} max={10} value={delay} step={0.1} onChange={(e) => setDelay(parseFloat(e.target.value))}></Form.Range>
                                <Form.Label>{delay}</Form.Label>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Accordion>
                                <Accordion.Item eventKey={"0"}>
                                    <Accordion.Header>Text Settings</Accordion.Header>
                                    <Accordion.Body>
                                        <Form.Group as={Col}>
                                            <Form.Label>Skew</Form.Label>
                                            <Form.Range min={-1} max={1} step={0.05} value={skew} onChange={(e) => setSkew(parseFloat(e.target.value))}></Form.Range>
                                            <Form.Label>{skew}</Form.Label>
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Kerning</Form.Label>
                                            <Form.Range min={-5} max={5} value={kerning} onChange={(e) => setKerning(parseInt(e.target.value))}></Form.Range>
                                            <Form.Label>{kerning}</Form.Label>
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Stroke Width</Form.Label>
                                            <Form.Range min={0} max={10} value={stroke} onChange={(e) => setStroke(parseInt(e.target.value))}></Form.Range>
                                            <Form.Label>{stroke}</Form.Label>
                                        </Form.Group>

                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Row>
                        <Row>
                            <Form.Group as={Col} className={"mt-4 d-flex justify-content-center"}>
                                <button type="submit">
                                CREATE GIF!
                                </button>
                            </Form.Group>
                        </Row>
                    </Form>
                    <Row className="justify-content-center">
                            <img src={imageSrc} className={"outGif align-self-center"}></img>
                    </Row>
                </Container>
            </div>
            <div className={"align-self-stretch align-content-end flex-grow-1"}>
                <p style={{textAlign: "center"}}>Special thanks to Speherh for the TYPOSTUCK font!<br />
                    <a href="https://fontstruct.com/fontstructions/show/1179225">"TYPOSTUCK"</a> by <a href="https://fontstruct.com/fontstructors/1247932/speherh">"Speherh"</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a></p>
                <div className={"bottomImage"}>
                    <img src="images/unc-n-newgem.png"/>
                </div>
            </div>
        </div>
    </>
    )
}

export default Index
