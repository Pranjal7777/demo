import React from 'react';
import { INFO } from '../../../lib/config';

const customLogger = () => {
    const [showLogger, setShowLogger] = React.useState(false);
    const [ messages, setMessages ] = React.useState([]);
    const [pureMessage, setPureMessage] = React.useState([]);

    const handleSaveToPC = jsonData => {
        const fileData = JSON.stringify(jsonData);
        const blob = new Blob([fileData], {type: "text/plain"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${Date.now()}.txt`;
        link.href = url;
        link.click();
      }

    React.useEffect(() => {
        if (typeof console  != "undefined") 
            if (typeof console.log != 'undefined')
                console.olog = console.log;
            else
                console.olog = function() {};

        console.log = function(...message) {
            console.olog(JSON.stringify(message));
            setPureMessage((prev) => ([...prev, message]));
            // $('.custom__console').append('<p>' + message + '</p>');
            const finalMsg = message.map(item => JSON.stringify(item)).join('  ');
            setMessages((prev) => ([...prev, finalMsg]));
        };
        console.error = console.debug = console.info =  console.log;

    }, []);
    const toggleShow = () => setShowLogger(prev => !prev);
    const handleDownload = () => {
        handleSaveToPC(pureMessage);
    };
    const handleClearConsole = () => {
        setMessages([]);
        setPureMessage([]);
    };
    return (
        <>
        <div style={{ position: 'fixed', zIndex: '999999', top: '15px', left: '50%'}}>
            <img onDoubleClick={handleDownload} onClick={toggleShow} src={INFO} width={30} height={30} style={{ cursor: 'pointer' }} />
            {showLogger && <div className="position-absolute custom__console" >
                <span onClick={handleClearConsole} className="clearConsole__custom">-X-</span>
                {
                messages.length && messages.map((item, index) => (
                    <p key={index}>{item}</p>
                ))
            }</div>}
        </div>
        <style jsx="true">
        {`
        .custom__console {
            width: 100vw;
            max-height: 70vh;
            overflow: scroll;
            background: yellow;
            left: 0;
            transform: translateX(-50%);
            top: 54px;
        }
        .clearConsole__custom {
            position: absolute;
            right: 0;
            background: red;
            border-radius: 50%;
            padding: 2px;
            font-size: 12px;
            color: white;
        }
        `
        }
        </style>
        </>
    )
}

export default customLogger;
