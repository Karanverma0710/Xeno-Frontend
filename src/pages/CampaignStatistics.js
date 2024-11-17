import React, { useEffect, useState } from 'react';
import { fetchCampaigns } from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import './CampaignStatistics.css';
import { toast } from 'react-toastify';


ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

const CampaignStatistics = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [totalMessagesSent, setTotalMessagesSent] = useState(0);
  const [totalMessagesFailed, setTotalMessagesFailed] = useState(0);

  useEffect(() => {
    fetchCampaigns()
      .then(response => {
        const fetchedCampaigns = response.data.campaigns;
        setCampaigns(fetchedCampaigns);
        setTotalCampaigns(fetchedCampaigns.length);
        setTotalMessagesSent(
          fetchedCampaigns.reduce((sum, campaign) => sum + campaign.stats.messagesSent, 0)
        );
        setTotalMessagesFailed(
          fetchedCampaigns.reduce((sum, campaign) => sum + campaign.stats.messagesFailed, 0)
        );
      })
      .catch(error => {
        console.error('Error fetching campaign statistics:', error);
        toast.error('Failed to load campaign statistics.');
      });
  }, []);

  // Bar Chart Data
  const barChartData = {
    labels: campaigns.map(campaign => campaign.name),
    datasets: [
      {
        label: 'Messages Sent',
        data: campaigns.map(campaign => campaign.stats.messagesSent),
        backgroundColor: '#4caf50',
        borderColor: '#388e3c',
        borderWidth: 1,
      },
      {
        label: 'Messages Failed',
        data: campaigns.map(campaign => campaign.stats.messagesFailed),
        backgroundColor: '#f44336',
        borderColor: '#d32f2f',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: context => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
          font: { size: 12 },
          callback: function (value) {
            const maxLength = 10; // Limit label length
            const label = this.getLabelForValue(value);
            return label.length > maxLength ? `${label.slice(0, maxLength)}...` : label;
          },
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: '#fff',
          font: { size: 12 },
        },
        grid: { color: '#444' },
      },
    },
  };

  // Pie Chart Data
  const pieChartData = {
    labels: ['Messages Sent', 'Messages Failed'],
    datasets: [
      {
        data: [totalMessagesSent, totalMessagesFailed],
        backgroundColor: ['#4caf50', '#f44336'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: context => `${context.label}: ${context.raw}`,
        },
      },
    },
  };

  return (
    <div className="campaign-statistics">
      <header className="statistics-header">
        <h2>Campaign Statistics</h2>
      </header>

      <section className="statistics-summary">
        <p><strong>Total Campaigns:</strong> {totalCampaigns}</p>
        <p><strong>Total Messages Sent:</strong> {totalMessagesSent}</p>
        <p><strong>Total Messages Failed:</strong> {totalMessagesFailed}</p>
      </section>

      <section className="charts">
        <div className="chart-container">
          <h3>Messages Per Campaign</h3>
          <div className="chart-wrapper">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
        <div className="chart-container">
          <h3>Overall Message Statistics</h3>
          <div className="chart-wrapper">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampaignStatistics;
