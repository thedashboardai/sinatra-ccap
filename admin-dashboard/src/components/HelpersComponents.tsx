import Slider from "rc-slider";
import React, { forwardRef, useEffect, useState } from "react";
import {
    Checkbox,
    Question,
    Ranges,
    SliderStyle,
    Container,
    Label,
    StyledDatePicker,
} from "../pages/HomeStyles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "iconsax-react";

// Component for handling Yes/No questions
export const DoubleChoiceQuestion = (props) => {
    const question = props.question;
    return (
        <div>
            <Question style={{ marginBottom: 16 }}>{question}</Question>
            <Container>
                <Label>
                    <Checkbox
                        type="checkbox"
                        value="yes"
                        checked={props.selectedOption}
                        onChange={() => props.setSelectedOption(true)}
                    />
                    <Question style={{ display: "inline-block", fontWeight: 500 }}>
                        Yes
                    </Question>
                </Label>
                <Label>
                    <Checkbox
                        type="checkbox"
                        value="no"
                        checked={!props.selectedOption}
                        onChange={() => props.setSelectedOption(false)}
                    />
                    <Question style={{ display: "inline-block", fontWeight: 500 }}>
                        No
                    </Question>
                </Label>
            </Container>
        </div>
    );
};

export const MultipleChoiceQuestion = ({ question, setOptions, options }) => {
    return (
        <div>
            <Question style={{ marginBottom: 16 }}>{question}</Question>
            <div style={{ maxHeight: "120px", overflow: "scroll" }}>
                {Object.keys(options).map((i) => (
                    <Label>
                        <Checkbox
                            type="checkbox"
                            value="yes"
                            checked={options[i]}
                            onChange={() =>
                                setOptions({ ...options, [i]: !options[i] })
                            }
                        />
                        <Question
                            style={{ display: "inline-block", fontWeight: 500 }}
                        >
                            {i}
                        </Question>
                    </Label>
                ))}
            </div>
        </div>
    );
};

// Component for handling time range sliders
export const TimeSlider = ({ question, range, setRange, suffix }) => {
    const [initialRange, setInitialRange] = useState([]);

    useEffect(() => {
        setInitialRange([range[0], range[1]]);
    }, []);
    
    const min = initialRange[0];
    const max = initialRange[1];

    const convertToAmPm = (hour) =>
        `${hour % 12 || 12}${hour < 12 ? "am" : "pm"}`;

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    gap: 20,
                    marginBottom: "15px",
                    justifyContent: "space-between",
                }}
            >
                <Question style={{ maxWidth: "170px" }}>{question}</Question>
                <Ranges>
                    {range[0]}
                    {suffix[0] + " - "}
                    {suffix[1] === "pm" ? convertToAmPm(range[1]) : range[1]}
                    {suffix[1] === "pm" ? "" : suffix[1]}
                </Ranges>
            </div>
            <SliderStyle>
                <Slider
                    range
                    min={min}
                    max={max}
                    step={1}
                    value={range}
                    onChange={(e) => {
                        setRange(e);
                    }}
                    track
                />
            </SliderStyle>
        </div>
    );
};

// Component for handling date inputs
export const DateInput = ({ question, date, setDate }) => {
    function formatDateString(dateString) {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = String(date.getFullYear()).slice(-2);

        return `${month}/${day}/${year}`;
    }

    interface CustomInputProps {
        value?: string;
        onClick?: () => void;
    }

    const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
        ({ value, onClick }, ref) => (
            <StyledDatePicker>
                <input
                    onClick={onClick}
                    ref={ref}
                    value={value}
                    readOnly
                    placeholder="MM/DD/YY"
                />
                <Calendar className={"calendar-icon"} />
            </StyledDatePicker>
        )
    );

    return (
        <div style={{ position: "relative" }}>
            <Question style={{ marginBottom: 12 }}>{question}</Question>

            <DatePicker
                onSelect={(e) => {
                    setDate(formatDateString(e));
                }}
                dateFormat="MM/dd/yyyy"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                selected={date}
                value={date}
                todayButton="Today"
                customInput={<CustomInput />}
            />
        </div>
    );
};
