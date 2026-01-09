import React from 'react'

function Loading() {
  return (
    <div className="h-screen flex items-center fixed top-0 w-full justify-center">
        <div className="border-[10px] p-8 animate-spin rounded-full  border-[#cacaca] border-b-[#111]"></div>
    </div>
  )
}

export default Loading