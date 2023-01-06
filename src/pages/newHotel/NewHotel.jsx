import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useCallback } from "react";
import { toast } from 'react-toastify';
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import apis from "../../apis";
import { useLocation, useNavigate } from "react-router-dom";

const NewHotel = (props) => {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const hotelData = { ...state.data };

  const [info, setInfo] = useState(hotelData ? hotelData : {});
  const { data, loading, error } = useFetch("/rooms");

  const handleInputChange = useCallback((event) => {
    if (!event) return;

    let id = event.target ? event.target.id : event.id;
    let value = event.target ? event.target.value : event.value;
    let type = event.target ? event.target.type : null;

    if (!id) return;

    if (type === 'checkbox') {
      value = event.target.checked;
    } else if (type === 'file' && event.target?.multiple) {
      value = event.target.files;
    } else if (type === 'file') {
      value = event.target.files[0];
    } else if (type === 'select-multiple') {
      value = Array.from(
        event.target.selectedOptions,
        (option) => option.value
      );
    }

    setInfo({
      ...info,
      [id]: value
    });

  }, [info]);

  const handleClick = async (e) => {
    e.preventDefault();
    const formData = { ...info };

    try {
      var list = null;

      if (formData.file) {
        list = await Promise.all(
          Object.values(formData.file).map(async (file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", process.env.REACT_APP_MEDIA_PRESET);
            const uploadRes = await axios.post(
              `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_MEDIA_CLOUD_NAME}/image/upload`,
              data
            );

            const { url } = uploadRes.data;
            return url;
          })
        );
        delete formData.file;
      } else if (!formData.file && hotelData) {
        list = formData.photos;
      }

      const newhotel = {
        ...formData,
        photos: list,
      };

      let res = null;

      if (hotelData)
        res = await apis().put("/hotels/" + hotelData._id, newhotel);
      else
        res = await apis().post("/hotels", newhotel);

      if (res) {
        toast.success("Data added!", {
          position: 'top-right',
        });
        navigate('/hotels');
      }

    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message, {
          position: 'top-right',
        });
        return;
      }

      toast.error("Something went wrong!", {
        position: 'top-right',
      });
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Product</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                info?.file
                  ? URL.createObjectURL(info?.file[0])
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleClick}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  required={!hotelData ? true : false}
                  multiple
                  onChange={handleInputChange}
                  style={{ display: "none" }}
                />
              </div>
              <div className="formInput">
                <label>Type</label>
                <select id="type" onChange={handleInputChange} required value={info['type']}>
                  <option value=''>Select an option</option>
                  <option value='Hotel'>Hotel</option>
                  <option value='2 Star Hotel'>2 Star Hotel</option>
                  <option value='3 Star Hotel'>3 Star Hotel</option>
                  <option value='4 Star Hotel'>4 Star Hotel</option>
                  <option value='5 Star Hotel'>5 Star Hotel</option>
                  <option value='7 Star Hotel'>7 Star Hotel</option>
                </select>
              </div>
              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleInputChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    required={input.required}
                    value={info[input.id]}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Featured</label>
                <select id="featured" onChange={handleInputChange} value={info['featured']}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div className="selectRooms">
                <label>Rooms</label>
                <select id="rooms" multiple onChange={handleInputChange} value={info['rooms']}>
                  {loading
                    ? "loading"
                    : data &&
                    data.map((room) => (
                      <option key={room._id} value={room._id}>
                        {room.title}
                      </option>
                    ))}
                </select>
              </div>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;
