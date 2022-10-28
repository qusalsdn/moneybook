import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Home = () => {
  const [classification, setClassification] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [category, setCategory] = useState("");
  const [money, setMoney] = useState("");
  const [memo, setMemo] = useState("");
  const nowMonth = new Date();

  const onClickClassification = (event: any) => {
    const {
      target: { value },
    } = event;
    setClassification(value);
    console.log(classification);
  };

  const onchangeDate = (event: any) => {
    console.log(event.target.valueAsDate.getMonth().toString());
  };

  const onsubmit = () => {};

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
        maxWidth: "890px",
        margin: "80px auto 0px",
      }}
    >
      <div>
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>{(nowMonth.getMonth() + 1).toString()}</span>
        <FontAwesomeIcon icon={faArrowRight} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>지출 </span>
        <span>수입 </span>
      </div>

      <div>
        <form onSubmit={onsubmit}>
          <div style={{ display: "flex" }}>
            <div>
              <span>분류</span>
              <input type="radio" value="income" name="classification" onChange={onClickClassification} />
              <label>수입</label>
              <input type="radio" value="spending" name="classification" onChange={onClickClassification} />
              <label>지출</label>
            </div>
            <button type="button" style={{ justifyContent: "end" }}>
              초기화
            </button>
          </div>
          <div style={{ display: "flex" }}>
            <div>
              <span>날짜</span>
              <input type="date" onChange={onchangeDate} />
            </div>
            <div>
              <span>카테고리</span>
              <select name="category" id="category-select">
                <option value="">선택하세요</option>
                <option value="food">식비</option>
                <option value="cafe">카페/간식</option>
                <option value="alcohol">술/유흥</option>
                <option value="life">생활</option>
                <option value="shopping">쇼핑</option>
                <option value="beauty">뷰티/미용</option>
                <option value="traffic">교통</option>
                <option value="car">자동차</option>
                <option value="residence">주거/통신</option>
                <option value="medical">의료/건상</option>
                <option value="banking">금융</option>
                <option value="leisure">문화/여가</option>
                <option value="travel">여행/숙바</option>
                <option value="education">교육/학습</option>
                <option value="parenting">자녀/육아</option>
                <option value="pets">반려동물</option>
                <option value="gift">경조/선물</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div>
              <span>금액</span>
              <input type="text" id="money" />
            </div>
            <div>
              <span>메모</span>
              <input type="text" id="memo" />
            </div>
          </div>
        </form>
      </div>
      <button type="submit">저장</button>
    </div>
  );
};

export default Home;
