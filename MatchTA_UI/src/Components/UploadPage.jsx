import { useParams, useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const { id } = useParams();
  const sheetNumber = parseInt(id);
  const nav = useNavigate();

  const nextPage = () => {
    if (sheetNumber < 3) {
      nav(`/Upload/${sheetNumber + 1}`);
    } else {
      nav('/Results');
    }
  };

  return (
    <div className="upload-page">
      <h2>Upload Sheet {sheetNumber}</h2>
      {/* Add upload input and preview logic here */}
      <button onClick={nextPage}>
        Continue
      </button>
    </div>
  );
}
