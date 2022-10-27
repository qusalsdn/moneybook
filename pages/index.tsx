import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const month = new Date();
  return (
    <div>
      <div>
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>{month.getMonth() + 1}</span>
        <FontAwesomeIcon icon={faArrowRight} />
      </div>
      <div>
        <span>지출 </span>
        <span>수입 </span>
      </div>
    </div>
  );
};

export default Home;
