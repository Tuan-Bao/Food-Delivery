import { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    // console.log(response.data);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error(response.data.message);
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.delete(`${url}/api/food/${foodId}`);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      await fetchList();
    } catch (error) {
      console.error("Error removing food:", error);
      toast.error("An error occurred while removing the food.");
    }
  };

  const showEditPopup = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: null, // Không gửi hình ảnh hiện tại
    });
    setPopupVisible(true);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const updateFood = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("category", formData.category);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await axios.put(
        `${url}/api/food/${editItem._id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
        setPopupVisible(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating food:", error);
      toast.error("An error occurred while updating the food.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <div className="dropdown">
                <button className="dropdown-btn">⁝</button>
                <div className="dropdown-content">
                  <p onClick={() => removeFood(item._id)} className="cursor">
                    <FontAwesomeIcon icon={faCircleXmark} size="1x" /> Remove
                  </p>
                  <p onClick={() => showEditPopup(item)} className="cursor">
                    <FontAwesomeIcon icon={faPenToSquare} size="1x" /> Edit
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pop-up for Editing */}
      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h3>Edit Item</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Name"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Description"
            ></textarea>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              placeholder="Price"
            />
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              placeholder="Category"
            />
            <input type="file" name="image" onChange={handleFormChange} />
            <button onClick={updateFood}>Save</button>
            <button onClick={() => setPopupVisible(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
