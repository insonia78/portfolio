import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Card, CardImg } from "react-bootstrap";

export const setUpCards: any = ( pagination:any, _testimonials: []) => {
    
    const {paginationStart = 0 , paginationEnd = 5 } = pagination
    
    return (<Row className="justify-content-md-center" >

        {
            _testimonials.slice( paginationStart , paginationEnd ).map((element: any, i: any) =>

                <Col key={`${i}_testimonials`}>
                    <Card 
                    className="square border border-2"
                    style={
                        {
                            border:"2px,solid black",
                            paddingTop:'0.5rem',
                            paddingBottom:'0.5rem',
                            width: "100%",
                            height: "auto",
                            backgroundColor: "rgb(230,230,230)",
                            marginBottom: "1rem"

                        }
                    }>
                        <Card.Body style={{ textAlign: "center", fontSize: "1.5rem" }}>
                        <Card.Text >{`NAME:"${element.name}"`}</Card.Text>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexFlow:"wrap",
                                width: "100%",
                                height: "auto",
                                backgroundColor: "white"
                            }}>
                             
                                
                                {
                                    element.images.map((d: any,i:any) => {

                                        return <Card.Img 
                                            key={`${i}images`}
                                            style={{
                                            width: "10rem",
                                            height: "10rem",
                                            marginRight: "1rem"
                                        }}
                                            src={`${d.url}`} />
                                    })
                                }
                            </div>
                            <Card.Text >{`PRICE: $ ${element.price}`}</Card.Text>
                            <Card.Text >{`DESCRIPTION:`}</Card.Text>
                            <Card.Title style={{ fontSize: "1.6rem" }} >- {element.description} -</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
            )
        }

    </Row>


    );

}



