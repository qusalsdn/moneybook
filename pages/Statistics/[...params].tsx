import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { dbService } from "../../src/fBase";

ChartJS.register(ArcElement, Tooltip, Legend);

const Statistics = () => {
  const [details, setDetails] = useState<any[]>([]);
  const [incomeData, setIncomeData] = useState<any>([]);
  const [spendingData, setSpendingData] = useState<any>([]);
  const [classification, setClassification] = useState("");
  const [checkedType, setCheckedType] = useState("spending");
  const [data, setData] = useState<any>({});
  const [category, setCategory] = useState([]);
  const [money, setMoney] = useState([]);

  const beforeincome: any = [];
  let afterincome: any = [];
  const incomeName: any = [];

  const beforespending: any = [];
  let afterspending: any = [];
  const spendingName: any = [];

  const router = useRouter();
  const { params }: any = router.query;
  const userObj = params[0];
  const year = Number(params[1]);
  const month = Number(params[2]);

  useEffect(() => {
    const q = query(collection(dbService, userObj), where("year", "==", year), where("month", "==", month));
    onSnapshot(q, (querySnapshot) => {
      const newDetail = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
      setDetails(newDetail);
    });
  }, []);

  useEffect(() => {
    details.forEach((detail) => {
      if (detail.classification === "income") {
        beforeincome.push({ category: detail.category, money: Number(detail.money) });
        incomeName.push(detail.category);
      } else {
        beforespending.push({ category: detail.category, money: Number(detail.money) });
        spendingName.push(detail.category);
      }
    });

    // 중복를 제거한 카테고리 배열
    const incomeCategory = Array.from(new Set(incomeName));
    const spendingCategory = Array.from(new Set(spendingName));

    afterincome = new Array(incomeCategory.length);
    afterspending = new Array(spendingCategory.length);

    // 카테고리 중복을 제거하고 카테고리 별로 돈을 합산하는 함수
    const income = createData(beforeincome, afterincome, incomeCategory);
    const spending = createData(beforespending, afterspending, spendingCategory);
    setIncomeData(income);
    setSpendingData(spending);
  }, [details]);

  useEffect(() => {
    if (Object.keys(spendingData).length > 5) {
      const data = createDoughnut();
      setCategory(data[0]);
      setMoney(data[1]);
    } else {
      const data = createDoughnut();
      setCategory(data[0]);
      setMoney(data[1]);
    }
  }, [incomeData, spendingData]);

  useEffect(() => {
    setData({
      labels: category,
      datasets: [
        {
          label: "Statistics",
          data: money,
          backgroundColor: [
            "rgba(255, 0, 0, 0.3)",
            "rgba(54, 162, 235, 0.3)",
            "rgba(255, 206, 86, 0.3)",
            "rgba(75, 192, 192, 0.3)",
            "rgba(153, 102, 255, 0.3)",
            "rgba(128, 128, 128, 0.3)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(128, 128, 128, 0.5)",
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [category, money]);

  // 차트를 그리기 위해 데이터를 생성하는 함수
  const createDoughnut = () => {
    const result = [];
    const category: any = [];
    const money: any = [];
    spendingData.forEach((spending: any) => {
      category.push(spending.category);
      money.push(spending.money);
    });
    result[0] = category;
    result[1] = money;
    return result;
  };

  const createData = (before: any, after: any, category: any) => {
    // 빈 객체 배열 생성
    for (let i = 0; i < after.length; i++) {
      after[i] = {
        category: "",
        money: 0,
      };
    }

    // 중복되는 카테고리가 없기 때문에 해당하는 카테고리 별로 돈을 합산하여 대입
    for (let i = 0; i < category.length; i++) {
      for (let k = 0; k < before.length; k++) {
        if (category[i] === before[k].category) {
          after[i] = {
            category: category[i],
            money: after[i].money + before[k].money,
          };
        }
      }
    }
    // 내림차순으로 정렬
    after.sort((a: any, b: any) => {
      return b.money - a.money;
    });

    // money가 가장 높은 카테고리 5개를 먼저 선정하고 나머지 카테고리는 기타로 분류 후 남은 money 값은 더한다.
    // 단, 카테고리가 5개가 넘지 않을 경우 기타 카테고리를 구성하지 않고 5개까지 다 보여준다.
    if (after.length > 5) {
      const major = after.slice(0, 5);
      const minor = after.slice(5);
      const newMinor = [
        {
          category: "",
          money: 0,
        },
      ];
      for (let i = 0; i < minor.length; i++) {
        newMinor[0] = {
          category: "기타",
          money: newMinor[0].money + minor[i].money,
        };
      }
      const result = major.concat(newMinor);
      return result;
    } else {
      return after;
    }
  };

  const onChangeClassification = (e: any) => {
    const {
      target: { value },
    } = e;
    setClassification(value);
    setCheckedType(value);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100vw",
        maxWidth: "750px",
        margin: "80px auto 0px",
      }}
    >
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

      {Object.keys(data).length != 0 && <Doughnut data={data} />}
      {/* <Doughnut data={data} /> */}
    </div>
  );
};

export default Statistics;
