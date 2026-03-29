import { X } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useConnection } from '../../Context/ConnectionContext'

function CancelOrder() {
  const [panal, setPanal] = useState(false)
  const [reason, setReason] = useState("Port Constraint") // Track the selected reason
  const [isLoading, setIsLoading] = useState(false) // Prevent double-clicks

  // Note: Depending on your setup, the cancel function might actually belong in useConnection
  const { cancel } = useConnection() 
  const { id, cid } = useParams() // Grab customer and connection IDs from URL
  const navigate = useNavigate()

  // The function to handle submitting the cancellation
  const handleCancelSubmit = async () => {
    try {
      setIsLoading(true)
      
      // Call your context function, passing the IDs and the selected reason
      await cancel( cid, {reason:reason})
      
      // Close the modal
      setPanal(false)

      // Navigate back to the customer dashboard so the user sees the updated status
      navigate(`/customer/${id}`)
      
    } catch (error) {
      console.error("Failed to cancel order:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center'>
      <div className="cursor-pointer" onClick={() => setPanal(true)}>
        Cancel
      </div>

      {panal && (
        <div className="fixed top-0 p-2 left-0 h-screen w-full flex justify-center items-center z-50 bg-[#0000001f]">
          <div className="rounded-lg bg-white w-full md:w-[50%] lg:w-[30%] border shadow-[#ff989850] shadow-xl border-[#88888818] p-4 flex flex-col gap-3 items-start">
            
            <h3 className='p-3 rounded-lg text-xl text-red-600 bg-[#ffc8c838]'>
              <X />
            </h3>
            
            <div className="w-full">
              <h4 className='font-semibold text-lg mb-2'>Are you sure you want to Cancel?</h4>
              
              {/* Added value and onChange to bind the select menu to our state */}
              <select 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                className='w-full p-2 border rounded outline-none focus:border-red-400'
              >
                <option value="Port Constraint">Port Constraint</option>
                <option value="High Ring Utilization">High Ring Utilization</option>
                <option value="Customer Refusal">Customer Refusal</option>
                <option value="Other Reason">Other Reason</option>
              </select>
            </div>
            
            <div className="w-full flex gap-2 justify-end py-3">
              <button 
                onClick={() => setPanal(false)} 
                disabled={isLoading}
                className='px-5 rounded-md p-1 border border-zinc-400 hover:bg-zinc-100'
              >
                Close
              </button>
              
              <button 
                onClick={handleCancelSubmit} 
                disabled={isLoading}
                className='px-5 rounded-md p-1 border bg-red-600 text-white border-red-400 hover:bg-red-700 disabled:opacity-50'
              >
                {isLoading ? "Cancelling..." : "Submit"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default CancelOrder