// Dependency Imports
// eslint-disable-next-line no-unused-vars
import React from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line no-unused-vars
import { Link } from 'react-router-dom'

function CustomInput (props) {
  const { id, ...other } = props
  return <input type="text" id={id} {...other} />
}

CustomInput.propTypes = {
  id: PropTypes.string.isRequired
}

export default CustomInput
