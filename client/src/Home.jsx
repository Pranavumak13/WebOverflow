import React, { useContext } from "react";
import "./Home.css";
import { AdminContext } from "./App";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

var isLoggedIn = false;
var username = "John Doe";

const LogInButton = (
  <div className="login-button">
    <Link to="auth">
      <button>Sign In</button>
    </Link>
  </div>
);
const LogInProfile = (
  <div className="login-profile">
    Welcome, {username}
    <Link to="/admin/upload">
      <button>Upload Images</button>
    </Link>
  </div>
);

function Home() {
  const { isAdminLoggedIn } = useContext(AdminContext);

  return (
    <>
      <Container className="banner" fluid>
        <div className="title">Photos</div>
        {isAdminLoggedIn ? LogInProfile : LogInButton}
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
