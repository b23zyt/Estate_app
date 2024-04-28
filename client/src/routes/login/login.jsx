import React, { useContext, useState } from "react";
import "./login.scss";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const[error, setError] = useState("");
  const[isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async(evt)=> {
    evt.preventDefault();
    setIsLoading(true);
    setError(""); //REMOVE ERROR  

    //formData 是 JavaScript 中的一个内置对象，用于创建表单数据对象，以便在 fetch 请求或其他情况下发送到服务器。
    //语句创建了一个 FormData 对象，并将表单元素 evt.target 中的数据添加到该对象中
    const formData = new FormData(evt.target);

    // 获取了用户名、电子邮件和密码
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    
    console.log(username, email, password);

    try {
      const res = await apiRequest.post("/auth/login",{
        username, 
        password,
      });
      console.log(res);
      // localStorage.setItem("user", JSON.stringify(res.data));
      updateUser(res.data);

      navigate("/");
    } catch (err) {
      setError(err.response.data.message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" required minLength={3} maxLength={20}  type="text" placeholder="Username" />
          <input name="password" type="password" required placeholder="Password" />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
