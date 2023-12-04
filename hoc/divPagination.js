import React, { Component } from "react";

class Pagination extends Component {
  state = {
    scrolling: false,
    page: this.props.page || 0,
  };
  async componentDidMount() {
    // await guestLoginMethod();
    // this.getPostData();
    this.setState({ refreshPage: this.props.refreshPage });
    let element = document.getElementById(this.props.id) || (this.props.elementRef && this.props.elementRef.current);
    // console.log("Asdasd", element);
    element && element.addEventListener("scroll", this.handleScroll);
  }
  detectBottomTouch = (bottomDifferenceInPixel = 0) => {
    // returns true or false, based on scroll position, pass bottom pixel difference as argument if required

    let element = document.getElementById(this.props.id) || (this.props.elementRef && this.props.elementRef.current);
    element && element.addEventListener("scroll", this.handleScroll);
    // console.log(
    //   "dasdadd",
    //   element.scrollHeight - element.scrollTop - bottomDifferenceInPixel,
    //   element.clientHeight
    // );
    return (
      element.scrollHeight - element.scrollTop - bottomDifferenceInPixel <=
      element.clientHeight
    );
  };

  handleScroll = (event) => {
    if (
      this.detectBottomTouch(this.props.detectBottomTouch || 300) &&
      !this.state.scrolling &&
      this.props.items &&
      this.props.items.length > 0 &&
      this.props.items.length != this.props.totalRecord
    ) {
      this.loadMoreData(true);
    }
  };

  loadMoreData = () => {
    let page = parseInt(this.state.page) + 1;
    this.setState(
      {
        page: page,
        scrolling: true,
      },
      async () => {
        try {
          await this.props.getItems(page, true);
          this.setState({
            scrolling: false,
          });
        } catch (e) {
          this.setState({
            scrolling: true,
          });
        }
      }
    );
    6;
  };

  componentWillUnmount() {
    let element = document.getElementById(this.props.id);
    element && element.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}

export default Pagination;
