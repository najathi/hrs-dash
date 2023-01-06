import "./single.scss";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import moment from "moment";

const Single = (props) => {

  const { state, pathname } = useLocation();

  const path = pathname.split("/")[1];

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const data = { ...state.data };

  if (data.hasOwnProperty("__v"))
    delete data["__v"];

  if (data.hasOwnProperty("password"))
    delete data["password"];

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <Link
              to={`/${path}/${data._id}/edit`}
              state={{ data: data }}
              className="editButton"
            >
              Edit
            </Link>
            <h1 className="title text-dark">{capitalizeFirstLetter(path)} Details</h1>
            <div className="item">

              <div className="details">
                {Object.keys(data).map((key, idx) => {

                  if (key === "photos" && data["photos"]) {
                    return (
                      <div className="detailItem">
                        <span className="itemKey">{key}:</span>
                        <div className="itemValueImage">
                          {state.data[key].map((item, idx2) => (
                            <img
                              key={idx2}
                              src={item}
                              alt=""
                              className="itemImg"
                            />
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (key === "createdAt" || key === "updatedAt") {
                    return (
                      <div className="detailItem" key={idx}>
                        <span className="itemKey">{key}:</span>
                        <span className="itemValue">{moment(data[key]).format('llll')}</span>
                      </div>
                    );
                  }

                  if (typeof data[key] === "boolean") {
                    <div className="detailItem" key={idx}>
                      <span className="itemKey">{key}:</span>
                      <span className="itemValue">{data[key] ? "Tick" : "Cross"}</span>
                    </div>
                  }

                  return (
                    <div className="detailItem" key={idx}>
                      <span className="itemKey">{key}:</span>
                      <span className="itemValue">{data[key]}</span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
