import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useConnection } from '../../Context/ConnectionContext'
import EditIpConnection from './EditIpConnection'
import EditIllConnection from './EditIllConnection'
import EditServiceConnection from './EditServiceConnection'

function EditRegectedConnection() {
    const {id,cid}=useParams()
    const {getConnectionById,singleConnectionData}=useConnection()
    useEffect(()=>{
        getConnectionById(cid)
    },[])
    console.log(singleConnectionData);

    if (singleConnectionData?.serviceType==="IP") {
          return <EditIpConnection/>
    }
    else if (singleConnectionData?.serviceType==="ILL") {
          return <EditIllConnection/>
    }else{
        return <EditServiceConnection/>
    }
    

}

export default EditRegectedConnection