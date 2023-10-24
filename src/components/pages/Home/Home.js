import PhotoStream from '../../PhotoStream/PhotoStream';
import { useAuth } from '../../AuthContext/AuthContext';

import './Home.css';

const Home = () => {

  return (
    <div className="home-page content" >
      <PhotoStream />

      <div className='home-section features'>
        <div className='planning-section'>
          <div className='planning-text'>
            <h1>Feature-Rich Event Scheduling</h1>
          </div>
          <div className='planning-img'>

          </div>
        </div>

        <div className='photo-section'>
          <div className='photo-img'>

          </div>
          <div className='photo-text'>
            <h1>Seamless Photo Capture</h1>
          </div>
        </div>

        <div className='memories-section'>
          <div className='memories-text'>
            <h1>Preserve Memories with Event Albums</h1>
          </div>
          <div className='memories-img'>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
