import React, { useEffect, useState, useMemo, useCallback } from 'react';
import './DisplayedNotes.css';
import { BsFillPenFill, BsShareFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import Portal from '../Portal';
import ShareNoteModalPortal from './ModalPortal';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import 'jodit/build/jodit.min.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useSelector } from 'react-redux';

const DisplayedNotes = ({ displayedNote, getNotes }) => {
  const token = localStorage.getItem('accessToken');
  const [itemID, setItemID] = useState(null);
  const [itemID1, setItemID1] = useState(null);
  const [noteID, setNoteID] = useState('');
  const [openPortal, setOpenPortal] = useState(false);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [checkBoxValue, setCheckBoxValue] = useState(false);
  const [checkBoxValue2, setCheckBoxValue2] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const toggleBackgrounDColor = useSelector(
    (state) => state.NotesReducer.ToggleColor
  );

  useEffect(() => {}, []);
  const imageClickHandler = () => {
    setOpenPortal(true);
  };
  const TitleHandler = (id) => {
    setItemID(id);
    setCheckBoxValue(true);
    setCheckBoxValue2(false);
  };
  const titleHandler2 = (id) => {
    setCheckBoxValue2(true);
    setCheckBoxValue(false);
  };

  // const stringtruncate = (name) => {
  //   return name.slice(0, name.indexOf('.'));
  // };

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const updateNoteHandler = async (content, noteId) => {
    const payload = {
      noteId,
      content,
    };
    await axios.put(
      `${process.env.REACT_APP_API_ENDPOINT}/updateNote`,
      payload,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    getNotes();
  };
  const optimizedFn = useCallback(debounce(updateNoteHandler), []);

  const config = useMemo(
    () => ({
      readonly: false,
    }),
    []
  );
  const shareNoteHandler = (id) => {
    setItemID1(id);
    setOpenNoteModal(true);
  };

  const updateNoteTitleHandler = async (title, noteId) => {
    const payload = {
      noteId,
      title,
    };
    await axios.put(
      `${process.env.REACT_APP_API_ENDPOINT}/updateNote`,
      payload,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    getNotes();
  };

  const deleteNoteHandler = async (noteId) => {
    console.log(noteId);
    const data = await axios.delete(
      `${process.env.REACT_APP_API_ENDPOINT}/deleteNote?noteId=${noteId}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
    getNotes();
  };

  return (
    <div className="displayed_wrapper">
      {displayedNote.length > 0 ? (
        <>
          {displayedNote?.map((note) => {
            const { title, _id, fileUrl, color, content } = note;

            return (
              <div
                key={_id}
                className={`DisplayedItem  ${
                  toggleBackgrounDColor ? 'hoverColor' : ''
                }`}
                id={`${_id}`}
                style={
                  toggleBackgrounDColor
                    ? {
                        color: 'rgb(232, 234, 237)',
                        border: '2px solid #e8eaed',
                      }
                    : { color: color }
                }
              >
                <div className="deletePinIcon_Wrapper">
                  <h3
                    className={`displayedTitle  ${
                      checkBoxValue && itemID === _id ? 'show' : 'hide'
                    }`}
                    id="a"
                    style={
                      toggleBackgrounDColor
                        ? {
                            color: 'rgb(232, 234, 237)',
                          }
                        : { color: color }
                    }
                  >
                    {title.length > 0 ? title : 'Unnamed Note'}
                  </h3>

                  <BsFillPenFill
                    id="b"
                    className={
                      checkBoxValue && itemID === _id ? 'showbox' : 'hidebox'
                    }
                    onClick={() => {
                      TitleHandler(_id);
                    }}
                    fill={toggleBackgrounDColor ? 'rgba(232,234,237)' : 'black'}
                  />
                  {openNoteModal && itemID1 === _id && (
                    <ShareNoteModalPortal
                      closeShareNoteModalPortal={() => {
                        setOpenNoteModal(false);
                      }}
                      noteID={noteID}
                    />
                  )}
                  {checkBoxValue && !checkBoxValue2 && (
                    <>
                      {itemID === _id && (
                        <>
                          <input
                            value={noteTitle}
                            name="title"
                            id="c"
                            className="inputItemDisplayed"
                            onChange={(e) => {
                              setNoteTitle(e.target.value);
                            }}
                            onFocus={() => {
                              setNoteTitle(title);
                            }}
                            style={
                              toggleBackgrounDColor
                                ? {
                                    color: 'rgb(232, 234, 237)',
                                  }
                                : { color: color }
                            }
                          />
                          <button
                            id="d"
                            onClick={() => {
                              titleHandler2(_id);
                              updateNoteTitleHandler(noteTitle, _id);
                            }}
                          ></button>
                        </>
                      )}
                    </>
                  )}
                  <div className="deleteShareIconWrapper">
                    <BsShareFill
                      className="shareIcon"
                      fill={
                        toggleBackgrounDColor ? 'rgba(232,234,237)' : 'black'
                      }
                      onClick={() => {
                        shareNoteHandler(_id);
                        setNoteID(_id);
                      }}
                    />
                    <AiFillDelete
                      size="20px"
                      fill={toggleBackgrounDColor ? ' #e8eaed' : 'black'}
                      onClick={() => {
                        deleteNoteHandler(_id);
                      }}
                      className="deleteIcon"
                    />
                  </div>
                </div>
                <div
                  className="inputFileWrapper"
                  style={
                    toggleBackgrounDColor
                      ? {
                          borderBottom: '2px solid rgb(232, 234, 237)',
                          marginBottom: '1rem',
                        }
                      : {
                          borderBottom: '2px solid black',
                          marginBottom: '1rem',
                        }
                  }
                ></div>

                <div
                  className={`richTextModeWrapper ${
                    toggleBackgrounDColor ? 'joditDarkMode' : 'joditLightMode'
                  }`}
                >
                  <JoditEditor
                    onChange={(e) => {
                      optimizedFn(e, _id);
                    }}
                    value={content}
                    config={config}
                    tabIndex={1}
                  />
                </div>
                {fileUrl !== undefined && (
                  <>
                    {fileUrl
                      ?.substring(fileUrl.lastIndexOf('.'), fileUrl?.length)
                      .slice(1) === 'png' ||
                    fileUrl
                      ?.substring(fileUrl.lastIndexOf('.'), fileUrl?.length)
                      .slice(1) === 'jpg' ||
                    fileUrl
                      ?.substring(fileUrl.lastIndexOf('.'), fileUrl?.length)
                      .slice(1) === 'jpeg' ? (
                      <>
                        <img
                          src={fileUrl}
                          className="displayedImageItem"
                          onClick={imageClickHandler}
                          alt=""
                        />

                        {openPortal && (
                          <Portal
                            filePreview={fileUrl}
                            closePortal={() => {
                              setOpenPortal(false);
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <div
                          className="fileName_wrapper"
                          style={
                            toggleBackgrounDColor
                              ? {
                                  color: 'rgb(232, 234, 237)',
                                  fontWeight: '700',
                                }
                              : {
                                  color: color,
                                  fontWeight: '700',
                                }
                          }
                        >
                          {fileUrl !== undefined && (
                            <>
                              <span>File Name:</span>
                              <span>
                                {fileUrl
                                  ?.substring(
                                    fileUrl?.lastIndexOf('/'),
                                    fileUrl?.lastIndexOf('.')
                                  )
                                  .slice(1)}
                              </span>
                            </>
                          )}
                        </div>
                        <div
                          className="fileDescription"
                          style={
                            toggleBackgrounDColor
                              ? {
                                  color: 'rgb(232, 234, 237)',
                                  fontWeight: '700',
                                }
                              : {
                                  color: color,
                                  fontWeight: '700',
                                }
                          }
                        >
                          {fileUrl !== undefined && (
                            <>
                              <span>Type:</span>
                              <span>
                                {fileUrl
                                  ?.substring(
                                    fileUrl.lastIndexOf('.'),
                                    fileUrl?.length
                                  )
                                  .slice(1)
                                  .toUpperCase()}
                              </span>
                            </>
                          )}
                        </div>

                        {fileUrl
                          .substring(fileUrl.lastIndexOf('.'), fileUrl.length)
                          .slice(1) === 'docx' ||
                        fileUrl
                          .substring(fileUrl.lastIndexOf('.'), fileUrl.length)
                          .slice(1) === 'doc' ||
                        fileUrl
                          .substring(fileUrl.lastIndexOf('.'), fileUrl.length)
                          .slice(1) === 'pdf' ? (
                          <>
                            <div
                              className="fileLink_Wrapper"
                              style={
                                toggleBackgrounDColor
                                  ? {
                                      color: 'rgb(232, 234, 237)',
                                      fontWeight: '700',
                                    }
                                  : {
                                      color: color,
                                      fontWeight: '700',
                                    }
                              }
                            >
                              <span>Link:</span>
                              <a
                                className="filesDocs"
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {fileUrl}
                              </a>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </>
      ) : (
        <div
          className="notedetail"
          style={
            toggleBackgrounDColor
              ? {
                  color: 'rgb(232, 234, 237)',
                  boxShadow: '#e8eaed 0px 5px 15px',
                }
              : {
                  color: 'grey',
                  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                }
          }
        >
          <h3>No Note Found</h3>
          <span>Please create a new note....!</span>
        </div>
      )}
    </div>
  );
};
export default DisplayedNotes;
