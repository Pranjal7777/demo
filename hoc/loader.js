import React from "react";
import dynamic from "next/dynamic";
import { handleLoader } from "../lib/rxSubject";
import { PRIMARY_COLOR } from "../lib/color";
const ClipLoader = dynamic(() => import("react-spinners/ClipLoader"));

class LoaderHoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  
  componentDidMount() {
    this.rxLoaderhandler = handleLoader.subscribe((flag) => {
      this.setState({
        loading: flag,
      });
    });
  }
  componentWillUnmount() {
    this.rxLoaderhandler && this.rxLoaderhandler.unsubscribe();
  }

  render() {
    return (
      <div>
        {" "}
        {this.state.loading && (
          <div className="loader">
            <div className="sweet-loading">
              <ClipLoader
                css={`
                display: block;
                margin: 0 auto;
                border-width: 5px;
              `}
                sizeUnit={"px"}
                size={50}
                color={this.props.color || PRIMARY_COLOR}
                loading={this.state.loading}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default LoaderHoc;
