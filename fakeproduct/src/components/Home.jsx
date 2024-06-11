import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import Nav from "./Navbar";
function Home() {
  const navigate = useNavigate();

  function handleUsers(user) {
    if(user === 0 ){
        navigate('/login/Manufacturer')
    }else if(user === 1){
        navigate('/login/Supplier')
    }
    else if(user === 2){
        navigate('/customer')
    }
  };

  return (
    <>
      <div className="main-body">
        <Nav />
        <div className="container">
          <div className="main">
            <div className="intro">
              <p>
              Our mission is to eradicate the proliferation of counterfeit
              products by providing a reliable and efficient verification
              system. We strive to create a marketplace where authenticity
              prevails, fostering trust and consumer confidence. Join us in our
              commitment to a counterfeit-free future!</p>
            </div>
            <div className="users">
              <div className="manu" onClick={()=>handleUsers(0)}>Manufacturer</div>
              <div className="sup" onClick={()=>handleUsers(1)}>Supplier</div>
              <div className="cus"  onClick={()=>handleUsers(2)}>Customer</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
