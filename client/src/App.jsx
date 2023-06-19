import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

const App = () => {
  const code = new URLSearchParams(window.location.search).get("code");

  return (
    <div className="App">{code ? <Dashboard code={code} /> : <Login />}</div>
  );
};

export default App;
