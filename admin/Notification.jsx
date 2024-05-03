import './Notification.css';

const Notification = () => {
  return (
    <div className='mainNotification'>
        <div className='minnotofititle'><h1>Admin Dashboard</h1></div>
        <div className="notifi">
            <ul>
                <li><i className='fas fa-envelope'></i></li>
                <li><i className='fas fa-user'></i></li>
                <li><i className='fas fa-bell'></i></li>
            </ul>
        </div>
    </div>
  );
};

export default Notification;
