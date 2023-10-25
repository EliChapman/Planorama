import './Home.css';

import PhotoStream from '../../PhotoStream/PhotoStream';
import Screenshot1 from '../../../assets/Screenshot1.png';
import Screenshot2 from '../../../assets/Screenshot1.png';
import { useAuth } from '../../AuthContext/AuthContext';

const Home = () => {

  return (
    <div className="home-page content" >
      <PhotoStream />

      <div className='home-section features'>
        <div className='planning-section'>
          <div className='planning-text'>
            <h1>Feature-Rich Event Scheduling</h1>
            <p>Planorama provides robust, confidential scheduling features for efficient planning. You can even utilize the API to pull events to other apps!</p>
          </div>
          <div className='planning-img'>
            <img src={Screenshot1} alt='Awesome Screenshot1!' />
          </div>
        </div>

        <div className='photo-section'>
          <div className='photo-img'>
            <img src={Screenshot2} alt='Awesome Screenshot2!' />
          </div>
          <div className='photo-text'>
            <h1>Appealing & Intuitive UI</h1>
            <p>Planorama's sleek, user-friendly interface offers an effortless and visually stunning experience. We offer both light and dark modes to accommodate all types of people! </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
