import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="splash-screen" onClick={() => navigate('/home')}>
      <h1>MatchTA</h1>
      <p>Click anywhere to begin</p>
    </div>
  );
}
