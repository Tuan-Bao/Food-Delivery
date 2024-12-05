import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Tạo context
export const StoreContext = createContext(null);

// Tạo provider component
export const StoreContextProvider = ({ children }) => {
  const [category, setCategory] = useState("None");
  const [menu, setMenu] = useState("home");
  const [cartItems, setCartItems] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [currState, setCurrState] = useState("Sign In");
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const [dataOrders, setDataOrders] = useState([]);
  const navigate = useNavigate();

  const url = "http://localhost:3000";

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId: itemId },
        { headers: { token: token } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    if (token) {
      await axios.delete(url + "/api/cart/remove", {
        headers: { token: token },
        data: { itemId: itemId }, // Truyền body qua `data`
      });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    const response = await axios.get(url + "/api/cart/get", {
      headers: { token: token },
    });
    setCartItems(response.data.cartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    category,
    setCategory,
    menu,
    setMenu,
    cartItems,
    addToCart,
    removeFromCart,
    showLogin,
    setShowLogin,
    currState,
    setCurrState,
    getTotalCartAmount,
    navigate,
    url,
    token,
    setToken,
    data,
    setData,
    dataOrders,
    setDataOrders,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
