import { css } from "@emotion/react";
import { StyleSheet } from "@react-pdf/renderer";
import { FADE_GRAY } from "@thedashboardai/dashboard-components";
import styled from "@emotion/styled";

export const styles = StyleSheet.create({
    headerText: {
        margin: 0,
        color: FADE_GRAY,
        fontFamily: "Raleway",
        fontSize: 24,
        fontWeight: 600,
        lineHeight: "normal",
    },
    headerFields: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 30,
    },
    headerButton: {
        height: 36,
        padding: "10px 12px 10px 12px",
        alignItems: "center",
        gap: 8,
        width: "auto",
        borderRadius: 4,
    },
    headerFieldsText: {
        fontFamily: "Raleway",
        fontWeight: 500,
        fontSize: 16,
        lineHeight: "normal",
        margin: 0,
    },
    emptyDiv: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "85%",
    },
    emptyText: {
        color: FADE_GRAY,
        fontFamily: "Raleway",
        textAlign: "center",
        lineHeight: "normal",
        fontSize: 20,
        fontWeight: 600,
    },
    buttonText: {
        borderRadius: 4,
        padding: "8px 16px",
        height: "36px",
        fontSize: 14,
    },
    page: {
        flexDirection: "column",
        backgroundColor: "white",
        justifyContent: "flex-start",
    },
    section: {
        margin: 10,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    fieldText: {
        fontSize: 20,
        fontWeight: 500,
        margin: 0,
    },
    answerText: {
        fontSize: 16,
        fontWeight: 400,
        margin: 0,
        textDecoration: "underline",
    },
});

export const QuestionnaireTitle = styled.div`
    color: var(--Neutrals-Color-Neutral-7, #0a0a0a);
    font-variant-numeric: lining-nums proportional-nums;
    /* Headings/Semibold/H7 */
    font-family: Raleway;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px; /* 137.5% */
`;

export const Reset = styled.div`
    color: #44a8ff;
    text-align: center;
    font-family: Raleway;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
    cursor: pointer;
`;

export const OuterContainer = styled.div`
    position: absolute;
    z-index: 5;
    top: 60px;
    left: 50%;
    border-radius: 8px;
    border: 1px solid #edeff3;
    background: #fff;
    box-shadow: 0px 11px 28px 0px rgba(0, 0, 0, 0.05);
`;

export const Container = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const Label = styled.label`
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    margin-right: 14px;
`;

export const Checkbox = styled.input`
    appearance: none;
    background-color: #fff;
    border: 2px solid #d1d1d1;
    border-radius: 3px;
    width: 20px;
    height: 20px;
    display: inline-block;
    position: relative;
    cursor: pointer;
    outline: none;

    &:checked {
        border-color: #2196f3;
        background-color: #2196f3;
    }

    &:checked::after {
        content: "";
        position: absolute;
        top: 4px;
        left: 10px;
        width: 5px;
        height: 10px;
        border: solid #fff;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }
`;

export const Question = styled.div`
    color: #0a0a0a;
    font-family: Raleway;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

export const ApplyFilters = styled.div`
    padding: 8px 16px;
    border-radius: 6px;
    background: #44a8ff;
    text-align: center;
    color: #ffffff;
    font-family: Raleway;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    cursor: pointer;
`;

export const SliderStyle = styled.div`
    .rc-slider {
        .rc-slider-rail {
            background-color: #edeff3;
            height: 6px;
        }
        .rc-slider-track {
            background-color: #44a8ff;
            height: 6px;
        }
        .rc-slider-handle {
            background: #44a8ff;
            border: 1px solid #fff;
            fill: #44a8ff;
            stroke-width: 2px;
            stroke: #fff;
            filter: drop-shadow(0px 2px 4px rgba(38, 63, 86, 0.15));
            box-shadow: none;
            opacity: 1;
            margin: -4.4px 0 0 0;
        }
    }
`;

export const Ranges = styled.div`
    color: #44a8ff;
    text-align: center;
    font-family: Raleway;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
`;

export const exportButtonStyle = css`
    background-color: #2196f3;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-family: Raleway, sans-serif;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #1976d2;
    }

    &:focus {
        outline: none;
    }
`;

export const filterContainerStyle = css`
    position: relative;
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 20px;
`;

export const filterDropdownStyle = css`
    background-color: white;
    border-radius: 4px;
    padding: 8px;
    font-family: Raleway, sans-serif;
    font-size: 14px;
    min-width: 150px;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: #2196f3;
    }
`;

export const questionnaireStyle = css`
    display: flex;
    padding: 9px 12px;
    align-items: center;
    margin: 8px;
    gap: 6px;
    border-radius: 4px;
    border: 1px solid hsl(0, 0%, 80%);
    cursor: pointer;
`;

export const appliedFiltersBarStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    align-items: center;
`;

export const appliedFilterStyle = css`
    background-color: #ecf6ff;
    color: #0a0a0a;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 10px;
    border-radius: 4px;
    display: flex;
    align-items: center;
`;

export const Containers = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
`;

export const DateLabel = styled.label`
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
`;

export const InputContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`;

export const Input = styled.input`
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    font-size: 14px;
`;

export const Icon = styled.span`
    position: absolute;
    right: 10px;
    cursor: pointer;
`;

export const StyledDatePicker = styled.div`
    input {
        cursor: pointer;
        border-radius: 8px;
        border: 1px solid #c2c8d6;
        background: #fff;
    }

    .calendar-icon {
        position: absolute;
        top: 48%;
        right: -10px;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        pointer-events: none;
    }
`;
