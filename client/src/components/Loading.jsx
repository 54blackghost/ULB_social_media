import React from 'react'

export const Loading = () => {
  return (
    <div style={{ height: '100%' }} className='flex items-center justify-center h-screen'>
           <div className="w-10 h-10 rounded-full border-3 border-purple-500 border-t-transparent animate-spin"></div>
    </div>
  )
}
