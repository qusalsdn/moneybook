import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { dbService } from "../../src/fBase";

ChartJS.register(ArcElement, Tooltip, Legend);

const Statistics = () => {
  const [details, setDetails] = useState<any[]>([]);
  const [classification, setClassification] = useState("");
  const [checkedType, setCheckedType] = useState("spending");
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
    console.log(details);
  }, [details]);

  const onChangeClassification = (e: any) => {
    const {
      target: { value },
    } = e;
    setClassification(value);
    setCheckedType(value);
  };

  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [50000, 25000, 18000, 30000, 5000, 70000],
        backgroundColor: [
          "red",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
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

      <Doughnut data={data} />
    </div>
  );
};

export default Statistics;
