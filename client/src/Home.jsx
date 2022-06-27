import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

var isLoggedIn = false;
var username = "John Doe";

const LogInButton = (
  <div className="login-button">
    <button>Sign In</button>
  </div>
);
const LogInProfile = <div className="login-profile">Welcome, {username}</div>;

function Home() {
  document.title = "Home";
  return (
    <>
      <Container className="banner" fluid>
        <div className="title">Photos</div>
        {isLoggedIn ? LogInProfile : LogInButton}
      </Container>
      <Container className="container" fluid>
        <Link to="/timeline">
          <button
            onClick={() => {
              document.title = "Timeline";
            }}
          >
            Go
          </button>
        </Link>
      </Container>
    </>
  );
}

export default Home;
