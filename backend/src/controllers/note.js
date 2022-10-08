const {
  getSignedUrl,
  addNote: addNoteService,
  getNotesByUserId: getNotesByUserIdService,
  updateNoteById: updateNoteByIdService,
  deleteNoteById: deleteNoteByIdService,
  getAllUsersExceptSharedUser: getAllUsersExceptSharedUserService,
  shareNoteByNoteId: shareNoteByNoteIdService,
  getSharedNoteEmails: getSharedNoteEmailsService,
  getSharedNotes: getSharedNotesService,
} = require('../services/Note');

const uploadFile = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    const S3_BUCKET = process.env.BUCKET_NAME;
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      ContentType: fileType,
      Expires: 60,
      ACL: 'public-read',
    };
    const s3Info = await getSignedUrl(s3Params, fileName, S3_BUCKET);
    res.status(200).send(s3Info);
  } catch (error) {
    console.log('🔥 error while getting uploadedFile :', error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

const getNotesByUserId = async (req, res) => {
  try {
    const { userId } = req;
    console.log('Calling getNotesByUserId controller with :', userId);
    const notes = await getNotesByUserIdService(userId);
    return res.status(200).send({ notes });
  } catch (error) {
    console.log('🔥 error while getting Notes by UserId : ', error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

const addNote = async (req, res) => {
  try {
    const { body } = req;
    body.userId = req.userId;
    console.log('Calling addNote controller with :', body);
    const note = await addNoteService(body);
    if (note) {
      return res.status(200).send({
        isNoteAdded: true,
        message: 'Note added successfully!',
      });
    }
  } catch (error) {
    console.log('🔥 error while adding note : ', error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

const updateNoteById = async (req, res) => {
  try {
    const { body } = req;
    console.log('Calling updateNoteById controller with : ', body);
    const note = await updateNoteByIdService(body);
    if (!note) {
      return res
        .status(401)
        .send({ isNoteUpdated: false, message: 'Note does not exist!' });
    }
    return res.status(200).send({
      isNoteUpdated: true,
      message: 'Note Updated successfully!',
    });
  } catch (error) {
    console.log('🔥 error while updating notes by noteId : ', error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

const deleteNoteById = async (req, res) => {
  try {
    console.log('------>', req.query);
    const { noteId } = req.query;
    console.log(' Calling deleteNoteById controller with :', noteId);
    const note = await deleteNoteByIdService(noteId);
    if (!note) {
      return res
        .status(401)
        .send({ isNoteDeleted: false, message: 'Note does not exist!' });
    }
    return res.status(200).send({
      isNoteDeleted: true,
      message: 'Note Deleted successfully!',
    });
  } catch (error) {
    console.log('🔥 error while deleting note by noteId : ', error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

const getAllUsersExceptSharedUser = async (req, res) => {
  try {
    const { email } = req;
    const { noteId } = req.body;
    console.log(
      ' Calling getAllUsersExceptSharedUser controller with :',
      email
    );
    const { shareTo } = await getSharedNoteEmailsService(noteId); // user object list
    shareTo.push(email);
    const users = await getAllUsersExceptSharedUserService(shareTo); // user object list
    return res.status(200).send(users);
  } catch (error) {
    console.log(
      '🔥 error while getting all users except shared user : ',
      error
    );
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

const shareNoteByNoteId = async (req, res) => {
  try {
    const { body } = req;
    console.log('Calling shareNoteByNoteId controller with : ', body);
    const note = await shareNoteByNoteIdService(body);
    if (!note) {
      return res
        .status(401)
        .send({ isNoteUpdated: false, message: 'Note does not exist!' });
    }
    return res.status(200).send({
      isNoteUpdated: true,
      message: 'Note shared successfully!',
    });
  } catch (error) {
    console.log('🔥 error while share note by noteId and userId : ', error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

const getSharedNotes = async (req, res) => {
  try {
    const { email } = req;
    console.log('Calling getSharedNotes controller with :', email);
    const notes = await getSharedNotesService(email);
    return res.status(200).send({ notes });
  } catch (error) {
    console.log('🔥 error while getting shared notes by UserId : ', error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = {
  uploadFile,
  addNote,
  getNotesByUserId,
  updateNoteById,
  deleteNoteById,
  getAllUsersExceptSharedUser,
  shareNoteByNoteId,
  getSharedNotes,
};
