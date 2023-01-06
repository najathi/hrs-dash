import "./datatable.scss";
import { toast } from 'react-toastify';
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import apis from "../../apis";


const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const [list, setList] = useState();

  const { data, loading, error } = useFetch(`/${path}`);

  useEffect(() => {
    setList(data);
  }, [data]);  // whenever data changes update list

  const handleDelete = async (id) => {
    try {
      const res = await apis().delete(`/${path}/${id}`);
      setList(list.filter((item) => item._id !== id));
      toast.success(res.data, {
        position: "top-right",
      });
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

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/${path}/${params.row._id}`}
              state={{ data: params.row }}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {capitalizeFirstLetter(path)}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>
      <DataGrid                                                   // material UI DataGrid
        className="datagrid"
        rows={data}                                               // passing data
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={row => row._id}
        disableSelectionOnClick={true}
      />
    </div>
  );
};

export default Datatable;
