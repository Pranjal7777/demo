import React, { Component } from "react";
import Select from "react-select";

class FilterBox extends Component {
  state = {};
  render() {
    const styles = {
      menu: (base) => ({
        ...base,
        marginTop: 0,
        width: "100%",
        // width: `${this.props.mySubs ? "85%" : "100%"}`,
        right: "0",
        backgroundColor: "var(--l_app_bg)",
        color: "var(--l_app_text)",
        borderRadius: "12px",
        border: "1.5px solid var(--l_border)",
      }),
      singleValue: (provided, state) => ({
        ...provided,
        fontWeight: 500,
        color: this.props.apptheme.appColor,
        fontSize: "1.100vw",
      }),
      option: (provided, state) => ({
        ...provided,
        width: "100%",
        fontSize: "1.100vw",
        padding: "8px",
        backgroundColor: `transparent`,
        fontFamily: "Roboto, sans-serif !important",
        color:"var(--l_app_text)",
        cursor: "pointer",
        opacity: state.isFocused ? 0.7 : 1,
        textAlign: "left",
        fontWeight: 400,
        borderBottom: state.options.indexOf(state.data) === this.props.options.length - 1 ? "none" : "1.5px solid var(--l_border)",
      }),
      indicatorSeparator: (base) => ({
        ...base,
        backgroundColor: "transparent",
        padding: "0",
      }),
      placeholder: (provided, state) => ({
        ...provided,
        fontSize: "1.171vw",
      }),
      control: (base, state) => ({
        ...base,
        borderRadius: "0px",
        fontSize: "1.171vw",
        width: "100%",
        color: this.props.apptheme.appColor,
        padding: "0px !important",
        border: "none",
        backgroundColor: "transparent",
        cursor: "pointer",
        "&:hover": {
          borderColor: this.props.apptheme.appColor,
        },
        // This line disable the blue border
        boxShadow: state.isFocused ? 0 : 0,
      }),
      valueContainer: (provided) => ({
        ...provided,
        padding: "0",
        justifyContent: "flex-end",
      }),
      indicatorContainer: (provided) => ({
        ...provided,
        padding: "0 !important",
      }),
    };

    const { apptheme } = this.props;
    return (
      <div className="remove-left-border insignt-filter filterbarBox w-100">
        <div className="cursorPtr">
          <Select
            isSearchable={false}
            options={this.props.options}
            onChange={this.props.filterSelect}
            styles={styles}
            value={this.props.value}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: apptheme.appColor,
              },
            })}
            {...this.props}
          />
        </div>
        <style jsx>{`
          :global(.insignt-filter svg) {
            fill: ${this.props.apptheme.appColor} !important;
          }
          .filter-select {
            font-size: 0.8rem;
            color: black;
            border: none;
            text-align: left;
          }
          .filter-select-input {
            // border-radius: 10px !impoetant;
          }
          .remove-left-border {
            border: none !important;
          }
        `}</style>
      </div>
    );
  }
}

export default FilterBox;
