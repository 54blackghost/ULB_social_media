import React, { useState } from 'react'
import { dummyRecentMessagesData } from '../assets/assets'

const RecentMessages = () => {

    const [messages, setMessages] = useState([])

    const fetchRecentMessages = async () => {
        setMessages(dummyRecentMessagesData)
    }
  return (
    <div>
        RecentMessages
    </div>
  )
}

export default RecentMessages