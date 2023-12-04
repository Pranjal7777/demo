import { Avatar } from '@material-ui/core'
import React from 'react'

const AvatarImage = (props) => {
  const { userName, src, width, height, style, className, isCustom = false } = props;
  return (
    <React.Fragment>
      <Avatar
        src={src || ''}
        width={width || 'auto'}
        height={height || 'auto'}
        style={{ ...style } || {}}
        className={`${isCustom ? '' : 'mv_profile_logo chat_prof_logo'} ${className} callout-none`}>
        {userName &&
          <span className="avatar_txt capitalize">
            {userName[0]}
          </span>}
      </Avatar>
    </React.Fragment>
  )
}

export default AvatarImage
