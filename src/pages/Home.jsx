import { Container, Card, Button, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import logo from "../assets/images/logo.png";

import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  return (
    // <div className="pb-5 min-vh-100 d-flex flex-row align-items-center">
    <div className="pb-5 h-100 d-flex align-items-center justify-content-center">
      {/* <div className="pt-5"> */}
      <Container className="d-flex justify-content-center">
        <Card className="p-5 d-flex flex-column align-items-center hero-card w-80">
          <p className="text-center mb-4">
            <Image src={logo} />
          </p>
          <h1 className="text-center mb-4">
            Welcome to DSN WBMS
            <br />
            [Weighbridge Management System]
          </h1>

          <div className="d-flex">
            <LinkContainer to="/signin">
              <Button variant="primary" className="me-3">
                Sign In
              </Button>
            </LinkContainer>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Home;
