// Popup.jsx
import React from 'react';

const Popup = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className='popup-content'>
          {children}
        </div>
      </section>
    </div>
  );
};

export default Popup;
