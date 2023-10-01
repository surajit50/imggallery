const page = () => {
  return (
    <div className="auth_container">
      <h1>Login Page</h1>
      <form action="">
        <div>
          <label htmlFor="email">Your Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <div>
          <label htmlFor="pass">Your Password</label>
          <input type="password" name="pass" id="pass" />
        </div>
      </form>
    </div>
  );
};

export default page;
