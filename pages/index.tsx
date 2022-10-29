import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const Home = () => {
  const [classification, setClassification] = useState("");
  const [checkedType, setCheckedType] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [inputs, setInputs] = useState({
    category: "",
    money: "",
    memo: "",
  });
  const nowMonth = new Date();

  useEffect(() => {
    console.log(inputs);
  }, [inputs]);

  const onChangeClassification = (e: any) => {
    const {
      target: { value },
    } = e;
    setClassification(value);
    setCheckedType(value);
  };

  const onChangeDate = (e: any) => {
    const {
      target: { valueAsDate },
    } = e;
    setYear(valueAsDate.getFullYear().toString());
    setMonth((valueAsDate.getMonth() + 1).toString());
    setDay(valueAsDate.getDate().toString());
  };

  const { category, money, memo } = inputs;
  const onChange = (e: any) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onClickReset = () => {
    setCheckedType("");
    setYear("");
    setMonth("");
    setDay("");
    setInputs({
      category: "",
      money: "",
      memo: "",
    });
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
  };

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
        <form onSubmit={onSubmit}>
          <div style={{ display: "flex" }}>
            <div>
              <span>분류</span>
              <input
                type="radio"
                value="income"
                name="classification"
                onChange={onChangeClassification}
                checked={checkedType === "income" ? true : false}
              />
              <label>수입</label>
              <input
                type="radio"
                value="spending"
                name="classification"
                onChange={onChangeClassification}
                checked={checkedType === "spending" ? true : false}
              />
              <label>지출</label>
            </div>
            <button type="button" style={{ justifyContent: "end" }} onClick={onClickReset}>
              초기화
            </button>
          </div>
          <div style={{ display: "flex" }}>
            <div>
              <span>날짜</span>
              <input type="date" name="date" onChange={onChangeDate} value={`${year}-${month}-${day}`} />
            </div>
            <div>
              <span>카테고리</span>
              <select name="category" id="category-select" onChange={onChange} value={category}>
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
              <input type="text" name="money" onChange={onChange} value={money} />
            </div>
            <div>
              <span>메모</span>
              <input type="text" name="memo" onChange={onChange} value={memo} />
            </div>
          </div>
          <button type="submit">저장</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
