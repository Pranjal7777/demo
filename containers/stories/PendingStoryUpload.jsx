import React from 'react'
import useLang from '../../hooks/language'

const PendingStoryUpload = (props) => {
  const [lang] = useLang();
  return (
    <div>
      <div style={{
        wordBreak: 'break-word',
        width: '100%',
        minHeight: '350px',
        padding: '10px',
        textAlign: 'center',
        wordWrap: 'break-word',
      }}
        className='d-flex justify-content-center align-items-center'
      >
        <p
          className="text-white"
          style={{
          }}>{lang.storyPending}</p>
      </div>
      <div style={{
        position: 'absolute',
        bottom: '0',
        width: '100%',
        zIndex: '1000'
      }}>
      </div>
    </div>
  )
}

export default PendingStoryUpload