import Modal from "react-modal";
import React from "react";

// Component for viewing details in a modal
export const ViewDetailsModal = (selectedRow: any, isOpen, closeModal) => {
  // Helper function to render details with optional styling
  const DetailsPopupData = (
    name: string,
    value: string,
    noBorder?: boolean,
    noPadding?: boolean
  ) => {
    return (
      <div
        style={{
          borderBottom: noBorder ? "" : "1px solid #EDEFF3",
          padding: noPadding ? 0 : 16,
        }}
      >
        <strong>{name}</strong>
        <div style={{ marginTop: 8 }}>{value}</div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Submission Details"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
          paddingBottom: "10px",
        }}
      >
        <h2 style={{ margin: 0 }}>Submission Details</h2>
        <button
          onClick={closeModal}
          style={{
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>
      {selectedRow && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "10px",
              backgroundColor: "#f7f7f7",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            {DetailsPopupData(
              "First Name",
              selectedRow.firstName || "-", // Updated to display first name
              true,
              true
            )}
            {DetailsPopupData(
              "Last Name",
              selectedRow.lastName || "-", // Updated to display last name
              true,
              true
            )}
            {DetailsPopupData(
              "Preferred Name",
              selectedRow.preferredName || "-", // Added to display preferred name
              true,
              true
            )}
            {DetailsPopupData(
              "Date of Birth",
              selectedRow.dob || "-",
              true,
              true
            )}
            {DetailsPopupData(
              "Phone Number",
              selectedRow.mobileNumber || "-",
              true,
              true
            )}
            {DetailsPopupData(
              "Email",
              selectedRow.email || "-",
              true,
              true
            )}
            {DetailsPopupData(
              "Mailing Address",
              selectedRow.mailingAddress || "-",
              true,
              true
            )}
            {DetailsPopupData(
              "Graduation Year",
              selectedRow.graduationYear || "-",
              true,
              true
            )}
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              borderRadius: "8px",
              border: "1px solid #EDEFF3",
              padding: "16px",
            }}
          >
            {DetailsPopupData(
              "High School or College where Culinary classes were taken:",
              selectedRow.question1 || "-"
            )}
            {DetailsPopupData(
              "How will you get to work?",
              selectedRow.question2 || "-"
            )}
            {DetailsPopupData(
              "Do you currently have a job?",
              selectedRow.question6 || "-"
            )}
            {DetailsPopupData(
              "Where do you work?",
              selectedRow.question7 || "-"
            )}
            {DetailsPopupData(
              "Available Times",
              selectedRow.availableTimes || "-"
            )}
            {DetailsPopupData(
              "Are you available to work during the weekends?",
              selectedRow.availableWeekends ? "Yes" : "No", // Updated to display weekend availability
            )}
            {DetailsPopupData(
              "How many hours do you want to work per week?",
              selectedRow.question3 || "-"
            )}
            {DetailsPopupData(
              "Where did you work?",
              selectedRow.question11 || "-"
            )}
            {DetailsPopupData(
              "Have you had a job in the past?",
              selectedRow.question10 || "-"
            )}
            {DetailsPopupData(
              "How many hours did you work per week?",
              selectedRow.question13 || "-"
            )}
            {DetailsPopupData(
              "What was your position?",
              selectedRow.question12 || "-"
            )}
            {DetailsPopupData(
              "Do you have a Resume?",
              selectedRow.question14 || "-"
            )}
            <div
              style={{
                borderBottom: "1px solid #EDEFF3",
                padding: 16,
              }}
            >
              <strong>Please upload your Resume:</strong>{" "}
              <a
                href={selectedRow.question15}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div style={{ marginTop: 8 }}>
                  {selectedRow.question15 ? "Click here to View" : null}
                </div>
              </a>
            </div>
            {DetailsPopupData(
              "Do you have a Food Handlers Card?",
              selectedRow.question19 || "-"
            )}
            {DetailsPopupData(
              "Select the option(s) that you are interested in:",
              selectedRow.question18 || "-"
            )}
            {DetailsPopupData(
              "When will you be ready to work?",
              selectedRow.question17 || "-"
            )}
            {DetailsPopupData(
              "Are you ready to work now?",
              selectedRow.question16 || "-"
            )}
            {DetailsPopupData(
              "How many years of Culinary Classes have you attended?",
              selectedRow.question21 || "-",
            )}
            {DetailsPopupData(
              "Do you have ServSafe credentials?",
              selectedRow.question20 || "-",
              true
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
