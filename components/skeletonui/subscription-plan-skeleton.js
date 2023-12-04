import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";

export const SubscriptionPlanBenefitSkeleton = () => {
  return (
    <React.Fragment>
      <ul className={"nav col-12 row p-0 m-0"}>
        <li
          className={"nav-item mb-2 col-md-6 d-flex"}
          style={{ height: "fit-content" }}
        >
          <Skeleton
            style={{
              backgroundColor: "#28364f",
              backgroundImage:
                "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
            }}
            variant="circle"
            width={15}
            height={15}
          />
          <Skeleton
            style={{
              backgroundColor: "#28364f",
              backgroundImage:
                "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
                marginLeft:'5px'
            }}
            variant="text"
            width={'80%'}
            
          />
        </li>
        <li
          className={"nav-item mb-2 col-md-6 d-flex"}
          style={{ height: "fit-content" }}
        >
          <Skeleton
            style={{
              backgroundColor: "#28364f",
              backgroundImage:
                "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
            }}
            variant="circle"
            width={15}
            height={15}
          />
          <Skeleton
            style={{
              backgroundColor: "#28364f",
              backgroundImage:
                "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
                marginLeft:'5px'
            }}
            variant="text"
            width={'80%'}
          />
        </li>
        <li
          className={"nav-item mb-2 col-md-6 d-flex"}
          style={{ height: "fit-content" }}
        >
          <Skeleton
            style={{
              backgroundColor: "#28364f",
              backgroundImage:
                "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
            }}
            variant="circle"
            width={15}
            height={15}
          />
          <Skeleton
            style={{
              backgroundColor: "#28364f",
              backgroundImage:
                "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
                marginLeft:'5px'
            }}
            variant="text"
            width={'80%'}
          />
        </li>
        <li
          className={"nav-item mb-2 col-md-6 d-flex"}
          style={{ height: "fit-content" }}
        >
          <Skeleton
            style={{
              backgroundColor: "#28364f",
              backgroundImage:
                "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
            }}
            variant="circle"
            width={15}
            height={15}
          />
          <Skeleton
            style={{
              backgroundColor: "#28364f",
              backgroundImage:
                "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
                marginLeft:'5px'
            }}
            variant="text"
            width={'80%'}
          />
        </li>
      </ul>
    </React.Fragment>
  );
};

export const SubscriptionPlanSkeleton = (props) => {
  return (
    <React.Fragment>
      <div className={"col-lg-5 mx-1"} style={{ marginBottom: "20px" }}>
        <Skeleton
          style={{
            borderRadius: "14px",
            backgroundColor: "#28364f",
            backgroundImage: "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
          }}
          variant="rect"
          height={70}
        />
      </div>
      <div className={"col-lg-5 mx-1"} style={{ marginBottom: "20px" }}>
        <Skeleton
          style={{
            borderRadius: "14px",
            backgroundColor: "#28364f",
            backgroundImage: "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
          }}
          variant="rect"
          height={70}
        />
      </div>
      <div className={"col-lg-5 mx-1"} style={{ marginBottom: "20px" }}>
        <Skeleton
          style={{
            borderRadius: "14px",
            backgroundColor: "#28364f",
            backgroundImage: "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
          }}
          variant="rect"
          height={70}
        />
      </div>
      <div className={"col-lg-5 mx-1"} style={{ marginBottom: "20px" }}>
        <Skeleton
          style={{
            borderRadius: "14px",
            backgroundColor: "#28364f",
            backgroundImage: "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
          }}
          variant="rect"
          height={70}
        />
      </div>
      <div className={"col-lg-5 mx-1"} style={{ marginBottom: "20px" }}>
        <Skeleton
          style={{
            borderRadius: "14px",
            backgroundColor: "#28364f",
            backgroundImage: "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
          }}
          variant="rect"
          height={70}
        />
      </div>
      <div className={"col-lg-5 mx-1"} style={{ marginBottom: "20px" }}>
        <Skeleton
          style={{
            borderRadius: "14px",
            backgroundColor: "#28364f",
            backgroundImage: "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
          }}
          variant="rect"
          height={70}
        />
      </div>
    </React.Fragment>
  );
};
