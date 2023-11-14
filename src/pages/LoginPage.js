export default function LoginPage(){
  return(
    <div className="loginForm">
     <form action="http://localhost:5000/login" method="POST">
       <div className="input-container">
         <label>Username </label>
         <input type="text" name="userName" required />
       </div>
       <div className="input-container">
         <label>Password </label>
         <input type="password" name="password" required />
       </div>
       <div className="button-container">
         <input type="submit" />
       </div>
     </form>
   </div>
  )
}