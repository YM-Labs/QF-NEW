import React, { useEffect, useMemo, useRef } from 'react';
import ReactWebChat, { createDirectLine, createStyleSet } from 'botframework-webchat';
import { styleSetDark, styleSetLight } from './utils/chatbotStyleDefs';
import './WebChat.css';

const WebChat = ({ className, onFetchToken, store, token, lang, darkMode }) => {
  let firstImg = useRef(true);
  let mode = useRef(darkMode);
  const conversationStartProperties = useMemo(() => ({ locale: lang }), [lang]);
  const directLine = useMemo(
    () => createDirectLine({ token, conversationStartProperties }),
    [token, conversationStartProperties]
  );
  const styleSet = useMemo(
    () => createStyleSet(darkMode ? styleSetDark : styleSetLight),
    [darkMode]
  );

  // Hide upload button is not working in set options
  const uploadButton = document.querySelector(".webchat__upload-button");
  if (uploadButton) {
    uploadButton.style.display = "none";
  }

  useEffect(() => {
    onFetchToken();
  }, [onFetchToken]);

  //Insert Botaina img 
  useEffect(() => {
    const form = document.querySelector(".webchat__send-box__main");
    if (mode.current !== darkMode) {
      firstImg.current = true;
      if (form !== null) {
        const img = form.querySelector('img');
        img.remove();
      }      
    }
    if (directLine && firstImg.current) {      
      const img = document.createElement("img");
      //img.src = darkMode ? "/botaina_head_scarf_yello.svg" : "/BOTainanew.png";
      img.src = "/botaina_n.png";
      img.alt = "Logo Qatar Foundation";
      img.width = '46';
      img.height = '46';   
      if (form !== null) {
        form.insertAdjacentElement("afterbegin", img);
      }
      firstImg.current = false;
      mode.current = darkMode;
    }
  }, [directLine, darkMode]); 

  return !!directLine ? (    
          <ReactWebChat
            className={`${className || ''} web-chat`}
            directLine={directLine}
            store={store}
            styleSet={styleSet}
            locale={lang}            
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          />    
  ) : (
    <div className={`${className || ''} connect-spinner`}>
      <div className='content'>
        <div className='icon'>
          <span className='ms-Icon ms-Icon--Robot' />
        </div>
        {lang === 'ar' ? (
          <p>يرجى الانتظار أثناء الاتصال.</p>
        ) : (
          <p>Please wait while we are connecting.</p>
        )}
      </div>
    </div>
  );
};

export default WebChat;
