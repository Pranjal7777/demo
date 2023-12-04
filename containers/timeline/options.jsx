import useLang from "../../hooks/language";
import { authenticate } from "../../lib/global/routeAuth";

export default function FeaturedOptions(props) {
  const [lang] = useLang();
  return (
    <ul
      className="nav nav-pills categoriesUL mb-2"
    >
      <li
        className="nav-item"
        onClick={props.handleTabChange.bind(this, "POPULAR")}
      >
        <a className="nav-link active pr-4" data-toggle="pill" href="#Popular">
          {lang.trending}
        </a>
      </li>
      <li
        className="nav-item"
        // onClick={props.handleTabChange.bind(this, "LATEST")}
        onClick={() => {
          authenticate().then(() => {
            props.handleTabChange("LATEST");
          });
        }}
      >
        <a className="nav-link" data-toggle="pill" href="#Latest">
          {lang.following}
        </a>
      </li>
      {/* <li
        className="nav-item"
        // onClick={props.handleTabChange.bind(this, "LATEST")}
        onClick={() => {
          authenticate().then(() => {
            props.handleTabChange("LATEST");
          });
        }}
      >
        <a className="nav-link" data-toggle="pill" href="#Latest">
          Flicks
        </a>
      </li> */}
    </ul>
  );
}
