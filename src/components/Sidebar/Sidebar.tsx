import { createSignal } from 'solid-js';
import './sidebar.css';

const Sidebar = () => {
  const [extended, setExtended] = createSignal(false);

  // Function to toggle the extended state
  const toggleSidebar = () => setExtended(!extended());

  return (
    <div class="sidebar">
      <div class='top'>
        <img class='menu' src="src/assets/menu_icon.png" alt="menu" onClick={toggleSidebar} />

        <div class='new-chat'>
          <img src="src/assets/plus_icon.png" alt="plus" />
          {extended() ? <p>New Chat</p> : null}
        </div>

        {extended() ? (
          <div class='recent'>
            <p class='recent-title'>Recent</p>
            <div class='recent-entry'>
              <img src="src/assets/message_icon.png" alt="message" />
              <p>What is SolidJS?</p>
            </div>
          </div>
        ) : null}
      </div>

      <div class='bottom'>
        <div class='bottom-item recent-entry'>
          <img src="src/assets/question_icon.png" alt="question" />
          {extended() ? <p>Help</p> : null}
        </div>
        <div class='bottom-item recent-entry'>
          <img src="src/assets/history_icon.png" alt="history" />
          {extended() ? <p>Riwayat</p> : null}
        </div>
        <div class='bottom-item recent-entry'>
          <img src="src/assets/setting_icon.png" alt="pengaturan" />
          {extended() ? <p>Pengaturan</p> : null}
        </div>
      </div>
    </div>
    
  );
};

export default Sidebar;
