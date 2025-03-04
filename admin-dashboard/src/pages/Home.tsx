/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  DIV_GRAY,
  Divider,
  FADE_GRAY,
  LoadingIndicator,
  matchesSearchKey,
  Search,
  TableGrid,
} from "@thedashboardai/dashboard-components";
import { css } from "@emotion/react";
import Select from "react-select";
import {
  API_KEY,
  ISheetData,
  QUESTIONS,
  RANGE,
  SHEET_ID,
  columns,
  convertDateFormat,
  findMinMaxHours,
  findMinMaxValues,
  exportExcel,
} from "../utils/utils";
import { ArrowDown2, Export } from "iconsax-react";
import "rc-slider/assets/index.css";
import {
  appliedFiltersBarStyle,
  appliedFilterStyle,
  ApplyFilters,
  exportButtonStyle,
  filterContainerStyle,
  filterDropdownStyle,
  OuterContainer,
  questionnaireStyle,
  QuestionnaireTitle,
  Reset,
  styles,
} from "./HomeStyles";
import { ViewDetailsModal } from "../components/ViewDetailsModal";
import {
  DateInput,
  DoubleChoiceQuestion,
  MultipleChoiceQuestion,
  TimeSlider,
} from "../components/HelpersComponents";
import { gapi } from "gapi-script";
import { Close } from "@mui/icons-material";

