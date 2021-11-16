import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { auth, db } from "../firebase";
import { createDialogAtom } from "../utils/atoms";


function CreateClass() {
  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = useRecoilState(createDialogAtom);
  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const createClass = async () => {
    try {
      const newClass = await db.collection("classes").add({
        creatorUid: user.uid,
        name: className,
        desc: description,
        creatorName: user.displayName,
        creatorPhoto: user.photoURL,
        posts: [],
      });

  
      const userRef = await db
        .collection("users")
        .where("uid", "==", user.uid)
        .get();
      const docId = userRef.docs[0].id;
      const userData = userRef.docs[0].data();
      let userClasses = userData.enrolledClassrooms;
      userClasses.push({
        id: newClass.id,
        name: className,
        desc: description,
        creatorName: user.displayName,
        creatorPhoto: user.photoURL,
      });
      const docRef = await db.collection("users").doc(docId);
      await docRef.update({
        enrolledClassrooms: userClasses,
      });
      handleClose();
      alert("Grupo Criado com sucesso!");
    } catch (err) {
      alert(`Não foi possível criar o grupo - ${err.message}`);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Criar um grupo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Insira o nome do grupo que deseja criar
          </DialogContentText>
          <TextField
            margin="dense"
            label="Nome do grupo"
            type="text"
            fullWidth
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
        <DialogContentText>
            Insira uma descrição para o grupo
          </DialogContentText>
        <TextField
            margin="dense"
            label="Descrição do grupo"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={createClass} color="primary">
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateClass;

