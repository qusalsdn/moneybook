import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";
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
  let userObj: any;
  let year: any;
  let month: any;
  if (params) {
    userObj = params[0];
    year = Number(params[1]);
    month = Number(params[2]);
  }

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

    // ????????? ????????? ???????????? ??????
    const incomeCategory = Array.from(new Set(incomeName));
    const spendingCategory = Array.from(new Set(spendingName));

    afterincome = new Array(incomeCategory.length);
    afterspending = new Array(spendingCategory.length);

    // ???????????? ????????? ???????????? ???????????? ?????? ?????? ???????????? ??????
    const income = createData(beforeincome, afterincome, incomeCategory);
    const spending = createData(beforespending, afterspending, spendingCategory);
    setIncomeData(income);
    setSpendingData(spending);
  }, [details]);

  useEffect(() => {
    if (classification === "income") {
      if (Object.keys(incomeData).length > 5) {
        const data = createDoughnut(incomeData);
        setCategory(data[0]);
        setMoney(data[1]);
      } else {
        const data = createDoughnut(incomeData);
        setCategory(data[0]);
        setMoney(data[1]);
      }
    } else {
      if (Object.keys(spendingData).length > 5) {
        const data = createDoughnut(spendingData);
        setCategory(data[0]);
        setMoney(data[1]);
      } else {
        const data = createDoughnut(spendingData);
        setCategory(data[0]);
        setMoney(data[1]);
      }
    }
  }, [classification, incomeData, spendingData]);

  useEffect(() => {
    if (category.length != 0) {
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
    }
  }, [category, money]);

  // ????????? ????????? ?????? ???????????? ???????????? ??????
  const createDoughnut = (incomeOrSpending: any) => {
    const result = [];
    const category: any = [];
    const money: any = [];
    incomeOrSpending.forEach((data: any) => {
      category.push(data.category);
      money.push(data.money);
    });
    result[0] = category;
    result[1] = money;
    return result;
  };

  const createData = (before: any, after: any, category: any) => {
    // ??? ?????? ?????? ??????
    for (let i = 0; i < after.length; i++) {
      after[i] = {
        category: "",
        money: 0,
      };
    }

    // ???????????? ??????????????? ?????? ????????? ???????????? ???????????? ?????? ?????? ???????????? ??????
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
    // ?????????????????? ??????
    after.sort((a: any, b: any) => {
      return b.money - a.money;
    });

    // money??? ?????? ?????? ???????????? 5?????? ?????? ???????????? ????????? ??????????????? ????????? ?????? ??? ?????? money ?????? ?????????.
    // ???, ??????????????? 5?????? ?????? ?????? ?????? ?????? ??????????????? ???????????? ?????? 5????????? ??? ????????????.
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
          category: "??????",
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
    setData([]);
    setClassification(value);
    setCheckedType(value);
  };

  const draw = () => {
    const render = [];
    if (Object.keys(data).length != 0) {
      render.push(<Doughnut data={data} />);
    } else {
      render.push(<h1 style={{ fontSize: "30px" }}>????????? ???????????? ????????????...????</h1>);
    }
    return render;
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
        margin: "50px auto 0px",
      }}
    >
      <div style={{ width: "750px", marginBottom: "30px" }}>
        <Link href={`/Home/${userObj}/${year}/${month}`}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: "30px", marginLeft: "150px" }} />
        </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          <span style={{ marginRight: "10px" }}>??????</span>
          <input
            type="radio"
            value="income"
            name="classification"
            onChange={onChangeClassification}
            checked={checkedType === "income" ? true : false}
            required
          />
          <label style={{ marginRight: "5px" }}>??????</label>
          <input
            type="radio"
            value="spending"
            name="classification"
            onChange={onChangeClassification}
            checked={checkedType === "spending" ? true : false}
            required
          />
          <label>??????</label>
        </div>
      </div>

      {classification === "income" ? draw() : draw()}
    </div>
  );
};

export default Statistics;
