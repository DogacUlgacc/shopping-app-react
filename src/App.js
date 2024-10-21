import "./App.css";
import Customer from "./Components/Customer";
import Product from "./Components/Product";
import Cart from "./Components/Cart";
function App() {
  return (
    <div className="App">
      <h1>React app</h1>
      <Customer />
      <Product />
      <Cart />
    </div>
  );
}

export default App;
