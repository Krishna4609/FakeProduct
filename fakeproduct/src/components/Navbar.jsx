import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
function Navbar() {
  const navigate = useNavigate()
  return (
    <div className="Nav-Bar">
      {/* <div className="Nav-left">
        <div className="sign-toggler"></div>
        <div>Login</div>
        <div>SignUp</div>
      </div> */}
      <div className="pro-nav">
        <div className="proj-title">Fake Product Detection System</div>
      </div>

      <div className="Nav-right">
        <div onClick={()=>{navigate("/")}}>Home</div>
        {/* <div>About</div> */}
        {/* <div>How It Works</div> */}
      </div>
    </div>
  );
}

export default Navbar;
