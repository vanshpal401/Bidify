import React from 'react'
import BiddersAuctioneersGraph from './BiddersAuctioneersGraph'
import Users from './Users'

const UserDataAndGraph = () => {
  return (
    <div className='w-80% ml-0 h-80% px-5 pt-20 lg:pl-[320px] m-5 flex flex-col gap-10'>
    <BiddersAuctioneersGraph/>
    <h1 className="text-[#d6482b] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl">All Users</h1>
    <Users/>
    </div>
  )
}

export default UserDataAndGraph