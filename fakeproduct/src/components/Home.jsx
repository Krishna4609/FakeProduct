import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  const handleStart = (e) => {
    navigate("/main");
  };
  return (
    <>
      <div className="main-body">
        <div className="pro-nav">
          <h1>Fake Product Detection System</h1>
        </div>
        <div className="container">
          <div className="main">
            <div>
              <button className="startbtn no-hover" onClick={handleStart}>
                Let's get started &rarr;{" "}
              </button>
            </div>
            <div className="about">
              <p>
                Our mission is to eradicate the proliferation of counterfeit
                products by providing a reliable and efficient verification
                system. We strive to create a marketplace where authenticity
                prevails, fostering trust and consumer confidence.
              </p>
              Join us in our commitment to a counterfeit-free future!
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
