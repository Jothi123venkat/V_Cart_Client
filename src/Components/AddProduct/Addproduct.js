import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import { Button, Container, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Delete, Update } from "@mui/icons-material";
import CreateIcon from "@mui/icons-material/Create";

const Addproduct = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const [ImageUrl, setImageUrl] = useState();
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  let logoselecetdFile = "";

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const [open2, setOpen2] = React.useState(false);
  const [fullWidth2, setFullWidth2] = React.useState(true);
  const [maxWidth2, setMaxWidth2] = React.useState("lg");

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const onsubmit = (data) => {
    console.log(data);
    axios
      .post("http://localhost:5000/Addproduct", data)
      .then((result) => {
        console.log(result.data);
        handleClose();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getapi();
  }, []);

  const getapi = () => {
    axios
      .get("http://localhost:5000/", data)
      .then((result) => {
        console.log(result.data);
        setData(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleImageUpload = (event) => {
    if (event !== null) {
      if (event.target === undefined) {
        logoselecetdFile = event;
      } else {
        logoselecetdFile = event.target.files[0];
      }
      if (logoselecetdFile) {
        var reader = new FileReader();
        var imagetype = logoselecetdFile.type;
        var imagedatatype = imagetype.split("/");
        var img_crt_type = imagedatatype[1];
        if (
          img_crt_type === "jpeg" ||
          img_crt_type === "jpg" ||
          img_crt_type === "png"
        ) {
          var fileValue = logoselecetdFile;
          reader.readAsDataURL(logoselecetdFile);
          reader.onload = () => {
            var logourl1 = reader.result;
            var spl = logourl1.split(",");
            var ImageValue = spl[1];
            var img_name = fileValue.name;
            setValue("imageName", img_name);
            setValue("ImageURL", logourl1);

            // Log the image URL here
            // console.log("Uploaded Image URL:", logourl1);
          };
        }
      }
    }
  };

  const handledelte = (id) => {
    axios
      .delete(`http://localhost:5000/deleteproduct/${id}`)
      .then(() => {
        console.log("deleted");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [updateid, setUpdateid] = useState("");
  const handleupdate = async (id, data) => {
    handleClickOpen2();
    axios
      .get(await `http://localhost:5000/getuser/${id}`)
      .then((result) => {
        setSelectedProduct(result.data);
        setValue("updateproductname", result.data.productname);
        setValue("updateproductDescription", result.data.productdescription);
        setValue("updateprice", result.data.price);
      })
      .catch((err) => {
        console.log(err);
      });
  };

 
  const onsubmitUpdate = (data) => {
    console.log(data, "updatedata");
    axios
      .put(`http://localhost:5000/updateuser/${selectedProduct._id}`, data)
      .then((result) => {
        console.log(result.data);
        handleClose2();
        getapi();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   const getapi = async()=>{
  //     axios.get(`localhost:5000/getuser/${id}`)
  //   }
  // }, [])

  return (
    <div>
      <div className="d-flex justify-content-end mt-3 p-3">
        <Button variant="contained" onClick={handleClickOpen}>
          Add Product
        </Button>
      </div>

      {/* table mui */}

      <Container className=" mt-3 ">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>NO</TableCell>
                <TableCell>ProductName</TableCell>
                <TableCell>ProductDescription</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>ProductImage</TableCell>
                <TableCell>Delete</TableCell>
                <TableCell>Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{row.productname}</TableCell>
                  <TableCell>{row.productdescription}</TableCell>
                  <TableCell>{row.price}</TableCell>

                  <TableCell>
                    <img
                      src={row.ImageURL}
                      alt="img"
                      style={{ width: "100px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Delete onClick={() => handledelte(row._id)} />
                  </TableCell>
                  <TableCell>
                    <CreateIcon onClick={() => handleupdate(row._id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <div className="dialog additemdialog">
        <Dialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={open}
          onClose={handleClose}
        >
          <DialogTitle className="text-center">Product Upload</DialogTitle>
          <DialogContent>
            <div className="mt-4">
              <form onSubmit={handleSubmit(onsubmit)}>
                <Controller
                  control={control}
                  name="productname"
                  defaultValue=""
                  rules={{
                    required: "ProductName is required",
                    maxLength: {
                      value: 20,
                      message: "only 20 letters are allowed",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        label="ProductName"
                        helperText={
                          errors.productname && (
                            <p className="text-danger">
                              {errors.productname.message}
                            </p>
                          )
                        }
                        fullWidth
                      />
                    </>
                  )}
                />

                <div className="mt-3">
                  <Controller
                    control={control}
                    name="productdescription"
                    defaultValue=""
                    rules={{
                      required: "ProductDescription is required",
                      maxLength: {
                        value: 40,
                        message: "only 20 letters are allowed",
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <TextField
                          {...field}
                          label="productdescription"
                          helperText={
                            errors.productdescription && (
                              <p className="text-danger">
                                {errors.productdescription.message}
                              </p>
                            )
                          }
                          fullWidth
                        />
                      </>
                    )}
                  />
                </div>

                <div className="mt-3">
                  <Controller
                    control={control}
                    name="price"
                    defaultValue=""
                    rules={{
                      required: "price is required",
                      maxLength: {
                        value: 10,
                        message: "only 10 letters are allowed",
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <TextField
                          {...field}
                          type="number"
                          label="Price of the product"
                          fullWidth
                          helperText={
                            errors.price && (
                              <p className="text-danger">
                                {errors.price.message}
                              </p>
                            )
                          }
                        />
                      </>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <Controller
                    control={control}
                    name="ImageURL"
                    defaultValue=""
                    rules={{
                      required: "Product Image is required",
                    }}
                    render={({ field }) => (
                      <>
                        <label htmlFor="Upload a image"></label>
                        <input
                          type="file"
                          onChange={(e) => handleImageUpload(e)}
                          helperText={errors}
                        />
                      </>
                    )}
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="updateItemdialog">
        <Dialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={open2}
          onClose={handleClose2}
        >
          <DialogTitle className=" d-flex justify-content-center">
            Update Items
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onsubmitUpdate)}>
              <div className=" mt-3">
                <TextField
                  label="productName"
                  fullWidth
                  {...register("updateproductname")}
                />
              </div>
              <div className=" mt-3">
                <TextField
                  label="productDescription"
                  fullWidth
                  {...register("updateproductDescription")}
                />
              </div>
              <div className=" mt-3">
                <TextField
                  TextField
                  label="Price"
                  fullWidth
                  {...register("updateprice")}
                />
              </div>
              <Button type="submit">submit</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Addproduct;
