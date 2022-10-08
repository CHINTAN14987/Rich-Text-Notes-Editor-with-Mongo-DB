import ReactDOM from 'react-dom';
import './Portal.css';
import { GiCancel } from 'react-icons/gi';

const ImageDisplayed = ({ filePreview, closePortal }) => {
  return (
    <>
      <div className="portal_wrapper">
        <div className="cancelButtonPortal" onClick={closePortal}>
          <GiCancel size="30px" fill="#e8eaed" />
        </div>
        <div className="displayedImagePortal">
          <img className="displayedImagePreview " src={filePreview} alt="" />
        </div>
      </div>
    </>
  );
};
const DisplayedItemPortal = ({ filePreview, closePortal }) => {
  return ReactDOM.createPortal(
    <ImageDisplayed filePreview={filePreview} closePortal={closePortal} />,
    document.getElementById('portal')
  );
};
export default DisplayedItemPortal;