export default function Home() {
  // State for loading indicator
  const [loading, setLoading] = useState<boolean>(true);

  // State to hold the data fetched from Google Sheets
  const [data, setData] = useState<ISheetData[]>([]);

  // State to hold the raw rows from Google Sheets
  const [rows, setRows] = useState<any>();

  // State for search key
  const [searchKey, setSearchKey] = useState("");

  // State for filter modal visibility
  const [isOpen, setIsOpen] = useState(false);

  // State to check if filters are applied
  const [applied, setApplied] = useState(false);

  // State for selected graduation year filter
  const [selectedGraduationYear, setSelectedGraduationYear] = useState<
    string | null
  >(null);

  // State for selected states of residence filter
  const [selectedStatesOfResidence, setSelectedStatesOfResidence] = useState<
    string[]
  >([]);

  // State for selected states of relocation filter
  const [selectedStatesOfRelocation, setSelectedStatesOfRelocation] =
    useState<string[]>([]);

  // State for modal visibility for viewing details
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // State for holding the selected row for details view
  const [selectedRow, setSelectedRow] = useState<ISheetData | null>(null);

  // State for applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    curr: null,
    past: null,
    res: null,
    food: null,
    work: null,
    serv: null,
    pos: null,
    opt: null,
    availableTimes: "",
    availableWeekends: null,
    want: [],
    doyou: [],
    cul: [],
    startTime: null,
    dob: null,
  });

  // State for default values of sliders
  const [defaultval, setDefaultval] = useState({
    want: [],
    doyou: [],
    cul: [],
  });

  // Fetch data from Google Sheets
  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
      );
      const rowz = response.data.values;
      setRows(rowz);
      const formattedData: ISheetData[] = rowz.map(
        (row: string[], index: number) => ({
          submissionId: index.toString(),
          submissionDate: row[2] ? convertDateFormat(row[2].split(" ")[0]) : "",
          firstName: row[3] || "",
          lastName: row[4] || "",
          preferredName: row[5] || "", // New Preferred Name column
          email: row[6] || "",
          mailingAddress:
            `${row[7]}\n${row[8]}\n${row[9]}, ${row[10]}, ${row[11]}` || "",
          dob: row[14] || "",
          mobileNumber: row[15] || "",
          graduationYear: row[16] || "",
          stateOfResidence: row[10] || "",
          stateOfRelocation:
            row[13]?.split(",").map((state) => state.trim()) || [], // Relocation states
          question1: row[17] || "", // High School or College where Culinary classes were taken
          question2: row[18] || "", // How will you get to work?
          question3: row[19] || "", // How many hours do you want to work per week?
          availableTimes: row[20] || "", // Available times
          availableWeekends: row[21] || "", // Availability on weekends
          question5: row[22] || "",
          question6: row[23] || "", // Do you currently have a job?
          question7: row[24] || "", // Where do you work?
          question8: row[25] || "", // Current position
          question9: row[26] || "", // How many hours do you work per week?
          question10: row[27] || "", // Have you had a job in the past?
          question11: row[28] || "", // Where did you work?
          question12: row[29] || "", // Past position
          question13: row[30] || "", // How many hours did you work per week?
          question14: row[31] || "", // Do you have a Resume?
          question15: row[32] || "", // Please upload your Resume
          question16: row[33] || "", // Are you ready to work now?
          question17: row[34] || "", // When will you be ready to work?
          question18: row[35] || "", // Select the option(s) you are interested in
          question19: row[36] || "", // Do you have a Food Handlers Card?
          question20: row[37] || "", // Do you have ServSafe credentials?
          question21: row[38] || "", // Years of Culinary Classes attended
        })
      );

      DefaultApplyFilters(rowz);
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data from Google Sheets API", error);
    }

    setLoading(false);
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Initialize GAPI client
  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          discoveryDocs: [
            "https://sheets.googleapis.com/$discovery/rest?version=v4",
          ],
        })
        .then(() => {
          console.log("GAPI client initialized");
        })
        .catch((error) => {
          console.error("Error initializing GAPI client", error);
        });
    };

    gapi.load("client", initClient);
  }, []);

  // Update filter values
  const updateFilter = (key, value) => {
    setAppliedFilters((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Handle change in graduation year filter
  const handleGraduationYearChange = (selectedOption) => {
    setSelectedGraduationYear(selectedOption ? selectedOption.value : null);
  };

  // Handle change in state of residence filter
  const handleStateOfResidenceChange = (selectedOptions) => {
    setSelectedStatesOfResidence(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  // Handle change in state of relocation filter
  const handleStateOfRelocationChange = (selectedOptions) => {
    setSelectedStatesOfRelocation(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  // Handle view details action
  const handleViewDetails = (row) => {
    setSelectedRow(row);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRow(null);
  };

  // Toggle filter modal visibility
  const handleOpenFilterModal = () => {
    setIsOpen(!isOpen);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedGraduationYear(null);
    setSelectedStatesOfResidence([]);
    setSelectedStatesOfRelocation([]);
    fetchData();
  };

  // Apply filters to the data
  const applyFilters = (data) => {
    return data.filter((item) => {
      let isMatch = true;

      if (appliedFilters.curr !== null) {
        isMatch =
          isMatch &&
          (appliedFilters.curr
            ? item.question6 === "Yes"
            : item.question6 === "No");
      }

      if (appliedFilters.past !== null) {
        isMatch =
          isMatch &&
          (appliedFilters.past
            ? item.question10 === "Yes"
            : item.question10 === "No");
      }

      if (appliedFilters.res !== null) {
        isMatch =
          isMatch &&
          (appliedFilters.res
            ? item.question14 === "Yes"
            : item.question14 === "No");
      }

      if (appliedFilters.food !== null) {
        isMatch =
          isMatch &&
          (appliedFilters.food
            ? item.question19 === "Yes"
            : item.question19 === "No");
      }

      if (appliedFilters.work !== null) {
        isMatch =
          isMatch &&
          (appliedFilters.work
            ? item.question16 === "Yes"
            : item.question16 === "No");
      }

      if (appliedFilters.serv !== null) {
        isMatch =
          isMatch &&
          (appliedFilters.serv
            ? item.question20 === "Yes"
            : item.question20 === "No");
      }

      if (appliedFilters.availableWeekends !== null) {
        isMatch =
          isMatch &&
          (appliedFilters.availableWeekends
            ? item.availableWeekends === "Yes"
            : item.availableWeekends === "No");
      }

      // Check if position filter is applied
      if (JSON.stringify(appliedFilters.pos).includes("true")) {
        let objs = [];
        Object.keys(appliedFilters.pos).map((i) => {
          if (appliedFilters.pos[i]) {
            objs.push(i);
          }
        });
        isMatch = isMatch && objs.includes(item.question8);
      }

      // Check if options filter is applied
      if (JSON.stringify(appliedFilters.opt).includes("true")) {
        let objs = [];
        Object.keys(appliedFilters.opt).map((i) => {
          if (appliedFilters.opt[i]) {
            objs.push(i);
          }
        });
        let ans = false;
        for (let i in objs) {
          if (JSON.stringify(item.question18).includes(i)) {
            ans = true;
          }
        }

        isMatch =
          isMatch &&
          objs.every((i) => JSON.stringify(item.question18).includes(i));
      }

      // Check if available times filter is applied
      if (JSON.stringify(appliedFilters.availableTimes).includes("true")) {
        let objs = [];
        Object.keys(appliedFilters.availableTimes).map((i) => {
          if (appliedFilters.availableTimes[i]) {
            objs.push(i);
          }
        });
        let ans = false;
        for (let i in objs) {
          if (JSON.stringify(item.availableTimes).includes(i)) {
            ans = true;
          }
        }

        isMatch =
          isMatch &&
          objs.every((i) => JSON.stringify(item.availableTimes).includes(i));
      }

      // Check if hours wanted filter is applied
      if (appliedFilters.want.length === 2 && item.question3) {
        const hoursWanted = parseInt(item.question3, 10);
        isMatch =
          isMatch &&
          hoursWanted >= appliedFilters.want[0] &&
          hoursWanted <= appliedFilters.want[1];
      }

      // Check if hours worked filter is applied
      if (appliedFilters.doyou.length === 2 && item.question9) {
        const hoursWorked = parseInt(item.question9, 10);
        isMatch =
          isMatch &&
          hoursWorked >= appliedFilters.doyou[0] &&
          hoursWorked <= appliedFilters.doyou[1];
      }

      // Check if culinary years filter is applied
      if (appliedFilters.cul.length === 2 && item.question21) {
        const yearsOfCulinary = parseInt(item.question21, 10);
        isMatch =
          isMatch &&
          yearsOfCulinary >= appliedFilters.cul[0] &&
          yearsOfCulinary <= appliedFilters.cul[1];
      }

      // Check if start time filter is applied
      if (appliedFilters.startTime) {
        if (!item.question17) {
          isMatch = false;
        } else {
          const formattedDate = convertDateFormat(item.question17);
          const readyDate = new Date(formattedDate);
          const filterDate = new Date(appliedFilters.startTime);
          isMatch = isMatch && readyDate >= filterDate;
        }
      }

      // Check if date of birth filter is applied
      if (appliedFilters.dob) {
        const dobDate = new Date(convertDateFormat(item.dob));
        const filterDob = new Date(appliedFilters.dob);
        isMatch = isMatch && dobDate.getTime() === filterDob.getTime();
      }

      return isMatch;
    });
  };

  // Reset filters to default
  const ResetFilters = () => {
    fetchData();
    DefaultApplyFilters();
    setApplied(false);
  };

  // Apply filters to the data and set the filtered data
  const ProcessFilters = () => {
    const filtered = applyFilters(data);
    setData(filtered);
    setApplied(true);
    setIsOpen(false);
  };

  // Set default values for filters based on the data
  const DefaultApplyFilters = (r?: any) => {
    const row = r;
    const currPosi = Array.from(
      new Set(
        (rows || row)
          .map((item) => item[25])
          .filter((work) => work !== undefined && work !== "")
      )
    ).reduce((acc, opt: number) => {
      acc[opt] = false;
      return acc;
    }, {});

    const opts = Array.from(
      new Set(
        (rows || row)
          .flatMap((item) => {
            if (typeof item[35] === "string") {
              return item[35].split(/,| and /).map((opt) => opt.trim());
            }
            return [];
          })
          .filter(
            (work) =>
              work !== undefined && work !== "" && work !== "Select the option"
          )
      )
    ).reduce((acc, opt: number) => {
      acc[opt] = false;
      return acc;
    }, {});

    const avTimes = Array.from(
      new Set(
        (rows || row)
          .flatMap((item) => {
            if (typeof item[20] === "string") {
              return item[20].split(/,| and /).map((opt) => opt.trim());
            }
            return [];
          })
          .filter(
            (work) =>
              work !== undefined && work !== "" && work !== "Select the option"
          )
      )
    ).reduce((acc, opt: number) => {
      acc[opt] = false;
      return acc;
    }, {});

    const hoursWorked = (rows || row)
      .map((item) => item[19])
      .filter((value) => value !== undefined && value !== "");
    const timez = findMinMaxValues(hoursWorked);

    const hourz = (rows || row)
      .map((item) => item[26])
      .filter((value) => value !== undefined && value !== "");
    const tim = findMinMaxValues(hourz);

    const cul = (rows || row)
      .map((item) => item[38])
      .filter((value) => value !== undefined && value !== "");
    const val = findMinMaxValues(cul);

    updateFilter("curr", null);
    updateFilter("past", null);
    updateFilter("res", null);
    updateFilter("food", null);
    updateFilter("work", null);
    updateFilter("serv", null);

    updateFilter("opt", opts);
    updateFilter("want", timez);
    updateFilter("doyou", tim);
    updateFilter("pos", currPosi);
    updateFilter("cul", val);
    updateFilter("availableTimes", avTimes);
    updateFilter("availableWeekends", null);
    updateFilter("startTime", null);
    updateFilter("dob", null);

    setDefaultval({
      want: timez,
      doyou: tim,
      cul: val,
    });

    setIsOpen(false);
  };

  // Filter the data based on search key and selected filters
  let filteredData = data.filter(
    (item) =>
      (!searchKey ||
        matchesSearchKey(`${item.firstName} ${item.lastName}`, searchKey)) &&
      (!selectedGraduationYear ||
        item.graduationYear === selectedGraduationYear) &&
      (selectedStatesOfResidence.length === 0 ||
        selectedStatesOfResidence.includes(item.stateOfResidence)) &&
      (selectedStatesOfRelocation.length === 0 ||
        item.stateOfRelocation.some((state) =>
          selectedStatesOfRelocation.includes(state)
        ))
  );

  // Get unique graduation years for the dropdown filter
  const uniqueGraduationYears = Array.from(
    new Set(
      data
        .map((item) => item.graduationYear)
        .filter((year) => year !== undefined && year !== "")
    )
  ).map((year) => ({ value: year, label: year }));

  // Get unique states of residence for the dropdown filter
  const uniqueStatesOfResidence = Array.from(
    new Set(data.map((item) => item.stateOfResidence))
  ).map((state) => ({ value: state, label: state }));

  // Get unique states of relocation for the dropdown filter
  const uniqueStatesOfRelocation = Array.from(
    new Set(data.flatMap((item) => item.stateOfRelocation))
  ).map((state) => ({ value: state, label: state }));

  return (
    <div
      style={{
        display: "flex",
        height: "92vh",
        flexDirection: "column",
        padding: "2%",
      }}
    >
      <div className={"flexRow"} style={{ justifyContent: "space-between" }}>
        <div className={"flexRow"} style={{ gap: 20 }}>
          <p style={{ ...styles.headerText }}>{"C-CAP Submission Data"}</p>
        </div>
        <button css={exportButtonStyle} onClick={() => exportExcel()}>
          <span style={{ marginRight: "8px" }}>
            <Export />
          </span>
          Export
        </button>
      </div>

      <div css={filterContainerStyle}>
        <Search
          searchKey={searchKey}
          setSearchKey={setSearchKey}
          placeholder={"Search Candidates"}
          style={{ width: "432px" }}
        />
        <span>Filters</span>
        <Select
          css={filterDropdownStyle}
          options={uniqueGraduationYears}
          value={uniqueGraduationYears.find(
            (option) => option.value === selectedGraduationYear
          )}
          onChange={handleGraduationYearChange}
          placeholder="Graduation Year"
          isClearable
        />
        <Select
          css={filterDropdownStyle}
          options={uniqueStatesOfResidence}
          value={uniqueStatesOfResidence.filter((option) =>
            selectedStatesOfResidence.includes(option.value)
          )}
          onChange={handleStateOfResidenceChange}
          placeholder="State of Residence"
          isMulti
        />
        <Select
          css={filterDropdownStyle}
          options={uniqueStatesOfRelocation}
          value={uniqueStatesOfRelocation.filter((option) =>
            selectedStatesOfRelocation.includes(option.value)
          )}
          onChange={handleStateOfRelocationChange}
          placeholder="State of Relocation"
          isMulti
        />
        <div
          css={questionnaireStyle}
          onClick={handleOpenFilterModal}
          style={{ minWidth: "auto" }}
        >
          <div>Questionnaire</div>
          <ArrowDown2
            style={{
              opacity: "0.30",
              width: 20,
              transform: isOpen ? "rotate(180deg)" : "",
              height: 20,
            }}
          />
        </div>
        {isOpen && (
          <OuterContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
                padding: "12px 24px",
              }}
            >
              <QuestionnaireTitle>
                Filter by Questionnaire Responses
              </QuestionnaireTitle>
              <Reset onClick={() => ResetFilters()}>Reset</Reset>
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  padding: "16px 24px",
                  borderRight: "1px solid #EDEFF3",
                }}
              >
                <DoubleChoiceQuestion
                  question="Do you currently have a job?"
                  setSelectedOption={(e) => updateFilter("curr", e)}
                  selectedOption={appliedFilters.curr}
                />
                <hr
                  style={{
                    margin: "16px 0",
                    opacity: "0.15",
                  }}
                />
                <MultipleChoiceQuestion
                  question="What times are you available to work?"
                  setOptions={(e) => updateFilter("availableTimes", e)}
                  options={appliedFilters.availableTimes}
                />
                <hr
                  style={{
                    margin: "16px 0",
                    opacity: "0.15",
                  }}
                />
                <DoubleChoiceQuestion
                  question="Are you available to work weekends?"
                  setSelectedOption={(e) =>
                    updateFilter("availableWeekends", e)
                  }
                  selectedOption={appliedFilters.availableWeekends}
                />
                <hr
                  style={{
                    margin: "16px 0",
                    opacity: "0.15",
                  }}
                />
                <TimeSlider
                  question="How many hours do you want to work per week?"
                  range={appliedFilters.want}
                  setRange={(e) => updateFilter("want", e)}
                  suffix={["", " hours"]}
                />
                <hr
                  style={{
                    margin: "16px 0",
                    opacity: "0.15",
                  }}
                />

                <DoubleChoiceQuestion
                  question="Have you had a job in the past?"
                  setSelectedOption={(e) => updateFilter("past", e)}
                  selectedOption={appliedFilters.past}
                />
                <hr
                  style={{
                    margin: "16px 0",
                    opacity: "0.15",
                  }}
                />
                <TimeSlider
                  question="How many hours do you work per week?"
                  range={appliedFilters.doyou}
                  setRange={(e) => updateFilter("doyou", e)}
                  suffix={["", " hours"]}
                />
                <hr
                  style={{
                    margin: "16px 0",
                    opacity: "0.15",
                  }}
                />
                <MultipleChoiceQuestion
                  question="What is your current position?"
                  setOptions={(e) => updateFilter("pos", e)}
                  options={appliedFilters.pos}
                />
              </div>

              <div style={{ padding: "16px 24px" }}>
                <DoubleChoiceQuestion
                  question="Do you have a Resume?"
                  setSelectedOption={(e) => updateFilter("res", e)}
                  selectedOption={appliedFilters.res}
                />
                <hr
                  style={{
                    margin: "16px 0",
                    opacity: "0.15",
                  }}
                />
                <MultipleChoiceQuestion
                  question="Select the option(s) that you are interested in"
                  setOptions={(e) => updateFilter("opt", e)}
                  options={appliedFilters.opt}
                />
                <hr
                  style={{
                    margin: "16px 0",
                    opacity: "0.15",
                  }}
                />
                <DoubleChoiceQuestion
                  question="Do you have a Food Handlers Card?"
                  setSelectedOption={(e) => updateFilter("food", e)}
                  selectedOption={appliedFilters.food}
                />
                <hr
                  style={{
                    margin: "16px 0",
                    opacity: "0.15",
                  }}
                />

                <DoubleChoiceQuestion
                  question="Are you ready to work now?"
                  setSelectedOption={(e) => updateFilter("work", e)}
                  selectedOption={appliedFilters.work}
                />

                <hr
                  style={{
                    margin: "16px 0",
                    opacity: "0.15",
                  }}
                />
                <DoubleChoiceQuestion
                  question="Do you have ServSafe credentials?"
                  setSelectedOption={(e) => updateFilter("serv", e)}
                  selectedOption={appliedFilters.serv}
                />
                <hr
                  style={{
                    margin: "16px 0",
                    opacity: "0.15",
                  }}
                />
                <TimeSlider
                  question="How many years of Culinary Classes have you attended?"
                  range={appliedFilters.cul}
                  setRange={(e) => updateFilter("cul", e)}
                  suffix={["", " years"]}
                />
                <hr
                  style={{
                    margin: "16px 0",
                    opacity: "0.15",
                  }}
                />
                <DateInput
                  question="Date of Birth"
                  date={appliedFilters.dob}
                  setDate={(e) => updateFilter("dob", e)}
                />
                <hr
                  style={{
                    margin: "16px 0",
                    opacity: "0.15",
                  }}
                />
                <DateInput
                  question="When will you be ready to work?"
                  date={appliedFilters.startTime}
                  setDate={(e) => updateFilter("startTime", e)}
                />
              </div>
            </div>
            <div
              style={{
                borderTop: "1px solid #EDEFF3",
                padding: 16,
              }}
            >
              <ApplyFilters onClick={() => ProcessFilters()}>
                Apply Filters
              </ApplyFilters>
            </div>
          </OuterContainer>
        )}
      </div>

      <div css={appliedFiltersBarStyle}>
        <button
          css={css`
            border-radius: 6px;
            background: #44a8ff;
            color: #fff;
            padding: 8px 12px;
            border: none;
            font-family: Raleway, sans-serif;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            &:hover {
              background-color: #1976d2;
            }
            &:focus {
              outline: none;
            }
          `}
          onClick={handleResetFilters}
        >
          Reset All Filters
        </button>
        {selectedGraduationYear && (
          <div css={appliedFilterStyle}>
            Graduation Year
            <span
              style={{
                color: "#8492AD",
                fontWeight: "500",
                marginLeft: "8px",
              }}
            >
              {selectedGraduationYear}
            </span>
            <Close
              onClick={() => setSelectedGraduationYear(null)}
              style={{
                marginLeft: "8px",
                cursor: "pointer",
                opacity: "0.3",
              }}
            />
          </div>
        )}
        {selectedStatesOfResidence.map((state) => (
          <div css={appliedFilterStyle} key={state}>
            State of Residence
            <span
              style={{
                color: "#8492AD",
                fontWeight: "500",
                marginLeft: "8px",
              }}
            >
              {state}
            </span>
            <Close
              onClick={() =>
                setSelectedStatesOfResidence((prev) =>
                  prev.filter((s) => s !== state)
                )
              }
              style={{
                marginLeft: "8px",
                cursor: "pointer",
                opacity: "0.3",
              }}
            />
          </div>
        ))}
        {selectedStatesOfRelocation.map((state) => (
          <div css={appliedFilterStyle} key={state}>
            State of Relocation
            <span
              style={{
                color: "#8492AD",
                fontWeight: "500",
                marginLeft: "8px",
              }}
            >
              {state}
            </span>
            <Close
              onClick={() =>
                setSelectedStatesOfRelocation((prev) =>
                  prev.filter((s) => s !== state)
                )
              }
              style={{
                marginLeft: "8px",
                cursor: "pointer",
                opacity: "0.3",
              }}
            />
          </div>
        ))}
        {applied &&
          Object.keys(appliedFilters).map((filter, index) => {
            const filterValue = appliedFilters[filter];

            // Check if the filter is the default range
            const isDefaultRange = (filterName, defaultRange) => {
              const currentRange = appliedFilters[filterName];
              return (
                Array.isArray(currentRange) &&
                currentRange.length === 2 &&
                currentRange[0] === defaultRange[0] &&
                currentRange[1] === defaultRange[1]
              );
            };

            // Skip displaying default filters or empty filters
            if (
              filterValue === null ||
              (Array.isArray(filterValue) && filterValue.length === 0) ||
              (typeof filterValue === "object" &&
                !Object.values(filterValue).some((val) => val)) ||
              (filter === "want" && isDefaultRange("want", defaultval.want)) ||
              (filter === "doyou" &&
                isDefaultRange("doyou", defaultval.doyou)) ||
              (filter === "cul" && isDefaultRange("cul", defaultval.cul))
            ) {
              return null;
            }

            let displayValue = "";

            if (Array.isArray(filterValue)) {
              if (filterValue.length === 2) {
                displayValue = `${filterValue[0]}${
                  filter === "time" ? ":00" : ""
                } - ${filterValue[1]}${
                  filter === "time"
                    ? ":00"
                    : filter === "cul"
                    ? " years"
                    : " hours"
                }`;
              } else {
                displayValue = filterValue.join(", ");
              }
            } else if (typeof filterValue === "object") {
              displayValue = Object.keys(filterValue)
                .filter((key) => filterValue[key])
                .join(", ");
            } else if (filter === "startTime" || filter === "dob") {
              const date = new Date(filterValue);
              const formattedDate = `${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}/${date
                .getDate()
                .toString()
                .padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;
              displayValue = formattedDate;
            } else {
              displayValue = filterValue ? "Yes" : "No";
            }

            return (
              <div css={appliedFilterStyle} key={index}>
                {QUESTIONS[filter]}
                <span
                  style={{
                    color: "#8492AD",
                    fontWeight: "500",
                    marginLeft: "8px",
                    height: "25px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {displayValue}
                </span>
                {/* <Close
                  onClick={() =>
                    setAppliedFilters((prev) => ({
                      ...prev,
                      [filter]: null,
                    }))
                  }
                  style={{
                    marginLeft: "8px",
                    cursor: "pointer",
                    opacity: "0.3",
                  }}
                /> */}
              </div>
            );
          })}
      </div>

      {loading ? (
        <LoadingIndicator message={"Loading data"} />
      ) : (
        <TableGrid
          topContent={
            <>
              <Divider
                height={1}
                color={DIV_GRAY + "CC"}
                style={{ marginTop: 20 }}
              />
            </>
          }
          rows={filteredData}
          columns={columns(handleViewDetails) as any}
          disableRowSelectionOnClick={true}
          additionalSlots={{
            noRowsOverlay: () => (
              <div
                className={"flexRow"}
                style={{
                  width: "100%",
                  height: "100%",
                  paddingTop: "5%",
                  alignItems: "flex-start",
                }}
              >
                <p
                  style={{
                    color: FADE_GRAY,
                    textAlign: "center",
                    fontFamily: "Raleway",
                    fontSize: 16,
                    fontWeight: 500,
                    lineHeight: "normal",
                  }}
                >
                  {"No one found with search: "}
                  <span style={{ fontWeight: 600 }}>{searchKey}</span>
                </p>
              </div>
            ),
          }}
          getRowId={(res: ISheetData) => res.submissionId}
        />
      )}
      {ViewDetailsModal(selectedRow, modalIsOpen, closeModal)}
    </div>
  );
}
