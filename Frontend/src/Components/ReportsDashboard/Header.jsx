import React from 'react'

function Header() {
  return (
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <img src="/dristi.webp" alt="" className="h-12 w-12" />
            See Clearly. Act Smartly
          </h1>
          <p className="text-slate-500 mt-2">
            Drishti drives your business forward.
          </p>
        </div>
  )
}

export default Header