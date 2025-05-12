import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:5206/api/User/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // تأكد إنك بتستلم الكائن الصحيح من السيرفر
      const userData = data.token;

      if (!userData.isApproved) {
        setMessage("You are not approved yet");
        return;
      }

      login(userData); // خزن بيانات المستخدم والتوكن في الكونتكست

      // التوجيه حسب الدور
      switch (userData.role.toLowerCase()) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "artist":
          navigate("/artist/dashboard");
          break;
        case "buyer":
          navigate("/");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-center mb-4">Login</h2>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}
            {message && (
              <Alert variant="warning" className="mb-4">
                {message}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" size="lg">
                  Login
                </Button>
              </div>

              <div className="text-center mt-3">
                <p className="mb-0">
                  {`                  Don't have an account?
`}{" "}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => navigate("/register")}
                  >
                    Register here
                  </Button>
                </p>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
