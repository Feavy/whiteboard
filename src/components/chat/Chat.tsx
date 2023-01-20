import AvatarIcon from '@mui/icons-material/AccountCircle';
import './Chat.css'
import {useEffect, useState} from "react";
import {IGS} from "../../ingescape";

function Chat() {

  const [message, setMessage] = useState('Enter a text');

  useEffect(() => {
    IGS.netSetServerURL("ws://localhost:5000");
    IGS.agentSetName("Marioboard");
    IGS.start();
  }, [])

  const handleChange = (event: any) => {
    // 👇 Get input value from "event"
    setMessage(event.target.value);

    let args = [];
    IGS.serviceArgsAddInt()
    const ret = IGS.serviceCall("Whiteboard", "addShape", ['ellipse', 100, 300, 200, 100, 'blue', 'black', 4], '');
    console.log("service returned", ret);
  };

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

        <h2>Message: {message}</h2>

        <input
            type="text"
            id="message"
            name="message"
            onChange={handleChange}
        />
      </div>
  )
}

export default Chat;
