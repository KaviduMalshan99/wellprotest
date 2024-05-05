import React from "react";
import { Link } from "react-router-dom";
import "./registeruser.css";

const Reg = () => {
  


  return (
    <html>
      <head>
        <link rel="stylesheet" href="Register.css" />
      </head>
      <body>
        <div className="regmh">REGISTRATION</div>
        <div className="regpath">
          Home - REGISTER
        </div>
        <center>
          <div className="rgfcon">
            <div className="regf">
              ENTER DETAILS
              <br />
              <input
                type="text"
                className="reginp"
                placeholder="FIRST NAME:"
                required
              />
              <input
                type="text"
                className="reginp"
                placeholder="LAST NAME:"
                required
              />
              <input
                type="email"
                className="reginp"
                placeholder="EMAIL:"
                required
              />
              <input
                type="text"
                className="reginp"
                placeholder="CONTACT NO:"
                required
              />
              <input
                type="password"
                className="reginp"
                placeholder="PASSWORD:"
                required
              />
              <input
                type="password"
                className="reginp"
                placeholder="RE-PASSWORD:"
                required
              />
              <br />
              <br />
              <div className="regacc">
                <input type="checkbox" required /> Accept privacy & Policy
              </div>
              <center>
                <button className="regbtn" onClick={handleSubmit}>
                  REGISTER
                </button>
              </center>

              <div className="reglogtxt">
                Already have an Account? <Link to="/">Log In</Link>
              </div>
            </div>
            <div className="regopttxt">or</div>
          </div>
        </center>
      </body>
    </html>
  );
};

export default Reg;
