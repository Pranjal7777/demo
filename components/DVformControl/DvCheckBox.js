import React from 'react';

const DvCheckBox = (props) => {
  return (
    <div>
      <div className="cntr">
        <input type="checkbox" id="cbx" className="hidden-xs-up"  {...props} />
        <label htmlFor="cbx" className="cbx"></label>
      </div>
      <style jsx>{`
        .cbx {
          position: relative;
          top: 2px;
          width: 15px;
          height: 15px;
          border: 1px solid #c8ccd4;
          border-radius: 3px;
          vertical-align: middle;
          transition: background 0.1s ease;
          cursor: pointer;
          display: block;
        }
        
        .cbx:after {
          content: '';
          position: absolute;
          top: 2px;
          left: 5px;
          width: 4px;
          height: 9px;
          opacity: 0;
          transform: rotate(45deg) scale(0);
          border-right: 2px solid #fff;
          border-bottom: 2px solid #fff;
          transition: all 0.3s ease;
          transition-delay: 0.15s;
        }
        
        .lbl {
          margin-left: 5px;
          vertical-align: middle;
          cursor: pointer;
        }
        
        #cbx:checked ~ .cbx {
          border-color: transparent;
          background: var(--l_base);
          animation: jelly 0.6s ease;
        }
        
        #cbx:checked ~ .cbx:after {
          opacity: 1;
          transform: rotate(45deg) scale(1);
        }
        
        .cntr {
          position: relative;
        }
        
        @keyframes jelly {
          from {
            transform: scale(1, 1);
          }
        
          30% {
            transform: scale(1.25, 0.75);
          }
        
          40% {
            transform: scale(0.75, 1.25);
          }
        
          50% {
            transform: scale(1.15, 0.85);
          }
        
          65% {
            transform: scale(0.95, 1.05);
          }
        
          75% {
            transform: scale(1.05, 0.95);
          }
        
          to {
            transform: scale(1, 1);
          }
        }
        
        .hidden-xs-up {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default DvCheckBox;
