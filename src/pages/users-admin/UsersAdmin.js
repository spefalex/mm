import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
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
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
// components
import PageTitle from "../../components/PageTitle";
import {
  regexCheckNumeric,
  regexLowerCase,
  regexSpecialChar,
  regexUperCase,
} from "../../validators/password";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const api = axios.create({
  baseURL: process.env.REACT_APP_REST_API_LOCATION,
});

function validateEmail(email) {
  const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
}

var columns = [
  { title: "Id", id: "id", hidden: true },
  { title: "Nom", id: "firstname" },
  { title: "Prenom", id: "lastname" },
  { title: "Email", id: "email" },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export default function UsersAdmin() {
  const classes = useStyles();
  const [data, setData] = useState([]); //table data
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [openAlertError, setOpenAlertError] = React.useState(false);
  const [state, setState] = React.useState(false);
  const [name, setName] = React.useState("");
  const [last_name, setLastname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [id, setId] = React.useState("");
  const [confirm_password, setConfirmPassword] = React.useState("");
  const [showpassword, setShowPassword] = React.useState(false);
  const [showpassword2, setShowPassword2] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);

  const handleClickOpen = (data) => {
    prefilPopUp(data);
    setOpen(true);
  };

  function conditionHelperTextEmail() {
    if (email && !validateEmail(email)) {
      return true;
    }
  }

  function addNewUser() {
    setEdit(true);
    revertPopup();
    setOpen(true);
  }

  function clickAdd() {
    let finale_data = [];
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("id_token")}`,
      },
    };
    const payload = {
      email: email,
      firstname: name,
      lastname: last_name,
      roles: [1],
    };

    api
      .post("/admin/users", payload, headers)
      .then((res) => {
        payload.id = res.data.data.id;
        let new_data = [payload];
        finale_data = new_data.concat(data);
        setData(finale_data);
        return res.data.data.id;
      })

      .then((refId) => {
        const data = {
          password: password,
          isActive: true,
        };
        return api.put(`/admin/users/${refId}`, data, headers);
      })
      .then((res) => {
        console.log(res);
        handleClose();
        setOpenAlert(true);
      })
      .catch((error) => {
        setOpenAlertError(true);
        console.log(error);
      });
  }

  function handleClickShowPassword() {
    setShowPassword(!showpassword);
  }

  function handleClickShowPassword2() {
    setShowPassword2(!showpassword2);
  }

  function alertMessage() {
    if (email && !validateEmail(email)) {
      return "Format email invalide";
    }
  }

  function updateStateLikeRealTime(new_info) {
    const newList = data.map((res) => {
      if (res.id === id) {
        return {
          ...res,
          isActive: new_info.isActive,
          email: new_info.email,
          firstname: new_info.firstname,
          lastname: new_info.lastname,
        };
      }
      return { ...res };
    });
    setData(newList);
  }

  function disabledEdit() {
    if (
      !name ||
      !last_name ||
      !email ||
      !validateEmail(email) ||
      (password && checkPassword(password)) ||
      (password && password !== confirm_password)
    ) {
      return true;
    }
  }

  function disabledAdd() {
    if (
      !name ||
      !last_name ||
      !email ||
      !validateEmail(email) ||
      !password ||
      !confirm_password ||
      (password && checkPassword(password)) ||
      (password && password !== confirm_password)
    ) {
      return true;
    }
  }

  function checkPassword() {
    if (
      password &&
      (!regexLowerCase.test(password) ||
        !regexUperCase.test(password) ||
        !regexSpecialChar.test(password) ||
        !regexCheckNumeric.test(password))
    ) {
      return true;
    }
  }

  function prefilPopUp(data) {
    setName(data.firstname);
    setEmail(data.email);
    setLastname(data.lastname);
    setState(data.isActive);
    setId(data.id);
  }

  function revertPopup(data) {
    setName("");
    setEmail("");
    setLastname("");
  }

  const handleChange = (event) => {
    setState(!state);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
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
      .get("/admin/users?pageSize=1000&page=1&_sort=id:desc", headers)
      .then((res) => {
        setData(res.data.data.results);
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

    let payload = {
      email: email,
      firstname: name,
      lastname: last_name,
      roles: [1],
      isActive: state,
    };
    if (
      (password && !checkPassword(password)) ||
      (password && password === confirm_password)
    ) {
      payload.password = password;
    }
    api
      .put(`/admin/users/${id}`, payload, headers)
      .then((res) => {
        updateStateLikeRealTime(res.data.data);
        handleClose();
        setOpenAlert(true);
      })
      .catch((error) => {
        console.log("Error");
      });
  }

  return (
    <>
      <PageTitle title="Utilisateurs Admin" />
      <Button variant="contained" color="primary" onClick={addNewUser}>
        Ajout nouveau admin
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
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.title} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}

                      <EditOutlined
                        onClick={handleClickOpen.bind(this, row)}
                      ></EditOutlined>
                      <DeleteOutline></DeleteOutline>
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
            {!isEdit ? `Modifications ${name}` : "Nouveau admin"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="firstname"
              label="Prénom"
              value={last_name}
              onChange={(e) => setLastname(e.target.value)}
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              label="Email Address"
              type="email"
              helperText={alertMessage()}
              error={conditionHelperTextEmail()}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              label="Mot de passe"
              type={showpassword ? "text" : "password"}
              error={checkPassword()}
              helperText={
                checkPassword()
                  ? "Minimum 6 caractères, au moins 1 chiffre, 1 caractère spécial, 1 lettre minuscule et 1 lettre majuscule"
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {!showpassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="confirm-password"
              label="Confirmation mot de passe"
              type={showpassword2 ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword2}
                    >
                      {!showpassword2 ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={confirm_password !== "" && confirm_password !== password}
              helperText={
                confirm_password !== "" && confirm_password !== password
                  ? "Les mots de passe que vous avez entrés ne sont pas identiques."
                  : ""
              }
              fullWidth
            />

            {!isEdit ? (
              <Fragment>
                Active
                <Switch
                  checked={state}
                  onChange={handleChange}
                  name="checkedA"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              </Fragment>
            ) : (
              ""
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Annuler
            </Button>
            {!isEdit ? (
              <Button
                onClick={submitEdit}
                color="primary"
                disabled={disabledEdit()}
              >
                Modifier
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={clickAdd}
                disabled={disabledAdd()}
              >
                Ajouter
              </Button>
            )}
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
            Adresse e-mail déjà prise
          </Alert>
        </Snackbar>
      </Paper>
    </>
  );
}
