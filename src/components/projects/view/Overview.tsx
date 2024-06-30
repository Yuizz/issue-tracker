import React from 'react'

type Props = {
  name: string;
}

function Overview({ name }: Props) {
  return (
    <div>{name}</div>
  )
}

export default Overview