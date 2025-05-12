import {
    GridRenderCellParams,
    gridStringOrNumberComparator,
    GridValueGetterParams,
  } from "@mui/x-data-grid";
  import React from "react";
  import { gapi } from "gapi-script";
  import * as XLSX from "xlsx";
  
  export interface ISheetData {
    submissionId: string;
    submissionDate: string;
    firstName: string; // New field
    lastName: string;  // New field
    preferredName: string; // New field for Preferred Name
    email: string;
    mailingAddress: string;
    dob: string;
    mobileNumber: string;
    graduationYear: string;
    stateOfResidence: string;
    stateOfRelocation: string[];
    question1: string;
    question2: string;
    question3: string;
    availableTimes: string[]; // New field
    availableWeekends: boolean; // New field
    question5: string;
    question6: string;
    question7: string;
    question8: string;
    question9: string;
    question10: string;
    question11: string;
    question12: string;
    question13: string;
    question14: string;
    question15: string;
    question16: string;
    question17: string;
    question18: string;
    question19: string;
    question20: string;
  }
  
  // Export columns for the TableGrid
  export const columns = (handleViewDetails) => [
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      hideable: false,
      valueGetter: (params: GridValueGetterParams) => {
        return params.row as ISheetData;
      },
      renderCell: (params: GridRenderCellParams<any, ISheetData>) => {
        return <p>{params.row.firstName}</p>;
      },
      sortComparator: (
        v1: ISheetData,
        v2: ISheetData,
        cellParams1,
        cellParams2
      ) => {
        return gridStringOrNumberComparator(
          v1.firstName,
          v2.firstName,
          cellParams1,
          cellParams2
        );
      },
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      hideable: false,
      valueGetter: (params: GridValueGetterParams) => {
        return params.row as ISheetData;
      },
      renderCell: (params: GridRenderCellParams<any, ISheetData>) => {
        return <p>{params.row.lastName}</p>;
      },
      sortComparator: (
        v1: ISheetData,
        v2: ISheetData,
        cellParams1,
        cellParams2
      ) => {
        return gridStringOrNumberComparator(
          v1.lastName,
          v2.lastName,
          cellParams1,
          cellParams2
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      hideable: false,
      valueGetter: (params: GridValueGetterParams) => {
        return params.row as ISheetData;
      },
      renderCell: (params: GridRenderCellParams<any, ISheetData>) => {
        return <p>{params.row.email}</p>;
      },
      sortComparator: (
        v1: ISheetData,
        v2: ISheetData,
        cellParams1,
        cellParams2
      ) => {
        return gridStringOrNumberComparator(
          v1.email,
          v2.email,
          cellParams1,
          cellParams2
        );
      },
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      flex: 1,
      hideable: false,
      valueGetter: (params: GridValueGetterParams) => {
        return params.row as ISheetData;
      },
      renderCell: (params: GridRenderCellParams<any, ISheetData>) => {
        return <p>{params.row.dob}</p>;
      },
      sortComparator: (
        v1: ISheetData,
        v2: ISheetData,
        cellParams1,
        cellParams2
      ) => {
        return gridStringOrNumberComparator(
          v1.dob,
          v2.dob,
          cellParams1,
          cellParams2
        );
      },
    },
    {
      field: "graduationYear",
      headerName: "Graduation Year",
      flex: 1,
      hideable: false,
      valueGetter: (params: GridValueGetterParams) => {
        return params.row as ISheetData;
      },
      renderCell: (params: GridRenderCellParams<any, ISheetData>) => {
        return <p>{params.row.graduationYear}</p>;
      },
      sortComparator: (
        v1: ISheetData,
        v2: ISheetData,
        cellParams1,
        cellParams2
      ) => {
        return gridStringOrNumberComparator(
          v1.graduationYear,
          v2.graduationYear,
          cellParams1,
          cellParams2
        );
      },
    },
    {
      field: "submissionDate",
      headerName: "Submission Date",
      flex: 1,
      hideable: false,
      valueGetter: (params: GridValueGetterParams) => {
        return params.row as ISheetData;
      },
      renderCell: (params: GridRenderCellParams<any, ISheetData>) => {
        return <p>{params.row.submissionDate}</p>;
      },
      sortComparator: (
        v1: ISheetData,
        v2: ISheetData
      ) => {
        const parseFormattedDate = (dateStr: string) => {
          if (!dateStr) return new Date(0); // Handle empty dates
          const [month, day, yearShort] = dateStr.split('/');
          const year = '20' + yearShort;
          return new Date(`${year}-${month}-${day}`);
        };
        
        const date1 = parseFormattedDate(v1.submissionDate);
        const date2 = parseFormattedDate(v2.submissionDate);
        
        return date1.getTime() - date2.getTime();
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      sortable: false,
      filterable: false,
      hideable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div
          style={{
            fontFamily: "Raleway",
            fontSize: 12,
            fontStyle: "normal",
            fontWeight: 600,
            padding: "10px",
            borderRadius: 4,
            border: "1px solid #0A0A0A",
            cursor: "pointer",
          }}
          onClick={() => handleViewDetails(params.row)}
        >
          View Details
        </div>
      ),
    },
  ];
  
  export enum QUESTIONS {
    curr = "Do you currently have a job?",
    past = "Have you had a job in the past?",
    res = "Do you have a Resume?",
    food = "Do you have a Food Handlers Card?",
    work = "Are you ready to work now?",
    serv = "Do you have ServSafe credentials?",
    pos = "What is your current position?",
    opt = "Select the option(s) that you are interested in:",
    availableTimes = "What times are you available to work?", // New question
    availableWeekends = "Are you available to work weekends?", // New question
    want = "How many hours do you want to work per week?",
    doyou = "How many hours do you work per week?",
    cul = "How many years of Culinary Classes have you attended?",
    startTime = "When will you be ready to work?",
    dob = "Date of Birth",
  }
  
  // Google Sheets API configuration
  export const API_KEY = "AIzaSyBDqTZiRtlFOTnQV7xcoVmCiudsWcuDX18";
  export const SHEET_ID = "1KqvJPGDUyevDqKtxHDj6Y5q_zgG2w-LxtryL0j_aJ28";
  export const RANGE = "Sheet1!A2:AZ";
  
  // Convert 12-hour time to 24-hour format
  export const convertTo24Hour = (time) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return parseInt(hours, 10);
  };
  
  // Convert date format from YYYY-MM-DD to MM/DD/YY
  export function convertDateFormat(dateString) {
    const [year, month, day] = dateString.split("-");
    const formattedDate = `${month}/${day}/${year.slice(-2)}`;
    return formattedDate;
  }
  
  export const findMinMaxHours = (times) => {
    const hours = times.map(convertTo24Hour);
    return [Math.min(...hours), Math.max(...hours)];
  };
  
  export const findMinMaxValues = (values) => {
    const numericValues = values.map((value) => parseInt(value, 10));
    return [Math.min(...numericValues), Math.max(...numericValues)];
  };
  
  // Export data to Excel file
  export const exportExcel = async () => {
    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: "Sheet1!A1:AZ",
        key: API_KEY,
      });
  
      const data = response.result.values;
  
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
      XLSX.writeFile(wb, "C-CAP_Submission_Data.xlsx");
    } catch (error) {
      console.error("Error fetching data from Google Sheets", error);
    }
  };
  
