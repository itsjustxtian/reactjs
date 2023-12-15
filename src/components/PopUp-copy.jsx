// Popup.jsx
import React from 'react';

const Popup = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'display-block' : 'display-none';

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
          <div className='popup-content'>
            <div className='popup-inner'>
              {children}
            </div>
          </div>
      </section>
    </div>
  );
};

export default Popup;
