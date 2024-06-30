import { Button } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'

function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className='text-9xl font-bold'>404</h2>
      <p className="text-2xl">Project was not found</p>
      <Button href="/" as={Link}>Return to home</Button>
    </div>
  )
}

export default ProjectNotFound