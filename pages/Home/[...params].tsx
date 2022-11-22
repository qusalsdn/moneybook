import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faXmark, faTrashCan, faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { dbService } from "../../src/fBase";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const nowDate = new Date();

let todayYear = nowDate.getFullYear();
let todayMonth = nowDate.getMonth() + 1;

// 페이지의 기능을 통해 날짜가 변경될 때마다 동적으로 값을 변경하기 위해 선언
let countYear = 0;
let countMonth = 0;

const week = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
// 가계부 내역을 저장했을 때 저장한 해당 '년도'와 '월'로 이동하기 위해 선언
let afterYear = 0;
let afterMonth = 0;

const Detail = () => {
  const [details, setDetails] = useState<any[]>([]); // 로그인한 id의 가계부 내역
  const [classification, setClassification] = useState(""); // 카테고리 선택에 따른 값
  // 초기화 및 가계부 내역을 추가할 때 라디오 버튼의 체크가 해제 되어야 하는데 그것을 확인하는 유무
  const [checkedType, setCheckedType] = useState("spending");
  const [year, setYear] = useState(0); // input 값의 '년도'
  const [month, setMonth] = useState(0); // input 값의 '월'
  const [day, setDay] = useState(0); // input 값의 '일'
  const [inputs, setInputs] = useState({
    category: "",
    money: "",
    memo: "",
  }); // input 값의 '카테고리', '금액', '메모'
  const [income, setIncome] = useState<any>(0); // 수입 총액
  const [spending, setSpending] = useState<any>(0); // 지출 총액
  const [newYear, setNewYear] = useState(0); // 페이지에 보여지는 동적인 '년도'
  const [newMonth, setNewMonth] = useState(0); // 페이지에 보여지는 동적인 '월'
  const [loading, setLoading] = useState(true);
  // 수정할 때 페이지 애니메이션을 위해 선언
  const [visibility, setVisibility] = useState(false);
  const [changeClassName, setChangeClassName] = useState("");
  const [fieldId, setFieldId] = useState("");

  const router = useRouter();
  const { params }: any = router.query;
  const userObj = params[0];
  const paramsYear = Number(params[1]);
  const paramsMonth = Number(params[2]);

  useEffect(() => {
    const q = query(collection(dbService, userObj), where("year", "==", paramsYear), where("month", "==", paramsMonth));
    onSnapshot(q, (querySnapshot) => {
      const newDetail = querySnapshot.docs.map((doc) => ({ fieldId: doc.id, ...doc.data() }));
      setDetails(newDetail);
    });
    // 처음 랜더링 될 때 초기값으로 '해당년도'의 값을 넣어준다.
    setNewYear(paramsYear);
    setNewMonth(paramsMonth);
    setLoading(false);
    countYear = paramsYear;
    countMonth = paramsMonth;
  }, []);

  useEffect(() => {
    const incomeList: any = [];
    const spendingList: any = [];
    details.forEach((detail) => {
      if (detail.classification === "income") {
        incomeList.push(Number(detail.money));
      } else {
        spendingList.push(Number(detail.money));
      }
    });
    let incomeSum = 0;
    let spendingSum = 0;

    incomeList.forEach((income: any) => {
      incomeSum += income;
    });
    const incomeResult = incomeSum.toLocaleString();

    spendingList.forEach((spending: any) => {
      spendingSum += spending;
    });
    const spendingResult = spendingSum.toLocaleString();

    setIncome(incomeResult);
    setSpending(spendingResult);
  }, [details]);

  // 페이지에서 동적으로 '월'를 변경할 때 해당 '월'에 대한 가계부 내역을 가져온다.
  useEffect(() => {
    const q = query(collection(dbService, userObj), where("year", "==", newYear), where("month", "==", newMonth));
    onSnapshot(q, (querySnapshot) => {
      const newDetail = querySnapshot.docs.map((doc) => ({ fieldId: doc.id, ...doc.data() }));
      setDetails(newDetail);
    });
    setLoading(false);
  }, [newYear, newMonth]);

  // 해당 '월'에 대한 가계부 내역을 출력해주는 함수
  const createDetail = () => {
    let render: any = [];
    const days: any = [];

    // 가계부 내역에 있는 '일(day)'의 중복을 제거하고 오름차순으로 정렬
    details.forEach((detail) => {
      days.push(detail.day);
    });
    const newDays = Array.from(new Set(days));
    newDays.sort((a: any, b: any) => {
      return a - b;
    });

    const dayMoney = (day: any, classification: any) => {
      let incomeResult = 0;
      let spendingResult = 0;
      details.forEach((detail) => {
        if (day === detail.day) {
          if (detail.classification === "income") {
            incomeResult += Number(detail.money);
          } else {
            spendingResult += Number(detail.money);
          }
        }
      });
      if (classification === "income") {
        return incomeResult.toLocaleString();
      } else {
        return spendingResult.toLocaleString();
      }
    };

    // 해당 정렬된 '일(day)' 별로 가계부 내역을 출력해준다.
    newDays.forEach((day) => {
      const dayOfWeek = week[new Date(`${newYear}-${newMonth}-${day}`).getDay()];
      render.push(
        <>
          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
                {`${newYear}-${newMonth}-${day}`} {dayOfWeek}
              </h1>
              <div>
                {dayMoney(day, "income") === "0" ? (
                  ""
                ) : (
                  <span style={{ color: "#00C68E" }}>+{`${dayMoney(day, "income")}`}</span>
                )}
                {dayMoney(day, "spending") === "0" ? (
                  ""
                ) : (
                  <span style={{ marginLeft: "10px" }}>-{`${dayMoney(day, "spending")}`}</span>
                )}
              </div>
            </div>
            <hr />
            {details.map((detail) => {
              if (day === detail.day) {
                return (
                  <>
                    <div
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      onClick={() => {
                        setFieldId(detail.fieldId);
                        setVisibility(true);
                        setChangeClassName("updateWindowVisible");
                        setInputs({
                          ...inputs,
                          ["money"]: detail.money,
                          ["category"]: detail.category,
                          ["memo"]: detail.memo,
                        });
                        setClassification(detail.classification);
                        setCheckedType(detail.classification);
                        setYear(detail.year);
                        setMonth(detail.month);
                        setDay(detail.day);
                      }}
                      className="test"
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            marginRight: "20px",
                            padding: "10px 15px",
                            backgroundColor: "#00C68E",
                            color: "white",
                            borderRadius: "8px",
                          }}
                        >
                          {detail.category}
                        </span>
                        <span>{detail.memo} </span>
                      </div>
                      <span>
                        {detail.classification === "income"
                          ? `+${Number(detail.money).toLocaleString()}원`
                          : `-${Number(detail.money).toLocaleString()}원`}
                      </span>
                    </div>
                    <hr />
                  </>
                );
              }
            })}
          </div>
        </>
      );
    });
    return render;
  };

  // 카테고리 값이 바뀔 때마다 카테고리 값과 라디오 버튼 체크 유무 값을 변경하는 함수
  const onChangeClassification = (e: any) => {
    const {
      target: { value },
    } = e;
    setClassification(value);
    setCheckedType(value);
  };

  // 날짜 값이 바뀔 때마다 값을 변경하는 함수
  const onChangeDate = (e: any) => {
    const {
      target: { valueAsDate },
    } = e;
    setYear(valueAsDate.getFullYear());
    setMonth(valueAsDate.getMonth() + 1);
    setDay(valueAsDate.getDate());
    afterYear = valueAsDate.getFullYear();
    afterMonth = valueAsDate.getMonth() + 1;
  };

  // 카테고리, 금액, 메모 값이 바뀔 때마다 값을 변경하는 함수
  const { category, money, memo } = inputs;
  const onChange = (e: any) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  // 날짜 상세조회 값이 바뀔 때마다 값을 변경하는 함수
  const onChangeMonth = (e: any) => {
    const {
      target: { value },
    } = e;
    const date = value.split("-");
    setNewYear(Number(date[0]));
    setNewMonth(Number(date[1]));
    countYear = Number(date[0]);
    countMonth = Number(date[1]);
    afterYear = Number(date[0]);
    afterMonth = Number(date[1]);
    setChangeClassName("updateWindowHidden");
    setTimeout(() => {
      setVisibility(false);
    }, 400);
  };

  // 현재날짜로 이동시켜주는 함수
  const onClickNowDate = () => {
    setNewYear(todayYear);
    setNewMonth(todayMonth);
    countYear = todayYear;
    countMonth = todayMonth;
    setChangeClassName("updateWindowHidden");
    setTimeout(() => {
      setVisibility(false);
    }, 400);
  };

  // 초기화 버튼을 클릭하면 모든 값을 초기화하는 함수
  const onClickReset = () => {
    setCheckedType("");
    setYear(0);
    setMonth(0);
    setDay(0);
    setInputs({
      category: "",
      money: "",
      memo: "",
    });
  };

  // 저장 버튼을 누르면 DB에 값을 저장하고 저장한 '년도' 및 '달'로 이동하는 함수
  const onSubmit = async (e: any) => {
    e.preventDefault();
    await addDoc(collection(dbService, userObj), {
      classification: classification,
      year: year,
      month: month,
      day: day,
      category: category,
      money: money,
      memo: memo,
      createAt: Date.now(),
    });
    setCheckedType("");
    setYear(0);
    setMonth(0);
    setDay(0);
    setInputs({
      category: "",
      money: "",
      memo: "",
    });
    setNewYear(afterYear);
    setNewMonth(afterMonth);
    countYear = afterYear;
    countMonth = afterMonth;
  };

  const onSubmitUpdate = async (e: any) => {
    e.preventDefault();
    const q = doc(dbService, userObj, fieldId);
    await updateDoc(q, {
      money: money,
      classification: classification,
      year: year,
      month: month,
      day: day,
      category: category,
      memo: memo,
    });
    setChangeClassName("updateWindowHidden");
    setTimeout(() => {
      setVisibility(false);
    }, 400);
    onClickReset();
  };

  const onClickDelete = async () => {
    const ok = window.confirm("정말 가계부 내역을 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(doc(dbService, userObj, fieldId));
      setChangeClassName("updateWindowHidden");
      setTimeout(() => {
        setVisibility(false);
      }, 400);
      onClickReset();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100vw",
        maxWidth: "700px",
        margin: "80px auto 0px",
      }}
    >
      <div style={{ display: "flex" }}>
        <div>
          <div>
            <h1>{newYear}</h1>
            <FontAwesomeIcon
              icon={faCaretLeft}
              style={{ cursor: "pointer" }}
              onClick={() => {
                let nextCheck = true;
                --countMonth;

                if (countMonth < 1) {
                  --countYear;
                  if (countYear < 2020) {
                    alert("2020년 이전의 기록은 기록할 수 없습니다.");
                    setNewYear(2020);
                    setNewMonth(1);
                    countYear = 2020;
                    countMonth = 1;
                    nextCheck = false;
                  } else {
                    setNewYear(countYear);
                  }

                  if (nextCheck) {
                    setNewMonth(12);
                    countMonth = 12;
                  }
                } else {
                  setNewMonth(countMonth);
                  setLoading(true);
                }
                setChangeClassName("updateWindowHidden");
                setTimeout(() => {
                  setVisibility(false);
                }, 400);
              }}
            />
            <span>{newMonth}</span>
            <FontAwesomeIcon
              icon={faCaretRight}
              style={{ cursor: "pointer" }}
              onClick={() => {
                let nextCheck = true;
                ++countMonth;

                if (countMonth > 12) {
                  ++countYear;
                  if (countYear > 2023) {
                    alert("2023년 이후의 기록은 기록할 수 없습니다.");
                    setNewYear(2023);
                    setMonth(12);
                    countYear = 2023;
                    countMonth = 12;
                    nextCheck = false;
                  } else {
                    setNewYear(countYear);
                  }

                  if (nextCheck) {
                    setNewMonth(1);
                    countMonth = 1;
                  }
                } else {
                  setNewMonth(countMonth);
                  setLoading(true);
                }
                setChangeClassName("updateWindowHidden");
                setTimeout(() => {
                  setVisibility(false);
                }, 400);
              }}
            />
          </div>
        </div>
        <div>
          <select name="month" onChange={onChangeMonth} value={`${newYear}-${newMonth}`}>
            <option value="2020-1">2020년 1월</option>
            <option value="2020-2">2020년 2월</option>
            <option value="2020-3">2020년 3월</option>
            <option value="2020-4">2020년 4월</option>
            <option value="2020-5">2020년 5월</option>
            <option value="2020-6">2020년 6월</option>
            <option value="2020-7">2020년 7월</option>
            <option value="2020-8">2020년 8월</option>
            <option value="2020-9">2020년 9월</option>
            <option value="2020-10">2020년 10월</option>
            <option value="2020-11">2020년 11월</option>
            <option value="2020-12">2020년 12월</option>
            <option value="2021-1">2021년 1월</option>
            <option value="2021-2">2021년 2월</option>
            <option value="2021-3">2021년 3월</option>
            <option value="2021-4">2021년 4월</option>
            <option value="2021-5">2021년 5월</option>
            <option value="2021-6">2021년 6월</option>
            <option value="2021-7">2021년 7월</option>
            <option value="2021-8">2021년 8월</option>
            <option value="2021-9">2021년 9월</option>
            <option value="2021-10">2021년 10월</option>
            <option value="2021-11">2021년 11월</option>
            <option value="2021-12">2021년 12월</option>
            <option value="2022-1">2022년 1월</option>
            <option value="2022-2">2022년 2월</option>
            <option value="2022-3">2022년 3월</option>
            <option value="2022-4">2022년 4월</option>
            <option value="2022-5">2022년 5월</option>
            <option value="2022-6">2022년 6월</option>
            <option value="2022-7">2022년 7월</option>
            <option value="2022-8">2022년 8월</option>
            <option value="2022-9">2022년 9월</option>
            <option value="2022-10">2022년 10월</option>
            <option value="2022-11">2022년 11월</option>
            <option value="2022-12">2022년 12월</option>
            <option value="2023-1">2023년 1월</option>
            <option value="2023-2">2023년 2월</option>
            <option value="2023-3">2023년 3월</option>
            <option value="2023-4">2023년 4월</option>
            <option value="2023-5">2023년 5월</option>
            <option value="2023-6">2023년 6월</option>
            <option value="2023-7">2023년 7월</option>
            <option value="2023-8">2023년 8월</option>
            <option value="2023-9">2023년 9월</option>
            <option value="2023-10">2023년 10월</option>
            <option value="2023-11">2023년 11월</option>
            <option value="2023-12">2023년 12월</option>
          </select>
          <button type="button" onClick={onClickNowDate}>
            현재 달로 이동
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", width: "700px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>지출 {spending}원</span>
          <span>수입 {income}원</span>
        </div>
        <div>
          <Link href={`/Statistics/${userObj}/${newYear}/${newMonth}`}>
            <button>분석</button>
          </Link>
        </div>
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
                required
              />
              <label>수입</label>
              <input
                type="radio"
                value="spending"
                name="classification"
                onChange={onChangeClassification}
                checked={checkedType === "spending" ? true : false}
                required
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
              <input
                type="date"
                min="2020-01-01"
                max="2023-12-31"
                name="date"
                onChange={onChangeDate}
                value={`${year}-${month < 10 ? `0${month}` : `${month}`}-${day < 10 ? `0${day}` : `${day}`}`}
                required
              />
            </div>
            <div>
              <span>카테고리</span>
              {classification === "income" ? (
                <select
                  name="category"
                  id="category-select"
                  onChange={onChange}
                  value={category}
                  required
                  style={{ border: "none", borderBottom: "1px solid gray", outline: "0" }}
                >
                  <option value="">선택하세요</option>
                  <option value="급여">급여</option>
                  <option value="용돈">용돈</option>
                  <option value="금융수입">금융수입</option>
                  <option value="사업수입">사업수입</option>
                  <option value="기타수입">기타수입</option>
                </select>
              ) : (
                <select
                  name="category"
                  id="category-select"
                  onChange={onChange}
                  value={category}
                  required
                  style={{ border: "none", borderBottom: "1px solid gray", outline: "0" }}
                >
                  <option value="">선택하세요</option>
                  <option value="식비">식비</option>
                  <option value="카페">카페/간식</option>
                  <option value="술">술/유흥</option>
                  <option value="생활">생활</option>
                  <option value="쇼핑">쇼핑</option>
                  <option value="뷰티">뷰티/미용</option>
                  <option value="교통">교통</option>
                  <option value="자동차">자동차</option>
                  <option value="주거">주거/통신</option>
                  <option value="의료">의료/건상</option>
                  <option value="금융">금융</option>
                  <option value="문화">문화/여가</option>
                  <option value="여행">여행/숙바</option>
                  <option value="교육">교육/학습</option>
                  <option value="자녀">자녀/육아</option>
                  <option value="반려동물">반려동물</option>
                  <option value="선물">경조/선물</option>
                </select>
              )}
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div>
              <span>금액</span>
              <input type="text" name="money" onChange={onChange} value={money} required />
            </div>
            <div>
              <span>메모</span>
              <input type="text" name="memo" onChange={onChange} value={memo} required />
            </div>
          </div>
          <button type="submit">저장</button>
        </form>
      </div>
      <hr style={{ height: "5px", backgroundColor: "gray", opacity: "0.5", border: "0px" }} />

      <div style={{ width: "100%" }}>
        {loading ? (
          <FontAwesomeIcon
            icon={faSpinner}
            style={{ width: "100%", justifyContent: "center", fontSize: "50px", fontWeight: "bold", marginTop: "50px" }}
          />
        ) : (
          createDetail()
        )}
      </div>

      {visibility && (
        <div
          className={`${changeClassName}`}
          style={{
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            bottom: "50px",
            width: "400px",
            height: "400px",
            backgroundColor: "gray",
            borderRadius: "20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
            <FontAwesomeIcon
              icon={faXmark}
              style={{ marginRight: "15px", marginTop: "10px" }}
              onClick={() => {
                setChangeClassName("updateWindowHidden");
                setTimeout(() => {
                  setVisibility(false);
                }, 400);
                onClickReset();
              }}
            />
          </div>

          <div>
            <form onSubmit={onSubmitUpdate}>
              <input type="text" name="money" onChange={onChange} value={money} required />
              <div>
                <span>분류</span>
                <input
                  type="radio"
                  value="income"
                  name="classification"
                  onChange={onChangeClassification}
                  checked={checkedType === "income" ? true : false}
                  required
                />
                <label>수입</label>
                <input
                  type="radio"
                  value="spending"
                  name="classification"
                  onChange={onChangeClassification}
                  checked={checkedType === "spending" ? true : false}
                  required
                />
                <label>지출</label>
              </div>
              <div>
                <span>날짜</span>
                <input
                  type="date"
                  min="2020-01-01"
                  max="2023-12-31"
                  name="date"
                  onChange={onChangeDate}
                  value={`${year}-${month < 10 ? `0${month}` : `${month}`}-${day < 10 ? `0${day}` : `${day}`}`}
                  required
                />
              </div>
              <div>
                <span>카테고리</span>
                {classification === "income" ? (
                  <select
                    name="category"
                    id="category-select"
                    onChange={onChange}
                    value={category}
                    required
                    style={{ border: "none", borderBottom: "1px solid gray", outline: "0" }}
                  >
                    <option value="">선택하세요</option>
                    <option value="급여">급여</option>
                    <option value="용돈">용돈</option>
                    <option value="금융수입">금융수입</option>
                    <option value="사업수입">사업수입</option>
                    <option value="기타수입">기타수입</option>
                  </select>
                ) : (
                  <select
                    name="category"
                    id="category-select"
                    onChange={onChange}
                    value={category}
                    required
                    style={{ border: "none", borderBottom: "1px solid gray", outline: "0" }}
                  >
                    <option value="">선택하세요</option>
                    <option value="식비">식비</option>
                    <option value="카페">카페/간식</option>
                    <option value="술">술/유흥</option>
                    <option value="생활">생활</option>
                    <option value="쇼핑">쇼핑</option>
                    <option value="뷰티">뷰티/미용</option>
                    <option value="교통">교통</option>
                    <option value="차동차">자동차</option>
                    <option value="주거">주거/통신</option>
                    <option value="의료">의료/건상</option>
                    <option value="금융">금융</option>
                    <option value="문화">문화/여가</option>
                    <option value="여행">여행/숙바</option>
                    <option value="교육">교육/학습</option>
                    <option value="자녀">자녀/육아</option>
                    <option value="반려동물">반려동물</option>
                    <option value="선물">경조/선물</option>
                  </select>
                )}
              </div>
              <div>
                <span>메모</span>
                <input type="text" name="memo" onChange={onChange} value={memo} required />
              </div>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "150px" }}
              >
                <button type="button" onClick={onClickDelete}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
                <button type="submit" style={{ padding: "20px", backgroundColor: "tomato" }}>
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
