// eslint-disable-next-line no-unused-vars
import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// eslint-disable-next-line no-unused-vars
import Index from "../../pages/index";

configure({ adapter: new Adapter() });

const wrapper = shallow(<Index />);

// eslint-disable-next-line no-undef
it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.unmountComponentAtNode(div);
});

// eslint-disable-next-line no-undef
it("renders component with main one '<div>' tag", () => {
  const Component = wrapper.find('[className="App"]');
  // eslint-disable-next-line no-undef
  expect(Component.length).toBe(1);
});
