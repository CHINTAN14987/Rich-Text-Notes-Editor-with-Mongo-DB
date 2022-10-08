import React from 'react';
import './Header.css';
import DarkLogo from './DarkLogo.png';
import LightLogo from './LightMode.jpg';
import { useSelector } from 'react-redux';
import { Switch } from 'antd';
import { NotesActions } from '../../features/notesSlice';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const toggleBackgrounDColor = useSelector(
    (state) => state.NotesReducer.ToggleColor
  );
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { pathname } = useLocation();

  const onChange = (checked) => {
    dispatch(NotesActions.backgroundToggleColor(checked));
  };
  const buttonClickhandler = () => {
    if (pathname === '/login') {
      navigate('/signup');
    }
    if (pathname === '/signup') {
      navigate('/login');
    }
    if (pathname === '/home') {
      localStorage.clear();
      navigate('/login');
      dispatch(NotesActions.backgroundToggleColor(false));
    }
  };
  return (
    <div
      className={`header_component ${
        toggleBackgrounDColor ? 'toggleDarkHeaderMode' : 'toggleLightHeaderMode'
      }`}
      style={
        toggleBackgrounDColor
          ? { backgroundColor: 'black' }
          : { borderBottom: '1px solid #F1F1F1' }
      }
    >
      {console.log(pathname, 'true')}
      {toggleBackgrounDColor ? (
        <img className="ModeLogo" src={DarkLogo} alt="" />
      ) : (
        <img className="ModeLogo" src={LightLogo} alt="" />
      )}
      {console.log(localStorage.getItem('accessToken'))}
      {
        <>
          {pathname.includes('/login') ||
            (pathname !== '/signup' && (
              <div className="switchContainer">
                <div className="modeWrapper">
                  {toggleBackgrounDColor ? (
                    <p
                      style={{
                        color: 'rgb(232, 234, 237)',
                        font: '15px',
                        fontWeight: '700',
                      }}
                    >
                      Switch to Light Theme Mode
                    </p>
                  ) : (
                    <p
                      style={{
                        color: 'grey',
                        font: '15px',
                        fontWeight: '700',
                      }}
                    >
                      Switch to Dark Theme Mode
                    </p>
                  )}
                  <Switch onChange={onChange} />
                </div>
              </div>
            ))}
        </>
      }
      <button
        className="header_button"
        style={
          toggleBackgrounDColor
            ? {
                backgroundColor: 'black',
                color: '#e8eaed',
                border: ' 2px solid #e8eaed',
              }
            : {
                backgroundColor: 'black',
                color: 'white',
              }
        }
        onClick={buttonClickhandler}
      >
        {(pathname === '/login' && 'Sign Up') ||
          (pathname === '/signup' && 'Login') ||
          (pathname !== '/login' || !pathname.includes('/signup')
            ? 'Log Out'
            : '')}
      </button>
    </div>
  );
};

export default Header;
