const { Router } = require('express');
const {
  uploadFile,
  addNote,
  updateNoteById,
  getNotesByUserId,
  deleteNoteById,
  getAllUsersExceptSharedUser,
  shareNoteByNoteId,
  getSharedNotes,
} = require('../controllers/note');
const verifyToken = require('../middlewares/authJwt');

const noteRoutes = function () {
  const router = Router();
  router.post('/uploadFile', verifyToken, uploadFile); // Done
  router.get('/getNotes', verifyToken, getNotesByUserId); // Done
  router.post('/createNote', verifyToken, addNote); // Done
  router.put('/updateNote', verifyToken, updateNoteById); // Done
  router.delete('/deleteNote', verifyToken, deleteNoteById); // Done
  router.get(
    '/getAllUsersExceptSharedUser',
    verifyToken,
    getAllUsersExceptSharedUser
  ); // Done
  router.put('/shareNote', verifyToken, shareNoteByNoteId); // Done
  router.get('/getSharedNotes', verifyToken, getSharedNotes); // Done
  return router;
};

module.exports = {
  noteRoutes,
};
