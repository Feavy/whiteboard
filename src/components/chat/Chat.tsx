import AvatarIcon from '@mui/icons-material/AccountCircle';
import './Chat.css'

function Chat() {
  return (
      <div id="chat">
        <h2>Chat</h2>
        <div className="message">
          <div className="sender">
            <AvatarIcon/>
            <div>
            <div className="message-sender">John Doe</div>
          <div className="message-content">Hello World!</div>

            </div>
          </div>
        </div>
        <div className="message">
          <div className="message-sender">Jane Doe</div>
          <div className="message-content">Hello World!</div>
        </div>
      </div>
  )
}

export default Chat;
