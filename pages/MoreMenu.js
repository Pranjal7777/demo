import React from 'react'
import DVmoreSideBar from '../containers/DvSidebar/DvmoreSideBar'
import DvSidebar from '../containers/DvSidebar/DvSidebar'

const MoreMenu = () => {
  return (
    <div className='d-flex w-100'>
      <div style={{ width: '19.62%', minWidth: '15.646rem', maxWidth: '19.59rem', background: '#1E1C22', borderRight: '1.5px solid #3D3B45', overflowY: 'auto' }} className='sticky-top vh-100'>
        <DvSidebar fullbar />
      </div>
      <div className='mx-4 mt-4 row' style={{ border: "1px solid #45444d", background: '#18171C', width: '77.77%' }}>
        <div className='col-3 h-100 p-3' style={{ borderRight: "1px solid #45444d" }}>
          <DVmoreSideBar />
        </div>
      </div>

    </div>
  )
}

export default MoreMenu