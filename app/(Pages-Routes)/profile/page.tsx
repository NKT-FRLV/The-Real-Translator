import React from 'react'
import UserInfo from './_components/UserInfo'
import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'

const ProfilePage = async () => {

  const session = await auth()
  const user = session?.user

  if (!user) {
    redirect('/login')
  }

  return (
	<>
		<UserInfo />
		<div className='flex flex-col items-center justify-center'>
			<h1>Profile</h1>
			<p>Profile</p>
		</div>
	</>
  )
}

export default ProfilePage