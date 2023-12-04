import LoginWithGoogle from "../../components/socialLogin/google"
import LoginWithFacebook from "../../components/socialLogin/facebook"

const LoginIcon = (props) => {
  return (
    <div className="form-row align-items-center justify-content-center mx-auto appIconsSec w-100">
      <div className="col-auto cursor-pointer">
        <LoginWithGoogle handleLogin={props.handleLogin} />
      </div>
      <div className="col-auto cursor-pointer">
        <LoginWithFacebook handleLogin={props.handleLogin} />
      </div>
    </div>
  );
};
export default LoginIcon;
