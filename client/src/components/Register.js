import React, { useState } from "react";
import {
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Typography, Divider } from "antd";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import getBaseURL from "../utils/config";
import useHandleLogin from "../hooks/useHandleLogin";
import { useUserContext } from "./UserContext";
import CryptoJS from "crypto-js";

const { Title, Text } = Typography;

const Register = () => {
  const baseURL = getBaseURL();
  const [registerForm] = Form.useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
  const [otpStep, setOtpStep] = useState("send"); // "send" or "verify"
  const [cooldown, setCooldown] = useState(0);
  const { from } = { from: { pathname: "/" } };
  const { handleGoogleLogin } = useHandleLogin({ from });
  const { setAuth } = useUserContext();

  const startCooldown = () => {
    let time = 60;
    setCooldown(time);

    const interval = setInterval(() => {
      time -= 1;
      setCooldown(time);
      if (time === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const onRegister = async (values) => {
    try {
      const encryptedPassword = CryptoJS.SHA256(values.password).toString(
        CryptoJS.enc.Hex
      );
      const registrationData = {
        ...values,
        password: encryptedPassword,
      };
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const parseRes = await response.json();
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        toast.success("Register successfully");
      } else {
        setAuth(false);
        toast.error(parseRes.message);
      }
    } catch (error) {
      setAuth(false);
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const errorMessage = (error) => {
    console.error(error);
  };

  // Handler to track phone number validation status
  const onFormValuesChange = (changedValues) => {
    if (changedValues.email) {
      const email = changedValues.email;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setIsEmailValid(emailValid);

      // Reset duplicate email state on input change
      setIsEmailDuplicate(false);
    }
  };

  const handleSendOrVerifyOTP = async () => {
    if (cooldown > 0) {
      toast.error(`Please wait ${cooldown} seconds before trying again.`);
      return;
    }

    if (otpStep === "send") {
      // Handle sending OTP
      if (!isEmailValid) {
        toast.error("Please enter a valid email before requesting OTP.");
        return;
      }

      setIsSendingOTP(true);
      try {
        const email = registerForm.getFieldValue("email");

        // Check email availability
        const checkEmailResponse = await fetch(`${baseURL}/auth/check-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const checkEmailData = await checkEmailResponse.json();

        // Handle case where the email is already registered
        if (!checkEmailResponse.ok || !checkEmailData.available) {
          setIsEmailDuplicate(true);
          setIsSendingOTP(false); // Stop sending OTP when email is already taken
          toast.error(
            checkEmailData.message || "This email is already registered."
          );
          return; // Early return to stop OTP sending
        } else {
          setIsEmailDuplicate(false);
        }

        // Start cooldown after email is valid and available
        startCooldown();

        // Send email OTP
        const sendOTPResponse = await fetch(`${baseURL}/auth/send-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const parseRes = await sendOTPResponse.json();
        if (sendOTPResponse.ok) {
          setOtpSent(true);
          setOtpStep("verify");
          toast.success(parseRes.message || "OTP sent successfully");
        } else {
          throw new Error(
            parseRes.message || "Failed to send OTP. Please try again."
          );
        }
      } catch (error) {
        console.error("Failed to send OTP. Please try again.");
        toast.error("Failed to send OTP. Please try again.");
        setOtpSent(false);
      } finally {
        setIsSendingOTP(false);
      }
    } else if (otpStep === "verify") {
      // Handle verifying OTP
      try {
        const email = registerForm.getFieldValue("email");
        const otp = registerForm.getFieldValue("otp");

        const verifyOTPResponse = await fetch(`${baseURL}/auth/verify-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        });

        const parseRes = await verifyOTPResponse.json();
        if (verifyOTPResponse.ok) {
          toast.success(parseRes.message || "OTP verified successfully");
          setOtpSent("verified");
        } else {
          throw new Error(
            parseRes.message || "Failed to verify OTP. Please try again."
          );
        }
      } catch (error) {
        console.error("Failed to verify OTP. Please try again.");
        toast.error("Failed to verify OTP. Please try again.");
        setOtpSent(false);
      }
    }
  };

  return (
    <section
      style={{
        padding: "0 140px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          padding: "30px 40px",
          borderRadius: "10px",
          maxWidth: "600px",
          margin: "50px auto",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <Title level={3} style={{ textAlign: "center" }}>
          Register
        </Title>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={errorMessage}
          theme="outline"
          width="290"
        />

        <Divider>OR</Divider>
        <Form
          name="register"
          form={registerForm}
          className="register-form"
          style={{
            maxWidth: "300px",
          }}
          onFinish={onRegister}
          onValuesChange={onFormValuesChange}
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Name"
              size={"large"}
            />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
              {
                pattern: /^[689]\d{7}$/,
                message: "Phone number is in an invalid format!",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="site-form-item-icon" />}
              placeholder="Phone Number"
              size={"large"}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
            help={isEmailDuplicate && "This email is already registered."}
            validateStatus={isEmailDuplicate ? "error" : ""}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              type={"email"}
              placeholder="Email"
              size={"large"}
              required
            />
          </Form.Item>

          <Form.Item
            name="otp"
            rules={[
              {
                required: otpStep !== "send",
                message: "Please enter the OTP!",
              },
            ]}
          >
            <Input.Group compact>
              <Input
                style={{ width: "65%" }}
                placeholder="Enter the OTP"
                disabled={!otpSent || otpStep === "send"}
              />
              <Button
                type="primary"
                onClick={handleSendOrVerifyOTP}
                disabled={
                  !isEmailValid ||
                  isEmailDuplicate ||
                  cooldown > 0 ||
                  isSendingOTP
                }
                loading={isSendingOTP}
                style={{ width: "35%" }}
              >
                {isSendingOTP
                  ? "Sending OTP..."
                  : cooldown > 0
                  ? `Resend OTP in ${cooldown}s`
                  : otpStep === "send"
                  ? "Send OTP"
                  : "Verify OTP"}
              </Button>
            </Input.Group>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type={"password"}
              placeholder="Password"
              size={"large"}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              required
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ width: "100%" }}
            >
              Register
            </Button>
            <div
              style={{
                textAlign: "center",
              }}
            >
              <Text>Already have an account? </Text>
              <Link to="/login">Login</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default Register;
