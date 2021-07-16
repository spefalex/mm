import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import EditOutlined from "@material-ui/icons/EditOutlined";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import React, { useEffect, useState } from "react";
// components
import PageTitle from "../../components/PageTitle";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const api = axios.create({
  baseURL: process.env.REACT_APP_REST_API_LOCATION,
});

var columns = [
  { title: "Id", id: "id", hidden: true },
  { title: "Designation", id: "designation" },
  { title: "Description", id: "description" },
  { title: "Image", id: "image" },
  { title: "Categories ", id: "categories" },
  { title: "Commission ", id: "commission" },
  { title: "Prix de base", id: "price" },
  { title: "Prix ​​horaire", id: "price_schedule" },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export default function CategoriesTypes() {
  const classes = useStyles();
  const [data, setData] = useState([]); //table data
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [openAlertError, setOpenAlertError] = React.useState(false);
  const [state, setState] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [last_name, setLastname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const [price_schedule, setPriceSchedule] = React.useState(0);
  const [id, setId] = React.useState("");
  const [confirm_password, setConfirmPassword] = React.useState("");
  const [categorie, setCategorie] = React.useState("");
  const [commission, setCommission] = React.useState(0);
  const [showpassword2, setShowPassword2] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [loadingRequest, setLoadingRequest] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [fileUrl, setFileUrl] = React.useState("");
  const [image, setImage] = React.useState("");
  const [openDelete, setOpenDelete] = React.useState(false);

  function onChange(e) {
    let files;
    let file = e.target.files[0];
    setFile(file);
    const reader = new FileReader();
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    reader.onload = () => {
      setImage(reader.result);
    };
    if (reader) {
      reader.readAsDataURL(files[0]);
    }
  }

  const handleClickOpen = (data) => {
    setId(data.id);
    setEdit(true);
    prefilPopUp(data);
    setOpen(true);
  };

  function onDelete() {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("id_token")}`,
      },
    };

    api
      .delete(`/services-types/${id}`, headers)
      .then((res) => {
        const response = data.filter((categories) => {
          return categories.id !== id;
        });
        setData(response);
        setOpenAlert(true);
        setLoadingRequest(false);
        setOpenDelete(false);
        revertPopup();
      })

      .catch((err) => {
        setLoadingRequest(false);
        console.log("err", err);
      });
  }

  function onAlertDelete(data) {
    setId(data.id);
    setOpenDelete(true);
  }

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  function conditionHelperTextEmail() {}

  function addNewCategorieTypes() {
    revertPopup();
    setOpen(true);
  }

  function renderImage(src) {
    return (
      <img
        src={process.env.REACT_APP_IMG_LOCATION + src}
        width="127px"
        height="127px"
      />
    );
  }

  function returnListItem(datas) {
    return datas.length > 0 && datas.map((data) => <li>{data.designation}</li>);
  }

  function clickAdd() {
    let new_data;
    setLoadingRequest(true);
    let finale_data;
    const toNumbers = (arr) => arr.map(Number);
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("id_token")}`,
      },
    };

    const payload = {
      designation: name,
      price: parseFloat(price),
      price_schedule: price_schedule ? parseFloat(price_schedule) : 0,
      commission: commission ? parseFloat(commission) : 0,
      categories: categorie ? parseInt(categorie) : null,
      descriptions: description ? description : "",
    };

    api
      .post(`/services-types`, payload, headers)
      .then((res) => {
        payload.id = res.data.id;
        new_data = [res.data];

        return res.data.id;
      })

      .then((refId) => {
        const headersFiles = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("id_token")}`,
          },
        };
        const data = new FormData();
        data.append("files", file);
        data.append("ref", "Services-Types");
        data.append("refId", refId);
        data.append("field", "image");
        return api.post(`/upload`, data, headersFiles);
      })
      .then((res) => {
        new_data[0].image = res.data[0];
        finale_data = new_data.concat(data);
        setLoadingRequest(false);
        setData(finale_data);
        setOpenAlert(true);
        handleClose();
      })
      .catch((error) => {
        setOpenAlertError(true);
        setLoadingRequest(false);
        console.log("err", error);
      });
  }

  function alertMessage() {}

  function updateStateLikeRealTime(new_info) {
    const newList = data.map((res) => {
      if (res.id === id) {
        return {
          ...res,
          designation: new_info.designation,
          price: new_info.price,
          price_schedule: new_info.price_schedule,
          categories: new_info.categories,
          commission: new_info.commission,
          descriptions: new_info.descriptions,
          image: new_info.image,
        };
      }
      return { ...res };
    });
    setData(newList);
  }

  function disabledEdit() {
    if (!name || (!fileUrl && !image)) {
      return true;
    }
  }

  function disabledAdd() {
    if (!name || !file) {
      return true;
    }
  }

  function checkPassword() {}

  function prefilPopUp(data) {
    setName(data.designation);
    data.image ? setFileUrl(data.image.url) : setFileUrl("");
    setDescription(data.descriptions);
    data.categories ? setCategorie(data.categories.id) : setCategorie("");
    data.price ? setPrice(data.price) : setPrice(0);
    data.price_schedule
      ? setPriceSchedule(data.price_schedule)
      : setPriceSchedule(0);
    data.commission ? setCommission(data.commission) : setCommission(0);
  }

  function revertPopup() {
    setName("");
    setDescription("");
    setCategorie("");
    setId("");
    setFile("");
    setImage("");
    setFileUrl("");
    setPriceSchedule(0);
    setPrice(0);
    setCommission(0);
  }

  const handleChange = (event) => {
    setState(!state);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    revertPopup();
  };

  const handleCloseAlerte = () => {
    setOpenAlert(false);
  };

  const handleCloseAlerteError = () => {
    setOpenAlertError(false);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //for error handling
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("id_token")}`,
      },
    };
    api
      .get("/services-types?_sort=id:DESC", headers)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.log("Error");
      });

    api
      .get("/services?_sort=id:DESC", headers)
      .then((res) => {
        setSuggestions(res.data);
      })
      .catch((error) => {
        console.log("Error");
      });
  }, []);

  function submitEdit() {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("id_token")}`,
      },
    };
    setLoadingRequest(true);

    const toNumbers = (arr) => arr.map(Number);
    let new_data;
    const payload = {
      designation: name,
      price: parseFloat(price),
      price_schedule: price_schedule ? parseFloat(price_schedule) : 0,
      commission: commission ? parseFloat(commission) : 0,
      categories: categorie ? parseInt(categorie) : null,
      descriptions: description ? description : "",
    };

    if (file) {
      api
        .put(`/services-types/${id}`, payload, headers)
        .then((res) => {
          payload.id = res.data.id;
          new_data = res.data;
          // finale_data = new_data.concat(data);

          return res.data.id;
        })

        .then((refId) => {
          const headersFiles = {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("id_token")}`,
            },
          };
          const data = new FormData();
          data.append("files", file);
          data.append("ref", "Services-Types");
          data.append("refId", refId);
          data.append("field", "image");
          return api.post(`/upload`, data, headersFiles);
        })
        .then((res) => {
          new_data.image = res.data[0];
          updateStateLikeRealTime(new_data);
          setOpenAlert(true);
          handleClose();
          setLoadingRequest(false);
        })
        .catch((error) => {
          setOpenAlertError(true);
          console.log(error);
          setLoadingRequest(false);
        });
    } else {
      api
        .put(`/services-types/${id}`, payload, headers)
        .then((res) => {
          updateStateLikeRealTime(res.data);
          setOpenAlert(true);
          setLoadingRequest(false);
          handleClose();
        })

        .catch((err) => {
          setLoadingRequest(false);
          console.log("err", err);
        });
    }
  }

  return (
    <>
      <PageTitle title="Categories Types" />
      <Button
        variant="contained"
        color="primary"
        onClick={addNewCategorieTypes}
      >
        Ajout nouveau Categorie type
      </Button>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id + `TableRow`}
                    >
                      <TableCell key={row.id + `TableCell`}>{row.id}</TableCell>
                      <TableCell key={row.id + `TableCell`}>
                        {row.designation}
                      </TableCell>
                      <TableCell key={row.id + `TableCell`}>
                        {row.descriptions ? row.descriptions : "---"}
                      </TableCell>
                      <TableCell key={row.id + `TableCell`}>
                        {row.image ? renderImage(row.image.url) : "Aucune"}
                      </TableCell>
                      <TableCell key={row.id + `TableCell`}>
                        {row.categories ? row.categories.designation : "Aucune"}
                      </TableCell>
                      <TableCell key={row.id + `TableCell`}>
                        {row.commission
                          ? row.commission.toFixed(2) + " " + `%`
                          : "Pas encore definie"}
                      </TableCell>
                      <TableCell key={row.id + `TableCell`}>
                        {row.price
                          ? row.price.toFixed(2) + " " + `€`
                          : "Pas encore definie"}
                      </TableCell>
                      <TableCell key={row.id + `TableCell`}>
                        {row.price_schedule
                          ? row.price_schedule.toFixed(2) + " " + `€`
                          : "Pas encore definie"}
                      </TableCell>

                      <EditOutlined
                        onClick={handleClickOpen.bind(this, row)}
                      ></EditOutlined>
                      <DeleteOutline
                        onClick={onAlertDelete.bind(this, row)}
                      ></DeleteOutline>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {isEdit ? `Modifications ${name}` : "Nouveau Categories types"}
          </DialogTitle>
          <DialogContent>
            {fileUrl && !image ? (
              <img
                width="127px"
                height="127px"
                src={process.env.REACT_APP_IMG_LOCATION + fileUrl}
              />
            ) : (
              <img width="127px" height="127px" src={image} />
            )}

            <Button variant="contained" component="label">
              {!fileUrl ? "Ajout photo" : "Modifier photo"}
              <input
                type="file"
                accept="image/x-png,image/gif,image/jpeg,image/jpg"
                hidden
                onChange={onChange}
              />
            </Button>
            <TextField
              autoFocus
              margin="dense"
              required
              id="name"
              label="Designation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="descriptions"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="price de base (Montant en Euro)"
              label="Prix de base"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              helperText="Si vous voulez ajouter de virgule , merci de remplacer par un point (Ex:2.55)"
              fullWidth
            />

            <TextField
              autoFocus
              margin="dense"
              id="Prix ​​horaire "
              label="Prix ​​horaire (Montant en Euro)"
              type="number"
              value={price_schedule}
              onChange={(e) => setPriceSchedule(e.target.value)}
              helperText="Si vous voulez ajouter de virgule , merci de remplacer par un point (Ex:2.55)"
              fullWidth
            />

            <TextField
              autoFocus
              margin="dense"
              id="commission"
              label="Commission"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              type="number"
              helperText="Si vous voulez ajouter de virgule , merci de remplacer par un point (Ex:2.55)"
              fullWidth
            />

            <InputLabel id="demo-simple-select-label">
              Sélectionner la categorie
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              fullWidth
            >
              {suggestions.map((res) => (
                <MenuItem value={res.id}>{res.designation}</MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Annuler
            </Button>
            {isEdit ? (
              <Button
                onClick={submitEdit}
                color="primary"
                disabled={disabledEdit()}
              >
                {loadingRequest ? "Modifications en cours ..." : "Modifier"}
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={clickAdd}
                disabled={disabledAdd()}
              >
                {loadingRequest ? "Ajout en cours ..." : "Ajouter"}
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Suprresion Categorie-types
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Êtes vous sûrs ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete} color="primary">
              Non
            </Button>
            <Button onClick={onDelete} color="primary" autoFocus>
              Oui
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={openAlert}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          onClose={handleCloseAlerte}
        >
          <Alert onClose={handleCloseAlerte} severity="success">
            Votre actions est prise en compte
          </Alert>
        </Snackbar>
        <Snackbar
          open={openAlertError}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          onClose={handleCloseAlerteError}
        >
          <Alert onClose={handleCloseAlerteError} severity="error">
            Erreur depuis le serveur
          </Alert>
        </Snackbar>
      </Paper>
    </>
  );
}
