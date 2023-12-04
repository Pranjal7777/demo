import React from 'react'
import CreatorAgency from './CreatorAgency'
import AgencySideBar from './AgencySideBar'
import Employee from './Employee'
import StatusLog from './StatusLog'
import AgencyProfile from './AgencyProfile'
import AgencyMyprofile from './AgencyMyprofile'
import AddEmployee from './AddEmployee'
import { getCookie } from '../../lib/session'
import MyProfile from './MyProfile'

const DvAgancyLayout = (props) => {
  let userType = getCookie("userType");
  let userRole = getCookie("userRole") || "ADMIN";
  let pageContent = () => {
    switch (props.activeLink) {
      case "agencyEmployee":
        return (
          <Employee />
        )
      case "statusLog":
        return (
          <StatusLog />
        )
      case "agencyProfile":
        return (
          <AgencyProfile />
        )
      case "agencyMyprofile":
        return (
          <AgencyMyprofile />
        )
      case "addEmployee":
        return (
          <AddEmployee />
        )
      case "my_profile":
        return (
          <MyProfile />
        )
      default:
        return (
          <CreatorAgency />

        )
    }
  }
  return (
    <div className='d-flex flex-row w-100'>
      <AgencySideBar />
      {pageContent()}
    </div>
  )
}

export default DvAgancyLayout