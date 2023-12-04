import React, { Component } from "react";

class Pagination extends Component {
  state = {
    scrolling: false,
    page: 1,
  };
  async componentDidMount() {
    // await guestLoginMethod();
    // this.getItems();

    window.addEventListener("scroll", this.handleScroll);
  }
  detectBottomTouch = (bottomDifferenceInPixel = 0) => {
    // returns true or false, based on scroll position, pass bottom pixel difference as argument if required
    return (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - bottomDifferenceInPixel
    );
  };

  handleScroll = (event) => {
    // console.log("asdasd", this.detectBottomTouch(400));
    if (
      this.detectBottomTouch(400) &&
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
    // console.log("pagination-props", page);
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
  };
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    // console.log("innerHight ",window.innerHeight);
  }
  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}

export default Pagination;
