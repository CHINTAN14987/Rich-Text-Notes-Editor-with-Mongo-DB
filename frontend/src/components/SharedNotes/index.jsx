import React, { useState } from 'react';
import Portal from '../Portal';
import './SharedNotes.css';
import JoditEditor from 'jodit-react';
import 'jodit/build/jodit.min.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useSelector } from 'react-redux';

const ShareNotes = ({ displayedNote }) => {
  const [openPortal, setOpenPortal] = useState(false);
  const toggleBackgrounDColor = useSelector(
    (state) => state.NotesReducer.ToggleColor
  );

  const config = {
    readonly: true,
  };

  const imageClickHandler = () => {
    setOpenPortal(true);
  };
  return (
    <>
      {displayedNote.length > 0 ? (
        <div className="shared_wrapper">
          {displayedNote?.map((note) => {
            const { title, _id, fileUrl, color, content } = note;
            return (
              <div
                key={_id}
                className="shared_Item"
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
                    className="shared_heading"
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

                  {/* {openNoteModal && itemID1 === _id && (
                <ShareNoteModalPortal
                  closeShareNoteModalPortal={() => {
                    setOpenNoteModal(false);
                  }}
                  noteID={noteID}
                />
              )} */}
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
                  <JoditEditor value={content} config={config} tabIndex={1} />
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
                          className="sharedImageItem"
                          src={fileUrl}
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
                          <span>File Name:</span>
                          <span>
                            {fileUrl
                              ?.substring(
                                fileUrl?.lastIndexOf('/'),
                                fileUrl?.lastIndexOf('.')
                              )
                              .slice(1)}
                          </span>
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
        </div>
      ) : (
        <div
          className="noSharedNotes"
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
          <h3>No Shared Notes Found</h3>
        </div>
      )}
    </>
  );
};

export default ShareNotes;
