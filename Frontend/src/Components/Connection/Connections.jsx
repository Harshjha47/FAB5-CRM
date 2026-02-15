import React from 'react'
import { useAuth } from '../../Context/AuthContext'
import ConnectionItem from './ConnectionItem'
import { useCustomer } from '../../Context/CustomerContext';

function Connections() {
    const {allData} = useAuth()
    const {
            filteredData,
          } = useCustomer();
  return (
    <section className='w-full flex flex-col gap-2  p-2'>
        {filteredData?.connections?.map((e,i)=>{
            return <ConnectionItem info={e} key={i} />
        })}
        
    </section>
  )
}

export default Connections