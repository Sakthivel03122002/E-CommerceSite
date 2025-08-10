import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CartInformation from "./CartInformation";

function CartUi() {
  const [productList, setProductList] = useState([]);
  const [productObject, setProductObject] = useState({});
  const [initialFlag, setInitialFlag] = useState(false);
  const navigate = useNavigate();

  const fetchData = () => {
    let cart = localStorage.getItem("cartInformation")
      ? localStorage.getItem("cartInformation")
      : "{}";
    let getcart = JSON.parse(cart);
    let objectList = Object.values(getcart);
    setProductObject(getcart);
    setProductList(objectList);
    setInitialFlag(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (initialFlag) {
      localStorage.setItem("cartInformation", JSON.stringify(productObject));
    }
  }, [initialFlag, productObject]); // Changed dependency from productList to productObject

  const homebtn = () => {
    navigate("/");
  };

  const clearCart = () => {
    localStorage.removeItem("cartInformation");
    setProductObject({});
    setProductList([]);
  };

  const addToCart = (id) => {
    let productInformation = { ...productObject[id] };
    productInformation.quantity = productInformation.quantity + 1;

    const updatedProductObject = {
      ...productObject,
      [id]: productInformation,
    };

    setProductObject(updatedProductObject);
    setProductList(Object.values(updatedProductObject));
  };

  const removeFromCart = (id) => {
    const updatedProductObject = { ...productObject };
    let productInformation = { ...updatedProductObject[id] };
    if (productInformation.quantity === 1) {
      delete updatedProductObject[id];
    } else {
      productInformation.quantity = productInformation.quantity - 1;
      updatedProductObject[id] = productInformation;
    }
    setProductObject(updatedProductObject);
    setProductList(Object.values(updatedProductObject));
  };

  const cartfinaltotal = productList.reduce(
    (acc, currentValue) => {
      let quantity = acc.quantity + currentValue.quantity;
      let totalPrice =
        acc.totalPrice + currentValue.quantity * currentValue.price;
      return { quantity, totalPrice };
    },
    { quantity: 0, totalPrice: 0 }
  );

  return (
    <>
      <div
        className="cart-main"
        style={{
          backgroundColor: "black",
          minHeight: "100vh",
          maxWidth: "100vw",
        }}
      >
        <div
          className="btn-item"
          style={{ position: "fixed", paddingTop: "10px" }}
        >
          <button className="home-btn" onClick={homebtn}>
            Continue Shopping
          </button>

          <button className="home-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
        <div
          className="cart-align"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            paddingTop: "10px",
          }}
        >
          <div
            style={{
              padding: "50px",
            }}
          >
            {productList.map((value, index) => (
              <div key={index}>
                <CartInformation
                  value={value}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  cartfinaltotal={cartfinaltotal}
                />
              </div>
            ))}
          </div>

          <div className="Total-Price">
            <h1>Total Price List</h1>
            <br />
            <h3>Total items Count = {cartfinaltotal.quantity}</h3>
            <br />
            <h3> Total Amount= {cartfinaltotal.totalPrice}$</h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartUi;
