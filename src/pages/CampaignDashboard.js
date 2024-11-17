import React, { useEffect, useState } from 'react';
import { fetchCampaigns, sendMessages } from '../services/api';
import CreateCampaign from './CreateCampaign';
import { Link } from 'react-router-dom';
import './CampaignDashboard.css';
import { toast } from 'react-toastify';


const CampaignDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch campaigns from the API
  const loadCampaigns = async () => {
    try {
      const response = await fetchCampaigns();
      setCampaigns(response.data.campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      alert('Unable to load campaigns. Please check the console for details.');
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSendMessages = async (campaignId) => {
    try {
      const response = await sendMessages(campaignId);
      toast.success(response.data.message);
      loadCampaigns();
    } catch (error) {
      console.error('Error sending messages:', error);
      toast.error('Failed to send messages. Please check the console for details.');
    }
  };

  return (
    <div className="campaign-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>MyCRM Dashboard</h1>
        <div className="header-buttons">
          <Link to="/statistics" className="statistics-link">
            View Statistics
          </Link>
          <button className="new-campaign-button" onClick={handleOpenModal}>
            Create Campaign
          </button>
        </div>
      </div>

      {/* Campaign Table */}
      <table className="campaign-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Created At</th>
            <th>Audience Size</th>
            <th>Messages Sent</th>
            <th>Messages Failed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <tr key={campaign._id}>
                <td>{campaign.name}</td>
                <td>{new Date(campaign.createdAt).toLocaleString()}</td>
                <td>{campaign.stats.audienceSize}</td>
                <td>{campaign.stats.messagesSent}</td>
                <td>{campaign.stats.messagesFailed}</td>
                <td>
                  <button
                    className="send-messages-button"
                    onClick={() => handleSendMessages(campaign._id)}
                  >
                    Send Messages
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-campaigns">
                No campaigns found. Create your first campaign now!
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Create Campaign */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-button" onClick={handleCloseModal}>
              &times;
            </button>
            <CreateCampaign
              onCampaignCreated={() => {
                loadCampaigns();
                handleCloseModal();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDashboard;
