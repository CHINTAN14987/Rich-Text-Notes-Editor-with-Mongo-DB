const db = require('../../models');
const s3 = require('../../config/s3config');

const Notes = db.notes;
const Users = db.users;

const getSignedUrl = function (s3Params, fileName, S3_BUCKET) {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        reject(err);
      }
      const res = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
      };
      console.log('res: ', res);
      resolve(res);
    });
  });
};

const getNotesByUserId = async (userId) => {
  try {
    console.log('Calling getNotesByUserId Service :');
    const notes = await Notes.find({ userId });
    return notes;
  } catch (error) {
    console.log('error: ', error);
  }
};

const addNote = async (body) => {
  try {
    console.log('Calling addNote Service :', body);
    const note = await new Notes(body).save();
    return note;
  } catch (error) {
    console.log('error: ', error);
  }
};

const updateNoteById = async (body) => {
  try {
    console.log('Calling updateNoteByNoteId Service :', body);
    const note = await Notes.findByIdAndUpdate({ _id: body.noteId }, body);
    return note;
  } catch (error) {
    console.log('error: ', error);
  }
};

const deleteNoteById = async (noteId) => {
  try {
    console.log('Calling deleteNoteByNoteId Service :', noteId);
    const note = await Notes.deleteOne({ _id: noteId });
    return note;
  } catch (error) {
    console.log('error: ', error);
  }
};

const getAllUsersExceptSharedUser = async (userIds) => {
  try {
    console.log('Calling getAllUsersExceptSharedUser Service :', userIds);
    const users = await Users.find({
      _id: { $nin: userIds },
    });
    return users;
  } catch (error) {
    console.log('error: ', error);
  }
};

const shareNoteByNoteId = async (body) => {
  try {
    const { noteId, emailList } = body;
    console.log('Calling shareNoteByNoteId Service :', body);
    const note = await Notes.findByIdAndUpdate(
      { _id: noteId },
      { $push: { shareTo: emailList } }
    );
    return note;
  } catch (error) {
    console.log('error: ', error);
  }
};

const getSharedNoteEmails = async (noteId) => {
  try {
    console.log('Calling getSharedNoteUserId Service :', noteId);
    const note = await Notes.findOne({ _id: noteId }, { shareTo: 1, _id: 0 });
    return note;
  } catch (error) {
    console.log('error: ', error);
  }
};

const getSharedNotes = async (email) => {
  try {
    console.log('Calling getSharedNotes Service : ', email);
    const notes = await Notes.find({ shareTo: email });
    return notes;
  } catch (error) {
    console.log('error: ', error);
  }
};

module.exports = {
  getSignedUrl,
  addNote,
  getNotesByUserId,
  updateNoteById,
  deleteNoteById,
  getAllUsersExceptSharedUser,
  shareNoteByNoteId,
  getSharedNoteEmails,
  getSharedNotes,
};
