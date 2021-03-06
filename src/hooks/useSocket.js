import { useEffect } from 'react'
import io from 'socket.io-client'

const socket = io()

socket.on('connect', () => {
  console.log(`%c PRE-FRESHY CPE 2021 (v.${process.env.NEXT_PUBLIC_APP_VERSION}) `,
  'text-align: center; background-color: #000000; color: #ffffff; font-size: 0.85rem; border-radius: .25rem; padding: 0.125rem;')

  console.log(`%c 🤖 The Portal to another dimension is opening... `,
  'text-align: center; background-color: #000000; color: #ffffff; font-size: 0.85rem; border-radius: .25rem')
})

export default function useSocket(eventName, cb) {
  useEffect(() => {
    socket.on(eventName, cb)

    return function useSocketCleanup() {
      socket.off(eventName, cb)
    }
  }, [eventName, cb])

  return socket
}