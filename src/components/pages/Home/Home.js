import logo from '../../../assets/logo.svg';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <header className="home-header">
        <img src={logo} className="home-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="home-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <button className="btn btn-primary">Click me</button>
    </div>
  );
}

export default Home;
