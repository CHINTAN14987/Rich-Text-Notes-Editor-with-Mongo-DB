import React, { useState } from 'react';
import { GiCancel } from 'react-icons/gi';
import ReactDOM from 'react-dom';
import { Button, Checkbox, Form, Input } from 'antd';
import './ShareNotePortal.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const ShareNoteportal = ({ closePortal, noteID }) => {
  const token = localStorage.getItem('accessToken');
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  const [emails, setEmails] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  const handleFocus = (event) => {
    setErrorMessage('');
  };

  function validateEmails(emails) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const emailList = emails.replace(/\s/g, '').split(/,|;/);
    for (var i = 0; i < emailList.length; i++) {
      if (!regex.test(emailList[i])) {
        return { isValid: false, emailList: [] };
      }
    }
    return { isValid: true, emailList };
  }

  const onSubmitHandler = async () => {
    const { isValid, emailList } = validateEmails(emails);
    if (!isValid) {
      setErrorMessage('Invalid Input Formate');
    }
    const payload = {
      noteId: noteID,
      emailList,
    };
    const {
      data: { isNoteUpdated, message },
    } = await axios.put(
      `${process.env.REACT_APP_API_ENDPOINT}/shareNote`,
      payload,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (isNoteUpdated) {
      await Toast.fire({
        icon: 'success',
        title: message,
      });
      closePortal();
    }
  };

  return (
    <>
      <div className="Modal_Wrapper">
        <div className="cancelModalPortal" onClick={closePortal}>
          <GiCancel size="30px" fill="#e8eaed" />
        </div>

        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Share To"
            name="emails"
            rules={[
              {
                required: true,
                message: '',
              },
            ]}
          >
            <Input
              onChange={(event) => setEmails(event.target.value)}
              onFocus={handleFocus}
            />
          </Form.Item>
          <p className="Input_Error">{errorMessage}</p>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" onClick={onSubmitHandler}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
const ShareNoteModalPortal = ({ closeShareNoteModalPortal, noteID }) => {
  return ReactDOM.createPortal(
    <ShareNoteportal closePortal={closeShareNoteModalPortal} noteID={noteID} />,
    document.getElementById('sharenotemodal')
  );
};

export default ShareNoteModalPortal;
