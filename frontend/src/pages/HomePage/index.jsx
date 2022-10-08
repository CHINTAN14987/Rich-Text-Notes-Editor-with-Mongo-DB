import './HomePage.css';
import { ImCheckboxChecked } from 'react-icons/im';
import { BsPenFill } from 'react-icons/bs';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdPlaylistAdd } from 'react-icons/md';
import { GiFiles } from 'react-icons/gi';
import { TiTick } from 'react-icons/ti';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DisplayedNotes from '../../components/Notes/index';
import { Switch } from 'antd';
import React from 'react';
import axios from 'axios';

import { Editor } from 'react-draft-wysiwyg';

import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import SharedNotes from '../../components/SharedNotes';
const color = [
  '#ff0000',
  '#0000ff',
  '#3cb371',
  '#ffa500',
  '#ee82ee',
  '#6a5acd',
  '#000000',
];

const HomePage = () => {
  const [checkBoxActive, setCheckBoxActive] = useState(true);
  const [textColor, setTextColor] = useState(false);
  const [title, setTitle] = useState('');
  const [checked, setChecked] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [colorSelectedDisplay, setColorSelectedDisplay] = useState(false);
  const [progressValue, setProgressValue] = useState(false);
  const [noteColor, setNoteColor] = useState('');
  const token = localStorage.getItem('accessToken');
  const [displayedNote, setDisplayedNote] = useState([]);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [headingInput, setheadingInput] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const dispatch = useDispatch();
  const toggleBackgrounDColor = useSelector(
    (state) => state.NotesReducer.ToggleColor
  );
  const [fileUrl, setFileUrl] = useState();

  useEffect(() => {
    const progress = () => {
      setProgressValue(false);
    };

    if (fileUrl) {
      setProgressValue(true);
      setTimeout(progress, 1500);
    }

    return () => {
      clearTimeout(progress);
    };
  }, [fileUrl]);

  useEffect(() => {
    if (!selectedFile) {
      setFileUrl(undefined);
      return;
    } else {
      const image = URL.createObjectURL(selectedFile);
      setFileUrl(image);
      return () => URL.revokeObjectURL(image);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (showNotes) {
      getSharedNotes();
    } else {
      getUserNotes();
    }
  }, [showNotes]);
  const checkBoxHandler = () => {
    setCheckBoxActive(false);
  };

  const inputHandler = (e) => {
    setTitle(e.target.value);
    if (e.target.value) {
      setChecked(!checked);
    } else {
      return;
    }
  };
  const closeFormHandler = () => {
    setTitle('');

    setSelectedFile(undefined);
    setCheckBoxActive(true);
    setNoteColor('');
  };

  const colorChooseHandler = (color) => {
    setNoteColor(color);
    setColorSelectedDisplay(true);
    setTimeout(() => {
      setColorSelectedDisplay(false);
      setTextColor(false);
    }, 1000);
  };

  const textColorHandler = () => {
    setTextColor(!textColor);
  };

  const submitHandler = async () => {
    const noteContent = stateToHTML(
      convertFromRaw(
        JSON.parse(
          JSON.stringify(convertToRaw(editorState.getCurrentContent()))
        )
      )
    );

    const payload = {
      title: title,
      content: noteContent,
      fileUrl: fileUrl,
      color: noteColor,
    };

    const data = await axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/createNote`,
      payload,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('data: ', data);

    setTitle('');
    setCheckBoxActive(true);
    setFileUrl(undefined);
    setNoteColor('');
    setEditorState(EditorState.createEmpty());
    getUserNotes();
  };
  const submitTitleNoteHandler = async () => {
    const payload = {
      title: headingInput,
      content: '',
      fileUrl: '',
      color: '',
    };

    const data = await axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/createNote`,
      payload,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('dataHeading: ', data);

    setheadingInput('');
    getUserNotes();
  };

  const getUserNotes = async () => {
    const {
      data: { notes },
    } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/getNotes`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    console.log(notes);
    setDisplayedNote(notes);
  };

  const getSharedNotes = async () => {
    const {
      data: { notes },
    } = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/getSharedNotes`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(notes);
    setDisplayedNote(notes);
  };

  const onSelectFile = async (e) => {
    const [selectedFile] = e.target.files;
    const params = {
      fileName: `rich-text-files/${selectedFile?.name?.toLowerCase()}`,
      fileType: selectedFile.type,
    };

    const { data } = await axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/uploadFile`,
      params,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    const { signedRequest, url } = data || {};
    const options = {
      headers: {
        'Content-Type': selectedFile.type,
      },
    };

    await axios
      .put(signedRequest, selectedFile, options)
      .then((result) => {
        setFileUrl(url);
        if (fileUrl) {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      className="todo_container"
      style={
        toggleBackgrounDColor
          ? { backgroundColor: '#202124' }
          : { boxShadow: '' }
      }
    >
      {console.log(progressValue, 'one')}

      <div
        className="Todo_wrapper"
        style={
          toggleBackgrounDColor
            ? { boxShadow: '#e8eaed 0px 5px 15px' }
            : {
                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                backgroundColor: '#fff',
              }
        }
      >
        {checkBoxActive ? (
          <>
            <div className="heading_wrapper">
              <div className="inputHeadingWrapper">
                {headingInput?.length > 0 && (
                  <MdPlaylistAdd
                    size="25px"
                    fill={toggleBackgrounDColor ? ' #e8eaed' : 'black'}
                    onClick={submitTitleNoteHandler}
                  />
                )}
                <input
                  className={`inputHeading ${
                    toggleBackgrounDColor
                      ? 'inputHeadingDarkBackgroundHover'
                      : 'inputHeadingLightBackgroundHover'
                  }`}
                  value={headingInput}
                  onChange={(e) => {
                    setheadingInput(e.target.value);
                  }}
                  autoFocus={true}
                  style={
                    toggleBackgrounDColor
                      ? {
                          color: '#e8eaed',

                          backgroundColor: 'rgb(32, 33, 36)',
                          fontWeight: '600',
                        }
                      : {
                          color: 'black',
                          fontWeight: '600',
                        }
                  }
                  placeholder="Take Notes...!"
                />
              </div>

              <div className="Todo_icon">
                <div className="boxIcon">
                  <ImCheckboxChecked
                    fill={toggleBackgrounDColor ? ' #e8eaed' : 'grey'}
                    size="20px"
                    onClick={checkBoxHandler}
                  />
                  <div className="checboxIcon_content">New List</div>
                </div>
                <div className="boxIcon">
                  <BsPenFill
                    fill={toggleBackgrounDColor ? ' #e8eaed' : 'grey'}
                    size="20px"
                    onClick={textColorHandler}
                  />
                  <div className="checboxIcon_content">Pen Text Color</div>
                </div>
              </div>
            </div>
            {textColor && (
              <div className="color_wrapper_outer_container">
                <div className="colorBox">
                  {color.map((item, index) => {
                    return (
                      <button
                        className="box"
                        key={index}
                        style={{
                          backgroundColor: item,
                          width: '1.5rem',
                          height: '1.5rem',
                        }}
                        onClick={(e) => {
                          let color = e.target.style.backgroundColor;
                          colorChooseHandler(color);
                        }}
                      ></button>
                    );
                  })}
                </div>
                {colorSelectedDisplay && (
                  <span className="messageColorSelected">
                    Color is Selected
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <label
                className="card_title"
                style={
                  toggleBackgrounDColor
                    ? { color: '#e8eaed' }
                    : { color: 'black' }
                }
              >
                Title
              </label>
              <div
                className="input_wrapper"
                style={
                  toggleBackgrounDColor
                    ? {
                        borderBottom: '2px solid rgb(232, 234, 237)',
                      }
                    : {
                        borderBottom: '2px solid black',
                      }
                }
              >
                {title ? (
                  <>
                    <TiTick
                      style={
                        toggleBackgrounDColor
                          ? {
                              color: '#e8eaed',
                              transform: 'rotateZ(90deg)',
                            }
                          : {
                              color: 'black',
                            }
                      }
                      size="20px"
                    />
                  </>
                ) : (
                  <AiOutlinePlus
                    style={
                      toggleBackgrounDColor
                        ? {
                            color: '#e8eaed',
                          }
                        : {
                            color: 'black',
                          }
                    }
                    size="15px"
                  />
                )}

                {
                  <input
                    className="input_NameList"
                    value={title}
                    type="text"
                    onChange={inputHandler}
                    style={
                      toggleBackgrounDColor
                        ? {
                            color: '#e8eaed',
                          }
                        : {
                            color: noteColor,
                            fontWeight: '600',
                          }
                    }
                  />
                }
              </div>
              <div className="form_content">
                <div
                  className="content_wrapper"
                  style={
                    toggleBackgrounDColor
                      ? {
                          borderBottom: '2px solid rgb(232, 234, 237)',
                        }
                      : {
                          borderBottom: '2px solid black',
                        }
                  }
                >
                  <label
                    style={
                      toggleBackgrounDColor
                        ? { color: '#e8eaed' }
                        : { color: 'black' }
                    }
                  >
                    Content
                  </label>
                  <Editor
                    editorState={editorState}
                    onEditorStateChange={(e) => {
                      setEditorState(e);
                    }}
                    wrapperClassName={`wrapper-class ${
                      toggleBackgrounDColor
                        ? 'darkBackground_wrapperClass'
                        : 'lightBackground_wrapperClass'
                    }`}
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                    toolbar={{
                      options: [
                        'inline',
                        'blockType',
                        'fontSize',
                        'fontFamily',
                        'list',
                        'emoji',
                        'remove',
                      ],
                      inline: {
                        options: [
                          'bold',
                          'italic',
                          'underline',
                          'strikethrough',
                          'monospace',
                        ],
                      },
                      list: {
                        options: ['unordered', 'ordered'],
                      },
                    }}
                    editorStyle={
                      toggleBackgrounDColor
                        ? {
                            color: '#e8eaed',
                          }
                        : {
                            color: noteColor,
                          }
                    }
                  />
                </div>
                <div
                  className="inputFileWrapper"
                  style={
                    toggleBackgrounDColor
                      ? {
                          borderBottom: '2px solid rgb(232, 234, 237)',
                        }
                      : {
                          borderBottom: '2px solid black',
                        }
                  }
                >
                  <div
                    className="filebutton"
                    style={
                      toggleBackgrounDColor
                        ? {
                            backgroundColor: 'rgb(232, 234, 237)',
                          }
                        : {
                            backgroundColor: 'black',
                          }
                    }
                  >
                    <GiFiles
                      className={`fileIcon ${
                        toggleBackgrounDColor ? 'darkModeFileIcon' : ''
                      }`}
                      size="25px"
                    />
                    <input
                      type="file"
                      name="image-uploader"
                      onChange={onSelectFile}
                      id="image-uploader"
                      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf, image/*, video/*, audio/*"
                      className={`inputfile ${
                        toggleBackgrounDColor ? 'inputfilebutton' : ''
                      }`}
                    />
                  </div>

                  {progressValue ? (
                    <div className="progressWrapper">
                      <TiTick
                        style={
                          toggleBackgrounDColor
                            ? {
                                color: '#e8eaed',
                                marginRight: '5px',
                              }
                            : {
                                color: 'black',
                                marginRight: '5px',
                              }
                        }
                        size="30px"
                      />
                      <span
                        style={
                          toggleBackgrounDColor
                            ? {
                                color: '#e8eaed',

                                fontWeight: '600',
                              }
                            : {
                                color: 'black',

                                fontWeight: '600',
                              }
                        }
                      >
                        {`${fileUrl
                          ?.substring(
                            fileUrl?.lastIndexOf('/'),
                            fileUrl?.lastIndexOf('.')
                          )
                          .slice(1)} uploaded sucessfully`}
                      </span>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {!checkBoxActive && (
          <div
            className="button_wrapper"
            style={
              toggleBackgrounDColor
                ? {
                    borderBottom: '2px solid rgb(232, 234, 237)',
                  }
                : {
                    borderBottom: '2px solid black',
                  }
            }
          >
            {
              <button
                className="submitHandler"
                onClick={submitHandler}
                style={
                  toggleBackgrounDColor
                    ? {
                        backgroundColor: 'rgb(32, 33, 36)',
                        color: '#e8eaed',
                        border: ' 2px solid #e8eaed',
                      }
                    : {
                        backgroundColor: 'black',
                        color: 'white',
                      }
                }
              >
                Submit
              </button>
            }
            <span
              className="closeButton"
              onClick={closeFormHandler}
              style={
                toggleBackgrounDColor
                  ? { color: '#e8eaed' }
                  : { color: 'black' }
              }
            >
              Close
            </span>
          </div>
        )}
        <div></div>
      </div>
      <div
        className="switchDisplayNotes"
        style={
          toggleBackgrounDColor
            ? {
                color: 'rgb(232, 234, 237)',
              }
            : {
                color: 'grey',
              }
        }
      >
        <p className="switchNotesText">My Notes</p>
        <Switch onChange={(event) => setShowNotes(event)} />
        <p className="switchNotesText">Shared Notes</p>
      </div>
      {showNotes ? (
        <SharedNotes displayedNote={displayedNote} />
      ) : (
        <>
          <DisplayedNotes
            displayedNote={displayedNote}
            getNotes={getUserNotes}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;
