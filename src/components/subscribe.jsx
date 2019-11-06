import React, { Component } from "react";
import { withFirebase } from "./firebase";
import SimpleReactValidator from "simple-react-validator";
import ErrorMessage from "./errormessage";
import { Grow, Slide } from "@material-ui/core";

class Subscribe extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      element: message => (
        <div className="row">
          <div
            className="alert alert-danger alert-dismissible mx-auto"
            role="alert"
          >
            <h5 className="h5">{message}</h5>
          </div>
          {/* <div className="col-sm-7 mb-sm-3 mx-auto text-center h3">
            <span>{message}</span>
          </div> */}
        </div>
      )
    });
    this.state = {
      email: "",
      error: "",
      isSubmitted: false
    };
  }

  getTime = () => {
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + " " + time;
    return dateTime;
  };

  resetError = () => {
    this.setState({ error: "" });
  };

  submitted = () => {
    this.setState({ isSubmitted: true });
  };
  handleSubmit = event => {
    event.preventDefault();
    console.log(this.state);

    if (this.validator.allValid()) {
      const { email } = this.state;
      const firebase = this.props.firebase;
      firebase
        .email_pUserRef()
        .push()
        .set({ email, date: this.getTime() })
        // .email_pUser(email)
        // .set({ email })
        .catch(error => {
          this.setState({ error });
        });
      this.submitted();
    } else {
      this.setState({ error: this.validator.getErrorMessages().email });

      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      //this.forceUpdate();
    }
  };

  handleEmail = event => {
    event.preventDefault();
    this.setState({ email: event.target.value });
  };

  render() {
    const { error, isOpen, isSubmitted } = this.state;
    const actions = [{ text: "Close", onClick: this.close }];
    const intrance = true;
    return (
      <React.Fragment>
        <div id="subscribe" className="row mb-sm-3 mt-sm-5 mb-2">
          <div className="col-sm-9 mb-3 mx-auto text-center">
            {isSubmitted === false ? (
              <React.Fragment>
                <Grow in={intrance} timeout={1200} mountOnEnter>
                  <h4 className="h4 color-primary">
                    Tertarik untuk bercerita?
                  </h4>
                </Grow>
                <Grow in={intrance} timeout={1700} mountOnEnter>
                  <form
                    className="form-newsletter halves"
                    onSubmit={this.handleSubmit}
                  >
                    <input
                      type="text"
                      name="email"
                      onChange={this.handleEmail}
                      className="mb0"
                      placeholder="Tulis alamat email"
                    />

                    <button type="submit" className="mb0 btn">
                      Kabari aku!
                    </button>
                  </form>
                </Grow>
              </React.Fragment>
            ) : (
              <div
                className="alert alert-success alert-dismissible"
                role="alert"
              >
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="h4">
                  <i className="ti ti-check"></i>
                  &nbsp;Terima kasih, tunggu kabar dari kita yaa
                </h4>
              </div>
            )}
          </div>
        </div>
        {this.validator.message(
          "email",
          this.state.email,
          "required|email",
          this.validator.element
        )}
        {/* <div className="srv-validation-message">
          {this.validator.getErrorMessages}
        </div> */}
        {/* {this.validator.getErrorMessages && (
          <div className="row">
            <div className="col-sm-7 mb-sm-3 mx-auto text-center">
              <ErrorMessage message={error} />
            </div>
          </div>
        )} */}
      </React.Fragment>
    );
  }
}

export default withFirebase(Subscribe);
