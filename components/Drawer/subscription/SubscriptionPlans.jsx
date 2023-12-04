import Header from "../../header/header"
import useLang from "../../../hooks/language"
import { open_drawer } from "../../../lib/global";
import isMobile from "../../../hooks/isMobile";
import { useTheme } from "react-jss";

const SubscriptionPlans = (props) => {
  const [lang] = useLang();
  const theme = useTheme();

  // console.log("props", props)

  const clickHandler = (plan) => {
    open_drawer(
      "SubscriptionPlanSettings",
      {
        plan,
        updateScreen: false,
        sharePercent: props.sharePercent
      },
      "right"
    );
  }

  return (
    <div className="card_bg h-100 ">
      <Header title={lang.subsPlans} Data={lang.subsPlans} back={props.onClose} />
      <div style={{ marginTop: "65px" }} className="h-100 mx-3 overflowY-auto">
        <h6 className="mb-0 py-2 text-app">
          {lang.pleaseSelect}
        </h6>

        {props?.plans?.map((plan) => {
          return (
            <div
              className="radius_8 px-3 pt-2 pb-3 mb-2"
              style={{ backgroundColor: theme.dialogSectionBg }}
              onClick={() => clickHandler(plan)}
            >
              <div className="light_app_text">Plan Name</div>
              <div>{plan.subscriptionTitle} Subscription</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SubscriptionPlans;
