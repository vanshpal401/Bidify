import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import {
  clearAllSuperAdminSliceErrors,
  getMonthlyRevenue,
} from "@/store/slices/superAdminSlice";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const PaymentGraph = () => {
  const { monthlyRevenue } = useSelector((state) => state.superAdmin);
  const dispatch=useDispatch()
  useEffect(() => {
    dispatch(getMonthlyRevenue());
    dispatch(clearAllSuperAdminSliceErrors());
  }, []);

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Total Payment Received",
        data: monthlyRevenue,
        backgroundColor: "#D6482B",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 5000,
        ticks: {
          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Monthly Total Payments Received",
      },
    },
  };

  return <div className="w-auto ml-0 m-0 h-auto px-2 pt-18 lg:pl-[320px] flex flex-col gap-10 mx-6"><Bar data={data} options={options} />;</div>
};

export default PaymentGraph;