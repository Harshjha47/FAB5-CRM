import React from 'react'
import CustomerCard from './CustomerCard'
import { useAuth } from '../../Context/AuthContext'
import { useCustomer } from '../../Context/CustomerContext';

function CustomerList() {
        const {profileData}=useAuth()
          const { filteredData, setFilteredData } = useCustomer();
        
        
  
  return (
    <section className='grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 pb-3'>
      {filteredData?.map((e,i)=>{
        return <CustomerCard key={i} information={e}/>

      })}
        
    </section>
  )
}

export default CustomerList