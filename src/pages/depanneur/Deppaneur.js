import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import { red } from "@material-ui/core/colors";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import EditOutlined from "@material-ui/icons/EditOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SettingsIcon from "@material-ui/icons/Settings";
import MuiAlert from "@material-ui/lab/Alert";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import "moment/locale/fr";
import React, { useEffect, useState } from "react";
// components
import PageTitle from "../../components/PageTitle/PageTitle";
import NoImage from "../../images/no-image.jpg";
moment.locale("fr");

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const api = axios.create({
  baseURL: process.env.REACT_APP_REST_API_LOCATION,
});

var columns = [
  { title: "Id", id: "id", hidden: true },
  { title: "Avatar", id: "avatar", hidden: true },
  { title: "Nom", id: "first_name" },
  { title: "Prénom", id: "last_name" },
  { title: "Email", id: "email" },
  { title: "N°de Mobile ", id: "phone_code" },
  { title: "Note ", id: "customeReview" },
  { title: "Depannage ", id: "image" },
  { title: "Mode en ligne ", id: "enligne" },
  { title: "Date d'inscription", id: "created_at" },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function Deppaneur() {
  const reactTags = React.useRef();
  const classes = useStyles();
  const [data, setData] = useState([]); //table data
  const [dataAll, setDataAll] = useState([]); //table data
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [id, setId] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [openAlertError, setOpenAlertError] = React.useState(false);
  const [state, setState] = React.useState(false);
  const [name, setName] = React.useState("");
  const [file, setFile] = React.useState(null);
  const [fileUrl, setFileUrl] = React.useState("");
  const [image, setImage] = React.useState("");
  const [dataPanne, setDataPanne] = React.useState([]);
  const [suggestions, setSuggestions] = React.useState([]);
  const [isEdit, setEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openAlertNoDeppanage, setOpenAlertNoDeppanage] = React.useState(false);
  const [loadingRequest, setLoadingRequest] = React.useState(false);

  const [currentCategoriesTypes, setCategoriesTypes] = React.useState([]);

  const [expanded, setExpanded] = React.useState(false);
  const [openPanne, setOpenPanne] = React.useState(false);

  function handleClosePanne() {
    setOpenPanne(!openPanne);
    setDataPanne([]);
  }

  function handleCloseAlerteNoDepannage() {
    setOpenAlertNoDeppanage(!openAlertNoDeppanage);
    setOpenPanne(false);
  }
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClickOpen = (data) => {
    prefilPopUp(data);
    data.image ? setFileUrl(data.image.url) : setFileUrl("");
    setOpen(true);
    setEdit(true);
  };

  function addNewCategorie() {
    revertPopup();
    setOpen(true);
  }

  const calclulateMoyenne = (data) => {
    let totaleNote = 0;
    const response =
      data.length > 0 &&
      data.map((res) => {
        totaleNote += parseInt(res.rate);
        return totaleNote;
      });

    const moyenne_user = response[response.length - 1] / data.length;

    return moyenne_user;
  };

  function onAlertDelete(data) {
    setId(data.id);
    setOpenDelete(true);
  }

  function cherche(text) {
    if (text.target.value.length > 0) {
      const users = data.filter((user) => {
        return (
          user.first_name
            .toLowerCase()
            .indexOf(text.target.value.toLowerCase()) !== -1 ||
          user.last_name
            .toLowerCase()
            .indexOf(text.target.value.toLowerCase()) !== -1 ||
          user.email.toLowerCase().indexOf(text.target.value.toLowerCase()) !==
            -1 ||
          user.phone_number
            .toLowerCase()
            .indexOf(text.target.value.toLowerCase()) !== -1 ||
          user.phone_code
            .toLowerCase()
            .indexOf(text.target.value.toLowerCase()) !== -1 ||
          user.created_at.toLowerCase().indexOf(text.target.value) !== -1
        );
      });
      setData(users);
    } else {
      setData(dataAll);
    }
  }

  function getTroubleshotingById(user_id) {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("id_token")}`,
      },
    };

    api
      .get(
        `/troubleshooting-requests?_where[users_id.id]=${user_id}&_sort=id:DESC`,
        headers,
      )
      .then((res) => {
        setOpenPanne(true);
        // console.log("res", res.data);
        res.data.length > 0
          ? setDataPanne(res.data)
          : handleCloseAlerteNoDepannage();
      })
      .catch((error) => {
        console.log("Error");
      });
  }
  function addCategorie() {
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
      categorie_types: toNumbers(currentCategoriesTypes),
    };

    api
      .post(`/services`, payload, headers)
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
        data.append("ref", "Services");
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

  function onDelete() {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("id_token")}`,
      },
    };

    api
      .delete(`/services/${id}`, headers)
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

  function checkEngine(engine) {
    // let suggestion_list = currentCategoriesTypes;
    return _.includes(currentCategoriesTypes, engine.toString());
  }

  function renderImage(src) {
    return (
      <Avatar
        alt="Remy Sharp"
        src={process.env.REACT_APP_IMG_LOCATION + src}
        className={classes.avatar}
      />
    );
  }

  function returnListItem(datas) {
    return datas.length > 0 && datas.map((data) => <li>{data.designation}</li>);
  }

  function clickAdd() {}

  function alertMessage() {}

  function updateStateLikeRealTime(new_info) {
    const newList = data.map((res) => {
      if (res.id === id) {
        return {
          ...res,
          designation: new_info.designation,
          categorie_types: new_info.categorie_types,
          image: new_info.image,
        };
      }
      return { ...res };
    });
    setData(newList);
  }

  function disabledEdit() {
    if (!name || (!fileUrl && !image) || currentCategoriesTypes.length === 0) {
      return true;
    }
  }

  function disabledAdd() {}

  function checkPassword() {}

  function prefilPopUp(data) {
    setName(data.designation);
    setId(data.id);
    if (data.categorie_types.length > 0) {
      const response = data.categorie_types.map((res) => {
        return res.id.toString();
      });

      setCategoriesTypes(response);
    }
  }

  function revertPopup(data) {
    setName("");
    setImage("");
    setCategoriesTypes([]);
  }

  const handleChange = (event) => {
    setState(!state);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleClose = () => {
    setOpen(false);
    revertPopup();
    setTimeout(() => {
      setEdit(false);
    }, 2000);
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

  function formatSuggestion(data) {
    const response =
      data &&
      data.length > 0 &&
      data.map((res) => {
        return { ...res, name: res.designation };
      });
    return response;
  }

  useEffect(() => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("id_token")}`,
      },
    };

    api
      .get("/users?_where[users_type.id]=2&_sort=id:DESC", headers)
      .then((res) => {
        console.log("res", res.data);
        setData(res.data);
        setDataAll(res.data);
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
      categorie_types: toNumbers(currentCategoriesTypes),
    };

    if (file) {
      api
        .put(`/services/${id}`, payload, headers)
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
          data.append("ref", "Services");
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
        .put(`/services/${id}`, payload, headers)
        .then((res) => {
          console.log("res", res.data);
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
      <PageTitle title="Depanneur" />
      <Button variant="contained" color="primary">
        Ajout nouveau depanneur
      </Button>
      {/*   <TextField
        id="standard-basic"
        label="Tapez ici pour filtrer"
        onChange={cherche.bind(this)}
      />*/}
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
                        {row.avatar ? (
                          renderImage(row.avatar.url)
                        ) : (
                          <Avatar
                            aria-label="recipe"
                            className={classes.avatar}
                          >
                            {row ? row.last_name.substring(0, 2) : ""}
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell key={row.id + `TableCell`}>
                        {row.first_name}
                      </TableCell>
                      <TableCell key={row.id + `TableCell`}>
                        {" "}
                        {row.last_name}
                      </TableCell>
                      <TableCell key={row.id + `TableCell`}>
                        {" "}
                        {row.email}
                      </TableCell>

                      <TableCell key={row.id + `TableCell`}>
                        {row.phone_code} {row.phone_number}
                      </TableCell>
                      <TableCell key={row.id + `TableCell`}>
                        {" "}
                        {row.customer_reviews.length > 0 ? (
                          <Rating
                            name="read-only"
                            value={calclulateMoyenne(row.customer_reviews)}
                            readOnly
                          />
                        ) : (
                          <Rating name="read-only" value={0} readOnly />
                        )}{" "}
                      </TableCell>
                      <TableCell
                        key={row.id + `TableCell`}
                        onClick={getTroubleshotingById.bind(this, row.id)}
                      >
                        {row.troubleshooting_requests.length > 0 ? (
                          <Badge
                            badgeContent={row.troubleshooting_requests.length}
                            color="primary"
                          >
                            <SettingsIcon />
                          </Badge>
                        ) : (
                          <Badge badgeContent="0" color="primary">
                            <SettingsIcon />
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell key={row.id + `TableCell`}> --- </TableCell>

                      <TableCell key={row.id + `TableCell`}>
                        {moment(row.created_at).format("LLLL")}
                      </TableCell>
                      <EditOutlined></EditOutlined>
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
            {isEdit ? `Modifications ${name}` : "Nouveau Categories"}
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
                onClick={addCategorie}
                disabled={disabledEdit()}
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
            Suprresion Categorie
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
            Erreur depuis le serveure
          </Alert>
        </Snackbar>
        <Snackbar
          open={openAlertNoDeppanage}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          onClose={handleCloseAlerteNoDepannage}
        >
          <Alert onClose={handleCloseAlerteNoDepannage} severity="warning">
            Aucune deppanage!
          </Alert>
        </Snackbar>
        <Dialog
          open={openPanne}
          onClose={handleClosePanne}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Panne {dataPanne[0] ? dataPanne[0].users_id.last_name : ""}
          </DialogTitle>
          <DialogContent>
            {" "}
            {dataPanne.map((column) => (
              <Card className={classes.root}>
                <CardHeader
                  avatar={
                    column.users_id && column.users_id.avatar ? (
                      renderImage(column.users_id.avatar.url)
                    ) : (
                      <Avatar aria-label="recipe" className={classes.avatar}>
                        {dataPanne[0]
                          ? dataPanne[0].users_id.last_name.substring(0, 2)
                          : ""}
                      </Avatar>
                    )
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={
                    column.categorie_id.designation +
                    " / " +
                    column.categorie_type_id.designation
                  }
                  subheader={moment(column.created_at).format("LLLL")}
                />
                {column.photos && column.photos.length > 0 ? (
                  <CardMedia
                    className={classes.media}
                    image={
                      process.env.REACT_APP_IMG_LOCATION + column.photos[0].url
                    }
                    title="Paella dish"
                  />
                ) : (
                  <CardMedia
                    className={classes.media}
                    image={NoImage}
                    title="Paella dish"
                  />
                )}
                <CardContent>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    <strong>Localisations:</strong> {column.localisations} ,{" "}
                    {moment(column.created_at).fromNow()}. <br></br>
                    <strong> Information du depanneur:</strong>{" "}
                    {column.id_deppaneur_assigned
                      ? column.id_deppaneur_assigned.first_name +
                        " " +
                        column.id_deppaneur_assigned.last_name
                      : "Y a aucun dépanneur qui a accepté de depanner"}{" "}
                    <br></br>
                    <strong>Paiement methode</strong>:{" "}
                    {column.paiement_method_id.designation} <br></br>
                    <strong>Montant</strong>:{" "}
                    {column.categorie_type_id.price.toFixed(2)} € <br></br>
                    <strong>Statut de paiement</strong>:{" "}
                    {column.transaction ? column.transaction.state : "En cours"}{" "}
                    <br></br>
                    <strong>
                      Heure début du dépannage pour le depanneur:{" "}
                    </strong>{" "}
                    {column.start_time_troubleshooting
                      ? column.start_time_troubleshooting
                      : "Pas encore definie"}{" "}
                    <br></br>
                    <strong>
                      Heure fin du dépannage pour le depanneur:{" "}
                    </strong>{" "}
                    {column.end_time_troubleshooting
                      ? column.end_time_troubleshooting
                      : "Pas encore definie"}
                  </Typography>
                </CardContent>
                {/*    <CardActions disableSpacing>
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography paragraph>Method:</Typography>
                    <Typography paragraph>
                      Heat 1/2 cup of the broth in a pot until simmering, add
                      saffron and set aside for 10 minutes.
                    </Typography>
                    <Typography paragraph>
                      Heat oil in a (14- to 16-inch) paella pan or a large, deep
                      skillet over medium-high heat. Add chicken, shrimp and
                      chorizo, and cook, stirring occasionally until lightly
                      browned, 6 to 8 minutes. Transfer shrimp to a large plate
                      and set aside, leaving chicken and chorizo in the pan. Add
                      pimentón, bay leaves, garlic, tomatoes, onion, salt and
                      pepper, and cook, stirring often until thickened and
                      fragrant, about 10 minutes. Add saffron broth and
                      remaining 4 1/2 cups chicken broth; bring to a boil.
                    </Typography>
                    <Typography paragraph>
                      Add rice and stir very gently to distribute. Top with
                      artichokes and peppers, and cook without stirring, until
                      most of the liquid is absorbed, 15 to 18 minutes. Reduce
                      heat to medium-low, add reserved shrimp and mussels,
                      tucking them down into the rice, and cook again without
                      stirring, until mussels have opened and rice is just
                      tender, 5 to 7 minutes more. (Discard any mussels that
                      don’t open.)
                    </Typography>
                    <Typography>
                      Set aside off of the heat to let rest for 10 minutes, and
                      then serve.
                    </Typography>
                  </CardContent>
                </Collapse>*/}
              </Card>
            ))}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleClosePanne}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}
