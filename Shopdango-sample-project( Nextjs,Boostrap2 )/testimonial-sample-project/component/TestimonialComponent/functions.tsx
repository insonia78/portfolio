import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";

export const setUpTestimonialsCards:any = ( _testimonials:[]) =>{

   return  _testimonials.map((e: any, i: any) => {
        let count: number = 0;
        let data: any = (
            <>
                <Row key={i} className="justify-content-md-center">
                    {
                        _testimonials.slice(0, 2).map((element: any, index: any) => (
                            <Col key={`${index}a`}>
                                <Card style={
                                    { width: "100%", 
                                    height: "30.9375em", 
                                    backgroundColor: "rgb(230,230,230",
                                    

                                    }
                                    }>
                                    <Card.Body style={{ textAlign: "center",fontSize:"1.5rem" }}>
                                        <Card.Text >{`"${element.testimonial}"`}</Card.Text>
                                        <Card.Title style={{ fontSize:"1.6rem" }} >- {element.name}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
                <br />
            </>
        );
        _testimonials.splice(0, 2);
        return data;
    });



}