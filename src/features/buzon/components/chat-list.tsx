import { Chat } from '../data/mocks'
import { ChatListItem } from './chat-list-item'

interface ChatListProps {
  chats: Chat[]
  selectedChatId?: string
  onSelectChat: (id: string) => void
}

export function ChatList({ chats, selectedChatId, onSelectChat }: ChatListProps) {
  if (chats.length === 0) {
    return (
      <div className='p-8 text-center text-sm text-muted-foreground'>
        No hay chats para este filtro.
      </div>
    )
  }

  return (
    <div className='divide-y divide-border/50'>
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isSelected={selectedChatId === chat.id}
          onClick={onSelectChat}
        />
      ))}
    </div>
  )
}
